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
  MultiCameraLink,
  CameraFrameDetection,
} from "./types";

// ─── Evidence References ──────────────────────────────────────────────────────

export const MOCK_EVIDENCE: EvidenceReference[] = [
  {
    cameraId: "cam-01",
    cameraLabel: "CAM 01 — North Entrance",
    startTime: "10:42:11",
    endTime: "10:42:15",
    description: "Subject Person #01 enters monitored perimeter",
    timestampMs: 0,
  },
  {
    cameraId: "cam-02",
    cameraLabel: "CAM 02 — Parking Bay 04",
    startTime: "10:42:16",
    endTime: "10:42:19",
    description: "Person #01 in proximity to Vehicle #01 rear bumper",
    timestampMs: 5000,
  },
  {
    cameraId: "cam-03",
    cameraLabel: "CAM 03 — Street East",
    startTime: "10:42:19",
    endTime: "10:42:23",
    description: "Vehicle #01 acceleration and Person #01 collapse",
    timestampMs: 8000,
  },
  {
    cameraId: "cam-04",
    cameraLabel: "CAM 04 — Rooftop Overhead",
    startTime: "10:42:21",
    endTime: "10:42:28",
    description: "Bird's-eye spatial trajectory and Person #02 witness arrival",
    timestampMs: 10000,
  },
];

// ─── Entities (Anonymous IDs only, No Facial Recognition) ─────────────────────

export const MOCK_ENTITIES: TrackedEntity[] = [
  {
    id: "entity-01",
    trackingId: "Person #01",
    type: "person",
    firstSeen: "10:42:11",
    lastSeen: "10:43:05",
    camerasAppeared: ["cam-01", "cam-02", "cam-03", "cam-04"],
    eventCount: 4,
    color: "#00E5FF",
  },
  {
    id: "entity-02",
    trackingId: "Person #02",
    type: "person",
    firstSeen: "10:42:25",
    lastSeen: "10:43:15",
    camerasAppeared: ["cam-01", "cam-02", "cam-04"],
    eventCount: 2,
    color: "#10B981",
  },
  {
    id: "entity-03",
    trackingId: "Vehicle #01",
    type: "vehicle",
    firstSeen: "10:41:50",
    lastSeen: "10:43:00",
    camerasAppeared: ["cam-02", "cam-03", "cam-04"],
    eventCount: 2,
    color: "#F59E0B",
  },
];

// ─── Events ───────────────────────────────────────────────────────────────────

export const MOCK_EVENTS: IncidentEvent[] = [
  {
    id: "evt-001",
    timestamp: "10:42:11",
    timestampMs: 0,
    cameraId: "cam-01",
    cameraLabel: "CAM 01 — North Entrance",
    entityId: "entity-01",
    entityLabel: "Person #01",
    eventType: "person_entered",
    eventLabel: "Person enters area",
    severity: "normal",
    confidence: 0.98,
    bbox: { x: 0.28, y: 0.35, width: 0.12, height: 0.48 },
    notes: "Subject crossed north entrance line heading south toward parking bay.",
  },
  {
    id: "evt-002",
    timestamp: "10:42:16",
    timestampMs: 5000,
    cameraId: "cam-02",
    cameraLabel: "CAM 02 — Parking Bay 04",
    entityId: "entity-01",
    entityLabel: "Person #01",
    eventType: "person_approached_vehicle",
    eventLabel: "Person approaches vehicle",
    severity: "warning",
    confidence: 0.94,
    bbox: { x: 0.38, y: 0.42, width: 0.14, height: 0.46 },
    notes: "Proximity threshold alert: distance to Vehicle #01 rear bumper < 0.85m.",
  },
  {
    id: "evt-003",
    timestamp: "10:42:19",
    timestampMs: 8000,
    cameraId: "cam-03",
    cameraLabel: "CAM 03 — Street East",
    entityId: "entity-03",
    entityLabel: "Vehicle #01",
    eventType: "vehicle_movement",
    eventLabel: "Vehicle moves abruptly",
    severity: "critical",
    confidence: 0.96,
    bbox: { x: 0.42, y: 0.48, width: 0.28, height: 0.36 },
    notes: "Vehicle reverse motion detected. Reverse backup lights activated. Centroid displacement 3.4m.",
  },
  {
    id: "evt-004",
    timestamp: "10:42:21",
    timestampMs: 10000,
    cameraId: "cam-04",
    cameraLabel: "CAM 04 — Rooftop Overhead",
    entityId: "entity-01",
    entityLabel: "Person #01",
    eventType: "fall_detected",
    eventLabel: "Person falls",
    severity: "critical",
    confidence: 0.92,
    bbox: { x: 0.44, y: 0.54, width: 0.18, height: 0.22 },
    notes: "Sudden vertical bounding box aspect ratio collapse from 2.6 to 0.4. Subject horizontal.",
  },
  {
    id: "evt-005",
    timestamp: "10:42:25",
    timestampMs: 14000,
    cameraId: "cam-01",
    cameraLabel: "CAM 01 — North Entrance",
    entityId: "entity-02",
    entityLabel: "Person #02",
    eventType: "person_running",
    eventLabel: "Another person arrives",
    severity: "normal",
    confidence: 0.95,
    bbox: { x: 0.65, y: 0.38, width: 0.12, height: 0.44 },
    notes: "Second individual enters frame with rapid velocity (3.2 m/s) heading to incident location.",
  },
];

