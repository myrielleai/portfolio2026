import { useEffect, useRef, useState } from "react";

interface SketchbookBackgroundProps {
  onEggFound?: () => void;
}

export default function SketchbookBackground({ onEggFound }: SketchbookBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [, setEggDiscovered] = useState(false);
  const eggFoundRef = useRef(false);
  const isVisibleRef = useRef(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number | null = null;
    let width = 0;
    let height = 0;
    let offscreenCanvas: HTMLCanvasElement | null = null;

    // Mouse tracking state with smooth lerp & velocity
    const mouse = {
      x: -1000,
      y: -1000,
      targetX: -1000,
      targetY: -1000,
      lastX: -1000,
      lastY: -1000,
      vx: 0,
      vy: 0,
      speed: 0,
      isActive: false,
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isVisibleRef.current) return;
      const rect = container.getBoundingClientRect();
      mouse.targetX = e.clientX - rect.left;
      mouse.targetY = e.clientY - rect.top;
      mouse.isActive = true;
    };

    const handleMouseLeave = () => {
      mouse.isActive = false;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isVisibleRef.current) return;
      if (e.touches.length > 0) {
        const rect = container.getBoundingClientRect();
        mouse.targetX = e.touches[0].clientX - rect.left;
        mouse.targetY = e.touches[0].clientY - rect.top;
        mouse.isActive = true;
      }
    };

    // --- Sketch Drawing Helper Utilities ---

    const drawJitterCircle = (
      c: CanvasRenderingContext2D,
      cx: number,
      cy: number,
      r: number,
      seed = 0
    ) => {
      c.beginPath();
      const steps = 24;
      for (let i = 0; i <= steps; i++) {
        const angle = (i / steps) * Math.PI * 2;
        const jitter = Math.sin(angle * 5 + seed) * 0.7;
        const rad = r + jitter;
        const px = cx + Math.cos(angle) * rad;
        const py = cy + Math.sin(angle) * rad;
        if (i === 0) c.moveTo(px, py);
        else c.lineTo(px, py);
      }
      c.stroke();
    };

    const renderSketches = (
      c: CanvasRenderingContext2D,
      isIlluminated: boolean,
      mouseX: number,
      mouseY: number,
      pX: number,
      pY: number
    ) => {
      const mainColor = isIlluminated ? "#18181b" : "#a1a1aa";
      const accentColor = isIlluminated ? "#7e22ce" : "#d4d4d8";
      const faintDetailColor = isIlluminated ? "rgba(24, 24, 27, 0.7)" : "rgba(161, 161, 170, 0.3)";

      c.lineWidth = isIlluminated ? 1.4 : 0.9;
      c.strokeStyle = mainColor;

      // Draw star helper utility
      const drawStar = (sx: number, sy: number, r: number, color: string) => {
        c.strokeStyle = color;
        c.beginPath();
        for (let i = 0; i < 5; i++) {
          const a1 = (i * Math.PI * 2) / 5 - Math.PI / 2;
          const a2 = a1 + Math.PI / 5;
          const x1 = sx + Math.cos(a1) * r;
          const y1 = sy + Math.sin(a1) * r;
          const x2 = sx + Math.cos(a2) * (r * 0.4);
          const y2 = sy + Math.sin(a2) * (r * 0.4);
          if (i === 0) c.moveTo(x1, y1);
          else c.lineTo(x1, y1);
          c.lineTo(x2, y2);
        }
        c.closePath();
        c.stroke();
      };


      // 6. EASTER EGG LOCATION
      const eggX = width * 0.82 + pX * 0.5;
      const eggY = height * 0.82 + pY * 0.5;
      const distToEgg = Math.hypot(mouseX - eggX, mouseY - eggY);
      const isEggLit = distToEgg < 200;

      if (isEggLit && !eggFoundRef.current) {
        eggFoundRef.current = true;
        setEggDiscovered(true);
        if (onEggFound) onEggFound();
      }

      c.save();
      c.translate(eggX, eggY);
      c.strokeStyle = isEggLit ? "#9333ea" : mainColor;
      c.lineWidth = isEggLit ? 2 : 1;
      drawJitterCircle(c, 0, 0, 32, 80);
      drawJitterCircle(c, 0, 0, 38, 81);
      drawStar(0, 0, 18, isEggLit ? "#ec4899" : accentColor);

      if (isEggLit) {
        const glow = c.createRadialGradient(0, 0, 5, 0, 0, 70);
        glow.addColorStop(0, "rgba(147, 51, 234, 0.25)");
        glow.addColorStop(1, "rgba(147, 51, 234, 0)");
        c.fillStyle = glow;
        c.beginPath();
        c.arc(0, 0, 70, 0, Math.PI * 2);
        c.fill();

        c.font = "900 18px 'Casual', sans-serif";
        c.fillStyle = "#581c87";
        c.textAlign = "center";
        c.fillText("You found me.", 0, -48);
      } else {
        c.font = "italic 9px monospace";
        c.fillStyle = faintDetailColor;
        c.textAlign = "center";
        c.fillText("???", 0, 48);
      }
      c.restore();
    };

    const rebuildCache = () => {
      const rect = container.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);

      // Create offscreen cached canvas for background sketches
      offscreenCanvas = document.createElement("canvas");
      offscreenCanvas.width = width * dpr;
      offscreenCanvas.height = height * dpr;
      const offCtx = offscreenCanvas.getContext("2d");
      if (offCtx) {
        offCtx.scale(dpr, dpr);
        offCtx.clearRect(0, 0, width, height);

        // Draw paper grid
        offCtx.strokeStyle = "rgba(228, 228, 231, 0.4)";
        offCtx.lineWidth = 0.5;
        const gridSize = 40;
        offCtx.beginPath();
        for (let x = 0; x < width; x += gridSize) {
          offCtx.moveTo(x, 0);
          offCtx.lineTo(x, height);
        }
        for (let y = 0; y < height; y += gridSize) {
          offCtx.moveTo(0, y);
          offCtx.lineTo(width, y);
        }
        offCtx.stroke();

        // Render base background sketches onto offscreen canvas
        offCtx.save();
        offCtx.globalAlpha = 0.08;
        renderSketches(offCtx, false, -1000, -1000, 0, 0);
        offCtx.restore();
      }

      if (mouse.targetX === -1000) {
        mouse.targetX = width / 2;
        mouse.targetY = height / 2;
        mouse.x = width / 2;
        mouse.y = height / 2;
      }
    };

    rebuildCache();
    window.addEventListener("resize", rebuildCache);
    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    container.addEventListener("mouseleave", handleMouseLeave);
    window.addEventListener("touchmove", handleTouchMove, { passive: true });

    // --- Main Animation Loop with Offscreen Cache & IntersectionObserver ---
    const render = () => {
      if (!isVisibleRef.current) return;

      mouse.x += (mouse.targetX - mouse.x) * 0.15;
      mouse.y += (mouse.targetY - mouse.y) * 0.15;

      mouse.vx = mouse.x - mouse.lastX;
      mouse.vy = mouse.y - mouse.lastY;
      mouse.speed = Math.hypot(mouse.vx, mouse.vy);
      mouse.lastX = mouse.x;
      mouse.lastY = mouse.y;

      const centerX = width / 2;
      const centerY = height / 2;
      const parallaxX = (mouse.x - centerX) * 0.04;
      const parallaxY = (mouse.y - centerY) * 0.04;

      // Fast draw offscreen cached background
      if (offscreenCanvas) {
        ctx.clearRect(0, 0, width, height);
        ctx.drawImage(offscreenCanvas, 0, 0, width, height);
      } else {
        ctx.clearRect(0, 0, width, height);
      }

      // Render Spotlight mask & illuminated sketches
      if (mouse.x > -500 && mouse.y > -500) {
        ctx.save();
        const spotlightRadius = 240;
        ctx.beginPath();
        ctx.arc(mouse.x, mouse.y, spotlightRadius, 0, Math.PI * 2);
        ctx.clip();

        renderSketches(ctx, true, mouse.x, mouse.y, parallaxX, parallaxY);

        const beamGlow = ctx.createRadialGradient(
          mouse.x,
          mouse.y,
          0,
          mouse.x,
          mouse.y,
          spotlightRadius
        );
        beamGlow.addColorStop(0, "rgba(147, 51, 234, 0.06)");
        beamGlow.addColorStop(0.7, "rgba(147, 51, 234, 0.02)");
        beamGlow.addColorStop(1, "rgba(147, 51, 234, 0)");
        ctx.fillStyle = beamGlow;
        ctx.fill();

        ctx.restore();
      }

      animId = requestAnimationFrame(render);
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisibleRef.current = entry.isIntersecting;
        if (entry.isIntersecting) {
          if (!animId) animId = requestAnimationFrame(render);
        } else {
          if (animId) {
            cancelAnimationFrame(animId);
            animId = null;
          }
        }
      },
      { threshold: 0.01 }
    );

    observer.observe(container);

    return () => {
      observer.disconnect();
      if (animId) cancelAnimationFrame(animId);
      window.removeEventListener("mousemove", handleMouseMove);
      container.removeEventListener("mouseleave", handleMouseLeave);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("resize", rebuildCache);
    };
  }, [onEggFound]);

  return (
    <div ref={containerRef} className="absolute inset-0 w-full h-full overflow-hidden pointer-events-auto">
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full block" />
    </div>
  );
}

