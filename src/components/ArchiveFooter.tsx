import { useState, useEffect, useRef } from "react";
import type { MouseEvent } from "react";
import { motion } from "framer-motion";
import FlyingStickers from "./FlyingStickers";

interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  scale: number;
  color: string;
  char: string;
}

const PARTICLE_CHARS = ["✨", "✦", "★", "✹", "⚡︎", "♦"];
const ACCENT_COLORS = ["#9333ea", "#f59e0b", "#ec4899", "#3b82f6", "#10b981"];

export default function ArchiveFooter() {
  const [particles, setParticles] = useState<Particle[]>([]);
  const footerRef = useRef<HTMLDivElement>(null);

  // Mouse position for local interactive radial spotlight
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });

  // Track mouse movement inside footer for spotlight effect
  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!footerRef.current) return;
    const rect = footerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setMousePos({ x, y });
  };

  // Spawn particle sparkles on text click
  const handleTextClick = (e: MouseEvent<HTMLDivElement>) => {
    if (!footerRef.current) return;
    const rect = footerRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    const newParticles: Particle[] = Array.from({ length: 14 }).map((_, i) => {
      const angle = (Math.PI * 2 * i) / 14 + (Math.random() - 0.5);
      const speed = 2 + Math.random() * 5;
      return {
        id: Date.now() + i + Math.random(),
        x: clickX,
        y: clickY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 1.5,
        scale: 0.7 + Math.random() * 0.8,
        color: ACCENT_COLORS[Math.floor(Math.random() * ACCENT_COLORS.length)],
        char: PARTICLE_CHARS[Math.floor(Math.random() * PARTICLE_CHARS.length)],
      };
    });

    setParticles((prev) => [...prev.slice(-20), ...newParticles]);
  };

  // Particle animation loop
  useEffect(() => {
    if (particles.length === 0) return;
    const timer = setInterval(() => {
      setParticles((prev) =>
        prev
          .map((p) => ({
            ...p,
            x: p.x + p.vx,
            y: p.y + p.vy + 0.3, // gravity
            scale: p.scale * 0.92,
          }))
          .filter((p) => p.scale > 0.15)
      );
    }, 30);
    return () => clearInterval(timer);
  }, [particles]);

  const line1 = "Let's work".split("");
  const line2 = "together!".split("");

  return (
    <footer
      ref={footerRef}
      onMouseMove={handleMouseMove}
      className="w-full min-h-screen border-t border-[var(--border)] px-4 sm:px-8 lg:px-16 py-8 sm:py-12 relative z-10 overflow-hidden transition-colors duration-300 select-none flex flex-col justify-center items-center"
      style={{ backgroundColor: "var(--bg)" }}
    >
      {/* Flying Floating Stickers Layer inside Footer */}
      <FlyingStickers />

      {/* Dynamic Interactive Radial Spotlight Background */}
      <div
        className="absolute inset-0 pointer-events-none transition-opacity duration-500 opacity-60 dark:opacity-40"
        style={{
          background: `radial-gradient(600px circle at ${mousePos.x}% ${mousePos.y}%, rgba(147, 51, 234, 0.12), transparent 70%)`,
        }}
      />

      {/* Decorative Grid Lines */}
      <div className="absolute inset-0 bg-dot-mesh opacity-20 pointer-events-none" />

      {/* Interactive Floating Particles Layer */}
      <div className="absolute inset-0 pointer-events-none z-30">
        {particles.map((p) => (
          <span
            key={p.id}
            className="absolute font-mono pointer-events-none transition-transform"
            style={{
              left: `${p.x}px`,
              top: `${p.y}px`,
              transform: `scale(${p.scale}) translate(-50%, -50%)`,
              color: p.color,
              fontSize: "18px",
            }}
          >
            {p.char}
          </span>
        ))}
      </div>

      <div className="max-w-7xl w-full mx-auto flex flex-col items-center justify-center relative z-20 py-4 sm:py-8">
        {/* Pre-headline Text */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="font-mono text-sm sm:text-base md:text-lg font-bold tracking-[0.25em] text-[var(--accent)] uppercase mb-4 sm:mb-6 text-center select-none relative -top-[20px]"
        >
          Got something exciting in mind?
        </motion.p>

        {/* Massive Interactive Centered Headline */}
        <div
          onClick={handleTextClick}
          className="text-center cursor-pointer group/headline py-2 flex flex-col items-center justify-center"
        >
          {/* Line 1: Let's work */}
          <div className="flex flex-wrap items-center justify-center tracking-tight leading-[0.9] font-display font-black text-5xl sm:text-7xl md:text-8xl lg:text-[110px] xl:text-[130px] text-[var(--heading)]">
            {line1.map((char, index) => (
              <motion.span
                key={index}
                whileHover={{
                  y: -14,
                  scale: 1.18,
                  rotate: (index % 2 === 0 ? 1 : -1) * 6,
                  color: "var(--accent)",
                }}
                transition={{ type: "spring", stiffness: 450, damping: 14 }}
                className={`inline-block transition-colors duration-200 ${
                  char === " " ? "w-4 sm:w-8 lg:w-12" : ""
                }`}
              >
                {char}
              </motion.span>
            ))}
          </div>

          {/* Line 2: together! */}
          <div className="flex flex-wrap items-center justify-center tracking-tight leading-[0.9] font-display font-black text-5xl sm:text-7xl md:text-8xl lg:text-[110px] xl:text-[130px] text-[var(--accent)] group-hover/headline:text-[var(--heading)] transition-colors duration-500">
            {line2.map((char, index) => (
              <motion.span
                key={index}
                whileHover={{
                  y: -16,
                  scale: 1.22,
                  rotate: (index % 2 === 0 ? -1 : 1) * 8,
                  color: "#f59e0b",
                }}
                transition={{ type: "spring", stiffness: 450, damping: 14 }}
                className="inline-block transition-colors duration-200"
              >
                {char}
              </motion.span>
            ))}
          </div>
        </div>
      </div>

      {/* Floating Stickers Hint Badge */}
      <div className="absolute bottom-6 right-8 pointer-events-none z-30 opacity-80 hidden sm:block">
        <span className="font-mono text-[10px] tracking-widest text-[var(--accent)] font-bold uppercase bg-[var(--surface)]/90 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-[var(--border)] shadow-md inline-flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
          FLYING STICKERS ARCHIVE • DRAG OR CLICK ANYWHERE!
        </span>
      </div>
    </footer>
  );
}

