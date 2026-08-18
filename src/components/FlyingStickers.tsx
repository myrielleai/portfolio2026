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
  Code,
  Cpu,
  Layers,
  Wand2,
  Box,
  Laptop,
  Compass,
} from "lucide-react";

// Predefined sticker presets for floating and interactive stickers
const STICKER_PRESETS = [
  {
    id: "design-code",
    text: "DESIGN & CODE",
    icon: Palette,
    bg: "bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600",
    textColor: "text-white",
    border: "border-white/90",
    shadow: "shadow-purple-500/30",
  },
  {
    id: "creative",
    text: "100% CREATIVE",
    icon: Zap,
    bg: "bg-amber-400 dark:bg-amber-500",
    textColor: "text-slate-950 font-black",
    border: "border-white/90",
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
    border: "border-white/90",
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
    border: "border-white/90",
    shadow: "shadow-rose-500/30",
  },
  {
    id: "good-vibes",
    text: "GOOD VIBES ONLY",
    icon: Smile,
    bg: "bg-gradient-to-r from-orange-400 to-pink-500",
    textColor: "text-white",
    border: "border-white/90",
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
    border: "border-white/90",
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
    border: "border-white/90",
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
  {
    id: "react-ts",
    text: "REACT + TS ⚡",
    icon: Cpu,
    bg: "bg-gradient-to-r from-sky-500 to-blue-700",
    textColor: "text-white",
    border: "border-sky-200",
    shadow: "shadow-sky-500/30",
  },
  {
    id: "ui-magic",
    text: "UI/UX MAGIC",
    icon: Wand2,
    bg: "bg-gradient-to-r from-fuchsia-600 to-purple-700",
    textColor: "text-white",
    border: "border-fuchsia-200",
    shadow: "shadow-fuchsia-500/30",
  },
  {
    id: "open-source",
    text: "OPEN SOURCE",
    icon: Layers,
    bg: "bg-gradient-to-r from-emerald-500 to-teal-700",
    textColor: "text-white",
    border: "border-emerald-200",
    shadow: "shadow-emerald-500/30",
  },
  {
    id: "prototype",
    text: "PROTOTYPE LAB 🧪",
    icon: Box,
    bg: "bg-gradient-to-r from-indigo-600 to-violet-800",
    textColor: "text-indigo-100",
    border: "border-indigo-300",
    shadow: "shadow-indigo-500/30",
  },
  {
    id: "shipped",
    text: "SHIPPED 🚀",
    icon: Laptop,
    bg: "bg-gradient-to-r from-green-500 to-emerald-600",
    textColor: "text-white",
    border: "border-white/90",
    shadow: "shadow-green-500/30",
  },
  {
    id: "explore",
    text: "EXPLORE & BUILD",
    icon: Compass,
    bg: "bg-gradient-to-r from-amber-600 to-rose-600",
    textColor: "text-white",
    border: "border-amber-200",
    shadow: "shadow-rose-500/30",
  },
];

interface FlyingStickerItem {
  instanceId: string;
  presetIndex: number;
  initialX: number; // percentage 2..94
  speedY: number; // duration in seconds
  delay: number;
  rotation: number;
  rotateDelta: number;
  scale: number;
  swayAmp: number;
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

  // Generate floating stickers spread across the full width and height on mount
  useEffect(() => {
    const totalCount = 26;
    const items: FlyingStickerItem[] = Array.from({ length: totalCount }).map((_, i) => {
      // Divide screen width into bins with random jitter for uniform horizontal distribution
      const binWidth = 92 / totalCount;
      const initialX = Math.min(94, Math.max(2, 3 + i * binWidth + (Math.random() * 2 - 1)));
      const speedY = 18 + Math.random() * 14; // duration between 18s and 32s

      return {
        instanceId: `fly-${i}-${Date.now()}`,
        presetIndex: i % STICKER_PRESETS.length,
        initialX,
        speedY,
        // Negative delays populate stickers across full screen height immediately on load
        delay: -Math.random() * speedY,
        rotation: (Math.random() - 0.5) * 40,
        rotateDelta: 10 + Math.random() * 20,
        scale: 0.8 + Math.random() * 0.35,
        swayAmp: (Math.random() > 0.5 ? 1 : -1) * (10 + Math.random() * 16),
      };
    });

    setFlyingStickers(items);
  }, []);

  // Handle click on background layer to burst mini stickers
  const spawnBurstStickersAt = (clickX: number, clickY: number) => {
    const count = 3 + Math.floor(Math.random() * 3);
    const newItems: BurstStickerItem[] = Array.from({ length: count }).map((_, i) => {
      const angle = -Math.PI / 2 + (Math.random() - 0.5) * 1.5;
      const speed = 4 + Math.random() * 6;
      return {
        id: `burst-${Date.now()}-${i}-${Math.random()}`,
        presetIndex: Math.floor(Math.random() * STICKER_PRESETS.length),
        x: clickX,
        y: clickY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        rotation: (Math.random() - 0.5) * 60,
        scale: 0.85 + Math.random() * 0.35,
      };
    });
    setBurstStickers((prev) => [...prev.slice(-18), ...newItems]);
  };

  // Burst sticker physics loop
  useEffect(() => {
    if (burstStickers.length === 0) return;
    const interval = setInterval(() => {
      setBurstStickers((prev) =>
        prev
          .map((item) => ({
            ...item,
            x: item.x + item.vx,
            y: item.y + item.vy,
            vy: item.vy - 0.12, // subtle float up
            rotation: item.rotation + 1.8,
            scale: item.scale * 0.982,
          }))
          .filter((item) => item.scale > 0.2)
      );
    }, 30);
    return () => clearInterval(interval);
  }, [burstStickers]);

  const handleContainerClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // Only spawn if clicking direct container background (not a sticker or card)
    if (e.target !== containerRef.current) return;
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
      {/* 1. Full Footer Flying Floating Stickers Layer */}
      {flyingStickers.map((sticker) => {
        const preset = STICKER_PRESETS[sticker.presetIndex];
        const Icon = preset.icon;

        const leftTarget = Math.min(94, Math.max(2, sticker.initialX + sticker.swayAmp));
        const rightTarget = Math.min(94, Math.max(2, sticker.initialX - sticker.swayAmp));

        return (
          <motion.div
            key={sticker.instanceId}
            initial={{
              y: "110%",
              x: `${sticker.initialX}%`,
              rotate: sticker.rotation,
              scale: sticker.scale,
              opacity: 0,
            }}
            animate={{
              y: ["110%", "-115%"],
              x: [
                `${sticker.initialX}%`,
                `${leftTarget}%`,
                `${rightTarget}%`,
                `${sticker.initialX}%`,
              ],
              rotate: [
                sticker.rotation,
                sticker.rotation + sticker.rotateDelta,
                sticker.rotation - sticker.rotateDelta,
                sticker.rotation,
              ],
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
            dragElastic={0.1}
            whileHover={{
              scale: sticker.scale * 1.25,
              rotate: 0,
              zIndex: 60,
              cursor: "grab",
            }}
            whileTap={{ scale: sticker.scale * 1.1, cursor: "grabbing" }}
            className="absolute bottom-0 left-0 pointer-events-auto cursor-grab touch-none"
            style={{ zIndex: 25 }}
          >
            {/* Die-cut sticker badge wrapper */}
            <div
              className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border-2 ${preset.border} ${preset.bg} ${preset.textColor} shadow-xl ${preset.shadow} transform transition-all duration-200 hover:shadow-2xl ring-4 ring-white/20 dark:ring-black/30 backdrop-blur-sm`}
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
                zIndex: 55,
              }}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: item.scale, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              className="pointer-events-none"
            >
              <div
                className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border-2 ${preset.border} ${preset.bg} ${preset.textColor} shadow-2xl ring-4 ring-white/30`}
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
    </div>
  );
}

