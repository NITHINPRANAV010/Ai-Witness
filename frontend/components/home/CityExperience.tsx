"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ShieldCheck,
  ChevronRight,
  ArrowRight,
  Clock,
  Sparkles,
  Layers,
  Crosshair,
  Play,
  RotateCcw,
} from "lucide-react";
import CityCanvas from "./CityCanvas";

const STAGES = [
  { id: 1, label: "01", title: "Wide Metropolitan Environment" },
  { id: 2, label: "02", title: "Target Approach & Detection" },
  { id: 3, label: "03", title: "Spatially-Consistent Perspectives" },
  { id: 4, label: "04", title: "Structured Chronological Sequence" },
  { id: 5, label: "05", title: "Spatial Trajectory & Reasoning" },
  { id: 6, label: "06", title: "Executive Intelligence Dossier" },
];

const CAMERAS = [
  { id: 1, name: "CAM-01", label: "North Entrance", desc: "Person enters parking corridor", time: "10:42:11" },
  { id: 2, name: "CAM-02", label: "Parking Bay 04", desc: "Person approaches vehicle driver side", time: "10:42:16" },
  { id: 3, name: "CAM-03", label: "Street East", desc: "Vehicle begins sudden reverse motion", time: "10:42:19" },
  { id: 4, name: "CAM-04", label: "Rooftop High", desc: "Person falls; witness approaches", time: "10:42:21" },
];

const TIMELINE_EVENTS = [
  { time: "10:42:11", text: "Person enters area", badge: "P-109 DETECTED", cam: "CAM-01", type: "entry" },
  { time: "10:42:16", text: "Person approaches vehicle", badge: "PROXIMITY ALERT", cam: "CAM-02", type: "approach" },
  { time: "10:42:19", text: "Vehicle moves", badge: "V-442 ACCELERATING", cam: "CAM-03", type: "action" },
  { time: "10:42:21", text: "Person falls", badge: "IMPACT / COLLAPSE", cam: "CAM-04", type: "incident" },
  { time: "10:42:25", text: "Another person arrives", badge: "P-110 WITNESS ARRIVAL", cam: "CAM-01", type: "response" },
];

