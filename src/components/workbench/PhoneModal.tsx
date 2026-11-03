import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Mail, Camera, Flashlight, MessageCircle, Pause, Play, SkipBack, SkipForward, ArrowUpRight } from "lucide-react";
import { InstagramIcon } from "../Icons";
import { playClickSound } from "../../utils/audio";

interface PhoneModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// Liquid-glass card used for widgets and notifications on the lock screen
const glass =
  "bg-white/18 backdrop-blur-xl border border-white/30 shadow-[inset_0_1px_0_rgba(255,255,255,0.35),0_8px_24px_-10px_rgba(60,20,40,0.45)]";

export default function PhoneModal({ isOpen, onClose }: PhoneModalProps) {
  const [torch, setTorch] = useState(false);
  const [flash, setFlash] = useState(false);
  const [playing, setPlaying] = useState(true);
  const [now, setNow] = useState(new Date());
  const [progress, setProgress] = useState(0.38);

  useEffect(() => {
    if (!isOpen) return;
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, [isOpen]);

  // Gentle fake playback so the Now Playing bar moves while open
  useEffect(() => {
    if (!isOpen || !playing) return;
    const t = setInterval(() => setProgress((p) => (p >= 1 ? 0 : p + 1 / 209)), 1000);
    return () => clearInterval(t);
  }, [isOpen, playing]);

  const date = now.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });
  const time = now.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true }).replace(/\s?[AP]M/i, "");
  const elapsed = Math.round(progress * 209);
  const fmt = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;

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
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1a0f0a]/60 backdrop-blur-md select-none font-sans cursor-pointer"
          onClick={close}
        >
          {/* Burgundy titanium frame with side buttons */}
          <motion.div
            onClick={(e) => e.stopPropagation()}
            initial={{ opacity: 0, scale: 0.9, y: 40, rotate: -2 }}
            animate={{ opacity: 1, scale: 1, y: 0, rotate: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 40, rotate: 2 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="relative h-[min(86vh,820px)] aspect-[440/956] rounded-[58px] p-[10px] cursor-default bg-gradient-to-br from-[#7a2a36] via-[#4a1522] to-[#2c0b13] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.85),inset_0_0_0_1.5px_rgba(255,255,255,0.18)]"
            data-lenis-prevent
          >
            <span className="absolute -left-[3px] top-[19%] h-[5%] w-[3px] rounded-l bg-[#5a1b28]" />
            <span className="absolute -left-[3px] top-[27%] h-[8%] w-[3px] rounded-l bg-[#5a1b28]" />
            <span className="absolute -left-[3px] top-[37%] h-[8%] w-[3px] rounded-l bg-[#5a1b28]" />
            <span className="absolute -right-[3px] top-[30%] h-[12%] w-[3px] rounded-r bg-[#5a1b28]" />
            <span className="absolute -right-[3px] top-[55%] h-[7%] w-[3px] rounded-r bg-[#3f1019]" />

            {/* Screen */}
            <div className="relative h-full w-full overflow-hidden rounded-[48px] bg-black text-white">
              {/* Wallpaper */}
              <img src="/phone-wallpaper.webp" alt="" aria-hidden className="absolute inset-0 h-full w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/35" />
              {torch && <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(255,244,214,0.55),transparent_60%)]" />}
              {flash && (
                <motion.div initial={{ opacity: 1 }} animate={{ opacity: 0 }} transition={{ duration: 0.35 }} className="absolute inset-0 z-50 bg-white" />
              )}

              <div className="relative z-10 flex h-full flex-col px-4 pt-3 pb-2">
                {/* Status bar + Dynamic Island */}
                <div className="relative flex h-8 items-center justify-between px-3 text-[13px] font-semibold">
                  <span>{time}</span>
                  <div className="absolute left-1/2 top-0.5 h-[30px] w-[108px] -translate-x-1/2 rounded-full bg-black" />
                  <div className="flex items-center gap-1.5">
                    <span className="flex items-end gap-[2px]">
                      {[4, 6, 8, 10].map((h) => (
                        <span key={h} className="w-[3px] rounded-sm bg-white" style={{ height: h }} />
                      ))}
                    </span>
                    <span className="ml-1 flex h-[11px] w-[22px] items-center rounded-[3px] border border-white/80 p-[1.5px]">
                      <span className="h-full w-[78%] rounded-[1px] bg-white" />
                    </span>
                  </div>
                </div>

                <button
                  onClick={close}
                  className="absolute right-4 top-12 z-30 rounded-full bg-black/25 p-1.5 text-white/85 backdrop-blur-md transition hover:bg-black/40 cursor-pointer"
                  aria-label="Close phone"
                >
                  <X className="h-4 w-4" />
                </button>

                {/* Date and clock */}
                <div className="mt-5 text-center [text-shadow:0_2px_16px_rgba(60,20,40,0.35)]">
                  <p className="text-[15px] font-semibold" style={{ color: "rgba(255,255,255,0.92)" }}>{date}</p>
                  <h1 className="mt-0.5 text-[88px] leading-none font-semibold tracking-[-0.04em]" style={{ color: "rgba(255,255,255,0.95)" }}>{time}</h1>
                </div>

                {/* Now playing widget */}
                <div className={`mt-6 rounded-[26px] p-3.5 ${glass}`}>
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 shrink-0 rounded-xl bg-[linear-gradient(135deg,#e7c9a0,#8c5a3c_55%,#2e1c16)] shadow-md" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[14px] font-semibold">Best Part (feat. H.E.R.)</p>
                      <p className="truncate text-[12px] text-white/75">Daniel Caesar</p>
                    </div>
                  </div>
                  <div className="mt-3 h-1 rounded-full bg-white/30">
                    <div className="h-full rounded-full bg-white" style={{ width: `${progress * 100}%` }} />
                  </div>
                  <div className="mt-1 flex justify-between text-[10px] font-medium text-white/70">
                    <span>{fmt(elapsed)}</span>
                    <span>-{fmt(209 - elapsed)}</span>
                  </div>
                  <div className="mt-1 flex items-center justify-center gap-8">
                    <SkipBack className="h-5 w-5 fill-white" />
                    <button
                      onClick={() => { playClickSound(); setPlaying((p) => !p); }}
                      className="cursor-pointer"
                      aria-label={playing ? "Pause" : "Play"}
                    >
                      {playing ? <Pause className="h-7 w-7 fill-white" /> : <Play className="h-7 w-7 fill-white" />}
                    </button>
                    <SkipForward className="h-5 w-5 fill-white" />
                  </div>
                </div>

                {/* Notifications */}
                <div className="mt-auto space-y-2 overflow-y-auto pb-2 scrollbar-none">
                  <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.35 }}
                    className={`flex items-start gap-3 rounded-[22px] px-3.5 py-3 ${glass}`}
                  >
                    <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] bg-gradient-to-b from-[#5bf675] to-[#2cc84d]">
                      <MessageCircle className="h-5 w-5 fill-white text-white" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-baseline justify-between">
                        <p className="text-[14px] font-semibold">baba</p>
                        <span className="text-[11px] text-white/70">now</span>
                      </div>
                      <p className="text-[13px] leading-snug text-white/90">dont forget to take a break</p>
                    </div>
                  </motion.div>

                  <motion.a
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.28, duration: 0.35 }}
                    href="https://www.instagram.com/myriellej/"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => playClickSound()}
                    className={`group flex items-center gap-3 rounded-[22px] px-3.5 py-3 transition hover:bg-white/28 cursor-pointer ${glass}`}
                  >
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] bg-gradient-to-tr from-[#f9b04a] via-[#e1306c] to-[#833ab4]">
                      <InstagramIcon className="h-5 w-5 text-white" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-baseline justify-between">
                        <p className="text-[14px] font-semibold">Instagram</p>
                        <span className="text-[11px] text-white/70">2m ago</span>
                      </div>
                      <p className="truncate text-[13px] text-white/90">@myriellej · photos & updates</p>
                    </div>
                    <ArrowUpRight className="h-4 w-4 shrink-0 text-white/70 transition group-hover:text-white" />
                  </motion.a>

                  <motion.a
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.36, duration: 0.35 }}
                    href="mailto:myrielle.work@gmail.com"
                    onClick={() => playClickSound()}
                    className={`group flex items-center gap-3 rounded-[22px] px-3.5 py-3 transition hover:bg-white/28 cursor-pointer ${glass}`}
                  >
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] bg-gradient-to-b from-[#4fa8ff] to-[#1a6dff]">
                      <Mail className="h-5 w-5 text-white" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-baseline justify-between">
                        <p className="text-[14px] font-semibold">Mail</p>
                        <span className="text-[11px] text-white/70">10m ago</span>
                      </div>
                      <p className="truncate text-[13px] text-white/90">myrielle.work@gmail.com · say hi</p>
                    </div>
                    <ArrowUpRight className="h-4 w-4 shrink-0 text-white/70 transition group-hover:text-white" />
                  </motion.a>
                </div>

                {/* Torch + camera, home indicator */}
                <div className="flex items-center justify-between px-5 pb-3 pt-1">
                  <button
                    onClick={() => { playClickSound(); setTorch((t) => !t); }}
                    className={`flex h-12 w-12 items-center justify-center rounded-full backdrop-blur-xl transition cursor-pointer ${torch ? "bg-white text-[#4a1522]" : "bg-black/25 text-white"}`}
                    aria-label="Flashlight"
                  >
                    <Flashlight className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => { playClickSound(); setFlash(true); setTimeout(() => setFlash(false), 400); }}
                    className="flex h-12 w-12 items-center justify-center rounded-full bg-black/25 text-white backdrop-blur-xl transition active:scale-90 cursor-pointer"
                    aria-label="Camera"
                  >
                    <Camera className="h-5 w-5" />
                  </button>
                </div>
                <button onClick={close} className="mx-auto mb-1 h-[5px] w-32 rounded-full bg-white/85 cursor-pointer" aria-label="Close" />
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
