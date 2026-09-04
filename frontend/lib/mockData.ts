import type {
  Investigation,
  IncidentEvent,
  TrackedEntity,
  IncidentReport,
  PipelineProgress,
  ChatMessage,
  EvidenceReference,
  ObservedFact,
  AIInference,
  ReportTimelineEntry,
} from "./types";

// ─── Evidence References ──────────────────────────────────────────────────────

export const MOCK_EVIDENCE: EvidenceReference[] = [
  {
    cameraId: "cam-02",
    cameraLabel: "CAM 02 — Parking Lot",
    startTime: "10:42:19",
    endTime: "10:42:23",
    description: "Vehicle #01 movement + Person #01 proximity",
    timestampMs: 8000,
  },
  {
    cameraId: "cam-03",
    cameraLabel: "CAM 03 — North View",
    startTime: "10:42:21",
    endTime: "10:42:26",
    description: "Person #01 fall event and Person #02 arrival",
    timestampMs: 10000,
  },
];

// ─── Entities ─────────────────────────────────────────────────────────────────

export const MOCK_ENTITIES: TrackedEntity[] = [
  {
    id: "entity-01",
    trackingId: "Person #01",
    type: "person",
    firstSeen: "10:42:11",
    lastSeen: "10:43:05",
    camerasAppeared: ["cam-01", "cam-02", "cam-03"],
    eventCount: 6,
    color: "#F59E0B",
  },
  {
    id: "entity-02",
    trackingId: "Person #02",
    type: "person",
    firstSeen: "10:42:25",
    lastSeen: "10:43:15",
    camerasAppeared: ["cam-02", "cam-03"],
    eventCount: 3,
    color: "#10B981",
  },
  {
    id: "entity-03",
    trackingId: "Vehicle #01",
    type: "vehicle",
    firstSeen: "10:41:50",
    lastSeen: "10:43:00",
    camerasAppeared: ["cam-02", "cam-03"],
    eventCount: 2,
    color: "#6366F1",
  },
];

// ─── Events ───────────────────────────────────────────────────────────────────

export const MOCK_EVENTS: IncidentEvent[] = [
  {
    id: "evt-001",
    timestamp: "10:42:11",
    timestampMs: 0,
    cameraId: "cam-01",
    cameraLabel: "CAM 01 — Entrance",
    entityId: "entity-01",
    entityLabel: "Person #01",
    eventType: "person_entered",
    eventLabel: "Person entered area",
    severity: "normal",
    confidence: 0.97,
    bbox: { x: 0.3, y: 0.2, width: 0.1, height: 0.5 },
  },
  {
    id: "evt-002",
    timestamp: "10:42:16",
    timestampMs: 5000,
    cameraId: "cam-02",
    cameraLabel: "CAM 02 — Parking Lot",
    entityId: "entity-01",
    entityLabel: "Person #01",
    eventType: "person_approached_vehicle",
    eventLabel: "Person approached vehicle",
    severity: "warning",
    confidence: 0.89,
    bbox: { x: 0.35, y: 0.2, width: 0.1, height: 0.55 },
  },
  {
    id: "evt-003",
    timestamp: "10:42:19",
    timestampMs: 8000,
    cameraId: "cam-02",
    cameraLabel: "CAM 02 — Parking Lot",
    entityId: "entity-03",
    entityLabel: "Vehicle #01",
    eventType: "vehicle_movement",
    eventLabel: "Vehicle movement detected",
    severity: "warning",
    confidence: 0.95,
    bbox: { x: 0.45, y: 0.25, width: 0.35, height: 0.3 },
  },
  {
    id: "evt-004",
    timestamp: "10:42:21",
    timestampMs: 10000,
    cameraId: "cam-03",
    cameraLabel: "CAM 03 — North View",
    entityId: "entity-01",
    entityLabel: "Person #01",
    eventType: "fall_detected",
    eventLabel: "Person fall detected",
    severity: "critical",
    confidence: 0.91,
    bbox: { x: 0.35, y: 0.55, width: 0.18, height: 0.12 },
    notes: "Rapid bounding box aspect ratio change — fall posture confirmed",
  },
  {
    id: "evt-005",
    timestamp: "10:42:25",
    timestampMs: 14000,
    cameraId: "cam-03",
    cameraLabel: "CAM 03 — North View",
    entityId: "entity-02",
    entityLabel: "Person #02",
    eventType: "person_entered",
    eventLabel: "Second person arrived",
    severity: "normal",
    confidence: 0.93,
    bbox: { x: 0.15, y: 0.2, width: 0.09, height: 0.5 },
  },
  {
    id: "evt-006",
    timestamp: "10:42:38",
    timestampMs: 27000,
    cameraId: "cam-02",
    cameraLabel: "CAM 02 — Parking Lot",
    entityId: "entity-01",
    entityLabel: "Person #01",
    eventType: "person_left",
    eventLabel: "Person left area",
    severity: "normal",
    confidence: 0.88,
  },
];

