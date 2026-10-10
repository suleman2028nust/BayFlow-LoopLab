"use client";

import React, { useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import DemoModal from "@/components/DemoModal";

export default function CustomerPortalPage() {
  const [demoModalOpen, setDemoModalOpen] = useState(false);
  const [estimateStatus, setEstimateStatus] = useState<"pending" | "approved" | "rejected">("pending");

  const booking = {
    id: "BK-9021",
    shopName: "Lahore Auto Care",
    shopAddress: "Main Gulberg III, Lahore",
    shopPhone: "+92 42 3578 9900",
    vehicle: "2016 Honda Civic (Plate: LEA-1234)",
    reportedIssue: "Check engine light came on & car vibrates at idle",
    appointmentSlot: "Friday, Oct 10 @ 10:00 AM",
    currentStatus: estimateStatus === "approved" ? "ESTIMATE_APPROVED" : estimateStatus === "rejected" ? "ESTIMATE_REJECTED" : "AWAITING_CUSTOMER",
    estimateItems: [
      { name: "Ignition Coil OEM Replacement", type: "Part", cost: 6500 },
      { name: "Engine Oil 4L (5W-30 Synthetic)", type: "Part", cost: 5200 },
      { name: "Honda OEM Oil Filter", type: "Part", cost: 900 },
      { name: "Labor & OBD-II Scanner Diagnostic", type: "Labor", cost: 3500 },
    ],
    total: 16100,
  };

  const steps = [
    { title: "Booking Created", status: "PENDING", done: true },
    { title: "Assigned Tech", status: "ASSIGNED", done: true },
    { title: "Physical Inspection", status: "INSPECTING", done: true },
    { title: "Estimate Review", status: "AWAITING_CUSTOMER", active: estimateStatus === "pending", done: estimateStatus !== "pending" },
    { title: "Parts & Repair", status: "IN_REPAIR", done: estimateStatus === "approved" },
    { title: "Quality Check", status: "QC_PENDING", done: false },
    { title: "Ready for Pickup", status: "READY_FOR_PICKUP", done: false },
  ];

  return (
    <div className="min-h-screen bg-[#F4F4F1] text-[#2C2421] flex flex-col font-sans">
      <Navbar onOpenDemo={() => setDemoModalOpen(true)} />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16">
        {/* Customer Welcome Header */}
        <div className="bg-white rounded-2xl border border-[#2C2421]/15 p-6 mb-8 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#111827]/10 text-[#111827] text-xs font-bold mb-2">
              <span className="material-symbols-outlined text-sm">directions_car</span>
              <span>CUSTOMER PORTAL</span>
            </div>
            <h1 className="font-headline text-2xl sm:text-3xl font-extrabold text-[#2C2421]">
              Hello, Ahmed Khan
            </h1>
            <p className="text-xs sm:text-sm text-[#2C2421]/70 mt-1">
              Tracking Active Service for <strong className="text-[#2C2421]">{booking.vehicle}</strong>
            </p>
          </div>

          <Link
            href="/book"
            className="px-4 py-2 bg-[#111827] text-white text-xs font-bold rounded-xl hover:bg-[#0F172A] transition-all flex items-center gap-1.5 shadow"
          >
            <span className="material-symbols-outlined text-base">auto_fix_high</span>
            <span>Guided Booking Wizard</span>
          </Link>
        </div>

        {/* ACTIVE BOOKING CARD */}
        <div className="bg-white rounded-2xl border border-[#2C2421]/15 p-6 sm:p-8 shadow-sm mb-8 space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-[#2C2421]/10 pb-4 gap-2">
            <div>
              <span className="font-mono text-xs font-bold text-[#111827]">Ref: {booking.id}</span>
              <h2 className="font-headline text-xl font-bold text-[#2C2421]">{booking.shopName}</h2>
              <p className="text-xs text-[#2C2421]/60">{booking.shopAddress} • {booking.shopPhone}</p>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-[#2C2421]/60 font-medium">Status:</span>
              <span className={`px-3 py-1 rounded-full text-xs font-extrabold uppercase ${
                estimateStatus === "approved" ? "bg-[#1F5C45] text-white" : estimateStatus === "rejected" ? "bg-[#E85D22] text-white" : "bg-[#111827] text-white"
              }`}>
                {booking.currentStatus}
              </span>
            </div>
          </div>

          {/* Lifecycle Progress Stepper */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#2C2421]/70 mb-4">
              Live Vehicle Status Timeline
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
              {steps.map((s, idx) => (
                <div
                  key={idx}
                  className={`p-3 rounded-xl border text-center transition-all ${
                    s.done
                      ? "bg-[#1F5C45]/10 border-[#1F5C45] text-[#1F5C45]"
                      : s.active
                      ? "bg-[#111827] border-[#111827] text-white shadow"
                      : "bg-[#F4F4F1] border-[#2C2421]/15 text-[#2C2421]/50"
                  }`}
                >
                  <div className="text-[10px] font-mono font-bold uppercase">Step {idx + 1}</div>
                  <div className="text-xs font-bold mt-1 leading-tight">{s.title}</div>
                </div>
              ))}
            </div>
          </div>

          {/* ITEMIZATION & APPROVAL BANNER */}
          <div className="bg-[#F4F4F1]/60 rounded-xl border border-[#2C2421]/15 p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-[#2C2421] flex items-center gap-1.5">
                <span className="material-symbols-outlined text-base text-[#111827]">receipt_long</span>
                <span>Technician Repair Estimate</span>
              </h3>
              <span className="text-xs text-[#2C2421]/60 font-medium">Submitted by SA Bilal</span>
            </div>

            <div className="divide-y divide-[#2C2421]/10 text-xs">
              {booking.estimateItems.map((item, idx) => (
                <div key={idx} className="py-2.5 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-[#2C2421]">{item.name}</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-white border border-[#2C2421]/15 text-[#2C2421]/60 ml-2">
                      {item.type}
                    </span>
                  </div>
                  <span className="font-bold text-[#111827]">PKR {item.cost.toLocaleString()}</span>
                </div>
              ))}
              <div className="pt-3 flex items-center justify-between font-extrabold text-sm text-[#2C2421]">
                <span>Total Cost Estimate:</span>
                <span className="text-base text-[#111827]">PKR {booking.total.toLocaleString()}</span>
              </div>
            </div>

            {/* Approval Controls */}
            {estimateStatus === "pending" && (
              <div className="pt-2 border-t border-[#2C2421]/15 flex flex-col sm:flex-row items-center justify-between gap-3">
                <p className="text-xs text-[#2C2421]/70 font-medium">
                  Please review the estimate items above and accept to authorize repair start.
                </p>
                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <button
                    onClick={() => setEstimateStatus("rejected")}
                    className="w-full sm:w-auto px-4 py-2.5 border border-[#E85D22] text-[#E85D22] hover:bg-[#E85D22]/10 font-bold text-xs rounded-xl transition-all"
                  >
                    Reject Estimate
                  </button>
                  <button
                    onClick={() => setEstimateStatus("approved")}
                    className="w-full sm:w-auto px-6 py-2.5 bg-[#1F5C45] hover:bg-[#164433] text-white font-bold text-xs rounded-xl shadow transition-all"
                  >
                    Approve Estimate (PKR 16,100)
                  </button>
                </div>
              </div>
            )}

            {estimateStatus === "approved" && (
              <div className="p-3 bg-[#1F5C45]/15 border border-[#1F5C45]/30 rounded-lg text-xs font-bold text-[#1F5C45] flex items-center gap-2">
                <span className="material-symbols-outlined text-base">check_circle</span>
                <span>Estimate approved by customer on {new Date().toLocaleDateString()}. Parts allocation in progress.</span>
              </div>
            )}

            {estimateStatus === "rejected" && (
              <div className="p-3 bg-[#E85D22]/15 border border-[#E85D22]/30 rounded-lg text-xs font-bold text-[#E85D22] flex items-center gap-2">
                <span className="material-symbols-outlined text-base">info</span>
                <span>Estimate rejected. Service Advisor notified to revise quote or cancel booking.</span>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
      <DemoModal isOpen={demoModalOpen} onClose={() => setDemoModalOpen(false)} />
    </div>
  );
}
