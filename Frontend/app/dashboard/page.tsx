"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

interface WorkOrder {
  id: string;
  bayId: string;
  bayNumber: string;
  bayName: string;
  bayType: string;
  status: "in_progress" | "waiting_part" | "final_inspection" | "completed" | "available";
  statusLabel: string;
  statusColor: string;
  vehicle: string;
  service: string;
  technician: string;
  technicianRole?: string;
  estimatedFinish?: string;
  handoffStatus?: string;
  partStatus?: string;
  customer: string;
  customerPhone?: string;
  roNumber: string;
  progressPercent: number;
  timelineStart?: string;
  timelineEnd?: string;
}

const INITIAL_BAYS: WorkOrder[] = [
  {
    id: "wo-01",
    bayId: "bay-01",
    bayNumber: "01",
    bayName: "DYNO & TUNING CELL",
    bayType: "Dyno Cell",
    status: "in_progress",
    statusLabel: "In Progress",
    statusColor: "#E85D22",
    vehicle: "FERRARI 296 GTB",
    service: "ECU Tuning & Dyno Verification",
    technician: "Marco R.",
    technicianRole: "Master Hybrid Calibration",
    estimatedFinish: "2:30 PM (42m left)",
    customer: "Julian Sterling",
    customerPhone: "(555) 349-2910",
    roNumber: "RO #BF-9401",
    progressPercent: 70,
    timelineStart: "10:00 AM",
    timelineEnd: "02:30 PM",
  },
  {
    id: "wo-02",
    bayId: "bay-02",
    bayNumber: "02",
    bayName: "HYDRAULIC LIFT A",
    bayType: "Lift Station",
    status: "in_progress",
    statusLabel: "In Progress",
    statusColor: "#E85D22",
    vehicle: "PORSCHE 911 GT3 RS",
    service: "Brake Bleed & Corner Balance",
    technician: "Liam K.",
    technicianRole: "Chassis & Suspension Spec.",
    estimatedFinish: "4:15 PM",
    customer: "Marcus Vance",
    customerPhone: "(555) 812-4491",
    roNumber: "RO #BF-9402",
    progressPercent: 45,
    timelineStart: "11:30 AM",
    timelineEnd: "04:15 PM",
  },
  {
    id: "wo-03",
    bayId: "bay-03",
    bayNumber: "03",
    bayName: "POWERTRAIN RIG",
    bayType: "Engine Cell",
    status: "waiting_part",
    statusLabel: "Waiting on Part",
    statusColor: "#F59E0B",
    vehicle: "MCLAREN 720S",
    service: "Turbo Service & Intercooler Inspection",
    technician: "Dave C.",
    technicianRole: "Senior Powertrain Tech",
    partStatus: "Gasket arriving 3:15 PM",
    customer: "David Holloway",
    customerPhone: "(555) 902-1823",
    roNumber: "RO #BF-9403",
    progressPercent: 35,
    timelineStart: "09:00 AM",
    timelineEnd: "05:00 PM",
  },
  {
    id: "wo-04",
    bayId: "bay-04",
    bayNumber: "04",
    bayName: "HIGH-VOLTAGE EV BAY",
    bayType: "EV Specialist",
    status: "final_inspection",
    statusLabel: "Final Inspection",
    statusColor: "#6366F1",
    vehicle: "AUDI RS E-TRON GT",
    service: "High-Voltage Diagnostics & Balancing",
    technician: "Sarah W.",
    technicianRole: "Certified EV Systems Engineer",
    estimatedFinish: "1:45 PM (Wrap-up)",
    customer: "Elena Rostov",
    customerPhone: "(555) 438-9921",
    roNumber: "RO #BF-9404",
    progressPercent: 90,
    timelineStart: "08:30 AM",
    timelineEnd: "01:45 PM",
  },
  {
    id: "wo-05",
    bayId: "bay-05",
    bayNumber: "05",
    bayName: "ALIGNMENT & QC DECK",
    bayType: "Quality Control",
    status: "completed",
    statusLabel: "Completed",
    statusColor: "#1F5C45",
    vehicle: "BMW M4 CSL",
    service: "Suspension Setup & Track Alignment",
    technician: "Marcus R.",
    technicianRole: "Shop Foreman",
    handoffStatus: "Ready for client pickup",
    customer: "Clara Henderson",
    customerPhone: "(555) 771-3042",
    roNumber: "RO #BF-9405",
    progressPercent: 100,
    timelineStart: "08:00 AM",
    timelineEnd: "11:15 AM",
  },
  {
    id: "wo-06",
    bayId: "bay-06",
    bayNumber: "06",
    bayName: "QUICK SERVICE BAY",
    bayType: "Quick Turnaround",
    status: "available",
    statusLabel: "Available",
    statusColor: "#8C7E78",
    vehicle: "",
    service: "",
    technician: "",
    customer: "",
    roNumber: "",
    progressPercent: 0,
  },
];