// ─── Observed Facts / Inferences ──────────────────────────────────────────────

const MOCK_OBSERVED_FACTS: ObservedFact[] = [
  {
    id: "obs-01",
    text: "Person #01 entered the area at 10:42:11 via the main entrance.",
    timestamp: "10:42:11",
    cameraId: "cam-01",
    cameraLabel: "CAM 01 — Entrance",
    entityId: "entity-01",
    confidence: 0.97,
  },
  {
    id: "obs-02",
    text: "Person #01 moved toward Vehicle #01 at 10:42:16.",
    timestamp: "10:42:16",
    cameraId: "cam-02",
    cameraLabel: "CAM 02 — Parking Lot",
    entityId: "entity-01",
    confidence: 0.89,
  },
  {
    id: "obs-03",
    text: "Vehicle #01 moved at 10:42:19 — centroid displacement of 3.2m detected.",
    timestamp: "10:42:19",
    cameraId: "cam-02",
    cameraLabel: "CAM 02 — Parking Lot",
    entityId: "entity-03",
    confidence: 0.95,
  },
  {
    id: "obs-04",
    text: "Person #01 fell at 10:42:21 — bounding box collapsed to horizontal orientation.",
    timestamp: "10:42:21",
    cameraId: "cam-03",
    cameraLabel: "CAM 03 — North View",
    entityId: "entity-01",
    confidence: 0.91,
  },
  {
    id: "obs-05",
    text: "Person #02 appeared in frame at 10:42:25, approximately 4 seconds after the fall.",
    timestamp: "10:42:25",
    cameraId: "cam-03",
    cameraLabel: "CAM 03 — North View",
    entityId: "entity-02",
    confidence: 0.93,
  },
];

const MOCK_INFERENCES: AIInference[] = [
  {
    text: "The vehicle movement at 10:42:19 may have contributed to the fall of Person #01 at 10:42:21, given the 2.1-second interval and spatial proximity.",
    supportingFactIds: ["obs-03", "obs-04"],
    confidence: 0.78,
  },
  {
    text: "Person #02 appears to have been responding to the fall event, based on their arrival trajectory and timing.",
    supportingFactIds: ["obs-04", "obs-05"],
    confidence: 0.65,
  },
];

const MOCK_REPORT_TIMELINE: ReportTimelineEntry[] = [
  {
    timestamp: "10:42:11",
    description: "Person #01 enters the area through the main entrance.",
    entityLabel: "Person #01",
    cameraLabel: "CAM 01",
    severity: "normal",
  },
  {
    timestamp: "10:42:16",
    description: "Person #01 moves toward Vehicle #01 in the parking area.",
    entityLabel: "Person #01",
    cameraLabel: "CAM 02",
    severity: "warning",
  },
  {
    timestamp: "10:42:19",
    description: "Vehicle #01 moves unexpectedly while Person #01 is in proximity.",
    entityLabel: "Vehicle #01",
    cameraLabel: "CAM 02",
    severity: "warning",
    evidenceRef: MOCK_EVIDENCE[0],
  },
  {
    timestamp: "10:42:21",
    description: "Person #01 falls to ground. Bounding box geometry confirms fall posture.",
    entityLabel: "Person #01",
    cameraLabel: "CAM 03",
    severity: "critical",
    evidenceRef: MOCK_EVIDENCE[1],
  },
  {
    timestamp: "10:42:25",
    description: "Person #02 enters frame, approaching Person #01's location.",
    entityLabel: "Person #02",
    cameraLabel: "CAM 03",
    severity: "normal",
  },
];

