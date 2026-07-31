import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Coffee, Quote, X } from "lucide-react";
import { playClickSound } from "../../utils/audio";

interface QuoteToastProps {
  quote: string | null;
  onClose: () => void;
}

export default function QuoteToast({ quote, onClose }: QuoteToastProps) {
  useEffect(() => {
    if (!quote) return;
    const timer = setTimeout(() => {
      onClose();
    }, 6000);
    return () => clearTimeout(timer);
  }, [quote, onClose]);

  if (!quote) return null;

  return (
    <AnimatePresence>
      <div className="absolute bottom-8 right-8 z-20 max-w-md pointer-events-auto">
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          transition={{ duration: 0.25 }}
          className="bg-emerald-950/90 text-emerald-100 border border-emerald-500/40 rounded-2xl p-5 shadow-2xl backdrop-blur-md relative font-sans"
        >
          <button
            onClick={() => {
              playClickSound();
              onClose();
            }}
            className="absolute top-3 right-3 p-1 text-emerald-400/70 hover:text-emerald-200 rounded-full hover:bg-emerald-900/50 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-start gap-3">
            <div className="p-2.5 bg-emerald-500/20 text-emerald-400 rounded-xl flex-shrink-0 mt-0.5">
              <Coffee className="w-5 h-5 animate-bounce" />
            </div>

            <div>
              <div className="flex items-center gap-1.5 text-emerald-400 text-[10px] font-mono font-bold uppercase tracking-widest mb-1">
                <Quote className="w-3 h-3" />
                <span>FRESH MATCHA & THOUGHTS 🍵</span>
              </div>
              <p className="text-xs md:text-sm font-medium italic text-emerald-100/90 leading-relaxed">
                "{quote}"
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
