import type { Metadata } from "next";
import "./globals.css";

import IncomingCallOverlay from "@/components/IncomingCallOverlay";

export const metadata: Metadata = {
  title: "BayFlow | Multi-Tenant Auto Repair Shop Management Platform",
  description:
    "Unified auto repair platform featuring customer online booking, 5-role shop POS workflow, inventory management, WebRTC calling, and AI Front Desk.",
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
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-[#F4F4F1] text-[#2C2421] font-sans antialiased selection:bg-[#1F5C45] selection:text-white min-h-screen">
        {children}
        <IncomingCallOverlay />
      </body>


    </html>
  );
}