// ─── Multi-Camera Correlation Links ───────────────────────────────────────────

export const MOCK_MULTI_CAM_LINKS: MultiCameraLink[] = [
  {
    id: "link-01",
    sourceCamera: "CAM 01 (Entrance)",
    targetCamera: "CAM 02 (Parking Bay)",
    entityId: "entity-01",
    entityLabel: "Person #01",
    reIdScore: 0.984,
    timeGapSeconds: 4.8,
    sharedEvent: "Entry to Approach Handoff",
    timestamp: "10:42:11 → 10:42:16",
  },
  {
    id: "link-02",
    sourceCamera: "CAM 02 (Parking Bay)",
    targetCamera: "CAM 03 (Street East)",
    entityId: "entity-03",
    entityLabel: "Vehicle #01",
    reIdScore: 0.992,
    timeGapSeconds: 0.2,
    sharedEvent: "Reverse Acceleration Overlap",
    timestamp: "10:42:19",
  },
  {
    id: "link-03",
    sourceCamera: "CAM 03 (Street East)",
    targetCamera: "CAM 04 (Rooftop Overhead)",
    entityId: "entity-01",
    entityLabel: "Person #01",
    reIdScore: 0.961,
    timeGapSeconds: 0.0,
    sharedEvent: "Synchronized Fall Event",
    timestamp: "10:42:21",
  },
  {
    id: "link-04",
    sourceCamera: "CAM 01 (Entrance)",
    targetCamera: "CAM 04 (Rooftop Overhead)",
    entityId: "entity-02",
    entityLabel: "Person #02",
    reIdScore: 0.953,
    timeGapSeconds: 3.1,
    sharedEvent: "Witness Ingress Handoff",
    timestamp: "10:42:25 → 10:42:28",
  },
];

// ─── Facts vs Inferences ──────────────────────────────────────────────────────

