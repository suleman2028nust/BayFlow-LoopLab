import { Client, LocalAuth } from 'whatsapp-web.js';
import QRCode from 'qrcode';
import fs from 'fs';
import path from 'path';

let qrCodeData: string | null = null;
let isConnected = false;
let client: Client | null = null;

// Catch unhandled Chrome launcher errors so cloud hosts (Render) never crash
process.on('unhandledRejection', (reason: any) => {
  const msg = String(reason?.message || reason);
  if (msg.includes('Could not find Chrome') || msg.includes('puppeteer')) {
    console.warn('⚠️ [WhatsApp] Chrome headless browser not available on cloud host; standby mode active.');
    return;
  }
});

function findChromeInCache(): string | undefined {
  const searchDirs = [
    path.resolve(process.cwd(), '.cache', 'puppeteer'),
    path.resolve(process.cwd(), '..', '.cache', 'puppeteer'),
    '/opt/render/project/src/Backend/.cache/puppeteer',
    '/opt/render/.cache/puppeteer',
  ];

  function walk(dir: string): string | undefined {
    try {
      if (!fs.existsSync(dir)) return undefined;
      const entries = fs.readdirSync(dir, { withFileTypes: true });
      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
          const res = walk(fullPath);
          if (res) return res;
        } else if (
          entry.isFile() &&
          (entry.name === 'chrome' || entry.name === 'chrome.exe' || entry.name === 'chromium')
        ) {
          return fullPath;
        }
      }
    } catch {
      return undefined;
    }
    return undefined;
  }

  for (const dir of searchDirs) {
    const found = walk(dir);
    if (found) return found;
  }
  return undefined;
}

// Auto-detect installed Chrome or Edge executable on Windows & Linux
function getExecutablePath(): string | undefined {
  if (process.env.PUPPETEER_EXECUTABLE_PATH && fs.existsSync(process.env.PUPPETEER_EXECUTABLE_PATH)) {
    return process.env.PUPPETEER_EXECUTABLE_PATH;
  }

  const cached = findChromeInCache();
  if (cached) return cached;

  if (process.platform === 'win32') {
    const windowsPaths = [
      'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
      'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
      'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
      'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
      `${process.env.LOCALAPPDATA || ''}\\Google\\Chrome\\Application\\chrome.exe`,
      `${process.env.LOCALAPPDATA || ''}\\Microsoft\\Edge\\Application\\msedge.exe`,
    ];
    for (const p of windowsPaths) {
      if (fs.existsSync(p)) return p;
    }
  } else if (process.platform === 'linux') {
    const linuxPaths = [
      '/usr/bin/google-chrome-stable',
      '/usr/bin/google-chrome',
      '/usr/bin/chromium-browser',
      '/usr/bin/chromium',
    ];
    for (const p of linuxPaths) {
      if (fs.existsSync(p)) return p;
    }
  }
  return undefined;
}

const execPath = getExecutablePath();

// Initialize WhatsApp client unless explicitly disabled
const shouldStartWhatsApp = process.env.DISABLE_WHATSAPP !== 'true';

if (shouldStartWhatsApp) {
  try {
    client = new Client({
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
          '--disable-gpu',
        ],
      },
    });

    client.on('qr', async (qr) => {
      try {
        const terminalQr = await QRCode.toString(qr, { type: 'terminal', small: true });
        console.log('\n📱 [WHATSAPP QR CODE] Scan with WhatsApp:\n' + terminalQr);
      } catch (err) {}
      try {
        qrCodeData = await QRCode.toDataURL(qr);
      } catch (e) {}
    });

    client.on('ready', () => {
      console.log('\n✅ [WhatsApp] Connected and ready to dispatch notifications!\n');
      isConnected = true;
      qrCodeData = null;
    });

    client.on('disconnected', () => {
      console.log('\n❌ [WhatsApp] Disconnected. Re-initializing session...\n');
      isConnected = false;
      if (client) {
        client.initialize().catch(() => {});
      }
    });

    client.initialize().catch((err) => {
      console.warn('⚠️ [WhatsApp] Headless Chrome could not be initialized:', err.message || err);
      client = null;
    });
  } catch (err: any) {
    console.warn('⚠️ [WhatsApp] Client initialization skipped:', err.message || err);
    client = null;
  }
} else {
  console.log('ℹ️ [WhatsApp] Running in Cloud Standby mode (Chrome not detected on Linux host).');
}

export const WhatsAppService = {
  // 1. Get QR Code for the Frontend
  getQrCode() {
    if (isConnected) {
      return { status: 'CONNECTED', message: 'WhatsApp is already connected!' };
    }
    if (qrCodeData) {
      return { status: 'QR_READY', qrCode: qrCodeData };
    }
    return {
      status: 'STANDBY',
      message: 'WhatsApp Web is on standby (requires desktop Chrome session). In-app alerts are active.',
    };
  },

  // 2. Send Message directly from Node.js with graceful fallback
  async sendMessage(phone: string, text: string) {
    if (!client || !isConnected) {
      console.log(`💬 [WhatsApp Offline / Mock Dispatch] To: ${phone} | Content: ${text}`);
      return;
    }

    try {
      let cleanPhone = phone.replace(/[^0-9]/g, '');
      if (cleanPhone.startsWith('03')) {
        cleanPhone = '92' + cleanPhone.substring(1);
      }
      const formattedPhone = cleanPhone + '@c.us';
      await client.sendMessage(formattedPhone, text);
      console.log(`✅ WhatsApp message sent successfully to ${formattedPhone}`);
    } catch (error: any) {
      console.warn('⚠️ [WhatsApp Dispatch Warning]:', error.message || error);
    }
  },
};
