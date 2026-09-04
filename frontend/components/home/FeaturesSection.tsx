"use client";

import React from "react";
import { motion } from "framer-motion";
import { GitBranch, History, Cpu, FileCheck2, ArrowUpRight } from "lucide-react";

const FEATURES = [
  {
    icon: GitBranch,
    code: "FEAT-01",
    title: "MULTI-CAMERA CORRELATION",
    subtitle: "Connect events across different camera feeds.",
    description:
      "Tracks subjects across non-overlapping view cones and blind spots. Employs deep geometric projective mapping and feature re-identification so people and vehicles never lose identity across cameras.",
    highlights: ["Unified 3D Coordinate Mapping", "Occlusion Recovery", "Multi-Sensor Timestamp Sync"],
  },
  {
    icon: History,
    code: "FEAT-02",
    title: "TEMPORAL REASONING",
    subtitle: "Understand what happened before and after an incident.",
    description:
      "Detects causal chains rather than isolated bounding boxes. Evaluates pre-incident positioning, acceleration triggers, reaction intervals, and post-incident behaviors to answer 'why' and 'how'.",
    highlights: ["Causal Precursor Analysis", "Velocity Vector Profiling", "Contributory Factor Mapping"],
  },
  {
    icon: Cpu,
    code: "FEAT-03",
    title: "AI INCIDENT RECONSTRUCTION",
    subtitle: "Turn raw footage into a chronological explanation.",
    description:
      "Synthesizes multi-stream video into an explainable narrative. Generates high-confidence natural language incident summaries alongside quantitative 3D spatial reconstructions.",
    highlights: ["Probabilistic 3D Trajectories", "Audit-Ready Plain Text", "Strict Separation of Fact & Inference"],
  },
  {
    icon: FileCheck2,
    code: "FEAT-04",
    title: "EVIDENCE TIMELINE",
    subtitle: "Every important conclusion is linked to video timestamps.",
    description:
      "Zero black-box hallucinations. Every single claim, velocity estimation, and inference is anchored to exact millisecond video timestamps and source camera frames for courtroom and internal audit integrity.",
    highlights: ["Frame-Accurate Citation", "Cryptographic Hash Export", "Courtroom-Admissible Format"],
  },
];

export default function FeaturesSection() {
  return (
    <section id="features" className="py-28 bg-[#06090F] border-t border-white/5 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-cyan-950/50 border border-cyan-500/30 text-cyan-300 font-mono text-xs uppercase tracking-widest mb-4">
              CAPABILITIES
            </div>
            <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-white">
              ENGINEERED FOR TRUTH
            </h2>
          </div>
          <p className="text-sm sm:text-base text-gray-400 max-w-md font-normal leading-relaxed">
            Eliminate human observation fatigue with high-precision temporal intelligence and verifiable multi-camera reasoning.
          </p>
        </div>

        {/* 4 Premium Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {FEATURES.map((feat, index) => {
            const Icon = feat.icon;
            return (
              <motion.div
                key={feat.code}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className="bg-[#0A0F18]/90 border border-white/10 hover:border-cyan-500/40 p-8 rounded-2xl flex flex-col justify-between transition-all group hover:shadow-[0_8px_30px_rgba(6,182,212,0.12)]"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-12 h-12 rounded-xl bg-[#0F1726] border border-cyan-500/20 flex items-center justify-center text-cyan-400 group-hover:border-cyan-400 group-hover:bg-cyan-950/40 transition-all">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="font-mono text-xs text-gray-500 group-hover:text-cyan-400 transition-colors">
                      {feat.code}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-white mb-2 tracking-wide font-mono">
                    {feat.title}
                  </h3>
                  <div className="text-sm text-cyan-300/90 mb-4 font-medium">
                    {feat.subtitle}
                  </div>
                  <p className="text-sm text-gray-400 font-normal leading-relaxed mb-8">
                    {feat.description}
                  </p>
                </div>

                <div className="pt-6 border-t border-white/5">
                  <div className="flex flex-wrap gap-2">
                    {feat.highlights.map((h, i) => (
                      <span
                        key={i}
                        className="px-2.5 py-1 rounded bg-[#070B12] border border-white/10 text-[11px] font-mono text-gray-300"
                      >
                        {h}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
