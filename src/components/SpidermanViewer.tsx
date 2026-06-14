import { useEffect, useRef } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import type { GLTF } from "three/examples/jsm/loaders/GLTFLoader.js";

interface SpidermanViewerProps {
  modelUrl: string;
}

export default function SpidermanViewer({ modelUrl }: SpidermanViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const modelRef = useRef<THREE.Group | null>(null);
  const scrollProgressRef = useRef<number>(0);

  useEffect(() => {
    if (!containerRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);
    sceneRef.current = scene;

    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      60,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 0, 4);
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(
      containerRef.current.clientWidth,
      containerRef.current.clientHeight
    );
    renderer.setPixelRatio(window.devicePixelRatio);
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);

    const pointLight = new THREE.PointLight(0xaa00ff, 0.5);
    pointLight.position.set(-5, 3, 3);
    scene.add(pointLight);

    // Handle scroll
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      // Animation happens over the first 800px of scroll
      const scrollProgress = Math.max(0, Math.min(1, scrollTop / 800));
      scrollProgressRef.current = scrollProgress;
    };

    // Initialize scroll position on mount
    handleScroll();
    window.addEventListener("scroll", handleScroll);

    // Load model
    const loader = new GLTFLoader();
    loader.load(
      modelUrl,
      (gltf: GLTF) => {
        const model = gltf.scene;
        // Center the model
        const box = new THREE.Box3().setFromObject(model);
        const center = box.getCenter(new THREE.Vector3());
        model.position.sub(center);

        // Scale appropriately
        const size = box.getSize(new THREE.Vector3());
        const maxDim = Math.max(size.x, size.y, size.z);
        const scale = 3 / maxDim;
        model.scale.multiplyScalar(scale);

        // Reset position and rotation to start state based on current scroll
        model.position.x = 0;
        model.position.y = 0;
        model.position.z = 0;
        model.rotation.y = 0;

        scene.add(model);
        modelRef.current = model;
      },
      undefined,
      (error: unknown) => {
        console.error("Error loading model:", error);
      }
    );

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);

      if (modelRef.current) {
        const progress = scrollProgressRef.current;

        // Rotation: Start facing front (0, 0, 0), rotate to side (0, Math.PI / 2, 0)
        modelRef.current.rotation.y = progress * (Math.PI / 2);

        // Translation: Start at center (0), move to left (-2)
        modelRef.current.position.x = -progress * 2;

        // Subtle up movement on scroll
        modelRef.current.position.y = progress * 0.5;
      }

      renderer.render(scene, camera);
    };

    animate();

    // Handle resize
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

    // Cleanup
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
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
        height: "100%",
        position: "absolute",
        top: 0,
        left: 0,
        zIndex: 0,
      }}
    />
  );
}
