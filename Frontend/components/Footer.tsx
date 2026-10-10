"use client";

import React from "react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="w-full bg-[#F4F4F1] border-t border-[#2C2421]/15 py-12 px-4 sm:px-6 lg:px-8 text-xs text-[#2C2421]/70">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-lg bg-[#111827] text-white flex items-center justify-center font-bold text-sm">
            <span className="material-symbols-outlined text-white text-base">build_circle</span>
          </div>
          <span className="font-headline font-extrabold text-[#2C2421] text-sm tracking-tight">
            BAYFLOW
          </span>
          <span className="text-[#2C2421]/40">|</span>
          <span>Multi-Tenant Auto Repair Shop Platform</span>
        </div>

        <div className="flex items-center gap-6 font-medium text-[#2C2421]">
          <Link href="/shops" className="hover:text-[#111827] transition-colors">Find Shops</Link>
          <Link href="/book" className="hover:text-[#111827] transition-colors font-bold text-[#111827]">Guided Booking</Link>
          <Link href="/dashboard" className="hover:text-[#111827] transition-colors">Unified Dashboard</Link>
        </div>

        <div className="text-[#2C2421]/50 text-[11px] font-mono">
          BayFlow Auto Repair OS • 2026
        </div>
      </div>
    </footer>
  );
}
