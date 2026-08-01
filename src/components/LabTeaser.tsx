import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail } from "lucide-react";
import WorkbenchCanvas from "./workbench/WorkbenchCanvas";
import { playClickSound, playHoverSound } from "../utils/audio";

interface LabTeaserProps {
  onEnterLab?: () => void;
  onExitLab?: () => void;
}

export default function LabTeaser({ onEnterLab }: LabTeaserProps) {
  const [isCoverDismissed, setIsCoverDismissed] = useState(false);

  // Today's date scribbled in the corner
  const todayDateStr = new Date().toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <section 
      id="lab-teaser"
      className="relative w-full bg-[var(--bg)] border-b border-[var(--border)] transition-colors duration-300"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-12 pt-24 pb-16">
        <div className="flex flex-col md:flex-row md:items-end justify-between pb-8 border-b border-[var(--border)] gap-6">
          <div>
            <span className="font-mono text-xs text-[var(--accent)] tracking-widest block mb-3 uppercase">
              02 // Playground
            </span>
            <h2 className="text-5xl sm:text-6xl lg:text-7xl font-bold font-display text-[var(--heading)] tracking-tight leading-[1.05]">
              Workbench
            </h2>
          </div>
          <p className="font-mono text-xs text-[var(--text-muted)] max-w-sm leading-relaxed">
            An interactive 3D studio of personal tools, creative experiments, and everyday artifacts.
          </p>
        </div>
      </div>

      <div className="relative w-full h-screen bg-[#160c07] text-white font-mono overflow-hidden">
        <WorkbenchCanvas onEnterLab={onEnterLab} />

        {/* Floating Read Letter button when cover is dismissed */}
        <AnimatePresence>
          {isCoverDismissed && (
            <motion.button
              initial={{ opacity: 0, y: -20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.9 }}
              transition={{ duration: 0.3 }}
              onMouseEnter={() => playHoverSound()}
              onClick={() => {
                playClickSound();
                setIsCoverDismissed(false);
              }}
              className="absolute top-6 right-6 z-30 flex items-center gap-2 px-4 py-2 bg-amber-100/90 hover:bg-amber-100 text-amber-950 font-sans text-xs font-semibold rounded-full border border-amber-900/20 shadow-lg backdrop-blur-sm transition-all cursor-pointer hover:scale-105"
            >
              <Mail className="w-3.5 h-3.5 text-amber-700" />
              <span>read note ✉️</span>
            </motion.button>
          )}
        </AnimatePresence>

        {/* Cover Overlay Note */}
        <AnimatePresence>
          {!isCoverDismissed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, transition: { duration: 0.4 } }}
              className="absolute inset-0 z-40 flex items-center justify-center p-4 sm:p-6 bg-black/70 backdrop-blur-md"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.92, y: 30, rotate: -2 }}
                animate={{ opacity: 1, scale: 1, y: 0, rotate: -1 }}
                exit={{ opacity: 0, scale: 0.85, y: -50, rotate: -4 }}
                transition={{ type: "spring", stiffness: 260, damping: 22 }}
                className="relative w-full max-w-lg bg-[#fbf7ef] text-zinc-900 p-8 sm:p-10 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.7)] cursor-default select-none border border-amber-900/10"
                style={{
                  clipPath:
                    "polygon(0% 1.5%, 4% 0%, 9% 1.8%, 15% 0.3%, 21% 2.2%, 27% 0%, 33% 1.6%, 40% 0.2%, 46% 2%, 53% 0%, 60% 1.8%, 66% 0.3%, 73% 2.2%, 79% 0%, 86% 1.6%, 92% 0.2%, 100% 1.5%, 98.5% 12%, 100% 25%, 98.2% 38%, 100% 50%, 98.5% 63%, 100% 75%, 98.2% 88%, 100% 100%, 93% 98.5%, 86% 100%, 80% 98.2%, 73% 100%, 66% 98.4%, 59% 100%, 52% 98.2%, 45% 100%, 38% 98.5%, 31% 100%, 24% 98.2%, 17% 100%, 10% 98.4%, 4% 100%, 0% 98.5%, 1.5% 85%, 0% 70%, 1.8% 55%, 0% 40%, 1.5% 25%)",
                }}
              >
                {/* Washi tape accent on top center */}
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-32 h-8 bg-amber-100/70 border border-amber-200/50 backdrop-blur-xs shadow-xs -rotate-1 pointer-events-none" />

                {/* Faint paper grid / texture pattern */}
                <div className="absolute inset-0 bg-[radial-gradient(#b45309_0.5px,transparent_0.5px)] [background-size:20px_20px] opacity-10 pointer-events-none" />

                {/* Today's date scribbled in the top right corner */}
                <div className="absolute top-6 right-7 sm:top-8 sm:right-9 font-reenie text-2xl sm:text-3xl text-red-700/80 -rotate-6 select-none pointer-events-none">
                  {todayDateStr}
                </div>

                {/* Letter Body in Handwriting Font */}
                <div className="relative z-10 font-caveat text-2xl sm:text-3xl text-zinc-900 leading-relaxed space-y-4 pt-2">
                  <p className="text-3xl sm:text-4xl font-bold text-amber-950">hi!</p>
                  
                  <p className="text-zinc-800">thanks for stopping by.</p>

                  <p className="text-zinc-800">
                    everything you see here<br />
                    represents a piece of my journey.
                  </p>

                  <p className="text-zinc-800">feel free to explore around.</p>

                  <p className="text-amber-950 font-semibold pt-1">have fun!</p>

                  <p className="text-amber-950 font-bold text-3xl sm:text-4xl pt-1 text-right">
                    -myrielle
                  </p>
                </div>

                {/* Bottom Section with Centered Handwritten Button */}
                <div className="relative z-10 mt-8 pt-6 border-t border-amber-900/15 flex justify-center">
                  {/* Button: pull up a chair → */}
                  <motion.button
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    onMouseEnter={() => playHoverSound()}
                    onClick={() => {
                      playClickSound();
                      setIsCoverDismissed(true);
                    }}
                    className="group inline-flex items-center gap-2.5 px-7 py-3 bg-zinc-900 hover:bg-zinc-800 text-amber-50 font-caveat text-xl sm:text-2xl font-bold rounded-full shadow-md shadow-zinc-900/20 transition-all cursor-pointer border border-amber-500/20"
                  >
                    <span>pull up a chair</span>
                    <motion.span
                      animate={{ x: [0, 6, 0] }}
                      transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
                      className="inline-block text-amber-400 font-sans"
                    >
                      →
                    </motion.span>
                  </motion.button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
