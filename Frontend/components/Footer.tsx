"use client";

import React from "react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="w-full py-10 sm:py-12 border-t border-[#2C2421]/10 bg-[#F4F4F1]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-6">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="text-[#E85D22]">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M2 17C6 17 8 7 12 7C16 7 18 17 22 17"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                />
              </svg>
            </div>
            <span className="font-headline text-lg uppercase tracking-wider text-[#2C2421] font-bold">
              BAYFLOW
            </span>
          </Link>

          {/* Navigation Links */}
          <nav className="flex flex-wrap items-center gap-6 sm:gap-8">
            <a
              href="#platform"
              aria-current="page"
              className="text-xs uppercase tracking-widest text-[#E85D22] font-bold hover:text-[#d04e17] transition-colors"
            >
              Platform
            </a>
            <a
              href="#features"
              className="text-xs uppercase tracking-widest text-[#6B5E59] hover:text-[#2C2421] transition-colors font-semibold"
            >
              Solutions
            </a>
            <a
              href="#how-it-works"
              className="text-xs uppercase tracking-widest text-[#6B5E59] hover:text-[#2C2421] transition-colors font-semibold"
            >
              Company
            </a>
            <a
              href="#"
              className="text-xs uppercase tracking-widest text-[#6B5E59] hover:text-[#2C2421] transition-colors font-semibold"
            >
              Privacy
            </a>
            <a
              href="#"
              className="text-xs uppercase tracking-widest text-[#6B5E59] hover:text-[#2C2421] transition-colors font-semibold"
            >
              Terms
            </a>
          </nav>

          {/* System Operational Badge */}
          <div className="flex items-center gap-2 bg-white border border-[#1F5C45]/20 px-3 py-1.5 rounded shadow-[0_2px_6px_rgba(44,36,33,0.04)]">
            <span className="w-2 h-2 rounded-full bg-[#1F5C45] animate-pulse" />
            <span className="font-mono text-xs text-[#1F5C45] font-bold">
              SYSTEM OPERATIONAL (99.98%)
            </span>
          </div>
        </div>

        {/* Sub-Footer */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 pt-4 text-[#6B5E59] font-mono text-xs border-t border-[#2C2421]/5">
          <p>© 2025 BayFlow Technologies. Precision Workshop Intelligence.</p>
          <p className="text-[#8C7E78] font-semibold tracking-wider uppercase">
            TELEMETRY DECK ENGAGED
          </p>
        </div>
      </div>
    </footer>
  );
}
