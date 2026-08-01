import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface BlueprintLineProps {
  isActive: boolean;
  onComplete: () => void;
}

export default function BlueprintLine({ isActive, onComplete }: BlueprintLineProps) {
  useEffect(() => {
    if (isActive) {
      const timer = setTimeout(() => {
        onComplete();
      }, 1200);
      return () => clearTimeout(timer);
    }
  }, [isActive, onComplete]);

  if (!isActive) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 pointer-events-none overflow-hidden">
        <svg className="w-full h-full">
          {/* Blueprint Guideline Dash */}
          <motion.path
            key="line-active"

            d="M 60% 20% L 30% 50% L 15% 85%"
            fill="none"
            stroke="#38bdf8"
            strokeWidth="3"
            strokeDasharray="6 6"
            initial={{ pathLength: 0, opacity: 1 }}
            animate={{ pathLength: 1, opacity: [1, 1, 0] }}
            transition={{ duration: 1.1, ease: "easeInOut" }}
          />

          {/* Precision Ruler Dimensions Label */}
          <motion.text
            x="40%"
            y="35%"
            fill="#7dd3fc"
            fontSize="14"
            fontFamily="monospace"
            fontWeight="bold"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0] }}
            transition={{ duration: 1.1, times: [0, 0.4, 1] }}
          >
            📐 JOURNEY VECTOR: 45.0° [TRANSITIONING...]
          </motion.text>
        </svg>
      </div>
    </AnimatePresence>
  );
}
