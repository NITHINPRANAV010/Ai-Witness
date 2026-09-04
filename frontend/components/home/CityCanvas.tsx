"use client";

import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";

interface CityCanvasProps {
  stage: number;
  selectedCamera: number;
}

const INCIDENT_LOOP = 16; // seconds for one full incident cycle

function lerp(a: number, b: number, t: number) { return a + (b - a) * Math.max(0, Math.min(1, t)); }
function clamp(v: number, lo: number, hi: number) { return Math.max(lo, Math.min(hi, v)); }
function easeInOut(t: number) { return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t; }
function easeOut(t: number) { return 1 - Math.pow(1 - clamp(t, 0, 1), 3); }

export default function CityCanvas({ stage, selectedCamera }: CityCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef    = useRef<HTMLCanvasElement>(null);
  const [webglError, setWebglError] = useState(false);

  const rendererRef  = useRef<THREE.WebGLRenderer | null>(null);
  const animFrameRef = useRef<number | null>(null);

  const personRef   = useRef<THREE.Group | null>(null);
  const vehicleRef  = useRef<THREE.Group | null>(null);
  const witnessRef  = useRef<THREE.Group | null>(null);
  const alertRingRef = useRef<THREE.Mesh | null>(null);
  const warnLightRef = useRef<THREE.PointLight | null>(null);
  const trafficRef  = useRef<THREE.Group[]>([]);
  const ledsRef     = useRef<THREE.Mesh[]>([]);
  const frustumsRef = useRef<THREE.Group[]>([]);

  // New: lighting enhancement refs
  const neonSignsRef    = useRef<{ mesh: THREE.Mesh; light: THREE.PointLight; color: string }[]>([]);
  const buildingLightsRef = useRef<THREE.PointLight[]>([]);
  const emergencyVehRef = useRef<THREE.Group | null>(null);
  const emergencyLightRedRef  = useRef<THREE.PointLight | null>(null);
  const emergencyLightBlueRef = useRef<THREE.PointLight | null>(null);
  const heliGroupRef    = useRef<THREE.Group | null>(null);
  const heliSpotRef     = useRef<THREE.SpotLight | null>(null);
  const puddlesRef      = useRef<THREE.Mesh[]>([]);

  const incidentT    = useRef(0);
  const prevTimeRef  = useRef(performance.now());

  const camPosRef    = useRef(new THREE.Vector3(0, 68, 105));
  const camTargetRef = useRef(new THREE.Vector3(0, 68, 105));
  const lookPosRef   = useRef(new THREE.Vector3(5, 0, 15));
  const lookTargetRef = useRef(new THREE.Vector3(5, 0, 15));

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    let W = container.clientWidth  || window.innerWidth;
    let H = container.clientHeight || window.innerHeight;

    // ─── SCENE ────────────────────────────────────────────────────────────────
    const scene = new THREE.Scene();
    scene.background = new THREE.Color("#03060E");
    scene.fog = new THREE.Fog("#03060E", 160, 420);

    // ─── RENDERER ─────────────────────────────────────────────────────────────
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: "high-performance" });
    } catch { setWebglError(true); return; }
    renderer.setSize(W, H);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.6;
    renderer.shadowMap.enabled  = true;
    renderer.shadowMap.type     = THREE.PCFShadowMap;
    rendererRef.current = renderer;

    // ─── CAMERA ───────────────────────────────────────────────────────────────
    const camera = new THREE.PerspectiveCamera(52, W / H, 0.5, 800);
    camera.position.copy(camPosRef.current);
    camera.lookAt(lookPosRef.current);

    // ─── STARS ────────────────────────────────────────────────────────────────
    const starGeo = new THREE.BufferGeometry();
    const starCount = 1400;
    const starPositions = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount; i++) {
      starPositions[i * 3 + 0] = (Math.random() - 0.5) * 900;
      starPositions[i * 3 + 1] = Math.random() * 350 + 80;
      starPositions[i * 3 + 2] = (Math.random() - 0.5) * 900;
    }
    starGeo.setAttribute("position", new THREE.BufferAttribute(starPositions, 3));
    scene.add(new THREE.Points(starGeo, new THREE.PointsMaterial({ color: "#C0D8FF", size: 0.55, sizeAttenuation: true, transparent: true, opacity: 0.85 })));

    // ─── LIGHTING ─────────────────────────────────────────────────────────────
    scene.add(new THREE.AmbientLight("#0D1926", 3.5));

    const moonLight = new THREE.DirectionalLight("#4DB8FF", 2.8);
    moonLight.position.set(80, 150, 60);
    moonLight.castShadow = true;
    moonLight.shadow.mapSize.set(2048, 2048);
    moonLight.shadow.camera.far = 500;
    moonLight.shadow.camera.left = -200;
    moonLight.shadow.camera.right = 200;
    moonLight.shadow.camera.top = 200;
    moonLight.shadow.camera.bottom = -200;
    scene.add(moonLight);

    const rimA = new THREE.DirectionalLight("#06B6D4", 1.5);
    rimA.position.set(-80, 60, -60);
    scene.add(rimA);

    const rimB = new THREE.DirectionalLight("#1E3A5F", 1.2);
    rimB.position.set(60, 40, 80);
    scene.add(rimB);

    // Warm city ground glow
    const groundGlow = new THREE.HemisphereLight("#F59E0B", "#060C18", 0.6);
    scene.add(groundGlow);

    // Red warning light (incident impact)
    const warnLight = new THREE.PointLight("#FF2222", 0, 40, 1.8);
    warnLight.position.set(5, 5, 19);
    scene.add(warnLight);
    warnLightRef.current = warnLight;

    // Blue investigation spotlights on incident zone
    const blueSpot = new THREE.SpotLight("#0088FF", 0, 60, Math.PI / 8, 0.5, 1.5);
    blueSpot.position.set(-10, 32, 5);
    blueSpot.target.position.set(5, 0, 20);
    scene.add(blueSpot);
    scene.add(blueSpot.target);

    // ─── GROUND — WET ASPHALT ─────────────────────────────────────────────────
    const groundMat = new THREE.MeshStandardMaterial({
      color: "#090E18",
      roughness: 0.12,
      metalness: 0.85,
      envMapIntensity: 1.2,
    });
    const ground = new THREE.Mesh(new THREE.PlaneGeometry(600, 600), groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    scene.add(ground);

    // Grid overlay (tech look)
    const grid = new THREE.GridHelper(500, 80, "#0E2439", "#091522");
    grid.position.y = 0.02;
    grid.material = new THREE.LineBasicMaterial({ color: "#0D1E30", transparent: true, opacity: 0.6 });
    scene.add(grid);

    // ─── ROAD NETWORK ─────────────────────────────────────────────────────────
    const roadMat = new THREE.MeshStandardMaterial({ color: "#0C1421", roughness: 0.25, metalness: 0.5 });
    
    function addRoad(x: number, z: number, w: number, d: number, y = 0.03) {
      const r = new THREE.Mesh(new THREE.PlaneGeometry(w, d), roadMat);
      r.rotation.x = -Math.PI / 2;
      r.position.set(x, y, z);
      r.receiveShadow = true;
      scene.add(r);
    }

    // Main roads
    addRoad(0, 0, 500, 22);       // E-W main boulevard
    addRoad(-28, 0, 22, 500);     // N-S cross street 1
    addRoad(60, 0, 22, 500);      // N-S cross street 2
    addRoad(-90, 0, 22, 500);     // N-S cross street 3

    // Sidewalks
    const sidewalkMat = new THREE.MeshStandardMaterial({ color: "#111827", roughness: 0.7 });
    function addSidewalk(x: number, z: number, w: number, d: number) {
      const s = new THREE.Mesh(new THREE.BoxGeometry(w, 0.25, d), sidewalkMat);
      s.position.set(x, 0.12, z);
      s.receiveShadow = true;
      scene.add(s);
    }
    addSidewalk(0, -12, 500, 3);
    addSidewalk(0,  12, 500, 3);

    // Road center dashes
    const dashMat = new THREE.MeshBasicMaterial({ color: "#FBBF24" });
    for (let x = -230; x < 230; x += 12) {
      const d = new THREE.Mesh(new THREE.PlaneGeometry(6, 0.45), dashMat);
      d.rotation.x = -Math.PI / 2;
      d.position.set(x, 0.05, 0);
      scene.add(d);
    }
    // Curb lines
    const curbMat = new THREE.MeshStandardMaterial({ color: "#1E293B" });
    [-10.5, 10.5].forEach((z) => {
      const c = new THREE.Mesh(new THREE.BoxGeometry(500, 0.3, 1.5), curbMat);
      c.position.set(0, 0.15, z);
      scene.add(c);
    });

    // ─── PARKING LOT (INCIDENT ZONE) ─────────────────────────────────────────
    const parkMat = new THREE.MeshStandardMaterial({ color: "#0D1825", roughness: 0.3, metalness: 0.6 });
    const parkLot = new THREE.Mesh(new THREE.PlaneGeometry(55, 35), parkMat);
    parkLot.rotation.x = -Math.PI / 2;
    parkLot.position.set(13, 0.04, 21);
    parkLot.receiveShadow = true;
    scene.add(parkLot);

    // Parking bay lines (cyan glow)
    const pLineMat = new THREE.MeshBasicMaterial({ color: "#00C8FF" });
    for (let i = -4; i <= 4; i++) {
      const pl = new THREE.Mesh(new THREE.PlaneGeometry(0.25, 10), pLineMat);
      pl.rotation.x = -Math.PI / 2;
      pl.position.set(i * 5 + 13, 0.06, 21);
      scene.add(pl);
    }
    // Bay back line
    const bayBack = new THREE.Mesh(new THREE.PlaneGeometry(55, 0.25), pLineMat);
    bayBack.rotation.x = -Math.PI / 2;
    bayBack.position.set(13, 0.06, 26);
    scene.add(bayBack);

    // Zebra crossing
    const cwMat = new THREE.MeshStandardMaterial({ color: "#C8D8E8", roughness: 0.5 });
    for (let z = -9; z <= 9; z += 2.2) {
      const stripe = new THREE.Mesh(new THREE.PlaneGeometry(1.6, 1.0), cwMat);
      stripe.rotation.x = -Math.PI / 2;
      stripe.position.set(-17, 0.05, z);
      scene.add(stripe);
    }

    // ─── BUILDING TEXTURE (with emissive glow map) ────────────────────────────
    function buildingTex(density: number, warmBias = 0.2): { map: THREE.CanvasTexture; emissiveMap: THREE.CanvasTexture } {
      const tc = document.createElement("canvas");
      tc.width = 256; tc.height = 512;
      const ctx = tc.getContext("2d")!;

      // Diffuse map
      const grad = ctx.createLinearGradient(0, 0, 0, 512);
      grad.addColorStop(0, "#0E1928"); grad.addColorStop(1, "#060C16");
      ctx.fillStyle = grad; ctx.fillRect(0, 0, 256, 512);

      const rows = 32, cols = 10;
      const cw = 256 / cols, ch = 512 / rows;
      const litWindows: number[][] = [];

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const rnd = Math.random();
          if (rnd < density) {
            let R = 226, G = 232, B = 240;
            if (rnd < warmBias * density) { R = 245; G = 158; B = 50; }
            else if (rnd < 0.35)         { R = 0;   G = 220; B = 255; }
            else if (rnd < 0.55)         { R = 56;  G = 180; B = 248; }
            const alpha = 0.65 + Math.random() * 0.35;
            ctx.fillStyle = `rgba(${R},${G},${B},${alpha})`;
            const px = c * cw + 4, py = r * ch + 4, pw = cw - 8, ph = ch - 6;
            ctx.fillRect(px, py, pw, ph);
            // Soft outer glow
            ctx.globalAlpha = 0.12;
            ctx.fillStyle = `rgba(${R},${G},${B},1)`;
            ctx.fillRect(px - 3, py - 3, pw + 6, ph + 6);
            ctx.globalAlpha = 1;
            litWindows.push([c * cw + 4, r * ch + 4, cw - 8, ch - 6, R, G, B]);
          } else {
            ctx.fillStyle = `rgba(8,14,24,${0.9 + Math.random() * 0.1})`;
            ctx.fillRect(c * cw + 4, r * ch + 4, cw - 8, ch - 6);
          }
        }
      }
      const map = new THREE.CanvasTexture(tc);
      map.wrapS = map.wrapT = THREE.RepeatWrapping;

      // Emissive map — only lit windows glow
      const ec = document.createElement("canvas");
      ec.width = 256; ec.height = 512;
      const ectx = ec.getContext("2d")!;
      ectx.fillStyle = "#000000"; ectx.fillRect(0, 0, 256, 512);
      litWindows.forEach(([px, py, pw, ph, R, G, B]) => {
        ectx.fillStyle = `rgb(${Math.min(R, 180)},${Math.min(G, 180)},${Math.min(B, 180)})`;
        ectx.fillRect(px, py, pw, ph);
      });
      const emissiveMap = new THREE.CanvasTexture(ec);
      emissiveMap.wrapS = emissiveMap.wrapT = THREE.RepeatWrapping;

      return { map, emissiveMap };
    }

    // Pre-generate a few texture variants for variety
    const texA    = buildingTex(0.52, 0.15);
    const texB    = buildingTex(0.45, 0.25);
    const texC    = buildingTex(0.60, 0.10);
    const texDark = buildingTex(0.28, 0.30);

    // ─── BUILDINGS ────────────────────────────────────────────────────────────
    const edgeMat = new THREE.LineBasicMaterial({ color: "#1E6EA6", transparent: true, opacity: 0.4 });
    const edgeMatWarm = new THREE.LineBasicMaterial({ color: "#7C4F1A", transparent: true, opacity: 0.35 });

    function addBuilding(
      x: number, z: number, w: number, h: number, d: number,
      tex?: { map: THREE.CanvasTexture; emissiveMap: THREE.CanvasTexture },
      edgeColor = edgeMat
    ) {
      const t = tex ?? texA;
      const geo = new THREE.BoxGeometry(w, h, d);
      const mat = new THREE.MeshStandardMaterial({
        color: "#111E2E",
        map: t.map,
        emissiveMap: t.emissiveMap,
        emissive: new THREE.Color("#0A4060"),
        emissiveIntensity: 0.55,
        roughness: 0.28,
        metalness: 0.62,
      });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.set(x, h / 2, z);
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      scene.add(mesh);

      // Wireframe edges
      const edges = new THREE.LineSegments(new THREE.EdgesGeometry(geo), edgeColor);
      edges.position.copy(mesh.position);
      scene.add(edges);

      // Rooftop beacon on taller buildings
      if (h > 55) {
        const beaconMat = new THREE.MeshBasicMaterial({ color: "#FF3333" });
        const beacon = new THREE.Mesh(new THREE.SphereGeometry(0.7, 8, 8), beaconMat);
        beacon.position.set(x, h + 0.7, z);
        scene.add(beacon);
      }

      // Antenna on very tall buildings
      if (h > 90) {
        const antennaMat = new THREE.MeshStandardMaterial({ color: "#4A5568", metalness: 0.9 });
        const antenna = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.25, 18, 6), antennaMat);
        antenna.position.set(x, h + 9, z);
        scene.add(antenna);
        // Antenna tip beacon
        const tipMat = new THREE.MeshBasicMaterial({ color: "#FF5555" });
        const tip = new THREE.Mesh(new THREE.SphereGeometry(0.5, 8, 8), tipMat);
        tip.position.set(x, h + 18.5, z);
        scene.add(tip);
      }

      // Rooftop details: water tank
      if (h > 40 && Math.random() > 0.5) {
        const tankMat = new THREE.MeshStandardMaterial({ color: "#2D3748", metalness: 0.8, roughness: 0.3 });
        const tank = new THREE.Mesh(new THREE.CylinderGeometry(1.8, 1.8, 4, 12), tankMat);
        tank.position.set(x + (Math.random() - 0.5) * w * 0.4, h + 2, z + (Math.random() - 0.5) * d * 0.4);
        scene.add(tank);
      }

      // Rooftop colored accent light (faint, upward glow)
      if (h > 50) {
        const accentColors = ["#003060", "#300840", "#083020", "#302800"];
        const accentColor  = accentColors[Math.floor(Math.random() * accentColors.length)];
        const accentLight  = new THREE.PointLight(accentColor, 1.2, h * 1.8, 2);
        accentLight.position.set(x, h + 1, z);
        scene.add(accentLight);
        buildingLightsRef.current.push(accentLight);
      }
      return mesh;
    }

    // ── DENSE NORTH SKYLINE (behind the incident) ──────────────────────────
    addBuilding(-110, -80, 38, 135, 34, texA);
    addBuilding(-68,  -70, 30, 105, 28, texB);
    addBuilding(-38,  -65, 26,  88, 26, texC);
    addBuilding( -8,  -72, 40, 120, 36, texA);
    addBuilding( 36,  -68, 32,  98, 30, texB);
    addBuilding( 72,  -75, 35, 115, 32, texC);
    addBuilding(108,  -78, 38, 132, 34, texA);
    addBuilding(148,  -72, 30,  92, 28, texDark);
    addBuilding(-150, -82, 42, 145, 40, texB);

    // ── SECOND ROW NORTH ──────────────────────────────────────────────────
    addBuilding(-130, -145, 44, 175, 40, texC);
    addBuilding(-80,  -135, 36, 148, 32, texA);
    addBuilding(-42,  -128, 34, 128, 32, texB);
    addBuilding(  0,  -138, 48, 165, 44, texC);
    addBuilding( 52,  -132, 38, 155, 36, texA);
    addBuilding( 98,  -140, 42, 172, 38, texB);
    addBuilding(145,  -138, 40, 158, 38, texDark);
    addBuilding(185,  -135, 38, 142, 36, texC);
    addBuilding(-185, -140, 46, 168, 44, texA);

    // ── EAST CLUSTER ──────────────────────────────────────────────────────
    addBuilding( 95, -10, 28,  72, 26, texB);
    addBuilding(110,  30, 32,  88, 30, texC);
    addBuilding( 88,  62, 26,  58, 24, texA);
    addBuilding(120,  55, 35, 100, 32, texB, edgeMatWarm);
    addBuilding(105,  90, 30,  82, 28, texDark);
    addBuilding(145,  20, 38, 115, 36, texA);
    addBuilding(160,  65, 40, 125, 38, texC);

    // ── WEST CLUSTER ──────────────────────────────────────────────────────
    addBuilding(-108, -8,  30,  78, 28, texC);
    addBuilding(-120, 35,  34,  94, 32, texA);
    addBuilding(-95,  70,  28,  62, 26, texB, edgeMatWarm);
    addBuilding(-130, 60,  38, 108, 36, texDark);
    addBuilding(-155, 25,  40, 122, 38, texC);
    addBuilding(-145, 80,  36,  98, 34, texA);

    // ── SOUTH FLANKS (framing the camera view without blocking the central vista) ──
    addBuilding(-85,  95, 36, 85, 32, texB);
    addBuilding(-120, 100, 40, 95, 36, texA);
    addBuilding( 85,  95, 36, 85, 32, texDark);
    addBuilding( 120, 100, 40, 95, 36, texB);
    // Far south background (behind camera z > 150)
    addBuilding(-50, 175, 42, 110, 36, texC);
    addBuilding(  0, 180, 46, 125, 40, texA);
    addBuilding( 50, 175, 42, 110, 36, texB);

    // ── PERIMETER BLOCKS (surrounding the scene cleanly) ───────────────────
    addBuilding(-70, -30, 24, 52, 22, texB);
    addBuilding(-52, -40, 22, 62, 22, texC);
    addBuilding( 85, -30, 26, 55, 24, texA);
    addBuilding( 75,  12, 24, 44, 22, texDark);
    // Flanking the parking lot East & West (well clear of the central lot)
    addBuilding( 52,  24, 24, 34, 26, texA); // east of parking lot
    addBuilding(-42,  24, 24, 34, 26, texC); // west of parking lot
    // South perimeter plaza building - set back to z=66 and kept low
    addBuilding( -5,  66, 42, 18, 18, texDark); // low facility structure

    // ─── STREET LAMPS ─────────────────────────────────────────────────────────
    const poleMat  = new THREE.MeshStandardMaterial({ color: "#374151", metalness: 0.85, roughness: 0.3 });
    const bulbMat  = new THREE.MeshBasicMaterial({ color: "#FFF0A0" });
    const coneMat2 = new THREE.MeshBasicMaterial({ color: "#FFE080", transparent: true, opacity: 0.05, side: THREE.DoubleSide });

    const lampSpots: [number, number, number][] = [
      [-20, 9, -12], [5, 9, -12], [30, 9, -12],
      [-20, 9,  12], [5, 9,  12], [30, 9,  12],
      [-28, 9, -28], [-28, 9, 28],
      [50, 9, -12],  [50, 9,  12],
      [-50, 9, -12], [-50, 9,  12],
    ];
    lampSpots.forEach(([lx, ly, lz]) => {
      const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.18, ly, 8), poleMat);
      pole.position.set(lx, ly / 2, lz);
      pole.castShadow = true;
      scene.add(pole);
      // Arm
      const arm = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 3, 6), poleMat);
      arm.rotation.z = Math.PI / 2;
      arm.position.set(lx + 1.5, ly, lz);
      scene.add(arm);
      // Bulb housing
      const housing = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.5, 0.8),
        new THREE.MeshStandardMaterial({ color: "#1F2937", metalness: 0.9 }));
      housing.position.set(lx + 3, ly - 0.2, lz);
      scene.add(housing);
      // Glowing bulb
      const bulb = new THREE.Mesh(new THREE.SphereGeometry(0.3, 8, 8), bulbMat);
      bulb.position.set(lx + 3, ly - 0.45, lz);
      scene.add(bulb);
      // Light cone on ground
      const cone = new THREE.Mesh(new THREE.ConeGeometry(5, ly + 2, 20, 1, true), coneMat2);
      cone.position.set(lx + 3, (ly + 2) / 2 - 1, lz);
      scene.add(cone);
      // Point light (small range, low intensity for performance)
      const pt = new THREE.PointLight("#FFF0A0", 1.8, 22, 2);
      pt.position.set(lx + 3, ly - 0.5, lz);
      scene.add(pt);
      // Warm ground light pool
      const poolMat = new THREE.MeshBasicMaterial({ color: "#FFE890", transparent: true, opacity: 0.12, side: THREE.DoubleSide });
      const pool = new THREE.Mesh(new THREE.CircleGeometry(4.5, 16), poolMat);
      pool.rotation.x = -Math.PI / 2;
      pool.position.set(lx + 3, 0.02, lz);
      scene.add(pool);
    });

    // ─── CARS BUILDER ─────────────────────────────────────────────────────────
    function buildCar(color: string, isSUV = false, hasHL = true): THREE.Group {
      const car = new THREE.Group();
      const len = isSUV ? 5.2 : 4.4;
      const wid = 2.2;
      const ht  = isSUV ? 1.65 : 1.2;

      // Body
      const bodyMat = new THREE.MeshStandardMaterial({ color, roughness: 0.18, metalness: 0.88 });
      const body = new THREE.Mesh(new THREE.BoxGeometry(wid, ht, len), bodyMat);
      body.position.y = ht / 2 + 0.38;
      body.castShadow = true;
      car.add(body);

      // Roof / cabin
      const roofMat = new THREE.MeshStandardMaterial({ color: "#060E1A", roughness: 0.08, metalness: 0.95 });
      const roof = new THREE.Mesh(new THREE.BoxGeometry(wid * 0.82, 0.95, len * 0.52), roofMat);
      roof.position.set(0, ht + 0.52, -0.15);
      car.add(roof);

      // Wheels
      const wMat = new THREE.MeshStandardMaterial({ color: "#080D14", roughness: 0.9 });
      const wRimMat = new THREE.MeshStandardMaterial({ color: "#374151", metalness: 0.95, roughness: 0.2 });
      [[-1.1, 0.42, len * 0.35], [1.1, 0.42, len * 0.35],
       [-1.1, 0.42, -len * 0.35], [1.1, 0.42, -len * 0.35]].forEach(([wx, wy, wz]) => {
        const tyre = new THREE.Mesh(new THREE.CylinderGeometry(0.44, 0.44, 0.38, 14), wMat);
        tyre.rotation.z = Math.PI / 2;
        tyre.position.set(wx, wy, wz);
        car.add(tyre);
        const rim = new THREE.Mesh(new THREE.CylinderGeometry(0.26, 0.26, 0.4, 8), wRimMat);
        rim.rotation.z = Math.PI / 2;
        rim.position.set(wx > 0 ? wx + 0.02 : wx - 0.02, wy, wz);
        car.add(rim);
      });

      // Headlights
      if (hasHL) {
        const hlMat = new THREE.MeshBasicMaterial({ color: "#E0F0FF" });
        const hlGeo = new THREE.PlaneGeometry(0.55, 0.28);
        [-0.78, 0.78].forEach((hx) => {
          const hl = new THREE.Mesh(hlGeo, hlMat);
          hl.position.set(hx, 0.82, len / 2 + 0.01);
          car.add(hl);
        });
        const tlMat = new THREE.MeshBasicMaterial({ color: "#FF2020" });
        [-0.78, 0.78].forEach((hx) => {
          const tl = new THREE.Mesh(hlGeo, tlMat);
          tl.rotation.y = Math.PI;
          tl.position.set(hx, 0.82, -len / 2 - 0.01);
          car.add(tl);
        });
      }

      // Side mirrors
      const mirrorMat = new THREE.MeshStandardMaterial({ color: "#1F2937", metalness: 0.9 });
      [-1.2, 1.2].forEach((mx) => {
        const mirror = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.3, 0.4), mirrorMat);
        mirror.position.set(mx, ht, len * 0.2);
        car.add(mirror);
      });

      return car;
    }

    // Parked cars in lot
    const parkedConfig = [
      { x: -6.5, z: 22, color: "#1A2535", suv: false },
      { x: -1.5, z: 22, color: "#2D3B4F", suv: false },
      { x: 13.5, z: 22, color: "#0C3B6B", suv: false },
      { x: 18.5, z: 22, color: "#1F3450", suv: true },
      { x: 23.5, z: 22, color: "#1A2535", suv: false },
      { x: 28.5, z: 22, color: "#0A2040", suv: false },
      { x: -6.5, z: 20, color: "#2A1A35", suv: true },
    ];
    parkedConfig.forEach((c) => {
      const car = buildCar(c.color, c.suv, false);
      car.position.set(c.x, 0, c.z);
      scene.add(car);
    });

    // Incident vehicle V-442 (silver SUV)
    const vehicle = buildCar("#8B9EB0", true, true);
    vehicle.position.set(5.5, 0, 22);
    scene.add(vehicle);
    vehicleRef.current = vehicle;

    // ─── PERSONS ──────────────────────────────────────────────────────────────
    function buildPerson(jacketColor: string, hasRing = true): THREE.Group {
      const p = new THREE.Group();

      // Legs
      const legMat = new THREE.MeshStandardMaterial({ color: "#111827", roughness: 0.6 });
      [-0.18, 0.18].forEach((lx) => {
        const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.13, 0.12, 1.0, 8), legMat);
        leg.position.set(lx, 0.5, 0);
        p.add(leg);
      });

      // Torso
      const torsoMat = new THREE.MeshStandardMaterial({ color: jacketColor, roughness: 0.5, metalness: 0.1 });
      const torso = new THREE.Mesh(new THREE.BoxGeometry(0.58, 0.85, 0.38), torsoMat);
      torso.position.y = 1.38;
      p.add(torso);

      // Arms
      const armMat = new THREE.MeshStandardMaterial({ color: jacketColor, roughness: 0.55 });
      [-0.42, 0.42].forEach((ax) => {
        const arm = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.08, 0.72, 6), armMat);
        arm.rotation.z = ax > 0 ? 0.35 : -0.35;
        arm.position.set(ax, 1.35, 0);
        p.add(arm);
      });

      // Head
      const headMat = new THREE.MeshStandardMaterial({ color: "#F0E6D3", roughness: 0.6 });
      const head = new THREE.Mesh(new THREE.SphereGeometry(0.22, 10, 10), headMat);
      head.position.y = 1.95;
      p.add(head);

      // Tracking reticle ring
      if (hasRing) {
        const ringMat = new THREE.MeshBasicMaterial({ color: jacketColor, side: THREE.DoubleSide, transparent: true, opacity: 0.9 });
        const ring = new THREE.Mesh(new THREE.RingGeometry(0.9, 1.15, 28), ringMat);
        ring.rotation.x = -Math.PI / 2;
        ring.position.y = 0.04;
        p.add(ring);
        // Corner markers
        const cornerMat = new THREE.MeshBasicMaterial({ color: jacketColor });
        [0, Math.PI / 2, Math.PI, Math.PI * 1.5].forEach((angle) => {
          const corner = new THREE.Mesh(new THREE.PlaneGeometry(0.35, 0.08), cornerMat);
          corner.rotation.x = -Math.PI / 2;
          corner.rotation.z = angle;
          corner.position.set(Math.cos(angle) * 1.05, 0.05, Math.sin(angle) * 1.05);
          p.add(corner);
        });
      }

      return p;
    }

    const person = buildPerson("#00CFFF");
    person.position.set(-10, 0, 13);
    scene.add(person);
    personRef.current = person;

    const witness = buildPerson("#22D3B0");
    witness.position.set(24, 0, 32);
    witness.visible = false;
    scene.add(witness);
    witnessRef.current = witness;

    // Alert ring on ground
    const alertRingMat = new THREE.MeshBasicMaterial({ color: "#FF2222", side: THREE.DoubleSide, transparent: true, opacity: 0 });
    const alertRingOuter = new THREE.Mesh(new THREE.RingGeometry(1.5, 2.2, 36), alertRingMat);
    alertRingOuter.rotation.x = -Math.PI / 2;
    alertRingOuter.position.set(5.5, 0.08, 19.5);
    scene.add(alertRingOuter);
    alertRingRef.current = alertRingOuter;

    // Second ring (inner pulse)
    const alertInnerMat = new THREE.MeshBasicMaterial({ color: "#FF6666", side: THREE.DoubleSide, transparent: true, opacity: 0 });
    const alertRingInner = new THREE.Mesh(new THREE.RingGeometry(0.5, 0.9, 32), alertInnerMat);
    alertRingInner.rotation.x = -Math.PI / 2;
    alertRingInner.position.set(5.5, 0.09, 19.5);
    scene.add(alertRingInner);

    // ─── TRAFFIC CARS (animated on main road) ─────────────────────────────────
    const trafficColors = ["#1a2535", "#2d4a6b", "#3d2510", "#1a3520", "#4a1525"];
    const trafficCars: { mesh: THREE.Group; speed: number; lane: number; direction: number }[] = [];

    for (let i = 0; i < 8; i++) {
      const lane = i % 2 === 0 ? -5.5 : 5.5;
      const dir  = lane < 0 ? 1 : -1;
      const car  = buildCar(trafficColors[i % trafficColors.length], i % 3 === 0, true);
      car.rotation.y = dir > 0 ? 0 : Math.PI;
      car.position.set((Math.random() - 0.5) * 300, 0, lane);
      scene.add(car);
      trafficRef.current.push(car);
      trafficCars.push({ mesh: car, speed: 12 + Math.random() * 8, lane, direction: dir });
    }

    // ─── GROUND PUDDLE REFLECTIONS ────────────────────────────────────────────
    const puddleMat = new THREE.MeshStandardMaterial({
      color: "#050810", roughness: 0.0, metalness: 1.0, transparent: true, opacity: 0.65,
    });
    const puddlePositions: [number, number][] = [
      [8, -3], [-5, 4], [18, 8], [-12, -6], [0, 18], [25, -2], [-20, 15],
    ];
    puddlePositions.forEach(([px, pz]) => {
      const r = 1.5 + Math.random() * 2.5;
      const puddle = new THREE.Mesh(new THREE.EllipseCurve(0, 0, r, r * 0.55, 0, Math.PI * 2, false, 0)
        .getPoints(24)
        .reduce((geo) => geo, new THREE.CircleGeometry(r, 24)), puddleMat.clone());
      puddle.rotation.x = -Math.PI / 2;
      puddle.position.set(px, 0.01, pz);
      scene.add(puddle);
      puddlesRef.current.push(puddle);
    });

    // ─── HOLOGRAPHIC SCANNER SWEEP (AI Reconstruction) ────────────────────────
    const scanLineMat = new THREE.MeshBasicMaterial({ color: "#00E5FF", transparent: true, opacity: 0.85, side: THREE.DoubleSide });
    const scanLine = new THREE.Mesh(new THREE.PlaneGeometry(36, 0.4), scanLineMat);
    scanLine.rotation.x = -Math.PI / 2;
    scanLine.position.set(11, 0.12, 18);
    scene.add(scanLine);

    const scanGlowMat = new THREE.MeshBasicMaterial({ color: "#00B8FF", transparent: true, opacity: 0.14, side: THREE.DoubleSide });
    const scanGlow = new THREE.Mesh(new THREE.PlaneGeometry(36, 5.0), scanGlowMat);
    scanGlow.rotation.x = -Math.PI / 2;
    scanGlow.position.set(11, 0.11, 18);
    scene.add(scanGlow);

    // ─── NEON SIGNS ON BUILDINGS ──────────────────────────────────────────────
    const neonDefs: { pos: [number,number,number]; rot: number; color: string; w: number; h: number }[] = [
      { pos: [-68, 35, -55],  rot: 0,            color: "#FF00AA", w: 14, h: 4 },  // magenta – north tower
      { pos: [-8,  48, -54],  rot: 0,            color: "#00FFD0", w: 18, h: 5 },  // teal – tallest north
      { pos: [36,  38, -55],  rot: 0,            color: "#FF6600", w: 12, h: 3.5 },// orange
      { pos: [72,  44, -57],  rot: 0,            color: "#00BFFF", w: 14, h: 4 },  // cyan
      { pos: [95,  30,  -6],  rot: Math.PI / 2,  color: "#AAFF00", w: 10, h: 3 },  // lime – east
      { pos: [-108, 28, -8],  rot: -Math.PI / 2, color: "#FF2255", w: 10, h: 3 },  // red – west
      { pos: [120, 55,  55],  rot: Math.PI / 2,  color: "#BB44FF", w: 14, h: 4 },  // purple – far east
      { pos: [-130, 42,  55], rot: -Math.PI / 2, color: "#00FFA0", w: 12, h: 4 },  // green – far west
    ];

    const neonSigns: typeof neonSignsRef.current = [];
    neonDefs.forEach(({ pos, rot, color, w, h }) => {
      // Glowing panel
      const signMat = new THREE.MeshStandardMaterial({
        color,
        emissive: new THREE.Color(color),
        emissiveIntensity: 2.8,
        roughness: 0.0,
        metalness: 0.0,
        transparent: true,
        opacity: 0.92,
      });
      const sign = new THREE.Mesh(new THREE.PlaneGeometry(w, h), signMat);
      sign.position.set(pos[0], pos[1], pos[2]);
      sign.rotation.y = rot;
      scene.add(sign);

      // Halo glow (large blurry plane behind the sign)
      const haloMat = new THREE.MeshBasicMaterial({
        color, transparent: true, opacity: 0.12, side: THREE.DoubleSide,
      });
      const halo = new THREE.Mesh(new THREE.PlaneGeometry(w * 2.5, h * 2.8), haloMat);
      halo.position.set(pos[0], pos[1], pos[2] + (rot === 0 ? -0.3 : 0));
      halo.rotation.y = rot;
      scene.add(halo);

      // Point light emitting from sign
      const neonPt = new THREE.PointLight(color, 3.5, 45, 1.8);
      neonPt.position.set(pos[0], pos[1], pos[2]);
      scene.add(neonPt);

      neonSigns.push({ mesh: sign, light: neonPt, color });
    });
    neonSignsRef.current = neonSigns;

    // ─── BILLBOARD SCREENS (large glowing display panels) ─────────────────────
    const billboardDefs: { pos: [number,number,number]; rot: number; col1: string; col2: string }[] = [
      { pos: [-8, 65, -56], rot: 0,            col1: "#0044AA", col2: "#00CFFF" },
      { pos: [36, 55, -58], rot: 0,            col1: "#440022", col2: "#FF0055" },
      { pos: [96, 40, -10], rot: Math.PI / 2,  col1: "#002244", col2: "#00AAFF" },
    ];
    billboardDefs.forEach(({ pos, rot, col1, col2 }) => {
      const bbMat = new THREE.MeshStandardMaterial({
        color: col1, emissive: new THREE.Color(col2),
        emissiveIntensity: 1.8, roughness: 0.05, metalness: 0.1,
      });
      const bb = new THREE.Mesh(new THREE.PlaneGeometry(22, 12), bbMat);
      bb.position.set(pos[0], pos[1], pos[2]);
      bb.rotation.y = rot;
      scene.add(bb);
      // Frame
      const frame = new THREE.LineSegments(
        new THREE.EdgesGeometry(new THREE.PlaneGeometry(23, 13)),
        new THREE.LineBasicMaterial({ color: col2, transparent: true, opacity: 0.8 })
      );
      frame.position.set(pos[0], pos[1], pos[2]);
      frame.rotation.y = rot;
      scene.add(frame);
    });

    // ─── EMERGENCY VEHICLE (arrives after impact) ──────────────────────────────
    function buildEmergencyVan(): THREE.Group {
      const van = new THREE.Group();
      const bodyMat = new THREE.MeshStandardMaterial({ color: "#EEEEEE", roughness: 0.3, metalness: 0.6 });
      const body = new THREE.Mesh(new THREE.BoxGeometry(2.4, 2.2, 5.5), bodyMat);
      body.position.y = 1.5;
      van.add(body);
      // Roof bar (light bar)
      const barMat = new THREE.MeshStandardMaterial({ color: "#222222", metalness: 0.9 });
      const bar = new THREE.Mesh(new THREE.BoxGeometry(2.0, 0.35, 1.5), barMat);
      bar.position.set(0, 2.72, 0.3);
      van.add(bar);
      // Wheels
      const wMat = new THREE.MeshStandardMaterial({ color: "#080D14", roughness: 0.9 });
      [[-1.2, 0.5, 1.6], [1.2, 0.5, 1.6], [-1.2, 0.5, -1.6], [1.2, 0.5, -1.6]].forEach(([wx, wy, wz]) => {
        const wheel = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.5, 0.45, 12), wMat);
        wheel.rotation.z = Math.PI / 2;
        wheel.position.set(wx, wy, wz);
        van.add(wheel);
      });
      // Red strobe
      const redLed = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.2, 0.25),
        new THREE.MeshBasicMaterial({ color: "#FF1111" }));
      redLed.position.set(-0.5, 2.73, 0.3);
      van.add(redLed);
      // Blue strobe
      const blueLed = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.2, 0.25),
        new THREE.MeshBasicMaterial({ color: "#1144FF" }));
      blueLed.position.set(0.5, 2.73, 0.3);
      van.add(blueLed);
      return van;
    }
    const emergencyVan = buildEmergencyVan();
    emergencyVan.position.set(-30, 0, -2);  // starts off-scene on the road
    emergencyVan.rotation.y = Math.PI / 2;  // facing east
    emergencyVan.visible = false;
    scene.add(emergencyVan);
    emergencyVehRef.current = emergencyVan;

    // Emergency flashing lights
    const emergRed  = new THREE.PointLight("#FF2200", 0, 30, 2);
    emergRed.position.set(-30, 4, -2);
    scene.add(emergRed);
    emergencyLightRedRef.current = emergRed;

    const emergBlue = new THREE.PointLight("#2244FF", 0, 30, 2);
    emergBlue.position.set(-30, 4, -2);
    scene.add(emergBlue);
    emergencyLightBlueRef.current = emergBlue;

    // ─── HELICOPTER SPOTLIGHT ─────────────────────────────────────────────────
    const heliGroup = new THREE.Group();
    // Heli body
    const heliBody = new THREE.Mesh(new THREE.BoxGeometry(3, 1.2, 6),
      new THREE.MeshStandardMaterial({ color: "#1A2535", metalness: 0.8, roughness: 0.3 }));
    heliGroup.add(heliBody);
    // Rotor
    const rotorMat = new THREE.MeshBasicMaterial({ color: "#374151", transparent: true, opacity: 0.5 });
    const rotor = new THREE.Mesh(new THREE.CylinderGeometry(6, 6, 0.15, 4, 1, false, 0, Math.PI * 2), rotorMat);
    rotor.position.y = 0.9;
    heliGroup.add(rotor);
    // Navigation lights
    const navRed  = new THREE.Mesh(new THREE.SphereGeometry(0.2, 6, 6), new THREE.MeshBasicMaterial({ color: "#FF2222" }));
    navRed.position.set(-1.6, 0, -2.8);
    heliGroup.add(navRed);
    const navGreen = new THREE.Mesh(new THREE.SphereGeometry(0.2, 6, 6), new THREE.MeshBasicMaterial({ color: "#22FF44" }));
    navGreen.position.set(1.6, 0, -2.8);
    heliGroup.add(navGreen);

    heliGroup.position.set(0, 90, 40);
    scene.add(heliGroup);
    heliGroupRef.current = heliGroup;

    // Helicopter spotlight
    const heliSpot = new THREE.SpotLight("#FFFFFF", 0, 120, Math.PI / 14, 0.35, 1.2);
    heliSpot.position.set(0, 90, 40);
    heliSpot.target.position.set(5, 0, 19);
    scene.add(heliSpot);
    scene.add(heliSpot.target);
    heliSpotRef.current = heliSpot;

    // ─── CCTV CAMERAS ─────────────────────────────────────────────────────────
    const cctvs: { pos: [number,number,number]; look: [number,number,number] }[] = [
      { pos: [-12, 10, 8],  look: [5.5, 0, 20] },
      { pos: [4,   7,  30], look: [5.5, 0, 20] },
      { pos: [26,  12, 14], look: [5.5, 0, 20] },
      { pos: [14,  26, 40], look: [5.5, 0, 20] },
    ];

    const leds: THREE.Mesh[] = [];
    const frustums: THREE.Group[] = [];

    cctvs.forEach((cam) => {
      const pg = new THREE.Group();
      pg.position.set(cam.pos[0], 0, cam.pos[2]);

      // Pole
      const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.2, cam.pos[1], 8), poleMat);
      pole.position.y = cam.pos[1] / 2;
      pg.add(pole);

      // Camera housing
      const housing = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.4, 1.0),
        new THREE.MeshStandardMaterial({ color: "#0D1117", metalness: 0.95, roughness: 0.15 }));
      housing.position.set(0, cam.pos[1], 0);
      pg.add(housing);

      // Lens
      const lens = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.16, 0.3, 12),
        new THREE.MeshStandardMaterial({ color: "#050810", metalness: 0.9 }));
      lens.rotation.x = Math.PI / 2;
      lens.position.set(0, cam.pos[1], 0.55);
      pg.add(lens);

      // LED
      const led = new THREE.Mesh(new THREE.SphereGeometry(0.1, 8, 8),
        new THREE.MeshBasicMaterial({ color: "#EF4444" }));
      led.position.set(0.22, cam.pos[1] + 0.18, 0.3);
      pg.add(led);
      leds.push(led);

      pg.lookAt(cam.look[0], cam.look[1], cam.look[2]);
      scene.add(pg);

      // Frustum cone
      const fg = new THREE.Group();
      const cone = new THREE.Mesh(new THREE.ConeGeometry(10, 22, 4, 1, true),
        new THREE.MeshBasicMaterial({ color: "#00B8FF", transparent: true, opacity: 0.07, wireframe: true }));
      cone.rotation.x = -Math.PI / 2;
      cone.position.z = 11;
      fg.position.set(cam.pos[0], cam.pos[1], cam.pos[2]);
      fg.lookAt(cam.look[0], cam.look[1], cam.look[2]);
      fg.add(cone);
      scene.add(fg);
      frustums.push(fg);
    });
    ledsRef.current  = leds;
    frustumsRef.current = frustums;

    // ─── TRAJECTORY PATHS ─────────────────────────────────────────────────────
    // Person path — dashed look via many small spheres
    const pPathMat = new THREE.LineBasicMaterial({ color: "#00CFFF", transparent: true, opacity: 0.6 });
    const pPathLine = new THREE.Line(new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(-10, 0.1, 13),
      new THREE.Vector3( -4, 0.1, 15),
      new THREE.Vector3(  1, 0.1, 17.5),
      new THREE.Vector3(  3.5, 0.1, 19),
      new THREE.Vector3(  5, 0.1, 19.5),
    ]), pPathMat);
    scene.add(pPathLine);

    // Vehicle reverse path
    const vPathMat = new THREE.LineBasicMaterial({ color: "#F59E0B", transparent: true, opacity: 0.6 });
    const vPathLine = new THREE.Line(new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(5.5, 0.1, 22),
      new THREE.Vector3(5.5, 0.1, 18),
      new THREE.Vector3(5.3, 0.1, 13),
      new THREE.Vector3(5.0, 0.1, 10),
    ]), vPathMat);
    scene.add(vPathLine);

    // Path dots (small spheres along paths)
    const dotMat = new THREE.MeshBasicMaterial({ color: "#00CFFF", transparent: true, opacity: 0.7 });
    [[-8,13],[-4,15],[1,17.5],[3.5,19]].forEach(([dx, dz]) => {
      const dot = new THREE.Mesh(new THREE.SphereGeometry(0.22, 8, 8), dotMat);
      dot.position.set(dx, 0.18, dz);
      scene.add(dot);
    });
    const vDotMat = new THREE.MeshBasicMaterial({ color: "#F59E0B", transparent: true, opacity: 0.7 });
    [[5.5,18],[5.3,13]].forEach(([dx, dz]) => {
      const dot = new THREE.Mesh(new THREE.SphereGeometry(0.22, 8, 8), vDotMat);
      dot.position.set(dx, 0.18, dz);
      scene.add(dot);
    });

    // ─── RESIZE OBSERVER ──────────────────────────────────────────────────────
    const resizeObserver = new ResizeObserver((entries) => {
      for (const e of entries) {
        const { width: w, height: h } = e.contentRect;
        if (w > 0 && h > 0) {
          camera.aspect = w / h;
          camera.updateProjectionMatrix();
          renderer.setSize(w, h);
        }
      }
    });
    resizeObserver.observe(container);

    // ─── RENDER LOOP ──────────────────────────────────────────────────────────
    prevTimeRef.current = performance.now();

    const renderLoop = () => {
      animFrameRef.current = requestAnimationFrame(renderLoop);

      const now = performance.now();
      const dt  = Math.min((now - prevTimeRef.current) / 1000, 0.05);
      prevTimeRef.current = now;

      incidentT.current = (incidentT.current + dt) % INCIDENT_LOOP;
      const t = incidentT.current;
      const elapsed = now / 1000;

      // ── Traffic cars ──
      trafficCars.forEach((tc) => {
        tc.mesh.position.x += tc.speed * dt * tc.direction;
        if (tc.direction > 0 && tc.mesh.position.x > 220) tc.mesh.position.x = -220;
        if (tc.direction < 0 && tc.mesh.position.x < -220) tc.mesh.position.x = 220;
        // Subtle wheel rotation
        tc.mesh.children.forEach((child, ci) => {
          if (ci >= 2 && ci <= 5) child.rotation.x += tc.speed * dt * 0.5 * tc.direction;
        });
      });

      // ── Person P-109 walk/fall ──
      const p = personRef.current;
      if (p) {
        if (t < 5) {
          const wt = easeInOut(t / 5);
          p.position.x = lerp(-10, 5, wt);
          p.position.z = lerp(13, 19.5, wt);
          p.position.y = Math.abs(Math.sin(t * 5.5)) * 0.09;
          p.rotation.set(0, 0, 0);
          p.rotation.y = Math.atan2(15, 5) * 0.6; // face vehicle
          p.visible = true;
        } else if (t < 7) {
          p.position.set(5, 0, 19.5);
          p.rotation.set(0, 0, 0);
          p.visible = true;
        } else if (t < 9.5) {
          const ft = easeOut((t - 7) / 2.5);
          p.position.x = lerp(5, 4.0, ft);
          p.position.z = lerp(19.5, 18.5, ft);
          p.position.y = lerp(0, -0.28, ft);
          p.rotation.z = lerp(0, Math.PI / 2.1, ft);
          p.visible = true;
        } else {
          p.position.set(4.0, -0.15, 18.5);
          p.rotation.z = Math.PI / 2.1;
          p.visible = true;
        }
      }

      // ── Vehicle V-442 reverse ──
      const v = vehicleRef.current;
      if (v) {
        if (t < 5.5) {
          v.position.set(5.5, 0, 22);
        } else if (t < 9.5) {
          const rt = easeInOut((t - 5.5) / 4);
          v.position.z = lerp(22, 11, rt);
          v.position.x = 5.5;
          // Wheels spin
          v.children.forEach((child, ci) => {
            if (ci >= 2 && ci <= 5) child.rotation.x -= dt * 4 * rt;
          });
        } else {
          v.position.set(5.5, 0, 11);
        }
      }

      // ── Witness P-110 run ──
      const w = witnessRef.current;
      if (w) {
        if (t < 9.5) {
          w.visible = false;
        } else {
          w.visible = true;
          const rt = easeInOut(clamp((t - 9.5) / 3.5, 0, 1));
          w.position.x = lerp(24, 7.5, rt);
          w.position.z = lerp(32, 19.5, rt);
          w.position.y = t < 13 ? Math.abs(Math.sin((t - 9.5) * 7)) * 0.1 : 0;
        }
      }

      // ── Alert ring & warning light (t=7→11) ──
      const ar = alertRingRef.current;
      const wl = warnLightRef.current;
      if (t >= 7 && t < 12) {
        const pulse = 0.5 + 0.5 * Math.sin((t - 7) * Math.PI * 2.5);
        if (ar)  (ar.material as THREE.MeshBasicMaterial).opacity  = 0.55 * pulse;
        if (alertInnerMat) alertInnerMat.opacity = 0.7 * (1 - pulse);
        if (wl)  wl.intensity = 8 * pulse;
        if (blueSpot) blueSpot.intensity = 3 * pulse;
      } else {
        if (ar)   (ar.material as THREE.MeshBasicMaterial).opacity  = 0;
        if (alertInnerMat) alertInnerMat.opacity = 0;
        if (wl)   wl.intensity  = 0;
        if (blueSpot) blueSpot.intensity = 0;
      }

      // ── LED blink ──
      const isRed = Math.floor(elapsed * 2.5) % 2 === 0;
      ledsRef.current.forEach((led) => {
        (led.material as THREE.MeshBasicMaterial).color.set(isRed ? "#EF4444" : "#500A0A");
      });

      // ── Frustum pulse ──
      frustumsRef.current.forEach((fg, i) => {
        const cone = fg.children[0] as THREE.Mesh;
        if (cone?.material) (cone.material as THREE.MeshBasicMaterial).opacity = 0.055 + Math.sin(elapsed * 1.8 + i * 1.2) * 0.025;
      });

      // ── Neon sign flicker ──
      neonSignsRef.current.forEach(({ mesh, light, color }, i) => {
        // Occasional flicker: 98% on, 2% dim
        const flicker = Math.random() > 0.015 ? 1.0 : 0.35 + Math.random() * 0.3;
        // Slow pulse breathe
        const breathe = 0.82 + 0.18 * Math.sin(elapsed * 0.9 + i * 1.4);
        const intensity = flicker * breathe;
        (mesh.material as THREE.MeshStandardMaterial).emissiveIntensity = 2.8 * intensity;
        light.intensity = 3.5 * intensity;
      });

      // ── Building accent lights breathe ──
      buildingLightsRef.current.forEach((light, i) => {
        light.intensity = 0.8 + 0.4 * Math.sin(elapsed * 0.6 + i * 0.7);
      });

      // ── Puddle light color shift (reflects nearby neons) ──
      puddlesRef.current.forEach((puddle, i) => {
        const t2 = elapsed * 0.3 + i * 0.8;
        const r = Math.floor(5  + 8  * Math.abs(Math.sin(t2)));
        const g = Math.floor(8  + 10 * Math.abs(Math.sin(t2 + 1)));
        const b = Math.floor(20 + 20 * Math.abs(Math.sin(t2 + 2)));
        (puddle.material as THREE.MeshStandardMaterial).color.setRGB(r / 255, g / 255, b / 255);
      });

      // ── Holographic scanner sweep ──
      const scanZ = 6 + ((elapsed * 5) % 24);
      scanLine.position.z = scanZ;
      scanGlow.position.z = scanZ - 2.0;
      scanLineMat.opacity = 0.6 + 0.3 * Math.sin(elapsed * 4);

      // ── Emergency vehicle (arrives at t=9, drives to incident zone) ──
      const ev = emergencyVehRef.current;
      const eRed  = emergencyLightRedRef.current;
      const eBlue = emergencyLightBlueRef.current;
      if (ev) {
        if (t >= 9 && t < 16) {
          ev.visible = true;
          // Drive from road toward parking lot
          const evT = easeOut(clamp((t - 9) / 5, 0, 1));
          const evX = lerp(-30, -2, evT);
          ev.position.x = evX;
          ev.position.z = lerp(-2, 12, evT);
          if (eRed)  eRed.position.set(evX, 4, ev.position.z);
          if (eBlue) eBlue.position.set(evX, 4, ev.position.z);

          // Alternating red/blue strobe — fast 4Hz
          const strobe = Math.floor(elapsed * 8) % 2 === 0;
          if (eRed)  eRed.intensity  = strobe ? 12 : 0;
          if (eBlue) eBlue.intensity = strobe ? 0  : 12;
        } else {
          ev.visible = false;
          if (eRed)  eRed.intensity  = 0;
          if (eBlue) eBlue.intensity = 0;
        }
      }

      // ── Helicopter spotlight (circles incident zone when t>8) ──
      const heli  = heliGroupRef.current;
      const hSpot = heliSpotRef.current;
      if (heli) {
        if (t >= 8) {
          const heliOrbitT = (elapsed - 8) * 0.22; // slow orbit
          const orbitR = 55;
          heli.position.x = 5 + Math.sin(heliOrbitT) * orbitR;
          heli.position.z = 19 + Math.cos(heliOrbitT) * orbitR;
          heli.position.y = 88 + Math.sin(elapsed * 0.5) * 3;
          // Rotor spin
          if (heli.children[1]) heli.children[1].rotation.y += dt * 12;
          // Aim spotlight down at incident zone
          if (hSpot) {
            hSpot.position.copy(heli.position);
            hSpot.intensity = 28 + 4 * Math.sin(elapsed * 2);
          }
        } else {
          // Hide before incident
          heli.position.set(200, 88, 200);
          if (hSpot) hSpot.intensity = 0;
        }
      }

      // ── Camera smooth lerp ──
      camPosRef.current.lerp(camTargetRef.current,  0.035);
      lookPosRef.current.lerp(lookTargetRef.current, 0.04);
      camera.position.copy(camPosRef.current);
      camera.lookAt(lookPosRef.current);

      renderer.render(scene, camera);
    };

    renderLoop();

    return () => {
      resizeObserver.disconnect();
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      renderer.dispose();
      scene.clear();
    };
  }, []);

  // Stage → camera preset
  useEffect(() => {
    switch (stage) {
      case 1: // Wide cinematic aerial
        camTargetRef.current.set(0, 68, 105);
        lookTargetRef.current.set(5, 0, 15);
        break;
      case 2: // Corridor approach
        camTargetRef.current.set(-6, 18, 34);
        lookTargetRef.current.set(5, 1.5, 19);
        break;
      case 3:
        if (selectedCamera === 1) { camTargetRef.current.set(-12, 11, 8);  lookTargetRef.current.set(5.5, 1.2, 20); }
        else if (selectedCamera === 2) { camTargetRef.current.set(4, 8, 30);   lookTargetRef.current.set(5.5, 1.2, 20); }
        else if (selectedCamera === 3) { camTargetRef.current.set(26, 13, 14); lookTargetRef.current.set(5.5, 1.2, 20); }
        else { camTargetRef.current.set(14, 27, 40); lookTargetRef.current.set(5.5, 1.2, 20); }
        break;
      case 4:
        camTargetRef.current.set(2, 16, 34);
        lookTargetRef.current.set(5.5, 0.5, 19);
        break;
      case 5: // Top-down overhead
        camTargetRef.current.set(7, 46, 20);
        lookTargetRef.current.set(7, 0, 19.5);
        break;
      case 6: // Dossier — cinematic low angle
        camTargetRef.current.set(18, 22, 38);
        lookTargetRef.current.set(5.5, 1, 19);
        break;
    }
  }, [stage, selectedCamera]);

  if (webglError) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center bg-[#05080E] text-center p-8">
        <div className="w-14 h-14 rounded-full bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center mb-4">
          <div className="w-3 h-3 rounded-full bg-cyan-400 animate-ping" />
        </div>
        <h3 className="text-lg font-mono text-white mb-2 tracking-wide">3D CITY RECONSTRUCTION</h3>
        <p className="text-sm text-gray-400">Enable hardware acceleration in browser settings.</p>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="relative w-full h-full overflow-hidden select-none">
      <canvas ref={canvasRef} className="w-full h-full block" />
      {/* Cinematic vignette */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,rgba(3,6,14,0.2)_58%,rgba(3,6,14,0.78)_100%)]" />
      {/* Subtle scanlines */}
      <div className="pointer-events-none absolute inset-0 bg-[repeating-linear-gradient(0deg,transparent,transparent_3px,rgba(0,0,0,0.04)_3px,rgba(0,0,0,0.04)_6px)] opacity-40" />
    </div>
  );
}
