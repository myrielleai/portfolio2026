import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { portfolioData } from "../data/portfolioData";

interface PreloaderProps {
  onComplete: () => void;
}

// What the page being opened needs before it can show (plus the fonts): the two painted hands
// for the home hero, the first row of tiles for the works archive, nothing extra for the lab
const assetsFor = (path: string) => {
  const p = path.replace(/\/$/, "") || "/";
  if (p === "/works") return ["/deepleaf.webp", "/bookswap.webp", "/project2.webp"];
  if (p === "/lab") return [];
  return ["/adam-layer-clean.webp", "/god-arm.webp"];
};
const MIN_MS = 1900; // never flashes by faster than this, even from cache
const MAX_MS = 9000; // never holds the visitor longer than this, even on a bad connection

export default function Preloader({ onComplete }: PreloaderProps) {
  const [progress, setProgress] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [weatherTemp, setWeatherTemp] = useState<string>("--°");
  const doneRef = useRef(onComplete);
  doneRef.current = onComplete;

  // Progress follows the real loading: each asset is a step, and while one is in flight the
  // counter creeps toward it without reaching it. A time curve keeps the count from racing ahead,
  // and the shown number eases after its target so it climbs smoothly instead of jumping.
  useEffect(() => {
    const ASSETS = assetsFor(window.location.pathname);
    const total = ASSETS.length + 1;
    let loaded = 0;
    let lastAt = performance.now();
    const tick = () => { loaded++; lastAt = performance.now(); };
    const imgs = ASSETS.map((src) => {
      const img = new Image();
      img.onload = img.onerror = tick;
      img.src = src;
      return img;
    });
    (document.fonts?.ready ?? Promise.resolve()).then(tick, tick);

    const start = performance.now();
    let shown = 0;
    let prev = start;
    let held = false;
    let holdUntil = 0;
    let raf = 0;
    let finishTimer: number | undefined;
    const step = (now: number) => {
      const t = Math.max(0, now - start);
      const dt = Math.max(0, now - prev);
      prev = now;
      const timeCap = 1 - Math.pow(1 - Math.min(1, t / MIN_MS), 2.2);
      const creep = loaded < total ? 0.6 * (1 - Math.exp(-(now - lastAt) / 900)) : 0;
      const loadCap = t > MAX_MS ? 1 : (loaded + creep) / total;
      const target = 100 * Math.min(timeCap, loadCap);
      // eased by elapsed time, not per frame, so a busy frame doesn't slow the count
      shown += (target - shown) * (1 - Math.exp(-dt / 110));
      if (target >= 100 && shown > 99.4) shown = 100;
      // a brief breath at 97 before the last few percent
      if (!held && shown >= 97) { held = true; holdUntil = now + 650; }
      if (now < holdUntil) shown = 97;
      setProgress(Math.max(0, Math.floor(shown)));
      if (shown >= 100) {
        // hold on 100 for a beat, fade the type, then lift the curtain
        finishTimer = window.setTimeout(() => {
          setLeaving(true);
          finishTimer = window.setTimeout(() => {
            setIsComplete(true);
            doneRef.current();
          }, 260);
        }, 220);
        return;
      }
      raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);

    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(finishTimer);
      imgs.forEach((img) => { img.onload = img.onerror = null; });
    };
  }, []);

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
    document.body.style.overflow = isComplete ? "" : "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isComplete]);

  const ease = [0.76, 0, 0.24, 1] as const;

  return (
    <AnimatePresence>
      {!isComplete && (
        <motion.div
          initial={{ y: 0 }}
          exit={{ y: "-100%" }}
          transition={{ duration: 0.85, ease }}
          className="fixed inset-0 z-[200] bg-[var(--bg)] text-[var(--heading)] pointer-events-auto select-none transition-colors duration-300"
        >
          <motion.div
            className="h-full w-full flex justify-between items-start p-6 sm:p-10 lg:p-12"
            initial={{ opacity: 0, y: 8 }}
            animate={leaving ? { opacity: 0, y: -14 } : { opacity: 1, y: 0 }}
            transition={{ duration: leaving ? 0.3 : 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Left: name and city */}
            <div className="flex flex-col items-start gap-1">
              <div className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-[var(--heading)]">
                {portfolioData.name.toLowerCase()}
                <span className="text-[var(--accent)]">.</span>
              </div>
              <span className="font-mono text-xs tracking-[0.2em] text-[var(--text-muted)] uppercase font-medium">
                Makati City
              </span>
            </div>

            {/* Right: counter and weather */}
            <div className="flex flex-col items-end gap-1">
              <div className="font-mono text-4xl sm:text-6xl md:text-7xl font-medium tracking-tight text-[var(--heading)] tabular-nums leading-none">
                {progress}
                <span className="text-[0.5em] align-top ml-1 text-[var(--text-muted)]">%</span>
              </div>
              <span className="font-mono text-xs sm:text-sm tracking-widest text-[var(--text-muted)] uppercase font-medium">
                {weatherTemp}
              </span>
            </div>
          </motion.div>

          {/* A hairline along the bottom edge that fills with the count */}
          <div className="absolute left-0 right-0 bottom-0 h-px bg-[var(--border)]/40">
            <div
              className="h-full bg-[var(--accent)] origin-left"
              style={{ transform: `scaleX(${progress / 100})` }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
