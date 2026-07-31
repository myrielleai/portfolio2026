// src/components/IpadColumn.tsx
import { useState } from "react";
import { 
  Play, 
  RotateCcw, 
  Maximize2, 
  X, 
  Wifi, 
  Battery, 
  Layers, 
  Cpu, 
  Sparkles,
  CheckCircle2,
  Sliders
} from "lucide-react";
import { playClickSound } from "../utils/audio";

export default function IpadColumn() {
  const [activeTab, setActiveTab] = useState<"prototype" | "specs" | "ai">("prototype");
  const [counter, setCounter] = useState(42);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [sliderVal, setSliderVal] = useState(75);
  const [isExpanded, setIsExpanded] = useState(false);
  const [aiTypingText, setAiTypingText] = useState("Initializing neural canvas pipeline...");

  const handleTabChange = (tab: "prototype" | "specs" | "ai") => {
    playClickSound();
    setActiveTab(tab);
  };

  const handleAiRun = () => {
    playClickSound();
    const prompts = [
      "Generating dynamic SVG path data...",
      "Optimizing webGL shader uniforms...",
      "Synthesizing 60fps micro-interaction curves...",
      "Latency test passed: 1.4ms frame render time."
    ];
    const randomPrompt = prompts[Math.floor(Math.random() * prompts.length)];
    setAiTypingText(randomPrompt);
  };

  return (
    <>
      {/* iPad Component Resting Directly on Table */}
      <div className="relative group w-full h-full flex flex-col justify-between select-none">
        {/* Label Tag on Table */}
        <div className="flex items-center justify-between mb-3 px-1">
          <div className="flex items-center gap-2">
            <span className="flex h-2.5 w-2.5 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-sky-500"></span>
            </span>
            <span className="text-xs font-mono font-bold tracking-wider text-sky-400 uppercase drop-shadow">
              01. IPAD PRO WORKBENCH
            </span>
          </div>
          <button
            onClick={() => { playClickSound(); setIsExpanded(true); }}
            className="text-gray-300 hover:text-white p-1 rounded-md hover:bg-white/10 transition-colors flex items-center gap-1 text-[11px] font-mono"
            title="Expand iPad view"
          >
            <Maximize2 className="w-3.5 h-3.5" />
            <span>Focus</span>
          </button>
        </div>

        {/* Realistic iPad Physical Frame on Wood Table */}
        <div className="relative w-full bg-[#1e232a] border-4 border-slate-700/80 rounded-[32px] p-3 md:p-4 shadow-[0_25px_60px_rgba(0,0,0,0.85),0_10px_20px_rgba(0,0,0,0.5)] flex flex-col justify-between flex-grow overflow-hidden crt-reflection hover:scale-[1.01] hover:shadow-[0_30px_70px_rgba(0,0,0,0.95)] transition-all duration-300">
          {/* iPad Top Bezel: Camera & Sensors */}
          <div className="flex items-center justify-center gap-2 mb-2">
            <div className="w-2.5 h-2.5 rounded-full bg-slate-900 border border-slate-700 flex items-center justify-center">
              <div className="w-1 h-1 rounded-full bg-sky-900/80" />
            </div>
          </div>

          {/* iPad Screen Area */}
          <div className={`relative flex-grow rounded-2xl overflow-hidden p-3 md:p-4 transition-colors duration-300 font-sans flex flex-col justify-between min-h-[360px] ${
            isDarkMode ? "bg-slate-950 text-slate-100" : "bg-slate-50 text-slate-900"
          }`}>
            {/* iPad OS Status Bar */}
            <div className="flex justify-between items-center text-[10px] font-mono opacity-60 pb-2 border-b border-current/10">
              <div className="flex items-center gap-1.5 font-bold">
                <span>9:41 AM</span>
                <span className="px-1.5 py-0.5 rounded bg-sky-500/20 text-sky-400 text-[9px]">iPadOS 18.2</span>
              </div>
              <div className="flex items-center gap-2">
                <Wifi className="w-3 h-3" />
                <span className="text-[9px]">100%</span>
                <Battery className="w-3.5 h-3.5" />
              </div>
            </div>

            {/* iPad App Navigation Bar */}
            <div className="flex gap-1 bg-black/20 p-1 rounded-xl my-2 text-[11px] font-mono">
              <button
                onClick={() => handleTabChange("prototype")}
                className={`flex-1 py-1.5 px-2 rounded-lg flex items-center justify-center gap-1 transition-all ${
                  activeTab === "prototype" ? "bg-sky-500 text-white font-semibold shadow-sm" : "opacity-70 hover:opacity-100"
                }`}
              >
                <Sliders className="w-3 h-3" />
                <span>UI Demo</span>
              </button>
              <button
                onClick={() => handleTabChange("specs")}
                className={`flex-1 py-1.5 px-2 rounded-lg flex items-center justify-center gap-1 transition-all ${
                  activeTab === "specs" ? "bg-sky-500 text-white font-semibold shadow-sm" : "opacity-70 hover:opacity-100"
                }`}
              >
                <Layers className="w-3 h-3" />
                <span>Tokens</span>
              </button>
              <button
                onClick={() => handleTabChange("ai")}
                className={`flex-1 py-1.5 px-2 rounded-lg flex items-center justify-center gap-1 transition-all ${
                  activeTab === "ai" ? "bg-sky-500 text-white font-semibold shadow-sm" : "opacity-70 hover:opacity-100"
                }`}
              >
                <Sparkles className="w-3 h-3" />
                <span>AI Lab</span>
              </button>
            </div>

            {/* Tab 1: Interactive Prototype Screen */}
            {activeTab === "prototype" && (
              <div className="flex-grow flex flex-col justify-between py-1 space-y-3">
                <div className="p-3 rounded-xl border border-current/10 bg-current/5 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold font-mono">Interactive Widget</span>
                    <button 
                      onClick={() => { playClickSound(); setIsDarkMode(!isDarkMode); }}
                      className="px-2 py-0.5 rounded-md bg-sky-500/20 text-sky-400 text-[10px] font-mono hover:bg-sky-500/30 transition-colors"
                    >
                      {isDarkMode ? "🌙 Dark" : "☀️ Light"}
                    </button>
                  </div>
                  <div className="flex items-center justify-between bg-black/10 p-2.5 rounded-lg">
                    <span className="text-xs font-mono">Counter State: <strong className="text-sky-400">{counter}</strong></span>
                    <div className="flex gap-1.5">
                      <button 
                        onClick={() => { playClickSound(); setCounter(c => c + 1); }}
                        className="px-2.5 py-1 bg-sky-500 text-white text-xs rounded-md font-bold hover:bg-sky-600 active:scale-95 transition"
                      >
                        +1
                      </button>
                      <button 
                        onClick={() => { playClickSound(); setCounter(42); }}
                        className="p-1.5 bg-current/10 rounded-md hover:bg-current/20 text-xs transition"
                      >
                        <RotateCcw className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>

                <div className="p-3 rounded-xl border border-current/10 bg-current/5 space-y-2">
                  <div className="flex justify-between text-xs font-mono">
                    <span>Performance Scale</span>
                    <span className="text-sky-400 font-bold">{sliderVal}%</span>
                  </div>
                  <input 
                    type="range" 
                    min="10" 
                    max="100" 
                    value={sliderVal}
                    onChange={(e) => setSliderVal(Number(e.target.value))}
                    className="w-full accent-sky-500 cursor-pointer"
                  />
                  <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                    <div 
                      className="bg-sky-400 h-full transition-all duration-150" 
                      style={{ width: `${sliderVal}%` }}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Tab 2: UI Tokens Screen */}
            {activeTab === "specs" && (
              <div className="flex-grow flex flex-col justify-between py-1 space-y-2 font-mono text-xs">
                <div className="grid grid-cols-2 gap-2">
                  <div className="p-2.5 rounded-lg bg-sky-500/10 border border-sky-500/30">
                    <span className="text-[10px] opacity-70 block">ACCENT TOKEN</span>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="w-4 h-4 rounded-full bg-sky-500 shadow-sm" />
                      <span className="font-bold text-[11px]">#0EA5E9</span>
                    </div>
                  </div>
                  <div className="p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/30">
                    <span className="text-[10px] opacity-70 block">WARM TOKEN</span>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="w-4 h-4 rounded-full bg-amber-500 shadow-sm" />
                      <span className="font-bold text-[11px]">#FF8A1E</span>
                    </div>
                  </div>
                </div>

                <div className="p-2.5 rounded-lg bg-current/5 border border-current/10 space-y-1.5">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> WebGL Shader</span>
                    <span className="opacity-60">60 FPS</span>
                  </div>
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Touch Engine</span>
                    <span className="opacity-60">Active</span>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 3: AI Lab Screen */}
            {activeTab === "ai" && (
              <div className="flex-grow flex flex-col justify-between py-1 space-y-2 font-mono text-xs">
                <div className="p-3 rounded-xl bg-slate-900 border border-sky-500/20 text-sky-300 font-mono text-[11px] leading-relaxed">
                  <div className="flex items-center gap-1.5 text-[10px] text-sky-400 font-bold mb-1 border-b border-sky-500/20 pb-1">
                    <Cpu className="w-3.5 h-3.5 animate-spin" />
                    <span>NEURAL INTERFACE</span>
                  </div>
                  <p className="min-h-[44px] italic">{aiTypingText}</p>
                </div>

                <button
                  onClick={handleAiRun}
                  className="w-full py-2 bg-sky-500 hover:bg-sky-400 text-white font-bold rounded-xl flex items-center justify-center gap-1.5 shadow transition-colors text-xs cursor-pointer"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Synthesize Code</span>
                </button>
              </div>
            )}

            {/* Bottom Home Indicator */}
            <div className="w-full flex justify-center pt-2">
              <div className="w-20 h-1 rounded-full bg-current/20" />
            </div>
          </div>
        </div>

        {/* Table Accent Text */}
        <div className="mt-2.5 flex items-center justify-between text-[11px] font-mono text-gray-400 px-1">
          <span>[ IPAD PRO 12.9" ]</span>
          <span className="text-sky-400 hover:underline cursor-pointer" onClick={() => setIsExpanded(true)}>Interactive Demo →</span>
        </div>
      </div>

      {/* Expanded Focus Modal View */}
      {isExpanded && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 md:p-8 animate-in fade-in duration-200">
          <div className="relative w-full max-w-3xl bg-slate-900 border-2 border-sky-500/40 rounded-3xl p-6 shadow-2xl">
            <button
              onClick={() => { playClickSound(); setIsExpanded(false); }}
              className="absolute top-4 right-4 text-gray-400 hover:text-white p-2 rounded-full bg-white/10 hover:bg-white/20 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2 mb-4 text-sky-400 font-mono font-bold text-sm">
              <Sliders className="w-4 h-4" />
              <span>EXPANDED IPAD WORKBENCH CONSOLE</span>
            </div>
            <div className="bg-slate-950 rounded-2xl p-6 border border-white/10 text-white space-y-4 font-mono">
              <div className="flex justify-between items-center border-b border-white/10 pb-3">
                <span className="text-sm font-bold text-sky-400">Live Device Output</span>
                <span className="text-xs text-gray-400">Frame rate: 120Hz ProMotion</span>
              </div>
              <p className="text-xs text-gray-300 leading-relaxed">
                This digital iPad console demonstrates responsive web application prototypes, live interactive state management, and real-time canvas manipulations directly on the table.
              </p>
              <div className="p-4 bg-sky-500/10 border border-sky-500/30 rounded-xl flex flex-wrap gap-4 items-center justify-between">
                <div>
                  <div className="text-xs text-sky-400">CURRENT COUNTER VALUE</div>
                  <div className="text-2xl font-bold">{counter}</div>
                </div>
                <button 
                  onClick={() => { playClickSound(); setCounter(c => c + 10); }}
                  className="px-4 py-2 bg-sky-500 hover:bg-sky-400 text-white font-bold rounded-lg text-xs transition cursor-pointer"
                >
                  Boost +10
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
