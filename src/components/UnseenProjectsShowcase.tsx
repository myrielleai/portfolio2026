import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ExternalLink, Sparkles, X, ChevronRight, Layers, MoveVertical, Box } from "lucide-react";
import * as THREE from "three";
import Lenis from "lenis";
import { GithubIcon } from "./Icons";
import type { WorkCategory, WorkItem } from "../data/worksData";

/**
 * =========================================================================
 * 3D WORLD COORDINATE CONVERSION & UNSEEN STUDIO ENGINE MATH
 * =========================================================================
 * 
 * 1. Perspective Camera Viewport Calculations:
 *    Three.js units are unitless 3D vector coordinates (x, y, z).
 *    To map DOM pixels (e.g., width 400px) directly to 3D mesh dimensions:
 * 
 *    fovRad = (camera.fov * Math.PI) / 180;
 *    distance = camera.position.z - plane.position.z;
 *    
 *    visibleHeightIn3D = 2 * Math.tan(fovRad / 2) * distance;
 *    visibleWidthIn3D  = visibleHeightIn3D * camera.aspect;
 * 
 *    pixelsToWorldX = visibleWidthIn3D / window.innerWidth;
 *    pixelsToWorldY = visibleHeightIn3D / window.innerHeight;
 * 
 * 2. Scroll Velocity & Z Depth Gliding:
 *    As Lenis updates target scroll offset:
 *    - Velocity: velocity = (currentScroll - previousScroll)
 *    - Vertical translation: plane.position.y = basePosY + scrollY * factor
 *    - Depth translation: plane.position.z = basePosZ + Math.sin(index + scrollY * 0.001) * depthAmplitude
 * 
 * 3. Multi-Plane Layering & Difference Blend:
 *    - Canvas at position: fixed, z-index: 1
 *    - Bold Typography Overlay at position: fixed, z-index: 10 with mix-blend-mode: difference
 *    - Text color #FFFFFF inverts colors dynamically as project planes slide beneath!
 * =========================================================================
 */

interface UnseenProjectsShowcaseProps {
  category: WorkCategory;
  categories: WorkCategory[];
  onSelectCategory: (categoryId: string) => void;
  onClose: () => void;
  embedded?: boolean;
  onToggleFullscreen?: () => void;
}

// GLSL Vertex Shader: Applies scroll velocity wave deformation and mouse tilt
const vertexShader = `
  uniform float uScrollVelocity;
  uniform float uTime;
  uniform vec2 uMouse;

  varying vec2 vUv;
  varying float vWave;

  void main() {
    vUv = uv;
    vec3 pos = position;

    // Curved plane wave deformation on scroll momentum
    float distFromCenter = distance(uv, vec2(0.5));
    float wave = sin(pos.y * 2.2 + uTime * 2.5) * uScrollVelocity * 0.14;
    float bend = (uv.y - 0.5) * (uv.y - 0.5) * uScrollVelocity * 0.18;
    
    pos.z += wave - bend;

    // Inertial mouse displacement across plane surface
    pos.z += (uMouse.x * (uv.x - 0.5) - uMouse.y * (uv.y - 0.5)) * 0.35;

    vWave = wave + bend;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`;

// GLSL Fragment Shader: Texture sampling with chromatic aberration on scroll speed
const fragmentShader = `
  uniform sampler2D uTexture;
  uniform float uHasTexture;
  uniform vec3 uFallbackColor;
  uniform float uScrollVelocity;
  uniform float uHover;
  uniform float uTime;

  varying vec2 vUv;
  varying float vWave;

  void main() {
    vec2 uv = vUv;

    // RGB shift chromatic aberration driven by scroll velocity and hover inertia
    float shift = clamp(abs(uScrollVelocity) * 0.012 + uHover * 0.008, 0.0, 0.04);
    
    vec4 color = vec4(0.0);
    if (uHasTexture > 0.5) {
      float r = texture2D(uTexture, uv + vec2(shift, 0.0)).r;
      float g = texture2D(uTexture, uv).g;
      float b = texture2D(uTexture, uv - vec2(shift, 0.0)).b;
      float a = texture2D(uTexture, uv).a;
      color = vec4(r, g, b, a);
    } else {
      // Procedural metallic dark gradient fallback
      float grad = uv.y * 0.7 + 0.15 + sin(uv.x * 8.0 + uTime * 1.5) * 0.08;
      color = vec4(uFallbackColor * grad, 1.0);
    }

    // Subtle edge vignette
    vec2 d = abs(uv - 0.5) * 2.0;
    float edge = smoothstep(0.82, 1.0, max(d.x, d.y));
    color.rgb = mix(color.rgb, vec3(0.01, 0.01, 0.03), edge * 0.55);

    // Hover boost highlight
    color.rgb += vec3(uHover * 0.15);

    gl_FragColor = color;
  }
`;

