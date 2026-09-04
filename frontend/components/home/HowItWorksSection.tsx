"use client";

import React from "react";
import { motion } from "framer-motion";
import { Video, Scan, GitMerge, BrainCircuit, FileText, ArrowRight } from "lucide-react";

const STAGES = [
  {
    step: "01",
    icon: Video,
    title: "RAW FOOTAGE",
    subtitle: "Multiple camera feeds",
    description: "Ingests asynchronous, multi-angle RTSP streams, bodycam footage, and archived video files without manual calibration.",
    metric: "Ingestion Latency: <120ms",
    accent: "from-blue-500/20 to-cyan-500/10",
  },
  {
    step: "02",
    icon: Scan,
    title: "VISION AI",
    subtitle: "Detect people, vehicles & objects",
    description: "Deep neural networks identify humans, motor vehicles, bicycles, and environmental objects with high-precision bounding geometries.",
    metric: "Detection Precision: 99.2%",
    accent: "from-cyan-500/20 to-teal-500/10",
  },
  {
    step: "03",
    icon: GitMerge,
    title: "TRACKING",
    subtitle: "Track entities across frames & cameras",
    description: "Autonomous re-identification (Re-ID) links identical individuals and vehicles across blind spots, occlusions, and distinct camera viewpoints.",
    metric: "Cross-Camera Re-ID: 97.8%",
    accent: "from-sky-500/20 to-blue-500/10",
  },
  {
    step: "04",
    icon: BrainCircuit,
    title: "EVENT UNDERSTANDING",
    subtitle: "Convert movement into meaningful events",
    description: "Translates raw velocity, vector deviations, and spatial proximity into discrete atomic actions (approaching, falling, stopping, accelerating).",
    metric: "Action Granularity: 100ms",
    accent: "from-cyan-500/20 to-indigo-500/10",
  },
  {
    step: "05",
    icon: FileText,
    title: "AI RECONSTRUCTION",
    subtitle: "Generate timeline, explanation & report",
    description: "Synthesizes a verifiable, chronological incident timeline with separate ground-truth observations and probabilistic causal inferences.",
    metric: "Audit Compliance: CJIS / ISO",
    accent: "from-indigo-500/20 to-cyan-500/10",
  },
];

export default function HowItWorksSection() {
  return (
    <section id="how-it-works" className="relative py-28 bg-[#06090F] border-t border-white/5 overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-cyan-500/5 blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-cyan-950/50 border border-cyan-500/30 text-cyan-300 font-mono text-xs uppercase tracking-widest mb-4">
            SYSTEM ARCHITECTURE
          </div>
          <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-white mb-6">
            FROM FOOTAGE TO UNDERSTANDING
          </h2>
          <p className="text-base sm:text-lg text-gray-400 font-normal leading-relaxed">
            AI Witness replaces manual video scrubbing with a 5-tier neural pipeline that transforms chaotic video pixels into an incontrovertible factual record.
          </p>
        </div>

        {/* 5 Stages Grid with Connecting Pathway */}
        <div className="relative">
          {/* Subtle horizontal connecting line on desktop */}
          <div className="hidden lg:block absolute top-[68px] left-[5%] right-[5%] h-px bg-gradient-to-r from-cyan-500/10 via-cyan-500/40 to-cyan-500/10 z-0" />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 relative z-10">
            {STAGES.map((stg, i) => {
              const Icon = stg.icon;
              return (
                <motion.div
                  key={stg.step}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.5 }}
                  className="bg-[#0A0F18]/90 border border-white/10 hover:border-cyan-500/40 p-6 rounded-2xl flex flex-col justify-between transition-all group hover:shadow-[0_8px_30px_rgba(6,182,212,0.15)]"
                >
                  <div>
                    {/* Top step badge & icon */}
                    <div className="flex items-center justify-between mb-6">
                      <span className="font-mono text-2xl font-bold text-cyan-400/80 group-hover:text-cyan-300 transition-colors">
                        {stg.step}
                      </span>
                      <div className="w-12 h-12 rounded-xl bg-[#0F1726] border border-cyan-500/20 flex items-center justify-center text-cyan-400 group-hover:border-cyan-400 transition-all shadow-inner">
                        <Icon className="w-5 h-5" />
                      </div>
                    </div>

                    <h3 className="font-mono text-sm font-bold text-white tracking-wider mb-1">
                      {stg.title}
                    </h3>
                    <div className="text-xs font-medium text-cyan-300/80 mb-3">
                      {stg.subtitle}
                    </div>
                    <p className="text-xs text-gray-400 leading-relaxed mb-6 font-normal">
                      {stg.description}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-white/5 flex items-center justify-between">
                    <span className="font-mono text-[10px] text-gray-400">
                      {stg.metric}
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
