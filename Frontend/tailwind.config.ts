import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "bay-espresso": "#2C2421",
        "bay-orange": "#E85D22",
        "bay-emerald": "#1F5C45",
        "bay-stone": "#8C7E78",
        "bay-muted": "#6B5E59",
        "bay-cream": "#F4F4F1",
        "bay-surface": "#F8F8F5",
        "bay-card": "#FFFFFF",
      },
      fontFamily: {
        sans: [
          "var(--font-chivo)",
          "Chivo",
          "system-ui",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Roboto",
          "sans-serif",
        ],
        headline: [
          "var(--font-barlow)",
          "Barlow Condensed",
          "Impact",
          "Arial Narrow",
          "sans-serif",
        ],
        "headline-lg": ["var(--font-barlow)", "Barlow Condensed", "sans-serif"],
        "headline-md": ["var(--font-barlow)", "Barlow Condensed", "sans-serif"],
        "headline-sm": ["var(--font-barlow)", "Barlow Condensed", "sans-serif"],
        "body-lg": ["var(--font-chivo)", "Chivo", "sans-serif"],
        "body-md": ["var(--font-chivo)", "Chivo", "sans-serif"],
        "body-sm": ["var(--font-chivo)", "Chivo", "sans-serif"],
        "label-caps": ["var(--font-chivo)", "Chivo", "sans-serif"],
        "label-mono-num": ["var(--font-chivo)", "monospace"],
      },
      spacing: {
        gutter: "1.5rem",
        "space-xs": "0.25rem",
        "space-sm": "0.5rem",
        "space-md": "1rem",
        "space-lg": "1.5rem",
        "space-xl": "2.5rem",
      },
    },
  },
  plugins: [],
};
export default config;
