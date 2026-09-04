"use client";

import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import type {
  Investigation,
  IncidentEvent,
  TrackedEntity,
  PipelineProgress,
  ChatMessage,
  EvidenceReference,
} from "@/lib/types";
import {
  MOCK_INVESTIGATION,
  MOCK_PIPELINE_STAGES,
  MOCK_CHAT_MESSAGES,
  fetchChatResponse,
} from "@/lib/mockData";

// ─── Utility ──────────────────────────────────────────────────────────────────
function severityColor(sev: string) {
  if (sev === "critical") return "var(--color-critical)";
  if (sev === "warning") return "var(--color-amber)";
  return "var(--color-confirmed)";
}

// ─── Pipeline Status ──────────────────────────────────────────────────────────
function PipelineStatus({ stages }: { stages: PipelineProgress[] }) {
  return (
    <div className="space-y-2">
      {stages.map((stage) => (
        <div key={stage.stage} className="flex items-center gap-3">
          <div className="flex-shrink-0">
            {stage.status === "complete" && (
              <span style={{ color: "var(--color-confirmed)", fontSize: "0.75rem" }}>✓</span>
            )}
            {stage.status === "active" && (
              <span
                className="inline-block w-2 h-2 rounded-full"
                style={{ background: "var(--color-amber)", animation: "pulse-amber 1.5s ease-in-out infinite" }}
              />
            )}
            {stage.status === "pending" && (
              <span style={{ color: "var(--color-text-muted)", fontSize: "0.75rem" }}>○</span>
            )}
          </div>
          <span
            className="label-mono flex-1"
            style={{
              color: stage.status === "pending" ? "var(--color-text-muted)" : "var(--color-text-secondary)",
              fontSize: "0.65rem",
            }}
          >
            {stage.message}
          </span>
        </div>
      ))}
    </div>
  );
}

