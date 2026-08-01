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
                  <p className="text-zinc-700 leading-relaxed text-sm">
                    bading
                  </p>
                </div>

                {/* Column 2 / Right Page */}
                <div className="space-y-5" />
              </motion.div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
