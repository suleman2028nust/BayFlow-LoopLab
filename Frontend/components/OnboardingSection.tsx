"use client";

import React from "react";
import { motion } from "framer-motion";

const steps = [
  {
    num: "01",
    title: "CONNECT YOUR WORKSHOP",
    desc: "Import service bays, hoists, setup technician rosters with certifications, and integrate your existing DMS and inventory catalog in under 10 minutes.",
  },
  {
    num: "02",
    title: "MANAGE EVERY JOB",
    desc: "Dispatch incoming repairs, feed live diagnostic streams, track parts, and communicate directly to the technician's workspace without delays.",
  },
  {
    num: "03",
    title: "LET BAYFLOW HANDLE THE DETAILS",
    desc: "Coordinate customer SMS and live status alerts via AI voice, execute automated OEM inventory replenishment, and let Bayflow adjust repair flow triage.",
  },
];

export default function OnboardingSection() {
  return (
    <section className="py-16 sm:py-24 bg-[#fbfbfb]">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="space-y-3 mb-12"
        >
          <div className="inline-flex items-center gap-1.5 text-xs font-mono-tech uppercase text-[#ff4d15] font-semibold tracking-wider">
            <span className="w-1.5 h-1.5 rounded-full bg-[#ff4d15]" />
            PRECISION WORKFLOW SETUP
          </div>

          <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 tracking-tight leading-none uppercase">
            PRECISION ONBOARDING.
          </h2>
        </motion.div>

        {/* 3 Step Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {steps.map((step, idx) => (
            <motion.div
              key={step.num}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.15 }}
              className="bg-white border border-gray-200 rounded-lg p-6 sm:p-8 hover:border-gray-400 hover:shadow-lg transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="w-9 h-9 rounded border border-[#ff4d15] text-[#ff4d15] font-mono-tech font-bold text-sm flex items-center justify-center mb-6">
                  {step.num}
                </div>

                <h3 className="font-display text-xl sm:text-2xl font-bold text-gray-900 mb-3 tracking-tight">
                  {step.title}
                </h3>

                <p className="text-sm text-gray-600 leading-relaxed">
                  {step.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