const MOCK_REPORT: IncidentReport = {
  id: "rpt-001",
  investigationId: "inv-0042",
  incidentType: "Possible Vehicle-Pedestrian Accident",
  startTime: "10:42:11",
  endTime: "10:42:38",
  location: "Parking Lot B — North Sector",
  entitiesInvolved: ["Person #01", "Person #02", "Vehicle #01"],
  timeline: MOCK_REPORT_TIMELINE,
  aiSummary:
    "Person #01 entered the monitored area at 10:42:11 and subsequently moved toward Vehicle #01. At 10:42:19, Vehicle #01 moved unexpectedly while Person #01 was in close proximity. Two seconds later, at 10:42:21, Person #01 fell. Person #02 arrived at 10:42:25, approximately four seconds after the fall event.",
  observedFacts: MOCK_OBSERVED_FACTS,
  inferences: MOCK_INFERENCES,
  evidence: MOCK_EVIDENCE,
  overallConfidence: 91,
  uncertainties: [
    "The footage does not conclusively establish whether the vehicle movement directly caused the fall.",
    "The intent or awareness of the vehicle operator cannot be determined from visual data alone.",
    "Person #02's relationship to Person #01 is unknown.",
  ],
  generatedAt: "2026-09-04T10:43:15Z",
};

// ─── Investigation ────────────────────────────────────────────────────────────

export const MOCK_INVESTIGATION: Investigation = {
  id: "inv-0042",
  name: "Parking Lot Incident #0042",
  location: "Facility B — North Parking",
  description: "Suspected vehicle-pedestrian incident involving one fall and two individuals.",
  cameraCount: 3,
  incidentDate: "2026-09-04",
  status: "complete",
  createdAt: "2026-09-04T10:40:00Z",
  cameras: [
    {
      id: "cam-01",
      label: "CAM 01 — Entrance",
      location: "Main Entrance Gate",
      videoUrl: "/demo/cam01.mp4",
      duration: 90,
      fps: 25,
      resolution: { width: 1920, height: 1080 },
      startTime: "10:41:50",
    },
    {
      id: "cam-02",
      label: "CAM 02 — Parking Lot",
      location: "Parking Area B",
      videoUrl: "/demo/cam02.mp4",
      duration: 90,
      fps: 25,
      resolution: { width: 1920, height: 1080 },
      startTime: "10:41:50",
    },
    {
      id: "cam-03",
      label: "CAM 03 — North View",
      location: "North Perimeter Camera",
      videoUrl: "/demo/cam03.mp4",
      duration: 90,
      fps: 25,
      resolution: { width: 1920, height: 1080 },
      startTime: "10:41:50",
    },
  ],
  events: MOCK_EVENTS,
  entities: MOCK_ENTITIES,
  report: MOCK_REPORT,
};

// ─── Pipeline Stages ──────────────────────────────────────────────────────────

export const MOCK_PIPELINE_STAGES: PipelineProgress[] = [
  { stage: "upload", status: "complete", progress: 100, message: "3 video files uploaded" },
  { stage: "frames", status: "complete", progress: 100, message: "8,100 frames extracted" },
  { stage: "detection", status: "complete", progress: 100, message: "YOLO — 3 entity classes detected" },
  { stage: "tracking", status: "complete", progress: 100, message: "ByteTrack — 3 persistent IDs assigned" },
  { stage: "events", status: "complete", progress: 100, message: "6 events extracted" },
  { stage: "ai", status: "complete", progress: 100, message: "Gemini — Reconstruction complete" },
];

// ─── Chat ─────────────────────────────────────────────────────────────────────

