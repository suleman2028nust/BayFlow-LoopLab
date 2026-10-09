"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { CheckCircle2, Circle, Clock } from "lucide-react";

const steps = [
  { label: "Vehicle checked in", time: "9:12 AM", done: true },
  { label: "Inspection complete", time: "9:45 AM", done: true },
  { label: "Parts ordered & received", time: "11:00 AM", done: true },
  { label: "Repair in progress", time: "11:30 AM", active: true },
  { label: "Quality check", time: "Est. 2:00 PM", done: false },
  { label: "Ready for pickup", time: "Est. 2:30 PM", done: false },
];

export default function WorkflowSection() {
  return (
    <section className="bg-[#f5f4f0] py-16 sm:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left image */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-6 relative"
          >
            <div className="relative rounded-xl overflow-hidden border border-gray-200 shadow-md aspect-[4/3] bg-gray-900">
              <Image
                src="/workshop-inspection.jpg"
                alt="Technician inspecting vehicle in workshop"
                fill
                className="object-cover"
              />
              {/* Bottom tag */}
              <div className="absolute bottom-4 left-4 right-4 z-10">
                <div className="bg-white/95 border border-gray-200 rounded-lg px-4 py-2.5 flex items-center gap-3 shadow-md">
                  <span className="w-2 h-2 rounded-full bg-[#e8572a] animate-pulse shrink-0" />
                  <span className="text-[12px] font-medium text-gray-800">
                    Repair in progress — Bay 3 · Technician Zain R.
                  </span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right — Timeline */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="lg:col-span-6 space-y-6"
          >
            <p className="text-xs font-semibold uppercase tracking-widest text-gray-500">
              Job Timeline
            </p>
            <h2 className="font-display text-4xl sm:text-5xl font-bold text-[#1a1a1a] tracking-tight leading-none uppercase">
              From Arrival to Ready.
            </h2>
            <p className="text-[15px] text-gray-600 leading-relaxed">
              Every step tracked automatically. Technicians update progress from their tablets — customers get notified at each stage without your team lifting a finger.
            </p>

            {/* Timeline steps */}
            <div className="space-y-1 pt-2">
              {steps.map((step, i) => (
                <div
                  key={i}
                  className={`flex items-center justify-between py-3 px-4 rounded-lg transition-colors ${
                    step.active
                      ? "bg-[#fdf0ec] border border-[#f5bfad]"
                      : "hover:bg-gray-100/60"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {step.done ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    ) : step.active ? (
                      <span className="w-4 h-4 rounded-full border-2 border-[#e8572a] flex items-center justify-center shrink-0">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#e8572a]" />
                      </span>
                    ) : (
                      <Circle className="w-4 h-4 text-gray-300 shrink-0" />
                    )}
                    <span className={`text-[13px] font-medium ${step.done ? "text-gray-700" : step.active ? "text-[#e8572a] font-semibold" : "text-gray-400"}`}>
                      {step.label}
                    </span>
                  </div>
                  <span className={`text-[12px] font-medium ${step.active ? "text-[#e8572a]" : step.done ? "text-gray-500" : "text-gray-300"}`}>
                    {step.time}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
