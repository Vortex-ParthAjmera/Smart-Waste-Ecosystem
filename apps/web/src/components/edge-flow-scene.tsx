"use client";

import { useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import * as THREE from "three";
import { StatusPill } from "./truth-badge";

type FlowNodeKey = "physical" | "edge" | "rules" | "review" | "ledger";

type FlowNode = {
  key: FlowNodeKey;
  label: string;
  shortLabel: string;
  detail: string;
  metric: string;
  color: number;
  position: [number, number, number];
};

const FLOW_NODES: FlowNode[] = [
  {
    key: "physical",
    label: "Physical QR + sensors",
    shortLabel: "Bin",
    detail: "Session starts at the compartment with QR suffix, moisture and gate status.",
    metric: "REAL ingress",
    color: 0x64e39a,
    position: [-4.4, -0.55, 0]
  },
  {
    key: "edge",
    label: "Edge custody queue",
    shortLabel: "Edge",
    detail: "Gateway signs custody, retries transport, and keeps device health separate from decisions.",
    metric: "Local receipt",
    color: 0x58b4ff,
    position: [-2.1, 0.55, -0.35]
  },
  {
    key: "rules",
    label: "ML + deterministic rules",
    shortLabel: "Rules",
    detail: "Evidence is labelled by source, then rules produce accepted, flagged or review states.",
    metric: "rules-2.0.0",
    color: 0xffc35a,
    position: [0.3, -0.15, 0.2]
  },
  {
    key: "review",
    label: "Municipal review",
    shortLabel: "Review",
    detail: "Open cases require human action before any negative point effect is finalized.",
    metric: "Human gate",
    color: 0xff806f,
    position: [2.45, 0.65, -0.25]
  },
  {
    key: "ledger",
    label: "EcoCredit ledger",
    shortLabel: "Ledger",
    detail: "Final point transactions update the citizen balance and privacy-safe leaderboard.",
    metric: "Traceable balance",
    color: 0xb692ff,
    position: [4.55, -0.45, 0.05]
  }
];

const DEFAULT_FLOW_NODE = FLOW_NODES[0] as FlowNode;

export function EdgeFlowScene({
  eventId,
  transportState,
  decisionState,
  pendingReviewCount,
  edgeQueueCount,
  devicesOnline,
  totalDevices
}: {
  eventId: string;
  transportState: string;
  decisionState: string;
  pendingReviewCount: number;
  edgeQueueCount: number;
  devicesOnline: number;
  totalDevices: number;
}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const stageRef = useRef<HTMLDivElement | null>(null);
  const selectedKeyRef = useRef<FlowNodeKey>("physical");
  const [selectedKey, setSelectedKey] = useState<FlowNodeKey>("physical");
  const [webglUnavailable, setWebglUnavailable] = useState(false);

  const selectedNode = useMemo(
    () => FLOW_NODES.find((node) => node.key === selectedKey) ?? DEFAULT_FLOW_NODE,
    [selectedKey]
  );

  useEffect(() => {
    selectedKeyRef.current = selectedKey;
  }, [selectedKey]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const stage = stageRef.current;
    if (!canvas || !stage) return;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        canvas,
        antialias: true,
        alpha: true,
        powerPreference: "high-performance"
      });
    } catch {
      setWebglUnavailable(true);
      return;
    }

    setWebglUnavailable(false);
    renderer.setClearColor(0x000000, 0);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));

    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0x061d19, 7, 15);

    const camera = new THREE.PerspectiveCamera(43, 1, 0.1, 100);
    camera.position.set(0, 2.2, 8.2);

    const group = new THREE.Group();
    scene.add(group);

    scene.add(new THREE.AmbientLight(0xdfffee, 0.75));
    const keyLight = new THREE.DirectionalLight(0xffffff, 1.8);
    keyLight.position.set(2, 5, 6);
    scene.add(keyLight);
    const rimLight = new THREE.PointLight(0x75f2ba, 2.4, 12);
    rimLight.position.set(-4, 1, 3);
    scene.add(rimLight);

    const nodeMeshes = new Map<FlowNodeKey, THREE.Mesh<THREE.SphereGeometry, THREE.MeshStandardMaterial>>();
    const ringMeshes = new Map<FlowNodeKey, THREE.Mesh<THREE.TorusGeometry, THREE.MeshBasicMaterial>>();
    const nodeGeometry = new THREE.SphereGeometry(0.28, 32, 32);
    const ringGeometry = new THREE.TorusGeometry(0.47, 0.015, 12, 64);

    FLOW_NODES.forEach((node, index) => {
      const material = new THREE.MeshStandardMaterial({
        color: node.color,
        emissive: node.color,
        emissiveIntensity: 0.44,
        metalness: 0.25,
        roughness: 0.38
      });
      const sphere = new THREE.Mesh(nodeGeometry, material);
      sphere.position.set(...node.position);
      sphere.userData = { key: node.key, index };
      group.add(sphere);
      nodeMeshes.set(node.key, sphere);

      const ring = new THREE.Mesh(
        ringGeometry,
        new THREE.MeshBasicMaterial({ color: node.color, transparent: true, opacity: 0.42 })
      );
      ring.position.copy(sphere.position);
      ring.rotation.x = Math.PI / 2.4;
      group.add(ring);
      ringMeshes.set(node.key, ring);
    });

    const lineMaterial = new THREE.LineBasicMaterial({ color: 0xb3f7d0, transparent: true, opacity: 0.32 });
    for (let index = 0; index < FLOW_NODES.length - 1; index += 1) {
      const startNode = FLOW_NODES[index];
      const endNode = FLOW_NODES[index + 1];
      if (!startNode || !endNode) continue;
      const start = new THREE.Vector3(...startNode.position);
      const end = new THREE.Vector3(...endNode.position);
      const curve = new THREE.CatmullRomCurve3([
        start,
        start.clone().lerp(end, 0.5).add(new THREE.Vector3(0, index % 2 === 0 ? 0.72 : -0.48, 0.18)),
        end
      ]);
      const line = new THREE.Line(new THREE.BufferGeometry().setFromPoints(curve.getPoints(40)), lineMaterial);
      group.add(line);
    }

    const pulseGeometry = new THREE.SphereGeometry(0.08, 16, 16);
    const pulseMaterial = new THREE.MeshBasicMaterial({ color: 0xf8ffe9, transparent: true, opacity: 0.95 });
    const pulses: Array<{ mesh: THREE.Mesh; start: THREE.Vector3; end: THREE.Vector3; offset: number }> = [];
    for (let index = 0; index < FLOW_NODES.length - 1; index += 1) {
      const startNode = FLOW_NODES[index];
      const endNode = FLOW_NODES[index + 1];
      if (!startNode || !endNode) continue;
      const mesh = new THREE.Mesh(pulseGeometry, pulseMaterial.clone());
      const start = new THREE.Vector3(...startNode.position);
      const end = new THREE.Vector3(...endNode.position);
      mesh.position.copy(start);
      group.add(mesh);
      pulses.push({ mesh, start, end, offset: index * 0.19 });
    }

    const particlePositions = new Float32Array(150 * 3);
    for (let index = 0; index < particlePositions.length; index += 3) {
      particlePositions[index] = (Math.random() - 0.5) * 10.6;
      particlePositions[index + 1] = (Math.random() - 0.5) * 4.2;
      particlePositions[index + 2] = (Math.random() - 0.5) * 3.5 - 1.4;
    }
    const particles = new THREE.Points(
      new THREE.BufferGeometry().setAttribute("position", new THREE.BufferAttribute(particlePositions, 3)),
      new THREE.PointsMaterial({ color: 0xd8ffec, size: 0.018, transparent: true, opacity: 0.46 })
    );
    group.add(particles);

    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();
    const selectableNodes = Array.from(nodeMeshes.values());
    let frame = 0;

    const resize = () => {
      const { width, height } = stage.getBoundingClientRect();
      const safeWidth = Math.max(320, width);
      const safeHeight = Math.max(320, height);
      renderer.setSize(safeWidth, safeHeight, false);
      camera.aspect = safeWidth / safeHeight;
      camera.position.z = safeWidth < 720 ? 9.8 : 8.2;
      group.position.set(safeWidth < 720 ? 0.1 : 1.15, safeWidth < 720 ? -0.86 : -0.42, 0);
      group.scale.setScalar(safeWidth < 720 ? 0.44 : 0.56);
      camera.updateProjectionMatrix();
    };

    const updatePointer = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
      raycaster.setFromCamera(pointer, camera);
      return raycaster.intersectObjects(selectableNodes, false);
    };

    const handlePointerMove = (event: PointerEvent) => {
      canvas.style.cursor = updatePointer(event).length > 0 ? "pointer" : "grab";
    };

    const handlePointerDown = (event: PointerEvent) => {
      const [hit] = updatePointer(event);
      if (hit?.object.userData.key) {
        setSelectedKey(hit.object.userData.key as FlowNodeKey);
      }
    };

    const render = () => {
      frame = window.requestAnimationFrame(render);
      const now = performance.now() * 0.001;
      group.rotation.y = Math.sin(now * 0.22) * 0.06;
      particles.rotation.y = now * 0.025;

      FLOW_NODES.forEach((node, index) => {
        const mesh = nodeMeshes.get(node.key);
        const ring = ringMeshes.get(node.key);
        if (!mesh || !ring) return;
        const isSelected = selectedKeyRef.current === node.key;
        const pulse = 1 + Math.sin(now * 2.4 + index) * 0.045 + (isSelected ? 0.22 : 0);
        mesh.scale.setScalar(pulse);
        mesh.position.y = node.position[1] + Math.sin(now * 1.45 + index * 0.62) * 0.06;
        ring.position.copy(mesh.position);
        ring.rotation.z = now * (0.35 + index * 0.04);
        ring.scale.setScalar(isSelected ? 1.28 : 1);
        ring.material.opacity = isSelected ? 0.88 : 0.34;
      });

      pulses.forEach((pulse, index) => {
        const progress = (now * 0.18 + pulse.offset) % 1;
        const lift = Math.sin(progress * Math.PI) * (index % 2 === 0 ? 0.52 : -0.32);
        pulse.mesh.position.lerpVectors(pulse.start, pulse.end, progress);
        pulse.mesh.position.y += lift;
        pulse.mesh.scale.setScalar(0.85 + Math.sin(progress * Math.PI) * 0.85);
      });

      renderer.render(scene, camera);
    };

    resize();
    render();
    window.addEventListener("resize", resize);
    canvas.addEventListener("pointermove", handlePointerMove);
    canvas.addEventListener("pointerdown", handlePointerDown);

    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("resize", resize);
      canvas.removeEventListener("pointermove", handlePointerMove);
      canvas.removeEventListener("pointerdown", handlePointerDown);
      renderer.dispose();
      nodeGeometry.dispose();
      ringGeometry.dispose();
      pulseGeometry.dispose();
      lineMaterial.dispose();
      pulseMaterial.dispose();
      particles.geometry.dispose();
      (particles.material as THREE.Material).dispose();
      nodeMeshes.forEach((mesh) => mesh.material.dispose());
      ringMeshes.forEach((mesh) => mesh.material.dispose());
    };
  }, []);

  return (
    <section className="trace-stage" id="dashboard" aria-labelledby="trace-stage-title">
      <div className="trace-canvas-wrap" ref={stageRef}>
        <canvas ref={canvasRef} className="trace-canvas" aria-label="Interactive 3D disposal trace map" />
        {webglUnavailable && (
          <div className="trace-fallback" role="img" aria-label="Fallback animated disposal trace map">
            {FLOW_NODES.map((node, index) => (
              <span
                className={selectedKey === node.key ? "fallback-node selected" : "fallback-node"}
                key={node.key}
                style={{
                  "--fallback-color": `#${node.color.toString(16).padStart(6, "0")}`,
                  "--fallback-index": index
                } as CSSProperties}
              >
                {node.shortLabel}
              </span>
            ))}
          </div>
        )}
      </div>
      <div className="trace-copy">
        <p className="eyebrow">Interactive Three.js Trace</p>
        <h2 id="trace-stage-title">Follow one disposal from bin signal to EcoCredit truth.</h2>
        <p>
          Click the glowing nodes or use the chips below. The selected stage explains exactly where event{" "}
          <strong>{eventId}</strong> is in the system.
        </p>
        <div className="trace-state-row" aria-label="Live trace state">
          <StatusPill tone={transportState === "ACKED" ? "ok" : "warn"}>{transportState}</StatusPill>
          <StatusPill tone={decisionState === "ACCEPTED" ? "ok" : decisionState === "FLAGGED" ? "warn" : "neutral"}>
            {decisionState}
          </StatusPill>
          <StatusPill tone={edgeQueueCount === 0 ? "ok" : "info"}>{edgeQueueCount} queued</StatusPill>
          <StatusPill tone={pendingReviewCount === 0 ? "ok" : "warn"}>{pendingReviewCount} reviews</StatusPill>
          <StatusPill tone={devicesOnline === totalDevices ? "ok" : "warn"}>
            {devicesOnline}/{totalDevices} devices
          </StatusPill>
        </div>
      </div>
      <div className="trace-inspector" aria-live="polite">
        <span>{selectedNode.shortLabel}</span>
        <h3>{selectedNode.label}</h3>
        <p>{selectedNode.detail}</p>
        <strong>{selectedNode.metric}</strong>
      </div>
      <div className="trace-node-controls" aria-label="Select trace stage">
        {FLOW_NODES.map((node) => (
          <button
            aria-pressed={selectedKey === node.key}
            className={selectedKey === node.key ? "node-chip selected" : "node-chip"}
            key={node.key}
            onClick={() => setSelectedKey(node.key)}
            type="button"
          >
            {node.shortLabel}
          </button>
        ))}
      </div>
    </section>
  );
}
