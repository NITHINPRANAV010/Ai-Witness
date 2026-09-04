"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

export default function ProblemSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="product" className="relative py-32 overflow-hidden" ref={ref}>
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 50% 60% at 50% 50%, rgba(245,158,11,0.03) 0%, transparent 70%)",
        }}
      />

      <div className="max-w-7xl mx-auto px-6">
        {/* Statement */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="max-w-4xl"
        >
          <p className="eyebrow mb-6">THE PROBLEM</p>
          <h2
            className="text-4xl lg:text-5xl font-semibold leading-tight tracking-tight mb-8"
            style={{ color: "var(--color-text-primary)" }}
          >
            Cameras record everything.
            <br />
            <span style={{ color: "var(--color-text-secondary)" }}>
              Investigators still have to watch everything.
            </span>
          </h2>
          <p
            className="text-lg leading-relaxed max-w-2xl"
            style={{ color: "var(--color-text-secondary)" }}
          >
            A single incident can span multiple cameras and hours of footage.
            Finding the critical sequence manually takes time — time that matters
            in incident response, safety review, and legal investigations.
            AI Witness turns that footage into a structured sequence of events.
          </p>
        </motion.div>

        {/* Before / After */}
        <div className="mt-20 grid lg:grid-cols-3 gap-6 items-center">
          {/* Before */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="panel p-8"
          >
            <div className="eyebrow mb-6">BEFORE</div>
            <div className="space-y-5">
              {[
                { value: "6", label: "cameras" },
                { value: "4", label: "hours of footage" },
                { value: "14,400", label: "seconds to review" },
              ].map(({ value, label }) => (
                <div key={label} className="flex items-baseline gap-3">
                  <span
                    className="text-3xl font-semibold font-mono"
                    style={{ color: "var(--color-text-primary)" }}
                  >
                    {value}
                  </span>
                  <span className="label-mono" style={{ color: "var(--color-text-muted)" }}>
                    {label}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Arrow */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={inView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex flex-col items-center gap-4"
          >
            <div
              className="w-px h-12 lg:hidden"
              style={{ background: "var(--color-border)" }}
            />
            <div
              className="panel p-4 text-center"
              style={{ borderColor: "var(--color-amber)" }}
            >
              <div
                className="label-mono font-semibold mb-1"
                style={{ color: "var(--color-amber)", fontSize: "0.65rem" }}
              >
                AI WITNESS
              </div>
              <div
                className="text-xl font-semibold font-mono"
                style={{ color: "var(--color-amber)" }}
              >
                ↓
              </div>
              <div className="label-mono mt-1" style={{ color: "var(--color-text-muted)", fontSize: "0.6rem" }}>
                Vision + Tracking + AI
              </div>
            </div>
            <div
              className="w-px h-12 lg:hidden"
              style={{ background: "var(--color-border)" }}
            />
          </motion.div>

          {/* After */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="panel p-8"
            style={{ borderColor: "var(--color-amber)" }}
          >
            <div className="eyebrow mb-6" style={{ color: "var(--color-amber)" }}>
              AFTER
            </div>
            <div className="space-y-5">
              {[
                { value: "1", label: "incident reconstruction", accent: true },
                { value: "14", label: "relevant events", accent: true },
                { value: "23s", label: "of key evidence", accent: true },
              ].map(({ value, label, accent }) => (
                <div key={label} className="flex items-baseline gap-3">
                  <span
                    className="text-3xl font-semibold font-mono"
                    style={{ color: accent ? "var(--color-amber)" : "var(--color-text-primary)" }}
                  >
                    {value}
                  </span>
                  <span className="label-mono" style={{ color: "var(--color-text-muted)" }}>
                    {label}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
