// src/components/DrawingCanvas.tsx
import React, { useEffect, useRef } from "react";
import TapeCorner from "./TapeCorner";

interface DrawingCanvasProps {
  activeTool: "pencil" | "marker" | "eraser" | "stamp";
  color: string;
}

// Forward ref so parent can clear the canvas
const DrawingCanvas = React.forwardRef<HTMLCanvasElement, DrawingCanvasProps>(
  ({ activeTool, color }, ref) => {
    const internalRef = useRef<HTMLCanvasElement>(null);
    // Use the forwarded ref if provided
    const canvas = (ref as React.MutableRefObject<HTMLCanvasElement | null>) ?? internalRef;

    useEffect(() => {
      const cnv = canvas.current;
      if (!cnv) return;
      const ctx = cnv.getContext("2d");
      if (!ctx) return;

      // Set canvas size to fill parent exactly
      const resize = () => {
        cnv.width = cnv.offsetWidth;
        cnv.height = cnv.offsetHeight;
      };
      resize();
      window.addEventListener("resize", resize);

      let drawing = false;
      let lastX = 0;
      let lastY = 0;

      const getPos = (e: MouseEvent | TouchEvent) => {
        const rect = cnv.getBoundingClientRect();
        if (e instanceof MouseEvent) {
          return { x: e.clientX - rect.left, y: e.clientY - rect.top };
        } else {
          const touch = e.touches[0];
          return { x: touch.clientX - rect.left, y: touch.clientY - rect.top };
        }
      };

      const start = (e: MouseEvent | TouchEvent) => {
        e.preventDefault();
        const pos = getPos(e);
        drawing = true;
        lastX = pos.x;
        lastY = pos.y;
        
        if (activeTool === "stamp") {
          // Precise stamp: draw detailed ink stamp motif
          ctx.save();
          ctx.strokeStyle = color;
          ctx.fillStyle = color;
          ctx.lineWidth = 1.5;

          // Outer dashed circle
          ctx.setLineDash([4, 4]);
          ctx.beginPath();
          ctx.arc(pos.x, pos.y, 45, 0, Math.PI * 2);
          ctx.stroke();

          // Inner solid circle
          ctx.setLineDash([]);
          ctx.beginPath();
          ctx.arc(pos.x, pos.y, 32, 0, Math.PI * 2);
          ctx.stroke();

          // Center crosshair lines
          ctx.strokeStyle = `${color}80`; // semi-transparent crosshair
          ctx.beginPath();
          ctx.moveTo(pos.x - 52, pos.y);
          ctx.lineTo(pos.x + 52, pos.y);
          ctx.moveTo(pos.x, pos.y - 52);
          ctx.lineTo(pos.x, pos.y + 52);
          ctx.stroke();

          // Inside text labels
          ctx.font = "bold 8px monospace";
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillText("TRY ME", pos.x, pos.y - 5);
          ctx.fillText("[ DRAW ]", pos.x, pos.y + 5);

          ctx.restore();
          drawing = false; // stamp is a one-shot click action
        }
      };

      const draw = (e: MouseEvent | TouchEvent) => {
        if (!drawing) return;
        const pos = getPos(e);
        ctx.save();
        
        if (activeTool === "eraser") {
          ctx.globalCompositeOperation = "destination-out";
          ctx.lineWidth = 24;
        } else if (activeTool === "marker") {
          ctx.globalAlpha = 0.32;
          ctx.lineWidth = 14;
        } else {
          // pencil
          ctx.globalAlpha = 0.9;
          ctx.lineWidth = 2.5;
        }
        
        ctx.strokeStyle = color;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        ctx.beginPath();
        ctx.moveTo(lastX, lastY);
        ctx.lineTo(pos.x, pos.y);
        ctx.stroke();
        ctx.restore();
        
        lastX = pos.x;
        lastY = pos.y;
      };

      const stop = () => {
        drawing = false;
      };

      // Mouse events
      cnv.addEventListener("mousedown", start);
      cnv.addEventListener("mousemove", draw);
      cnv.addEventListener("mouseup", stop);
      cnv.addEventListener("mouseleave", stop);
      // Touch events
      cnv.addEventListener("touchstart", start);
      cnv.addEventListener("touchmove", draw, { passive: false });
      cnv.addEventListener("touchend", stop);

      return () => {
        cnv.removeEventListener("mousedown", start);
        cnv.removeEventListener("mousemove", draw);
        cnv.removeEventListener("mouseup", stop);
        cnv.removeEventListener("mouseleave", stop);
        cnv.removeEventListener("touchstart", start);
        cnv.removeEventListener("touchmove", draw);
        cnv.removeEventListener("touchend", stop);
        window.removeEventListener("resize", resize);
      };
    }, [activeTool, color]);

    return (
      <div 
        className="absolute top-[48%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[85vw] max-w-[850px] aspect-[11/7.5] bg-drafting-paper rounded-xs z-10 pointer-events-auto select-none"
        style={{
          touchAction: "none"
        }}
      >
        {/* Taped corners holding the drawing paper to the cutting mat */}
        <TapeCorner color="cream" position="top-left" />
        <TapeCorner color="yellow" position="top-right" />
        <TapeCorner color="blue" position="bottom-left" />
        <TapeCorner color="coral" position="bottom-right" />

        {/* The canvas that receives the drawings */}
        <canvas
          ref={canvas as any}
          className="absolute inset-0 w-full h-full rounded-xs"
        />
      </div>
    );
  }
);

DrawingCanvas.displayName = "DrawingCanvas";
export default DrawingCanvas;
