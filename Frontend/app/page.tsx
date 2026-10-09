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
    <div className="relative flex flex-col min-h-screen bg-[#F4F4F1] text-[#2C2421] selection:bg-[#1F5C45] selection:text-white overflow-x-hidden">
      {/* Floating Navbar */}
      <Navbar onOpenDemo={handleOpenDemo} />

      {/* Main Content Sections with Backdrop Blurs for Glass Depth */}
      <main className="relative z-10 w-full pt-16 min-h-screen">
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
