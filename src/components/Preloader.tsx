import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { portfolioData } from "../data/portfolioData";

interface PreloaderProps {
  onComplete: () => void;
}

export default function Preloader({ onComplete }: PreloaderProps) {
  const [progress, setProgress] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [weatherTemp, setWeatherTemp] = useState<string>("--°");

  useEffect(() => {
    let current = 0;
    let timer: ReturnType<typeof setInterval> | null = null;

    const startInterval = () => {
      timer = setInterval(() => {
        const increment = Math.floor(Math.random() * 5) + 3;
        let next = current + increment;

        // Handle exact pause at 67%
        if (current < 67 && next >= 67) {
          current = 67;
          setProgress(67);
          if (timer) clearInterval(timer);

          // Brief pause at 67%
          setTimeout(() => {
            startInterval();
          }, 600);
          return;
        }

        current = Math.min(next, 100);
        setProgress(current);

        if (current === 100) {
          if (timer) clearInterval(timer);
          const timeout = setTimeout(() => {
            setIsComplete(true);
            onComplete();
          }, 600);
          return () => clearTimeout(timeout);
        }
      }, 40);
    };

    startInterval();

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [onComplete]);

  // Fetch live weather for Makati City with fallback to "--°"
  useEffect(() => {
    async function fetchMakatiWeather() {
      try {
        const res = await fetch(
          "https://api.open-meteo.com/v1/forecast?latitude=14.5547&longitude=121.0244&current_weather=true"
        );
        if (res.ok) {
          const data = await res.json();
          if (data?.current_weather?.temperature !== undefined) {
            setWeatherTemp(`${Math.round(data.current_weather.temperature)}°`);
          }
        }
      } catch {
        // Fallback to initial "--°"
      }
    }
    fetchMakatiWeather();
  }, []);

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
          className="fixed inset-0 z-50 bg-[var(--bg)] text-[var(--heading)] flex flex-col justify-between p-6 sm:p-10 lg:p-12 pointer-events-auto select-none transition-colors duration-300"
        >
          {/* Top layout spanning the screen in two columns */}
          <div className="w-full flex justify-between items-start">
            {/* Left Column: Logo & MAKATI CITY */}
            <div className="flex flex-col items-start gap-1">
              <div className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-[var(--heading)]">
                {portfolioData.name.toLowerCase()}
                <span className="text-[var(--accent)]">.</span>
              </div>
              <span className="font-mono text-xs tracking-[0.2em] text-[var(--text-muted)] uppercase font-medium">
                MAKATI CITY
              </span>
            </div>

            {/* Right Column: Loading counter & Weather */}
            <div className="flex flex-col items-end gap-1">
              <div className="font-mono text-4xl sm:text-6xl md:text-7xl font-light tracking-tight text-[var(--heading)] tabular-nums">
                {progress}%
              </div>
              <span className="font-mono text-xs sm:text-sm tracking-widest text-[var(--text-muted)] uppercase font-medium">
                {weatherTemp}
              </span>
            </div>
          </div>

          {/* Bottom minimal aesthetic status indicator */}
          <div className="w-full flex justify-between items-end font-mono text-[11px] text-[var(--text-muted)] tracking-widest uppercase opacity-60">
            <span>PORTFOLIO / 2026</span>
            <span>SYSTEM INITIALIZING</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

