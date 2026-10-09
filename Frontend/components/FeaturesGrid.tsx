"use client";

import React from "react";
import { motion } from "framer-motion";

const features = [
  {
    num: "01",
    icon: "storefront",
    title: "Multi-Tenant Garages",
    description:
      "Every auto garage operates with its own independent team, inventory, services, and time slots. Owners manage multiple locations from one central login.",
    badge: "TENANT ISOLATED",
  },
  {
    num: "02",
    icon: "badge",
    title: "5-Role POS Workflow",
    description:
      "Strict role guards for Service Advisor, Technician, Parts Person, QC Inspector, and Owner ensure every job step has single-point accountability.",
    badge: "ROLE SECURED",
  },
  {
    num: "03",
    icon: "inventory_2",
    title: "Stock & PO Procurement",
    description:
      "Required parts automatically check live stock. Generate purchase orders, confirm shipment receipt, and reserve inventory per job card.",
    badge: "AUTO INVENTORY",
  },
  {
    num: "04",
    icon: "support_agent",
    title: "Voice & AI Front Desk",
    description:
      "Direct browser-to-browser WebRTC voice calls between SA and customer, plus an automated AI Front Desk for unanswered call summaries & tasks.",
    badge: "INTEGRATED VOICE",
  },
];

export default function FeaturesGrid() {
  return (
    <section id="platform" className="w-full px-4 sm:px-6 lg:px-8 py-20 bg-[#F4F4F1] border-t border-[#2C2421]/15">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 text-[#111827] text-xs font-bold uppercase tracking-wider mb-3">
              <span className="material-symbols-outlined text-base">apps</span>
              <span>Core Platform Features</span>
            </div>
            <h2 className="font-headline text-3xl sm:text-5xl font-extrabold text-[#2C2421] tracking-tight leading-tight">
              Designed For Real Garage Challenges.
            </h2>
          </div>
          <p className="max-w-md text-sm sm:text-base text-[#2C2421]/70 leading-relaxed font-normal">
            BayFlow bridges the communication breakdown between vehicle owners, front desk advisors, repair technicians, and parts suppliers.
          </p>
        </div>

        {/* 4 Claymorphic White Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((item, idx) => (
            <motion.div
              key={item.num}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="p-6 bg-white rounded-2xl border border-[#2C2421]/15 shadow-[0_8px_30px_rgba(44,36,33,0.05)] hover:shadow-[0_12px_40px_rgba(44,36,33,0.1)] hover:border-[#111827]/30 transition-all flex flex-col justify-between min-h-[260px] group"
            >
              <div>
                <div className="flex items-center justify-between mb-5">
                  <div className="w-10 h-10 rounded-xl bg-[#111827]/10 group-hover:bg-[#111827] text-[#111827] group-hover:text-white flex items-center justify-center transition-colors">
                    <span className="material-symbols-outlined text-xl">{item.icon}</span>
                  </div>
                  <span className="font-mono text-xs font-bold text-[#2C2421]/40">{item.num}</span>
                </div>

                <h3 className="font-headline text-lg font-bold text-[#2C2421] mb-2">
                  {item.title}
                </h3>
                <p className="text-xs sm:text-sm text-[#2C2421]/70 leading-relaxed font-normal">
                  {item.description}
                </p>
              </div>

              <div className="pt-4 mt-6 border-t border-[#2C2421]/10 flex items-center justify-between">
                <span className="text-[10px] font-bold tracking-wider text-[#2C2421]/50 uppercase">{item.badge}</span>
                <span className="material-symbols-outlined text-[#2C2421]/40 group-hover:text-[#111827] group-hover:translate-x-1 transition-all text-sm">
                  arrow_forward
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
