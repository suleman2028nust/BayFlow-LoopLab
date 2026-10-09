import type { Metadata } from "next";
import { Barlow_Condensed, Chivo } from "next/font/google";
import "./globals.css";

const barlowCondensed = Barlow_Condensed({
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  variable: "--font-barlow",
  display: "swap",
});

const chivo = Chivo({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-chivo",
  display: "swap",
});

export const metadata: Metadata = {
  title: "BAYFLOW | Precision Workshop Intelligence & Automation",
  description:
    "One intelligent, mission-critical platform engineered for bookings, technician dispatch, telemetry-linked repairs, inventory, and automated customer concierge.",
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
    <html lang="en" className={`${barlowCondensed.variable} ${chivo.variable} scroll-smooth`}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@600;700;800&family=Chivo:wght@400;600;700&family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-[#F4F4F1] text-[#2C2421] antialiased selection:bg-[#E85D22] selection:text-white min-h-screen">
        {children}
      </body>
    </html>
  );
}
