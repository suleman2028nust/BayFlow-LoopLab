"use client";

import React from "react";
import { motion } from "framer-motion";

const jobs = [
  {
    id: "JB-0041",
    vehicle: "2022 BMW M4 Competition",
    plate: "LHR-4421",
    service: "Full Service + Alignment",
    tech: "Usman K.",
    bay: "Bay 1",
    status: "In Progress",
    statusColor: "text-[#e8572a] bg-[#fdf0ec] border-[#f5bfad]",
    progress: 62,
    progressColor: "bg-[#e8572a]",
    eta: "2h 10m",
  },
  {
    id: "JB-0042",
    vehicle: "2021 Toyota Camry",
    plate: "ISB-8812",
    service: "Oil Change + Brake Pads",
    tech: "Bilal A.",
    bay: "Bay 2",
    status: "Waiting on Parts",
    statusColor: "text-amber-700 bg-amber-50 border-amber-200",
    progress: 35,
    progressColor: "bg-amber-400",
    eta: "4h 30m",
  },
  {
    id: "JB-0043",
    vehicle: "2020 Honda Civic",
    plate: "KHI-3301",
    service: "Transmission Flush",
    tech: "Zain R.",
    bay: "Bay 3",
    status: "Ready for Pickup",
    statusColor: "text-emerald-700 bg-emerald-50 border-emerald-200",
    progress: 100,
    progressColor: "bg-emerald-500",
    eta: "Done",
  },
];

export default function CapacitySection() {
  return (
    <section id="platform" className="bg-white py-16 sm:py-24 border-y border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left text */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-4 space-y-5"
          >
            <p className="text-xs font-semibold uppercase tracking-widest text-gray-500">
              Workshop Floor
            </p>
            <h2 className="font-display text-4xl sm:text-5xl font-bold text-[#1a1a1a] tracking-tight leading-none uppercase">
              Every Slot. Under Control.
            </h2>
            <p className="text-[15px] text-gray-600 leading-relaxed">
              Know exactly what's happening in every bay at any given moment. Assign jobs, track progress, and see ETAs — all from one screen.
            </p>

            {/* Two stats */}
            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="border border-gray-200 rounded-lg p-4 bg-[#fafafa]">
                <div className="text-2xl font-bold text-[#1a1a1a] font-display">99.1%</div>
                <div className="text-[11px] text-gray-500 uppercase tracking-wide mt-1 font-medium">Bay Utilisation</div>
              </div>
              <div className="border border-gray-200 rounded-lg p-4 bg-[#fafafa]">
                <div className="text-2xl font-bold text-[#1a1a1a] font-display">0 idle</div>
                <div className="text-[11px] text-gray-500 uppercase tracking-wide mt-1 font-medium">Unplanned Gaps</div>
              </div>
            </div>
          </motion.div>

          {/* Right — Job board */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="lg:col-span-8"
          >
            <div className="border border-gray-200 rounded-xl overflow-hidden bg-white shadow-sm">
              {/* Board header */}
              <div className="bg-gray-50 border-b border-gray-200 px-5 py-3 flex items-center justify-between">
                <span className="text-[13px] font-semibold text-gray-900">Live Job Board</span>
                <span className="flex items-center gap-1.5 text-[12px] text-emerald-600 font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Live
                </span>
              </div>

              {/* Job rows */}
              <div className="divide-y divide-gray-100">
                {jobs.map((job) => (
                  <div key={job.id} className="p-4 sm:p-5 hover:bg-gray-50/60 transition-colors">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex items-start gap-3">
                        <div className="mt-0.5">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-[13px] font-semibold text-gray-900">{job.vehicle}</span>
                            <span className={`text-[11px] font-medium px-2 py-0.5 rounded border ${job.statusColor}`}>
                              {job.status}
                            </span>
                          </div>
                          <div className="text-[12px] text-gray-500 mt-1">
                            {job.service} · {job.bay} · {job.tech} · <span className="font-mono">{job.plate}</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-left sm:text-right shrink-0">
                        <div className="text-[11px] text-gray-400 uppercase tracking-wide">ETA</div>
                        <div className="text-[13px] font-semibold text-gray-800">{job.eta}</div>
                      </div>
                    </div>
                    {/* Progress */}
                    <div className="mt-3 w-full bg-gray-100 rounded-full h-1">
                      <div
                        className={`${job.progressColor} h-1 rounded-full transition-all`}
                        style={{ width: `${job.progress}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
