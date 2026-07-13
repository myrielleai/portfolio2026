// src/components/TapeCorner.tsx

interface TapeCornerProps {
  color?: "cream" | "coral" | "yellow" | "blue";
  position?: "top-left" | "top-right" | "bottom-left" | "bottom-right";
  className?: string;
}

export default function TapeCorner({ 
  color = "cream", 
  position = "top-left", 
  className = "" 
}: TapeCornerProps) {
  const bgColors = {
    cream: "bg-[#fdfbf7]/65 border-white/20 shadow-[1px_2px_4px_rgba(0,0,0,0.06)]",
    coral: "bg-[#ffa1a1]/55 border-white/25 shadow-[1px_2px_4px_rgba(0,0,0,0.06)]",
    yellow: "bg-[#fff3a8]/60 border-white/20 shadow-[1px_2px_4px_rgba(0,0,0,0.06)]",
    blue: "bg-[#c2edff]/60 border-white/20 shadow-[1px_2px_4px_rgba(0,0,0,0.06)]",
  };

  const positions = {
    "top-left": "-top-3 -left-3.5 rotate-[-32deg]",
    "top-right": "-top-3 -right-3.5 rotate-[32deg]",
    "bottom-left": "-bottom-3.5 -left-3 rotate-[32deg]",
    "bottom-right": "-bottom-3.5 -right-3 rotate-[-32deg]",
  };

  return (
    <div
      className={`absolute w-14 h-5 backdrop-blur-[0.5px] border-y border-white/10 select-none pointer-events-none z-20 ${bgColors[color]} ${positions[position]} ${className}`}
      style={{
        // Torn jagged fiber ends
        clipPath: "polygon(4% 0%, 96% 0%, 100% 25%, 97% 50%, 100% 75%, 96% 100%, 4% 100%, 0% 75%, 3% 50%, 0% 25%)",
        backgroundImage: `
          repeating-linear-gradient(90deg, rgba(255, 255, 255, 0.08) 0px, rgba(255, 255, 255, 0.08) 1px, transparent 1px, transparent 4px),
          linear-gradient(to bottom, rgba(255, 255, 255, 0.1), transparent)
        `,
      }}
    />
  );
}
