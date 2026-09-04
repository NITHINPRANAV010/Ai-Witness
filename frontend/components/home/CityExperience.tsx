"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShieldCheck, ChevronRight, ArrowRight, Clock,
  Sparkles, Layers, Crosshair, Play, Pause, RotateCcw, Eye,
} from "lucide-react";
import CityCanvas from "./CityCanvas";

const STAGES = [
  { id: 1, label: "01", title: "Surveillance Grid Active" },
  { id: 2, label: "02", title: "Target Approach & Detection" },
  { id: 3, label: "03", title: "Multi-Camera Perspectives" },
  { id: 4, label: "04", title: "Structured Event Sequence" },
  { id: 5, label: "05", title: "Spatial Reconstruction" },
  { id: 6, label: "06", title: "Intelligence Dossier" },
];

const CAMERAS = [
  { id: 1, name: "CAM-01", label: "North Entrance",  time: "10:42:11" },
  { id: 2, name: "CAM-02", label: "Parking Bay 04",  time: "10:42:16" },
  { id: 3, name: "CAM-03", label: "Street East",     time: "10:42:19" },
  { id: 4, name: "CAM-04", label: "Rooftop High",    time: "10:42:21" },
];

const TIMELINE_EVENTS = [
  { time: "10:42:11", text: "Person enters area",         badge: "P-109 DETECTED",      cam: "CAM-01", type: "entry" },
  { time: "10:42:16", text: "Person approaches vehicle",  badge: "PROXIMITY ALERT",      cam: "CAM-02", type: "approach" },
  { time: "10:42:19", text: "Vehicle reverses suddenly",  badge: "V-442 ACCELERATING",   cam: "CAM-03", type: "action" },
  { time: "10:42:21", text: "Person falls",               badge: "IMPACT / COLLAPSE",    cam: "CAM-04", type: "incident" },
  { time: "10:42:25", text: "Witness arrives on scene",   badge: "P-110 WITNESS",        cam: "CAM-01", type: "response" },
];

const PANEL_VARIANTS = {
  hidden:  { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.3, ease: "easeOut" } },
  exit:    { opacity: 0, x: -16, transition: { duration: 0.15 } },
};

