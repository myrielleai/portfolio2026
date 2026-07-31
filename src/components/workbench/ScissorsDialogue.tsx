import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface ScissorsDialogueProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ScissorsDialogue({ isOpen, onClose }: ScissorsDialogueProps) {
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
          className="absolute bottom-12 left-1/2 -translate-x-1/2 z-20 pointer-events-auto cursor-pointer select-none text-center px-4"
        >
          <motion.p
            initial={{ opacity: 0, y: 12, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.96 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="text-base sm:text-lg md:text-xl font-serif italic text-amber-100/90 tracking-wider drop-shadow-[0_4px_16px_rgba(0,0,0,0.95)]"
          >
            should i cut my hair again?
          </motion.p>
        </div>
      )}
    </AnimatePresence>
  );
}
