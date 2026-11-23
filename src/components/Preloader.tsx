import { useState, useEffect, useLayoutEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { portfolioData } from "../data/portfolioData";
import { setIntroPhase } from "../utils/intro";

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
  // the count lives in a ref and is painted straight onto the elements each frame, so the logo
  // animation never waits on a React render
  const progressRef = useRef(0);
  const nameRef = useRef<HTMLDivElement>(null);
  const boxRef = useRef<SVGSVGElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const [leaving, setLeaving] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [weatherTemp, setWeatherTemp] = useState<string>("--°");
  const doneRef = useRef(onComplete);
  doneRef.current = onComplete;
  // width of "yrielle", so the [m] can glide to the centre as the rest of the name fades
  const restRef = useRef<HTMLSpanElement>(null);
  const mRef = useRef<HTMLSpanElement>(null);
  const [restWidth, setRestWidth] = useState(0);
  // the square box, measured from the m's actual ink so the letter sits dead centre in it
  const [box, setBox] = useState<{ left: number; top: number; size: number; cx: number; adv: number } | null>(null);
  const layoutRef = useRef({ box, restWidth });
  layoutRef.current = { box, restWidth };

  // the count climbs fast early on, so the stages sit late: 0–45% just the name · 45–62% the box
  // snaps onto the m · 68–96% the rest fades and the [m] glides to the centre
  const paint = useRef((progress: number) => {
    const { box: b, restWidth: rw } = layoutRef.current;
    const clamp01 = (v: number) => Math.max(0, Math.min(1, v));
    const smooth = (v: number) => v * v * (3 - 2 * v);
    const boxIn = smooth(clamp01((progress - 45) / 17));
    const restGone = smooth(clamp01((progress - 68) / 28));
    // how far the rest of the name moves over so the box clears the y, with a small gap
    const room = b ? Math.max(0, b.left + b.size - b.adv) + b.size * 0.08 : 0;
    if (nameRef.current) {
      nameRef.current.style.transform = `translate3d(${b ? ((b.adv + rw) / 2 - b.cx) * restGone : 0}px, 0, 0)`;
      nameRef.current.setAttribute("aria-label", `${portfolioData.name}, loading ${progress}%`);
    }
    if (boxRef.current) {
      boxRef.current.style.opacity = String(boxIn);
      boxRef.current.style.transform = `scale(${1 + (1 - boxIn) * 0.35})`;
    }
    if (restRef.current) {
      restRef.current.style.opacity = String(1 - restGone);
      restRef.current.style.transform = `translate3d(${room * boxIn}px, 0, 0)`;
    }
    if (barRef.current) barRef.current.style.transform = `scaleX(${progress / 100})`;
  }).current;
  // repaint when the measurements change (first layout, fonts arriving, resizes)
  useLayoutEffect(() => paint(progressRef.current), [box, restWidth, paint]);
  useLayoutEffect(() => {
    const measure = () => {
      if (!restRef.current || !mRef.current) return;
      setRestWidth(restRef.current.offsetWidth);
      const cs = getComputedStyle(mRef.current);
      const fs = parseFloat(cs.fontSize) || 0;
      const g = document.createElement("canvas").getContext("2d");
      if (!g || !fs) return;
      g.font = `${cs.fontWeight} ${fs}px ${cs.fontFamily}`;
      const m = g.measureText("m");
      // where the baseline sits inside a line box of height 1em
      const fa = m.fontBoundingBoxAscent ?? fs * 0.8, fd = m.fontBoundingBoxDescent ?? fs * 0.2;
      const baseline = (fs - (fa + fd)) / 2 + fa;
      const inkL = -m.actualBoundingBoxLeft, inkR = m.actualBoundingBoxRight;
      const inkT = baseline - m.actualBoundingBoxAscent, inkB = baseline + m.actualBoundingBoxDescent;
      const cx = (inkL + inkR) / 2, cy = (inkT + inkB) / 2;
      const size = Math.max(inkR - inkL, inkB - inkT) + fs * 0.3; // the ink plus even breathing room
      setBox({ left: cx - size / 2, top: cy - size / 2, size, cx, adv: mRef.current.offsetWidth });
    };
    measure();
    document.fonts?.ready.then(measure);
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

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
      if (!held && shown >= 97) { held = true; holdUntil = now + 650; setIntroPhase("quiet"); }
      if (now < holdUntil) shown = 97;
      const pct = Math.max(0, Math.floor(shown));
      if (pct !== progressRef.current) {
        progressRef.current = pct;
        paint(pct);
      }
      if (shown >= 100) {
        // hold on 100 for a beat, fade the type, then lift the curtain
        finishTimer = window.setTimeout(() => {
          setLeaving(true);
          setIntroPhase("done");
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
  }, [paint]);

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
          {/* Centre: the logo with the city below it. The logo starts as the
              plain word "myrielle". Then a purple detection box snaps onto
              its "m", the rest of the name ("yrielle") fades away, and the boxed [m] glides to the
              centre, where it stays as the screen lifts. */}
          <motion.div
            className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-8 sm:gap-12"
            initial={{ opacity: 0, scale: 0.97 }}
            animate={leaving ? { opacity: 0, scale: 1.04 } : { opacity: 1, scale: 1 }}
            transition={{ duration: leaving ? 0.3 : 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <div
              ref={nameRef}
              className="flex items-baseline font-display text-[56px] font-extrabold leading-none tracking-[-0.05em] text-[var(--heading)] will-change-transform sm:text-[120px]"
              role="img"
              aria-label={`${portfolioData.name}, loading`}
            >
              <span ref={mRef} className="relative">
                m
                {/* the detection box: arrives a touch large and settles onto the letter */}
                <svg
                  ref={boxRef}
                  viewBox="0 0 240 240"
                  aria-hidden="true"
                  className="absolute overflow-visible"
                  style={{
                    // a square centred on the m's own ink (measured above)
                    left: box ? `${box.left}px` : "-0.07em",
                    top: box ? `${box.top}px` : "0.07em",
                    width: box ? `${box.size}px` : "1em",
                    height: box ? `${box.size}px` : "1em",
                    opacity: 0,
                  }}
                >
                  <path
                    d="M4 44 V4 H44 M196 4 H236 V44 M236 196 V236 H196 M44 236 H4 V196"
                    fill="none"
                    stroke="var(--accent)"
                    vectorEffect="non-scaling-stroke"
                    strokeLinecap="square"
                    className="[stroke-width:4px] sm:[stroke-width:8px]"
                  />
                </svg>
              </span>
              {/* "yrielle" steps aside a little as the box lands, so the box doesn't sit on the y */}
              <span ref={restRef} className="will-change-[opacity,transform]">
                {portfolioData.name.toLowerCase().slice(1)}
              </span>
            </div>

            {/* where I am, below the logo */}
            <span className="font-mono text-xs font-medium uppercase tracking-[0.2em] text-[var(--text-muted)]">
              Makati City <span className="opacity-60">·</span> {weatherTemp}
            </span>
          </motion.div>

          {/* A hairline along the bottom edge that fills with the count */}
          <div className="absolute left-0 right-0 bottom-0 h-px bg-[var(--border)]/40">
            <div ref={barRef} className="h-full bg-[var(--accent)] origin-left" style={{ transform: "scaleX(0)" }} />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
