import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        bay: {
          orange: "#ff4d15",
          "orange-dark": "#e03e0a",
          "orange-light": "#fff2ed",
          dark: "#0d0e11",
          card: "#ffffff",
          border: "#e5e7eb",
          muted: "#64748b",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "sans-serif"],
        display: ["var(--font-oswald)", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      boxShadow: {
        soft: "0 2px 15px -3px rgba(0, 0, 0, 0.05), 0 4px 6px -2px rgba(0, 0, 0, 0.02)",
        card: "0 10px 30px -5px rgba(0, 0, 0, 0.08)",
        floating: "0 20px 40px -15px rgba(0, 0, 0, 0.12)",
        glow: "0 0 25px -5px rgba(255, 77, 21, 0.35)",
      },
      letterSpacing: {
        tighter: "-0.04em",
        tight: "-0.02em",
        wide: "0.05em",
        widest: "0.15em",
      },
    },
  },
  plugins: [],
};
export default config;
