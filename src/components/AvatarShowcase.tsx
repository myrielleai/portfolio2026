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

  // After the flare: "Code is logic." surfaces on its own, "Design is emotion." joins it, then both
  // give way to "I build with both.", which stays. Each line rises a little as it fades in.
  const line1Opacity = useTransform(scrollYProgress, (v) => Math.min(ramp(v, 0.42, 0.52), 1 - ramp(v, 0.74, 0.82)));
  const line2Opacity = useTransform(scrollYProgress, (v) => Math.min(ramp(v, 0.54, 0.64), 1 - ramp(v, 0.74, 0.82)));
  const finalLineOpacity = useTransform(scrollYProgress, (v) => ramp(v, 0.8, 0.9));
  const quoteX1 = useTransform(scrollYProgress, (v) => 18 * (1 - ramp(v, 0.42, 0.56)));
  const quoteX2 = useTransform(scrollYProgress, (v) => 18 * (1 - ramp(v, 0.54, 0.68)));
  const quoteX3 = useTransform(scrollYProgress, (v) => 18 * (1 - ramp(v, 0.8, 0.94)));

  // Explicitly hide the quote block outside of its active viewport range
  // At the very end the fixed quote hands over to an identical copy pinned to the bottom of the
  // section, so "I build with both." stays where it is and then scrolls away with the page.
  const quoteVisibility = useTransform(scrollYProgress, (pos) =>
    pos >= 0.995 || pos < 0.4 ? "hidden" : "visible"
  );
  const restingVisibility = useTransform(scrollYProgress, (pos) => (pos >= 0.995 ? "visible" : "hidden"));
  // thin, airy type that floats over the glow
  const quoteLine = "font-display font-extralight text-4xl sm:text-5xl xl:text-6xl tracking-[-0.03em] leading-[1.15] text-center";
  const finalLine = "font-display font-extralight text-4xl sm:text-5xl xl:text-6xl tracking-[-0.03em] leading-[1.15] text-center";
  const halo = "0 0 22px var(--bg), 0 0 6px var(--bg)";
  // the first two lines sit up top, out of the glow; the closing line lands low, like a caption
  const quoteBox = "top-[20vh] left-1/2 -translate-x-1/2 z-20 pointer-events-none w-full max-w-[90vw] flex flex-col items-center";
  const finalBox = "top-[70vh] left-1/2 -translate-x-1/2 z-20 pointer-events-none w-full max-w-[90vw] flex flex-col items-center";

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
        className="fixed top-[68vh] sm:top-[70vh] left-1/2 z-20 pointer-events-none -translate-x-1/2 w-full max-w-[94vw]"
      >
        <div className="mx-auto w-fit">
        {/* thin and wide, low on the screen, so the hands and the glow stay the centre of it */}
        <h2
          className="font-display text-[44px] sm:text-6xl md:text-7xl lg:text-8xl xl:text-[104px] font-extralight tracking-[-0.03em] text-center leading-none flex flex-col md:flex-row items-center justify-center gap-y-1 md:gap-x-5"
          // set inline: the global h2 rule (weight 700) would otherwise win over the utility class
          style={{ color: "var(--heading)", textShadow: halo, fontWeight: 200, letterSpacing: "-0.03em" }}
        >
          <span>Designer</span>
          <span className="text-[var(--accent)] font-extralight opacity-70 flex items-center justify-center">//</span>
          <span>Developer</span>
        </h2>
        <p className="mt-5 sm:mt-7 text-center font-mono text-[10px] sm:text-xs font-medium uppercase tracking-[0.32em] text-[var(--text-muted)]" style={{ textShadow: halo }}>
          <span className="text-[var(--accent)]">computer vision</span>
          <span className="mx-3 text-[var(--text-muted)] opacity-60">|</span>
          {/* kept as "LLMs" (not "LLMS") inside the all-caps line */}
          <span className="text-[var(--accent)]"><span className="normal-case">LLMs</span></span>
          <span className="mx-3 text-[var(--text-muted)] opacity-60">|</span>
          <span className="text-[var(--accent)]">full-stack</span>
        </p>
        </div>
      </motion.div>

      {/* Quote: fixed while the hero plays */}
      <motion.div className={`fixed ${quoteBox} will-change-[opacity]`} style={{ visibility: quoteVisibility }}>
        <motion.p className={quoteLine} style={{ y: quoteX1, opacity: line1Opacity, color: "var(--heading)", textShadow: halo }}>
          Code is logic.
        </motion.p>
        <motion.p className={quoteLine} style={{ y: quoteX2, opacity: line2Opacity, color: "var(--heading)", textShadow: halo }}>
          Design is emotion.
        </motion.p>
      </motion.div>
      <motion.div className={`fixed ${finalBox} will-change-[opacity]`} style={{ visibility: quoteVisibility }}>
        <motion.p className={finalLine} style={{ y: quoteX3, opacity: finalLineOpacity, color: "var(--heading)", textShadow: halo }}>
          I build with both.
        </motion.p>
      </motion.div>

      {/* Same spot, pinned to the last screen of the section: the closing line stays, then scrolls away */}
      <div className="absolute inset-x-0 bottom-0 h-screen pointer-events-none">
        <motion.div className={`absolute top-[70%] left-1/2 -translate-x-1/2 z-20 pointer-events-none w-full max-w-[90vw] flex flex-col items-center`} style={{ visibility: restingVisibility }}>
          <p className={finalLine} style={{ color: "var(--heading)", textShadow: halo }}>
            I build with both.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
