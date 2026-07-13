// src/components/CursorGhost.tsx
import { useEffect, useState } from "react";

interface CursorGhostProps {
  activeTool: "pencil" | "marker" | "eraser" | "stamp";
  color: string;
  isWorkspaceHovered?: boolean;
}

export default function CursorGhost({ activeTool, color, isWorkspaceHovered = true }: CursorGhostProps) {
  const [position, setPosition] = useState({ x: -100, y: -100 });
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
      
      const target = e.target as HTMLElement;
      // Hide custom cursor over native interactive elements to prevent overlap/clicking confusion
      const isOverInteractive = 
        target.closest("button") || 
        target.closest("a") || 
        target.closest("input") || 
        target.closest("textarea") ||
        target.style.cursor === "pointer";
      
      setIsVisible(!isOverInteractive);
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    const handleMouseEnter = () => {
      setIsVisible(true);
    };

    window.addEventListener("mousemove", handleMouseMove);
    document.body.addEventListener("mouseleave", handleMouseLeave);
    document.body.addEventListener("mouseenter", handleMouseEnter);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      document.body.removeEventListener("mouseleave", handleMouseLeave);
      document.body.removeEventListener("mouseenter", handleMouseEnter);
    };
  }, []);

  if (!isWorkspaceHovered || !isVisible) return null;

  const renderCursor = () => {
    switch (activeTool) {
      case "pencil":
        return (
          <div 
            className="w-8 h-8 pointer-events-none select-none"
            style={{ transform: "translate(0px, -32px)" }}
          >
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              {/* Wooden shaft */}
              <path d="M8 24L24 8L28 12L12 28L8 24Z" fill="#E2A76F" stroke="#1e293b" strokeWidth="1.5" strokeLinejoin="round" />
              {/* Unfinished wood cone */}
              <path d="M0 32L8 24L12 28L0 32Z" fill="#F8FAFC" stroke="#1e293b" strokeWidth="1.5" strokeLinejoin="round" />
              {/* Graphite tip with current color */}
              <path d="M0 32L4 28L6 30L0 32Z" fill={color} />
              {/* Ferrule (metal collar) */}
              <path d="M22 6L26 10L24 12L20 8L22 6Z" fill="#94A3B8" stroke="#1e293b" strokeWidth="1" />
              {/* Eraser */}
              <path d="M26 2L30 6C31 7 31 9 30 10L28 12L24 8L26 2Z" fill="#FDA4AF" stroke="#1e293b" strokeWidth="1" />
            </svg>
          </div>
        );
      case "marker":
        return (
          <div 
            className="w-8 h-8 pointer-events-none select-none"
            style={{ transform: "translate(0px, -32px)" }}
          >
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              {/* Marker pen body */}
              <path d="M12 28L28 12C29.5 10.5 29.5 8 28 6.5L25.5 4C24 2.5 21.5 2.5 20 4L4 20L12 28Z" fill="#334155" stroke="#f8fafc" strokeWidth="1.5" />
              {/* Plastic cap collar */}
              <path d="M4 20L8 24L5 27L1 23L4 20Z" fill="#64748B" stroke="#f8fafc" strokeWidth="1" />
              {/* Chisel tip in active color */}
              <path d="M1 23L5 27L0 32L-1 30L1 23Z" fill={color} stroke="#f8fafc" strokeWidth="1" />
            </svg>
          </div>
        );
      case "eraser":
        return (
          <div
            className="w-6 h-6 border-2 border-dashed border-[#FF8A1E] bg-[#FDA4AF]/20 shadow-[0_4px_12px_rgba(0,0,0,0.15)] rounded pointer-events-none select-none"
            style={{ 
              transform: "translate(-50%, -50%)",
              backdropFilter: "invert(0.08)"
            }}
          />
        );
      case "stamp":
        return (
          <div 
            className="w-24 h-24 border border-dashed border-[#FF8A1E]/70 bg-[#FF8A1E]/5 rounded-full flex items-center justify-center pointer-events-none select-none"
            style={{ transform: "translate(-50%, -50%)" }}
          >
            {/* Stamp crosshair guide */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-full h-[1px] bg-[#FF8A1E]/30" />
              <div className="h-full w-[1px] bg-[#FF8A1E]/30" />
            </div>
            {/* Center target circle */}
            <div className="w-16 h-16 border border-dotted border-[#FF8A1E]/50 rounded-full flex items-center justify-center">
              <span className="text-[7px] font-mono font-bold text-[#FF8A1E] uppercase tracking-wider bg-[#243527]/90 px-1.5 py-0.5 rounded-xs">
                STAMP HERE
              </span>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div
      className="fixed pointer-events-none select-none z-50 transition-transform duration-[40ms] ease-out"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
      }}
    >
      {renderCursor()}
    </div>
  );
}
