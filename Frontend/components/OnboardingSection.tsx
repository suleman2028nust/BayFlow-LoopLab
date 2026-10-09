"use client";

import React from "react";
import { motion } from "framer-motion";

const steps = [
  {
    num: "01",
    title: "Connect Your Workshop",
    desc: "Add your bays, technicians, and service types. Import your existing customer list or start fresh. Setup takes under 15 minutes.",
  },
  {
    num: "02",
    title: "Manage Every Job",
    desc: "Book appointments, assign work to technicians, track progress in real time, and update customers automatically.",
  },
  {
    num: "03",
    title: "Let BayFlow Handle the Rest",
    desc: "Automated reminders, inventory alerts, and AI-powered customer replies keep things running even when you're not watching.",
  },
];

export default function OnboardingSection() {
  return (
    <section className="bg-white py-16 sm:py-24 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45 }}
          className="mb-12"
        >
          <p className="text-xs font-semibold uppercase tracking-widest text-gray-500 mb-3">How it works</p>
          <h2 className="font-display text-4xl sm:text-5xl font-bold text-[#1a1a1a] tracking-tight leading-none uppercase">
            Precision Onboarding.
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-gray-200 border border-gray-200">
          {steps.map((step, idx) => (
            <motion.div
              key={step.num}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.1 }}
              className="bg-white p-8 sm:p-10 hover:bg-[#fdf8f6] transition-colors group"
            >
              <div className="w-8 h-8 rounded border border-[#e8572a]/40 text-[#e8572a] text-[12px] font-bold flex items-center justify-center mb-8 group-hover:bg-[#e8572a] group-hover:text-white group-hover:border-[#e8572a] transition-colors">
                {step.num}
              </div>
              <h3 className="text-[17px] font-bold text-[#1a1a1a] mb-3 leading-snug">
                {step.title}
              </h3>
              <p className="text-[14px] text-gray-600 leading-relaxed">
                {step.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
