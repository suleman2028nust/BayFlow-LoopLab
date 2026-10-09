"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import DemoModal from "@/components/DemoModal";

function POSContent() {
  const searchParams = useSearchParams();
  const initialRole = (searchParams.get("role") as any) || "sa";
  const [activeRole, setActiveRole] = useState<"sa" | "tech" | "parts" | "qc" | "owner">(initialRole);
  const [demoModalOpen, setDemoModalOpen] = useState(false);

  // Sync role if url query changes
  useEffect(() => {
    const roleParam = searchParams.get("role");
    if (roleParam && ["sa", "tech", "parts", "qc", "owner"].includes(roleParam)) {
      setActiveRole(roleParam as any);
    }
  }, [searchParams]);

  // Demo interactive state
  const [bookings, setBookings] = useState([
    {
      id: "BK-9021",
      customer: "Ahmed Khan",
      phone: "+92 300 5550192",
      vehicle: "Honda Civic (2016) • LEA-1234",
      service: "Check Engine Light & Oil Change",
      notes: "Car vibrates at idle, engine light came on yesterday",
      status: "AWAITING_CUSTOMER",
      assignedTech: "Imran Khan",
      estimateTotal: "PKR 16,100",
      partsRequired: ["Ignition Coil x1", "Oil Filter x1", "Engine Oil 4L"],
      qcPassed: null as boolean | null,
      qcIssue: "",
    },
    {
      id: "BK-8840",
      customer: "Fatima Shah",
      phone: "+92 321 4440812",
      vehicle: "Toyota Corolla (2020) • KHI-9988",
      service: "Full Brake Pad Replacement",
      notes: "Squeaking sound from front wheels when braking",
      status: "PENDING",
      assignedTech: "Unassigned",
      estimateTotal: "PKR 9,500",
      partsRequired: ["Ceramic Brake Pads x2"],
      qcPassed: null as boolean | null,
      qcIssue: "",
    },
    {
      id: "BK-9104",
      customer: "Zainab Ali",
      phone: "+92 333 1119283",
      vehicle: "Suzuki Swift (2022) • ISL-7741",
      service: "AC Gas Charging & Filter",
      notes: "Air conditioner blowing warm air",
      status: "QC_PENDING",
      assignedTech: "Imran Khan",
      estimateTotal: "PKR 5,400",
      partsRequired: ["AC Filter x1", "R134a Gas Can"],
      qcPassed: null as boolean | null,
      qcIssue: "",
    },
  ]);

  const [inventory, setInventory] = useState([
    { sku: "PART-IGN-01", name: "Ignition Coil OEM", stock: 0, reorderLevel: 2, price: 6500 },
    { sku: "PART-FLT-02", name: "Honda OEM Oil Filter", stock: 12, reorderLevel: 5, price: 900 },
    { sku: "PART-OIL-4L", name: "5W-30 Synthetic Engine Oil 4L", stock: 8, reorderLevel: 3, price: 5200 },
    { sku: "PART-BRK-04", name: "Ceramic Brake Pads Pair", stock: 4, reorderLevel: 2, price: 5500 },
  ]);

  // Action handlers
  const handleConfirmBooking = (id: string, tech: string) => {
    setBookings((prev) =>
      prev.map((b) => (b.id === id ? { ...b, status: "ASSIGNED", assignedTech: tech } : b))
    );
  };

  const handleTechSubmitEstimate = (id: string) => {
    setBookings((prev) =>
      prev.map((b) => (b.id === id ? { ...b, status: "ESTIMATE_REVIEW" } : b))
    );
  };

  const handleSASendEstimate = (id: string) => {
    setBookings((prev) =>
      prev.map((b) => (b.id === id ? { ...b, status: "AWAITING_CUSTOMER" } : b))
    );
  };

  const handleOrderPart = (sku: string) => {
    setInventory((prev) =>
      prev.map((item) => (item.sku === sku ? { ...item, stock: item.stock + 5 } : item))
    );
  };

  const handleQCPass = (id: string) => {
    setBookings((prev) =>
      prev.map((b) => (b.id === id ? { ...b, status: "READY_FOR_PICKUP", qcPassed: true } : b))
    );
  };

  const handleQCFail = (id: string, issue: string) => {
    setBookings((prev) =>
      prev.map((b) =>
        b.id === id ? { ...b, status: "IN_REPAIR", qcPassed: false, qcIssue: issue } : b
      )
    );
  };

  return (
    <div className="min-h-screen bg-[#F4F4F1] text-[#2C2421] flex flex-col font-sans">
      <Navbar onOpenDemo={() => setDemoModalOpen(true)} />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16">
        {/* Role Bar & Workshop Header */}
        <div className="bg-white rounded-2xl border border-[#2C2421]/15 p-6 mb-6 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#111827]/10 text-[#111827] text-xs font-bold mb-2">
              <span className="material-symbols-outlined text-sm">badge</span>
              <span>BAYFLOW SHOP POS • LAHORE AUTO CARE</span>
            </div>
            <h1 className="font-headline text-2xl sm:text-3xl font-extrabold text-[#2C2421]">
              Workshop POS Workspace
            </h1>
            <p className="text-xs sm:text-sm text-[#2C2421]/70 mt-1">
              Active Role: <strong className="text-[#2C2421] uppercase">{activeRole}</strong> • Scoped tenant isolation enforced server-side
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-[#2C2421]/60 font-semibold hidden sm:inline">Switch Role:</span>
            <div className="flex bg-[#F4F4F1] p-1 rounded-xl border border-[#2C2421]/15">
              {[
                { id: "sa", label: "SA" },
                { id: "tech", label: "Tech" },
                { id: "parts", label: "Parts" },
                { id: "qc", label: "QC" },
                { id: "owner", label: "Owner" },
              ].map((r) => (
                <button
                  key={r.id}
                  onClick={() => setActiveRole(r.id as any)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    activeRole === r.id
                      ? "bg-[#111827] text-white shadow-sm"
                      : "text-[#2C2421]/70 hover:text-[#2C2421]"
                  }`}
                >
                  {r.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ROLE POS WORKSPACES */}

        {/* 1. SERVICE ADVISOR VIEW */}
        {activeRole === "sa" && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-[#2C2421]/15 p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-headline text-lg font-bold text-[#2C2421] flex items-center gap-2">
                  <span className="material-symbols-outlined text-xl text-[#111827]">headset_mic</span>
                  <span>Service Advisor Master Board</span>
                </h2>
                <span className="px-3 py-1 bg-[#111827]/10 text-[#111827] text-xs font-bold rounded-full">
                  {bookings.length} Bookings Active
                </span>
              </div>

              <div className="space-y-4">
                {bookings.map((b) => (
                  <div
                    key={b.id}
                    className="p-5 rounded-xl border border-[#2C2421]/15 bg-[#F4F4F1]/50 flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-[#111827]">{b.id}</span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-extrabold uppercase bg-[#111827] text-white">
                          {b.status}
                        </span>
                        {b.qcIssue && (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#E85D22] text-white">
                            QC Issue: {b.qcIssue}
                          </span>
                        )}
                      </div>
                      <h3 className="font-bold text-base text-[#2C2421]">{b.customer} • <span className="text-xs font-normal text-[#2C2421]/70">{b.phone}</span></h3>
                      <p className="text-xs text-[#2C2421]/80 font-medium">Vehicle: {b.vehicle}</p>
                      <p className="text-xs text-[#2C2421]/60">Service: {b.service} | Notes: &quot;{b.notes}&quot;</p>
                      <div className="text-xs font-bold text-[#111827] pt-1">
                        Assigned Tech: {b.assignedTech} • Est. Total: {b.estimateTotal}
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
                      {b.status === "PENDING" && (
                        <button
                          onClick={() => handleConfirmBooking(b.id, "Imran Khan")}
                          className="px-4 py-2 bg-[#111827] hover:bg-[#0F172A] text-white text-xs font-bold rounded-xl shadow"
                        >
                          Confirm &amp; Assign Tech (Imran)
                        </button>
                      )}
                      {b.status === "ESTIMATE_REVIEW" && (
                        <button
                          onClick={() => handleSASendEstimate(b.id)}
                          className="px-4 py-2 bg-[#1F5C45] text-white text-xs font-bold rounded-xl shadow"
                        >
                          Review &amp; Send to Customer
                        </button>
                      )}
                      {b.status === "READY_FOR_PICKUP" && (
                        <button
                          onClick={() =>
                            setBookings((prev) =>
                              prev.map((item) => (item.id === b.id ? { ...item, status: "COMPLETED" } : item))
                            )
                          }
                          className="px-4 py-2 bg-[#1F5C45] text-white text-xs font-bold rounded-xl shadow"
                        >
                          Notify Customer &amp; Complete
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 2. TECHNICIAN VIEW */}
        {activeRole === "tech" && (
          <div className="bg-white rounded-2xl border border-[#2C2421]/15 p-6 shadow-sm">
            <h2 className="font-headline text-lg font-bold text-[#2C2421] flex items-center gap-2 mb-4">
              <span className="material-symbols-outlined text-xl text-[#111827]">engineering</span>
              <span>Technician Dashboard (Imran Khan)</span>
            </h2>

            <div className="space-y-4">
              {bookings.filter(b => b.assignedTech.includes("Imran") || b.status === "ASSIGNED" || b.status === "IN_REPAIR").map((b) => (
                <div key={b.id} className="p-5 rounded-xl border border-[#2C2421]/15 bg-[#F4F4F1]/50 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-[#111827]">{b.id} • {b.vehicle}</span>
                    <span className="px-2.5 py-0.5 rounded text-[10px] font-extrabold uppercase bg-[#111827] text-white">
                      {b.status}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-[#2C2421]">Problem Reported: {b.service}</h3>
                    <p className="text-xs text-[#2C2421]/70 mt-0.5">Notes: {b.notes}</p>
                  </div>

                  {/* Add Estimate Line Items */}
                  <div className="bg-white p-3.5 rounded-lg border border-[#2C2421]/15 space-y-2">
                    <div className="text-xs font-bold text-[#2C2421]">Estimate &amp; Diagnosis Line Items:</div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs text-[#2C2421]/80">
                      <div>Part: Ignition Coil OEM (PKR 6,500)</div>
                      <div>Engine Oil 4L (PKR 5,200)</div>
                      <div>Labor Fee (PKR 4,400)</div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <span className="text-xs font-bold text-[#111827]">Total: {b.estimateTotal}</span>
                    <button
                      onClick={() => handleTechSubmitEstimate(b.id)}
                      className="px-4 py-2 bg-[#111827] hover:bg-[#0F172A] text-white text-xs font-bold rounded-xl shadow"
                    >
                      Submit Inspection &amp; Estimate to SA
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 3. PARTS PERSON VIEW */}
        {activeRole === "parts" && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-[#2C2421]/15 p-6 shadow-sm">
              <h2 className="font-headline text-lg font-bold text-[#2C2421] flex items-center gap-2 mb-4">
                <span className="material-symbols-outlined text-xl text-[#111827]">inventory_2</span>
                <span>Parts Inventory &amp; Procurement</span>
              </h2>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-[#2C2421]/15 text-[#2C2421]/60 font-semibold uppercase">
                      <th className="pb-3">SKU</th>
                      <th className="pb-3">Item Description</th>
                      <th className="pb-3">In Stock</th>
                      <th className="pb-3">Reorder Threshold</th>
                      <th className="pb-3">Unit Price</th>
                      <th className="pb-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#2C2421]/10 text-[#2C2421]">
                    {inventory.map((item) => (
                      <tr key={item.sku}>
                        <td className="py-3 font-mono text-[#111827] font-bold">{item.sku}</td>
                        <td className="py-3 font-semibold">{item.name}</td>
                        <td className="py-3">
                          <span
                            className={`px-2 py-0.5 rounded font-bold text-[11px] ${
                              item.stock === 0
                                ? "bg-[#E85D22]/15 text-[#E85D22]"
                                : "bg-[#1F5C45]/15 text-[#1F5C45]"
                            }`}
                          >
                            {item.stock} unidades
                          </span>
                        </td>
                        <td className="py-3 text-[#2C2421]/70">{item.reorderLevel}</td>
                        <td className="py-3 font-bold">PKR {item.price.toLocaleString()}</td>
                        <td className="py-3 text-right">
                          <button
                            onClick={() => handleOrderPart(item.sku)}
                            className="px-3 py-1 bg-[#111827] text-white text-[11px] font-bold rounded-lg hover:bg-[#0F172A]"
                          >
                            Create PO (+5)
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* 4. QC INSPECTOR VIEW */}
        {activeRole === "qc" && (
          <div className="bg-white rounded-2xl border border-[#2C2421]/15 p-6 shadow-sm">
            <h2 className="font-headline text-lg font-bold text-[#2C2421] flex items-center gap-2 mb-4">
              <span className="material-symbols-outlined text-xl text-[#111827]">fact_check</span>
              <span>Quality Control Inspection Queue</span>
            </h2>

            <div className="space-y-4">
              {bookings.filter(b => b.status === "QC_PENDING" || b.status === "QC_IN_PROGRESS").map((b) => (
                <div key={b.id} className="p-5 rounded-xl border border-[#2C2421]/15 bg-[#F4F4F1]/50 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-[#111827]">{b.id} • {b.vehicle}</span>
                    <span className="px-2 py-0.5 bg-[#111827] text-white text-[10px] font-bold uppercase rounded">
                      QC PENDING
                    </span>
                  </div>
                  <p className="text-xs text-[#2C2421]/70">Repairs completed by Technician: {b.assignedTech}</p>

                  <div className="flex flex-wrap items-center gap-3 pt-2">
                    <button
                      onClick={() => handleQCPass(b.id)}
                      className="px-4 py-2 bg-[#1F5C45] hover:bg-[#164433] text-white text-xs font-bold rounded-xl shadow flex items-center gap-1"
                    >
                      <span className="material-symbols-outlined text-base">check_circle</span>
                      <span>Pass QC (Ready For Pickup)</span>
                    </button>
                    <button
                      onClick={() => handleQCFail(b.id, "Minor seal leak detected")}
                      className="px-4 py-2 bg-[#E85D22] hover:bg-[#d04e17] text-white text-xs font-bold rounded-xl shadow flex items-center gap-1"
                    >
                      <span className="material-symbols-outlined text-base">cancel</span>
                      <span>Fail QC (Return to Tech with Issue)</span>
                    </button>
                  </div>
                </div>
              ))}
              {bookings.filter(b => b.status === "QC_PENDING" || b.status === "QC_IN_PROGRESS").length === 0 && (
                <p className="text-xs text-[#2C2421]/60 py-4 text-center">No vehicles pending quality control inspection.</p>
              )}
            </div>
          </div>
        )}

        {/* 5. OWNER VIEW */}
        {activeRole === "owner" && (
          <div className="bg-white rounded-2xl border border-[#2C2421]/15 p-6 shadow-sm">
            <h2 className="font-headline text-lg font-bold text-[#2C2421] mb-2">Shop Owner POS View</h2>
            <p className="text-xs text-[#2C2421]/70 mb-4">Owners have full visibility across all role workflows.</p>
            <Link
              href="/owner"
              className="inline-flex items-center gap-2 px-4 py-2 bg-[#111827] text-white text-xs font-bold rounded-xl hover:bg-[#0F172A]"
            >
              <span>Go to Full Owner Multi-Shop Dashboard</span>
              <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </Link>
          </div>
        )}
      </main>

      <Footer />
      <DemoModal isOpen={demoModalOpen} onClose={() => setDemoModalOpen(false)} />
    </div>
  );
}

export default function POSPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs">Loading POS...</div>}>
      <POSContent />
    </Suspense>
  );
}
