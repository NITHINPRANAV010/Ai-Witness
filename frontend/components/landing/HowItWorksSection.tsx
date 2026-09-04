"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

const STAGES = [
  {
    num: "01",
    title: "CAPTURE",
    desc: "Multi-camera footage\naccepted from any source",
    icon: "📹",
  },
  {
    num: "02",
    title: "UNDERSTAND",
    desc: "YOLO detects people,\nvehicles and objects",
    icon: "🔍",
  },
  {
    num: "03",
    title: "TRACK",
    desc: "ByteTrack assigns\npersistent entity IDs",
    icon: "🎯",
  },
  {
    num: "04",
    title: "RECONSTRUCT",
    desc: "Events connected into\na chronological timeline",
    icon: "🔗",
  },
  {
    num: "05",
    title: "EXPLAIN",
    desc: "Gemini generates an\nevidence-backed report",
    icon: "✦",
  },
];

export default function HowItWorksSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="how-it-works" className="py-32 relative" ref={ref}>
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <p className="eyebrow mb-4">HOW IT WORKS</p>
          <h2
            className="text-4xl font-semibold tracking-tight"
            style={{ color: "var(--color-text-primary)" }}
          >
            From footage to reconstruction
            <br />
            <span style={{ color: "var(--color-text-secondary)" }}>
              in five stages.
            </span>
          </h2>
        </motion.div>

        {/* Pipeline — Desktop horizontal, mobile vertical */}
        <div className="hidden lg:flex items-stretch gap-0">
          {STAGES.map((stage, i) => (
            <motion.div
              key={stage.num}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.1 + 0.2 }}
              className="flex-1 relative"
            >
              {/* Connector line */}
              {i < STAGES.length - 1 && (
                <div
                  className="absolute top-10 right-0 w-px h-8 translate-x-0.5 z-10"
                  style={{ background: "var(--color-amber)", opacity: inView ? 1 : 0, transition: `opacity 0.3s ${i * 0.1 + 0.5}s ease` }}
                />
              )}
              <div
                className="panel h-full p-6 mr-px transition-all duration-300 group"
                style={{ borderRight: i < STAGES.length - 1 ? "none" : undefined }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor = "var(--color-amber)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor = "var(--color-border)";
                }}
              >
                <div
                  className="font-mono text-xs font-semibold mb-4"
                  style={{ color: "var(--color-amber)" }}
                >
                  {stage.num}
                </div>
                <div
                  className="text-2xl mb-4"
                  role="img"
                  aria-label={stage.title}
                >
                  {stage.icon}
                </div>
                <div
                  className="label-mono font-semibold mb-3 tracking-wide"
                  style={{ color: "var(--color-text-primary)", fontSize: "0.7rem" }}
                >
                  {stage.title}
                </div>
                <p
                  className="label-mono leading-relaxed"
                  style={{ color: "var(--color-text-muted)", whiteSpace: "pre-line", fontSize: "0.65rem" }}
                >
                  {stage.desc}
                </p>
                {i < STAGES.length - 1 && (
                  <div
                    className="mt-4 label-mono"
                    style={{ color: "var(--color-text-muted)", fontSize: "0.65rem" }}
                  >
                    ↓
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Mobile: vertical */}
        <div className="lg:hidden space-y-px">
          {STAGES.map((stage, i) => (
            <motion.div
              key={stage.num}
              initial={{ opacity: 0, x: -16 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.4, delay: i * 0.08 + 0.2 }}
              className="panel p-5 flex gap-5"
            >
              <div className="flex-shrink-0">
                <div
                  className="font-mono text-xs font-semibold mb-1"
                  style={{ color: "var(--color-amber)" }}
                >
                  {stage.num}
                </div>
                <div className="text-xl">{stage.icon}</div>
              </div>
              <div>
                <div
                  className="label-mono font-semibold mb-1"
                  style={{ color: "var(--color-text-primary)", fontSize: "0.7rem" }}
                >
                  {stage.title}
                </div>
                <p
                  className="label-mono"
                  style={{ color: "var(--color-text-muted)", fontSize: "0.65rem", whiteSpace: "pre-line" }}
                >
                  {stage.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Technology badges */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="mt-12 flex flex-wrap gap-3"
        >
          <p className="w-full eyebrow mb-2">POWERED BY</p>
          {["YOLOv8", "ByteTrack", "OpenCV", "Google Gemini", "FastAPI", "Next.js"].map((tech) => (
            <span
              key={tech}
              className="label-mono px-3 py-1.5"
              style={{
                border: "1px solid var(--color-border)",
                color: "var(--color-text-muted)",
                fontSize: "0.65rem",
              }}
            >
              {tech}
            </span>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
