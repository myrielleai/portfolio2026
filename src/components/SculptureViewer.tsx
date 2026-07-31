import { useEffect, useRef } from "react";
import * as THREE from "three";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useTheme } from "./ThemeContext";

// Architectural Module configs (beams, columns, slabs, blocks)
const moduleConfigs = [
  // Columns (vertical structures)
  { size: [0.12, 1.4, 0.12], pos: [-0.4, 0, -0.4], dir: [-0.8, 0.1, -0.8] },
  { size: [0.12, 1.4, 0.12], pos: [0.4, 0.2, 0.4], dir: [0.8, 0.1, 0.8] },
  { size: [0.12, 1.0, 0.12], pos: [-0.4, -0.2, 0.4], dir: [-0.8, -0.1, 0.8] },
  { size: [0.12, 1.0, 0.12], pos: [0.4, -0.4, -0.4], dir: [0.8, -0.1, -0.8] },

  // Beams (horizontal structural connectors)
  { size: [1.2, 0.12, 0.12], pos: [0, 0.6, 0], dir: [0, 0.8, 0.2] },
  { size: [1.2, 0.12, 0.12], pos: [0, -0.6, 0], dir: [0, -0.8, -0.2] },
  { size: [0.12, 0.12, 1.2], pos: [0.4, 0, 0], dir: [0.8, 0, 0] },
  { size: [0.12, 0.12, 1.2], pos: [-0.4, 0.2, 0], dir: [-0.8, 0.05, 0] },

  // Slabs / Planes (horizontal plates)
  { size: [0.9, 0.04, 0.9], pos: [0, 0.3, 0], dir: [0.1, 0.5, 0.1] },
  { size: [0.7, 0.04, 0.7], pos: [0, -0.2, 0], dir: [-0.1, -0.3, -0.1] },
  { size: [0.5, 0.04, 0.5], pos: [0, 0, 0], dir: [0.05, 0.05, 0.4] },

  // Solid Blocks
  { size: [0.3, 0.3, 0.3], pos: [-0.2, 0.4, 0.2], dir: [-0.4, 0.3, 0.3] },
  { size: [0.25, 0.25, 0.25], pos: [0.2, -0.4, -0.2], dir: [0.4, -0.3, -0.3] },
  { size: [0.2, 0.2, 0.2], pos: [0, 0.8, -0.3], dir: [0, 0.6, -0.4] }
];