export const MOCK_FACTS: ObservedFact[] = [
  {
    id: "obs-01",
    text: "Person #01 entered the monitored area through North Entrance at 10:42:11.",
    timestamp: "10:42:11",
    cameraId: "cam-01",
    cameraLabel: "CAM 01 — North Entrance",
    entityId: "entity-01",
    confidence: 0.98,
  },
  {
    id: "obs-02",
    text: "Person #01 moved toward stationary Vehicle #01 at 10:42:16, reaching within 0.85m of rear bumper.",
    timestamp: "10:42:16",
    cameraId: "cam-02",
    cameraLabel: "CAM 02 — Parking Bay 04",
    entityId: "entity-01",
    confidence: 0.94,
  },
  {
    id: "obs-03",
    text: "Vehicle #01 initiated reverse motion at 10:42:19 with backup lights illuminated. Centroid displacement 3.4m.",
    timestamp: "10:42:19",
    cameraId: "cam-03",
    cameraLabel: "CAM 03 — Street East",
    entityId: "entity-03",
    confidence: 0.96,
  },
  {
    id: "obs-04",
    text: "Person #01 collapsed horizontally to the asphalt at 10:42:21, 2.1 seconds after vehicle reverse motion began.",
    timestamp: "10:42:21",
    cameraId: "cam-04",
    cameraLabel: "CAM 04 — Rooftop Overhead",
    entityId: "entity-01",
    confidence: 0.92,
  },
  {
    id: "obs-05",
    text: "Person #02 entered through North Entrance at 10:42:25 running toward the incident site, arriving at 10:42:28.",
    timestamp: "10:42:25",
    cameraId: "cam-01",
    cameraLabel: "CAM 01 — North Entrance",
    entityId: "entity-02",
    confidence: 0.95,
  },
];

export const MOCK_INFERENCES: AIInference[] = [
  {
    text: "The sudden reverse movement of Vehicle #01 directly precipitated the collapse of Person #01, with high likelihood of bumper-to-leg contact (89% probability).",
    supportingFactIds: ["obs-02", "obs-03", "obs-04"],
    confidence: 0.89,
  },
  {
    text: "Vehicle operator line-of-sight was obstructed by vehicle C-pillar blind angle and parking bay geometry at the time reverse was engaged.",
    supportingFactIds: ["obs-02", "obs-03"],
    confidence: 0.82,
  },
  {
    text: "Person #02 is an external bystander reacting to the sound or sight of the collision, rather than an accomplice.",
    supportingFactIds: ["obs-04", "obs-05"],
    confidence: 0.91,
  },
];

export const MOCK_REPORT_TIMELINE: ReportTimelineEntry[] = [
  {
    timestamp: "10:42:11",
    description: "Person #01 enters the facility through the North Entrance Gate.",
    entityLabel: "Person #01",
    cameraLabel: "CAM 01 — North Entrance",
    severity: "normal",
    evidenceRef: MOCK_EVIDENCE[0],
  },
  {
    timestamp: "10:42:16",
    description: "Person #01 walks into Parking Bay 04 and pauses within 0.85m of Vehicle #01.",
    entityLabel: "Person #01",
    cameraLabel: "CAM 02 — Parking Bay 04",
    severity: "warning",
    evidenceRef: MOCK_EVIDENCE[1],
  },
  {
    timestamp: "10:42:19",
    description: "Vehicle #01 engages reverse gear and accelerates backwards abruptly.",
    entityLabel: "Vehicle #01",
    cameraLabel: "CAM 03 — Street East",
    severity: "critical",
    evidenceRef: MOCK_EVIDENCE[2],
  },
  {
    timestamp: "10:42:21",
    description: "Person #01 falls to the pavement immediately following vehicle impact.",
    entityLabel: "Person #01",
    cameraLabel: "CAM 04 — Rooftop Overhead",
    severity: "critical",
    evidenceRef: MOCK_EVIDENCE[3],
  },
  {
    timestamp: "10:42:25",
    description: "Person #02 enters from North Entrance at a sprint and reaches Person #01.",
    entityLabel: "Person #02",
    cameraLabel: "CAM 01 — North Entrance",
    severity: "normal",
    evidenceRef: MOCK_EVIDENCE[0],
  },
];

