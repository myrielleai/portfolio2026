import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  Zap,
  Coffee,
  Heart,
  Rocket,
  Star,
  Palette,
  Terminal,
  Flame,
  Smile,
  Globe,
  Code
} from "lucide-react";

// Predefined sticker presets for floating and interactive stickers
const STICKER_PRESETS = [
  {
    id: "design-code",
    text: "DESIGN & CODE",
    icon: Palette,
    bg: "bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600",
    textColor: "text-white",
    border: "border-white",
    shadow: "shadow-purple-500/30",
  },
  {
    id: "creative",
    text: "100% CREATIVE",
    icon: Zap,
    bg: "bg-amber-400 dark:bg-amber-500",
    textColor: "text-slate-950 font-black",
    border: "border-white",
    shadow: "shadow-amber-500/30",
  },
  {
    id: "matcha",
    text: "MATCHA POWERED ☕",
    icon: Coffee,
    bg: "bg-emerald-600",
    textColor: "text-emerald-50",
    border: "border-emerald-200",
    shadow: "shadow-emerald-500/30",
  },
  {
    id: "handcrafted",
    text: "HANDCRAFTED",
    icon: Sparkles,
    bg: "bg-pink-600 dark:bg-pink-500",
    textColor: "text-white",
    border: "border-white",
    shadow: "shadow-pink-500/30",
  },
  {
    id: "archive-2026",
    text: "ARCHIVE 2026",
    icon: Rocket,
    bg: "bg-gradient-to-r from-cyan-500 to-blue-600",
    textColor: "text-white",
    border: "border-cyan-100",
    shadow: "shadow-cyan-500/30",
  },
  {
    id: "made-with-love",
    text: "MADE WITH LOVE",
    icon: Heart,
    bg: "bg-rose-500",
    textColor: "text-white",
    border: "border-white",
    shadow: "shadow-rose-500/30",
  },
  {
    id: "good-vibes",
    text: "GOOD VIBES ONLY",
    icon: Smile,
    bg: "bg-gradient-to-r from-orange-400 to-pink-500",
    textColor: "text-white",
    border: "border-white",
    shadow: "shadow-orange-500/30",
  },
  {
    id: "pixel-perfect",
    text: "PIXEL PERFECT",
    icon: Terminal,
    bg: "bg-violet-900 text-violet-100",
    textColor: "text-violet-200",
    border: "border-violet-400",
    shadow: "shadow-violet-500/40",
  },
  {
    id: "stay-curious",
    text: "STAY CURIOUS",
    icon: Star,
    bg: "bg-gradient-to-r from-yellow-400 to-amber-500",
    textColor: "text-slate-900 font-extrabold",
    border: "border-white",
    shadow: "shadow-yellow-500/30",
  },
  {
    id: "on-fire",
    text: "BUILD & SHIP 🔥",
    icon: Flame,
    bg: "bg-gradient-to-r from-red-600 to-orange-500",
    textColor: "text-white",
    border: "border-orange-200",
    shadow: "shadow-red-500/30",
  },
  {
    id: "global",
    text: "WORLDWIDE 🌐",
    icon: Globe,
    bg: "bg-teal-600",
    textColor: "text-teal-50",
    border: "border-white",
    shadow: "shadow-teal-500/30",
  },
  {
    id: "fullstack",
    text: "FULL STACK",
    icon: Code,
    bg: "bg-slate-900 dark:bg-white text-white dark:text-slate-950",
    textColor: "text-white dark:text-slate-950",
    border: "border-accent",
    shadow: "shadow-slate-500/30",
  },
];

interface FlyingStickerItem {
  instanceId: string;
  presetIndex: number;
  initialX: number; // percentage 5..90
  speedY: number; // pixels per frame or duration
  delay: number;
  rotation: number;
  scale: number;
  swayAmp: number;
  swayFreq: number;
}

interface BurstStickerItem {
  id: string;
  presetIndex: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  rotation: number;
  scale: number;
}

