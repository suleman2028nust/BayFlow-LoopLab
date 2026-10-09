import { Client, LocalAuth } from 'whatsapp-web.js';
import QRCode from 'qrcode';

let qrCodeData: string | null = null;
let isConnected = false;

// Initialize the WhatsApp Client
const client = new Client({
  authStrategy: new LocalAuth(), // Saves the session automatically in .wwebjs_auth/
  puppeteer: {
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  }
});

client.on('qr', async (qr) => {
  // Generate QR code as a base64 Data URI so frontend can render it easily via <img src="..." />
  console.log('\n[WhatsApp] QR Code received. Fetch it from the frontend to scan.\n');
  qrCodeData = await QRCode.toDataURL(qr);
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
