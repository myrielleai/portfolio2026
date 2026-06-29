import { useRef } from "react";
import { motion, useScroll, useTransform, MotionValue } from "framer-motion";
import { portfolioData } from "../data/portfolioData";


interface WordProps {
  children: string;
  progress: MotionValue<number>;
  range: [number, number];
}

function Word({ children, progress, range }: WordProps) {
  const opacity = useTransform(progress, range, [0.18, 1]);
  const filter = useTransform(progress, range, [
    "grayscale(100%) blur(1px)",
    "grayscale(0%) blur(0px)",
  ]);
  const color = useTransform(progress, range, [
    "var(--text-muted)",
    "var(--heading)",
  ]);

  return (
    <span className="relative inline-block mx-[0.2em] my-[0.08em]">
      <motion.span
        style={{ opacity, filter, color }}
        className="inline-block transition-colors duration-150 select-none font-display font-bold tracking-tight"
      >
        {children}
      </motion.span>
    </span>
  );
}

function ScrollStatement() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const text =
    "I design and develop digital experiences where logic and emotion work together. My approach blends clean systems and human-centered interaction to create products that feel immersive and memorable. I believe great design is more than functionality — it’s atmosphere, movement, clarity, and emotion crafted with intention.";

  const words = text.split(" ");
  const totalWords = words.length;

  return (
    <div
      ref={containerRef}
      className="relative h-[180vh] w-full bg-[var(--bg)] border-b border-[var(--border)] transition-colors duration-300"
    >
      <div className="sticky top-0 h-screen w-full flex items-center justify-center px-6 lg:px-16 overflow-hidden">
        {/* Ambient atmospheric glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-600/10 dark:bg-purple-400/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <p className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold font-display leading-[1.35] tracking-tight text-center">
            {words.map((word, i) => {
              const start = i / totalWords;
              const end = (i + 1) / totalWords;
              return (
                <Word key={i} progress={scrollYProgress} range={[start, end]}>
                  {word}
                </Word>
              );
            })}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function About() {
  return (
    <div id="about">
      <section className="w-full py-24 lg:py-36 border-b border-[var(--border)] bg-[var(--surface)] transition-colors duration-300 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          {/* Spacious 3-Column Layout balancing Left Greeting/Bio, Center Photo, and Right Paragraph */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-16 items-center">

            {/* Left Column: Greeting & Bio */}
            <div className="space-y-6 reveal">
              {/* The Greeting */}
              <div>
                <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold font-display text-[var(--heading)] tracking-tight leading-[1.05]">
                  Hey!
                  <br />
                  <br />

                  <span className="text-[var(--text-muted)] font-normal text-2xl sm:text-3xl lg:text-4xl block mt-2">
                    I'm {portfolioData.name}.
                  </span>
                </h2>
              </div>

              {/* The Bio Paragraph */}
              <p className="text-base sm:text-lg text-[var(--text)] leading-relaxed font-sans">
                I am an <strong className="text-[var(--heading)] font-semibold">{portfolioData.role}</strong> dedicated to architecting intelligent digital solutions. My current focus centers on building next-generation web applications by combining smart AI reasoning models with clean, modular backend architectures and motion-rich frontend interfaces.
              </p>
            </div>

            {/* Middle Column: Soft-Edged Portrait Photo */}
            <div className="flex justify-center items-center py-6 lg:py-0 reveal">
              <div className="relative group">
                {/* Subtle ambient blur backlight for premium aesthetic */}
                <div className="absolute -inset-4 rounded-[3rem] bg-gradient-to-tr from-[var(--accent)]/20 via-purple-500/10 to-transparent blur-2xl opacity-70 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

                {/* Photo Frame - Soft-edged portrait */}
                <div className="relative w-64 h-80 sm:w-72 sm:h-96 lg:w-80 lg:h-[26rem] rounded-[2.5rem] overflow-hidden border border-[var(--border-strong)] bg-[var(--surface-muted)] shadow-2xl transition-transform duration-700 ease-out group-hover:scale-[1.02]">
                  <img
                    src="/about.jpeg"
                    alt={portfolioData.name}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-40 group-hover:opacity-20 transition-opacity duration-500" />
                </div>
              </div>
            </div>

            {/* Right Column: Paragraph 2 */}
            <div className="reveal space-y-6">
              <p className="text-base sm:text-lg text-[var(--text)] leading-relaxed font-sans">
                I also come from a background in architecture and design, which continues to shape the way I approach structure, interaction, and visual storytelling.
              </p>

              <p className="text-base sm:text-lg text-[var(--text)] leading-relaxed font-sans">
                My focus right now is creating digital experiences that merge intelligent systems with thoughtful design.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* 1 Viewport Scroll Statement with Word-by-Word Saturation */}
      <ScrollStatement />
    </div>
  );
}

