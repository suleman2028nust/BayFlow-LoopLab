"use client";

import React, { useState } from "react";

export default function DeveloperHandover() {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const code1 = `npm i gsap @gsap/shockingly lucide-react class-variance-authority`;
  const code2 = `import { HeroScrub } from "@/components/ui/hero-scrub";\n// Mounts dynamic canvas scrubbing across BayFlow workshop bays`;

  return (
    <section className="w-full px-4 sm:px-6 lg:px-8 py-8 border-t border-[#2C2421]/10 font-mono text-xs bg-[#F4F4F1]">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#2C2421]/10">
          <div className="flex items-center gap-2 text-[#6B5E59]">
            <span className="material-symbols-outlined text-[#E85D22] text-[18px]">terminal</span>
            <span className="font-bold text-[#2C2421]">DEVELOPER INTEGRATION // UI HANDOVER</span>
          </div>
          <span className="text-[#1F5C45] font-bold text-[11px] sm:text-xs">
            PATH: /components/ui/hero-scrub.tsx
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 bg-white p-4 rounded-lg border border-[#2C2421]/10 text-[#2C2421] shadow-[0_4px_14px_rgba(44,36,33,0.04)]">
          <div className="relative group">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[#8C7E78] block font-semibold text-[11px]">
                # 1. INSTALL GSAP &amp; DEPENDENCIES
              </span>
              <button
                onClick={() => copyToClipboard(code1, 1)}
                className="text-[10px] text-[#6B5E59] hover:text-[#2C2421] px-2 py-0.5 rounded bg-[#F4F4F1] border border-[#2C2421]/10"
              >
                {copiedIndex === 1 ? "Copied ✓" : "Copy"}
              </button>
            </div>
            <pre className="bg-[#F8F8F5] p-2.5 rounded border border-[#2C2421]/10 overflow-x-auto text-[#E85D22] font-semibold">
              <code>{code1}</code>
            </pre>
          </div>

          <div className="relative group">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[#8C7E78] block font-semibold text-[11px]">
                # 2. HERO SCRUB INTEGRATION HOOK
              </span>
              <button
                onClick={() => copyToClipboard(code2, 2)}
                className="text-[10px] text-[#6B5E59] hover:text-[#2C2421] px-2 py-0.5 rounded bg-[#F4F4F1] border border-[#2C2421]/10"
              >
                {copiedIndex === 2 ? "Copied ✓" : "Copy"}
              </button>
            </div>
            <pre className="bg-[#F8F8F5] p-2.5 rounded border border-[#2C2421]/10 overflow-x-auto text-[#6B5E59]">
              <code>{code2}</code>
            </pre>
          </div>
        </div>
      </div>
    </section>
  );
}
