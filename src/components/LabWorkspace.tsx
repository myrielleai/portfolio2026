import { useState, useEffect, useRef } from "react";
import { portfolioData } from "../data/portfolioData";
import type { Project } from "../data/portfolioData";
import { playClickSound, playToggleSound } from "../utils/audio";

interface LabWorkspaceProps {
  onExitLab: () => void;
}

export default function LabWorkspace({ onExitLab }: LabWorkspaceProps) {
  const [selectedSpecimen, setSelectedSpecimen] = useState<number>(0);
  const [frequency, setFrequency] = useState<number>(20);
  const [amplitude, setAmplitude] = useState<number>(30);
  const [noise, setNoise] = useState<number>(4);
  const [sweepSpeed, setSweepSpeed] = useState<number>(4);

  // Use refs inside animation loop to prevent rebuilding canvas loop during user slider drags
  const frequencyRef = useRef(frequency);
  const amplitudeRef = useRef(amplitude);
  const noiseRef = useRef(noise);
  const sweepSpeedRef = useRef(sweepSpeed);

  useEffect(() => {
    frequencyRef.current = frequency;
  }, [frequency]);

  useEffect(() => {
    amplitudeRef.current = amplitude;
  }, [amplitude]);

  useEffect(() => {
    noiseRef.current = noise;
  }, [noise]);

  useEffect(() => {
    sweepSpeedRef.current = sweepSpeed;
  }, [sweepSpeed]);
  
  // Terminal system logs state
  const [logs, setLogs] = useState<string[]>(() => {
    const time = new Date().toLocaleTimeString("en-US", { hour12: false });
    const bootLogs = [
      "SYS // INITIATING BOOT SEQUENCE...",
      "SYS // INTENSITY CONTROL BEAM: ALIGNED",
      "SYS // VACUUM DISCHARGE TUBE: STABILIZED",
      "SYS // GAIN REGULATION: CALIBRATED",
      "SYS // ALL SENSOR CHANNELS ACTIVE. READY."
    ];
    const project = portfolioData.projects[0];
    if (project) {
      return [
        ...bootLogs,
        `[${time}] SPECIMEN_01 MOUNTED // ${project.title.toUpperCase()}`,
        `[${time}] READING ARCHIVE DATACARDS... SUCCESS.`
      ];
    }
    return bootLogs;
  });

  const [exitState, setExitState] = useState(false);
  const [isShuttingDown, setIsShuttingDown] = useState(false);
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const logTerminalEndRef = useRef<HTMLDivElement>(null);

  // Uptime ticker
  const [uptime, setUptime] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setUptime((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Format uptime to MM:SS
  const formatUptime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // Add system logs helper
  const addLog = (message: string) => {
    const time = new Date().toLocaleTimeString("en-US", { hour12: false });
    setLogs((prev) => [...prev.slice(-15), `[${time}] ${message}`]);
  };



  // Adjust parameters via sliders with click sound ticks
  const handleSliderChange = (
    type: "freq" | "amp" | "noise" | "sweep",
    val: number
  ) => {
    if (type === "freq") setFrequency(val);
    else if (type === "amp") setAmplitude(val);
    else if (type === "noise") setNoise(val);
    else if (type === "sweep") setSweepSpeed(val);
    
    // Play light click sound periodically for tactile tick feel
    playClickSound(0.03);
  };

  // Canvas drawing routine - runs once on mount and reads slider variables via refs
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Set high pixel density support
    const dpr = window.devicePixelRatio || 1;
    let rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.scale(dpr, dpr);

    let animId: number;
    let phase = 0;

    const draw = () => {
      const w = rect.width;
      const h = rect.height;
      const midY = h / 2;

      ctx.clearRect(0, 0, w, h);

      // Check prefers-reduced-motion -> flat line
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        ctx.strokeStyle = "#FF8A1E";
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(0, midY);
        ctx.lineTo(w, midY);
        ctx.stroke();
        return;
      }

      // 1. Draw fine millimeter grid
      ctx.strokeStyle = "rgba(255, 138, 30, 0.05)";
      ctx.lineWidth = 0.5;
      const gridSpacing = 20;

      for (let x = 0; x < w; x += gridSpacing) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
        ctx.stroke();
      }
      for (let y = 0; y < h; y += gridSpacing) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
      }

      // 2. Draw thicker major center crosshairs
      ctx.strokeStyle = "rgba(255, 138, 30, 0.15)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(w / 2, 0);
      ctx.lineTo(w / 2, h);
      ctx.moveTo(0, h / 2);
      ctx.lineTo(w, h / 2);
      ctx.stroke();

      // 3. Draw active wave path
      ctx.strokeStyle = "#FF8A1E";
      ctx.shadowColor = "#FF8A1E";
      ctx.shadowBlur = 6;
      ctx.lineWidth = 1.8;
      ctx.beginPath();

      const step = 1.5;
      const currentFreq = frequencyRef.current;
      const currentAmp = amplitudeRef.current;
      const currentNoise = noiseRef.current;
      const currentSweep = sweepSpeedRef.current;

      for (let x = 0; x < w; x += step) {
        // Core sine wave with parameterized frequency and phase
        const angle = (x * (currentFreq / 250)) + phase;
        let y = Math.sin(angle) * currentAmp;

        // Overlay complex harmonic distortion for retro-signal imperfection
        y += Math.cos(angle * 2.3 - phase) * (currentAmp * 0.2);
        
        // Add random voltage noise spikes
        if (currentNoise > 0) {
          const spikeChance = 0.15;
          if (Math.random() < spikeChance) {
            y += (Math.random() - 0.5) * currentNoise * 3.5;
          } else {
            y += (Math.random() - 0.5) * currentNoise * 0.3;
          }
        }

        if (x === 0) {
          ctx.moveTo(x, midY + y);
        } else {
          ctx.lineTo(x, midY + y);
        }
      }

      ctx.stroke();
      
      // Reset shadows
      ctx.shadowBlur = 0;

      // Increment phase using sweepSpeed slider
      phase += (currentSweep / 80);
      animId = requestAnimationFrame(draw);
    };

    draw();

    const handleResize = () => {
      rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
    };
    window.addEventListener("resize", handleResize, { passive: true });

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Scroll terminal logs to bottom automatically
  useEffect(() => {
    logTerminalEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [logs]);

  // Trigger Exit Console
  const handleExitToggle = () => {
    if (isShuttingDown) return;
    
    const nextState = !exitState;
    setExitState(nextState);
    playToggleSound(false);

    if (nextState) {
      setIsShuttingDown(true);
      addLog("SHUTTING DOWN TUBE BEAM...");
      addLog("DISCONNECTING CHANNELS...");
      addLog("SYSTEM SECURED. LOCKING CONSOLE.");
      
      setTimeout(() => {
        onExitLab();
      }, 600);
    }
  };

  const project: Project = portfolioData.projects[selectedSpecimen];

  return (
    <div 
      className="w-full h-screen bg-[#0E0D0C] text-[#FF8A1E] font-mono relative overflow-hidden flex flex-col justify-between p-6 select-none bg-lab-grid crt-scanlines crt-reflection z-50"
      style={{ color: "#FF8A1E" }}
    >
      {/* 1. TOP STATUS PANEL */}
      <div className="w-full flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#FF8A1E]/10 pb-4 text-[10px] tracking-[0.15em] text-[#FF8A1E]/50">
        <div className="flex items-center gap-6">
          <span className="font-bold text-[#FF8A1E]">LABORATORY // EXPERIMENT CONSOLE</span>
          <span className="hidden md:inline">SYSTEM_UPTIME: {formatUptime(uptime)}</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            CRT_BEAM: ONLINE
          </span>
          <span className="hidden sm:inline">SEC_LOCK: STABLE</span>
        </div>
      </div>

      {/* 2. MAIN CONSOLE workspace */}
      <div className="flex-grow grid grid-cols-1 lg:grid-cols-12 gap-6 my-4 overflow-hidden">
        
        {/* LEFT COLUMN: SPECIMENS VAULT (col-span-4) */}
        <div className="lg:col-span-4 flex flex-col justify-between border border-[#FF8A1E]/15 bg-[#16140F]/80 rounded p-4 overflow-hidden">
          
          {/* List selection */}
          <div className="space-y-4 overflow-y-auto max-h-[45vh] lg:max-h-none pr-1">
            <div className="text-[9px] text-[#FF8A1E]/40 tracking-[0.25em] border-b border-[#FF8A1E]/10 pb-1.5 uppercase font-bold">
              SPECIMEN REGISTRY
            </div>
            
            <div className="space-y-2">
              {portfolioData.projects.map((proj, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    if (idx !== selectedSpecimen) {
                      setSelectedSpecimen(idx);
                      playClickSound(0.06);
                      addLog(`SPECIMEN_0${idx + 1} MOUNTED // ${proj.title.toUpperCase()}`);
                      addLog(`READING ARCHIVE DATACARDS... SUCCESS.`);
                    }
                  }}
                  className={`w-full text-left border rounded p-2.5 transition-all duration-200 cursor-pointer ${
                    selectedSpecimen === idx
                      ? "border-[#FF8A1E] bg-[#0E0D0C] shadow-[0_0_12px_rgba(255,138,30,0.1)]"
                      : "border-[#FF8A1E]/15 bg-[#0e0d0c]/30 hover:border-[#FF8A1E]/50"
                  }`}
                >
                  <div className="flex justify-between items-center font-mono text-[9px] text-[#FF8A1E]/40">
                    <span>SPECIMEN_0{idx + 1}</span>
                    <span className={selectedSpecimen === idx ? "text-[#FF8A1E]" : ""}>
                      {selectedSpecimen === idx ? "[ MOUNTED ]" : "[ STOWED ]"}
                    </span>
                  </div>
                  <div className="text-xs font-semibold text-[#FF8A1E] tracking-wide mt-1 truncate">
                    {proj.title}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Mounted details panel */}
          {project && (
            <div className="mt-4 pt-4 border-t border-[#FF8A1E]/10 flex-grow flex flex-col justify-between overflow-hidden">
              <div className="space-y-3 overflow-y-auto pr-1">
                <div className="text-[9px] text-[#FF8A1E]/40 tracking-wider">TELEMETRY DATA CARD:</div>
                <h3 className="text-sm font-bold text-[#FF8A1E] uppercase tracking-wide leading-tight">
                  {project.title}
                </h3>
                <p className="text-[10px] text-[#FF8A1E]/65 leading-relaxed">
                  {project.description}
                </p>

                {/* Tech specifications */}
                <div className="space-y-1 pt-1.5">
                  <div className="text-[8px] text-[#FF8A1E]/40">COMPONENTS INSTALLED:</div>
                  <div className="flex flex-wrap gap-1">
                    {project.tags.map((tag, tIdx) => (
                      <span key={tIdx} className="text-[8px] border border-[#FF8A1E]/20 bg-[#0E0D0C] px-1.5 py-0.5 rounded text-[#FF8A1E]/80">
                        {tag.toUpperCase()}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action buttons styled as technical plates */}
              <div className="mt-4 grid grid-cols-2 gap-3 text-center text-[9px]">
                {project.demoUrl && (
                  <a
                    href={project.demoUrl}
                    target="_blank"
                    rel="noreferrer"
                    onMouseEnter={() => playClickSound(0.03)}
                    className="border border-[#FF8A1E]/30 bg-[#0E0D0C] hover:bg-[#FF8A1E] hover:text-[#0E0D0C] p-2.5 rounded transition-all font-semibold tracking-wider uppercase"
                  >
                    CONNECT // DEPLOY
                  </a>
                )}
                {project.githubUrl && (
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noreferrer"
                    onMouseEnter={() => playClickSound(0.03)}
                    className="border border-[#FF8A1E]/30 bg-[#0E0D0C] hover:bg-[#FF8A1E]/10 p-2.5 rounded transition-all font-semibold tracking-wider uppercase"
                  >
                    OPEN // ARCHIVE
                  </a>
                )}
              </div>
            </div>
          )}

        </div>

        {/* RIGHT COLUMN: MAIN OSCILLOSCOPE MONITOR & KNOBS (col-span-8) */}
        <div className="lg:col-span-8 flex flex-col justify-between gap-6 overflow-hidden">
          
          {/* The Cathode Ray Oscilloscope display */}
          <div className="flex-grow border border-[#FF8A1E]/15 bg-[#16140F]/80 rounded p-4 flex flex-col justify-between overflow-hidden">
            <div className="flex justify-between items-center text-[9px] text-[#FF8A1E]/40 border-b border-[#FF8A1E]/10 pb-1.5">
              <span>CATHODE-RAY TUBE DISPLAY (CRT-55A)</span>
              <span>INPUT SOURCE: FREQ_MODULATION</span>
            </div>

            <div className="flex-grow my-4 bg-[#0a0907] border border-[#FF8A1E]/15 rounded relative overflow-hidden flex items-center justify-center">
              <canvas 
                ref={canvasRef} 
                className="w-full h-full absolute inset-0 block" 
              />
              <div className="absolute right-4 top-4 text-[8px] text-[#FF8A1E]/30 text-right space-y-0.5 pointer-events-none select-none z-10">
                <div>SWEEP_INDEX: {(sweepSpeed * 10).toFixed(0)}%</div>
                <div>X_SCALE: 250ms/DIV</div>
                <div>Y_SCALE: 50V/DIV</div>
              </div>
            </div>

            {/* Slider Knobs Bay */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 border-t border-[#FF8A1E]/10 pt-4">
              
              {/* Parameter Knob 1 */}
              <div className="space-y-1">
                <div className="flex justify-between text-[8px] text-[#FF8A1E]/40 uppercase font-semibold">
                  <span>FREQUENCY</span>
                  <span>{frequency} Hz</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="80"
                  value={frequency}
                  onChange={(e) => handleSliderChange("freq", parseInt(e.target.value))}
                  className="w-full h-1 bg-[#0a0907] rounded-lg appearance-none cursor-pointer accent-[#FF8A1E] border border-[#FF8A1E]/10"
                />
              </div>

              {/* Parameter Knob 2 */}
              <div className="space-y-1">
                <div className="flex justify-between text-[8px] text-[#FF8A1E]/40 uppercase font-semibold">
                  <span>AMPLITUDE</span>
                  <span>{amplitude}V</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="70"
                  value={amplitude}
                  onChange={(e) => handleSliderChange("amp", parseInt(e.target.value))}
                  className="w-full h-1 bg-[#0a0907] rounded-lg appearance-none cursor-pointer accent-[#FF8A1E] border border-[#FF8A1E]/10"
                />
              </div>

              {/* Parameter Knob 3 */}
              <div className="space-y-1">
                <div className="flex justify-between text-[8px] text-[#FF8A1E]/40 uppercase font-semibold">
                  <span>VOLT_NOISE</span>
                  <span>{noise} mV</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="15"
                  value={noise}
                  onChange={(e) => handleSliderChange("noise", parseInt(e.target.value))}
                  className="w-full h-1 bg-[#0a0907] rounded-lg appearance-none cursor-pointer accent-[#FF8A1E] border border-[#FF8A1E]/10"
                />
              </div>

              {/* Parameter Knob 4 */}
              <div className="space-y-1">
                <div className="flex justify-between text-[8px] text-[#FF8A1E]/40 uppercase font-semibold">
                  <span>SWEEP RATE</span>
                  <span>{sweepSpeed} m/s</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={sweepSpeed}
                  onChange={(e) => handleSliderChange("sweep", parseInt(e.target.value))}
                  className="w-full h-1 bg-[#0a0907] rounded-lg appearance-none cursor-pointer accent-[#FF8A1E] border border-[#FF8A1E]/10"
                />
              </div>

            </div>

          </div>

          {/* Boot telemetry logs console terminal */}
          <div className="h-28 border border-[#FF8A1E]/15 bg-[#16140F]/80 rounded p-3 flex flex-col justify-between overflow-hidden">
            <div className="text-[8px] text-[#FF8A1E]/40 border-b border-[#FF8A1E]/10 pb-1 flex justify-between uppercase">
              <span>SYSTEM LOG TRANSMISSION</span>
              <span>BAUD_RATE: 9600 bps</span>
            </div>
            
            <div className="flex-grow overflow-y-auto text-[9px] text-[#FF8A1E]/75 leading-normal space-y-1 pr-1 font-mono pt-1 select-text">
              {logs.map((logStr, lIdx) => (
                <div key={lIdx} className="opacity-90">{logStr}</div>
              ))}
              <div ref={logTerminalEndRef} />
            </div>
          </div>

        </div>

      </div>

      {/* 3. FOOTER CONTROL SWITCH */}
      <div className="w-full flex items-center justify-between border-t border-[#FF8A1E]/10 pt-4">
        
        {/* Status code stamp */}
        <div className="text-[8px] text-[#FF8A1E]/30 uppercase">
          REF_DRAFT // SEC_CHAMBER_04 // PORTFOLIO_LOCK_STATE_OK
        </div>

        {/* Exit switch component */}
        <div className="flex items-center gap-4 border border-[#FF8A1E]/20 bg-[#16140F] p-2.5 rounded relative overflow-hidden">
          {/* Warning stripe decorative plate */}
          <div className="absolute left-0 top-0 bottom-0 w-2 bg-[repeating-linear-gradient(45deg,#231f1a,#231f1a_4px,#FF8A1E_4px,#FF8A1E_8px)] opacity-20" />
          
          <div className="pl-3 pr-1 text-left">
            <div className="text-[7px] text-[#FF8A1E]/40 tracking-wider">OFFLINE CONTROLLER</div>
            <div className="text-[9px] font-bold tracking-widest text-[#FF8A1E] leading-none mt-1">EXIT / POWER OFF</div>
          </div>

          <div className="h-6 w-[1px] bg-[#FF8A1E]/15 mx-1" />

          {/* Toggle button */}
          <div className="flex items-center gap-3">
            <div className="flex flex-col items-center">
              <span className="text-[6px] text-[#FF8A1E]/40">DISCONNECT</span>
              <div 
                className={`w-2.5 h-2.5 rounded-full transition-all duration-300 border ${
                  isShuttingDown 
                    ? "bg-[#271e16] border-[#FF8A1E]/30" 
                    : exitState 
                      ? "bg-[#271e16] border-[#FF8A1E]/30" 
                      : "bg-[#FF8A1E] border-white shadow-[0_0_8px_#FF8A1E]"
                }`}
              />
            </div>

            <button
              onClick={handleExitToggle}
              disabled={isShuttingDown}
              aria-label="Toggle analog switch to shutdown console and return"
              className={`w-8 h-11 bg-[#0a0907] border border-[#FF8A1E]/30 rounded-full flex flex-col justify-between items-center p-0.5 cursor-pointer transition-colors hover:border-[#FF8A1E] relative ${
                isShuttingDown ? "cursor-not-allowed opacity-80" : ""
              }`}
            >
              <div className="absolute top-1 bottom-1 left-[calc(50%-1px)] w-0.5 bg-[#FF8A1E]/10" />

              <div
                className={`w-5.5 h-5.5 rounded-full bg-[#1e1a14] border border-[#FF8A1E]/50 shadow-[0_2px_4px_rgba(0,0,0,0.8)] flex items-center justify-center transition-all duration-300 z-10 ${
                  exitState ? "translate-y-4 bg-[#2c2217] border-[#FF8A1E]" : ""
                }`}
              >
                <div className={`w-1 h-1 rounded-full ${exitState ? "bg-[#FF8A1E]/35" : "bg-[#FF8A1E]"}`} />
              </div>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
