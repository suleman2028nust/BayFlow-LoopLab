"use client";

import React from "react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-[#fbfbfb] border-t border-gray-200 text-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 sm:py-10">
        {/* Main Footer Row */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-6 border-b border-gray-200">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-6 h-6 bg-[#ff4d15] text-white flex items-center justify-center font-black text-xs rounded-sm">
              <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-current">
                <path d="M12 2L2 22h20L12 2zm0 4.8l6.3 12.6H5.7L12 6.8z" />
              </svg>
            </div>
            <span className="font-display text-xl font-bold tracking-tight text-gray-900">
              BAYFLOW
            </span>
          </Link>

          {/* Nav Links */}
          <div className="flex flex-wrap items-center gap-6 text-xs font-mono-tech uppercase">
            <Link
              href="#platform"
              className="text-[#ff4d15] font-bold hover:text-[#e03e0a] transition-colors"
            >
              PLATFORM
            </Link>
            <Link
              href="#features"
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              SOLUTIONS
            </Link>
            <Link
              href="#contact"
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              CONTACT
            </Link>
            <Link
              href="#privacy"
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              PRIVACY
            </Link>
            <Link
              href="#terms"
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              TERMS
            </Link>
          </div>

          {/* Status Operational */}
          <div className="inline-flex items-center gap-2 text-xs font-mono-tech uppercase text-gray-800 bg-gray-100 px-3 py-1.5 rounded border border-gray-200">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-semibold">STATUS: OPERATIONAL (99.98%)</span>
          </div>
        </div>

        {/* Bottom copyright line */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs font-mono-tech text-gray-500 gap-3 text-center sm:text-left">
          <div>
            © 2026 BayFlow Technologies. Precision Workshop Intelligence.
          </div>
          <div className="tracking-wider">
            FOLLOW US // <span className="hover:text-gray-900 cursor-pointer">X</span> / <span className="hover:text-gray-900 cursor-pointer">IG</span> / <span className="hover:text-gray-900 cursor-pointer">DISCORD</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