// ─── Camera Viewer ────────────────────────────────────────────────────────────
function CameraViewer({
  investigation,
  activeCamId,
  onCamSelect,
  seekMs,
}: {
  investigation: Investigation;
  activeCamId: string;
  onCamSelect: (id: string) => void;
  seekMs: number | null;
}) {
  const cam = investigation.cameras.find((c) => c.id === activeCamId);
  const activeEvents = investigation.events.filter(
    (e) => e.cameraId === activeCamId
  );

  return (
    <div className="flex flex-col h-full">
      {/* Active camera */}
      <div
        className="camera-feed camera-scanline flex-1 relative"
        style={{ border: "1px solid var(--color-border)", minHeight: 200 }}
      >
        {/* Fake video background */}
        <div className="absolute inset-0 bg-grid" style={{ backgroundSize: "24px 24px", opacity: 0.15 }} />

        {/* Entity silhouettes */}
        <div className="absolute inset-0 flex items-end justify-around pb-8 px-8">
          <div
            className="w-8 h-20 opacity-40"
            style={{
              background: "var(--color-amber)",
              clipPath: "polygon(35% 0%, 65% 0%, 80% 30%, 100% 100%, 65% 88%, 35% 88%, 0% 100%, 20% 30%)",
            }}
          />
          {activeCamId !== "cam-01" && (
            <div
              className="w-24 h-12 opacity-30"
              style={{ background: "var(--color-info)", borderRadius: "2px" }}
            />
          )}
          {activeCamId === "cam-03" && (
            <div
              className="w-6 h-16 opacity-30"
              style={{
                background: "var(--color-confirmed)",
                clipPath: "polygon(35% 0%, 65% 0%, 80% 30%, 100% 100%, 65% 88%, 35% 88%, 0% 100%, 20% 30%)",
              }}
            />
          )}
        </div>

        {/* Bounding boxes overlay */}
        {activeEvents.slice(0, 2).map((evt) =>
          evt.bbox ? (
            <div
              key={evt.id}
              className="absolute"
              style={{
                left: `${evt.bbox.x * 100}%`,
                top: `${evt.bbox.y * 100}%`,
                width: `${evt.bbox.width * 100}%`,
                height: `${evt.bbox.height * 100}%`,
                border: `1.5px solid ${severityColor(evt.severity)}`,
                pointerEvents: "none",
              }}
            >
              <div
                className="absolute -top-5 left-0 label-mono px-1 py-0.5 whitespace-nowrap"
                style={{
                  background: severityColor(evt.severity),
                  color:
                    evt.severity === "critical" || evt.severity === "warning"
                      ? "var(--color-void)"
                      : "white",
                  fontSize: "0.55rem",
                }}
              >
                {evt.entityLabel}
              </div>
            </div>
          ) : null
        )}

        {/* Camera HUD */}
        <div
          className="absolute top-0 left-0 right-0 flex items-center justify-between px-3 py-2"
          style={{ background: "rgba(0,0,0,0.6)" }}
        >
          <span className="label-mono" style={{ color: "var(--color-text-secondary)", fontSize: "0.6rem" }}>
            {cam?.label}
          </span>
          <div className="flex items-center gap-2">
            <span
              className="w-1.5 h-1.5 rounded-full"
              style={{ background: "var(--color-critical)", animation: "pulse 1s ease-in-out infinite" }}
            />
            <span className="timestamp" style={{ fontSize: "0.6rem" }}>
              {seekMs !== null
                ? `${Math.floor(seekMs / 60000).toString().padStart(2, "0")}:${Math.floor((seekMs % 60000) / 1000).toString().padStart(2, "0")}`
                : "10:42:11"}
            </span>
          </div>
        </div>

        {/* Bottom overlay */}
        <div
          className="absolute bottom-0 left-0 right-0 px-3 py-2"
          style={{ background: "rgba(0,0,0,0.5)" }}
        >
          <div className="flex items-center gap-4">
            <span className="label-mono" style={{ color: "var(--color-text-muted)", fontSize: "0.58rem" }}>
              {cam?.resolution.width}×{cam?.resolution.height} · {cam?.fps}fps
            </span>
            <span className="label-mono ml-auto" style={{ color: "var(--color-text-muted)", fontSize: "0.58rem" }}>
              YOLO · ByteTrack active
            </span>
          </div>
        </div>
      </div>

      {/* Camera strip */}
      <div
        className="flex gap-1 mt-1 overflow-x-auto no-scrollbar"
      >
        {investigation.cameras.map((c) => (
          <button
            key={c.id}
            id={`camera-select-${c.id}`}
            onClick={() => onCamSelect(c.id)}
            className="flex-shrink-0 relative camera-feed camera-scanline transition-all duration-200"
            style={{
              width: 80,
              height: 50,
              border: `1px solid ${activeCamId === c.id ? "var(--color-amber)" : "var(--color-border)"}`,
            }}
          >
            <div className="absolute inset-0 bg-grid" style={{ backgroundSize: "12px 12px", opacity: 0.2 }} />
            <div
              className="absolute bottom-0 left-0 right-0 px-1 py-0.5"
              style={{ background: "rgba(0,0,0,0.7)" }}
            >
              <span className="label-mono" style={{ color: "var(--color-text-muted)", fontSize: "0.5rem" }}>
                {c.label.split("—")[0].trim()}
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── Entity Panel ─────────────────────────────────────────────────────────────
function EntityPanel({ entities }: { entities: TrackedEntity[] }) {
  const colors = ["var(--color-amber)", "var(--color-confirmed)", "var(--color-info)"];
  return (
    <div>
      <p className="eyebrow mb-3" style={{ fontSize: "0.58rem" }}>TRACKED ENTITIES</p>
      <div className="space-y-2">
        {entities.map((entity, i) => (
          <div
            key={entity.id}
            className="p-3"
            style={{ border: "1px solid var(--color-border)", background: "var(--color-raised)" }}
          >
            <div className="flex items-center gap-2 mb-2">
              <div
                className="w-2 h-2 rounded-full flex-shrink-0"
                style={{ background: colors[i % colors.length] }}
              />
              <span
                className="label-mono font-semibold"
                style={{ color: "var(--color-text-primary)", fontSize: "0.7rem" }}
              >
                {entity.trackingId}
              </span>
              <span
                className="label-mono ml-auto"
                style={{ color: "var(--color-text-muted)", fontSize: "0.6rem", textTransform: "capitalize" }}
              >
                {entity.type}
              </span>
            </div>
            <div className="space-y-0.5">
              <div className="flex justify-between">
                <span className="label-mono" style={{ color: "var(--color-text-muted)", fontSize: "0.6rem" }}>First seen</span>
                <span className="timestamp" style={{ fontSize: "0.6rem" }}>{entity.firstSeen}</span>
              </div>
              <div className="flex justify-between">
                <span className="label-mono" style={{ color: "var(--color-text-muted)", fontSize: "0.6rem" }}>Last seen</span>
                <span className="timestamp" style={{ fontSize: "0.6rem" }}>{entity.lastSeen}</span>
              </div>
              <div className="flex justify-between">
                <span className="label-mono" style={{ color: "var(--color-text-muted)", fontSize: "0.6rem" }}>Events</span>
                <span className="label-mono" style={{ color: colors[i % colors.length], fontSize: "0.6rem" }}>
                  {entity.eventCount}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Event Timeline ───────────────────────────────────────────────────────────
function EventTimeline({
  events,
  onEventClick,
  selectedEventId,
}: {
  events: IncidentEvent[];
  onEventClick: (evt: IncidentEvent) => void;
  selectedEventId: string | null;
}) {
  return (
    <div className="flex items-stretch gap-0 overflow-x-auto no-scrollbar h-full">
      {/* Y axis label */}
      <div
        className="flex-shrink-0 flex items-center px-3"
        style={{ borderRight: "1px solid var(--color-border)" }}
      >
        <span className="label-mono" style={{ writingMode: "vertical-rl", color: "var(--color-text-muted)", fontSize: "0.55rem", letterSpacing: "0.1em" }}>
          EVENTS
        </span>
      </div>
      {/* Events */}
      <div className="flex items-center gap-1 px-4 relative flex-1">
        {/* Track line */}
        <div
          className="absolute left-4 right-4 top-1/2 h-px"
          style={{ background: "var(--color-border)" }}
        />
        {events.map((evt) => (
          <button
            key={evt.id}
            id={`timeline-event-${evt.id}`}
            onClick={() => onEventClick(evt)}
            className="relative flex-shrink-0 flex flex-col items-center gap-1 group"
            style={{ width: 80 }}
          >
            {/* Dot */}
            <div
              className="w-3 h-3 rounded-full z-10 border-2 transition-all duration-200"
              style={{
                background: selectedEventId === evt.id ? severityColor(evt.severity) : "var(--color-surface)",
                borderColor: severityColor(evt.severity),
                transform: selectedEventId === evt.id ? "scale(1.3)" : "scale(1)",
              }}
            />
            {/* Label */}
            <div
              className="absolute top-full mt-2 text-center"
              style={{ width: 76 }}
            >
              <div className="timestamp" style={{ fontSize: "0.55rem" }}>{evt.timestamp}</div>
              <div
                className="label-mono leading-tight mt-0.5"
                style={{
                  color: selectedEventId === evt.id ? severityColor(evt.severity) : "var(--color-text-muted)",
                  fontSize: "0.55rem",
                  lineHeight: 1.2,
                }}
              >
                {evt.eventLabel}
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── Incident Panel ───────────────────────────────────────────────────────────
function IncidentPanel({
  investigation,
  onEvidenceClick,
}: {
  investigation: Investigation;
  onEvidenceClick: (ref: EvidenceReference) => void;
}) {
  const report = investigation.report!;
  return (
    <div className="h-full overflow-y-auto no-scrollbar">
      <p className="eyebrow mb-3" style={{ fontSize: "0.58rem" }}>INCIDENT RECONSTRUCTION</p>
      <div
        className="p-4 mb-4"
        style={{
          background: "rgba(245,158,11,0.05)",
          borderLeft: "2px solid var(--color-amber)",
          border: "1px solid var(--color-border)",
        }}
      >
        <div
          className="label-mono font-semibold mb-2"
          style={{ color: "var(--color-amber)", fontSize: "0.65rem" }}
        >
          {report.incidentType.toUpperCase()}
        </div>
        <p
          className="label-mono leading-relaxed mb-4"
          style={{ color: "var(--color-text-secondary)", fontSize: "0.7rem" }}
        >
          {report.aiSummary}
        </p>
        {/* Confidence */}
        <div>
          <div className="flex justify-between mb-1">
            <span className="label-mono" style={{ color: "var(--color-text-muted)", fontSize: "0.6rem" }}>Overall confidence</span>
            <span
              className="label-mono font-semibold"
              style={{ color: "var(--color-confirmed)", fontSize: "0.65rem" }}
            >
              {report.overallConfidence}%
            </span>
          </div>
          <div className="h-1 rounded-full overflow-hidden" style={{ background: "var(--color-border)" }}>
            <div
              className="h-full"
              style={{ width: `${report.overallConfidence}%`, background: "var(--color-confirmed)" }}
            />
          </div>
        </div>
      </div>

      {/* Evidence */}
      <p className="eyebrow mb-2" style={{ fontSize: "0.55rem" }}>EVIDENCE</p>
      <div className="space-y-1.5 mb-4">
        {report.evidence.map((ev, i) => (
          <button
            key={i}
            id={`evidence-${i}`}
            onClick={() => onEvidenceClick(ev)}
            className="evidence-chip w-full justify-start text-left"
          >
            ▶ {ev.cameraLabel.split("—")[0].trim()} / {ev.startTime}–{ev.endTime}
          </button>
        ))}
      </div>

      {/* Uncertainties */}
      <p className="eyebrow mb-2" style={{ fontSize: "0.55rem" }}>UNCERTAINTIES</p>
      <div className="space-y-1.5">
        {report.uncertainties.map((u, i) => (
          <div
            key={i}
            className="p-3"
            style={{
              background: "rgba(239,68,68,0.04)",
              border: "1px solid rgba(239,68,68,0.12)",
            }}
          >
            <p
              className="label-mono"
              style={{ color: "var(--color-text-muted)", fontSize: "0.62rem", lineHeight: 1.5 }}
            >
              {u}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Chat Panel ───────────────────────────────────────────────────────────────
function ChatPanel({ investigationId }: { investigationId: string }) {
  const [messages, setMessages] = useState<ChatMessage[]>(MOCK_CHAT_MESSAGES);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  const sendMessage = useCallback(async () => {
    if (!input.trim() || loading) return;
    const q = input.trim();
    setInput("");
    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      role: "user",
      content: q,
      timestamp: new Date().toLocaleTimeString("en-GB", { hour12: false }),
    };
    setMessages((m) => [...m, userMsg]);
    setLoading(true);

    const reply = await fetchChatResponse(investigationId, q);
    setMessages((m) => [...m, reply]);
    setLoading(false);
    setTimeout(() => endRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
  }, [input, loading, investigationId]);

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto no-scrollbar p-4 space-y-3">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-2 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            {msg.role === "assistant" && (
              <div
                className="w-5 h-5 flex-shrink-0 flex items-center justify-center mt-0.5"
                style={{ border: "1px solid var(--color-amber)", background: "rgba(245,158,11,0.08)" }}
              >
                <span style={{ fontSize: "0.45rem", color: "var(--color-amber)" }}>AI</span>
              </div>
            )}
            <div
              className="max-w-[85%] px-3 py-2.5"
              style={{
                background: msg.role === "user" ? "var(--color-raised)" : "var(--color-surface)",
                border: "1px solid var(--color-border)",
                borderRadius: msg.role === "user" ? "8px 2px 8px 8px" : "2px 8px 8px 8px",
              }}
            >
              <div
                className="label-mono leading-relaxed"
                style={{ color: "var(--color-text-secondary)", fontSize: "0.72rem" }}
                dangerouslySetInnerHTML={{
                  __html: msg.content.replace(/\n/g, "<br/>").replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>"),
                }}
              />
              {msg.evidenceRefs?.map((ref, i) => (
                <div key={i} className="mt-2">
                  <button className="evidence-chip">
                    ▶ {ref.cameraLabel.split("—")[0].trim()} / {ref.startTime}
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex gap-2">
            <div
              className="w-5 h-5 flex items-center justify-center"
              style={{ border: "1px solid var(--color-amber)", background: "rgba(245,158,11,0.08)" }}
            >
              <span style={{ fontSize: "0.45rem", color: "var(--color-amber)" }}>AI</span>
            </div>
            <div
              className="px-3 py-2.5"
              style={{ background: "var(--color-surface)", border: "1px solid var(--color-border)" }}
            >
              <div className="flex gap-1">
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    className="w-1.5 h-1.5 rounded-full"
                    style={{
                      background: "var(--color-amber)",
                      animation: `pulse-amber 1.2s ease-in-out ${i * 0.2}s infinite`,
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        )}
        <div ref={endRef} />
      </div>

      {/* Input */}
      <div
        className="flex items-center gap-2 px-3 py-2.5 flex-shrink-0"
        style={{ borderTop: "1px solid var(--color-border)" }}
      >
        <input
          id="chat-input"
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          placeholder="Ask about the footage..."
          className="flex-1 bg-transparent outline-none label-mono"
          style={{ color: "var(--color-text-primary)", fontSize: "0.72rem" }}
        />
        <button
          id="chat-send"
          onClick={sendMessage}
          disabled={!input.trim() || loading}
          className="px-3 py-1 label-mono font-semibold transition-opacity duration-200"
          style={{
            background: input.trim() ? "var(--color-amber)" : "var(--color-border)",
            color: input.trim() ? "var(--color-void)" : "var(--color-text-muted)",
            fontSize: "0.65rem",
          }}
        >
          Ask
        </button>
      </div>
    </div>
  );
}

// ─── Report Panel ─────────────────────────────────────────────────────────────
function ReportPanel({ investigation }: { investigation: Investigation }) {
  const report = investigation.report!;
  const [generated, setGenerated] = useState(false);

  if (!generated) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4 p-8">
        <div
          className="w-12 h-12 flex items-center justify-center"
          style={{ border: "1px solid var(--color-border)" }}
        >
          <span style={{ color: "var(--color-amber)", fontSize: "1.5rem" }}>◈</span>
        </div>
        <p
          className="text-center label-mono"
          style={{ color: "var(--color-text-secondary)", fontSize: "0.75rem" }}
        >
          Generate a structured incident report with AI analysis, timeline, and evidence references.
        </p>
        <button
          id="generate-report-btn"
          onClick={() => setGenerated(true)}
          className="px-6 py-2.5 label-mono font-semibold uppercase tracking-wide transition-opacity duration-200 hover:opacity-90"
          style={{ background: "var(--color-amber)", color: "var(--color-void)", fontSize: "0.7rem" }}
        >
          Generate Incident Report
        </button>
      </div>
    );
  }

  return (
    <div className="p-4 overflow-y-auto no-scrollbar h-full">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
        {/* Header */}
        <div
          className="p-4 mb-4"
          style={{ border: "1px solid var(--color-amber)", background: "rgba(245,158,11,0.04)" }}
        >
          <div className="eyebrow mb-1" style={{ color: "var(--color-amber)", fontSize: "0.58rem" }}>
            INCIDENT REPORT
          </div>
          <h3
            className="text-lg font-semibold"
            style={{ color: "var(--color-text-primary)" }}
          >
            {report.incidentType}
          </h3>
          <div className="flex gap-4 mt-2">
            <span className="timestamp" style={{ fontSize: "0.6rem" }}>
              {report.startTime} — {report.endTime}
            </span>
            <span className="label-mono" style={{ color: "var(--color-text-muted)", fontSize: "0.6rem" }}>
              {report.location}
            </span>
          </div>
        </div>

        {/* Entities */}
        <div className="mb-4">
          <p className="eyebrow mb-2" style={{ fontSize: "0.55rem" }}>ENTITIES INVOLVED</p>
          <div className="flex flex-wrap gap-1.5">
            {report.entitiesInvolved.map((e) => (
              <span
                key={e}
                className="label-mono px-2 py-1"
                style={{ border: "1px solid var(--color-border)", color: "var(--color-amber)", fontSize: "0.65rem" }}
              >
                {e}
              </span>
            ))}
          </div>
        </div>

        {/* Timeline */}
        <div className="mb-4">
          <p className="eyebrow mb-2" style={{ fontSize: "0.55rem" }}>TIMELINE</p>
          <div className="space-y-2">
            {report.timeline.map((entry, i) => (
              <div key={i} className="flex gap-3">
                <span className="timestamp flex-shrink-0" style={{ fontSize: "0.6rem", minWidth: 52 }}>
                  {entry.timestamp}
                </span>
                <span
                  className="w-1 h-1 rounded-full flex-shrink-0 mt-1.5"
                  style={{ background: severityColor(entry.severity) }}
                />
                <span className="label-mono" style={{ color: "var(--color-text-secondary)", fontSize: "0.67rem" }}>
                  {entry.description}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Summary */}
        <div className="mb-4">
          <p className="eyebrow mb-2" style={{ fontSize: "0.55rem" }}>AI SUMMARY</p>
          <p
            className="label-mono leading-relaxed"
            style={{ color: "var(--color-text-secondary)", fontSize: "0.72rem" }}
          >
            {report.aiSummary}
          </p>
        </div>

        {/* Confidence */}
        <div className="mb-4">
          <div className="flex justify-between mb-1">
            <p className="eyebrow" style={{ fontSize: "0.55rem" }}>CONFIDENCE</p>
            <span
              className="label-mono font-semibold"
              style={{ color: "var(--color-confirmed)", fontSize: "0.65rem" }}
            >
              {report.overallConfidence}%
            </span>
          </div>
          <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "var(--color-border)" }}>
            <div
              className="h-full"
              style={{ width: `${report.overallConfidence}%`, background: "var(--color-confirmed)" }}
            />
          </div>
        </div>

        {/* Uncertainties */}
        <div>
          <p className="eyebrow mb-2" style={{ fontSize: "0.55rem" }}>UNCERTAINTY</p>
          {report.uncertainties.map((u, i) => (
            <p
              key={i}
              className="label-mono mb-1"
              style={{ color: "var(--color-text-muted)", fontSize: "0.65rem", lineHeight: 1.5 }}
            >
              • {u}
            </p>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
type BottomTab = "ai" | "evidence" | "report";

export default function InvestigatePage() {
  const investigation = MOCK_INVESTIGATION;
  const [activeCamId, setActiveCamId] = useState(investigation.cameras[0].id);
  const [selectedEvent, setSelectedEvent] = useState<IncidentEvent | null>(null);
  const [activeTab, setActiveTab] = useState<BottomTab>("ai");
  const [seekMs, setSeekMs] = useState<number | null>(null);

  const handleEventClick = useCallback((evt: IncidentEvent) => {
    setSelectedEvent(evt);
    setActiveCamId(evt.cameraId);
    setSeekMs(evt.timestampMs);
  }, []);

  const handleEvidenceClick = useCallback((ref: EvidenceReference) => {
    setActiveCamId(ref.cameraId);
    setSeekMs(ref.timestampMs);
    setActiveTab("evidence");
  }, []);

  return (
    <div
      className="h-screen flex flex-col overflow-hidden"
      style={{ background: "var(--color-void)" }}
    >
      {/* ── Top Bar ── */}
      <div
        className="flex items-center justify-between px-4 py-2 flex-shrink-0"
        style={{
          background: "var(--color-raised)",
          borderBottom: "1px solid var(--color-border)",
          height: 44,
        }}
      >
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center gap-2 group">
            <div
              className="w-5 h-5 flex items-center justify-center"
              style={{ border: "1px solid var(--color-amber)" }}
            >
              <div className="w-1.5 h-1.5" style={{ background: "var(--color-amber)" }} />
            </div>
            <span className="label-mono font-semibold" style={{ color: "var(--color-text-secondary)", fontSize: "0.65rem" }}>
              AI WITNESS
            </span>
          </Link>
          <div style={{ width: 1, height: 16, background: "var(--color-border)" }} />
          <span className="label-mono" style={{ color: "var(--color-text-muted)", fontSize: "0.65rem" }}>
            {investigation.name}
          </span>
          <span
            className="label-mono px-2 py-0.5"
            style={{
              background: "rgba(245,158,11,0.1)",
              border: "1px solid rgba(245,158,11,0.2)",
              color: "var(--color-amber)",
              fontSize: "0.58rem",
            }}
          >
            #{investigation.id.split("-")[1].toUpperCase()}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <span className="label-mono" style={{ color: "var(--color-text-muted)", fontSize: "0.6rem" }}>
            {investigation.location}
          </span>
          <div className="flex items-center gap-1.5">
            <span
              className="w-1.5 h-1.5 rounded-full"
              style={{ background: "var(--color-confirmed)" }}
            />
            <span className="label-mono" style={{ color: "var(--color-confirmed)", fontSize: "0.6rem" }}>
              ANALYSIS COMPLETE
            </span>
          </div>
        </div>
      </div>

      {/* ── Main Grid ── */}
      <div className="flex-1 overflow-hidden grid" style={{ gridTemplateRows: "1fr 110px 1fr" }}>
        {/* Top row */}
        <div className="grid overflow-hidden" style={{ gridTemplateColumns: "200px 1fr 260px" }}>
          {/* Left sidebar */}
          <div
            className="overflow-y-auto no-scrollbar p-3"
            style={{ borderRight: "1px solid var(--color-border)" }}
          >
            <div className="mb-4">
              <PipelineStatus stages={MOCK_PIPELINE_STAGES} />
            </div>
            <div
              className="mb-4 pt-4"
              style={{ borderTop: "1px solid var(--color-border)" }}
            >
              <EntityPanel entities={investigation.entities} />
            </div>
          </div>

          {/* Center: Camera viewer */}
          <div className="p-3 overflow-hidden" style={{ borderRight: "1px solid var(--color-border)" }}>
            <CameraViewer
              investigation={investigation}
              activeCamId={activeCamId}
              onCamSelect={setActiveCamId}
              seekMs={seekMs}
            />
          </div>

          {/* Right: Incident panel */}
          <div className="p-3 overflow-hidden">
            <IncidentPanel
              investigation={investigation}
              onEvidenceClick={handleEvidenceClick}
            />
          </div>
        </div>

        {/* Timeline row */}
        <div
          style={{
            borderTop: "1px solid var(--color-border)",
            borderBottom: "1px solid var(--color-border)",
            background: "var(--color-surface)",
          }}
        >
          <EventTimeline
            events={investigation.events}
            onEventClick={handleEventClick}
            selectedEventId={selectedEvent?.id ?? null}
          />
        </div>

        {/* Bottom row */}
        <div className="overflow-hidden flex flex-col">
          {/* Tabs */}
          <div
            className="flex items-center gap-0 flex-shrink-0"
            style={{ borderBottom: "1px solid var(--color-border)", background: "var(--color-raised)" }}
          >
            {(["ai", "evidence", "report"] as BottomTab[]).map((tab) => (
              <button
                key={tab}
                id={`tab-${tab}`}
                onClick={() => setActiveTab(tab)}
                className="px-5 py-2.5 label-mono uppercase transition-all duration-200"
                style={{
                  color: activeTab === tab ? "var(--color-amber)" : "var(--color-text-muted)",
                  borderBottom: activeTab === tab ? "2px solid var(--color-amber)" : "2px solid transparent",
                  fontSize: "0.62rem",
                  background: "transparent",
                }}
              >
                {tab === "ai" ? "AI Investigation" : tab === "evidence" ? "Evidence Viewer" : "Incident Report"}
              </button>
            ))}

            {/* Selected event info */}
            {selectedEvent && (
              <div
                className="ml-auto mr-4 flex items-center gap-2 px-3 py-1"
                style={{
                  background: "rgba(245,158,11,0.08)",
                  border: "1px solid rgba(245,158,11,0.2)",
                }}
              >
                <span
                  className="w-1.5 h-1.5 rounded-full"
                  style={{ background: severityColor(selectedEvent.severity) }}
                />
                <span className="label-mono" style={{ color: "var(--color-text-secondary)", fontSize: "0.6rem" }}>
                  {selectedEvent.entityLabel} — {selectedEvent.eventLabel}
                </span>
                <span className="timestamp" style={{ fontSize: "0.6rem" }}>
                  {selectedEvent.timestamp}
                </span>
              </div>
            )}
          </div>

          {/* Tab content */}
          <div className="flex-1 overflow-hidden">
            <AnimatePresence mode="wait">
              {activeTab === "ai" && (
                <motion.div
                  key="ai"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="h-full"
                >
                  <ChatPanel investigationId={investigation.id} />
                </motion.div>
              )}
              {activeTab === "evidence" && (
                <motion.div
                  key="evidence"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="p-4 h-full overflow-y-auto no-scrollbar"
                >
                  <p className="eyebrow mb-4" style={{ fontSize: "0.58rem" }}>EVIDENCE VIEWER</p>
                  {selectedEvent ? (
                    <div>
                      <div
                        className="panel p-4 mb-4"
                        style={{ borderLeft: "2px solid " + severityColor(selectedEvent.severity) }}
                      >
                        <div className="flex items-center gap-3 mb-2">
                          <span
                            className="w-2 h-2 rounded-full"
                            style={{ background: severityColor(selectedEvent.severity) }}
                          />
                          <span
                            className="label-mono font-semibold"
                            style={{ color: "var(--color-text-primary)", fontSize: "0.75rem" }}
                          >
                            {selectedEvent.eventLabel}
                          </span>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          {[
                            { label: "Camera", value: selectedEvent.cameraLabel },
                            { label: "Timestamp", value: selectedEvent.timestamp },
                            { label: "Entity", value: selectedEvent.entityLabel },
                            { label: "Confidence", value: `${Math.round(selectedEvent.confidence * 100)}%` },
                          ].map(({ label, value }) => (
                            <div key={label}>
                              <div className="eyebrow mb-0.5" style={{ fontSize: "0.55rem" }}>{label}</div>
                              <div className="timestamp" style={{ fontSize: "0.7rem", color: "var(--color-text-primary)" }}>
                                {value}
                              </div>
                            </div>
                          ))}
                        </div>
                        {selectedEvent.notes && (
                          <div
                            className="mt-3 pt-3 label-mono"
                            style={{ borderTop: "1px solid var(--color-border)", color: "var(--color-text-muted)", fontSize: "0.65rem" }}
                          >
                            Note: {selectedEvent.notes}
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <p className="label-mono" style={{ color: "var(--color-text-muted)", fontSize: "0.7rem" }}>
                      Click an event on the timeline to view its evidence.
                    </p>
                  )}
                </motion.div>
              )}
              {activeTab === "report" && (
                <motion.div
                  key="report"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="h-full"
                >
                  <ReportPanel investigation={investigation} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
