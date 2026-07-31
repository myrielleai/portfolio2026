import * as THREE from "three";

/**
 * Procedural texture & material factory for the 3D Workbench.
 * Creates photorealistic textures dynamically on HTML5 canvas.
 */

// 1. Walnut Wood Surface Texture
export function createWalnutWoodTexture(): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 1024;
  canvas.height = 1024;
  const ctx = canvas.getContext("2d")!;

  // Base wood tone gradient
  const grad = ctx.createLinearGradient(0, 0, 1024, 1024);
  grad.addColorStop(0, "#231610");
  grad.addColorStop(0.3, "#2d1d15");
  grad.addColorStop(0.7, "#1c120c");
  grad.addColorStop(1, "#261912");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 1024, 1024);

  // Wood grain lines
  ctx.strokeStyle = "rgba(12, 7, 4, 0.25)";
  ctx.lineWidth = 2;
  for (let i = -500; i < 1524; i += 8) {
    ctx.beginPath();
    ctx.moveTo(i, 0);
    const curve = Math.sin(i * 0.01) * 30;
    ctx.bezierCurveTo(
      i + 150 + curve, 300,
      i - 100 - curve, 700,
      i + 200, 1024
    );
    ctx.stroke();
  }

  // Fine noise grain
  const imgData = ctx.getImageData(0, 0, 1024, 1024);
  const data = imgData.data;
  for (let i = 0; i < data.length; i += 4) {
    const noise = (Math.random() - 0.5) * 12;
    data[i] = Math.min(255, Math.max(0, data[i] + noise));
    data[i + 1] = Math.min(255, Math.max(0, data[i + 1] + noise * 0.8));
    data[i + 2] = Math.min(255, Math.max(0, data[i + 2] + noise * 0.6));
  }
  ctx.putImageData(imgData, 0, 0);

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

// 2. Green Self-Healing Cutting Mat Texture with Interactive Blueprint Zones
export function createCuttingMatTexture(): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 2048;
  canvas.height = 1365; // ~3:2 ratio
  const ctx = canvas.getContext("2d")!;

  // Deep matte green background
  ctx.fillStyle = "#0c2c23";
  ctx.fillRect(0, 0, 2048, 1365);

  // Grid border frame
  ctx.strokeStyle = "#10b981";
  ctx.lineWidth = 4;
  ctx.strokeRect(40, 40, 1968, 1285);

  // Fine 10px & major 100px grid lines
  ctx.strokeStyle = "rgba(16, 185, 129, 0.25)";
  ctx.lineWidth = 1;
  const step = 40;

  for (let x = 40; x <= 2008; x += step) {
    ctx.beginPath();
    ctx.moveTo(x, 40);
    ctx.lineTo(x, 1325);
    ctx.stroke();
  }

  for (let y = 40; y <= 1325; y += step) {
    ctx.beginPath();
    ctx.moveTo(40, y);
    ctx.lineTo(2008, y);
    ctx.stroke();
  }

  // Major grid lines & millimeter ticks
  ctx.strokeStyle = "rgba(52, 211, 153, 0.65)";
  ctx.lineWidth = 2;
  const majorStep = 200;

  for (let x = 40; x <= 2008; x += majorStep) {
    ctx.beginPath();
    ctx.moveTo(x, 40);
    ctx.lineTo(x, 1325);
    ctx.stroke();
  }

  for (let y = 40; y <= 1325; y += majorStep) {
    ctx.beginPath();
    ctx.moveTo(40, y);
    ctx.lineTo(2008, y);
    ctx.stroke();
  }

  // Angle guideline circles & 45-deg blueprint diagonals
  ctx.strokeStyle = "rgba(52, 211, 153, 0.3)";
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.arc(1024, 682, 350, 0, Math.PI * 2);
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(1024, 682, 500, 0, Math.PI * 2);
  ctx.stroke();

  // Diagonal blueprint lines
  ctx.beginPath();
  ctx.moveTo(40, 40);
  ctx.lineTo(1325, 1325);
  ctx.moveTo(2008, 40);
  ctx.lineTo(723, 1325);
  ctx.stroke();

  // Technical Labels & Header
  ctx.fillStyle = "#34d399";
  ctx.font = "bold 24px monospace";
  ctx.fillText("SELF-HEALING CUTTING MAT // GRID A1", 70, 85);
  ctx.font = "16px monospace";
  ctx.fillText("SCALE 1:100 — ARCHITECTURAL BENCH v2026", 70, 115);

  // Ruler tick numbers along top & left
  ctx.fillStyle = "rgba(52, 211, 153, 0.8)";
  ctx.font = "14px monospace";
  for (let i = 0; i <= 18; i++) {
    const x = 40 + i * 100;
    ctx.fillText(`${i * 10}cm`, x + 5, 62);
  }

  // Zone Labels for Navigation
  const zones = [
    { title: "[ 01. PORTFOLIO ]", sub: "Featured Works", x: 260, y: 350 },
    { title: "[ 02. LAB ]", sub: "Interactive Workspace", x: 1400, y: 350 },
    { title: "[ 03. PHOTOGRAPHY ]", sub: "Visual Gallery", x: 260, y: 950 },
    { title: "[ 04. EXPERIMENTS ]", sub: "Shaders & Prototypes", x: 1400, y: 950 },
    { title: "[ 05. CONTACT ]", sub: "Get In Touch", x: 1024, y: 1180 }
  ];

  ctx.textAlign = "center";
  zones.forEach(z => {
    // Zone bounding box accent
    ctx.strokeStyle = "rgba(52, 211, 153, 0.4)";
    ctx.lineWidth = 1.5;
    ctx.strokeRect(z.x - 140, z.y - 45, 280, 75);

    ctx.fillStyle = "#a7f3d0";
    ctx.font = "bold 20px monospace";
    ctx.fillText(z.title, z.x, z.y - 10);
    ctx.fillStyle = "#6ee7b7";
    ctx.font = "13px monospace";
    ctx.fillText(z.sub, z.x, z.y + 16);
  });

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

// 3. MacBook Screen Texture
export function createMacbookScreenTexture(): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 1024;
  canvas.height = 640;
  const ctx = canvas.getContext("2d")!;

  // IDE / Wallpaper Background
  ctx.fillStyle = "#0f172a";
  ctx.fillRect(0, 0, 1024, 640);

  // Top MacOS status bar
  ctx.fillStyle = "rgba(30, 41, 59, 0.8)";
  ctx.fillRect(0, 0, 1024, 28);
  ctx.fillStyle = "#94a3b8";
  ctx.font = "12px sans-serif";
  ctx.fillText("  Code  File  Edit  View  Run  Window  Help", 15, 18);
  ctx.fillText("Thu Jul 30  19:55", 880, 18);

  // Code editor layout
  // Sidebar
  ctx.fillStyle = "#1e293b";
  ctx.fillRect(0, 28, 200, 612);

  ctx.fillStyle = "#64748b";
  ctx.font = "bold 11px monospace";
  ctx.fillText("EXPLORER", 15, 50);
  const files = [
    "📁 src",
    "  📁 components",
    "    📄 Workbench.tsx",
    "    📄 Portfolio.tsx",
    "    📄 ShaderEngine.ts",
    "  📁 styles",
    "    📄 main.css",
    "📄 package.json",
    "📄 README.md"
  ];
  ctx.font = "12px monospace";
  files.forEach((f, idx) => {
    ctx.fillStyle = idx === 2 ? "#38bdf8" : "#94a3b8";
    ctx.fillText(f, 15, 75 + idx * 22);
  });

  // Editor Area
  ctx.fillStyle = "#090d16";
  ctx.fillRect(200, 28, 824, 612);

  // Tab bar
  ctx.fillStyle = "#0f172a";
  ctx.fillRect(200, 28, 824, 30);
  ctx.fillStyle = "#1e293b";
  ctx.fillRect(200, 28, 160, 30);
  ctx.fillStyle = "#38bdf8";
  ctx.font = "12px monospace";
  ctx.fillText("Workbench.tsx  ✕", 215, 48);

  // Code snippet lines
  const codeLines = [
    { text: "import { Canvas, Vector3 } from 'three';", color: "#f472b6" },
    { text: "import { ArchitectureStudio } from './core';", color: "#f472b6" },
    { text: "", color: "" },
    { text: "export function PortfolioWorkbench() {", color: "#38bdf8" },
    { text: "  const perspective = '90deg-top-down';", color: "#facc15" },
    { text: "  const aesthetic = ['minimal', 'architectural', 'warm'];", color: "#a7f3d0" },
    { text: "", color: "" },
    { text: "  // Explore featured engineering projects", color: "#64748b" },
    { text: "  return <WorkbenchEngine perspective={perspective} />;", color: "#e2e8f0" },
    { text: "}", color: "#38bdf8" }
  ];

  ctx.font = "13px monospace";
  codeLines.forEach((line, idx) => {
    ctx.fillStyle = "#475569";
    ctx.fillText(`${idx + 1}`.padStart(2, " "), 215, 80 + idx * 22);
    ctx.fillStyle = line.color;
    ctx.fillText(line.text, 245, 80 + idx * 22);
  });

  // Interactive Prompt Banner at bottom
  ctx.fillStyle = "#0284c7";
  ctx.fillRect(200, 580, 824, 60);
  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 16px sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("OPEN PROJECTS SECTION ↗", 612, 616);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

