// src/components/Toolbar.tsx
import { playClickSound, playToggleSound } from "../utils/audio";

interface ToolbarProps {
  activeTool: "pencil" | "marker" | "eraser" | "stamp";
  setActiveTool: (tool: "pencil" | "marker" | "eraser" | "stamp") => void;
  color: string;
  setColor: (color: string) => void;
  onClear: () => void;
  onExit: () => void;
}

export default function Toolbar({
  activeTool,
  setActiveTool,
  color,
  setColor,
  onClear,
  onExit,
}: ToolbarProps) {
  const tools: Array<{ name: "pencil" | "marker" | "eraser" | "stamp"; label: string; icon: React.ReactNode }> = [
    { 
      name: "pencil", 
      label: "Pencil", 
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 20h9" />
          <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
        </svg>
      ) 
    },
    { 
      name: "marker", 
      label: "Marker", 
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="m14 3-4.9 4.9" />
          <path d="m8.5 10.5-3.4 3.4a2 2 0 1 0 2.8 2.8l3.4-3.4" />
          <path d="M17.5 6.5 20 9l-7.5 7.5H9v-3.5l7.5-7.5Z" />
        </svg>
      ) 
    },
    { 
      name: "eraser", 
      label: "Eraser", 
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="m7 21-4.3-4.3c-1-1-1-2.5 0-3.4l9.6-9.6c1-1 2.5-1 3.4 0l5.6 5.6c1 1 1 2.5 0 3.4L13 21Z" />
          <path d="M22 21H7" />
          <path d="m5 11 9 9" />
        </svg>
      ) 
    },
    { 
      name: "stamp", 
      label: "Stamp", 
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M5 22h14" />
          <path d="M12 2v10" />
          <path d="M17 12a5 5 0 0 0-10 0v8h10v-8Z" />
        </svg>
      ) 
    },
  ];

  const colors = [
    { value: "#1e293b", label: "Slate Ink" },
    { value: "#dc2626", label: "Drafting Red" },
    { value: "#2563eb", label: "Blueprint Blue" },
    { value: "#16a34a", label: "Chalk Green" },
    { value: "#f8fafc", label: "Chalk White" },
  ];

  const handleToolClick = (toolName: "pencil" | "marker" | "eraser" | "stamp") => {
    playClickSound(0.06);
    setActiveTool(toolName);
  };

  const handleColorClick = (c: string) => {
    playClickSound(0.04);
    setColor(c);
  };

  const handleClearClick = () => {
    playToggleSound(false);
    onClear();
  };

  const handleExitClick = () => {
    playToggleSound(true);
    onExit();
  };

  return (
    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-[#243527]/85 backdrop-blur-md rounded-2xl px-6 py-3.5 flex items-center gap-5 shadow-[0_15px_30px_rgba(0,0,0,0.3)] border border-white/10 z-30 select-none">
      {/* Tools Section */}
      <div className="flex items-center gap-1.5">
        {tools.map((t) => (
          <button
            key={t.name}
            onClick={() => handleToolClick(t.name)}
            className={`flex flex-col items-center justify-center w-12 h-12 rounded-xl transition-all duration-200 active:scale-95 ${
              activeTool === t.name
                ? "bg-[#FF8A1E]/15 border border-[#FF8A1E]/40 text-[#FF8A1E]"
                : "text-white/50 hover:bg-white/5 hover:text-white"
            }`}
            title={t.label}
            aria-label={t.label}
          >
            <span className="text-base">{t.icon}</span>
            <span className="text-[7px] font-mono mt-1 uppercase tracking-wider">
              {t.name}
            </span>
          </button>
        ))}
      </div>

      {/* ToolbarDivider */}
      <div className="w-[1.5px] h-8 bg-white/10 self-center" />

      {/* Colors Section */}
      <div className="flex items-center gap-2">
        {colors.map((c) => (
          <button
            key={c.value}
            onClick={() => handleColorClick(c.value)}
            className={`w-6 h-6 rounded-full transition-all duration-200 flex items-center justify-center relative ${
              color === c.value
                ? "scale-110 shadow-md ring-2 ring-[#FF8A1E] ring-offset-2 ring-offset-[#243527]"
                : "hover:scale-115"
            }`}
            title={c.label}
            aria-label={c.label}
          >
            {/* Inner color dot */}
            <span 
              className="w-full h-full rounded-full border border-white/20"
              style={{ backgroundColor: c.value }}
            />
          </button>
        ))}
      </div>

      {/* ToolbarDivider */}
      <div className="w-[1.5px] h-8 bg-white/10 self-center" />

      {/* Actions Section */}
      <div className="flex items-center gap-2">
        <button
          onClick={handleClearClick}
          className="px-3.5 py-2 bg-[#FF8A1E]/10 border border-[#FF8A1E]/30 rounded-lg text-[9px] font-mono text-[#FF8A1E] uppercase font-bold tracking-wider hover:bg-[#FF8A1E]/20 transition-all duration-200 active:scale-95 cursor-pointer"
        >
          Clear
        </button>

        <button
          onClick={handleExitClick}
          className="px-3.5 py-2 bg-red-950/30 border border-red-500/25 rounded-lg text-[9px] font-mono text-red-400 uppercase font-bold tracking-wider hover:bg-red-900/30 hover:border-red-500/40 transition-all duration-200 active:scale-95 cursor-pointer"
        >
          Exit
        </button>
      </div>
    </div>
  );
}
