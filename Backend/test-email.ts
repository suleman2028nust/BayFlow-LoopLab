import { sendEmail } from './src/config/brevo';

async function test() {
  console.log('Sending test email...');
  try {
    await sendEmail('hjamal.bscs24seecs@seecs.edu.pk', 'Your BayFlow Verification Code', '987654');
    console.log('Test complete.');
  } catch (err) {
    console.error('Test failed:', err);
  }
}

test();