// 3b. MacBook Keyboard Surface Texture (High-Detail Key Layout)
export function createMacbookKeyboardTexture(): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 1024;
  canvas.height = 400;
  const ctx = canvas.getContext("2d")!;

  // 1. Dark Recessed Key Well Surface
  ctx.fillStyle = "#141518";
  ctx.fillRect(0, 0, 1024, 400);

  // Key well inner shadow frame
  ctx.strokeStyle = "#090a0c";
  ctx.lineWidth = 6;
  ctx.strokeRect(3, 3, 1018, 394);

  // Key Rows vertical positions & heights
  const rowY = [16, 64, 126, 188, 250, 312];
  const rowHeights = [38, 54, 54, 54, 54, 60];

  const drawKey = (x: number, y: number, w: number, h: number, label: string, isSpecial = false) => {
    // Keycap Base Shadow
    ctx.fillStyle = "#0c0d0f";
    ctx.beginPath();
    ctx.roundRect(x, y, w, h, 6);
    ctx.fill();

    // Keycap Surface Top Face
    const keyGrad = ctx.createLinearGradient(x, y, x, y + h);
    keyGrad.addColorStop(0, isSpecial ? "#2a2d36" : "#22252c");
    keyGrad.addColorStop(1, isSpecial ? "#1c1e24" : "#17181c");
    ctx.fillStyle = keyGrad;
    ctx.beginPath();
    ctx.roundRect(x + 1, y + 1, w - 2, h - 2, 5);
    ctx.fill();

    // Keycap Soft Backlight / Edge Highlight Ring
    ctx.strokeStyle = "rgba(255, 255, 255, 0.15)";
    ctx.lineWidth = 1;
    ctx.stroke();

    // Key Legend Text
    if (label) {
      ctx.fillStyle = "rgba(241, 245, 249, 0.9)";
      ctx.font = h < 45 ? "bold 12px -apple-system, sans-serif" : "bold 14px -apple-system, sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(label, x + w / 2, y + h / 2);
    }
  };

  // Row 0: Function Keys
  const fnKeys = ["esc", "F1", "F2", "F3", "F4", "F5", "F6", "F7", "F8", "F9", "F10", "F11", "F12", "⌽"];
  const fnW = (1024 - 32 - 13 * 6) / 14;
  fnKeys.forEach((k, i) => {
    drawKey(16 + i * (fnW + 6), rowY[0], fnW, rowHeights[0], k, i === 0 || i === 13);
  });

  // Row 1: Number Row
  const numKeys = ["~", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "-", "=", "delete"];
  const numWidths = [60, 60, 60, 60, 60, 60, 60, 60, 60, 60, 60, 60, 60, 102];
  let curX = 16;
  numKeys.forEach((k, i) => {
    drawKey(curX, rowY[1], numWidths[i], rowHeights[1], k, i === 13);
    curX += numWidths[i] + 6;
  });

  // Row 2: QWERTY Row
  const qKeys = ["tab", "Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P", "[", "]", "\\"];
  const qWidths = [92, 60, 60, 60, 60, 60, 60, 60, 60, 60, 60, 60, 60, 70];
  curX = 16;
  qKeys.forEach((k, i) => {
    drawKey(curX, rowY[2], qWidths[i], rowHeights[2], k, i === 0);
    curX += qWidths[i] + 6;
  });

  // Row 3: ASDF Row
  const aKeys = ["caps lock", "A", "S", "D", "F", "G", "H", "J", "K", "L", ";", "'", "return"];
  const aWidths = [112, 60, 60, 60, 60, 60, 60, 60, 60, 60, 60, 60, 118];
  curX = 16;
  aKeys.forEach((k, i) => {
    drawKey(curX, rowY[3], aWidths[i], rowHeights[3], k, i === 0 || i === 12);
    curX += aWidths[i] + 6;
  });

  // Row 4: ZXCV Row
  const zKeys = ["shift", "Z", "X", "C", "V", "B", "N", "M", ",", ".", "/", "shift"];
  const zWidths = [142, 60, 60, 60, 60, 60, 60, 60, 60, 60, 60, 156];
  curX = 16;
  zKeys.forEach((k, i) => {
    drawKey(curX, rowY[4], zWidths[i], rowHeights[4], k, i === 0 || i === 11);
    curX += zWidths[i] + 6;
  });

  // Row 5: Bottom Modifiers & Spacebar
  const botKeys = [
    { label: "fn", w: 58, special: true },
    { label: "control", w: 60, special: true },
    { label: "option", w: 70, special: true },
    { label: "command", w: 84, special: true },
    { label: "", w: 346, special: false }, // Spacebar
    { label: "command", w: 84, special: true },
    { label: "option", w: 70, special: true },
    { label: "◄", w: 48, special: true },
    { label: "▲▼", w: 48, special: true },
    { label: "►", w: 48, special: true }
  ];
  curX = 16;
  botKeys.forEach((k) => {
    drawKey(curX, rowY[5], k.w, rowHeights[5], k.label, k.special);
    curX += k.w + 6;
  });

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

// 4. Dotted Journal Cover Texture
export function createLeatherJournalTexture(): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 768;
  const ctx = canvas.getContext("2d")!;

  // Dark matte charcoal leather notebook base
  ctx.fillStyle = "#18181b";
  ctx.fillRect(0, 0, 512, 768);

  // Leather grain texture
  const imgData = ctx.getImageData(0, 0, 512, 768);
  const data = imgData.data;
  for (let i = 0; i < data.length; i += 4) {
    const val = (Math.random() - 0.5) * 16;
    data[i] = Math.min(255, Math.max(0, data[i] + val));
    data[i + 1] = Math.min(255, Math.max(0, data[i + 1] + val));
    data[i + 2] = Math.min(255, Math.max(0, data[i + 2] + val));
  }
  ctx.putImageData(imgData, 0, 0);

  // Vertical Elastic Band Strap on right side (Signature Bullet/Dotted Notebook feature)
  ctx.fillStyle = "#09090b";
  ctx.fillRect(410, 0, 36, 768);
  ctx.fillStyle = "#27272a";
  ctx.fillRect(414, 0, 28, 768);

  // Gold foil debossed title
  ctx.fillStyle = "#e5c158";
  ctx.textAlign = "center";
  ctx.font = "bold 26px serif";
  ctx.fillText("Myrielle's Journal", 205, 384);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

