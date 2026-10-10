"use client";

import React, { Suspense } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import GuidedBookingWizard from "@/components/GuidedBookingWizard";

export default function BookingAliasPage() {
  return (
    <div className="min-h-screen bg-[#F4F4F1] text-[#2C2421] flex flex-col justify-between font-sans selection:bg-[#111827] selection:text-white">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
        <Suspense
          fallback={
            <div className="py-24 text-center text-xs font-bold text-[#2C2421]/60 flex items-center justify-center gap-2">
              <span className="animate-spin material-symbols-outlined text-lg">progress_activity</span>
              <span>Loading Guided Booking Wizard...</span>
            </div>
          }
        >
          <GuidedBookingWizard isStandalonePage={true} />
        </Suspense>
      </main>

      <Footer />
    </div>
  );
}