export const MOCK_REPORT: IncidentReport = {
  id: "rep-2024-8842",
  investigationId: "inv-demo-001",
  incidentType: "Vehicle-Pedestrian Collision & Collapse",
  startTime: "10:42:11",
  endTime: "10:42:35",
  location: "Sector 04 — Commercial Facility Parking Lot B",
  entitiesInvolved: ["Person #01 (Victim)", "Vehicle #01 (Silver SUV)", "Person #02 (Witness)"],
  timeline: MOCK_REPORT_TIMELINE,
  aiSummary:
    "A person approached a parked vehicle. The vehicle subsequently moved in reverse, after which the person fell. A witness arrived several seconds later. The spatial-temporal correlation across 4 synchronized cameras confirms the vehicle acceleration preceded the collapse by 2.1 seconds.",
  observedFacts: MOCK_FACTS,
  inferences: MOCK_INFERENCES,
  evidence: MOCK_EVIDENCE,
  overallConfidence: 0.94,
  uncertainties: [
    "Exact point of physical bumper-to-extremity contact is partially occluded in CAM 02 by vehicle quarter-panel (inferred with 89% confidence from CAM 03 & CAM 04).",
    "Driver intention cannot be determined; pedal misapplication vs. negligent reversal remains an unobservable internal state.",
  ],
  generatedAt: "2026-09-04T10:45:00Z",
};

// ─── Complete Demo Investigation ──────────────────────────────────────────────

export const MOCK_INVESTIGATION: Investigation = {
  id: "inv-demo-001",
  name: "Sector 04 Parking Bay Collision",
  location: "Sector 04 — Commercial Complex Parking Lot B",
  description:
    "Multi-camera incident intelligence reconstruction of vehicle reverse acceleration, pedestrian fall, and bystander response.",
  cameraCount: 4,
  incidentDate: "2026-09-04 10:42:11 UTC",
  status: "complete",
  createdAt: "2026-09-04 10:43:00",
  cameras: [
    {
      id: "cam-01",
      label: "CAM 01 — North Entrance",
      location: "North Perimeter Gate",
      videoUrl: "/demo/cam01.mp4",
      thumbnailUrl: "/demo/thumb01.jpg",
      duration: 30,
      fps: 30,
      resolution: { width: 1920, height: 1080 },
      startTime: "10:42:11",
    },
    {
      id: "cam-02",
      label: "CAM 02 — Parking Bay 04",
      location: "Parking Area Central Bay",
      videoUrl: "/demo/cam02.mp4",
      thumbnailUrl: "/demo/thumb02.jpg",
      duration: 30,
      fps: 30,
      resolution: { width: 1920, height: 1080 },
      startTime: "10:42:11",
    },
    {
      id: "cam-03",
      label: "CAM 03 — Street East",
      location: "East Avenue Cross-Angle",
      videoUrl: "/demo/cam03.mp4",
      thumbnailUrl: "/demo/thumb03.jpg",
      duration: 30,
      fps: 30,
      resolution: { width: 1920, height: 1080 },
      startTime: "10:42:11",
    },
    {
      id: "cam-04",
      label: "CAM 04 — Rooftop Overhead",
      location: "Rooftop Mast Top-Down",
      videoUrl: "/demo/cam04.mp4",
      thumbnailUrl: "/demo/thumb04.jpg",
      duration: 30,
      fps: 30,
      resolution: { width: 1920, height: 1080 },
      startTime: "10:42:11",
    },
  ],
  events: MOCK_EVENTS,
  entities: MOCK_ENTITIES,
  report: MOCK_REPORT,
};

// ─── Investigations List for Dashboard ────────────────────────────────────────

