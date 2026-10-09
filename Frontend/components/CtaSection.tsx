"use client";

import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, ChevronRight, Sparkles } from "lucide-react";

interface CtaSectionProps {
  onOpenDemo?: () => void;
}

export default function CtaSection({ onOpenDemo }: CtaSectionProps) {
  return (
    <section className="py-20 sm:py-28 bg-white border-t border-gray-200">
      <div className="max-w-5xl mx-auto px-4 sm:px-8 text-center flex flex-col items-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="space-y-4"
        >
          <div className="inline-flex items-center gap-1.5 text-xs font-mono-tech uppercase text-gray-500 font-semibold tracking-wider bg-gray-100 px-3 py-1 rounded-full border border-gray-200">
            <span className="w-1.5 h-1.5 rounded-full bg-[#ff4d15]" />
            BUILT FOR HIGH-VELOCITY WORKSHOPS
          </div>

          <h2 className="font-display text-4xl sm:text-6xl lg:text-7xl font-bold text-gray-900 tracking-tight leading-none uppercase">
            YOUR WORKSHOP.
            <br />
            A BETTER WAY.
          </h2>

          <p className="max-w-2xl mx-auto text-base sm:text-lg text-gray-600 font-normal leading-relaxed pt-2 pb-6">
            Bring bookings, repair stages, OEM parts catalogs, and automated customer concierge together under one flawless platform.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 w-full sm:w-auto">
            <button
              onClick={onOpenDemo}
              className="w-full sm:w-auto bg-[#ff4d15] hover:bg-[#e03e0a] text-white text-xs sm:text-sm font-semibold uppercase tracking-wider px-8 py-3.5 rounded shadow-sm hover:shadow-lg transition-all flex items-center justify-center gap-2 active:scale-95 group"
            >
              <span>GET STARTED NOW</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={onOpenDemo}
              className="w-full sm:w-auto bg-white hover:bg-gray-50 text-gray-800 border border-gray-300 text-xs sm:text-sm font-semibold uppercase tracking-wider px-8 py-3.5 rounded shadow-sm hover:border-gray-400 transition-all flex items-center justify-center gap-2 active:scale-95"
            >
              <span>SCHEDULE DEMO</span>
              <ChevronRight className="w-4 h-4 text-gray-400" />
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
