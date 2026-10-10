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
