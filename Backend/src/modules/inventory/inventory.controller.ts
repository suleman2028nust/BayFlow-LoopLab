import { Request, Response, NextFunction } from 'express';
import { InventoryService } from './inventory.service';

export const InventoryController = {
  async getInventory(req: Request, res: Response, next: NextFunction) {
    try {
      const shopId = req.params.shopId || req.params.id || (req as any).user?.shopId;
      const { search, lowStock } = req.query;
      const inventory = await InventoryService.getShopInventory(
        shopId as string,
        search ? String(search) : undefined,
        lowStock === 'true'
      );
      res.status(200).json({ success: true, data: inventory });
    } catch (error) {
      next(error);
    }
  },

  async addPart(req: Request, res: Response, next: NextFunction) {
    try {
      const shopId = req.params.shopId || req.params.id || (req as any).user?.shopId;
      const { sku, name, quantity, reorderLevel, unitPrice } = req.body;
      const part = await InventoryService.addPart(shopId as string, {
        sku,
        name,
        quantity: quantity !== undefined ? Number(quantity) : undefined,
        reorderLevel: reorderLevel !== undefined ? Number(reorderLevel) : undefined,
        unitPrice: Number(unitPrice)
      });
      res.status(201).json({ success: true, data: part, message: 'Part added to inventory successfully' });
    } catch (error) {
      next(error);
    }
  },

  async updatePart(req: Request, res: Response, next: NextFunction) {
    try {
      const shopId = req.params.shopId || req.params.id || (req as any).user?.shopId;
      const partId = req.params.partId;
      const { name, sku, quantity, reorderLevel, unitPrice } = req.body;
      const updated = await InventoryService.updatePart(shopId as string, partId as string, {
        name,
        sku,
        quantity: quantity !== undefined ? Number(quantity) : undefined,
        reorderLevel: reorderLevel !== undefined ? Number(reorderLevel) : undefined,
        unitPrice: unitPrice !== undefined ? Number(unitPrice) : undefined
      });
      res.status(200).json({ success: true, data: updated, message: 'Inventory item updated successfully' });
    } catch (error) {
      next(error);
    }
  },

  async allocateParts(req: Request, res: Response, next: NextFunction) {
    try {
      const bookingId = req.params.id;
      const { items } = req.body; // array of { inventoryId, quantity }
      const user = (req as any).user;
      const result = await InventoryService.allocatePartsToBooking(bookingId as string, items, user);
      res.status(200).json({ success: true, data: result, message: 'Parts allocated and stock deducted successfully' });
    } catch (error) {
      next(error);
    }
  },

  async createPurchaseOrder(req: Request, res: Response, next: NextFunction) {
    try {
      const shopId = req.params.shopId || req.params.id || (req as any).user?.shopId;
      const { items } = req.body;
      const po = await InventoryService.createPurchaseOrder(shopId as string, items);
      res.status(201).json({ success: true, data: po, message: 'Purchase Order created successfully' });
    } catch (error) {
      next(error);
    }
  },

  async listPurchaseOrders(req: Request, res: Response, next: NextFunction) {
    try {
      const shopId = req.params.shopId || req.params.id || (req as any).user?.shopId;
      const pos = await InventoryService.listPurchaseOrders(shopId as string);
      res.status(200).json({ success: true, data: pos });
    } catch (error) {
      next(error);
    }
  },

  async receivePurchaseOrder(req: Request, res: Response, next: NextFunction) {
    try {
      const shopId = req.params.shopId || req.params.id || (req as any).user?.shopId;
      const poId = req.params.poId;
      const { items } = req.body;
      const updatedPO = await InventoryService.receivePurchaseOrder(shopId as string, poId as string, items);
      res.status(200).json({ success: true, data: updatedPO, message: 'Parts received and inventory updated' });
    } catch (error) {
      next(error);
    }
  },

  async checkStockShortage(req: Request, res: Response, next: NextFunction) {
    try {
      const shopId = req.params.shopId || req.params.id || (req as any).user?.shopId;
      const { requiredParts } = req.body;
      const result = await InventoryService.checkStockShortage(shopId as string, requiredParts);
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }
};
