"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

const USE_CASES = [
  {
    id: "incident-investigation",
    title: "Incident Investigation",
    desc: "Accidents, disputes, and unexpected events across facilities and public spaces. Turn hours of review into minutes of structured evidence.",
    tags: ["Falls", "Disputes", "Accidents", "Property Damage"],
    stat: { value: "14×", label: "faster than manual review" },
  },
  {
    id: "industrial-safety",
    title: "Industrial Safety",
    desc: "Understand dangerous sequences around machinery, production lines, and restricted zones. Reconstruct how safety incidents developed.",
    tags: ["Machinery", "PPE Violations", "Zone Intrusion", "Near-Miss"],
    stat: { value: "91%", label: "detection confidence" },
  },
  {
    id: "campus-security",
    title: "Campus & Facility Security",
    desc: "Investigate incidents across multiple cameras and buildings. Understand entity movement patterns across the entire site.",
    tags: ["Multi-camera", "Intrusion", "Crowd Behavior", "Access Control"],
    stat: { value: "3+", label: "cameras correlated" },
  },
  {
    id: "transportation",
    title: "Transportation",
    desc: "Reconstruct road and vehicle incidents using footage from intersection cameras, parking lots, and fleet cameras.",
    tags: ["Vehicle-Pedestrian", "Parking Lot", "Fleet", "Intersection"],
    stat: { value: "2.1s", label: "precision timing" },
  },
  {
    id: "warehouses",
    title: "Warehouse & Logistics",
    desc: "Understand operational incidents, inventory events, and safety sequences in high-traffic warehouse environments.",
    tags: ["Forklift", "Slip & Fall", "Loading Dock", "Asset Tracking"],
    stat: { value: "24/7", label: "continuous analysis" },
  },
];

export default function UseCasesSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section id="use-cases" className="py-32" ref={ref}>
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <p className="eyebrow mb-4">USE CASES</p>
          <h2
            className="text-4xl font-semibold tracking-tight"
            style={{ color: "var(--color-text-primary)" }}
          >
            Built for every
            <br />
            <span style={{ color: "var(--color-text-secondary)" }}>
              investigation context.
            </span>
          </h2>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-px" style={{ background: "var(--color-border)" }}>
          {USE_CASES.map((uc, i) => (
            <motion.div
              key={uc.id}
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.08 + 0.2 }}
              className="panel p-7 group transition-all duration-300 cursor-pointer"
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.background = "var(--color-raised)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.background = "var(--color-surface)";
              }}
            >
              <div
                className="text-xs font-mono font-semibold mb-4"
                style={{ color: "var(--color-amber)" }}
              >
                0{i + 1}
              </div>
              <h3
                className="text-lg font-semibold mb-3 tracking-tight"
                style={{ color: "var(--color-text-primary)" }}
              >
                {uc.title}
              </h3>
              <p
                className="text-sm leading-relaxed mb-5"
                style={{ color: "var(--color-text-secondary)" }}
              >
                {uc.desc}
              </p>
              <div className="flex flex-wrap gap-1.5 mb-6">
                {uc.tags.map((tag) => (
                  <span
                    key={tag}
                    className="label-mono px-2 py-1"
                    style={{
                      background: "var(--color-surface)",
                      border: "1px solid var(--color-border)",
                      color: "var(--color-text-muted)",
                      fontSize: "0.6rem",
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <div
                className="pt-4"
                style={{ borderTop: "1px solid var(--color-border)" }}
              >
                <span
                  className="text-2xl font-semibold font-mono"
                  style={{ color: "var(--color-amber)" }}
                >
                  {uc.stat.value}
                </span>
                <div className="label-mono mt-1" style={{ color: "var(--color-text-muted)", fontSize: "0.6rem" }}>
                  {uc.stat.label}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
