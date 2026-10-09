"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

interface NavbarProps {
  onOpenDemo?: () => void;
}

export default function Navbar({ onOpenDemo }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="fixed top-5 left-0 w-full z-50 px-4 sm:px-6 lg:px-8">
      {/* Warm Alabaster & Emerald Pine Floating Rounded Pill Navbar */}
      <div className="max-w-5xl mx-auto h-14 bg-white/95 backdrop-blur-md border border-[#2C2421]/15 rounded-full shadow-[0_4px_20px_rgba(44,36,33,0.06)] px-4 sm:px-6 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-full bg-[#111827] text-white flex items-center justify-center font-bold shadow-md shadow-[#111827]/20 group-hover:scale-105 transition-transform">
            <span className="material-symbols-outlined text-lg">
              build_circle
            </span>
          </div>
          <span className="font-headline text-base font-extrabold tracking-tight text-[#2C2421]">
            BAYFLOW
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-6 lg:gap-8 text-xs font-semibold text-[#2C2421]/80">
          <a
            href="#platform"
            className="hover:text-[#111827] transition-colors"
          >
            Platform
          </a>
          <a
            href="#roles-pos"
            className="hover:text-[#111827] transition-colors"
          >
            Shop POS
          </a>
          <a
            href="#ai-concierge"
            className="hover:text-[#111827] transition-colors"
          >
            AI Front Desk
          </a>
          <a
            href="#how-it-works"
            className="hover:text-[#111827] transition-colors"
          >
            Workflow
          </a>
          <a
            href="#shop-access"
            className="hover:text-[#111827] transition-colors"
          >
            Roles
          </a>
        </nav>

        {/* Action Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={onOpenDemo}
            className="hidden sm:inline-flex items-center gap-1 px-3.5 py-1.5 rounded-full text-xs font-semibold text-[#2C2421] hover:bg-[#F4F4F1] transition-all"
          >
            Sign In
          </button>
          <button
            onClick={onOpenDemo}
            className="bg-[#111827] hover:bg-[#0F172A] text-white text-xs font-bold px-4 py-2 rounded-full transition-all shadow-md shadow-[#111827]/20 flex items-center gap-1 hover:scale-105 active:scale-95"
          >
            <span>Launch Platform</span>
            <span className="material-symbols-outlined text-sm">arrow_forward</span>
          </button>

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-1.5 text-[#2C2421] hover:bg-[#F4F4F1] rounded-full transition-colors"
            aria-label="Toggle navigation menu"
          >
            <span className="material-symbols-outlined text-xl">
              {mobileMenuOpen ? "close" : "menu"}
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            className="md:hidden mt-3 max-w-sm mx-auto bg-white border border-[#2C2421]/15 rounded-2xl px-6 py-5 flex flex-col gap-3 text-sm font-medium text-[#2C2421] shadow-xl"
          >
            <a
              href="#platform"
              onClick={() => setMobileMenuOpen(false)}
              className="hover:text-[#111827] py-1"
            >
              Platform Overview
            </a>
            <a
              href="#roles-pos"
              onClick={() => setMobileMenuOpen(false)}
              className="hover:text-[#111827] py-1"
            >
              Shop POS Dashboards
            </a>
            <a
              href="#ai-concierge"
              onClick={() => setMobileMenuOpen(false)}
              className="hover:text-[#111827] py-1"
            >
              AI Front Desk &amp; Calling
            </a>
            <a
              href="#how-it-works"
              onClick={() => setMobileMenuOpen(false)}
              className="hover:text-[#111827] py-1"
            >
              Booking Lifecycle
            </a>
            <a
              href="#shop-access"
              onClick={() => setMobileMenuOpen(false)}
              className="hover:text-[#111827] py-1"
            >
              Role Directory
            </a>
            <div className="pt-3 border-t border-[#2C2421]/10 flex flex-col gap-2">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenDemo?.();
                }}
                className="w-full bg-[#111827] hover:bg-[#0F172A] text-white text-xs font-bold py-2.5 rounded-full shadow"
              >
                Launch Platform
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
