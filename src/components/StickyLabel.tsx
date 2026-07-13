// src/components/StickyLabel.tsx

interface StickyLabelProps {
  text: string;
  color?: "yellow" | "pink" | "blue";
  top: string; // e.g. "20%"
  left: string; // e.g. "15%"
  rotation?: number;
}

export default function StickyLabel({
  text,
  color = "yellow",
  top,
  left,
  rotation = 4,
}: StickyLabelProps) {
  const bgColors = {
    yellow: "bg-[#fffab3] text-[#6b5200] border-[#ebe08a] shadow-[2px_3px_6px_rgba(0,0,0,0.06)]",
    pink: "bg-[#ffd0e0] text-[#70103c] border-[#eba0bd] shadow-[2px_3px_6px_rgba(0,0,0,0.06)]",
    blue: "bg-[#c2f0ff] text-[#054b61] border-[#91dbeb] shadow-[2px_3px_6px_rgba(0,0,0,0.06)]",
  };

  return (
    <div
      className={`absolute px-3 py-1.5 shadow-md border-t border-l rounded-xs font-mono text-[9px] font-bold tracking-wider uppercase select-none z-20 hover:shadow-lg transition-shadow duration-300 ${bgColors[color]}`}
      style={{
        top,
        left,
        transform: `rotate(${rotation}deg)`,
      }}
    >
      {/* Tape strip look with side tears */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-white/30" />
      <span className="relative z-10">{text}</span>
    </div>
  );
}
