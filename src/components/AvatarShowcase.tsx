import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import SculptureViewer from "./SculptureViewer";

export default function AvatarShowcase() {
  const containerRef = useRef<HTMLDivElement>(null);

  // Track scroll position of the section
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Animate Designer // Developer text overlay
  const designerY = useTransform(scrollYProgress, [0, 0.5], [0, -150]);
  const designerOpacity = useTransform(scrollYProgress, [0.15, 0.48], [1, 0]);
  
  // Explicitly hide the heading by turning display to 'none' when progress >= 0.5
  const designerDisplay = useTransform(scrollYProgress, (pos) => (pos >= 0.5 ? "none" : "block"));

  // Animate Quote Text block
  const quoteOpacity = useTransform(scrollYProgress, [0.55, 0.65, 0.9, 0.95], [0, 1, 1, 0]);
  const quoteX1 = useTransform(scrollYProgress, [0.6, 0.95], [-60, 0]);
  const quoteX2 = useTransform(scrollYProgress, [0.6, 0.95], [60, 0]);
  const quoteX3 = useTransform(scrollYProgress, [0.6, 0.95], [-60, 0]);

  // Explicitly hide the quote block outside of its active viewport range
  const quoteDisplay = useTransform(scrollYProgress, (pos) =>
    pos >= 0.98 || pos < 0.5 ? "none" : "flex"
  );

  return (
    <section
      id="showcase"
      ref={containerRef}
      className="relative w-full min-h-[300vh] flex flex-col justify-center px-6 sm:px-12 lg:px-20 py-10 lg:py-16 select-none"
      style={{ backgroundColor: "var(--bg)" }}
    >
      {/* 3D Parametric Computational Architectural Sculpture */}
      <SculptureViewer />

      {/* DESIGNER//DEVELOPER Text Overlay - centered, responsive, and cleanly hidden after fade-out */}
      <motion.div
        style={{
          y: designerY,
          opacity: designerOpacity,
          display: designerDisplay,
        }}
        className="fixed top-1/2 left-1/2 z-20 pointer-events-none -translate-x-1/2 -translate-y-1/2 w-full max-w-[90vw]"
      >
        <h2
          className="font-display text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight text-center leading-[1.1] flex flex-col md:flex-row items-center justify-center gap-y-2 md:gap-x-6"
          style={{ color: "var(--heading)" }}
        >
          <span>Designer</span>
          <span className="text-[var(--accent)] font-light opacity-60 flex items-center justify-center">//</span>
          <span>Developer</span>
        </h2>
      </motion.div>

      {/* Quote Text - appears after two viewports, centered on mobile, right-aligned on desktop, hidden outside active range */}
      <motion.div
        className="fixed top-[45%] left-1/2 md:left-[60%] -translate-x-1/2 md:translate-x-0 z-20 pointer-events-none w-full max-w-[90vw] md:max-w-xs lg:max-w-md flex flex-col items-center md:items-end"
        style={{
          opacity: quoteOpacity,
          display: quoteDisplay,
        }}
      >
        <motion.p
          className="font-display font-medium text-2xl sm:text-3xl lg:text-4xl leading-[1.3] text-center md:text-right"
          style={{ x: quoteX1, color: "var(--heading)" }}
        >
          Code is logic.
        </motion.p>
        <motion.p
          className="font-display font-medium text-2xl sm:text-3xl lg:text-4xl leading-[1.3] text-center md:text-right"
          style={{ x: quoteX2, color: "var(--heading)" }}
        >
          Design is emotion.
        </motion.p>
        <motion.p
          className="font-display font-medium text-2xl sm:text-3xl lg:text-4xl leading-[1.3] text-center md:text-right"
          style={{ x: quoteX3, color: "var(--heading)" }}
        >
          I build with both.
        </motion.p>
      </motion.div>
    </section>
  );
}
