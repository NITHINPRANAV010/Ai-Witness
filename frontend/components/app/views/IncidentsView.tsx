"use client";

import React from "react";
import { motion } from "framer-motion";
import type { Investigation, AppTab } from "@/lib/types";
import { MOCK_REPORT } from "@/lib/mockData";

interface IncidentsViewProps {
  investigation: Investigation;
  onNavigateTab: (tab: AppTab) => void;
  onSeekToMs: (ms: number) => void;
}

export default function IncidentsView({
  investigation,
  onNavigateTab,
  onSeekToMs,
}: IncidentsViewProps) {
  const report = investigation.report || MOCK_REPORT;

  const handleSeek = (ms: number) => {
    onSeekToMs(ms);
    onNavigateTab("analysis");
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="text-xs font-mono text-amber-400 uppercase tracking-wider mb-1">
            Forensic Synthesis Engine
          </div>
          <h2 className="text-2xl font-bold font-mono text-white">
            Incident Reconstruction Dossier
          </h2>
          <p className="text-sm text-neutral-400">
            Multi-camera causal chain reconstruction powered by Gemini spatio-temporal reasoning.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => handleSeek(21000)}
            className="px-4 py-2 rounded-lg bg-red-500/10 border border-red-500/30 hover:bg-red-500/20 text-red-400 font-mono text-xs flex items-center gap-2 transition-all"
          >
            <span>⚠️</span> Jump to Impact Frame (10:42:21)
          </button>
          <button
            onClick={() => onNavigateTab("reports")}
            className="px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-black font-bold font-mono text-xs uppercase tracking-wider transition-all"
          >
            Generate Incident Report →
          </button>
        </div>
      </div>

      {/* Primary Incident Profile Card */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-xl border border-amber-500/30 bg-neutral-900/80 backdrop-blur-md p-6 relative overflow-hidden"
      >
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-neutral-800">
          <div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-red-500/15 border border-red-500/30 text-red-400 font-bold uppercase">
              Incident Type: {report.incidentType}
            </span>
            <h3 className="text-xl font-bold font-mono text-white mt-2">
              Bay 04 Vehicle Reversal & Pedestrian Collapse
            </h3>
          </div>

          <div className="text-right font-mono text-xs">
            <div className="text-neutral-400">INTERVAL: {report.startTime} – {report.endTime}</div>
            <div className="text-amber-400 font-semibold">{report.location}</div>
          </div>
        </div>

        {/* AI Summary Highlight Box */}
        <div className="mt-4 p-4 rounded-xl bg-amber-500/5 border border-amber-500/20 space-y-2">
          <div className="flex items-center gap-2 text-xs font-mono text-amber-400 font-bold uppercase">
            <span>🧠</span>
            <span>Synthesized Ground-Truth Incident Summary:</span>
          </div>
          <p className="text-base text-neutral-200 font-medium leading-relaxed italic font-serif">
            &ldquo;{report.aiSummary}&rdquo;
          </p>
        </div>

        {/* Cameras Involved & Entities Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 font-mono text-xs">
          <div className="p-3 rounded-lg bg-neutral-950/60 border border-neutral-800">
            <div className="text-neutral-500 text-[10px] uppercase mb-2">
              Synchronized Cameras Involved (4)
            </div>
            <div className="flex flex-wrap gap-2">
              {investigation.cameras.map((c) => (
                <span
                  key={c.id}
                  className="px-2 py-1 rounded bg-neutral-900 border border-neutral-700 text-neutral-300 font-semibold"
                >
                  📹 {c.label.split("—")[0].trim()}
                </span>
              ))}
            </div>
          </div>

          <div className="p-3 rounded-lg bg-neutral-950/60 border border-neutral-800">
            <div className="text-neutral-500 text-[10px] uppercase mb-2">
              Anonymous Tracked Entities (3)
            </div>
            <div className="flex flex-wrap gap-2">
              {report.entitiesInvolved.map((ent) => (
                <span
                  key={ent}
                  className="px-2 py-1 rounded bg-amber-500/10 border border-amber-500/20 text-amber-400 font-semibold"
                >
                  👤 {ent}
                </span>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Two Column Section: Chronological Timeline & Inferences */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column: Chronological Timeline Breakdown with Video Anchors */}
        <div className="p-5 rounded-xl border border-neutral-800 bg-neutral-900/60 backdrop-blur-md space-y-4">
          <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
            <h4 className="text-sm font-mono font-bold text-white uppercase tracking-wider">
              Chronological Reconstruction Sequence
            </h4>
            <span className="text-xs font-mono text-neutral-500">5 Grounded Milestones</span>
          </div>

          <div className="space-y-3 font-mono text-xs">
            {report.timeline.map((item, idx) => {
              const isCrit = item.severity === "critical";
              const isWarn = item.severity === "warning";

              return (
                <div
                  key={idx}
                  className={`p-3.5 rounded-lg border transition-all ${
                    isCrit
                      ? "bg-red-500/10 border-red-500/40"
                      : isWarn
                      ? "bg-amber-500/10 border-amber-500/30"
                      : "bg-neutral-950/60 border-neutral-800"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-amber-400 font-bold">{item.timestamp}</span>
                    <span className="text-[10px] text-neutral-400 bg-neutral-900 px-2 py-0.5 rounded border border-neutral-800">
                      {item.cameraLabel?.split("—")[0].trim()}
                    </span>
                  </div>

                  <p className="text-neutral-200 text-xs font-sans font-medium mb-2">
                    {item.description}
                  </p>

                  <div className="flex items-center justify-between pt-2 border-t border-neutral-800/80 text-[10px]">
                    <span className="text-neutral-500">Subject: {item.entityLabel}</span>
                    {item.evidenceRef && (
                      <button
                        onClick={() => handleSeek(item.evidenceRef!.timestampMs)}
                        className="text-amber-400 hover:underline flex items-center gap-1 font-semibold"
                      >
                        ▶ Seek Video Frame ({item.evidenceRef.startTime})
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Inferences, Uncertainties & Confidence */}
        <div className="space-y-6">
          {/* Inferences vs Facts */}
          <div className="p-5 rounded-xl border border-neutral-800 bg-neutral-900/60 backdrop-blur-md space-y-4">
            <h4 className="text-sm font-mono font-bold text-white uppercase tracking-wider flex items-center justify-between border-b border-neutral-800 pb-3">
              <span>AI Causal Inferences</span>
              <span className="text-xs text-amber-400 font-mono">Deductive Grounding</span>
            </h4>

            <div className="space-y-3 font-mono text-xs">
              {report.inferences.map((inf, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-lg bg-neutral-950/60 border border-neutral-800 space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-amber-400 font-bold text-[11px]">
                      INFERENCE #{idx + 1}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 text-[10px] font-bold border border-emerald-500/20">
                      {(inf.confidence * 100).toFixed(0)}% CONFIDENCE
                    </span>
                  </div>
                  <p className="text-neutral-300 font-sans text-xs leading-relaxed">
                    {inf.text}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Uncertainty Disclosure */}
          <div className="p-5 rounded-xl border border-neutral-800 bg-neutral-900/60 backdrop-blur-md space-y-3">
            <h4 className="text-sm font-mono font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <span className="text-red-400">⚠️</span>
              <span>Disclosed Uncertainties & Limitations</span>
            </h4>
            <p className="text-xs text-neutral-400 font-mono">
              AI Witness explicitly flags unobservable factors to prevent hallucinations:
            </p>

            <div className="space-y-2 font-mono text-xs">
              {report.uncertainties.map((unc, idx) => (
                <div
                  key={idx}
                  className="p-2.5 rounded bg-red-500/5 border border-red-500/15 text-neutral-300 text-[11px] leading-relaxed flex items-start gap-2"
                >
                  <span className="text-red-400 font-bold">•</span>
                  <span>{unc}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Overall Confidence Index */}
          <div className="p-5 rounded-xl border border-neutral-800 bg-neutral-900/60 backdrop-blur-md space-y-2">
            <div className="flex justify-between items-center text-xs font-mono">
              <span className="text-neutral-400">OVERALL RECONSTRUCTION CONFIDENCE</span>
              <span className="text-emerald-400 font-bold text-sm">
                {report.overallConfidence}%
              </span>
            </div>
            <div className="w-full h-2 rounded-full bg-neutral-800 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-amber-500 to-emerald-400"
                style={{ width: `${report.overallConfidence}%` }}
              />
            </div>
            <div className="text-[10px] font-mono text-neutral-500 pt-1">
              Derived from multi-camera triangulations and trajectory consistency checks.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
