"use client";

import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import FeaturesGrid from "@/components/FeaturesGrid";
import ShowcaseModules from "@/components/ShowcaseModules";
import AiConciergeSection from "@/components/AiConciergeSection";
import HowItWorksSection from "@/components/HowItWorksSection";
import CtaSection from "@/components/CtaSection";
import DeveloperHandover from "@/components/DeveloperHandover";
import Footer from "@/components/Footer";
import DemoModal from "@/components/DemoModal";

export default function Home() {
  const [demoModalOpen, setDemoModalOpen] = useState(false);

  const handleOpenDemo = () => {
    setDemoModalOpen(true);
  };

  const handleCloseDemo = () => {
    setDemoModalOpen(false);
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#F4F4F1] text-[#2C2421]">
      <Navbar onOpenDemo={handleOpenDemo} />

      <main className="w-full pt-16 bg-[#F4F4F1] min-h-screen">
        <HeroSection onOpenDemo={handleOpenDemo} />
        <FeaturesGrid />
        <ShowcaseModules onOpenDemo={handleOpenDemo} />
        <AiConciergeSection onOpenDemo={handleOpenDemo} />
        <HowItWorksSection />
        <CtaSection onOpenDemo={handleOpenDemo} />
        <DeveloperHandover />
      </main>

      <Footer />

      <DemoModal isOpen={demoModalOpen} onClose={handleCloseDemo} />
    </div>
  );
}
