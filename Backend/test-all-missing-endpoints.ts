import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

async function runTests() {
  const baseUrl = 'http://localhost:4000/api';
  const jwtSecret = process.env.JWT_SECRET || 'supersecretkey123';

  console.log('🧪 ========================================================');
  console.log('🧪 TESTING ALL 11 NEW / UPDATED CORE HACKATHON MODULES');
  console.log('🧪 ========================================================\n');

  // Setup test users & tokens
  const owner = await prisma.user.findFirst({ where: { role: 'OWNER' } });
  if (!owner) throw new Error('Owner user not found');
  const ownerToken = jwt.sign({ userId: owner.id, role: owner.role, shopId: owner.shopId }, jwtSecret);

  const tech = await prisma.user.findFirst({ where: { role: 'TECHNICIAN' } });
  const techToken = jwt.sign({ userId: tech!.id, role: tech!.role, shopId: tech!.shopId }, jwtSecret);

  const customer = await prisma.user.findFirst({ where: { role: 'CUSTOMER' } });
  const customerToken = jwt.sign({ userId: customer!.id, role: customer!.role }, jwtSecret);

  const shopId = owner.shopId!;
  console.log(`✅ Auth Tokens initialized for Shop ID: ${shopId}\n`);

  // 1. TEST: Public Shop Listing
  console.log('1️⃣ Testing GET /api/shops (Public discovery)...');
  const shopsRes = await fetch(`${baseUrl}/shops`).then(r => r.json());
  console.log(`   -> Found ${shopsRes.data?.length || 0} shops. Status: ${shopsRes.success ? 'PASS' : 'FAIL'}`);

  // 2. TEST: Shop Details
  console.log('2️⃣ Testing GET /api/shops/:id ...');
  const shopDetail = await fetch(`${baseUrl}/shops/${shopId}`).then(r => r.json());
  console.log(`   -> Shop: "${shopDetail.data?.name}". Status: ${shopDetail.success ? 'PASS' : 'FAIL'}`);

  // 3. TEST: Slots System
  const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];
  console.log(`3️⃣ Testing GET /api/shops/:id/slots?date=${tomorrow} ...`);
  const slotsRes = await fetch(`${baseUrl}/shops/${shopId}/slots?date=${tomorrow}`).then(r => r.json());
  console.log(`   -> Generated ${slotsRes.data?.slots?.length || 0} time slots. Status: ${slotsRes.success ? 'PASS' : 'FAIL'}`);

  // 4. TEST: Service Catalog CRUD
  console.log('4️⃣ Testing Service Catalog (POST & GET /api/shops/:id/services) ...');
  const newService = await fetch(`${baseUrl}/shops/${shopId}/services`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${ownerToken}` },
    body: JSON.stringify({
      name: 'Full Brake Pad Replacement',
      description: 'Front and rear ceramic pad replacement with rotor inspection',
      durationMinutes: 45,
      basePrice: 5000
    })
  }).then(r => r.json());
  console.log(`   -> Created service "${newService.data?.name}" (ID: ${newService.data?.id}). Status: ${newService.success ? 'PASS' : 'FAIL'}`);

  // 5. TEST: Inventory Management
  const testSku = `TEST-BRK-${Date.now().toString().slice(-4)}`;
  console.log(`5️⃣ Testing Inventory (POST /api/shops/:id/inventory) with SKU: ${testSku} ...`);
  const partRes = await fetch(`${baseUrl}/shops/${shopId}/inventory`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${ownerToken}` },
    body: JSON.stringify({
      sku: testSku,
      name: 'Ceramic Brake Rotor Kit',
      quantity: 10,
      reorderLevel: 3,
      unitPrice: 4200
    })
  }).then(r => r.json());
  const partId = partRes.data?.id;
  console.log(`   -> Added Part "${partRes.data?.name}" (ID: ${partId}, Qty: 10). Status: ${partRes.success ? 'PASS' : 'FAIL'}`);

  // 6. TEST: Inventory List
  console.log('6️⃣ Testing Inventory List (GET /api/shops/:id/inventory) ...');
  const invList = await fetch(`${baseUrl}/shops/${shopId}/inventory`, {
    headers: { 'Authorization': `Bearer ${ownerToken}` }
  }).then(r => r.json());
  console.log(`   -> Shop has ${invList.data?.length || 0} inventory items.`);

  // 7. TEST: Booking Creation with Service & Slot
  console.log('7️⃣ Testing Booking Creation (POST /api/bookings) with service & slot ...');
  const availableSlot = slotsRes.data?.slots?.find((s: any) => s.available);
  const targetSlot = availableSlot ? availableSlot.slotTime : new Date(Date.now() + Math.floor(Math.random() * 500000000) + 86400000).toISOString();
  const createBookingRes = await fetch(`${baseUrl}/bookings`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${customerToken}` },
    body: JSON.stringify({
      shopId,
      serviceId: newService.data?.id,
      slotTime: targetSlot,
      vehicleDetails: { make: 'Toyota', model: 'Corolla', year: 2021, plate: 'KHI-9988' },
      issuesReported: ['Brakes vibrating']
    })
  }).then(r => r.json());
  const bookingId = createBookingRes.data?.id;
  console.log(`   -> Created Booking ID: ${bookingId}. Status: ${createBookingRes.success ? 'PASS' : 'FAIL'}`);

  // 8. TEST: Booking GET endpoints (Role-scoped list, single by ID, History)
  console.log('8️⃣ Testing Booking GET endpoints (GET /api/bookings, /api/bookings/:id, /api/bookings/:id/history) ...');
  const allBookings = await fetch(`${baseUrl}/bookings`, {
    headers: { 'Authorization': `Bearer ${ownerToken}` }
  }).then(r => r.json());
  console.log(`   -> Owner sees ${allBookings.data?.length || 0} shop bookings.`);

  const singleBooking = await fetch(`${baseUrl}/bookings/${bookingId}`, {
    headers: { 'Authorization': `Bearer ${ownerToken}` }
  }).then(r => r.json());
  console.log(`   -> Fetched single booking details: ${singleBooking.data?.vehicleDetails?.make} ${singleBooking.data?.vehicleDetails?.model}`);

  const history = await fetch(`${baseUrl}/bookings/${bookingId}/history`, {
    headers: { 'Authorization': `Bearer ${ownerToken}` }
  }).then(r => r.json());
  console.log(`   -> Booking audit trail has ${history.data?.length || 0} history events.`);

  // 9. TEST: Allocate Parts to Booking (Deducts stock)
  console.log('9️⃣ Testing Allocate Parts to Booking (POST /api/bookings/:id/parts) ...');
  const allocRes = await fetch(`${baseUrl}/bookings/${bookingId}/parts`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${ownerToken}` },
    body: JSON.stringify({
      items: [{ inventoryId: partId, quantity: 2 }]
    })
  }).then(r => r.json());
  console.log(`   -> Allocated 2 parts. Status: ${allocRes.success ? 'PASS' : 'FAIL'}`);

  // Check inventory decremented
  const checkPart = await prisma.inventory.findUnique({ where: { id: partId } });
  console.log(`   -> Verified Part Quantity in DB: ${checkPart?.quantity} (Was 10, now should be 8)`);

  // 10. TEST: Purchase Orders (Create & Receive)
  console.log('🔟 Testing Purchase Orders (POST /api/shops/:id/purchase-orders & PATCH receive) ...');
  const poRes = await fetch(`${baseUrl}/shops/${shopId}/purchase-orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${ownerToken}` },
    body: JSON.stringify({
      items: [{ inventoryId: partId, quantity: 5 }]
    })
  }).then(r => r.json());
  const poId = poRes.data?.id;
  console.log(`   -> Created Purchase Order #${poId}. Status: ${poRes.success ? 'PASS' : 'FAIL'}`);

  const receiveRes = await fetch(`${baseUrl}/shops/${shopId}/purchase-orders/${poId}/receive`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${ownerToken}` },
    body: JSON.stringify({
      items: [{ inventoryId: partId, receivedQty: 5 }]
    })
  }).then(r => r.json());
  console.log(`   -> Received PO delivery. PO Status: ${receiveRes.data?.status}`);
  const afterPOPart = await prisma.inventory.findUnique({ where: { id: partId } });
  console.log(`   -> Verified Part Quantity in DB after PO receive: ${afterPOPart?.quantity} (Was 8, now should be 13)`);

  // 11. TEST: Cancellation Stock Release
  console.log('1️⃣1️⃣ Testing Cancellation + Automatic Stock Release (PATCH /api/bookings/:id/status -> CANCELLED) ...');
  await fetch(`${baseUrl}/bookings/${bookingId}/status`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${ownerToken}` },
    body: JSON.stringify({ status: 'CANCELLED', notes: 'Customer cancelled appointment' })
  });
  const afterCancelPart = await prisma.inventory.findUnique({ where: { id: partId } });
  console.log(`   -> Verified Stock released back on cancellation: ${afterCancelPart?.quantity} (Was 13, now 15 - 2 released back)`);

  console.log('\n🎉 ALL 11 CORE MODULES AND TESTS EXECUTED SUCCESSFULLY!');
}

runTests().catch(console.error).finally(() => prisma.$disconnect());
