"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function ShopsPage() {
  const router = useRouter();

  // Directory State
  const [shops, setShops] = useState<any[]>([]);
  const [loadingShops, setLoadingShops] = useState(true);
  const [selectedCity, setSelectedCity] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  // Wizard State
  const [activeShop, setActiveShop] = useState<any | null>(null);
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  // Step 1: Services & Notes
  const [shopServices, setShopServices] = useState<any[]>([]);
  const [loadingServices, setLoadingServices] = useState(false);
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [customNotes, setCustomNotes] = useState("");

  // Step 2: Time Slots
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split("T")[0]
  );
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [selectedSlotTime, setSelectedSlotTime] = useState("");

  // Step 3: Vehicle & Customer Info
  const [vehicle, setVehicle] = useState({
    makeModel: "",
    plate: "",
    color: "",
    mileage: "",
  });
  const [customerInfo, setCustomerInfo] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
  });

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUserEmail, setCurrentUserEmail] = useState("");

  // Submission State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [createdBooking, setCreatedBooking] = useState<any | null>(null);

  // Fallback mock shops if backend array is empty or offline
  const fallbackShops = [
    {
      id: "shop-1",
      name: "Lahore Auto Care",
      city: "Lahore",
      rating: 4.9,
      reviews: 128,
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
    },
    {
      id: "shop-2",
      name: "Apex Performance Garage",
      city: "Karachi",
      rating: 4.8,
      reviews: 94,
      address: "PECHS Block 6, Main Shahrah-e-Faisal",
      phone: "+92 21 3455 1200",
      services: [
        { id: "s6", name: "Engine Tuning & Remap", durationMinutes: 90, basePrice: 15000 },
        { id: "s7", name: "Brake Pad Replacement", durationMinutes: 45, basePrice: 4200 },
        { id: "s8", name: "Transmission Fluid Service", durationMinutes: 60, basePrice: 9000 },
        { id: "s9", name: "Tire Balancing & Alignment", durationMinutes: 30, basePrice: 2500 },
      ],
      workingHours: "08:30 AM - 09:00 PM",
    },
    {
      id: "shop-3",
      name: "Garaj Master Workshop",
      city: "Islamabad",
      rating: 4.9,
      reviews: 62,
      address: "Sector I-9/3 Industrial Area, Islamabad",
      phone: "+92 51 4433 991",
      services: [
        { id: "s10", name: "Full Computer Diagnostic Scan", durationMinutes: 30, basePrice: 2000 },
        { id: "s11", name: "AGM Battery Replacement", durationMinutes: 20, basePrice: 18000 },
        { id: "s12", name: "Synthetic Oil Change", durationMinutes: 30, basePrice: 6000 },
        { id: "s13", name: "Multi-Point Safety Inspection", durationMinutes: 45, basePrice: 3000 },
      ],
      workingHours: "09:00 AM - 07:00 PM",
    },
  ];

  const fallbackSlots = [
    "09:00 AM",
    "10:00 AM",
    "11:30 AM",
    "02:00 PM",
    "03:30 PM",
    "05:00 PM",
  ];

  // Load shops & check active session on mount
  useEffect(() => {
    fetchShops();
    checkAuthSession();
  }, []);

  const checkAuthSession = () => {
    const token = typeof window !== "undefined" ? localStorage.getItem("bayflow_token") : null;
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        if (payload?.email) {
          setCurrentUserEmail(payload.email);
          setCustomerInfo((prev) => ({ ...prev, email: payload.email, name: payload.name || prev.name }));
        }
        setIsLoggedIn(true);
      } catch (e) {
        console.warn("Could not decode auth token:", e);
      }
    }
  };

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

  // When a shop is selected for booking
  const handleSelectShop = async (shop: any) => {
    setActiveShop(shop);
    setStep(1);
    setSelectedServices([]);
    setCustomNotes("");
    setSelectedSlotTime("");
    setErrorMsg("");

    // Fetch services for shop
    setLoadingServices(true);
    try {
      const res = await fetch(`http://localhost:4000/api/shops/${shop.id}/services`);
      const data = await res.json();
      const servicesList = data.data || data.services;
      if (res.ok && data.success && Array.isArray(servicesList) && servicesList.length > 0) {
        setShopServices(servicesList);
      } else {
        setShopServices(shop.services || fallbackShops[0].services);
      }
    } catch (err) {
      setShopServices(shop.services || fallbackShops[0].services);
    } finally {
      setLoadingServices(false);
    }
  };

  // Fetch slots for selected date
  const fetchSlotsForShop = async (shopId: string, dateStr: string) => {
    setLoadingSlots(true);
    try {
      const res = await fetch(`http://localhost:4000/api/shops/${shopId}/slots?date=${dateStr}`);
      const data = await res.json();
      const slotsList = data.data || data.slots;
      if (res.ok && data.success && Array.isArray(slotsList)) {
        setAvailableSlots(slotsList);
      } else {
        setAvailableSlots(fallbackSlots);
      }
    } catch (err) {
      setAvailableSlots(fallbackSlots);
    } finally {
      setLoadingSlots(false);
    }
  };

  // Toggle service selection
  const handleToggleService = (serviceName: string) => {
    if (selectedServices.includes(serviceName)) {
      setSelectedServices(selectedServices.filter((s) => s !== serviceName));
    } else {
      setSelectedServices([...selectedServices, serviceName]);
    }
  };

  // Submit Booking to Backend API
  const handleConfirmBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg("");

    let authToken = typeof window !== "undefined" ? localStorage.getItem("bayflow_token") : null;

    // Parse make, model, year from input string
    const parts = vehicle.makeModel.split(" ");
    const make = parts[0] || "Honda";
    const model = parts.slice(1, -1).join(" ") || "Civic";
    const year = parseInt(parts[parts.length - 1], 10) || 2016;

    // Combine slot time with date
    const slotDateTime = new Date(`${selectedDate} ${selectedSlotTime || "10:00 AM"}`).toISOString();

    const payload: any = {
      shopId: activeShop.id,
      slotTime: slotDateTime,
      vehicleDetails: {
        make,
        model,
        year,
        plate: vehicle.plate,
        color: vehicle.color || "N/A",
        mileage: vehicle.mileage || "N/A",
      },
      issuesReported: selectedServices.length > 0 ? selectedServices : ["Check Engine Light", "Oil change"],
      notes: customNotes,
    };

    if (!authToken) {
      if (!customerInfo.email || !customerInfo.password) {
        setErrorMsg("Please enter your name, email and password to create your customer account.");
        setIsSubmitting(false);
        return;
      }
      payload.customerInfo = {
        name: customerInfo.name || "Customer",
        email: customerInfo.email,
        password: customerInfo.password,
        phoneNumber: (customerInfo as any).phone || (customerInfo as any).phoneNumber || null,
      };
    }

    try {
      const headers: any = { "Content-Type": "application/json" };
      if (authToken) {
        headers["Authorization"] = `Bearer ${authToken}`;
      }

      const res = await fetch("http://localhost:4000/api/bookings", {
        method: "POST",
        headers,
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        const confirmedBooking = data.data || data.booking;
        if (data.accessToken) {
          localStorage.setItem("bayflow_token", data.accessToken);
          localStorage.setItem("bayflow_user_role", "CUSTOMER");
        }
        setCreatedBooking(confirmedBooking);
        setStep(4);
        setTimeout(() => {
          router.push("/dashboard");
        }, 2200);
      } else {
        setErrorMsg(data.error || data.message || "Failed to create booking in database. Please check your slot or details.");
      }
    } catch (err: any) {
      console.error("Backend submit error:", err);
      setErrorMsg("Failed to connect to BayFlow server. Please check your connection.");
    } finally {
      setIsSubmitting(false);
    }
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

  return (
    <div className="min-h-screen bg-[#F4F4F1] text-[#2C2421] flex flex-col justify-between font-sans selection:bg-[#111827] selection:text-white">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16">
        {!activeShop ? (
          /* ================= SECTION A: PUBLIC SHOP DIRECTORY LISTING ================= */
          <div className="space-y-8">
            <div className="text-center max-w-3xl mx-auto space-y-3">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#111827]/10 text-[#111827] text-xs font-bold">
                <span className="material-symbols-outlined text-base">storefront</span>
                <span>MULTI-TENANT GARAGE DIRECTORY</span>
              </div>
              {/* <h1 className="font-headline text-3xl sm:text-5xl font-extrabold text-[#2C2421] tracking-tight">
                Find an Auto Repair Shop
              </h1> */}
              {/* <p className="text-xs sm:text-sm text-[#2C2421]/70 leading-relaxed">
                Browse verified independent workshops, compare available service catalog items, check live time slot availability, and book your repair appointment instantly.
              </p> */}

              {/* Filters & Search Row */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-3">
                {/* Search Input */}
                <div className="relative w-full sm:w-72">
                  <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-base text-[#2C2421]/40">
                    search
                  </span>
                  <input
                    type="text"
                    placeholder="Search shop name or location..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-white border border-[#2C2421]/15 rounded-full text-xs font-medium focus:outline-none focus:border-[#111827] shadow-xs"
                  />
                </div>

                {/* City Filter Pills */}
                <div className="flex items-center gap-1.5 overflow-x-auto max-w-full py-1">
                  {["All", "Lahore", "Karachi", "Islamabad"].map((city) => (
                    <button
                      key={city}
                      onClick={() => setSelectedCity(city)}
                      className={`px-4 py-2 rounded-full text-xs font-bold transition-all border cursor-pointer ${
                        selectedCity === city
                          ? "bg-[#111827] text-white border-[#111827] shadow-xs"
                          : "bg-white text-[#2C2421]/70 border-[#2C2421]/15 hover:text-[#2C2421]"
                      }`}
                    >
                      {city}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {loadingShops ? (
              <div className="py-16 text-center text-xs font-bold text-[#2C2421]/60 flex items-center justify-center gap-2">
                <span className="animate-spin material-symbols-outlined text-lg">progress_activity</span>
                <span>Fetching verified garage directory...</span>
              </div>
            ) : filteredShops.length === 0 ? (
              <div className="bg-white rounded-2xl border border-[#2C2421]/15 p-12 text-center text-xs font-bold text-[#2C2421]/60 max-w-md mx-auto">
                No repair shops matching &quot;{searchQuery || selectedCity}&quot; found.
              </div>
            ) : (
              /* Shop Cards Grid */
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
                {filteredShops.map((shop) => (
                  <motion.div
                    key={shop.id}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="bg-white rounded-3xl border border-[#2C2421]/15 p-6 sm:p-7 shadow-xs hover:shadow-md hover:-translate-y-1 transition-all duration-200 flex flex-col justify-between gap-6"
                  >
                    <div className="space-y-4">
                      {/* Top Meta Header: City & Rating */}
                      <div className="flex items-center justify-between">
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F4F4F1] border border-[#2C2421]/10 text-xs font-bold text-[#2C2421]">
                          <span className="w-2 h-2 rounded-full bg-[#1F5C45]" />
                          <span>{shop.city || "Pakistan"}</span>
                        </div>

                        <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#F4F4F1] border border-[#2C2421]/10 text-xs font-extrabold text-[#2C2421]">
                          <span className="material-symbols-outlined text-amber-500 text-sm">star</span>
                          <span>{shop.rating || "4.9"}</span>
                          <span className="text-[#2C2421]/40 font-normal text-[11px]">({shop.reviews || 128})</span>
                        </div>
                      </div>

                      {/* Workshop Name & Address */}
                      <div>
                        <h3 className="font-headline text-xl font-extrabold text-[#2C2421] tracking-tight">
                          {shop.name}
                        </h3>
                        <div className="flex items-center gap-1.5 text-xs text-[#2C2421]/60 mt-1">
                          <span className="material-symbols-outlined text-sm text-[#2C2421]/40">location_on</span>
                          <span>{shop.address || "Main City Workshop"}</span>
                        </div>
                      </div>

                      {/* Phone & Working Hours */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs bg-[#F8F8F5] p-3 rounded-2xl border border-[#2C2421]/10 text-[#2C2421]/80">
                        <div className="flex items-center gap-1.5">
                          <span className="material-symbols-outlined text-sm text-[#111827]">call</span>
                          <span className="font-mono font-bold text-[#2C2421]">
                            {shop.phone || (shop.users?.find((u: any) => u.phoneNumber)?.phoneNumber) || "0300-1234567"}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="material-symbols-outlined text-sm text-[#111827]">schedule</span>
                          <span>
                            {typeof shop.workingHours === "object" && shop.workingHours !== null
                              ? `${shop.workingHours.open || "09:00"} - ${shop.workingHours.close || "18:00"}`
                              : shop.workingHours || "09:00 AM - 06:00 PM"}
                          </span>
                        </div>
                      </div>

                      {/* Available Services */}
                      <div>
                        <div className="text-[11px] font-bold text-[#2C2421]/60 uppercase tracking-wider mb-2">
                          Available Services:
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {Array.isArray(shop.services) && shop.services.length > 0 ? (
                            shop.services.slice(0, 4).map((svc: any, idx: number) => (
                              <span
                                key={idx}
                                className="text-[11px] font-medium px-2.5 py-1 bg-[#F4F4F1] hover:bg-[#111827] hover:text-white rounded-lg text-[#2C2421]/80 border border-[#2C2421]/10 transition-colors"
                              >
                                {typeof svc === "string" ? svc : svc.name}
                              </span>
                            ))
                          ) : (
                            <span className="text-[11px] font-medium px-2.5 py-1 bg-[#F4F4F1] rounded-lg text-[#2C2421]/60 italic">
                              General Auto Care &amp; Inspection
                            </span>
                          )}
                          {Array.isArray(shop.services) && shop.services.length > 4 && (
                            <span className="text-[10px] font-bold px-2 py-1 bg-[#111827]/5 text-[#111827] rounded-lg">
                              +{shop.services.length - 4} more
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Book Appointment CTA */}
                    <button
                      onClick={() => handleSelectShop(shop)}
                      className="w-full py-3.5 bg-[#111827] hover:bg-[#0F172A] text-white text-xs font-bold rounded-2xl shadow-xs hover:shadow-md transition-all flex items-center justify-center gap-2 group cursor-pointer"
                    >
                      <span>Book Service Appointment</span>
                      <span className="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform">
                        arrow_forward
                      </span>
                    </button>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        ) : (
          /* ================= SECTION B: GUIDED BOOKING WIZARD ================= */
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-2xl mx-auto bg-white rounded-3xl border border-[#2C2421]/15 p-6 sm:p-10 shadow-sm"
          >
            {/* Wizard Stepper Header */}
            <div className="flex items-center justify-between border-b border-[#2C2421]/10 pb-4 mb-6">
              <div>
                <span className="text-[11px] font-mono font-bold text-[#111827] bg-[#111827]/10 px-2.5 py-0.5 rounded-full">
                  STEP {step} OF 3
                </span>
                <h2 className="font-headline text-xl font-bold text-[#2C2421] mt-1">
                  {activeShop.name}
                </h2>
                <p className="text-xs text-[#2C2421]/60">{activeShop.address || activeShop.city}</p>
              </div>

              <button
                onClick={() => setActiveShop(null)}
                className="text-xs font-bold text-[#2C2421]/60 hover:text-[#2C2421] underline cursor-pointer"
              >
                Change Shop
              </button>
            </div>

            {step === 4 && createdBooking ? (
              /* Booking Success Confirmation Card */
              <div className="text-center py-8 space-y-4">
                <div className="w-16 h-16 rounded-full bg-[#1F5C45]/15 text-[#1F5C45] flex items-center justify-center mx-auto shadow-sm">
                  <span className="material-symbols-outlined text-4xl">check_circle</span>
                </div>
                <h3 className="font-headline text-2xl font-bold text-[#2C2421]">Booking Confirmed!</h3>
                <p className="text-xs sm:text-sm text-[#2C2421]/70 max-w-md mx-auto leading-relaxed">
                  Your appointment request is registered under Reference ID{" "}
                  <strong className="font-mono text-[#111827] bg-[#F4F4F1] px-2 py-0.5 rounded">
                    {createdBooking.id}
                  </strong>{" "}
                  with status <strong className="text-[#1F5C45]">PENDING</strong>.
                </p>
                <p className="text-xs text-[#2C2421]/50 animate-pulse">
                  Redirecting to your Unified Dashboard...
                </p>
              </div>
            ) : (
              <form onSubmit={handleConfirmBooking} className="space-y-6">
                {/* ---------------- WIZARD STEP 1: SERVICES & PROBLEMS ---------------- */}
                {step === 1 && (
                  <div className="space-y-5">
                    <div>
                      <h3 className="font-headline text-base font-bold text-[#2C2421]">
                        Select Services / Reported Problems:
                      </h3>
                      <p className="text-xs text-[#2C2421]/60 mt-0.5">
                        Multiple selections allowed. Click to choose what your vehicle needs.
                      </p>
                    </div>

                    {loadingServices ? (
                      <div className="py-6 text-center text-xs font-bold text-[#2C2421]/60">
                        Loading shop service catalog...
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        {shopServices.map((svc: any, idx: number) => {
                          const svcName = typeof svc === "string" ? svc : svc.name;
                          const isSelected = selectedServices.includes(svcName);
                          return (
                            <button
                              type="button"
                              key={idx}
                              onClick={() => handleToggleService(svcName)}
                              className={`p-3.5 rounded-2xl border text-left text-xs font-bold transition-all flex items-center justify-between cursor-pointer ${
                                isSelected
                                  ? "bg-[#111827] text-white border-[#111827] shadow-xs"
                                  : "bg-[#F8F8F5] text-[#2C2421]/80 border-[#2C2421]/15 hover:border-[#2C2421]/30"
                              }`}
                            >
                              <span>{svcName}</span>
                              <span className="material-symbols-outlined text-base">
                                {isSelected ? "check_circle" : "add_circle_outline"}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    )}

                    <div>
                      <label className="block text-xs font-bold text-[#2C2421] mb-1">
                        Additional Problem Notes / Symptoms (Optional):
                      </label>
                      <textarea
                        rows={3}
                        placeholder="e.g. Engine vibrates when stopped at idle, warning light came on yesterday..."
                        value={customNotes}
                        onChange={(e) => setCustomNotes(e.target.value)}
                        className="w-full p-3.5 bg-[#F8F8F5] border border-[#2C2421]/15 rounded-2xl text-xs focus:outline-none focus:border-[#111827]"
                      />
                    </div>

                    <button
                      type="button"
                      disabled={selectedServices.length === 0}
                      onClick={() => {
                        setStep(2);
                        fetchSlotsForShop(activeShop.id, selectedDate);
                      }}
                      className="w-full py-3.5 bg-[#111827] text-white text-xs font-bold rounded-2xl shadow-xs disabled:opacity-50 flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <span>Next: Select Time Slot</span>
                      <span className="material-symbols-outlined text-sm">arrow_forward</span>
                    </button>
                  </div>
                )}

                {/* ---------------- WIZARD STEP 2: TIME SLOT PICKER ---------------- */}
                {step === 2 && (
                  <div className="space-y-5">
                    <div>
                      <h3 className="font-headline text-base font-bold text-[#2C2421]">
                        Select Appointment Date &amp; Time Slot:
                      </h3>
                      <p className="text-xs text-[#2C2421]/60 mt-0.5">
                        Choose an available slot for {activeShop.name}.
                      </p>
                    </div>

                    {/* Date Selector */}
                    <div>
                      <label className="block text-xs font-bold text-[#2C2421] mb-1">Preferred Date:</label>
                      <input
                        type="date"
                        value={selectedDate}
                        onChange={(e) => {
                          setSelectedDate(e.target.value);
                          fetchSlotsForShop(activeShop.id, e.target.value);
                        }}
                        className="w-full p-3 bg-[#F8F8F5] border border-[#2C2421]/15 rounded-xl text-xs font-bold text-[#2C2421]"
                      />
                    </div>

                    {/* Slots Grid */}
                    {loadingSlots ? (
                      <div className="py-6 text-center text-xs font-bold text-[#2C2421]/60">
                        Checking slot availability...
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                        {availableSlots.map((slot, idx) => {
                          const isSelected = selectedSlotTime === slot;
                          return (
                            <button
                              type="button"
                              key={idx}
                              onClick={() => setSelectedSlotTime(slot)}
                              className={`p-3 rounded-2xl border text-center text-xs font-bold transition-all cursor-pointer ${
                                isSelected
                                  ? "bg-[#111827] text-white border-[#111827] shadow-xs"
                                  : "bg-[#F8F8F5] text-[#2C2421]/80 border-[#2C2421]/15 hover:border-[#2C2421]/30"
                              }`}
                            >
                              {slot}
                            </button>
                          );
                        })}
                      </div>
                    )}

                    <div className="flex gap-2 pt-2">
                      <button
                        type="button"
                        onClick={() => setStep(1)}
                        className="w-1/3 py-3 border border-[#2C2421]/20 text-xs font-bold rounded-2xl cursor-pointer"
                      >
                        ← Back
                      </button>
                      <button
                        type="button"
                        disabled={!selectedSlotTime}
                        onClick={() => setStep(3)}
                        className="w-2/3 py-3 bg-[#111827] text-white text-xs font-bold rounded-2xl shadow-xs disabled:opacity-50 flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <span>Next: Vehicle &amp; Customer Details</span>
                        <span className="material-symbols-outlined text-sm">arrow_forward</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* ---------------- WIZARD STEP 3: CUSTOMER & VEHICLE DETAILS ---------------- */}
                {step === 3 && (
                  <div className="space-y-5">
                    <div>
                      <h3 className="font-headline text-base font-bold text-[#2C2421]">
                        Vehicle &amp; Customer Details:
                      </h3>
                      <p className="text-xs text-[#2C2421]/60 mt-0.5">
                        Provide vehicle info to register this job card in the backend state machine.
                      </p>
                    </div>

                    {errorMsg && (
                      <div className="p-3 bg-[#E85D22]/10 border border-[#E85D22]/30 rounded-xl text-xs font-bold text-[#E85D22]">
                        {errorMsg}
                      </div>
                    )}

                    {/* Vehicle Details */}
                    <div className="space-y-3 bg-[#F8F8F5] p-4 rounded-2xl border border-[#2C2421]/10">
                      <div className="text-xs font-bold uppercase tracking-wider text-[#2C2421]/70">
                        Vehicle Identification
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                        <div>
                          <label className="block font-bold mb-1">Make &amp; Model *</label>
                          <input
                            required
                            type="text"
                            placeholder="e.g. Honda Civic 2016"
                            value={vehicle.makeModel}
                            onChange={(e) => setVehicle({ ...vehicle, makeModel: e.target.value })}
                            className="w-full p-3 bg-white border border-[#2C2421]/15 rounded-xl font-medium"
                          />
                        </div>
                        <div>
                          <label className="block font-bold mb-1">Plate Registration *</label>
                          <input
                            required
                            type="text"
                            placeholder="e.g. LEA-1234"
                            value={vehicle.plate}
                            onChange={(e) => setVehicle({ ...vehicle, plate: e.target.value })}
                            className="w-full p-3 bg-white border border-[#2C2421]/15 rounded-xl font-bold font-mono"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Customer Personal Details */}
                    {isLoggedIn ? (
                      <div className="p-4 bg-[#1F5C45]/10 border border-[#1F5C45]/30 rounded-2xl flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2 font-bold text-[#1F5C45]">
                          <span className="material-symbols-outlined text-base">account_circle</span>
                          <span>Signed in as <strong>{currentUserEmail || "Customer Account"}</strong></span>
                        </div>
                        <span className="px-2.5 py-0.5 rounded-full bg-[#1F5C45] text-white text-[10px] font-bold">
                          Session Verified
                        </span>
                      </div>
                    ) : (
                      <div className="space-y-3 bg-[#F8F8F5] p-4 rounded-2xl border border-[#2C2421]/10">
                        <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-[#2C2421]/70">
                          <span>Customer Portal Account</span>
                          <Link href="/login" className="lowercase text-amber-700 underline font-bold hover:text-amber-900">
                            Already registered? Sign In
                          </Link>
                        </div>
                        <p className="text-[11px] text-[#2C2421]/70">
                          To track your vehicle repair, approve estimates, and receive updates, enter your account details below or sign in.
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                          <div>
                            <label className="block font-bold mb-1">Your Name *</label>
                            <input
                              required
                              type="text"
                              placeholder="e.g. Ahmed Khan"
                              value={customerInfo.name}
                              onChange={(e) => setCustomerInfo({ ...customerInfo, name: e.target.value })}
                              className="w-full p-3 bg-white border border-[#2C2421]/15 rounded-xl font-medium"
                            />
                          </div>
                          <div>
                            <label className="block font-bold mb-1">Email Address *</label>
                            <input
                              required
                              type="email"
                              placeholder="e.g. ahmed@mail.com"
                              value={customerInfo.email}
                              onChange={(e) => setCustomerInfo({ ...customerInfo, email: e.target.value })}
                              className="w-full p-3 bg-white border border-[#2C2421]/15 rounded-xl font-medium"
                            />
                          </div>
                          <div>
                            <label className="block font-bold mb-1">Account Password *</label>
                            <input
                              required
                              type="password"
                              placeholder="••••••••"
                              value={customerInfo.password}
                              onChange={(e) => setCustomerInfo({ ...customerInfo, password: e.target.value })}
                              className="w-full p-3 bg-white border border-[#2C2421]/15 rounded-xl font-medium"
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="flex gap-2 pt-2">
                      <button
                        type="button"
                        onClick={() => setStep(2)}
                        className="w-1/3 py-3.5 border border-[#2C2421]/20 text-xs font-bold rounded-2xl cursor-pointer"
                      >
                        ← Back
                      </button>
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-2/3 py-3.5 bg-[#1F5C45] hover:bg-[#164433] text-white text-xs font-bold rounded-2xl shadow-sm flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-60"
                      >
                        {isSubmitting ? (
                          <span>Creating Booking...</span>
                        ) : (
                          <>
                            <span className="material-symbols-outlined text-base">check</span>
                            <span>Confirm &amp; Create Appointment</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                )}
              </form>
            )}
          </motion.div>
        )}
      </main>

      <Footer />
    </div>
  );
}
