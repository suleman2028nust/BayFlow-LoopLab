"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";

interface HeroSectionProps {
  onOpenDemo?: () => void;
}

export default function HeroSection({ onOpenDemo }: HeroSectionProps) {
  return (
    <section className="relative w-full min-h-[960px] flex flex-col justify-between px-4 sm:px-6 lg:px-8 py-10 overflow-hidden bg-[#F4F4F1]">
      {/* Ambient Subtle Warm Floor Glows */}
      <div className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 w-[900px] h-[480px] bg-[#E85D22]/5 blur-[140px] rounded-full" />
      <div className="pointer-events-none absolute bottom-0 right-0 w-[500px] h-[500px] bg-[#1F5C45]/5 blur-[120px] rounded-full" />

      <div className="max-w-7xl mx-auto w-full flex flex-col justify-between flex-1">
        {/* HUD Sub-Header / Status Bar */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full flex items-center justify-between pb-4 border-b border-[#2C2421]/10 text-[#6B5E59] text-xs"
        >
          <div className="flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#1F5C45] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#1F5C45]"></span>
            </span>
            <span className="text-[#1F5C45] font-bold tracking-widest text-[11px] uppercase">
              DECK // ORCHESTRATION ACTIVE
            </span>
            <span className="text-[#8C7E78] hidden md:inline-block">|</span>
            <span className="hidden md:inline-block text-[#8C7E78] font-mono text-[11px]">
              OCTANE-OS V4.8.2
            </span>
          </div>
          <div className="flex items-center gap-4 sm:gap-6 font-mono text-xs">
            <span className="hidden sm:inline-block text-[#6B5E59]">
              LIVE BAYS: <strong className="text-[#2C2421] font-bold">18 / 20 OCCUPIED</strong>
            </span>
            <span className="bg-white px-2.5 py-1 rounded text-[#1F5C45] border border-[#1F5C45]/30 font-bold shadow-[0_2px_8px_rgba(44,36,33,0.04)]">
              LATENCY: 4.2ms
            </span>
          </div>
        </motion.div>

        {/* Monumental Typography Split Layout */}
        <div className="relative w-full my-auto flex flex-col items-center justify-center py-6 sm:py-8">
          {/* Top Massive Line */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="w-full text-center"
          >
            <h1 className="font-headline text-[clamp(3.75rem,11vw,9.5rem)] leading-none font-extrabold uppercase tracking-tight text-[#2C2421] drop-shadow-[0_4px_12px_rgba(44,36,33,0.08)]">
              YOUR WORKSHOP.
            </h1>
          </motion.div>

          {/* Central Cinematic Bay Telemetry Stage */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative w-full max-w-6xl -my-4 md:-my-10 z-20 group"
          >
            {/* Glow Boundary Halo */}
            <div className="absolute -inset-1 rounded-xl bg-gradient-to-r from-[#E85D22]/20 via-[#1F5C45]/15 to-[#E85D22]/20 blur-md opacity-60 group-hover:opacity-100 transition duration-700 pointer-events-none" />

            {/* Framing Container */}
            <div className="relative rounded-lg overflow-hidden bg-white border border-[#2C2421]/10 shadow-[0_20px_50px_rgba(44,36,33,0.12),0_1px_3px_rgba(44,36,33,0.06)]">
              {/* Image Container with Natural Light Hypercar */}
              <div className="relative aspect-[16/8] sm:aspect-[21/9] md:aspect-[2.35/1] w-full overflow-hidden bg-[#ECE8E5]">
                <img
                  alt="State-of-the-art luxury automotive hypercar service workshop with natural architectural daylight and warm titanium supercar on flush ground lift bay"
                  className="w-full h-full object-cover object-center transform scale-100 group-hover:scale-[1.01] transition-transform duration-1000 ease-out"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuB7op07soz9VWsNoCcWz1_tHUFPE06zBlX-o9u0fy4zNLf5StVnBRZlUA1r5B0aGuBx8rjFkTMTq1yUosS7OlD9r6FUSuNVeiyHXFiYZAIPIHPwbZdvaYwLe8snoYcnxfgcn9C-xef7rkRndUHUXp6MOiQwdW8zmVGapjJqkGOSL0_AYK4ynltlNoebvrNYQFOnHtvtKp2No9ct_f81wxz2xz74-1no1_jLTIB9m3t5m_eG2xLbEXmR"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-white/80 via-transparent to-white/40 pointer-events-none" />

                {/* Precision HUD Diagnostics Overlays (Pure White claymorphic pills) */}
                <div className="absolute top-4 left-4 flex flex-col gap-1.5 pointer-events-none">
                  <div className="flex items-center gap-2 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded border border-[#E85D22]/30 shadow-[0_4px_12px_rgba(44,36,33,0.08)]">
                    <span className="w-2 h-2 rounded-full bg-[#E85D22] animate-pulse" />
                    <span className="text-[10px] sm:text-xs text-[#E85D22] tracking-widest font-bold uppercase">
                      BAY 04 / ACTIVE CALIBRATION
                    </span>
                  </div>
                  <span className="font-mono text-[10px] sm:text-[11px] text-[#2C2421] pl-1 font-semibold">
                    VIN: ZHWUA59S7LLA04912
                  </span>
                </div>

                <div className="absolute top-4 right-4 hidden sm:flex items-center gap-3 bg-white/95 backdrop-blur-md px-3.5 py-1.5 rounded border border-[#1F5C45]/30 shadow-[0_4px_12px_rgba(44,36,33,0.08)]">
                  <span className="font-mono text-xs text-[#6B5E59]">LIDAR ALIGNMENT:</span>
                  <span className="font-mono text-xs text-[#1F5C45] font-bold">99.84% PRECISION</span>
                </div>

                {/* Lower Diagnostics Crosshairs */}
                <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between pointer-events-none">
                  <div className="flex items-center gap-4">
                    <div className="bg-white/95 backdrop-blur-md px-3.5 py-1.5 rounded border border-[#2C2421]/10 shadow-[0_4px_12px_rgba(44,36,33,0.08)]">
                      <span className="text-[10px] text-[#8C7E78] block font-semibold uppercase tracking-wider">
                        EST. COMPLETION
                      </span>
                      <span className="font-mono text-xs text-[#2C2421] font-bold">16:45:00 UTC</span>
                    </div>
                    <div className="hidden md:block bg-white/95 backdrop-blur-md px-3.5 py-1.5 rounded border border-[#1F5C45]/20 shadow-[0_4px_12px_rgba(44,36,33,0.08)]">
                      <span className="text-[10px] text-[#8C7E78] block font-semibold uppercase tracking-wider">
                        TORQUE SYNC
                      </span>
                      <span className="font-mono text-xs text-[#1F5C45] font-bold">
                        STAGE 3 (NOMINAL)
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 bg-white/95 border border-[#1F5C45]/40 px-3.5 py-1.5 rounded backdrop-blur-md shadow-[0_4px_12px_rgba(44,36,33,0.08)]">
                    <span className="material-symbols-outlined text-[#1F5C45] text-[16px]">sensors</span>
                    <span className="font-mono text-[10px] sm:text-[11px] text-[#1F5C45] font-bold">
                      TELEMETRY STREAM CONNECTED
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Bottom Massive Line */}
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="w-full text-center"
          >
            <h2 className="font-headline text-[clamp(3.75rem,11vw,9.5rem)] leading-none font-extrabold uppercase tracking-tight text-[#2C2421] drop-shadow-[0_4px_12px_rgba(44,36,33,0.08)]">
              IN MOTION.
            </h2>
          </motion.div>
        </div>

        {/* Editorial Subtitle & Conversion Deck */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="w-full max-w-4xl mx-auto flex flex-col items-center text-center gap-6 pb-4 z-30"
        >
          <p className="text-base sm:text-lg text-[#6B5E59] max-w-2xl font-light leading-relaxed">
            One intelligent, mission-critical platform engineered for bookings, technician dispatch,
            telemetry-linked repairs, inventory, and automated customer concierge.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={onOpenDemo}
              className="bg-[#2C2421] hover:bg-[#1a1513] text-white text-xs uppercase tracking-widest px-8 py-3.5 rounded font-bold shadow-[0_6px_20px_rgba(44,36,33,0.25)] hover:shadow-[0_8px_26px_rgba(44,36,33,0.35)] transition-all flex items-center gap-2 group"
            >
              <span>Explore BayFlow</span>
              <span className="material-symbols-outlined text-[18px] group-hover:translate-x-1 transition-transform">
                arrow_forward
              </span>
            </button>
            <a
              href="#how-it-works"
              className="bg-white hover:bg-[#F4F4F1] text-[#2C2421] text-xs uppercase tracking-widest px-6 py-3.5 rounded font-bold border border-[#2C2421]/20 shadow-[0_2px_8px_rgba(44,36,33,0.06)] hover:border-[#2C2421]/40 transition-all flex items-center gap-2"
            >
              <span>See How It Works</span>
              <span className="material-symbols-outlined text-[18px]">play_arrow</span>
            </a>
          </div>

          {/* Technical Scroll Indicator */}
          <div className="flex flex-col items-center gap-1.5 pt-2 text-[#8C7E78]">
            <span className="text-[10px] tracking-widest uppercase font-semibold">
              Scroll to Telemetry Deck
            </span>
            <div className="w-4 h-7 rounded-full border border-[#2C2421]/20 p-1 flex justify-center bg-white">
              <div className="w-1 h-2 rounded-full bg-[#E85D22] animate-bounce" />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
