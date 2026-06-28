import { useEffect, useRef } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import type { GLTF } from "three/examples/jsm/loaders/GLTFLoader.js";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

interface SpidermanViewerProps {
  modelUrl: string;
  onScrollProgress?: (progress: number) => void;
}

export default function SpidermanViewer({ modelUrl, onScrollProgress }: SpidermanViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const modelRef = useRef<THREE.Group | null>(null);
  const scrollProgressRef = useRef<number>(0);
  const mouseRef = useRef<{ x: number, y: number }>({ x: 0, y: 0 });

  useEffect(() => {
    if (!containerRef.current) return;

    // Scene setup — no background color set, so the canvas stays transparent
    // and the page's theme background (light or dark) shows through behind it.
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      60,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 0, 2.5);
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;

    // Renderer setup — alpha true + no scene.background = transparent canvas
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(
      containerRef.current.clientWidth,
      containerRef.current.clientHeight
    );
    renderer.setPixelRatio(window.devicePixelRatio);
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 2);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);

    const pointLight = new THREE.PointLight(0xaa00ff, 0.5);
    pointLight.position.set(-5, 3, 3);
    scene.add(pointLight);

    gsap.registerPlugin(ScrollTrigger);

    const trigger = ScrollTrigger.create({
      trigger: "#showcase",
      start: "top top",
      end: "bottom bottom",
      scrub: true,
      onUpdate: (self) => {
        const progress = self.progress;
        scrollProgressRef.current = progress;

        if (containerRef.current) {
          const exitFade = Math.max(0, Math.min(1, (1 - progress) * 12));
          containerRef.current.style.opacity = exitFade.toString();
          containerRef.current.style.display = progress >= 0.99 ? "none" : "block";
        }

        if (onScrollProgress) {
          onScrollProgress(progress);
        }
      }
    });

    const handleWindowScroll = () => {
      const docHeight = document.body.scrollHeight - window.innerHeight;
      const scrollTop = window.scrollY;
      const progress = docHeight > 0 ? scrollTop / docHeight : 0;
      scrollProgressRef.current = progress;
    };
    window.addEventListener('scroll', handleWindowScroll);
    const cleanupScrollListener = () => {
      window.removeEventListener('scroll', handleWindowScroll);
    };

    const handleMouseMove = (event: MouseEvent) => {
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return;
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;
      mouseRef.current = { x, y };
    };
    window.addEventListener('mousemove', handleMouseMove);
    const cleanupMouseListener = () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };

    const loader = new GLTFLoader();
    loader.load(
      modelUrl,
      (gltf: GLTF) => {
        const model = gltf.scene;
        const box = new THREE.Box3().setFromObject(model);
        const center = box.getCenter(new THREE.Vector3());
        model.position.sub(center);

        const size = box.getSize(new THREE.Vector3());
        const maxDim = Math.max(size.x, size.y, size.z);
        const scale = 4 / maxDim;
        model.scale.multiplyScalar(scale);
        model.position.y = 0;

        model.position.z = -0.5;
        model.position.y = 0.2;
        model.rotation.y = .5;
        model.rotation.x = .2;

        scene.add(model);
        modelRef.current = model;
        gsap.to(model, {
          rotationY: Math.PI / 2,
          x: -3,
          y: 0.5,
          ease: "none",
          scrollTrigger: {
            trigger: "#showcase",
            start: "top top",
            end: "bottom bottom",
            scrub: true,
          },
        });
      },
      undefined,
      (error: unknown) => {
        console.error("Error loading model:", error);
      }
    );

    const animate = () => {
      requestAnimationFrame(animate);

      const { x, y } = mouseRef.current;
      const parallaxFactor = .5;
      camera.position.x = 0 + x * parallaxFactor;
      camera.position.y = 0 + y * parallaxFactor;
      camera.lookAt(0, 0, 0);

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!containerRef.current || !cameraRef.current || !rendererRef.current) {
        return;
      }
      const width = containerRef.current.clientWidth;
      const height = containerRef.current.clientHeight;
      cameraRef.current.aspect = width / height;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(width, height);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      trigger.kill();
      window.removeEventListener("resize", handleResize);
      cleanupScrollListener();
      cleanupMouseListener();
      if (containerRef.current && rendererRef.current) {
        containerRef.current.removeChild(rendererRef.current.domElement);
      }
      renderer.dispose();
    };
  }, [modelUrl]);

  return (
    <div
      ref={containerRef}
      className="model-viewer-container"
      style={{
        width: "100%",
        height: "100vh",
        position: "fixed",
        top: 0,
        left: 0,
        zIndex: 0,
        pointerEvents: "none",
      }}
    />
  );
}
