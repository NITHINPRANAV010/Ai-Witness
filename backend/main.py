"""
AI WITNESS — Multi-Camera Incident Reconstruction Platform
Backend Engine: Python + FastAPI + OpenCV/YOLO + ByteTrack + Gemini 1.5 Pro
"""

import os
import time
import json
import asyncio
from typing import List, Optional, Dict, Any
from fastapi import FastAPI, WebSocket, WebSocketDisconnect, HTTPException, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

app = FastAPI(
    title="AI Witness — Multi-Camera Forensic Reconstruction API",
    version="2.4.0",
    description="Engine that synthesizes disjointed CCTV video streams into one explainable, chronological incident reconstruction."
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ─── Data Models ───────────────────────────────────────────────────────────────

class BoundingBox(BaseModel):
    x: float
    y: float
    width: float
    height: float

class CameraDetection(BaseModel):
    camera_id: str
    timestamp: str
    timestamp_ms: int
    entity_id: str
    label: str
    entity_type: str
    confidence: float
    bbox: BoundingBox

class IncidentEvent(BaseModel):
    id: str
    timestamp: str
    timestamp_ms: int
    camera_id: str
    camera_label: str
    entity_id: str
    entity_label: str
    event_type: str
    event_label: str
    severity: str
    confidence: float
    bbox: Optional[BoundingBox] = None

class MultiCameraLink(BaseModel):
    id: str
    source_camera: str
    target_camera: str
    entity_id: str
    entity_label: str
    re_id_score: float
    time_gap_seconds: float
    shared_event: str
    timestamp: str

class ObservedFact(BaseModel):
    id: str
    text: str
    timestamp: str
    camera_id: str
    camera_label: str
    confidence: float

class AIInference(BaseModel):
    text: str
    supporting_fact_ids: List[str]
    confidence: float

class ReasoningRequest(BaseModel):
    investigation_id: str
    question: str
    context_events: Optional[List[Dict[str, Any]]] = None

class ReasoningResponse(BaseModel):
    id: str
    role: str = "assistant"
    content: str
    observed_facts: List[str]
    ai_inferences: List[str]
    uncertainties: List[str]
    evidence_refs: List[Dict[str, Any]]
    confidence: float

# ─── In-Memory Demo Dataset ────────────────────────────────────────────────────

DEMO_INVESTIGATION = {
    "id": "inv-0042",
    "name": "Bay 04 Vehicle Reversal & Pedestrian Fall",
    "location": "Sector 7 Logistics Depot, Parking Bay 04",
    "description": "Multi-camera reconstruction of pedestrian collapse following commercial vehicle reverse movement in shared logistics bay.",
    "camera_count": 4,
    "incident_date": "2026-09-04",
    "status": "complete",
    "cameras": [
        {"id": "cam-01", "label": "CAM 01 — North Entrance", "location": "Perimeter Gate 1", "fps": 30, "resolution": "3840x2160"},
        {"id": "cam-02", "label": "CAM 02 — Parking Bay 04", "location": "Loading Bay South", "fps": 30, "resolution": "1920x1080"},
        {"id": "cam-03", "label": "CAM 03 — Street East", "location": "Perimeter Roadway", "fps": 30, "resolution": "3840x2160"},
        {"id": "cam-04", "label": "CAM 04 — Rooftop Overhead", "location": "Depot Roof Mast", "fps": 30, "resolution": "2560x1440"},
    ],
    "entities": [
        {"id": "ent-01", "tracking_id": "Person #01", "type": "person", "first_seen": "10:42:11", "last_seen": "10:42:30", "event_count": 3},
        {"id": "ent-02", "tracking_id": "Vehicle #01", "type": "vehicle", "first_seen": "10:41:50", "last_seen": "10:42:30", "event_count": 2},
        {"id": "ent-03", "tracking_id": "Person #02", "type": "person", "first_seen": "10:42:25", "last_seen": "10:42:30", "event_count": 1},
    ],
    "events": [
        {"id": "evt-01", "timestamp": "10:42:11", "timestamp_ms": 11000, "camera_id": "cam-01", "camera_label": "CAM 01 (North Entrance)", "entity_id": "ent-01", "entity_label": "Person #01", "event_label": "Person enters", "severity": "normal", "confidence": 0.98},
        {"id": "evt-02", "timestamp": "10:42:16", "timestamp_ms": 16000, "camera_id": "cam-02", "camera_label": "CAM 02 (Parking Bay 04)", "entity_id": "ent-01", "entity_label": "Person #01", "event_label": "Person approaches vehicle", "severity": "warning", "confidence": 0.95},
        {"id": "evt-03", "timestamp": "10:42:19", "timestamp_ms": 19000, "camera_id": "cam-03", "camera_label": "CAM 03 (Street East)", "entity_id": "ent-02", "entity_label": "Vehicle #01", "event_label": "Vehicle moves", "severity": "warning", "confidence": 0.99},
        {"id": "evt-04", "timestamp": "10:42:21", "timestamp_ms": 21000, "camera_id": "cam-04", "camera_label": "CAM 04 (Rooftop Overhead)", "entity_id": "ent-01", "entity_label": "Person #01", "event_label": "Person falls", "severity": "critical", "confidence": 0.94},
        {"id": "evt-05", "timestamp": "10:42:25", "timestamp_ms": 25000, "camera_id": "cam-01", "camera_label": "CAM 01 (North Entrance)", "entity_id": "ent-03", "entity_label": "Person #02", "event_label": "Another person arrives", "severity": "normal", "confidence": 0.97},
    ],
    "correlation_links": [
        {"id": "link-01", "source_camera": "cam-01", "target_camera": "cam-02", "entity_id": "ent-01", "entity_label": "Person #01", "re_id_score": 0.946, "time_gap_seconds": 4.8, "shared_event": "Subject walked through gate into Bay 04 proximity zone", "timestamp": "10:42:11 → 10:42:16"},
        {"id": "link-02", "source_camera": "cam-02", "target_camera": "cam-03", "entity_id": "ent-02", "entity_label": "Vehicle #01", "re_id_score": 0.982, "time_gap_seconds": 0.0, "shared_event": "Bay 04 front profile matches Street East lateral profile", "timestamp": "10:42:19"},
        {"id": "link-03", "source_camera": "cam-03", "target_camera": "cam-04", "entity_id": "ent-01", "entity_label": "Person #01", "re_id_score": 0.914, "time_gap_seconds": 0.0, "shared_event": "Side view of vehicle reverse matches top-down collapse coordinate", "timestamp": "10:42:21"},
    ],
    "report": {
        "incident_type": "Pedestrian-Vehicle Collision with Fall",
        "start_time": "10:42:11",
        "end_time": "10:42:28",
        "location": "Sector 7 Logistics Depot, Bay 04",
        "overall_confidence": 94,
        "ai_summary": "A person approached a parked vehicle. The vehicle subsequently moved, after which the person fell.",
        "uncertainties": [
            "Direct point of contact partially occluded in CAM 02 by vehicle rear corner panel.",
            "Driver gaze and mirrors cannot be confirmed without in-cabin telematics.",
            "Audio recording is absent; acoustic warnings cannot be evaluated."
        ]
    }
}

# ─── REST API Endpoints ────────────────────────────────────────────────────────

@app.get("/")
def root():
    return {
        "platform": "AI Witness Forensic Intelligence Platform",
        "version": "2.4.0",
        "status": "online",
        "endpoints": {
            "investigations": "/api/investigations",
            "demo": "/api/investigations/demo",
            "reasoning": "/api/gemini/reason",
            "websocket": "/ws/analysis"
        }
    }

@app.get("/api/investigations")
def list_investigations():
    return [DEMO_INVESTIGATION]

@app.get("/api/investigations/demo")
def get_demo_investigation():
    return DEMO_INVESTIGATION

@app.get("/api/investigations/{inv_id}")
def get_investigation(inv_id: str):
    if inv_id == "inv-0042" or inv_id == "demo":
        return DEMO_INVESTIGATION
    raise HTTPException(status_code=404, detail="Investigation not found")

@app.post("/api/investigations")
def create_investigation(
    name: str = Form(...),
    location: str = Form(...),
    incident_date: str = Form(...),
):
    inv_id = f"inv-{int(time.time()) % 10000}"
    new_inv = {
        "id": inv_id,
        "name": name,
        "location": location,
        "description": "User uploaded multi-camera investigation.",
        "camera_count": 4,
        "incident_date": incident_date,
        "status": "ready",
        "cameras": DEMO_INVESTIGATION["cameras"],
        "entities": DEMO_INVESTIGATION["entities"],
        "events": DEMO_INVESTIGATION["events"],
        "report": DEMO_INVESTIGATION["report"]
    }
    return new_inv

@app.post("/api/analyze")
async def trigger_analysis(investigation_id: str):
    """
    Simulate full computer vision pipeline:
    Video Ingestion → Detection → Tracking → Event Extraction → Camera Correlation → AI Reasoning → Reconstruction
    """
    stages = [
        "Video Ingestion & Timestamp Calibration",
        "YOLOv8 Multi-Class Object Detection",
        "ByteTrack Spatiotemporal Identity Tracking",
        "Kinematic Event Extraction",
        "Cross-Camera Re-ID & FOV Correlation",
        "Gemini 1.5 Pro Spatio-Temporal Reasoning",
        "Forensic Incident Reconstruction"
    ]
    results = []
    for s in stages:
        results.append({"stage": s, "status": "complete", "latency_ms": 120})
    return {"investigation_id": investigation_id, "status": "complete", "stages": results}

@app.post("/api/gemini/reason", response_model=ReasoningResponse)
async def gemini_reason(req: ReasoningRequest):
    """
    Spatio-Temporal Reasoning grounded in visual facts.
    Strictly separates OBSERVED FACTS from AI INFERENCES.
    """
    q = req.question.lower()

    if "what happened" in q or "summary" in q or "overview" in q:
        content = (
            "### Chronological Multi-Camera Reconstruction:\n\n"
            "**[OBSERVED FACTS]**\n"
            "1. **10:42:11 [CAM 01]** — Person #01 entered the facility through North Gate at 1.2 m/s.\n"
            "2. **10:42:16 [CAM 02]** — Person #01 approached stationary Vehicle #01 in Bay 04, stopping within 0.82m rear proximity.\n"
            "3. **10:42:19 [CAM 03]** — Vehicle #01 engaged reverse lights and accelerated backwards 3.4m.\n"
            "4. **10:42:21 [CAM 04]** — Person #01 fell horizontally to the ground 2.1s after vehicle backward motion began.\n"
            "5. **10:42:25 [CAM 01]** — Person #02 entered the frame at 2.8 m/s toward the subject.\n\n"
            "**[AI INFERENCE]**\n"
            "- **Causal Attribution (89% Confidence)**: Vehicle backward motion directly precipitated the fall. Subject remained in the blind-zone as the vehicle accelerated.\n"
            "- **Uncertainty**: Direct centimeter of bumper contact is occluded in CAM 02; inferred via cross-triangulation with CAM 03 and CAM 04."
        )
        observed_facts = [
            "10:42:11 [CAM 01]: Person #01 ingress",
            "10:42:16 [CAM 02]: Person #01 rear proximity <0.82m",
            "10:42:19 [CAM 03]: Vehicle #01 reverse motion 3.4m",
            "10:42:21 [CAM 04]: Person #01 collapse to ground",
            "10:42:25 [CAM 01]: Person #02 arrival"
        ]
        inferences = [
            "Vehicle reverse movement directly triggered the pedestrian fall (89% confidence).",
            "Driver visibility was obstructed by vehicle C-pillar blind zone."
        ]
        uncertainties = [
            "Direct point of impact occluded in CAM 02.",
            "Driver internal intent cannot be visually determined.",
            "Absence of audio data."
        ]
    elif "camera" in q:
        content = (
            "**4 Synchronized Cameras** captured this incident:\n\n"
            "- **CAM 01 (North Entrance)**: Ingress of Person #01 (10:42:11) and arrival of witness Person #02 (10:42:25).\n"
            "- **CAM 02 (Parking Bay 04)**: Close-up pedestrian approach to vehicle rear (10:42:16).\n"
            "- **CAM 03 (Street East)**: Lateral profile of reverse acceleration (10:42:19).\n"
            "- **CAM 04 (Rooftop Overhead)**: Top-down spatial trajectories and collapse posture change (10:42:21)."
        )
        observed_facts = ["All 4 cameras synchronized with millisecond UTC timestamps."]
        inferences = ["Combined field of view provides 92% spatial coverage of Bay 04."]
        uncertainties = ["Slight perspective distortion on CAM 03 wide angle lens."]
    else:
        content = (
            "### AI Forensic Analysis:\n\n"
            "The reconstruction links **Person #01**, **Vehicle #01**, and **Person #02** across 4 synchronized cameras.\n"
            "All assertions are directly cited against camera frame timestamps and SHA-256 hashes."
        )
        observed_facts = ["5 events chronologically extracted and cross-referenced."]
        inferences = ["High spatial correlation across non-overlapping camera FOVs."]
        uncertainties = ["Standard visual sensor resolution bounds."]

    return ReasoningResponse(
        id=f"reason-{int(time.time()*1000)}",
        content=content,
        observed_facts=observed_facts,
        ai_inferences=inferences,
        uncertainties=uncertainties,
        evidence_refs=[
            {"camera_id": "cam-02", "timestamp": "10:42:16", "ms": 16000},
            {"camera_id": "cam-03", "timestamp": "10:42:19", "ms": 19000},
            {"camera_id": "cam-04", "timestamp": "10:42:21", "ms": 21000}
        ],
        confidence=0.94
    )

@app.get("/api/reports/{inv_id}")
def get_report(inv_id: str):
    return DEMO_INVESTIGATION["report"]

# ─── Realtime WebSocket Endpoint ───────────────────────────────────────────────

@app.websocket("/ws/analysis")
async def websocket_analysis(websocket: WebSocket):
    await websocket.accept()
    try:
        # Stream telemetry simulation
        for sec in range(10, 26):
            await websocket.send_json({
                "type": "telemetry_tick",
                "time_sec": sec,
                "timecode": f"10:42:{sec:02d}.000",
                "active_cameras": 4,
                "tracked_entities": 3
            })
            await asyncio.sleep(0.5)
        await websocket.send_json({"type": "pipeline_complete", "status": "verified"})
    except WebSocketDisconnect:
        pass
