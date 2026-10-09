"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight, ChevronRight, Gauge, Cpu, CheckCircle2, Radio, Zap } from "lucide-react";

interface HeroSectionProps {
  onOpenDemo?: () => void;
}

export default function HeroSection({ onOpenDemo }: HeroSectionProps) {
  const [progress, setProgress] = useState(85.6);
  const [torque, setTorque] = useState(1050);
  const [hp, setHp] = useState(987);

  // Subtle live telemetry pulse
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        const next = prev + (Math.random() * 0.4 - 0.15);
        return parseFloat(Math.min(99.4, Math.max(82.0, next)).toFixed(1));
      });
      setTorque((prev) => prev + Math.floor(Math.random() * 5 - 2));
      setHp((prev) => prev + Math.floor(Math.random() * 3 - 1));
    }, 2400);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative pt-6 pb-20 overflow-hidden bg-[#fbfbfb]">
      {/* Background subtle grid pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-40 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-8 relative z-10 flex flex-col items-center text-center">
        {/* Upper Big Header: "YOUR WORKSHOP" */}
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="font-display text-[55px] sm:text-[90px] md:text-[120px] lg:text-[145px] font-bold text-[#111215] tracking-tight leading-[0.88] select-none uppercase mb-2 sm:mb-4"
        >
          YOUR WORKSHOP
        </motion.h1>

        {/* Hero Visual Card / Supercar in Workshop Bay */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
          className="w-full max-w-5xl my-2 relative group"
        >
          <div className="relative w-full rounded-xl overflow-hidden border border-gray-300 shadow-2xl bg-neutral-900 aspect-[16/9] sm:aspect-[21/9]">
            {/* Top Bar Overlays */}
            <div className="absolute top-3 left-3 sm:top-5 sm:left-5 z-20">
              <span className="inline-flex items-center gap-2 bg-neutral-900/80 backdrop-blur-md text-white text-[11px] sm:text-xs font-mono-tech px-3 py-1.5 rounded border border-white/15 shadow-md">
                <span className="w-2 h-2 rounded-full bg-[#ff4d15] animate-ping" />
                <span className="text-[#ff4d15] font-bold">•</span>
                SPECIAL OPS BAY 03 // ACTIVE
              </span>
            </div>

            <div className="absolute top-3 right-3 sm:top-5 sm:right-5 z-20">
              <span className="inline-flex items-center gap-2 bg-neutral-900/80 backdrop-blur-md text-gray-200 text-[11px] sm:text-xs font-mono-tech px-3 py-1.5 rounded border border-white/15 shadow-md">
                STAGE 3 ECU CALIBRATION //
                <span className="text-emerald-400 font-semibold">{progress}% COMPLETED</span>
              </span>
            </div>

            {/* Hypercar Image */}
            <Image
              src="/workshop-hero.jpg"
              alt="BayFlow High Performance Workshop with Hypercar in Active Bay"
              fill
              priority
              className="object-cover object-center group-hover:scale-[1.015] transition-transform duration-700 ease-out"
            />

            {/* Bottom Left Floating Diagnostics Badge */}
            <div className="absolute bottom-3 left-3 sm:bottom-5 sm:left-5 z-20 flex flex-col sm:flex-row gap-2">
              <div className="bg-neutral-900/85 backdrop-blur-md border border-white/15 rounded p-2 sm:px-3 sm:py-2 text-left text-white shadow-xl">
                <div className="text-[10px] sm:text-[11px] font-mono-tech text-gray-400 uppercase">
                  LIVE DIAGNOSTICS:
                </div>
                <div className="text-xs sm:text-sm font-mono-tech font-bold text-white flex items-center gap-1.5">
                  <Cpu className="w-3.5 h-3.5 text-[#ff4d15]" />
                  284/300 PIDS // CAN-BUS
                </div>
              </div>

              <div className="bg-neutral-900/85 backdrop-blur-md border border-white/15 rounded p-2 sm:px-3 sm:py-2 text-left text-white shadow-xl">
                <div className="text-[10px] sm:text-[11px] font-mono-tech text-gray-400 uppercase">
                  TORQUE / BOOST:
                </div>
                <div className="text-xs sm:text-sm font-mono-tech font-bold text-emerald-400 flex items-center gap-1.5">
                  <Gauge className="w-3.5 h-3.5 text-emerald-400" />
                  STAGE 3 ({torque} NM / 2.4B)
                </div>
              </div>
            </div>

            {/* Bottom Right Floating Badge */}
            <div className="absolute bottom-3 right-3 sm:bottom-5 sm:right-5 z-20 hidden sm:block">
              <div className="bg-white/95 backdrop-blur-md border border-gray-300 text-gray-900 rounded px-3 py-2 text-left shadow-xl font-mono-tech text-xs">
                <span className="text-[#ff4d15] font-bold">i.e.</span> Finished ECU Calibration:{" "}
                <span className="font-bold text-gray-950">Peak {hp}hp</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Lower Big Header: "IN MOTION." */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
          className="font-display text-[55px] sm:text-[90px] md:text-[120px] lg:text-[145px] font-bold text-[#111215] tracking-tight leading-[0.88] select-none uppercase mt-2 sm:mt-4"
        >
          IN MOTION.
        </motion.h2>

        {/* Subtitle description */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.45 }}
          className="max-w-2xl text-base sm:text-lg text-gray-600 font-normal leading-relaxed mt-4 sm:mt-6 mb-8 text-center"
        >
          One intelligent, mission-critical platform engineered for bookings, technician
          dispatch, telemetry stream repairs, inventory, and automated customer concierge.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.55 }}
          className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 w-full sm:w-auto justify-center"
        >
          <button
            onClick={onOpenDemo}
            className="w-full sm:w-auto bg-[#ff4d15] hover:bg-[#e03e0a] text-white text-xs sm:text-sm font-semibold uppercase tracking-wider px-7 py-3.5 rounded shadow-sm hover:shadow-lg transition-all flex items-center justify-center gap-2 active:scale-95 group"
          >
            <span>EXPLORE PLATFORM</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>

          <button
            onClick={onOpenDemo}
            className="w-full sm:w-auto bg-white hover:bg-gray-50 text-gray-800 border border-gray-300 text-xs sm:text-sm font-semibold uppercase tracking-wider px-7 py-3.5 rounded shadow-sm hover:border-gray-400 transition-all flex items-center justify-center gap-2 active:scale-95"
          >
            <span>SCHEDULE LIVE DEMO</span>
            <ChevronRight className="w-4 h-4 text-gray-400" />
          </button>
        </motion.div>

        {/* Subtle scroll down indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="mt-12 flex flex-col items-center gap-1 text-[11px] font-mono-tech uppercase text-gray-400 tracking-wider"
        >
          <span>Scroll to explore platform</span>
          <div className="w-4 h-7 border border-gray-300 rounded-full flex justify-center pt-1.5">
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ repeat: Infinity, duration: 1.6 }}
              className="w-1.5 h-1.5 bg-[#ff4d15] rounded-full"
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
