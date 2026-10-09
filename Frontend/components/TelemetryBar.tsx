"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Wifi, Cpu, Activity, Radio, CheckCircle } from "lucide-react";

export default function TelemetryBar() {
  const [oilTemp, setOilTemp] = useState(104);
  const [latency, setLatency] = useState(8);
  const [rpm, setRpm] = useState(7850);

  useEffect(() => {
    const interval = setInterval(() => {
      setOilTemp(102 + Math.floor(Math.random() * 4));
      setLatency(6 + Math.floor(Math.random() * 5));
      setRpm(7800 + Math.floor(Math.random() * 120));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="border-t border-gray-200 bg-[#f4f4f5] py-8 px-4 sm:px-8">
      <div className="max-w-7xl mx-auto space-y-3">
        {/* Top Ticker Labels */}
        <div className="flex flex-wrap items-center justify-between text-[11px] font-mono-tech uppercase text-gray-500 gap-2">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#ff4d15] animate-pulse" />
            <span>DIAGNOSTICS &amp; TELEMETRY // AI ENGINE ACTIVE</span>
          </div>
          <div className="flex items-center gap-2">
            <span>2.4 GHZ MESH // 100% CAN-BUS ACCURACY</span>
          </div>
        </div>

        {/* Dual Telemetry Boxes */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Box 1 */}
          <div className="bg-white border border-gray-300 rounded-lg p-4 font-mono-tech shadow-sm">
            <div className="text-[11px] uppercase text-gray-400 font-bold mb-1.5 flex items-center justify-between">
              <span>01. SERIAL DATA &amp; TELEMETRY</span>
              <Activity className="w-3.5 h-3.5 text-[#ff4d15]" />
            </div>
            <div className="text-xs sm:text-sm font-bold text-[#ff4d15] break-all">
              BAY 03 // PORSCHE 992 GT3 RS // OIL TEMP: {oilTemp}°C // RPM: {rpm} // LATENCY: {latency}ms
            </div>
          </div>

          {/* Box 2 */}
          <div className="bg-white border border-gray-300 rounded-lg p-4 font-mono-tech shadow-sm">
            <div className="text-[11px] uppercase text-gray-400 font-bold mb-1.5 flex items-center justify-between">
              <span>02. 2.4GHZ MESH &amp; REPAIR FLOW</span>
              <Wifi className="w-3.5 h-3.5 text-emerald-500" />
            </div>
            <div className="text-xs sm:text-sm font-semibold text-gray-800 break-all">
              MESH // 8 NODES CONNECTED // AUTO-SYNC ENABLED // ZERO LOSS PACKETS
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