export default function DashboardPage() {
  const [bays, setBays] = useState<WorkOrder[]>(INITIAL_BAYS);
  const [viewMode, setViewMode] = useState<"grid" | "timeline">("grid");
  const [activeTab, setActiveTab] = useState<string>("operations");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedBay, setSelectedBay] = useState<WorkOrder | null>(null);
  const [isNewOrderModalOpen, setIsNewOrderModalOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // New Work Order Form State
  const [newVehicle, setNewVehicle] = useState("Porsche 992 GT3 RS");
  const [newCustomer, setNewCustomer] = useState("Alexander Wright");
  const [newService, setNewService] = useState("Full Teardown & Dyno Tune");
  const [newTech, setNewTech] = useState("Marco R.");
  const [newBay, setNewBay] = useState("06");

  // Filtered bays based on search query
  const filteredBays = useMemo(() => {
    if (!searchQuery.trim()) return bays;
    const q = searchQuery.toLowerCase();
    return bays.filter(
      (b) =>
        b.vehicle.toLowerCase().includes(q) ||
        b.service.toLowerCase().includes(q) ||
        b.technician.toLowerCase().includes(q) ||
        b.customer.toLowerCase().includes(q) ||
        b.roNumber.toLowerCase().includes(q) ||
        b.bayName.toLowerCase().includes(q)
    );
  }, [bays, searchQuery]);

  const handleCreateOrder = (e: React.FormEvent) => {
    e.preventDefault();
    const updated = bays.map((b) => {
      if (b.bayNumber === newBay) {
        return {
          ...b,
          status: "in_progress" as const,
          statusLabel: "In Progress",
          statusColor: "#E85D22",
          vehicle: newVehicle.toUpperCase(),
          service: newService,
          technician: newTech,
          customer: newCustomer,
          estimatedFinish: "5:30 PM",
          roNumber: `RO #BF-${Math.floor(9400 + Math.random() * 99)}`,
          progressPercent: 15,
        };
      }
      return b;
    });
    setBays(updated);
    setIsNewOrderModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#F4F4F1] text-[#2C2421] font-sans flex antialiased selection:bg-[#E85D22] selection:text-white relative">
      {/* =========================================================================
          BACKGROUND: CINEMATIC WORKSHOP PHOTOGRAPHIC BACKDROP
          ========================================================================= */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <img
          src="/dashboard-bg.jpg"
          alt="Supercar Dyno Workshop"
          className="w-full h-full object-cover object-center filter brightness-[0.72] contrast-[1.05]"
        />
        {/* Refined Frosted Blur Overlay */}
        <div className="absolute inset-0 bg-[#F4F4F1]/90 backdrop-blur-[5px]" />
      </div>

      {/* =========================================================================
          1. LEFT SIDEBAR NAVIGATION (EXPANDED & HIGH-CONTRAST)
          ========================================================================= */}
      {/* Mobile Backdrop */}
      {mobileMenuOpen && (
        <div
          onClick={() => setMobileMenuOpen(false)}
          className="fixed inset-0 bg-black/50 backdrop-blur-xs z-40 lg:hidden"
        />
      )}

      <aside
        className={`fixed lg:sticky top-0 left-0 h-screen z-50 w-72 bg-white/95 backdrop-blur-xl border-r border-[#2C2421]/15 flex flex-col justify-between transition-transform duration-300 ease-in-out shadow-lg lg:shadow-none ${
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="flex flex-col">
          {/* Brand Header */}
          <div className="p-6 border-b border-[#2C2421]/10 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3.5 group">
              <div className="w-11 h-11 rounded-xl bg-[#2C2421] flex items-center justify-center text-white shadow-sm group-hover:bg-[#1a1513] transition-colors">
                <svg
                  className="w-6 h-6 text-white"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="19" r="2" />
                  <path d="M12 17V11" />
                  <path d="m9 11 3-5 3 5" />
                  <circle cx="12" cy="5" r="2" />
                </svg>
              </div>
              <div className="flex flex-col">
                <span className="font-headline text-3xl font-black uppercase tracking-wider text-[#2C2421] leading-none">
                  BAYFLOW
                </span>
                <span className="text-xs font-mono font-bold text-[#8C7E78] tracking-tight mt-1">
                  APEX LAB • FACILITY #01
                </span>
              </div>
            </Link>

            <button
              onClick={() => setMobileMenuOpen(false)}
              className="p-1.5 text-[#8C7E78] hover:text-[#2C2421] lg:hidden"
            >
              <span className="material-symbols-outlined text-[22px]">close</span>
            </button>
          </div>

          {/* Nav Categories */}
          <div className="p-5 flex flex-col gap-7 overflow-y-auto">
            {/* Group 1: Workshop */}
            <div>
              <div className="px-3 mb-2.5 text-xs font-mono font-extrabold uppercase tracking-widest text-[#8C7E78]">
                WORKSHOP
              </div>
              <nav className="flex flex-col gap-1.5">
                <button
                  onClick={() => setActiveTab("operations")}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-bold transition-all cursor-pointer ${
                    activeTab === "operations"
                      ? "bg-[#2C2421] text-white shadow-md"
                      : "text-[#6B5E59] hover:bg-[#F8F8F5] hover:text-[#2C2421]"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-[22px]">grid_view</span>
                    <span>Operations &amp; Floor</span>
                  </div>
                  <span
                    className={`text-xs font-mono font-bold px-2 py-0.5 rounded-md ${
                      activeTab === "operations"
                        ? "bg-white/20 text-white"
                        : "bg-[#2C2421]/10 text-[#2C2421]"
                    }`}
                  >
                    5/6
                  </span>
                </button>

                <button
                  onClick={() => setActiveTab("orders")}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-bold transition-all cursor-pointer ${
                    activeTab === "orders"
                      ? "bg-[#2C2421] text-white shadow-md"
                      : "text-[#6B5E59] hover:bg-[#F8F8F5] hover:text-[#2C2421]"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-[22px]">receipt_long</span>
                    <span>Work Orders</span>
                  </div>
                  <span className="text-xs font-mono bg-[#2C2421]/10 text-[#2C2421] px-2 py-0.5 rounded-md font-bold">
                    12
                  </span>
                </button>

                <button
                  onClick={() => setActiveTab("technicians")}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all cursor-pointer ${
                    activeTab === "technicians"
                      ? "bg-[#2C2421] text-white shadow-md"
                      : "text-[#6B5E59] hover:bg-[#F8F8F5] hover:text-[#2C2421]"
                  }`}
                >
                  <span className="material-symbols-outlined text-[22px]">group</span>
                  <span>Technicians &amp; Roster</span>
                </button>
              </nav>
            </div>

            {/* Group 2: Supplies & Office */}
            <div>
              <div className="px-3 mb-2.5 text-xs font-mono font-extrabold uppercase tracking-widest text-[#8C7E78]">
                SUPPLIES &amp; OFFICE
              </div>
              <nav className="flex flex-col gap-1.5">
                <button
                  onClick={() => setActiveTab("parts")}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-bold transition-all cursor-pointer ${
                    activeTab === "parts"
                      ? "bg-[#2C2421] text-white shadow-md"
                      : "text-[#6B5E59] hover:bg-[#F8F8F5] hover:text-[#2C2421]"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-[22px]">inventory_2</span>
                    <span>Parts &amp; Inventory</span>
                  </div>
                  <span className="text-xs font-mono bg-[#E85D22]/15 text-[#E85D22] font-bold px-2 py-0.5 rounded-md">
                    1 Alert
                  </span>
                </button>

                <button
                  onClick={() => setActiveTab("concierge")}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all cursor-pointer ${
                    activeTab === "concierge"
                      ? "bg-[#2C2421] text-white shadow-md"
                      : "text-[#6B5E59] hover:bg-[#F8F8F5] hover:text-[#2C2421]"
                  }`}
                >
                  <span className="material-symbols-outlined text-[22px]">support_agent</span>
                  <span>Client Concierge</span>
                </button>

                <button
                  onClick={() => setActiveTab("revenue")}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all cursor-pointer ${
                    activeTab === "revenue"
                      ? "bg-[#2C2421] text-white shadow-md"
                      : "text-[#6B5E59] hover:bg-[#F8F8F5] hover:text-[#2C2421]"
                  }`}
                >
                  <span className="material-symbols-outlined text-[22px]">query_stats</span>
                  <span>Revenue &amp; Reports</span>
                </button>
              </nav>
            </div>
          </div>
        </div>

        {/* User Card / Sign Out */}
        <div className="p-4 border-t border-[#2C2421]/10 bg-[#F8F8F5]/80">
          <div className="flex items-center justify-between p-2.5 rounded-2xl bg-white border border-[#2C2421]/10 shadow-xs">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-xl bg-[#1F5C45] text-white flex items-center justify-center font-bold text-sm shrink-0">
                MR
              </div>
              <div className="min-w-0">
                <div className="text-sm font-bold text-[#2C2421] truncate">Marcus Rossi</div>
                <div className="text-xs text-[#8C7E78] truncate">Shop Foreman • Lead</div>
              </div>
            </div>
            <Link
              href="/login"
              title="Sign out to Login"
              className="p-2 text-[#8C7E78] hover:text-[#E85D22] hover:bg-[#F4F4F1] rounded-xl transition-colors"
            >
              <span className="material-symbols-outlined text-[20px]">logout</span>
            </Link>
          </div>
        </div>
      </aside>

      {/* =========================================================================
          2. MAIN CONTENT AREA (EXPANSIVE WIDESCREEN COVERAGE)
          ========================================================================= */}
      <div className="flex-1 flex flex-col min-w-0 relative z-10">
        {/* TOP COMMAND HEADER */}
        <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-[#2C2421]/10 px-6 sm:px-8 lg:px-12 py-4 flex items-center justify-between gap-6 shadow-xs">
          {/* Left: Mobile hamburger & Search bar */}
          <div className="flex items-center gap-4 flex-1 max-w-2xl">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="p-2 -ml-2 text-[#2C2421] rounded-xl hover:bg-[#F4F4F1] lg:hidden"
            >
              <span className="material-symbols-outlined text-[26px]">menu</span>
            </button>

            <div className="relative w-full">
              <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8C7E78] text-[20px]">
                search
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by vehicle, VIN, technician, or RO number..."
                className="w-full pl-11 pr-14 py-2.5 bg-[#F8F8F5] border border-[#2C2421]/15 rounded-xl text-sm sm:text-base text-[#2C2421] placeholder-[#8C7E78] focus:outline-none focus:border-[#E85D22] focus:bg-white transition-all shadow-2xs"
              />
              <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-mono font-bold text-[#8C7E78] bg-white border border-[#2C2421]/10 px-2 py-0.5 rounded shadow-2xs">
                ⌘K
              </span>
            </div>
          </div>

          {/* Right: Notification Bell & Quick Action CTA (Text beside bell removed) */}
          <div className="flex items-center gap-4 shrink-0">
            <button
              title="Notifications"
              className="p-2.5 text-[#6B5E59] hover:text-[#2C2421] hover:bg-[#F8F8F5] rounded-xl relative transition-colors"
            >
              <span className="material-symbols-outlined text-[24px]">notifications</span>
              <span className="absolute top-2 right-2 w-2.5 h-2.5 rounded-full bg-[#E85D22]" />
            </button>

            <button
              onClick={() => setIsNewOrderModalOpen(true)}
              className="bg-[#E85D22] hover:bg-[#d04e17] active:scale-98 text-white px-5 py-2.5 rounded-xl text-sm font-bold uppercase tracking-wider flex items-center gap-2 shadow-sm hover:shadow-md transition-all cursor-pointer"
            >
              <span className="material-symbols-outlined text-[20px]">add</span>
              <span className="hidden sm:inline">New Work Order</span>
              <span className="sm:hidden">New</span>
            </button>
          </div>
        </header>

        {/* WORKSPACE PAGE BODY (FULL WIDTH EXPANSIVE) */}
        <main className="p-6 sm:p-8 lg:p-12 flex flex-col gap-8 sm:gap-10 w-full max-w-[1800px] mx-auto">
          {/* SECTION 1: WORKSHOP TITLE & VIEW TOGGLE */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="font-headline text-4xl sm:text-5xl font-black uppercase tracking-tight text-[#2C2421] leading-none">
                WORKSHOP OPERATIONS
              </h1>
              <p className="text-sm sm:text-base text-[#6B5E59] mt-2 font-medium">
                Live floor scheduling, bay assignments, and active vehicle progression.
              </p>
            </div>

            {/* View Mode Switcher */}
            <div className="flex items-center gap-2.5 self-start sm:self-auto">
              <span className="text-xs font-mono text-[#8C7E78] font-bold uppercase mr-1">
                Floor view:
              </span>
              <div className="bg-white/95 backdrop-blur-md border border-[#2C2421]/15 rounded-xl p-1 flex items-center shadow-xs">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`px-4 py-1.5 rounded-lg text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                    viewMode === "grid"
                      ? "bg-[#2C2421] text-white shadow-xs"
                      : "text-[#6B5E59] hover:text-[#2C2421]"
                  }`}
                >
                  Grid
                </button>
                <button
                  onClick={() => setViewMode("timeline")}
                  className={`px-4 py-1.5 rounded-lg text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                    viewMode === "timeline"
                      ? "bg-[#2C2421] text-white shadow-xs"
                      : "text-[#6B5E59] hover:text-[#2C2421]"
                  }`}
                >
                  Timeline
                </button>
              </div>
            </div>
          </div>

          {/* SECTION 2: 4 TOP METRIC CARDS (BIGGER & ELEVATED) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
            {/* Card 1: Active Bays */}
            <motion.div
              whileHover={{ y: -3, transition: { duration: 0.2 } }}
              className="bg-white/95 backdrop-blur-md rounded-3xl p-6 sm:p-7 border border-[#2C2421]/10 shadow-[0_6px_25px_rgba(44,36,33,0.04)] hover:shadow-xl transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between text-xs font-mono font-bold uppercase tracking-wider text-[#8C7E78] mb-3">
                  <span>ACTIVE BAYS</span>
                  <span className="material-symbols-outlined text-[#1F5C45] text-[22px]">
                    calendar_month
                  </span>
                </div>
                <div className="flex items-baseline gap-2.5 mb-4">
                  <span className="font-headline text-4xl sm:text-5xl font-extrabold text-[#2C2421]">
                    5 of 6
                  </span>
                  <span className="text-sm font-bold text-[#6B5E59]">in use</span>
                  <span className="ml-auto text-xs font-mono font-bold bg-[#1F5C45]/10 text-[#1F5C45] px-2.5 py-1 rounded-full">
                    83% cap
                  </span>
                </div>
                {/* Progress bar */}
                <div className="w-full h-2 bg-[#F4F4F1] rounded-full overflow-hidden mb-4">
                  <div className="h-full bg-[#1F5C45] rounded-full w-[83%]" />
                </div>
              </div>
              <div className="text-xs text-[#8C7E78] font-medium pt-3 border-t border-[#2C2421]/8">
                1 quick service bay open
              </div>
            </motion.div>

            {/* Card 2: Today's Jobs */}
            <motion.div
              whileHover={{ y: -3, transition: { duration: 0.2 } }}
              className="bg-white/95 backdrop-blur-md rounded-3xl p-6 sm:p-7 border border-[#2C2421]/10 shadow-[0_6px_25px_rgba(44,36,33,0.04)] hover:shadow-xl transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between text-xs font-mono font-bold uppercase tracking-wider text-[#8C7E78] mb-3">
                  <span>TODAY&apos;S JOBS</span>
                  <span className="material-symbols-outlined text-[#E85D22] text-[22px]">
                    tune
                  </span>
                </div>
                <div className="flex items-baseline gap-2.5 mb-4">
                  <span className="font-headline text-4xl sm:text-5xl font-extrabold text-[#2C2421]">
                    12
                  </span>
                  <span className="text-sm font-bold text-[#6B5E59]">scheduled</span>
                  <span className="ml-auto text-xs font-mono font-bold bg-[#E85D22]/10 text-[#E85D22] px-2.5 py-1 rounded-full">
                    4 remaining
                  </span>
                </div>
                {/* Progress bar */}
                <div className="w-full h-2 bg-[#F4F4F1] rounded-full overflow-hidden mb-4">
                  <div className="h-full bg-[#E85D22] rounded-full w-[66%]" />
                </div>
              </div>
              <div className="text-xs text-[#8C7E78] font-medium pt-3 border-t border-[#2C2421]/8">
                8 completed • 4 in progress
              </div>
            </motion.div>

            {/* Card 3: Revenue Today */}
            <motion.div
              whileHover={{ y: -3, transition: { duration: 0.2 } }}
              className="bg-white/95 backdrop-blur-md rounded-3xl p-6 sm:p-7 border border-[#2C2421]/10 shadow-[0_6px_25px_rgba(44,36,33,0.04)] hover:shadow-xl transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between text-xs font-mono font-bold uppercase tracking-wider text-[#8C7E78] mb-3">
                  <span>REVENUE TODAY</span>
                  <span className="material-symbols-outlined text-[#1F5C45] text-[22px]">
                    payments
                  </span>
                </div>
                <div className="flex items-baseline gap-2.5 mb-4">
                  <span className="font-headline text-4xl sm:text-5xl font-extrabold text-[#2C2421]">
                    $18,420
                  </span>
                  <span className="ml-auto text-xs font-mono font-bold bg-[#1F5C45]/10 text-[#1F5C45] px-2.5 py-1 rounded-full">
                    +12% vs yest.
                  </span>
                </div>
                {/* Progress bar */}
                <div className="w-full h-2 bg-[#F4F4F1] rounded-full overflow-hidden mb-4">
                  <div className="h-full bg-[#2C2421] rounded-full w-[78%]" />
                </div>
              </div>
              <div className="text-xs text-[#8C7E78] font-medium pt-3 border-t border-[#2C2421]/8">
                Target: $22,000 for full shift
              </div>
            </motion.div>

            {/* Card 4: Parts Ready */}
            <motion.div
              whileHover={{ y: -3, transition: { duration: 0.2 } }}
              className="bg-white/95 backdrop-blur-md rounded-3xl p-6 sm:p-7 border border-[#2C2421]/10 shadow-[0_6px_25px_rgba(44,36,33,0.04)] hover:shadow-xl transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between text-xs font-mono font-bold uppercase tracking-wider text-[#8C7E78] mb-3">
                  <span>PARTS READY</span>
                  <span className="material-symbols-outlined text-[#E85D22] text-[22px]">
                    inventory_2
                  </span>
                </div>
                <div className="flex items-baseline gap-2.5 mb-4">
                  <span className="font-headline text-4xl sm:text-5xl font-extrabold text-[#2C2421]">
                    98%
                  </span>
                  <span className="ml-auto text-xs font-mono font-bold bg-[#F59E0B]/15 text-[#D97706] px-2.5 py-1 rounded-full">
                    1 on courier
                  </span>
                </div>
                {/* Progress bar */}
                <div className="w-full h-2 bg-[#F4F4F1] rounded-full overflow-hidden mb-4">
                  <div className="h-full bg-[#E85D22] rounded-full w-[98%]" />
                </div>
              </div>
              <div className="text-xs text-[#8C7E78] font-medium pt-3 border-t border-[#2C2421]/8">
                1 order awaiting delivery (ETA 3:15 PM)
              </div>
            </motion.div>
          </div>

          {/* SECTION 3: LIVE SERVICE FLOOR / WORKSTATIONS (BIGGER GRID CARDS) */}
          <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="font-headline text-2xl sm:text-3xl font-extrabold uppercase tracking-wide text-[#2C2421]">
                  LIVE SERVICE FLOOR
                </span>
                <span className="text-xs font-mono bg-white/95 border border-[#2C2421]/15 px-3 py-1 rounded-full text-[#6B5E59] font-bold shadow-2xs">
                  6 Workstations
                </span>
              </div>
              <span className="text-xs sm:text-sm text-[#8C7E78] font-mono hidden sm:inline">
                Real-time status updated
              </span>
            </div>

            {/* CONDITIONAL: GRID VIEW vs TIMELINE VIEW */}
            {viewMode === "grid" ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
                {filteredBays.map((bay) => {
                  const isAvailable = bay.status === "available";

                  if (isAvailable) {
                    return (
                      <motion.div
                        key={bay.id}
                        whileHover={{ y: -4, transition: { duration: 0.2 } }}
                        className="bg-white/80 backdrop-blur-md border-2 border-dashed border-[#2C2421]/20 rounded-3xl p-7 sm:p-8 flex flex-col justify-between items-center text-center hover:border-[#E85D22] hover:bg-white transition-all shadow-[0_6px_25px_rgba(44,36,33,0.03)] hover:shadow-xl group min-h-[380px]"
                      >
                        <div className="w-full flex items-center justify-between mb-4">
                          <div className="flex items-center gap-2.5">
                            <span className="w-7 h-7 rounded-lg bg-[#2C2421]/10 text-[#2C2421] font-mono font-bold text-xs flex items-center justify-center">
                              {bay.bayNumber}
                            </span>
                            <span className="text-xs sm:text-sm font-mono font-bold text-[#6B5E59]">
                              {bay.bayName}
                            </span>
                          </div>
                          <span className="text-xs font-mono uppercase bg-[#1F5C45]/10 text-[#1F5C45] font-bold px-3 py-1 rounded-full">
                            Available
                          </span>
                        </div>

                        <div className="my-auto py-6 flex flex-col items-center">
                          <div className="w-16 h-16 rounded-2xl bg-[#F4F4F1] group-hover:bg-[#E85D22]/10 text-[#8C7E78] group-hover:text-[#E85D22] flex items-center justify-center mb-4 transition-colors">
                            <span className="material-symbols-outlined text-3xl">
                              garage
                            </span>
                          </div>
                          <h4 className="font-headline text-3xl font-bold uppercase text-[#2C2421]">
                            BAY 06 IS OPEN
                          </h4>
                          <p className="text-xs sm:text-sm text-[#8C7E78] max-w-xs mt-1.5 leading-relaxed">
                            Sanitized &amp; ready for vehicle intake or quick turnaround work order.
                          </p>
                        </div>

                        <button
                          onClick={() => setIsNewOrderModalOpen(true)}
                          className="w-full mt-4 bg-[#2C2421] hover:bg-[#1a1513] text-white py-3.5 rounded-xl text-xs sm:text-sm uppercase font-bold tracking-wider flex items-center justify-center gap-2 transition-all shadow-sm hover:shadow-md cursor-pointer"
                        >
                          <span className="material-symbols-outlined text-[18px]">add</span>
                          <span>Assign Incoming Vehicle</span>
                        </button>
                      </motion.div>
                    );
                  }

                  return (
                    <motion.div
                      key={bay.id}
                      layout
                      whileHover={{ y: -4, transition: { duration: 0.2 } }}
                      className="bg-white/95 backdrop-blur-md rounded-3xl border border-[#2C2421]/10 shadow-[0_8px_30px_rgba(44,36,33,0.04)] hover:shadow-xl transition-all p-7 sm:p-8 flex flex-col justify-between gap-6 min-h-[380px]"
                    >
                      {/* Top Bay Header */}
                      <div>
                        <div className="flex items-center justify-between gap-3 mb-4">
                          <div className="flex items-center gap-2.5">
                            <span className="w-7 h-7 rounded-lg bg-[#2C2421] text-white font-mono font-bold text-xs flex items-center justify-center">
                              {bay.bayNumber}
                            </span>
                            <span className="text-xs sm:text-sm font-mono font-extrabold uppercase tracking-tight text-[#2C2421]">
                              {bay.bayName}
                            </span>
                          </div>

                          {/* Status Pill */}
                          <span
                            className="text-xs font-mono font-bold uppercase px-3 py-1 rounded-full flex items-center gap-1.5"
                            style={{
                              backgroundColor: `${bay.statusColor}15`,
                              color: bay.statusColor,
                            }}
                          >
                            <span
                              className="w-2 h-2 rounded-full animate-pulse"
                              style={{ backgroundColor: bay.statusColor }}
                            />
                            <span>{bay.statusLabel}</span>
                          </span>
                        </div>

                        {/* Vehicle Title & Operation */}
                        <h3 className="font-headline text-3xl sm:text-4xl font-black uppercase text-[#2C2421] tracking-tight leading-none mb-1">
                          {bay.vehicle}
                        </h3>
                        <p className="text-xs sm:text-sm font-medium text-[#6B5E59]">
                          {bay.service}
                        </p>
                      </div>

                      {/* Detail Data Grid */}
                      <div className="bg-[#F8F8F5]/90 rounded-2xl p-4 sm:p-5 flex flex-col gap-2.5 text-xs sm:text-sm border border-[#2C2421]/5">
                        <div className="flex items-center justify-between">
                          <span className="text-[#8C7E78] font-medium">Technician</span>
                          <span className="font-bold text-[#2C2421] font-mono">
                            {bay.technician}
                          </span>
                        </div>

                        {bay.estimatedFinish && (
                          <div className="flex items-center justify-between">
                            <span className="text-[#8C7E78] font-medium">Estimated Finish</span>
                            <span className="font-bold text-[#2C2421] font-mono">
                              {bay.estimatedFinish}
                            </span>
                          </div>
                        )}

                        {bay.partStatus && (
                          <div className="flex items-center justify-between">
                            <span className="text-[#8C7E78] font-medium">Part Status</span>
                            <span className="font-bold text-[#D97706] font-mono">
                              {bay.partStatus}
                            </span>
                          </div>
                        )}

                        {bay.handoffStatus && (
                          <div className="flex items-center justify-between">
                            <span className="text-[#8C7E78] font-medium">Handoff</span>
                            <span className="font-bold text-[#1F5C45] font-mono">
                              {bay.handoffStatus}
                            </span>
                          </div>
                        )}

                        <div className="flex items-center justify-between pt-2 border-t border-[#2C2421]/8">
                          <span className="text-[#8C7E78] font-medium">Customer</span>
                          <span className="font-medium text-[#2C2421]">
                            {bay.customer}
                          </span>
                        </div>
                      </div>

                      {/* Bottom RO & View Details CTA */}
                      <div className="flex items-center justify-between pt-1 text-xs sm:text-sm">
                        <span className="font-mono text-[#8C7E78] font-semibold">
                          {bay.roNumber}
                        </span>

                        <button
                          onClick={() => setSelectedBay(bay)}
                          className="flex items-center gap-1.5 font-bold text-[#2C2421] hover:text-[#E85D22] transition-colors cursor-pointer group"
                        >
                          <span>{bay.status === "waiting_part" ? "Track Part" : "View Details"}</span>
                          <span className="material-symbols-outlined text-[18px] group-hover:translate-x-1 transition-transform">
                            arrow_forward
                          </span>
                        </button>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            ) : (
              /* TIMELINE GANTT SCHEDULE VIEW */
              <div className="bg-white/95 backdrop-blur-md rounded-3xl border border-[#2C2421]/10 p-6 sm:p-8 shadow-sm overflow-x-auto">
                <div className="min-w-[800px] flex flex-col gap-5">
                  {/* Hours axis */}
                  <div className="grid grid-cols-12 gap-3 pb-4 border-b border-[#2C2421]/10 text-xs font-mono font-bold text-[#8C7E78]">
                    <div className="col-span-3">BAY WORKSTATION</div>
                    <div className="col-span-9 grid grid-cols-6 text-center">
                      <span>08:00 AM</span>
                      <span>10:00 AM</span>
                      <span>12:00 PM</span>
                      <span>02:00 PM</span>
                      <span>04:00 PM</span>
                      <span>06:00 PM</span>
                    </div>
                  </div>

                  {/* Bay Rows */}
                  {bays.map((bay) => (
                    <div
                      key={bay.id}
                      className="grid grid-cols-12 gap-3 items-center py-3 border-b border-[#2C2421]/5 text-xs sm:text-sm"
                    >
                      <div className="col-span-3 flex items-center gap-2.5">
                        <span className="w-6 h-6 rounded-md bg-[#2C2421] text-white font-mono font-bold text-xs flex items-center justify-center">
                          {bay.bayNumber}
                        </span>
                        <div className="min-w-0">
                          <div className="font-bold text-[#2C2421] truncate font-mono text-xs sm:text-sm">
                            {bay.bayName}
                          </div>
                          <div className="text-xs text-[#8C7E78] truncate">
                            {bay.vehicle || "Standby"}
                          </div>
                        </div>
                      </div>

                      <div className="col-span-9 relative h-12 bg-[#F8F8F5] rounded-xl flex items-center px-2">
                        {bay.vehicle ? (
                          <div
                            onClick={() => setSelectedBay(bay)}
                            className="h-8 rounded-lg px-3.5 flex items-center justify-between text-white font-bold text-xs font-mono shadow-xs cursor-pointer hover:opacity-90 transition-opacity"
                            style={{
                              width: `${bay.progressPercent}%`,
                              backgroundColor: bay.statusColor,
                            }}
                          >
                            <span className="truncate">{bay.vehicle}</span>
                            <span className="text-[10px] opacity-90 hidden sm:inline">
                              {bay.statusLabel}
                            </span>
                          </div>
                        ) : (
                          <span className="text-xs font-mono text-[#8C7E78] italic">
                            No vehicle dispatched • Ready
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* =========================================================================
          3. SLIDE-OVER DETAIL DRAWER FOR ACTIVE WORK ORDER
          ========================================================================= */}
      <AnimatePresence>
        {selectedBay && (
          <div className="fixed inset-0 z-50 flex justify-end">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedBay(null)}
              className="absolute inset-0 bg-black/50 backdrop-blur-xs"
            />

            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="relative w-full max-w-xl bg-white h-full shadow-2xl p-6 sm:p-10 flex flex-col justify-between overflow-y-auto z-10 text-[#2C2421]"
            >
              <div>
                {/* Header */}
                <div className="flex items-center justify-between pb-4 border-b border-[#2C2421]/10 mb-6">
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-lg bg-[#2C2421] text-white font-mono font-bold text-sm flex items-center justify-center">
                      {selectedBay.bayNumber}
                    </span>
                    <span className="font-headline text-2xl font-bold uppercase text-[#2C2421]">
                      {selectedBay.bayName}
                    </span>
                  </div>
                  <button
                    onClick={() => setSelectedBay(null)}
                    className="p-2 rounded-xl text-[#8C7E78] hover:text-[#2C2421] hover:bg-[#F4F4F1] cursor-pointer transition-colors"
                  >
                    <span className="material-symbols-outlined text-[22px]">close</span>
                  </button>
                </div>

                {/* Vehicle Hero */}
                <div className="p-6 rounded-3xl bg-[#F8F8F5] border border-[#2C2421]/10 mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-mono uppercase font-bold text-[#8C7E78]">
                      {selectedBay.roNumber}
                    </span>
                    <span
                      className="text-xs font-mono font-bold uppercase px-3 py-1 rounded-full"
                      style={{
                        backgroundColor: `${selectedBay.statusColor}15`,
                        color: selectedBay.statusColor,
                      }}
                    >
                      {selectedBay.statusLabel}
                    </span>
                  </div>
                  <h2 className="font-headline text-3xl sm:text-4xl font-extrabold uppercase text-[#2C2421]">
                    {selectedBay.vehicle}
                  </h2>
                  <p className="text-sm text-[#6B5E59] mt-1">{selectedBay.service}</p>
                </div>

                {/* Diagnostic Data Grid */}
                <div className="flex flex-col gap-3 text-sm mb-6">
                  <div className="flex items-center justify-between p-4 rounded-2xl bg-white border border-[#2C2421]/10 shadow-2xs">
                    <span className="text-[#8C7E78]">Assigned Technician</span>
                    <span className="font-bold font-mono text-[#2C2421]">
                      {selectedBay.technician} ({selectedBay.technicianRole || "Specialist"})
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-4 rounded-2xl bg-white border border-[#2C2421]/10 shadow-2xs">
                    <span className="text-[#8C7E78]">Customer Contact</span>
                    <span className="font-bold text-[#2C2421]">
                      {selectedBay.customer} • {selectedBay.customerPhone || "(555) 019-2831"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-4 rounded-2xl bg-white border border-[#2C2421]/10 shadow-2xs">
                    <span className="text-[#8C7E78]">Job Progress</span>
                    <span className="font-bold font-mono text-[#E85D22]">
                      {selectedBay.progressPercent}% Complete
                    </span>
                  </div>
                </div>

                {/* Step Progression */}
                <div className="mb-6">
                  <div className="text-xs font-mono font-bold uppercase text-[#8C7E78] mb-3">
                    STATE MACHINE PROGRESS
                  </div>
                  <div className="flex items-center gap-2">
                    {["Check-in", "Teardown", "Repair", "QC Inspection", "Handoff"].map(
                      (step, idx) => {
                        const stepActive = idx <= Math.floor(selectedBay.progressPercent / 25);
                        return (
                          <div key={step} className="flex-1 flex flex-col gap-2">
                            <div
                              className={`h-2.5 rounded-full ${
                                stepActive ? "bg-[#E85D22]" : "bg-[#2C2421]/10"
                              }`}
                            />
                            <span className="text-[10px] font-mono text-center text-[#6B5E59] truncate font-bold">
                              {step}
                            </span>
                          </div>
                        );
                      }
                    )}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-6 border-t border-[#2C2421]/10 flex gap-4">
                <button
                  onClick={() => setSelectedBay(null)}
                  className="flex-1 bg-[#2C2421] text-white py-3.5 rounded-xl text-xs sm:text-sm uppercase font-bold tracking-wider hover:bg-[#1a1513] transition-colors cursor-pointer"
                >
                  Update Status
                </button>
                <Link
                  href="/verify"
                  className="px-5 py-3.5 bg-[#F4F4F1] hover:bg-[#ECE8E5] text-[#2C2421] rounded-xl text-xs sm:text-sm font-bold uppercase tracking-wider flex items-center justify-center transition-colors"
                >
                  Verify Telemetry
                </Link>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* =========================================================================
          4. MODAL: + NEW WORK ORDER / DISPATCH
          ========================================================================= */}
      <AnimatePresence>
        {isNewOrderModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsNewOrderModalOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-xs"
            />

            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-xl bg-white rounded-3xl border border-[#2C2421]/15 shadow-2xl p-7 sm:p-10 z-10 text-[#2C2421]"
            >
              <div className="flex items-center justify-between pb-4 border-b border-[#2C2421]/10 mb-6">
                <div>
                  <h2 className="font-headline text-3xl font-extrabold uppercase text-[#2C2421]">
                    DISPATCH WORK ORDER
                  </h2>
                  <p className="text-sm text-[#6B5E59] mt-0.5">
                    Assign a new vehicle to an available bay slot.
                  </p>
                </div>
                <button
                  onClick={() => setIsNewOrderModalOpen(false)}
                  className="p-2 text-[#8C7E78] hover:text-[#2C2421] rounded-xl cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[22px]">close</span>
                </button>
              </div>

              <form onSubmit={handleCreateOrder} className="flex flex-col gap-4 text-xs sm:text-sm">
                <div>
                  <label className="block font-bold text-[#2C2421] mb-1.5 font-mono uppercase text-xs">
                    Vehicle Make &amp; Model
                  </label>
                  <input
                    required
                    type="text"
                    value={newVehicle}
                    onChange={(e) => setNewVehicle(e.target.value)}
                    placeholder="e.g. Porsche 992 GT3 RS"
                    className="w-full px-4 py-3 bg-[#F8F8F5] border border-[#2C2421]/15 rounded-xl text-sm focus:outline-none focus:border-[#E85D22]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-[#2C2421] mb-1.5 font-mono uppercase text-xs">
                      Customer Name
                    </label>
                    <input
                      required
                      type="text"
                      value={newCustomer}
                      onChange={(e) => setNewCustomer(e.target.value)}
                      placeholder="e.g. Alexander Wright"
                      className="w-full px-4 py-3 bg-[#F8F8F5] border border-[#2C2421]/15 rounded-xl text-sm focus:outline-none focus:border-[#E85D22]"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-[#2C2421] mb-1.5 font-mono uppercase text-xs">
                      Assign to Bay
                    </label>
                    <select
                      value={newBay}
                      onChange={(e) => setNewBay(e.target.value)}
                      className="w-full px-4 py-3 bg-[#F8F8F5] border border-[#2C2421]/15 rounded-xl text-sm focus:outline-none focus:border-[#E85D22]"
                    >
                      <option value="06">Bay 06 (Quick Service • Available)</option>
                      <option value="01">Bay 01 (Dyno Cell)</option>
                      <option value="02">Bay 02 (Lift A)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-[#2C2421] mb-1.5 font-mono uppercase text-xs">
                    Service Operation
                  </label>
                  <input
                    required
                    type="text"
                    value={newService}
                    onChange={(e) => setNewService(e.target.value)}
                    placeholder="e.g. Full Teardown & Dyno Tune"
                    className="w-full px-4 py-3 bg-[#F8F8F5] border border-[#2C2421]/15 rounded-xl text-sm focus:outline-none focus:border-[#E85D22]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#2C2421] mb-1.5 font-mono uppercase text-xs">
                    Lead Technician
                  </label>
                  <select
                    value={newTech}
                    onChange={(e) => setNewTech(e.target.value)}
                    className="w-full px-4 py-3 bg-[#F8F8F5] border border-[#2C2421]/15 rounded-xl text-sm focus:outline-none focus:border-[#E85D22]"
                  >
                    <option value="Marco R.">Marco R. (Master Hybrid Spec)</option>
                    <option value="Liam K.">Liam K. (Chassis & Alignment)</option>
                    <option value="Dave C.">Dave C. (Senior Powertrain)</option>
                    <option value="Sarah W.">Sarah W. (EV Engineer)</option>
                  </select>
                </div>

                <div className="pt-4 flex gap-4 mt-2">
                  <button
                    type="button"
                    onClick={() => setIsNewOrderModalOpen(false)}
                    className="flex-1 bg-[#F4F4F1] hover:bg-[#ECE8E5] text-[#2C2421] py-3.5 rounded-xl font-bold uppercase tracking-wider transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-[#E85D22] hover:bg-[#d04e17] text-white py-3.5 rounded-xl font-bold uppercase tracking-wider shadow-sm hover:shadow-md transition-all cursor-pointer"
                  >
                    Dispatch Vehicle
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
