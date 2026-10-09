"use client";

import React from "react";
import { motion } from "framer-motion";
import { CalendarCheck, Activity, PackageCheck, ArrowUpRight } from "lucide-react";

const features = [
  {
    num: "01",
    title: "INTELLIGENT BOOKINGS",
    icon: CalendarCheck,
    description:
      "Dynamically optimize shop floor slots, match technician certifications, bay lift heights, and expected job duration to balance high-performance drive bays.",
    tag1: "OPTIMIZATION",
    tag2: "AUTO-DISPATCH",
  },
  {
    num: "02",
    title: "REAL-TIME JOB TRACKING",
    icon: Activity,
    description:
      "Live bay telemetry, digital inspection workflows, and sub-second parts trails to keep vehicles moving off the hoist without downtime.",
    tag1: "TELEMETRY",
    tag2: "LIVE STATS",
  },
  {
    num: "03",
    title: "CONNECTED INVENTORY",
    icon: PackageCheck,
    description:
      "Auto-OEM supplier integration to catalog component codes and automatically dispatch pre-allocated parts packets days ahead of bay arrival.",
    tag1: "SUPPLY CHAIN",
    tag2: "PRE-ALLOCATE",
  },
];

export default function FeaturesGrid() {
  return (
    <section id="features" className="py-16 sm:py-20 bg-white border-y border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-12 border-b border-gray-100">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-1.5 text-xs font-mono-tech uppercase text-[#ff4d15] font-semibold tracking-wider mb-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#ff4d15]" />
              THE NEXT GENERATION OF WORKSHOP MANAGEMENT
            </div>
            <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 tracking-tight leading-none uppercase">
              LESS CHAOS. MORE CONTROL.
            </h2>
          </div>

          <p className="max-w-md text-sm sm:text-base text-gray-600 font-normal leading-relaxed">
            Bayflow unifies bookings, diagnostic computers, OEM supplier catalogs, and client communication into a frictionless, glass-cockpit operational interface.
          </p>
        </div>

        {/* 3 Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-10">
          {features.map((item, idx) => {
            const IconComponent = item.icon;
            return (
              <motion.div
                key={item.num}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.15 }}
                className="group relative bg-[#fcfcfc] hover:bg-white border border-gray-200 hover:border-gray-400 p-6 sm:p-8 rounded-lg shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  {/* Top card header */}
                  <div className="flex items-center justify-between pb-6 border-b border-gray-100">
                    <span className="font-mono-tech text-lg font-bold text-gray-400 group-hover:text-[#ff4d15] transition-colors">
                      {item.num}
                    </span>
                    <div className="w-10 h-10 rounded border border-gray-200 bg-white group-hover:border-[#ff4d15]/30 group-hover:bg-[#fff2ed] flex items-center justify-center transition-colors">
                      <IconComponent className="w-5 h-5 text-gray-700 group-hover:text-[#ff4d15] transition-colors" />
                    </div>
                  </div>

                  {/* Title & Body */}
                  <h3 className="font-display text-2xl font-bold text-gray-900 mt-6 mb-3 tracking-tight group-hover:text-[#ff4d15] transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                {/* Footer tags */}
                <div className="pt-8 mt-6 border-t border-gray-100 flex items-center justify-between text-[11px] font-mono-tech uppercase text-gray-500">
                  <span className="font-medium tracking-wider group-hover:text-gray-900">
                    {item.tag1}
                  </span>
                  <span className="text-[#ff4d15] font-semibold flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                    {item.tag2}
                    <ArrowUpRight className="w-3 h-3" />
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
