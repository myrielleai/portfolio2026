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
  MessageCircle,
  Lock
} from "lucide-react";
import { playClickSound } from "../../utils/audio";

interface PhoneModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function PhoneModal({ isOpen, onClose }: PhoneModalProps) {
  const [isFlashlightOn, setIsFlashlightOn] = useState(false);
  const [isCameraActive, setIsCameraActive] = useState(false);

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
        {/* iPhone 12 Outer Aluminum Enclosure Shell (Exact 390x844 Aspect Ratio) */}
        <motion.div
          onClick={(e) => e.stopPropagation()}
          initial={{ opacity: 0, scale: 0.82, y: 35 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.82, y: 35 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-[390px] aspect-[390/844] max-h-[88vh] bg-[#05070d] text-white border-[8px] border-[#2c2c2e] rounded-[48px] shadow-[0_32px_90px_rgba(0,0,0,0.95)] p-4 pt-2.5 flex flex-col justify-between overflow-hidden ring-1 ring-white/15 cursor-default"
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

          {/* iOS Dynamic Ambient Lockscreen Wallpaper */}
          <div
            className={`absolute inset-0 transition-opacity duration-700 pointer-events-none ${
              isFlashlightOn
                ? "bg-gradient-to-b from-amber-500/20 via-zinc-950 to-black opacity-100"
                : "bg-gradient-to-b from-indigo-950/60 via-purple-950/40 via-slate-950 to-black opacity-95"
            }`}
          />

          {/* Glowing Ambient Wallpaper Orbs */}
          <div className="absolute top-12 -left-12 w-48 h-48 bg-indigo-500/25 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute top-44 -right-12 w-48 h-48 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-20 left-6 w-48 h-48 bg-sky-500/15 rounded-full blur-3xl pointer-events-none" />

          {/* Flashlight Beam Ambient Glow */}
          {isFlashlightOn && (
            <div className="absolute top-0 inset-x-0 h-40 bg-gradient-to-b from-amber-300/25 via-amber-500/10 to-transparent pointer-events-none blur-2xl animate-pulse" />
          )}

          {/* Top Section Container */}
          <div className="relative z-20">
            {/* 1. iPhone 12 Top Status Bar & Classic Notch */}
            <div className="relative flex items-center justify-between px-2 pt-1 mb-1">
              {/* iOS Clock */}
              <span className="text-[13px] font-semibold tracking-tight text-white/95 font-sans pl-1">
                9:41
              </span>

              {/* Classic iPhone 12 Notch */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[165px] h-[27px] bg-black rounded-b-[20px] border-b border-x border-white/10 flex items-center justify-between px-3 pt-0.5 shadow-md z-30 pointer-events-none">
                {/* Ear Speaker */}
                <div className="absolute top-1 left-1/2 -translate-x-1/2 w-10 h-1 bg-[#1a1a1e] rounded-full border border-white/5" />
                {/* Camera Lens */}
                <div className="flex items-center gap-1.5 mt-1.5 ml-0.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#080a10] border border-zinc-800 flex items-center justify-center">
                    <span className="w-1 h-1 rounded-full bg-[#0f2342]" />
                  </span>
                </div>
                {/* Sensor Array */}
                <div className="flex items-center gap-1 mt-1.5 mr-0.5">
                  <span className="w-2 h-2 rounded-full bg-[#0a0d14] border border-zinc-800" />
                </div>
              </div>

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
              className="absolute top-8 right-2 z-30 p-1.5 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 rounded-full border border-white/10 backdrop-blur-md transition-colors cursor-pointer"
              title="Close iPhone"
            >
              <X className="w-4 h-4" />
            </button>

            {/* 2. iOS Lock Screen Header (Lock Icon, Date & Big Clock) */}
            <div className="text-center mt-2 mb-3">
              <div className="flex justify-center mb-1">
                <Lock className="w-4 h-4 text-white/80 drop-shadow" />
              </div>
              <p className="text-[13px] font-medium text-white/80 tracking-wide">
                Friday, July 31
              </p>
              <h1 className="text-6xl font-extrabold tracking-tight text-white/95 my-0.5 font-sans drop-shadow-[0_4px_12px_rgba(0,0,0,0.6)]">
                9:41
              </h1>
            </div>

            {/* 3. iOS Lockscreen Notification Stack */}
            <div className="space-y-2 mb-2 overflow-y-auto max-h-[42vh] pr-0.5 scrollbar-none">
              
              {/* iMessage Lockscreen Notification Card (Featured) */}
              <motion.div
                initial={{ scale: 0.95, opacity: 0, y: 8 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                transition={{ duration: 0.25 }}
                className="p-3.5 bg-[#1c1c1e]/85 hover:bg-[#2c2c2e]/90 border border-white/15 rounded-[22px] shadow-lg shadow-black/40 backdrop-blur-xl transition-all cursor-default"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-md bg-[#34c759] flex items-center justify-center shadow-sm shrink-0">
                      <MessageCircle className="w-3.5 h-3.5 text-white fill-white" />
                    </div>
                    <span className="text-[10px] font-bold text-white/60 uppercase tracking-wider">
                      MESSAGES
                    </span>
                  </div>
                  <span className="text-[10px] text-white/40 font-medium">now</span>
                </div>
                
                <div className="pl-0.5">
                  <h4 className="text-[14px] font-bold text-white tracking-tight">
                    baba
                  </h4>
                  <p className="text-[12px] text-white/90 font-normal leading-snug mt-0.5">
                    "dont forget to take a break"
                  </p>
                </div>
              </motion.div>

              {/* GitHub iOS Card */}
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => playClickSound()}
                className="group flex items-center justify-between p-3 bg-[#1c1c1e]/75 hover:bg-[#2c2c2e]/90 border border-white/10 rounded-[20px] transition-all shadow-md active:scale-[0.98] cursor-pointer backdrop-blur-md"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-xl bg-zinc-800 border border-white/10 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform shadow">
                    <Globe className="w-4 h-4 text-white" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[9px] font-bold text-white/50 uppercase tracking-wider">
                        GITHUB
                      </span>
                      <span className="text-[9px] text-white/40">• 2m ago</span>
                    </div>
                    <div className="font-semibold text-white text-xs truncate">
                      @myrielle • 42 Repositories
                    </div>
                    <div className="text-[10px] text-zinc-400 truncate">
                      Code, Open Source & Projects
                    </div>
                  </div>
                </div>
                <span className="shrink-0 px-2.5 py-1 text-[10px] font-semibold bg-white/10 group-hover:bg-blue-600 group-hover:text-white text-blue-400 rounded-full border border-white/10 transition-colors">
                  OPEN ↗
                </span>
              </a>

              {/* LinkedIn iOS Card */}
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => playClickSound()}
                className="group flex items-center justify-between p-3 bg-[#1c1c1e]/75 hover:bg-[#2c2c2e]/90 border border-white/10 rounded-[20px] transition-all shadow-md active:scale-[0.98] cursor-pointer backdrop-blur-md"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform shadow">
                    <Share2 className="w-4 h-4 text-blue-400" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[9px] font-bold text-blue-400/80 uppercase tracking-wider">
                        LINKEDIN
                      </span>
                      <span className="text-[9px] text-white/40">• 5m ago</span>
                    </div>
                    <div className="font-semibold text-white text-xs truncate">
                      Myrielle Jerusalem
                    </div>
                    <div className="text-[10px] text-zinc-400 truncate">
                      Full-Stack Engineer & Architect
                    </div>
                  </div>
                </div>
                <span className="shrink-0 px-2.5 py-1 text-[10px] font-semibold bg-white/10 group-hover:bg-blue-600 group-hover:text-white text-blue-400 rounded-full border border-white/10 transition-colors">
                  CONNECT ↗
                </span>
              </a>

              {/* Email iOS Card */}
              <a
                href="mailto:hello@myrielle.dev"
                onClick={() => playClickSound()}
                className="group flex items-center justify-between p-3 bg-[#1c1c1e]/75 hover:bg-[#2c2c2e]/90 border border-white/10 rounded-[20px] transition-all shadow-md active:scale-[0.98] cursor-pointer backdrop-blur-md"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-xl bg-emerald-600/20 border border-emerald-500/30 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform shadow">
                    <Mail className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[9px] font-bold text-emerald-400/80 uppercase tracking-wider">
                        MAIL
                      </span>
                      <span className="text-[9px] text-white/40">• 10m ago</span>
                    </div>
                    <div className="font-semibold text-white text-xs truncate">
                      hello@myrielle.dev
                    </div>
                    <div className="text-[10px] text-zinc-400 truncate">
                      Direct inquiries & contact
                    </div>
                  </div>
                </div>
                <span className="shrink-0 px-2.5 py-1 text-[10px] font-semibold bg-white/10 group-hover:bg-emerald-600 group-hover:text-white text-emerald-400 rounded-full border border-white/10 transition-colors">
                  SEND ✉
                </span>
              </a>
            </div>
          </div>

          {/* Bottom Section Container */}
          <div className="relative z-20 pt-1">
            {/* 4. iOS Bottom Lockscreen Quick Action Controls (Flashlight & Camera) */}
            <div className="flex items-center justify-between px-3 pt-1 pb-1">
              {/* Flashlight Button */}
              <button
                onClick={handleFlashlightToggle}
                className={`p-3 rounded-full border backdrop-blur-md transition-all cursor-pointer ${
                  isFlashlightOn
                    ? "bg-amber-400 text-black border-amber-300 shadow-lg shadow-amber-400/40 scale-105"
                    : "bg-white/15 hover:bg-white/25 text-white/90 border-white/15"
                }`}
                title="Toggle Torch"
              >
                <Zap className={`w-5 h-5 ${isFlashlightOn ? "fill-black" : ""}`} />
              </button>

              {/* Device Info Badge */}
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 border border-white/10 text-[10px] text-white/70 font-medium backdrop-blur-md">
                <Smartphone className="w-3 h-3 text-white/60" />
                <span>iPhone 12</span>
              </div>

              {/* Camera Button */}
              <button
                onClick={handleCameraSnap}
                className="p-3 bg-white/15 hover:bg-white/25 text-white/90 border border-white/15 rounded-full backdrop-blur-md transition-all active:scale-90 cursor-pointer"
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
              className="w-32 h-1 bg-white/50 hover:bg-white/90 rounded-full mx-auto mt-2 mb-1 cursor-pointer transition-colors"
              title="Swipe up to close"
            />
          </div>
        </motion.div>
      </div>
      )}
    </AnimatePresence>
  );
}


