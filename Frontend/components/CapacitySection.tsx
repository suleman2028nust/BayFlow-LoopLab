"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, AlertCircle, Clock, Wrench, Shield, ArrowRight } from "lucide-react";

export default function CapacitySection() {
  const [activeBay, setActiveBay] = useState<number | null>(null);

  return (
    <section id="platform" className="py-16 sm:py-24 bg-[#fbfbfb]">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Text & Metrics */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-5 space-y-6"
          >
            <div className="inline-flex items-center gap-1.5 text-xs font-mono-tech uppercase text-[#ff4d15] font-semibold tracking-wider">
              <span className="w-1.5 h-1.5 rounded-full bg-[#ff4d15]" />
              CAPACITY & ARRIVAL / STATUS
            </div>

            <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 tracking-tight leading-none uppercase">
              EVERY SLOT. UNDER CONTROL.
            </h2>

            <p className="text-base text-gray-600 font-normal leading-relaxed">
              Prevent double-bookings, automate technician slot assignments, and balance high-performance drive bays against fleet shortages with algorithmic scheduling.
            </p>

            {/* Metrics Dual Boxes */}
            <div className="grid grid-cols-2 gap-4 pt-4">
              <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm">
                <div className="font-display text-3xl sm:text-4xl font-bold text-gray-900">
                  99.1%
                </div>
                <div className="text-[11px] font-mono-tech uppercase text-gray-500 mt-1 tracking-wider">
                  BAY EFFICIENCY RATE
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm">
                <div className="font-display text-3xl sm:text-4xl font-bold text-gray-900">
                  0.0%
                </div>
                <div className="text-[11px] font-mono-tech uppercase text-gray-500 mt-1 tracking-wider">
                  UNPLANNED BAY IDLE TIME
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Interactive Dispatch Board */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="lg:col-span-7"
          >
            <div className="bg-white border border-gray-300 rounded-xl shadow-xl overflow-hidden">
              {/* Board Header Bar */}
              <div className="border-b border-gray-200 bg-gray-50 px-5 py-3.5 flex flex-wrap items-center justify-between text-xs font-mono-tech text-gray-600 gap-2">
                <div className="flex items-center gap-3">
                  <span className="font-bold text-gray-900">WORKSHOP DISPATCH BOARD</span>
                  <span className="text-gray-300">|</span>
                  <span className="text-gray-500">TEAM 1 - SHIFT A</span>
                </div>
                <div className="flex items-center gap-1.5 text-emerald-600 font-medium">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  + LIVE ROUTING ENGAGED
                </div>
              </div>

              {/* Bay Rows */}
              <div className="divide-y divide-gray-100 p-3 sm:p-5 space-y-3">
                {/* Bay 01 */}
                <div
                  onMouseEnter={() => setActiveBay(1)}
                  onMouseLeave={() => setActiveBay(null)}
                  className={`p-4 rounded-lg border transition-all duration-200 ${
                    activeBay === 1
                      ? "border-[#ff4d15] bg-[#fffbf9] shadow-md"
                      : "border-gray-200 bg-gray-50/50 hover:border-gray-300"
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-start sm:items-center gap-3">
                      <div className="w-8 h-8 rounded bg-gray-200 text-gray-800 font-mono-tech font-bold text-xs flex items-center justify-center">
                        01
                      </div>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-bold text-gray-900 text-sm">
                            Ferrari SF90 Stradale
                          </span>
                          <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-mono-tech font-semibold px-2 py-0.5 rounded uppercase">
                            STAGE 2 INSPECTION
                          </span>
                        </div>
                        <div className="text-xs text-gray-500 font-mono-tech mt-0.5">
                          Tech: Frank (Lead Master 91%)
                        </div>
                      </div>
                    </div>

                    <div className="text-left sm:text-right">
                      <div className="text-xs font-mono-tech text-gray-500">
                        Peak Brake Dyno
                      </div>
                      <div className="text-xs font-mono-tech font-bold text-emerald-600">
                        61m est. remaining
                      </div>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="mt-3 w-full bg-gray-200 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-emerald-500 h-full rounded-full w-[72%]" />
                  </div>
                </div>

                {/* Bay 02 */}
                <div
                  onMouseEnter={() => setActiveBay(2)}
                  onMouseLeave={() => setActiveBay(null)}
                  className={`p-4 rounded-lg border transition-all duration-200 ${
                    activeBay === 2
                      ? "border-[#ff4d15] bg-[#fffbf9] shadow-md"
                      : "border-gray-200 bg-gray-50/50 hover:border-gray-300"
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-start sm:items-center gap-3">
                      <div className="w-8 h-8 rounded bg-[#ff4d15]/10 text-[#ff4d15] font-mono-tech font-bold text-xs flex items-center justify-center border border-[#ff4d15]/30">
                        02
                      </div>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-bold text-gray-900 text-sm">
                            Porsche 911 GT3 RS
                          </span>
                          <span className="bg-[#fff0eb] text-[#ff4d15] border border-[#ff4d15]/30 text-[10px] font-mono-tech font-semibold px-2 py-0.5 rounded uppercase">
                            CARBON BRAKE FLUSH
                          </span>
                        </div>
                        <div className="text-xs text-gray-500 font-mono-tech mt-0.5">
                          Tech: Frank (Lead Master 91%)
                        </div>
                      </div>
                    </div>

                    <div className="text-left sm:text-right">
                      <div className="text-xs font-mono-tech text-gray-500">
                        Fluid Evacuation
                      </div>
                      <div className="text-xs font-mono-tech font-bold text-[#ff4d15]">
                        Critical Path: 34m
                      </div>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="mt-3 w-full bg-gray-200 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-[#ff4d15] h-full rounded-full w-[88%]" />
                  </div>
                </div>

                {/* Bay 03 */}
                <div
                  onMouseEnter={() => setActiveBay(3)}
                  onMouseLeave={() => setActiveBay(null)}
                  className={`p-4 rounded-lg border transition-all duration-200 ${
                    activeBay === 3
                      ? "border-[#ff4d15] bg-[#fffbf9] shadow-md"
                      : "border-gray-200 bg-gray-50/50 hover:border-gray-300"
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-start sm:items-center gap-3">
                      <div className="w-8 h-8 rounded bg-gray-200 text-gray-800 font-mono-tech font-bold text-xs flex items-center justify-center">
                        03
                      </div>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-bold text-gray-900 text-sm">
                            McLaren Senna
                          </span>
                          <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-mono-tech font-semibold px-2 py-0.5 rounded uppercase">
                            ECU MAPPING / DYNO
                          </span>
                        </div>
                        <div className="text-xs text-gray-500 font-mono-tech mt-0.5">
                          Tech: Alex Vance (Tech Lead 88%)
                        </div>
                      </div>
                    </div>

                    <div className="text-left sm:text-right">
                      <div className="text-xs font-mono-tech text-gray-500">
                        Dyno Cell #2
                      </div>
                      <div className="text-xs font-mono-tech font-bold text-emerald-600">
                        Ready for Delivery
                      </div>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="mt-3 w-full bg-gray-200 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-emerald-500 h-full rounded-full w-[96%]" />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
