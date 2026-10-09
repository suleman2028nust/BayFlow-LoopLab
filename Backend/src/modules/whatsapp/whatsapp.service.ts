import { Client, LocalAuth } from 'whatsapp-web.js';
import QRCode from 'qrcode';

import fs from 'fs';

let qrCodeData: string | null = null;
let isConnected = false;

// Auto-detect installed Chrome or Edge executable on Windows
function getExecutablePath() {
  const possiblePaths = [
    'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
    `${process.env.LOCALAPPDATA || ''}\\Google\\Chrome\\Application\\chrome.exe`,
    `${process.env.LOCALAPPDATA || ''}\\Microsoft\\Edge\\Application\\msedge.exe`,
  ];
  for (const p of possiblePaths) {
    if (fs.existsSync(p)) return p;
  }
  return undefined;
}

const execPath = getExecutablePath();

// Initialize the WhatsApp Client
const client = new Client({
  authStrategy: new LocalAuth({ dataPath: './.wwebjs_auth' }),
  puppeteer: {
    executablePath: execPath,
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-accelerated-2d-canvas',
      '--no-first-run',
      '--no-zygote',
      '--disable-gpu'
    ],
  }
});

client.on('qr', async (qr) => {
  // Generate QR code as a base64 Data URI so frontend can render it easily via <img src="..." />
  console.log('\n======================================================');
  console.log('📱 [WHATSAPP QR CODE] Scan with WhatsApp on your phone:');
  console.log('======================================================');
  try {
    const terminalQr = await QRCode.toString(qr, { type: 'terminal', small: true });
    console.log(terminalQr);
  } catch (err) {
    // ignore terminal format error if any
  }
  qrCodeData = await QRCode.toDataURL(qr);
  console.log('Frontend QR ready at: http://localhost:3000/owner/whatsapp\n');
});

client.on('ready', () => {
  console.log('\n✅ [WhatsApp] Connected and ready to send messages!\n');
  isConnected = true;
  qrCodeData = null; // Clear QR code as it's no longer needed
});

client.on('disconnected', () => {
  console.log('\n❌ [WhatsApp] Disconnected! Regenerating session...\n');
  isConnected = false;
  client.initialize(); // Try to get a new QR code
});

// Automatically start the headless browser in the background when the server starts
client.initialize();

export const WhatsAppService = {
  // 1. Get QR Code for the Frontend
  getQrCode() {
    if (isConnected) {
      return { status: 'CONNECTED', message: 'WhatsApp is already connected!' };
    }
    if (qrCodeData) {
      return { status: 'QR_READY', qrCode: qrCodeData }; // Base64 Image
    }
    return { status: 'INITIALIZING', message: 'Generating QR Code, please wait a few seconds...' };
  },

  // 2. Send Message directly from Node.js
  async sendMessage(phone: string, text: string) {
    if (!isConnected) {
      console.log(`[WhatsApp Not Connected] 💬 Mock Message to ${phone}: ${text}`);
      return;
    }

    try {
      // Format phone number to WhatsApp ID (e.g., 923001234567@c.us)
      let cleanPhone = phone.replace(/[^0-9]/g, '');
      
      // If it starts with 03 (Pakistani format), replace 0 with 92
      if (cleanPhone.startsWith('03')) {
        cleanPhone = '92' + cleanPhone.substring(1);
      }
      
      const formattedPhone = cleanPhone + '@c.us';
      await client.sendMessage(formattedPhone, text);
      console.log(`✅ WhatsApp message sent successfully to ${formattedPhone}`);
    } catch (error) {
      console.error('WhatsApp Service Error:', error);
    }
  }
};
