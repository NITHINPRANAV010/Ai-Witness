"use client";

import { useRef, useState } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";

const SAMPLE_QUESTIONS = [
  {
    q: "What happened before the person fell?",
    a: 'In the 10 seconds before Person #01 fell at 10:42:21:\n\n1. **10:42:11** — Person #01 entered via the main entrance.\n2. **10:42:16** — Person #01 moved toward Vehicle #01 (CAM 02).\n3. **10:42:19** — Vehicle #01 moved while Person #01 was in proximity.\n\nThe vehicle movement preceded the fall by 2.1 seconds.',
    evidence: "CAM 02 / 10:42:19–10:42:23",
  },
  {
    q: "Which camera captured the first event?",
    a: "**CAM 01 — Entrance** captured the first event at 10:42:11, when Person #01 entered the monitored area. The incident then progressed to **CAM 02** (vehicle interaction) and **CAM 03** (fall event).",
    evidence: "CAM 01 / 10:42:11",
  },
  {
    q: "How many people were involved?",
    a: "The footage shows **2 individuals**:\n\n- **Person #01** — present from 10:42:11, involved in the fall at 10:42:21.\n- **Person #02** — arrived at 10:42:25, approximately 4 seconds after the fall.\n\nVehicle #01 is also a key actor in the sequence.",
    evidence: "CAM 03 / 10:42:21–10:42:26",
  },
  {
    q: "Show me everything unusual in the 5 minutes before the incident.",
    a: 'Prior to the incident sequence, one anomaly was detected:\n\n**10:41:50–10:42:18** — Vehicle #01 was stationary for 28 seconds, then moved abruptly at 10:42:19 while Person #01 was within 0.8m proximity.\n\nThis sudden movement in close human proximity is classified as the **triggering anomaly**.',
    evidence: "CAM 02 / 10:42:19",
  },
];

export default function NLInvestigationSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [activeIdx, setActiveIdx] = useState(0);
  const active = SAMPLE_QUESTIONS[activeIdx];

  return (
    <section id="investigation-assistant" className="py-32 relative" ref={ref}>
      <div
        className="absolute inset-0"
        style={{
          background: "var(--color-surface)",
          borderTop: "1px solid var(--color-border)",
          borderBottom: "1px solid var(--color-border)",
        }}
      />
      <div className="relative max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <p className="eyebrow mb-4">INVESTIGATION ASSISTANT</p>
          <h2
            className="text-4xl font-semibold tracking-tight"
            style={{ color: "var(--color-text-primary)" }}
          >
            Ask the footage.
          </h2>
          <p
            className="mt-4 text-base max-w-xl"
            style={{ color: "var(--color-text-secondary)" }}
          >
            The investigation assistant answers questions using only the analyzed
            video data — not general knowledge. Every response is grounded in
            specific camera timestamps and evidence.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="grid lg:grid-cols-[1fr_1.5fr] gap-6"
        >
          {/* Question list */}
          <div className="space-y-1">
            <p className="eyebrow mb-4" style={{ fontSize: "0.6rem" }}>
              SAMPLE QUESTIONS
            </p>
            {SAMPLE_QUESTIONS.map((item, i) => (
              <button
                key={i}
                id={`question-${i}`}
                onClick={() => setActiveIdx(i)}
                className="w-full text-left p-4 transition-all duration-200"
                style={{
                  background: activeIdx === i ? "var(--color-raised)" : "transparent",
                  border:
                    activeIdx === i
                      ? "1px solid var(--color-amber)"
                      : "1px solid var(--color-border)",
                  color:
                    activeIdx === i ? "var(--color-text-primary)" : "var(--color-text-secondary)",
                }}
              >
                <div className="flex items-start gap-3">
                  <span
                    className="label-mono mt-0.5 flex-shrink-0"
                    style={{ color: "var(--color-amber)", fontSize: "0.6rem" }}
                  >
                    Q
                  </span>
                  <span style={{ fontSize: "0.8rem", lineHeight: 1.5 }}>
                    &ldquo;{item.q}&rdquo;
                  </span>
                </div>
              </button>
            ))}
          </div>

          {/* Answer panel */}
          <div className="panel overflow-hidden">
            {/* Mock chat header */}
            <div
              className="flex items-center gap-3 px-4 py-3"
              style={{ borderBottom: "1px solid var(--color-border)", background: "var(--color-raised)" }}
            >
              <div
                className="w-6 h-6 flex items-center justify-center"
                style={{ border: "1px solid var(--color-amber)", background: "rgba(245,158,11,0.08)" }}
              >
                <span style={{ fontSize: "0.55rem", color: "var(--color-amber)" }}>AI</span>
              </div>
              <span className="label-mono" style={{ color: "var(--color-text-secondary)", fontSize: "0.65rem" }}>
                AI Witness — Investigation #0042
              </span>
              <span className="ml-auto evidence-chip" style={{ cursor: "default" }}>
                Grounded in footage
              </span>
            </div>

            <div className="p-4 space-y-4">
              {/* User question */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={`q-${activeIdx}`}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0 }}
                  className="flex justify-end"
                >
                  <div
                    className="max-w-[85%] px-4 py-3"
                    style={{
                      background: "var(--color-raised)",
                      border: "1px solid var(--color-border)",
                      borderRadius: "8px 2px 8px 8px",
                    }}
                  >
                    <p style={{ color: "var(--color-text-primary)", fontSize: "0.82rem" }}>
                      &ldquo;{active.q}&rdquo;
                    </p>
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* AI response */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={`a-${activeIdx}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ delay: 0.15 }}
                  className="flex gap-3"
                >
                  <div
                    className="w-6 h-6 flex-shrink-0 flex items-center justify-center mt-0.5"
                    style={{ border: "1px solid var(--color-amber)", background: "rgba(245,158,11,0.08)" }}
                  >
                    <span style={{ fontSize: "0.5rem", color: "var(--color-amber)" }}>AI</span>
                  </div>
                  <div
                    className="flex-1 px-4 py-3"
                    style={{
                      background: "var(--color-surface)",
                      border: "1px solid var(--color-border)",
                      borderRadius: "2px 8px 8px 8px",
                    }}
                  >
                    {/* Render response with basic markdown-ish */}
                    <div
                      className="text-sm leading-relaxed mb-3 ai-prose"
                      style={{ color: "var(--color-text-secondary)" }}
                    >
                      {active.a.split("\n").map((line, i) => {
                        if (!line.trim()) return <br key={i} />;
                        const formatted = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
                        return (
                          <p
                            key={i}
                            dangerouslySetInnerHTML={{ __html: formatted }}
                            style={{ marginBottom: "0.4rem" }}
                          />
                        );
                      })}
                    </div>
                    <div
                      className="pt-3 flex items-center gap-2"
                      style={{ borderTop: "1px solid var(--color-border)" }}
                    >
                      <span className="label-mono" style={{ color: "var(--color-text-muted)", fontSize: "0.6rem" }}>
                        Evidence:
                      </span>
                      <button className="evidence-chip">▶ {active.evidence}</button>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Input box mockup */}
              <div
                className="flex items-center gap-2 px-3 py-2.5 mt-4"
                style={{ border: "1px solid var(--color-border)", background: "var(--color-raised)" }}
              >
                <span className="flex-1 label-mono" style={{ color: "var(--color-text-muted)", fontSize: "0.7rem" }}>
                  Ask about the footage...
                </span>
                <div
                  className="px-3 py-1 label-mono font-semibold"
                  style={{ background: "var(--color-amber)", color: "var(--color-void)", fontSize: "0.65rem" }}
                >
                  Ask
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
