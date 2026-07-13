// src/components/IntroCard.tsx
import DraggableCard from "./DraggableCard";
import TapeCorner from "./TapeCorner";

export default function IntroCard() {
  return (
    <DraggableCard
      initialLeft={5}
      initialTop={8}
      initialRotation={-3}
      className="w-80"
    >
      <div className="relative bg-[#fcfbf9] border border-[#dcd7cb] p-6 shadow-md rounded-sm overflow-hidden min-h-[220px]">
        {/* Ruled notebook lines styling */}
        <div 
          className="absolute inset-0 pointer-events-none opacity-40"
          style={{
            backgroundImage: "linear-gradient(#cce6ff 1px, transparent 1px)",
            backgroundSize: "100% 24px",
            backgroundPosition: "0 40px",
          }}
        />
        {/* Left pink margin line */}
        <div className="absolute left-6 top-0 bottom-0 w-[1px] bg-red-400/50 pointer-events-none" />

        {/* Taped corners */}
        <TapeCorner color="yellow" position="top-right" />
        <TapeCorner color="cream" position="bottom-left" />

        {/* Content with padding to clear the red margin line */}
        <div className="relative pl-4">
          <span className="text-[10px] uppercase font-bold tracking-widest text-[#FF8A1E] block mb-1">
            THE LABORATORY
          </span>
          <h2 className="text-base font-bold text-gray-800 tracking-tight leading-tight mb-3 border-b border-gray-200 pb-1 font-mono">
            TACTILE DRAWING BOARD
          </h2>
          <ul className="space-y-2 text-xs text-gray-700 font-mono leading-relaxed">
            <li className="flex items-start gap-1">
              <span className="text-[#FF8A1E] font-bold">▶</span>
              <span>Select tools from the bottom dashboard.</span>
            </li>
            <li className="flex items-start gap-1">
              <span className="text-[#FF8A1E] font-bold">▶</span>
              <span>Sketch, highlight, stamp, or erase freely.</span>
            </li>
            <li className="flex items-start gap-1">
              <span className="text-[#FF8A1E] font-bold">▶</span>
              <span>Physically drag index cards to clean the mat.</span>
            </li>
            <li className="flex items-start gap-1">
              <span className="text-[#FF8A1E] font-bold">▶</span>
              <span>Flip the Exit switch to power down.</span>
            </li>
          </ul>
        </div>
      </div>
    </DraggableCard>
  );
}
