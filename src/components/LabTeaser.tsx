import { lazy, Suspense, useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Maximize2, Minimize2 } from "lucide-react";
import { playClickSound, playHoverSound } from "../utils/audio";

// The 3D desk is heavy — load its code only when the section gets close to the screen
const WorkbenchCanvas = lazy(() => import("./workbench/WorkbenchCanvas"));

interface LabTeaserProps {
  onEnterLab?: () => void;
  onExitLab?: () => void;
}

type LenisLike = { stop: () => void; start: () => void };
const getLenis = () => (window as unknown as { lenis?: LenisLike }).lenis;

export default function LabTeaser({ onEnterLab }: LabTeaserProps) {
  const frameRef = useRef<HTMLDivElement>(null);
  const [shouldMount, setShouldMount] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [noteOpen, setNoteOpen] = useState(false);
  // "You got a note" notification: slides in once the desk is on screen, until it's read or dismissed
  const [notifShown, setNotifShown] = useState(false);
  const [noteRead, setNoteRead] = useState(false);

  const todayDateStr = new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

  // Mount the 3D scene once the frame is within ~1 screen of the viewport
  useEffect(() => {
    const el = frameRef.current;
    if (!el || shouldMount) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldMount(true);
          io.disconnect();
        }
      },
      { rootMargin: "100% 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [shouldMount]);

  // Build the 3D desk ahead of time, in a quiet moment after the intro, instead of in the middle
  // of a scroll (setting it up takes a few hundred ms, which shows as a stutter)
  useEffect(() => {
    if (shouldMount) return;
    type IdleWin = { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number; cancelIdleCallback?: (id: number) => void };
    const w = window as unknown as IdleWin;
    let idleId: number | undefined;
    const timer = window.setTimeout(() => {
      if (w.requestIdleCallback) idleId = w.requestIdleCallback(() => setShouldMount(true), { timeout: 3000 });
      else setShouldMount(true);
    }, 3500);
    return () => {
      window.clearTimeout(timer);
      if (idleId !== undefined) w.cancelIdleCallback?.(idleId);
    };
  }, [shouldMount]);

  // Deliver the notification a moment after the desk scrolls into view
  useEffect(() => {
    const el = frameRef.current;
    if (!el || noteRead) return;
    let timer: number | undefined;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          timer = window.setTimeout(() => setNotifShown(true), 1600);
          io.disconnect();
        }
      },
      { threshold: 0.5 }
    );
    io.observe(el);
    return () => {
      io.disconnect();
      window.clearTimeout(timer);
    };
  }, [noteRead]);

  const openNote = () => {
    playClickSound();
    setNotifShown(false);
    setNoteRead(true);
    setNoteOpen(true);
  };

  // Fullscreen mode: lock page scroll, close on Escape, and tell the renderer to resize
  useEffect(() => {
    const lenis = getLenis();
    if (expanded) {
      lenis?.stop();
      document.documentElement.style.overflow = "hidden";
    } else {
      lenis?.start();
      document.documentElement.style.overflow = "";
    }
    const raf = requestAnimationFrame(() => window.dispatchEvent(new Event("resize")));
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setExpanded(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("keydown", onKey);
    };
  }, [expanded]);

  useEffect(
    () => () => {
      getLenis()?.start();
      document.documentElement.style.overflow = "";
    },
    []
  );

  const leaveFullscreen = useCallback(() => setExpanded(false), []);

  return (
    <section
      id="lab-teaser"
      className="relative w-full border-b border-[var(--border)] bg-[var(--bg)] transition-colors duration-300"
    >
      <div className="mx-auto max-w-7xl px-6 pb-24 pt-24 lg:px-12">
        <div className="mb-10 flex flex-col justify-between gap-6 border-b border-[var(--border)] pb-8 md:flex-row md:items-end">
          <div>
            <span className="mb-3 block font-mono text-xs uppercase tracking-widest text-[var(--accent)]">
              02 // Playground
            </span>
            <h2 className="font-display text-5xl font-bold leading-[1.05] tracking-tight text-[var(--heading)] sm:text-6xl lg:text-7xl">
              Workbench
            </h2>
          </div>
        </div>

        {/* Framed window (becomes fullscreen when expanded) */}
        <div
          ref={frameRef}
          className={
            expanded
              ? "fixed inset-0 z-[70] bg-[#160c07]"
              : "relative h-[80vh] min-h-[480px] overflow-hidden rounded-3xl border border-[var(--border-strong)] bg-[#160c07] shadow-[0_40px_100px_-40px_rgba(0,0,0,0.5)]"
          }
          data-lenis-prevent={expanded ? "" : undefined}
        >
          {shouldMount ? (
            <Suspense fallback={<FramePlaceholder />}>
              <WorkbenchCanvas onEnterLab={onEnterLab} onBeforeNavigate={leaveFullscreen} />
            </Suspense>
          ) : (
            <FramePlaceholder />
          )}

          {/* Top-right controls */}
          <div className="absolute right-4 top-4 z-30 flex items-center gap-2">
            {/* Small envelope stays after the banner is gone, so the note can be reopened */}
            {!notifShown && (
              <button
                onMouseEnter={() => playHoverSound()}
                onClick={openNote}
                aria-label="Open the note"
                className="relative flex h-9 w-9 items-center justify-center rounded-full bg-[#9333ea] text-white shadow-lg transition-colors hover:bg-[#7c3aed]"
              >
                <Mail className="h-4 w-4" />
                {!noteRead && <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-[#ff453a] ring-2 ring-black/60" />}
              </button>
            )}
            <button
              onMouseEnter={() => playHoverSound()}
              onClick={() => {
                playClickSound();
                setExpanded((v) => !v);
              }}
              aria-label={expanded ? "Exit fullscreen" : "Open the workbench fullscreen"}
              className={`flex items-center gap-2 rounded-full bg-black/60 py-2 font-mono ${expanded ? "px-4" : "px-2.5"} text-[11px] font-semibold uppercase tracking-wider text-amber-50 backdrop-blur-sm transition-colors hover:bg-black/80`}
            >
              {expanded ? <Minimize2 className="h-3.5 w-3.5" /> : <Maximize2 className="h-3.5 w-3.5" />}
              {expanded && <span className="hidden sm:inline">Exit</span>}
            </button>
          </div>

          {/* Incoming notification banner */}
          <AnimatePresence>
            {notifShown && (
              <motion.div
                initial={{ opacity: 0, y: -80, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -60, scale: 0.97, transition: { duration: 0.25 } }}
                transition={{ type: "spring", stiffness: 320, damping: 26 }}
                drag="y"
                dragConstraints={{ top: 0, bottom: 0 }}
                dragElastic={{ top: 0.6, bottom: 0.1 }}
                onDragEnd={(_, info) => {
                  if (info.offset.y < -30) setNotifShown(false);
                }}
                className="absolute left-1/2 top-4 z-40 w-[min(92%,380px)] -translate-x-1/2"
              >
                <button
                  onClick={openNote}
                  className="flex w-full items-center gap-3 rounded-[22px] border border-white/25 bg-[#9333ea]/90 px-3.5 py-3 text-left shadow-[0_18px_40px_-12px_rgba(40,10,80,0.6)] backdrop-blur-xl cursor-pointer"
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[11px] bg-white shadow-sm">
                    <Mail className="h-5 w-5 text-[#9333ea]" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="flex items-baseline justify-between gap-2">
                      <span className="truncate font-sans text-[14px] font-semibold text-white">myrielle</span>
                      <span className="shrink-0 font-sans text-[11px] text-white/70">now</span>
                    </span>
                    <span className="block truncate font-sans text-[13px] text-white/90">left you a note on the desk · tap to read</span>
                  </span>
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Personal letter on my own stationery */}
          <AnimatePresence>
            {noteOpen && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, transition: { duration: 0.3 } }}
                className="absolute inset-0 z-40 flex items-center justify-center bg-[#1a0f0a]/55 p-4 backdrop-blur-sm sm:p-6"
                onClick={() => setNoteOpen(false)}
              >
                <motion.div
                  initial={{ opacity: 0, y: 60, rotateX: 55, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, rotateX: 0, scale: 1, rotate: -1.2 }}
                  exit={{ opacity: 0, y: 40, rotateX: 30, scale: 0.92 }}
                  transition={{ type: "spring", stiffness: 180, damping: 20 }}
                  style={{ transformPerspective: 1200, transformOrigin: "50% 0%" }}
                  onClick={(e) => e.stopPropagation()}
                  data-lenis-prevent
                  className="relative w-full max-w-[500px] cursor-default select-none text-[#2b2118]"
                >
                  {/* torn paper: a pale fibrous rim peeks out past the tear, under the sheet itself */}
                  <div className="relative [filter:drop-shadow(0_24px_30px_rgba(20,8,0,0.45))_drop-shadow(0_2px_3px_rgba(20,8,0,0.25))]">
                  <div aria-hidden className="absolute inset-x-0 -bottom-[3px] -top-[3px] bg-[#fffdf8]" style={{ clipPath: TORN_PAPER }} />
                  <div
                    className="relative px-8 pb-10 pt-9 sm:px-11 sm:pb-11 sm:pt-10"
                    style={{
                      background:
                        "radial-gradient(ellipse at 20% 0%, rgba(255,255,255,0.7), transparent 60%), linear-gradient(180deg, #fbf7ef 0%, #f6efe2 100%)",
                      clipPath: TORN_PAPER,
                    }}
                  >
                    {/* dotted notebook grid across the whole sheet */}
                    <div
                      className="pointer-events-none absolute inset-0"
                      style={{
                        backgroundImage: "radial-gradient(circle, rgba(60,45,30,0.28) 1.1px, transparent 1.5px)",
                        backgroundSize: "18px 18px",
                        backgroundPosition: "9px 12px",
                      }}
                    />

                    {/* letterhead */}
                    <div className="relative flex justify-end">
                      <span className="-rotate-3 font-reenie text-2xl text-red-700/80 sm:text-3xl">{todayDateStr}</span>
                    </div>

                    {/* the letter */}
                    <div className="relative mt-3 space-y-[2px] font-caveat text-[24px] leading-[36px] sm:text-[26px]">
                      <p className="text-[32px] font-bold text-[#1a120b]">hi!</p>
                      <p>thanks for stopping by.</p>
                      <p>
                        everything you see here
                        <br />
                        represents a piece of my journey.
                      </p>
                      <p>feel free to explore around.</p>
                      <p className="font-semibold">have fun!</p>
                    </div>

                    {/* signature */}
                    <div className="relative mt-4 flex items-end justify-end gap-3">
                      <div className="flex items-end gap-3">
                      <span className="font-caveat text-[40px] font-bold leading-none text-[#1a120b]">-myrielle</span>
                      </div>
                    </div>

                    {/* back to the desk */}
                    <div className="relative mt-5 flex justify-center">
                      <button
                        onMouseEnter={() => playHoverSound()}
                        onClick={() => {
                          playClickSound();
                          setNoteOpen(false);
                        }}
                        className="group inline-flex items-center gap-2 font-caveat text-2xl font-bold text-[#7c3aed] transition-colors hover:text-[#5b21b6]"
                      >
                        <span className="relative">
                          back to the desk
                          <span className="absolute -bottom-0.5 left-0 h-[2px] w-full origin-left scale-x-50 rounded-full bg-current transition-transform duration-300 group-hover:scale-x-100" />
                        </span>
                        <span className="font-sans transition-transform duration-300 group-hover:translate-x-1">→</span>
                      </button>
                    </div>
                  </div>
                  </div>


                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}

// A sheet torn out of a notebook: ragged along the top and bottom, cut clean down the sides.
// Built once from a fixed seed so the tear is the same every time.
const TORN_PAPER = (() => {
  let s = 7;
  const rnd = () => ((s = (s * 16807) % 2147483647) - 1) / 2147483646;
  const edge = (y0: number, depth: number, down: boolean) => {
    const pts: string[] = [];
    for (let x = 0; x <= 100; x += 1.6 + rnd() * 1.8) {
      const dip = rnd() * depth + (rnd() < 0.18 ? depth * 0.8 : 0); // the odd deeper bite
      pts.push(`${Math.min(100, x).toFixed(2)}% ${down ? `calc(100% - ${(y0 + dip).toFixed(1)}px)` : `${(y0 + dip).toFixed(1)}px`}`);
    }
    pts.push(`100% ${down ? `calc(100% - ${y0}px)` : `${y0}px`}`);
    return pts;
  };
  const top = edge(0, 7, false);
  const bottom = edge(0, 8, true).reverse();
  return `polygon(${[...top, ...bottom].join(", ")})`;
})();

function FramePlaceholder() {
  return (
    <div className="flex h-full w-full items-center justify-center bg-[#160c07] bg-[radial-gradient(ellipse_at_top_right,rgba(251,191,36,0.15),transparent_60%)]">
      <span className="font-mono text-[11px] uppercase tracking-widest text-amber-100/60">setting up the desk…</span>
    </div>
  );
}
