import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface LaptopDialogueProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function LaptopDialogue({ isOpen, onClose }: LaptopDialogueProps) {
  useEffect(() => {
    if (!isOpen) return;
    const timer = setTimeout(() => {
      onClose();
    }, 3200);
    return () => clearTimeout(timer);
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div 
          onClick={onClose}
          className="absolute left-1/2 top-[calc(var(--mat-bottom,82%)+14px)] -translate-x-1/2 z-20 pointer-events-auto cursor-pointer select-none text-center px-4"
        >
          <motion.p
            initial={{ opacity: 0, y: 12, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.96 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="inline-block max-w-[88vw] sm:whitespace-nowrap px-2 text-base sm:text-lg md:text-xl font-serif italic desk-caption tracking-wide"
          >
            back to the grind
          </motion.p>
        </div>
      )}
    </AnimatePresence>
  );
}
