"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

const TIMELINE_EVENTS = [
  { t: "10:42:11", label: "Person enters", sev: "normal" },
  { t: "10:42:16", label: "Approaches vehicle", sev: "warning" },
  { t: "10:42:19", label: "Vehicle moves", sev: "warning" },
  { t: "10:42:21", label: "Person falls", sev: "critical" },
  { t: "10:42:25", label: "Second person arrives", sev: "normal" },
];

export default function ProductExperienceSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="product-experience" className="py-32 relative" ref={ref}>
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 70% 50% at 50% 100%, rgba(245,158,11,0.03) 0%, transparent 60%)",
        }}
      />
      <div className="max-w-7xl mx-auto px-6">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-16 max-w-2xl"
        >
          <p className="eyebrow mb-4">PRODUCT EXPERIENCE</p>
          <h2
            className="text-4xl font-semibold tracking-tight leading-tight"
            style={{ color: "var(--color-text-primary)" }}
          >
            From footage
            <br />
            <span style={{ color: "var(--color-text-secondary)" }}>
              to a story you can investigate.
            </span>
          </h2>
        </motion.div>

        {/* Dashboard mockup */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="panel overflow-hidden"
        >
          {/* Top chrome */}
          <div
            className="flex items-center justify-between px-4 py-2.5"
            style={{ background: "var(--color-raised)", borderBottom: "1px solid var(--color-border)" }}
          >
            <div className="flex items-center gap-3">
              <div className="flex gap-1">
                <div className="w-2.5 h-2.5 rounded-full" style={{ background: "#2A2A2A" }} />
                <div className="w-2.5 h-2.5 rounded-full" style={{ background: "#2A2A2A" }} />
                <div className="w-2.5 h-2.5 rounded-full" style={{ background: "#2A2A2A" }} />
              </div>
              <span className="label-mono" style={{ color: "var(--color-text-muted)", fontSize: "0.6rem" }}>
                AI WITNESS — Investigation #0042 — Parking Lot Incident
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full" style={{ background: "var(--color-confirmed)" }} />
              <span className="label-mono" style={{ color: "var(--color-confirmed)", fontSize: "0.6rem" }}>
                ANALYSIS COMPLETE
              </span>
            </div>
          </div>

          {/* 3-column layout */}
          <div className="grid lg:grid-cols-[1fr_1.2fr_1fr]">
            {/* Left: Cameras */}
            <div
              className="p-4"
              style={{ borderRight: "1px solid var(--color-border)" }}
            >
              <div className="eyebrow mb-3">CAMERA FEEDS</div>
              <div className="space-y-2">
                {["CAM 01 — Entrance", "CAM 02 — Parking Lot", "CAM 03 — North View"].map((cam, i) => (
                  <div
                    key={cam}
                    className="camera-feed camera-scanline rounded-none"
                    style={{
                      border: i === 1 ? "1px solid var(--color-amber)" : "1px solid var(--color-border)",
                    }}
                  >
                    <div
                      className="absolute inset-0 flex items-center justify-center"
                      style={{ background: "#080A0C" }}
                    >
                      {/* Fake camera view */}
                      <div className="w-full h-full bg-grid opacity-20" style={{ backgroundSize: "16px 16px" }} />
                      {i === 1 && (
                        <div
                          className="absolute border-2"
                          style={{
                            border: "1.5px solid var(--color-amber)",
                            top: "25%",
                            left: "30%",
                            width: "20%",
                            height: "50%",
                          }}
                        />
                      )}
                    </div>
                    <div
                      className="absolute top-1.5 left-1.5 right-1.5 flex justify-between z-10"
                    >
                      <span className="label-mono px-1" style={{ background: "rgba(0,0,0,0.7)", color: "var(--color-text-secondary)", fontSize: "0.55rem" }}>
                        {cam}
                      </span>
                      <span className="timestamp px-1" style={{ background: "rgba(0,0,0,0.7)", fontSize: "0.55rem" }}>
                        {i === 0 ? "10:42:11" : i === 1 ? "10:42:19" : "10:42:21"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Center: Timeline */}
            <div
              className="p-4"
              style={{ borderRight: "1px solid var(--color-border)" }}
            >
              <div className="eyebrow mb-4">EVENT TIMELINE</div>
              <div className="relative">
                <div
                  className="absolute left-[7px] top-0 bottom-0 w-px"
                  style={{ background: "var(--color-border)" }}
                />
                <div className="space-y-4">
                  {TIMELINE_EVENTS.map((evt, i) => (
                    <motion.div
                      key={evt.t}
                      initial={{ opacity: 0, x: -10 }}
                      animate={inView ? { opacity: 1, x: 0 } : {}}
                      transition={{ delay: i * 0.1 + 0.5 }}
                      className="flex gap-3 pl-5 relative cursor-pointer group"
                    >
                      <div
                        className="absolute left-0 top-1 w-3.5 h-3.5 rounded-full border-2 z-10 transition-colors duration-200"
                        style={{
                          background: "var(--color-surface)",
                          borderColor:
                            evt.sev === "critical"
                              ? "var(--color-critical)"
                              : evt.sev === "warning"
                              ? "var(--color-amber)"
                              : "var(--color-confirmed)",
                        }}
                      />
                      <div>
                        <div
                          className="timestamp mb-0.5"
                          style={{ fontSize: "0.6rem" }}
                        >
                          {evt.t}
                        </div>
                        <div
                          className="label-mono font-medium group-hover:opacity-80 transition-opacity"
                          style={{
                            color:
                              evt.sev === "critical"
                                ? "var(--color-critical)"
                                : "var(--color-text-primary)",
                            fontSize: "0.75rem",
                          }}
                        >
                          {evt.sev === "critical" && "🔴 "}
                          {evt.label}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: AI Reconstruction */}
            <div className="p-4">
              <div className="eyebrow mb-4">AI RECONSTRUCTION</div>
              <div
                className="panel-raised p-4 mb-4"
                style={{ borderLeft: "2px solid var(--color-amber)" }}
              >
                <div
                  className="label-mono font-semibold mb-3"
                  style={{ color: "var(--color-amber)", fontSize: "0.65rem" }}
                >
                  INCIDENT RECONSTRUCTION
                </div>
                <p
                  className="label-mono leading-relaxed mb-4"
                  style={{ color: "var(--color-text-secondary)", fontSize: "0.65rem" }}
                >
                  Person #01 approached Vehicle #01 at 10:42:16.
                  <br />
                  <br />
                  Vehicle movement was detected 2.1 seconds before the fall.
                  <br />
                  <br />
                  Person #02 arrived 4 seconds after the fall event.
                </p>
                <div
                  className="pt-3"
                  style={{ borderTop: "1px solid var(--color-border)" }}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="label-mono" style={{ color: "var(--color-text-muted)", fontSize: "0.6rem" }}>
                      Confidence
                    </span>
                    <span
                      className="label-mono font-semibold"
                      style={{ color: "var(--color-confirmed)", fontSize: "0.65rem" }}
                    >
                      91%
                    </span>
                  </div>
                  {/* Bar */}
                  <div
                    className="h-1 rounded-full overflow-hidden"
                    style={{ background: "var(--color-border)" }}
                  >
                    <motion.div
                      initial={{ width: 0 }}
                      animate={inView ? { width: "91%" } : {}}
                      transition={{ duration: 1, delay: 1 }}
                      className="h-full"
                      style={{ background: "var(--color-confirmed)" }}
                    />
                  </div>
                </div>
              </div>

              {/* Evidence */}
              <div>
                <div className="eyebrow mb-2" style={{ fontSize: "0.55rem" }}>
                  EVIDENCE
                </div>
                <button
                  className="evidence-chip w-full justify-start mb-1.5"
                  style={{ width: "100%" }}
                >
                  ▶ CAM 02 / 10:42:19–10:42:23
                </button>
                <button className="evidence-chip w-full justify-start">
                  ▶ CAM 03 / 10:42:21–10:42:26
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
