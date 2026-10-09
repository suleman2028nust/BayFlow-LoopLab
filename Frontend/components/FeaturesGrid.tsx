"use client";

import React from "react";
import { motion } from "framer-motion";

const features = [
  {
    num: "01",
    icon: "calendar_month",
    accentColor: "group-hover:text-[#E85D22]",
    hoverBorder: "hover:border-[#E85D22]/40",
    title: "Intelligent Bookings",
    description:
      "Dynamic load balancing calculates exact mechanic certifications, bay lift heights, and expected job duration before accepting appointments.",
    footerLabel: "BAY ALLOCATION",
    footerStatus: "AUTOMATED",
    statusColor: "text-[#1F5C45]",
  },
  {
    num: "02",
    icon: "radar",
    accentColor: "group-hover:text-[#1F5C45]",
    hoverBorder: "hover:border-[#1F5C45]/40",
    title: "Real-Time Job Tracking",
    description:
      "Live bay milestones, digital inspection work orders, and sub-second push feeds to keep vehicle owners informed without desk calls.",
    footerLabel: "JOB LATENCY",
    footerStatus: "< 150MS SYNC",
    statusColor: "text-[#1F5C45]",
  },
  {
    num: "03",
    icon: "inventory_2",
    accentColor: "group-hover:text-[#E85D22]",
    hoverBorder: "hover:border-[#E85D22]/40",
    title: "Connected Inventory",
    description:
      "Live OEM supplier integrations calculate consumption rates, automatically queuing brake pads, filters, and synthetic blends ahead of bay entry.",
    footerLabel: "STOCK BUFFER",
    footerStatus: "PREDICTIVE",
    statusColor: "text-[#1F5C45]",
  },
];

export default function FeaturesGrid() {
  return (
    <section id="features" className="w-full px-4 sm:px-6 lg:px-8 py-16 sm:py-20 border-y border-[#2C2421]/10 relative bg-[#F8F8F5]">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 text-[#E85D22] text-xs uppercase tracking-widest mb-3 font-bold">
              <span className="material-symbols-outlined text-[16px]">tune</span>
              <span>The Next Generation Of Workshop Management</span>
            </div>
            <h2 className="font-headline text-4xl sm:text-5xl uppercase text-[#2C2421] font-bold leading-tight">
              Less Chaos. More Control.
            </h2>
          </div>
          <p className="max-w-md text-sm sm:text-base text-[#6B5E59] leading-relaxed">
            BayFlow unifies bays, diagnostic computers, OEM supplier catalogs, and client updates into a
            synchronized, glass-cockpit operational interface.
          </p>
        </div>

        {/* 3 Minimal White Claymorphic Feature Modules */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((item, idx) => (
            <motion.div
              key={item.num}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className={`p-6 bg-white rounded-lg border border-[#2C2421]/10 ${item.hoverBorder} transition-all duration-300 group flex flex-col justify-between min-h-[220px] shadow-[0_8px_24px_rgba(44,36,33,0.05),0_1px_3px_rgba(44,36,33,0.03)]`}
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className={`font-mono text-2xl font-bold text-[#8C7E78] ${item.accentColor} transition-colors`}>
                    {item.num}
                  </span>
                  <span className={`material-symbols-outlined text-[#8C7E78] ${item.accentColor} transition-colors text-2xl`}>
                    {item.icon}
                  </span>
                </div>
                <h3 className="font-headline text-xl uppercase text-[#2C2421] font-bold mb-2 tracking-wide">
                  {item.title}
                </h3>
                <p className="text-xs sm:text-sm text-[#6B5E59] leading-relaxed">
                  {item.description}
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-[#2C2421]/10 flex items-center justify-between font-mono text-[11px] text-[#6B5E59]">
                <span className="font-semibold uppercase tracking-wider">{item.footerLabel}</span>
                <span className={`${item.statusColor} font-bold`}>{item.footerStatus}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