export const MOCK_INVESTIGATIONS_LIST: Investigation[] = [
  MOCK_INVESTIGATION,
  {
    id: "inv-002",
    name: "Warehouse Loading Dock Intrusion",
    location: "South Industrial District — Gate 3",
    description: "Perimeter breach detection and unauthorized pallet movement across 3 synchronized cameras.",
    cameraCount: 3,
    incidentDate: "2026-09-03 22:15:00 UTC",
    status: "complete",
    createdAt: "2026-09-03 22:20:00",
    cameras: MOCK_INVESTIGATION.cameras.slice(0, 3),
    events: MOCK_EVENTS.slice(0, 3),
    entities: MOCK_ENTITIES.slice(0, 2),
  },
  {
    id: "inv-003",
    name: "East Terminal Baggage Area Anomaly",
    location: "Transit Hub — Level 2 Concourse",
    description: "Unattended object correlation and multi-camera passenger tracking through transit corridors.",
    cameraCount: 4,
    incidentDate: "2026-09-02 14:05:30 UTC",
    status: "ai_reasoning",
    createdAt: "2026-09-02 14:10:00",
    cameras: MOCK_INVESTIGATION.cameras,
    events: MOCK_EVENTS.slice(0, 4),
    entities: MOCK_ENTITIES,
  },
  {
    id: "inv-004",
    name: "North Retail Plaza Disorder",
    location: "Shopping District — Main Courtyard",
    description: "Crowd density surge and rapid person movement tracking following verbal altercation.",
    cameraCount: 2,
    incidentDate: "2026-09-01 19:40:12 UTC",
    status: "complete",
    createdAt: "2026-09-01 19:45:00",
    cameras: MOCK_INVESTIGATION.cameras.slice(0, 2),
    events: MOCK_EVENTS.slice(0, 2),
    entities: MOCK_ENTITIES.slice(0, 2),
  },
];

// ─── Pipeline Stages ──────────────────────────────────────────────────────────

export const MOCK_PIPELINE_STAGES: PipelineProgress[] = [
  { stage: "upload", status: "complete", progress: 100, message: "4 video streams ingested & calibrated" },
  { stage: "frames", status: "complete", progress: 100, message: "3,600 synchronized frames extracted (30fps)" },
  { stage: "detection", status: "complete", progress: 100, message: "YOLOv8 — Person & Vehicle classes detected" },
  { stage: "tracking", status: "complete", progress: 100, message: "ByteTrack — Anonymous persistent IDs assigned" },
  { stage: "events", status: "complete", progress: 100, message: "5 spatio-temporal events classified" },
  { stage: "ai", status: "complete", progress: 100, message: "Gemini Reasoning — Multi-camera reconstruction ready" },
];

// ─── Chat Messages ────────────────────────────────────────────────────────────

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
      "### Observed Facts (Camera-Verified):\n- **10:42:11 [CAM 01]**: Person #01 entered the north entrance.\n- **10:42:16 [CAM 02]**: Person #01 walked to within 0.85m of Vehicle #01's rear bumper.\n- **10:42:19 [CAM 03]**: Vehicle #01 engaged reverse gear and moved backward 3.4 meters.\n- **10:42:21 [CAM 04]**: Person #01 collapsed to the pavement.\n\n### AI Inference (Probabilistic):\n- The vehicle reverse movement preceded the collapse by **2.1 seconds** with direct spatial proximity. Physical contact with the lower extremity is inferred with **89% confidence**.",
    timestamp: "10:43:21",
    evidenceRefs: [MOCK_EVIDENCE[1], MOCK_EVIDENCE[2]],
  },
];

// ─── Simulated / Gemini-Powered Reasoning Assistant ───────────────────────────

