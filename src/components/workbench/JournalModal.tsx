import { motion, AnimatePresence } from "framer-motion";
import { X, BookOpen } from "lucide-react";
import { playClickSound } from "../../utils/audio";

interface JournalModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function JournalModal({ isOpen, onClose }: JournalModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md cursor-pointer"
          onClick={() => {
            playClickSound();
            onClose();
          }}
        >
          <motion.div
            onClick={(e) => e.stopPropagation()}
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-4xl bg-[#fcfbf9] text-zinc-800 border border-zinc-200/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col h-[82vh] cursor-default"
            data-lenis-prevent
          >
            {/* Close Button */}
            <button
              onClick={() => {
                playClickSound();
                onClose();
              }}
              className="absolute top-4 right-4 z-20 p-2 text-zinc-500 hover:text-zinc-900 bg-white/90 hover:bg-white rounded-full border border-zinc-300/80 shadow-md transition-all cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Main Journal Pages with Dotted Grid Notebook Texture (White Paper Page) */}
            <div className="flex-grow p-6 md:p-8 overflow-y-auto font-sans relative bg-[#fcfbf9] bg-[radial-gradient(#d4d4d8_1.5px,transparent_1.5px)] [background-size:24px_24px] text-zinc-800">
              {/* Soft vertical notebook margin line */}
              <div className="absolute top-0 bottom-0 left-4 md:left-6 w-[1px] bg-red-400/30 pointer-events-none" />

              {/* Dotted notebook page header bar */}
              <div className="flex items-center justify-between gap-4 text-[11px] font-mono text-zinc-500 mb-6 pb-3 border-b border-zinc-200 pr-10">
                <div className="flex items-center gap-2.5">
                  <BookOpen className="w-4 h-4 text-amber-700" />
                  <span className="font-bold tracking-wider text-zinc-900 uppercase">MYRIELLE'S JOURNAL</span>
                </div>
              </div>

              {/* Center notebook crease line for 2-column page layout */}
              <div className="hidden md:block absolute top-14 bottom-6 left-1/2 w-[1px] bg-gradient-to-b from-zinc-300/80 via-zinc-200/90 to-zinc-300/80 pointer-events-none -translate-x-1/2 shadow-[0_0_8px_rgba(0,0,0,0.04)]" />

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10 relative"
              >
                {/* Column 1 / Left Page */}
                <div className="space-y-5">
                  <p className="font-caveat text-2xl sm:text-3xl text-zinc-800 leading-relaxed font-medium">
                    bading
                  </p>
                </div>

                {/* Column 2 / Right Page */}
                <div className="relative space-y-5 min-h-[300px]">
                  {/* Page 2 Scribble Container */}
                  <div className="relative pt-1">
                    <div className="flex justify-between items-center text-xs font-mono text-zinc-400 mb-2 select-none">
                      <span className="font-caveat text-lg text-zinc-500/80 -rotate-2">pg. 2</span>
                    </div>

                    {/* Hand-drawn Scribble & Doodles */}
                    <div className="relative p-5 rounded-xl bg-amber-50/30 border border-amber-900/10 shadow-xs overflow-hidden select-none">
                      {/* Hand-drawn SVG strokes */}
                      <svg
                        className="w-full h-52 text-zinc-700 overflow-visible"
                        viewBox="0 0 300 170"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        {/* Wavy looping scribble line across the page top */}
                        <path
                          d="M 10 30 Q 35 5 60 32 T 110 30 T 160 35 T 210 25 T 260 40 T 285 20"
                          stroke="rgba(39, 39, 42, 0.6)"
                          strokeWidth="1.6"
                        />

                        {/* Hand-drawn spiral / swirl scribble */}
                        <path
                          d="M 55 95 C 45 80 80 70 85 100 C 90 120 55 125 40 105 C 25 80 70 55 105 75 C 130 90 120 130 80 135 C 35 140 15 95 50 60 C 75 35 130 45 140 85"
                          stroke="rgba(180, 83, 9, 0.7)"
                          strokeWidth="1.8"
                        />

                        {/* Scribbled cross-hatch shading box */}
                        <path
                          d="M 175 75 L 225 125 M 185 75 L 235 125 M 195 75 L 245 125 M 170 90 L 220 140 M 175 70 L 240 70 M 180 82 L 245 82 M 185 94 L 240 94"
                          stroke="rgba(113, 113, 122, 0.55)"
                          strokeWidth="1.3"
                        />

                        {/* Hand-drawn doodle star */}
                        <path
                          d="M 235 38 L 239 47 L 249 48 L 241 55 L 243 65 L 235 60 L 227 65 L 229 55 L 221 48 L 231 47 Z"
                          fill="rgba(245, 158, 11, 0.25)"
                          stroke="rgba(217, 119, 6, 0.85)"
                          strokeWidth="1.5"
                        />

                        {/* Sparkle strokes */}
                        <path d="M 260 28 L 270 23 M 264 37 L 275 37 M 260 46 L 271 50" stroke="#d97706" strokeWidth="1.5" />

                        {/* Red ink strikethrough scribble at bottom */}
                        <path
                          d="M 15 155 Q 65 145 115 156 T 215 148 T 280 154"
                          stroke="rgba(225, 29, 72, 0.65)"
                          strokeWidth="2.4"
                        />
                      </svg>

                      {/* Handwritten scribble texts */}
                      <div className="absolute top-5 right-5 font-caveat text-2xl text-amber-900/90 rotate-3">
                        ideas in progress ✨
                      </div>

                      <div className="absolute bottom-3 left-5 font-reenie text-3xl text-zinc-700/90 -rotate-2">
                        scribble scribble ~
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
