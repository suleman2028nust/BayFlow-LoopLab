"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function SignupPage() {
  const [formData, setFormData] = useState({
    firstName: "Marcus",
    lastName: "Vance",
    email: "name@yourshop.com",
    phone: "+1 (555) 019-2834",
    workshopName: "Apex Motorworks",
    bays: "4-8",
    serviceFocus: "general",
    password: "••••••••••••••••",
    agreeTerms: true,
  });

  const [passwordStrength] = useState(3);
  const [submitted, setSubmitted] = useState(false);

  const bayOptions = [
    { id: "1-3", count: "1-3", label: "bays" },
    { id: "4-8", count: "4-8", label: "bays" },
    { id: "9-15", count: "9-15", label: "bays" },
    { id: "16+", count: "16+", label: "bays" },
  ];

  const serviceOptions = [
    {
      id: "general",
      title: "General repair & maintenance",
      desc: "Diagnostics, brakes, suspension, fluid service",
    },
    {
      id: "european",
      title: "European & Exotic performance",
      desc: "Porsche, BMW, Audi, Ferrari, track builds",
    },
    {
      id: "ev",
      title: "EV & Hybrid service",
      desc: "High-voltage packs, inverters, thermal loops",
    },
    {
      id: "collision",
      title: "Collision & Bodywork",
      desc: "Structural alignment, refinishing, panel work",
    },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen w-full grid grid-cols-1 lg:grid-cols-2 bg-white text-[#2C2421] font-sans">
      {/* LEFT HALF: Full-Bleed Signup Form Pane (Opposite of Login) */}
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
            <span>Already have an account? </span>
            <Link href="/login" className="text-[#E85D22] font-bold hover:underline ml-1">
              Log in
            </Link>
          </div>
        </div>

        {/* Centered Signup Form Content with Prominent Sizing */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-xl mx-auto my-auto py-6"
        >
          <h1 className="font-headline text-4xl sm:text-5xl uppercase font-black tracking-tight text-[#2C2421] leading-none mb-3">
            CREATE YOUR WORKSHOP ACCOUNT
          </h1>
          <p className="text-sm sm:text-base text-[#6B5E59] mb-8 leading-relaxed">
            Set up your bays, add your technicians, and manage your workshop in one place.
          </p>

          {submitted ? (
            <div className="p-8 sm:p-10 text-center bg-[#F8F8F5] rounded-2xl border border-[#1F5C45]/30">
              <div className="w-14 h-14 rounded-full bg-[#1F5C45]/15 text-[#1F5C45] flex items-center justify-center mx-auto mb-4">
                <span className="material-symbols-outlined text-3xl">check</span>
              </div>
              <h3 className="font-headline text-3xl uppercase font-bold text-[#2C2421] mb-2">
                Account Created!
              </h3>
              <p className="text-sm sm:text-base text-[#6B5E59] max-w-md mx-auto mb-6">
                Check your inbox at <strong>{formData.email}</strong> to verify your account and get started.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <Link
                  href="/verify"
                  className="w-full sm:w-auto bg-[#E85D22] text-white text-xs sm:text-sm uppercase tracking-wider px-6 py-3.5 rounded-xl font-bold hover:bg-[#d04e17] transition-all shadow-sm"
                >
                  Verify Phone Number (Step 2) →
                </Link>
                <Link
                  href="/login"
                  className="w-full sm:w-auto bg-[#2C2421] text-white text-xs sm:text-sm uppercase tracking-wider px-6 py-3.5 rounded-xl font-bold hover:bg-[#1a1513] transition-all"
                >
                  Go to Sign In
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-5 text-sm">
              {/* Row 1: Name */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                <div>
                  <label className="block font-bold text-[#2C2421] text-sm sm:text-base mb-2">
                    First name <span className="text-[#E85D22]">*</span>
                  </label>
                  <input
                    required
                    type="text"
                    placeholder="Marcus"
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    className="w-full px-4 sm:px-5 py-3 sm:py-3.5 bg-[#F8F8F5] border border-[#2C2421]/15 rounded-xl text-[#2C2421] text-sm sm:text-base focus:outline-none focus:border-[#E85D22] transition-colors"
                  />
                </div>
                <div>
                  <label className="block font-bold text-[#2C2421] text-sm sm:text-base mb-2">
                    Last name <span className="text-[#E85D22]">*</span>
                  </label>
                  <input
                    required
                    type="text"
                    placeholder="Vance"
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    className="w-full px-4 sm:px-5 py-3 sm:py-3.5 bg-[#F8F8F5] border border-[#2C2421]/15 rounded-xl text-[#2C2421] text-sm sm:text-base focus:outline-none focus:border-[#E85D22] transition-colors"
                  />
                </div>
              </div>

              {/* Row 2: Email & Phone Number */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                <div>
                  <label className="block font-bold text-[#2C2421] text-sm sm:text-base mb-2">
                    Work email <span className="text-[#E85D22]">*</span>
                  </label>
                  <input
                    required
                    type="email"
                    placeholder="name@yourshop.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 sm:px-5 py-3 sm:py-3.5 bg-[#F8F8F5] border border-[#2C2421]/15 rounded-xl text-[#2C2421] text-sm sm:text-base focus:outline-none focus:border-[#E85D22] transition-colors"
                  />
                </div>
                <div>
                  <label className="block font-bold text-[#2C2421] text-sm sm:text-base mb-2">
                    Phone / WhatsApp <span className="text-[#E85D22]">*</span>
                  </label>
                  <input
                    required
                    type="tel"
                    placeholder="+1 (555) 019-2834"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 sm:px-5 py-3 sm:py-3.5 bg-[#F8F8F5] border border-[#2C2421]/15 rounded-xl text-[#2C2421] text-sm sm:text-base focus:outline-none focus:border-[#E85D22] transition-colors"
                  />
                </div>
              </div>

              {/* Row 3: Workshop Name */}
              <div>
                <label className="block font-bold text-[#2C2421] text-sm sm:text-base mb-2">
                  Workshop name <span className="text-[#E85D22]">*</span>
                </label>
                <input
                  required
                  type="text"
                  placeholder="Apex Motorworks"
                  value={formData.workshopName}
                  onChange={(e) => setFormData({ ...formData, workshopName: e.target.value })}
                  className="w-full px-4 sm:px-5 py-3 sm:py-3.5 bg-[#F8F8F5] border border-[#2C2421]/15 rounded-xl text-[#2C2421] text-sm sm:text-base focus:outline-none focus:border-[#E85D22] transition-colors"
                />
              </div>

              {/* Row 4: Bay Count Selector */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="font-bold text-[#2C2421] text-sm sm:text-base">
                    How many service bays do you operate? <span className="text-[#E85D22]">*</span>
                  </label>
                  <span className="text-[#8C7E78] text-xs font-medium">Select one</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {bayOptions.map((option) => {
                    const isSelected = formData.bays === option.id;
                    return (
                      <button
                        key={option.id}
                        type="button"
                        onClick={() => setFormData({ ...formData, bays: option.id })}
                        className={`py-3 px-2 text-center rounded-xl border transition-all ${
                          isSelected
                            ? "border-[#E85D22] bg-[#E85D22]/5 shadow-sm"
                            : "border-[#2C2421]/15 bg-[#F8F8F5] hover:border-[#2C2421]/40"
                        }`}
                      >
                        <div className={`font-headline text-xl sm:text-2xl font-extrabold ${isSelected ? "text-[#E85D22]" : "text-[#2C2421]"}`}>
                          {option.count}
                        </div>
                        <div className={`text-xs font-medium ${isSelected ? "text-[#E85D22]" : "text-[#6B5E59]"}`}>
                          {option.label}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Row 5: Primary Service Focus */}
              <div>
                <label className="block font-bold text-[#2C2421] text-sm sm:text-base mb-2">
                  Primary service focus
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {serviceOptions.map((opt) => {
                    const isSelected = formData.serviceFocus === opt.id;
                    return (
                      <div
                        key={opt.id}
                        onClick={() => setFormData({ ...formData, serviceFocus: opt.id })}
                        className={`p-3.5 sm:p-4 rounded-xl border cursor-pointer transition-all flex items-start gap-3 ${
                          isSelected
                            ? "border-[#E85D22] bg-[#E85D22]/5 shadow-sm"
                            : "border-[#2C2421]/15 bg-[#F8F8F5] hover:border-[#2C2421]/30"
                        }`}
                      >
                        <div className="pt-0.5 shrink-0">
                          <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${isSelected ? "border-[#E85D22]" : "border-[#2C2421]/30"}`}>
                            {isSelected && <div className="w-2 h-2 rounded-full bg-[#E85D22]" />}
                          </div>
                        </div>
                        <div>
                          <div className="font-bold text-[#2C2421] text-sm mb-0.5">
                            {opt.title}
                          </div>
                          <div className="text-xs text-[#6B5E59] leading-snug">
                            {opt.desc}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Row 6: Create Password */}
              <div>
                <label className="block font-bold text-[#2C2421] text-sm sm:text-base mb-2">
                  Create password <span className="text-[#E85D22]">*</span>
                </label>
                <input
                  required
                  type="password"
                  placeholder="••••••••••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full px-4 sm:px-5 py-3 sm:py-3.5 bg-[#F8F8F5] border border-[#2C2421]/15 rounded-xl text-[#2C2421] text-sm sm:text-base focus:outline-none focus:border-[#E85D22] transition-colors"
                />
                {/* Strength Bar */}
                <div className="grid grid-cols-4 gap-2 mt-2.5">
                  {[1, 2, 3, 4].map((seg) => (
                    <div
                      key={seg}
                      className={`h-2 rounded-full ${
                        seg <= passwordStrength ? "bg-[#1F5C45]" : "bg-[#2C2421]/15"
                      }`}
                    />
                  ))}
                </div>
                <div className="flex items-center justify-between text-xs mt-1.5 font-medium">
                  <span className="text-[#1F5C45] font-bold flex items-center gap-1">
                    <span className="text-xs">✔</span> Strong password
                  </span>
                  <span className="text-[#8C7E78]">Must contain letters, numbers &amp; symbols</span>
                </div>
              </div>

              {/* Terms Checkbox */}
              <div className="flex items-start gap-2.5 pt-2">
                <input
                  type="checkbox"
                  id="terms"
                  checked={formData.agreeTerms}
                  onChange={(e) => setFormData({ ...formData, agreeTerms: e.target.checked })}
                  className="mt-0.5 w-5 h-5 rounded text-[#E85D22] focus:ring-[#E85D22] border-[#2C2421]/30 accent-[#E85D22] cursor-pointer"
                />
                <label htmlFor="terms" className="text-xs sm:text-sm text-[#6B5E59] leading-tight cursor-pointer">
                  I agree to the{" "}
                  <a href="#" className="text-[#2C2421] font-bold underline hover:text-[#E85D22]">
                    Terms of Service
                  </a>{" "}
                  and{" "}
                  <a href="#" className="text-[#2C2421] font-bold underline hover:text-[#E85D22]">
                    Privacy Policy
                  </a>
                  .
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="mt-2 w-full bg-[#2C2421] hover:bg-[#1a1513] text-white text-sm sm:text-base uppercase tracking-wider py-4 sm:py-4.5 rounded-xl font-bold shadow-[0_4px_14px_rgba(44,36,33,0.2)] hover:shadow-[0_8px_25px_rgba(44,36,33,0.3)] transition-all flex items-center justify-center gap-2 group"
              >
                <span>Create your workshop account</span>
                <span className="material-symbols-outlined text-[18px] group-hover:translate-x-1 transition-transform">
                  arrow_forward
                </span>
              </button>
            </form>
          )}
        </motion.div>

        {/* Bottom Helper Note - Bigger Font */}
        <div className="w-full text-center text-sm sm:text-base text-[#6B5E59] pt-6 font-medium">
          © 2025 BayFlow Technologies. Modern workshop management software.
        </div>
      </div>

      {/* RIGHT HALF: Edge-to-Edge Full-Bleed Workshop Photo (Opposite Direction of Login) */}
      <div className="relative hidden lg:block w-full h-full min-h-screen bg-[#2C2421] overflow-hidden">
        <img
          src="/workshop-inspection.jpg"
          alt="Workshop Operations"
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
        {/* Subtle cinematic gradient vignette */}
        <div className="absolute inset-0 bg-gradient-to-l from-black/20 via-transparent to-black/30 pointer-events-none" />
      </div>
    </div>
  );
}
