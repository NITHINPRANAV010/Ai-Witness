"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, Play, Shield, Zap, Lock, Terminal } from "lucide-react";

export default function DemoCTA() {
  return (
    <section className="py-28 bg-[#06090F] border-t border-white/5 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-r from-cyan-500/10 to-blue-600/10 blur-[130px] pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-8 relative z-10 text-center">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-cyan-300 font-mono text-xs uppercase tracking-widest mb-6">
          <Terminal className="w-3.5 h-3.5 text-cyan-400" />
          START RECONSTRUCTING TODAY
        </div>

        <p className="text-xl sm:text-2xl text-gray-400 font-normal mb-3">
          Don&apos;t watch hours of footage.
        </p>

        <h2 className="text-4xl sm:text-6xl font-bold tracking-tight text-white mb-8 leading-tight">
          Let AI reconstruct{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-300 to-blue-500">
            what happened.
          </span>
        </h2>

        <p className="text-base sm:text-lg text-gray-400 max-w-2xl mx-auto mb-10 font-normal leading-relaxed">
          Upload your incident footage or connect live camera streams to generate your first audit-ready chronological reconstruction in minutes.
        </p>

        {/* Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4 mb-16">
          <Link
            href="/investigate"
            className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-bold font-mono text-sm tracking-wider uppercase rounded-xl shadow-[0_0_30px_rgba(6,182,212,0.4)] hover:shadow-[0_0_40px_rgba(6,182,212,0.6)] transition-all flex items-center gap-2.5"
          >
            <span>TRY AI WITNESS</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          <Link
            href="/investigate"
            className="px-8 py-4 bg-[#0A1017]/80 hover:bg-[#131E2B] border border-white/10 hover:border-cyan-500/40 text-white font-medium font-mono text-sm tracking-wider uppercase rounded-xl backdrop-blur-md transition-all flex items-center gap-2"
          >
            <Play className="w-4 h-4 text-cyan-400 fill-cyan-400" />
            <span>VIEW DEMO</span>
          </Link>
        </div>

        {/* Telemetry / Trust Badges */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto border-t border-white/10 pt-10 text-left">
          <div className="p-3 bg-[#080D15] rounded-xl border border-white/5">
            <div className="text-cyan-400 font-mono text-lg font-bold">{"<"} 120ms</div>
            <div className="text-[11px] font-mono text-gray-400 uppercase">Detection Latency</div>
          </div>
          <div className="p-3 bg-[#080D15] rounded-xl border border-white/5">
            <div className="text-white font-mono text-lg font-bold">99.2%</div>
            <div className="text-[11px] font-mono text-gray-400 uppercase">Re-ID Precision</div>
          </div>
          <div className="p-3 bg-[#080D15] rounded-xl border border-white/5">
            <div className="text-emerald-400 font-mono text-lg font-bold">SOC-2 / CJIS</div>
            <div className="text-[11px] font-mono text-gray-400 uppercase">Audit Compliance</div>
          </div>
          <div className="p-3 bg-[#080D15] rounded-xl border border-white/5">
            <div className="text-cyan-300 font-mono text-lg font-bold">Sub-Frame</div>
            <div className="text-[11px] font-mono text-gray-400 uppercase">Timestamp Sync</div>
          </div>
        </div>
      </div>
    </section>
  );
}
