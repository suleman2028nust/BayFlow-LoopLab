"use client";

import React, { useState } from "react";

export default function DeveloperHandover() {
  const [copiedRole, setCopiedRole] = useState<string | null>(null);

  const copyCredential = (text: string, role: string) => {
    navigator.clipboard.writeText(text);
    setCopiedRole(role);
    setTimeout(() => setCopiedRole(null), 2000);
  };

  const accounts = [
    { role: "Owner", name: "Fatima Raza", email: "owner@bayflow.com", pass: "owner123", access: "Multi-shop & Team Management" },
    { role: "Service Advisor", name: "Bilal SA", email: "sa@bayflow.com", pass: "sa123", access: "Confirm & Send Estimates" },
    { role: "Technician", name: "Imran Tech", email: "tech@bayflow.com", pass: "tech123", access: "Assigned Repairs & Estimate Entry" },
    { role: "Parts Person", name: "Usman Parts", email: "parts@bayflow.com", pass: "parts123", access: "Stock, POs & Parts Allocation" },
    { role: "QC Inspector", name: "Sara QC", email: "qc@bayflow.com", pass: "qc123", access: "Shared QC Queue & Road Test Pass/Fail" },
    { role: "Customer", name: "Ahmed Khan", email: "ahmed@mail.com", pass: "customer123", access: "Track Booking & Accept Estimate" },
  ];

  return (
    <section id="shop-access" className="w-full px-4 sm:px-6 lg:px-8 py-16 bg-[#F4F4F1] border-t border-[#2C2421]/15">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-6 border-b border-[#2C2421]/15 gap-2">
          <div className="flex items-center gap-2 text-[#2C2421] font-bold">
            <span className="material-symbols-outlined text-[#111827]">badge</span>
            <span className="text-base uppercase tracking-wider">SYSTEM ACCOUNTS &amp; ROLE DIRECTORY</span>
          </div>
          <span className="text-xs text-[#2C2421]/60 font-mono">
            Full-Stack API Scoped Accounts • Lahore Auto Care &amp; Karachi Speed Repair
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {accounts.map((acc) => (
            <div
              key={acc.role}
              className="p-4 bg-white rounded-xl border border-[#2C2421]/15 shadow-sm flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-xs uppercase tracking-wider text-[#111827] bg-[#111827]/10 px-2.5 py-0.5 rounded-full border border-[#111827]/20">
                    {acc.role}
                  </span>
                  <button
                    onClick={() => copyCredential(`${acc.email} | ${acc.pass}`, acc.role)}
                    className="text-[11px] text-[#2C2421] hover:text-[#111827] font-semibold px-2 py-0.5 rounded bg-[#F4F4F1] border border-[#2C2421]/15"
                  >
                    {copiedRole === acc.role ? "Copied ✓" : "Copy Login"}
                  </button>
                </div>
                <div className="font-bold text-sm text-[#2C2421]">{acc.name}</div>
                <div className="text-xs text-[#2C2421]/70 font-mono mt-1">
                  Email: <strong className="text-[#2C2421]">{acc.email}</strong>
                </div>
                <div className="text-xs text-[#2C2421]/70 font-mono">
                  Password: <strong className="text-[#2C2421]">{acc.pass}</strong>
                </div>
              </div>

              <div className="mt-3 pt-2 border-t border-[#2C2421]/10 text-[11px] text-[#2C2421]/60 font-medium">
                {acc.access}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
