import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface PreloaderProps {
  onComplete: () => void;
}

export default function Preloader({ onComplete }: PreloaderProps) {
  const [progress, setProgress] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    let current = 0;
    
    // Count up progress smoothly with random steps to feel realistic
    const interval = setInterval(() => {
      const increment = Math.floor(Math.random() * 6) + 2; // Steps of 2-7%
      current = Math.min(current + increment, 100);
      setProgress(current);
      
      if (current === 100) {
        clearInterval(interval);
        // Wait briefly after reaching 100% to let the user see the complete state
        const timeout = setTimeout(() => {
          setIsComplete(true);
          onComplete();
        }, 650);
        return () => clearTimeout(timeout);
      }
    }, 60);

    return () => clearInterval(interval);
  }, [onComplete]);

  // Lock and unlock scrolling on main content during loading
  useEffect(() => {
    if (!isComplete) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isComplete]);

  return (
    <AnimatePresence>
      {!isComplete && (
        <motion.div
          initial={{ y: 0 }}
          exit={{ y: "-100%" }}
          transition={{ duration: 0.85, ease: [0.76, 0, 0.24, 1] }}
          className="fixed inset-0 z-50 bg-zinc-100 flex items-center justify-center overflow-hidden"
        >
          {/* Background: Massive horizontal scrolling ticker */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden z-0 opacity-15">
            <div className="animate-marquee flex gap-12 whitespace-nowrap">
              <span className="text-[12vw] font-black uppercase text-zinc-400 tracking-tighter">
                AI ENGINEER // FULL STACK DEVELOPER // CREATIVE TECHNOLOGIST //
              </span>
              <span className="text-[12vw] font-black uppercase text-zinc-400 tracking-tighter">
                AI ENGINEER // FULL STACK DEVELOPER // CREATIVE TECHNOLOGIST //
              </span>
            </div>
          </div>

          {/* Central floating capsule with drop shadow and purple border glow */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.5, type: "spring" }}
            className="flex items-center gap-5 px-8 py-4 bg-black rounded-full shadow-2xl shadow-purple-500/10 border border-purple-500/30 relative z-10"
          >
            {/* Left: Loading text */}
            <span className="font-mono text-xs tracking-[0.2em] text-zinc-400 font-bold uppercase">
              LOADING
            </span>
            
            {/* Separator line */}
            <div className="w-[1px] h-4 bg-zinc-800" />
            
            {/* Right: Monospace counter */}
            <span className="font-mono text-xs sm:text-sm font-semibold text-white w-10 text-right">
              {progress}%
            </span>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