export default function FlyingStickers() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [flyingStickers, setFlyingStickers] = useState<FlyingStickerItem[]>([]);
  const [burstStickers, setBurstStickers] = useState<BurstStickerItem[]>([]);

  // Generate initial floating stickers spread across the footer
  useEffect(() => {
    const items: FlyingStickerItem[] = Array.from({ length: 16 }).map((_, i) => ({
      instanceId: `fly-${i}-${Date.now()}`,
      presetIndex: i % STICKER_PRESETS.length,
      initialX: 3 + (i * 6) + (Math.random() * 2 - 1),
      speedY: 15 + Math.random() * 10, // duration in seconds
      delay: (i * 1.3) - 10, // negative delays ensure full screen coverage on load
      rotation: (Math.random() - 0.5) * 35,
      scale: 0.85 + Math.random() * 0.35,
      swayAmp: 15 + Math.random() * 25,
      swayFreq: 2 + Math.random() * 3,
    }));
    setFlyingStickers(items);
  }, []);

  // Handle click on footer to launch burst stickers upward
  const spawnBurstStickersAt = (clickX: number, clickY: number) => {
    const count = 3 + Math.floor(Math.random() * 3);
    const newItems: BurstStickerItem[] = Array.from({ length: count }).map((_, i) => {
      const angle = -Math.PI / 2 + (Math.random() - 0.5) * 1.2; // upward trajectory
      const speed = 4 + Math.random() * 6;
      return {
        id: `burst-${Date.now()}-${i}-${Math.random()}`,
        presetIndex: Math.floor(Math.random() * STICKER_PRESETS.length),
        x: clickX,
        y: clickY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        rotation: (Math.random() - 0.5) * 60,
        scale: 0.8 + Math.random() * 0.4,
      };
    });
    setBurstStickers((prev) => [...prev.slice(-15), ...newItems]);
  };

  // Burst sticker physics animation loop
  useEffect(() => {
    if (burstStickers.length === 0) return;
    const interval = setInterval(() => {
      setBurstStickers((prev) =>
        prev
          .map((item) => ({
            ...item,
            x: item.x + item.vx,
            y: item.y + item.vy,
            vy: item.vy - 0.15, // float upward extra momentum
            rotation: item.rotation + 1.5,
            scale: item.scale * 0.985,
          }))
          .filter((item) => item.scale > 0.2)
      );
    }, 30);
    return () => clearInterval(interval);
  }, [burstStickers]);

  // Handle container click event listener via parent or local overlay
  const handleContainerClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    spawnBurstStickersAt(x, y);
  };

  return (
    <div
      ref={containerRef}
      onClick={handleContainerClick}
      className="absolute inset-0 pointer-events-auto overflow-hidden z-15 select-none"
    >
      {/* 1. Continuous Floating Flying Stickers Layer */}
      {flyingStickers.map((sticker) => {
        const preset = STICKER_PRESETS[sticker.presetIndex];
        const Icon = preset.icon;

        return (
          <motion.div
            key={sticker.instanceId}
            initial={{
              y: "120%",
              x: `${sticker.initialX}%`,
              rotate: sticker.rotation,
              scale: sticker.scale,
              opacity: 0,
            }}
            animate={{
              y: ["120%", "-115vh"],
              x: [
                `${sticker.initialX}%`,
                `${sticker.initialX + (sticker.swayAmp / 10)}%`,
                `${sticker.initialX - (sticker.swayAmp / 10)}%`,
                `${sticker.initialX}%`,
              ],
              rotate: [sticker.rotation, sticker.rotation + 15, sticker.rotation - 15, sticker.rotation],
              opacity: [0, 0.95, 0.95, 0.95, 0],
            }}
            transition={{
              duration: sticker.speedY,
              repeat: Infinity,
              delay: sticker.delay,
              ease: "linear",
            }}
            drag
            dragConstraints={containerRef}
            whileHover={{
              scale: sticker.scale * 1.25,
              rotate: 0,
              zIndex: 40,
              cursor: "grab",
            }}
            whileTap={{ scale: sticker.scale * 1.1, cursor: "grabbing" }}
            className="absolute bottom-0 left-0 pointer-events-auto cursor-grab touch-none"
            style={{ zIndex: 20 }}
          >
            {/* Die-cut sticker badge wrapper */}
            <div
              className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border-2 ${preset.border} ${preset.bg} ${preset.textColor} shadow-lg ${preset.shadow} transform transition-transform duration-200 hover:shadow-2xl ring-4 ring-white/20 dark:ring-black/30 backdrop-blur-sm`}
            >
              <Icon className="w-4 h-4 shrink-0 animate-pulse" />
              <span className="font-mono text-xs font-black tracking-wider uppercase whitespace-nowrap drop-shadow-sm">
                {preset.text}
              </span>
            </div>
          </motion.div>
        );
      })}

      {/* 2. Interactive Click Burst Flying Stickers Layer */}
      <AnimatePresence>
        {burstStickers.map((item) => {
          const preset = STICKER_PRESETS[item.presetIndex];
          const Icon = preset.icon;

          return (
            <motion.div
              key={item.id}
              style={{
                position: "absolute",
                left: `${item.x}px`,
                top: `${item.y}px`,
                transform: `translate(-50%, -50%) rotate(${item.rotation}deg) scale(${item.scale})`,
                zIndex: 35,
              }}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: item.scale, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              className="pointer-events-none"
            >
              <div
                className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border-2 ${preset.border} ${preset.bg} ${preset.textColor} shadow-2xl ring-4 ring-white/30`}
              >
                <Icon className="w-3.5 h-3.5 shrink-0" />
                <span className="font-mono text-xs font-black tracking-wider uppercase whitespace-nowrap">
                  {preset.text}
                </span>
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>

      {/* Hint Badge at Bottom Right of Footer */}
      <div className="absolute bottom-4 right-6 pointer-events-none z-25 opacity-75 hidden sm:block">
        <span className="font-mono text-[10px] tracking-widest text-[var(--accent)] font-bold uppercase bg-[var(--surface)]/80 backdrop-blur-md px-3 py-1 rounded-full border border-[var(--border)] shadow-sm inline-flex items-center gap-1.5">
          <Sparkles className="w-3 h-3 text-amber-500 animate-spin" style={{ animationDuration: "6s" }} />
          FLYING STICKERS ARCHIVE • CLICK OR DRAG!
        </span>
      </div>
    </div>
  );
}
