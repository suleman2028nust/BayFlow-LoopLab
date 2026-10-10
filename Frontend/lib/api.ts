export const API_BASE_URL = (() => {
  // If explicitly configured in environment to a non-localhost URL, use it
  if (process.env.NEXT_PUBLIC_API_URL && !process.env.NEXT_PUBLIC_API_URL.includes("localhost")) {
    return process.env.NEXT_PUBLIC_API_URL;
  }

  // In the browser, detect whether we are on a production domain (Vercel, custom domain)
  if (typeof window !== "undefined") {
    const host = window.location.hostname;
    if (host !== "localhost" && host !== "127.0.0.1") {
      return "https://bayflow-looplab-1.onrender.com";
    }
  }

  // In server-side production build
  if (process.env.NODE_ENV === "production" || process.env.VERCEL) {
    return "https://bayflow-looplab-1.onrender.com";
  }

  // Local development fallback
  return "http://localhost:4000";
})();