export default function CityExperience() {
  const [currentStage, setCurrentStage] = useState<number>(1);
  const [selectedCam, setSelectedCam] = useState<number>(1);
  const [isPlaying, setIsPlaying] = useState<boolean>(false); // default manual control so user and subagent can inspect freely
  const experienceContainerRef = useRef<HTMLDivElement>(null);

  // Auto-play cycle if user activates it
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setCurrentStage((prev) => (prev >= 6 ? 1 : prev + 1));
    }, 5500);
    return () => clearInterval(interval);
  }, [isPlaying]);

  const selectStage = (stageId: number) => {
    setIsPlaying(false);
    setCurrentStage(stageId);
  };

  return (
    <section
      ref={experienceContainerRef}
      id="hero"
      className="relative min-h-screen w-full bg-[#04070D] text-white flex flex-col justify-between overflow-hidden"
    >
      {/* 3D City Viewport (Full width & height background) */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <CityCanvas
          stage={currentStage}
          scrollProgress={(currentStage - 1) / 5}
          selectedCamera={selectedCam}
        />
      </div>

      {/* Top HUD Telemetry Bar */}
      <div className="relative z-20 pt-24 px-4 sm:px-8 max-w-7xl mx-auto w-full flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3 bg-[#060A10]/80 border border-cyan-500/20 backdrop-blur-md px-4 py-2 rounded-full shadow-lg">
          <span className="flex h-2.5 w-2.5 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyan-500"></span>
          </span>
          <span className="font-mono text-xs tracking-wider text-cyan-300">
            METROPOLITAN SECTOR 04 — SURVEILLANCE GRID ACTIVE
          </span>
          <span className="hidden sm:inline-block text-gray-500 font-mono text-xs">|</span>
          <span className="hidden sm:inline-block font-mono text-xs text-gray-400">4 CAMERAS SYNCHRONIZED</span>
        </div>

        {/* Interactive Stage Selector Controls */}
        <div className="flex items-center gap-2 bg-[#060A10]/90 border border-white/10 backdrop-blur-md px-3 py-1.5 rounded-lg shadow-2xl">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="px-2 py-1 text-xs font-mono flex items-center gap-1.5 text-gray-300 hover:text-white transition-colors border-r border-white/10 pr-3 mr-1 cursor-pointer"
            title={isPlaying ? "Pause automated cycle" : "Resume automated cycle"}
          >
            {isPlaying ? (
              <>
                <span className="w-2 h-2 bg-cyan-400 rounded-sm animate-pulse" /> Pause
              </>
            ) : (
              <>
                <Play className="w-3 h-3 text-cyan-400 fill-cyan-400" /> Auto Cycle
              </>
            )}
          </button>

          <div className="flex items-center gap-1">
            {STAGES.map((stg) => (
              <button
                key={stg.id}
                onClick={() => selectStage(stg.id)}
                className={`px-2.5 py-1 text-xs font-mono rounded transition-all cursor-pointer ${
                  currentStage === stg.id
                    ? "bg-cyan-500 text-black font-bold shadow-[0_0_12px_rgba(6,182,212,0.7)]"
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                }`}
                title={stg.title}
              >
                0{stg.id}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Center Dynamic Stage Overlays */}
      <div className="relative z-20 px-4 sm:px-8 max-w-7xl mx-auto w-full my-auto py-8">
        {/* ─────────────────────────────────────────────────────────────
            STAGE 1 — HERO / WIDE CITY OVERVIEW
           ───────────────────────────────────────────────────────────── */}
        {currentStage === 1 && (
          <motion.div
            key="stage-1"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="max-w-3xl"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded bg-cyan-950/60 border border-cyan-500/30 text-cyan-300 font-mono text-xs uppercase tracking-widest mb-6">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              AI-POWERED INCIDENT INTELLIGENCE
            </div>

            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-white leading-[1.08] mb-6">
              Understand what happened.
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-300 to-blue-500">
                Automatically.
              </span>
            </h1>

            <p className="text-lg sm:text-xl text-gray-300 mb-10 max-w-2xl font-normal leading-relaxed">
              Transform hours of raw surveillance footage into a clear, chronological and explainable reconstruction of an incident.
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <button
                onClick={() => selectStage(2)}
                className="px-7 py-3.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-semibold rounded-lg shadow-[0_0_24px_rgba(6,182,212,0.4)] transition-all flex items-center gap-2 group cursor-pointer"
              >
                <span>See It In Action</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <Link
                href="/investigate"
                className="px-7 py-3.5 bg-[#0A1017]/80 hover:bg-[#131E2B] border border-cyan-500/30 hover:border-cyan-400/60 text-white font-medium rounded-lg backdrop-blur-md transition-all flex items-center gap-2 cursor-pointer"
              >
                <span>Upload Footage</span>
                <ArrowRight className="w-4 h-4 text-cyan-400" />
              </Link>
            </div>
          </motion.div>
        )}

        {/* ─────────────────────────────────────────────────────────────
            STAGE 2 — CAMERA LOCK / ACTIVE TRACKING
           ───────────────────────────────────────────────────────────── */}
        {currentStage === 2 && (
          <motion.div
            key="stage-2"
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.35 }}
            className="max-w-md bg-[#060A11]/90 border border-cyan-500/40 backdrop-blur-xl p-6 rounded-2xl shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-cyan-500/20 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
                <span className="font-mono text-xs font-bold text-red-400">REC [CAM-01 ACTIVE]</span>
              </div>
              <span className="font-mono text-xs text-gray-400">10:42:11.240 UTC</span>
            </div>

            <h3 className="text-xl font-bold text-white mb-2">Target Entity Detected</h3>
            <p className="text-sm text-gray-300 mb-5 leading-relaxed">
              Surveillance node locks onto Subject P-109 entering the parking corridor. Autonomous spatial tracking initiated across calibrated coordinate grid.
            </p>

            <div className="space-y-2 bg-[#0A111A] p-3.5 rounded-xl border border-white/5 font-mono text-xs">
              <div className="flex justify-between text-gray-400">
                <span>Entity ID:</span>
                <span className="text-cyan-400 font-semibold">SUBJECT_P-109</span>
              </div>
              <div className="flex justify-between text-gray-400">
                <span>Velocity:</span>
                <span className="text-white">1.24 m/s (Bearing 142°)</span>
              </div>
              <div className="flex justify-between text-gray-400">
                <span>Re-ID Confidence:</span>
                <span className="text-emerald-400 font-semibold">98.4%</span>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-between">
              <button
                onClick={() => selectStage(3)}
                className="text-xs font-mono text-cyan-400 hover:text-cyan-300 flex items-center gap-1.5 cursor-pointer"
              >
                Continue to Multi-Camera Analysis <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </motion.div>
        )}

        {/* ─────────────────────────────────────────────────────────────
            STAGE 3 — MULTI-CAMERA CORRELATION
           ───────────────────────────────────────────────────────────── */}
        {currentStage === 3 && (
          <motion.div
            key="stage-3"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="max-w-4xl bg-[#060A11]/95 border border-cyan-500/40 backdrop-blur-xl p-6 sm:p-7 rounded-2xl shadow-2xl"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-cyan-500/20 pb-4 mb-6">
              <div>
                <div className="font-mono text-xs text-cyan-400 tracking-wider uppercase mb-1">
                  ONE INCIDENT. MULTIPLE ANGLES.
                </div>
                <h3 className="text-2xl font-bold text-white">Spatially-Consistent Multi-Angle Correlation</h3>
              </div>
              <div className="flex items-center gap-2 bg-black/40 px-3 py-1.5 rounded border border-white/10 font-mono text-xs text-gray-300">
                <Crosshair className="w-3.5 h-3.5 text-cyan-400" />
                <span>SYNCHRONIZED PERSPECTIVES</span>
              </div>
            </div>

            {/* 4 Camera Switcher Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
              {CAMERAS.map((cam) => (
                <button
                  key={cam.id}
                  onClick={() => setSelectedCam(cam.id)}
                  className={`p-3.5 rounded-xl text-left transition-all border cursor-pointer ${
                    selectedCam === cam.id
                      ? "bg-cyan-950/60 border-cyan-400 shadow-[0_0_16px_rgba(6,182,212,0.35)]"
                      : "bg-[#090F17]/80 border-white/10 hover:border-white/20 hover:bg-[#0E1724]"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono text-xs font-bold text-cyan-400">{cam.name}</span>
                    <span className="font-mono text-[10px] text-gray-400">{cam.time}</span>
                  </div>
                  <div className="text-xs font-semibold text-white mb-1">{cam.label}</div>
                  <p className="text-[11px] text-gray-400 line-clamp-2">{cam.desc}</p>
                </button>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-[#090F17] p-4 rounded-xl border border-white/5">
              <div className="flex items-center gap-3 text-xs text-gray-300">
                <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
                <span>Camera viewpoints switch in real-time while maintaining strict spatial alignment with the 3D scene.</span>
              </div>
              <button
                onClick={() => selectStage(4)}
                className="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-black font-semibold text-xs rounded-lg transition-colors font-mono shrink-0 cursor-pointer"
              >
                Extract Events →
              </button>
            </div>
          </motion.div>
        )}

        {/* ─────────────────────────────────────────────────────────────
            STAGE 4 — STRUCTURED EVENT EXTRACTION
           ───────────────────────────────────────────────────────────── */}
        {currentStage === 4 && (
          <motion.div
            key="stage-4"
            initial={{ opacity: 0, x: -15 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.35 }}
            className="max-w-xl bg-[#060A11]/95 border border-cyan-500/40 backdrop-blur-xl p-6 sm:p-7 rounded-2xl shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-cyan-500/20 pb-3 mb-5">
              <div>
                <span className="font-mono text-xs text-cyan-400 uppercase tracking-wider">STRUCTURED INTELLIGENCE</span>
                <h3 className="text-2xl font-bold text-white">Event Extraction & Sequencing</h3>
              </div>
              <Clock className="w-5 h-5 text-cyan-400" />
            </div>

            {/* Sequential Event Timeline */}
            <div className="space-y-3 relative pl-4 border-l border-cyan-500/30 mb-6">
              {TIMELINE_EVENTS.map((ev, index) => (
                <div key={index} className="relative group">
                  <div
                    className={`absolute -left-[21px] top-1.5 w-2.5 h-2.5 rounded-full border-2 border-[#060A11] ${
                      ev.type === "incident" ? "bg-red-500 animate-pulse" : "bg-cyan-400"
                    }`}
                  />
                  <div className="bg-[#090F17] p-3 rounded-lg border border-white/10 flex items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-semibold text-cyan-300">{ev.time}</span>
                        <span className="text-gray-500 font-mono text-[10px]">[{ev.cam}]</span>
                      </div>
                      <p className="text-sm font-medium text-white mt-0.5">{ev.text}</p>
                    </div>
                    <span
                      className={`font-mono text-[10px] px-2 py-0.5 rounded uppercase font-semibold ${
                        ev.type === "incident"
                          ? "bg-red-900/40 text-red-300 border border-red-500/40"
                          : "bg-cyan-950/50 text-cyan-300 border border-cyan-500/30"
                      }`}
                    >
                      {ev.badge}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-400 font-mono">5 key events extracted from 4 synchronous angles</span>
              <button
                onClick={() => selectStage(5)}
                className="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-black font-semibold text-xs rounded-lg transition-colors font-mono cursor-pointer"
              >
                Generate 3D Reconstruction →
              </button>
            </div>
          </motion.div>
        )}

        {/* ─────────────────────────────────────────────────────────────
            STAGE 5 — AI RECONSTRUCTION PIPELINE
           ───────────────────────────────────────────────────────────── */}
        {currentStage === 5 && (
          <motion.div
            key="stage-5"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.35 }}
            className="max-w-2xl bg-[#060A11]/95 border border-cyan-500/40 backdrop-blur-xl p-7 rounded-2xl shadow-2xl mx-auto text-center"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-cyan-950/60 border border-cyan-500/30 text-cyan-300 font-mono text-xs uppercase rounded-full mb-4">
              <Layers className="w-3.5 h-3.5 text-cyan-400" />
              SPATIO-TEMPORAL REASONING
            </div>

            <h2 className="text-3xl font-bold text-white mb-2">FROM FOOTAGE TO UNDERSTANDING</h2>
            <p className="text-sm text-gray-300 mb-8 max-w-lg mx-auto leading-relaxed">
              Multi-camera sensor streams are synthesized into continuous geometric trajectory paths, causal relationships, and verifiable evidence.
            </p>

            {/* 5-Step Pipeline Flow */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 mb-8">
              {[
                { step: "01", name: "Raw Footage", sub: "Multi-Feed Ingest" },
                { step: "02", name: "Vision AI", sub: "Object Detection" },
                { step: "03", name: "Tracking", sub: "Re-ID & Vectors" },
                { step: "04", name: "Event Reason", sub: "Causal Logic" },
                { step: "05", name: "Reconstruction", sub: "Timeline & Report" },
              ].map((p, idx) => (
                <div key={idx} className="bg-[#090F17] p-3 rounded-xl border border-cyan-500/20 text-center relative">
                  <div className="font-mono text-[10px] text-cyan-400 font-bold mb-1">{p.step}</div>
                  <div className="text-xs font-semibold text-white">{p.name}</div>
                  <div className="text-[10px] text-gray-400">{p.sub}</div>
                </div>
              ))}
            </div>

            <button
              onClick={() => selectStage(6)}
              className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-semibold text-sm rounded-lg shadow-lg font-mono cursor-pointer"
            >
              View Incident Dossier Report →
            </button>
          </motion.div>
        )}

        {/* ─────────────────────────────────────────────────────────────
            STAGE 6 — FINAL EXECUTIVE INCIDENT REPORT
           ───────────────────────────────────────────────────────────── */}
        {currentStage === 6 && (
          <motion.div
            key="stage-6"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="max-w-3xl bg-[#060A11]/95 border border-cyan-500/40 backdrop-blur-2xl p-6 sm:p-8 rounded-2xl shadow-2xl"
          >
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-cyan-500/20 pb-4 mb-6">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <ShieldCheck className="w-4 h-4 text-cyan-400" />
                  <span className="font-mono text-xs uppercase tracking-widest text-cyan-400">
                    INCIDENT RECONSTRUCTION DOSSIER
                  </span>
                </div>
                <h3 className="text-2xl font-bold text-white">Possible Vehicle-Pedestrian Incident</h3>
              </div>

              <div className="flex items-center gap-3">
                <div className="bg-cyan-950/70 border border-cyan-500/30 px-3.5 py-1.5 rounded-lg text-right">
                  <div className="text-[10px] font-mono text-gray-400 uppercase">AI Confidence</div>
                  <div className="font-mono text-lg font-bold text-cyan-300">91.4%</div>
                </div>
              </div>
            </div>

            {/* Narrative Analysis */}
            <div className="bg-[#090F17] p-4 rounded-xl border border-white/10 mb-6">
              <div className="font-mono text-xs text-gray-400 mb-1.5 flex items-center gap-1.5">
                <Crosshair className="w-3.5 h-3.5 text-cyan-400" /> AI SYNTHESIS & CAUSAL ANALYSIS:
              </div>
              <p className="text-sm sm:text-base text-gray-200 font-normal leading-relaxed">
                &ldquo;A person approached a parked vehicle. The vehicle subsequently moved, after which the person fell. Another individual arrived several seconds later.&rdquo;
              </p>
            </div>

            {/* Strict Separation of Observed Facts vs AI Inference */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              <div className="bg-[#080D14] p-4 rounded-xl border border-emerald-500/20">
                <div className="flex items-center gap-2 text-emerald-400 font-mono text-xs font-bold uppercase mb-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-400" />
                  OBSERVED FACTS (GROUND TRUTH)
                </div>
                <ul className="text-xs text-gray-300 space-y-1.5 list-disc list-inside">
                  <li>Subject P-109 walked to vehicle driver-side window at 10:42:16</li>
                  <li>Vehicle V-442 wheels rotated backwards at 10:42:19</li>
                  <li>Subject P-109 posture shifted from standing to ground contact at 10:42:21</li>
                  <li>Subject P-110 arrived on scene at 10:42:25</li>
                </ul>
              </div>

              <div className="bg-[#080D14] p-4 rounded-xl border border-cyan-500/20">
                <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs font-bold uppercase mb-2">
                  <div className="w-2 h-2 rounded-full bg-cyan-400" />
                  AI INFERENCE (PROBABILISTIC)
                </div>
                <ul className="text-xs text-gray-300 space-y-1.5 list-disc list-inside">
                  <li>Contact between rear bumper corner and lower extremity probable (89% likelihood)</li>
                  <li>Movement of vehicle initiated before pedestrian completed path clearance</li>
                  <li>Driver visibility impaired by Pillar B angle at current parking orientation</li>
                </ul>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="flex flex-wrap items-center justify-between gap-4 border-t border-white/10 pt-4">
              <div className="flex items-center gap-2 font-mono text-xs text-gray-400">
                <span>Incident ID: INC-2024-8842</span>
                <span>•</span>
                <span>4 Feeds Verified</span>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => selectStage(1)}
                  className="px-4 py-2 bg-transparent hover:bg-white/5 text-gray-300 font-mono text-xs rounded border border-white/10 flex items-center gap-1.5 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" /> Replay Cycle
                </button>
                <Link
                  href="/investigate"
                  className="px-5 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-semibold text-xs rounded-lg font-mono flex items-center gap-1.5 shadow-lg cursor-pointer"
                >
                  Open Investigation Studio <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Bottom Stage Scrubber & Navigation */}
      <div className="relative z-20 pb-8 px-4 sm:px-8 max-w-7xl mx-auto w-full flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <span className="font-mono text-xs text-gray-400">STAGE {currentStage} OF 6</span>
          <span className="font-mono text-xs text-cyan-300 font-semibold uppercase">
            {STAGES[currentStage - 1].title}
          </span>
        </div>

        {/* Visual Stage Progress Indicators */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          {STAGES.map((s) => (
            <button
              key={s.id}
              onClick={() => selectStage(s.id)}
              className="flex-1 sm:w-24 h-1.5 rounded-full overflow-hidden bg-white/10 relative transition-all cursor-pointer"
              title={s.title}
            >
              <div
                className={`h-full transition-all duration-300 ${
                  currentStage >= s.id ? "bg-cyan-400" : "bg-transparent"
                }`}
              />
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
