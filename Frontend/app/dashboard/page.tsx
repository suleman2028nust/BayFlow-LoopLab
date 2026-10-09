"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

interface DecodedToken {
  userId?: string;
  role?: string;
  shopId?: string | null;
  email?: string;
  exp?: number;
  iat?: number;
}

export default function DashboardPage() {
  const router = useRouter();
  const [tokenData, setTokenData] = useState<DecodedToken | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const token = localStorage.getItem("bayflow_token");
      if (!token) {
        setTokenData(null);
        setLoading(false);
        return;
      }

      // Safe base64url decoding
      const base64Url = token.split(".")[1];
      if (base64Url) {
        const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
        const jsonPayload = decodeURIComponent(
          atob(base64)
            .split("")
            .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
            .join("")
        );
        const parsed = JSON.parse(jsonPayload);
        setTokenData(parsed);
      }
    } catch (err) {
      console.error("Failed to decode token:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleSignOut = () => {
    localStorage.removeItem("bayflow_token");
    localStorage.removeItem("bayflow_user_role");
    router.push("/login");
  };

  const userRole = tokenData?.role || "GUEST";

  // Role Badge Styling Config
  const getRoleTheme = (role: string) => {
    switch (role) {
      case "OWNER":
        return {
          label: "Shop Owner & Administrator",
          pillBg: "bg-[#111827]",
          pillText: "text-white",
          borderColor: "border-[#111827]/20",
          icon: "admin_panel_settings",
          desc: "Full administrative access across bays, finances, inventory, and staff rosters.",
        };
      case "CUSTOMER":
        return {
          label: "Verified Vehicle Owner",
          pillBg: "bg-[#1F5C45]",
          pillText: "text-white",
          borderColor: "border-[#1F5C45]/20",
          icon: "directions_car",
          desc: "Vehicle service history, active tracking, and live technician communication.",
        };
      case "SERVICE_ADVISOR":
        return {
          label: "Service Advisor",
          pillBg: "bg-[#0284C7]",
          pillText: "text-white",
          borderColor: "border-[#0284C7]/20",
          icon: "support_agent",
          desc: "Estimates, customer work authorizations, intake scheduling, and billing.",
        };
      case "TECHNICIAN":
        return {
          label: "Master Service Technician",
          pillBg: "bg-[#D97706]",
          pillText: "text-white",
          borderColor: "border-[#D97706]/20",
          icon: "precision_manufacturing",
          desc: "Active bay job assignment, inspection checklists, and parts requests.",
        };
      case "PARTS_PERSON":
        return {
          label: "Parts Specialist",
          pillBg: "bg-[#7C3AED]",
          pillText: "text-white",
          borderColor: "border-[#7C3AED]/20",
          icon: "inventory_2",
          desc: "Purchase orders, inventory allocations, supplier lead times, and dispatch.",
        };
      case "QC_INSPECTOR":
        return {
          label: "Quality Control Inspector",
          pillBg: "bg-[#059669]",
          pillText: "text-white",
          borderColor: "border-[#059669]/20",
          icon: "verified",
          desc: "Final multi-point pass/fail inspections, road test sign-off, and handoff.",
        };
      default:
        return {
          label: "Authenticated User",
          pillBg: "bg-[#374151]",
          pillText: "text-white",
          borderColor: "border-[#374151]/20",
          icon: "badge",
          desc: "Standard authenticated BayFlow workspace session.",
        };
    }
  };

  const theme = getRoleTheme(userRole);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F4F4F1] flex items-center justify-center p-6">
        <div className="flex items-center gap-3 text-sm font-bold text-[#2C2421]">
          <span className="animate-spin material-symbols-outlined">progress_activity</span>
          <span>Loading authenticated session...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F4F4F1] text-[#2C2421] font-sans selection:bg-[#111827] selection:text-white flex flex-col justify-between">
      {/* Top Navbar */}
      <header className="w-full bg-white border-b border-[#2C2421]/10 px-6 sm:px-12 py-4 flex items-center justify-between sticky top-0 z-20 shadow-xs">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-9 h-9 rounded-full bg-[#111827] text-white flex items-center justify-center font-bold shadow-md shadow-[#111827]/20 group-hover:scale-105 transition-transform">
            <span className="material-symbols-outlined text-lg">build_circle</span>
          </div>
          <span className="font-headline text-xl font-extrabold tracking-tight text-[#2C2421]">
            BAYFLOW
          </span>
        </Link>

        <div className="flex items-center gap-4">
          <button
            onClick={handleSignOut}
            className="flex items-center gap-2 px-4 py-2 rounded-full border border-[#2C2421]/20 hover:bg-[#F4F4F1] text-xs sm:text-sm font-bold text-[#2C2421] transition-all cursor-pointer"
          >
            <span className="material-symbols-outlined text-base">logout</span>
            <span>Sign Out</span>
          </button>
        </div>
      </header>

      {/* Main Role Display Hero */}
      <main className="flex-1 flex items-center justify-center p-6 sm:p-10">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="w-full max-w-3xl bg-white rounded-[32px] p-8 sm:p-12 shadow-[0_20px_60px_rgba(44,36,33,0.08)] border border-[#2C2421]/15 relative overflow-hidden"
        >
          {/* Subtle Top Gradient Accent Bar */}
          <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-[#111827] via-[#374151] to-[#111827]" />

          {/* Role Header Badge */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#2C2421]/10">
            <div>
              <div className="text-xs font-mono font-bold uppercase tracking-widest text-[#2C2421]/50 mb-1">
                AUTHENTICATED ROLE
              </div>
              <h1 className="font-headline text-3xl sm:text-4xl font-extrabold text-[#2C2421] tracking-tight">
                {userRole}
              </h1>
            </div>

            <div
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs sm:text-sm font-bold ${theme.pillBg} ${theme.pillText} shadow-md`}
            >
              <span className="material-symbols-outlined text-base">{theme.icon}</span>
              <span>{theme.label}</span>
            </div>
          </div>

          {/* Decoded Session Metadata */}
          <div className="py-6 space-y-4">
            <p className="text-xs sm:text-sm text-[#2C2421]/70 leading-relaxed">
              {theme.desc}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
              <div className="bg-[#F8F8F5] p-4 rounded-2xl border border-[#2C2421]/10">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#2C2421]/50 block mb-1">
                  User ID
                </span>
                <span className="font-mono text-xs sm:text-sm font-bold text-[#2C2421] break-all">
                  {tokenData?.userId || "Session active"}
                </span>
              </div>

              <div className="bg-[#F8F8F5] p-4 rounded-2xl border border-[#2C2421]/10">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#2C2421]/50 block mb-1">
                  Shop ID
                </span>
                <span className="font-mono text-xs sm:text-sm font-bold text-[#2C2421] break-all">
                  {tokenData?.shopId || "Independent / Customer"}
                </span>
              </div>
            </div>
          </div>

          {/* Quick Portal Switcher Cards */}
          <div className="pt-6 border-t border-[#2C2421]/10">
            <div className="text-xs font-bold text-[#2C2421]/60 uppercase tracking-wider mb-3">
              Available Portals
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <Link
                href="/owner"
                className="p-4 rounded-2xl bg-[#F8F8F5] hover:bg-[#111827] text-[#2C2421] hover:text-white border border-[#2C2421]/10 transition-all flex flex-col justify-between group shadow-xs cursor-pointer"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="material-symbols-outlined text-xl text-[#111827] group-hover:text-white">
                    admin_panel_settings
                  </span>
                  <span className="material-symbols-outlined text-sm text-[#2C2421]/40 group-hover:text-white/70 group-hover:translate-x-0.5 transition-transform">
                    arrow_forward
                  </span>
                </div>
                <div className="font-bold text-xs sm:text-sm">Owner Portal</div>
                <div className="text-[10px] text-[#2C2421]/50 group-hover:text-white/70">
                  Manage bays &amp; metrics
                </div>
              </Link>

              <Link
                href="/pos"
                className="p-4 rounded-2xl bg-[#F8F8F5] hover:bg-[#111827] text-[#2C2421] hover:text-white border border-[#2C2421]/10 transition-all flex flex-col justify-between group shadow-xs cursor-pointer"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="material-symbols-outlined text-xl text-[#111827] group-hover:text-white">
                    point_of_sale
                  </span>
                  <span className="material-symbols-outlined text-sm text-[#2C2421]/40 group-hover:text-white/70 group-hover:translate-x-0.5 transition-transform">
                    arrow_forward
                  </span>
                </div>
                <div className="font-bold text-xs sm:text-sm">Shop POS &amp; Floor</div>
                <div className="text-[10px] text-[#2C2421]/50 group-hover:text-white/70">
                  Advisor &amp; Tech console
                </div>
              </Link>

              <Link
                href="/customer"
                className="p-4 rounded-2xl bg-[#F8F8F5] hover:bg-[#111827] text-[#2C2421] hover:text-white border border-[#2C2421]/10 transition-all flex flex-col justify-between group shadow-xs cursor-pointer"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="material-symbols-outlined text-xl text-[#111827] group-hover:text-white">
                    directions_car
                  </span>
                  <span className="material-symbols-outlined text-sm text-[#2C2421]/40 group-hover:text-white/70 group-hover:translate-x-0.5 transition-transform">
                    arrow_forward
                  </span>
                </div>
                <div className="font-bold text-xs sm:text-sm">Customer Portal</div>
                <div className="text-[10px] text-[#2C2421]/50 group-hover:text-white/70">
                  Track vehicle &amp; bookings
                </div>
              </Link>
            </div>
          </div>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="w-full py-4 text-center text-xs text-[#2C2421]/50 border-t border-[#2C2421]/10">
        © 2026 BayFlow Auto Repair Inc. • Secure Session
      </footer>
    </div>
  );
}
