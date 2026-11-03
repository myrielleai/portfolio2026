import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight, MapPin, X } from "lucide-react";
import { playClickSound } from "../../utils/audio";
import { PH_PIN, WORLD_H, WORLD_LAND, WORLD_SPHERE, WORLD_W } from "./worldLand";

interface MapModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const GMAPS = "https://www.google.com/maps/place/Makati,+Metro+Manila,+Philippines";

/** Opened from the globe: a paper card with a simple world map, pinned on the Philippines. */
export default function MapModal({ isOpen, onClose }: MapModalProps) {
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    if (!isOpen) return;
    setNow(new Date());
    const t = setInterval(() => setNow(new Date()), 30_000);
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => { clearInterval(t); window.removeEventListener("keydown", onKey); };
  }, [isOpen, onClose]);

  const localTime = now.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", timeZone: "Asia/Manila" });
  const close = () => { playClickSound(); onClose(); };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex cursor-pointer items-center justify-center bg-[#1a0f0a]/60 p-4 backdrop-blur-md select-none"
          onClick={close}
        >
          <motion.div
            onClick={(e) => e.stopPropagation()}
            initial={{ opacity: 0, scale: 0.92, y: 30, rotate: -1.5 }}
            animate={{ opacity: 1, scale: 1, y: 0, rotate: -0.5 }}
            exit={{ opacity: 0, scale: 0.94, y: 24 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-[min(94vw,560px)] cursor-default rounded-2xl border border-amber-900/10 bg-[#fbf7ef] p-4 text-zinc-900 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.8)] sm:p-5"
            role="dialog"
            aria-modal="true"
            aria-label="Where I'm based"
          >
            <button
              onClick={close}
              aria-label="Close"
              className="absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full text-zinc-500 transition-colors hover:bg-amber-900/10 hover:text-zinc-900"
            >
              <X className="h-4 w-4" />
            </button>
            <div className="mb-3 pr-10">
              <span className="font-mono text-[10px] uppercase tracking-widest text-amber-800/80">Based in</span>
              <h4 className="mt-1 flex items-center gap-2 font-display text-2xl font-bold tracking-tight !text-zinc-900">
                <MapPin className="h-5 w-5 text-purple-600" />
                Makati City, Philippines
              </h4>
              <p className="mt-1 font-mono text-[11px] uppercase tracking-wider text-zinc-500">{localTime} local time · GMT+8</p>
            </div>
            <div className="relative w-full overflow-hidden rounded-xl border border-amber-900/15 bg-[#f3ead9] p-2">
              <svg viewBox={`0 0 ${WORLD_W} ${WORLD_H}`} className="block h-auto w-full" role="img" aria-label="World map with a pin on the Philippines">
                <path d={WORLD_SPHERE} fill="#e9dcc3" />
                <path d={WORLD_LAND} fill="#cdb791" stroke="#b39a70" strokeWidth={0.6} strokeLinejoin="round" />
                <path d={WORLD_SPHERE} fill="none" stroke="#b39a70" strokeWidth={1} />
                {/* pin */}
                <g transform={`translate(${PH_PIN.x} ${PH_PIN.y})`}>
                  <circle r={10} fill="#9333ea" opacity={0.25}>
                    <animate attributeName="r" values="6;22;6" dur="2.4s" repeatCount="indefinite" />
                    <animate attributeName="opacity" values="0.35;0;0.35" dur="2.4s" repeatCount="indefinite" />
                  </circle>
                  <path d="M0 0 C -9 -14 -14 -20 -14 -28 A 14 14 0 1 1 14 -28 C 14 -20 9 -14 0 0 Z" fill="#9333ea" stroke="#fbf7ef" strokeWidth={2.5} />
                  <circle cy={-28} r={5} fill="#fbf7ef" />
                  <text x={20} y={-30} className="font-mono" fontSize={18} fontWeight={700} fill="#3b2a14">Philippines</text>
                </g>
              </svg>
            </div>
            <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
              <span />
              <a
                href={GMAPS}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 rounded-full bg-zinc-900 px-4 py-2 font-mono text-[11px] font-semibold tracking-wider text-amber-50 transition-opacity hover:opacity-85"
              >
                Open in Google Maps
                <ArrowUpRight className="h-3.5 w-3.5" />
              </a>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
