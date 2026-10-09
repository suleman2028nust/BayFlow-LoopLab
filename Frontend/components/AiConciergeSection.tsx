"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { PhoneCall, Mic, Sparkles, Send, ArrowRight, Bot, User, CheckCircle2 } from "lucide-react";

interface AiConciergeSectionProps {
  onOpenDemo?: () => void;
}

export default function AiConciergeSection({ onOpenDemo }: AiConciergeSectionProps) {
  const [messages, setMessages] = useState([
    {
      sender: "user",
      name: "ALEX VANCE (CUSTOMER)",
      text: "Hey, just checking in to see if my Porsche 911 GT3 RS on Bay 03 is ready for pickup today?",
      time: "08:34 AM",
    },
    {
      sender: "ai",
      name: "BAYFLOW AI VOICE CONCIERGE",
      text: "Hi Alex! Live status just updated: the carbon brakes and fluid flush are complete. The ECU dyno run is currently underway. Your vehicle will be primed for pickup at 4:30 PM. Would you like me to lock your gate code?",
      time: "08:34 AM",
    },
  ]);

  const [inputVal, setInputVal] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputVal.trim()) return;

    const userText = inputVal;
    setInputVal("");
    setMessages((prev) => [
      ...prev,
      {
        sender: "user",
        name: "WORKSHOP ADVISOR",
        text: userText,
        time: "JUST NOW",
      },
    ]);

    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      setMessages((prev) => [
        ...prev,
        {
          sender: "ai",
          name: "BAYFLOW AI VOICE CONCIERGE",
          text: `Telemetry confirmed for Bay 03. Diagnostic code scan is clean (0 faults). Notification triggered to client mobile device. Work order logged.`,
          time: "JUST NOW",
        },
      ]);
    }, 1200);
  };

  return (
    <section className="py-16 sm:py-24 bg-white border-y border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 flex flex-col items-center text-center">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl space-y-4"
        >
          <div className="inline-flex items-center gap-1.5 text-xs font-mono-tech uppercase text-[#ff4d15] font-semibold tracking-wider">
            <span className="w-1.5 h-1.5 rounded-full bg-[#ff4d15]" />
            AI-POWERED VOICE &amp; SMS ASSISTANT
          </div>

          <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 tracking-tight leading-none uppercase">
            YOUR FRONT DESK. ALWAYS ON.
          </h2>

          <p className="text-base sm:text-lg text-gray-600 font-normal leading-relaxed">
            Meet Bayflow AI: The conversational voice and text concierge that takes incoming customer calls, resolves status checks via real-time bay telemetry, and generates work orders automatically.
          </p>
        </motion.div>

        {/* AI Console Mockup */}
        <motion.div
          initial={{ opacity: 0, scale: 0.97, y: 25 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="w-full max-w-4xl mt-12 bg-white border border-gray-300 rounded-xl shadow-2xl overflow-hidden text-left"
        >
          {/* Active Call Header */}
          <div className="bg-[#fcfcfc] border-b border-gray-200 p-4 sm:px-6 flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-lg bg-[#fff0eb] border border-[#ff4d15]/30 flex items-center justify-center text-[#ff4d15]">
                <PhoneCall className="w-5 h-5 animate-bounce" />
              </div>
              <div>
                <div className="text-xs font-mono-tech font-bold text-gray-900 uppercase flex items-center gap-2">
                  <span>ACTIVE PHONE CALL // 08:34 AM PST</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                </div>
                <div className="text-xs font-mono-tech text-gray-500 mt-0.5">
                  CALLER: +1 (415) 882-0199 // ALEX VANCE (GT3 RS OWNER)
                </div>
              </div>
            </div>

            {/* Audio Waveform Equalizer */}
            <div className="flex items-center gap-1 px-3 py-2 bg-gray-100 rounded-md border border-gray-200">
              <span className="text-[10px] font-mono-tech uppercase text-gray-400 mr-2">VOICE FEED</span>
              {[18, 28, 12, 32, 22, 14, 26, 36, 20, 15, 30].map((h, i) => (
                <span
                  key={i}
                  className="w-1 bg-[#ff4d15] rounded-full waveform-bar"
                  style={{
                    height: `${h}px`,
                    animationDelay: `${i * 0.12}s`,
                  }}
                />
              ))}
            </div>
          </div>

          {/* Chat / Transcript Area */}
          <div className="p-4 sm:p-6 space-y-4 bg-gray-50/50 min-h-[220px]">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex gap-3 max-w-2xl ${
                  msg.sender === "ai" ? "ml-auto flex-row-reverse" : "mr-auto"
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-xs font-bold ${
                    msg.sender === "ai"
                      ? "bg-[#ff4d15] text-white"
                      : "bg-gray-800 text-white"
                  }`}
                >
                  {msg.sender === "ai" ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
                </div>

                <div
                  className={`p-4 rounded-xl text-xs sm:text-sm leading-relaxed border shadow-sm ${
                    msg.sender === "ai"
                      ? "bg-[#fff2ed] border-[#ff4d15]/30 text-gray-900"
                      : "bg-white border-gray-200 text-gray-800"
                  }`}
                >
                  <div
                    className={`text-[10px] font-mono-tech uppercase font-bold mb-1 ${
                      msg.sender === "ai" ? "text-[#ff4d15]" : "text-gray-500"
                    }`}
                  >
                    {msg.name}
                  </div>
                  <p>{msg.text}</p>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex gap-3 max-w-2xl ml-auto flex-row-reverse">
                <div className="w-8 h-8 rounded-full bg-[#ff4d15] text-white flex items-center justify-center shrink-0">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="bg-[#fff2ed] border border-[#ff4d15]/30 p-3 rounded-xl text-xs text-[#ff4d15] font-mono-tech flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#ff4d15] animate-ping" />
                  Querying live telemetry node...
                </div>
              </div>
            )}
          </div>

          {/* Interactive Input */}
          <form
            onSubmit={handleSend}
            className="p-3 sm:p-4 bg-white border-t border-gray-200 flex items-center gap-2"
          >
            <div className="relative flex-1">
              <input
                type="text"
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                placeholder="Type your query or voice assist trigger (e.g. prompt bay 03 dispatch summary)..."
                className="w-full text-xs sm:text-sm font-mono-tech bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#ff4d15] focus:bg-white transition-colors"
              />
            </div>
            <button
              type="submit"
              className="bg-[#ff4d15] hover:bg-[#e03e0a] text-white p-3 rounded-lg transition-colors flex items-center justify-center active:scale-95"
              aria-label="Send message"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>

          {/* Bottom Features Row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-gray-200 border-t border-gray-200 bg-[#fbfbfb] text-center p-4 sm:p-5">
            <div className="p-2 sm:p-3">
              <div className="font-bold text-gray-900 text-xs sm:text-sm">
                Autonomous Telephony
              </div>
              <div className="text-[11px] text-gray-500 font-mono-tech mt-0.5">
                0.4s response latency across voice/SIP
              </div>
            </div>

            <div className="p-2 sm:p-3">
              <div className="font-bold text-gray-900 text-xs sm:text-sm">
                Instant Status Lookups
              </div>
              <div className="text-[11px] text-gray-500 font-mono-tech mt-0.5">
                Direct query into live shop job telemetry
              </div>
            </div>

            <div className="p-2 sm:p-3">
              <div className="font-bold text-gray-900 text-xs sm:text-sm">
                Auto Job Execution
              </div>
              <div className="text-[11px] text-gray-500 font-mono-tech mt-0.5">
                Converts requests into work orders in 1-click
              </div>
            </div>
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-10"
        >
          <button
            onClick={onOpenDemo}
            className="bg-[#ff4d15] hover:bg-[#e03e0a] text-white text-xs sm:text-sm font-semibold uppercase tracking-wider px-8 py-3.5 rounded shadow-sm hover:shadow-lg transition-all flex items-center gap-2 active:scale-95"
          >
            <span>EXPLORE AI PLATFORM</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </motion.div>
      </div>
    </section>
  );
}
