// src/components/LabWorkspace.tsx
import { useState, useRef } from "react";
import CuttingMatSurface from "./CuttingMatSurface";
import EdgeRuler from "./EdgeRuler";
import IntroCard from "./IntroCard";
import SketchCard from "./SketchCard";
import DrawingCanvas from "./DrawingCanvas";
import Toolbar from "./Toolbar";
import MatFooter from "./MatFooter";
import CursorGhost from "./CursorGhost";
import StickyLabel from "./StickyLabel";
import StampMark from "./StampMark";
import AnnotationArrow from "./AnnotationArrow";
import { playToggleSound, playClickSound } from "../utils/audio";
import { ArrowLeft } from "lucide-react";

export default function LabWorkspace({ onExitLab }: { onExitLab?: () => void }) {
  // Tool selection state
  const [activeTool, setActiveTool] = useState<"pencil" | "marker" | "eraser" | "stamp">("pencil");
  const [color, setColor] = useState<string>("#1e293b");
  const [isHovered, setIsHovered] = useState(false);

  // Exit handling
  const [isShuttingDown, setIsShuttingDown] = useState(false);
  const handleExitToggle = () => {
    if (isShuttingDown) return;
    setIsShuttingDown(true);
    playToggleSound(true);
    setTimeout(() => {
      onExitLab?.();
    }, 400);
  };

  // Canvas reference and clear helper
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    }
  };

  return (
    <div 
      className="relative w-full h-screen bg-wood-table text-[#FF8A1E] font-mono overflow-hidden cursor-none"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Top Left Return to Surface Bar Button */}
      <div className="absolute top-6 right-6 z-50">
        <button
          onClick={() => {
            playClickSound();
            onExitLab?.();
          }}
          className="px-4 py-2 bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-500/40 rounded-xl text-emerald-300 text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-2 shadow-2xl backdrop-blur-md transition-all cursor-pointer hover:scale-105 active:scale-95"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Surface</span>
        </button>
      </div>

      {/* Background surface (layered grid) */}
      <CuttingMatSurface />

      {/* Edge Ruler (ticks & metrics) */}
      <EdgeRuler />

      {/* Vignette overlay for depth */}
      <div className="mat-vignette pointer-events-none" />

      {/* Stamp marks (under drawing canvas) */}
      <StampMark top="72%" left="82%" rotation={-12} />
      <StampMark top="28%" left="58%" rotation={15} />

      {/* Annotation arrows */}
      <AnnotationArrow top="50%" left="8%" rotation={10} label="Select drawing tools below" labelOffset={{ x: 0, y: -20 }} />

      {/* Sticky labels */}
      <StickyLabel text="latent space loading: OK" color="yellow" top="15%" left="75%" rotation={3} />
      <StickyLabel text="redraw ideas here" color="pink" top="78%" left="12%" rotation={-4} />

      {/* Intro instructions card */}
      <IntroCard />

      {/* Draggable paper sketch fragment card */}
      <SketchCard />

      {/* Interactive drawing canvas */}
      <DrawingCanvas ref={canvasRef} activeTool={activeTool} color={color} />

      {/* Custom tool cursor ghost */}
      <CursorGhost activeTool={activeTool} color={color} isWorkspaceHovered={isHovered} />

      {/* Toolbar dashboard */}
      <Toolbar
        activeTool={activeTool}
        setActiveTool={setActiveTool}
        color={color}
        setColor={setColor}
        onClear={clearCanvas}
        onExit={handleExitToggle}
      />

      {/* Footer metadata */}
      <MatFooter />
    </div>
  );
}
