"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { CheckCircle2, CircleDot, Clock, ShieldCheck, Wrench, Activity } from "lucide-react";

const workflowSteps = [
  {
    id: 1,
    title: "STAGE 1: DIAGNOSTIC SCAN",
    time: "09:12 AM",
    status: "completed",
    desc: "Full CAN-bus interrogation & freeze frame capture.",
  },
  {
    id: 2,
    title: "STAGE 2: PARTS RECEIVED & ASSIGNED",
    time: "10:45 AM",
    status: "completed",
    desc: "OEM carbon ceramic rotors dispatched to Bay 03.",
  },
  {
    id: 3,
    title: "STAGE 3: ACTIVE INSTALLATION & TEST FIT",
    time: "EST. 11:30 AM",
    status: "active",
    desc: "Torque spec verification and hydraulic bleeding.",
  },
  {
    id: 4,
    title: "CALIBRATION & DYNO RUN",
    time: "PENDING",
    status: "pending",
    desc: "High-speed road load test bench sign-off.",
  },
];

export default function WorkflowSection() {
  return (
    <section className="py-16 sm:py-24 bg-white border-y border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-10 items-center">
          {/* Left Column: Workshop Bay Inspection Visual Card */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-6 relative"
          >
            <div className="relative rounded-xl overflow-hidden border border-gray-300 shadow-xl aspect-[16/10] bg-neutral-900 group">
              <Image
                src="/workshop-inspection.jpg"
                alt="BayFlow Technician Conducting Precision Workshop Inspection"
                fill
                className="object-cover object-center group-hover:scale-105 transition-transform duration-700"
              />

              {/* Bottom Tag Overlay */}
              <div className="absolute bottom-4 left-4 right-4 z-10">
                <div className="bg-neutral-900/90 backdrop-blur-md border border-white/20 text-white rounded-lg p-3 flex items-center gap-3 shadow-lg">
                  <div className="w-8 h-8 rounded bg-[#ff4d15] flex items-center justify-center text-white shrink-0">
                    <Activity className="w-4 h-4 animate-pulse" />
                  </div>
                  <div className="overflow-hidden">
                    <div className="text-[11px] font-mono-tech uppercase text-gray-300 tracking-wider truncate">
                      ACTIVE REPAIR STREAM // BAY 03
                    </div>
                    <div className="text-xs font-mono-tech font-bold text-white tracking-wide truncate">
                      PORSCHE 911 GT3 RS // TELEMETRY SYNC
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Workflow Steps */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="lg:col-span-6 space-y-6"
          >
            <div className="inline-flex items-center gap-1.5 text-xs font-mono-tech uppercase text-emerald-600 font-semibold tracking-wider bg-emerald-50 px-2.5 py-1 rounded border border-emerald-200">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              ZERO-GAP TRACKING
            </div>

            <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 tracking-tight leading-none uppercase">
              FROM ARRIVAL TO READY.
            </h2>

            <p className="text-base text-gray-600 font-normal leading-relaxed">
              Track every action from intake scans to test bench validation. Empower every tech with automated check-sheets on rugged tablets and real-time bay telemetry.
            </p>

            {/* Checklist items */}
            <div className="space-y-3 pt-2">
              {workflowSteps.map((step) => (
                <div
                  key={step.id}
                  className={`p-4 rounded-lg border transition-all duration-200 flex items-center justify-between ${
                    step.status === "active"
                      ? "border-[#ff4d15] bg-[#fffbf9] shadow-sm"
                      : "border-gray-200 bg-gray-50/70 hover:bg-gray-50"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {step.status === "completed" && (
                      <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                    )}
                    {step.status === "active" && (
                      <CircleDot className="w-5 h-5 text-[#ff4d15] animate-pulse shrink-0" />
                    )}
                    {step.status === "pending" && (
                      <Clock className="w-5 h-5 text-gray-400 shrink-0" />
                    )}
                    <div>
                      <span
                        className={`text-xs sm:text-sm font-bold tracking-tight uppercase ${
                          step.status === "active"
                            ? "text-[#ff4d15]"
                            : step.status === "completed"
                            ? "text-gray-900"
                            : "text-gray-600"
                        }`}
                      >
                        {step.title}
                      </span>
                    </div>
                  </div>

                  <span
                    className={`text-[11px] font-mono-tech uppercase font-semibold ${
                      step.status === "active"
                        ? "text-[#ff4d15] bg-[#fff0eb] px-2 py-0.5 rounded border border-[#ff4d15]/30"
                        : step.status === "completed"
                        ? "text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200"
                        : "text-gray-400"
                    }`}
                  >
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
