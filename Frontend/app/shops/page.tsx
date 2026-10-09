"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import DemoModal from "@/components/DemoModal";

export default function ShopsPage() {
  const router = useRouter();
  const [demoModalOpen, setDemoModalOpen] = useState(false);
  const [selectedCity, setSelectedCity] = useState("All");
  const [activeShopForBooking, setActiveShopForBooking] = useState<any>(null);

  // Booking Wizard state
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [customNotes, setCustomNotes] = useState("");
  const [selectedSlot, setSelectedSlot] = useState("");
  const [vehicle, setVehicle] = useState({ plate: "", make: "", model: "", year: "2021" });
  const [customerInfo, setCustomerInfo] = useState({ name: "", email: "", phone: "" });
  const [bookingConfirmed, setBookingConfirmed] = useState(false);

  const shops = [
    {
      id: "shop-1",
      name: "Lahore Auto Care",
      city: "Lahore",
      rating: 4.9,
      reviews: 128,
      address: "Main Gulberg III, Lahore",
      phone: "+92 42 3578 9900",
      services: ["Oil Change", "Check Engine Light", "Brake Overhaul", "AC Gas Refill", "Suspension Repair"],
      image: "/workshop-inspection.jpg",
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
      services: ["Engine Tuning", "Brake Pad Replacement", "Transmission Check", "Tire Alignment"],
      image: "/workshop-inspection.jpg",
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
      services: ["Computer Scan", "Battery Replacement", "Oil Change", "Quality Inspection"],
      image: "/workshop-inspection.jpg",
      workingHours: "09:00 AM - 07:00 PM",
    },
  ];

  const availableSlots = [
    "Today @ 02:00 PM (Available)",
    "Today @ 04:00 PM (Available)",
    "Tomorrow @ 10:00 AM (Available)",
    "Tomorrow @ 11:30 AM (Available)",
    "Tomorrow @ 03:00 PM (Available)",
  ];

  const filteredShops = selectedCity === "All" ? shops : shops.filter((s) => s.city === selectedCity);

  const handleToggleService = (service: string) => {
    if (selectedServices.includes(service)) {
      setSelectedServices(selectedServices.filter((s) => s !== service));
    } else {
      setSelectedServices([...selectedServices, service]);
    }
  };

  const handleConfirmBooking = (e: React.FormEvent) => {
    e.preventDefault();
    setBookingConfirmed(true);
    setTimeout(() => {
      router.push("/customer");
    }, 1800);
  };

  return (
    <div className="min-h-screen bg-[#F4F4F1] text-[#2C2421] flex flex-col font-sans">
      <Navbar onOpenDemo={() => setDemoModalOpen(true)} />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16">
        {!activeShopForBooking ? (
          /* SHOP DIRECTORY LISTING */
          <div className="space-y-8">
            <div className="text-center max-w-2xl mx-auto space-y-3">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#111827]/10 text-[#111827] text-xs font-bold">
                <span className="material-symbols-outlined text-base">storefront</span>
                <span>VERIFIED GARAGE DIRECTORY</span>
              </div>
              <h1 className="font-headline text-3xl sm:text-5xl font-extrabold text-[#2C2421]">
                Find an Auto Repair Shop
              </h1>
              <p className="text-sm text-[#2C2421]/70">
                Browse verified multi-tenant garages, check live slot availability, and book your service appointment instantly.
              </p>

              {/* City Filter Pills */}
              <div className="flex items-center justify-center gap-2 pt-2">
                {["All", "Lahore", "Karachi", "Islamabad"].map((city) => (
                  <button
                    key={city}
                    onClick={() => setSelectedCity(city)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
                      selectedCity === city
                        ? "bg-[#111827] text-white border-[#111827] shadow"
                        : "bg-white text-[#2C2421]/70 border-[#2C2421]/15 hover:text-[#2C2421]"
                    }`}
                  >
                    {city}
                  </button>
                ))}
              </div>
            </div>

            {/* Shop Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {filteredShops.map((shop) => (
                <div
                  key={shop.id}
                  className="bg-white rounded-2xl border border-[#2C2421]/15 overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div className="p-6 space-y-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#1F5C45]/10 text-[#1F5C45]">
                          {shop.city}
                        </span>
                        <h3 className="font-headline text-xl font-bold text-[#2C2421] mt-1.5">{shop.name}</h3>
                        <p className="text-xs text-[#2C2421]/60 mt-0.5">{shop.address}</p>
                      </div>
                      <div className="flex items-center gap-1 bg-[#F4F4F1] px-2 py-1 rounded-lg border border-[#2C2421]/10 text-xs font-bold text-[#2C2421]">
                        <span className="material-symbols-outlined text-amber-500 text-sm">star</span>
                        <span>{shop.rating}</span>
                      </div>
                    </div>

                    <div>
                      <div className="text-xs font-bold text-[#2C2421]/70 uppercase tracking-wider mb-2">Available Services:</div>
                      <div className="flex flex-wrap gap-1.5">
                        {shop.services.map((svc) => (
                          <span key={svc} className="text-[11px] font-medium px-2.5 py-1 bg-[#F4F4F1] rounded-lg text-[#2C2421]/80">
                            {svc}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="p-6 pt-0">
                    <button
                      onClick={() => {
                        setActiveShopForBooking(shop);
                        setStep(1);
                      }}
                      className="w-full py-3 bg-[#111827] hover:bg-[#0F172A] text-white text-xs font-bold rounded-xl shadow transition-all flex items-center justify-center gap-1.5"
                    >
                      <span>Book Service Appointment</span>
                      <span className="material-symbols-outlined text-sm">arrow_forward</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          /* GUIDED BOOKING WIZARD */
          <div className="max-w-2xl mx-auto bg-white rounded-2xl border border-[#2C2421]/15 p-6 sm:p-8 shadow-sm">
            <div className="flex items-center justify-between border-b border-[#2C2421]/10 pb-4 mb-6">
              <div>
                <span className="text-xs font-mono font-bold text-[#111827]">BOOKING WIZARD • STEP {step} OF 3</span>
                <h2 className="font-headline text-xl font-bold text-[#2C2421]">{activeShopForBooking.name}</h2>
              </div>
              <button
                onClick={() => setActiveShopForBooking(null)}
                className="text-xs font-bold text-[#2C2421]/60 hover:text-[#2C2421] underline"
              >
                Change Shop
              </button>
            </div>

            {bookingConfirmed ? (
              <div className="text-center py-8 space-y-3">
                <div className="w-14 h-14 rounded-full bg-[#1F5C45]/15 text-[#1F5C45] flex items-center justify-center mx-auto">
                  <span className="material-symbols-outlined text-3xl">check_circle</span>
                </div>
                <h3 className="font-headline text-2xl font-bold text-[#2C2421]">Booking Confirmed!</h3>
                <p className="text-xs text-[#2C2421]/70 max-w-sm mx-auto">
                  Your appointment request is created with status <strong className="text-[#111827]">PENDING</strong>. Redirecting to your Customer Portal...
                </p>
              </div>
            ) : (
              <form onSubmit={handleConfirmBooking} className="space-y-6">
                {step === 1 && (
                  <div className="space-y-4">
                    <h3 className="font-bold text-sm text-[#2C2421]">Select Reported Problems / Services:</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {activeShopForBooking.services.map((svc: string) => (
                        <button
                          type="button"
                          key={svc}
                          onClick={() => handleToggleService(svc)}
                          className={`p-3 rounded-xl border text-left text-xs font-bold transition-all ${
                            selectedServices.includes(svc)
                              ? "bg-[#111827] text-white border-[#111827]"
                              : "bg-[#F4F4F1] text-[#2C2421]/80 border-[#2C2421]/15 hover:border-[#2C2421]/30"
                          }`}
                        >
                          {svc}
                        </button>
                      ))}
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#2C2421] mb-1">Additional Notes / Symptoms:</label>
                      <textarea
                        rows={3}
                        placeholder="e.g. Engine vibrates when stopped at red light, light came on yesterday..."
                        value={customNotes}
                        onChange={(e) => setCustomNotes(e.target.value)}
                        className="w-full p-3 bg-[#F4F4F1] border border-[#2C2421]/15 rounded-xl text-xs focus:outline-none focus:border-[#111827]"
                      />
                    </div>

                    <button
                      type="button"
                      disabled={selectedServices.length === 0}
                      onClick={() => setStep(2)}
                      className="w-full py-3 bg-[#111827] text-white text-xs font-bold rounded-xl disabled:opacity-50"
                    >
                      Next: Select Time Slot →
                    </button>
                  </div>
                )}

                {step === 2 && (
                  <div className="space-y-4">
                    <h3 className="font-bold text-sm text-[#2C2421]">Select Available Time Slot:</h3>
                    <div className="space-y-2">
                      {availableSlots.map((slot) => (
                        <button
                          type="button"
                          key={slot}
                          onClick={() => setSelectedSlot(slot)}
                          className={`w-full p-3 rounded-xl border text-left text-xs font-bold transition-all ${
                            selectedSlot === slot
                              ? "bg-[#111827] text-white border-[#111827]"
                              : "bg-[#F4F4F1] text-[#2C2421]/80 border-[#2C2421]/15"
                          }`}
                        >
                          {slot}
                        </button>
                      ))}
                    </div>

                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setStep(1)}
                        className="w-1/3 py-3 border border-[#2C2421]/15 text-xs font-bold rounded-xl"
                      >
                        ← Back
                      </button>
                      <button
                        type="button"
                        disabled={!selectedSlot}
                        onClick={() => setStep(3)}
                        className="w-2/3 py-3 bg-[#111827] text-white text-xs font-bold rounded-xl disabled:opacity-50"
                      >
                        Next: Vehicle &amp; Details →
                      </button>
                    </div>
                  </div>
                )}

                {step === 3 && (
                  <div className="space-y-4">
                    <h3 className="font-bold text-sm text-[#2C2421]">Vehicle &amp; Customer Details:</h3>

                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div>
                        <label className="block font-bold mb-1">Vehicle Make &amp; Model *</label>
                        <input
                          required
                          type="text"
                          placeholder="Honda Civic"
                          value={vehicle.make}
                          onChange={(e) => setVehicle({ ...vehicle, make: e.target.value })}
                          className="w-full p-3 bg-[#F4F4F1] border border-[#2C2421]/15 rounded-xl"
                        />
                      </div>
                      <div>
                        <label className="block font-bold mb-1">Plate Number *</label>
                        <input
                          required
                          type="text"
                          placeholder="LEA-1234"
                          value={vehicle.plate}
                          onChange={(e) => setVehicle({ ...vehicle, plate: e.target.value })}
                          className="w-full p-3 bg-[#F4F4F1] border border-[#2C2421]/15 rounded-xl"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div>
                        <label className="block font-bold mb-1">Your Name *</label>
                        <input
                          required
                          type="text"
                          placeholder="Ahmed Khan"
                          value={customerInfo.name}
                          onChange={(e) => setCustomerInfo({ ...customerInfo, name: e.target.value })}
                          className="w-full p-3 bg-[#F4F4F1] border border-[#2C2421]/15 rounded-xl"
                        />
                      </div>
                      <div>
                        <label className="block font-bold mb-1">Email (For Portal Account) *</label>
                        <input
                          required
                          type="email"
                          placeholder="ahmed@mail.com"
                          value={customerInfo.email}
                          onChange={(e) => setCustomerInfo({ ...customerInfo, email: e.target.value })}
                          className="w-full p-3 bg-[#F4F4F1] border border-[#2C2421]/15 rounded-xl"
                        />
                      </div>
                    </div>

                    <div className="flex gap-2 pt-2">
                      <button
                        type="button"
                        onClick={() => setStep(2)}
                        className="w-1/3 py-3 border border-[#2C2421]/15 text-xs font-bold rounded-xl"
                      >
                        ← Back
                      </button>
                      <button
                        type="submit"
                        className="w-2/3 py-3 bg-[#1F5C45] hover:bg-[#164433] text-white text-xs font-bold rounded-xl shadow"
                      >
                        Confirm &amp; Create Booking
                      </button>
                    </div>
                  </div>
                )}
              </form>
            )}
          </div>
        )}
      </main>

      <Footer />
      <DemoModal isOpen={demoModalOpen} onClose={() => setDemoModalOpen(false)} />
    </div>
  );
}
