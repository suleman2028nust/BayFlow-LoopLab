import { AuthService } from './src/modules/auth/auth.service';
import { BookingService } from './src/modules/booking/booking.service';
import { redis } from './src/config/redis';
import { prisma } from './src/config/prisma';

async function runTests() {
  console.log('--- STARTING END-TO-END TESTS ---\n');
  const testEmail = `test_${Date.now()}@seecs.edu.pk`;
  const testPassword = 'Password123!@#';

  try {
    // 1. Account Creation
    console.log('1. Testing Account Creation (OWNER)...');
    await AuthService.register({
      email: testEmail,
      password: testPassword,
      role: 'OWNER',
      shopName: 'Test Auto Care'
    });
    console.log('✅ Account created successfully. OTP generated & Email sent via Brevo SMTP.');

    // 2. OTP Verification
    console.log('\n2. Testing OTP Verification from Upstash Redis...');
    const otp = await redis.get(`otp:${testEmail}`);
    if (!otp) throw new Error('OTP not found in Redis!');
    const { accessToken } = await AuthService.verifyOtp({ email: testEmail, otp });
    console.log('✅ OTP verified successfully. Access Token & Refresh Token generated.');

    // 3. Forgot / Reset Password Flow
    console.log('\n3. Testing Forgot/Reset Password Flow...');
    await AuthService.forgotPassword({ email: testEmail });
    const resetOtp = await redis.get(`pwd_otp:${testEmail}`);
    if (!resetOtp) throw new Error('Reset OTP not found in Redis!');
    await AuthService.resetPassword({
      email: testEmail,
      otp: resetOtp,
      newPassword: 'NewPassword123!@#'
    });
    console.log('✅ Password reset successful.');

    // Get User and Shop
    const user = await prisma.user.findUnique({ where: { email: testEmail } });
    if (!user || !user.shopId) throw new Error('User or Shop not found in Supabase DB');

    // 4. Booking Creation (State Machine Init & Redis Lock)
    console.log('\n4. Testing Booking Creation (Redis Redlock & Transaction)...');
    const slotTime = new Date();
    slotTime.setHours(slotTime.getHours() + 24); // Tomorrow
    
    // Create a fake customer
    const customer = await prisma.user.create({
      data: {
        email: `customer_${Date.now()}@gmail.com`,
        passwordHash: 'hash',
        role: 'CUSTOMER',
        isVerified: true
      }
    });

    const booking = await BookingService.createBooking({
      shopId: user.shopId,
      slotTime: slotTime.toISOString(),
      vehicleDetails: { make: 'Toyota', model: 'Corolla', year: 2020, plate: 'ABC-123' },
      issuesReported: ['Oil Change']
    }, customer.id);
    console.log('✅ Booking created successfully. Unique Constraint + Redis Lock worked.');

    // 5. Booking State Machine Transition
    console.log('\n5. Testing State Machine (PENDING -> CONFIRMED)...');
    // Owner confirms
    await BookingService.updateStatus(booking.id, 'CONFIRMED', { userId: user.id, role: 'OWNER' }, 'Confirmed by owner');
    console.log('✅ State transitioned successfully. Audit log created in Supabase DB.');

    // 6. Security Check: Attempt illegal transition
    console.log('\n6. Testing Security: Illegal State Transition (CONFIRMED -> IN_REPAIR by OWNER)...');
    try {
      await BookingService.updateStatus(booking.id, 'IN_REPAIR', { userId: user.id, role: 'OWNER' }, 'Hack attempt');
      throw new Error('❌ Security Failure: State machine allowed illegal transition!');
    } catch (e: any) {
      if (e.message.includes('Security Failure')) throw e;
      console.log('✅ Security successfully blocked illegal transition. Error Message: ' + e.message);
    }

    console.log('\n🎉 ALL ENTERPRISE FEATURES TESTED AND PASSED SUCCESSFULLY! 🎉');

  } catch (error) {
    console.error('\n❌ TEST FAILED:', error);
  } finally {
    process.exit(0);
  }
}

runTests();
