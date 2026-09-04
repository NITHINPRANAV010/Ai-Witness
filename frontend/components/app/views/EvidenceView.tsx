"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import type { Investigation, AppTab } from "@/lib/types";

interface EvidenceViewProps {
  investigation: Investigation;
  onNavigateTab: (tab: AppTab) => void;
  onSeekToMs: (ms: number) => void;
}

export default function EvidenceView({
  investigation,
  onNavigateTab,
  onSeekToMs,
}: EvidenceViewProps) {
  const [copiedHash, setCopiedHash] = useState<string | null>(null);

  const evidenceItems = [
    {
      id: "EVD-001",
      camera: "CAM-01 (North Entrance)",
      timestamp: "10:42:11.100",
      timestampMs: 11100,
      entity: "Person #01",
      event: "Subject Ingress",
      finding: "Person #01 walked alone through north gate at 1.2 m/s wearing dark jacket.",
      confidence: "98%",
      hash: "8f4a1c92b7e510842011a6d91ec03f7a8b92d4e5",
    },
    {
      id: "EVD-002",
      camera: "CAM-02 (Parking Bay 04)",
      timestamp: "10:42:16.240",
      timestampMs: 16240,
      entity: "Person #01 / Vehicle #01",
      event: "Proximity Incursion",
      finding: "Person #01 entered rear blind-zone of parked Vehicle #01 (distance: 0.82m).",
      confidence: "95%",
      hash: "a4e8910b37c2d110842016f49e01ca7d5c2198be",
    },
    {
      id: "EVD-003",
      camera: "CAM-03 (Street East)",
      timestamp: "10:42:19.100",
      timestampMs: 19100,
      entity: "Vehicle #01",
      event: "Reverse Acceleration",
      finding: "Vehicle #01 reverse lights activated and vehicle accelerated backwards 3.4m.",
      confidence: "99%",
      hash: "12d7e40a83b19010842019c6e5a02f8b7d413ca9",
    },
    {
      id: "EVD-004",
      camera: "CAM-04 (Rooftop Overhead)",
      timestamp: "10:42:21.050",
      timestampMs: 21050,
      entity: "Person #01",
      event: "Kinematic Collapse",
      finding: "Person #01 collapsed horizontally 2.1s after vehicle backward trajectory began.",
      confidence: "94%",
      hash: "99bc07f2e1a4d810842021b3f7c05e9a2d814be0",
    },
    {
      id: "EVD-005",
      camera: "CAM-01 (North Entrance)",
      timestamp: "10:42:25.800",
      timestampMs: 25800,
      entity: "Person #02",
      event: "Witness Arrival",
      finding: "Person #02 ran into frame at 2.8 m/s toward the fallen subject.",
      confidence: "97%",
      hash: "6e2b904d1f8a7c10842025e9b3a01d5c4e7208fa",
    },
  ];

  const handleCopyHash = (hash: string) => {
    navigator.clipboard.writeText(hash);
    setCopiedHash(hash);
    setTimeout(() => setCopiedHash(null), 2000);
  };

  const handleInspectInVideo = (ms: number) => {
    onSeekToMs(ms);
    onNavigateTab("analysis");
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="text-xs font-mono text-amber-400 uppercase tracking-wider mb-1">
            Forensic Integrity Locker
          </div>
          <h2 className="text-2xl font-bold font-mono text-white">
            Cryptographic Evidence Locker
          </h2>
          <p className="text-sm text-neutral-400">
            Every analytical conclusion is tied to verified video frame timestamps and SHA-256 hashes.
          </p>
        </div>

        <button
          onClick={() => onNavigateTab("reports")}
          className="px-4 py-2 rounded-lg bg-neutral-900 border border-neutral-700 hover:border-amber-500/40 text-neutral-200 font-mono text-xs uppercase tracking-wider transition-all"
        >
          Export Evidence Dossier →
        </button>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 font-mono text-xs">
        <div className="p-4 rounded-xl border border-neutral-800 bg-neutral-900/60 backdrop-blur-md">
          <div className="text-neutral-500 text-[10px] uppercase">TOTAL EVIDENCE FRAMES</div>
          <div className="text-2xl font-bold text-white mt-1">05</div>
          <div className="text-[10px] text-emerald-400 mt-1">✓ 100% Hash Verified</div>
        </div>
        <div className="p-4 rounded-xl border border-neutral-800 bg-neutral-900/60 backdrop-blur-md">
          <div className="text-neutral-500 text-[10px] uppercase">CAMERAS REFERENCED</div>
          <div className="text-2xl font-bold text-amber-400 mt-1">04</div>
          <div className="text-[10px] text-neutral-400 mt-1">Cross-Angle Redundancy</div>
        </div>
        <div className="p-4 rounded-xl border border-neutral-800 bg-neutral-900/60 backdrop-blur-md">
          <div className="text-neutral-500 text-[10px] uppercase">CHAIN OF CUSTODY</div>
          <div className="text-2xl font-bold text-emerald-400 mt-1">SEALED</div>
          <div className="text-[10px] text-neutral-400 mt-1">Immutable Logged</div>
        </div>
        <div className="p-4 rounded-xl border border-neutral-800 bg-neutral-900/60 backdrop-blur-md">
          <div className="text-neutral-500 text-[10px] uppercase">ANONYMOUS ID POLICY</div>
          <div className="text-2xl font-bold text-white mt-1">STRICT</div>
          <div className="text-[10px] text-neutral-400 mt-1">No Biometrics Stored</div>
        </div>
      </div>

      {/* Evidence Table */}
      <div className="rounded-xl border border-neutral-800 bg-neutral-900/70 backdrop-blur-md overflow-hidden">
        <div className="p-4 border-b border-neutral-800 flex items-center justify-between">
          <h3 className="text-xs font-mono font-bold text-white uppercase tracking-wider">
            Evidence Item Registry & Video Anchors
          </h3>
          <span className="text-[11px] font-mono text-amber-400">
            Click any row action to jump directly into the 4-camera video player
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-neutral-800 text-neutral-500 bg-neutral-950/60">
                <th className="p-3.5">ITEM ID</th>
                <th className="p-3.5">CAMERA & TIMECODE</th>
                <th className="p-3.5">ENTITY</th>
                <th className="p-3.5">FINDING</th>
                <th className="p-3.5">CONFIDENCE</th>
                <th className="p-3.5">SHA-256 HASH</th>
                <th className="p-3.5 text-right">ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800/60">
              {evidenceItems.map((item) => (
                <tr
                  key={item.id}
                  className="hover:bg-neutral-800/40 transition-colors group"
                >
                  <td className="p-3.5 font-bold text-amber-400">{item.id}</td>
                  <td className="p-3.5">
                    <div className="text-neutral-200 font-semibold">{item.camera}</div>
                    <div className="text-[11px] text-amber-400 font-bold">{item.timestamp}</div>
                  </td>
                  <td className="p-3.5 text-neutral-300">{item.entity}</td>
                  <td className="p-3.5 text-neutral-300 font-sans max-w-xs leading-relaxed">
                    {item.finding}
                  </td>
                  <td className="p-3.5">
                    <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold">
                      {item.confidence}
                    </span>
                  </td>
                  <td className="p-3.5">
                    <button
                      onClick={() => handleCopyHash(item.hash)}
                      className="text-[10px] text-neutral-500 hover:text-amber-400 flex items-center gap-1 font-mono transition-colors"
                      title="Click to copy full SHA-256 hash"
                    >
                      <span>{item.hash.slice(0, 10)}...</span>
                      <span>{copiedHash === item.hash ? "✓" : "📋"}</span>
                    </button>
                  </td>
                  <td className="p-3.5 text-right">
                    <button
                      onClick={() => handleInspectInVideo(item.timestampMs)}
                      className="px-3 py-1.5 rounded bg-amber-500 hover:bg-amber-400 text-black font-bold font-mono text-[11px] uppercase tracking-wider transition-all flex items-center gap-1.5 ml-auto shadow-[0_0_10px_rgba(245,158,11,0.2)]"
                    >
                      <span>▶</span> Seek Video
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
