"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import GuidedBookingWizard from "@/components/GuidedBookingWizard";

export default function ShopsPage() {
  const router = useRouter();

  // Directory State
  const [shops, setShops] = useState<any[]>([]);
  const [loadingShops, setLoadingShops] = useState(true);
  const [selectedCity, setSelectedCity] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const SHOPS_PER_PAGE = 6;

  // Active Shop for inline Guided Wizard
  const [activeShop, setActiveShop] = useState<any | null>(null);

  // Fallback mock shops if backend array is empty or offline
  const fallbackShops = [
    {
      id: "00000000-0000-0000-0000-000000000001",
      name: "Lahore Auto Care",
      city: "Lahore",
      rating: 4.9,
      reviews: 142,
      address: "Main Gulberg III, Lahore",
      phone: "+92 42 3578 9900",
      services: [
        { id: "s1", name: "Oil Change & Filter", durationMinutes: 30, basePrice: 5200 },
        { id: "s2", name: "Check Engine Light OBD-II Scan", durationMinutes: 45, basePrice: 2500 },
        { id: "s3", name: "Brake Pad & Rotor Overhaul", durationMinutes: 60, basePrice: 8500 },
        { id: "s4", name: "AC Gas Refill & Leak Inspection", durationMinutes: 40, basePrice: 4000 },
        { id: "s5", name: "Suspension & Wheel Alignment", durationMinutes: 60, basePrice: 3500 },
      ],
      workingHours: "09:00 AM - 08:00 PM",
      bays: "4 Bays Available",
    },
    {
      id: "00000000-0000-0000-0000-000000000002",
      name: "Apex Performance Garage",
      city: "Karachi",
      rating: 4.8,
      reviews: 98,
      address: "PECHS Block 6, Main Shahrah-e-Faisal, Karachi",
      phone: "+92 21 3455 1200",
      services: [
        { id: "s6", name: "Engine Tuning & Remap", durationMinutes: 90, basePrice: 15000 },
        { id: "s7", name: "Brake Pad Replacement", durationMinutes: 45, basePrice: 4200 },
        { id: "s8", name: "Transmission Fluid Service", durationMinutes: 60, basePrice: 9000 },
        { id: "s9", name: "Tire Balancing & Alignment", durationMinutes: 30, basePrice: 2500 },
      ],
      workingHours: "08:30 AM - 09:00 PM",
      bays: "3 Bays Available",
    },
    {
      id: "00000000-0000-0000-0000-000000000003",
      name: "Garaj Master Workshop",
      city: "Islamabad",
      rating: 4.9,
      reviews: 76,
      address: "Sector I-9/3 Industrial Area, Islamabad",
      phone: "+92 51 4433 991",
      services: [
        { id: "s10", name: "Full Computer Diagnostic Scan", durationMinutes: 30, basePrice: 2000 },
        { id: "s11", name: "AGM Battery Replacement", durationMinutes: 20, basePrice: 18000 },
        { id: "s12", name: "Synthetic Oil Change", durationMinutes: 30, basePrice: 6000 },
        { id: "s13", name: "Multi-Point Safety Inspection", durationMinutes: 45, basePrice: 3000 },
      ],
      workingHours: "09:00 AM - 07:00 PM",
      bays: "2 Bays Available",
    },
    {
      id: "00000000-0000-0000-0000-000000000004",
      name: "Precision Tune & Diagnostics",
      city: "Lahore",
      rating: 4.7,
      reviews: 84,
      address: "DHA Phase 5 Commercial, Lahore",
      phone: "+92 42 3718 4422",
      services: [
        { id: "s14", name: "ECU Electronic Scan & Reset", durationMinutes: 35, basePrice: 3000 },
        { id: "s15", name: "Laser Wheel Alignment", durationMinutes: 40, basePrice: 3200 },
        { id: "s16", name: "Spark Plug & Coil Pack Service", durationMinutes: 50, basePrice: 7500 },
      ],
      workingHours: "09:00 AM - 08:00 PM",
      bays: "5 Bays Available",
    },
    {
      id: "00000000-0000-0000-0000-000000000005",
      name: "Karachi Speed Repair Hub",
      city: "Karachi",
      rating: 4.9,
      reviews: 165,
      address: "Clifton Block 2, Marine Drive, Karachi",
      phone: "+92 21 3582 9911",
      services: [
        { id: "s17", name: "Full Synthetic Lube & Filter", durationMinutes: 30, basePrice: 5800 },
        { id: "s18", name: "Ceramic Brake Pad Fitment", durationMinutes: 45, basePrice: 9500 },
        { id: "s19", name: "Coolant Flush & Pressure Test", durationMinutes: 40, basePrice: 3800 },
      ],
      workingHours: "09:00 AM - 10:00 PM",
      bays: "3 Bays Available",
    },
    {
      id: "00000000-0000-0000-0000-000000000006",
      name: "Rawal Motors & Engineering",
      city: "Islamabad",
      rating: 4.8,
      reviews: 58,
      address: "G-8 Markaz, Islamabad",
      phone: "+92 51 2281 400",
      services: [
        { id: "s20", name: "Differential & Gearbox Service", durationMinutes: 60, basePrice: 11000 },
        { id: "s21", name: "Suspension Bushing & Struts", durationMinutes: 75, basePrice: 14000 },
        { id: "s22", name: "Alternator & Starter Check", durationMinutes: 30, basePrice: 2800 },
      ],
      workingHours: "08:30 AM - 07:30 PM",
      bays: "4 Bays Available",
    },
    {
      id: "00000000-0000-0000-0000-000000000007",
      name: "Royal German Auto Specialists",
      city: "Lahore",
      rating: 5.0,
      reviews: 112,
      address: "Johar Town Phase 2, Lahore",
      phone: "+92 42 3531 8877",
      services: [
        { id: "s23", name: "European Car Diagnostic Scan", durationMinutes: 45, basePrice: 5000 },
        { id: "s24", name: "Dual Clutch Transmission Flush", durationMinutes: 90, basePrice: 22000 },
        { id: "s25", name: "Air Suspension Calibration", durationMinutes: 60, basePrice: 12500 },
      ],
      workingHours: "10:00 AM - 08:00 PM",
      bays: "2 Bays Available",
    },
    {
      id: "00000000-0000-0000-0000-000000000008",
      name: "Capital Hybrid & EV Clinic",
      city: "Islamabad",
      rating: 4.9,
      reviews: 93,
      address: "F-10 Markaz, Islamabad",
      phone: "+92 51 2110 334",
      services: [
        { id: "s28", name: "Hybrid Traction Battery Health Test", durationMinutes: 45, basePrice: 4500 },
        { id: "s29", name: "Inverter Coolant Replacement", durationMinutes: 40, basePrice: 6500 },
        { id: "s30", name: "Brake Actuator Diagnostics", durationMinutes: 50, basePrice: 5000 },
      ],
      workingHours: "09:00 AM - 08:00 PM",
      bays: "3 Bays Available",
    },
  ];

  // Load shops on mount
  useEffect(() => {
    fetchShops();
  }, []);

  const fetchShops = async () => {
    setLoadingShops(true);
    try {
      const res = await fetch("http://localhost:4000/api/shops");
      const data = await res.json();
      const shopList = data.data || data.shops;
      if (res.ok && data.success && Array.isArray(shopList) && shopList.length > 0) {
        setShops(shopList);
      } else {
        setShops(fallbackShops);
      }
    } catch (err) {
      console.warn("API offline; utilizing fallback shop catalog:", err);
      setShops(fallbackShops);
    } finally {
      setLoadingShops(false);
    }
  };

  const handleSelectShop = (shop: any) => {
    setActiveShop(shop);
    window.scrollTo({ top: 120, behavior: "smooth" });
  };

  // Filter shops by city and search query
  const filteredShops = shops.filter((s) => {
    const matchesCity = selectedCity === "All" || (s.city && s.city.toLowerCase() === selectedCity.toLowerCase());
    const matchesSearch =
      !searchQuery ||
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (s.address && s.address.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCity && matchesSearch;
  });

  // Pagination calculations: 6 shops per page
  const totalPages = Math.max(1, Math.ceil(filteredShops.length / SHOPS_PER_PAGE));
  const startIndex = (currentPage - 1) * SHOPS_PER_PAGE;
  const paginatedShops = filteredShops.slice(startIndex, startIndex + SHOPS_PER_PAGE);

  return (
    <div className="min-h-screen bg-[#F4F4F1] text-[#2C2421] flex flex-col justify-between font-sans selection:bg-[#111827] selection:text-white">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16">
        {activeShop ? (
          /* ================= SECTION: EMBEDDED GUIDED BOOKING WIZARD ================= */
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={() => setActiveShop(null)}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-white border border-[#2C2421]/15 rounded-xl text-xs font-bold text-[#2C2421] hover:bg-[#F8F8F5] transition-all cursor-pointer shadow-xs"
              >
                <span className="material-symbols-outlined text-sm">arrow_back</span>
                <span>Back to Shop Directory</span>
              </button>

              <span className="text-xs text-[#2C2421]/60 font-medium">
                Booking for: <strong className="text-[#111827]">{activeShop.name}</strong>
              </span>
            </div>

            <GuidedBookingWizard
              initialShopId={activeShop.id}
              onClose={() => setActiveShop(null)}
            />
          </div>
        ) : (
          /* ================= SECTION: PUBLIC SHOP DIRECTORY LISTING ================= */
          <div className="space-y-8">
            {/* GUIDED BOOKING WIZARD HERO BANNER */}
            <div className="bg-white rounded-3xl border border-[#2C2421]/15 p-6 sm:p-8 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
              <div className="space-y-2 max-w-2xl relative z-10">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#111827] text-white text-[11px] font-bold tracking-wider uppercase">
                  <span className="material-symbols-outlined text-sm">auto_fix_high</span>
                  <span>Interactive Guided Experience</span>
                </div>
                <h2 className="font-headline text-2xl sm:text-3xl font-extrabold text-[#2C2421] tracking-tight">
                  Not sure what service or repair your car needs?
                </h2>
                <p className="text-xs sm:text-sm text-[#2C2421]/70 leading-relaxed">
                  Use our Guided Booking Wizard to diagnose dashboard warning lights, unusual sounds, or performance symptoms. Get instant preliminary price ranges and reserve your intake bay slot with zero surprise bills.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto relative z-10">
                <Link
                  href="/book"
                  className="w-full sm:w-auto px-6 py-3.5 bg-[#111827] hover:bg-[#0F172A] text-white text-xs font-bold rounded-2xl shadow-md transition-all flex items-center justify-center gap-2"
                >
                  <span className="material-symbols-outlined text-base">auto_fix_high</span>
                  <span>Launch Guided Booking Wizard</span>
                  <span className="material-symbols-outlined text-sm">arrow_forward</span>
                </Link>
              </div>
            </div>

            {/* DIRECTORY HEADER & FILTERS */}
            <div className="text-center max-w-2xl mx-auto space-y-2 pt-2">
              <h1 className="text-2xl sm:text-3xl font-bold text-[#2C2421] tracking-tight">
                Authorized Auto Repair Garages
              </h1>
              <p className="text-sm text-[#2C2421]/70">
                Browse partner workshops, check verified ratings, and schedule your appointment.
              </p>

              {/* Filters & Search Row */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
                {/* Search Input */}
                <div className="relative w-full sm:w-72">
                  <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-base text-[#2C2421]/40">
                    search
                  </span>
                  <input
                    type="text"
                    placeholder="Search by name, address, or city..."
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="w-full pl-10 pr-4 py-2 bg-white border border-[#2C2421]/20 rounded-xl text-xs font-medium focus:outline-none focus:border-[#111827]"
                  />
                </div>

                {/* City Filter Pills */}
                <div className="flex items-center gap-1.5 overflow-x-auto max-w-full py-1">
                  {["All", "Lahore", "Karachi", "Islamabad"].map((city) => (
                    <button
                      key={city}
                      onClick={() => {
                        setSelectedCity(city);
                        setCurrentPage(1);
                      }}
                      className={`px-4 py-2 rounded-xl text-xs font-semibold transition-colors border cursor-pointer ${
                        selectedCity === city
                          ? "bg-[#111827] text-white border-[#111827]"
                          : "bg-white text-[#2C2421]/70 border-[#2C2421]/20 hover:text-[#2C2421]"
                      }`}
                    >
                      {city}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {loadingShops ? (
              <div className="py-16 text-center text-xs font-medium text-[#2C2421]/60 flex items-center justify-center gap-2">
                <span className="animate-spin material-symbols-outlined text-lg">progress_activity</span>
                <span>Loading partner garages...</span>
              </div>
            ) : filteredShops.length === 0 ? (
              <div className="bg-white rounded-xl border border-[#2C2421]/15 p-12 text-center text-xs font-medium text-[#2C2421]/60 max-w-md mx-auto">
                No repair shops matching &quot;{searchQuery || selectedCity}&quot; found.
              </div>
            ) : (
              <div className="space-y-8">
                {/* Shop Cards Grid: Displaying 6 items max per page */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {paginatedShops.map((shop) => (
                    <div
                      key={shop.id}
                      className="bg-white rounded-2xl border border-[#2C2421]/15 p-6 shadow-xs hover:border-[#2C2421]/30 transition-colors flex flex-col justify-between"
                    >
                      <div>
                        {/* Shop Title & Location */}
                        <div>
                          <div className="flex items-center justify-between gap-2">
                            <h3 className="text-lg font-bold text-[#2C2421] leading-snug">
                              {shop.name}
                            </h3>
                            <span className="px-2 py-0.5 rounded-full bg-[#1F5C45]/10 text-[#1F5C45] text-[10px] font-bold shrink-0">
                              Verified Bay
                            </span>
                          </div>
                          <div className="flex items-center gap-1.5 text-xs text-[#2C2421]/60 mt-1">
                            <span className="material-symbols-outlined text-sm text-[#2C2421]/40 shrink-0">
                              location_on
                            </span>
                            <span className="truncate">
                              {shop.address || "Main City Workshop"}{shop.city ? `, ${shop.city}` : ""}
                            </span>
                          </div>
                        </div>

                        {/* Contact & Hours Info List */}
                        <div className="mt-4 pt-3.5 border-t border-[#2C2421]/10 flex flex-col gap-2 text-xs text-[#2C2421]/80">
                          <div className="flex items-center gap-2">
                            <span className="material-symbols-outlined text-sm text-[#2C2421]/50 shrink-0">call</span>
                            <span>{shop.phone || (shop.users?.find((u: any) => u.phoneNumber)?.phoneNumber) || "+92 42 3578 9900"}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="material-symbols-outlined text-sm text-[#2C2421]/50 shrink-0">schedule</span>
                            <span>
                              {typeof shop.workingHours === "object" && shop.workingHours !== null
                                ? `${shop.workingHours.open || "09:00 AM"} - ${shop.workingHours.close || "06:00 PM"}`
                                : shop.workingHours || "09:00 AM - 08:00 PM"}
                            </span>
                          </div>
                        </div>

                        {/* Available Services */}
                        <div className="mt-4 pt-3.5 border-t border-[#2C2421]/10">
                          <div className="text-xs font-semibold text-[#2C2421] mb-2">
                            Featured Capabilities
                          </div>
                          <div className="flex flex-wrap gap-1.5">
                            {Array.isArray(shop.services) && shop.services.length > 0 ? (
                              shop.services.slice(0, 3).map((svc: any, idx: number) => (
                                <span
                                  key={idx}
                                  className="text-xs px-2.5 py-1 rounded-lg bg-[#F4F4F1] text-[#2C2421] border border-[#2C2421]/10"
                                >
                                  {typeof svc === "string" ? svc : svc.name}
                                </span>
                              ))
                            ) : (
                              <>
                                <span className="text-xs px-2.5 py-1 rounded-lg bg-[#F4F4F1] text-[#2C2421] border border-[#2C2421]/10">
                                  Periodic Maintenance
                                </span>
                                <span className="text-xs px-2.5 py-1 rounded-lg bg-[#F4F4F1] text-[#2C2421] border border-[#2C2421]/10">
                                  OBD-II Scanning
                                </span>
                              </>
                            )}
                            {Array.isArray(shop.services) && shop.services.length > 3 && (
                              <span className="text-xs px-2 py-1 text-[#2C2421]/60">
                                +{shop.services.length - 3} more
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Action CTAs */}
                      <div className="mt-6 pt-4 border-t border-[#2C2421]/10 flex items-center gap-2">
                        <button
                          onClick={() => handleSelectShop(shop)}
                          className="flex-1 py-2.5 px-3 bg-[#111827] hover:bg-[#1E293B] text-white text-xs font-semibold rounded-xl transition-colors cursor-pointer text-center flex items-center justify-center gap-1.5"
                        >
                          <span className="material-symbols-outlined text-sm">auto_fix_high</span>
                          <span>Guided Booking</span>
                        </button>

                        <Link
                          href={`/book?shopId=${shop.id}`}
                          className="p-2.5 bg-[#F8F8F5] hover:bg-[#F4F4F1] border border-[#2C2421]/15 text-[#2C2421] rounded-xl transition-colors flex items-center justify-center"
                          title="Open wizard in dedicated page"
                        >
                          <span className="material-symbols-outlined text-base">open_in_new</span>
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pagination Controls */}
                {totalPages > 1 && (
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-[#2C2421]/15">
                    <div className="text-xs text-[#2C2421]/70 font-medium">
                      Showing <span className="font-semibold text-[#2C2421]">{startIndex + 1}</span>–
                      <span className="font-semibold text-[#2C2421]">{Math.min(startIndex + SHOPS_PER_PAGE, filteredShops.length)}</span> of{" "}
                      <span className="font-semibold text-[#2C2421]">{filteredShops.length}</span> shops
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => {
                          setCurrentPage((p) => Math.max(p - 1, 1));
                          window.scrollTo({ top: 100, behavior: "smooth" });
                        }}
                        disabled={currentPage === 1}
                        className="px-3.5 py-2 rounded-xl text-xs font-semibold transition-colors border flex items-center gap-1 cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed bg-white text-[#2C2421] border-[#2C2421]/15 hover:bg-[#F4F4F1]"
                      >
                        <span className="material-symbols-outlined text-sm">chevron_left</span>
                        <span>Previous</span>
                      </button>

                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                        <button
                          type="button"
                          key={pageNum}
                          onClick={() => {
                            setCurrentPage(pageNum);
                            window.scrollTo({ top: 100, behavior: "smooth" });
                          }}
                          className={`w-9 h-9 rounded-xl text-xs font-semibold transition-colors border flex items-center justify-center cursor-pointer ${
                            currentPage === pageNum
                              ? "bg-[#111827] text-white border-[#111827]"
                              : "bg-white text-[#2C2421]/70 border-[#2C2421]/15 hover:bg-[#F4F4F1] hover:text-[#2C2421]"
                          }`}
                        >
                          {pageNum}
                        </button>
                      ))}

                      <button
                        type="button"
                        onClick={() => {
                          setCurrentPage((p) => Math.min(p + 1, totalPages));
                          window.scrollTo({ top: 100, behavior: "smooth" });
                        }}
                        disabled={currentPage === totalPages}
                        className="px-3.5 py-2 rounded-xl text-xs font-semibold transition-colors border flex items-center gap-1 cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed bg-white text-[#2C2421] border-[#2C2421]/15 hover:bg-[#F4F4F1]"
                      >
                        <span>Next</span>
                        <span className="material-symbols-outlined text-sm">chevron_right</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