// Category-themed fallback RGB color tones for meshes before texture load
const fallbackColors: Record<string, THREE.Vector3> = {
  websites: new THREE.Vector3(0.57, 0.20, 0.92), // Purple accent
  models3d: new THREE.Vector3(0.20, 0.70, 0.95),  // Cyan accent
  artworks: new THREE.Vector3(0.95, 0.35, 0.55),  // Rose accent
  achievements: new THREE.Vector3(0.95, 0.65, 0.20) // Amber accent
};

export default function UnseenProjectsShowcase({
  category,
  categories,
  onSelectCategory,
  onClose,
  embedded = false,
  onToggleFullscreen,
}: UnseenProjectsShowcaseProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);

  const [activeItem, setActiveItem] = useState<WorkItem | null>(null);
  const [scrollSpeedDisplay, setScrollSpeedDisplay] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [hoveredProjectTitle, setHoveredProjectTitle] = useState<string | null>(null);

  const lastProgressRef = useRef(-1);
  const lastSpeedRef = useRef(-1);

  // Refs for animation loop state tracking
  const stateRef = useRef({
    scrollPos: 0,
    targetScrollPos: 0,
    velocity: 0,
    mouse: { x: 0, y: 0 },
    targetMouse: { x: 0, y: 0 },
    hoveredIndex: -1,
  });

  // Scene object references
  const sceneRef = useRef<{
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    renderer: THREE.WebGLRenderer;
    meshes: THREE.Mesh[];
    materials: THREE.ShaderMaterial[];
    raycaster: THREE.Raycaster;
    mouseVec: THREE.Vector2;
    lenis: Lenis | null;
    animationFrameId: number | null;
  } | null>(null);

  // Build Three.js 3D multi-plane scene and Lenis smooth scroll momentum engine
  useEffect(() => {
    if (!canvasRef.current || !containerRef.current) return;
    let isMounted = true;

    const canvas = canvasRef.current;
    const container = containerRef.current;
    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    // 1. Initialize Scene & Perspective Camera
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xffffff); // Pure white background for works archive

    const fov = 45;
    const camera = new THREE.PerspectiveCamera(fov, width / (height || 1), 0.1, 100);
    camera.position.set(0, 0, 9); // Set camera at Z = 9

    // 2. Initialize WebGL Renderer
    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: false,
      powerPreference: "high-performance",
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // 3. Texture Loader & Mesh Creation for items
    const textureLoader = new THREE.TextureLoader();
    const meshes: THREE.Mesh[] = [];
    const materials: THREE.ShaderMaterial[] = [];

    const items = category.items;
    const numItems = items.length;

    // Plane 3D Dimensions calculated from viewport camera aspect
    const distanceToPlane = camera.position.z;
    const vFOV = (fov * Math.PI) / 180;
    const visibleHeightAtZ0 = 2 * Math.tan(vFOV / 2) * distanceToPlane;
    const visibleWidthAtZ0 = visibleHeightAtZ0 * camera.aspect;

    // Standard project plane dimensions in 3D world units
    const planeWidth = Math.min(visibleWidthAtZ0 * 0.42, 4.2);
    const planeHeight = planeWidth * (10 / 16);
    const planeGeometry = new THREE.PlaneGeometry(planeWidth, planeHeight, 36, 36);

    const fallbackVec = fallbackColors[category.id] || new THREE.Vector3(0.57, 0.20, 0.92);

    items.forEach((item, index) => {
      const mat = new THREE.ShaderMaterial({
        vertexShader,
        fragmentShader,
        uniforms: {
          uTexture: { value: null },
          uHasTexture: { value: 0 },
          uFallbackColor: { value: fallbackVec },
          uScrollVelocity: { value: 0 },
          uHover: { value: 0 },
          uTime: { value: 0 },
          uMouse: { value: new THREE.Vector2(0, 0) },
        },
        transparent: true,
        side: THREE.DoubleSide,
      });

      if (item.image) {
        textureLoader.load(
          item.image,
          (tex) => {
            if (!isMounted) return;
            tex.minFilter = THREE.LinearFilter;
            tex.generateMipmaps = false;
            mat.uniforms.uTexture.value = tex;
            mat.uniforms.uHasTexture.value = 1;
          },
          undefined,
          () => {
            if (!isMounted) return;
            mat.uniforms.uHasTexture.value = 0;
          }
        );
      }

      const mesh = new THREE.Mesh(planeGeometry, mat);
      mesh.userData = { item, index };

      const xOffset = (index % 2 === 0 ? -1 : 1) * (visibleWidthAtZ0 * 0.16);
      const zOffset = (index % 2 === 0 ? 0.3 : -0.4) - index * 0.15;
      mesh.position.set(xOffset, 0, zOffset);

      scene.add(mesh);
      meshes.push(mesh);
      materials.push(mat);
    });

    const raycaster = new THREE.Raycaster();
    const mouseVec = new THREE.Vector2(-999, -999);

    // 4. Initialize Lenis Smooth Scroll (if in scroll container or window scroll)
    let lenis: Lenis | null = null;
    if (scrollContainerRef.current) {
      lenis = new Lenis({
        wrapper: scrollContainerRef.current,
        content: scrollContainerRef.current.firstElementChild as HTMLElement,
        duration: 1.1,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
        wheelMultiplier: 1.1,
        touchMultiplier: 1.5,
      });

      lenis.on("scroll", (e: { scroll: number; velocity: number }) => {
        stateRef.current.targetScrollPos = e.scroll;
        stateRef.current.velocity = e.velocity;
      });
    }

    sceneRef.current = {
      scene,
      camera,
      renderer,
      meshes,
      materials,
      raycaster,
      mouseVec,
      lenis,
      animationFrameId: null,
    };

    // 5. Mouse Move Handler relative to container bounding rect
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const normX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const normY = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      stateRef.current.targetMouse.x = normX;
      stateRef.current.targetMouse.y = normY;

      mouseVec.x = normX;
      mouseVec.y = normY;
    };

    // Wheel event handler for embedded mode scroll interaction
    const handleWheel = (e: WheelEvent) => {
      if (embedded) {
        const maxScrollLimit = Math.max(1200, numItems * 400);
        stateRef.current.targetScrollPos = Math.max(
          0,
          Math.min(maxScrollLimit, stateRef.current.targetScrollPos + e.deltaY * 0.8)
        );
      }
    };

    const targetEl = containerRef.current;
    targetEl.addEventListener("mousemove", handleMouseMove);
    if (embedded) {
      targetEl.addEventListener("wheel", handleWheel, { passive: true });
    }

    // Window Resize Handler
    const handleResize = () => {
      if (!containerRef.current) return;
      const w = containerRef.current.clientWidth || window.innerWidth;
      const h = containerRef.current.clientHeight || window.innerHeight;
      camera.aspect = w / (h || 1);
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener("resize", handleResize);

    // Window scroll handler fallback for embedded mode if non-lenis
    const handleWindowScroll = () => {
      if (embedded && !lenis) {
        stateRef.current.targetScrollPos = window.scrollY;
      }
    };
    if (embedded) {
      window.addEventListener("scroll", handleWindowScroll, { passive: true });
    }

    // 6. Main 60FPS WebGL Render Loop
    let clock = new THREE.Clock();
    let prevScroll = 0;

    const animate = () => {
      if (!isMounted) return;
      const elapsedTime = clock.getElapsedTime();
      const state = stateRef.current;

      if (lenis) {
        lenis.raf(elapsedTime * 1000);
      }

      state.mouse.x += (state.targetMouse.x - state.mouse.x) * 0.08;
      state.mouse.y += (state.targetMouse.y - state.mouse.y) * 0.08;

      const currentScroll = state.targetScrollPos;
      const rawVelocity = currentScroll - prevScroll;
      prevScroll = currentScroll;

      state.velocity += (rawVelocity - state.velocity) * 0.12;

      const maxScroll = Math.max(1, (numItems - 1) * 3.8);
      const denominator = embedded ? 1200 : numItems * 450;
      const scrollRatio = Math.min(Math.max(currentScroll / denominator, 0), 1);
      
      const newProgress = Math.round(scrollRatio * 100);
      if (newProgress !== lastProgressRef.current) {
        lastProgressRef.current = newProgress;
        setScrollProgress(newProgress);
      }

      const newSpeed = Math.round(Math.abs(state.velocity * 5));
      if (newSpeed !== lastSpeedRef.current) {
        lastSpeedRef.current = newSpeed;
        setScrollSpeedDisplay(newSpeed);
      }

      camera.position.x = state.mouse.x * 0.45;
      camera.position.y = state.mouse.y * 0.35;
      camera.rotation.y = -state.mouse.x * 0.04;
      camera.rotation.x = state.mouse.y * 0.03;

      raycaster.setFromCamera(mouseVec, camera);
      const intersects = raycaster.intersectObjects(meshes);

      let currentHoveredIdx = -1;
      if (intersects.length > 0) {
        const hitMesh = intersects[0].object as THREE.Mesh;
        currentHoveredIdx = hitMesh.userData.index;
      }

      if (state.hoveredIndex !== currentHoveredIdx) {
        state.hoveredIndex = currentHoveredIdx;
        setHoveredProjectTitle(
          currentHoveredIdx >= 0 ? items[currentHoveredIdx].title : null
        );
      }

      const ySpacing = 3.6;
      const totalYOffset = (numItems - 1) * (ySpacing / 2);

      meshes.forEach((mesh, idx) => {
        const mat = materials[idx];

        const targetY = totalYOffset - idx * ySpacing + scrollRatio * maxScroll;
        mesh.position.y = targetY;

        const baseZ = (idx % 2 === 0 ? 0.4 : -0.3) - idx * 0.1;
        const depthSine = Math.sin(elapsedTime * 1.5 + idx * 1.2) * 0.15;
        mesh.position.z = baseZ + depthSine;

        const isHovered = state.hoveredIndex === idx;
        const targetScale = isHovered ? 1.06 : 1.0;
        mesh.scale.setScalar(THREE.MathUtils.lerp(mesh.scale.x, targetScale, 0.1));

        mesh.rotation.z = Math.sin(elapsedTime + idx) * 0.03 + state.velocity * 0.002;
        mesh.rotation.y = (state.mouse.x * 0.12) + (isHovered ? 0.08 : 0);

        mat.uniforms.uTime.value = elapsedTime;
        mat.uniforms.uScrollVelocity.value = THREE.MathUtils.lerp(
          mat.uniforms.uScrollVelocity.value,
          state.velocity,
          0.1
        );
        mat.uniforms.uMouse.value.set(state.mouse.x, state.mouse.y);
        mat.uniforms.uHover.value = THREE.MathUtils.lerp(
          mat.uniforms.uHover.value,
          isHovered ? 1 : 0,
          0.12
        );
      });

      renderer.render(scene, camera);
      if (isMounted && sceneRef.current) {
        sceneRef.current.animationFrameId = requestAnimationFrame(animate);
      }
    };

    animate();

    const handleCanvasClick = (e: MouseEvent) => {
      if (!sceneRef.current || !containerRef.current) return;
      const target = e.target as HTMLElement;
      if (target.closest("button") || target.closest("a") || target.closest("header")) return;

      const rect = containerRef.current.getBoundingClientRect();
      const normX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const normY = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      const clickVec = new THREE.Vector2(normX, normY);
      raycaster.setFromCamera(clickVec, camera);
      const hits = raycaster.intersectObjects(meshes);

      if (hits.length > 0) {
        const clickedMesh = hits[0].object as THREE.Mesh;
        const item = clickedMesh.userData.item as WorkItem;
        setActiveItem(item);
      }
    };

    const clickTarget = scrollContainerRef.current || containerRef.current || canvas;
    clickTarget.addEventListener("click", handleCanvasClick);

    return () => {
      isMounted = false;
      if (targetEl) {
        targetEl.removeEventListener("mousemove", handleMouseMove);
        if (embedded) targetEl.removeEventListener("wheel", handleWheel);
      }
      window.removeEventListener("resize", handleResize);
      if (embedded) window.removeEventListener("scroll", handleWindowScroll);
      clickTarget.removeEventListener("click", handleCanvasClick);

      if (sceneRef.current?.animationFrameId) {
        cancelAnimationFrame(sceneRef.current.animationFrameId);
      }

      if (lenis) lenis.destroy();

      meshes.forEach((mesh) => mesh.geometry.dispose());
      materials.forEach((mat) => {
        if (mat.uniforms.uTexture.value) {
          (mat.uniforms.uTexture.value as THREE.Texture).dispose();
        }
        mat.dispose();
      });

      renderer.dispose();
      sceneRef.current = null;
    };
  }, [category, embedded]);

  return (
    <div
      ref={containerRef}
      className={
        embedded
          ? "relative w-full h-[550px] sm:h-[650px] rounded-3xl overflow-hidden border border-zinc-200 bg-white text-zinc-900 shadow-md my-6 select-none group/unseen"
          : "fixed inset-0 z-50 bg-white text-zinc-900 overflow-hidden select-none"
      }
    >
      {/* LAYER 1: THREE.JS WEBGL CANVAS */}
      <canvas
        ref={canvasRef}
        className={
          embedded
            ? "absolute inset-0 w-full h-full z-1 cursor-grab active:cursor-grabbing"
            : "fixed inset-0 w-full h-full z-1 cursor-grab active:cursor-grabbing"
        }
      />

      {/* LAYER 2: FOREGROUND TYPOGRAPHY OVERLAY WITH MIX-BLEND-MODE: DIFFERENCE */}
      <div
        className={
          embedded
            ? "absolute inset-0 z-10 pointer-events-none mix-blend-mode-difference flex flex-col justify-between p-6 sm:p-8 lg:p-10"
            : "fixed inset-0 z-10 pointer-events-none mix-blend-mode-difference flex flex-col justify-between p-6 sm:p-10 lg:p-14"
        }
      >
        {/* Top Floating Headline */}
        <div className="w-full flex items-start justify-between border-b border-white/40 pb-3">
          <div>
            <span className="font-mono text-xs tracking-widest uppercase font-semibold text-white/90">
              UNSEEN STUDIO ARCHIVE / {category.index}
            </span>
            <h1 className="font-display text-3xl sm:text-5xl md:text-6xl font-black uppercase tracking-tight text-white leading-none mt-1">
              {category.title}
            </h1>
          </div>
          <div className="text-right hidden sm:block font-mono text-[11px] text-white/80 tracking-wider">
            <div>3D MULTI-PLANE SCENE</div>
            <div>SHADED WARP ENGINE</div>
          </div>
        </div>

        {/* Center Screen Huge Typography Watermark */}
        <div className="w-full my-auto flex flex-col items-center justify-center text-center">
          <div className="font-display font-black text-[11vw] sm:text-[9vw] leading-none uppercase tracking-tighter text-white opacity-95">
            {hoveredProjectTitle ? hoveredProjectTitle.split(" ")[0] : category.title}
          </div>
          {hoveredProjectTitle && (
            <p className="font-mono text-xs sm:text-base tracking-widest text-white uppercase mt-2">
              [ CLICK PLANE TO EXPAND: {hoveredProjectTitle} ]
            </p>
          )}
        </div>

        {/* Bottom Floating Stats Bar */}
        <div className="w-full flex items-end justify-between border-t border-white/40 pt-3 font-mono text-[11px] tracking-wider text-white">
          <div className="flex items-center gap-4 sm:gap-6">
            <span>PROJECTS: {category.items.length}</span>
            <span>VELOCITY: {scrollSpeedDisplay} PX/S</span>
          </div>
          <div className="hidden sm:flex items-center gap-4 text-white">
            <span>PROGRESS: {scrollProgress}%</span>
            <span>BLEND: DIFFERENCE</span>
          </div>
        </div>
      </div>

      {/* LAYER 3: CONTROLS UI */}
      <header
        className={
          embedded
            ? "absolute top-4 inset-x-4 z-[100] pointer-events-auto flex items-center justify-between"
            : "fixed top-0 inset-x-0 z-[100] px-4 sm:px-8 py-5 pointer-events-auto flex items-center justify-between"
        }
      >
        {/* Left Action Button */}
        {!embedded ? (
          <button
            onClick={onClose}
            className="inline-flex items-center gap-2 font-mono text-xs font-bold tracking-wider text-white bg-zinc-900 hover:bg-black border border-zinc-700 px-4 py-2.5 rounded-full shadow-lg transition-all duration-200 group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-200" />
            <span>CLOSE ARCHIVE</span>
          </button>
        ) : (
          <div className="flex items-center gap-2">
            <span className="font-mono text-[10px] tracking-widest text-purple-700 font-bold bg-purple-50 border border-purple-200 px-3 py-1.5 rounded-full shadow-sm">
              ✦ UNSEEN 3D VIEWPORT
            </span>
          </div>
        )}

        {/* Category Switcher Tabs (shown only if multiple categories exist) */}
        {categories.length > 1 && (
          <div className="hidden md:flex items-center gap-1 p-1 rounded-full bg-white/90 border border-zinc-200 backdrop-blur-xl shadow-md">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(cat.id)}
                className={`font-mono text-[11px] tracking-wider font-semibold px-3 py-1 rounded-full transition-all duration-200 ${
                  cat.id === category.id
                    ? "bg-zinc-900 text-white shadow-sm font-bold"
                    : "text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100"
                }`}
              >
                {cat.index} {cat.title}
              </button>
            ))}
          </div>
        )}

        {/* Right Actions */}
        <div className="flex items-center gap-2">
          {embedded && onToggleFullscreen && (
            <button
              onClick={onToggleFullscreen}
              className="inline-flex items-center gap-1.5 font-mono text-[11px] font-bold text-white bg-purple-600 hover:bg-purple-700 border border-purple-500/30 px-3.5 py-1.5 rounded-full backdrop-blur-xl transition-all shadow-sm"
            >
              <Box className="w-3.5 h-3.5" />
              <span>FULLSCREEN 3D</span>
            </button>
          )}

          <div className="inline-flex items-center gap-1.5 font-mono text-[10px] text-zinc-700 bg-zinc-100/90 border border-zinc-200 px-3 py-1.5 rounded-full backdrop-blur-xl">
            <MoveVertical className="w-3 h-3 text-purple-600 animate-bounce" />
            <span className="hidden sm:inline">SCROLL / DRAG PLANES</span>
          </div>
        </div>
      </header>

      {/* Lenis Scroll Container if non-embedded */}
      {!embedded && (
        <div
          ref={scrollContainerRef}
          className="fixed inset-0 z-20 overflow-y-auto overflow-x-hidden pointer-events-auto"
          style={{ scrollbarWidth: "none" }}
        >
          <div
            style={{ height: `${Math.max(2200, category.items.length * 750)}px` }}
            className="w-full"
          />
        </div>
      )}

      {/* Floating Project Switcher Drawer */}
      <div className="absolute bottom-4 right-4 z-[100] pointer-events-auto hidden lg:flex flex-col gap-1.5 bg-white/95 border border-zinc-200 rounded-2xl p-2.5 backdrop-blur-2xl max-w-[220px] shadow-xl text-zinc-900">
        <div className="font-mono text-[9px] tracking-widest text-purple-700 font-bold uppercase mb-0.5 px-2 flex items-center justify-between">
          <span>PROJECTS</span>
          <Layers className="w-3 h-3 text-purple-600" />
        </div>
        {category.items.map((item, idx) => (
          <button
            key={item.id}
            onClick={() => setActiveItem(item)}
            className="w-full text-left font-mono text-[11px] text-zinc-700 hover:text-zinc-900 bg-zinc-50 hover:bg-zinc-100 px-2.5 py-1.5 rounded-lg transition-all flex items-center justify-between group"
          >
            <span className="truncate pr-1">{idx + 1}. {item.title}</span>
            <ChevronRight className="w-3 h-3 opacity-40 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all text-purple-600" />
          </button>
        ))}
      </div>

      {/* EXPANDED PROJECT DETAIL MODAL */}
      <AnimatePresence>
        {activeItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[120] bg-black/60 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 lg:p-10 pointer-events-auto"
            onClick={() => setActiveItem(null)}
          >
            <motion.div
              initial={{ scale: 0.92, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.92, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="bg-white border border-zinc-200 rounded-3xl p-6 sm:p-8 lg:p-10 max-w-2xl w-full shadow-2xl relative overflow-hidden text-zinc-900"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setActiveItem(null)}
                className="absolute top-6 right-6 p-2.5 rounded-full bg-zinc-100 hover:bg-zinc-200 text-zinc-700 transition-all border border-zinc-200"
              >
                <X className="w-5 h-5" />
              </button>

              {activeItem.image && (
                <div className="w-full aspect-[16/9] rounded-2xl overflow-hidden border border-zinc-200 mb-6 bg-zinc-50">
                  <img
                    src={activeItem.image}
                    alt={activeItem.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              <div className="flex items-center gap-3 mb-2 font-mono text-xs">
                <span className="px-3 py-1 rounded-full bg-purple-50 border border-purple-200 text-purple-700 font-bold uppercase">
                  {category.title}
                </span>
                <span className="text-zinc-500 font-semibold">{activeItem.date || "2026"}</span>
                {activeItem.featured && (
                  <span className="inline-flex items-center gap-1 text-amber-700 font-bold">
                    <Sparkles className="w-3 h-3" /> FEATURED
                  </span>
                )}
              </div>

              <h2 className="font-display text-2xl sm:text-4xl font-extrabold text-zinc-900 tracking-tight mb-1">
                {activeItem.title}
              </h2>
              {activeItem.subtitle && (
                <p className="font-mono text-sm text-purple-600 font-semibold mb-4">
                  {activeItem.subtitle}
                </p>
              )}

              <p className="font-sans text-sm sm:text-base text-zinc-600 leading-relaxed mb-6">
                {activeItem.description}
              </p>

              <div className="flex items-center gap-4 pt-4 border-t border-zinc-100">
                {activeItem.demoUrl && (
                  <a
                    href={activeItem.demoUrl}
                    target={activeItem.demoUrl.startsWith("/") ? "_self" : "_blank"}
                    rel="noreferrer"
                    onClick={(e) => {
                      if (activeItem.demoUrl?.startsWith("/")) {
                        e.preventDefault();
                        setActiveItem(null);
                        if (!embedded) onClose();
                        window.history.pushState({}, "", activeItem.demoUrl);
                      }
                    }}
                    className="flex-1 inline-flex items-center justify-center gap-2 font-mono text-xs font-bold text-white bg-purple-600 hover:bg-purple-700 px-5 py-3 rounded-xl transition-all shadow-md"
                  >
                    <span>LAUNCH DEMO</span>
                    <ExternalLink className="w-4 h-4" />
                  </a>
                )}
                {activeItem.githubUrl && (
                  <a
                    href={activeItem.githubUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center justify-center gap-2 font-mono text-xs font-bold text-zinc-700 bg-zinc-100 hover:bg-zinc-200 px-5 py-3 rounded-xl border border-zinc-200 transition-all"
                  >
                    <GithubIcon className="w-4 h-4" />
                    <span>SOURCE CODE</span>
                  </a>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

