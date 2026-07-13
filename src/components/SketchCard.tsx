// src/components/SketchCard.tsx
import DraggableCard from "./DraggableCard";
import TapeCorner from "./TapeCorner";

export default function SketchCard() {
  return (
    <DraggableCard
      initialLeft={14}
      initialTop={58}
      initialRotation={5}
      className="w-48"
    >
      <div className="relative bg-[#fcfbe8] border border-[#e5dfc5] p-4 shadow-lg rounded-sm overflow-hidden min-h-[140px] flex flex-col justify-between select-none">
        {/* Subtle grid background */}
        <div 
          className="absolute inset-0 pointer-events-none opacity-25"
          style={{
            backgroundImage: "linear-gradient(rgba(14, 165, 233, 0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(14, 165, 233, 0.15) 1px, transparent 1px)",
            backgroundSize: "10px 10px",
          }}
        />

        {/* Taped corner holding this scrap paper */}
        <TapeCorner color="coral" position="top-right" />

        {/* Content */}
        <div className="relative z-10 flex flex-col h-full justify-between gap-2">
          {/* Header */}
          <div className="flex justify-between items-start">
            <span className="text-[7px] uppercase font-mono tracking-widest text-[#FF8A1E] font-bold">
              RECORD // FILE_049
            </span>
            <span className="text-[7px] font-mono text-gray-400 font-bold">
              DRAFT
            </span>
          </div>

          {/* squiggly line SVG */}
          <div className="my-2 h-16 w-full flex items-center justify-center">
            <svg viewBox="0 0 120 60" fill="none" className="w-full h-full overflow-visible">
              {/* Hand-drawn double helix squiggle */}
              <path 
                d="M 10 32 C 30 10, 25 50, 50 30 C 75 10, 70 50, 95 30 C 105 20, 108 40, 115 28" 
                stroke="#1d4ed8" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
              />
              <path 
                d="M 15 38 C 28 42, 38 18, 52 32 C 68 46, 76 18, 92 34" 
                stroke="#ea580c" 
                strokeWidth="1.5" 
                strokeLinecap="round" 
                strokeLinejoin="round"
                strokeDasharray="2, 2"
              />
            </svg>
          </div>

          {/* Footer note */}
          <div className="text-[8px] font-mono text-gray-500 border-t border-[#e5dfc5] pt-1 leading-tight">
            // canvas_doodle_placeholder.png<br />
            * redraw this algorithm later
          </div>
        </div>
      </div>
    </DraggableCard>
  );
}
