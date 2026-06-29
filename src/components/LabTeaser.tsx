import React, { useState, useEffect, useRef } from "react";
import { playClickSound, playToggleSound } from "../utils/audio";

interface LabTeaserProps {
  onEnterLab: () => void;
}

const TERMINAL_LINES = [
  "SYS // NODE_INITIALIZE // START",
  "SYS // ATTACHING LATENT SPACE DIRECTORIES...",
  "SYS // WEIGHTS LOADED: [M-MODEL-7B] (INT-4)",
  "SYS // RESOLVING DEPT_VAULT HOOKS...",
  "SYS // CONSTRUCTING VECTOR SPACE MAPS...",
  "SYS // CORE_TEMPERATURE: 38.6°C (NORMAL)",
  "SYS // DETECTED INTERACTION HANDLERS: 4",
  "SYS // MOUNTING SHADER PIPELINE...",
  "SYS // PORT_5176: LISTENING // ACTIVE",
  "SYS // CONNECTION_TELEMETRY: ESTABLISHED",
  "SYS // BUFFER_SIZE: 4096 BYTES",
  "SYS // SYNCHRONIZING REALTIME TELEMETRY...",
  "SYS // RENDER_THREAD: ACTIVE (120 FPS)",
  "SYS // SHADOW_MAP_COMPILER: OK",
  "SYS // MATRIX_DIMS: [1024 x 1024]",
  "SYS // SEED_VALUE: 0xDEADBEEF",
  "SYS // PROXIMITY_FIELD_GENERATOR: READY",
  "SYS // AGY_SDK_ORCHESTRATOR: ACTIVE",
  "SYS // CONTEXT_WINDOW: 8192 TOKENS",
  "SYS // GRADIENT_DESCENT_ACCEL: ENGAGED",
  "SYS // QUANTIZATION_SCHEME: ON",
  "SYS // LATENCY_INDEX: 1.42 ms",
  "SYS // NOISE_REDUCTION_FILTER: ON",
  "SYS // STRUCTURAL_LATTICE_RENDERED"
];

let localAudioCtx: AudioContext | null = null;
const getAudioContext = () => {
  if (typeof window === "undefined") return null;
  if (!localAudioCtx) {
    const Win = window as unknown as { AudioContext: typeof AudioContext; webkitAudioContext: typeof AudioContext };
    localAudioCtx = new (Win.AudioContext || Win.webkitAudioContext)();
  }
  return localAudioCtx;
};