export const MOCK_CHAT_MESSAGES: ChatMessage[] = [
  {
    id: "msg-01",
    role: "user",
    content: "What happened before the person fell?",
    timestamp: "10:43:20",
  },
  {
    id: "msg-02",
    role: "assistant",
    content:
      "In the 10 seconds before Person #01 fell at 10:42:21:\n\n**10:42:11** — Person #01 entered the area (CAM 01).\n**10:42:16** — Person #01 moved toward Vehicle #01 (CAM 02).\n**10:42:19** — Vehicle #01 moved unexpectedly while Person #01 was within 0.8m proximity.\n\nThe vehicle movement preceded the fall by 2.1 seconds. This is the primary context.",
    timestamp: "10:43:21",
    evidenceRefs: [MOCK_EVIDENCE[0]],
  },
];

// ─── AI Chat Responses ────────────────────────────────────────────────────────

export async function fetchChatResponse(
  investigationId: string,
  question: string
): Promise<ChatMessage> {
  await new Promise((resolve) => setTimeout(resolve, 1400));

  const q = question.toLowerCase();
  let content = "";
  let evidenceRefs: EvidenceReference[] = [MOCK_EVIDENCE[0]];

  if (q.includes("camera") || q.includes("which") || q.includes("first")) {
    content =
      "**CAM 01 — Entrance** captured the first event at 10:42:11, when Person #01 entered the monitored area.\n\nThe incident then progressed to **CAM 02** (10:42:16–10:42:19, vehicle interaction) and **CAM 03** (10:42:21, fall event).\n\nThe critical 4-second window is best observed on CAM 02 and CAM 03 simultaneously.";
    evidenceRefs = [MOCK_EVIDENCE[0], MOCK_EVIDENCE[1]];
  } else if (q.includes("how many") || q.includes("people") || q.includes("involved")) {
    content =
      "**2 individuals** are identified in this investigation:\n\n**Person #01** — entered at 10:42:11, involved in the fall at 10:42:21. Present across all 3 cameras.\n**Person #02** — arrived at 10:42:25, approximately 4 seconds after the fall. Seen on CAM 02 and CAM 03.\n\n**Vehicle #01** is also a key actor — present from 10:41:50 on CAM 02.";
    evidenceRefs = [MOCK_EVIDENCE[1]];
  } else if (q.includes("unusual") || q.includes("before") || q.includes("5 min")) {
    content =
      "One anomaly was detected in the 5 minutes prior to the incident:\n\n**10:41:50–10:42:18** — Vehicle #01 was stationary for 28 seconds, then moved abruptly at 10:42:19 while Person #01 was within 0.8m proximity.\n\nThis sudden vehicle movement in close human proximity is flagged as the **primary triggering anomaly** of this sequence.";
    evidenceRefs = [MOCK_EVIDENCE[0]];
  } else if (q.includes("confidence") || q.includes("certain") || q.includes("sure")) {
    content =
      "**Overall reconstruction confidence: 91%**\n\nObserved facts have individual confidence scores ranging from 88%–97%.\n\nThe key **inference** — that the vehicle movement caused the fall — has a confidence of **78%**. This is explicitly marked as an inference, not a confirmed fact.\n\nThe system cannot confirm intent or causality beyond what the visual data supports.";
    evidenceRefs = MOCK_EVIDENCE;
  } else {
    content =
      "Based on the analyzed footage, the incident involved **Person #01**, **Vehicle #01**, and later **Person #02**.\n\nThe key sequence: Person #01 entered at 10:42:11 → approached Vehicle #01 at 10:42:16 → Vehicle #01 moved at 10:42:19 → Person #01 fell at 10:42:21 → Person #02 arrived at 10:42:25.\n\nThe reconstruction confidence is **91%**. The causal link between vehicle movement and fall is inferred at 78% confidence.";
    evidenceRefs = [MOCK_EVIDENCE[0]];
  }

  return {
    id: `msg-${Date.now()}`,
    role: "assistant",
    content,
    timestamp: new Date().toLocaleTimeString("en-GB", { hour12: false }),
    evidenceRefs,
  };
}
