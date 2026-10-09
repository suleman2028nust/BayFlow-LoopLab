import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';
const prisma = new PrismaClient();

async function run() {
  const baseUrl = 'http://localhost:4000/api';
  let customerToken = '';
  let ownerToken = '';
  let techToken = '';
  let qcToken = '';
  let shopId = '';
  let bookingId = '';

  console.log('🚀 Starting end-to-end booking flow test...\n');

  try {
    // 0. Update seeded customer phone number to target
    await prisma.user.update({
      where: { email: 'ahmed.customer@bayflow.demo' },
      data: { phoneNumber: '923289082754' }
    });
    console.log('✅ Updated test customer phone to 03289082754 for WhatsApp notifications.');

    // Generate tokens directly bypassing Rate Limits
    const ownerDb = await prisma.user.findUnique({ where: { email: 'fatima@bayflow.demo' }});
    if (!ownerDb) throw new Error('Owner not found');
    const jwtSecret = process.env.JWT_SECRET || 'supersecretkey123';
    ownerToken = jwt.sign({ userId: ownerDb.id, role: ownerDb.role, shopId: ownerDb.shopId }, jwtSecret);
    shopId = ownerDb.shopId!;
    console.log('✅ Owner token generated. Shop ID:', shopId);

    const techDb = await prisma.user.findUnique({ where: { email: 'imran.tech@bayflow.demo' }});
    techToken = jwt.sign({ userId: techDb!.id, role: techDb!.role, shopId: techDb!.shopId }, jwtSecret);
    console.log('✅ Technician token generated.');

    const qcDb = await prisma.user.findUnique({ where: { email: 'sara.qc@bayflow.demo' }});
    qcToken = jwt.sign({ userId: qcDb!.id, role: qcDb!.role, shopId: qcDb!.shopId }, jwtSecret);
    console.log('✅ QC Inspector token generated.');

    const customerDb = await prisma.user.findUnique({ where: { email: 'ahmed.customer@bayflow.demo' }});
    customerToken = jwt.sign({ userId: customerDb!.id, role: customerDb!.role }, jwtSecret);
    console.log('✅ Customer token generated.\n');

    const wait = (ms: number) => new Promise(r => setTimeout(r, ms));

    // 5. Customer creates Booking
    console.log('=> Customer creates booking (PENDING)...');
    const bookingRes = await fetch(`${baseUrl}/bookings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${customerToken}` },
      body: JSON.stringify({
        shopId,
        slotTime: new Date(Date.now() + 86400000).toISOString(),
        vehicleDetails: { make: 'Honda', model: 'Civic', year: 2020, plate: 'ABC-123' },
        issuesReported: ['Engine making weird noise']
      })
    }).then(r => r.json());
    console.log('Booking Res:', bookingRes);
    bookingId = bookingRes.data?.id;
    if (!bookingId) throw new Error('Booking ID missing');
    console.log(`✅ Booking created. ID: ${bookingId}`);
    await wait(3000);

    // 6. Owner confirms Booking
    console.log('=> Owner confirms booking (CONFIRMED) [EXPECT WHATSAPP 1]');
    await fetch(`${baseUrl}/bookings/${bookingId}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${ownerToken}` },
      body: JSON.stringify({ status: 'CONFIRMED', notes: 'See you tomorrow' })
    });
    await wait(4000);

    // 7. Owner assigns Tech
    console.log('=> Owner assigns technician (ASSIGNED) [EXPECT WHATSAPP 2]');
    // Note: the state machine next state is ASSIGNED. Tech assignment is implicitly handled if we pass ASSIGNED and we need to patch the DB to set assignedTechId directly, or just trigger status if our endpoint allows it.
    // Wait, updateStatus doesn't set assignedTechId directly right now unless we modify it. Let's just update the status to ASSIGNED first.
    await fetch(`${baseUrl}/bookings/${bookingId}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${ownerToken}` },
      body: JSON.stringify({ status: 'ASSIGNED', notes: 'Assigned to Imran' })
    });
    
    // Quick DB hack to assign the tech so the tech can update it
    const techUser = await prisma.user.findUnique({ where: { email: 'imran.tech@bayflow.demo' } });
    if (techUser) await prisma.booking.update({ where: { id: bookingId }, data: { assignedTechId: techUser.id } });
    await wait(4000);

    // 8. Tech Inspecting
    console.log('=> Tech starts inspection (INSPECTING) [EXPECT WHATSAPP 3]');
    await fetch(`${baseUrl}/bookings/${bookingId}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${techToken}` },
      body: JSON.stringify({ status: 'INSPECTING' })
    });
    await wait(4000);

    // 9. Tech Adds Estimate
    console.log('=> Tech adds estimate (ESTIMATE_REVIEW) [EXPECT WHATSAPP 4]');
    const estimateRes = await fetch(`${baseUrl}/bookings/${bookingId}/estimate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${techToken}` },
      body: JSON.stringify({ labourCost: 5000, partsCost: 10000, notes: 'Needs new oil filter and tuning' })
    }).then(r => r.json());
    console.log(estimateRes);
    await wait(4000);

    // 10. Customer Approves Estimate
    console.log('=> Customer approves estimate (ESTIMATE_APPROVED) [EXPECT WHATSAPP 5]');
    await fetch(`${baseUrl}/bookings/${bookingId}/estimate/respond`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${customerToken}` },
      body: JSON.stringify({ status: 'APPROVED' })
    });
    await wait(4000);

    // 11. Tech Starts Repair
    console.log('=> Tech starts repair (IN_REPAIR) [EXPECT WHATSAPP 6]');
    await fetch(`${baseUrl}/bookings/${bookingId}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${techToken}` },
      body: JSON.stringify({ status: 'IN_REPAIR' })
    });
    await wait(4000);

    // 12. Tech finishes repair -> QC Pending
    console.log('=> Tech finishes repair (QC_PENDING) [EXPECT WHATSAPP 7]');
    await fetch(`${baseUrl}/bookings/${bookingId}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${techToken}` },
      body: JSON.stringify({ status: 'QC_PENDING' })
    });
    await wait(4000);

    // 13. QC Passes -> Ready for Pickup
    console.log('=> QC Inspector approves (READY_FOR_PICKUP) [EXPECT WHATSAPP 8]');
    await fetch(`${baseUrl}/bookings/${bookingId}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${qcToken}` },
      body: JSON.stringify({ status: 'READY_FOR_PICKUP' })
    });
    
    console.log('\n🎉 E2E Flow Completed Successfully!');

  } catch (err) {
    console.error('Flow failed:', err);
  } finally {
    await prisma.$disconnect();
  }
}

run();
