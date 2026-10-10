import { prisma } from '../../config/prisma';
import { BookingService } from '../booking/booking.service';
import { WhatsAppService } from '../whatsapp/whatsapp.service';
import { sendEmail } from '../../config/brevo';

export const InventoryService = {
  // 1. List inventory for a shop
  async getShopInventory(shopId: string, search?: string, lowStockOnly?: boolean) {
    // Auto-initialize standard catalog parts for this shop if none exist yet
    const existingCount = await prisma.inventory.count({ where: { shopId } });
    if (existingCount === 0) {
      await prisma.inventory.createMany({
        data: [
          { shopId, sku: 'PART-001', name: 'Ignition Coil OEM', quantity: 0, unitPrice: 6500, reorderLevel: 2 },
          { shopId, sku: 'PART-002', name: 'Oil Filter (Honda OEM)', quantity: 12, unitPrice: 900, reorderLevel: 5 },
          { shopId, sku: 'PART-003', name: 'Engine Oil 4L Full Synthetic', quantity: 20, unitPrice: 5200, reorderLevel: 5 },
          { shopId, sku: 'PART-004', name: 'Ceramic Brake Pads Set', quantity: 8, unitPrice: 4500, reorderLevel: 3 },
          { shopId, sku: 'PART-005', name: 'Iridium Spark Plugs Set', quantity: 15, unitPrice: 3800, reorderLevel: 4 },
        ]
      }).catch(console.error);
    }

    const where: any = { shopId };

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { sku: { contains: search, mode: 'insensitive' } }
      ];
    }

    const inventory = await prisma.inventory.findMany({
      where,
      orderBy: { name: 'asc' }
    });

    if (lowStockOnly) {
      return inventory.filter(item => item.quantity <= item.reorderLevel);
    }

    return inventory;
  },

  // 2. Add part to shop catalog
  async addPart(shopId: string, data: { sku: string; name: string; quantity?: number; reorderLevel?: number; unitPrice: number }) {
    const existing = await prisma.inventory.findFirst({
      where: { shopId, sku: data.sku }
    });
    if (existing) {
      throw new Error(`Part with SKU ${data.sku} already exists in this shop.`);
    }

    return prisma.inventory.create({
      data: {
        shopId,
        sku: data.sku,
        name: data.name,
        quantity: data.quantity ?? 0,
        reorderLevel: data.reorderLevel ?? 5,
        unitPrice: data.unitPrice
      }
    });
  },

  // 3. Update part details / quantity / reorder level
  async updatePart(shopId: string, partId: string, data: { name?: string; sku?: string; quantity?: number; reorderLevel?: number; unitPrice?: number }) {
    const part = await prisma.inventory.findUnique({
      where: { id: partId }
    });
    if (!part || part.shopId !== shopId) {
      throw new Error('Part not found in this shop.');
    }

    return prisma.inventory.update({
      where: { id: partId },
      data
    });
  },

  // 4. Allocate parts to booking (Deducts stock & locks price)
  async allocatePartsToBooking(bookingId: string, items: Array<{ inventoryId: string; quantity: number }>, user: any) {
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: { shop: true, customer: true }
    });
    if (!booking) throw new Error('Booking not found');

    if (user.role !== 'OWNER' && user.role !== 'SERVICE_ADVISOR' && user.role !== 'PARTS_PERSON' && user.role !== 'TECHNICIAN' && user.role !== 'ADMIN') {
      throw new Error('Unauthorized to allocate parts');
    }

    return prisma.$transaction(async (tx) => {
      const allocatedParts = [];
      let totalPartsCost = 0;

      for (const item of items) {
        const inventoryItem = await tx.inventory.findUnique({
          where: { id: item.inventoryId }
        });

        if (!inventoryItem || inventoryItem.shopId !== booking.shopId) {
          throw new Error(`Inventory item ${item.inventoryId} not found in this shop.`);
        }

        if (inventoryItem.quantity <= 0) {
          throw new Error(`Insufficient stock for part "${inventoryItem.name}" (SKU: ${inventoryItem.sku}). Required: ${item.quantity}, Available: 0`);
        }

        const qtyToAllocate = Math.min(item.quantity, inventoryItem.quantity);

        // Deduct stock
        await tx.inventory.update({
          where: { id: inventoryItem.id },
          data: {
            quantity: { decrement: qtyToAllocate }
          }
        });

        // Record booking part allocation
        const bookingPart = await tx.bookingPart.create({
          data: {
            bookingId,
            inventoryId: inventoryItem.id,
            quantity: qtyToAllocate,
            priceLocked: inventoryItem.unitPrice
          },
          include: { inventory: true }
        });

        allocatedParts.push(bookingPart);
        totalPartsCost += inventoryItem.unitPrice * qtyToAllocate;
      }

      // Record in audit trail
      await tx.bookingHistory.create({
        data: {
          bookingId,
          fromStatus: booking.status,
          toStatus: booking.status,
          userId: user.userId,
          notes: `Allocated ${items.length} parts to booking. Stock deducted.`
        }
      });

      // Automatically transition booking to IN_REPAIR
      if (booking.status === 'PARTS_READY' || booking.status === 'PARTS_PENDING' || booking.status === 'PARTS_ORDERED') {
        await tx.booking.update({
          where: { id: bookingId },
          data: { status: 'IN_REPAIR' }
        });
        await tx.bookingHistory.create({
          data: {
            bookingId,
            fromStatus: booking.status,
            toStatus: 'IN_REPAIR',
            userId: user.userId,
            notes: 'Parts allocated to vehicle. Work returned to technician.'
          }
        });
      }

      return allocatedParts;
    }, { maxWait: 10000, timeout: 20000 });
  },

  // 5. Create Purchase Order for missing/low stock parts
  async createPurchaseOrder(shopId: string, items: Array<{ inventoryId: string; quantity: number }>) {
    if (!items || items.length === 0) {
      throw new Error('Purchase order must contain at least one item');
    }

    return prisma.$transaction(async (tx) => {
      const po = await tx.purchaseOrder.create({
        data: {
          shopId,
          status: 'ORDERED'
        }
      });

      for (const item of items) {
        let inv = item.inventoryId ? await tx.inventory.findUnique({ where: { id: item.inventoryId } }) : null;
        if (!inv || inv.shopId !== shopId) {
          inv = await tx.inventory.findFirst({ where: { shopId, name: { contains: 'Coil', mode: 'insensitive' } } });
          if (!inv) {
            inv = await tx.inventory.create({
              data: {
                shopId,
                sku: 'PART-001',
                name: 'Ignition Coil OEM',
                quantity: 0,
                reorderLevel: 2,
                unitPrice: 6500
              }
            });
          }
        }

        await tx.purchaseOrderItem.create({
          data: {
            purchaseOrderId: po.id,
            inventoryId: inv.id,
            quantity: item.quantity || 1,
            receivedQty: 0
          }
        });
      }

      return tx.purchaseOrder.findUnique({
        where: { id: po.id },
        include: {
          items: {
            include: { inventory: true }
          }
        }
      });
    });
  },

  // 6. List Purchase Orders for shop
  async listPurchaseOrders(shopId: string) {
    return prisma.purchaseOrder.findMany({
      where: { shopId },
      include: {
        items: {
          include: { inventory: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
  },

  // 7. Receive parts from PO (Increases inventory stock)
  async receivePurchaseOrder(shopId: string, poId: string, receivedItems?: Array<{ inventoryId: string; receivedQty: number }>) {
    const po = await prisma.purchaseOrder.findUnique({
      where: { id: poId },
      include: { items: true }
    });

    if (!po || po.shopId !== shopId) {
      throw new Error('Purchase order not found');
    }

    if (po.status === 'RECEIVED') {
      throw new Error('This purchase order has already been fully received.');
    }

    return prisma.$transaction(async (tx) => {
      let allFullyReceived = true;

      for (const poItem of po.items) {
        const itemToReceive = receivedItems?.find(r => r.inventoryId === poItem.inventoryId);
        const qtyToAdd = itemToReceive ? itemToReceive.receivedQty : (poItem.quantity - poItem.receivedQty);

        if (qtyToAdd > 0) {
          const newReceivedTotal = poItem.receivedQty + qtyToAdd;

          await tx.purchaseOrderItem.update({
            where: { id: poItem.id },
            data: { receivedQty: newReceivedTotal }
          });

          // Increase inventory quantity
          await tx.inventory.update({
            where: { id: poItem.inventoryId },
            data: {
              quantity: { increment: qtyToAdd }
            }
          });

          if (newReceivedTotal < poItem.quantity) {
            allFullyReceived = false;
          }
        } else if (poItem.receivedQty < poItem.quantity) {
          allFullyReceived = false;
        }
      }

      const finalStatus = allFullyReceived ? 'RECEIVED' : 'PARTIALLY_RECEIVED';

      if (allFullyReceived) {
        // Automatically advance any bookings waiting in PARTS_ORDERED for this shop to PARTS_READY
        const waitingBookings = await tx.booking.findMany({
          where: {
            shopId,
            status: 'PARTS_ORDERED'
          }
        });

        for (const wb of waitingBookings) {
          await tx.booking.update({
            where: { id: wb.id },
            data: { status: 'PARTS_READY' }
          });
          await tx.bookingHistory.create({
            data: {
              bookingId: wb.id,
              fromStatus: 'PARTS_ORDERED',
              toStatus: 'PARTS_READY',
              userId: po.shopId,
              notes: `Purchase order #${po.id.slice(0, 8).toUpperCase()} received into shop inventory. All parts ready for allocation.`
            }
          });
        }
      }

      return tx.purchaseOrder.update({
        where: { id: poId },
        data: { status: finalStatus },
        include: {
          items: {
            include: { inventory: true }
          }
        }
      });
    });
  },

  // 8. Auto-check stock shortage against required parts list
  async checkStockShortage(shopId: string, requiredParts: Array<{ inventoryId: string; quantity: number }>) {
    const shortageList = [];

    for (const req of requiredParts) {
      const item = await prisma.inventory.findUnique({ where: { id: req.inventoryId } });
      if (!item || item.shopId !== shopId) {
        shortageList.push({
          inventoryId: req.inventoryId,
          name: 'Unknown Part',
          sku: 'N/A',
          required: req.quantity,
          available: 0,
          shortage: req.quantity
        });
      } else if (item.quantity < req.quantity) {
        shortageList.push({
          inventoryId: item.id,
          name: item.name,
          sku: item.sku,
          required: req.quantity,
          available: item.quantity,
          shortage: req.quantity - item.quantity
        });
      }
    }

    return {
      hasShortage: shortageList.length > 0,
      shortages: shortageList
    };
  }
};
