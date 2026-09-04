"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

const OBSERVED = [
  { id: "obs-01", text: "Person #01 fell at 10:42:21.", camera: "CAM 03", ts: "10:42:21" },
  { id: "obs-02", text: "Vehicle #01 moved at 10:42:19.", camera: "CAM 02", ts: "10:42:19" },
  {
    id: "obs-03",
    text: "Person #01 was within 0.8m of Vehicle #01 at the time of movement.",
    camera: "CAM 02",
    ts: "10:42:19",
  },
];

const INFERRED = [
  {
    text: "The vehicle movement may have contributed to the fall of Person #01, given the 2.1-second interval and spatial proximity.",
    confidence: 78,
  },
  {
    text: "Person #02 appears to have been responding to the fall, based on their arrival trajectory and timing.",
    confidence: 65,
  },
];

export default function ReasoningSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="technology" className="py-32 relative" ref={ref}>
      <div
        className="absolute inset-y-0 left-0 right-0"
        style={{ background: "var(--color-surface)", borderTop: "1px solid var(--color-border)", borderBottom: "1px solid var(--color-border)" }}
      />

      <div className="relative max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-14"
        >
          <p className="eyebrow mb-4">EXPLAINABLE AI</p>
          <h2
            className="text-4xl font-semibold tracking-tight"
            style={{ color: "var(--color-text-primary)" }}
          >
            Every conclusion
            <br />
            <span style={{ color: "var(--color-text-secondary)" }}>
              has evidence behind it.
            </span>
          </h2>
          <p
            className="mt-4 text-base max-w-xl"
            style={{ color: "var(--color-text-secondary)" }}
          >
            AI Witness separates what was directly detected in footage from what
            the AI believes happened based on the event sequence. No uncertain
            conclusions are presented as confirmed facts.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* OBSERVED */}
          <motion.div
            initial={{ opacity: 0, x: -16 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div
              className="flex items-center gap-2 mb-4 pb-3"
              style={{ borderBottom: "1px solid var(--color-border)" }}
            >
              <span
                className="w-2 h-2 rounded-full"
                style={{ background: "var(--color-confirmed)" }}
              />
              <span
                className="label-mono font-semibold tracking-wide"
                style={{ color: "var(--color-confirmed)", fontSize: "0.7rem" }}
              >
                OBSERVED
              </span>
              <span className="label-mono ml-auto" style={{ color: "var(--color-text-muted)", fontSize: "0.6rem" }}>
                Directly detected in footage
              </span>
            </div>
            <div className="space-y-3">
              {OBSERVED.map((fact, i) => (
                <motion.div
                  key={fact.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: i * 0.1 + 0.4 }}
                  className="panel p-4"
                >
                  <p
                    className="mb-2"
                    style={{ color: "var(--color-text-primary)", fontSize: "0.85rem", lineHeight: 1.5 }}
                  >
                    {fact.text}
                  </p>
                  <div className="flex items-center gap-2">
                    <span className="evidence-chip">
                      {fact.camera} / {fact.ts}
                    </span>
                    <span
                      className="label-mono"
                      style={{ color: "var(--color-text-muted)", fontSize: "0.6rem" }}
                    >
                      Detected
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* INFERRED */}
          <motion.div
            initial={{ opacity: 0, x: 16 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <div
              className="flex items-center gap-2 mb-4 pb-3"
              style={{ borderBottom: "1px solid var(--color-border)" }}
            >
              <span
                className="w-2 h-2 rounded-full"
                style={{ background: "var(--color-amber)" }}
              />
              <span
                className="label-mono font-semibold tracking-wide"
                style={{ color: "var(--color-amber)", fontSize: "0.7rem" }}
              >
                INFERRED
              </span>
              <span className="label-mono ml-auto" style={{ color: "var(--color-text-muted)", fontSize: "0.6rem" }}>
                AI interpretation — not confirmed
              </span>
            </div>
            <div className="space-y-3">
              {INFERRED.map((inf, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 8 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: i * 0.1 + 0.5 }}
                  className="panel p-4"
                  style={{ borderLeft: "2px solid var(--color-amber)" }}
                >
                  <p
                    className="mb-3"
                    style={{ color: "var(--color-text-secondary)", fontSize: "0.85rem", lineHeight: 1.5 }}
                  >
                    {inf.text}
                  </p>
                  <div className="flex items-center gap-3">
                    <span
                      className="label-mono"
                      style={{ color: "var(--color-text-muted)", fontSize: "0.6rem" }}
                    >
                      Confidence:
                    </span>
                    <div
                      className="flex-1 h-1 rounded-full overflow-hidden"
                      style={{ background: "var(--color-border)" }}
                    >
                      <motion.div
                        initial={{ width: 0 }}
                        animate={inView ? { width: `${inf.confidence}%` } : {}}
                        transition={{ duration: 0.8, delay: i * 0.2 + 0.8 }}
                        className="h-full"
                        style={{ background: "var(--color-amber)" }}
                      />
                    </div>
                    <span
                      className="label-mono font-semibold"
                      style={{ color: "var(--color-amber)", fontSize: "0.65rem" }}
                    >
                      {inf.confidence}%
                    </span>
                  </div>
                </motion.div>
              ))}

              {/* Disclaimer */}
              <div
                className="p-4"
                style={{
                  background: "rgba(245,158,11,0.04)",
                  border: "1px dashed rgba(245,158,11,0.2)",
                }}
              >
                <p
                  className="label-mono"
                  style={{ color: "var(--color-text-muted)", fontSize: "0.65rem", lineHeight: 1.6 }}
                >
                  AI inferences are clearly marked and separated from observed
                  facts. Investigators can review supporting evidence for every
                  conclusion before acting on it.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
