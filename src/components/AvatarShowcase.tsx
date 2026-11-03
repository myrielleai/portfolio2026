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

  // NOTE: function-form transforms on purpose. Framer hands range-based opacity transforms to the
  // browser's native scroll timeline, which mis-maps the range under Lenis and lets the text fade back in.
  const ramp = (v: number, a: number, b: number) => Math.min(1, Math.max(0, (v - a) / (b - a)));

  // Designer // Developer: drifts up and fades out over the first third of the hero, then is fully hidden
  const designerY = useTransform(scrollYProgress, (v) => -150 * ramp(v, 0, 0.3));
  const designerOpacity = useTransform(scrollYProgress, (v) => 1 - ramp(v, 0.06, 0.26));
  const designerVisibility = useTransform(scrollYProgress, (v) => (v >= 0.27 ? "hidden" : "visible"));

  // Quote: the first two lines fade in, hold, fade out; "I build with both." fades in and stays
  const quoteOpacity = useTransform(scrollYProgress, (v) => Math.min(ramp(v, 0.55, 0.65), 1 - ramp(v, 0.86, 0.92)));
  const finalLineOpacity = useTransform(scrollYProgress, (v) => ramp(v, 0.55, 0.65));
  const quoteX1 = useTransform(scrollYProgress, [0.6, 0.95], [-60, 0]);
  const quoteX2 = useTransform(scrollYProgress, [0.6, 0.95], [60, 0]);
  const quoteX3 = useTransform(scrollYProgress, [0.6, 0.95], [-60, 0]);

  // Explicitly hide the quote block outside of its active viewport range
  // At the very end the fixed quote hands over to an identical copy pinned to the bottom of the
  // section, so "I build with both." stays where it is and then scrolls away with the page.
  const quoteVisibility = useTransform(scrollYProgress, (pos) =>
    pos >= 0.995 || pos < 0.5 ? "hidden" : "visible"
  );
  const restingVisibility = useTransform(scrollYProgress, (pos) => (pos >= 0.995 ? "visible" : "hidden"));
  const quoteLine = "font-display font-semibold text-3xl sm:text-4xl xl:text-5xl tracking-tight leading-[1.15] text-center md:text-left";
  const halo = "0 0 24px var(--bg), 0 0 10px var(--bg), 0 0 4px var(--bg)";
  const quoteBox =
    "top-1/2 -translate-y-1/2 left-1/2 md:left-[52%] -translate-x-1/2 md:translate-x-0 z-20 pointer-events-none w-full max-w-[90vw] md:max-w-md lg:max-w-xl xl:max-w-2xl flex flex-col items-center md:items-start";

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
          visibility: designerVisibility,
        }}
        className="fixed top-1/2 left-1/2 z-20 pointer-events-none -translate-x-1/2 -translate-y-1/2 w-full max-w-[90vw]"
      >
        <div className="mx-auto w-fit">
        <h2
          className="font-display text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight text-center leading-[1.1] flex flex-col md:flex-row items-center justify-center gap-y-2 md:gap-x-6"
          style={{ color: "var(--heading)" }}
        >
          <span>Designer</span>
          <span className="text-[var(--accent)] font-light opacity-60 flex items-center justify-center">//</span>
          <span>Developer</span>
        </h2>
        <p className="mt-4 sm:mt-6 text-right font-mono text-xs sm:text-sm font-semibold uppercase tracking-[0.25em] text-[var(--text-muted)]" style={{ textShadow: "0 0 16px var(--bg), 0 0 8px var(--bg), 0 0 3px var(--bg)" }}>
          <span className="text-[var(--accent)]">computer vision</span>
          <span className="mx-3 text-[var(--text-muted)] opacity-60">|</span>
          <span className="text-[var(--accent)]">machine learning</span>
        </p>
        </div>
      </motion.div>

      {/* Quote: fixed while the hero plays */}
      <motion.div className={`fixed ${quoteBox} will-change-[opacity]`} style={{ visibility: quoteVisibility }}>
        <motion.p className={quoteLine} style={{ x: quoteX1, opacity: quoteOpacity, color: "var(--heading)", textShadow: halo }}>
          Code is logic.
        </motion.p>
        <motion.p className={quoteLine} style={{ x: quoteX2, opacity: quoteOpacity, color: "var(--heading)", textShadow: halo }}>
          Design is emotion.
        </motion.p>
        <motion.p className={quoteLine} style={{ x: quoteX3, opacity: finalLineOpacity, color: "var(--heading)", textShadow: halo }}>
          I build with both.
        </motion.p>
      </motion.div>

      {/* Same spot, pinned to the last screen of the section: the closing line stays, then scrolls away */}
      <div className="absolute inset-x-0 bottom-0 h-screen pointer-events-none">
        <motion.div className={`absolute ${quoteBox}`} style={{ visibility: restingVisibility }}>
          <p className={`${quoteLine} invisible`} aria-hidden>Code is logic.</p>
          <p className={`${quoteLine} invisible`} aria-hidden>Design is emotion.</p>
          <p className={quoteLine} style={{ color: "var(--heading)", textShadow: halo }}>
            I build with both.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