// 4b. Dotted Notebook Page Surface Texture (Ivory page with 5mm dot grid matrix)
export function createDottedPageTexture(): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 768;
  const ctx = canvas.getContext("2d")!;

  // Pure white paper background
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, 512, 768);

  // Fine Paper texture noise
  const imgData = ctx.getImageData(0, 0, 512, 768);
  const data = imgData.data;
  for (let i = 0; i < data.length; i += 4) {
    const val = (Math.random() - 0.5) * 8;
    data[i] = Math.min(255, Math.max(0, data[i] + val));
    data[i + 1] = Math.min(255, Math.max(0, data[i + 1] + val));
    data[i + 2] = Math.min(255, Math.max(0, data[i + 2] + val));
  }
  ctx.putImageData(imgData, 0, 0);

  // Fine Dot Grid matrix (5mm spacing equivalent in texture)
  ctx.fillStyle = "#94a3b8"; // Soft slate dot grid
  for (let x = 32; x <= 480; x += 24) {
    for (let y = 32; y <= 736; y += 24) {
      ctx.beginPath();
      ctx.arc(x, y, 1.4, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // Soft red vertical margin line (classic notebook feature)
  ctx.strokeStyle = "rgba(239, 68, 68, 0.3)";
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(76, 0);
  ctx.lineTo(76, 768);
  ctx.stroke();

  // Sketched blueprint / bullet journal header notes
  ctx.fillStyle = "#1e293b";
  ctx.font = "bold 20px 'Courier New', monospace";
  ctx.fillText("Myrielle's Journal", 96, 68);

  ctx.font = "13px monospace";
  ctx.fillStyle = "#475569";
  ctx.fillText("• 5mm Dot Grid System", 96, 105);
  ctx.fillText("• Architectural & Dev Logbook", 96, 130);

  // Sketched geometric layout diagrams on dot grid
  ctx.strokeStyle = "#3b82f6";
  ctx.lineWidth = 2;
  ctx.strokeRect(96, 180, 160, 120);

  ctx.strokeStyle = "#f59e0b";
  ctx.beginPath();
  ctx.arc(380, 240, 45, 0, Math.PI * 2);
  ctx.stroke();

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

// 5. Smartphone Screen Texture (Authentic High-Visibility iPhone iOS Lock Screen)
export function createSmartphoneTexture(): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 1024;
  const ctx = canvas.getContext("2d")!;

  // 1. Rich Deep OLED iOS Lockscreen Wallpaper (Vibrant High-Contrast Gradient Base)
  const bgGrad = ctx.createLinearGradient(0, 0, 512, 1024);
  bgGrad.addColorStop(0, "#0c0a29");
  bgGrad.addColorStop(0.35, "#25124e");
  bgGrad.addColorStop(0.7, "#3b074a");
  bgGrad.addColorStop(1, "#070c26");
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, 512, 1024);

  // Radiant Glowing Color Orbs (Vibrant iOS Fluid Wallpaper)
  const drawOrb = (x: number, y: number, r: number, color1: string, color2: string) => {
    const orb = ctx.createRadialGradient(x, y, 0, x, y, r);
    orb.addColorStop(0, color1);
    orb.addColorStop(1, color2);
    ctx.fillStyle = orb;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  };

  drawOrb(130, 220, 250, "rgba(99, 102, 241, 0.85)", "rgba(99, 102, 241, 0)"); // Electric Indigo top-left
  drawOrb(400, 360, 240, "rgba(236, 72, 153, 0.80)", "rgba(236, 72, 153, 0)"); // Vibrant Pink mid-right
  drawOrb(180, 780, 280, "rgba(14, 165, 233, 0.70)", "rgba(14, 165, 233, 0)"); // Cyan bottom
  drawOrb(360, 160, 200, "rgba(168, 85, 247, 0.80)", "rgba(168, 85, 247, 0)"); // Purple top-right

  // 2. Dynamic Island Notch at top center
  ctx.fillStyle = "#000000";
  ctx.beginPath();
  ctx.roundRect(176, 18, 160, 36, 18);
  ctx.fill();

  ctx.strokeStyle = "rgba(255, 255, 255, 0.25)";
  ctx.lineWidth = 1.5;
  ctx.stroke();

  // Camera lens & sensor inside Dynamic Island
  ctx.fillStyle = "#0f172a";
  ctx.beginPath();
  ctx.arc(305, 36, 7, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#3b82f6";
  ctx.globalAlpha = 0.8;
  ctx.beginPath();
  ctx.arc(305, 36, 3, 0, Math.PI * 2);
  ctx.fill();
  ctx.globalAlpha = 1.0;

  // Live Activity Indicator (Vibrant Green Dot)
  ctx.fillStyle = "#22c55e";
  ctx.beginPath();
  ctx.arc(198, 36, 4, 0, Math.PI * 2);
  ctx.fill();

  // 3. Status Bar Top (Time & Battery)
  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 20px -apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif";
  ctx.textAlign = "left";
  ctx.fillText("9:41", 36, 43);

  // Status Icons Right: Signal, Wi-Fi, Battery
  ctx.textAlign = "right";
  ctx.font = "bold 16px sans-serif";
  ctx.fillText("5G  📶", 405, 42);

  ctx.strokeStyle = "#ffffff";
  ctx.lineWidth = 2;
  ctx.strokeRect(424, 26, 36, 20);
  ctx.fillStyle = "#22c55e"; // 100% green charge
  ctx.fillRect(427, 29, 30, 14);
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(460, 32, 3, 8);

  // 4. Lock Screen Padlock Icon
  ctx.fillStyle = "#fbbf24"; // Warm gold padlock
  ctx.font = "bold 22px sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("🔒", 256, 88);

  // 5. Lock Screen Date & Giant iOS Typography Clock
  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 24px -apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif";
  ctx.fillText("Thursday, July 30", 256, 138);

  // Big Bold Clock Text with crisp dark shadow for 3D clarity
  ctx.shadowColor = "rgba(0, 0, 0, 0.8)";
  ctx.shadowBlur = 20;
  ctx.shadowOffsetY = 5;

  ctx.fillStyle = "#ffffff";
  ctx.font = "800 128px -apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif";
  ctx.fillText("9:41", 256, 256);

  ctx.shadowColor = "transparent";
  ctx.shadowBlur = 0;
  ctx.shadowOffsetY = 0;

  // 6. Lock Screen Inline Widgets
  const widgets = [
    { text: "☀️ 74°", sub: "Partly Cloudy" },
    { text: "⚡ 100%", sub: "Charged" },
    { text: "📅 Lab", sub: "Demo Ready" }
  ];

  ctx.fillStyle = "rgba(0, 0, 0, 0.4)";
  widgets.forEach((w, i) => {
    const wx = 75 + i * 142;
    ctx.beginPath();
    ctx.roundRect(wx, 282, 118, 50, 16);
    ctx.fill();
    ctx.strokeStyle = "rgba(255, 255, 255, 0.3)";
    ctx.lineWidth = 1.5;
    ctx.stroke();

    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 15px sans-serif";
    ctx.fillText(w.text, wx + 59, 306);
    ctx.fillStyle = "rgba(255, 255, 255, 0.85)";
    ctx.font = "bold 12px sans-serif";
    ctx.fillText(w.sub, wx + 59, 323);
  });

  // 7. High-Contrast Glassmorphic Lockscreen Notifications Stack
  const notifications = [
    {
      app: "GitHub",
      title: "Myrielle Jerusalem",
      sub: "@myrielle • 42 Repositories Starred",
      time: "now",
      iconBg: "#1f2937",
      iconText: "GH"
    },
    {
      app: "LinkedIn",
      title: "Professional Profile",
      sub: "Full-Stack Engineer & Architect",
      time: "2m ago",
      iconBg: "#0a66c2",
      iconText: "in"
    },
    {
      app: "Music",
      title: "Streetcar — Daniel Caesar",
      sub: "Playing on AirPods Pro • 2:45 / 4:12",
      time: "now",
      iconBg: "#ec4899",
      iconText: "🎵"
    }
  ];

  notifications.forEach((n, idx) => {
    const y = 360 + idx * 132;

    // Translucent dark glass card fill
    ctx.fillStyle = "rgba(15, 17, 26, 0.88)";
    ctx.beginPath();
    ctx.roundRect(28, y, 456, 118, 24);
    ctx.fill();

    // Card Glass Border Accent
    ctx.strokeStyle = "rgba(255, 255, 255, 0.28)";
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // App Icon Box
    ctx.fillStyle = n.iconBg;
    ctx.beginPath();
    ctx.roundRect(46, y + 20, 52, 52, 14);
    ctx.fill();

    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 18px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(n.iconText, 72, y + 52);

    // App Name Header
    ctx.fillStyle = "rgba(255, 255, 255, 0.70)";
    ctx.textAlign = "left";
    ctx.font = "bold 14px -apple-system, BlinkMacSystemFont, sans-serif";
    ctx.fillText(n.app.toUpperCase(), 116, y + 36);

    ctx.textAlign = "right";
    ctx.fillText(n.time, 464, y + 36);

    // Notification Title
    ctx.fillStyle = "#ffffff";
    ctx.textAlign = "left";
    ctx.font = "bold 18px -apple-system, BlinkMacSystemFont, sans-serif";
    ctx.fillText(n.title, 116, y + 62);

    // Subtitle
    ctx.fillStyle = "rgba(255, 255, 255, 0.88)";
    ctx.font = "14px -apple-system, BlinkMacSystemFont, sans-serif";
    ctx.fillText(n.sub, 116, y + 86);
  });

  // 8. Bottom Lockscreen Quick Action Controls (Flashlight & Camera)
  // Flashlight Circular Button
  ctx.fillStyle = "rgba(255, 255, 255, 0.25)";
  ctx.beginPath();
  ctx.arc(68, 910, 32, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = "rgba(255, 255, 255, 0.4)";
  ctx.lineWidth = 2;
  ctx.stroke();

  ctx.fillStyle = "#ffffff";
  ctx.font = "22px sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("🔦", 68, 918);

  // Camera Circular Button
  ctx.fillStyle = "rgba(255, 255, 255, 0.25)";
  ctx.beginPath();
  ctx.arc(444, 910, 32, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = "rgba(255, 255, 255, 0.4)";
  ctx.lineWidth = 2;
  ctx.stroke();

  ctx.fillStyle = "#ffffff";
  ctx.font = "22px sans-serif";
  ctx.fillText("📷", 444, 918);

  // 9. "Swipe Up to Unlock" Hint & Home Bar
  ctx.fillStyle = "rgba(255, 255, 255, 0.85)";
  ctx.font = "bold 15px -apple-system, BlinkMacSystemFont, sans-serif";
  ctx.fillText("Swipe up to unlock", 256, 955);

  ctx.fillStyle = "#ffffff";
  ctx.beginPath();
  ctx.roundRect(176, 978, 160, 6, 3);
  ctx.fill();

  // 10. Polished Cover Glass Specular Gloss Sheen
  const glossGrad = ctx.createLinearGradient(0, 0, 512, 512);
  glossGrad.addColorStop(0, "rgba(255, 255, 255, 0.18)");
  glossGrad.addColorStop(0.4, "rgba(255, 255, 255, 0.04)");
  glossGrad.addColorStop(1, "rgba(255, 255, 255, 0)");
  ctx.fillStyle = glossGrad;
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(512, 0);
  ctx.lineTo(512, 360);
  ctx.lineTo(0, 160);
  ctx.closePath();
  ctx.fill();

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}


// 6. Sticky Note Texture with To-Do List
export function createStickyNoteTexture(text?: string, color: string = "#fef08a"): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext("2d")!;

  // Sticky note yellow base
  ctx.fillStyle = color;
  ctx.fillRect(0, 0, 512, 512);

  // Top adhesive shadow strip
  ctx.fillStyle = "rgba(202, 138, 4, 0.25)";
  ctx.fillRect(0, 0, 512, 45);

  // Ruled notebook lines
  ctx.strokeStyle = "rgba(217, 119, 6, 0.18)";
  ctx.lineWidth = 2;
  for (let y = 110; y < 500; y += 60) {
    ctx.beginPath();
    ctx.moveTo(35, y);
    ctx.lineTo(477, y);
    ctx.stroke();
  }

  // Header Title
  ctx.fillStyle = "#1e293b";
  ctx.font = "bold 38px 'Courier New', monospace, cursive";
  ctx.textAlign = "left";
  ctx.fillText("📌 TO DO", 45, 85);

  // Red accent underline below title
  ctx.strokeStyle = "#ef4444";
  ctx.lineWidth = 3.5;
  ctx.beginPath();
  ctx.moveTo(45, 98);
  ctx.lineTo(200, 98);
  ctx.stroke();

  // Default To-Do list items (3 items)
  const defaultTasks = [
    "☑ sleep",
    "☑ matcha",
    "☐ Discover Secrets"
  ];

  const lines = text ? text.split("\n") : defaultTasks;
  ctx.font = "bold 26px 'Courier New', monospace, cursive";

  lines.forEach((line, idx) => {
    const y = 155 + idx * 58;
    if (line.startsWith("☑") || line.startsWith("[x]")) {
      ctx.fillStyle = "#15803d"; // Green for completed
      ctx.fillText(line, 45, y);

      // Strikethrough line
      ctx.strokeStyle = "rgba(21, 128, 61, 0.55)";
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(45, y - 8);
      ctx.lineTo(45 + ctx.measureText(line).width, y - 8);
      ctx.stroke();
    } else {
      ctx.fillStyle = "#334155";
      ctx.fillText(line, 45, y);
    }
  });

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

// 7. Matcha Latte Surface Texture with Artisanal Foam & Leaf Latte Art
export function createMatchaLiquidTexture(): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext("2d")!;

  const cx = 256;
  const cy = 256;
  const radius = 250;

  // 1. Rich Deep Matcha Base Radial Gradient
  const baseGrad = ctx.createRadialGradient(cx, cy, 10, cx, cy, radius);
  baseGrad.addColorStop(0, "#4a7c43"); // Vibrant rich matcha green center
  baseGrad.addColorStop(0.5, "#3b6935"); // Deep earthy matcha
  baseGrad.addColorStop(0.85, "#2d5228"); // Shaded matcha
  baseGrad.addColorStop(1, "#1f3a1c"); // Inner ceramic edge shadow

  ctx.fillStyle = baseGrad;
  ctx.beginPath();
  ctx.arc(cx, cy, radius, 0, Math.PI * 2);
  ctx.fill();

  // 2. Micro Foam Ring around rim (Matcha Latte Froth)
  ctx.save();
  ctx.globalAlpha = 0.45;
  for (let i = 0; i < 180; i++) {
    const angle = (i / 180) * Math.PI * 2;
    const r = radius - 12 - Math.random() * 25;
    const bx = cx + Math.cos(angle) * r;
    const by = cy + Math.sin(angle) * r;
    const bSize = 3 + Math.random() * 8;

    ctx.fillStyle = Math.random() > 0.4 ? "#a3d98d" : "#ccebc0";
    ctx.beginPath();
    ctx.arc(bx, by, bSize, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();

  // 3. Artisanal Foam Swirls & Heart / Rosetta Leaf Latte Art
  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(-Math.PI / 6); // Slightly angled latte art

  // Soft Creamy Foam Heart / Leaf Petals
  const foamGrad = ctx.createRadialGradient(0, -10, 5, 0, 0, 110);
  foamGrad.addColorStop(0, "rgba(244, 247, 230, 0.95)"); // Creamy oat milk foam
  foamGrad.addColorStop(0.6, "rgba(215, 235, 195, 0.8)"); // Light matcha green foam transition
  foamGrad.addColorStop(1, "rgba(74, 124, 67, 0)");

  ctx.fillStyle = foamGrad;

  // Rosette / Heart Petal 1 (Top Lobe)
  ctx.beginPath();
  ctx.moveTo(0, -80);
  ctx.bezierCurveTo(45, -60, 60, -10, 0, 30);
  ctx.bezierCurveTo(-60, -10, -45, -60, 0, -80);
  ctx.fill();

  // Rosette Petal 2 (Middle Lobe)
  ctx.beginPath();
  ctx.moveTo(0, -50);
  ctx.bezierCurveTo(35, -35, 45, 5, 0, 38);
  ctx.bezierCurveTo(-45, 5, -35, -35, 0, -50);
  ctx.fill();

  // Rosette Petal 3 (Inner Heart Lobe)
  ctx.beginPath();
  ctx.moveTo(0, -25);
  ctx.bezierCurveTo(22, -15, 28, 10, 0, 35);
  ctx.bezierCurveTo(-28, 10, -22, -15, 0, -25);
  ctx.fill();

  // Stem slash line through heart (barista drag technique)
  ctx.strokeStyle = "#406e39";
  ctx.lineWidth = 4;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(0, -90);
  ctx.lineTo(0, 55);
  ctx.stroke();

  ctx.restore();

  // 4. Subtle Glossy Specular Light Reflection
  ctx.save();
  ctx.globalAlpha = 0.18;
  const glossGrad = ctx.createLinearGradient(cx - 100, cy - 180, cx + 100, cy - 80);
  glossGrad.addColorStop(0, "#ffffff");
  glossGrad.addColorStop(1, "rgba(255, 255, 255, 0)");

  ctx.fillStyle = glossGrad;
  ctx.beginPath();
  ctx.ellipse(cx - 50, cy - 80, 110, 45, -Math.PI / 4, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

// 8. Warm Afternoon Window Shadow & Sunlight Projection Texture (Window Frame & Leaf Dapples)
export function createWindowShadowTexture(): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 1024;
  canvas.height = 1024;
  const ctx = canvas.getContext("2d")!;

  ctx.clearRect(0, 0, 1024, 1024);

  // Soft afternoon golden sun beam shape gradient
  const sunGrad = ctx.createLinearGradient(150, 50, 850, 950);
  sunGrad.addColorStop(0, "rgba(255, 215, 140, 0.85)");
  sunGrad.addColorStop(0.3, "rgba(255, 185, 95, 0.70)");
  sunGrad.addColorStop(0.7, "rgba(240, 145, 50, 0.40)");
  sunGrad.addColorStop(1, "rgba(200, 100, 20, 0.05)");

  ctx.save();
  // Diagonal tilt matching afternoon window angle across the table
  ctx.translate(512, 512);
  ctx.rotate(-Math.PI / 8);
  ctx.translate(-512, -512);

  // Window Panes Light Rectangles (3 columns x 2 rows of glass panes)
  const paneW = 200;
  const paneH = 340;
  const frameBar = 32;
  const startX = 140;
  const startY = 120;

  for (let r = 0; r < 2; r++) {
    for (let c = 0; c < 3; c++) {
      const px = startX + c * (paneW + frameBar);
      const py = startY + r * (paneH + frameBar);

      // Window Pane Sunlight Glow
      ctx.fillStyle = sunGrad;
      ctx.beginPath();
      ctx.roundRect(px, py, paneW, paneH, 16);
      ctx.fill();

      // Soft sun beam edge bloom
      ctx.shadowColor = "rgba(255, 200, 110, 0.5)";
      ctx.shadowBlur = 20;
      ctx.strokeRect(px, py, paneW, paneH);
      ctx.shadowBlur = 0;

      // Organic Tree Leaf Silhouettes outside window (Komorebi shadow effect)
      ctx.fillStyle = "rgba(25, 12, 6, 0.38)";
      for (let i = 0; i < 7; i++) {
        const lx = px + 25 + (i * 37) % paneW;
        const ly = py + 30 + (i * 53) % paneH;
        const rx = 16 + (i % 3) * 6;
        const ry = 9 + (i % 4) * 4;
        const angle = (i * 35 * Math.PI) / 180;

        ctx.beginPath();
        ctx.ellipse(lx, ly, rx, ry, angle, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }

  // Venetian Shutter / Window Blind subtle slat shadows
  ctx.fillStyle = "rgba(20, 10, 5, 0.14)";
  for (let y = 80; y < 950; y += 42) {
    ctx.fillRect(80, y, 864, 10);
  }

  ctx.restore();

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

// 9. Cozy Cork Texture (for mug coaster)
export function createCorkTexture(): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext("2d")!;

  ctx.fillStyle = "#a87349";
  ctx.fillRect(0, 0, 512, 512);

  // Organic cork flecks
  const imgData = ctx.getImageData(0, 0, 512, 512);
  const data = imgData.data;
  for (let i = 0; i < data.length; i += 4) {
    const noise = (Math.random() - 0.5) * 45;
    data[i] = Math.min(255, Math.max(0, data[i] + noise));
    data[i + 1] = Math.min(255, Math.max(0, data[i + 1] + noise * 0.75));
    data[i + 2] = Math.min(255, Math.max(0, data[i + 2] + noise * 0.5));
  }
  ctx.putImageData(imgData, 0, 0);

  // Extra cork pore dots
  ctx.fillStyle = "rgba(75, 45, 25, 0.35)";
  for (let i = 0; i < 400; i++) {
    const rx = Math.random() * 512;
    const ry = Math.random() * 512;
    const rw = 1 + Math.random() * 4;
    const rh = 1 + Math.random() * 3;
    ctx.fillRect(rx, ry, rw, rh);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

// 11. Picture Frame Photo Texture (cozy polaroid-style photo)
export function createPictureFramePhotoTexture(): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext("2d")!;

  // Warm sunset sky gradient background
  const skyGrad = ctx.createLinearGradient(0, 0, 0, 512);
  skyGrad.addColorStop(0, "#1a0833");
  skyGrad.addColorStop(0.3, "#6b21a8");
  skyGrad.addColorStop(0.55, "#ea580c");
  skyGrad.addColorStop(0.75, "#fb923c");
  skyGrad.addColorStop(1, "#fde68a");
  ctx.fillStyle = skyGrad;
  ctx.fillRect(0, 0, 512, 512);

  // Sun glow orb
  const sunGrad = ctx.createRadialGradient(256, 295, 0, 256, 295, 90);
  sunGrad.addColorStop(0, "rgba(255, 244, 180, 1.0)");
  sunGrad.addColorStop(0.4, "rgba(251, 191, 36, 0.85)");
  sunGrad.addColorStop(0.8, "rgba(249, 115, 22, 0.4)");
  sunGrad.addColorStop(1, "rgba(249, 115, 22, 0)");
  ctx.fillStyle = sunGrad;
  ctx.beginPath();
  ctx.arc(256, 295, 90, 0, Math.PI * 2);
  ctx.fill();

  // Golden sun disk
  ctx.fillStyle = "#fef3c7";
  ctx.beginPath();
  ctx.arc(256, 295, 36, 0, Math.PI * 2);
  ctx.fill();

  // Subtle sun rays
  ctx.save();
  ctx.translate(256, 295);
  ctx.strokeStyle = "rgba(254, 243, 199, 0.35)";
  ctx.lineWidth = 3;
  for (let i = 0; i < 12; i++) {
    ctx.rotate(Math.PI / 6);
    ctx.beginPath();
    ctx.moveTo(42, 0);
    ctx.lineTo(75, 0);
    ctx.stroke();
  }
  ctx.restore();

  // Cloud wisps in upper sky
  ctx.save();
  ctx.globalAlpha = 0.28;
  ctx.fillStyle = "#fde68a";
  [
    [80, 100, 120, 24],
    [200, 80, 95, 20],
    [340, 115, 105, 22],
    [430, 90, 80, 18]
  ].forEach(([cx, cy, rx, ry]) => {
    ctx.beginPath();
    ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
    ctx.fill();
  });
  ctx.restore();

  // Distant city / hill silhouette
  ctx.fillStyle = "#1c0b2a";
  ctx.beginPath();
  ctx.moveTo(0, 430);
  // rolling hills
  ctx.bezierCurveTo(60, 390, 110, 370, 170, 385);
  ctx.bezierCurveTo(210, 395, 240, 380, 270, 378);
  ctx.bezierCurveTo(305, 376, 330, 390, 370, 382);
  ctx.bezierCurveTo(410, 374, 440, 388, 512, 395);
  ctx.lineTo(512, 512);
  ctx.lineTo(0, 512);
  ctx.closePath();
  ctx.fill();

  // Tiny building silhouettes on the hill
  ctx.fillStyle = "#120720";
  const buildings = [
    [90, 385, 18, 30],
    [115, 375, 12, 40],
    [135, 382, 22, 28],
    [300, 368, 16, 36],
    [322, 374, 10, 30],
    [400, 376, 20, 32]
  ];
  buildings.forEach(([bx, by, bw, bh]) => {
    ctx.fillRect(bx, by - bh, bw, bh);
    // window glints
    ctx.fillStyle = "rgba(253, 230, 138, 0.7)";
    ctx.fillRect(bx + 4, by - bh + 8, 4, 4);
    ctx.fillRect(bx + 10, by - bh + 8, 4, 4);
    ctx.fillStyle = "#120720";
  });

  // Reflective water in foreground
  const waterGrad = ctx.createLinearGradient(0, 430, 0, 512);
  waterGrad.addColorStop(0, "rgba(180, 80, 20, 0.55)");
  waterGrad.addColorStop(0.5, "rgba(251, 146, 60, 0.35)");
  waterGrad.addColorStop(1, "rgba(30, 8, 50, 0.9)");
  ctx.fillStyle = waterGrad;
  ctx.fillRect(0, 430, 512, 82);

  // Sun reflection on water
  ctx.save();
  ctx.globalAlpha = 0.55;
  for (let i = 0; i < 8; i++) {
    const wy = 440 + i * 9;
    const ww = 40 - i * 4;
    ctx.fillStyle = i < 3 ? "#fef3c7" : "#fb923c";
    ctx.fillRect(256 - ww / 2, wy, ww, 4);
  }
  ctx.restore();

  // Subtle vignette
  const vigGrad = ctx.createRadialGradient(256, 256, 140, 256, 256, 370);
  vigGrad.addColorStop(0, "rgba(0, 0, 0, 0)");
  vigGrad.addColorStop(1, "rgba(0, 0, 0, 0.52)");
  ctx.fillStyle = vigGrad;
  ctx.fillRect(0, 0, 512, 512);

  // Film grain noise
  const imgData = ctx.getImageData(0, 0, 512, 512);
  const data = imgData.data;
  for (let i = 0; i < data.length; i += 4) {
    const noise = (Math.random() - 0.5) * 14;
    data[i] = Math.min(255, Math.max(0, data[i] + noise));
    data[i + 1] = Math.min(255, Math.max(0, data[i + 1] + noise));
    data[i + 2] = Math.min(255, Math.max(0, data[i + 2] + noise));
  }
  ctx.putImageData(imgData, 0, 0);

  // Overlay caption at bottom
  ctx.fillStyle = "rgba(0,0,0,0.32)";
  ctx.fillRect(0, 460, 512, 52);
  ctx.fillStyle = "#fde68a";
  ctx.font = "italic bold 22px Georgia, serif";
  ctx.textAlign = "center";
  ctx.fillText("myrielle ✦ golden hour", 256, 492);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

// 10. Cozy Warm Felt Desk Pad Texture (layered under cutting mat)
export function createFeltPadTexture(): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext("2d")!;

  // Deep matte red felt base
  ctx.fillStyle = "#5c1010";
  ctx.fillRect(0, 0, 512, 512);

  // Soft wool fiber noise
  const imgData = ctx.getImageData(0, 0, 512, 512);
  const data = imgData.data;
  for (let i = 0; i < data.length; i += 4) {
    const val = (Math.random() - 0.5) * 22;
    data[i] = Math.min(255, Math.max(0, data[i] + val));
    data[i + 1] = Math.min(255, Math.max(0, data[i + 1] + val * 0.4));
    data[i + 2] = Math.min(255, Math.max(0, data[i + 2] + val * 0.4));
  }
  ctx.putImageData(imgData, 0, 0);

  // Warm perimeter saddle-stitch line
  ctx.strokeStyle = "rgba(220, 80, 80, 0.45)";
  ctx.lineWidth = 3;
  ctx.setLineDash([10, 8]);
  ctx.strokeRect(16, 16, 480, 480);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

// 12. Photobooth Photostrip Texture 1 (Golden Hour / Sunset Aesthetic)
export function createPhotostripTexture1(): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 256;
  canvas.height = 1024;
  const ctx = canvas.getContext("2d")!;

  // Warm glossy photo paper base
  ctx.fillStyle = "#faf8f5";
  ctx.fillRect(0, 0, 256, 1024);

  // Outer paper border stroke
  ctx.strokeStyle = "#e2e0d8";
  ctx.lineWidth = 2;
  ctx.strokeRect(2, 2, 252, 1020);

  // 4 Photo frames
  const frameX = 14;
  const frameW = 228;
  const frameH = 205;
  const startY = 16;
  const gap = 16;

  // --- Photo 1: Golden Hour Sunset Peace Signs ---
  const y1 = startY;
  ctx.save();
  ctx.beginPath();
  ctx.roundRect(frameX, y1, frameW, frameH, 8);
  ctx.clip();

  const g1 = ctx.createLinearGradient(frameX, y1, frameX, y1 + frameH);
  g1.addColorStop(0, "#311042");
  g1.addColorStop(0.4, "#9333ea");
  g1.addColorStop(0.7, "#f97316");
  g1.addColorStop(1, "#fef08a");
  ctx.fillStyle = g1;
  ctx.fillRect(frameX, y1, frameW, frameH);

  // Sun orb
  ctx.fillStyle = "#ffffff";
  ctx.beginPath();
  ctx.arc(frameX + 114, y1 + 130, 28, 0, Math.PI * 2);
  ctx.fill();

  // Silhouettes of 2 friends holding up peace signs & half heart
  ctx.fillStyle = "#1e0b2e";
  // Person 1 (left)
  ctx.beginPath();
  ctx.arc(frameX + 75, y1 + 135, 22, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillRect(frameX + 50, y1 + 155, 50, 60);

  ctx.lineWidth = 6;
  ctx.strokeStyle = "#1e0b2e";
  ctx.beginPath();
  ctx.moveTo(frameX + 60, y1 + 160);
  ctx.lineTo(frameX + 35, y1 + 120);
  ctx.stroke();

  // Person 2 (right)
  ctx.beginPath();
  ctx.arc(frameX + 155, y1 + 130, 20, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillRect(frameX + 130, y1 + 150, 50, 65);

  ctx.beginPath();
  ctx.moveTo(frameX + 145, y1 + 155);
  ctx.lineTo(frameX + 185, y1 + 125);
  ctx.stroke();

  // Star sparkles
  ctx.fillStyle = "#ffffff";
  ctx.font = "14px sans-serif";
  ctx.fillText("✦", frameX + 30, y1 + 40);
  ctx.fillText("✧", frameX + 185, y1 + 50);
  ctx.restore();

  // --- Photo 2: Cozy Studio Smile with Heart Glasses ---
  const y2 = y1 + frameH + gap;
  ctx.save();
  ctx.beginPath();
  ctx.roundRect(frameX, y2, frameW, frameH, 8);
  ctx.clip();

  const g2 = ctx.createLinearGradient(frameX, y2, frameX + frameW, y2 + frameH);
  g2.addColorStop(0, "#431407");
  g2.addColorStop(0.5, "#9a3412");
  g2.addColorStop(1, "#ea580c");
  ctx.fillStyle = g2;
  ctx.fillRect(frameX, y2, frameW, frameH);

  const spot2 = ctx.createRadialGradient(frameX + 114, y2 + 90, 10, frameX + 114, y2 + 90, 100);
  spot2.addColorStop(0, "rgba(254, 215, 170, 0.9)");
  spot2.addColorStop(1, "rgba(154, 52, 18, 0)");
  ctx.fillStyle = spot2;
  ctx.fillRect(frameX, y2, frameW, frameH);

  ctx.fillStyle = "#1c0a05";
  ctx.beginPath();
  ctx.arc(frameX + 114, y2 + 95, 34, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillRect(frameX + 70, y2 + 125, 88, 85);

  ctx.strokeStyle = "#fef08a";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(frameX + 102, y2 + 92, 9, 0, Math.PI * 2);
  ctx.arc(frameX + 126, y2 + 92, 9, 0, Math.PI * 2);
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(frameX + 114, y2 + 104, 10, 0, Math.PI);
  ctx.stroke();

  ctx.fillStyle = "rgba(244, 63, 94, 0.6)";
  ctx.beginPath();
  ctx.arc(frameX + 90, y2 + 102, 6, 0, Math.PI * 2);
  ctx.arc(frameX + 138, y2 + 102, 6, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // --- Photo 3: Matcha & Coffee Toast ---
  const y3 = y2 + frameH + gap;
  ctx.save();
  ctx.beginPath();
  ctx.roundRect(frameX, y3, frameW, frameH, 8);
  ctx.clip();

  const g3 = ctx.createLinearGradient(frameX, y3, frameX, y3 + frameH);
  g3.addColorStop(0, "#14532d");
  g3.addColorStop(0.6, "#166534");
  g3.addColorStop(1, "#15803d");
  ctx.fillStyle = g3;
  ctx.fillRect(frameX, y3, frameW, frameH);

  ctx.fillStyle = "#86efac";
  ctx.beginPath();
  ctx.roundRect(frameX + 45, y3 + 80, 55, 70, 8);
  ctx.fill();

  ctx.fillStyle = "#fde68a";
  ctx.beginPath();
  ctx.roundRect(frameX + 125, y3 + 70, 55, 70, 8);
  ctx.fill();

  ctx.strokeStyle = "rgba(255, 255, 255, 0.7)";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(frameX + 70, y3 + 70);
  ctx.quadraticCurveTo(frameX + 60, y3 + 50, frameX + 75, y3 + 35);
  ctx.moveTo(frameX + 150, y3 + 60);
  ctx.quadraticCurveTo(frameX + 160, y3 + 40, frameX + 145, y3 + 25);
  ctx.stroke();

  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 16px sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("CHEERS! ☕🍵", frameX + 114, y3 + 185);
  ctx.restore();

  // --- Photo 4: Goofy Photobooth Props Pose ---
  const y4 = y3 + frameH + gap;
  ctx.save();
  ctx.beginPath();
  ctx.roundRect(frameX, y4, frameW, frameH, 8);
  ctx.clip();

  const g4 = ctx.createLinearGradient(frameX, y4, frameX + frameW, y4 + frameH);
  g4.addColorStop(0, "#0284c7");
  g4.addColorStop(0.5, "#38bdf8");
  g4.addColorStop(1, "#bae6fd");
  ctx.fillStyle = g4;
  ctx.fillRect(frameX, y4, frameW, frameH);

  const confettiColors = ["#f43f5e", "#fbbf24", "#34d399", "#a855f7", "#ffffff"];
  for (let i = 0; i < 24; i++) {
    ctx.fillStyle = confettiColors[i % confettiColors.length];
    const cx = frameX + 15 + (i * 37) % (frameW - 30);
    const cy = y4 + 15 + (i * 29) % (frameH - 30);
    ctx.fillRect(cx, cy, 6, 6);
  }

  ctx.fillStyle = "#0c4a6e";
  ctx.beginPath();
  ctx.arc(frameX + 85, y4 + 105, 30, 0, Math.PI * 2);
  ctx.arc(frameX + 145, y4 + 110, 28, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillRect(frameX + 45, y4 + 130, 140, 80);

  ctx.beginPath();
  ctx.moveTo(frameX + 65, y4 + 85);
  ctx.lineTo(frameX + 75, y4 + 65);
  ctx.lineTo(frameX + 85, y4 + 85);
  ctx.moveTo(frameX + 90, y4 + 85);
  ctx.lineTo(frameX + 100, y4 + 65);
  ctx.lineTo(frameX + 110, y4 + 85);
  ctx.fill();

  ctx.fillStyle = "#fbbf24";
  ctx.beginPath();
  ctx.moveTo(frameX + 130, y4 + 85);
  ctx.lineTo(frameX + 145, y4 + 48);
  ctx.lineTo(frameX + 160, y4 + 85);
  ctx.closePath();
  ctx.fill();
  ctx.restore();

  // --- Bottom Photobooth Footer Strip ---
  const footerY = y4 + frameH + 12;
  ctx.fillStyle = "#1e293b";
  ctx.font = "bold 16px 'Courier New', monospace";
  ctx.textAlign = "center";
  ctx.fillText("✦ PHOTOBOOTH ✦", 128, footerY + 20);

  ctx.font = "12px 'Courier New', monospace";
  ctx.fillStyle = "#64748b";
  ctx.fillText("2026.07.30 • LAB STUDIO", 128, footerY + 40);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

// 13. Photobooth Photostrip Texture 2 (Vintage Monochrome Aesthetic)
export function createPhotostripTexture2(): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 256;
  canvas.height = 1024;
  const ctx = canvas.getContext("2d")!;

  ctx.fillStyle = "#f3f0e6";
  ctx.fillRect(0, 0, 256, 1024);

  ctx.strokeStyle = "#d6d0be";
  ctx.lineWidth = 2;
  ctx.strokeRect(2, 2, 252, 1020);

  const frameX = 14;
  const frameW = 228;
  const frameH = 205;
  const startY = 16;
  const gap = 16;

  // --- Photo 1: B&W Side Profile ---
  const y1 = startY;
  ctx.save();
  ctx.beginPath();
  ctx.roundRect(frameX, y1, frameW, frameH, 8);
  ctx.clip();

  ctx.fillStyle = "#18181b";
  ctx.fillRect(frameX, y1, frameW, frameH);

  const spot1 = ctx.createRadialGradient(frameX + 114, y1 + 90, 5, frameX + 114, y1 + 90, 110);
  spot1.addColorStop(0, "#f4f4f5");
  spot1.addColorStop(0.7, "#71717a");
  spot1.addColorStop(1, "#18181b");
  ctx.fillStyle = spot1;
  ctx.fillRect(frameX, y1, frameW, frameH);

  ctx.fillStyle = "#09090b";
  ctx.beginPath();
  ctx.arc(frameX + 114, y1 + 90, 32, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillRect(frameX + 70, y1 + 118, 88, 90);

  ctx.fillStyle = "#ffffff";
  ctx.fillRect(frameX + 96, y1 + 84, 36, 10);
  ctx.restore();

  // --- Photo 2: B&W Big Smile ---
  const y2 = y1 + frameH + gap;
  ctx.save();
  ctx.beginPath();
  ctx.roundRect(frameX, y2, frameW, frameH, 8);
  ctx.clip();

  ctx.fillStyle = "#27272a";
  ctx.fillRect(frameX, y2, frameW, frameH);

  const spot2 = ctx.createRadialGradient(frameX + 114, y2 + 100, 10, frameX + 114, y2 + 100, 95);
  spot2.addColorStop(0, "#e4e4e7");
  spot2.addColorStop(1, "#18181b");
  ctx.fillStyle = spot2;
  ctx.fillRect(frameX, y2, frameW, frameH);

  ctx.fillStyle = "#09090b";
  ctx.beginPath();
  ctx.arc(frameX + 80, y2 + 100, 28, 0, Math.PI * 2);
  ctx.arc(frameX + 148, y2 + 95, 26, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillRect(frameX + 45, y2 + 124, 138, 85);

  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 18px sans-serif";
  ctx.fillText("✨", frameX + 30, y2 + 45);
  ctx.fillText("★", frameX + 190, y2 + 50);
  ctx.restore();

  // --- Photo 3: B&W Heart Hands ---
  const y3 = y2 + frameH + gap;
  ctx.save();
  ctx.beginPath();
  ctx.roundRect(frameX, y3, frameW, frameH, 8);
  ctx.clip();

  ctx.fillStyle = "#18181b";
  ctx.fillRect(frameX, y3, frameW, frameH);

  ctx.fillStyle = "#52525b";
  ctx.beginPath();
  ctx.arc(frameX + 90, y3 + 80, 40, Math.PI, 0);
  ctx.arc(frameX + 138, y3 + 80, 40, Math.PI, 0);
  ctx.lineTo(frameX + 114, y3 + 150);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 15px monospace";
  ctx.textAlign = "center";
  ctx.fillText("BESTIES ✦ 2026", frameX + 114, y3 + 185);
  ctx.restore();

  // --- Photo 4: B&W Camera Flash ---
  const y4 = y3 + frameH + gap;
  ctx.save();
  ctx.beginPath();
  ctx.roundRect(frameX, y4, frameW, frameH, 8);
  ctx.clip();

  ctx.fillStyle = "#3f3f46";
  ctx.fillRect(frameX, y4, frameW, frameH);

  ctx.fillStyle = "#09090b";
  ctx.beginPath();
  ctx.roundRect(frameX + 64, y4 + 75, 100, 65, 8);
  ctx.fill();

  const flash = ctx.createRadialGradient(frameX + 114, y4 + 107, 4, frameX + 114, y4 + 107, 50);
  flash.addColorStop(0, "#ffffff");
  flash.addColorStop(0.5, "rgba(255, 255, 255, 0.8)");
  flash.addColorStop(1, "rgba(255, 255, 255, 0)");
  ctx.fillStyle = flash;
  ctx.beginPath();
  ctx.arc(frameX + 114, y4 + 107, 50, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();

  // Film Grain overlay
  const imgData = ctx.getImageData(0, 0, 256, 1024);
  const data = imgData.data;
  for (let i = 0; i < data.length; i += 4) {
    const noise = (Math.random() - 0.5) * 16;
    data[i] = Math.min(255, Math.max(0, data[i] + noise));
    data[i + 1] = Math.min(255, Math.max(0, data[i + 1] + noise));
    data[i + 2] = Math.min(255, Math.max(0, data[i + 2] + noise));
  }
  ctx.putImageData(imgData, 0, 0);

  // Bottom Footer
  const footerY = y4 + frameH + 12;
  ctx.fillStyle = "#27272a";
  ctx.font = "bold 15px 'Courier New', monospace";
  ctx.textAlign = "center";
  ctx.fillText("STUDIO NO. 42", 128, footerY + 20);

  ctx.font = "11px 'Courier New', monospace";
  ctx.fillStyle = "#71717a";
  ctx.fillText("REC ● 00:42:19 • MONOCHROME", 128, footerY + 40);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

// 14. World Globe Map Texture (Equirectangular 2:1 Map)
export function createGlobeTexture(): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 1024;
  canvas.height = 512;
  const ctx = canvas.getContext("2d")!;

  // 1. Ocean Deep Sapphire Blue Base Gradient
  const oceanGrad = ctx.createLinearGradient(0, 0, 0, 512);
  oceanGrad.addColorStop(0, "#0f172a");   // Polar ocean dark slate
  oceanGrad.addColorStop(0.3, "#1e3a8a");  // Deep navy ocean
  oceanGrad.addColorStop(0.5, "#1d4ed8");  // Equator vibrant sapphire blue
  oceanGrad.addColorStop(0.7, "#1e3a8a");
  oceanGrad.addColorStop(1, "#0f172a");
  ctx.fillStyle = oceanGrad;
  ctx.fillRect(0, 0, 1024, 512);

  // Soft ocean wave texture / subtle noise
  const imgData = ctx.getImageData(0, 0, 1024, 512);
  const data = imgData.data;
  for (let i = 0; i < data.length; i += 4) {
    const noise = (Math.random() - 0.5) * 8;
    data[i] = Math.min(255, Math.max(0, data[i] + noise * 0.4));
    data[i + 1] = Math.min(255, Math.max(0, data[i + 1] + noise * 0.6));
    data[i + 2] = Math.min(255, Math.max(0, data[i + 2] + noise));
  }
  ctx.putImageData(imgData, 0, 0);

  // 2. Latitude & Longitude Grid Lines
  ctx.strokeStyle = "rgba(56, 189, 248, 0.25)";
  ctx.lineWidth = 1;

  // Parallels (Latitude lines every 30 deg)
  for (let lat = 60; lat < 512; lat += 56.8) {
    ctx.beginPath();
    ctx.moveTo(0, lat);
    ctx.lineTo(1024, lat);
    ctx.stroke();
  }

  // Meridians (Longitude lines every 30 deg)
  for (let lon = 85.3; lon < 1024; lon += 85.3) {
    ctx.beginPath();
    ctx.moveTo(lon, 0);
    ctx.lineTo(lon, 512);
    ctx.stroke();
  }

  // Equator Line (Golden Accent)
  ctx.strokeStyle = "rgba(251, 191, 36, 0.6)";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(0, 256);
  ctx.lineTo(1024, 256);
  ctx.stroke();

  // Tropic Lines (Dotted)
  ctx.setLineDash([4, 4]);
  ctx.strokeStyle = "rgba(251, 191, 36, 0.35)";
  ctx.lineWidth = 1;

  // Tropic of Cancer (~23.5 deg N -> Y = 256 - 67 = 189)
  ctx.beginPath();
  ctx.moveTo(0, 189);
  ctx.lineTo(1024, 189);
  ctx.stroke();

  // Tropic of Capricorn (~23.5 deg S -> Y = 256 + 67 = 323)
  ctx.beginPath();
  ctx.moveTo(0, 323);
  ctx.lineTo(1024, 323);
  ctx.stroke();

  ctx.setLineDash([]); // Reset line dash

  // 3. Continents Rendering (Rich Terracotta Gold Landmasses with Emerald Terrain Accents)
  const drawLand = (pathFn: () => void, baseColor = "#d97706", strokeColor = "#fbbf24") => {
    ctx.fillStyle = baseColor;
    ctx.beginPath();
    pathFn();
    ctx.fill();

    ctx.strokeStyle = strokeColor;
    ctx.lineWidth = 1.5;
    ctx.stroke();
  };

  // --- North America ---
  drawLand(() => {
    ctx.moveTo(110, 80);
    ctx.bezierCurveTo(140, 60, 240, 50, 280, 80);  // Canada top
    ctx.bezierCurveTo(310, 100, 330, 140, 280, 160); // East Coast US
    ctx.bezierCurveTo(260, 180, 280, 230, 270, 250); // Florida / Mexico
    ctx.bezierCurveTo(230, 240, 190, 210, 160, 180); // West Coast US
    ctx.bezierCurveTo(120, 160, 90, 110, 110, 80);   // Alaska
  }, "#b45309", "#f59e0b");

  // --- South America ---
  drawLand(() => {
    ctx.moveTo(270, 255);
    ctx.bezierCurveTo(310, 250, 350, 290, 340, 330); // Brazil hump
    ctx.bezierCurveTo(330, 370, 300, 420, 285, 450); // Patagonia / Argentina tip
    ctx.bezierCurveTo(270, 420, 260, 360, 265, 300); // Chile / West coast
    ctx.closePath();
  }, "#d97706", "#fbbf24");

  // --- Greenland ---
  drawLand(() => {
    ctx.moveTo(370, 40);
    ctx.bezierCurveTo(410, 35, 430, 60, 420, 90);
    ctx.bezierCurveTo(390, 100, 360, 80, 370, 40);
  }, "#e2e8f0", "#94a3b8");

  // --- Europe ---
  drawLand(() => {
    ctx.moveTo(460, 110);
    ctx.bezierCurveTo(480, 80, 530, 70, 550, 90);  // Scandinavia / UK
    ctx.bezierCurveTo(570, 120, 540, 150, 510, 165); // Mediterranean / Italy / Spain
    ctx.bezierCurveTo(480, 160, 450, 140, 460, 110);
  }, "#b45309", "#f59e0b");

  // --- Africa ---
  drawLand(() => {
    ctx.moveTo(470, 175);
    ctx.bezierCurveTo(520, 165, 590, 190, 610, 230); // Horn of Africa
    ctx.bezierCurveTo(620, 270, 570, 360, 545, 390); // South Africa
    ctx.bezierCurveTo(520, 380, 500, 320, 490, 280); // West coast
    ctx.bezierCurveTo(440, 250, 430, 210, 470, 175); // West Africa bulge
  }, "#d97706", "#fbbf24");

  // Madagascar
  drawLand(() => {
    ctx.ellipse(630, 340, 10, 25, -0.3, 0, Math.PI * 2);
  }, "#b45309", "#f59e0b");

  // --- Asia ---
  drawLand(() => {
    ctx.moveTo(550, 90);
    ctx.bezierCurveTo(680, 50, 880, 55, 920, 100); // Russia / Siberia top
    ctx.bezierCurveTo(940, 140, 900, 190, 850, 210); // East Asia / China
    ctx.bezierCurveTo(810, 240, 780, 260, 740, 230); // SE Asia
    ctx.bezierCurveTo(700, 270, 660, 250, 680, 200); // India
    ctx.bezierCurveTo(600, 200, 560, 160, 550, 90);  // Middle East / Ural
  }, "#b45309", "#f59e0b");

  // Japan Islands
  drawLand(() => {
    ctx.ellipse(900, 150, 8, 22, -0.6, 0, Math.PI * 2);
  }, "#d97706", "#fbbf24");

  // SE Asia Islands / Indonesia
  [
    { x: 800, y: 270, rx: 18, ry: 6, rot: 0.2 },
    { x: 830, y: 285, rx: 20, ry: 5, rot: -0.1 },
    { x: 860, y: 290, rx: 15, ry: 5, rot: 0.1 }
  ].forEach(isl => {
    drawLand(() => {
      ctx.ellipse(isl.x, isl.y, isl.rx, isl.ry, isl.rot, 0, Math.PI * 2);
    }, "#d97706", "#fbbf24");
  });

  // --- Australia & New Zealand ---
  drawLand(() => {
    ctx.moveTo(800, 330);
    ctx.bezierCurveTo(850, 310, 910, 330, 900, 380); // North / East coast
    ctx.bezierCurveTo(870, 420, 820, 410, 790, 380); // South / West coast
    ctx.closePath();
  }, "#b45309", "#f59e0b");

  // New Zealand
  drawLand(() => {
    ctx.ellipse(935, 395, 6, 20, -0.4, 0, Math.PI * 2);
  }, "#d97706", "#fbbf24");

  // --- Antarctica (Ice Cap at Bottom) ---
  ctx.fillStyle = "rgba(241, 245, 249, 0.95)";
  ctx.beginPath();
  ctx.moveTo(0, 512);
  ctx.lineTo(0, 460);
  ctx.bezierCurveTo(200, 445, 500, 455, 800, 440);
  ctx.lineTo(1024, 460);
  ctx.lineTo(1024, 512);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = "#cbd5e1";
  ctx.lineWidth = 1.5;
  ctx.stroke();

  // 4. Cartographic Decorative Compass Rose & Typography Accent
  // Compass Rose in Pacific Ocean (X=180, Y=370)
  const cx = 180, cy = 370;
  ctx.strokeStyle = "rgba(251, 191, 36, 0.5)";
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.arc(cx, cy, 25, 0, Math.PI * 2);
  ctx.stroke();

  // Compass 4 Star Points
  ctx.fillStyle = "rgba(251, 191, 36, 0.7)";
  ctx.beginPath();
  ctx.moveTo(cx, cy - 32); ctx.lineTo(cx + 4, cy - 6); ctx.lineTo(cx + 32, cy); ctx.lineTo(cx + 4, cy + 6);
  ctx.lineTo(cx, cy + 32); ctx.lineTo(cx - 4, cy + 6); ctx.lineTo(cx - 32, cy); ctx.lineTo(cx - 4, cy - 6);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = "#fbbf24";
  ctx.font = "bold 11px monospace";
  ctx.textAlign = "center";
  ctx.fillText("N", cx, cy - 35);

  // Cartographic Banner Label in Atlantic Ocean (X=400, Y=340)
  ctx.fillStyle = "rgba(15, 23, 42, 0.75)";
  ctx.fillRect(330, 315, 140, 45);
  ctx.strokeStyle = "rgba(251, 191, 36, 0.7)";
  ctx.lineWidth = 1.5;
  ctx.strokeRect(330, 315, 140, 45);

  ctx.fillStyle = "#fbbf24";
  ctx.font = "bold 13px serif";
  ctx.fillText("TERRA INCOGNITA", 400, 334);
  ctx.font = "9px monospace";
  ctx.fillStyle = "#93c5fd";
  ctx.fillText("WORLD GLOBE v2026", 400, 350);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}





