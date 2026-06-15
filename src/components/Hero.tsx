import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowDownRight } from "lucide-react";
import { portfolioData } from "../data/portfolioData";

export default function Hero() {
  const { greeting, headline, keywords, description, ctaPrimaryText, ctaPrimaryUrl, ctaSecondaryText, ctaSecondaryUrl } = portfolioData.hero;
  const [keywordIdx, setKeywordIdx] = useState(0);

  useEffect(() => {
    // Title scroll animation – moves the fixed title wrapper out of view
    gsap.registerPlugin(ScrollTrigger);
    const titleWrapper = document.getElementById('title-wrapper');
    if (titleWrapper) {
      gsap.to(titleWrapper, {
        y: -200,
        scrollTrigger: {
          trigger: '#hero-section',
          start: 'top top',
          end: '+=200',
          scrub: true,
        },
      });
    }

    const timer = setInterval(() => {
      setKeywordIdx((prev) => (prev + 1) % keywords.length);
    }, 3000);
    return () => clearInterval(timer);
  }, [keywords]);

  // Motion variants for container fade-ins
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring" as const, stiffness: 100, damping: 15 },
    },
  };

  return (
    {/* Fixed title wrapper */}
    <div id="title-wrapper" style={{position: "fixed", top: 0, left: 0, width: "100%", zIndex: 10, pointerEvents: "none", textAlign: "center"}}>
      <motion.h1
        id="title"
        variants={itemVariants}
        className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white tracking-tight leading-[1.05]"
        style={{margin: "0 auto"}}
      >
        {headline}
      </motion.h1>
    </div>
    <section id="hero-section" className="grid grid-cols-1 lg:grid-cols-12 border-b border-zinc-900 min-h-[calc(100vh-5rem)] items-stretch">
      
      {/* Left Column - Section Indicator (4 Cols) */}
      <div className="lg:col-span-4 border-b lg:border-b-0 lg:border-r border-zinc-900 p-8 lg:p-12 flex flex-col justify-between bg-black/20">
        <span className="font-mono text-xs text-zinc-500 tracking-widest">{greeting}</span>
        <div className="hidden lg:block font-mono text-[10px] text-zinc-500 leading-relaxed uppercase tracking-wider space-y-1">
          <div>LOC // MANILA, PH</div>
          <div>EST // 2026</div>
        </div>
      </div>

      {/* Right Column - Main Content (8 Cols) */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="lg:col-span-8 p-8 lg:p-12 flex flex-col justify-center space-y-8 sm:space-y-10"
      >
        <div className="space-y-4">
          {/* Animated keyword badge/cycler */}
          <div className="inline-flex items-center gap-2 h-8">
            <span className="font-mono text-xs uppercase tracking-wider text-zinc-500">I am a</span>
            <div className="relative overflow-hidden h-7 w-64">
              <AnimatePresence mode="wait">
                <motion.span
                  key={keywordIdx}
                  initial={{ y: 15, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -15, opacity: 0 }}
                  transition={{ duration: 0.25, ease: "easeInOut" }}
                  className="absolute left-0 text-sm font-mono font-medium tracking-wide text-white border border-zinc-800 bg-zinc-950 px-2.5 py-0.5"
                >
                  {keywords[keywordIdx]}
                </motion.span>
              </AnimatePresence>
            </div>
          </div>

          {/* Main Headline */}
          {/* Title moved to fixed wrapper */}
        </div>

        {/* Short bio */}
        <motion.p
          variants={itemVariants}
          className="text-base sm:text-lg text-zinc-400 max-w-xl font-normal leading-relaxed"
        >
          {description}
        </motion.p>

        {/* CTA Buttons */}
        <motion.div variants={itemVariants} className="flex flex-wrap gap-4 pt-2">
          <a
            href={ctaPrimaryUrl}
            className="group flex items-center gap-2 bg-white text-black hover:bg-zinc-200 px-6 py-3.5 text-xs font-mono font-semibold tracking-widest uppercase transition-all duration-300 border border-transparent"
          >
            {ctaPrimaryText}
            <ArrowDownRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:translate-y-0.5" />
          </a>
          <a
            href={ctaSecondaryUrl}
            className="group flex items-center gap-2 bg-transparent text-white hover:bg-zinc-950 px-6 py-3.5 text-xs font-mono font-semibold tracking-widest uppercase transition-all duration-300 border border-zinc-800 hover:border-zinc-650"
          >
            {ctaSecondaryText}
            <ArrowDownRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:translate-y-0.5" />
          </a>
        </motion.div>
      </motion.div>
    </section>
  );
}
