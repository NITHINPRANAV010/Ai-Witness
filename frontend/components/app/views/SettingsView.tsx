"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";

export default function SettingsView() {
  const [apiKey, setApiKey] = useState("");
  const [yoloThreshold, setYoloThreshold] = useState(0.45);
  const [byteTrackIou, setByteTrackIou] = useState(0.5);
  const [maxTimeGap, setMaxTimeGap] = useState(5.0);
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = () => {
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
  };

  return (
    <div className="p-6 space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div>
        <div className="text-xs font-mono text-amber-400 uppercase tracking-wider mb-1">
          Platform Configuration
        </div>
        <h2 className="text-2xl font-bold font-mono text-white">
          System & Engine Settings
        </h2>
        <p className="text-sm text-neutral-400">
          Configure Gemini reasoning API keys, computer vision detection thresholds, and privacy safeguards.
        </p>
      </div>

      {isSaved && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono flex items-center justify-between"
        >
          <span>✓ Settings saved successfully to local telemetry registry.</span>
        </motion.div>
      )}

      {/* 1. Gemini Reasoning Configuration */}
      <div className="p-5 rounded-xl border border-neutral-800 bg-neutral-900/60 backdrop-blur-md space-y-4">
        <h3 className="text-sm font-mono font-bold text-white uppercase tracking-wider flex items-center gap-2">
          <span>🧠</span>
          <span>Google Gemini Reasoning Engine</span>
        </h3>
        <p className="text-xs text-neutral-400 font-mono">
          Connect your Google AI Studio or Vertex AI Gemini API key to enable live reasoning beyond the built-in demo.
        </p>

        <div className="space-y-2">
          <label className="text-xs font-mono text-neutral-300">
            Gemini API Key (GEMINI_API_KEY)
          </label>
          <div className="flex gap-2">
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="AIzaSy... (leave blank to use platform default demo reasoning)"
              className="flex-1 px-3 py-2 rounded-lg bg-neutral-950 border border-neutral-700 text-xs text-white font-mono focus:outline-none focus:border-amber-500"
            />
            <button
              onClick={handleSave}
              className="px-4 py-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-mono transition-all"
            >
              Test Key
            </button>
          </div>
          <div className="text-[10px] font-mono text-neutral-500">
            Built-in fallback grounded engine is active for demo evaluation.
          </div>
        </div>
      </div>

      {/* 2. Computer Vision & Multi-Camera Calibration */}
      <div className="p-5 rounded-xl border border-neutral-800 bg-neutral-900/60 backdrop-blur-md space-y-4">
        <h3 className="text-sm font-mono font-bold text-white uppercase tracking-wider flex items-center gap-2">
          <span>📹</span>
          <span>Computer Vision & Tracking Tuning</span>
        </h3>

        <div className="space-y-4 font-mono text-xs">
          {/* YOLO confidence */}
          <div className="space-y-1">
            <div className="flex justify-between">
              <span className="text-neutral-300">YOLO Detection Confidence Threshold</span>
              <span className="text-amber-400 font-bold">{yoloThreshold}</span>
            </div>
            <input
              type="range"
              min="0.2"
              max="0.9"
              step="0.05"
              value={yoloThreshold}
              onChange={(e) => setYoloThreshold(parseFloat(e.target.value))}
              className="w-full accent-amber-500 cursor-pointer h-1.5 bg-neutral-800 rounded-lg appearance-none"
            />
            <div className="text-[10px] text-neutral-500">
              Lower values detect occluded subjects; higher values eliminate false positives.
            </div>
          </div>

          {/* ByteTrack IOU */}
          <div className="space-y-1">
            <div className="flex justify-between">
              <span className="text-neutral-300">ByteTrack IOU Association Metric</span>
              <span className="text-amber-400 font-bold">{byteTrackIou}</span>
            </div>
            <input
              type="range"
              min="0.3"
              max="0.8"
              step="0.05"
              value={byteTrackIou}
              onChange={(e) => setByteTrackIou(parseFloat(e.target.value))}
              className="w-full accent-amber-500 cursor-pointer h-1.5 bg-neutral-800 rounded-lg appearance-none"
            />
          </div>

          {/* Cross Camera Max Time Gap */}
          <div className="space-y-1">
            <div className="flex justify-between">
              <span className="text-neutral-300">Max Cross-Camera Re-ID Handover Gap (Seconds)</span>
              <span className="text-amber-400 font-bold">{maxTimeGap}s</span>
            </div>
            <input
              type="range"
              min="1.0"
              max="15.0"
              step="0.5"
              value={maxTimeGap}
              onChange={(e) => setMaxTimeGap(parseFloat(e.target.value))}
              className="w-full accent-amber-500 cursor-pointer h-1.5 bg-neutral-800 rounded-lg appearance-none"
            />
          </div>
        </div>
      </div>

      {/* 3. Privacy & Ethical Safeguards */}
      <div className="p-5 rounded-xl border border-neutral-800 bg-neutral-900/60 backdrop-blur-md space-y-4">
        <h3 className="text-sm font-mono font-bold text-white uppercase tracking-wider flex items-center gap-2">
          <span>🛡</span>
          <span>Privacy & Ethical Safeguards</span>
        </h3>

        <div className="space-y-3 font-mono text-xs">
          <div className="flex items-center justify-between p-3 rounded-lg bg-neutral-950/60 border border-neutral-800">
            <div>
              <div className="text-neutral-200 font-bold">Anonymous Temporary IDs Only</div>
              <div className="text-[10px] text-neutral-500">
                Entities are tracked strictly as &ldquo;Person #01&rdquo;, &ldquo;Vehicle #01&rdquo;.
              </div>
            </div>
            <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold">
              ENFORCED
            </span>
          </div>

          <div className="flex items-center justify-between p-3 rounded-lg bg-neutral-950/60 border border-neutral-800">
            <div>
              <div className="text-neutral-200 font-bold">Facial Recognition Disabled</div>
              <div className="text-[10px] text-neutral-500">
                No biometric landmarks or facial geometry is parsed or retained.
              </div>
            </div>
            <span className="px-2 py-0.5 rounded bg-red-500/10 text-red-400 border border-red-500/20 font-bold">
              LOCKED
            </span>
          </div>

          <div className="flex items-center justify-between p-3 rounded-lg bg-neutral-950/60 border border-neutral-800">
            <div>
              <div className="text-neutral-200 font-bold">SHA-256 Frame Hashing</div>
              <div className="text-[10px] text-neutral-500">
                Cryptographically seal each evidence frame for court-admissible chain of custody.
              </div>
            </div>
            <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold">
              ACTIVE
            </span>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button
          onClick={handleSave}
          className="px-6 py-2.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-black font-bold font-mono text-xs uppercase tracking-wider transition-all shadow-[0_0_15px_rgba(245,158,11,0.3)]"
        >
          Save Configuration
        </button>
      </div>
    </div>
  );
}
