"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Video,
  Eye,
  CheckCircle2,
  ShieldCheck,
  Maximize2,
  Play,
  RotateCcw,
  Sparkles,
  ArrowRight,
  Crosshair,
} from "lucide-react";

const FEEDS = [
  {
    id: 1,
    name: "CAM-01 [NORTH GATEWAY]",
    angle: "North-West 45°",
    fps: "29.97 FPS",
    resolution: "3840x2160",
    entity: "SUBJECT P-109",
    action: "Entering frame at 10:42:11",
    status: "SYNCED",
    badge: "PRIMARY ENTRY",
  },
  {
    id: 2,
    name: "CAM-02 [PARKING BAY 04]",
    angle: "Direct Overhead 60°",
    fps: "30.00 FPS",
    resolution: "2560x1440",
    entity: "VEHICLE V-442 & P-109",
    action: "Proximity approach at 10:42:16",
    status: "SYNCED",
    badge: "INCIDENT POINT",
  },
  {
    id: 3,
    name: "CAM-03 [EAST ACCESS LANE]",
    angle: "East Elevation 30°",
    fps: "30.00 FPS",
    resolution: "1920x1080",
    entity: "VEHICLE V-442",
    action: "Reverse acceleration at 10:42:19",
    status: "SYNCED",
    badge: "VECTOR DRIFT",
  },
  {
    id: 4,
    name: "CAM-04 [ROOFTOP HIGH ANGLE]",
    angle: "Omni Perimeter 75°",
    fps: "29.97 FPS",
    resolution: "3840x2160",
    entity: "P-109 & WITNESS P-110",
    action: "Post-impact collapse at 10:42:21",
    status: "SYNCED",
    badge: "WITNESS ARRIVAL",
  },
];

