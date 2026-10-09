import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp-relay.brevo.com',
  port: Number(process.env.SMTP_PORT) || 587,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export const sendEmail = async (to: string, subject: string, otp: string) => {
  if (!process.env.SMTP_USER) {
    console.log(`\n[DEV MODE] 📧 Mock Email Sent to: ${to} | OTP: ${otp}\n`);
    return;
  }

  // Premium, non-generic HTML Email Template
  const htmlContent = `
  <div style="font-family: 'Inter', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px; background-color: #ffffff; border: 1px solid #eaeaea; border-radius: 12px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
    <div style="text-align: center; margin-bottom: 30px;">
      <h1 style="color: #111827; font-size: 32px; margin: 0; font-weight: 900; letter-spacing: -1px; text-transform: uppercase;">BAYFLOW</h1>
      <p style="color: #6B7280; font-size: 14px; margin-top: 5px; text-transform: uppercase; letter-spacing: 2px;">Premium Auto Care</p>
    </div>
    <div style="border-top: 2px solid #F3F4F6; margin-bottom: 30px;"></div>
    <h2 style="color: #1F2937; font-size: 24px; font-weight: 700; margin-bottom: 20px; text-align: center;">Verify Your Account</h2>
    <p style="color: #4B5563; font-size: 16px; line-height: 1.6; margin-bottom: 30px; text-align: center;">
      You recently requested to securely access your BayFlow account. Use the verification code below to complete the process. This code expires in <strong style="color: #111827;">5 minutes</strong>.
    </p>
    <div style="background: linear-gradient(135deg, #111827 0%, #374151 100%); border-radius: 12px; padding: 30px; text-align: center; margin-bottom: 30px; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);">
      <span style="font-family: 'Courier New', Courier, monospace; font-size: 40px; font-weight: 800; letter-spacing: 8px; color: #ffffff;">${otp}</span>
    </div>
    <p style="color: #9CA3AF; font-size: 14px; line-height: 1.5; text-align: center; margin-bottom: 0;">
      If you did not request this code, please ignore this email or contact support if you have concerns.
    </p>
  </div>
  `;

  try {
    const info = await transporter.sendMail({
      from: process.env.SMTP_FROM || 'BayFlow <pyrohassan786@gmail.com>',
      to,
      subject,
      html: htmlContent,
    });
    console.log('Email sent successfully:', info.messageId);
    return info;
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};
