"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Investigation, AppTab } from "@/lib/types";

interface InvestigationsViewProps {
  investigations: Investigation[];
  activeInvestigation: Investigation;
  onSelectInvestigation: (inv: Investigation) => void;
  onNavigateTab: (tab: AppTab) => void;
  onLoadDemo: () => void;
  onCreateInvestigation: (newInv: Investigation) => void;
}

interface CameraUploadSlot {
  id: string;
  name: string;
  defaultAngle: string;
  file: File | null;
  previewUrl: string | null;
  status: "idle" | "ready" | "uploaded";
}

export default function InvestigationsView({
  investigations,
  activeInvestigation,
  onSelectInvestigation,
  onNavigateTab,
  onLoadDemo,
  onCreateInvestigation,
}: InvestigationsViewProps) {
  const [showModal, setShowModal] = useState(false);
  const [caseTitle, setCaseTitle] = useState("");
  const [location, setLocation] = useState("Sector 7 Logistics Depot, Bay 04");
  const [dateStr, setDateStr] = useState("2026-09-04");
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // 4 camera slots
  const [cameraSlots, setCameraSlots] = useState<CameraUploadSlot[]>([
    {
      id: "cam-01",
      name: "Camera 01",
      defaultAngle: "North Entrance / Ingress Gate",
      file: null,
      previewUrl: null,
      status: "idle",
    },
    {
      id: "cam-02",
      name: "Camera 02",
      defaultAngle: "Parking Bay 04 / Vehicle Approach",
      file: null,
      previewUrl: null,
      status: "idle",
    },
    {
      id: "cam-03",
      name: "Camera 03",
      defaultAngle: "Street East / Longitudinal Profile",
      file: null,
      previewUrl: null,
      status: "idle",
    },
    {
      id: "cam-04",
      name: "Camera 04",
      defaultAngle: "Rooftop Overhead / Bird's Eye View",
      file: null,
      previewUrl: null,
      status: "idle",
    },
  ]);

  const handleFileChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const f = e.target.files[0];
      const url = URL.createObjectURL(f);
      setCameraSlots((prev) => {
        const next = [...prev];
        next[index] = {
          ...next[index],
          file: f,
          previewUrl: url,
          status: "ready",
        };
        return next;
      });
    }
  };

  const populateWithDemoSlots = () => {
    setCaseTitle("Bay 04 Vehicle Reversal & Pedestrian Fall");
    setLocation("Sector 7 Logistics Depot, Parking Bay 04");
    setCameraSlots([
      {
        id: "cam-01",
        name: "Camera 01",
        defaultAngle: "North Entrance — PTZ 4K [Synced]",
        file: null,
        previewUrl: "demo://cam-01",
        status: "uploaded",
      },
      {
        id: "cam-02",
        name: "Camera 02",
        defaultAngle: "Parking Bay 04 — Fixed 1080p [Synced]",
        file: null,
        previewUrl: "demo://cam-02",
        status: "uploaded",
      },
      {
        id: "cam-03",
        name: "Camera 03",
        defaultAngle: "Street East — Wide 4K [Synced]",
        file: null,
        previewUrl: "demo://cam-03",
        status: "uploaded",
      },
      {
        id: "cam-04",
        name: "Camera 04",
        defaultAngle: "Rooftop Overhead — Top-down [Synced]",
        file: null,
        previewUrl: "demo://cam-04",
        status: "uploaded",
      },
    ]);
  };

  const handleAnalyzeFootage = () => {
    setShowModal(false);
    onLoadDemo();
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="text-xs font-mono text-amber-400 uppercase tracking-wider mb-1">
            Forensic Case Repository
          </div>
          <h2 className="text-2xl font-bold font-mono text-white">
            Incident Investigations
          </h2>
          <p className="text-sm text-neutral-400">
            Manage multi-camera case files, ingest synchronized CCTV feeds, and run spatio-temporal AI reconstructions.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onLoadDemo}
            className="px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-black font-semibold text-xs font-mono uppercase tracking-wider flex items-center gap-2 transition-all shadow-[0_0_15px_rgba(245,158,11,0.3)]"
          >
            <span>⚡</span> Load Built-in Demo
          </button>
          <button
            onClick={() => {
              setShowModal(true);
              setCaseTitle("");
            }}
            className="px-4 py-2 rounded-lg bg-neutral-900 border border-neutral-700 hover:border-amber-500/50 text-white font-semibold text-xs font-mono uppercase tracking-wider transition-all"
          >
            + New Investigation
          </button>
        </div>
      </div>

      {/* Investigations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {investigations.map((inv) => {
          const isActive = inv.id === activeInvestigation.id;
          return (
            <div
              key={inv.id}
              className={`rounded-xl border p-5 bg-neutral-900/60 backdrop-blur-md relative overflow-hidden transition-all flex flex-col justify-between ${
                isActive
                  ? "border-amber-500 shadow-[0_0_20px_rgba(245,158,11,0.15)]"
                  : "border-neutral-800 hover:border-neutral-700"
              }`}
            >
              {isActive && (
                <div className="absolute top-0 right-0 bg-amber-500 text-black font-mono text-[9px] font-bold px-2 py-0.5 rounded-bl uppercase">
                  Active in Command Center
                </div>
              )}

              <div>
                <div className="flex items-center gap-2 mb-2 font-mono text-xs text-neutral-500">
                  <span>CASE #{inv.id.replace("inv-", "").toUpperCase()}</span>
                  <span>·</span>
                  <span>{inv.incidentDate}</span>
                </div>

                <h3 className="text-base font-bold text-white mb-2 leading-snug">
                  {inv.name}
                </h3>
                <p className="text-xs text-neutral-400 mb-4 line-clamp-2">
                  {inv.description}
                </p>

                {/* Badges / Metrics */}
                <div className="grid grid-cols-3 gap-2 py-3 border-y border-neutral-800/80 mb-4 text-center font-mono text-xs">
                  <div className="p-2 rounded bg-neutral-950/60">
                    <div className="text-neutral-500 text-[10px]">CAMERAS</div>
                    <div className="text-amber-400 font-bold">{inv.cameraCount}</div>
                  </div>
                  <div className="p-2 rounded bg-neutral-950/60">
                    <div className="text-neutral-500 text-[10px]">ENTITIES</div>
                    <div className="text-emerald-400 font-bold">{inv.entities?.length || 3}</div>
                  </div>
                  <div className="p-2 rounded bg-neutral-950/60">
                    <div className="text-neutral-500 text-[10px]">EVENTS</div>
                    <div className="text-neutral-200 font-bold">{inv.events?.length || 5}</div>
                  </div>
                </div>

                <div className="text-xs font-mono text-neutral-500 mb-4 truncate">
                  📍 {inv.location}
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  onClick={() => {
                    onSelectInvestigation(inv);
                    onNavigateTab("analysis");
                  }}
                  className="flex-1 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-black font-semibold text-xs font-mono uppercase tracking-wider transition-all text-center"
                >
                  Analyze Video Feeds
                </button>
                <button
                  onClick={() => {
                    onSelectInvestigation(inv);
                    onNavigateTab("reports");
                  }}
                  className="px-3 py-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 font-mono text-xs transition-all"
                  title="View Incident Report"
                >
                  Dossier
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* NEW INVESTIGATION MODAL */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl border border-neutral-700 bg-neutral-900 p-6 space-y-6 shadow-2xl"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between pb-4 border-b border-neutral-800">
                <div>
                  <div className="text-xs font-mono text-amber-400 uppercase tracking-wider">
                    New Investigation Wizard
                  </div>
                  <h3 className="text-xl font-bold font-mono text-white">
                    Create Investigation & Ingest CCTV Feeds
                  </h3>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={populateWithDemoSlots}
                    className="px-3 py-1 rounded bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-mono hover:bg-amber-500/20 transition-all"
                  >
                    ⚡ Autofill Demo Case
                  </button>
                  <button
                    onClick={() => setShowModal(false)}
                    className="text-neutral-400 hover:text-white font-mono text-lg"
                  >
                    ✕
                  </button>
                </div>
              </div>

              {/* Case Details Inputs */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2 space-y-1">
                  <label className="text-xs font-mono text-neutral-400 uppercase">
                    Investigation Title
                  </label>
                  <input
                    type="text"
                    value={caseTitle}
                    onChange={(e) => setCaseTitle(e.target.value)}
                    placeholder="e.g. Loading Dock B Incident #09"
                    className="w-full px-3 py-2 rounded-lg bg-neutral-950 border border-neutral-700 text-sm text-white font-mono focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-mono text-neutral-400 uppercase">
                    Incident Date
                  </label>
                  <input
                    type="date"
                    value={dateStr}
                    onChange={(e) => setDateStr(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-neutral-950 border border-neutral-700 text-sm text-white font-mono focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div className="md:col-span-3 space-y-1">
                  <label className="text-xs font-mono text-neutral-400 uppercase">
                    Physical Facility / Coordinates
                  </label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g. Building 4 South Depot"
                    className="w-full px-3 py-2 rounded-lg bg-neutral-950 border border-neutral-700 text-sm text-white font-mono focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              {/* 4 Camera Upload Slots */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-neutral-400 uppercase">
                    Upload Multi-Camera CCTV Footage (Camera 01, 02, 03, 04)
                  </span>
                  <span className="text-[11px] font-mono text-amber-400">
                    4 Synced Angles Required for Spatial Correlation
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {cameraSlots.map((slot, index) => (
                    <div
                      key={slot.id}
                      className="p-4 rounded-xl border border-neutral-800 bg-neutral-950/70 space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-mono font-bold text-neutral-200">
                          {slot.name}
                        </span>
                        <span
                          className={`text-[10px] font-mono px-2 py-0.5 rounded uppercase ${
                            slot.status === "uploaded" || slot.status === "ready"
                              ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                              : "bg-neutral-800 text-neutral-400"
                          }`}
                        >
                          {slot.status === "uploaded"
                            ? "Demo Ready"
                            : slot.status === "ready"
                            ? "File Attached"
                            : "Awaiting File"}
                        </span>
                      </div>

                      <div className="text-[11px] font-mono text-neutral-400 truncate">
                        {slot.defaultAngle}
                      </div>

                      {/* Video Preview Box */}
                      <div className="w-full h-32 rounded-lg border border-neutral-800 bg-neutral-900/80 flex flex-col items-center justify-center relative overflow-hidden group">
                        {slot.previewUrl ? (
                          <div className="w-full h-full flex flex-col items-center justify-center p-3 text-center bg-amber-500/5">
                            <span className="text-2xl mb-1">📹</span>
                            <span className="text-xs font-mono text-amber-400 font-semibold truncate max-w-[200px]">
                              {slot.file ? slot.file.name : `${slot.name} Synced Feed`}
                            </span>
                            <span className="text-[10px] font-mono text-neutral-500">
                              30 FPS · 4K · Timestamps Calibrated
                            </span>
                          </div>
                        ) : (
                          <label className="w-full h-full flex flex-col items-center justify-center cursor-pointer hover:bg-neutral-800/40 transition-colors">
                            <span className="text-2xl mb-1 text-neutral-500">📁</span>
                            <span className="text-xs font-mono text-neutral-400">
                              Choose or drop MP4/MKV video
                            </span>
                            <span className="text-[10px] font-mono text-neutral-600">
                              H.264 / H.265 supported
                            </span>
                            <input
                              type="file"
                              accept="video/*"
                              onChange={(e) => handleFileChange(index, e)}
                              className="hidden"
                            />
                          </label>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Modal Footer / Action Button */}
              <div className="flex items-center justify-between pt-4 border-t border-neutral-800">
                <div className="text-xs font-mono text-neutral-500">
                  Privacy Notice: Anonymous ID tracking only. Facial recognition disabled.
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 rounded-lg border border-neutral-700 text-neutral-300 font-mono text-xs hover:bg-neutral-800 transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAnalyzeFootage}
                    disabled={isAnalyzing}
                    className="px-6 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-black font-bold font-mono text-xs uppercase tracking-wider transition-all flex items-center gap-2 shadow-[0_0_20px_rgba(245,158,11,0.3)]"
                  >
                    {isAnalyzing ? (
                      <>
                        <span className="animate-spin">⚙</span>
                        Ingesting & Analyzing Feeds...
                      </>
                    ) : (
                      <>
                        <span>▶</span>
                        Analyze Footage
                      </>
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
