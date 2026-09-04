"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface PipelineProcessingModalProps {
  isOpen: boolean;
  onComplete: () => void;
}

export default function PipelineProcessingModal({
  isOpen,
  onComplete,
}: PipelineProcessingModalProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);

  const steps = [
    {
      id: "ingestion",
      title: "Video Ingestion & Stream Calibration",
      desc: "Ingesting 4 CCTV angles (CAM 01–04), calibrating timestamps to UTC.",
      icon: "📥",
      latency: "180ms",
    },
    {
      id: "detection",
      title: "Object Detection (YOLOv8)",
      desc: "Bounding box inference on 4 streams: pedestrians, commercial vehicles.",
      icon: "🎯",
      latency: "240ms",
    },
    {
      id: "tracking",
      title: "Tracking & Anonymous ID Assignment (ByteTrack)",
      desc: "Assigning anonymous IDs: Person #01, Vehicle #01, Person #02 (No face rec).",
      icon: "🔄",
      latency: "310ms",
    },
    {
      id: "events",
      title: "Event Extraction Pipeline",
      desc: "Extracting 5 kinematic milestones: entry, approach, reverse, fall, witness.",
      icon: "⚡",
      latency: "190ms",
    },
    {
      id: "correlation",
      title: "Camera Cross-Correlation & Spatial Re-ID",
      desc: "Connecting disjointed viewpoints: CAM-01 ↔ CAM-02 ↔ CAM-03 ↔ CAM-04.",
      icon: "🔗",
      latency: "280ms",
    },
    {
      id: "reasoning",
      title: "AI Spatio-Temporal Reasoning (Gemini 1.5 Pro)",
      desc: "Grounded causal synthesis: distinguishing OBSERVED FACTS from AI INFERENCES.",
      icon: "🧠",
      latency: "420ms",
    },
  ];

  useEffect(() => {
    if (!isOpen) {
      setCurrentStep(0);
      setProgress(0);
      return;
    }

    let step = 0;
    const totalSteps = steps.length;

    const interval = setInterval(() => {
      step++;
      if (step < totalSteps) {
        setCurrentStep(step);
        setProgress(Math.round(((step + 1) / (totalSteps + 1)) * 100));
      } else if (step === totalSteps) {
        // All steps finished, show RECONSTRUCTION READY
        setCurrentStep(totalSteps);
        setProgress(100);
      } else {
        clearInterval(interval);
        setTimeout(() => {
          onComplete();
        }, 700);
      }
    }, 450);

    return () => clearInterval(interval);
  }, [isOpen]);

  if (!isOpen) return null;

  const isReady = currentStep >= steps.length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl">
      <motion.div
        initial={{ opacity: 0, scale: 0.94 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.94 }}
        className="w-full max-w-2xl rounded-2xl border border-neutral-700 bg-neutral-900/95 p-7 space-y-6 shadow-2xl relative overflow-hidden"
      >
        {/* Glowing background accents */}
        <div className="absolute -top-24 -left-24 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="flex items-center justify-between border-b border-neutral-800 pb-4 relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-amber-500 text-black font-bold flex items-center justify-center text-sm font-mono shadow-[0_0_15px_rgba(245,158,11,0.4)]">
              AI
            </div>
            <div>
              <div className="text-[10px] font-mono text-amber-400 uppercase tracking-wider font-semibold">
                Multi-Camera Incident Reconstruction Pipeline
              </div>
              <h3 className="text-lg font-bold font-mono text-white">
                {isReady ? "Reconstruction Synthesis Finalized" : "Analyzing 4 Synchronized Feeds..."}
              </h3>
            </div>
          </div>

          <div className="text-right font-mono text-xs">
            <span className="text-neutral-500">PROGRESS: </span>
            <span className="text-amber-400 font-bold">{progress}%</span>
          </div>
        </div>

        {/* Global Progress Bar */}
        <div className="w-full h-2 rounded-full bg-neutral-950 overflow-hidden border border-neutral-800 relative z-10">
          <motion.div
            className="h-full bg-gradient-to-r from-amber-500 to-yellow-300"
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          />
        </div>

        {/* Step Sequence List */}
        <div className="space-y-2 relative z-10 font-mono text-xs">
          {steps.map((st, idx) => {
            const isCompleted = currentStep > idx;
            const isCurrent = currentStep === idx;
            const isPending = currentStep < idx;

            return (
              <div
                key={st.id}
                className={`p-2.5 rounded-lg border transition-all flex items-center justify-between ${
                  isCurrent
                    ? "bg-amber-500/10 border-amber-500/40 text-neutral-100 shadow-[0_0_10px_rgba(245,158,11,0.15)]"
                    : isCompleted
                    ? "bg-neutral-950/60 border-neutral-800 text-neutral-300"
                    : "bg-neutral-950/20 border-neutral-900 text-neutral-600"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-5 text-center">
                    {isCompleted ? (
                      <span className="text-emerald-400 font-bold text-sm">✓</span>
                    ) : isCurrent ? (
                      <span className="inline-block w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping" />
                    ) : (
                      <span className="text-neutral-600 text-xs">○</span>
                    )}
                  </div>
                  <div>
                    <div className="font-semibold flex items-center gap-1.5">
                      <span>{st.icon}</span>
                      <span className={isCurrent ? "text-amber-400" : ""}>{st.title}</span>
                    </div>
                    <div className="text-[10px] text-neutral-500">{st.desc}</div>
                  </div>
                </div>

                <div className="text-[10px] text-neutral-500">
                  {isCompleted ? (
                    <span className="text-emerald-400">DONE</span>
                  ) : isCurrent ? (
                    <span className="text-amber-400 animate-pulse">PROCESSING</span>
                  ) : (
                    "QUEUED"
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Final Status Callout */}
        {isReady && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-3.5 rounded-xl bg-emerald-500/15 border border-emerald-500/40 text-center text-xs font-mono font-bold text-emerald-300 tracking-wider shadow-[0_0_20px_rgba(16,185,129,0.2)] flex items-center justify-center gap-2"
          >
            <span>✓</span>
            <span>RECONSTRUCTION READY · 4 CAMERAS SYNCHRONIZED · CONFIDENCE 94.2%</span>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