export async function fetchChatResponse(
  investigationId: string,
  question: string,
  customApiKey?: string
): Promise<ChatMessage> {
  const q = question.toLowerCase();

  // If real Gemini API key is provided, try making the real API call
  if (customApiKey && customApiKey.startsWith("AIza")) {
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${customApiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [
              {
                role: "user",
                parts: [
                  {
                    text: `You are AI Witness, an objective forensic incident intelligence analyst.
Here are the verified camera events:
10:42:11 [CAM 01 North Entrance]: Person #01 enters the area.
10:42:16 [CAM 02 Parking Bay 04]: Person #01 approaches Vehicle #01 (within 0.85m).
10:42:19 [CAM 03 Street East]: Vehicle #01 reverses suddenly (3.4m displacement).
10:42:21 [CAM 04 Rooftop Overhead]: Person #01 falls to the ground.
10:42:25 [CAM 01 North Entrance]: Person #02 arrives running at 3.2 m/s.

CRITICAL RULES:
1. Strictly separate OBSERVED FACTS from AI INFERENCES.
2. Quote exact timestamps and camera IDs.
3. Do NOT invent unobservable information (e.g. driver intent, facial expressions).
4. Clearly state confidence and uncertainties.

User question: "${question}"`,
                  },
                ],
              },
            ],
          }),
        }
      );
      if (response.ok) {
        const data = await response.json();
        const geminiText = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (geminiText) {
          return {
            id: `msg-${Date.now()}`,
            role: "assistant",
            content: geminiText,
            timestamp: new Date().toLocaleTimeString("en-GB", { hour12: false }),
            evidenceRefs: [MOCK_EVIDENCE[1], MOCK_EVIDENCE[2]],
          };
        }
      }
    } catch {
      // Fallback to grounded analytical reasoning engine
    }
  }

  // Grounded Spatio-Temporal Forensic Engine
  await new Promise((resolve) => setTimeout(resolve, 800));

  let content = "";
  let evidenceRefs: EvidenceReference[] = [MOCK_EVIDENCE[1]];

  if (q.includes("what happened") || q.includes("summary") || q.includes("overview")) {
    content =
      "### Chronological Reconstruction:\n\n" +
      "**[OBSERVED FACTS]**\n" +
      "1. **10:42:11 [CAM 01]** — Person #01 entered the facility via North Entrance.\n" +
      "2. **10:42:16 [CAM 02]** — Person #01 walked toward parked Vehicle #01, stopping in rear proximity (<0.85m).\n" +
      "3. **10:42:19 [CAM 03]** — Vehicle #01 engaged reverse lights and accelerated backwards 3.4m.\n" +
      "4. **10:42:21 [CAM 04]** — Person #01 fell horizontally to the ground 2.1s after vehicle motion began.\n" +
      "5. **10:42:25 [CAM 01]** — Person #02 ran into frame and arrived at the victim at 10:42:28.\n\n" +
      "**[AI INFERENCE]**\n" +
      "- **Causal Link (89% Confidence)**: Vehicle reverse motion directly triggered the fall. Geometric path clearance was not completed before vehicle accelerated.\n" +
      "- **Uncertainty**: Driver visibility was impaired by the vehicle C-pillar; driver intent cannot be visually determined.";
    evidenceRefs = [MOCK_EVIDENCE[1], MOCK_EVIDENCE[2], MOCK_EVIDENCE[3]];
  } else if (q.includes("which camera") || q.includes("cameras") || q.includes("angle")) {
    content =
      "**4 Synchronized Cameras** captured this incident from distinct viewpoints:\n\n" +
      "- **CAM 01 (North Entrance)**: Captured subject ingress (10:42:11) and witness arrival (10:42:25).\n" +
      "- **CAM 02 (Parking Bay 04)**: Captured pedestrian-to-vehicle approach and proximity interval (10:42:16).\n" +
      "- **CAM 03 (Street East)**: Captured side profile of vehicle reverse acceleration and impact instant (10:42:19–10:42:21).\n" +
      "- **CAM 04 (Rooftop Overhead)**: Captured top-down spatial trajectories, fall posture collapse, and bystander path.\n\n" +
      "The critical 5-second incident window (10:42:18–10:42:23) is verified by CAM 02, CAM 03, and CAM 04 simultaneously.";
    evidenceRefs = MOCK_EVIDENCE;
  } else if (q.includes("before") || q.includes("precursor") || q.includes("prior")) {
    content =
      "### Precursor Events (10:41:50 – 10:42:18):\n\n" +
      "- **10:41:50 [CAM 02]**: Vehicle #01 was parked stationary in Bay 04 with engine idling.\n" +
      "- **10:42:11 [CAM 01]**: Person #01 entered through the north gate alone, walking at 1.2 m/s.\n" +
      "- **10:42:16 [CAM 02]**: Person #01 approached the rear of Vehicle #01 holding a mobile device.\n" +
      "- **10:42:18 [CAM 03]**: Vehicle #01 reverse backup lights illuminated 0.8s before physical tire rotation began.\n\n" +
      "**Fact vs. Inference**: Person #01 was in the blind zone before reverse motion commenced. There is no evidence of aggressive behavior from either party prior to impact.";
    evidenceRefs = [MOCK_EVIDENCE[0], MOCK_EVIDENCE[1]];
  } else if (q.includes("evidence") || q.includes("proof") || q.includes("support")) {
    content =
      "### Evidence Grounding & Cryptographic Verification:\n\n" +
      "Every claim in this reconstruction is linked to exact frame numbers and SHA-256 hash citations:\n\n" +
      "1. **Proximity Evidence**: CAM 02, Frame #480 (10:42:16.240) — BBox distance 0.82m. `Hash: 8a4f...3c91`\n" +
      "2. **Vehicle Motion Evidence**: CAM 03, Frame #570 (10:42:19.100) — Optical flow vector +14.2 px/frame. `Hash: 12d7...e40a`\n" +
      "3. **Collapse Evidence**: CAM 04, Frame #630 (10:42:21.050) — Aspect ratio transformation from 2.61 to 0.38. `Hash: 99bc...07f2`\n\n" +
      "All citations are exportable in court-admissible audit format.";
    evidenceRefs = [MOCK_EVIDENCE[1], MOCK_EVIDENCE[2]];
  } else if (q.includes("uncertain") || q.includes("doubt") || q.includes("limit")) {
    content =
      "### Disclosed Uncertainties & Limitations:\n\n" +
      "1. **Direct Point of Contact (89% Confidence)**: The precise centimeter of impact between rear bumper and lower leg is partially occluded in CAM 02 by the vehicle rear corner panel. It is inferred via multi-camera triangulation from CAM 03 and CAM 04.\n" +
      "2. **Driver State (Unobservable)**: Visual sensors cannot establish whether the driver looked in the rearview mirror or suffered pedal confusion.\n" +
      "3. **Audio Absent**: Audio data was not present in CCTV feeds; acoustic warning or horn use cannot be verified.\n\n" +
      "AI Witness strictly bounds its conclusions to verifiable visual physics.";
    evidenceRefs = [MOCK_EVIDENCE[1], MOCK_EVIDENCE[3]];
  } else {
    content =
      "### AI Forensic Analysis:\n\n" +
      "The multi-camera synthesis identifies a chronological chain involving **Person #01**, **Vehicle #01**, and **Person #02** across 4 synchronized cameras.\n\n" +
      "- **Sequence**: Entry (10:42:11) → Approach (10:42:16) → Reverse Acceleration (10:42:19) → Fall (10:42:21) → Witness (10:42:25).\n" +
      "- **Observed Certainty**: 94% across 5 core facts.\n" +
      "- **Causal Attribution**: 89% probability that vehicle reverse caused the fall.\n\n" +
      "Select any event in the timeline below to jump to the synchronized multi-camera frame.";
    evidenceRefs = [MOCK_EVIDENCE[1]];
  }

  return {
    id: `msg-${Date.now()}`,
    role: "assistant",
    content,
    timestamp: new Date().toLocaleTimeString("en-GB", { hour12: false }),
    evidenceRefs,
  };
}

