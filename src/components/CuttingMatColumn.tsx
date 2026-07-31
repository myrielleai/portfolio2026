// src/components/CuttingMatColumn.tsx
import { Maximize2, PenTool, Eraser, Stamp, MoveUpRight, Sparkles } from "lucide-react";
import { playClickSound } from "../utils/audio";

interface CuttingMatColumnProps {
  onOpenFullMat: () => void;
}

export default function CuttingMatColumn({ onOpenFullMat }: CuttingMatColumnProps) {
  const handleClick = () => {
    playClickSound();
    onOpenFullMat();
  };

  return (
    <div 
      onClick={handleClick}
      className="relative group w-full h-full flex flex-col justify-between cursor-pointer select-none"
    >
      {/* Label Tag on Table */}
      <div className="flex items-center justify-between mb-3 px-1">
        <div className="flex items-center gap-2">
          <span className="flex h-2.5 w-2.5 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
          </span>
          <span className="text-xs font-mono font-bold tracking-wider text-emerald-400 uppercase drop-shadow">
            03. TACTILE CUTTING MAT
          </span>
        </div>
        <div className="flex items-center gap-1 text-[11px] font-mono text-emerald-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform">
          <Maximize2 className="w-3.5 h-3.5" />
          <span>Expand</span>
        </div>
      </div>

      {/* Mini Cutting Mat Physical Board Resting Directly on Table */}
      <div className="relative w-full bg-cutting-mat border-4 border-[#364e3a] rounded-2xl p-4 shadow-[0_25px_60px_rgba(0,0,0,0.85),0_10px_20px_rgba(0,0,0,0.5)] flex-grow flex flex-col justify-between overflow-hidden min-h-[360px] hover:scale-[1.01] hover:shadow-[0_30px_70px_rgba(0,0,0,0.95)] hover:border-emerald-500/60 transition-all duration-300">
        {/* Silkscreen Branded Title */}
        <div className="absolute top-4 left-4 text-xs font-mono font-bold text-white/20 uppercase tracking-[0.2em] select-none pointer-events-none">
          THE LABORATORY MAT
        </div>

        {/* Rivets in corners */}
        <div className="absolute top-3 left-3 w-2 h-2 rounded-full border border-white/20 bg-white/10" />
        <div className="absolute top-3 right-3 w-2 h-2 rounded-full border border-white/20 bg-white/10" />
        <div className="absolute bottom-3 left-3 w-2 h-2 rounded-full border border-white/20 bg-white/10" />
        <div className="absolute bottom-3 right-3 w-2 h-2 rounded-full border border-white/20 bg-white/10" />

        {/* Mini Content elements on the mat */}
        <div className="relative z-10 space-y-4 pt-8 pb-3">
          {/* Mini Sticky Note */}
          <div className="w-full max-w-[220px] mx-auto bg-amber-200/95 text-amber-950 font-mono text-xs font-bold p-3 rounded-lg shadow-lg border border-amber-300 -rotate-2 group-hover:rotate-0 transition-transform">
            <div className="flex items-center justify-between border-b border-amber-950/20 pb-1 mb-1.5">
              <span>📌 STICKY MEMO</span>
              <Sparkles className="w-3.5 h-3.5 text-amber-800" />
            </div>
            <p className="leading-snug text-[11px]">
              Click to launch full-size interactive cutting mat & drawing canvas!
            </p>
          </div>

          {/* Mini Tools Preview Row */}
          <div className="flex justify-center items-center gap-2.5 pt-2">
            <span className="p-2 rounded-xl bg-black/40 border border-white/15 text-white/90 shadow" title="Pencil">
              <PenTool className="w-4 h-4 text-amber-400" />
            </span>
            <span className="p-2 rounded-xl bg-black/40 border border-white/15 text-white/90 shadow" title="Eraser">
              <Eraser className="w-4 h-4 text-rose-400" />
            </span>
            <span className="p-2 rounded-xl bg-black/40 border border-white/15 text-white/90 shadow" title="Stamp">
              <Stamp className="w-4 h-4 text-sky-400" />
            </span>
          </div>
        </div>

        {/* Hover Click Overlay Banner */}
        <div className="relative z-20 mt-3 bg-emerald-500/20 border border-emerald-500/40 rounded-xl p-2.5 text-center group-hover:bg-emerald-500 group-hover:text-black transition-colors duration-200">
          <div className="flex items-center justify-center gap-2 font-mono text-xs font-bold text-emerald-300 group-hover:text-black">
            <span>FULL SIZE CANVAS</span>
            <MoveUpRight className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* Table Accent Text */}
      <div className="mt-2.5 flex items-center justify-between text-[11px] font-mono text-gray-400 px-1">
        <span>[ GREEN DRAFTING MAT ]</span>
        <span className="text-emerald-400 group-hover:underline">Click to Open Full Mat →</span>
      </div>
    </div>
  );
}
