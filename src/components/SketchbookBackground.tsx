import { useEffect, useRef, useState } from "react";

interface SketchbookBackgroundProps {
  onEggFound?: () => void;
}

export default function SketchbookBackground({ onEggFound }: SketchbookBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [, setEggDiscovered] = useState(false);
  const eggFoundRef = useRef(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let width = 0;
    let height = 0;

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
      const rect = container.getBoundingClientRect();
      mouse.targetX = e.clientX - rect.left;
      mouse.targetY = e.clientY - rect.top;
      mouse.isActive = true;
    };

    const handleMouseLeave = () => {
      mouse.isActive = false;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        const rect = container.getBoundingClientRect();
        mouse.targetX = e.touches[0].clientX - rect.left;
        mouse.targetY = e.touches[0].clientY - rect.top;
        mouse.isActive = true;
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    container.addEventListener("mouseleave", handleMouseLeave);
    window.addEventListener("touchmove", handleTouchMove, { passive: true });

    const resize = () => {
      const rect = container.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);

      // Default mouse position to center if not set
      if (mouse.targetX === -1000) {
        mouse.targetX = width / 2;
        mouse.targetY = height / 2;
        mouse.x = width / 2;
        mouse.y = height / 2;
      }
    };

    resize();
    window.addEventListener("resize", resize);

    // --- Sketch Drawing Helper Utilities ---
    // Adds hand-drawn pencil jitter to straight lines
    const drawJitterLine = (
      c: CanvasRenderingContext2D,
      x1: number,
      y1: number,
      x2: number,
      y2: number,
      seed = 0
    ) => {
      const dist = Math.hypot(x2 - x1, y2 - y1);
      const steps = Math.max(2, Math.floor(dist / 25));
      c.beginPath();
      c.moveTo(x1, y1);
      for (let i = 1; i < steps; i++) {
        const t = i / steps;
        const lx = x1 + (x2 - x1) * t;
        const ly = y1 + (y2 - y1) * t;
        // Deterministic pseudo-random offset based on index and seed
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
      const steps = 36;
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

    // Halftone dots patch generator
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

    // Render individual detailed sketch scenes
    const renderSketches = (
      c: CanvasRenderingContext2D,
      isIlluminated: boolean,
      mouseX: number,
      mouseY: number,
      pX: number, // parallax X offset
      pY: number  // parallax Y offset
    ) => {
      const mainColor = isIlluminated ? "#18181b" : "#a1a1aa";
      const accentColor = isIlluminated ? "#7e22ce" : "#d4d4d8"; // burgundy/purple accent
      const secondaryColor = isIlluminated ? "#9333ea" : "#e4e4e7";
      const faintDetailColor = isIlluminated ? "rgba(24, 24, 27, 0.7)" : "rgba(161, 161, 170, 0.3)";

      c.lineWidth = isIlluminated ? 1.4 : 0.9;
      c.strokeStyle = mainColor;

      // -------------------------------------------------------------
      // 1. TOP-LEFT: UI Wireframe Screen & Mobile Mockup (Depth 0.4)
      // -------------------------------------------------------------
      const tlX = width * 0.12 + pX * 0.4;
      const tlY = height * 0.18 + pY * 0.4;

      // Desktop browser frame
      drawJitterRect(c, tlX, tlY, 220, 140, 1);
      // Browser top bar
      drawJitterLine(c, tlX, tlY + 22, tlX + 220, tlY + 22, 2);
      // 3 dots
      c.fillStyle = mainColor;
      c.beginPath();
      c.arc(tlX + 14, tlY + 11, 2.5, 0, Math.PI * 2);
      c.arc(tlX + 24, tlY + 11, 2.5, 0, Math.PI * 2);
      c.arc(tlX + 34, tlY + 11, 2.5, 0, Math.PI * 2);
      c.fill();
      // URL address bar
      drawJitterRect(c, tlX + 48, tlY + 5, 120, 12, 3);
      if (isIlluminated) {
        c.font = "bold 8px monospace";
        c.fillStyle = secondaryColor;
        c.fillText("https://portfolio.design/v2", tlX + 54, tlY + 14);
      }

      // Sidebar & content boxes inside desktop wireframe
      drawJitterLine(c, tlX + 45, tlY + 22, tlX + 45, tlY + 140, 4);
      drawJitterRect(c, tlX + 54, tlY + 32, 70, 45, 5); // Hero box
      drawJitterLine(c, tlX + 54, tlY + 32, tlX + 124, tlY + 77, 6); // Image X cross
      drawJitterLine(c, tlX + 124, tlY + 32, tlX + 54, tlY + 77, 7);

      drawJitterRect(c, tlX + 132, tlY + 32, 75, 45, 8); // Cards
      drawJitterRect(c, tlX + 54, tlY + 86, 153, 40, 9); // Bottom section

      // Mobile wireframe next to desktop
      const mX = tlX + 240;
      const mY = tlY - 10;
      drawJitterRect(c, mX, mY, 70, 130, 10);
      drawJitterCircle(c, mX + 35, mY + 10, 4, 11); // Dynamic island
      drawJitterRect(c, mX + 8, mY + 24, 54, 30, 12);
      // Text skeleton lines
      drawJitterLine(c, mX + 8, mY + 62, mX + 48, mY + 62, 13);
      drawJitterLine(c, mX + 8, mY + 70, mX + 38, mY + 70, 14);
      drawJitterLine(c, mX + 8, mY + 78, mX + 54, mY + 78, 15);
      // Mobile button sketch
      c.strokeStyle = accentColor;
      drawJitterRect(c, mX + 8, mY + 95, 54, 16, 16);
      c.strokeStyle = mainColor;

      // Handwritten annotation
      c.font = "italic 11px sans-serif";
      c.fillStyle = isIlluminated ? "#6b21a8" : mainColor;
      c.fillText("refactor component layout", tlX + 10, tlY + 160);
      drawJitterLine(c, tlX + 140, tlY + 156, tlX + 170, tlY + 145, 17); // Arrow pointing up

      // -------------------------------------------------------------
      // 2. BOTTOM-LEFT: Architectural Perspective Grid & 3D Form (Depth 0.6)
      // -------------------------------------------------------------
      const blX = width * 0.15 + pX * 0.6;
      const blY = height * 0.72 + pY * 0.6;
      const vpX = blX + 120; // Vanishing point
      const vpY = blY - 40;

      // Perspective horizon line & vanishing point cross
      c.strokeStyle = faintDetailColor;
      drawJitterLine(c, blX - 60, vpY, blX + 300, vpY, 18);
      drawJitterLine(c, vpX, vpY - 40, vpX, vpY + 40, 19);

      // Radiating perspective lines
      const angles = [-0.6, -0.3, 0, 0.3, 0.6, 0.9, 1.2];
      angles.forEach((ang, idx) => {
        const rayX = vpX + Math.cos(ang) * 220;
        const rayY = vpY + Math.sin(ang) * 160;
        drawJitterLine(c, vpX, vpY, rayX, rayY, 20 + idx);
      });

      // 3D Wireframe Cube aligned to vanishing point
      c.strokeStyle = mainColor;
      const cubeX = blX + 20;
      const cubeY = blY + 10;
      const cubeW = 60;
      const cubeH = 50;
      drawJitterRect(c, cubeX, cubeY, cubeW, cubeH, 30);
      // Back face & perspective lines connecting to VP
      drawJitterLine(c, cubeX, cubeY, vpX, vpY, 31);
      drawJitterLine(c, cubeX + cubeW, cubeY, vpX, vpY, 32);
      drawJitterLine(c, cubeX + cubeW, cubeY + cubeH, vpX, vpY, 33);
      drawJitterLine(c, cubeX, cubeY + cubeH, vpX, vpY, 34);

      // Dimension labels
      if (isIlluminated) {
        c.font = "bold 10px monospace";
        c.fillStyle = accentColor;
        c.fillText("θ = 38.5°", vpX + 15, vpY - 15);
        c.fillText("VP (x, y)", vpX - 25, vpY - 10);
        c.fillText("h: 120px", cubeX - 45, cubeY + 30);
      }

      // Halftone dot patch near perspective grid
      drawHalftonePatch(c, blX - 30, blY + 40, 7, 7, 7, 2, accentColor);

      // -------------------------------------------------------------
      // 3. TOP-RIGHT: Geometric Compass & Typography Experiments (Depth 0.3)
      // -------------------------------------------------------------
      const trX = width * 0.78 + pX * 0.3;
      const trY = height * 0.2 + pY * 0.3;

      // Compass concentric circles
      c.strokeStyle = mainColor;
      drawJitterCircle(c, trX, trY, 55, 40);
      drawJitterCircle(c, trX, trY, 80, 41);
      c.strokeStyle = faintDetailColor;
      drawJitterCircle(c, trX, trY, 110, 42);

      // Compass axis crosshairs
      drawJitterLine(c, trX - 120, trY, trX + 120, trY, 43);
      drawJitterLine(c, trX, trY - 120, trX, trY + 120, 44);

      // Inscribed star & triangle geometry
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

      // Hand-lettered typography experiment
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

      // -------------------------------------------------------------
      // 4. CENTER / RIGHT: Interface Elements & Sliders (Depth 0.5)
      // -------------------------------------------------------------
      const crX = width * 0.65 + pX * 0.5;
      const crY = height * 0.62 + pY * 0.5;

      // Slider track
      c.strokeStyle = mainColor;
      drawJitterLine(c, crX, crY, crX + 160, crY, 50);
      // Slider tick marks
      for (let i = 0; i <= 5; i++) {
        const tx = crX + (i * 160) / 5;
        drawJitterLine(c, tx, crY - 4, tx, crY + 4, 51 + i);
      }
      // Slider thumb handle
      c.fillStyle = isIlluminated ? accentColor : mainColor;
      drawJitterCircle(c, crX + 100, crY, 8, 58);

      // Toggle switch
      drawJitterRect(c, crX, crY + 30, 45, 22, 60);
      drawJitterCircle(c, crX + 32, crY + 41, 7, 61);

      // Cursor arrow with ripple rings
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

      // Ripple rings around cursor arrow
      c.strokeStyle = faintDetailColor;
      drawJitterCircle(c, arrowX + 5, arrowY + 5, 18, 62);
      drawJitterCircle(c, arrowX + 5, arrowY + 5, 28, 63);

      // Handwritten annotations
      c.font = "italic 11px monospace";
      c.fillStyle = isIlluminated ? "#6b21a8" : mainColor;
      c.fillText("hover state physics: spring(400, 12)", crX, crY + 75);

      // Halftone dot patch center-right
      drawHalftonePatch(c, crX + 180, crY - 20, 6, 6, 8, 2.5, secondaryColor);

      // -------------------------------------------------------------
      // 5. CENTER TOP: Stacked Words & Stars (Depth 0.2)
      // -------------------------------------------------------------
      const ctX = width * 0.48 + pX * 0.2;
      const ctY = height * 0.15 + pY * 0.2;

      // Decorative hand-drawn comic stars
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

      // -------------------------------------------------------------
      // 6. EASTER EGG LOCATION (Responsive: width * 0.82, height * 0.82)
      // -------------------------------------------------------------
      const eggX = width * 0.82 + pX * 0.5;
      const eggY = height * 0.82 + pY * 0.5;
      const distToEgg = Math.hypot(mouseX - eggX, mouseY - eggY);
      const isEggLit = distToEgg < 200;

      if (isEggLit && !eggFoundRef.current) {
        eggFoundRef.current = true;
        setEggDiscovered(true);
        if (onEggFound) onEggFound();
      }

      // Draw Easter Egg base sketch
      c.save();
      c.translate(eggX, eggY);

      // Hand-drawn compass / secret emblem frame
      c.strokeStyle = isEggLit ? "#9333ea" : mainColor;
      c.lineWidth = isEggLit ? 2 : 1;
      drawJitterCircle(c, 0, 0, 32, 80);
      drawJitterCircle(c, 0, 0, 38, 81);
      drawStar(0, 0, 18, isEggLit ? "#ec4899" : accentColor);

      if (isEggLit) {
        // Glowing background halo inside spotlight
        const glow = c.createRadialGradient(0, 0, 5, 0, 0, 70);
        glow.addColorStop(0, "rgba(147, 51, 234, 0.25)");
        glow.addColorStop(1, "rgba(147, 51, 234, 0)");
        c.fillStyle = glow;
        c.beginPath();
        c.arc(0, 0, 70, 0, Math.PI * 2);
        c.fill();

        // Reveal hidden message in handwritten comic font style!
        c.font = "900 18px 'Casual', sans-serif";
        c.fillStyle = "#581c87";
        c.textAlign = "center";
        c.fillText("You found me.", 0, -48);

        // Secret sketch tag removed
      } else {
        c.font = "italic 9px monospace";
        c.fillStyle = faintDetailColor;
        c.textAlign = "center";
        c.fillText("???", 0, 48);
      }
      c.restore();
    };

    // --- Main Animation & Spotlight Canvas Loop ---
    const render = () => {
      // Smooth lerp for cursor spotlight target
      mouse.x += (mouse.targetX - mouse.x) * 0.15;
      mouse.y += (mouse.targetY - mouse.y) * 0.15;

      // Calculate cursor velocity
      mouse.vx = mouse.x - mouse.lastX;
      mouse.vy = mouse.y - mouse.lastY;
      mouse.speed = Math.hypot(mouse.vx, mouse.vy);
      mouse.lastX = mouse.x;
      mouse.lastY = mouse.y;

      // Calculate global parallax offsets based on mouse offset from canvas center
      const centerX = width / 2;
      const centerY = height / 2;
      const parallaxX = (mouse.x - centerX) * 0.05;
      const parallaxY = (mouse.y - centerY) * 0.05;

      // 1. Clear main canvas with off-white sketchbook paper background
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, width, height);

      // Optional paper texture grid (subtle sketchbook grid lines)
      ctx.strokeStyle = "rgba(228, 228, 231, 0.4)";
      ctx.lineWidth = 0.5;
      const gridSize = 40;
      ctx.beginPath();
      for (let x = 0; x < width; x += gridSize) {
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
      }
      for (let y = 0; y < height; y += gridSize) {
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
      }
      ctx.stroke();

      // 2. Render Layer A: Faded, barely visible background sketches (opacity ~0.08)
      ctx.save();
      ctx.globalAlpha = 0.08;
      renderSketches(ctx, false, mouse.x, mouse.y, parallaxX * 0.5, parallaxY * 0.5);
      ctx.restore();

      // 3. Render Layer B: Illuminated Spotlight (Feathered Radial Mask)
      if (mouse.x > -500 && mouse.y > -500) {
        // High-speed chromatic displacement / Spider-Verse offset pass
        if (mouse.speed > 8) {
          ctx.save();
          const chromaOffX = -mouse.vx * 1.5;
          const chromaOffY = -mouse.vy * 1.5;
          ctx.globalAlpha = Math.min(0.4, (mouse.speed - 8) * 0.03);

          // Radial clip around cursor for chromatic echo
          ctx.beginPath();
          ctx.arc(mouse.x, mouse.y, 220, 0, Math.PI * 2);
          ctx.clip();

          // Render displaced purple/burgundy echo layer
          renderSketches(
            ctx,
            true,
            mouse.x,
            mouse.y,
            parallaxX + chromaOffX,
            parallaxY + chromaOffY
          );
          ctx.restore();

          // High-speed subtle comic motion / speed lines emanating from cursor direction
          ctx.save();
          ctx.strokeStyle = "rgba(126, 34, 206, 0.4)";
          ctx.lineWidth = 1;
          const angle = Math.atan2(-mouse.vy, -mouse.vx);
          for (let i = -3; i <= 3; i++) {
            const lineAng = angle + (i * Math.PI) / 18;
            const r1 = 80 + Math.random() * 20;
            const r2 = r1 + 30 + mouse.speed * 2;
            const x1 = mouse.x + Math.cos(lineAng) * r1;
            const y1 = mouse.y + Math.sin(lineAng) * r1;
            const x2 = mouse.x + Math.cos(lineAng) * r2;
            const y2 = mouse.y + Math.sin(lineAng) * r2;
            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
            ctx.stroke();
          }
          ctx.restore();
        }

        // Main Spotlight Layer: Feathered clip mask
        ctx.save();
        const spotlightRadius = 240;
        const maskGrad = ctx.createRadialGradient(
          mouse.x,
          mouse.y,
          20,
          mouse.x,
          mouse.y,
          spotlightRadius
        );
        maskGrad.addColorStop(0, "rgba(0, 0, 0, 1)");
        maskGrad.addColorStop(0.6, "rgba(0, 0, 0, 0.85)");
        maskGrad.addColorStop(1, "rgba(0, 0, 0, 0)");

        // Draw spotlight clip circle with feathered alpha using offscreen layer composition
        ctx.beginPath();
        ctx.arc(mouse.x, mouse.y, spotlightRadius, 0, Math.PI * 2);
        ctx.clip();

        // Render full crisp, dark charcoal & illuminated sketches inside spotlight
        renderSketches(ctx, true, mouse.x, mouse.y, parallaxX, parallaxY);

        // Add soft inner flashlight beam tint (very light warm spotlight glow)
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

    render();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("mousemove", handleMouseMove);
      container.removeEventListener("mouseleave", handleMouseLeave);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("resize", resize);
    };
  }, [onEggFound]);

  return (
    <div ref={containerRef} className="absolute inset-0 w-full h-full overflow-hidden pointer-events-auto">
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full block" />
    </div>
  );
}
