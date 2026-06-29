import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { useTheme } from "./ThemeContext";

// Abstract Architectural Module configs for the footer sculpture
const moduleConfigs = [
  { size: [0.08, 0.9, 0.08], pos: [-0.25, 0, -0.25], dir: [-0.4, 0.15, -0.4] },
  { size: [0.08, 0.9, 0.08], pos: [0.25, 0.1, 0.25], dir: [0.4, 0.15, 0.4] },
  { size: [0.08, 0.7, 0.08], pos: [-0.25, -0.1, 0.25], dir: [-0.4, -0.15, 0.4] },
  { size: [0.08, 0.7, 0.08], pos: [0.25, -0.2, -0.25], dir: [0.4, -0.15, -0.25] },

  // Beams
  { size: [0.7, 0.06, 0.06], pos: [0, 0.35, 0], dir: [0, 0.4, 0.15] },
  { size: [0.7, 0.06, 0.06], pos: [0, -0.35, 0], dir: [0, -0.4, -0.15] },
  { size: [0.06, 0.06, 0.7], pos: [0.25, 0, 0], dir: [0.4, 0, 0] },
  { size: [0.06, 0.06, 0.7], pos: [-0.25, 0.05, 0], dir: [-0.4, 0.05, 0] },

  // Slabs
  { size: [0.5, 0.03, 0.5], pos: [0, 0.15, 0], dir: [0.1, 0.25, 0.1] },
  { size: [0.4, 0.03, 0.4], pos: [0, -0.15, 0], dir: [-0.1, -0.25, -0.1] },

  // Blocks
  { size: [0.15, 0.15, 0.15], pos: [-0.12, 0.2, 0.12], dir: [-0.2, 0.1, 0.1] },
  { size: [0.12, 0.12, 0.12], pos: [0.12, -0.2, -0.12], dir: [0.2, -0.1, -0.1] }
];

const connections = [
  [0, 4],
  [1, 4],
  [2, 5],
  [3, 5],
  [0, 8],
  [1, 8],
  [2, 9],
  [3, 9]
];

// Helper to create circular geometries for orbital rings
const createCircleGeometry = (radius: number, segments = 64) => {
  const geom = new THREE.BufferGeometry();
  const vertices = [];
  for (let i = 0; i <= segments; i++) {
    const theta = (i / segments) * Math.PI * 2;
    vertices.push(Math.cos(theta) * radius, Math.sin(theta) * radius, 0);
  }
  geom.setAttribute("position", new THREE.Float32BufferAttribute(vertices, 3));
  return geom;
};

