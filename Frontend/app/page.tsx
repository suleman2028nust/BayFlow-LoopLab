"use client";

import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import FeaturesGrid from "@/components/FeaturesGrid";
import CapacitySection from "@/components/CapacitySection";
import WorkflowSection from "@/components/WorkflowSection";
import InventorySection from "@/components/InventorySection";
import AiConciergeSection from "@/components/AiConciergeSection";
import OnboardingSection from "@/components/OnboardingSection";
import CtaSection from "@/components/CtaSection";
import TelemetryBar from "@/components/TelemetryBar";
import Footer from "@/components/Footer";
import DemoModal from "@/components/DemoModal";

export default function Home() {
  const [demoOpen, setDemoOpen] = useState(false);

  return (
    <main className="min-h-screen bg-[#fbfbfb] flex flex-col justify-between selection:bg-[#ff4d15] selection:text-white">
      {/* Top Navigation & Status Ticker */}
      <Navbar onOpenDemo={() => setDemoOpen(true)} />

      {/* Main Sections */}
      <div className="flex-1">
        <HeroSection onOpenDemo={() => setDemoOpen(true)} />
        <FeaturesGrid />
        <CapacitySection />
        <WorkflowSection />
        <InventorySection onOpenDemo={() => setDemoOpen(true)} />
        <AiConciergeSection onOpenDemo={() => setDemoOpen(true)} />
        <OnboardingSection />
        <CtaSection onOpenDemo={() => setDemoOpen(true)} />
        <TelemetryBar />
      </div>

      {/* Footer */}
      <Footer />

      {/* Interactive Live Demo Modal */}
      <DemoModal isOpen={demoOpen} onClose={() => setDemoOpen(false)} />
    </main>
  );
}
