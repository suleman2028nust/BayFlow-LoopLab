"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";

interface ShowcaseModulesProps {
  onOpenDemo?: () => void;
}

export default function ShowcaseModules({ onOpenDemo }: ShowcaseModulesProps) {
  const [reordered, setReordered] = useState(false);

  const handleReorder = () => {
    setReordered(true);
    setTimeout(() => setReordered(false), 3000);
  };

  return (
    <section id="platform" className="w-full px-4 sm:px-6 lg:px-8 py-16 sm:py-20 flex flex-col gap-16 bg-[#F4F4F1]">
      <div className="max-w-7xl mx-auto w-full flex flex-col gap-12 sm:gap-16">
        {/* =========================================================================
            SHOWCASE 1: EVERY SLOT UNDER CONTROL (CALENDAR & BAY DISPATCH)
            ========================================================================= */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-white p-6 sm:p-8 lg:p-10 rounded-xl border border-[#2C2421]/10 shadow-[0_10px_30px_rgba(44,36,33,0.06),0_1px_3px_rgba(44,36,33,0.04)]"
        >
          <div className="lg:col-span-5 flex flex-col gap-4">
            <div className="flex items-center gap-2 text-[#E85D22] text-xs uppercase tracking-widest font-bold">
              <span className="w-2 h-2 rounded-full bg-[#E85D22]" />
              <span>CAPACITY DISPATCH // ENGINE</span>
            </div>
            <h3 className="font-headline text-3xl sm:text-4xl uppercase font-bold text-[#2C2421] tracking-wide leading-tight">
              Every Slot. Under Control.
            </h3>
            <p className="text-sm sm:text-base text-[#6B5E59] leading-relaxed">
              Prevent double bookings, optimize technician skill assignments, and balance high-performance
              dyno bays against fast lube bays with algorithmic scheduling.
            </p>
            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="p-3.5 bg-[#F8F8F5] rounded border border-[#2C2421]/10">
                <div className="font-mono text-2xl font-bold text-[#2C2421]">99.1%</div>
                <div className="text-[10px] text-[#1F5C45] uppercase font-bold tracking-wider">
                  Bay Utilization Rate
                </div>
              </div>
              <div className="p-3.5 bg-[#F8F8F5] rounded border border-[#2C2421]/10">
                <div className="font-mono text-2xl font-bold text-[#2C2421]">0.0%</div>
                <div className="text-[10px] text-[#6B5E59] uppercase font-semibold tracking-wider">
                  Scheduling Collisions
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Workshop Bay Calendar Mockup */}
          <div className="lg:col-span-7 bg-[#FBFBFA] rounded-lg p-4 sm:p-6 border border-[#2C2421]/10 flex flex-col gap-3 text-xs shadow-inner">
            <div className="flex items-center justify-between pb-3 border-b border-[#2C2421]/10">
              <div className="flex items-center gap-2">
                <span className="text-xs uppercase tracking-wider text-[#2C2421] font-bold">
                  WORKSHOP SCHEDULE
                </span>
                <span className="text-[10px] bg-white px-2 py-0.5 rounded text-[#6B5E59] border border-[#2C2421]/10 font-semibold">
                  TODAY / SHIFT A
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-[#1F5C45] font-mono font-bold">
                <span className="w-2 h-2 bg-[#1F5C45] rounded-full animate-pulse" />
                <span>LIVE RE-ROUTING ENABLED</span>
              </div>
            </div>

            {/* Bay Card 1 */}
            <div className="p-3.5 rounded bg-white border border-[#1F5C45]/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-[0_2px_8px_rgba(44,36,33,0.04)] hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded bg-[#1F5C45]/10 flex items-center justify-center text-[#1F5C45] font-mono font-bold text-sm">
                  B1
                </div>
                <div>
                  <div className="font-headline text-base text-[#2C2421] font-bold flex items-center gap-2">
                    <span>Ferrari 296 GTB</span>
                    <span className="bg-[#1F5C45]/15 text-[#1F5C45] text-[10px] px-1.5 py-0.5 rounded uppercase font-bold tracking-wider">
                      10K km Inspection
                    </span>
                  </div>
                  <div className="font-mono text-[11px] text-[#6B5E59]">
                    TECH: Marco R. (Master EV/Hybrid)
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3 justify-between sm:justify-end">
                <div className="font-mono text-xs text-right">
                  <span className="text-[#8C7E78] block font-semibold text-[10px] uppercase">
                    TIME REMAINING
                  </span>
                  <span className="text-[#1F5C45] font-bold">01h 14m</span>
                </div>
                <div className="w-16 bg-[#ECE8E5] h-2 rounded-full overflow-hidden">
                  <div className="bg-[#1F5C45] h-full w-[72%]" />
                </div>
              </div>
            </div>

            {/* Bay Card 2 */}
            <div className="p-3.5 rounded bg-white border border-[#E85D22]/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-[0_2px_8px_rgba(44,36,33,0.04)] hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded bg-[#E85D22]/10 flex items-center justify-center text-[#E85D22] font-mono font-bold text-sm">
                  B2
                </div>
                <div>
                  <div className="font-headline text-base text-[#2C2421] font-bold flex items-center gap-2">
                    <span>Porsche 911 GT3 RS</span>
                    <span className="bg-[#E85D22]/15 text-[#E85D22] text-[10px] px-1.5 py-0.5 rounded uppercase font-bold tracking-wider">
                      Carbon Brake Flush
                    </span>
                  </div>
                  <div className="font-mono text-[11px] text-[#6B5E59]">
                    TECH: Alex Vance (Chassis Lead)
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3 justify-between sm:justify-end">
                <div className="font-mono text-xs text-right">
                  <span className="text-[#8C7E78] block font-semibold text-[10px] uppercase">
                    TIME REMAINING
                  </span>
                  <span className="text-[#E85D22] font-bold">00h 35m</span>
                </div>
                <div className="w-16 bg-[#ECE8E5] h-2 rounded-full overflow-hidden">
                  <div className="bg-[#E85D22] h-full w-[85%]" />
                </div>
              </div>
            </div>

            {/* Bay Card 3 */}
            <div className="p-3.5 rounded bg-white border border-[#2C2421]/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-[0_2px_8px_rgba(44,36,33,0.04)] hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded bg-[#F4F4F1] flex items-center justify-center text-[#2C2421] font-mono font-bold text-sm">
                  B3
                </div>
                <div>
                  <div className="font-headline text-base text-[#2C2421] font-bold flex items-center gap-2">
                    <span>McLaren Artura</span>
                    <span className="bg-[#1F5C45]/15 text-[#1F5C45] text-[10px] px-1.5 py-0.5 rounded uppercase font-bold tracking-wider">
                      QC Passed / Ready
                    </span>
                  </div>
                  <div className="font-mono text-[11px] text-[#6B5E59]">
                    TECH: Elena Cole (Powertrain)
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3 justify-between sm:justify-end">
                <div className="font-mono text-xs text-right">
                  <span className="text-[#8C7E78] block font-semibold text-[10px] uppercase">
                    STATUS
                  </span>
                  <span className="text-[#1F5C45] font-bold">Ready for Pickup</span>
                </div>
                <div className="w-16 bg-[#ECE8E5] h-2 rounded-full overflow-hidden">
                  <div className="bg-[#1F5C45] h-full w-[100%]" />
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* =========================================================================
            SHOWCASE 2: FROM ARRIVAL TO READY (LIFECYCLE PIPELINE)
            ========================================================================= */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-white p-6 sm:p-8 lg:p-10 rounded-xl border border-[#2C2421]/10 shadow-[0_10px_30px_rgba(44,36,33,0.06),0_1px_3px_rgba(44,36,33,0.04)]"
        >
          {/* Visual Column */}
          <div className="lg:col-span-7 order-2 lg:order-1 relative rounded-lg overflow-hidden border border-[#2C2421]/10 bg-[#ECE8E5] group">
            <div className="relative aspect-[16/10] w-full">
              <img
                alt="Modern automotive inspection bay in natural daylight"
                className="w-full h-full object-cover object-center group-hover:scale-[1.02] transition-transform duration-700"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuB7op07soz9VWsNoCcWz1_tHUFPE06zBlX-o9u0fy4zNLf5StVnBRZlUA1r5B0aGuBx8rjFkTMTq1yUosS7OlD9r6FUSuNVeiyHXFiYZAIPIHPwbZdvaYwLe8snoYcnxfgcn9C-xef7rkRndUHUXp6MOiQwdW8zmVGapjJqkGOSL0_AYK4ynltlNoebvrNYQFOnHtvtKp2No9ct_f81wxz2xz74-1no1_jLTIB9m3t5m_eG2xLbEXmR"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-white/90 via-transparent to-white/30 pointer-events-none" />

              {/* Overlaid HUD Sensor Tag */}
              <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-md px-3.5 py-2 rounded border border-[#1F5C45]/40 flex items-center gap-3 shadow-[0_4px_12px_rgba(44,36,33,0.08)]">
                <span className="material-symbols-outlined text-[#1F5C45] text-xl">biotech</span>
                <div>
                  <span className="text-[10px] text-[#8C7E78] block font-semibold uppercase tracking-wider">
                    ACTIVE TELEMETRY HOOK
                  </span>
                  <span className="font-mono text-xs text-[#2C2421] font-bold">
                    OBD-III DIGITAL TWIN REALTIME
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Text & Live Stage Pipeline */}
          <div className="lg:col-span-5 order-1 lg:order-2 flex flex-col gap-4">
            <div className="flex items-center gap-2 text-[#1F5C45] text-xs uppercase tracking-widest font-bold">
              <span className="w-2 h-2 rounded-full bg-[#1F5C45]" />
              <span>LIFECYCLE PIPELINE</span>
            </div>
            <h3 className="font-headline text-3xl sm:text-4xl uppercase font-bold text-[#2C2421] tracking-wide leading-tight">
              From Arrival To Ready.
            </h3>
            <p className="text-sm sm:text-base text-[#6B5E59] leading-relaxed">
              Track each vehicle from intake scans to test-bench validation. Empower your team with
              automated transitions that trigger parts ordering, client approval SMS, and billing.
            </p>

            {/* Stepper Pipeline UI Component */}
            <div className="flex flex-col gap-2 pt-2">
              <div className="flex items-center gap-2.5 text-xs font-mono">
                <span className="w-5 h-5 rounded-full bg-[#1F5C45] text-white flex items-center justify-center font-bold text-[10px]">
                  ✓
                </span>
                <span className="text-[#2C2421] font-semibold">INTAKE &amp; DIAGNOSTIC SCAN</span>
                <span className="text-[#8C7E78] ml-auto text-[11px]">09:12 AM</span>
              </div>
              <div className="w-0.5 h-3 bg-[#1F5C45] ml-2.5" />

              <div className="flex items-center gap-2.5 text-xs font-mono">
                <span className="w-5 h-5 rounded-full bg-[#1F5C45] text-white flex items-center justify-center font-bold text-[10px]">
                  ✓
                </span>
                <span className="text-[#2C2421] font-semibold">ESTIMATE DIGITAL SIGN-OFF</span>
                <span className="text-[#8C7E78] ml-auto text-[11px]">09:40 AM</span>
              </div>
              <div className="w-0.5 h-3 bg-[#E85D22] ml-2.5" />

              <div className="flex items-center gap-2.5 text-xs font-mono">
                <span className="w-5 h-5 rounded-full bg-[#E85D22] animate-pulse text-white flex items-center justify-center font-bold text-[10px]">
                  ●
                </span>
                <span className="text-[#E85D22] font-bold">ACTIVE MECHANICAL REPAIR</span>
                <span className="text-[#E85D22] font-bold ml-auto text-[11px]">IN PROGRESS</span>
              </div>
              <div className="w-0.5 h-3 bg-[#2C2421]/20 ml-2.5" />

              <div className="flex items-center gap-2.5 text-xs font-mono text-[#8C7E78]">
                <span className="w-5 h-5 rounded-full border border-[#2C2421]/30 flex items-center justify-center text-[10px] font-semibold">
                  4
                </span>
                <span>CALIBRATION &amp; DYN-RUN</span>
                <span className="ml-auto text-[11px]">QUEUED</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* =========================================================================
            SHOWCASE 3: NEVER LOSE TRACK (INVENTORY TELEMETRY TABLE)
            ========================================================================= */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-white p-6 sm:p-8 lg:p-10 rounded-xl border border-[#2C2421]/10 shadow-[0_10px_30px_rgba(44,36,33,0.06),0_1px_3px_rgba(44,36,33,0.04)]"
        >
          <div className="lg:col-span-5 flex flex-col gap-4">
            <div className="flex items-center gap-2 text-[#E85D22] text-xs uppercase tracking-widest font-bold">
              <span className="w-2 h-2 rounded-full bg-[#E85D22]" />
              <span>STOCK MATRIX // OEM RESTOCK</span>
            </div>
            <h3 className="font-headline text-3xl sm:text-4xl uppercase font-bold text-[#2C2421] tracking-wide leading-tight">
              Never Lose Track.
            </h3>
            <p className="text-sm sm:text-base text-[#6B5E59] leading-relaxed">
              Prevent downtime waiting on parts. Real-time shelf counting, automated safety buffers, and
              direct API purchasing sync with OEM suppliers.
            </p>
            <div className="flex items-center gap-4 pt-2">
              <button
                onClick={handleReorder}
                className="bg-[#2C2421] hover:bg-[#1a1513] text-white text-xs uppercase tracking-widest px-4 py-2.5 rounded font-bold transition-all shadow-[0_4px_14px_rgba(44,36,33,0.2)]"
              >
                {reordered ? "PO #8843 Dispatched ✓" : "Trigger OEM Reorder"}
              </button>
              <span className="font-mono text-xs text-[#1F5C45] font-bold">AUTO-SAFETY: ACTIVE</span>
            </div>
          </div>

          {/* Inventory Telemetry Table */}
          <div className="lg:col-span-7 bg-[#FBFBFA] rounded-lg border border-[#2C2421]/10 overflow-hidden text-xs shadow-inner">
            <div className="px-4 py-3 bg-[#F4F4F1] border-b border-[#2C2421]/10 flex items-center justify-between font-mono text-xs">
              <span className="text-[#2C2421] font-bold">CENTRAL INVENTORY TELEMETRY</span>
              <span className="text-[#1F5C45] font-bold">48 ITEMS SYNCHRONIZED</span>
            </div>
            <div className="divide-y divide-[#2C2421]/10 bg-white">
              {/* Row 1 */}
              <div className="px-4 py-3 flex items-center justify-between hover:bg-[#F8F8F5] transition-colors">
                <div>
                  <div className="font-bold text-[#2C2421] text-sm">
                    Carbon Ceramic Rotor Kit (Front)
                  </div>
                  <div className="font-mono text-[11px] text-[#6B5E59]">
                    SKU: BREM-CC-992-01 • BIN: A-14
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-mono text-sm text-[#1F5C45] font-bold">4 Sets Left</div>
                  <div className="text-[10px] text-[#1F5C45] font-semibold">Buffer: Safe</div>
                </div>
              </div>

              {/* Row 2 */}
              <div className="px-4 py-3 flex items-center justify-between hover:bg-[#F8F8F5] transition-colors bg-[#E85D22]/5">
                <div>
                  <div className="font-bold text-[#2C2421] text-sm flex items-center gap-2">
                    <span>Motul 300V 5W-40 Synthetic (20L)</span>
                    <span className="bg-[#E85D22]/15 text-[#E85D22] text-[9px] px-1.5 py-0.5 rounded uppercase font-bold tracking-wider">
                      AUTO-QUEUED
                    </span>
                  </div>
                  <div className="font-mono text-[11px] text-[#6B5E59]">
                    SKU: MOT-300V-540 • BIN: L-02
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-mono text-sm text-[#E85D22] font-bold">2 Casks (Low)</div>
                  <div className="text-[10px] text-[#E85D22] font-semibold">PO #8842 Dispatched</div>
                </div>
              </div>

              {/* Row 3 */}
              <div className="px-4 py-3 flex items-center justify-between hover:bg-[#F8F8F5] transition-colors">
                <div>
                  <div className="font-bold text-[#2C2421] text-sm">
                    HV High-Voltage Service Fuse 800V
                  </div>
                  <div className="font-mono text-[11px] text-[#6B5E59]">
                    SKU: TYCO-EV-800 • BIN: E-09
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-mono text-sm text-[#2C2421] font-bold">12 Units</div>
                  <div className="text-[10px] text-[#1F5C45] font-semibold">Buffer: Nominal</div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