export default function LabTeaser({ onEnterLab }: LabTeaserProps) {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [hoveredPanel, setHoveredPanel] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [isActivating, setIsActivating] = useState(false);
  const [isPoweringUp, setIsPoweringUp] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);
  const [reducedMotion, setReducedMotion] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  });

  const containerRef = useRef<HTMLDivElement>(null);
  const gridCanvasRef = useRef<HTMLCanvasElement>(null);
  const hypercubeCanvasRef = useRef<HTMLCanvasElement>(null);
  const mousePosRef = useRef({ x: 0, y: 0, clientX: 0, clientY: 0 });
  const hoveredPanelRef = useRef<string | null>(null);
  const logIntervalRef = useRef<number | null>(null);
  const activeOscRef = useRef<OscillatorNode | null>(null);
  const activeGainRef = useRef<GainNode | null>(null);
  const progressRef = useRef(0);

  // Sync ref to prevent state closures in intervals
  useEffect(() => {
    progressRef.current = progress;
  }, [progress]);

  // Check prefers-reduced-motion
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const listener = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mediaQuery.addEventListener("change", listener);
    return () => mediaQuery.removeEventListener("change", listener);
  }, []);

  // Update mouse position for subtle parallax
  const handleMouseMove = (e: React.MouseEvent) => {
    if (reducedMotion || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 2 - 1; // -1 to 1
    const y = ((e.clientY - rect.top) / rect.height) * 2 - 1; // -1 to 1
    setMousePos({ x, y });
    mousePosRef.current = { x, y, clientX: e.clientX - rect.left, clientY: e.clientY - rect.top };
  };

  const handleMouseLeaveContainer = () => {
    setMousePos({ x: 0, y: 0 });
    mousePosRef.current = { x: 0, y: 0, clientX: 0, clientY: 0 };
  };

  // 1. Live scrolling terminal state management
  useEffect(() => {
    setLogs(TERMINAL_LINES.slice(0, 8));
    
    let lineIdx = 8;
    const runInterval = (speed: number) => {
      if (logIntervalRef.current) clearInterval(logIntervalRef.current);
      logIntervalRef.current = window.setInterval(() => {
        setLogs(prev => {
          const nextLine = TERMINAL_LINES[lineIdx % TERMINAL_LINES.length];
          lineIdx++;
          const nextLogs = [...prev, nextLine];
          if (nextLogs.length > 15) {
            nextLogs.shift();
          }
          return nextLogs;
        });
      }, speed);
    };

    runInterval(800);

    return () => {
      if (logIntervalRef.current) clearInterval(logIntervalRef.current);
    };
  }, []);

  const handleTerminalMouseEnter = () => {
    handlePanelEnter("terminal");
    let tickCounter = 0;
    if (logIntervalRef.current) clearInterval(logIntervalRef.current);
    logIntervalRef.current = window.setInterval(() => {
      setLogs(prev => {
        const nextLine = TERMINAL_LINES[Math.floor(Math.random() * TERMINAL_LINES.length)];
        const nextLogs = [...prev, nextLine];
        if (nextLogs.length > 15) {
          nextLogs.shift();
        }
        return nextLogs;
      });
      if (tickCounter % 2 === 0) {
        playClickSound(0.015);
      }
      tickCounter++;
    }, 150);
  };

  const handleTerminalMouseLeave = () => {
    handlePanelLeave();
    if (logIntervalRef.current) clearInterval(logIntervalRef.current);
    let lineIdx = 0;
    logIntervalRef.current = window.setInterval(() => {
      setLogs(prev => {
        const nextLine = TERMINAL_LINES[lineIdx % TERMINAL_LINES.length];
        lineIdx++;
        const nextLogs = [...prev, nextLine];
        if (nextLogs.length > 15) {
          nextLogs.shift();
        }
        return nextLogs;
      });
    }, 800);
  };

  // 2. Background Grid Canvas Logic
  useEffect(() => {
    const canvas = gridCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = canvas.offsetWidth);
    let height = (canvas.height = canvas.offsetHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
    };
    window.addEventListener("resize", handleResize);

    let scanlineY = 0;

    interface TechLabel {
      x: number;
      y: number;
      text: string;
      opacity: number;
      maxOpacity: number;
      fadeSpeed: number;
    }
    const techLabels: TechLabel[] = [];
    const labelOptions = [
      "LATENT_VAL: 0.982",
      "NODE_ADDR: 0x7FFA",
      "REF_FRQ: 142Hz",
      "GRID_SEC_04: OK",
      "SYS_TELEMETRY: STABLE",
      "COGNITIVE_NODE: ON",
      "MATRIX_DIMS: [1024]",
      "AGY_CORE: ARMED"
    ];

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      // Dark background
      ctx.fillStyle = "#030303";
      ctx.fillRect(0, 0, width, height);

      const gridSpacing = 60;
      
      // Dynamic scanning speed multiplier during power up
      const pRatio = progressRef.current / 100;
      const scanlineSpeed = 1.2 + pRatio * 15;

      // Draw grid lines (slightly glowing white when powering up)
      ctx.strokeStyle = `rgba(255, 255, 255, ${0.015 + pRatio * 0.045})`;
      ctx.lineWidth = 1;
      for (let x = 0; x < width; x += gridSpacing) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }

      for (let y = 0; y < height; y += gridSpacing) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Draw scanning sweep line
      scanlineY += scanlineSpeed;
      if (scanlineY > height) {
        scanlineY = 0;
        if (Math.random() < 0.8) {
          const lx = Math.floor(Math.random() * (width / gridSpacing)) * gridSpacing + 10;
          const ly = Math.floor(Math.random() * (height / gridSpacing)) * gridSpacing - 10;
          techLabels.push({
            x: lx,
            y: Math.max(20, ly),
            text: labelOptions[Math.floor(Math.random() * labelOptions.length)],
            opacity: 0,
            maxOpacity: 0.35 + Math.random() * 0.35,
            fadeSpeed: 0.005 + Math.random() * 0.01
          });
        }
      }

      // Draw sweep line glow
      const grad = ctx.createLinearGradient(0, scanlineY - 40, 0, scanlineY + 40);
      grad.addColorStop(0, "rgba(255, 255, 255, 0)");
      grad.addColorStop(0.5, `rgba(255, 255, 255, ${0.03 + pRatio * 0.08})`);
      grad.addColorStop(1, "rgba(255, 255, 255, 0)");
      ctx.fillStyle = grad;
      ctx.fillRect(0, scanlineY - 40, width, 80);

      ctx.strokeStyle = `rgba(255, 255, 255, ${0.08 + pRatio * 0.25})`;
      ctx.beginPath();
      ctx.moveTo(0, scanlineY);
      ctx.lineTo(width, scanlineY);
      ctx.stroke();

      // Draw dots at intersections and proximity glows
      for (let x = 0; x < width; x += gridSpacing) {
        for (let y = 0; y < height; y += gridSpacing) {
          const dx = mousePosRef.current.clientX - x;
          const dy = mousePosRef.current.clientY - y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 150) {
            const glowAlpha = (1 - dist / 150) * 0.4;
            ctx.fillStyle = `rgba(255, 255, 255, ${0.12 + glowAlpha + pRatio * 0.3})`;
            ctx.beginPath();
            ctx.arc(x, y, 1.4, 0, Math.PI * 2);
            ctx.fill();

            if (dist < 100 && Math.random() < 0.06) {
              ctx.strokeStyle = `rgba(255, 255, 255, ${(1 - dist / 100) * 0.04})`;
              ctx.setLineDash([2, 4]);
              ctx.beginPath();
              ctx.moveTo(x, y);
              ctx.lineTo(mousePosRef.current.clientX, mousePosRef.current.clientY);
              ctx.stroke();
              ctx.setLineDash([]);
            }
          } else {
            ctx.fillStyle = `rgba(255, 255, 255, ${0.06 + pRatio * 0.15})`;
            ctx.beginPath();
            ctx.arc(x, y, 0.8, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      }

      // Draw tech labels
      ctx.font = "7px JetBrains Mono, monospace";
      for (let i = techLabels.length - 1; i >= 0; i--) {
        const label = techLabels[i];
        ctx.fillStyle = `rgba(255, 255, 255, ${label.opacity})`;
        ctx.fillText(label.text, label.x, label.y);

        if (label.opacity < label.maxOpacity && label.fadeSpeed > 0) {
          label.opacity = Math.min(label.maxOpacity, label.opacity + 0.02);
        } else {
          label.fadeSpeed = -Math.abs(label.fadeSpeed);
          label.opacity += label.fadeSpeed;
        }

        if (label.opacity <= 0) {
          techLabels.splice(i, 1);
        }
      }

      animId = requestAnimationFrame(draw);
    };

    animId = requestAnimationFrame(draw);

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animId);
    };
  }, []);

  // 3. Rotating 3D Hypercube Canvas Logic
  useEffect(() => {
    const canvas = hypercubeCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let cx = canvas.width / 2;
    let cy = canvas.height / 2;

    let localAngleX = 0;
    let localAngleY = 0;
    let localAngleZ = 0;

    const vertices = [
      // Outer Cube (8 vertices)
      { x: -1, y: -1, z: -1 },
      { x: 1, y: -1, z: -1 },
      { x: 1, y: 1, z: -1 },
      { x: -1, y: 1, z: -1 },
      { x: -1, y: -1, z: 1 },
      { x: 1, y: -1, z: 1 },
      { x: 1, y: 1, z: 1 },
      { x: -1, y: 1, z: 1 },
      // Inner Cube (8 vertices)
      { x: -0.5, y: -0.5, z: -0.5 },
      { x: 0.5, y: -0.5, z: -0.5 },
      { x: 0.5, y: 0.5, z: -0.5 },
      { x: -0.5, y: 0.5, z: -0.5 },
      { x: -0.5, y: -0.5, z: 0.5 },
      { x: 0.5, y: -0.5, z: 0.5 },
      { x: 0.5, y: 0.5, z: 0.5 },
      { x: -0.5, y: 0.5, z: 0.5 }
    ];

    const edges = [
      // Outer Cube Edges
      [0, 1], [1, 2], [2, 3], [3, 0],
      [4, 5], [5, 6], [6, 7], [7, 4],
      [0, 4], [1, 5], [2, 6], [3, 7],
      // Inner Cube Edges
      [8, 9], [9, 10], [10, 11], [11, 8],
      [12, 13], [13, 14], [14, 15], [15, 12],
      [8, 12], [9, 13], [10, 14], [11, 15],
      // Connections between Inner & Outer
      [0, 8], [1, 9], [2, 10], [3, 11],
      [4, 12], [5, 13], [6, 14], [7, 15]
    ];

    const drawCube = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const isHovered = hoveredPanelRef.current === "hypercube";
      const speedX = isHovered ? 0.015 : 0.004;
      const speedY = isHovered ? 0.020 : 0.006;
      const speedZ = isHovered ? 0.010 : 0.003;

      localAngleX += speedX + mousePosRef.current.y * 0.005;
      localAngleY += speedY + mousePosRef.current.x * 0.005;
      localAngleZ += speedZ;

      const rotated = vertices.map(v => {
        // Rotate Y
        let x1 = v.x * Math.cos(localAngleY) - v.z * Math.sin(localAngleY);
        let z1 = v.x * Math.sin(localAngleY) + v.z * Math.cos(localAngleY);
        
        // Rotate X
        let y2 = v.y * Math.cos(localAngleX) - z1 * Math.sin(localAngleX);
        let z2 = v.y * Math.sin(localAngleX) + z1 * Math.cos(localAngleX);
        
        // Rotate Z
        let x3 = x1 * Math.cos(localAngleZ) - y2 * Math.sin(localAngleZ);
        let y3 = x1 * Math.sin(localAngleZ) + y2 * Math.cos(localAngleZ);
        
        return { x: x3, y: y3, z: z2 };
      });

      const scale = 55;
      const dist = 2.5;
      const proj = rotated.map(r => {
        const f = scale / (r.z + dist);
        const px = cx + r.x * f;
        const py = cy + r.y * f;
        return { x: px, y: py };
      });

      // Draw edges
      ctx.strokeStyle = isHovered ? "rgba(255, 255, 255, 0.45)" : "rgba(255, 255, 255, 0.15)";
      ctx.lineWidth = 1.2;
      edges.forEach(edge => {
        const p1 = proj[edge[0]];
        const p2 = proj[edge[1]];
        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.stroke();
      });

      // Draw vertex dots
      ctx.fillStyle = isHovered ? "#ffffff" : "rgba(255, 255, 255, 0.5)";
      proj.forEach(p => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
        ctx.fill();
      });

      animId = requestAnimationFrame(drawCube);
    };

    animId = requestAnimationFrame(drawCube);
    return () => cancelAnimationFrame(animId);
  }, []);

  // Panel hover utilities
  const handlePanelEnter = (panelId: string) => {
    setHoveredPanel(panelId);
    hoveredPanelRef.current = panelId;
    playClickSound(0.04);
  };

  const handlePanelLeave = () => {
    setHoveredPanel(null);
    hoveredPanelRef.current = null;
  };

  // Activator touch holding mechanism
  const startActivation = () => {
    if (isPoweringUp) return;
    setIsActivating(true);
    playClickSound(0.08);

    const ctx = getAudioContext();
    if (ctx) {
      if (ctx.state === "suspended") {
        ctx.resume();
      }
      const duration = 1.2;
      const now = ctx.currentTime;

      // Audio frequency riser
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      osc.type = "sine";
      osc.frequency.setValueAtTime(80, now);
      osc.frequency.exponentialRampToValueAtTime(700, now + duration);

      filter.type = "lowpass";
      filter.frequency.setValueAtTime(150, now);
      filter.frequency.exponentialRampToValueAtTime(1200, now + duration);

      gain.gain.setValueAtTime(0.01, now);
      gain.gain.linearRampToValueAtTime(0.18, now + duration * 0.9);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + duration);

      activeOscRef.current = osc;
      activeGainRef.current = gain;
    }
  };

  const cancelActivation = () => {
    if (isPoweringUp) return;
    setIsActivating(false);

    if (activeGainRef.current && localAudioCtx) {
      const now = localAudioCtx.currentTime;
      try {
        activeGainRef.current.gain.cancelScheduledValues(now);
        activeGainRef.current.gain.setValueAtTime(activeGainRef.current.gain.value, now);
        activeGainRef.current.gain.exponentialRampToValueAtTime(0.0001, now + 0.05);

        setTimeout(() => {
          if (activeOscRef.current) {
            try {
              activeOscRef.current.stop();
            } catch (e) {
              // ignore
            }
            activeOscRef.current = null;
          }
        }, 60);
      } catch (e) {
        // ignore
      }
    }

    playClickSound(0.04);
  };

  // Activation progress watcher
  useEffect(() => {
    if (!isActivating) {
      if (progress > 0) {
        let animId: number;
        const drain = () => {
          setProgress(prev => {
            if (prev <= 0) return 0;
            animId = requestAnimationFrame(drain);
            return Math.max(0, prev - 4);
          });
        };
        animId = requestAnimationFrame(drain);
        return () => cancelAnimationFrame(animId);
      }
      return;
    }

    let startTime = Date.now();
    let startProgress = progress;
    let animId: number;

    const tick = () => {
      const elapsed = Date.now() - startTime;
      const duration = 1200; // 1.2 seconds to charge
      const pct = Math.min(1, elapsed / duration);
      const newProgress = startProgress + pct * (100 - startProgress);

      setProgress(newProgress);

      if (newProgress >= 100) {
        setIsPoweringUp(true);
        playToggleSound(true);
        setTimeout(() => {
          onEnterLab();
        }, 500);
      } else {
        animId = requestAnimationFrame(tick);
      }
    };

    animId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animId);
  }, [isActivating]);

  // Parallax transform styles
  const getParallaxStyle = (factor: number, rotBase = 0) => {
    if (reducedMotion) return { transform: `rotate(${rotBase}deg)` };
    const tx = mousePos.x * factor * 14;
    const ty = mousePos.y * factor * 14;
    const r = rotBase + mousePos.x * factor * 1.5;
    return {
      transform: `translate3d(${tx}px, ${ty}px, 0) rotate(${r}deg)`,
      transition: "transform 0.4s cubic-bezier(0.25, 1, 0.5, 1)",
    };
  };

  return (
    <section
      id="lab-teaser"
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeaveContainer}
      className={`w-full h-[100vh] bg-[#030303] text-white font-mono relative overflow-hidden flex flex-col justify-between p-8 sm:p-12 md:p-16 select-none crt-scanlines crt-reflection border-t border-white/5 transition-all duration-300 ${
        isPoweringUp ? "opacity-30 scale-95 duration-500" : ""
      }`}
    >
      {/* Background Canvas Grid */}
      <canvas
        ref={gridCanvasRef}
        className="absolute inset-0 w-full h-full z-0 pointer-events-none"
      />

      {/* 1. Header Metadata Strip */}
      <div className="w-full flex items-center justify-between text-[10px] tracking-[0.2em] text-zinc-500 border-b border-white/5 pb-4 z-20 relative">
        <div>SYS_REF // A08-PORTFOLIO-MONO</div>
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5">
            <span className={`w-1.5 h-1.5 rounded-full ${isActivating ? "bg-white animate-pulse" : "bg-white/20"}`} />
            {isPoweringUp ? "SYS_STATE: ENGAGING" : isActivating ? "SYS_STATE: INTENSIFYING" : "SYS_STATE: STANDBY"}
          </span>
          <span className="hidden sm:inline">CH_04 // PORTFOLIO_LATTICE</span>
        </div>
      </div>

      {/* 2. Floating Technical Panels & Central Headline Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center justify-center my-auto relative z-20 w-full">
        
        {/* LEFT PANEL: Live Kernel Stream */}
        <div className="md:col-span-4 flex justify-center md:justify-start">
          <div
            onMouseEnter={handleTerminalMouseEnter}
            onMouseLeave={handleTerminalMouseLeave}
            style={getParallaxStyle(0.6, -1)}
            className={`w-72 bg-[#09090b]/80 backdrop-blur-md border ${
              hoveredPanel === "terminal" ? "border-white/30 shadow-[0_0_20px_rgba(255,255,255,0.06)]" : "border-white/10"
            } rounded-lg p-4 transition-all duration-300 relative cursor-crosshair`}
          >
            <div className="flex justify-between items-center text-[9px] mb-3 text-zinc-500 border-b border-white/5 pb-1 font-bold">
              <span>SYS_KERNEL_STREAM</span>
              <span className="animate-pulse">● LIVE</span>
            </div>
            
            <div className="h-28 overflow-hidden space-y-1.5 leading-relaxed text-[8.5px] font-mono text-zinc-400">
              {logs.map((log, idx) => (
                <div key={idx} className={idx === logs.length - 1 ? "text-white" : ""}>
                  {log}
                </div>
              ))}
            </div>
            
            <div className="mt-3 flex justify-between text-[8px] text-zinc-600 border-t border-white/5 pt-2">
              <div>BUFFER_STREAM: ENGAGED</div>
              <div>SEC_LEVEL: 0x04</div>
            </div>
          </div>
        </div>

        {/* CENTER HEADLINE: HUD Composition */}
        <div className="md:col-span-4 text-center py-6 flex flex-col items-center justify-center">
          <div className="text-[10px] uppercase tracking-[0.35em] text-zinc-500 mb-2">
            [ DEPT_EXPERIMENT_VAULT ]
          </div>
          
          <h2 className="font-display font-black text-6xl sm:text-7xl lg:text-8xl tracking-tight text-white leading-none flex select-none flex-wrap justify-center gap-x-2">
            <span className="inline-block tracking-[-0.04em]">L</span>
            <span className="inline-block tracking-[-0.04em]">A</span>
            <span className="inline-block tracking-[-0.04em]">B</span>
            <span className="inline-block opacity-40 px-1 font-mono font-medium text-4xl transform translate-y-[-8px]">//</span>
            <span className="inline-block font-mono tracking-tighter text-4xl sm:text-5xl translate-y-[2px] text-zinc-500">04</span>
          </h2>

          <div className="text-[9px] text-zinc-500 mt-4 max-w-[280px] leading-relaxed uppercase border-t border-white/5 pt-4">
            INTELLIGENT SYSTEMS CALIBRATION & PROJECT TELEMETRY ACCESS CHAMBER
          </div>
        </div>

        {/* RIGHT PANEL: 3D Hypercube Rotation */}
        <div className="md:col-span-4 flex justify-center md:justify-end">
          <div
            onMouseEnter={() => handlePanelEnter("hypercube")}
            onMouseLeave={handlePanelLeave}
            style={getParallaxStyle(0.6, 1)}
            className={`w-72 bg-[#09090b]/80 backdrop-blur-md border ${
              hoveredPanel === "hypercube" ? "border-white/30 shadow-[0_0_20px_rgba(255,255,255,0.06)]" : "border-white/10"
            } rounded-lg p-4 transition-all duration-300 relative`}
          >
            <div className="flex justify-between items-center text-[9px] mb-3 text-zinc-500 border-b border-white/5 pb-1 font-bold">
              <span>STRUCTURAL_LATTICE</span>
              <span>TESSERACT_4D</span>
            </div>

            <div className="w-full h-28 bg-[#030303]/60 rounded border border-white/5 flex items-center justify-center overflow-hidden">
              <canvas
                ref={hypercubeCanvasRef}
                width="240"
                height="112"
                className="w-full h-full"
              />
            </div>

            <div className="mt-3 flex justify-between items-center text-[8px] text-zinc-600 border-t border-white/5 pt-2">
              <div>RENDER: CANVAS_2D</div>
              <div>NODES: 16 // EDGES: 32</div>
            </div>
          </div>
        </div>

      </div>

      {/* 3. Footer Control Box & Biometric Touch Activator */}
      <div className="w-full flex flex-col md:flex-row items-center justify-between gap-6 z-20 border-t border-white/5 pt-6 relative">
        
        {/* Left: Active indicator */}
        <div className="text-[10px] text-zinc-500 flex items-center gap-3 w-full md:w-auto justify-center md:justify-start">
          <div className="border border-white/10 bg-[#09090b] px-3 py-1.5 rounded uppercase font-bold tracking-wider">
            VAULT [04] // PROTO_ACTIVE
          </div>
          <div className="hidden md:inline border border-dashed border-white/5 bg-transparent px-2.5 py-1.5 rounded text-zinc-600 uppercase">
            LATENT_SPACE: ENGAGED
          </div>
        </div>

        {/* Center: Capacitive scanner touch activation */}
        <div className="w-full md:w-auto flex justify-center flex-col items-center">
          <div className="flex flex-col items-center justify-center p-3 border border-white/10 bg-[#09090b]/80 backdrop-blur-md rounded-xl max-w-sm w-72 relative overflow-hidden group shadow-[0_0_30px_rgba(0,0,0,0.5)]">
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out" />
            
            <div className="flex items-center gap-4 w-full justify-between">
              <div className="text-left pl-2">
                <div className="text-[7px] text-zinc-500 tracking-wider">SECURE CONNECTION ACCESS</div>
                <div className="text-[10px] font-bold tracking-widest text-white leading-none mt-1">
                  {isPoweringUp 
                    ? "SYS_REDIRECT" 
                    : isActivating 
                      ? `SYNCING [ ${Math.floor(progress)}% ]` 
                      : "HOLD TO AUTHORIZE"}
                </div>
              </div>

              <button
                onMouseDown={startActivation}
                onMouseUp={cancelActivation}
                onMouseLeave={cancelActivation}
                onTouchStart={startActivation}
                onTouchEnd={cancelActivation}
                className={`w-12 h-12 rounded-full bg-black border border-white/15 hover:border-white/35 active:border-white flex items-center justify-center cursor-pointer transition-all duration-300 relative select-none ${
                  isPoweringUp ? "cursor-not-allowed opacity-80" : ""
                }`}
              >
                {/* Fingerprint icon */}
                <svg className="w-5 h-5 text-white/50 group-hover:text-white transition-colors duration-300 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 009 11a15 15 0 00-7-3M6.7 1.9a9 9 0 0110.6 0M19 13v.01M19 17v.01M19 21v.01M16.5 11.608a8.97 8.97 0 00-3.493-1.397m-2.188-.13a9.005 9.005 0 018.18 5.166m-1.259-2.044a11.91 11.91 0 01-.18 9.57M12 2v.01" />
                </svg>

                <div className="absolute inset-0 rounded-full border border-white/30 opacity-0 group-hover:opacity-100 group-hover:scale-95 transition-all duration-700 animate-ping pointer-events-none" />

                {/* SVG Circular Progress Bar */}
                <svg className="absolute inset-0 w-full h-full transform -rotate-90">
                  <circle
                    cx="24"
                    cy="24"
                    r="22"
                    className="text-transparent"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    fill="transparent"
                  />
                  <circle
                    cx="24"
                    cy="24"
                    r="22"
                    className="text-white transition-all duration-75"
                    strokeWidth="2"
                    strokeDasharray={2 * Math.PI * 22}
                    strokeDashoffset={2 * Math.PI * 22 * (1 - progress / 100)}
                    strokeLinecap="round"
                    fill="transparent"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Right: Technical Warning note */}
        <div className="text-[8px] text-zinc-600 text-center md:text-right leading-relaxed max-w-[200px] uppercase w-full md:w-auto">
          NOTICE: EXPERIMENTAL SCHEMA SUBJECT TO EVOLVE WITHOUT FORWARD RETROACTIVE WARNS.
        </div>

      </div>
    </section>
  );
}
