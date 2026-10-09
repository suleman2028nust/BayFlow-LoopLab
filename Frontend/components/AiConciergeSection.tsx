"use client";

import React from "react";
import { motion } from "framer-motion";

interface AiConciergeSectionProps {
  onOpenDemo?: () => void;
}

export default function AiConciergeSection({ onOpenDemo }: AiConciergeSectionProps) {
  return (
    <section id="ai-concierge" className="w-full px-4 sm:px-6 lg:px-8 py-16 sm:py-20 relative overflow-hidden border-t border-[#2C2421]/10 bg-[#F8F8F5]">
      {/* Ambient background glow */}
      <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-[#E85D22]/5 blur-[130px] rounded-full" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white border border-[#E85D22]/30 text-[#E85D22] text-xs uppercase mb-3 font-bold shadow-[0_2px_8px_rgba(44,36,33,0.04)]">
            <span className="material-symbols-outlined text-[16px]">graphic_eq</span>
            <span>Conversational Intelligence</span>
          </div>
          <h2 className="font-headline text-4xl sm:text-5xl lg:text-6xl uppercase text-[#2C2421] font-extrabold leading-none mb-4">
            Your Front Desk. Always On.
          </h2>
          <p className="text-base sm:text-lg text-[#6B5E59] font-light leading-relaxed">
            Meet BayFlow AI: the autonomous voice and text concierge that takes incoming customer calls,
            resolves status checks via real-time bay telemetry, and generates work orders automatically.
          </p>
        </div>

        {/* AI Live Telephony Terminal Interface */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto bg-white rounded-xl border border-[#2C2421]/10 shadow-[0_12px_36px_rgba(44,36,33,0.08)] overflow-hidden"
        >
          {/* AI Audio Visualizer Header */}
          <div className="p-4 sm:p-6 bg-[#F4F4F1] border-b border-[#2C2421]/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#E85D22]/15 border border-[#E85D22]/40 flex items-center justify-center text-[#E85D22] shrink-0">
                <span className="material-symbols-outlined animate-pulse text-xl">record_voice_over</span>
              </div>
              <div>
                <span className="font-headline text-sm font-bold text-[#2C2421] block tracking-wide">
                  ACTIVE INBOUND CALL: +1 (555) 438-9921
                </span>
                <span className="font-mono text-xs text-[#1F5C45] font-bold">
                  AI AGENT // NATURAL VOICE SYNTHESIS ACTIVE
                </span>
              </div>
            </div>

            {/* Emerald Pine Dynamic Waveform */}
            <div className="flex items-center gap-1 h-8 px-4 py-1 bg-white rounded-full border border-[#1F5C45]/20 shadow-[0_1px_4px_rgba(44,36,33,0.04)]">
              <span className="w-1 bg-[#1F5C45] h-3 animate-pulse rounded-full" />
              <span className="w-1 bg-[#1F5C45] h-6 animate-pulse rounded-full" style={{ animationDelay: "75ms" }} />
              <span className="w-1 bg-[#1F5C45] h-8 animate-pulse rounded-full" style={{ animationDelay: "150ms" }} />
              <span className="w-1 bg-[#1F5C45] h-4 animate-pulse rounded-full" style={{ animationDelay: "220ms" }} />
              <span className="w-1 bg-[#1F5C45] h-7 animate-pulse rounded-full" style={{ animationDelay: "90ms" }} />
              <span className="w-1 bg-[#1F5C45] h-5 animate-pulse rounded-full" style={{ animationDelay: "180ms" }} />
              <span className="w-1 bg-[#1F5C45] h-2 animate-pulse rounded-full" style={{ animationDelay: "300ms" }} />
            </div>
          </div>

          {/* Realistic Conversation Log */}
          <div className="p-4 sm:p-6 flex flex-col gap-4 text-xs sm:text-sm bg-white">
            {/* Customer Bubble */}
            <div className="flex items-start gap-3 max-w-xl">
              <div className="w-7 h-7 rounded-full bg-[#2C2421]/10 flex items-center justify-center text-[12px] font-bold text-[#2C2421] shrink-0">
                C
              </div>
              <div className="bg-[#F8F8F5] p-3.5 rounded-lg border border-[#2C2421]/10">
                <span className="text-[#6B5E59] text-[10px] block mb-1 font-semibold uppercase tracking-wider">
                  CLIENT // MARCUS V.
                </span>
                <p className="text-[#2C2421] font-medium leading-relaxed">
                  &ldquo;Hey, just calling to see if my Porsche GT3 RS in Bay 2 is ready for pickup today?&rdquo;
                </p>
              </div>
            </div>

            {/* AI Response Bubble */}
            <div className="flex items-start gap-3 max-w-xl ml-auto flex-row-reverse">
              <div className="w-7 h-7 rounded-full bg-[#E85D22] text-white flex items-center justify-center text-[12px] font-bold shrink-0 shadow-sm">
                AI
              </div>
              <div className="bg-[#E85D22]/10 p-3.5 rounded-lg border border-[#E85D22]/30 text-right">
                <span className="text-[#E85D22] text-[10px] block mb-1 font-bold uppercase tracking-wider">
                  BAYFLOW AI ENGINE
                </span>
                <p className="text-[#2C2421] font-medium leading-relaxed text-left">
                  &ldquo;Hi Marcus! Alex just completed the carbon brake bleed and torque calibration. The GT3
                  RS is headed to detail now and will be primed for pickup at 4:30 PM. Would you like me to
                  text your gate code?&rdquo;
                </p>
              </div>
            </div>

            {/* Live Generated Task Card */}
            <div className="mt-2 p-3 bg-[#F8F8F5] rounded border border-[#1F5C45]/40 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-mono">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#1F5C45] text-[18px]">bolt</span>
                <span className="text-[#2C2421] font-semibold">
                  AUTO-DISPATCHED WORK ORDER: #BAY-9844 UPDATED WITH HANDOFF 16:30
                </span>
              </div>
              <span className="text-[#1F5C45] font-bold uppercase tracking-wider">SYNCED</span>
            </div>
          </div>

          {/* 3 Highlights Bar */}
          <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-[#2C2421]/10 bg-[#F4F4F1] p-4 border-t border-[#2C2421]/10">
            <div className="p-3 text-center">
              <span className="font-headline text-sm text-[#2C2421] font-bold block uppercase tracking-wide">
                Autonomous Telephony
              </span>
              <span className="text-xs text-[#6B5E59]">Answers calls instantly 24/7/365</span>
            </div>
            <div className="p-3 text-center">
              <span className="font-headline text-sm text-[#2C2421] font-bold block uppercase tracking-wide">
                Instant Status Lookups
              </span>
              <span className="text-xs text-[#6B5E59]">Syncs directly with live bay stage telemetry</span>
            </div>
            <div className="p-3 text-center">
              <span className="font-headline text-sm text-[#2C2421] font-bold block uppercase tracking-wide">
                Task Auto-Generation
              </span>
              <span className="text-xs text-[#6B5E59]">Converts audio voice logs into technician tickets</span>
            </div>
          </div>
        </motion.div>

        {/* Action Button */}
        <div className="text-center mt-8 sm:mt-10">
          <button
            onClick={onOpenDemo}
            className="inline-flex items-center gap-2 bg-[#2C2421] hover:bg-[#1a1513] text-white text-xs uppercase tracking-widest px-8 py-3.5 rounded font-bold shadow-[0_4px_16px_rgba(44,36,33,0.25)] transition-all group"
          >
            <span>Discover BayFlow AI</span>
            <span className="material-symbols-outlined text-[16px] group-hover:translate-x-1 transition-transform">
              arrow_forward
            </span>
          </button>
        </div>
      </div>
    </section>
  );
}