export default function CityExperience() {
  const [currentStage, setCurrentStage] = useState(1);
  const [selectedCam,  setSelectedCam]  = useState(1);
  const [isPlaying,    setIsPlaying]    = useState(false);

  // Auto-play cycle
  useEffect(() => {
    if (!isPlaying) return;
    const id = setInterval(() => setCurrentStage((p) => (p >= 6 ? 1 : p + 1)), 5500);
    return () => clearInterval(id);
  }, [isPlaying]);

  const selectStage = (id: number) => { setIsPlaying(false); setCurrentStage(id); };

  return (
    <section
      id="hero"
      className="relative w-full min-h-screen bg-[#04070D] text-white flex flex-col overflow-hidden"
    >
      {/* ── FULL-SCREEN 3D CANVAS (always behind everything) ────────────── */}
      <div className="absolute inset-0 z-0">
        <CityCanvas stage={currentStage} selectedCamera={selectedCam} />
      </div>

      {/* ── LAYOUT WRAPPER ──────────────────────────────────────────────── */}
      <div className="relative z-10 flex flex-col h-full min-h-screen">

        {/* ── TOP BAR ─────────────────────────────────────────────────── */}
        <div className="flex items-center justify-between px-5 sm:px-8 pt-24 pb-4">
          {/* Live feed badge */}
          <div className="flex items-center gap-2.5 bg-black/50 border border-cyan-500/25 backdrop-blur-md px-4 py-2 rounded-full">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-cyan-500" />
            </span>
            <span className="font-mono text-[11px] tracking-widest text-cyan-300 uppercase">
              SECTOR 04 — LIVE RECONSTRUCTION
            </span>
            <span className="hidden sm:block text-gray-500 font-mono text-xs">|</span>
            <span className="hidden sm:block font-mono text-[11px] text-gray-400">4 CAMERAS SYNC</span>
          </div>

          {/* Stage selector pill */}
          <div className="flex items-center gap-1.5 bg-black/60 border border-white/10 backdrop-blur-md px-2.5 py-1.5 rounded-xl">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="flex items-center gap-1.5 text-[11px] font-mono text-gray-300 hover:text-white transition-colors border-r border-white/10 pr-2.5 mr-1 cursor-pointer"
            >
              {isPlaying
                ? <><Pause className="w-3 h-3 text-cyan-400" /> Pause</>
                : <><Play  className="w-3 h-3 text-cyan-400 fill-cyan-400" /> Auto</>}
            </button>
            {STAGES.map((s) => (
              <button
                key={s.id}
                onClick={() => selectStage(s.id)}
                title={s.title}
                className={`px-2 py-0.5 text-[11px] font-mono rounded transition-all cursor-pointer ${
                  currentStage === s.id
                    ? "bg-cyan-500 text-black font-bold shadow-[0_0_10px_rgba(6,182,212,0.7)]"
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        {/* ── MAIN BODY: LEFT PANEL + RIGHT SCENE ─────────────────────── */}
        <div className="flex flex-1 items-stretch">

          {/* ── LEFT PANEL (40% max-w, panels stacked on left side) ───── */}
          <div className="w-full md:w-[42%] lg:w-[38%] xl:w-[34%] flex flex-col justify-center px-5 sm:px-8 py-6 pointer-events-none">
            <AnimatePresence mode="wait">

              {/* STAGE 1 — Hero intro */}
              {currentStage === 1 && (
                <motion.div key="s1" variants={PANEL_VARIANTS} initial="hidden" animate="visible" exit="exit"
                  className="pointer-events-auto">
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-cyan-950/70 border border-cyan-500/30 text-cyan-300 font-mono text-[10px] uppercase tracking-widest mb-5">
                    <Sparkles className="w-3 h-3 text-cyan-400" />
                    AI-POWERED INCIDENT INTELLIGENCE
                  </div>
                  <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-[1.08] mb-4">
                    Understand<br />what happened.
                    <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-300 to-blue-500">
                      Automatically.
                    </span>
                  </h1>
                  <p className="text-sm sm:text-base text-gray-300 mb-8 leading-relaxed max-w-sm">
                    Transform raw surveillance footage into a clear, chronological reconstruction of any incident — automatically.
                  </p>
                  <div className="flex flex-wrap gap-3">
                    <button
                      onClick={() => selectStage(2)}
                      className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-semibold rounded-lg shadow-[0_0_22px_rgba(6,182,212,0.45)] transition-all flex items-center gap-2 group cursor-pointer text-sm"
                    >
                      See It In Action
                      <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                    <Link
                      href="/investigate"
                      className="px-6 py-3 bg-black/60 hover:bg-black/80 border border-cyan-500/30 hover:border-cyan-400/60 text-white font-medium rounded-lg backdrop-blur-md transition-all flex items-center gap-2 text-sm"
                    >
                      Upload Footage
                      <ArrowRight className="w-4 h-4 text-cyan-400" />
                    </Link>
                  </div>
                </motion.div>
              )}

              {/* STAGE 2 — Target detected */}
              {currentStage === 2 && (
                <motion.div key="s2" variants={PANEL_VARIANTS} initial="hidden" animate="visible" exit="exit"
                  className="pointer-events-auto bg-black/70 border border-cyan-500/40 backdrop-blur-xl p-5 rounded-2xl shadow-2xl max-w-sm">
                  <div className="flex items-center justify-between border-b border-cyan-500/20 pb-3 mb-4">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
                      <span className="font-mono text-xs font-bold text-red-400">REC [CAM-01 ACTIVE]</span>
                    </div>
                    <span className="font-mono text-[10px] text-gray-400">10:42:11.240 UTC</span>
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">Target Entity Detected</h3>
                  <p className="text-xs text-gray-300 mb-4 leading-relaxed">
                    Subject P-109 enters the parking corridor. Autonomous spatial tracking initiated across calibrated coordinate grid.
                  </p>
                  <div className="bg-black/60 p-3 rounded-xl border border-white/5 font-mono text-xs space-y-2 mb-5">
                    {[["Entity ID", "SUBJECT_P-109", "text-cyan-400"], ["Velocity", "1.24 m/s (142°)", "text-white"], ["Re-ID Confidence", "98.4%", "text-emerald-400"]].map(([k, v, c]) => (
                      <div key={k} className="flex justify-between text-gray-400">
                        <span>{k}:</span><span className={`font-semibold ${c}`}>{v}</span>
                      </div>
                    ))}
                  </div>
                  <button onClick={() => selectStage(3)} className="text-[11px] font-mono text-cyan-400 hover:text-cyan-300 flex items-center gap-1.5 cursor-pointer">
                    Multi-Camera Analysis <ArrowRight className="w-3 h-3" />
                  </button>
                </motion.div>
              )}

              {/* STAGE 3 — Multi-camera */}
              {currentStage === 3 && (
                <motion.div key="s3" variants={PANEL_VARIANTS} initial="hidden" animate="visible" exit="exit"
                  className="pointer-events-auto bg-black/70 border border-cyan-500/40 backdrop-blur-xl p-5 rounded-2xl shadow-2xl max-w-sm">
                  <div className="flex items-center gap-2 mb-1">
                    <Crosshair className="w-3.5 h-3.5 text-cyan-400" />
                    <span className="font-mono text-[10px] text-cyan-400 uppercase tracking-wider">ONE INCIDENT. MULTIPLE ANGLES.</span>
                  </div>
                  <h3 className="text-lg font-bold text-white mb-4">Multi-Camera Correlation</h3>
                  <div className="grid grid-cols-2 gap-2 mb-4">
                    {CAMERAS.map((cam) => (
                      <button
                        key={cam.id}
                        onClick={() => setSelectedCam(cam.id)}
                        className={`p-2.5 rounded-xl text-left transition-all border cursor-pointer ${
                          selectedCam === cam.id
                            ? "bg-cyan-950/60 border-cyan-400 shadow-[0_0_12px_rgba(6,182,212,0.35)]"
                            : "bg-black/40 border-white/10 hover:border-white/20"
                        }`}
                      >
                        <div className="font-mono text-[10px] font-bold text-cyan-400 mb-0.5">{cam.name}</div>
                        <div className="text-[11px] font-semibold text-white">{cam.label}</div>
                        <div className="font-mono text-[9px] text-gray-400">{cam.time}</div>
                      </button>
                    ))}
                  </div>
                  <button onClick={() => selectStage(4)}
                    className="w-full px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-black font-semibold text-xs rounded-lg transition-colors font-mono cursor-pointer">
                    Extract Events →
                  </button>
                </motion.div>
              )}

              {/* STAGE 4 — Event timeline */}
              {currentStage === 4 && (
                <motion.div key="s4" variants={PANEL_VARIANTS} initial="hidden" animate="visible" exit="exit"
                  className="pointer-events-auto bg-black/70 border border-cyan-500/40 backdrop-blur-xl p-5 rounded-2xl shadow-2xl max-w-sm">
                  <div className="flex items-center justify-between border-b border-cyan-500/20 pb-3 mb-4">
                    <div>
                      <span className="font-mono text-[10px] text-cyan-400 uppercase tracking-wider">STRUCTURED INTELLIGENCE</span>
                      <h3 className="text-lg font-bold text-white">Event Extraction</h3>
                    </div>
                    <Clock className="w-4 h-4 text-cyan-400" />
                  </div>
                  <div className="space-y-2 relative pl-4 border-l border-cyan-500/30 mb-4">
                    {TIMELINE_EVENTS.map((ev, i) => (
                      <div key={i} className="relative">
                        <div className={`absolute -left-[21px] top-1.5 w-2.5 h-2.5 rounded-full border-2 border-black ${ev.type === "incident" ? "bg-red-500 animate-pulse" : "bg-cyan-400"}`} />
                        <div className="bg-black/50 px-2.5 py-2 rounded-lg border border-white/8 flex items-center justify-between gap-2">
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className="font-mono text-[10px] font-semibold text-cyan-300">{ev.time}</span>
                              <span className="text-gray-500 font-mono text-[9px]">[{ev.cam}]</span>
                            </div>
                            <p className="text-xs font-medium text-white mt-0.5">{ev.text}</p>
                          </div>
                          <span className={`font-mono text-[9px] px-1.5 py-0.5 rounded uppercase font-semibold shrink-0 ${ev.type === "incident" ? "bg-red-900/50 text-red-300 border border-red-500/40" : "bg-cyan-950/50 text-cyan-300 border border-cyan-500/30"}`}>
                            {ev.badge}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                  <button onClick={() => selectStage(5)}
                    className="w-full px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-black font-semibold text-xs rounded-lg transition-colors font-mono cursor-pointer">
                    Generate 3D Reconstruction →
                  </button>
                </motion.div>
              )}

              {/* STAGE 5 — AI pipeline */}
              {currentStage === 5 && (
                <motion.div key="s5" variants={PANEL_VARIANTS} initial="hidden" animate="visible" exit="exit"
                  className="pointer-events-auto bg-black/70 border border-cyan-500/40 backdrop-blur-xl p-5 rounded-2xl shadow-2xl max-w-sm">
                  <div className="inline-flex items-center gap-2 px-2.5 py-1 bg-cyan-950/60 border border-cyan-500/30 text-cyan-300 font-mono text-[10px] uppercase rounded-full mb-3">
                    <Layers className="w-3 h-3 text-cyan-400" />
                    SPATIO-TEMPORAL REASONING
                  </div>
                  <h2 className="text-xl font-bold text-white mb-2">From Footage to Understanding</h2>
                  <p className="text-xs text-gray-300 mb-4 leading-relaxed">
                    Multi-camera streams synthesized into continuous geometric trajectories, causal relationships, and verifiable evidence.
                  </p>
                  <div className="grid grid-cols-5 gap-1.5 mb-5">
                    {[["01","Raw Feed"],["02","Vision AI"],["03","Tracking"],["04","Reasoning"],["05","Report"]].map(([step, name], i) => (
                      <div key={i} className="bg-black/50 p-2 rounded-lg border border-cyan-500/20 text-center">
                        <div className="font-mono text-[9px] text-cyan-400 font-bold">{step}</div>
                        <div className="text-[9px] font-semibold text-white leading-tight mt-0.5">{name}</div>
                      </div>
                    ))}
                  </div>
                  <button onClick={() => selectStage(6)}
                    className="w-full px-4 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-semibold text-xs rounded-lg font-mono cursor-pointer">
                    View Incident Dossier →
                  </button>
                </motion.div>
              )}

              {/* STAGE 6 — Incident report */}
              {currentStage === 6 && (
                <motion.div key="s6" variants={PANEL_VARIANTS} initial="hidden" animate="visible" exit="exit"
                  className="pointer-events-auto bg-black/70 border border-cyan-500/40 backdrop-blur-xl p-5 rounded-2xl shadow-2xl max-w-sm">
                  <div className="flex items-center gap-2 mb-1">
                    <ShieldCheck className="w-4 h-4 text-cyan-400" />
                    <span className="font-mono text-[10px] uppercase tracking-widest text-cyan-400">INCIDENT DOSSIER</span>
                  </div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-white">Vehicle-Pedestrian Incident</h3>
                    <div className="bg-cyan-950/70 border border-cyan-500/30 px-2.5 py-1 rounded-lg text-right shrink-0">
                      <div className="text-[9px] font-mono text-gray-400 uppercase">Confidence</div>
                      <div className="font-mono text-base font-bold text-cyan-300">91.4%</div>
                    </div>
                  </div>
                  <div className="bg-black/50 p-3 rounded-xl border border-white/8 mb-3">
                    <div className="font-mono text-[9px] text-gray-400 mb-1 flex items-center gap-1.5">
                      <Eye className="w-3 h-3 text-cyan-400" /> AI SYNTHESIS:
                    </div>
                    <p className="text-xs text-gray-200 leading-relaxed">
                      "A person approached a parked vehicle. The vehicle subsequently reversed, after which the person fell. A witness arrived several seconds later."
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-2 mb-4">
                    <div className="bg-black/40 p-2.5 rounded-xl border border-emerald-500/20">
                      <div className="flex items-center gap-1.5 text-emerald-400 font-mono text-[9px] font-bold uppercase mb-1.5">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> Observed Facts
                      </div>
                      <ul className="text-[10px] text-gray-300 space-y-1 list-disc list-inside">
                        <li>P-109 walked to vehicle</li>
                        <li>V-442 reversed at 10:42:19</li>
                        <li>P-109 fell at 10:42:21</li>
                        <li>P-110 arrived at 10:42:25</li>
                      </ul>
                    </div>
                    <div className="bg-black/40 p-2.5 rounded-xl border border-cyan-500/20">
                      <div className="flex items-center gap-1.5 text-cyan-400 font-mono text-[9px] font-bold uppercase mb-1.5">
                        <div className="w-1.5 h-1.5 rounded-full bg-cyan-400" /> AI Inference
                      </div>
                      <ul className="text-[10px] text-gray-300 space-y-1 list-disc list-inside">
                        <li>Contact probable (89%)</li>
                        <li>Visibility impaired</li>
                        <li>Path not cleared</li>
                      </ul>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => selectStage(1)}
                      className="flex items-center gap-1.5 px-3 py-2 bg-transparent hover:bg-white/5 text-gray-300 font-mono text-[10px] rounded border border-white/10 cursor-pointer">
                      <RotateCcw className="w-3 h-3" /> Replay
                    </button>
                    <Link href="/investigate"
                      className="flex-1 text-center px-3 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-semibold text-[10px] rounded-lg font-mono flex items-center justify-center gap-1.5">
                      Open Studio <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </motion.div>
              )}

            </AnimatePresence>
          </div>

          {/* ── RIGHT SIDE: spacer so scene is visible ─────────────────── */}
          <div className="hidden md:flex flex-1 items-end justify-end pr-6 pb-8 pointer-events-none">
            {/* Floating stage label bottom-right */}
            <div className="flex flex-col items-end gap-1 pointer-events-none select-none">
              <span className="font-mono text-[10px] text-gray-500 uppercase tracking-widest">
                STAGE {currentStage} / 6
              </span>
              <span className="font-mono text-xs text-cyan-400 font-semibold uppercase">
                {STAGES[currentStage - 1].title}
              </span>
            </div>
          </div>
        </div>

        {/* ── BOTTOM SCRUBBER BAR ──────────────────────────────────────── */}
        <div className="px-5 sm:px-8 pb-7 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="font-mono text-[10px] text-gray-500">STAGE {currentStage} OF 6</span>
            <span className="font-mono text-[10px] text-cyan-400 uppercase font-semibold">{STAGES[currentStage - 1].title}</span>
          </div>
          {/* Progress track */}
          <div className="flex items-center gap-1.5 w-full sm:w-auto">
            {STAGES.map((s) => (
              <button
                key={s.id}
                onClick={() => selectStage(s.id)}
                title={s.title}
                className="flex-1 sm:w-20 h-1 rounded-full overflow-hidden bg-white/10 relative cursor-pointer group"
              >
                <div className={`h-full rounded-full transition-all duration-500 ${currentStage >= s.id ? "bg-cyan-400" : "bg-transparent group-hover:bg-white/20"}`} />
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
