import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import SpidermanViewer from "./SpidermanViewer";

export default function AvatarShowcase() {
  // Custom mouse cursor position state
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [myrielleVisible, setMyrielleVisible] = useState(true);
  const [scrollProgress, setScrollProgress] = useState(0);

  // Hide myrielle link once Projects section enters view
  useEffect(() => {
    const proj = document.getElementById('projects');
    if (proj) {
      const rect = proj.getBoundingClientRect();
      // Show link only while the Projects section is still above the top of the viewport
      setMyrielleVisible(rect.top > 0);
    }
  }, [scrollProgress]);

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
      <a
        href="#"
        className="fixed top-1/2 left-4 z-30 transform -translate-y-1/2 text-[33px] cursor-pointer hover:text-white transition-colors"
        style={{
          fontFamily: "'Clash Grotesk', sans-serif",
          display: "block",
        }}
      >
        myrielle
      </a>

      {/* 3D Spiderman Model with Scroll Animation */}
      <SpidermanViewer modelUrl="/amazing_spiderman.glb" onScrollProgress={setScrollProgress} />

      {/* DESIGNER//DEVELOPER Text Overlay - moves up after 1 full page */}
      <div
        className="fixed top-1/2 left-[55%] z-20 pointer-events-none"
        style={{
          transition: "transform 1s ease-out, opacity 1s ease-out",
          // Move up proportionally during the first half of the scroll (0‑0.5 progress)
          transform: `translate(-50%, -50%) translateY(${Math.min(scrollProgress * 2, 1) * -200}px)`,
          // Fade out more gradually over the scroll
          opacity: Math.max(0, 1 - scrollProgress * 1.2),
          // Hide overlay after about half a page scroll (≈0.5 progress)
          display: scrollProgress >= 0.5 ? "none" : "block",
        }}
      >
        <h2 className="text-white font-switzer font-light text-5xl sm:text-6xl lg:text-8xl tracking-tight text-center whitespace-nowrap">
          Designer // Developer
        </h2>
      </div>

      {/* Quote Text - appears after two viewports */}
      <div
        className="fixed top-[45%] left-[60%] z-20 pointer-events-none max-w-xs lg:max-w-md"
        style={{
          // start fading in after scrollProgress ≈0.6 (two viewports later)
          opacity: Math.max(0, (scrollProgress - 0.6) * 3) * Math.max(0, Math.min(1, (1 - scrollProgress) * 8)),
          // hide after nearing end of page
          display: scrollProgress >= 0.95 ? "none" : "block",
        }}
      >
        <motion.p className="text-white font-switzer font-light text-2xl sm:text-3xl lg:text-4xl leading-normal text-right" style={{ x: -200 + 200 * scrollProgress }}>
          Code is logic.
        </motion.p>
        <motion.p className="text-white font-switzer font-light text-2xl sm:text-3xl lg:text-4xl leading-normal text-right" style={{ x: 200 - 200 * scrollProgress }}>
          Design is emotion.
        </motion.p>
        <motion.p className="text-white font-switzer font-light text-2xl sm:text-3xl lg:text-4xl leading-normal text-right" style={{ x: -200 + 200 * scrollProgress }}>
          I build with both.
        </motion.p>
      </div>
    </section>
  );
}
