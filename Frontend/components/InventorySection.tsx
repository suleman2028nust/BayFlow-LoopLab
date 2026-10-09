"use client";

import React from "react";
import { motion } from "framer-motion";
import { Package, ArrowRight, ExternalLink, AlertTriangle, CheckCircle, RefreshCw } from "lucide-react";

interface InventorySectionProps {
  onOpenDemo?: () => void;
}

const inventoryItems = [
  {
    name: "AP Performance Brake Discs 380mm (Front)",
    oem: "OEM: AP RACING // AP4-9912 // BAY 02",
    badge: null,
    stock: "8 Sets in stock",
    stockClass: "text-emerald-600 font-bold",
    subtext: "Active Sync",
  },
  {
    name: "BBS FI-R 20\"/21\" Wheel Set (Satin Black)",
    oem: "OEM: BBS GERMANY // BBS-991-FI",
    badge: "ON BACKORDER",
    stock: "1/2 Packets (14-Day)",
    stockClass: "text-[#ff4d15] font-bold",
    subtext: "PO Created, Dispatch Est.",
  },
  {
    name: "Full Inconel Exhaust System for 992 GT3",
    oem: "OEM: AKRAPOVIČ // S-PO/TI/15 // BAY 03",
    badge: null,
    stock: "1/2 Units",
    stockClass: "text-emerald-600 font-bold",
    subtext: "1 reserved for Bay 03",
  },
];

export default function InventorySection({ onOpenDemo }: InventorySectionProps) {
  return (
    <section className="py-16 sm:py-24 bg-[#fbfbfb]">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Text & Buttons */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-5 space-y-6"
          >
            <div className="inline-flex items-center gap-1.5 text-xs font-mono-tech uppercase text-[#ff4d15] font-semibold tracking-wider">
              <span className="w-1.5 h-1.5 rounded-full bg-[#ff4d15]" />
              CONNECTED OEM / PARTS LOGISTICS
            </div>

            <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 tracking-tight leading-none uppercase">
              NEVER LOSE TRACK.
            </h2>

            <p className="text-base text-gray-600 font-normal leading-relaxed">
              Zero-friction sourcing of parts. Real-time stock routing, automated parts receipts, and direct PO purchasing sync with OEM suppliers.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={onOpenDemo}
                className="bg-[#ff4d15] hover:bg-[#e03e0a] text-white text-xs font-semibold uppercase tracking-wider px-5 py-3 rounded shadow-sm hover:shadow-md transition-all flex items-center gap-2 active:scale-95"
              >
                <span>TRIGGER PARTS MATRIX</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={onOpenDemo}
                className="bg-white hover:bg-gray-50 text-gray-800 border border-gray-300 text-xs font-semibold uppercase tracking-wider px-5 py-3 rounded shadow-sm hover:border-gray-400 transition-all flex items-center gap-2 active:scale-95"
              >
                <span>AUTO-DISPATCH LOGS</span>
              </button>
            </div>
          </motion.div>

          {/* Right Column: Inventory Table */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="lg:col-span-7"
          >
            <div className="bg-white border border-gray-300 rounded-xl shadow-xl overflow-hidden">
              {/* Header */}
              <div className="border-b border-gray-200 bg-gray-50 px-5 py-3.5 flex items-center justify-between text-xs font-mono-tech text-gray-600">
                <div className="font-bold text-gray-900">SUPPLIER INVENTORY DISPATCH</div>
                <div className="text-gray-500">12 FORECASTED SUPPLIERS</div>
              </div>

              {/* Rows */}
              <div className="divide-y divide-gray-100">
                {inventoryItems.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-4 sm:p-5 hover:bg-gray-50/80 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-gray-900 text-sm">
                          {item.name}
                        </span>
                        {item.badge && (
                          <span className="bg-[#fff0eb] text-[#ff4d15] border border-[#ff4d15]/30 text-[10px] font-mono-tech font-semibold px-2 py-0.5 rounded uppercase">
                            {item.badge}
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-gray-500 font-mono-tech mt-1">
                        {item.oem}
                      </div>
                    </div>

                    <div className="text-left sm:text-right">
                      <div className={`text-xs font-mono-tech ${item.stockClass}`}>
                        {item.stock}
                      </div>
                      <div className="text-[11px] font-mono-tech text-gray-400 mt-0.5">
                        {item.subtext}
                      </div>
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
