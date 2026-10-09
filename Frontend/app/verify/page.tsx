"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function VerifyPage() {
  const router = useRouter();
  const [digits, setDigits] = useState<string[]>(["5", "8", "2", "", "", ""]);
  const [activeIndex, setActiveIndex] = useState<number>(3);
  const [timer, setTimer] = useState<number>(45);
  const [canResend, setCanResend] = useState<boolean>(false);
  const [rememberDevice, setRememberDevice] = useState<boolean>(true);
  const [method, setMethod] = useState<"phone" | "email">("phone");
  const [loading, setLoading] = useState<boolean>(false);
  const [verified, setVerified] = useState<boolean>(false);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Countdown timer for resend
  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    } else {
      setCanResend(true);
    }
  }, [timer]);

  // Focus active input on mount or index change
  useEffect(() => {
    if (inputRefs.current[activeIndex]) {
      inputRefs.current[activeIndex]?.focus();
    }
  }, [activeIndex]);

  const handleDigitChange = (index: number, value: string) => {
    // Only accept numeric characters
    const cleanVal = value.replace(/[^0-9]/g, "");
    if (!cleanVal) {
      const newDigits = [...digits];
      newDigits[index] = "";
      setDigits(newDigits);
      return;
    }

    const char = cleanVal.slice(-1);
    const newDigits = [...digits];
    newDigits[index] = char;
    setDigits(newDigits);

    // Auto-advance to next input if available
    if (index < 5) {
      setActiveIndex(index + 1);
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace") {
      if (!digits[index] && index > 0) {
        setActiveIndex(index - 1);
        const newDigits = [...digits];
        newDigits[index - 1] = "";
        setDigits(newDigits);
      } else {
        const newDigits = [...digits];
        newDigits[index] = "";
        setDigits(newDigits);
      }
    } else if (e.key === "ArrowLeft" && index > 0) {
      setActiveIndex(index - 1);
    } else if (e.key === "ArrowRight" && index < 5) {
      setActiveIndex(index + 1);
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData("text").replace(/[^0-9]/g, "");
    if (pasteData) {
      const pasteArray = pasteData.slice(0, 6).split("");
      const newDigits = [...digits];
      pasteArray.forEach((char, i) => {
        newDigits[i] = char;
      });
      setDigits(newDigits);
      const nextActive = Math.min(pasteArray.length, 5);
      setActiveIndex(nextActive);
    }
  };

  const handleResend = () => {
    if (!canResend) return;
    setTimer(45);
    setCanResend(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setVerified(true);
      setTimeout(() => {
        router.push("/");
      }, 1000);
    }, 700);
  };

  // Calculate current filled count for indicator
  const filledCount = digits.filter((d) => d !== "").length;
  const currentStepText = `Digit ${Math.min(filledCount + 1, 6)} of 6`;

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

      {/* TOP HEADER BAR */}
      <header className="relative z-10 w-full bg-white/90 backdrop-blur-md border-b border-[#2C2421]/10 px-4 sm:px-8 py-3.5 flex items-center justify-between shadow-xs">
        {/* Left: Brand Logo + Workshop Portal */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-8 h-8 rounded-lg bg-[#2C2421] flex items-center justify-center text-white shadow-sm group-hover:bg-[#1a1513] transition-colors">
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
          <div className="flex items-center gap-2">
            <span className="font-headline text-xl sm:text-2xl font-black uppercase tracking-wider text-[#2C2421]">
              BAYFLOW
            </span>
            <span className="text-[#8C7E78] text-sm">|</span>
            <span className="text-xs sm:text-sm font-medium text-[#6B5E59]">
              Workshop Portal
            </span>
          </div>
        </Link>

        {/* Right: User Chip & Logout */}
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#F4F4F1] border border-[#2C2421]/10 text-xs text-[#2C2421] font-medium">
            <div className="w-5 h-5 rounded-full bg-[#1F5C45] text-white flex items-center justify-center font-bold text-[10px]">
              M
            </div>
            <span className="hidden sm:inline font-mono text-[11px] sm:text-xs">
              marcus@apexperformance.com
            </span>
          </div>

          <Link
            href="/login"
            title="Sign out / Switch account"
            className="p-1.5 rounded-lg text-[#6B5E59] hover:text-[#2C2421] hover:bg-[#F4F4F1] transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">logout</span>
          </Link>
        </div>
      </header>

      {/* MAIN BODY */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center p-4 sm:p-6 lg:p-10 my-auto py-10">
        {/* Navigation Breadcrumb / Step Indicator */}
        <div className="w-full max-w-[500px] flex items-center justify-between mb-3 text-xs sm:text-sm">
          <Link
            href="/login"
            className="flex items-center gap-1.5 text-xs font-bold text-white bg-black/40 hover:bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full transition-colors border border-white/10"
          >
            <span className="material-symbols-outlined text-[18px]">arrow_back</span>
            <span>Back to sign in</span>
          </Link>

          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/90 backdrop-blur-md text-[#1F5C45] text-[11px] sm:text-xs font-semibold shadow-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-[#1F5C45] animate-pulse" />
            <span>Step 2 of 2</span>
          </div>
        </div>

        {/* 2FA Card */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          className="w-full max-w-[500px] bg-white/95 backdrop-blur-xl rounded-2xl sm:rounded-3xl border border-white/40 shadow-[0_20px_50px_rgba(0,0,0,0.35)] overflow-hidden"
        >
          <div className="p-6 sm:p-10 flex flex-col items-center text-center">
            {/* Top Device Icon Badge */}
            <div className="w-16 h-16 rounded-full bg-[#FFEFE8] border border-[#E85D22]/20 flex items-center justify-center text-[#E85D22] mb-5 shadow-sm">
              <span className="material-symbols-outlined text-3xl">smartphone</span>
            </div>

            {/* Heading & Instructions */}
            <h1 className="font-headline text-3xl sm:text-4xl font-extrabold uppercase tracking-tight text-[#2C2421] mb-2 leading-tight">
              Check your phone
            </h1>
            <p className="text-xs sm:text-sm text-[#6B5E59] leading-relaxed max-w-sm mb-6">
              We sent a 6-digit verification code to{" "}
              <strong className="text-[#2C2421] font-mono">
                {method === "phone" ? "(555) •••-9400" : "m.rossi@apex..."}
              </strong>
              . Enter the code below to confirm it&apos;s you.
            </p>

            {/* CODE INPUT FORM */}
            <form onSubmit={handleSubmit} className="w-full flex flex-col text-left">
              {/* Digit Inputs Label & Live Indicator */}
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] sm:text-xs font-extrabold uppercase tracking-wider text-[#2C2421] font-mono">
                  Verification Code
                </span>
                <span className="text-[11px] font-mono font-bold text-[#E85D22] uppercase tracking-wider">
                  {currentStepText}
                </span>
              </div>

              {/* 6 Digit Inputs */}
              <div className="grid grid-cols-6 gap-2 sm:gap-3 mb-5" onPaste={handlePaste}>
                {digits.map((digit, idx) => {
                  const isCurrent = idx === activeIndex;
                  const isFilled = digit !== "";

                  return (
                    <input
                      key={idx}
                      ref={(el) => {
                        inputRefs.current[idx] = el;
                      }}
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleDigitChange(idx, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(idx, e)}
                      onFocus={() => setActiveIndex(idx)}
                      className={`h-12 sm:h-14 w-full text-center text-lg sm:text-2xl font-mono font-bold rounded-xl transition-all outline-none ${
                        isCurrent
                          ? "border-2 border-[#E85D22] bg-white text-[#2C2421] shadow-xs scale-102"
                          : isFilled
                          ? "border border-[#2C2421]/30 bg-white text-[#2C2421]"
                          : "border border-[#2C2421]/15 bg-[#F8F8F5] text-[#8C7E78]"
                      }`}
                    />
                  );
                })}
              </div>

              {/* Resend & Secondary Auth Method Box */}
              <div className="bg-[#F8F8F5] border border-[#2C2421]/10 rounded-xl p-3 sm:p-4 mb-5 flex flex-col gap-2.5 text-xs">
                <div className="flex items-center justify-between text-[#6B5E59]">
                  <span>Didn&apos;t receive the code?</span>
                  {canResend ? (
                    <button
                      type="button"
                      onClick={handleResend}
                      className="font-bold text-[#E85D22] hover:underline cursor-pointer"
                    >
                      Resend code
                    </button>
                  ) : (
                    <span className="text-[#E85D22] font-semibold font-mono">
                      Resend code (0:{timer < 10 ? `0${timer}` : timer})
                    </span>
                  )}
                </div>

                <div className="pt-2 border-t border-[#2C2421]/8">
                  <button
                    type="button"
                    onClick={() => setMethod(method === "phone" ? "email" : "phone")}
                    className="flex items-center gap-1.5 text-[#6B5E59] hover:text-[#2C2421] transition-colors text-left cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[16px] text-[#8C7E78]">
                      {method === "phone" ? "mail" : "phone_iphone"}
                    </span>
                    <span className="truncate">
                      Try another way: Send code via{" "}
                      {method === "phone" ? "email to m.rossi@apex..." : "SMS to (555) •••-9400"}
                    </span>
                  </button>
                </div>
              </div>

              {/* Remember Device Checkbox */}
              <div className="flex items-start gap-2.5 mb-6">
                <input
                  type="checkbox"
                  id="rememberDevice"
                  checked={rememberDevice}
                  onChange={(e) => setRememberDevice(e.target.checked)}
                  className="mt-0.5 w-4 h-4 rounded text-[#E85D22] focus:ring-[#E85D22] border-[#2C2421]/30 accent-[#E85D22] cursor-pointer"
                />
                <label htmlFor="rememberDevice" className="cursor-pointer">
                  <div className="text-xs sm:text-sm font-bold text-[#2C2421]">
                    Remember this device for 30 days
                  </div>
                  <div className="text-[11px] sm:text-xs text-[#8C7E78]">
                    Don&apos;t check this box if you are on a shared or public computer
                  </div>
                </label>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#2C2421] hover:bg-[#1a1513] active:scale-[0.99] text-white text-sm uppercase tracking-wider py-4 rounded-xl font-bold shadow-[0_4px_14px_rgba(44,36,33,0.18)] hover:shadow-[0_8px_25px_rgba(44,36,33,0.25)] transition-all flex items-center justify-center gap-2 group cursor-pointer disabled:opacity-75"
              >
                <span>
                  {loading
                    ? "Authenticating..."
                    : verified
                    ? "Access Granted ✓"
                    : "Continue to Workshop"}
                </span>
                <span className="material-symbols-outlined text-[18px] group-hover:translate-x-1 transition-transform">
                  arrow_forward
                </span>
              </button>
            </form>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
