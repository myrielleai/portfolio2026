import { useState, useRef } from "react";
import { motion } from "framer-motion";
import SpidermanViewer from "./SpidermanViewer";

export default function AvatarShowcase() {

  // Custom mouse cursor position state
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <section
      id="showcase"
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative w-full min-h-[calc(100vh-5rem)] flex flex-col justify-center bg-black overflow-hidden px-6 sm:px-12 lg:px-20 py-10 lg:py-16 select-none"
    >

      {/* 3D Spiderman Model with Scroll Animation */}
      <SpidermanViewer modelUrl="/amazing_spiderman.glb" />
      
      {/* 1. Custom Interactive Glowing Mouse Cursor Graphic */}
      {isHovered && (
        <motion.div
          className="absolute pointer-events-none z-30 w-16 h-16 rounded-full border border-purple-500/35 bg-purple-500/5 blur-[2px] hidden lg:block"
          animate={{ x: mousePos.x - 32, y: mousePos.y - 32 }}
          transition={{ type: "spring", damping: 30, stiffness: 250, mass: 0.5 }}
        />
      )}


    </section>
  );
}
