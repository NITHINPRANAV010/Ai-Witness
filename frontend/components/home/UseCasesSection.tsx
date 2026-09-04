"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  Building2,
  GraduationCap,
  Factory,
  Users,
  TrainTrack,
  Warehouse,
  ArrowRight,
  ShieldAlert,
} from "lucide-react";
import Link from "next/link";

const USE_CASES = [
  {
    icon: Building2,
    sector: "SMART CITIES",
    title: "Urban Traffic & Pedestrian Incidents",
    description:
      "Correlate municipal street cameras to reconstruct hit-and-runs, intersection collisions, and traffic violations across complex multi-block grids.",
    telemetry: "AVG RECONSTRUCTION: 4.2 MIN",
    tag: "MUNICIPAL",
  },
  {
    icon: GraduationCap,
    sector: "CAMPUS SECURITY",
    title: "Perimeter & Student Safety",
    description:
      "Verify perimeter breaches, night pathway security incidents, and campus disputes without dispatching officers to scrub dozens of dorm feeds.",
    telemetry: "99.4% VERIFICATION RATE",
    tag: "EDUCATION",
  },
  {
    icon: Factory,
    sector: "INDUSTRIAL SAFETY",
    title: "Heavy Machinery & OSHA Compliance",
    description:
      "Investigate forklift near-misses, crane pinch points, and hazardous zone incursions to ascertain root cause and prevent catastrophic downtime.",
    telemetry: "ZERO-BLIND-SPOT AUDIT",
    tag: "MANUFACTURING",
  },
  {
    icon: Users,
    sector: "PUBLIC SPACES",
    title: "Transit Hubs & Event Arenas",
    description:
      "Track crowd dynamics, identify unattended luggage origins across multi-level concourses, and rapidly resolve terminal medical emergencies.",
    telemetry: "CONCOURSE MULTI-FEED SYNC",
    tag: "CIVIC HUBS",
  },
  {
    icon: TrainTrack,
    sector: "TRANSPORTATION",
    title: "Rail Crossings & Airport Aprons",
    description:
      "Resolve runway ground collisions, level crossing gate intrusions, and freight yard switching incidents with sub-frame microsecond alignment.",
    telemetry: "SUB-FRAME TIME ALIGNMENT",
    tag: "LOGISTICS",
  },
  {
    icon: Warehouse,
    sector: "FACILITY MANAGEMENT",
    title: "Loading Docks & Commercial Real Estate",
    description:
      "Establish definitive liability for freight damages, slip-and-fall claims, and unauthorized after-hours dock access with court-admissible dossiers.",
    telemetry: "LIABILITY RESOLUTION: <1 HR",
    tag: "COMMERCIAL",
  },
];

export default function UseCasesSection() {
  return (
    <section id="use-cases" className="py-28 bg-[#05080E] border-t border-white/5 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-cyan-950/50 border border-cyan-500/30 text-cyan-300 font-mono text-xs uppercase tracking-widest mb-4">
            DEPLOYMENT PROFILES
          </div>
          <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-white mb-4">
            BUILT FOR REAL-WORLD INCIDENTS
          </h2>
          <p className="text-base sm:text-lg text-gray-400 font-normal leading-relaxed">
            From municipal intersections to high-consequence industrial facilities, AI Witness provides instant clarity when seconds and truth matter.
          </p>
        </div>

        {/* 6 Grid Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {USE_CASES.map((uc, i) => {
            const Icon = uc.icon;
            return (
              <motion.div
                key={uc.sector}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.4 }}
                className="bg-[#080D15]/90 border border-white/10 hover:border-cyan-500/40 p-7 rounded-2xl flex flex-col justify-between transition-all group hover:bg-[#0C121C]"
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div className="w-10 h-10 rounded-lg bg-[#0F1726] border border-cyan-500/20 flex items-center justify-center text-cyan-400 group-hover:border-cyan-400 transition-all">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="font-mono text-[10px] text-cyan-300 bg-cyan-950/60 border border-cyan-500/20 px-2.5 py-0.5 rounded uppercase">
                      {uc.tag}
                    </span>
                  </div>

                  <div className="font-mono text-xs text-gray-400 tracking-wider uppercase mb-1">
                    {uc.sector}
                  </div>
                  <h3 className="text-lg font-bold text-white mb-3">
                    {uc.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-400 font-normal leading-relaxed mb-6">
                    {uc.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-white/5 flex items-center justify-between font-mono text-[11px]">
                  <span className="text-cyan-400/80">{uc.telemetry}</span>
                  <Link
                    href="/investigate"
                    className="text-gray-400 hover:text-white flex items-center gap-1 group-hover:translate-x-1 transition-transform"
                  >
                    Deploy <ArrowRight className="w-3.5 h-3.5 text-cyan-400" />
                  </Link>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
