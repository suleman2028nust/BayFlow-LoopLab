"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface DemoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function DemoModal({ isOpen, onClose }: DemoModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    workshopName: "",
    bayCount: "4-8",
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setIsSubmitted(true);
    }, 800);
  };

  const handleReset = () => {
    setIsSubmitted(false);
    setFormData({
      name: "",
      email: "",
      phone: "",
      workshopName: "",
      bayCount: "4-8",
    });
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-[#2C2421]/60 backdrop-blur-sm transition-opacity"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative w-full max-w-lg bg-white rounded-xl shadow-[0_20px_60px_rgba(44,36,33,0.25)] border border-[#2C2421]/10 overflow-hidden z-10"
          >
            {/* Header */}
            <div className="p-6 bg-[#F4F4F1] border-b border-[#2C2421]/10 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#E85D22] animate-pulse" />
                <h3 className="font-headline text-lg uppercase tracking-wider text-[#2C2421] font-bold">
                  Schedule Workshop Demo
                </h3>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-white border border-[#2C2421]/10 flex items-center justify-center text-[#6B5E59] hover:text-[#2C2421] transition-colors"
              >
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            </div>

            {/* Content */}
            <div className="p-6">
              {isSubmitted ? (
                <div className="text-center py-8 flex flex-col items-center gap-4">
                  <div className="w-14 h-14 rounded-full bg-[#1F5C45]/10 border border-[#1F5C45]/30 flex items-center justify-center text-[#1F5C45]">
                    <span className="material-symbols-outlined text-3xl">check_circle</span>
                  </div>
                  <h4 className="font-headline text-2xl uppercase text-[#2C2421] font-bold">
                    Demo Reserved Successfully
                  </h4>
                  <p className="text-xs sm:text-sm text-[#6B5E59] max-w-sm">
                    Our technical deployment team will connect with you within 2 business hours to configure
                    your workshop telemetry preview.
                  </p>
                  <button
                    onClick={handleReset}
                    className="mt-4 bg-[#2C2421] hover:bg-[#1a1513] text-white text-xs uppercase tracking-widest px-6 py-2.5 rounded font-bold transition-all shadow"
                  >
                    Done
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-[#6B5E59] mb-1 font-semibold">
                      Your Full Name
                    </label>
                    <input
                      required
                      type="text"
                      placeholder="Marcus Vance"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-[#F8F8F5] border border-[#2C2421]/15 rounded text-[#2C2421] placeholder-[#8C7E78] focus:outline-none focus:border-[#E85D22] transition-colors"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-mono uppercase tracking-wider text-[#6B5E59] mb-1 font-semibold">
                        Work Email
                      </label>
                      <input
                        required
                        type="email"
                        placeholder="marcus@vancemotors.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-[#F8F8F5] border border-[#2C2421]/15 rounded text-[#2C2421] placeholder-[#8C7E78] focus:outline-none focus:border-[#E85D22] transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-mono uppercase tracking-wider text-[#6B5E59] mb-1 font-semibold">
                        Phone / WhatsApp
                      </label>
                      <input
                        required
                        type="tel"
                        placeholder="+1 (555) 019-2834"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-[#F8F8F5] border border-[#2C2421]/15 rounded text-[#2C2421] placeholder-[#8C7E78] focus:outline-none focus:border-[#E85D22] transition-colors"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-mono uppercase tracking-wider text-[#6B5E59] mb-1 font-semibold">
                        Workshop / Dealership Name
                      </label>
                      <input
                        required
                        type="text"
                        placeholder="Apex Performance Studio"
                        value={formData.workshopName}
                        onChange={(e) => setFormData({ ...formData, workshopName: e.target.value })}
                        className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-[#F8F8F5] border border-[#2C2421]/15 rounded text-[#2C2421] placeholder-[#8C7E78] focus:outline-none focus:border-[#E85D22] transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-mono uppercase tracking-wider text-[#6B5E59] mb-1 font-semibold">
                        Active Service Bays
                      </label>
                      <select
                        value={formData.bayCount}
                        onChange={(e) => setFormData({ ...formData, bayCount: e.target.value })}
                        className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-[#F8F8F5] border border-[#2C2421]/15 rounded text-[#2C2421] focus:outline-none focus:border-[#E85D22] transition-colors"
                      >
                        <option value="1-3">1 - 3 Bays</option>
                        <option value="4-8">4 - 8 Bays</option>
                        <option value="9-16">9 - 16 Bays</option>
                        <option value="16+">16+ Enterprise Bays</option>
                      </select>
                    </div>
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full bg-[#2C2421] hover:bg-[#1a1513] text-white text-xs uppercase tracking-widest py-3.5 rounded font-bold transition-all shadow-[0_4px_14px_rgba(44,36,33,0.25)] flex items-center justify-center gap-2"
                    >
                      {isLoading ? (
                        <span>Initializing Deck...</span>
                      ) : (
                        <>
                          <span>Deploy Workshop Preview</span>
                          <span className="material-symbols-outlined text-sm">arrow_forward</span>
                        </>
                      )}
                    </button>
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
