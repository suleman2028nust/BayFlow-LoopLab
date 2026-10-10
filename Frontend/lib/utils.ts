/**
 * Utility helpers for user display names and browser notifications
 */

export function formatUserName(
  user?: { email?: string; phoneNumber?: string; name?: string; role?: string } | null,
  fallback = "Staff Member"
): string {
  if (!user) return fallback;
  if (user.name && user.name.trim()) return user.name.trim();

  if (user.email) {
    const emailLower = user.email.toLowerCase();
    
    // Recognizable demo / standard accounts with real human names
    if (emailLower.includes("bilal")) return "Bilal";
    if (emailLower.includes("imran")) return "Imran";
    if (emailLower.includes("sara")) return "Sara";
    if (emailLower.includes("usman")) return "Usman";
    if (emailLower.includes("fatima")) return "Fatima Raza";
    if (emailLower.includes("ahmed")) return "Ahmed Khan";
    if (emailLower.includes("hjamal")) return "Hassan Jamal";

    const localPart = user.email.split("@")[0];
    const cleaned = localPart
      .replace(/[._\-+0-9]/g, " ")
      .split(" ")
      .filter((w) => w.length > 1)
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");

    return cleaned || localPart;
  }

  if (user.phoneNumber) return user.phoneNumber;
  return fallback;
}

/**
 * Synthesizes a gentle dual-tone notification chime using Web Audio API
 */
export function playNotificationChime() {
  if (typeof window === "undefined") return;
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;

    const ctx = new AudioContextClass();
    const now = ctx.currentTime;

    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gain = ctx.createGain();

    osc1.type = "sine";
    osc2.type = "triangle";

    // Pleasant high chime: D5 (587.33Hz) -> A5 (880Hz)
    osc1.frequency.setValueAtTime(587.33, now);
    osc1.frequency.exponentialRampToValueAtTime(880, now + 0.12);

    osc2.frequency.setValueAtTime(880, now);
    osc2.frequency.exponentialRampToValueAtTime(1174.66, now + 0.15);

    gain.gain.setValueAtTime(0.001, now);
    gain.gain.exponentialRampToValueAtTime(0.25, now + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.45);

    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(ctx.destination);

    osc1.start(now);
    osc2.start(now);
    osc1.stop(now + 0.5);
    osc2.stop(now + 0.5);
  } catch (err) {
    // Audio context may be restricted before first gesture; quietly ignore
  }
}

let activeRingtoneCtx: AudioContext | null = null;
let ringtoneInterval: any = null;
let outgoingRingtoneCtx: AudioContext | null = null;
let outgoingInterval: any = null;

// Helper to resume audio context on any user interaction if suspended
function ensureAudioContextResumed(ctx: AudioContext) {
  if (typeof window === "undefined") return;
  if (ctx.state === "suspended") {
    const unlock = () => {
      if (ctx && ctx.state === "suspended") {
        ctx.resume().catch(() => {});
      }
      window.removeEventListener("click", unlock);
      window.removeEventListener("keydown", unlock);
      window.removeEventListener("touchstart", unlock);
    };
    window.addEventListener("click", unlock, { once: true });
    window.addEventListener("keydown", unlock, { once: true });
    window.addEventListener("touchstart", unlock, { once: true });
  }
}

/**
 * Plays a realistic repeating incoming telephone ringtone (dual-frequency 440Hz + 480Hz)
 */
export function startPhoneRingtone() {
  if (typeof window === "undefined") return;
  stopPhoneRingtone();

  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;

    activeRingtoneCtx = new AudioContextClass();
    ensureAudioContextResumed(activeRingtoneCtx);

    const playRingBurst = () => {
      if (!activeRingtoneCtx || activeRingtoneCtx.state === "closed") return;
      const ctx = activeRingtoneCtx;
      if (ctx.state === "suspended") {
        ctx.resume().catch(() => {});
      }
      const now = ctx.currentTime;

      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();

      osc1.type = "sine";
      osc2.type = "sine";
      osc1.frequency.setValueAtTime(440, now);
      osc2.frequency.setValueAtTime(480, now);

      // Ring burst 1 (0.4s)
      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.25, now + 0.05);
      gain.gain.setValueAtTime(0.25, now + 0.35);
      gain.gain.linearRampToValueAtTime(0.001, now + 0.4);

      // Ring burst 2 (0.4s) after 0.2s pause
      gain.gain.setValueAtTime(0.001, now + 0.6);
      gain.gain.linearRampToValueAtTime(0.25, now + 0.65);
      gain.gain.setValueAtTime(0.25, now + 0.95);
      gain.gain.linearRampToValueAtTime(0.001, now + 1.0);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(ctx.destination);

      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + 1.05);
      osc2.stop(now + 1.05);
    };

    playRingBurst();
    ringtoneInterval = setInterval(playRingBurst, 3000);
  } catch (err) {
    // Ignore audio context restriction
  }
}

/**
 * Stops incoming telephone ringtone immediately
 */
export function stopPhoneRingtone() {
  if (ringtoneInterval) {
    clearInterval(ringtoneInterval);
    ringtoneInterval = null;
  }
  if (activeRingtoneCtx) {
    try {
      activeRingtoneCtx.close();
    } catch (err) {}
    activeRingtoneCtx = null;
  }
}

/**
 * Plays outgoing ringback tone for caller (standard 440Hz + 480Hz long pulses)
 */
export function startOutgoingRingtone() {
  if (typeof window === "undefined") return;
  stopOutgoingRingtone();

  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;

    outgoingRingtoneCtx = new AudioContextClass();
    ensureAudioContextResumed(outgoingRingtoneCtx);

    const playRingback = () => {
      if (!outgoingRingtoneCtx || outgoingRingtoneCtx.state === "closed") return;
      const ctx = outgoingRingtoneCtx;
      if (ctx.state === "suspended") {
        ctx.resume().catch(() => {});
      }
      const now = ctx.currentTime;

      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();

      osc1.type = "sine";
      osc2.type = "sine";
      osc1.frequency.setValueAtTime(440, now);
      osc2.frequency.setValueAtTime(480, now);

      // Single long ringback pulse (1.6s on, 2.4s off)
      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.12, now + 0.1);
      gain.gain.setValueAtTime(0.12, now + 1.5);
      gain.gain.linearRampToValueAtTime(0.001, now + 1.6);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(ctx.destination);

      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + 1.65);
      osc2.stop(now + 1.65);
    };

    playRingback();
    outgoingInterval = setInterval(playRingback, 4000);
  } catch (err) {}
}

/**
 * Stops outgoing telephone ringback immediately
 */
export function stopOutgoingRingtone() {
  if (outgoingInterval) {
    clearInterval(outgoingInterval);
    outgoingInterval = null;
  }
  if (outgoingRingtoneCtx) {
    try {
      outgoingRingtoneCtx.close();
    } catch (err) {}
    outgoingRingtoneCtx = null;
  }
}
