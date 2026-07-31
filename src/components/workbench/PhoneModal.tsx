import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Mail,
  Globe,
  Share2,
  Smartphone,
  Wifi,
  Signal,
  Camera,
  Zap,
  CheckCircle2,
  MessageSquare,
  Sparkles
} from "lucide-react";
import { playClickSound } from "../../utils/audio";

interface PhoneModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function PhoneModal({ isOpen, onClose }: PhoneModalProps) {
  const [isFlashlightOn, setIsFlashlightOn] = useState(false);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [isIslandExpanded, setIsIslandExpanded] = useState(false);

  const handleFlashlightToggle = () => {
    playClickSound();
    setIsFlashlightOn(!isFlashlightOn);
  };

  const handleCameraSnap = () => {
    playClickSound();
    setIsCameraActive(true);
    setTimeout(() => setIsCameraActive(false), 400);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl select-none font-sans cursor-pointer"
          onClick={() => {
            playClickSound();
            onClose();
          }}
        >
        {/* iPhone Outer Metal Enclosure Shell */}
        <motion.div
          onClick={(e) => e.stopPropagation()}
          initial={{ opacity: 0, scale: 0.82, y: 35 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.82, y: 35 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-[360px] bg-[#000000] text-white border-[7px] border-[#27272a] rounded-[52px] shadow-[0_32px_90px_rgba(0,0,0,0.95)] p-4 pt-2.5 overflow-hidden ring-1 ring-white/10 cursor-default"
        >
          {/* Camera Flash Effect Overlay */}
          {isCameraActive && (
            <motion.div
              initial={{ opacity: 1 }}
              animate={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0 z-50 bg-white pointer-events-none"
            />
          )}

          {/* iOS Dynamic Ambient Wallpaper Gradient */}
          <div
            className={`absolute inset-0 transition-opacity duration-700 pointer-events-none ${
              isFlashlightOn
                ? "bg-gradient-to-b from-amber-500/20 via-zinc-950 to-black opacity-100"
                : "bg-gradient-to-b from-indigo-950/40 via-zinc-950 to-black opacity-90"
            }`}
          />

          {/* Flashlight Beam Ambient Glow */}
          {isFlashlightOn && (
            <div className="absolute top-0 inset-x-0 h-40 bg-gradient-to-b from-amber-300/25 via-amber-500/10 to-transparent pointer-events-none blur-2xl animate-pulse" />
          )}

          {/* 1. iOS Top Status Bar & Dynamic Island */}
          <div className="relative z-20 flex items-center justify-between px-2 pt-1 mb-2">
            {/* iOS Clock */}
            <span className="text-[13px] font-semibold tracking-tight text-white/95 font-sans pl-1">
              9:41
            </span>

            {/* Dynamic Island Notch */}
            <motion.div
              layout
              onClick={() => {
                playClickSound();
                setIsIslandExpanded(!isIslandExpanded);
              }}
              className={`cursor-pointer bg-black rounded-full border border-white/10 flex items-center justify-between transition-all duration-300 ${
                isIslandExpanded ? "w-56 h-8 px-3 shadow-lg shadow-black/80" : "w-28 h-6 px-2"
              }`}
            >
              {/* Dynamic Island Left: Camera Lens / Live Audio Status */}
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-black border border-zinc-800 flex items-center justify-center">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#0a2540]" />
                </span>
                {isIslandExpanded ? (
                  <span className="text-[10px] font-medium text-emerald-400 truncate animate-pulse">
                    iPhone 15 Pro • Online
                  </span>
                ) : (
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                )}
              </div>

              {/* Dynamic Island Right: Camera Sensor Dot */}
              <div className="flex items-center gap-1">
                {isIslandExpanded && (
                  <Sparkles className="w-3 h-3 text-amber-400 animate-spin" />
                )}
                <span className="w-2 h-2 rounded-full bg-zinc-900 border border-zinc-800" />
              </div>
            </motion.div>

            {/* iOS Status Indicators (Signal, Wi-Fi, Battery) */}
            <div className="flex items-center gap-1.5 pr-1 text-white/90">
              <Signal className="w-3.5 h-3.5" />
              <Wifi className="w-3.5 h-3.5" />
              {/* iOS Battery Pill */}
              <div className="flex items-center gap-0.5 pl-0.5">
                <div className="w-5 h-2.5 rounded-[3px] border border-white/80 p-0.5 flex items-center">
                  <div className="w-full h-full bg-emerald-400 rounded-[1px]" />
                </div>
                <div className="w-0.5 h-1 bg-white/80 rounded-r-full" />
              </div>
            </div>
          </div>

          {/* Close Modal Button (iOS Overlay Style) */}
          <button
            onClick={() => {
              playClickSound();
              onClose();
            }}
            className="absolute top-10 right-4 z-30 p-1.5 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 rounded-full border border-white/10 backdrop-blur-md transition-colors cursor-pointer"
            title="Close iPhone"
          >
            <X className="w-4 h-4" />
          </button>

          {/* 2. iOS Profile & Contact Card Header */}
          <div className="relative z-10 text-center mt-2 mb-4">
            <div className="relative inline-block mb-2">
              <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-indigo-500 via-purple-500 to-amber-400 p-0.5 shadow-xl mx-auto">
                <div className="w-full h-full rounded-full bg-zinc-950 flex items-center justify-center text-white font-extrabold text-xl tracking-tight border border-white/10">
                  MJ
                </div>
              </div>
              <span
                className="absolute bottom-0 right-0 w-4 h-4 rounded-full bg-emerald-500 border-2 border-black"
                title="Online"
              />
            </div>

            <div className="flex items-center justify-center gap-1">
              <h3 className="text-lg font-bold tracking-tight text-white">
                Myrielle Jerusalem
              </h3>
              <CheckCircle2 className="w-4 h-4 text-blue-400 fill-blue-500/20" />
            </div>
            <p className="text-xs text-zinc-400 font-medium mt-0.5">
              Full-Stack Engineer & Architect
            </p>
          </div>

          {/* 3. iOS Style Glassmorphic Notification Cards */}
          <div className="relative z-10 space-y-2.5 mb-4">
            {/* GitHub iOS Card */}
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => playClickSound()}
              className="group flex items-center justify-between p-3.5 bg-[#1c1c1e]/90 hover:bg-[#2c2c2e] border border-white/10 rounded-[22px] transition-all shadow-md active:scale-[0.98] cursor-pointer"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-2xl bg-zinc-800 border border-white/10 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform shadow">
                  <Globe className="w-5 h-5 text-white" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-bold text-white/50 uppercase tracking-wider">
                      GITHUB
                    </span>
                    <span className="text-[10px] text-white/40">• now</span>
                  </div>
                  <div className="font-semibold text-white text-xs truncate">
                    @myrielle • 42 Repositories
                  </div>
                  <div className="text-[11px] text-zinc-400 truncate">
                    Code, Open Source & Projects
                  </div>
                </div>
              </div>
              <span className="shrink-0 px-2.5 py-1 text-[11px] font-semibold bg-white/10 group-hover:bg-blue-600 group-hover:text-white text-blue-400 rounded-full border border-white/10 transition-colors">
                OPEN ↗
              </span>
            </a>

            {/* LinkedIn iOS Card */}
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => playClickSound()}
              className="group flex items-center justify-between p-3.5 bg-[#1c1c1e]/90 hover:bg-[#2c2c2e] border border-white/10 rounded-[22px] transition-all shadow-md active:scale-[0.98] cursor-pointer"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-2xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform shadow">
                  <Share2 className="w-5 h-5 text-blue-400" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-bold text-blue-400/80 uppercase tracking-wider">
                      LINKEDIN
                    </span>
                    <span className="text-[10px] text-white/40">• 2m ago</span>
                  </div>
                  <div className="font-semibold text-white text-xs truncate">
                    Professional Network
                  </div>
                  <div className="text-[11px] text-zinc-400 truncate">
                    Connect & view experience
                  </div>
                </div>
              </div>
              <span className="shrink-0 px-2.5 py-1 text-[11px] font-semibold bg-white/10 group-hover:bg-blue-600 group-hover:text-white text-blue-400 rounded-full border border-white/10 transition-colors">
                CONNECT ↗
              </span>
            </a>

            {/* Email iOS Card */}
            <a
              href="mailto:hello@myrielle.dev"
              onClick={() => playClickSound()}
              className="group flex items-center justify-between p-3.5 bg-[#1c1c1e]/90 hover:bg-[#2c2c2e] border border-white/10 rounded-[22px] transition-all shadow-md active:scale-[0.98] cursor-pointer"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-2xl bg-emerald-600/20 border border-emerald-500/30 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform shadow">
                  <Mail className="w-5 h-5 text-emerald-400" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-bold text-emerald-400/80 uppercase tracking-wider">
                      MAIL
                    </span>
                    <span className="text-[10px] text-white/40">• 5m ago</span>
                  </div>
                  <div className="font-semibold text-white text-xs truncate">
                    hello@myrielle.dev
                  </div>
                  <div className="text-[11px] text-zinc-400 truncate">
                    Direct inquiries & contact
                  </div>
                </div>
              </div>
              <span className="shrink-0 px-2.5 py-1 text-[11px] font-semibold bg-white/10 group-hover:bg-emerald-600 group-hover:text-white text-emerald-400 rounded-full border border-white/10 transition-colors">
                SEND ✉
              </span>
            </a>

            {/* iMessage Note Widget */}
            <div className="p-3.5 bg-[#1c1c1e]/60 border border-white/5 rounded-[22px]">
              <div className="flex items-center gap-2 mb-1">
                <MessageSquare className="w-3.5 h-3.5 text-indigo-400" />
                <span className="text-[10px] font-bold text-white/50 uppercase tracking-wider">
                  MESSAGES • NOTE
                </span>
              </div>
              <p className="text-[11px] text-white/80 leading-relaxed font-sans">
                "Available for new projects, architectural consults & creative tech collaborations."
              </p>
            </div>
          </div>

          {/* 4. iOS Bottom Action Buttons (Flashlight & Camera) */}
          <div className="relative z-10 flex items-center justify-between px-3 pt-1">
            {/* Flashlight Button */}
            <button
              onClick={handleFlashlightToggle}
              className={`p-3 rounded-full border backdrop-blur-md transition-all cursor-pointer ${
                isFlashlightOn
                  ? "bg-amber-400 text-black border-amber-300 shadow-lg shadow-amber-400/40 scale-105"
                  : "bg-white/10 hover:bg-white/20 text-white/80 border-white/10"
              }`}
              title="Toggle Torch"
            >
              <Zap className={`w-5 h-5 ${isFlashlightOn ? "fill-black" : ""}`} />
            </button>

            {/* Device Info Badge */}
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] text-white/60 font-medium">
              <Smartphone className="w-3 h-3 text-white/50" />
              <span>iPhone 15 Pro</span>
            </div>

            {/* Camera Button */}
            <button
              onClick={handleCameraSnap}
              className="p-3 bg-white/10 hover:bg-white/20 text-white/80 border border-white/10 rounded-full backdrop-blur-md transition-all active:scale-90 cursor-pointer"
              title="Take Photo"
            >
              <Camera className="w-5 h-5" />
            </button>
          </div>

          {/* 5. iPhone Home Bar Indicator */}
          <div
            onClick={() => {
              playClickSound();
              onClose();
            }}
            className="w-32 h-1 bg-white/40 hover:bg-white/80 rounded-full mx-auto mt-3 mb-1 cursor-pointer transition-colors"
            title="Swipe up to close"
          />
        </motion.div>
      </div>
      )}
    </AnimatePresence>
  );
}