export function getDetectionsAtTime(
  cameraId: string,
  timeSec: number
): CameraFrameDetection[] {
  // Demo timeline is 10:42:00 (t=0) to 10:42:30 (t=30)
  // Person #01: enters at t=11 on cam-01, Bay 04 on cam-02 at t=16, car moves at t=19, falls at t=21, witness on cam-01 at t=25
  const detections: CameraFrameDetection[] = [];

  if (cameraId === "cam-01") {
    // CAM 01: North Entrance
    // Person #01 enters at t=10..15, walks across frame
    if (timeSec >= 10 && timeSec <= 15) {
      const progress = (timeSec - 10) / 5;
      detections.push({
        entityId: "ent-01",
        label: "Person #01",
        type: "person",
        confidence: 0.96,
        bbox: {
          x: 0.15 + progress * 0.45,
          y: 0.25 + progress * 0.05,
          width: 0.12,
          height: 0.48,
        },
      });
    }
    // Person #02 runs in at t=23..30
    if (timeSec >= 23) {
      const p2Prog = Math.min((timeSec - 23) / 6, 1);
      detections.push({
        entityId: "ent-03",
        label: "Person #02",
        type: "person",
        confidence: 0.94,
        bbox: {
          x: 0.08 + p2Prog * 0.55,
          y: 0.32,
          width: 0.13,
          height: 0.46,
        },
      });
    }
  } else if (cameraId === "cam-02") {
    // CAM 02: Parking Bay 04
    // Vehicle #01 is present throughout (stationary then moves backward)
    const carOffset = timeSec >= 19 ? Math.min((timeSec - 19) * 0.025, 0.12) : 0;
    detections.push({
      entityId: "ent-02",
      label: "Vehicle #01",
      type: "vehicle",
      confidence: 0.99,
      bbox: {
        x: 0.48 - carOffset,
        y: 0.38,
        width: 0.36,
        height: 0.34,
      },
    });

    // Person #01 arrives at t=14..22
    if (timeSec >= 14 && timeSec <= 22) {
      const p1Prog = Math.min((timeSec - 14) / 4, 1);
      detections.push({
        entityId: "ent-01",
        label: "Person #01",
        type: "person",
        confidence: 0.95,
        bbox: {
          x: 0.22 + p1Prog * 0.18,
          y: 0.35,
          width: 0.11,
          height: 0.44,
        },
      });
    }
  } else if (cameraId === "cam-03") {
    // CAM 03: Street East
    // Side profile of Vehicle #01 and street crossing
    const v3Shift = timeSec >= 19 ? Math.min((timeSec - 19) * 0.03, 0.15) : 0;
    detections.push({
      entityId: "ent-02",
      label: "Vehicle #01",
      type: "vehicle",
      confidence: 0.98,
      bbox: {
        x: 0.35 - v3Shift,
        y: 0.42,
        width: 0.32,
        height: 0.28,
      },
    });

    if (timeSec >= 16 && timeSec <= 23) {
      detections.push({
        entityId: "ent-01",
        label: "Person #01",
        type: "person",
        confidence: 0.92,
        bbox: {
          x: 0.24,
          y: 0.44,
          width: 0.08,
          height: 0.38,
        },
      });
    }
  } else if (cameraId === "cam-04") {
    // CAM 04: Rooftop Overhead (bird's eye view)
    // Vehicle #01 top view
    const topShift = timeSec >= 19 ? Math.min((timeSec - 19) * 0.02, 0.10) : 0;
    detections.push({
      entityId: "ent-02",
      label: "Vehicle #01",
      type: "vehicle",
      confidence: 0.97,
      bbox: {
        x: 0.52,
        y: 0.35 + topShift,
        width: 0.26,
        height: 0.22,
      },
    });

    // Person #01 standing then falling flat
    if (timeSec >= 15) {
      const isFallen = timeSec >= 21;
      detections.push({
        entityId: "ent-01",
        label: isFallen ? "Person #01 (FALLEN)" : "Person #01",
        type: "person",
        confidence: isFallen ? 0.94 : 0.96,
        bbox: {
          x: 0.44,
          y: isFallen ? 0.62 : 0.52,
          width: isFallen ? 0.18 : 0.09,
          height: isFallen ? 0.08 : 0.22,
        },
      });
    }

    // Person #02 arrives to assist at t=26
    if (timeSec >= 25) {
      const p2Prog = Math.min((timeSec - 25) / 4, 1);
      detections.push({
        entityId: "ent-03",
        label: "Person #02",
        type: "person",
        confidence: 0.95,
        bbox: {
          x: 0.15 + p2Prog * 0.24,
          y: 0.60,
          width: 0.09,
          height: 0.20,
        },
      });
    }
  }

  return detections;
}

