import { PrismaClient, Role } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🧹 [1/4] Cleaning existing database shops, bookings, and demo users...');

  // 1. Delete dependent child records first to respect foreign keys
  await prisma.callLog.deleteMany({});
  await prisma.qCIssue.deleteMany({});
  await prisma.bookingPart.deleteMany({});
  await prisma.estimate.deleteMany({});
  await prisma.bookingHistory.deleteMany({});
  await prisma.purchaseOrderItem.deleteMany({});
  await prisma.purchaseOrder.deleteMany({});
  await prisma.booking.deleteMany({});
  await prisma.inventory.deleteMany({});
  await prisma.service.deleteMany({});
  await prisma.notification.deleteMany({});

  // 2. Disconnect users from shops to prevent circular foreign key locks
  await prisma.user.updateMany({ data: { shopId: null } });
  await prisma.shop.updateMany({ data: { ownerId: null } });

  // 3. Delete non-personal users and all existing shops
  // Preserve any personal admin email like pyrohassan if needed
  await prisma.user.deleteMany({
    where: {
      email: {
        notIn: ['pyrohassan786@gmail.com', 'pyrohassan788786@gmail.com', 'pyrohassan77886@gmail.com'],
      },
    },
  });
  await prisma.shop.deleteMany({});

  console.log('✨ [2/4] Database cleaned successfully!');
  console.log('🏛️ [3/4] Creating 4 Premium Automotive Centers with full professional teams...');

  const DEFAULT_PASSWORD = 'BayFlow@2026';
  const passwordHash = await bcrypt.hash(DEFAULT_PASSWORD, 12);

  // ─── 4 Premium Shops Definition ───────────────────────────────────────────
  const shopsData = [
    {
      name: 'Apex Performance & AutoLab',
      city: 'Lahore',
      address: 'Main Boulevard, Gulberg III, Lahore',
      phone: '+92 300 8472911',
      timezone: 'Asia/Karachi',
      prefix: 'apex',
      ownerName: 'Hamza Malik',
      team: {
        owner: 'owner@apex.bayflow.io',
        advisor: 'advisor@apex.bayflow.io',
        tech: 'tech@apex.bayflow.io',
        parts: 'parts@apex.bayflow.io',
        qc: 'qc@apex.bayflow.io',
      },
    },
    {
      name: 'Velocity Motorsports & Precision Care',
      city: 'Karachi',
      address: 'Marine Promenade, Clifton Block 4, Karachi',
      phone: '+92 321 9924810',
      timezone: 'Asia/Karachi',
      prefix: 'velocity',
      ownerName: 'Tariq Al-Mansoor',
      team: {
        owner: 'owner@velocity.bayflow.io',
        advisor: 'advisor@velocity.bayflow.io',
        tech: 'tech@velocity.bayflow.io',
        parts: 'parts@velocity.bayflow.io',
        qc: 'qc@velocity.bayflow.io',
      },
    },
    {
      name: 'Prestige AutoCraft & Works',
      city: 'Islamabad',
      address: 'Executive Sector, Blue Area, Islamabad',
      phone: '+92 333 5183920',
      timezone: 'Asia/Karachi',
      prefix: 'prestige',
      ownerName: 'Zainab Qureshi',
      team: {
        owner: 'owner@prestige.bayflow.io',
        advisor: 'advisor@prestige.bayflow.io',
        tech: 'tech@prestige.bayflow.io',
        parts: 'parts@prestige.bayflow.io',
        qc: 'qc@prestige.bayflow.io',
      },
    },
    {
      name: 'Bavarian Auto Haus & Garage',
      city: 'Lahore',
      address: 'Commercial Avenue, DHA Phase 6, Lahore',
      phone: '+92 301 4455667',
      timezone: 'Asia/Karachi',
      prefix: 'bavarian',
      ownerName: 'Khurram Shehzad',
      team: {
        owner: 'owner@bavarian.bayflow.io',
        advisor: 'advisor@bavarian.bayflow.io',
        tech: 'tech@bavarian.bayflow.io',
        parts: 'parts@bavarian.bayflow.io',
        qc: 'qc@bavarian.bayflow.io',
      },
    },
  ];

  for (const shopItem of shopsData) {
    // 1. Create the Shop
    const shop = await prisma.shop.create({
      data: {
        name: shopItem.name,
        city: shopItem.city,
        address: shopItem.address,
        phone: shopItem.phone,
        timezone: shopItem.timezone,
        workingHours: {
          open: '08:30',
          close: '19:00',
          slotDurationMinutes: 60,
          daysOpen: [1, 2, 3, 4, 5, 6],
        },
      },
    });

    // 2. Create the Owner User
    const ownerUser = await prisma.user.create({
      data: {
        email: shopItem.team.owner,
        passwordHash,
        role: Role.OWNER,
        phoneNumber: shopItem.phone,
        isVerified: true,
        shopId: shop.id,
      },
    });

    // Link Owner to Shop
    await prisma.shop.update({
      where: { id: shop.id },
      data: { ownerId: ownerUser.id },
    });

    // 3. Create Service Advisor
    await prisma.user.create({
      data: {
        email: shopItem.team.advisor,
        passwordHash,
        role: Role.SERVICE_ADVISOR,
        phoneNumber: shopItem.phone,
        isVerified: true,
        shopId: shop.id,
      },
    });

    // 4. Create Master Technician
    await prisma.user.create({
      data: {
        email: shopItem.team.tech,
        passwordHash,
        role: Role.TECHNICIAN,
        phoneNumber: shopItem.phone,
        isVerified: true,
        shopId: shop.id,
      },
    });

    // 5. Create Parts Specialist
    await prisma.user.create({
      data: {
        email: shopItem.team.parts,
        passwordHash,
        role: Role.PARTS_PERSON,
        phoneNumber: shopItem.phone,
        isVerified: true,
        shopId: shop.id,
      },
    });

    // 6. Create QC Inspector
    await prisma.user.create({
      data: {
        email: shopItem.team.qc,
        passwordHash,
        role: Role.QC_INSPECTOR,
        phoneNumber: shopItem.phone,
        isVerified: true,
        shopId: shop.id,
      },
    });

    // 7. Seed Premium Catalog Services for this shop
    await prisma.service.createMany({
      data: [
        { shopId: shop.id, name: 'Computerized OBD-II Diagnostics & Health Scan', durationMinutes: 45, basePrice: 3500 },
        { shopId: shop.id, name: 'Full Synthetic Engine Oil & OEM Filter Service', durationMinutes: 30, basePrice: 6500 },
        { shopId: shop.id, name: 'Ceramic Brake Pad & Rotor Precision Overhaul', durationMinutes: 60, basePrice: 9500 },
        { shopId: shop.id, name: 'Climate Control AC Gas Flush & Leak Detection', durationMinutes: 45, basePrice: 5000 },
        { shopId: shop.id, name: 'Laser Wheel Alignment & Multi-Link Suspension Tune', durationMinutes: 60, basePrice: 4500 },
      ],
    });

    // 8. Seed Real Inventory Catalog (with 1 item at 0 quantity to test Purchase Orders!)
    await prisma.inventory.createMany({
      data: [
        { shopId: shop.id, sku: `${shopItem.prefix.toUpperCase()}-OIL-5W40`, name: 'Castrol Edge 5W-40 Full Synthetic 4L', quantity: 18, reorderLevel: 5, unitPrice: 5800 },
        { shopId: shop.id, sku: `${shopItem.prefix.toUpperCase()}-FLTR-OEM`, name: 'OEM Micro-Pore Oil Filter', quantity: 24, reorderLevel: 6, unitPrice: 1200 },
        { shopId: shop.id, sku: `${shopItem.prefix.toUpperCase()}-BRK-FRNT`, name: 'Brembo Ceramic Front Brake Pads Set', quantity: 10, reorderLevel: 3, unitPrice: 7500 },
        { shopId: shop.id, sku: `${shopItem.prefix.toUpperCase()}-SPRK-IRID`, name: 'NGK Laser Iridium Spark Plugs (Pack of 4)', quantity: 14, reorderLevel: 4, unitPrice: 4200 },
        { shopId: shop.id, sku: `${shopItem.prefix.toUpperCase()}-IGN-COIL`, name: 'Bosch High-Energy Ignition Coil', quantity: 0, reorderLevel: 2, unitPrice: 6800 }, // 0 stock for PO flow!
      ],
    });

    console.log(`✅ [${shopItem.name}] seeded with 5-member staff, 5 services, and 5 inventory parts!`);
  }

  // ─── Create Demo Customer Account ─────────────────────────────────────────
  const customer = await prisma.user.create({
    data: {
      email: 'customer@bayflow.demo',
      passwordHash,
      role: Role.CUSTOMER,
      phoneNumber: '+92 300 1234567',
      isVerified: true,
    },
  });

  console.log(`✅ Demo Customer created: ${customer.email}`);
  console.log('\n======================================================');
  console.log('🎉 DATABASE SEEDING COMPLETED SUCCESSFULLY!');
  console.log(`🔑 All Accounts Password: "${DEFAULT_PASSWORD}"`);
  console.log('======================================================\n');
}

main()
  .catch((e) => {
    console.error('❌ Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
