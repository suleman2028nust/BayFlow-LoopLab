"use client";

import React from "react";
import { motion } from "framer-motion";

interface CtaSectionProps {
  onOpenDemo?: () => void;
}

export default function CtaSection({ onOpenDemo }: CtaSectionProps) {
  return (
    <section className="relative w-full px-4 sm:px-6 lg:px-8 py-20 sm:py-28 overflow-hidden border-t border-[#2C2421]/10 bg-[#F8F8F5]">
      {/* Radial gradient glow */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(232,93,34,0.06)_0%,_transparent_70%)]" />

      <div className="max-w-4xl mx-auto text-center relative z-10 flex flex-col items-center gap-6 sm:gap-8">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex items-center gap-2 px-3.5 py-1 bg-white rounded-full border border-[#1F5C45]/30 text-[#1F5C45] text-xs uppercase font-bold shadow-[0_2px_8px_rgba(44,36,33,0.04)]"
        >
          <span className="w-2 h-2 rounded-full bg-[#1F5C45] animate-ping" />
          <span>DEPLOY PRESTIGE TELEMETRY TODAY</span>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="font-headline text-[clamp(2.75rem,7vw,5.5rem)] uppercase text-[#2C2421] font-black leading-tight tracking-tight"
        >
          YOUR WORKSHOP.
          <br />
          A BETTER WAY.
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-base sm:text-lg text-[#6B5E59] max-w-xl font-light leading-relaxed"
        >
          Bring bookings, repair stages, OEM parts catalogs, and autonomous customer concierge together under one flawless platform.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-wrap items-center justify-center gap-4 pt-2"
        >
          <button
            onClick={onOpenDemo}
            className="bg-[#2C2421] hover:bg-[#1a1513] text-white text-xs uppercase tracking-widest px-8 py-4 rounded font-bold shadow-[0_8px_24px_rgba(44,36,33,0.3)] hover:shadow-[0_10px_30px_rgba(44,36,33,0.4)] transition-all flex items-center gap-2 group"
          >
            <span>Get Started Now</span>
            <span className="material-symbols-outlined text-[18px] group-hover:scale-110 transition-transform">
              speed
            </span>
          </button>
          <button
            onClick={onOpenDemo}
            className="bg-white hover:bg-[#F4F4F1] text-[#2C2421] text-xs uppercase tracking-widest px-6 py-4 rounded font-bold border border-[#2C2421]/20 shadow-[0_2px_8px_rgba(44,36,33,0.06)] hover:border-[#2C2421]/40 transition-all"
          >
            Schedule Workshop Demo
          </button>
        </motion.div>
      </div>
    </section>
  );
}
