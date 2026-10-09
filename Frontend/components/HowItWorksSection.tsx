"use client";

import React from "react";
import { motion } from "framer-motion";

const steps = [
  {
    num: "01",
    role: "Customer",
    title: "1. Online Booking",
    desc: "Customer selects shop, problem (Oil Change / Check Engine), available time slot, enters plate & vehicle details. Status: PENDING.",
  },
  {
    num: "02",
    role: "Service Advisor & Tech",
    title: "2. Inspection & Estimate",
    desc: "SA assigns tech. Tech physically inspects car, adds required parts and labor estimate, then submits to SA for customer approval.",
  },
  {
    num: "03",
    role: "Customer & Parts Person",
    title: "3. Approval & Parts Allocation",
    desc: "Customer approves estimate in portal. Parts person checks stock, orders missing items, and allocates parts to booking.",
  },
  {
    num: "04",
    role: "QC & Service Advisor",
    title: "4. Quality Check & Pickup",
    desc: "QC inspector road-tests vehicle. Passing moves status to READY_FOR_PICKUP; failing returns job to tech with logged issue.",
  },
];

export default function HowItWorksSection() {
  return (
    <section id="how-it-works" className="w-full px-4 sm:px-6 lg:px-8 py-20 bg-white border-t border-[#2C2421]/15">
      <div className="max-w-7xl mx-auto">
        <div className="max-w-2xl mb-14">
          <div className="text-[#111827] text-xs font-bold uppercase tracking-wider mb-2">
            The Complete Booking Journey
          </div>
          <h2 className="font-headline text-3xl sm:text-5xl font-extrabold text-[#2C2421] tracking-tight leading-tight">
            15-Status State Machine Workflow.
          </h2>
          <p className="mt-3 text-sm sm:text-base text-[#2C2421]/70">
            From initial booking to physical inspection, customer approval, parts allocation, mandatory QC, and completed pick-up.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, idx) => (
            <motion.div
              key={step.num}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="p-6 bg-[#F4F4F1]/60 rounded-2xl border border-[#2C2421]/15 shadow-sm flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="w-10 h-10 rounded-xl bg-white border border-[#2C2421]/15 flex items-center justify-center font-mono font-bold text-[#2C2421] text-sm shadow-sm">
                    {step.num}
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#111827] bg-[#111827]/10 px-2.5 py-1 rounded-full border border-[#111827]/20">
                    {step.role}
                  </span>
                </div>
                <h3 className="font-headline text-lg font-bold text-[#2C2421] mb-2">
                  {step.title}
                </h3>
                <p className="text-xs sm:text-sm text-[#2C2421]/70 leading-relaxed font-normal">
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
