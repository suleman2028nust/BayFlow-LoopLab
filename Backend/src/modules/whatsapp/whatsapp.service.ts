/**
 * WhatsApp Service — powered by @whiskeysockets/baileys
 *
 * Pure Node.js WebSocket connection to WhatsApp.
 * NO Puppeteer. NO Chrome. NO browser.
 *
 * First run: QR code is generated → scan once with phone → session saved to disk.
 * All future restarts: session is restored automatically, no re-scan needed.
 */

import makeWASocket, {
  useMultiFileAuthState,
  DisconnectReason,
  fetchLatestBaileysVersion,
  makeCacheableSignalKeyStore,
  WASocket,
} from '@whiskeysockets/baileys';
import { Boom } from '@hapi/boom';
import QRCode from 'qrcode';
import path from 'path';
import pino from 'pino';

// ─── State ───────────────────────────────────────────────────────────────────

let sock: WASocket | null = null;
let isConnected = false;
let currentQrDataUrl: string | null = null;
let initStarted = false;

// Session stored on disk — survives server restarts
const AUTH_DIR = path.resolve(process.cwd(), '.wa_session');

const logger = pino({ level: 'silent' }); // suppress noisy baileys logs

// ─── Connect ─────────────────────────────────────────────────────────────────

async function connect(): Promise<void> {
  const { state, saveCreds } = await useMultiFileAuthState(AUTH_DIR);
  const { version } = await fetchLatestBaileysVersion();

  sock = makeWASocket({
    version,
    logger,
    auth: {
      creds: state.creds,
      keys: makeCacheableSignalKeyStore(state.keys, logger),
    },
    printQRInTerminal: false, // we handle QR ourselves
    browser: ['BayFlow', 'Chrome', '3.0.0'],
    connectTimeoutMs: 60_000,
    keepAliveIntervalMs: 30_000,
    retryRequestDelayMs: 2000,
  });

  // ── QR code ──────────────────────────────────────────────────────────────
  sock.ev.on('connection.update', async (update) => {
    const { connection, lastDisconnect, qr } = update;

    if (qr) {
      try {
        const terminalQr = await QRCode.toString(qr, { type: 'terminal', small: true });
        console.log('\n📱 [WhatsApp] Scan this QR code:\n' + terminalQr);
        currentQrDataUrl = await QRCode.toDataURL(qr);
        isConnected = false;
      } catch (_) {}
    }

    if (connection === 'open') {
      console.log('\n✅ [WhatsApp] Connected via Baileys — ready to send messages!\n');
      isConnected = true;
      currentQrDataUrl = null;
    }

    if (connection === 'close') {
      isConnected = false;
      const reason = (lastDisconnect?.error as Boom)?.output?.statusCode;
      const shouldReconnect = reason !== DisconnectReason.loggedOut;
      console.log(`⚠️ [WhatsApp] Connection closed (reason: ${reason}). Reconnect: ${shouldReconnect}`);
      if (shouldReconnect) {
        await connect(); // auto-reconnect
      } else {
        console.log('🔒 [WhatsApp] Logged out. Delete .wa_session folder and restart to re-scan QR.');
        currentQrDataUrl = null;
        sock = null;
      }
    }
  });

  // ── Persist credentials on every update ──────────────────────────────────
  sock.ev.on('creds.update', saveCreds);
}

// Start Baileys on module load
(async () => {
  if (initStarted) return;
  initStarted = true;
  try {
    await connect();
  } catch (err: any) {
    console.error('❌ [WhatsApp] Failed to initialise Baileys:', err?.message || err);
  }
})();

// ─── Public API ──────────────────────────────────────────────────────────────

export const WhatsAppService = {

  /** Called by the QR endpoint so the frontend page can display status / QR image */
  getQrCode() {
    if (isConnected) {
      return { status: 'CONNECTED', message: '✅ WhatsApp connected! Messages will be delivered.' };
    }
    if (currentQrDataUrl) {
      return { status: 'QR_READY', qrCode: currentQrDataUrl };
    }
    return {
      status: 'INITIALIZING',
      message: 'WhatsApp engine is starting up. QR code will appear in a few seconds — refresh the page.',
    };
  },

  /** Send a WhatsApp message to any phone number */
  async sendMessage(phone: string, text: string): Promise<void> {
    if (!sock || !isConnected) {
      console.log(`💬 [WhatsApp Offline] To: ${phone} | ${text}`);
      return;
    }

    try {
      // Normalise number → remove non-digits, append @s.whatsapp.net
      const digits = phone.replace(/[^0-9]/g, '');
      const jid = `${digits}@s.whatsapp.net`;
      await sock.sendMessage(jid, { text });
      console.log(`✅ [WhatsApp] Message sent to ${phone}`);
    } catch (err: any) {
      console.error(`❌ [WhatsApp] sendMessage error: ${err?.message || err}`);
    }
  },
};
