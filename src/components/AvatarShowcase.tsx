import { useState } from "react";
import { motion } from "framer-motion";
import SpidermanViewer from "./SpidermanViewer";

export default function AvatarShowcase() {
  const [scrollProgress, setScrollProgress] = useState(0);

  return (
    <section
      id="showcase"
      className="relative w-full min-h-[300vh] flex flex-col justify-center px-6 sm:px-12 lg:px-20 py-10 lg:py-16 select-none"
      style={{ backgroundColor: "var(--bg)" }}
    >


      {/* 3D Spiderman Model with Scroll Animation */}
      <SpidermanViewer modelUrl="/amazing_spiderman.glb" onScrollProgress={setScrollProgress} />

      {/* DESIGNER//DEVELOPER Text Overlay - moves up after 1 full page */}
      <div
        className="fixed top-1/2 left-[55%] z-20 pointer-events-none"
        style={{
          transition: "transform 1s ease-out, opacity 1s ease-out",
          transform: `translate(-50%, -50%) translateY(${Math.min(scrollProgress * 2, 1) * -200}px)`,
          opacity: Math.max(0, 1 - scrollProgress * 1.2),
          display: scrollProgress >= 0.5 ? "none" : "block",
        }}
      >
        <h2
          className="font-display text-5xl sm:text-6xl lg:text-8xl font-bold tracking-tight text-center whitespace-nowrap leading-[1.05]"
          style={{ color: "var(--heading)" }}
        >
          Designer // Developer
        </h2>
      </div>

      {/* Quote Text - appears after two viewports */}
      <div
        className="fixed top-[45%] left-[60%] z-20 pointer-events-none max-w-xs lg:max-w-md"
        style={{
          opacity:
            Math.max(0, (scrollProgress - 0.6) * 3) *
            Math.max(0, Math.min(1, (1 - scrollProgress) * 8)),
          display: scrollProgress >= 0.95 ? "none" : "block",
        }}
      >
        <motion.p
          className="font-display font-medium text-2xl sm:text-3xl lg:text-4xl leading-[1.3] text-right"
          style={{ x: -200 + 200 * scrollProgress, color: "var(--heading)" }}
        >
          Code is logic.
        </motion.p>
        <motion.p
          className="font-display font-medium text-2xl sm:text-3xl lg:text-4xl leading-[1.3] text-right"
          style={{ x: 200 - 200 * scrollProgress, color: "var(--heading)" }}
        >
          Design is emotion.
        </motion.p>
        <motion.p
          className="font-display font-medium text-2xl sm:text-3xl lg:text-4xl leading-[1.3] text-right"
          style={{ x: -200 + 200 * scrollProgress, color: "var(--heading)" }}
        >
          I build with both.
        </motion.p>
      </div>
    </section>
  );
}
