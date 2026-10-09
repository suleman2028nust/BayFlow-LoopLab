"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ArrowUpRight, ShieldCheck, Activity, ChevronDown } from "lucide-react";

interface NavbarProps {
  onOpenDemo?: () => void;
}

export default function Navbar({ onOpenDemo }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="w-full bg-[#fbfbfb] border-b border-gray-200 sticky top-0 z-50">
      {/* Top Telemetry Sub-header Strip */}
      <div className="border-b border-gray-200/80 bg-[#f4f4f5] text-[11px] font-mono-tech uppercase text-gray-500 py-1.5 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 text-gray-800 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              STATUS: ALL SYSTEMS OPERATIONAL
            </span>
            <span className="hidden sm:inline text-gray-300">|</span>
            <span className="hidden sm:inline text-gray-500">OCTOBER RELEASE (V1.2.4)</span>
          </div>

          <div className="flex items-center gap-3">
            <span className="hidden md:inline text-gray-500">UPTIME 99.98% / 24/7/365 REAL-TIME</span>
            <span className="hidden md:inline text-gray-300">|</span>
            <span className="inline-flex items-center gap-1 font-medium text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200/60">
              <Activity className="w-3 h-3" /> LATENCY: &lt;12ms
            </span>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <nav className="max-w-7xl mx-auto px-4 sm:px-8 py-3.5 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-7 h-7 bg-[#ff4d15] text-white flex items-center justify-center font-black text-sm rounded-sm transform group-hover:rotate-6 transition-transform">
            <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
              <path d="M12 2L2 22h20L12 2zm0 4.8l6.3 12.6H5.7L12 6.8z" />
            </svg>
          </div>
          <span className="font-display text-2xl font-bold tracking-tight text-gray-900">
            BAYFLOW
          </span>
        </Link>

        {/* Desktop Nav Links */}
        <div className="hidden md:flex items-center gap-8 text-[13px] font-medium tracking-wide">
          <Link
            href="#platform"
            className="text-[#ff4d15] font-semibold tracking-wider flex items-center gap-1 hover:text-[#e03e0a] transition-colors"
          >
            PLATFORM
          </Link>
          <Link
            href="#features"
            className="text-gray-600 hover:text-gray-900 tracking-wider transition-colors"
          >
            FEATURES
          </Link>
          <Link
            href="#live-demos"
            className="text-gray-600 hover:text-gray-900 tracking-wider transition-colors"
          >
            LIVE DEMOS
          </Link>
          <Link
            href="#docs"
            className="text-gray-600 hover:text-gray-900 tracking-wider transition-colors"
          >
            DOCUMENTATION
          </Link>
        </div>

        {/* Action Buttons */}
        <div className="hidden md:flex items-center gap-4">
          <button
            onClick={onOpenDemo}
            className="text-xs font-mono-tech tracking-wider text-gray-700 hover:text-gray-950 font-semibold px-2 py-1.5 transition-colors"
          >
            LOG IN
          </button>
          
          <button
            onClick={onOpenDemo}
            className="bg-[#ff4d15] hover:bg-[#e03e0a] text-white text-xs font-semibold uppercase tracking-wider px-5 py-2.5 rounded shadow-sm hover:shadow-md transition-all flex items-center gap-1.5 active:scale-95"
          >
            GET STARTED
          </button>

          <div className="w-7 h-7 rounded-full bg-emerald-800 text-white flex items-center justify-center text-[11px] font-mono-tech font-bold">
            0
          </div>
        </div>

        {/* Mobile menu button */}
        <div className="flex md:hidden items-center gap-2">
          <button
            onClick={onOpenDemo}
            className="bg-[#ff4d15] text-white text-xs font-semibold uppercase px-3 py-1.5 rounded"
          >
            GET STARTED
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-gray-700 hover:text-gray-900"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </nav>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-gray-200 bg-white px-4 py-4 space-y-3 font-medium text-sm"
          >
            <Link
              href="#platform"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-[#ff4d15] font-semibold"
            >
              PLATFORM
            </Link>
            <Link
              href="#features"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-gray-700"
            >
              FEATURES
            </Link>
            <Link
              href="#live-demos"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-gray-700"
            >
              LIVE DEMOS
            </Link>
            <Link
              href="#docs"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-gray-700"
            >
              DOCUMENTATION
            </Link>
            <div className="pt-2 border-t border-gray-100 flex gap-2">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenDemo?.();
                }}
                className="w-full bg-gray-100 text-gray-800 text-xs font-semibold py-2.5 rounded"
              >
                LOG IN
              </button>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenDemo?.();
                }}
                className="w-full bg-[#ff4d15] text-white text-xs font-semibold py-2.5 rounded"
              >
                GET STARTED
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
