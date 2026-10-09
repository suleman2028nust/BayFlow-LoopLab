"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

interface DemoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function DemoModal({ isOpen, onClose }: DemoModalProps) {
  const router = useRouter();
  const [selectedRole, setSelectedRole] = useState<string>("sa");
  const [isLogged, setIsLogged] = useState(false);

  const roles = [
    { id: "owner", title: "Shop Owner", name: "Fatima Raza", email: "owner@bayflow.com", badge: "Multi-Shop Manager" },
    { id: "sa", title: "Service Advisor", name: "Bilal SA", email: "sa@bayflow.com", badge: "Front Desk & Estimates" },
    { id: "tech", title: "Technician", name: "Imran Mechanic", email: "tech@bayflow.com", badge: "Assigned Repairs" },
    { id: "parts", title: "Parts Person", name: "Usman Parts", email: "parts@bayflow.com", badge: "Inventory & POs" },
    { id: "qc", title: "QC Inspector", name: "Sara QC", email: "qc@bayflow.com", badge: "Mandatory Quality Check" },
    { id: "customer", title: "Customer Portal", name: "Ahmed Khan", email: "ahmed@mail.com", badge: "Bookings & Estimates" },
  ];

  const handleLaunch = () => {
    setIsLogged(true);
    setTimeout(() => {
      setIsLogged(false);
      onClose();
      if (selectedRole === "owner") {
        router.push("/owner");
      } else if (selectedRole === "customer") {
        router.push("/customer");
      } else {
        router.push(`/pos?role=${selectedRole}`);
      }
    }, 800);
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
            className="fixed inset-0 bg-[#2C2421]/40 backdrop-blur-sm transition-opacity"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-[#2C2421]/15 overflow-hidden z-10"
          >
            {/* Header */}
            <div className="p-6 bg-[#F4F4F1] border-b border-[#2C2421]/15 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#111827]/10 text-[#111827] flex items-center justify-center font-bold">
                  <span className="material-symbols-outlined text-lg">person</span>
                </div>
                <div>
                  <h3 className="font-headline text-base font-bold text-[#2C2421]">
                    Sign In &amp; Select Active Role
                  </h3>
                  <span className="text-xs text-[#2C2421]/60">BayFlow Multi-Tenant Auto Repair Platform</span>
                </div>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-white border border-[#2C2421]/15 flex items-center justify-center text-[#2C2421]/60 hover:text-[#2C2421] transition-colors shadow-sm"
              >
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            </div>

            {/* Content */}
            <div className="p-6">
              {isLogged ? (
                <div className="text-center py-8 flex flex-col items-center gap-3">
                  <div className="w-14 h-14 rounded-full bg-[#111827]/10 border border-[#111827]/20 flex items-center justify-center text-[#111827]">
                    <span className="material-symbols-outlined text-3xl">check_circle</span>
                  </div>
                  <h4 className="font-headline text-xl font-bold text-[#2C2421]">
                    Signed In Successfully!
                  </h4>
                  <p className="text-xs text-[#2C2421]/80 max-w-sm">
                    Loaded workspace for <strong className="text-[#2C2421]">{roles.find(r => r.id === selectedRole)?.name}</strong>.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  <p className="text-xs text-[#2C2421]/70 font-medium">
                    Choose a staff role or customer account to launch their scoped workspace:
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {roles.map((r) => (
                      <button
                        key={r.id}
                        onClick={() => setSelectedRole(r.id)}
                        className={`p-3.5 rounded-xl text-left border transition-all flex flex-col justify-between gap-1.5 ${
                          selectedRole === r.id
                            ? "bg-[#111827]/10 border-[#111827] shadow-sm"
                            : "bg-white border-[#2C2421]/15 hover:border-[#2C2421]/30"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-xs text-[#2C2421]">{r.title}</span>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#F4F4F1] text-[#2C2421]/70 border border-[#2C2421]/15">
                            {r.badge}
                          </span>
                        </div>
                        <div className="text-xs text-[#2C2421]/80 font-medium">{r.name}</div>
                        <div className="text-[11px] font-mono text-[#2C2421]/50">{r.email}</div>
                      </button>
                    ))}
                  </div>

                  <div className="pt-3 border-t border-[#2C2421]/10 flex items-center justify-between">
                    <span className="text-xs text-[#2C2421]/60 font-medium">Default password: <code className="bg-[#F4F4F1] px-1 py-0.5 rounded text-[#2C2421]">role123</code></span>
                    <button
                      onClick={handleLaunch}
                      className="px-5 py-2.5 bg-[#111827] hover:bg-[#0F172A] text-white font-bold text-xs rounded-xl shadow transition-all"
                    >
                      Sign In &amp; Launch
                    </button>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
