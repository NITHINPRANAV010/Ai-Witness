"use client";

import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";

interface CityCanvasProps {
  stage: number; // 1 to 6
  scrollProgress: number; // 0 to 1
  selectedCamera: number; // 1 to 4
  onCameraSelect?: (cam: number) => void;
}

export default function CityCanvas({
  stage,
  scrollProgress,
  selectedCamera,
}: CityCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [webglError, setWebglError] = useState<boolean>(false);

  // Animation & Three.js refs
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const animFrameIdRef = useRef<number | null>(null);

  // Dynamic actors
  const personRef = useRef<THREE.Group | null>(null);
  const vehicleRef = useRef<THREE.Group | null>(null);
  const witnessRef = useRef<THREE.Group | null>(null);
  const personTrailRef = useRef<THREE.Line | null>(null);
  const vehicleTrailRef = useRef<THREE.Line | null>(null);
  const ledsRef = useRef<THREE.Mesh[]>([]);
  const frustumsRef = useRef<THREE.Group[]>([]);

  // Camera targets
  const currentCamPos = useRef(new THREE.Vector3(0, 55, 80));
  const targetCamPos = useRef(new THREE.Vector3(0, 55, 80));
  const currentLookAt = useRef(new THREE.Vector3(0, 0, 0));
  const targetLookAt = useRef(new THREE.Vector3(0, 0, 0));

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    let width = container.clientWidth || window.innerWidth;
    let height = container.clientHeight || window.innerHeight;

    // SCENE
    const scene = new THREE.Scene();
    scene.background = new THREE.Color("#04070D");
    // Soft subtle fog so buildings remain crisp and visible
    scene.fog = new THREE.FogExp2("#04070D", 0.004);
    sceneRef.current = scene;

    // CAMERA
    const camera = new THREE.PerspectiveCamera(46, width / height, 0.1, 1000);
    camera.position.set(0, 55, 80);
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;

    // RENDERER
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        canvas,
        antialias: true,
        powerPreference: "high-performance",
        alpha: false,
      });
    } catch {
      setWebglError(true);
      return;
    }

    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.35;
    rendererRef.current = renderer;

    // ─────────────────────────────────────────────────────────────────────────────
    // LIGHTING (Luminous night city)
    // ─────────────────────────────────────────────────────────────────────────────
    const ambientLight = new THREE.AmbientLight("#1E293B", 2.2);
    scene.add(ambientLight);

    const moonLight = new THREE.DirectionalLight("#38BDF8", 2.0);
    moonLight.position.set(40, 80, 50);
    scene.add(moonLight);

    const backRimLight = new THREE.DirectionalLight("#06B6D4", 1.2);
    backRimLight.position.set(-50, 40, -40);
    scene.add(backRimLight);

    // Warm city glow from streets
    const streetGlow = new THREE.DirectionalLight("#F59E0B", 0.8);
    streetGlow.position.set(20, 20, -10);
    scene.add(streetGlow);

    // ─────────────────────────────────────────────────────────────────────────────
    // PROCEDURAL WINDOW TEXTURES
    // ─────────────────────────────────────────────────────────────────────────────
    function createBuildingTexture(density = 0.55) {
      const texCanvas = document.createElement("canvas");
      texCanvas.width = 128;
      texCanvas.height = 256;
      const ctx = texCanvas.getContext("2d")!;

      // Deep sleek building facade
      ctx.fillStyle = "#0B1019";
      ctx.fillRect(0, 0, 128, 256);

      const rows = 20;
      const cols = 8;
      const cellW = 128 / cols;
      const cellH = 256 / rows;

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const rand = Math.random();
          if (rand < density) {
            // Distinct lit windows
            if (rand < 0.15) {
              ctx.fillStyle = "#F59E0B"; // Warm amber
            } else if (rand < 0.4) {
              ctx.fillStyle = "#00F0FF"; // Vibrant cyan
            } else if (rand < 0.6) {
              ctx.fillStyle = "#38BDF8"; // Sky blue
            } else {
              ctx.fillStyle = "#E2E8F0"; // Cool white
            }
            ctx.fillRect(c * cellW + 3, r * cellH + 3, cellW - 6, cellH - 6);
          } else {
            // Dark window pane
            ctx.fillStyle = "#101725";
            ctx.fillRect(c * cellW + 3, r * cellH + 3, cellW - 6, cellH - 6);
          }
        }
      }

      const texture = new THREE.CanvasTexture(texCanvas);
      texture.wrapS = THREE.RepeatWrapping;
      texture.wrapT = THREE.RepeatWrapping;
      return texture;
    }

    const windowTexture = createBuildingTexture(0.5);

    // ─────────────────────────────────────────────────────────────────────────────
    // GROUND, ROADS, & PARKING AREA
    // ─────────────────────────────────────────────────────────────────────────────
    // Base asphalt ground
    const groundGeo = new THREE.PlaneGeometry(400, 400);
    const groundMat = new THREE.MeshStandardMaterial({
      color: "#080C14",
      roughness: 0.8,
      metalness: 0.2,
    });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -0.05;
    scene.add(ground);

    // Subtle technological grid pattern
    const grid = new THREE.GridHelper(300, 60, "#0E2439", "#091522");
    grid.position.y = 0.01;
    scene.add(grid);

    // Main East-West Roadway
    const roadMainGeo = new THREE.PlaneGeometry(350, 18);
    const roadMainMat = new THREE.MeshStandardMaterial({
      color: "#0F1622",
      roughness: 0.6,
      metalness: 0.3,
    });
    const roadMain = new THREE.Mesh(roadMainGeo, roadMainMat);
    roadMain.rotation.x = -Math.PI / 2;
    roadMain.position.set(0, 0.02, 0);
    scene.add(roadMain);

    // Road Sidewalks (Curb stone)
    const curbNorthGeo = new THREE.BoxGeometry(350, 0.3, 1.2);
    const curbMat = new THREE.MeshStandardMaterial({ color: "#1E293B", roughness: 0.7 });
    const curbNorth = new THREE.Mesh(curbNorthGeo, curbMat);
    curbNorth.position.set(0, 0.15, -9.6);
    const curbSouth = new THREE.Mesh(curbNorthGeo, curbMat);
    curbSouth.position.set(0, 0.15, 9.6);
    scene.add(curbNorth, curbSouth);

    // Golden Road Divider Dashes
    const dashMat = new THREE.MeshBasicMaterial({ color: "#F59E0B" });
    for (let x = -160; x < 160; x += 10) {
      const dashGeo = new THREE.PlaneGeometry(4.5, 0.4);
      const dash = new THREE.Mesh(dashGeo, dashMat);
      dash.rotation.x = -Math.PI / 2;
      dash.position.set(x, 0.04, 0);
      scene.add(dash);
    }

    // Secondary Cross Street (North-South)
    const roadCrossGeo = new THREE.PlaneGeometry(16, 350);
    const roadCross = new THREE.Mesh(roadCrossGeo, roadMainMat);
    roadCross.rotation.x = -Math.PI / 2;
    roadCross.position.set(-24, 0.025, 0);
    scene.add(roadCross);

    // Crosswalk Zebra Striping
    const crosswalkMat = new THREE.MeshBasicMaterial({ color: "#CBD5E1" });
    for (let z = -7; z <= 7; z += 1.6) {
      const stripeGeo = new THREE.PlaneGeometry(1.2, 0.8);
      const stripe = new THREE.Mesh(stripeGeo, crosswalkMat);
      stripe.rotation.x = -Math.PI / 2;
      stripe.position.set(-14, 0.04, z);
      scene.add(stripe);
    }

    // Parking Lot Area (The Incident Focus Zone)
    const parkingGeo = new THREE.PlaneGeometry(42, 28);
    const parkingMat = new THREE.MeshStandardMaterial({
      color: "#111A28",
      roughness: 0.65,
      metalness: 0.2,
    });
    const parkingLot = new THREE.Mesh(parkingGeo, parkingMat);
    parkingLot.rotation.x = -Math.PI / 2;
    parkingLot.position.set(10, 0.03, 20);
    scene.add(parkingLot);

    // Parking Bay Marking Lines (Glowing cyan)
    const pLineMat = new THREE.MeshBasicMaterial({ color: "#00F0FF" });
    for (let i = -3; i <= 3; i++) {
      const pLineGeo = new THREE.PlaneGeometry(0.3, 8.5);
      const pLine = new THREE.Mesh(pLineGeo, pLineMat);
      pLine.rotation.x = -Math.PI / 2;
      pLine.position.set(i * 4.5 + 10, 0.05, 21);
      scene.add(pLine);
    }

    // ─────────────────────────────────────────────────────────────────────────────
    // SKYSCRAPERS & URBAN BUILDINGS WITH GLOWING OUTLINES
    // ─────────────────────────────────────────────────────────────────────────────
    const buildingMat = new THREE.MeshStandardMaterial({
      color: "#172033",
      map: windowTexture,
      roughness: 0.35,
      metalness: 0.55,
    });

    const buildingLineMat = new THREE.LineBasicMaterial({
      color: "#38BDF8",
      transparent: true,
      opacity: 0.35,
    });

    const buildings = [
      // North skyline
      { x: -70, z: -45, w: 26, h: 65, d: 26 },
      { x: -38, z: -38, w: 22, h: 48, d: 22 },
      { x: 0, z: -46, w: 34, h: 80, d: 30 },
      { x: 44, z: -40, w: 28, h: 56, d: 26 },
      { x: 85, z: -44, w: 30, h: 70, d: 28 },

      // East skyline
      { x: 62, z: 10, w: 24, h: 42, d: 22 },
      { x: 68, z: 46, w: 28, h: 60, d: 28 },
      { x: 38, z: 52, w: 24, h: 36, d: 20 },

      // West skyline
      { x: -62, z: 12, w: 26, h: 44, d: 24 },
      { x: -68, z: 50, w: 30, h: 66, d: 28 },
      { x: -32, z: 48, w: 20, h: 32, d: 20 },

      // Background towers
      { x: -110, z: -95, w: 40, h: 105, d: 38 },
      { x: -45, z: -110, w: 45, h: 125, d: 35 },
      { x: 25, z: -115, w: 42, h: 110, d: 40 },
      { x: 95, z: -100, w: 38, h: 95, d: 35 },

      // Near incident building
      { x: 10, z: 40, w: 36, h: 26, d: 14 },
    ];

    buildings.forEach((b) => {
      const bGeo = new THREE.BoxGeometry(b.w, b.h, b.d);
      const bMesh = new THREE.Mesh(bGeo, buildingMat);
      bMesh.position.set(b.x, b.h / 2, b.z);
      scene.add(bMesh);

      // Glowing edges for high-tech architectural definition
      const wireGeo = new THREE.EdgesGeometry(bGeo);
      const wire = new THREE.LineSegments(wireGeo, buildingLineMat);
      wire.position.copy(bMesh.position);
      scene.add(wire);

      // Rooftop glowing edge / helipad light
      if (b.h > 50) {
        const beaconGeo = new THREE.SphereGeometry(0.6, 8, 8);
        const beaconMat = new THREE.MeshBasicMaterial({ color: "#EF4444" });
        const beacon = new THREE.Mesh(beaconGeo, beaconMat);
        beacon.position.set(b.x, b.h + 0.6, b.z);
        scene.add(beacon);
      }
    });

    // ─────────────────────────────────────────────────────────────────────────────
    // STREET LIGHTS WITH VISIBLE LIGHT CONES
    // ─────────────────────────────────────────────────────────────────────────────
    const lampPositions = [
      [-15, 8, -9],
      [10, 8, -9],
      [35, 8, -9],
      [-15, 8, 9],
      [10, 8, 9],
      [35, 8, 9],
      [-24, 8, -25],
      [-24, 8, 25],
    ];

    lampPositions.forEach(([lx, ly, lz]) => {
      const poleGeo = new THREE.CylinderGeometry(0.12, 0.16, ly, 8);
      const poleMat = new THREE.MeshStandardMaterial({ color: "#475569", metalness: 0.8 });
      const pole = new THREE.Mesh(poleGeo, poleMat);
      pole.position.set(lx, ly / 2, lz);
      scene.add(pole);

      // Lamp bulb
      const bulbGeo = new THREE.SphereGeometry(0.35, 8, 8);
      const bulbMat = new THREE.MeshBasicMaterial({ color: "#38BDF8" });
      const bulb = new THREE.Mesh(bulbGeo, bulbMat);
      bulb.position.set(lx, ly, lz);
      scene.add(bulb);

      // Semi-transparent light cone on pavement
      const coneGeo = new THREE.ConeGeometry(4.5, ly, 16, 1, true);
      const coneMat = new THREE.MeshBasicMaterial({
        color: "#00F0FF",
        transparent: true,
        opacity: 0.06,
        side: THREE.DoubleSide,
      });
      const cone = new THREE.Mesh(coneGeo, coneMat);
      cone.position.set(lx, ly / 2, lz);
      scene.add(cone);
    });

    // ─────────────────────────────────────────────────────────────────────────────
    // PARKED CARS & INCIDENT VEHICLE
    // ─────────────────────────────────────────────────────────────────────────────
    function buildCar(color = "#38BDF8", isSUV = false) {
      const car = new THREE.Group();
      const length = isSUV ? 4.8 : 4.2;
      const width = 2.1;
      const height = isSUV ? 1.5 : 1.1;

      // Chassis
      const chassisGeo = new THREE.BoxGeometry(width, height, length);
      const chassisMat = new THREE.MeshStandardMaterial({
        color,
        roughness: 0.2,
        metalness: 0.85,
      });
      const chassis = new THREE.Mesh(chassisGeo, chassisMat);
      chassis.position.y = height / 2 + 0.35;
      car.add(chassis);

      // Cabin / windshield
      const cabinGeo = new THREE.BoxGeometry(width * 0.85, 0.9, length * 0.55);
      const cabinMat = new THREE.MeshStandardMaterial({
        color: "#0F172A",
        roughness: 0.1,
        metalness: 0.9,
      });
      const cabin = new THREE.Mesh(cabinGeo, cabinMat);
      cabin.position.set(0, height + 0.5, -0.2);
      car.add(cabin);

      // Wheels
      const wheelGeo = new THREE.CylinderGeometry(0.4, 0.4, 0.35, 12);
      const wheelMat = new THREE.MeshStandardMaterial({ color: "#0B0F17", roughness: 0.8 });
      [
        [-1.05, 0.4, 1.4],
        [1.05, 0.4, 1.4],
        [-1.05, 0.4, -1.4],
        [1.05, 0.4, -1.4],
      ].forEach(([wx, wy, wz]) => {
        const wheel = new THREE.Mesh(wheelGeo, wheelMat);
        wheel.rotation.z = Math.PI / 2;
        wheel.position.set(wx, wy, wz);
        car.add(wheel);
      });

      // Bright Headlights
      const hlGeo = new THREE.PlaneGeometry(0.5, 0.25);
      const hlMat = new THREE.MeshBasicMaterial({ color: "#00F0FF" });
      const hlL = new THREE.Mesh(hlGeo, hlMat);
      hlL.position.set(-0.75, 0.8, length / 2 + 0.01);
      const hlR = new THREE.Mesh(hlGeo, hlMat);
      hlR.position.set(0.75, 0.8, length / 2 + 0.01);
      car.add(hlL, hlR);

      // Tail lights
      const tlMat = new THREE.MeshBasicMaterial({ color: "#EF4444" });
      const tlL = new THREE.Mesh(hlGeo, tlMat);
      tlL.rotation.y = Math.PI;
      tlL.position.set(-0.75, 0.8, -length / 2 - 0.01);
      const tlR = new THREE.Mesh(hlGeo, tlMat);
      tlR.rotation.y = Math.PI;
      tlR.position.set(0.75, 0.8, -length / 2 - 0.01);
      car.add(tlL, tlR);

      return car;
    }

    // Parked bays
    const cars = [
      { x: -3.5, z: 21, color: "#1E293B", suv: false },
      { x: 1, z: 21, color: "#475569", suv: false },
      { x: 5.5, z: 21, color: "#94A3B8", suv: true }, // Incident SUV V-442
      { x: 14.5, z: 21, color: "#0284C7", suv: false },
      { x: 19, z: 21, color: "#334155", suv: true },
      { x: 23.5, z: 21, color: "#1E293B", suv: false },
    ];

    cars.forEach((c, idx) => {
      const carGroup = buildCar(c.color, c.suv);
      carGroup.position.set(c.x, 0, c.z);
      scene.add(carGroup);
      if (idx === 2) {
        vehicleRef.current = carGroup;
      }
    });

    // ─────────────────────────────────────────────────────────────────────────────
    // PEDESTRIANS WITH TRACKING RETICLES
    // ─────────────────────────────────────────────────────────────────────────────
    function buildPerson(jacketColor = "#00F0FF") {
      const person = new THREE.Group();

      // Body & Legs
      const torsoGeo = new THREE.BoxGeometry(0.55, 0.8, 0.35);
      const torsoMat = new THREE.MeshStandardMaterial({ color: jacketColor, roughness: 0.5 });
      const torso = new THREE.Mesh(torsoGeo, torsoMat);
      torso.position.y = 1.3;

      const headGeo = new THREE.SphereGeometry(0.2, 8, 8);
      const headMat = new THREE.MeshStandardMaterial({ color: "#F1F5F9" });
      const head = new THREE.Mesh(headGeo, headMat);
      head.position.y = 1.85;

      const legsGeo = new THREE.CylinderGeometry(0.14, 0.14, 0.9, 8);
      const legsMat = new THREE.MeshStandardMaterial({ color: "#0F172A" });
      const legL = new THREE.Mesh(legsGeo, legsMat);
      legL.position.set(-0.16, 0.45, 0);
      const legR = new THREE.Mesh(legsGeo, legsMat);
      legR.position.set(0.16, 0.45, 0);

      person.add(torso, head, legL, legR);

      // Glowing Ground Ring Reticle
      const ringGeo = new THREE.RingGeometry(0.85, 1.05, 24);
      const ringMat = new THREE.MeshBasicMaterial({
        color: jacketColor,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.85,
      });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.rotation.x = -Math.PI / 2;
      ring.position.y = 0.05;
      person.add(ring);

      return person;
    }

    // Person P-109
    const person = buildPerson("#00F0FF");
    person.position.set(-6, 0, 14);
    scene.add(person);
    personRef.current = person;

    // Witness P-110
    const witness = buildPerson("#10B981");
    witness.position.set(16, 0, 14);
    witness.visible = false;
    scene.add(witness);
    witnessRef.current = witness;

    // ─────────────────────────────────────────────────────────────────────────────
    // CCTV CAMERAS (4 Spatially Consistent Mounts)
    // ─────────────────────────────────────────────────────────────────────────────
    const cctvs = [
      { id: 1, pos: [-10, 8, 10], look: [5.5, 0, 20] },
      { id: 2, pos: [4, 6, 28], look: [5.5, 0, 20] },
      { id: 3, pos: [24, 10, 16], look: [5.5, 0, 20] },
      { id: 4, pos: [12, 24, 38], look: [5.5, 0, 20] },
    ];

    const leds: THREE.Mesh[] = [];
    const frustums: THREE.Group[] = [];

    cctvs.forEach((cam) => {
      const poleGroup = new THREE.Group();
      poleGroup.position.set(cam.pos[0], 0, cam.pos[2]);

      const poleGeo = new THREE.CylinderGeometry(0.15, 0.18, cam.pos[1], 8);
      const poleMat = new THREE.MeshStandardMaterial({ color: "#475569", metalness: 0.8 });
      const pole = new THREE.Mesh(poleGeo, poleMat);
      pole.position.y = cam.pos[1] / 2;
      poleGroup.add(pole);

      const headGeo = new THREE.BoxGeometry(0.45, 0.35, 0.8);
      const headMat = new THREE.MeshStandardMaterial({ color: "#0F172A", metalness: 0.9 });
      const head = new THREE.Mesh(headGeo, headMat);
      head.position.set(0, cam.pos[1], 0);

      // Red blinking LED
      const ledGeo = new THREE.SphereGeometry(0.08, 8, 8);
      const ledMat = new THREE.MeshBasicMaterial({ color: "#EF4444" });
      const led = new THREE.Mesh(ledGeo, ledMat);
      led.position.set(0.18, cam.pos[1] + 0.15, 0.25);
      leds.push(led);

      poleGroup.add(head, led);
      poleGroup.lookAt(cam.look[0], cam.look[1], cam.look[2]);
      scene.add(poleGroup);

      // Translucent cyan camera cone frustum
      const frustumGroup = new THREE.Group();
      const coneGeo = new THREE.ConeGeometry(9, 20, 4, 1, true);
      const coneMat = new THREE.MeshBasicMaterial({
        color: "#00F0FF",
        transparent: true,
        opacity: 0.08,
        wireframe: true,
      });
      const cone = new THREE.Mesh(coneGeo, coneMat);
      cone.rotation.x = -Math.PI / 2;
      cone.position.z = 10;
      frustumGroup.position.set(cam.pos[0], cam.pos[1], cam.pos[2]);
      frustumGroup.lookAt(cam.look[0], cam.look[1], cam.look[2]);
      frustumGroup.add(cone);
      scene.add(frustumGroup);
      frustums.push(frustumGroup);
    });

    ledsRef.current = leds;
    frustumsRef.current = frustums;

    // ─────────────────────────────────────────────────────────────────────────────
    // RECONSTRUCTION TRAJECTORY VECTORS
    // ─────────────────────────────────────────────────────────────────────────────
    const pPoints = [
      new THREE.Vector3(-6, 0.1, 14),
      new THREE.Vector3(-1, 0.1, 17),
      new THREE.Vector3(2.5, 0.1, 19),
      new THREE.Vector3(4.8, 0.1, 19.5),
    ];
    const pTrailGeo = new THREE.BufferGeometry().setFromPoints(pPoints);
    const pTrailMat = new THREE.LineBasicMaterial({
      color: "#00F0FF",
      linewidth: 3,
      transparent: true,
      opacity: 0,
    });
    const pTrail = new THREE.Line(pTrailGeo, pTrailMat);
    scene.add(pTrail);
    personTrailRef.current = pTrail;

    const vPoints = [
      new THREE.Vector3(5.5, 0.1, 21),
      new THREE.Vector3(5.5, 0.1, 19),
      new THREE.Vector3(5.5, 0.1, 16),
      new THREE.Vector3(5.2, 0.1, 12),
    ];
    const vTrailGeo = new THREE.BufferGeometry().setFromPoints(vPoints);
    const vTrailMat = new THREE.LineBasicMaterial({
      color: "#F59E0B",
      linewidth: 3,
      transparent: true,
      opacity: 0,
    });
    const vTrail = new THREE.Line(vTrailGeo, vTrailMat);
    scene.add(vTrail);
    vehicleTrailRef.current = vTrail;

    // ─────────────────────────────────────────────────────────────────────────────
    // RESIZE OBSERVER (Ensures canvas never gets stuck with 0x0 size)
    // ─────────────────────────────────────────────────────────────────────────────
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width: w, height: h } = entry.contentRect;
        if (w > 0 && h > 0 && camera && renderer) {
          camera.aspect = w / h;
          camera.updateProjectionMatrix();
          renderer.setSize(w, h);
        }
      }
    });
    resizeObserver.observe(container);

    // ─────────────────────────────────────────────────────────────────────────────
    // RENDER LOOP
    // ─────────────────────────────────────────────────────────────────────────────
    const startTime = performance.now();

    const renderLoop = () => {
      animFrameIdRef.current = requestAnimationFrame(renderLoop);
      const elapsed = (performance.now() - startTime) / 1000;

      // Smooth camera interpolation
      currentCamPos.current.lerp(targetCamPos.current, 0.05);
      currentLookAt.current.lerp(targetLookAt.current, 0.05);

      camera.position.copy(currentCamPos.current);
      camera.lookAt(currentLookAt.current);

      // Red blinking LEDs
      const isRed = Math.floor(elapsed * 2.5) % 2 === 0;
      leds.forEach((led) => {
        (led.material as THREE.MeshBasicMaterial).color.set(isRed ? "#EF4444" : "#450A0A");
      });

      // Frustum subtle wireframe pulse
      frustums.forEach((frust, i) => {
        const m = frust.children[0] as THREE.Mesh;
        if (m && m.material) {
          (m.material as THREE.MeshBasicMaterial).opacity = 0.06 + Math.sin(elapsed * 2 + i) * 0.03;
        }
      });

      renderer.render(scene, camera);
    };

    renderLoop();

    return () => {
      resizeObserver.disconnect();
      if (animFrameIdRef.current) cancelAnimationFrame(animFrameIdRef.current);
      renderer.dispose();
      scene.clear();
    };
  }, []);

  // Update target camera pose and actors when stage changes
  useEffect(() => {
    if (!sceneRef.current) return;

    switch (stage) {
      case 1:
        // Wide metropolitan aerial view
        targetCamPos.current.set(0, 55, 80);
        targetLookAt.current.set(0, 0, 0);

        if (personRef.current) {
          personRef.current.position.set(-8, 0, 14);
          personRef.current.rotation.z = 0;
          personRef.current.visible = true;
        }
        if (vehicleRef.current) vehicleRef.current.position.set(5.5, 0, 21);
        if (witnessRef.current) witnessRef.current.visible = false;
        if (personTrailRef.current) (personTrailRef.current.material as THREE.LineBasicMaterial).opacity = 0;
        if (vehicleTrailRef.current) (vehicleTrailRef.current.material as THREE.LineBasicMaterial).opacity = 0;
        break;

      case 2:
        // Target lock on entrance corridor
        targetCamPos.current.set(-6, 15, 32);
        targetLookAt.current.set(5.5, 1.5, 20);

        if (personRef.current) {
          personRef.current.position.set(-1, 0, 17);
          personRef.current.rotation.z = 0;
          personRef.current.visible = true;
        }
        if (vehicleRef.current) vehicleRef.current.position.set(5.5, 0, 21);
        if (witnessRef.current) witnessRef.current.visible = false;
        if (personTrailRef.current) (personTrailRef.current.material as THREE.LineBasicMaterial).opacity = 0.2;
        if (vehicleTrailRef.current) (vehicleTrailRef.current.material as THREE.LineBasicMaterial).opacity = 0;
        break;

      case 3:
        // Multi-camera angles
        if (selectedCamera === 1) {
          targetCamPos.current.set(-10, 9, 10);
          targetLookAt.current.set(5.5, 1.2, 20);
        } else if (selectedCamera === 2) {
          targetCamPos.current.set(4, 7, 28);
          targetLookAt.current.set(5.5, 1.2, 20);
        } else if (selectedCamera === 3) {
          targetCamPos.current.set(24, 11, 16);
          targetLookAt.current.set(5.5, 1.2, 20);
        } else {
          targetCamPos.current.set(12, 24, 38);
          targetLookAt.current.set(5.5, 1.2, 20);
        }

        if (personRef.current) {
          personRef.current.position.set(3.8, 0, 20);
          personRef.current.rotation.z = 0;
          personRef.current.visible = true;
        }
        if (vehicleRef.current) vehicleRef.current.position.set(5.5, 0, 20.2);
        if (witnessRef.current) witnessRef.current.visible = true;
        if (personTrailRef.current) (personTrailRef.current.material as THREE.LineBasicMaterial).opacity = 0.5;
        if (vehicleTrailRef.current) (vehicleTrailRef.current.material as THREE.LineBasicMaterial).opacity = 0.4;
        break;

      case 4:
        // Event Extraction
        targetCamPos.current.set(0, 12, 30);
        targetLookAt.current.set(5.5, 1, 20);

        if (personRef.current) {
          personRef.current.position.set(4.6, 0.2, 19.8);
          personRef.current.rotation.z = Math.PI / 2.3;
          personRef.current.visible = true;
        }
        if (vehicleRef.current) vehicleRef.current.position.set(5.5, 0, 18);
        if (witnessRef.current) {
          witnessRef.current.visible = true;
          witnessRef.current.position.set(11, 0, 18);
        }
        if (personTrailRef.current) (personTrailRef.current.material as THREE.LineBasicMaterial).opacity = 0.8;
        if (vehicleTrailRef.current) (vehicleTrailRef.current.material as THREE.LineBasicMaterial).opacity = 0.7;
        break;

      case 5:
        // AI Reconstruction schematic
        targetCamPos.current.set(5.5, 34, 26);
        targetLookAt.current.set(5.5, 0, 19);

        if (personRef.current) {
          personRef.current.position.set(4.6, 0.2, 19.8);
          personRef.current.rotation.z = Math.PI / 2.3;
          personRef.current.visible = true;
        }
        if (vehicleRef.current) vehicleRef.current.position.set(5.5, 0, 16);
        if (witnessRef.current) {
          witnessRef.current.visible = true;
          witnessRef.current.position.set(7.5, 0, 19.5);
        }
        if (personTrailRef.current) (personTrailRef.current.material as THREE.LineBasicMaterial).opacity = 1.0;
        if (vehicleTrailRef.current) (vehicleTrailRef.current.material as THREE.LineBasicMaterial).opacity = 1.0;
        break;

      case 6:
        // Executive dossier perspective
        targetCamPos.current.set(14, 18, 36);
        targetLookAt.current.set(5.5, 1, 19);

        if (personRef.current) {
          personRef.current.position.set(4.6, 0.2, 19.8);
          personRef.current.rotation.z = Math.PI / 2.3;
          personRef.current.visible = true;
        }
        if (vehicleRef.current) vehicleRef.current.position.set(5.5, 0, 16);
        if (witnessRef.current) {
          witnessRef.current.visible = true;
          witnessRef.current.position.set(7, 0, 19.8);
        }
        if (personTrailRef.current) (personTrailRef.current.material as THREE.LineBasicMaterial).opacity = 0.9;
        if (vehicleTrailRef.current) (vehicleTrailRef.current.material as THREE.LineBasicMaterial).opacity = 0.9;
        break;

      default:
        break;
    }
  }, [stage, selectedCamera]);

  if (webglError) {
    return (
      <div className="relative w-full h-full flex flex-col items-center justify-center bg-[#05080E] text-center p-8">
        <div className="w-16 h-16 rounded-full bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center mb-4">
          <div className="w-3 h-3 rounded-full bg-cyan-400 animate-ping" />
        </div>
        <h3 className="text-xl font-mono text-white mb-2 tracking-wide">
          3D CITY RECONSTRUCTION ENVIRONMENT
        </h3>
        <p className="text-sm text-gray-400 max-w-md">
          Hardware acceleration mode fallback active.
        </p>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="relative w-full h-full overflow-hidden select-none">
      <canvas ref={canvasRef} className="w-full h-full block" />
      {/* High-tech radial vignette and scanlines */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_20%,rgba(4,7,13,0.3)_60%,rgba(4,7,13,0.92)_100%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,rgba(0,0,0,0.06)_2px,rgba(0,0,0,0.06)_4px)] opacity-60" />
    </div>
  );
}
