// src/components/EdgeRuler.tsx
import { useEffect, useState } from "react";

export default function EdgeRuler() {
  const [dimensions, setDimensions] = useState({ width: 1200, height: 800 });

  useEffect(() => {
    const handleResize = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Generate label offsets for numbers (1, 2, 3...) every 120px block
  const horizontalLabels: number[] = [];
  for (let x = 120; x < dimensions.width - 24; x += 120) {
    horizontalLabels.push(x);
  }

  const verticalLabels: number[] = [];
  for (let y = 120; y < dimensions.height - 24; y += 120) {
    verticalLabels.push(y);
  }

  return (
    <div className="absolute inset-2 sm:inset-4 md:inset-6 pointer-events-none select-none z-10 overflow-hidden rounded-xl md:rounded-2xl">
      {/* Top Edge Ruler */}
      <div 
        className="absolute top-0 left-0 right-0 h-6 border-b border-white/5"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(255, 255, 255, 0.3) 1.5px, transparent 1.5px),
            linear-gradient(to right, rgba(255, 255, 255, 0.15) 1px, transparent 1px),
            linear-gradient(to right, rgba(255, 255, 255, 0.08) 1px, transparent 1px)
          `,
          backgroundSize: "120px 14px, 24px 8px, 12px 5px",
          backgroundRepeat: "repeat-x",
          backgroundPosition: "left bottom",
        }}
      >
        {horizontalLabels.map((x) => (
          <div
            key={`h-label-${x}`}
            className="absolute bottom-2.5 text-[8px] font-mono font-bold text-white/30 -translate-x-1/2"
            style={{ left: `${x}px` }}
          >
            {x / 120}
          </div>
        ))}
      </div>

      {/* Left Edge Ruler */}
      <div 
        className="absolute top-0 left-0 bottom-0 w-6 border-r border-white/5"
        style={{
          backgroundImage: `
            linear-gradient(to bottom, rgba(255, 255, 255, 0.3) 1.5px, transparent 1.5px),
            linear-gradient(to bottom, rgba(255, 255, 255, 0.15) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255, 255, 255, 0.08) 1px, transparent 1px)
          `,
          backgroundSize: "14px 120px, 8px 24px, 5px 12px",
          backgroundRepeat: "repeat-y",
          backgroundPosition: "right top",
        }}
      >
        {verticalLabels.map((y) => (
          <div
            key={`v-label-${y}`}
            className="absolute right-2.5 text-[8px] font-mono font-bold text-white/30 -translate-y-1/2"
            style={{ top: `${y}px` }}
          >
            {y / 120}
          </div>
        ))}
      </div>
    </div>
  );
}
