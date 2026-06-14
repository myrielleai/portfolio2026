import { useState, useRef } from "react";
import { motion } from "framer-motion";
import SpidermanViewer from "./SpidermanViewer";

export default function AvatarShowcase() {

  // Custom mouse cursor position state
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
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
      className="relative w-full min-h-[300vh] flex flex-col justify-center bg-black px-6 sm:px-12 lg:px-20 py-10 lg:py-16 select-none"
    >

      {/* 3D Spiderman Model with Scroll Animation */}
      <SpidermanViewer modelUrl="/amazing_spiderman.glb" onScrollProgress={setScrollProgress} />
      
      {/* DESIGNER//DEVELOPER Text Overlay - moves up after 1 full page */}
      <div
        className="fixed top-1/2 left-1/2 z-20 pointer-events-none"
        style={{
          transform: `translate(-50%, calc(-50% - ${Math.max(0, (scrollProgress - 1/3) * 300)}px))`,
          opacity: Math.max(0, Math.min(1, (1 - scrollProgress) * 12)),
          display: scrollProgress >= 0.99 ? "none" : "block",
        }}
      >
        <h2 className="text-white font-display font-light text-5xl sm:text-6xl lg:text-8xl tracking-tight text-center whitespace-nowrap">
          Designer // Developer
        </h2>
      </div>

      {/* Quote Text - unfades on 3rd full page height */}
      <div
        className="fixed top-1/2 right-6 sm:right-12 lg:right-20 z-20 pointer-events-none max-w-xs lg:max-w-md"
        style={{
          opacity: Math.max(0, (scrollProgress - 2/3) * 3) * Math.max(0, Math.min(1, (1 - scrollProgress) * 12)),
          transform: `translateY(-50%)`,
          display: scrollProgress >= 0.99 ? "none" : "block",
        }}
      >
        <p className="text-white font-display font-light text-2xl sm:text-3xl lg:text-4xl leading-normal text-right">
          Code is logic.<br />
          Design is emotion.<br />
          I build with both.
        </p>
      </div>

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