export default function FooterSculpture() {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const { theme } = useTheme();

  // References to groups for animation
  const sculptureGroupRef = useRef<THREE.Group | null>(null);
  const ringsGroupRef = useRef<THREE.Group | null>(null);
  const particlesRef = useRef<THREE.Points | null>(null);
  const scanRingRef = useRef<THREE.LineLoop | null>(null);

  // Mouse hover tracking for parallax camera motion (local to footer section)
  const targetMouse = useRef({ x: 0, y: 0 });
  const currentMouse = useRef({ x: 0, y: 0 });

  // HUD stats overlay states
  const [hudStats, setHudStats] = useState({
    rotation: "0.08",
    activeNodes: "12/12",
    alignment: "99.9%",
    scanLevel: "0.00"
  });

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const isDark = theme === "dark";

    const meshColorVal = isDark ? 0x09090b : 0xf4f4f5;
    const lineColorVal = isDark ? 0xffffff : 0x18181b;
    const particleColorVal = isDark ? 0xc084fc : 0x9333ea;
    const ringColorVal = isDark ? 0x71717a : 0xa1a1aa;
    const accentColorVal = isDark ? 0xc084fc : 0x9333ea;

    // --- Scene Setup ---
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // --- Camera Setup ---
    const camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 0, 2.6);
    cameraRef.current = camera;

    // --- Renderer Setup ---
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // --- Lighting ---
    const ambientLight = new THREE.AmbientLight(0xffffff, isDark ? 0.9 : 1.3);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(accentColorVal, isDark ? 5.0 : 3.5, 8);
    pointLight.position.set(2, 2, 2);
    scene.add(pointLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, isDark ? 0.5 : 0.8);
    directionalLight.position.set(-3, 3, 1);
    scene.add(directionalLight);

    // --- Sculpture Group ---
    const sculptureGroup = new THREE.Group();
    scene.add(sculptureGroup);
    sculptureGroupRef.current = sculptureGroup;

    // Materials
    const boxMaterial = new THREE.MeshPhysicalMaterial({
      color: meshColorVal,
      roughness: 0.1,
      metalness: 0.1,
      transmission: 0.8,
      ior: 1.5,
      thickness: 0.4,
      transparent: true,
      opacity: isDark ? 0.6 : 0.4,
      depthWrite: false
    });

    const lineMaterial = new THREE.LineBasicMaterial({
      color: lineColorVal,
      transparent: true,
      opacity: isDark ? 0.6 : 0.8
    });

    const modules: {
      mesh: THREE.Mesh;
      edges: THREE.LineSegments;
      initialPos: THREE.Vector3;
      floatSpeed: number;
      floatAmp: number;
      floatPhase: number;
    }[] = [];

    moduleConfigs.forEach((cfg, index) => {
      const geom = new THREE.BoxGeometry(cfg.size[0], cfg.size[1], cfg.size[2]);
      const mesh = new THREE.Mesh(geom, boxMaterial);
      mesh.position.set(cfg.pos[0], cfg.pos[1], cfg.pos[2]);

      const edgeGeom = new THREE.EdgesGeometry(geom);
      const edges = new THREE.LineSegments(edgeGeom, lineMaterial);
      edges.position.copy(mesh.position);

      sculptureGroup.add(mesh);
      sculptureGroup.add(edges);

      modules.push({
        mesh,
        edges,
        initialPos: new THREE.Vector3(cfg.pos[0], cfg.pos[1], cfg.pos[2]),
        floatSpeed: 0.8 + (index % 4) * 0.2,
        floatAmp: 0.02 + (index % 3) * 0.01,
        floatPhase: index * 0.5
      });
    });

    // --- Connections ---
    const wireMaterial = new THREE.LineBasicMaterial({
      color: accentColorVal,
      transparent: true,
      opacity: isDark ? 0.4 : 0.5,
      blending: THREE.AdditiveBlending
    });

    const connectionGeometry = new THREE.BufferGeometry();
    const connectionPositions = new Float32Array(connections.length * 6);
    connectionGeometry.setAttribute(
      "position",
      new THREE.BufferAttribute(connectionPositions, 3)
    );
    const connectionLines = new THREE.LineSegments(connectionGeometry, wireMaterial);
    sculptureGroup.add(connectionLines);

    // --- Orbital Rings ---
    const ringsGroup = new THREE.Group();
    scene.add(ringsGroup);
    ringsGroupRef.current = ringsGroup;

    const ringMaterial = new THREE.LineBasicMaterial({
      color: ringColorVal,
      transparent: true,
      opacity: 0.3
    });

    const ringGeom1 = createCircleGeometry(1.2);
    const ring1 = new THREE.LineLoop(ringGeom1, ringMaterial);
    ring1.rotation.x = Math.PI / 2.2;
    ringsGroup.add(ring1);

    const ringGeom2 = createCircleGeometry(1.5);
    const ring2 = new THREE.LineLoop(ringGeom2, ringMaterial);
    ring2.rotation.y = Math.PI / 4.5;
    ringsGroup.add(ring2);

    // --- Particle System ---
    const particleCount = 75;
    const particleGeometry = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i += 3) {
      const u = Math.random();
      const v = Math.random();
      const theta = u * 2.0 * Math.PI;
      const phi = Math.acos(2.0 * v - 1.0);
      const r = 1.2 + Math.random() * 1.0;

      particlePositions[i] = r * Math.sin(phi) * Math.cos(theta);
      particlePositions[i + 1] = r * Math.sin(phi) * Math.sin(theta);
      particlePositions[i + 2] = r * Math.cos(phi);
    }

    particleGeometry.setAttribute(
      "position",
      new THREE.BufferAttribute(particlePositions, 3)
    );

    const particleMaterial = new THREE.PointsMaterial({
      color: particleColorVal,
      size: 0.025,
      transparent: true,
      opacity: 0.7,
      sizeAttenuation: true
    });

    const particles = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particles);
    particlesRef.current = particles;

    // --- Scanning Laser Ring ---
    const scanRingGeom = createCircleGeometry(0.9, 32);
    const scanRingMat = new THREE.LineBasicMaterial({
      color: accentColorVal,
      transparent: true,
      opacity: 0.5,
      blending: THREE.AdditiveBlending
    });
    const scanRing = new THREE.LineLoop(scanRingGeom, scanRingMat);
    scanRing.rotation.x = Math.PI / 2;
    scene.add(scanRing);
    scanRingRef.current = scanRing;

    // --- Mouse Move Listener restricted to footer zone ---
    const handleMouseMove = (event: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      if (!rect) return;
      // Parallax active within reasonable window space, centered relative to the container
      const x = (event.clientX - (rect.left + rect.width / 2)) / window.innerWidth;
      const y = (event.clientY - (rect.top + rect.height / 2)) / window.innerHeight;
      targetMouse.current = { x: x * 1.5, y: y * 1.5 };
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });

    // --- Resize Handler ---
    const handleResize = () => {
      if (!container || !cameraRef.current || !rendererRef.current) return;
      const width = container.clientWidth;
      const height = container.clientHeight;

      cameraRef.current.aspect = width / height;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(width, height);
    };
    window.addEventListener("resize", handleResize);

    // --- Animation Loop ---
    let animationFrameId: number;
    const clock = new THREE.Clock();
    let frameCount = 0;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      frameCount++;

      const time = clock.getElapsedTime();

      // 1. Update module position floating drift
      modules.forEach((mod) => {
        const floatY = Math.sin(time * mod.floatSpeed + mod.floatPhase) * mod.floatAmp;
        const targetPos = mod.initialPos.clone();
        targetPos.y += floatY;
        mod.mesh.position.copy(targetPos);
        mod.edges.position.copy(targetPos);
      });

      // 2. Update connection lines
      const positions = connectionGeometry.attributes.position.array as Float32Array;
      connections.forEach((conn, i) => {
        const modA = modules[conn[0]];
        const modB = modules[conn[1]];

        if (modA && modB) {
          positions[i * 6] = modA.mesh.position.x;
          positions[i * 6 + 1] = modA.mesh.position.y;
          positions[i * 6 + 2] = modA.mesh.position.z;

          positions[i * 6 + 3] = modB.mesh.position.x;
          positions[i * 6 + 4] = modB.mesh.position.y;
          positions[i * 6 + 5] = modB.mesh.position.z;
        }
      });
      connectionGeometry.attributes.position.needsUpdate = true;

      // 3. Rotate assemblies
      if (sculptureGroup) {
        sculptureGroup.rotation.y = time * 0.08;
        sculptureGroup.rotation.x = Math.sin(time * 0.04) * 0.1;
      }

      if (ringsGroup) {
        ringsGroup.rotation.y = -time * 0.05;
        ringsGroup.rotation.x = time * 0.03;
      }

      if (particles) {
        particles.rotation.y = time * 0.02;
      }

      // 4. Update laser scanning ring
      if (scanRing) {
        scanRing.position.y = Math.sin(time * 1.2) * 1.0;
        const scaleVal = 0.8 + Math.abs(scanRing.position.y) * 0.12;
        scanRing.scale.setScalar(scaleVal);
      }

      // 5. Lerp mouse positions for smooth camera parallax
      currentMouse.current.x += (targetMouse.current.x - currentMouse.current.x) * 0.05;
      currentMouse.current.y += (targetMouse.current.y - currentMouse.current.y) * 0.05;

      const parallaxAmount = 0.45;
      camera.position.x = currentMouse.current.x * parallaxAmount;
      camera.position.y = currentMouse.current.y * parallaxAmount;
      camera.lookAt(0, 0, 0);

      // 6. Update HUD readings
      if (frameCount % 10 === 0) {
        setHudStats({
          rotation: (0.08).toFixed(3),
          activeNodes: "12/12",
          alignment: (99.8 + Math.sin(time * 2) * 0.15).toFixed(2) + "%",
          scanLevel: Math.abs(scanRing ? scanRing.position.y : 0).toFixed(3)
        });
      }

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);

      boxMaterial.dispose();
      lineMaterial.dispose();
      wireMaterial.dispose();
      ringMaterial.dispose();
      particleMaterial.dispose();
      scanRingMat.dispose();
      connectionGeometry.dispose();
      particleGeometry.dispose();
      ringGeom1.dispose();
      ringGeom2.dispose();
      scanRingGeom.dispose();

      modules.forEach((mod) => {
        mod.mesh.geometry.dispose();
        mod.edges.geometry.dispose();
      });

      if (container && rendererRef.current) {
        try {
          container.removeChild(rendererRef.current.domElement);
        } catch {
          // ignore
        }
      }
      renderer.dispose();
    };
  }, [theme]);

  return (
    <div className="relative w-full h-full min-h-[300px] flex items-center justify-center overflow-hidden rounded-xl border border-[var(--border)]/30 bg-[var(--bg-muted)]/10 backdrop-blur-[2px]">
      
      {/* Canvas container */}
      <div ref={containerRef} className="absolute inset-0 w-full h-full z-0" />

      {/* Decorative fine scanning lines */}
      <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-[var(--accent)]/30 to-transparent animate-pulse" />
      <div className="absolute inset-y-0 left-0 w-[1px] bg-gradient-to-b from-transparent via-[var(--accent)]/10 to-transparent" />

      {/* Technical HUD Details overlay */}
      <div className="absolute top-4 left-4 z-10 font-mono text-[8px] text-[var(--text-muted)] tracking-wider leading-relaxed pointer-events-none select-none uppercase opacity-80">
        <div className="flex items-center gap-1.5 text-[var(--accent)] font-semibold mb-1">
          <span className="w-1 h-1 rounded-full bg-[var(--accent)] animate-ping" />
          <span>SYS.SUBSEC: FOOTER_GEOM</span>
        </div>
        <div>ROT_SPD: {hudStats.rotation} rad/s</div>
        <div>ALIGN: {hudStats.alignment}</div>
        <div>SCAN_LVL: {hudStats.scanLevel}</div>
      </div>

      <div className="absolute bottom-4 right-4 z-10 font-mono text-[8px] text-[var(--text-muted)] tracking-wider pointer-events-none select-none uppercase opacity-80 text-right">
        <div>NODES: {hudStats.activeNodes}</div>
        <div>STATUS: STABLE_MONITOR</div>
      </div>

      {/* Retro target grid lines corner decoration */}
      <div className="absolute top-3 right-3 w-2 h-2 border-t border-r border-[var(--border)]/40 pointer-events-none" />
      <div className="absolute bottom-3 left-3 w-2 h-2 border-b border-l border-[var(--border)]/40 pointer-events-none" />
    </div>
  );
}
