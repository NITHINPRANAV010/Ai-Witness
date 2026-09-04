# AI Witness — Multi-Camera AI Incident Reconstruction

> Transform raw multi-camera surveillance footage into chronological, explainable incident reconstructions.

---

## Architecture

```
VIDEO INPUT → OpenCV → YOLO → ByteTrack → Event Extraction → Gemini → Dashboard
```

### Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 16 + React 19 + TypeScript + Tailwind v4 + Framer Motion |
| Backend | Python 3.11 + FastAPI + WebSockets |
| Computer Vision | YOLOv8 (ultralytics) + OpenCV + ByteTrack (supervision) |
| AI Reasoning | Google Gemini API |
| Database | SQLite (hackathon) / PostgreSQL (production) |
| Storage | Local filesystem (S3-ready interface) |

---

## Quick Start — Frontend (Hackathon Demo)

The frontend runs with mock data — no backend required.

```bash
cd frontend
npm install
npm run dev
```

Open: http://localhost:3000

- **Landing page**: http://localhost:3000
- **Investigation dashboard**: http://localhost:3000/investigate

---

## Quick Start — Backend

### 1. Prerequisites

```bash
# Python 3.11+ required
pip install uv  # fast Python package manager
```

### 2. Install dependencies

```bash
cd backend
uv venv
uv pip install -r requirements.txt
```

### 3. Configure environment

```bash
cp .env.example .env
# Edit .env and add:
# GEMINI_API_KEY=your_key_here
```

### 4. Run the server

```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

API docs: http://localhost:8000/docs

---

## Backend API

### Investigations

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/investigations` | Create new investigation |
| GET | `/api/investigations` | List all investigations |
| GET | `/api/investigations/{id}` | Get investigation with events |

### Videos

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/videos/upload` | Upload video file |
| POST | `/api/videos/{id}/process` | Start CV pipeline |
| GET | `/api/videos/{id}/stream` | Stream video |

### Reports

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/investigations/{id}/report` | Generate Gemini report |
| GET | `/api/investigations/{id}/report` | Get cached report |

### WebSocket

```
WS  /ws/{investigation_id}
```

Messages: `pipeline_progress`, `new_event`, `ai_update`, `complete`

---

## CV Pipeline

```python
# 1. OpenCV — extract frames at 5fps
# 2. YOLO — detect persons, vehicles, bikes per frame
# 3. ByteTrack — assign persistent IDs across frames
# 4. Event Extractor — convert detections to semantic events
#    - person_entered: entity appears for first time
#    - vehicle_movement: centroid displacement > threshold
#    - fall_detected: bounding box aspect ratio change
#    - person_approached_vehicle: proximity threshold crossed
# 5. Gemini — reason over event sequence → structured report
```

---

## Gemini Integration

Events are structured as JSON before being sent to Gemini:

```json
{
  "events": [
    {
      "timestamp": "10:42:21",
      "camera": "CAM 03",
      "entity": "Person #01",
      "event": "fall_detected",
      "confidence": 0.91
    }
  ],
  "instruction": "Analyze this event sequence. Separate OBSERVED facts from INFERRED conclusions..."
}
```

Gemini never receives raw video frames — only structured events.

---

## Design System

| Token | Value | Usage |
|---|---|---|
| `--color-void` | `#0B0D0F` | Page background |
| `--color-surface` | `#121518` | Panel surfaces |
| `--color-raised` | `#171B1F` | Nested panels |
| `--color-amber` | `#F59E0B` | Events / highlights |
| `--color-critical` | `#EF4444` | Incidents only |
| `--color-confirmed` | `#10B981` | Normal / confirmed |
| Font | IBM Plex Sans / IBM Plex Mono | All typography |

---

## Demo Scenario

**Investigation #0042 — Parking Lot Incident**

```
10:42:11 — Person #01 enters area (CAM 01)
10:42:16 — Person #01 approaches Vehicle #01 (CAM 02)
10:42:19 — Vehicle #01 moves unexpectedly (CAM 02)
10:42:21 — Person #01 falls (CAM 03) ← CRITICAL
10:42:25 — Person #02 arrives (CAM 03)

AI Reconstruction:
  Person #01 approached Vehicle #01.
  The vehicle moved at 10:42:19.
  Person #01 fell 2.1 seconds later.
  
Confidence: 91%
```

---

## Future Extensions

- [ ] Live CCTV stream support
- [ ] Audio analysis
- [ ] Fire / smoke detection
- [ ] Crowd behavior analysis
- [ ] Natural-language video search
- [ ] PDF report export
- [ ] Cloud storage (S3)
- [ ] Multi-tenant support
- [ ] Edge AI processing
- [ ] Real-time alerts via webhook

---

## Project Structure

```
c:\AI WITNESS\
├── frontend/                  # Next.js application
│   ├── app/
│   │   ├── page.tsx           # Landing page
│   │   └── investigate/       # Investigation dashboard
│   ├── components/
│   │   ├── landing/           # All landing sections
│   │   └── dashboard/         # Workstation components
│   └── lib/
│       ├── types.ts           # TypeScript types
│       └── mockData.ts        # Demo data + mock API
│
└── backend/                   # FastAPI backend
    ├── main.py                # App entry point
    ├── api/                   # Route handlers
    ├── vision/                # YOLO + ByteTrack
    ├── events/                # Event extraction
    ├── ai/                    # Gemini integration
    ├── db/                    # Database models
    └── storage/               # File storage
```
