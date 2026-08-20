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
    const drawJitterLine = (
      c: CanvasRenderingContext2D,
      x1: number,
      y1: number,
      x2: number,
      y2: number,
      seed = 0
    ) => {
      const dist = Math.hypot(x2 - x1, y2 - y1);
      const steps = Math.max(2, Math.floor(dist / 30));
      c.beginPath();
      c.moveTo(x1, y1);
      for (let i = 1; i < steps; i++) {
        const t = i / steps;
        const lx = x1 + (x2 - x1) * t;
        const ly = y1 + (y2 - y1) * t;
        const offset = Math.sin(t * 10 + seed) * 0.8;
        const perpX = -(y2 - y1) / (dist || 1);
        const perpY = (x2 - x1) / (dist || 1);
        c.lineTo(lx + perpX * offset, ly + perpY * offset);
      }
      c.lineTo(x2, y2);
      c.stroke();
    };

    const drawJitterRect = (
      c: CanvasRenderingContext2D,
      x: number,
      y: number,
      w: number,
      h: number,
      seed = 0
    ) => {
      drawJitterLine(c, x, y, x + w, y, seed);
      drawJitterLine(c, x + w, y, x + w, y + h, seed + 1);
      drawJitterLine(c, x + w, y + h, x, y + h, seed + 2);
      drawJitterLine(c, x, y + h, x, y, seed + 3);
    };

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

    const drawHalftonePatch = (
      c: CanvasRenderingContext2D,
      cx: number,
      cy: number,
      cols: number,
      rows: number,
      spacing: number,
      maxR: number,
      color: string
    ) => {
      c.fillStyle = color;
      const startX = cx - (cols * spacing) / 2;
      const startY = cy - (rows * spacing) / 2;
      for (let r = 0; r < rows; r++) {
        for (let col = 0; col < cols; col++) {
          const px = startX + col * spacing;
          const py = startY + r * spacing;
          const distFromCenter = Math.hypot(col - cols / 2, r - rows / 2);
          const dotRadius = Math.max(0.5, maxR * (1 - distFromCenter / (cols * 0.7)));
          c.beginPath();
          c.arc(px, py, dotRadius, 0, Math.PI * 2);
          c.fill();
        }
      }
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
      const secondaryColor = isIlluminated ? "#9333ea" : "#e4e4e7";
      const faintDetailColor = isIlluminated ? "rgba(24, 24, 27, 0.7)" : "rgba(161, 161, 170, 0.3)";

      c.lineWidth = isIlluminated ? 1.4 : 0.9;
      c.strokeStyle = mainColor;

      // 1. TOP-LEFT: UI Wireframe Screen & Mobile Mockup
      const tlX = width * 0.12 + pX * 0.4;
      const tlY = height * 0.18 + pY * 0.4;

      drawJitterRect(c, tlX, tlY, 220, 140, 1);
      drawJitterLine(c, tlX, tlY + 22, tlX + 220, tlY + 22, 2);

      c.fillStyle = mainColor;
      c.beginPath();
      c.arc(tlX + 14, tlY + 11, 2.5, 0, Math.PI * 2);
      c.arc(tlX + 24, tlY + 11, 2.5, 0, Math.PI * 2);
      c.arc(tlX + 34, tlY + 11, 2.5, 0, Math.PI * 2);
      c.fill();

      drawJitterRect(c, tlX + 48, tlY + 5, 120, 12, 3);
      if (isIlluminated) {
        c.font = "bold 8px monospace";
        c.fillStyle = secondaryColor;
        c.fillText("https://portfolio.design/v2", tlX + 54, tlY + 14);
      }

      drawJitterLine(c, tlX + 45, tlY + 22, tlX + 45, tlY + 140, 4);
      drawJitterRect(c, tlX + 54, tlY + 32, 70, 45, 5);
      drawJitterLine(c, tlX + 54, tlY + 32, tlX + 124, tlY + 77, 6);
      drawJitterLine(c, tlX + 124, tlY + 32, tlX + 54, tlY + 77, 7);

      drawJitterRect(c, tlX + 132, tlY + 32, 75, 45, 8);
      drawJitterRect(c, tlX + 54, tlY + 86, 153, 40, 9);

      const mX = tlX + 240;
      const mY = tlY - 10;
      drawJitterRect(c, mX, mY, 70, 130, 10);
      drawJitterCircle(c, mX + 35, mY + 10, 4, 11);
      drawJitterRect(c, mX + 8, mY + 24, 54, 30, 12);
      drawJitterLine(c, mX + 8, mY + 62, mX + 48, mY + 62, 13);
      drawJitterLine(c, mX + 8, mY + 70, mX + 38, mY + 70, 14);
      drawJitterLine(c, mX + 8, mY + 78, mX + 54, mY + 78, 15);

      c.strokeStyle = accentColor;
      drawJitterRect(c, mX + 8, mY + 95, 54, 16, 16);
      c.strokeStyle = mainColor;

      c.font = "italic 11px sans-serif";
      c.fillStyle = isIlluminated ? "#6b21a8" : mainColor;
      c.fillText("refactor component layout", tlX + 10, tlY + 160);
      drawJitterLine(c, tlX + 140, tlY + 156, tlX + 170, tlY + 145, 17);

      // 2. BOTTOM-LEFT: Architectural Perspective Grid
      const blX = width * 0.15 + pX * 0.6;
      const blY = height * 0.72 + pY * 0.6;
      const vpX = blX + 120;
      const vpY = blY - 40;

      c.strokeStyle = faintDetailColor;
      drawJitterLine(c, blX - 60, vpY, blX + 300, vpY, 18);
      drawJitterLine(c, vpX, vpY - 40, vpX, vpY + 40, 19);

      const angles = [-0.6, -0.3, 0, 0.3, 0.6, 0.9, 1.2];
      angles.forEach((ang, idx) => {
        const rayX = vpX + Math.cos(ang) * 220;
        const rayY = vpY + Math.sin(ang) * 160;
        drawJitterLine(c, vpX, vpY, rayX, rayY, 20 + idx);
      });

      c.strokeStyle = mainColor;
      const cubeX = blX + 20;
      const cubeY = blY + 10;
      const cubeW = 60;
      const cubeH = 50;
      drawJitterRect(c, cubeX, cubeY, cubeW, cubeH, 30);
      drawJitterLine(c, cubeX, cubeY, vpX, vpY, 31);
      drawJitterLine(c, cubeX + cubeW, cubeY, vpX, vpY, 32);
      drawJitterLine(c, cubeX + cubeW, cubeY + cubeH, vpX, vpY, 33);
      drawJitterLine(c, cubeX, cubeY + cubeH, vpX, vpY, 34);

      if (isIlluminated) {
        c.font = "bold 10px monospace";
        c.fillStyle = accentColor;
        c.fillText("θ = 38.5°", vpX + 15, vpY - 15);
        c.fillText("VP (x, y)", vpX - 25, vpY - 10);
        c.fillText("h: 120px", cubeX - 45, cubeY + 30);
      }

      drawHalftonePatch(c, blX - 30, blY + 40, 7, 7, 7, 2, accentColor);

      // 3. TOP-RIGHT: Geometric Compass
      const trX = width * 0.78 + pX * 0.3;
      const trY = height * 0.2 + pY * 0.3;

      c.strokeStyle = mainColor;
      drawJitterCircle(c, trX, trY, 55, 40);
      drawJitterCircle(c, trX, trY, 80, 41);
      c.strokeStyle = faintDetailColor;
      drawJitterCircle(c, trX, trY, 110, 42);

      drawJitterLine(c, trX - 120, trY, trX + 120, trY, 43);
      drawJitterLine(c, trX, trY - 120, trX, trY + 120, 44);

      c.strokeStyle = accentColor;
      c.beginPath();
      for (let i = 0; i < 3; i++) {
        const ang = (i * Math.PI * 2) / 3 - Math.PI / 2;
        const px = trX + Math.cos(ang) * 55;
        const py = trY + Math.sin(ang) * 55;
        if (i === 0) c.moveTo(px, py);
        else c.lineTo(px, py);
      }
      c.closePath();
      c.stroke();

      c.font = "900 24px sans-serif";
      c.fillStyle = isIlluminated ? mainColor : "rgba(161, 161, 170, 0.4)";
      c.fillText("SYSTEM", trX - 110, trY + 95);
      c.font = "italic bold 14px serif";
      c.fillStyle = isIlluminated ? secondaryColor : "rgba(161, 161, 170, 0.3)";
      c.fillText("— draft 04 // grid & ratio", trX - 110, trY + 115);

      if (isIlluminated) {
        c.font = "bold 9px monospace";
        c.fillStyle = accentColor;
        c.fillText("Φ = 1.618033...", trX + 60, trY - 45);
        c.fillText("R = 80px", trX + 60, trY - 30);
      }

      // 4. CENTER / RIGHT: Interface Elements
      const crX = width * 0.65 + pX * 0.5;
      const crY = height * 0.62 + pY * 0.5;

      c.strokeStyle = mainColor;
      drawJitterLine(c, crX, crY, crX + 160, crY, 50);
      for (let i = 0; i <= 5; i++) {
        const tx = crX + (i * 160) / 5;
        drawJitterLine(c, tx, crY - 4, tx, crY + 4, 51 + i);
      }
      c.fillStyle = isIlluminated ? accentColor : mainColor;
      drawJitterCircle(c, crX + 100, crY, 8, 58);

      drawJitterRect(c, crX, crY + 30, 45, 22, 60);
      drawJitterCircle(c, crX + 32, crY + 41, 7, 61);

      const arrowX = crX + 130;
      const arrowY = crY + 40;
      c.strokeStyle = mainColor;
      c.beginPath();
      c.moveTo(arrowX, arrowY);
      c.lineTo(arrowX + 14, arrowY + 16);
      c.lineTo(arrowX + 7, arrowY + 16);
      c.lineTo(arrowX + 11, arrowY + 24);
      c.lineTo(arrowX + 7, arrowY + 25);
      c.lineTo(arrowX + 3, arrowY + 17);
      c.lineTo(arrowX, arrowY + 20);
      c.closePath();
      c.stroke();
      if (isIlluminated) {
        c.fillStyle = secondaryColor;
        c.fill();
      }

      c.strokeStyle = faintDetailColor;
      drawJitterCircle(c, arrowX + 5, arrowY + 5, 18, 62);
      drawJitterCircle(c, arrowX + 5, arrowY + 5, 28, 63);

      c.font = "italic 11px monospace";
      c.fillStyle = isIlluminated ? "#6b21a8" : mainColor;
      c.fillText("hover state physics: spring(400, 12)", crX, crY + 75);

      drawHalftonePatch(c, crX + 180, crY - 20, 6, 6, 8, 2.5, secondaryColor);

      // 5. CENTER TOP: Stacked Words & Stars
      const ctX = width * 0.48 + pX * 0.2;
      const ctY = height * 0.15 + pY * 0.2;

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

      drawStar(ctX - 100, ctY - 20, 12, accentColor);
      drawStar(ctX + 120, ctY - 10, 8, mainColor);
      drawStar(ctX + 140, ctY + 30, 14, secondaryColor);

      c.font = "bold 11px monospace";
      c.fillStyle = isIlluminated ? secondaryColor : faintDetailColor;
      c.fillText("✦ ARCHIVE SKETCHBOOK — VOL.01", ctX - 90, ctY + 10);
      drawJitterLine(c, ctX - 90, ctY + 15, ctX + 110, ctY + 15, 70);

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
        offCtx.fillStyle = "#ffffff";
        offCtx.fillRect(0, 0, width, height);

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
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, width, height);
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

