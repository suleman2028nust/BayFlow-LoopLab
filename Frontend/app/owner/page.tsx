"use client";

import React, { useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import DemoModal from "@/components/DemoModal";

export default function OwnerDashboardPage() {
  const [demoModalOpen, setDemoModalOpen] = useState(false);
  const [activeShop, setActiveShop] = useState("Lahore Auto Care");
  const [activeTab, setActiveTab] = useState<"overview" | "shops" | "team" | "catalog" | "inventory">("overview");

  const shops = [
    { id: "s1", name: "Lahore Auto Care", city: "Lahore", activeJobs: 8, revenue: "PKR 485,000", teamCount: 5, status: "Active" },
    { id: "s2", name: "Apex Performance Garage", city: "Karachi", activeJobs: 5, revenue: "PKR 620,000", teamCount: 4, status: "Active" },
    { id: "s3", name: "Garaj Master Workshop", city: "Islamabad", activeJobs: 3, revenue: "PKR 310,000", teamCount: 3, status: "Active" },
  ];

  const teamMembers = [
    { id: "t1", name: "Bilal Ahmed", role: "Service Advisor", email: "bilal.sa@bayflow.com", shop: "Lahore Auto Care", status: "Active" },
    { id: "t2", name: "Imran Khan", role: "Technician", email: "imran.tech@bayflow.com", shop: "Lahore Auto Care", status: "Active" },
    { id: "t3", name: "Sara Raza", role: "QC Inspector", email: "sara.qc@bayflow.com", shop: "Lahore Auto Care", status: "Active" },
    { id: "t4", name: "Usman Malik", role: "Parts Person", email: "usman.parts@bayflow.com", shop: "Lahore Auto Care", status: "Active" },
  ];

  const catalog = [
    { id: "c1", name: "Engine Diagnostic & Scanner Check", duration: "30 mins", price: "PKR 2,500", desc: "Comprehensive OBD-II computer scan" },
    { id: "c2", name: "Synthetic Oil & Filter Change", duration: "45 mins", price: "PKR 6,100", desc: "4L Premium synthetic oil + OEM filter" },
    { id: "c3", name: "Front Brake Pad Replacement", duration: "60 mins", price: "PKR 7,500", desc: "Ceramic pad fitting & rotor resurfacing" },
    { id: "c4", name: "Aircon Gas Refill & Leak Inspection", duration: "40 mins", price: "PKR 4,800", desc: "R134a refrigerant charge with UV dye" },
  ];

  return (
    <div className="min-h-screen bg-[#F4F4F1] text-[#2C2421] flex flex-col font-sans">
      <Navbar onOpenDemo={() => setDemoModalOpen(true)} />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16">
        {/* Owner Header */}
        <div className="bg-white rounded-2xl border border-[#2C2421]/15 p-6 mb-8 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#111827]/10 text-[#111827] text-xs font-bold mb-2">
              <span className="material-symbols-outlined text-sm">admin_panel_settings</span>
              <span>MULTISHOP OWNER DASHBOARD</span>
            </div>
            <h1 className="font-headline text-2xl sm:text-3xl font-extrabold text-[#2C2421]">
              Welcome, Mrs. Fatima Raza
            </h1>
            <p className="text-xs sm:text-sm text-[#2C2421]/70 mt-1">
              Managing 3 Branches • 16 Active Jobs • PKR 1.41M Total Revenue (This Month)
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Shop Switcher */}
            <div className="flex items-center gap-2 bg-[#F4F4F1] px-3.5 py-2 rounded-xl border border-[#2C2421]/15">
              <span className="material-symbols-outlined text-base text-[#111827]">storefront</span>
              <select
                value={activeShop}
                onChange={(e) => setActiveShop(e.target.value)}
                className="bg-transparent text-xs font-bold text-[#2C2421] focus:outline-none cursor-pointer"
              >
                {shops.map((s) => (
                  <option key={s.id} value={s.name}>{s.name} ({s.city})</option>
                ))}
              </select>
            </div>

            <Link
              href="/owner/whatsapp"
              className="px-4 py-2 bg-[#1F5C45] hover:bg-[#164433] text-white text-xs font-bold rounded-xl shadow transition-all flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-base">chat</span>
              <span>WhatsApp Automation</span>
            </Link>
          </div>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-6">
          {[
            { id: "overview", label: "Multi-Shop Overview", icon: "dashboard" },
            { id: "shops", label: "My Shops (3)", icon: "store" },
            { id: "team", label: "Team & Roles", icon: "group" },
            { id: "catalog", label: "Service Catalog", icon: "home_repair_service" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap border ${
                activeTab === tab.id
                  ? "bg-[#111827] text-white border-[#111827] shadow-sm"
                  : "bg-white text-[#2C2421]/70 border-[#2C2421]/15 hover:text-[#2C2421]"
              }`}
            >
              <span className="material-symbols-outlined text-base">{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* TAB CONTENTS */}
        {activeTab === "overview" && (
          <div className="space-y-6">
            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white p-5 rounded-2xl border border-[#2C2421]/15 shadow-sm">
                <span className="text-xs text-[#2C2421]/60 font-semibold uppercase tracking-wider">Active Repair Jobs</span>
                <div className="text-3xl font-extrabold text-[#2C2421] mt-2">16</div>
                <span className="text-[11px] text-[#1F5C45] font-bold mt-1 inline-block">↑ 12% vs last week</span>
              </div>
              <div className="bg-white p-5 rounded-2xl border border-[#2C2421]/15 shadow-sm">
                <span className="text-xs text-[#2C2421]/60 font-semibold uppercase tracking-wider">Monthly Revenue</span>
                <div className="text-3xl font-extrabold text-[#2C2421] mt-2">PKR 1.41M</div>
                <span className="text-[11px] text-[#1F5C45] font-bold mt-1 inline-block">Across 3 branches</span>
              </div>
              <div className="bg-white p-5 rounded-2xl border border-[#2C2421]/15 shadow-sm">
                <span className="text-xs text-[#2C2421]/60 font-semibold uppercase tracking-wider">QC Pass Rate</span>
                <div className="text-3xl font-extrabold text-[#111827] mt-2">94.2%</div>
                <span className="text-[11px] text-[#2C2421]/60 font-medium mt-1 inline-block">Mandatory QC enforced</span>
              </div>
              <div className="bg-white p-5 rounded-2xl border border-[#2C2421]/15 shadow-sm">
                <span className="text-xs text-[#2C2421]/60 font-semibold uppercase tracking-wider">Total Staff</span>
                <div className="text-3xl font-extrabold text-[#2C2421] mt-2">12 Members</div>
                <span className="text-[11px] text-[#2C2421]/60 font-medium mt-1 inline-block">4 Roles per shop</span>
              </div>
            </div>

            {/* Shop Cards */}
            <div className="bg-white rounded-2xl border border-[#2C2421]/15 p-6 shadow-sm">
              <h2 className="font-headline text-lg font-bold text-[#2C2421] mb-4">Branch Performance</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {shops.map((s) => (
                  <div key={s.id} className="p-4 rounded-xl border border-[#2C2421]/15 bg-[#F4F4F1]/50 flex flex-col justify-between gap-3">
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold text-sm text-[#2C2421]">{s.name}</h3>
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#1F5C45]/15 text-[#1F5C45]">{s.status}</span>
                    </div>
                    <div className="text-xs text-[#2C2421]/70 space-y-1">
                      <div>City: <strong className="text-[#2C2421]">{s.city}</strong></div>
                      <div>Active Jobs: <strong className="text-[#2C2421]">{s.activeJobs}</strong></div>
                      <div>Revenue: <strong className="text-[#2C2421]">{s.revenue}</strong></div>
                    </div>
                    <Link
                      href={`/pos?shopId=${s.id}`}
                      className="w-full py-2 bg-[#111827] text-white text-xs font-bold rounded-lg text-center hover:bg-[#0F172A] transition-all"
                    >
                      Open POS Workspace
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === "shops" && (
          <div className="bg-white rounded-2xl border border-[#2C2421]/15 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-headline text-lg font-bold text-[#2C2421]">Managed Shops</h2>
              <button className="px-4 py-2 bg-[#111827] text-white text-xs font-bold rounded-xl hover:bg-[#0F172A] transition-all flex items-center gap-1">
                <span className="material-symbols-outlined text-base">add</span>
                <span>Add New Shop</span>
              </button>
            </div>
            <div className="divide-y divide-[#2C2421]/10">
              {shops.map((s) => (
                <div key={s.id} className="py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="font-bold text-sm text-[#2C2421]">{s.name}</h3>
                    <p className="text-xs text-[#2C2421]/60">Location: {s.city} • Slot Duration: 40 mins • Capacity: 6 slots/day</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-bold text-[#1F5C45]">{s.teamCount} Team Members</span>
                    <button className="px-3 py-1.5 border border-[#2C2421]/15 text-xs font-bold rounded-lg hover:bg-[#F4F4F1]">
                      Edit Settings
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "team" && (
          <div className="bg-white rounded-2xl border border-[#2C2421]/15 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="font-headline text-lg font-bold text-[#2C2421]">Shop Team Members</h2>
                <p className="text-xs text-[#2C2421]/60">Staff accounts are created by the owner (no self sign-up allowed for security)</p>
              </div>
              <button className="px-4 py-2 bg-[#111827] text-white text-xs font-bold rounded-xl hover:bg-[#0F172A] transition-all flex items-center gap-1">
                <span className="material-symbols-outlined text-base">person_add</span>
                <span>Add Team Member</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-[#2C2421]/15 text-[#2C2421]/60 font-semibold uppercase">
                    <th className="pb-3">Name</th>
                    <th className="pb-3">Role</th>
                    <th className="pb-3">Email / Login</th>
                    <th className="pb-3">Assigned Shop</th>
                    <th className="pb-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#2C2421]/10 text-[#2C2421]">
                  {teamMembers.map((m) => (
                    <tr key={m.id}>
                      <td className="py-3.5 font-bold">{m.name}</td>
                      <td className="py-3.5">
                        <span className="px-2 py-0.5 rounded bg-[#111827]/10 text-[#111827] font-semibold text-[11px]">
                          {m.role}
                        </span>
                      </td>
                      <td className="py-3.5 font-mono text-[#2C2421]/70">{m.email}</td>
                      <td className="py-3.5">{m.shop}</td>
                      <td className="py-3.5 text-right">
                        <button className="text-xs font-bold text-[#E85D22] hover:underline">Edit Role</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === "catalog" && (
          <div className="bg-white rounded-2xl border border-[#2C2421]/15 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-headline text-lg font-bold text-[#2C2421]">Master Service Catalog</h2>
              <button className="px-4 py-2 bg-[#111827] text-white text-xs font-bold rounded-xl hover:bg-[#0F172A] transition-all flex items-center gap-1">
                <span className="material-symbols-outlined text-base">add</span>
                <span>Add Service</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {catalog.map((c) => (
                <div key={c.id} className="p-4 rounded-xl border border-[#2C2421]/15 bg-[#F4F4F1]/40 flex flex-col justify-between gap-2">
                  <div>
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold text-sm text-[#2C2421]">{c.name}</h3>
                      <span className="text-xs font-bold text-[#1F5C45]">{c.price}</span>
                    </div>
                    <p className="text-xs text-[#2C2421]/60 mt-1">{c.desc}</p>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-[#2C2421]/50 border-t border-[#2C2421]/10 pt-2 mt-2">
                    <span>Est. Duration: {c.duration}</span>
                    <button className="text-[#111827] font-bold hover:underline">Edit Service</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      <Footer />
      <DemoModal isOpen={demoModalOpen} onClose={() => setDemoModalOpen(false)} />
    </div>
  );
}
