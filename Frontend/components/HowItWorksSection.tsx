"use client";

import React from "react";
import { motion } from "framer-motion";

const steps = [
  {
    num: "01",
    title: "Connect Your Workshop",
    desc: "Import service bay layouts, assign master technicians with certifications, and integrate your existing DMS and inventory catalogs in under 20 minutes.",
    border: "border-[#E85D22]/40",
    color: "text-[#E85D22]",
    shadow: "shadow-[0_4px_14px_rgba(232,93,34,0.15)]",
  },
  {
    num: "02",
    title: "Manage Every Job",
    desc: "Intelligently sequence repairs, monitor diagnostic scans in 3D bay views, and route parts straight to the technician's workstation without delays.",
    border: "border-[#1F5C45]/40",
    color: "text-[#1F5C45]",
    shadow: "shadow-[0_4px_14px_rgba(31,92,69,0.15)]",
  },
  {
    num: "03",
    title: "Let BayFlow Handle The Details",
    desc: "Coordinate customer SMS and WhatsApp status pings, execute automated OEM inventory replenishment, and let BayFlow AI answer incoming calls.",
    border: "border-[#2C2421]/20",
    color: "text-[#2C2421]",
    shadow: "shadow-[0_4px_14px_rgba(44,36,33,0.08)]",
  },
];

export default function HowItWorksSection() {
  return (
    <section id="how-it-works" className="w-full px-4 sm:px-6 lg:px-8 py-16 sm:py-20 border-t border-[#2C2421]/10 bg-[#F4F4F1]">
      <div className="max-w-7xl mx-auto">
        <div className="max-w-xl mb-12 sm:mb-16">
          <div className="text-[#E85D22] text-xs uppercase tracking-widest mb-2 font-bold">
            Step-By-Step Deployment
          </div>
          <h2 className="font-headline text-4xl sm:text-5xl uppercase text-[#2C2421] font-bold leading-tight">
            Precision Onboarding.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {/* Connecting Line */}
          <div className="hidden md:block absolute top-8 left-12 right-12 h-[1px] bg-gradient-to-r from-[#E85D22]/60 via-[#1F5C45]/40 to-transparent pointer-events-none z-0" />

          {/* 3 Steps */}
          {steps.map((step, idx) => (
            <motion.div
              key={step.num}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.15 }}
              className="relative z-10 flex flex-col gap-4"
            >
              <div
                className={`w-16 h-16 rounded-lg bg-white border ${step.border} flex items-center justify-center font-mono text-2xl font-black ${step.color} ${step.shadow}`}
              >
                {step.num}
              </div>
              <h3 className="font-headline text-xl uppercase font-bold text-[#2C2421] tracking-wide">
                {step.title}
              </h3>
              <p className="text-xs sm:text-sm text-[#6B5E59] leading-relaxed">
                {step.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
