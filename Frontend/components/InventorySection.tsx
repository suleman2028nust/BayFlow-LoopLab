"use client";

import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, Package, AlertTriangle, CheckCircle } from "lucide-react";

interface InventorySectionProps {
  onOpenDemo?: () => void;
}

const parts = [
  {
    name: "Engine Oil Filter — Bosch F 026 407 123",
    sku: "BOF-407123",
    stock: 18,
    reorder: 5,
    status: "In Stock",
    statusClass: "text-emerald-700 bg-emerald-50 border-emerald-200",
  },
  {
    name: "Front Brake Pads — Brembo P83073",
    sku: "BRE-P83073",
    stock: 3,
    reorder: 6,
    status: "Low Stock",
    statusClass: "text-amber-700 bg-amber-50 border-amber-200",
  },
  {
    name: "Air Filter — Mann-Filter C 25 114",
    sku: "MAN-C25114",
    stock: 0,
    reorder: 4,
    status: "Out of Stock",
    statusClass: "text-red-700 bg-red-50 border-red-200",
  },
  {
    name: "Cabin Filter — Mahle LA 280",
    sku: "MAH-LA280",
    stock: 11,
    reorder: 4,
    status: "In Stock",
    statusClass: "text-emerald-700 bg-emerald-50 border-emerald-200",
  },
];

export default function InventorySection({ onOpenDemo }: InventorySectionProps) {
  return (
    <section className="bg-white py-16 sm:py-24 border-y border-gray-200">
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
            <p className="text-xs font-semibold uppercase tracking-widest text-gray-500">Parts & Inventory</p>
            <h2 className="font-display text-4xl sm:text-5xl font-bold text-[#1a1a1a] tracking-tight leading-none uppercase">
              Never Lose Track.
            </h2>
            <p className="text-[15px] text-gray-600 leading-relaxed">
              Monitor every part across your workshop. Get low-stock alerts automatically and keep jobs moving without scrambling for supplies.
            </p>
            <div className="flex flex-wrap gap-3 pt-2">
              <button
                onClick={onOpenDemo}
                className="bg-[#e8572a] hover:bg-[#d14e24] text-white text-[13px] font-semibold px-5 py-2.5 rounded-md flex items-center gap-2 transition-colors"
              >
                Manage inventory
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={onOpenDemo}
                className="bg-white border border-gray-300 hover:border-gray-400 text-gray-700 text-[13px] font-semibold px-5 py-2.5 rounded-md transition-colors"
              >
                View all parts
              </button>
            </div>
          </motion.div>

          {/* Right — Inventory table */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="lg:col-span-8"
          >
            <div className="border border-gray-200 rounded-xl overflow-hidden shadow-sm bg-white">
              <div className="bg-gray-50 border-b border-gray-200 px-5 py-3 flex items-center justify-between">
                <span className="text-[13px] font-semibold text-gray-900">Parts Inventory</span>
                <span className="text-[12px] text-gray-500">{parts.length} items</span>
              </div>
              <div className="divide-y divide-gray-100">
                {parts.map((part, i) => (
                  <div key={i} className="px-5 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-gray-50/60 transition-colors">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-[13px] font-medium text-gray-900">{part.name}</span>
                        <span className={`text-[11px] font-medium px-2 py-0.5 rounded border ${part.statusClass}`}>
                          {part.status}
                        </span>
                      </div>
                      <div className="text-[12px] text-gray-500 mt-0.5 font-mono">
                        SKU: {part.sku} · Reorder at {part.reorder}
                      </div>
                    </div>
                    <div className="text-left sm:text-right shrink-0">
                      <div className="text-[11px] text-gray-400 uppercase tracking-wide">In Stock</div>
                      <div className={`text-[15px] font-bold ${part.stock === 0 ? "text-red-600" : part.stock <= part.reorder ? "text-amber-600" : "text-gray-900"}`}>
                        {part.stock} units
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
