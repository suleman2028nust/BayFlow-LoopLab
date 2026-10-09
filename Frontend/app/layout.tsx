import type { Metadata } from "next";
import { Oswald, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const oswald = Oswald({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-display",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "BayFlow - Precision Workshop Intelligence & Automation",
  description: "One intelligent, mission-critical platform engineered for bookings, technician dispatch, telemetry stream repairs, inventory, and automated customer concierge.",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${oswald.variable} ${inter.variable} ${jetbrainsMono.variable}`}>
      <body className="antialiased bg-[#fbfbfb] text-[#111215] font-sans selection:bg-[#ff4d15] selection:text-white min-h-screen">
        {children}
      </body>
    </html>
  );
}
