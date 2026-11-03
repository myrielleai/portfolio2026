import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { playClickSound } from "../../utils/audio";

interface JournalModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// ✏️ Edit these freely: they're written in my voice from things on my desk and my projects.
const ENTRY = {
  date: "saturday · oct 31",
  title: "hello!",
  lines: [
    "spent the whole day rebuilding my portfolio. i moved my entire desk into 3D (yes, the one you're looking at).",
    "DeepLeaf is still the project i'm proudest of. we labeled 1,371 tomato leaf photos by hand, lesion by lesion, and trained a model that learned to outline every one.",
    "it's funny how much of machine learning is just patience and good data.",
    "next up: learn more, build more, sleep more. (two out of three.)",
  ],
};

const FACTS = [
  "Daniel Caesar is permanently on repeat.",
  "that little red Miata on my desk? dream car.",
  "dream trip: Japan.",
];

const paper =
  "relative bg-[#fbf8f1] bg-[radial-gradient(rgba(120,100,80,0.28)_1px,transparent_1px)] [background-size:22px_22px] px-6 py-7 sm:px-9 sm:py-9";

export default function JournalModal({ isOpen, onClose }: JournalModalProps) {
  const close = () => {
    playClickSound();
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex cursor-pointer items-center justify-center bg-[#1a0f0a]/60 p-4 backdrop-blur-sm"
          onClick={close}
        >
          {/* leather cover around the open pages */}
          <motion.div
            onClick={(e) => e.stopPropagation()}
            initial={{ opacity: 0, scale: 0.92, rotateY: -18 }}
            animate={{ opacity: 1, scale: 1, rotateY: 0 }}
            exit={{ opacity: 0, scale: 0.94 }}
            transition={{ type: "spring", stiffness: 170, damping: 22 }}
            style={{ transformPerspective: 1400 }}
            className="relative w-full max-w-5xl cursor-default rounded-[18px] bg-[#120e0c] p-2.5 shadow-[0_40px_90px_-25px_rgba(0,0,0,0.85)] ring-1 ring-[#c9c9cf]/20 sm:p-3.5"
          >
            <button
              onClick={close}
              aria-label="Close journal"
              className="absolute -right-2 -top-2 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-[#fbf8f1] text-[#2b2118] shadow-lg transition-transform hover:scale-105 cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>

            <div
              data-lenis-prevent
              className="relative grid max-h-[80vh] grid-cols-1 overflow-y-auto rounded-[10px] text-[#2b2118] md:grid-cols-2 md:overflow-hidden"
            >
              {/* LEFT PAGE: journal entry */}
              <div className={`${paper} md:overflow-y-auto`}>
                <div className="pointer-events-none absolute inset-y-0 left-12 w-px bg-[#9333ea]/25" />
                <div className="flex items-baseline justify-between pl-8">
                  <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-[#2b2118]/50">{ENTRY.date}</span>
                  <span className="font-caveat text-lg text-[#2b2118]/40">pg. 1</span>
                </div>
                <div className="mt-5 space-y-3 pl-8 font-caveat text-[22px] leading-[1.45] sm:text-[24px]">
                  <p className="text-[30px] font-bold text-[#1a120b]">{ENTRY.title}</p>
                  {ENTRY.lines.map((l, i) => (
                    <p key={i}>{l}</p>
                  ))}
                  <p className="pt-2 text-right font-reenie text-[38px] leading-none text-[#1a120b]">— myrielle</p>
                </div>
                {/* a little leaf sketch taped to the page */}
                <div className="relative ml-8 mt-6 inline-block -rotate-3 bg-white p-2 pb-6 shadow-md">
                  <span className="absolute -top-2 left-1/2 h-4 w-14 -translate-x-1/2 rotate-2 bg-[#ede4ff]/90" />
                  <svg viewBox="0 0 120 90" className="h-20 w-28" fill="none" stroke="#2f5d33" strokeWidth="1.6" strokeLinecap="round">
                    <path d="M60 84 C30 70 22 40 60 8 C98 40 90 70 60 84 Z" fill="#e6f0dc" />
                    <path d="M60 84 V20 M60 40 L46 30 M60 52 L74 42 M60 64 L46 56 M60 30 L70 24" />
                    <rect x="66" y="44" width="22" height="18" stroke="#9333ea" strokeDasharray="3 2" />
                  </svg>
                  <span className="absolute bottom-1 left-0 right-0 text-center font-caveat text-sm text-[#2b2118]/70">lesion found :)</span>
                </div>
              </div>

              {/* gutter shadow between the pages */}
              <div className="pointer-events-none absolute inset-y-0 left-1/2 hidden w-10 -translate-x-1/2 bg-[linear-gradient(90deg,transparent,rgba(60,40,20,0.18)_45%,rgba(60,40,20,0.28)_50%,rgba(60,40,20,0.18)_55%,transparent)] md:block" />

              {/* RIGHT PAGE: fun facts */}
              <div className={`${paper} md:overflow-y-auto`}>
                <div className="flex items-baseline justify-between">
                  <span />
                  <span className="font-caveat text-lg text-[#2b2118]/40">pg. 2</span>
                </div>
                <ul className="mt-5 space-y-2.5 font-caveat text-[22px] leading-snug sm:text-[24px]">
                  {FACTS.map((f, i) => (
                    <motion.li
                      key={f}
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.25 + i * 0.07 }}
                      className="flex items-start gap-3"
                    >
                      <span>{f}</span>
                    </motion.li>
                  ))}
                </ul>
                {/* doodles */}
                <div className="mt-6 flex items-end justify-between">
                  <svg viewBox="0 0 70 60" className="h-14 w-16 -rotate-6" fill="none" stroke="#7c3aed" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14 26 h32 l-3 22 a4 4 0 0 1 -4 3 h-18 a4 4 0 0 1 -4 -3 Z" />
                    <path d="M46 30 c8 0 8 10 0 10" />
                    <path d="M23 20 c-2 -4 2 -6 0 -10 M32 20 c-2 -4 2 -6 0 -10" />
                  </svg>
                  <span className="rotate-2 font-caveat text-xl text-[#2b2118]/60">more pages coming soon…</span>
                  <svg viewBox="0 0 60 50" className="h-11 w-14 rotate-6" fill="none" stroke="#7c3aed" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M8 40 C6 26 14 16 28 16 C42 16 52 26 50 40 Z" />
                    <path d="M16 20 L14 8 L24 16 M40 16 L46 8 L44 20" />
                    <path d="M20 30 q3 2 6 0 M32 30 q3 2 6 0" />
                  </svg>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
