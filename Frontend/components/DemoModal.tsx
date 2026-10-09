"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, CheckCircle2, ShieldCheck, ArrowRight, Sparkles } from "lucide-react";

interface DemoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function DemoModal({ isOpen, onClose }: DemoModalProps) {
  const [submitted, setSubmitted] = useState(false);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [bays, setBays] = useState("4-10");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onClose();
    }, 2800);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/60 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ duration: 0.25 }}
            className="w-full max-w-lg bg-white border border-gray-300 rounded-2xl shadow-2xl overflow-hidden relative"
          >
            {/* Header */}
            <div className="bg-[#fcfcfc] border-b border-gray-200 p-5 sm:p-6 flex items-center justify-between">
              <div>
                <div className="text-[11px] font-mono-tech uppercase text-[#ff4d15] font-semibold tracking-wider">
                  BAYFLOW WORKSHOP INTELLIGENCE
                </div>
                <h3 className="font-display text-2xl font-bold text-gray-900 mt-0.5">
                  SCHEDULE LIVE WORKSHOP DEMO
                </h3>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 hover:text-gray-900 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6">
              {submitted ? (
                <div className="py-10 text-center space-y-3">
                  <div className="w-14 h-14 bg-emerald-50 border border-emerald-200 text-emerald-600 rounded-full mx-auto flex items-center justify-center">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h4 className="font-display text-2xl font-bold text-gray-900">
                    ACCESS CODE DISPATCHED
                  </h4>
                  <p className="text-sm text-gray-600 max-w-xs mx-auto">
                    We've provisioned a sandbox staging bay for <span className="font-semibold text-gray-900">{email}</span>. A solutions specialist will connect shortly.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-mono-tech uppercase font-bold text-gray-700 mb-1.5">
                      Your Full Name
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Frank Reynolds"
                      className="w-full text-sm font-sans bg-gray-50 border border-gray-300 rounded-lg px-3.5 py-2.5 text-gray-900 focus:outline-none focus:border-[#ff4d15] focus:bg-white transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono-tech uppercase font-bold text-gray-700 mb-1.5">
                      Work Email
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="frank@apexmotorsports.com"
                      className="w-full text-sm font-sans bg-gray-50 border border-gray-300 rounded-lg px-3.5 py-2.5 text-gray-900 focus:outline-none focus:border-[#ff4d15] focus:bg-white transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono-tech uppercase font-bold text-gray-700 mb-1.5">
                      Active Service Bays
                    </label>
                    <select
                      value={bays}
                      onChange={(e) => setBays(e.target.value)}
                      className="w-full text-sm font-sans bg-gray-50 border border-gray-300 rounded-lg px-3.5 py-2.5 text-gray-900 focus:outline-none focus:border-[#ff4d15] focus:bg-white transition-colors"
                    >
                      <option value="1-3">1 - 3 Bays (Boutique / Specialist)</option>
                      <option value="4-10">4 - 10 Bays (High-Performance Facility)</option>
                      <option value="10+">10+ Bays (Multi-Location / Enterprise)</option>
                    </select>
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      className="w-full bg-[#ff4d15] hover:bg-[#e03e0a] text-white text-xs font-semibold uppercase tracking-wider py-3.5 rounded-lg shadow-sm hover:shadow-lg transition-all flex items-center justify-center gap-2 active:scale-95"
                    >
                      <span>INITIALIZE DEMO INSTANCE</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="flex items-center justify-center gap-2 text-[11px] font-mono-tech text-gray-500 pt-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                    <span>Instant sandbox access • Zero credit card required</span>
                  </div>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
