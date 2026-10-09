"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: "marcus@apexperformance.com",
    password: "••••••••••••••",
    keepSignedIn: true,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen w-full grid grid-cols-1 lg:grid-cols-2 bg-white text-[#2C2421] font-sans">
      {/* LEFT HALF: Edge-to-Edge Full-Bleed Workshop Photo */}
      <div className="relative hidden lg:block w-full h-full min-h-screen bg-[#2C2421] overflow-hidden">
        <img
          src="/workshop-inspection.jpg"
          alt="Workshop Operations"
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
        {/* Subtle cinematic gradient vignette */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/20 via-transparent to-black/30 pointer-events-none" />
      </div>

      {/* RIGHT HALF: Full-Bleed Clean Form Pane */}
      <div className="w-full min-h-screen flex flex-col justify-between p-6 sm:p-10 lg:p-16 xl:p-20 bg-white overflow-y-auto">
        {/* Top Header Row - Bigger Typography */}
        <div className="flex items-center justify-between w-full pb-6">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-3 h-8 bg-[#E85D22] rounded-xs" />
            <span className="font-headline text-2xl sm:text-3xl font-extrabold uppercase tracking-wider text-[#2C2421]">
              BAYFLOW
            </span>
          </Link>

          <div className="text-sm sm:text-base text-[#6B5E59]">
            <span>Don&apos;t have an account? </span>
            <Link href="/signup" className="text-[#E85D22] font-bold hover:underline ml-1">
              Sign Up
            </Link>
          </div>
        </div>

        {/* Centered Form with Prominent Sizing */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-lg mx-auto my-auto py-6"
        >
          <h1 className="font-headline text-4xl sm:text-5xl uppercase font-black tracking-tight text-[#2C2421] leading-none mb-3">
            Welcome Back
          </h1>
          <p className="text-sm sm:text-base text-[#6B5E59] mb-8 sm:mb-10 leading-relaxed">
            Enter your work email and password to access your workshop dashboard.
          </p>

          {submitted ? (
            <div className="p-8 sm:p-10 text-center bg-[#F8F8F5] rounded-2xl border border-[#1F5C45]/30">
              <div className="w-14 h-14 rounded-full bg-[#1F5C45]/15 text-[#1F5C45] flex items-center justify-center mx-auto mb-4">
                <span className="material-symbols-outlined text-3xl">check</span>
              </div>
              <h3 className="font-headline text-3xl uppercase font-bold text-[#2C2421] mb-2">
                Signed In
              </h3>
              <p className="text-sm sm:text-base text-[#6B5E59] max-w-sm mx-auto mb-6">
                Redirecting to workshop portal or 2-factor authentication...
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <Link
                  href="/verify"
                  className="w-full sm:w-auto bg-[#E85D22] text-white text-xs sm:text-sm uppercase tracking-wider px-6 py-3.5 rounded-xl font-bold hover:bg-[#d04e17] transition-all shadow-sm"
                >
                  Verify 2FA Phone (Step 2) →
                </Link>
                <Link
                  href="/dashboard"
                  className="w-full sm:w-auto bg-[#2C2421] text-white text-xs sm:text-sm uppercase tracking-wider px-6 py-3.5 rounded-xl font-bold hover:bg-[#1a1513] transition-all"
                >
                  Direct to Dashboard
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-6 text-sm">
              {/* Email */}
              <div>
                <label className="block font-bold text-[#2C2421] text-sm sm:text-base mb-2">
                  Email <span className="text-[#E85D22]">*</span>
                </label>
                <input
                  required
                  type="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 sm:px-5 py-3.5 sm:py-4 bg-[#F8F8F5] border border-[#2C2421]/15 rounded-xl text-[#2C2421] text-sm sm:text-base focus:outline-none focus:border-[#E85D22] transition-colors"
                />
              </div>

              {/* Password */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="font-bold text-[#2C2421] text-sm sm:text-base">
                    Password <span className="text-[#E85D22]">*</span>
                  </label>
                  <Link href="/forgot-password" className="text-sm text-[#E85D22] hover:underline font-semibold">
                    Forgot Password?
                  </Link>
                </div>
                <div className="relative">
                  <input
                    required
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full pl-4 sm:pl-5 pr-12 py-3.5 sm:py-4 bg-[#F8F8F5] border border-[#2C2421]/15 rounded-xl text-[#2C2421] text-sm sm:text-base focus:outline-none focus:border-[#E85D22] transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[#8C7E78] hover:text-[#2C2421] p-1"
                  >
                    <span className="material-symbols-outlined text-[22px]">
                      {showPassword ? "visibility_off" : "visibility"}
                    </span>
                  </button>
                </div>
              </div>

              {/* Remember */}
              <div className="flex items-center gap-2.5 pt-1">
                <input
                  type="checkbox"
                  id="keepSignedIn"
                  checked={formData.keepSignedIn}
                  onChange={(e) => setFormData({ ...formData, keepSignedIn: e.target.checked })}
                  className="w-5 h-5 rounded text-[#E85D22] focus:ring-[#E85D22] border-[#2C2421]/30 accent-[#E85D22] cursor-pointer"
                />
                <label htmlFor="keepSignedIn" className="text-sm sm:text-base text-[#6B5E59] cursor-pointer">
                  Remember me
                </label>
              </div>

              {/* Sign In Button */}
              <button
                type="submit"
                className="mt-2 w-full bg-[#2C2421] hover:bg-[#1a1513] text-white text-sm sm:text-base uppercase tracking-wider py-4 sm:py-4.5 rounded-xl font-bold shadow-[0_4px_14px_rgba(44,36,33,0.2)] hover:shadow-[0_8px_25px_rgba(44,36,33,0.3)] transition-all flex items-center justify-center gap-2 group"
              >
                <span>Sign In</span>
                <span className="material-symbols-outlined text-[18px] group-hover:translate-x-1 transition-transform">
                  arrow_forward
                </span>
              </button>

              {/* OR Divider */}
              <div className="relative flex items-center justify-center my-2">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-[#2C2421]/15" />
                </div>
                <span className="relative bg-white px-4 text-xs font-mono uppercase text-[#8C7E78] tracking-widest font-semibold">
                  OR
                </span>
              </div>

              {/* Google & SSO Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <button
                  type="button"
                  className="flex items-center justify-center gap-2.5 py-3.5 sm:py-4 px-4 bg-[#F8F8F5] hover:bg-[#ECE8E5] border border-[#2C2421]/15 rounded-xl text-sm font-semibold text-[#2C2421] transition-all"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                  </svg>
                  <span>Google</span>
                </button>

                <button
                  type="button"
                  className="flex items-center justify-center gap-2.5 py-3.5 sm:py-4 px-4 bg-[#F8F8F5] hover:bg-[#ECE8E5] border border-[#2C2421]/15 rounded-xl text-sm font-semibold text-[#2C2421] transition-all"
                >
                  <span className="material-symbols-outlined text-[20px] text-[#6B5E59]">
                    domain
                  </span>
                  <span>Single Sign-On</span>
                </button>
              </div>
            </form>
          )}
        </motion.div>

        {/* Bottom Helper Note - Bigger Font */}
        <div className="w-full text-center text-sm sm:text-base text-[#6B5E59] pt-6 font-medium">
          Having trouble?{" "}
          <a href="#" className="text-[#2C2421] font-bold underline hover:text-[#E85D22] transition-colors ml-1">
            Contact support
          </a>
        </div>
      </div>
    </div>
  );
}
