// src/components/StampMark.tsx

interface StampMarkProps {
  top: string;
  left: string;
  rotation?: number;
}

export default function StampMark({ top, left, rotation = -15 }: StampMarkProps) {
  return (
    <div
      className="absolute pointer-events-none select-none z-0 opacity-25 hover:opacity-40 transition-opacity duration-500"
      style={{
        top,
        left,
        transform: `translate(-50%, -50%) rotate(${rotation}deg)`,
      }}
    >
      <div className="relative w-36 h-36 flex items-center justify-center border-2 border-dashed border-[#FF8A1E] rounded-full p-2">
        {/* Inner crosshair */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-full h-[1px] bg-[#FF8A1E]/60" />
          <div className="h-full w-[1px] bg-[#FF8A1E]/60" />
        </div>

        {/* Small inner ring */}
        <div className="w-24 h-24 border border-solid border-[#FF8A1E] rounded-full flex items-center justify-center">
          {/* Central label */}
          <span className="text-[9px] font-mono text-[#FF8A1E] font-bold text-center tracking-widest leading-none">
            TRY ME<br />
            [ DRAW ]
          </span>
        </div>

        {/* Circular text simulation */}
        <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 bg-[#2c3d2e] px-1 text-[8px] font-mono text-[#FF8A1E] uppercase tracking-wider whitespace-nowrap">
          * SELF-HEALING MAT *
        </div>
      </div>
    </div>
  );
}
