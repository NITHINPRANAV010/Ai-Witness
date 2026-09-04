"use client";

import React from "react";
import { motion } from "framer-motion";
import type { Investigation, AppTab } from "@/lib/types";

interface DashboardViewProps {
  investigation: Investigation;
  onNavigateTab: (tab: AppTab) => void;
  onLoadDemo: () => void;
  investigationsList: Investigation[];
  onSelectInvestigation: (inv: Investigation) => void;
}

export default function DashboardView({
  investigation,
  onNavigateTab,
  onLoadDemo,
  investigationsList,
  onSelectInvestigation,
}: DashboardViewProps) {
  const stats = [
    {
      label: "CAMERAS ANALYZED",
      value: "04",
      sub: "All Feeds Calibrated",
      badge: "ACTIVE",
      color: "var(--color-amber)",
      icon: "📹",
    },
    {
      label: "VIDEOS INGESTED",
      value: "12",
      sub: "Synchronized Streams",
      badge: "SYNCED",
      color: "var(--color-info)",
      icon: "📼",
    },
    {
      label: "ENTITIES TRACKED",
      value: "03",
      sub: "Anonymous IDs (No Face Rec)",
      badge: "ANON",
      color: "var(--color-confirmed)",
      icon: "👤",
    },
    {
      label: "EVENTS EXTRACTED",
      value: "05",
      sub: "Spatiotemporal Events",
      badge: "CROSS-CAM",
      color: "var(--color-amber)",
      icon: "⏱",
    },
    {
      label: "INCIDENTS DETECTED",
      value: "01",
      sub: "Pedestrian-Vehicle Contact",
      badge: "CRITICAL",
      color: "var(--color-critical)",
      icon: "⚠️",
    },
    {
      label: "RECONSTRUCTION CONFIDENCE",
      value: "94.2%",
      sub: "Grounded in Visual Physics",
      badge: "VERIFIED",
      color: "var(--color-confirmed)",
      icon: "🎯",
    },
  ];

  const recentLogs = [
    { time: "10:42:28", level: "INFO", text: "Multi-camera correlation confirmed: Person #01 cross-identified CAM-01 → CAM-02 → CAM-04 (Re-ID: 94.6%)" },
    { time: "10:42:25", level: "ALERT", text: "Event Extracted: Person #02 ingress velocity 2.8 m/s towards incident ground zero [CAM-01]" },
    { time: "10:42:21", level: "CRIT", text: "Kinematic Collapse Detected: Person #01 posture vector changed from vertical to horizontal [CAM-04]" },
    { time: "10:42:19", level: "WARN", text: "Optical Flow Surge: Vehicle #01 reverse acceleration initiated (14.2 px/frame) [CAM-03]" },
    { time: "10:42:16", level: "INFO", text: "Proximity Alert: Person #01 within 0.82m blind-zone radius of Vehicle #01 [CAM-02]" },
  ];

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Top Banner / Hero Callout */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-xl p-6 border"
        style={{
          background: "linear-gradient(135deg, rgba(245,158,11,0.08) 0%, rgba(13,17,23,0.95) 100%)",
          borderColor: "rgba(245,158,11,0.25)",
        }}
      >
        <div className="absolute -right-16 -top-16 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-mono">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
              AI WITNESS INTELLIGENCE PLATFORM · ACTIVE RECONSTRUCTION
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-white font-mono">
              Multi-Camera Incident Command Center
            </h2>
            <p className="text-sm text-neutral-400 leading-relaxed">
              Synthesize disjointed CCTV streams into a continuous, explainable 3D timeline.
              Anonymous entity tracking, cross-camera Re-ID, and Gemini-grounded forensic reconstruction.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={onLoadDemo}
              className="px-5 py-2.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-black font-semibold text-xs font-mono uppercase tracking-wider flex items-center gap-2 transition-all shadow-[0_0_20px_rgba(245,158,11,0.3)] hover:shadow-[0_0_25px_rgba(245,158,11,0.5)]"
            >
              <span>⚡</span>
              Try Built-in Demo Case
            </button>
            <button
              onClick={() => onNavigateTab("investigations")}
              className="px-5 py-2.5 rounded-lg bg-neutral-900/80 hover:bg-neutral-800 border border-neutral-700 text-neutral-200 text-xs font-mono uppercase tracking-wider transition-all"
            >
              + New Investigation
            </button>
            <button
              onClick={() => onNavigateTab("analysis")}
              className="px-5 py-2.5 rounded-lg bg-neutral-900/80 hover:bg-neutral-800 border border-amber-500/30 text-amber-400 text-xs font-mono uppercase tracking-wider transition-all"
            >
              Launch 4-Camera Studio →
            </button>
          </div>
        </div>
      </motion.div>

      {/* Stats Counter Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3">
        {stats.map((st, i) => (
          <motion.div
            key={st.label}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="p-4 rounded-xl border bg-neutral-900/60 backdrop-blur-md relative overflow-hidden group hover:border-amber-500/40 transition-all"
            style={{ borderColor: "rgba(255,255,255,0.08)" }}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-lg">{st.icon}</span>
              <span
                className="text-[10px] font-mono px-1.5 py-0.5 rounded uppercase font-semibold"
                style={{
                  background: `${st.color}15`,
                  color: st.color,
                  border: `1px solid ${st.color}30`,
                }}
              >
                {st.badge}
              </span>
            </div>
            <div className="text-2xl font-bold font-mono tracking-tight text-white mb-1">
              {st.value}
            </div>
            <div className="text-[11px] font-mono font-medium text-neutral-400 uppercase tracking-wider">
              {st.label}
            </div>
            <div className="text-[10px] text-neutral-500 mt-1 truncate">
              {st.sub}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Core Middle Section: Pipeline & Active Case Highlights */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Active Investigation Dossier */}
        <div className="lg:col-span-2 space-y-6">
          <div
            className="p-6 rounded-xl border bg-neutral-900/70 backdrop-blur-md"
            style={{ borderColor: "rgba(255,255,255,0.08)" }}
          >
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-neutral-800">
              <div className="flex items-center gap-3">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                <h3 className="text-sm font-mono font-semibold text-white uppercase tracking-wider">
                  Active Investigation Dossier
                </h3>
              </div>
              <span className="font-mono text-xs text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                CASE #{investigation.id.replace("inv-", "").toUpperCase()}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
              <div className="space-y-1 p-3 rounded-lg bg-neutral-950/60 border border-neutral-800/80">
                <div className="text-[10px] font-mono text-neutral-500 uppercase">Case Name</div>
                <div className="text-sm font-semibold text-neutral-200">{investigation.name}</div>
                <div className="text-xs text-neutral-400">{investigation.description}</div>
              </div>
              <div className="space-y-1 p-3 rounded-lg bg-neutral-950/60 border border-neutral-800/80">
                <div className="text-[10px] font-mono text-neutral-500 uppercase">Spatiotemporal Boundary</div>
                <div className="text-sm font-semibold text-neutral-200">{investigation.location}</div>
                <div className="text-xs text-neutral-400 font-mono">
                  {investigation.incidentDate} · 4 Feeds Synced
                </div>
              </div>
            </div>

            {/* Analysis Pipeline Step Indicator */}
            <div className="space-y-2 mb-6">
              <div className="flex justify-between items-center text-xs font-mono text-neutral-400">
                <span>RECONSTRUCTION PIPELINE THROUGHPUT</span>
                <span className="text-emerald-400 font-semibold">100% EXECUTED</span>
              </div>
              <div className="grid grid-cols-7 gap-1.5 text-center">
                {[
                  { label: "1. Ingestion", status: "complete" },
                  { label: "2. Detection", status: "complete" },
                  { label: "3. Tracking", status: "complete" },
                  { label: "4. Events", status: "complete" },
                  { label: "5. Cross-Cam", status: "complete" },
                  { label: "6. Gemini AI", status: "complete" },
                  { label: "7. Reconstruct", status: "complete" },
                ].map((step, idx) => (
                  <div
                    key={step.label}
                    className="p-2 rounded bg-neutral-950/80 border text-[10px] font-mono transition-all border-emerald-500/30 text-emerald-400"
                  >
                    <div className="text-xs mb-0.5">✓</div>
                    <div className="truncate">{step.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions for this investigation */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => onNavigateTab("analysis")}
                className="px-4 py-2 rounded-lg bg-amber-500 text-black font-semibold text-xs font-mono hover:bg-amber-400 transition-all flex items-center gap-2"
              >
                <span>▶</span> Open Synchronized 4-Cam Grid
              </button>
              <button
                onClick={() => onNavigateTab("incidents")}
                className="px-4 py-2 rounded-lg bg-neutral-800 text-neutral-200 text-xs font-mono hover:bg-neutral-700 transition-all"
              >
                View Incident Breakdown
              </button>
              <button
                onClick={() => onNavigateTab("evidence")}
                className="px-4 py-2 rounded-lg bg-neutral-800 text-neutral-200 text-xs font-mono hover:bg-neutral-700 transition-all"
              >
                Inspect Evidence Locker
              </button>
              <button
                onClick={() => onNavigateTab("reports")}
                className="px-4 py-2 rounded-lg bg-neutral-800 text-neutral-200 text-xs font-mono hover:bg-neutral-700 transition-all ml-auto"
              >
                Export Forensic Report
              </button>
            </div>
          </div>

          {/* Investigations History Table */}
          <div
            className="p-6 rounded-xl border bg-neutral-900/70 backdrop-blur-md"
            style={{ borderColor: "rgba(255,255,255,0.08)" }}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-mono font-semibold text-white uppercase tracking-wider">
                All Investigations ({investigationsList.length})
              </h3>
              <button
                onClick={() => onNavigateTab("investigations")}
                className="text-xs font-mono text-amber-400 hover:underline"
              >
                Manage All →
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead>
                  <tr className="border-b border-neutral-800 text-neutral-500">
                    <th className="pb-2">CASE ID</th>
                    <th className="pb-2">NAME</th>
                    <th className="pb-2">CAMERAS</th>
                    <th className="pb-2">DATE</th>
                    <th className="pb-2">STATUS</th>
                    <th className="pb-2 text-right">ACTION</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-800/60">
                  {investigationsList.map((inv) => (
                    <tr
                      key={inv.id}
                      className="hover:bg-neutral-800/40 transition-colors group"
                    >
                      <td className="py-3 font-semibold text-amber-400">
                        #{inv.id.replace("inv-", "").toUpperCase()}
                      </td>
                      <td className="py-3 text-neutral-200 font-sans font-medium">
                        {inv.name}
                        <div className="text-[11px] text-neutral-500 font-mono">{inv.location}</div>
                      </td>
                      <td className="py-3 text-neutral-400">{inv.cameraCount} Feeds</td>
                      <td className="py-3 text-neutral-500">{inv.incidentDate}</td>
                      <td className="py-3">
                        <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 uppercase">
                          {inv.status}
                        </span>
                      </td>
                      <td className="py-3 text-right">
                        <button
                          onClick={() => {
                            onSelectInvestigation(inv);
                            onNavigateTab("analysis");
                          }}
                          className="px-3 py-1 rounded bg-neutral-800 hover:bg-amber-500 hover:text-black text-neutral-300 font-semibold transition-all"
                        >
                          Analyze
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right 1 Col: Live Forensic Telemetry & Feed Logs */}
        <div className="space-y-6">
          {/* Hardware & Model Specifications */}
          <div
            className="p-5 rounded-xl border bg-neutral-900/70 backdrop-blur-md space-y-4"
            style={{ borderColor: "rgba(255,255,255,0.08)" }}
          >
            <h4 className="text-xs font-mono font-semibold text-neutral-300 uppercase tracking-wider flex items-center justify-between">
              <span>Engine Status</span>
              <span className="text-[10px] text-emerald-400">ONLINE</span>
            </h4>

            <div className="space-y-2.5 text-xs font-mono">
              <div className="flex justify-between py-1.5 border-b border-neutral-800">
                <span className="text-neutral-500">Computer Vision</span>
                <span className="text-neutral-200">YOLOv8 + OpenCV (CUDA)</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-neutral-800">
                <span className="text-neutral-500">Tracking Algorithm</span>
                <span className="text-neutral-200">ByteTrack Multi-Object</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-neutral-800">
                <span className="text-neutral-500">Reasoning Core</span>
                <span className="text-amber-400">Google Gemini 1.5 Pro</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-neutral-800">
                <span className="text-neutral-500">Privacy Safeguard</span>
                <span className="text-emerald-400 font-semibold">Anonymous IDs Only</span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-neutral-500">Facial Recognition</span>
                <span className="text-red-400">HARDWARE DISABLED</span>
              </div>
            </div>
          </div>

          {/* Live Chronological Telemetry Feed */}
          <div
            className="p-5 rounded-xl border bg-neutral-900/70 backdrop-blur-md space-y-3"
            style={{ borderColor: "rgba(255,255,255,0.08)" }}
          >
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-mono font-semibold text-neutral-300 uppercase tracking-wider">
                Live Analysis Feed
              </h4>
              <span className="text-[10px] font-mono text-neutral-500">UTC REALTIME</span>
            </div>

            <div className="space-y-2 text-xs font-mono">
              {recentLogs.map((log, idx) => (
                <div
                  key={idx}
                  className="p-2.5 rounded bg-neutral-950/60 border border-neutral-800/80 space-y-1"
                >
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="text-neutral-500">{log.time}</span>
                    <span
                      className={`px-1.5 py-0.2 rounded font-bold ${
                        log.level === "CRIT"
                          ? "text-red-400 bg-red-500/10"
                          : log.level === "WARN"
                          ? "text-amber-400 bg-amber-500/10"
                          : log.level === "ALERT"
                          ? "text-orange-400 bg-orange-500/10"
                          : "text-blue-400 bg-blue-500/10"
                      }`}
                    >
                      {log.level}
                    </span>
                  </div>
                  <p className="text-neutral-300 text-[11px] leading-snug">{log.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
