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
    <header className="fixed top-0 left-0 w-full z-50 bg-white/90 backdrop-blur-xl border-b border-[#2C2421]/10 shadow-[0_4px_20px_rgba(44,36,33,0.04)]">
      <div className="h-16 w-full px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="flex items-center justify-center text-[#E85D22] transition-transform duration-300 group-hover:scale-105">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M2 17C6 17 8 7 12 7C16 7 18 17 22 17" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
              <path d="M5 12C8 12 9.5 9 12 9C14.5 9 16 12 19 12" stroke="currentColor" strokeLinecap="round" strokeOpacity="0.6" strokeWidth="1.5" />
            </svg>
          </div>
          <span className="font-headline text-xl font-bold uppercase tracking-wider text-[#2C2421]">
            BAYFLOW
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-6 lg:gap-8">
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
            Features
          </a>
          <a
            href="#how-it-works"
            className="text-xs uppercase tracking-widest text-[#6B5E59] hover:text-[#2C2421] transition-colors font-semibold"
          >
            How It Works
          </a>
          <a
            href="#workshops"
            className="text-xs uppercase tracking-widest text-[#6B5E59] hover:text-[#2C2421] transition-colors font-semibold"
          >
            For Workshops
          </a>
        </nav>

        {/* Action Controls */}
        <div className="flex items-center gap-3 sm:gap-4">
          <button
            onClick={onOpenDemo}
            className="hidden sm:inline-block text-xs uppercase tracking-widest text-[#6B5E59] hover:text-[#2C2421] transition-colors font-semibold"
          >
            Log In
          </button>
          <button
            onClick={onOpenDemo}
            className="bg-[#2C2421] hover:bg-[#1a1513] text-white text-xs uppercase tracking-widest px-4 py-2 rounded font-bold transition-all shadow-[0_4px_14px_rgba(44,36,33,0.25)] hover:shadow-[0_6px_18px_rgba(44,36,33,0.35)]"
          >
            Get Started
          </button>
          <div className="w-8 h-8 rounded-full bg-[#1F5C45] flex items-center justify-center text-white shadow-sm">
            <span className="material-symbols-outlined text-[18px]">person</span>
          </div>

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-1.5 text-[#2C2421] hover:bg-[#F4F4F1] rounded transition-colors"
            aria-label="Toggle navigation menu"
          >
            <span className="material-symbols-outlined text-2xl">
              {mobileMenuOpen ? "close" : "menu"}
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-b border-[#2C2421]/10 px-6 py-4 flex flex-col gap-4 shadow-lg"
          >
            <a
              href="#platform"
              onClick={() => setMobileMenuOpen(false)}
              className="text-xs uppercase tracking-widest text-[#E85D22] font-bold py-1"
            >
              Platform
            </a>
            <a
              href="#features"
              onClick={() => setMobileMenuOpen(false)}
              className="text-xs uppercase tracking-widest text-[#6B5E59] hover:text-[#2C2421] font-semibold py-1"
            >
              Features
            </a>
            <a
              href="#how-it-works"
              onClick={() => setMobileMenuOpen(false)}
              className="text-xs uppercase tracking-widest text-[#6B5E59] hover:text-[#2C2421] font-semibold py-1"
            >
              How It Works
            </a>
            <a
              href="#workshops"
              onClick={() => setMobileMenuOpen(false)}
              className="text-xs uppercase tracking-widest text-[#6B5E59] hover:text-[#2C2421] font-semibold py-1"
            >
              For Workshops
            </a>
            <div className="pt-2 border-t border-[#2C2421]/10 flex flex-col gap-2">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenDemo?.();
                }}
                className="w-full text-center py-2 text-xs uppercase tracking-widest text-[#6B5E59] font-bold"
              >
                Log In
              </button>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenDemo?.();
                }}
                className="w-full bg-[#2C2421] text-white text-xs uppercase tracking-widest py-2.5 rounded font-bold shadow-md"
              >
                Get Started
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
