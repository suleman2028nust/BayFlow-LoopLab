import { BrevoClient } from '@getbrevo/brevo';
import dotenv from 'dotenv';
dotenv.config();

let client: BrevoClient | null = null;

/**
 * Brevo transactional email client — uses their REST API (not SMTP), since
 * serverless functions & firewalled environments can get torn down mid-handshake
 * before an SMTP send completes, silently dropping the email.
 */
function getBrevoClient(): BrevoClient {
  if (!client) {
    const apiKey = (process.env.BREVO_API_KEY || process.env.SMTP_PASS || '').trim();
    if (!apiKey) {
      throw new Error('BREVO_API_KEY is not configured');
    }
    client = new BrevoClient({ apiKey });
  }
  return client;
}

/**
 * Send 6-digit OTP verification code via email
 */
export async function sendOTPEmail(toEmail: string, otp: string, fullName: string = 'User'): Promise<boolean> {
  const senderEmail = (process.env.EMAIL_USER || process.env.SMTP_FROM_EMAIL || 'pyrohassan786@gmail.com').trim();

  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f7f6; margin: 0; padding: 0; }
          .container { max-width: 500px; margin: 30px auto; background: #ffffff; border-radius: 12px; padding: 30px; box-shadow: 0 4px 15px rgba(0,0,0,0.05); }
          .header { text-align: center; padding-bottom: 20px; border-bottom: 1px solid #eeeeee; }
          .header h2 { color: #1e293b; margin: 0; font-size: 24px; }
          .content { padding: 25px 0; text-align: center; }
          .content p { color: #475569; font-size: 15px; line-height: 1.6; margin-bottom: 20px; }
          .otp-code { display: inline-block; font-size: 36px; font-weight: 700; letter-spacing: 8px; color: #111827; background: #f1f5f9; padding: 12px 24px; border-radius: 8px; border: 1px dashed #cbd5e1; margin: 15px 0; }
          .footer { text-align: center; font-size: 12px; color: #94a3b8; border-top: 1px solid #eeeeee; padding-top: 20px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h2>Account Verification</h2>
          </div>
          <div class="content">
            <p>Hello <strong>${fullName}</strong>,</p>
            <p>Thank you for signing up with BayFlow. Please use the following 6-digit verification code to complete your registration:</p>
            <div class="otp-code">${otp}</div>
            <p>This code will expire in <strong>10 minutes</strong>. If you did not request this, please ignore this email.</p>
          </div>
          <div class="footer">
            <p>&copy; ${new Date().getFullYear()} BayFlow Auto Care. All rights reserved.</p>
          </div>
        </div>
      </body>
    </html>
  `;

  try {
    await getBrevoClient().transactionalEmails.sendTransacEmail({
      sender: { name: 'BayFlow Auth', email: senderEmail },
      to: [{ email: toEmail }],
      subject: `${otp} is your BayFlow verification code`,
      htmlContent,
    });
    console.log(`✅ [Brevo REST API] OTP verification email sent successfully to ${toEmail}`);
    return true;
  } catch (error: any) {
    console.error('Failed to send OTP email via Brevo REST API:', error?.message || error);
    return false;
  }
}

/**
 * Send 6-digit password reset OTP code via email
 */
export async function sendPasswordResetEmail(toEmail: string, otp: string, fullName: string = 'User'): Promise<boolean> {
  const senderEmail = (process.env.EMAIL_USER || process.env.SMTP_FROM_EMAIL || 'pyrohassan786@gmail.com').trim();
  const recipientName = fullName || 'User';

  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f7f6; margin: 0; padding: 0; }
          .container { max-width: 500px; margin: 30px auto; background: #ffffff; border-radius: 12px; padding: 30px; box-shadow: 0 4px 15px rgba(0,0,0,0.05); }
          .header { text-align: center; padding-bottom: 20px; border-bottom: 1px solid #eeeeee; }
          .header h2 { color: #dc2626; margin: 0; font-size: 24px; }
          .content { padding: 25px 0; text-align: center; }
          .content p { color: #475569; font-size: 15px; line-height: 1.6; margin-bottom: 20px; }
          .otp-code { display: inline-block; font-size: 36px; font-weight: 700; letter-spacing: 8px; color: #dc2626; background: #fef2f2; padding: 12px 24px; border-radius: 8px; border: 1px dashed #fca5a5; margin: 15px 0; }
          .footer { text-align: center; font-size: 12px; color: #94a3b8; border-top: 1px solid #eeeeee; padding-top: 20px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h2>Password Reset Request</h2>
          </div>
          <div class="content">
            <p>Hello <strong>${recipientName}</strong>,</p>
            <p>We received a request to reset your BayFlow password. Use the 6-digit code below to verify your identity:</p>
            <div class="otp-code">${otp}</div>
            <p>This code will expire in <strong>10 minutes</strong>. If you did not request a password reset, please secure your account immediately.</p>
          </div>
          <div class="footer">
            <p>&copy; ${new Date().getFullYear()} BayFlow Auto Care. All rights reserved.</p>
          </div>
        </div>
      </body>
    </html>
  `;

  try {
    await getBrevoClient().transactionalEmails.sendTransacEmail({
      sender: { name: 'BayFlow Security', email: senderEmail },
      to: [{ email: toEmail }],
      subject: `${otp} is your BayFlow password reset code`,
      htmlContent,
    });
    console.log(`✅ [Brevo REST API] Password reset email sent successfully to ${toEmail}`);
    return true;
  } catch (error: any) {
    console.error('Failed to send password reset email via Brevo REST API:', error?.message || error);
    return false;
  }
}

/**
 * Compatibility wrapper for existing auth calls
 */
export async function sendEmail(to: string, subject: string, otp: string, fullName?: string): Promise<boolean> {
  if (subject.toLowerCase().includes('password') || subject.toLowerCase().includes('reset')) {
    return sendPasswordResetEmail(to, otp, fullName);
  }
  return sendOTPEmail(to, otp, fullName || 'User');
}
