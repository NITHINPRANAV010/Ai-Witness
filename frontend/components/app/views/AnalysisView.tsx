"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type {
  Investigation,
  IncidentEvent,
  ChatMessage,
  EvidenceReference,
} from "@/lib/types";
import {
  MOCK_EVENTS,
  MOCK_MULTI_CAM_LINKS,
  MOCK_CHAT_MESSAGES,
  fetchChatResponse,
  getDetectionsAtTime,
} from "@/lib/mockData";

interface AnalysisViewProps {
  investigation: Investigation;
  onNavigateTab: (tab: any) => void;
  seekTargetMs?: number | null;
}

export default function AnalysisView({
  investigation,
  onNavigateTab,
  seekTargetMs,
}: AnalysisViewProps) {
  // Global synchronized playback time: 0 to 30 seconds
  // 0s = 10:42:00, 30s = 10:42:30
  const [currentSec, setCurrentSec] = useState<number>(11); // Start at Person #01 entrance
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const [activeCamId, setActiveCamId] = useState<string>("cam-01");
  const [selectedEventId, setSelectedEventId] = useState<string>("evt-01");
  const [activeSubTab, setActiveSubTab] = useState<"timeline" | "correlation" | "reconstruction">("timeline");
  const [showCorrelationOverlay, setShowCorrelationOverlay] = useState<boolean>(true);

  // Gemini Chat state
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(MOCK_CHAT_MESSAGES);
  const [chatInput, setChatInput] = useState<string>("");
  const [isAiLoading, setIsAiLoading] = useState<boolean>(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Playback timer effect
  useEffect(() => {
    let interval: any = null;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentSec((prev) => {
          if (prev >= 30) {
            setIsPlaying(false);
            return 30;
          }
          return +(prev + 0.1 * playbackSpeed).toFixed(2);
        });
      }, 100);
    }
    return () => clearInterval(interval);
  }, [isPlaying, playbackSpeed]);

  // Handle external seek target
  useEffect(() => {
    if (seekTargetMs !== undefined && seekTargetMs !== null) {
      const sec = seekTargetMs / 1000;
      setCurrentSec(sec);
    }
  }, [seekTargetMs]);

  // Convert currentSec to formatted timecode 10:42:SS.ms
  const formatTimecode = (sec: number) => {
    const totalSeconds = Math.floor(sec);
    const ms = Math.floor((sec - totalSeconds) * 1000);
    const s = (totalSeconds % 60).toString().padStart(2, "0");
    const msStr = ms.toString().padStart(3, "0").slice(0, 2);
    return `10:42:${s}.${msStr}`;
  };

  // Seek to specific event
  const handleSeekEvent = (evt: IncidentEvent) => {
    setSelectedEventId(evt.id);
    setActiveCamId(evt.cameraId);
    const sec = evt.timestampMs / 1000;
    setCurrentSec(sec);
    setIsPlaying(false);
  };

  // Seek from evidence reference
  const handleEvidenceClick = (ref: EvidenceReference) => {
    setActiveCamId(ref.cameraId);
    const sec = ref.timestampMs / 1000;
    setCurrentSec(sec);
    setIsPlaying(false);
  };

  // Gemini message submit
  const handleSendChat = async (questionText?: string) => {
    const q = questionText || chatInput;
    if (!q.trim() || isAiLoading) return;

    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      role: "user",
      content: q,
      timestamp: new Date().toLocaleTimeString("en-GB", { hour12: false }),
    };

    setChatMessages((prev) => [...prev, userMsg]);
    if (!questionText) setChatInput("");
    setIsAiLoading(true);

    try {
      const reply = await fetchChatResponse(investigation.id, q);
      setChatMessages((prev) => [...prev, reply]);
    } catch (err) {
      console.error(err);
    } finally {
      setIsAiLoading(false);
      setTimeout(() => chatEndRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
    }
  };

  const pipelineStages = [
    { label: "Video Ingestion", status: "complete", icon: "📥" },
    { label: "Object Detection", status: "complete", icon: "🎯" },
    { label: "Tracking (ByteTrack)", status: "complete", icon: "🔄" },
    { label: "Event Extraction", status: "complete", icon: "⚡" },
    { label: "Camera Correlation", status: "complete", icon: "🔗" },
    { label: "AI Reasoning (Gemini)", status: "complete", icon: "🧠" },
    { label: "Reconstruction", status: "complete", icon: "📊" },
  ];

  const cameras = investigation.cameras;

  // Exact 5 priority events from prompt
  const priorityEvents = [
    { id: "evt-01", time: "10:42:11", label: "Person enters", cam: "CAM 01", camId: "cam-01", sec: 11, conf: 0.98, entity: "Person #01" },
    { id: "evt-02", time: "10:42:16", label: "Person approaches vehicle", cam: "CAM 02", camId: "cam-02", sec: 16, conf: 0.95, entity: "Person #01" },
    { id: "evt-03", time: "10:42:19", label: "Vehicle moves", cam: "CAM 03", camId: "cam-03", sec: 19, conf: 0.99, entity: "Vehicle #01" },
    { id: "evt-04", time: "10:42:21", label: "Person falls", cam: "CAM 04", camId: "cam-04", sec: 21, conf: 0.94, entity: "Person #01 (FALLEN)" },
    { id: "evt-05", time: "10:42:25", label: "Another person arrives", cam: "CAM 01", camId: "cam-01", sec: 25, conf: 0.97, entity: "Person #02" },
  ];

  return (
    <div className="flex flex-col h-[calc(100vh-56px)] overflow-hidden bg-neutral-950 text-neutral-200">
      {/* ── 1. Pipeline Status Header Bar ── */}
      <div className="px-6 py-2 border-b border-neutral-800/80 bg-neutral-900/70 backdrop-blur-md flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono font-bold">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            RECONSTRUCTION READY
          </div>

          <div className="hidden lg:flex items-center gap-1 text-[11px] font-mono">
            {pipelineStages.map((st, i) => (
              <React.Fragment key={st.label}>
                <span className="px-2 py-0.5 rounded bg-neutral-800 text-emerald-400 border border-emerald-500/20 font-medium">
                  {st.icon} {st.label}
                </span>
                {i < pipelineStages.length - 1 && (
                  <span className="text-neutral-600">→</span>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Priority Flow Step Shortcuts */}
        <div className="flex items-center gap-2 text-xs font-mono">
          <button
            onClick={() => setActiveSubTab("correlation")}
            className="px-2.5 py-1 rounded bg-neutral-800 hover:bg-neutral-700 text-neutral-300 transition-all"
          >
            🔗 Correlation
          </button>
          <button
            onClick={() => onNavigateTab("incidents")}
            className="px-2.5 py-1 rounded bg-amber-500/15 border border-amber-500/30 text-amber-400 hover:bg-amber-500/25 transition-all font-semibold"
          >
            🧠 AI Reconstruction →
          </button>
          <button
            onClick={() => onNavigateTab("reports")}
            className="px-2.5 py-1 rounded bg-neutral-800 hover:bg-neutral-700 text-neutral-200 transition-all"
          >
            📄 Report →
          </button>
        </div>
      </div>

      {/* ── 2. Core Body: 4-Camera Grid & Left Controls (70%) + Gemini Copilot (30%) ── */}
      <div className="flex-1 grid grid-cols-1 xl:grid-cols-12 overflow-hidden">
        {/* Left 8/12: 4-Feed Grid + Scrubber + Events */}
        <div className="xl:col-span-8 flex flex-col border-r border-neutral-800 overflow-hidden relative">
          
          {/* Multi-Camera Connection Overlay Banner */}
          <div className="px-4 py-1.5 bg-neutral-900/90 border-b border-neutral-800 flex items-center justify-between text-xs font-mono">
            <div className="flex items-center gap-2">
              <span className="text-amber-400 font-bold">ONE CONTINUOUS INCIDENT:</span>
              <span className="text-neutral-300 text-[11px] truncate">
                Person #01 & Vehicle #01 tracked continuously across 4 distinct physical viewpoints.
              </span>
            </div>
            <button
              onClick={() => setShowCorrelationOverlay(!showCorrelationOverlay)}
              className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase transition-all ${
                showCorrelationOverlay
                  ? "bg-amber-500 text-black shadow-[0_0_10px_rgba(245,158,11,0.3)]"
                  : "bg-neutral-800 text-neutral-400 hover:text-white"
              }`}
            >
              {showCorrelationOverlay ? "🔗 Correlation Links: ON" : "🔗 Links: OFF"}
            </button>
          </div>

          {/* 4 Camera Feeds in 2x2 Grid */}
          <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-2 p-3 bg-black overflow-y-auto relative">
            
            {/* Visual Cross-Camera Connecting Indicators (When Correlation Overlay is ON) */}
            {showCorrelationOverlay && (
              <div className="absolute inset-0 pointer-events-none z-20 flex items-center justify-center">
                <div className="px-3 py-1.5 rounded-full bg-neutral-950/90 border border-amber-500/40 text-amber-400 font-mono text-[10px] shadow-2xl flex items-center gap-2 backdrop-blur-md">
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                  <span>SPATIAL RE-ID ACTIVE · PERSISTENT IDENTITIES ACROSS CAMERAS</span>
                </div>
              </div>
            )}

            {cameras.map((cam) => {
              const detections = getDetectionsAtTime(cam.id, currentSec);
              const isFocused = activeCamId === cam.id;

              return (
                <div
                  key={cam.id}
                  onClick={() => setActiveCamId(cam.id)}
                  className={`relative rounded-lg overflow-hidden border transition-all cursor-pointer flex flex-col bg-neutral-900 group ${
                    isFocused
                      ? "border-amber-500 ring-2 ring-amber-500/30 shadow-[0_0_20px_rgba(245,158,11,0.25)]"
                      : "border-neutral-800 hover:border-neutral-700"
                  }`}
                  style={{ minHeight: "210px" }}
                >
                  {/* Camera Canvas Viewport */}
                  <div className="flex-1 relative bg-gradient-to-b from-neutral-950 to-neutral-900 overflow-hidden select-none">
                    {/* Perspective grid */}
                    <div
                      className="absolute inset-0 opacity-20 pointer-events-none"
                      style={{
                        backgroundImage:
                          "linear-gradient(to right, #333 1px, transparent 1px), linear-gradient(to bottom, #333 1px, transparent 1px)",
                        backgroundSize: "32px 32px",
                      }}
                    />

                    {/* Camera Angle Environment Simulated Architecture */}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-40">
                      {cam.id === "cam-01" && (
                        <div className="w-full h-full flex items-end justify-start p-6">
                          <div className="w-28 h-44 border-r-2 border-dashed border-neutral-600" />
                          <div className="text-[10px] font-mono text-neutral-500 ml-2 mb-4">
                            GATE ARCHWAY #01 · INGRESS SECTOR
                          </div>
                        </div>
                      )}
                      {cam.id === "cam-02" && (
                        <div className="w-full h-full flex items-center justify-end p-6">
                          <div className="w-40 h-32 border border-neutral-700 rounded bg-neutral-950/40 flex items-center justify-center text-[10px] font-mono text-neutral-500">
                            PARKING BAY 04 STALL
                          </div>
                        </div>
                      )}
                      {cam.id === "cam-03" && (
                        <div className="w-full h-full flex items-center justify-center">
                          <div className="w-full h-14 border-y border-dashed border-neutral-700 flex items-center justify-center text-[10px] font-mono text-neutral-500">
                            EAST SERVICE ROADWAY · LATERAL VIEW
                          </div>
                        </div>
                      )}
                      {cam.id === "cam-04" && (
                        <div className="w-full h-full flex items-center justify-center">
                          <div className="w-52 h-52 rounded-full border border-neutral-800 flex items-center justify-center text-[9px] font-mono text-neutral-500">
                            OVERHEAD AZIMUTH 240° · TOP-DOWN
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Live AI Detection Boxes Overlay */}
                    {detections.map((det) => {
                      const isPerson = det.type === "person";
                      const isCritical = det.label.includes("FALLEN");
                      const color = isCritical
                        ? "#ef4444"
                        : isPerson
                        ? "#f59e0b"
                        : "#38bdf8";

                      return (
                        <motion.div
                          key={det.entityId}
                          initial={false}
                          animate={{
                            left: `${det.bbox.x * 100}%`,
                            top: `${det.bbox.y * 100}%`,
                            width: `${det.bbox.width * 100}%`,
                            height: `${det.bbox.height * 100}%`,
                          }}
                          transition={{ duration: 0.1, ease: "linear" }}
                          className="absolute border-2 pointer-events-none rounded-sm"
                          style={{
                            borderColor: color,
                            boxShadow: `0 0 12px ${color}44`,
                          }}
                        >
                          {/* Corner crosshairs */}
                          <div
                            className="absolute -top-1 -left-1 w-2 h-2 border-t-2 border-l-2"
                            style={{ borderColor: color }}
                          />
                          <div
                            className="absolute -bottom-1 -right-1 w-2 h-2 border-b-2 border-r-2"
                            style={{ borderColor: color }}
                          />

                          {/* Anonymous Tag Badge */}
                          <div
                            className="absolute -top-5 left-0 px-1.5 py-0.5 rounded text-[9px] font-mono font-bold whitespace-nowrap shadow-sm"
                            style={{
                              background: color,
                              color: "#000",
                            }}
                          >
                            {det.label} [{(det.confidence * 100).toFixed(0)}%]
                          </div>
                        </motion.div>
                      );
                    })}

                    {/* Top HUD: Camera Name & REC indicator */}
                    <div className="absolute top-2 left-2 right-2 flex items-center justify-between pointer-events-none">
                      <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-black/75 backdrop-blur-md border border-neutral-800">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping" />
                        <span className="text-[10px] font-mono font-bold text-white">
                          {cam.label}
                        </span>
                        {isFocused && (
                          <span className="text-[8px] font-mono bg-amber-500 text-black px-1 rounded font-bold ml-1">
                            PRIMARY
                          </span>
                        )}
                      </div>
                      <div className="px-1.5 py-0.5 rounded bg-black/75 border border-neutral-800 text-[9px] font-mono text-neutral-400">
                        {cam.fps} FPS · {cam.resolution.width}x{cam.resolution.height}
                      </div>
                    </div>

                    {/* Bottom HUD: Coordinates / Telemetry */}
                    <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between pointer-events-none text-[9px] font-mono text-neutral-400">
                      <span className="bg-black/60 px-1.5 py-0.5 rounded">
                        {cam.location}
                      </span>
                      <span className="bg-black/60 px-1.5 py-0.5 rounded text-amber-400 font-bold">
                        {detections.length > 0
                          ? detections.map((d) => d.label.split(" ")[0] + " " + d.label.split(" ")[1]).join(", ")
                          : "No Target in View"}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* ── Timeline Player Controls ── */}
          <div className="p-3 border-t border-neutral-800 bg-neutral-900/90 space-y-2">
            <div className="flex items-center gap-4">
              {/* Play / Pause */}
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="w-10 h-10 rounded-lg bg-amber-500 hover:bg-amber-400 text-black font-bold flex items-center justify-center text-sm transition-all shadow-[0_0_15px_rgba(245,158,11,0.3)]"
              >
                {isPlaying ? "⏸" : "▶"}
              </button>

              {/* Step Back / Forward */}
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setCurrentSec((p) => Math.max(0, +(p - 1).toFixed(2)))}
                  className="px-2 py-1.5 rounded bg-neutral-800 hover:bg-neutral-700 text-xs font-mono text-neutral-300"
                  title="Step 1s backward"
                >
                  -1s
                </button>
                <button
                  onClick={() => setCurrentSec((p) => Math.min(30, +(p + 1).toFixed(2)))}
                  className="px-2 py-1.5 rounded bg-neutral-800 hover:bg-neutral-700 text-xs font-mono text-neutral-300"
                  title="Step 1s forward"
                >
                  +1s
                </button>
              </div>

              {/* Scrubber slider */}
              <div className="flex-1 flex items-center gap-3">
                <span className="text-[11px] font-mono text-neutral-500">10:42:00</span>
                <input
                  type="range"
                  min="0"
                  max="30"
                  step="0.1"
                  value={currentSec}
                  onChange={(e) => {
                    setCurrentSec(parseFloat(e.target.value));
                    setIsPlaying(false);
                  }}
                  className="flex-1 accent-amber-500 cursor-pointer h-2 bg-neutral-800 rounded-lg appearance-none"
                />
                <span className="text-[11px] font-mono text-neutral-500">10:42:30</span>
              </div>

              {/* Exact timecode indicator */}
              <div className="px-2.5 py-1 rounded bg-neutral-950 border border-neutral-700 text-amber-400 font-mono text-xs font-bold tracking-wider">
                {formatTimecode(currentSec)}
              </div>

              {/* Playback speed toggles */}
              <div className="flex items-center gap-1 text-[10px] font-mono">
                {[0.5, 1, 2].map((spd) => (
                  <button
                    key={spd}
                    onClick={() => setPlaybackSpeed(spd)}
                    className={`px-2 py-1 rounded transition-all ${
                      playbackSpeed === spd
                        ? "bg-amber-500 text-black font-bold"
                        : "bg-neutral-800 text-neutral-400 hover:text-white"
                    }`}
                  >
                    {spd}x
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* ── Sub-tabs: Interactive Event Timeline vs. Multi-Camera Correlation vs Reconstruction Summary ── */}
          <div className="border-t border-neutral-800 bg-neutral-950 flex flex-col h-48 overflow-hidden">
            <div className="flex items-center justify-between px-4 py-2 border-b border-neutral-800/80 bg-neutral-900/50">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveSubTab("timeline")}
                  className={`text-xs font-mono px-3 py-1 rounded transition-all uppercase font-semibold ${
                    activeSubTab === "timeline"
                      ? "bg-amber-500/15 text-amber-400 border border-amber-500/40"
                      : "text-neutral-400 hover:text-neutral-200"
                  }`}
                >
                  ⚡ Event Timeline (Click to Seek)
                </button>
                <button
                  onClick={() => setActiveSubTab("correlation")}
                  className={`text-xs font-mono px-3 py-1 rounded transition-all uppercase font-semibold ${
                    activeSubTab === "correlation"
                      ? "bg-amber-500/15 text-amber-400 border border-amber-500/40"
                      : "text-neutral-400 hover:text-neutral-200"
                  }`}
                >
                  🔗 Multi-Camera Correlation (One Incident)
                </button>
                <button
                  onClick={() => setActiveSubTab("reconstruction")}
                  className={`text-xs font-mono px-3 py-1 rounded transition-all uppercase font-semibold ${
                    activeSubTab === "reconstruction"
                      ? "bg-amber-500/15 text-amber-400 border border-amber-500/40"
                      : "text-neutral-400 hover:text-neutral-200"
                  }`}
                >
                  🧠 Quick AI Reconstruction
                </button>
              </div>

              <span className="text-[11px] font-mono text-neutral-500">
                Synchronized across all 4 cameras
              </span>
            </div>

            <div className="flex-1 overflow-y-auto p-3 no-scrollbar">
              {activeSubTab === "timeline" ? (
                <div className="grid grid-cols-1 md:grid-cols-5 gap-2">
                  {priorityEvents.map((evt) => {
                    const isSelected = selectedEventId === evt.id;
                    const isCritical = evt.label.includes("falls");

                    return (
                      <button
                        key={evt.id}
                        onClick={() => {
                          setSelectedEventId(evt.id);
                          setActiveCamId(evt.camId);
                          setCurrentSec(evt.sec);
                          setIsPlaying(false);
                        }}
                        className={`p-2.5 rounded-lg border text-left transition-all relative overflow-hidden flex flex-col justify-between ${
                          isSelected
                            ? "bg-amber-500/20 border-amber-500 shadow-[0_0_12px_rgba(245,158,11,0.25)] ring-1 ring-amber-500/40"
                            : isCritical
                            ? "bg-red-500/10 border-red-500/40 hover:border-red-400"
                            : "bg-neutral-900/60 border-neutral-800 hover:border-neutral-700"
                        }`}
                      >
                        <div>
                          <div className="flex items-center justify-between text-[10px] font-mono mb-1">
                            <span className="font-bold text-amber-400">
                              {evt.time}
                            </span>
                            <span
                              className={`px-1 rounded text-[8px] font-semibold uppercase ${
                                isCritical
                                  ? "bg-red-500/20 text-red-400"
                                  : "bg-neutral-800 text-neutral-300"
                              }`}
                            >
                              {(evt.conf * 100).toFixed(0)}% CONF
                            </span>
                          </div>
                          <div className="text-xs font-bold text-white leading-tight mb-1">
                            {evt.label}
                          </div>
                        </div>

                        <div className="flex items-center justify-between text-[10px] font-mono text-neutral-400 mt-2">
                          <span className="truncate">{evt.entity}</span>
                          <span className="text-amber-400 font-bold">
                            {evt.cam}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              ) : activeSubTab === "correlation" ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {MOCK_MULTI_CAM_LINKS.map((link) => (
                    <div
                      key={link.id}
                      className="p-3 rounded-lg border border-neutral-800 bg-neutral-900/70 space-y-2 text-xs font-mono"
                    >
                      <div className="flex items-center justify-between text-neutral-400">
                        <span className="text-amber-400 font-bold">
                          {link.sourceCamera.toUpperCase()} ↔ {link.targetCamera.toUpperCase()}
                        </span>
                        <span className="text-emerald-400 font-bold">
                          Re-ID: {(link.reIdScore * 100).toFixed(1)}%
                        </span>
                      </div>
                      <div className="text-neutral-200 font-sans font-semibold">
                        {link.sharedEvent}
                      </div>
                      <div className="flex justify-between text-[10px] text-neutral-500 pt-1 border-t border-neutral-800">
                        <span>Observed Subject: {link.entityLabel}</span>
                        <span>Spatiotemporal Link: {link.timestamp}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                /* Quick AI Reconstruction Overview */
                <div className="p-3 rounded-xl bg-neutral-900/60 border border-neutral-800 flex flex-col md:flex-row items-center justify-between gap-4 font-mono text-xs">
                  <div className="space-y-1 max-w-xl">
                    <div className="text-amber-400 font-bold uppercase">
                      Incident Type: Pedestrian-Vehicle Collision with Fall
                    </div>
                    <p className="text-neutral-300 font-sans italic">
                      &ldquo;A person approached a parked vehicle. The vehicle subsequently moved, after which the person fell.&rdquo;
                    </p>
                    <div className="text-[11px] text-neutral-500">
                      Overall Confidence: 94.2% · Cameras: CAM 01, 02, 03, 04 · Entities: Person #01, Vehicle #01, Person #02
                    </div>
                  </div>

                  <button
                    onClick={() => onNavigateTab("incidents")}
                    className="px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-black font-bold font-mono text-xs uppercase tracking-wider transition-all flex items-center gap-2 flex-shrink-0"
                  >
                    Open Full Incident Dossier →
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right 4/12: Gemini AI Forensic Investigator */}
        <div className="xl:col-span-4 flex flex-col bg-neutral-900/40 border-l border-neutral-800 h-full overflow-hidden">
          {/* AI Header */}
          <div className="p-3.5 border-b border-neutral-800 bg-neutral-900/80 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-amber-500 to-yellow-300 text-black font-bold flex items-center justify-center text-xs shadow-[0_0_10px_rgba(245,158,11,0.4)]">
                AI
              </div>
              <div>
                <h4 className="text-xs font-mono font-bold text-white">
                  Gemini Spatio-Temporal Investigator
                </h4>
                <div className="text-[10px] font-mono text-emerald-400">
                  Observed Facts vs. AI Inference
                </div>
              </div>
            </div>
            <span className="text-[10px] font-mono text-neutral-400 bg-neutral-800 px-2 py-0.5 rounded">
              v1.5 Pro
            </span>
          </div>

          {/* Preset Question Quick-Chips (Strictly matching prompt) */}
          <div className="p-2.5 border-b border-neutral-800/80 bg-neutral-950/40 flex flex-wrap gap-1.5">
            {[
              "What happened?",
              "Which cameras captured the incident?",
              "What happened before the fall?",
              "What evidence supports this?",
            ].map((q) => (
              <button
                key={q}
                onClick={() => handleSendChat(q)}
                disabled={isAiLoading}
                className="text-[11px] font-mono px-2.5 py-1 rounded bg-neutral-800 hover:bg-amber-500 hover:text-black text-neutral-300 border border-neutral-700 transition-all text-left font-medium"
              >
                {q}
              </button>
            ))}
          </div>

          {/* Chat Messages Transcript */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 font-mono text-xs no-scrollbar">
            {chatMessages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${
                  msg.role === "user" ? "items-end" : "items-start"
                }`}
              >
                <div className="text-[10px] text-neutral-500 mb-1">
                  {msg.role === "user" ? "Investigator" : "Gemini Forensic Core"} ·{" "}
                  {msg.timestamp}
                </div>

                <div
                  className={`p-3.5 rounded-xl border max-w-[95%] leading-relaxed ${
                    msg.role === "user"
                      ? "bg-amber-500/15 border-amber-500/40 text-amber-200"
                      : "bg-neutral-950 border-neutral-800 text-neutral-200 shadow-md"
                  }`}
                >
                  <div
                    className="space-y-2 whitespace-pre-line"
                    dangerouslySetInnerHTML={{
                      __html: msg.content
                        .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
                        .replace(/\[OBSERVED FACTS\]/g, '<span class="text-emerald-400 font-bold bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">[OBSERVED FACTS]</span>')
                        .replace(/\[AI INFERENCE\]/g, '<span class="text-amber-400 font-bold bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20">[AI INFERENCE]</span>'),
                    }}
                  />

                  {/* Evidence Reference Click Chips */}
                  {msg.evidenceRefs && msg.evidenceRefs.length > 0 && (
                    <div className="mt-3 pt-2 border-t border-neutral-800/80 space-y-1">
                      <div className="text-[10px] text-neutral-500 uppercase">
                        Evidence Citations (Click to Seek Video):
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {msg.evidenceRefs.map((ref, idx) => (
                          <button
                            key={idx}
                            onClick={() => handleEvidenceClick(ref)}
                            className="px-2 py-0.5 rounded bg-neutral-900 border border-neutral-700 hover:border-amber-400 text-neutral-300 hover:text-amber-400 text-[10px] font-mono flex items-center gap-1 transition-all"
                          >
                            <span>▶</span>
                            <span>
                              {ref.cameraLabel.split("—")[0].trim()} ({ref.startTime})
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {isAiLoading && (
              <div className="flex items-center gap-2 text-amber-400 text-xs p-2">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                <span>Grounding reasoning across 4 camera feeds...</span>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Chat Input Bar */}
          <div className="p-3 border-t border-neutral-800 bg-neutral-950 flex items-center gap-2">
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSendChat()}
              placeholder="Ask Gemini about cameras, motion, or causality..."
              className="flex-1 px-3 py-2 rounded-lg bg-neutral-900 border border-neutral-700 text-xs text-white font-mono focus:outline-none focus:border-amber-500"
            />
            <button
              onClick={() => handleSendChat()}
              disabled={!chatInput.trim() || isAiLoading}
              className="px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 disabled:opacity-40 text-black font-bold font-mono text-xs uppercase tracking-wider transition-all"
            >
              Ask
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
