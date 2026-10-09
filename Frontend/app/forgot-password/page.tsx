"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("m.rossi@apexperformance.com");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 600);
  };

  return (
    <div className="min-h-screen w-full flex flex-col justify-between text-[#2C2421] relative overflow-x-hidden font-sans selection:bg-[#E85D22] selection:text-white">
      {/* Workshop Photographic Background with Cinematic Overlay */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <img
          src="/workshop-bg.jpg"
          alt="Workshop Background"
          className="w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-black/45 backdrop-blur-[2px]" />
      </div>

      {/* TOP HEADER */}
      <header className="relative z-10 w-full bg-white/90 backdrop-blur-md border-b border-[#2C2421]/10 px-4 sm:px-8 py-3.5 flex items-center justify-between shadow-xs">
        {/* Left: Brand / Section */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-8 h-8 rounded-lg bg-[#2C2421] flex items-center justify-center text-white shadow-sm group-hover:bg-[#1a1513] transition-colors">
            {/* Precision Mechanical / Robot Arm Icon */}
            <svg
              className="w-4 h-4 text-white"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="19" r="2" />
              <path d="M12 17V11" />
              <path d="m9 11 3-5 3 5" />
              <circle cx="12" cy="5" r="2" />
            </svg>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="font-headline text-xl sm:text-2xl font-black uppercase tracking-wider text-[#2C2421]">
              BAYFLOW
            </span>
            <span className="text-[#8C7E78] text-sm font-normal">/</span>
            <span className="text-xs sm:text-sm font-medium text-[#6B5E59] tracking-tight">
              Workshop Intelligence
            </span>
          </div>
        </Link>

        {/* Right: Back Link */}
        <div className="flex items-center gap-3 sm:gap-6">
          <Link
            href="/login"
            className="flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#2C2421] hover:text-[#E85D22] transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">arrow_back</span>
            <span>Back to sign in</span>
          </Link>
        </div>
      </header>

      {/* MAIN CONTAINER */}
      <main className="relative z-10 flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-10 my-auto py-10">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          className="w-full max-w-[480px] bg-white/95 backdrop-blur-xl rounded-2xl sm:rounded-3xl border border-white/40 shadow-[0_20px_50px_rgba(0,0,0,0.35)] p-6 sm:p-10 flex flex-col items-center text-center"
        >
          {/* Heading & Subtitle */}
          <h1 className="font-headline text-3xl sm:text-4xl font-extrabold uppercase tracking-tight text-[#2C2421] mb-3 leading-tight">
            Reset your password
          </h1>
          <p className="text-xs sm:text-sm text-[#6B5E59] leading-relaxed max-w-sm mb-8">
            Enter the email address associated with your BayFlow account and we will send you a link to reset your password.
          </p>

          {/* FORM */}
          {submitted ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              className="w-full bg-[#F8F8F5] border border-[#1F5C45]/30 rounded-2xl p-6 text-center"
            >
              <div className="w-12 h-12 rounded-full bg-[#1F5C45]/15 text-[#1F5C45] flex items-center justify-center mx-auto mb-3">
                <span className="material-symbols-outlined text-2xl">mail_lock</span>
              </div>
              <h3 className="font-headline text-xl font-bold uppercase text-[#2C2421] mb-1">
                Authorization Link Dispatched
              </h3>
              <p className="text-xs sm:text-sm text-[#6B5E59] mb-4">
                We&apos;ve sent password reset instructions to <strong className="text-[#2C2421]">{email}</strong>.
              </p>
              <div className="flex flex-col gap-2">
                <Link
                  href="/verify"
                  className="w-full bg-[#2C2421] text-white text-xs uppercase tracking-wider py-3 rounded-xl font-bold hover:bg-[#1a1513] transition-colors"
                >
                  Proceed to 2FA Code Verification
                </Link>
                <button
                  type="button"
                  onClick={() => setSubmitted(false)}
                  className="text-xs text-[#E85D22] font-semibold hover:underline mt-1"
                >
                  Resend or change email
                </button>
              </div>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="w-full flex flex-col text-left">
              {/* Field: Work Email */}
              <div className="mb-4">
                <label className="block text-[11px] sm:text-xs font-extrabold uppercase tracking-wider text-[#2C2421] mb-2 font-mono">
                  WORK EMAIL ADDRESS
                </label>
                <div className="relative flex items-center">
                  <span className="material-symbols-outlined absolute left-3.5 text-[#8C7E78] text-[20px]">
                    mail
                  </span>
                  <input
                    required
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="m.rossi@apexperformance.com"
                    className="w-full pl-11 pr-4 py-3 sm:py-3.5 bg-white border border-[#2C2421]/15 rounded-xl text-sm sm:text-base text-[#2C2421] placeholder-[#8C7E78] focus:outline-none focus:border-[#E85D22] focus:ring-1 focus:ring-[#E85D22] transition-all shadow-xs"
                  />
                </div>
                <p className="text-[11px] sm:text-xs text-[#8C7E78] mt-2">
                  We&apos;ll verify your active account and send an authorization link.
                </p>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="mt-2 w-full bg-[#2C2421] hover:bg-[#1a1513] active:scale-[0.99] text-white text-sm uppercase tracking-wider py-3.5 sm:py-4 rounded-xl font-bold shadow-[0_4px_14px_rgba(44,36,33,0.18)] hover:shadow-[0_8px_25px_rgba(44,36,33,0.25)] transition-all flex items-center justify-center gap-2 group cursor-pointer disabled:opacity-75"
              >
                <span>{loading ? "Sending..." : "Send reset link"}</span>
                <span className="material-symbols-outlined text-[18px] group-hover:translate-x-1 transition-transform">
                  arrow_forward
                </span>
              </button>

            </form>
          )}

          {/* Divider */}
          <div className="w-full border-t border-[#2C2421]/10 my-6" />

          {/* Expiration Note */}
          <div className="flex items-center justify-center gap-1.5 text-xs text-[#6B5E59] mb-5">
            <span className="material-symbols-outlined text-[16px] text-[#8C7E78]">schedule</span>
            <span>
              Reset links expire after <strong>30 minutes</strong> for your security.
            </span>
          </div>

          {/* Callout Box */}
          <div className="w-full p-3.5 sm:p-4 rounded-xl bg-[#F4F4F1] border border-[#2C2421]/10 text-xs text-[#6B5E59] leading-relaxed">
            Locked out of your bay station? Contact your shop administrator or email{" "}
            <a
              href="mailto:support@bayflow.io"
              className="font-bold text-[#E85D22] hover:underline"
            >
              support@bayflow.io
            </a>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
