"use client";

import React, { useState, useEffect } from "react";

interface VoiceCallModalProps {
  token: string | null;
  bookingId: string;
  recipientName: string;
  isOpen: boolean;
  onClose: () => void;
}

export default function VoiceCallModal({
  token,
  bookingId,
  recipientName,
  isOpen,
  onClose,
}: VoiceCallModalProps) {
  const [callStatus, setCallStatus] = useState<"RINGING" | "CONNECTED" | "ENDED">("RINGING");
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    let timer: any;
    if (isOpen) {
      setCallStatus("RINGING");
      setDuration(0);

      // Simulate connection after 3 seconds
      const ringTimer = setTimeout(() => {
        setCallStatus("CONNECTED");
      }, 3000);

      return () => clearTimeout(ringTimer);
    }
  }, [isOpen]);

  useEffect(() => {
    let interval: any;
    if (callStatus === "CONNECTED") {
      interval = setInterval(() => {
        setDuration((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [callStatus]);

  if (!isOpen) return null;

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainder = secs % 60;
    return `${mins}:${remainder < 10 ? "0" : ""}${remainder}`;
  };

  const handleEndCall = async () => {
    setCallStatus("ENDED");
    if (token) {
      try {
        await fetch("http://localhost:4000/api/calls/initiate", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ bookingId, action: "END_CALL", duration }),
        });
      } catch (err) {
        console.warn("Call status log error:", err);
      }
    }
    setTimeout(() => {
      onClose();
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#111827]/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#111827] border border-white/15 text-white rounded-3xl max-w-sm w-full p-8 text-center space-y-6 shadow-2xl relative overflow-hidden">
        {/* Animated Background Pulse */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-slate-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 space-y-3">
          <div className="w-20 h-20 rounded-full bg-white/10 text-white flex items-center justify-center mx-auto border border-white/20 shadow-lg">
            <span className="material-symbols-outlined text-4xl">phone_in_talk</span>
          </div>

          <div>
            <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-white/50">
              BAYFLOW VOICE CONNECT
            </span>
            <h3 className="font-headline text-2xl font-extrabold text-white mt-1">
              {recipientName}
            </h3>
            <p className="text-xs text-white/70 font-mono mt-0.5">Ref: {bookingId}</p>
          </div>

          <div className="pt-2">
            {callStatus === "RINGING" && (
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold animate-pulse">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                Ringing... Connecting audio stream
              </span>
            )}

            {callStatus === "CONNECTED" && (
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#1F5C45] text-white text-xs font-mono font-bold shadow-sm">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                Connected • {formatTime(duration)}
              </span>
            )}

            {callStatus === "ENDED" && (
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 text-xs font-bold">
                Call Ended
              </span>
            )}
          </div>
        </div>

        {/* Call Action Buttons */}
        <div className="relative z-10 flex items-center justify-center gap-6 pt-4">
          <button
            onClick={() => setIsMuted(!isMuted)}
            className={`w-12 h-12 rounded-full flex items-center justify-center transition-all cursor-pointer ${
              isMuted ? "bg-rose-500 text-white" : "bg-white/10 hover:bg-white/20 text-white"
            }`}
          >
            <span className="material-symbols-outlined text-xl">
              {isMuted ? "mic_off" : "mic"}
            </span>
          </button>

          <button
            onClick={handleEndCall}
            className="w-14 h-14 rounded-full bg-rose-600 hover:bg-rose-700 text-white flex items-center justify-center shadow-lg transition-all hover:scale-105 cursor-pointer"
          >
            <span className="material-symbols-outlined text-2xl">call_end</span>
          </button>
        </div>
      </div>
    </div>
  );
}
