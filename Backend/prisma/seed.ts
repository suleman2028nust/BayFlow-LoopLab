import { PrismaClient, Role } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Password for all demo accounts
  const passwordHash = await bcrypt.hash('demo1234', 12);

  // 1. Create Shops
  const shop1 = await prisma.shop.create({
    data: { name: 'Lahore Auto Care', city: 'Lahore', address: 'Main Boulevard, Gulberg', phone: '03001234567' }
  });
  const shop2 = await prisma.shop.create({
    data: { name: 'Karachi Motors', city: 'Karachi', address: 'Clifton Block 5', phone: '03009876543' }
  });
  const shop3 = await prisma.shop.create({
    data: { name: 'Islamabad Mechanics', city: 'Islamabad', address: 'F-8 Markaz', phone: '03001122334' }
  });

  console.log(`✅ Shops created: ${shop1.name}, ${shop2.name}, ${shop3.name}`);

  // 2. Create Staff Accounts
  const owner = await prisma.user.upsert({
    where: { email: 'fatima@bayflow.demo' },
    update: {},
    create: {
      email: 'fatima@bayflow.demo',
      passwordHash,
      role: Role.OWNER,
      shopId: shop1.id,
      isVerified: true
    }
  });

  const sa = await prisma.user.upsert({
    where: { email: 'bilal.sa@bayflow.demo' },
    update: {},
    create: {
      email: 'bilal.sa@bayflow.demo',
      passwordHash,
      role: Role.SERVICE_ADVISOR,
      shopId: shop1.id,
      isVerified: true
    }
  });

  const tech = await prisma.user.upsert({
    where: { email: 'imran.tech@bayflow.demo' },
    update: {},
    create: {
      email: 'imran.tech@bayflow.demo',
      passwordHash,
      role: Role.TECHNICIAN,
      shopId: shop1.id,
      isVerified: true
    }
  });

  const qc = await prisma.user.upsert({
    where: { email: 'sara.qc@bayflow.demo' },
    update: {},
    create: {
      email: 'sara.qc@bayflow.demo',
      passwordHash,
      role: Role.QC_INSPECTOR,
      shopId: shop1.id,
      isVerified: true
    }
  });

  const parts = await prisma.user.upsert({
    where: { email: 'usman.parts@bayflow.demo' },
    update: {},
    create: {
      email: 'usman.parts@bayflow.demo',
      passwordHash,
      role: Role.PARTS_PERSON,
      shopId: shop1.id,
      isVerified: true
    }
  });

  console.log('✅ Staff accounts created.');

  // 3. Create a Customer Account
  const customer = await prisma.user.upsert({
    where: { email: 'ahmed.customer@bayflow.demo' },
    update: {},
    create: {
      email: 'ahmed.customer@bayflow.demo',
      passwordHash,
      role: Role.CUSTOMER,
      isVerified: true
    }
  });

  console.log('✅ Customer account created.');

  // 4. Create Inventory items for Shop 1
  await prisma.inventory.createMany({
    data: [
      { shopId: shop1.id, sku: 'PART-001', name: 'Ignition Coil', quantity: 5, unitPrice: 6500 },
      { shopId: shop1.id, sku: 'PART-002', name: 'Oil Filter (Honda)', quantity: 12, unitPrice: 900 },
      { shopId: shop1.id, sku: 'PART-003', name: 'Engine Oil 4L', quantity: 20, unitPrice: 5200 },
    ]
  });

  console.log('✅ Inventory items seeded.');
  console.log('🎉 Seeding complete. All accounts use password: "demo1234"');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