// Inter-module network wires (indices from moduleConfigs)
const connections = [
  [0, 4], // Left-back column to top beam
  [1, 4], // Right-front column to top beam
  [2, 5], // Left-front column to bottom beam
  [3, 5], // Right-back column to bottom beam
  [0, 8], // Left-back column to upper slab
  [1, 8], // Right-front column to upper slab
  [2, 9], // Left-front column to lower slab
  [3, 9], // Right-back column to lower slab
  [11, 8], // Solid block to upper slab
  [12, 9]  // Solid block to lower slab
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

export default function SculptureViewer() {
  const containerRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const { theme } = useTheme();

  // References to groups for animation
  const sculptureGroupRef = useRef<THREE.Group | null>(null);
  const ringsGroupRef = useRef<THREE.Group | null>(null);
  const particlesRef = useRef<THREE.Points | null>(null);
  const scanRingRef = useRef<THREE.LineLoop | null>(null);
  const pointLightRef = useRef<THREE.PointLight | null>(null);

  // Keep track of mouse positions for smooth parallax camera motion
  const targetMouse = useRef({ x: 0, y: 0 });
  const currentMouse = useRef({ x: 0, y: 0 });

  // Scroll progress ref to drive the deconstruction effect
  const scrollProgressRef = useRef(0);

  // DOM refs to drive real-time technical HUD readings without React component re-renders
  const hudDeconstructRef = useRef<HTMLDivElement>(null);
  const hudRotRef = useRef<HTMLDivElement>(null);
  const hudAlignRef = useRef<HTMLDivElement>(null);
  const hudCoordsXRef = useRef<HTMLDivElement>(null);
  const hudCoordsYRef = useRef<HTMLDivElement>(null);
  const hudCoordsZRef = useRef<HTMLDivElement>(null);
  const hudModulesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current || !wrapperRef.current) return;

    const container = containerRef.current;
    const wrapper = wrapperRef.current;
    gsap.registerPlugin(ScrollTrigger);

    // Initial color scheme parameters depending on theme
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
      65,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 0, 3.2);
    cameraRef.current = camera;

    // --- Renderer Setup ---
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // --- Lighting ---
    const ambientLight = new THREE.AmbientLight(0xffffff, isDark ? 0.85 : 1.25);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(accentColorVal, isDark ? 4.5 : 3.0, 10);
    pointLight.position.set(3, 3, 3);
    scene.add(pointLight);
    pointLightRef.current = pointLight;

    const directionalLight = new THREE.DirectionalLight(0xffffff, isDark ? 0.6 : 0.8);
    directionalLight.position.set(-5, 5, 2);
    scene.add(directionalLight);

    // --- Core Sculpture Group ---
    const sculptureGroup = new THREE.Group();
    scene.add(sculptureGroup);
    sculptureGroupRef.current = sculptureGroup;

    // Materials - MeshStandardMaterial without heavy transmission framebuffer passes
    const boxMaterial = new THREE.MeshStandardMaterial({
      color: meshColorVal,
      roughness: 0.25,
      metalness: 0.1,
      transparent: true,
      opacity: isDark ? 0.55 : 0.35,
      depthWrite: false,
    });

    const lineMaterial = new THREE.LineBasicMaterial({
      color: lineColorVal,
      transparent: true,
      opacity: isDark ? 0.7 : 0.8,
    });

    // Create architectural modules inside group
    const modules: {
      mesh: THREE.Mesh;
      edges: THREE.LineSegments;
      initialPos: THREE.Vector3;
      offsetDir: THREE.Vector3;
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
        offsetDir: new THREE.Vector3(cfg.dir[0], cfg.dir[1], cfg.dir[2]).normalize(),
        floatSpeed: 0.6 + (index % 5) * 0.15,
        floatAmp: 0.03 + (index % 3) * 0.015,
        floatPhase: index * 0.45
      });
    });

    // --- Dynamic Network Wires ---
    const wireMaterial = new THREE.LineBasicMaterial({
      color: accentColorVal,
      transparent: true,
      opacity: isDark ? 0.45 : 0.55,
      blending: THREE.AdditiveBlending,
    });

    const connectionGeometry = new THREE.BufferGeometry();
    const connectionPositions = new Float32Array(connections.length * 6);
    connectionGeometry.setAttribute(
      "position",
      new THREE.BufferAttribute(connectionPositions, 3)
    );
    const connectionLines = new THREE.LineSegments(connectionGeometry, wireMaterial);
    sculptureGroup.add(connectionLines);

    // --- Concentric Orbital Rings ---
    const ringsGroup = new THREE.Group();
    scene.add(ringsGroup);
    ringsGroupRef.current = ringsGroup;

    const ringMaterial = new THREE.LineBasicMaterial({
      color: ringColorVal,
      transparent: true,
      opacity: 0.35,
    });

    const ringGeom1 = createCircleGeometry(1.6);
    const ring1 = new THREE.LineLoop(ringGeom1, ringMaterial);
    ring1.rotation.x = Math.PI / 2.3;
    ringsGroup.add(ring1);

    const ringGeom2 = createCircleGeometry(2.0);
    const ring2 = new THREE.LineLoop(ringGeom2, ringMaterial);
    ring2.rotation.y = Math.PI / 4;
    ringsGroup.add(ring2);

    const ringGeom3 = createCircleGeometry(2.4);
    const ring3 = new THREE.LineLoop(ringGeom3, ringMaterial);
    ring3.rotation.z = Math.PI / 6;
    ringsGroup.add(ring3);

    // --- Particle System ---
    const particleCount = 140;
    const particleGeometry = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i += 3) {
      // Position particles in a spherical dust cloud around the sculpture
      const u = Math.random();
      const v = Math.random();
      const theta = u * 2.0 * Math.PI;
      const phi = Math.acos(2.0 * v - 1.0);
      const r = 1.8 + Math.random() * 2.2;

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
      size: 0.035,
      transparent: true,
      opacity: 0.75,
      sizeAttenuation: true,
    });

    const particles = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particles);
    particlesRef.current = particles;

    // --- Scientific Scanning Laser Ring ---
    const scanRingGeom = createCircleGeometry(1.3, 48);
    const scanRingMat = new THREE.LineBasicMaterial({
      color: accentColorVal,
      transparent: true,
      opacity: 0.65,
      blending: THREE.AdditiveBlending
    });
    const scanRing = new THREE.LineLoop(scanRingGeom, scanRingMat);
    scanRing.rotation.x = Math.PI / 2;
    scene.add(scanRing);
    scanRingRef.current = scanRing;

    // --- ScrollTrigger Integration ---
    const updateVisibilityAndProgress = (progress: number) => {
      scrollProgressRef.current = progress;
      if (wrapper) {
        // Stay fully visible, then fade out cleanly over the final part of scroll
        const exitFade = Math.max(0, Math.min(1, (1 - progress) * 12));
        wrapper.style.opacity = exitFade.toString();
        wrapper.style.visibility = progress >= 0.99 ? "hidden" : "visible";
      }
    };

    const trigger = ScrollTrigger.create({
      trigger: "#showcase",
      start: "top top",
      end: "bottom bottom",
      scrub: true,
      onUpdate: (self) => {
        updateVisibilityAndProgress(self.progress);
      },
      onEnter: () => {
        if (wrapper) wrapper.style.visibility = "visible";
      },
      onLeave: () => {
        if (wrapper) {
          wrapper.style.opacity = "0";
          wrapper.style.visibility = "hidden";
        }
      },
      onEnterBack: (self) => {
        if (wrapper) wrapper.style.visibility = "visible";
        updateVisibilityAndProgress(self.progress);
      },
      onLeaveBack: () => {
        updateVisibilityAndProgress(0);
      },
    });

    // --- Mouse Move Parallax Listener ---
    const handleMouseMove = (event: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      if (!rect) return;
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;
      targetMouse.current = { x, y };
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
    let animationFrameId: number | null = null;
    const clock = new THREE.Clock();
    let frameCount = 0;
    let isIntersecting = false;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      frameCount++;

      const time = clock.getElapsedTime();
      const progress = scrollProgressRef.current;

      // 1. Update module positions: float + deconstruct (explode)
      modules.forEach((mod) => {
        const deconstructFactor = progress * 3.2;
        const drift = mod.offsetDir.clone().multiplyScalar(deconstructFactor);
        const floatY = Math.sin(time * mod.floatSpeed + mod.floatPhase) * mod.floatAmp;

        const targetPos = mod.initialPos.clone().add(drift);
        targetPos.y += floatY;

        mod.mesh.position.copy(targetPos);
        mod.edges.position.copy(targetPos);
      });

      // 2. Update network connecting lines
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

      // 3. Rotate whole sculpture and technical rings
      if (sculptureGroup) {
        sculptureGroup.rotation.y = time * 0.12 + progress * Math.PI * 0.5;
        sculptureGroup.rotation.x = Math.sin(time * 0.05) * 0.15 + progress * 0.3;
      }

      if (ringsGroup) {
        ringsGroup.rotation.y = -time * 0.08;
        ringsGroup.rotation.x = time * 0.05;
        ringsGroup.rotation.z = Math.sin(time * 0.1) * 0.1;
      }

      if (particles) {
        particles.rotation.y = time * 0.03;
        particles.rotation.z = time * 0.01;
      }

      // 4. Update Scientific Scanning Laser Ring
      if (scanRing) {
        scanRing.position.y = Math.sin(time * 1.6) * 1.5;
        const scaleVal = 1.0 + Math.abs(scanRing.position.y) * 0.14;
        scanRing.scale.setScalar(scaleVal);
      }

      // 5. Lerp mouse positions for smooth camera parallax
      currentMouse.current.x += (targetMouse.current.x - currentMouse.current.x) * 0.07;
      currentMouse.current.y += (targetMouse.current.y - currentMouse.current.y) * 0.07;

      const parallaxAmount = 0.5;
      camera.position.x = currentMouse.current.x * parallaxAmount;
      camera.position.y = currentMouse.current.y * parallaxAmount;
      camera.lookAt(0, 0, 0);

      // 6. Update HUD Stats directly via DOM refs to avoid React re-renders
      if (frameCount % 6 === 0) {
        if (hudDeconstructRef.current) hudDeconstructRef.current.textContent = `DECONSTRUCT_VAL: ${progress.toFixed(4)}`;
        if (hudRotRef.current) hudRotRef.current.textContent = `ROT_VELOCITY: ${(0.12 + progress * 0.2).toFixed(3)} rad/s`;
        if (hudAlignRef.current) hudAlignRef.current.textContent = `SYS_GRID_ALIGN: ${(99.8 - progress * 1.2).toFixed(1)}%`;
        if (hudCoordsXRef.current) hudCoordsXRef.current.textContent = `COORDS_X: ${camera.position.x.toFixed(3)}`;
        if (hudCoordsYRef.current) hudCoordsYRef.current.textContent = `COORDS_Y: ${camera.position.y.toFixed(3)}`;
        if (hudCoordsZRef.current) hudCoordsZRef.current.textContent = `COORDS_Z: ${camera.position.z.toFixed(3)}`;
        if (hudModulesRef.current) hudModulesRef.current.textContent = `UNITS_ASSEMBLED: ${14 - Math.floor(progress * 4)}/14`;
      }

      renderer.render(scene, camera);
    };

    // Use IntersectionObserver to start/stop the loop when hero section is in view
    const showcaseElem = document.getElementById("showcase") || container;
    const observer = new IntersectionObserver(
      ([entry]) => {
        isIntersecting = entry.isIntersecting;
        if (isIntersecting) {
          if (!animationFrameId) {
            clock.start();
            animate();
          }
        } else {
          if (animationFrameId) {
            cancelAnimationFrame(animationFrameId);
            animationFrameId = null;
            clock.stop();
          }
        }
      },
      { threshold: 0.01 }
    );
    observer.observe(showcaseElem);

    // Clean up
    return () => {
      trigger.kill();
      observer.disconnect();
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }

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
      ringGeom3.dispose();
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
    <div
      ref={wrapperRef}
      className="fixed inset-0 w-full h-full pointer-events-none overflow-hidden select-none z-0"
    >
      {/* 3D WebGL Canvas container */}
      <div
        ref={containerRef}
        className="w-full h-full absolute inset-0 pointer-events-none"
      />

      {/* Futuristic Technical HUD Overlay - Top Left */}
      <div className="fixed top-24 left-6 sm:left-10 lg:left-12 z-10 font-mono text-[9px] sm:text-[10px] text-[var(--text-muted)] tracking-[0.15em] leading-[1.7] uppercase opacity-75 hidden sm:block">
        <div className="flex items-center gap-2 border-b border-[var(--border)]/40 pb-1 mb-1 text-[var(--heading)]">
          <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)] animate-pulse" />
          <span>SYS.MONITOR: COMP-SCULPT</span>
        </div>
        <div ref={hudDeconstructRef}>DECONSTRUCT_VAL: 0.0000</div>
        <div ref={hudRotRef}>ROT_VELOCITY: 0.120 rad/s</div>
        <div ref={hudAlignRef}>SYS_GRID_ALIGN: 99.8%</div>
      </div>

      {/* Futuristic Technical HUD Overlay - Bottom Right */}
      <div className="fixed bottom-12 right-6 sm:right-10 lg:right-12 z-10 font-mono text-[9px] sm:text-[10px] text-[var(--text-muted)] tracking-[0.15em] leading-[1.7] uppercase text-right opacity-75 hidden sm:block">
        <div ref={hudCoordsXRef}>COORDS_X: 0.000</div>
        <div ref={hudCoordsYRef}>COORDS_Y: 0.000</div>
        <div ref={hudCoordsZRef}>COORDS_Z: 3.200</div>
        <div ref={hudModulesRef} className="border-t border-[var(--border)]/40 pt-1 mt-1 text-[var(--heading)]">
          UNITS_ASSEMBLED: 14/14
        </div>
      </div>

      {/* Abstract Design Studio grid watermark lines overlay */}
      <div className="absolute inset-0 z-0 bg-transparent border-x border-[var(--border)]/15 pointer-events-none max-w-7xl mx-auto w-full" />
    </div>
  );
}