export default function MultiCameraSection() {
  const [activeFeed, setActiveFeed] = useState<number>(2);
  const [timestamp, setTimestamp] = useState<string>("10:42:16.820");

  useEffect(() => {
    const times = ["10:42:11.200", "10:42:16.820", "10:42:19.450", "10:42:21.110", "10:42:25.040"];
    let idx = 1;
    const interval = setInterval(() => {
      idx = (idx + 1) % times.length;
      setTimestamp(times[idx]);
    }, 2800);
    return () => clearInterval(interval);
  }, []);

  return (
    <section id="multi-camera" className="py-28 bg-[#05080E] border-t border-white/5 relative overflow-hidden">
      {/* Glow */}
      <div className="absolute top-1/3 right-10 w-[500px] h-[500px] bg-blue-500/5 blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-8 relative z-10">
        {/* Section Header */}
        <div className="max-w-3xl mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-cyan-950/50 border border-cyan-500/30 text-cyan-300 font-mono text-xs uppercase tracking-widest mb-4">
            SPATIAL SYNCHRONIZATION
          </div>
          <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-white mb-4">
            SEE THE WHOLE PICTURE
          </h2>
          <p className="text-lg text-cyan-400 font-mono">
            Multiple cameras. One reconstructed event.
          </p>
          <p className="text-sm sm:text-base text-gray-400 mt-2 max-w-2xl font-normal leading-relaxed">
            Unlike disjointed video walls, AI Witness maps disparate timestamps and focal lengths to a single shared physics model.
          </p>
        </div>

        {/* 3-Column Studio Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left / Center Grid: 4 Synchronized Camera Feeds (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center justify-between bg-[#080D15] p-3 rounded-xl border border-white/10">
              <div className="flex items-center gap-3 font-mono text-xs">
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                </span>
                <span className="text-white font-semibold">SYNCHRONIZED CLUSTERS (4/4)</span>
                <span className="text-gray-500">|</span>
                <span className="text-cyan-400">TIME: {timestamp}</span>
              </div>
              <span className="font-mono text-[10px] text-gray-400 uppercase">DRIFT: ±12ms</span>
            </div>

            {/* 4 CCTV Panels Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {FEEDS.map((feed) => (
                <div
                  key={feed.id}
                  onClick={() => setActiveFeed(feed.id)}
                  className={`relative aspect-video rounded-xl overflow-hidden cursor-pointer transition-all border ${
                    activeFeed === feed.id
                      ? "border-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.25)]"
                      : "border-white/10 hover:border-white/30"
                  } bg-[#070B12] group`}
                >
                  {/* Procedural Visual Representation of the Camera View */}
                  <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(11,15,23,0.8),rgba(6,10,16,0.95))] flex items-center justify-center p-4">
                    {/* Simulated perspective grid */}
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(6,182,212,0.06)_0%,transparent_70%)]" />
                    <div className="w-full h-full border border-cyan-500/20 rounded relative flex items-center justify-center">
                      <div className="absolute inset-x-0 top-1/2 h-px bg-cyan-500/15" />
                      <div className="absolute inset-y-0 left-1/2 w-px bg-cyan-500/15" />

                      {/* Simulated Bounding Box for Detected Entity */}
                      <div className="relative border-2 border-cyan-400 bg-cyan-500/10 px-3 py-2 rounded">
                        <div className="font-mono text-[9px] text-cyan-300 font-bold tracking-wider">
                          {feed.entity}
                        </div>
                        <div className="font-mono text-[8px] text-emerald-400">CONF: 98.4%</div>
                        {/* Target Crosshair */}
                        <div className="absolute -top-1 -left-1 w-2 h-2 border-t-2 border-l-2 border-cyan-400" />
                        <div className="absolute -top-1 -right-1 w-2 h-2 border-t-2 border-r-2 border-cyan-400" />
                        <div className="absolute -bottom-1 -left-1 w-2 h-2 border-b-2 border-l-2 border-cyan-400" />
                        <div className="absolute -bottom-1 -right-1 w-2 h-2 border-b-2 border-r-2 border-cyan-400" />
                      </div>
                    </div>
                  </div>

                  {/* Scanline Effect */}
                  <div className="absolute inset-0 pointer-events-none bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,rgba(0,0,0,0.15)_2px,rgba(0,0,0,0.15)_4px)]" />

                  {/* Overlay Meta */}
                  <div className="absolute top-2 left-2 right-2 flex items-center justify-between text-[10px] font-mono text-gray-300 pointer-events-none">
                    <span className="bg-black/70 px-1.5 py-0.5 rounded text-cyan-300 font-semibold">
                      {feed.name}
                    </span>
                    <span className="bg-cyan-950/80 text-cyan-300 border border-cyan-500/30 px-1.5 py-0.5 rounded text-[9px]">
                      {feed.badge}
                    </span>
                  </div>

                  <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between text-[10px] font-mono text-gray-400 pointer-events-none">
                    <span className="bg-black/60 px-1.5 py-0.5 rounded">{feed.resolution}</span>
                    <span className="text-emerald-400 bg-black/60 px-1.5 py-0.5 rounded flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> {feed.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Center / Right: Spatial Radar & AI Analysis Status (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            {/* 3D Spatial Radar / Mini Coordinate Map */}
            <div className="bg-[#080D15] border border-white/10 rounded-2xl p-5">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Crosshair className="w-4 h-4 text-cyan-400" />
                  <span className="font-mono text-xs font-bold text-white uppercase tracking-wider">
                    SPATIAL RADAR & CAMERA FRUSTUMS
                  </span>
                </div>
                <span className="font-mono text-[10px] text-cyan-400">UNIFIED COORD SYS</span>
              </div>

              {/* Radar visualization graphic */}
              <div className="relative aspect-video bg-[#05080E] rounded-xl border border-cyan-500/20 overflow-hidden flex items-center justify-center">
                {/* Concentric radar rings */}
                <div className="absolute w-44 h-44 rounded-full border border-cyan-500/20" />
                <div className="absolute w-28 h-28 rounded-full border border-cyan-500/30" />
                <div className="absolute w-12 h-12 rounded-full border border-cyan-500/40 bg-cyan-500/10" />

                {/* Sweeping radar beam */}
                <div className="absolute inset-0 bg-[conic-gradient(from_0deg,transparent_0deg,rgba(6,182,212,0.15)_60deg,transparent_60deg)] animate-spin duration-[4000ms]" />

                {/* 4 Camera Positions on Radar */}
                <div className="absolute top-4 left-6 text-center">
                  <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 mx-auto shadow-[0_0_8px_#06B6D4]" />
                  <span className="font-mono text-[9px] text-cyan-300">CAM-01</span>
                </div>
                <div className="absolute bottom-4 left-10 text-center">
                  <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 mx-auto shadow-[0_0_8px_#06B6D4]" />
                  <span className="font-mono text-[9px] text-cyan-300">CAM-02</span>
                </div>
                <div className="absolute top-8 right-8 text-center">
                  <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 mx-auto shadow-[0_0_8px_#06B6D4]" />
                  <span className="font-mono text-[9px] text-cyan-300">CAM-03</span>
                </div>
                <div className="absolute bottom-6 right-12 text-center">
                  <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 mx-auto shadow-[0_0_8px_#06B6D4]" />
                  <span className="font-mono text-[9px] text-cyan-300">CAM-04</span>
                </div>

                {/* Incident Focal Center */}
                <div className="relative text-center z-10">
                  <div className="w-3 h-3 rounded-full bg-red-500 animate-ping mx-auto" />
                  <div className="w-2.5 h-2.5 rounded-full bg-red-400 mx-auto -mt-2.5" />
                  <span className="font-mono text-[9px] text-red-300 font-bold">INCIDENT BAY 04</span>
                </div>
              </div>
            </div>

            {/* AI Analysis Status Panel */}
            <div className="bg-[#080D15] border border-cyan-500/30 rounded-2xl p-6 shadow-2xl">
              <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-4">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-emerald-400" />
                  <span className="font-mono text-xs font-bold text-white uppercase tracking-wider">
                    CORRELATION ENGINE STATUS
                  </span>
                </div>
                <span className="bg-emerald-950/60 text-emerald-300 border border-emerald-500/30 px-2.5 py-0.5 rounded font-mono text-[10px] font-bold">
                  RECONSTRUCTION READY
                </span>
              </div>

              {/* Status Checks */}
              <div className="space-y-3 font-mono text-xs mb-6">
                <div className="flex items-center justify-between text-gray-300 bg-[#0B101A] p-2.5 rounded border border-white/5">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Entities detected</span>
                  </div>
                  <span className="text-cyan-300 font-semibold">2 Pedestrians, 1 SUV</span>
                </div>

                <div className="flex items-center justify-between text-gray-300 bg-[#0B101A] p-2.5 rounded border border-white/5">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Events extracted</span>
                  </div>
                  <span className="text-cyan-300 font-semibold">5 Chronological Keys</span>
                </div>

                <div className="flex items-center justify-between text-gray-300 bg-[#0B101A] p-2.5 rounded border border-white/5">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Cameras correlated</span>
                  </div>
                  <span className="text-cyan-300 font-semibold">4 Feeds Synced (±12ms)</span>
                </div>

                <div className="flex items-center justify-between text-gray-300 bg-[#0B101A] p-2.5 rounded border border-white/5">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Timeline established</span>
                  </div>
                  <span className="text-cyan-300 font-semibold">10:42:11 — 10:42:25</span>
                </div>
              </div>

              <Link
                href="/investigate"
                className="w-full py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-semibold text-xs font-mono uppercase tracking-wider rounded-lg flex items-center justify-center gap-2 transition-all shadow-[0_0_20px_rgba(6,182,212,0.3)]"
              >
                <span>Launch Interactive Investigation</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
