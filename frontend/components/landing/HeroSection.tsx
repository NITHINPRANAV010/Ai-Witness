"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

// ─── Types ────────────────────────────────────────────────────────────────────
interface SimEvent {
  time: string;
  cam: string;
  entity: string;
  label: string;
  severity: "normal" | "warning" | "critical";
}

const SIM_EVENTS: SimEvent[] = [
  { time: "10:42:11", cam: "CAM 01", entity: "PERSON #01", label: "ENTERED AREA", severity: "normal" },
  { time: "10:42:16", cam: "CAM 02", entity: "PERSON #01", label: "APPROACHED VEHICLE", severity: "warning" },
  { time: "10:42:19", cam: "CAM 02", entity: "VEHICLE #01", label: "MOVEMENT DETECTED", severity: "warning" },
  { time: "10:42:21", cam: "CAM 03", entity: "PERSON #01", label: "FALL DETECTED", severity: "critical" },
  { time: "10:42:25", cam: "CAM 03", entity: "PERSON #02", label: "ARRIVED ON SCENE", severity: "normal" },
];

// ─── Camera Card ──────────────────────────────────────────────────────────────
function CameraCard({
  camId,
  activeEvent,
  allEvents,
}: {
  camId: string;
  activeEvent: SimEvent | null;
  allEvents: SimEvent[];
}) {
  const isActive = activeEvent?.cam === camId;
  const hasEvent = allEvents.some((e) => e.cam === camId);

  return (
    <div
      className="camera-feed camera-scanline rounded-none relative"
      style={{
        border: isActive
          ? `1px solid ${activeEvent?.severity === "critical" ? "var(--color-critical)" : "var(--color-amber)"}`
          : "1px solid var(--color-border)",
        transition: "border-color 0.3s ease",
      }}
    >
      {/* Header */}
      <div
        className="absolute top-0 left-0 right-0 flex items-center justify-between px-2 py-1 z-10"
        style={{ background: "rgba(0,0,0,0.7)" }}
      >
        <span className="label-mono" style={{ color: "var(--color-text-secondary)", fontSize: "0.6rem" }}>
          {camId}
        </span>
        <div className="flex items-center gap-1.5">
          {isActive && (
            <span
              className="w-1.5 h-1.5 rounded-full"
              style={{
                background:
                  activeEvent?.severity === "critical"
                    ? "var(--color-critical)"
                    : activeEvent?.severity === "warning"
                    ? "var(--color-amber)"
                    : "var(--color-confirmed)",
                animation: "pulse-amber 1.5s ease-in-out infinite",
              }}
            />
          )}
          <span className="timestamp" style={{ fontSize: "0.58rem" }}>
            {activeEvent?.cam === camId ? activeEvent.time : "10:42:08"}
          </span>
        </div>
      </div>

      {/* Fake video grid */}
      <div
        className="absolute inset-0 bg-grid opacity-30"
        style={{ backgroundSize: "20px 20px" }}
      />

      {/* Entity silhouettes */}
      <div className="absolute inset-0 flex items-end justify-center pb-6">
        <div className="relative">
          {camId === "CAM 01" && (
            <div
              className="w-5 h-12 opacity-60 transition-all duration-500"
              style={{
                background: isActive ? "var(--color-amber)" : "rgba(245,158,11,0.3)",
                clipPath: "polygon(35% 0%, 65% 0%, 80% 30%, 100% 100%, 65% 85%, 35% 85%, 0% 100%, 20% 30%)",
              }}
            />
          )}
          {camId === "CAM 02" && (
            <div className="flex gap-3 items-end">
              <div
                className="w-5 h-12 opacity-60 transition-all duration-500"
                style={{
                  background: isActive ? "var(--color-amber)" : "rgba(245,158,11,0.3)",
                  clipPath: "polygon(35% 0%, 65% 0%, 80% 30%, 100% 100%, 65% 85%, 35% 85%, 0% 100%, 20% 30%)",
                }}
              />
              <div
                className="w-14 h-7 opacity-50"
                style={{
                  background: isActive && activeEvent?.entity === "VEHICLE #01" ? "var(--color-info)" : "rgba(99,102,241,0.3)",
                  borderRadius: "2px",
                  transition: "background 0.3s ease",
                }}
              />
            </div>
          )}
          {camId === "CAM 03" && (
            <div className="flex gap-4 items-end">
              <div
                className="w-5 h-10 opacity-60 transition-all duration-500"
                style={{
                  background: activeEvent?.severity === "critical" ? "var(--color-critical)" : "rgba(245,158,11,0.3)",
                  clipPath:
                    activeEvent?.severity === "critical"
                      ? "polygon(0 60%, 100% 60%, 100% 100%, 0 100%)"
                      : "polygon(35% 0%, 65% 0%, 80% 30%, 100% 100%, 65% 85%, 35% 85%, 0% 100%, 20% 30%)",
                  transition: "all 0.4s ease",
                }}
              />
              {allEvents.filter((e) => e.entity === "PERSON #02" && e.cam === "CAM 03").length > 0 && (
                <div
                  className="w-4 h-10 opacity-50"
                  style={{
                    background: "rgba(16,185,129,0.5)",
                    clipPath: "polygon(35% 0%, 65% 0%, 80% 30%, 100% 100%, 65% 85%, 35% 85%, 0% 100%, 20% 30%)",
                  }}
                />
              )}
            </div>
          )}
        </div>
      </div>

      {/* Bounding box overlay */}
      {isActive && (
        <motion.div
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          className="absolute"
          style={{
            top: "20%",
            left: "35%",
            width: "25%",
            height: "55%",
            border: `1.5px solid ${
              activeEvent?.severity === "critical" ? "var(--color-critical)" : "var(--color-amber)"
            }`,
            pointerEvents: "none",
          }}
        >
          <div
            className="absolute -top-4 left-0 label-mono px-1 py-0.5"
            style={{
              background: activeEvent?.severity === "critical" ? "var(--color-critical)" : "var(--color-amber)",
              color: activeEvent?.severity === "critical" ? "white" : "var(--color-void)",
              fontSize: "0.55rem",
              whiteSpace: "nowrap",
            }}
          >
            {activeEvent?.entity}
          </div>
        </motion.div>
      )}

      {/* Event Overlay */}
      <AnimatePresence>
        {isActive && (
          <motion.div
            key={activeEvent?.label}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="absolute bottom-0 left-0 right-0 px-2 py-2 z-10"
            style={{ background: "rgba(0,0,0,0.85)" }}
          >
            <div
              className="label-mono font-semibold"
              style={{
                color:
                  activeEvent?.severity === "critical"
                    ? "var(--color-critical)"
                    : activeEvent?.severity === "warning"
                    ? "var(--color-amber)"
                    : "var(--color-confirmed)",
                fontSize: "0.6rem",
              }}
            >
              ● {activeEvent?.label}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Hero Section ─────────────────────────────────────────────────────────────
export default function HeroSection() {
  const [step, setStep] = useState(-1);
  const [visibleEvents, setVisibleEvents] = useState<SimEvent[]>([]);
  const [showResult, setShowResult] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const resetAndPlay = () => {
    setStep(-1);
    setVisibleEvents([]);
    setShowResult(false);

    SIM_EVENTS.forEach((_, i) => {
      timerRef.current = setTimeout(() => {
        setStep(i);
        setVisibleEvents((prev) => [...prev, SIM_EVENTS[i]]);
      }, (i + 1) * 1800);
    });

    timerRef.current = setTimeout(() => {
      setStep(-1);
      setShowResult(true);
    }, (SIM_EVENTS.length + 1) * 1800);

    timerRef.current = setTimeout(() => {
      resetAndPlay();
    }, (SIM_EVENTS.length + 5) * 1800);
  };

  useEffect(() => {
    const t = setTimeout(resetAndPlay, 800);
    return () => {
      clearTimeout(t);
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const activeEvent = step >= 0 ? SIM_EVENTS[step] : null;

  return (
    <section className="relative min-h-screen flex items-center pt-14 overflow-hidden">
      {/* Background grid */}
      <div className="absolute inset-0 bg-grid opacity-100" />
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 60% 60% at 70% 50%, rgba(245,158,11,0.04) 0%, transparent 70%)",
        }}
      />

      <div className="relative max-w-7xl mx-auto px-6 py-24 w-full">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* ── Left: Copy ── */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            {/* Eyebrow */}
            <div className="flex items-center gap-3 mb-6">
              <div
                className="h-px w-8"
                style={{ background: "var(--color-amber)" }}
              />
              <span className="eyebrow tracking-[0.2em]">
                VIDEO INTELLIGENCE / INCIDENT RECONSTRUCTION
              </span>
            </div>

            {/* Headline */}
            <h1
              className="text-5xl lg:text-6xl font-semibold leading-[1.05] tracking-tight mb-6"
              style={{ color: "var(--color-text-primary)" }}
            >
              See what{" "}
              <span style={{ color: "var(--color-amber)" }}>happened.</span>
              <br />
              Not just what{" "}
              <span style={{ color: "var(--color-text-secondary)" }}>
                was recorded.
              </span>
            </h1>

            {/* Supporting text */}
            <p
              className="text-lg leading-relaxed mb-10 max-w-lg"
              style={{ color: "var(--color-text-secondary)" }}
            >
              AI Witness transforms hours of multi-camera footage into a
              chronological reconstruction of events — with evidence,
              timestamps, and explainable AI analysis.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap gap-4">
              <Link
                href="/investigate"
                className="flex items-center gap-2 px-6 py-3 label-mono font-semibold uppercase tracking-wide transition-all duration-200 hover:opacity-90"
                style={{
                  background: "var(--color-amber)",
                  color: "var(--color-void)",
                  fontSize: "0.75rem",
                }}
              >
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ background: "var(--color-void)" }}
                />
                Investigate an Incident
              </Link>
              <a
                href="#how-it-works"
                className="flex items-center gap-2 px-6 py-3 label-mono uppercase tracking-wide transition-all duration-200"
                style={{
                  border: "1px solid var(--color-border)",
                  color: "var(--color-text-secondary)",
                  fontSize: "0.75rem",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor = "var(--color-amber)";
                  (e.currentTarget as HTMLElement).style.color = "var(--color-amber)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor = "var(--color-border)";
                  (e.currentTarget as HTMLElement).style.color = "var(--color-text-secondary)";
                }}
              >
                See How It Works →
              </a>
            </div>

            {/* Stats */}
            <div
              className="mt-12 pt-8 grid grid-cols-3 gap-6"
              style={{ borderTop: "1px solid var(--color-border)" }}
            >
              {[
                { value: "3", label: "Camera feeds" },
                { value: "14", label: "Detected events" },
                { value: "91%", label: "Confidence" },
              ].map((s) => (
                <div key={s.label}>
                  <div
                    className="text-2xl font-semibold font-mono mb-1"
                    style={{ color: "var(--color-amber)" }}
                  >
                    {s.value}
                  </div>
                  <div className="eyebrow">{s.label}</div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* ── Right: Live Demo UI ── */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="relative"
          >
            {/* Panel chrome */}
            <div
              className="panel overflow-hidden"
              style={{ borderColor: "var(--color-border)" }}
            >
              {/* Top bar */}
              <div
                className="flex items-center justify-between px-3 py-2"
                style={{ background: "var(--color-raised)", borderBottom: "1px solid var(--color-border)" }}
              >
                <div className="flex items-center gap-2">
                  <div className="flex gap-1">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ background: "#3A3A3A" }} />
                    <div className="w-2.5 h-2.5 rounded-full" style={{ background: "#3A3A3A" }} />
                    <div className="w-2.5 h-2.5 rounded-full" style={{ background: "#3A3A3A" }} />
                  </div>
                  <span className="label-mono ml-2" style={{ color: "var(--color-text-muted)", fontSize: "0.6rem" }}>
                    AI WITNESS — Investigation #0042
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span
                    className="w-1.5 h-1.5 rounded-full"
                    style={{
                      background: "var(--color-amber)",
                      animation: "pulse-amber 1.5s ease-in-out infinite",
                    }}
                  />
                  <span className="label-mono" style={{ color: "var(--color-amber)", fontSize: "0.6rem" }}>
                    ANALYZING
                  </span>
                </div>
              </div>

              {/* Camera grid */}
              <div className="grid grid-cols-3 gap-px p-0" style={{ background: "var(--color-border)" }}>
                {["CAM 01", "CAM 02", "CAM 03"].map((cam) => (
                  <CameraCard
                    key={cam}
                    camId={cam}
                    activeEvent={activeEvent}
                    allEvents={visibleEvents}
                  />
                ))}
              </div>

              {/* Event feed */}
              <div
                className="px-3 py-2"
                style={{ background: "var(--color-surface)", borderTop: "1px solid var(--color-border)" }}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="eyebrow">LIVE EVENTS</span>
                  <span className="timestamp" style={{ fontSize: "0.58rem" }}>
                    {visibleEvents.length} detected
                  </span>
                </div>
                <div className="space-y-1 min-h-[80px]">
                  <AnimatePresence initial={false}>
                    {visibleEvents.slice(-3).map((evt, i) => (
                      <motion.div
                        key={evt.time + evt.label}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex items-center gap-2"
                      >
                        <span className="timestamp" style={{ fontSize: "0.6rem", minWidth: "52px" }}>
                          {evt.time}
                        </span>
                        <span
                          className="w-1 h-1 rounded-full flex-shrink-0"
                          style={{
                            background:
                              evt.severity === "critical"
                                ? "var(--color-critical)"
                                : evt.severity === "warning"
                                ? "var(--color-amber)"
                                : "var(--color-confirmed)",
                          }}
                        />
                        <span className="label-mono truncate" style={{ color: "var(--color-text-secondary)", fontSize: "0.65rem" }}>
                          {evt.entity} — {evt.label}
                        </span>
                        <span className="label-mono ml-auto" style={{ color: "var(--color-text-muted)", fontSize: "0.58rem" }}>
                          {evt.cam}
                        </span>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </div>

              {/* AI Result panel */}
              <AnimatePresence>
                {showResult && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden"
                    style={{ borderTop: "1px solid var(--color-amber)" }}
                  >
                    <div className="px-3 py-3" style={{ background: "rgba(245,158,11,0.05)" }}>
                      <div className="flex items-center gap-2 mb-2">
                        <span
                          className="w-1.5 h-1.5 rounded-full"
                          style={{ background: "var(--color-amber)" }}
                        />
                        <span className="label-mono font-semibold" style={{ color: "var(--color-amber)", fontSize: "0.65rem" }}>
                          AI RECONSTRUCTION READY
                        </span>
                      </div>
                      <p className="label-mono leading-relaxed" style={{ color: "var(--color-text-secondary)", fontSize: "0.65rem" }}>
                        Person #01 approached Vehicle #01. The vehicle moved at 10:42:19.
                        Person #01 fell 2.1s later. Person #02 arrived at 10:42:25.
                      </p>
                      <div className="flex items-center gap-3 mt-2">
                        <span className="label-mono" style={{ color: "var(--color-text-muted)", fontSize: "0.6rem" }}>
                          Confidence:{" "}
                          <span style={{ color: "var(--color-confirmed)" }}>91%</span>
                        </span>
                        <span className="label-mono" style={{ color: "var(--color-text-muted)", fontSize: "0.6rem" }}>
                          Evidence: CAM 02 / 10:42:19–23
                        </span>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Corner accent */}
            <div
              className="absolute -bottom-3 -right-3 w-12 h-12 opacity-30"
              style={{ border: "1px solid var(--color-amber)", borderRadius: 0 }}
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
