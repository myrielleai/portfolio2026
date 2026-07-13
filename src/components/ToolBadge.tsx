// src/components/ToolBadge.tsx
import { useState } from "react";

interface ToolBadgeProps {
  onSlice: () => void;
}

export default function ToolBadge({ onSlice }: ToolBadgeProps) {
  const [isHovered, setIsHovered] = useState(false);

  const handleSliceClick = () => {
    // Play localized mechanical slice audio sound
    if (typeof window !== "undefined") {
      try {
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        const audioCtx = new AudioContextClass();
        const now = audioCtx.currentTime;
        
        // Slicing sound: mechanical high-to-low sweeping zip sound
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        
        osc.type = "sawtooth";
        osc.frequency.setValueAtTime(1400, now);
        osc.frequency.exponentialRampToValueAtTime(180, now + 0.16);
        
        // Lowpass filter to make it sound mechanical
        const filter = audioCtx.createBiquadFilter();
        filter.type = "lowpass";
        filter.frequency.setValueAtTime(700, now);
        
        gain.gain.setValueAtTime(0.05, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.16);
        
        osc.connect(filter);
        filter.connect(gain);
        gain.connect(audioCtx.destination);
        
        osc.start(now);
        osc.stop(now + 0.18);
      } catch (e) {
        // Fallback
      }
    }
    
    // Call slice callback to clear canvas drawing
    onSlice();
  };

  return (
    <div 
      className="absolute top-[22%] left-[83%] z-20 select-none cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleSliceClick}
      title="Rotary Cutter: Slice & Reset Canvas"
    >
      <div 
        className="relative w-14 h-14 bg-[#fbbf24] border-2 border-[#1e293b] rounded-full shadow-[0_6px_12px_rgba(0,0,0,0.2)] flex items-center justify-center transition-all duration-300 active:scale-90"
        style={{
          transform: `rotate(${isHovered ? 45 : -15}deg) scale(${isHovered ? 1.08 : 1})`,
        }}
      >
        {/* Steel circular blade inside */}
        <div className="absolute w-10 h-10 border border-[#94a3b8] rounded-full bg-gradient-to-tr from-[#cbd5e1] via-[#f8fafc] to-[#94a3b8] flex items-center justify-center shadow-[inset_0_2px_4px_rgba(0,0,0,0.1)]">
          {/* Centering lock screw */}
          <div className="w-3.5 h-3.5 bg-[#475569] border border-[#1e293b] rounded-full flex items-center justify-center">
            <div className="w-1.5 h-[3px] bg-[#1e293b] rounded-xs" />
          </div>
        </div>

        {/* Small cutter slider bracket detail */}
        <div className="absolute -bottom-2 w-3 h-5 bg-[#d97706] rounded-xs border border-[#1e293b] z-0" />

        {/* Floating badge label */}
        <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-[#1e293b] text-[#fbbf24] border border-[#fbbf24]/30 text-[7px] font-mono font-bold px-1.5 py-0.5 rounded-sm uppercase tracking-wider whitespace-nowrap shadow-md pointer-events-none transition-all duration-200">
          SLICE & CLEAR
        </div>
      </div>
    </div>
  );
}
