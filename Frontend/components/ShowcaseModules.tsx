"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface ShowcaseModulesProps {
  onOpenDemo?: () => void;
}

export default function ShowcaseModules({ onOpenDemo }: ShowcaseModulesProps) {
  const [activeRole, setActiveRole] = useState<"sa" | "tech" | "parts" | "qc" | "owner">("sa");
  const [qcStatus, setQcStatus] = useState<"pending" | "pass" | "fail">("pending");
  const [partsInStock, setPartsInStock] = useState(0);

  return (
    <section id="roles-pos" className="w-full px-4 sm:px-6 lg:px-8 py-20 bg-white border-t border-[#2C2421]/15">
      <div className="max-w-7xl mx-auto flex flex-col gap-12">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#111827]/10 border border-[#111827]/15 text-[#111827] text-xs font-semibold mb-4">
            <span className="material-symbols-outlined text-base">badge</span>
            <span>ROLE-BASED WORKSHOP POS ENGINE</span>
          </div>
          <h2 className="font-headline text-3xl sm:text-5xl font-extrabold text-[#2C2421] tracking-tight leading-tight">
            Role-Based Workflows. Total Accountability.
          </h2>
          <p className="mt-4 text-base text-[#2C2421]/70 leading-relaxed font-normal">
            Every staff member sees only the work that is theirs. Switch between roles below to test how BayFlow isolates access and enforces strict state transitions.
          </p>
        </div>

        {/* Role Tab Controls */}
        <div className="flex items-center justify-center gap-2 flex-wrap bg-[#F4F4F1] p-2 rounded-2xl border border-[#2C2421]/15 max-w-4xl mx-auto w-full">
          <button
            onClick={() => setActiveRole("sa")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              activeRole === "sa"
                ? "bg-[#111827] text-white shadow-md"
                : "text-[#2C2421]/70 hover:text-[#2C2421] hover:bg-white/60"
            }`}
          >
            <span className="material-symbols-outlined text-lg">headset_mic</span>
            <span>Service Advisor</span>
          </button>
          <button
            onClick={() => setActiveRole("tech")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              activeRole === "tech"
                ? "bg-[#111827] text-white shadow-md"
                : "text-[#2C2421]/70 hover:text-[#2C2421] hover:bg-white/60"
            }`}
          >
            <span className="material-symbols-outlined text-lg">engineering</span>
            <span>Technician</span>
          </button>
          <button
            onClick={() => setActiveRole("parts")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              activeRole === "parts"
                ? "bg-[#111827] text-white shadow-md"
                : "text-[#2C2421]/70 hover:text-[#2C2421] hover:bg-white/60"
            }`}
          >
            <span className="material-symbols-outlined text-lg">inventory_2</span>
            <span>Parts Person</span>
          </button>
          <button
            onClick={() => setActiveRole("qc")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              activeRole === "qc"
                ? "bg-[#111827] text-white shadow-md"
                : "text-[#2C2421]/70 hover:text-[#2C2421] hover:bg-white/60"
            }`}
          >
            <span className="material-symbols-outlined text-lg">fact_check</span>
            <span>QC Inspector</span>
          </button>
          <button
            onClick={() => setActiveRole("owner")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              activeRole === "owner"
                ? "bg-[#111827] text-white shadow-md"
                : "text-[#2C2421]/70 hover:text-[#2C2421] hover:bg-white/60"
            }`}
          >
            <span className="material-symbols-outlined text-lg">admin_panel_settings</span>
            <span>Shop Owner</span>
          </button>
        </div>

        {/* Live Interactive Role Workspace Card */}
        <div className="bg-[#F4F4F1]/60 rounded-2xl border border-[#2C2421]/15 shadow-sm p-6 lg:p-8 max-w-5xl mx-auto w-full min-h-[440px] flex flex-col justify-between">
          <AnimatePresence mode="wait">
            {/* SERVICE ADVISOR VIEW */}
            {activeRole === "sa" && (
              <motion.div
                key="sa"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="space-y-6"
              >
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-[#2C2421]/15 pb-4 gap-2">
                  <div>
                    <span className="text-xs text-[#111827] font-mono font-bold uppercase">
                      ROLE: SERVICE ADVISOR (Bilal)
                    </span>
                    <h3 className="text-2xl font-bold text-[#2C2421]">Active Bookings &amp; Estimates Review</h3>
                  </div>
                  <span className="px-3 py-1 bg-[#111827]/10 text-[#111827] border border-[#111827]/20 text-xs font-mono rounded-full font-bold">
                    SA Scoped Dashboard
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-5 bg-white rounded-xl border border-[#2C2421]/15 shadow-sm space-y-3">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-mono text-[#2C2421]/60 font-semibold">#BK-9021 • PENDING</span>
                      <span className="text-[#111827] font-bold">Friday 10:00 AM</span>
                    </div>
                    <div className="text-sm font-bold text-[#2C2421]">
                      Honda Civic 2016 <span className="text-xs font-mono font-normal text-[#2C2421]/60">(LEA-1234)</span>
                    </div>
                    <p className="text-xs text-[#2C2421]/80 leading-relaxed">
                      Customer Note: Check Engine Light &amp; Engine Vibration at Idle.
                    </p>
                    <div className="pt-2 flex items-center gap-2">
                      <button
                        onClick={onOpenDemo}
                        className="px-3.5 py-2 bg-[#111827] hover:bg-[#0F172A] text-white text-xs font-bold rounded-lg shadow-sm"
                      >
                        Confirm &amp; Assign Tech (Imran)
                      </button>
                      <button className="px-3 py-2 bg-[#F4F4F1] hover:bg-[#e8e8e3] text-[#2C2421] text-xs font-semibold rounded-lg border border-[#2C2421]/15">
                        Decline
                      </button>
                    </div>
                  </div>

                  <div className="p-5 bg-white rounded-xl border border-[#2C2421]/15 shadow-sm space-y-3">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-mono text-[#2C2421]/60 font-semibold">#BK-9018 • ESTIMATE_REVIEW</span>
                      <span className="text-[#111827] font-bold">Submitted by Tech Imran</span>
                    </div>
                    <div className="text-sm font-bold text-[#2C2421]">Toyota Corolla 2021</div>
                    <div className="text-xs text-[#2C2421]/80 font-mono">
                      Parts: PKR 12,600 | Proposed Labor: PKR 4,000
                    </div>
                    <div className="pt-2 flex items-center gap-2">
                      <button
                        onClick={onOpenDemo}
                        className="px-3.5 py-2 bg-[#111827] hover:bg-[#0F172A] text-white text-xs font-bold rounded-lg shadow-sm flex items-center gap-1.5"
                      >
                        <span className="material-symbols-outlined text-sm">send</span>
                        Send to Customer
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* TECHNICIAN VIEW */}
            {activeRole === "tech" && (
              <motion.div
                key="tech"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="space-y-6"
              >
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-[#2C2421]/15 pb-4 gap-2">
                  <div>
                    <span className="text-xs text-[#111827] font-mono font-bold uppercase">
                      ROLE: TECHNICIAN (Imran Mechanic)
                    </span>
                    <h3 className="text-2xl font-bold text-[#2C2421]">Assigned Diagnostic &amp; Repair Work</h3>
                  </div>
                  <span className="px-3 py-1 bg-[#111827]/10 text-[#111827] border border-[#111827]/20 text-xs font-mono rounded-full font-bold">
                    My Assigned Jobs Only
                  </span>
                </div>

                <div className="p-5 bg-white rounded-xl border border-[#2C2421]/15 shadow-sm space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-[#2C2421] text-base">Honda Civic 2016 — Physical Inspection</span>
                    <span className="px-3 py-1 rounded-full bg-[#111827]/10 text-[#111827] text-xs font-mono font-bold border border-[#111827]/20">
                      INSPECTING
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono">
                    <div className="p-3 bg-[#F4F4F1] rounded-lg border border-[#2C2421]/15">
                      <span className="text-[#2C2421]/60 block text-[10px]">Diagnosis</span>
                      <span className="text-[#2C2421] font-bold">Faulty Ignition Coil</span>
                    </div>
                    <div className="p-3 bg-[#F4F4F1] rounded-lg border border-[#2C2421]/15">
                      <span className="text-[#2C2421]/60 block text-[10px]">Parts Required</span>
                      <span className="text-[#2C2421] font-bold">Ignition Coil x1</span>
                    </div>
                    <div className="p-3 bg-[#F4F4F1] rounded-lg border border-[#2C2421]/15">
                      <span className="text-[#2C2421]/60 block text-[10px]">Labor Estimate</span>
                      <span className="text-[#111827] font-bold">PKR 4,000</span>
                    </div>
                  </div>

                  <div className="pt-2 flex items-center justify-between">
                    <span className="text-xs text-[#2C2421]/70">Technician submits estimate to Service Advisor for client dispatch.</span>
                    <button
                      onClick={onOpenDemo}
                      className="px-4 py-2.5 bg-[#111827] hover:bg-[#0F172A] text-white text-xs font-bold rounded-xl shadow-sm"
                    >
                      Submit Estimate to SA
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* PARTS PERSON VIEW */}
            {activeRole === "parts" && (
              <motion.div
                key="parts"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="space-y-6"
              >
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-[#2C2421]/15 pb-4 gap-2">
                  <div>
                    <span className="text-xs text-[#111827] font-mono font-bold uppercase">
                      ROLE: PARTS PERSON (Usman Inventory)
                    </span>
                    <h3 className="text-2xl font-bold text-[#2C2421]">Inventory Allocation &amp; Purchase Orders</h3>
                  </div>
                  <span className="px-3 py-1 bg-[#111827]/10 text-[#111827] border border-[#111827]/20 text-xs font-mono rounded-full font-bold">
                    Stock Desk
                  </span>
                </div>

                <div className="p-5 bg-white rounded-xl border border-[#2C2421]/15 shadow-sm space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs font-mono text-[#2C2421]/60">SKU: IGN-COIL-CIVIC-16</span>
                      <div className="text-base font-bold text-[#2C2421]">Honda Civic Ignition Coil</div>
                    </div>
                    <div className="text-right">
                      <span className="text-xs text-[#2C2421]/60 block">Current Stock</span>
                      <span className={`text-lg font-bold font-mono ${partsInStock > 0 ? "text-[#111827]" : "text-red-700"}`}>
                        {partsInStock} Units
                      </span>
                    </div>
                  </div>

                  <div className="p-3.5 bg-[#F4F4F1] rounded-xl text-xs text-[#2C2421] flex items-center justify-between border border-[#2C2421]/15">
                    <span>
                      {partsInStock === 0
                        ? "Stock Shortage for Booking #BK-9021. Create Purchase Order to receive item."
                        : "Stock Ready. Click allocate to deduct from stock and move booking to IN_REPAIR."}
                    </span>
                    {partsInStock === 0 ? (
                      <button
                        onClick={() => setPartsInStock(1)}
                        className="px-3.5 py-2 bg-[#111827] hover:bg-[#0F172A] text-white text-xs font-bold rounded-lg shadow-sm"
                      >
                        Confirm PO Delivery (+1)
                      </button>
                    ) : (
                      <button
                        onClick={() => setPartsInStock(0)}
                        className="px-3.5 py-2 bg-[#111827] hover:bg-[#0F172A] text-white text-xs font-bold rounded-lg shadow-sm"
                      >
                        Allocate to Booking
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            {/* QC INSPECTOR VIEW */}
            {activeRole === "qc" && (
              <motion.div
                key="qc"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="space-y-6"
              >
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-[#2C2421]/15 pb-4 gap-2">
                  <div>
                    <span className="text-xs text-[#111827] font-mono font-bold uppercase">
                      ROLE: QC INSPECTOR (Sara QC)
                    </span>
                    <h3 className="text-2xl font-bold text-[#2C2421]">Shared Quality Control Queue</h3>
                  </div>
                  <span className="px-3 py-1 bg-[#111827]/10 text-[#111827] border border-[#111827]/20 text-xs font-mono rounded-full font-bold">
                    Mandatory Pass Gate
                  </span>
                </div>

                <div className="p-5 bg-white rounded-xl border border-[#2C2421]/15 shadow-sm space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-[#2C2421] text-base">Job Inspection: Honda Civic 2016 (LEA-1234)</span>
                    <span className="text-xs font-mono text-[#2C2421]/60 font-semibold">Inspector: Sara</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
                    <div className="p-3 bg-[#F4F4F1] rounded-lg border border-[#2C2421]/15 text-[#2C2421]">
                      ✓ Ignition Coil Spark Check
                    </div>
                    <div className="p-3 bg-[#F4F4F1] rounded-lg border border-[#2C2421]/15 text-[#2C2421]">
                      ✓ Engine Idle Smoothness
                    </div>
                    <div className="p-3 bg-[#F4F4F1] rounded-lg border border-[#2C2421]/15 text-[#2C2421] font-semibold">
                      {qcStatus === "fail" ? "⚠️ Minor Oil Leak" : "● Oil Seal Inspection"}
                    </div>
                  </div>

                  <div className="pt-2 flex items-center gap-3">
                    <button
                      onClick={() => setQcStatus("pass")}
                      className="px-4 py-2.5 bg-[#111827] hover:bg-[#0F172A] text-white text-xs font-bold rounded-xl shadow-sm flex items-center gap-1.5"
                    >
                      <span className="material-symbols-outlined text-sm">check_circle</span>
                      Pass QC (Ready for Pickup)
                    </button>
                    <button
                      onClick={() => setQcStatus("fail")}
                      className="px-4 py-2.5 bg-stone-800 hover:bg-stone-900 text-white text-xs font-bold rounded-xl shadow-sm flex items-center gap-1.5"
                    >
                      <span className="material-symbols-outlined text-sm">cancel</span>
                      Fail QC (Return Issue)
                    </button>
                  </div>

                  {qcStatus === "fail" && (
                    <div className="p-3.5 bg-stone-100 border border-stone-300 rounded-xl text-xs text-[#2C2421] font-mono">
                      <strong>Issue Logged:</strong> Minor oil leak. Job status reset to <code>IN_REPAIR</code>.
                    </div>
                  )}
                  {qcStatus === "pass" && (
                    <div className="p-3.5 bg-[#111827]/10 border border-[#111827]/20 rounded-xl text-xs text-[#111827] font-mono">
                      <strong>QC Passed!</strong> Job moved to <code>READY_FOR_PICKUP</code>.
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {/* SHOP OWNER VIEW */}
            {activeRole === "owner" && (
              <motion.div
                key="owner"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="space-y-6"
              >
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-[#2C2421]/15 pb-4 gap-2">
                  <div>
                    <span className="text-xs text-[#111827] font-mono font-bold uppercase">
                      ROLE: SHOP OWNER (Fatima Raza)
                    </span>
                    <h3 className="text-2xl font-bold text-[#2C2421]">Multi-Shop Control &amp; Team Management</h3>
                  </div>
                  <span className="px-3 py-1 bg-[#111827]/10 text-[#111827] border border-[#111827]/20 text-xs font-mono rounded-full font-bold">
                    Owner Dashboard
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-4 bg-white rounded-xl border border-[#2C2421]/15 shadow-sm">
                    <div className="text-xs text-[#2C2421]/60 font-medium">Total Garage Bookings</div>
                    <div className="text-2xl font-bold text-[#2C2421] font-mono mt-1">142</div>
                  </div>
                  <div className="p-4 bg-white rounded-xl border border-[#2C2421]/15 shadow-sm">
                    <div className="text-xs text-[#2C2421]/60 font-medium">Average Turnaround</div>
                    <div className="text-2xl font-bold text-[#111827] font-mono mt-1">3.2 Hours</div>
                  </div>
                  <div className="p-4 bg-white rounded-xl border border-[#2C2421]/15 shadow-sm">
                    <div className="text-xs text-[#2C2421]/60 font-medium">QC Pass Rate</div>
                    <div className="text-2xl font-bold text-[#111827] font-mono mt-1">94.8%</div>
                  </div>
                </div>

                <div className="p-4 bg-white rounded-xl border border-[#2C2421]/15 shadow-sm flex items-center justify-between text-xs">
                  <span className="text-[#2C2421]/70 font-medium">Owners can configure services, manage shop team accounts, and monitor multi-branch performance.</span>
                  <button
                    onClick={onOpenDemo}
                    className="px-4 py-2 bg-[#111827] hover:bg-[#0F172A] text-white font-bold rounded-xl shadow-sm"
                  >
                    Open Owner Dashboard
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
