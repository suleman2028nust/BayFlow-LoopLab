const fs = require('fs');

async function run() {
  const baseUrl = 'http://localhost:4000/api';
  let customerToken = '';
  let ownerToken = '';
  let techToken = '';
  let qcToken = '';
  let shopId = '';
  let bookingId = '';

  console.log('🚀 Starting end-to-end booking flow test...');

  try {
    // 1. Get Owner Token (from seed data)
    console.log('\n[1] Logging in as Owner...');
    const ownerRes = await fetch(`${baseUrl}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'fatima@bayflow.demo', password: 'demo1234' })
    }).then(r => r.json());
    ownerToken = ownerRes.tokens.accessToken;
    shopId = ownerRes.user.shopId;
    console.log('✅ Owner logged in. ShopId:', shopId);

    // 2. Get Tech Token
    console.log('\n[2] Logging in as Technician...');
    const techRes = await fetch(`${baseUrl}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'imran.tech@bayflow.demo', password: 'demo1234' })
    }).then(r => r.json());
    techToken = techRes.tokens.accessToken;
    console.log('✅ Tech logged in.');

    // 3. Get QC Token
    console.log('\n[3] Logging in as QC Inspector...');
    const qcRes = await fetch(`${baseUrl}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'sara.qc@bayflow.demo', password: 'demo1234' })
    }).then(r => r.json());
    qcToken = qcRes.tokens.accessToken;
    console.log('✅ QC logged in.');

    // 4. Register a NEW Customer with the specific phone number
    const testEmail = `test_${Date.now()}@bayflow.demo`;
    console.log(`\n[4] Registering test customer: ${testEmail}...`);
    const regRes = await fetch(`${baseUrl}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        email: testEmail, 
        password: 'Password123!', 
        role: 'CUSTOMER',
        phoneNumber: '03289082754' // WhatsApp testing number
      })
    }).then(r => r.json());
    
    // We need to verify OTP, but we can't easily get it since it's emailed. 
    // Wait, auth.service.ts logs it? Let's bypass OTP or just login as the seeded customer and update their phone in DB using prisma!
  } catch (err) {
    console.error(err);
  }
}

run();
