// src/components/AnnotationArrow.tsx
import { useId } from "react";

interface AnnotationArrowProps {
  top: string;
  left: string;
  width?: number;
  height?: number;
  rotation?: number;
  label?: string;
  labelOffset?: { x: number; y: number };
}

export default function AnnotationArrow({
  top,
  left,
  width = 120,
  height = 60,
  rotation = 0,
  label = "Doodle here!",
  labelOffset = { x: -20, y: -25 },
}: AnnotationArrowProps) {
  const arrowId = useId();

  return (
    <div
      className="absolute pointer-events-none select-none z-20"
      style={{
        top,
        left,
        width: `${width}px`,
        height: `${height}px`,
        transform: `rotate(${rotation}deg)`,
      }}
    >
      {/* Curved Arrow SVG */}
      <svg
        className="w-full h-full overflow-visible"
        viewBox={`0 0 ${width} ${height}`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <marker
            id={`arrowhead-${arrowId}`}
            markerWidth="10"
            markerHeight="7"
            refX="9"
            refY="3.5"
            orient="auto"
          >
            <polygon points="0 0, 10 3.5, 0 7" fill="#FF8A1E" />
          </marker>
        </defs>

        {/* Curved hand-drawn look line */}
        <path
          d={`M 10,${height - 10} Q ${width / 3},10 ${width - 15},${height / 2}`}
          stroke="#FF8A1E"
          strokeWidth="1.5"
          strokeDasharray="4,4"
          markerEnd={`url(#arrowhead-${arrowId})`}
        />
      </svg>

      {/* Label bubble/text */}
      {label && (
        <div
          className="absolute font-mono text-[9px] font-bold text-[#FF8A1E]/80 uppercase tracking-widest whitespace-nowrap"
          style={{
            transform: `translate(${labelOffset.x}px, ${labelOffset.y}px)`,
          }}
        >
          ✍️ {label}
        </div>
      )}
    </div>
  );
}
