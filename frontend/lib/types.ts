// ─── Core Domain Types ───────────────────────────────────────────────────────

export type InvestigationStatus =
  | "idle"
  | "uploading"
  | "extracting_frames"
  | "detecting"
  | "tracking"
  | "extracting_events"
  | "ai_reasoning"
  | "complete"
  | "error";

export type EntityType = "person" | "vehicle" | "bike" | "object" | "unknown";

export type EventType =
  | "person_entered"
  | "person_left"
  | "person_approached_vehicle"
  | "person_approached_person"
  | "vehicle_movement"
  | "fall_detected"
  | "object_dropped"
  | "crowd_forming"
  | "zone_intrusion"
  | "unusual_activity"
  | "person_stopped"
  | "person_running";

export type EventSeverity = "normal" | "warning" | "critical";

export interface BoundingBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface Investigation {
  id: string;
  name: string;
  location: string;
  description: string;
  cameraCount: number;
  incidentDate: string;
  status: InvestigationStatus;
  createdAt: string;
  cameras: CameraFeed[];
  events: IncidentEvent[];
  entities: TrackedEntity[];
  report?: IncidentReport;
}

export interface CameraFeed {
  id: string;
  label: string;
  location: string;
  videoUrl: string;
  thumbnailUrl?: string;
  duration: number;
  fps: number;
  resolution: { width: number; height: number };
  startTime: string;
}

export interface TrackedEntity {
  id: string;
  trackingId: string;
  type: EntityType;
  firstSeen: string;
  lastSeen: string;
  camerasAppeared: string[];
  eventCount: number;
  color: string;
}

export interface IncidentEvent {
  id: string;
  timestamp: string;
  timestampMs: number;
  cameraId: string;
  cameraLabel: string;
  entityId: string;
  entityLabel: string;
  eventType: EventType;
  eventLabel: string;
  severity: EventSeverity;
  confidence: number;
  bbox?: BoundingBox;
  frameNumber?: number;
  notes?: string;
}

export interface ObservedFact {
  id: string;
  text: string;
  timestamp: string;
  cameraId: string;
  cameraLabel: string;
  entityId?: string;
  confidence: number;
}

export interface AIInference {
  text: string;
  supportingFactIds: string[];
  confidence: number;
}

export interface EvidenceReference {
  cameraId: string;
  cameraLabel: string;
  startTime: string;
  endTime: string;
  description: string;
  timestampMs: number;
}

export interface IncidentReport {
  id: string;
  investigationId: string;
  incidentType: string;
  startTime: string;
  endTime: string;
  location: string;
  entitiesInvolved: string[];
  timeline: ReportTimelineEntry[];
  aiSummary: string;
  observedFacts: ObservedFact[];
  inferences: AIInference[];
  evidence: EvidenceReference[];
  overallConfidence: number;
  uncertainties: string[];
  generatedAt: string;
}

export interface ReportTimelineEntry {
  timestamp: string;
  description: string;
  entityLabel?: string;
  cameraLabel?: string;
  severity: EventSeverity;
  evidenceRef?: EvidenceReference;
}

export type PipelineStage = "upload" | "frames" | "detection" | "tracking" | "events" | "ai";

export interface PipelineProgress {
  stage: PipelineStage;
  status: "pending" | "active" | "complete" | "error";
  progress?: number;
  message?: string;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
  evidenceRefs?: EvidenceReference[];
  isLoading?: boolean;
}

export interface WSMessage {
  type: "pipeline_progress" | "new_event" | "ai_update" | "error" | "complete";
  payload: unknown;
}
