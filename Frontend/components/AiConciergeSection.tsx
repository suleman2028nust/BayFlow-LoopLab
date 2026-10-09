"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";

interface AiConciergeSectionProps {
  onOpenDemo?: () => void;
}

export default function AiConciergeSection({ onOpenDemo }: AiConciergeSectionProps) {
  const [callState, setCallState] = useState<"idle" | "calling" | "connected">("idle");
  const [activeTab, setActiveTab] = useState<"voice-call" | "ai-frontdesk">("voice-call");

  return (
    <section id="ai-concierge" className="w-full px-4 sm:px-6 lg:px-8 py-20 bg-[#F4F4F1] border-t border-[#2C2421]/15">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#111827]/10 border border-[#111827]/15 text-[#111827] text-xs font-semibold mb-4">
            <span className="material-symbols-outlined text-base">phone_in_talk</span>
            <span>VOICE CALLING &amp; AI FRONT DESK</span>
          </div>
          <h2 className="font-headline text-3xl sm:text-5xl font-extrabold text-[#2C2421] tracking-tight leading-tight">
            Never Miss A Customer Call Again.
          </h2>
          <p className="mt-4 text-base text-[#2C2421]/70 leading-relaxed font-normal">
            Direct browser-to-browser WebRTC voice calling between Service Advisor and Customer, plus an autonomous AI Front Desk that answers when advisors are busy.
          </p>
        </div>

        {/* Feature Tabs */}
        <div className="flex justify-center gap-2 mb-8">
          <button
            onClick={() => setActiveTab("voice-call")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === "voice-call"
                ? "bg-[#111827] text-white shadow-sm"
                : "bg-white text-[#2C2421] hover:bg-[#F4F4F1] border border-[#2C2421]/15"
            }`}
          >
            1. In-App WebRTC Voice Call
          </button>
          <button
            onClick={() => setActiveTab("ai-frontdesk")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === "ai-frontdesk"
                ? "bg-[#111827] text-white shadow-sm"
                : "bg-white text-[#2C2421] hover:bg-[#F4F4F1] border border-[#2C2421]/15"
            }`}
          >
            2. AI Front Desk (Unanswered Call Fallback)
          </button>
        </div>

        {/* Interactive Light Call Simulator Container */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto bg-white rounded-2xl border border-[#2C2421]/15 shadow-[0_10px_30px_rgba(44,36,33,0.06)] overflow-hidden"
        >
          {activeTab === "voice-call" && (
            <div className="p-6 lg:p-8 space-y-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-[#2C2421]/10 pb-4 gap-3">
                <div>
                  <span className="text-xs font-mono text-[#2C2421]/60 font-semibold">WebRTC Audio Engine</span>
                  <h3 className="text-lg font-bold text-[#2C2421]">Direct In-App Calling (No Phone Numbers Shared)</h3>
                </div>
                <span className="px-3 py-1 bg-[#111827]/10 text-[#111827] border border-[#111827]/20 text-xs font-mono font-bold rounded-full">
                  Status: {callState.toUpperCase()}
                </span>
              </div>

              <div className="p-6 bg-[#F4F4F1]/60 rounded-xl border border-[#2C2421]/15 flex flex-col items-center justify-center text-center gap-4">
                <div className="w-16 h-16 rounded-full bg-[#111827]/10 text-[#111827] flex items-center justify-center shadow-inner">
                  <span className="material-symbols-outlined text-3xl">call</span>
                </div>
                <div>
                  <div className="font-bold text-[#2C2421] text-base">Service Advisor (Bilal) ↔ Customer (Ahmed)</div>
                  <div className="text-xs text-[#2C2421]/60 mt-1">Booking #BK-9021 • 2016 Honda Civic</div>
                </div>

                {callState === "idle" && (
                  <button
                    onClick={() => {
                      setCallState("calling");
                      setTimeout(() => setCallState("connected"), 1500);
                    }}
                    className="px-5 py-2.5 bg-[#111827] hover:bg-[#0F172A] text-white font-bold text-xs rounded-xl shadow transition-all flex items-center gap-2"
                  >
                    <span className="material-symbols-outlined text-base">call</span>
                    Test Voice Call
                  </button>
                )}

                {callState === "calling" && (
                  <div className="flex items-center gap-2 text-[#111827] font-bold text-xs font-mono">
                    <span className="w-2 h-2 rounded-full bg-[#111827] animate-ping" />
                    Ringing Customer Ahmed...
                  </div>
                )}

                {callState === "connected" && (
                  <div className="flex flex-col items-center gap-3">
                    <div className="flex items-center gap-1.5 h-6 px-3 bg-[#111827]/10 rounded-full border border-[#111827]/20">
                      <span className="w-1 bg-[#111827] h-2 animate-pulse rounded-full" />
                      <span className="w-1 bg-[#111827] h-5 animate-pulse rounded-full" />
                      <span className="w-1 bg-[#111827] h-3 animate-pulse rounded-full" />
                      <span className="w-1 bg-[#111827] h-6 animate-pulse rounded-full" />
                      <span className="text-[11px] font-mono font-bold text-[#111827] ml-1">Connected 00:24</span>
                    </div>
                    <button
                      onClick={() => setCallState("idle")}
                      className="px-4 py-2 bg-[#2C2421] hover:bg-[#1a1513] text-white font-bold text-xs rounded-xl shadow"
                    >
                      End Call &amp; Log Summary
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === "ai-frontdesk" && (
            <div className="p-6 lg:p-8 space-y-6">
              <div className="flex justify-between items-center border-b border-[#2C2421]/10 pb-4">
                <div>
                  <span className="text-xs font-mono text-[#111827] font-bold">20s Ring Timeout Fallback</span>
                  <h3 className="text-lg font-bold text-[#2C2421]">AI Voice Agent Answers &amp; Creates Task</h3>
                </div>
                <span className="px-3 py-1 bg-[#111827]/10 text-[#111827] border border-[#111827]/20 text-xs font-mono font-bold rounded-full">
                  Worked Example Scenario
                </span>
              </div>

              <div className="p-5 bg-[#F4F4F1]/60 rounded-xl border border-[#2C2421]/15 space-y-3 font-sans text-xs">
                <div className="p-3 bg-white rounded-lg border border-[#2C2421]/15">
                  <span className="font-bold text-[#111827] block mb-1">AI Front Desk:</span>
                  &ldquo;Hello Ahmed! I see you are calling regarding your 2016 Honda Civic. Service Advisor Bilal has prepared your estimate of PKR 16,100 which is waiting for your approval in the customer portal.&rdquo;
                </div>
                <div className="p-3 bg-white rounded-lg border border-[#2C2421]/15">
                  <span className="font-bold text-[#2C2421] block mb-1">Customer Ahmed:</span>
                  &ldquo;Thanks for letting me know! I will open the portal and approve it right now.&rdquo;
                </div>
                <div className="p-3 bg-[#111827]/5 border border-[#111827]/15 rounded-lg text-[#111827] font-medium">
                  <strong>SA Task Created:</strong> &ldquo;Customer Ahmed phoned regarding estimate status. AI Front Desk handled call and reminded customer to approve online.&rdquo;
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
}
