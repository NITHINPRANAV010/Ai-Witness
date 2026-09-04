"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

const PRINCIPLES = [
  {
    icon: "◎",
    title: "Temporary Entity IDs",
    desc: "Entities are assigned temporary identifiers such as Person #01 and Vehicle #02. No personal identity data is required or stored.",
  },
  {
    icon: "◈",
    title: "Evidence-Based Analysis",
    desc: "All conclusions are grounded in specific camera timestamps. Nothing is inferred without supporting observed data.",
  },
  {
    icon: "◇",
    title: "No Facial Recognition",
    desc: "AI Witness identifies and tracks entities by movement, position, and shape — not by biometric identification.",
  },
  {
    icon: "◻",
    title: "Configurable Retention",
    desc: "Video data and analysis results can be configured for automatic deletion after a defined retention period.",
  },
];

export default function PrivacySection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="privacy" className="py-32" ref={ref}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          <motion.div
            initial={{ opacity: 0, x: -16 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <p className="eyebrow mb-6">PRIVACY</p>
            <h2
              className="text-4xl font-semibold tracking-tight leading-tight mb-6"
              style={{ color: "var(--color-text-primary)" }}
            >
              Understand events.
              <br />
              <span style={{ color: "var(--color-text-secondary)" }}>
                Not identities.
              </span>
            </h2>
            <p
              className="text-base leading-relaxed mb-8"
              style={{ color: "var(--color-text-secondary)" }}
            >
              AI Witness is designed around event understanding rather than
              identifying individuals. The system uses temporary tracking IDs
              instead of biometric data, keeping analysis focused on what
              happened rather than who people are.
            </p>
            <div
              className="p-4"
              style={{
                background: "rgba(16,185,129,0.04)",
                border: "1px solid rgba(16,185,129,0.15)",
              }}
            >
              <p
                className="label-mono"
                style={{ color: "var(--color-text-muted)", fontSize: "0.7rem", lineHeight: 1.6 }}
              >
                Entity IDs are temporary and session-scoped. They exist only for
                the duration of an investigation and carry no connection to
                real-world identity records.
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 16 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="space-y-px"
          >
            {PRINCIPLES.map((p, i) => (
              <motion.div
                key={p.title}
                initial={{ opacity: 0, y: 8 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: i * 0.08 + 0.3 }}
                className="panel p-5 flex gap-4"
              >
                <div
                  className="flex-shrink-0 w-8 h-8 flex items-center justify-center"
                  style={{
                    border: "1px solid var(--color-border)",
                    color: "var(--color-confirmed)",
                    fontSize: "1rem",
                  }}
                >
                  {p.icon}
                </div>
                <div>
                  <h3
                    className="font-medium mb-1"
                    style={{ color: "var(--color-text-primary)", fontSize: "0.9rem" }}
                  >
                    {p.title}
                  </h3>
                  <p
                    style={{ color: "var(--color-text-secondary)", fontSize: "0.8rem", lineHeight: 1.5 }}
                  >
                    {p.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
