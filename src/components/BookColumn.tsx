// src/components/BookColumn.tsx
import { useState } from "react";
import { BookOpen, ChevronLeft, ChevronRight, Bookmark, Maximize2, X, FileText, Sparkles } from "lucide-react";
import { playClickSound } from "../utils/audio";
import TapeCorner from "./TapeCorner";

export default function BookColumn() {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  const totalPages = 3;

  const handleNextPage = () => {
    playClickSound();
    setCurrentPage((prev) => (prev < totalPages ? prev + 1 : 1));
  };

  const handlePrevPage = () => {
    playClickSound();
    setCurrentPage((prev) => (prev > 1 ? prev - 1 : totalPages));
  };

  return (
    <>
      {/* Book Resting Directly on Table */}
      <div className="relative group w-full h-full flex flex-col justify-between select-none">
        {/* Label Tag on Table */}
        <div className="flex items-center justify-between mb-3 px-1">
          <div className="flex items-center gap-2">
            <span className="flex h-2.5 w-2.5 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500"></span>
            </span>
            <span className="text-xs font-mono font-bold tracking-wider text-amber-400 uppercase drop-shadow">
              02. LABORATORY LOGBOOK
            </span>
          </div>
          <button
            onClick={() => { playClickSound(); setIsExpanded(true); }}
            className="text-gray-300 hover:text-white p-1 rounded-md hover:bg-white/10 transition-colors flex items-center gap-1 text-[11px] font-mono"
            title="Read book full screen"
          >
            <Maximize2 className="w-3.5 h-3.5" />
            <span>Read</span>
          </button>
        </div>

        {/* Hardcover Leather Book Structure Resting on Table */}
        <div className="relative w-full bg-[#2a1d15] border-4 border-[#422f23] rounded-2xl p-3 md:p-4 shadow-[0_25px_60px_rgba(0,0,0,0.85),0_10px_20px_rgba(0,0,0,0.5)] flex-grow flex flex-col justify-between overflow-hidden hover:scale-[1.01] hover:shadow-[0_30px_70px_rgba(0,0,0,0.95)] transition-all duration-300">
          {/* Leather Book Spine Shadow Effect */}
          <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-10 bg-gradient-to-r from-transparent via-black/50 to-transparent pointer-events-none z-20" />

          {/* Book Header Bar */}
          <div className="relative z-10 flex justify-between items-center text-[10px] font-mono text-amber-200/80 mb-2 border-b border-amber-900/40 pb-1.5">
            <div className="flex items-center gap-1.5 font-bold">
              <BookOpen className="w-3.5 h-3.5 text-amber-400" />
              <span>RESEARCH JOURNAL</span>
            </div>
            <div className="flex items-center gap-1">
              <Bookmark className="w-3 h-3 text-amber-400 fill-amber-400" />
              <span>PAGE {currentPage} / {totalPages}</span>
            </div>
          </div>

          {/* Paper Content Card (Drafting Paper resting inside book) */}
          <div className="relative flex-grow bg-[#faf7ed] border border-[#e4dec9] rounded-xl p-3 md:p-4 shadow-inner text-slate-800 font-mono text-xs flex flex-col justify-between overflow-hidden min-h-[360px]">
            {/* Ruled notebook lines overlay */}
            <div 
              className="absolute inset-0 pointer-events-none opacity-30"
              style={{
                backgroundImage: "linear-gradient(#94a3b8 1px, transparent 1px)",
                backgroundSize: "100% 20px",
                backgroundPosition: "0 28px",
              }}
            />
            {/* Left red margin line */}
            <div className="absolute left-5 top-0 bottom-0 w-[1px] bg-red-400/40 pointer-events-none" />

            <TapeCorner color="yellow" position="top-right" />

            {/* Page Content */}
            <div className="relative z-10 pl-3 flex-grow flex flex-col justify-between">
              {currentPage === 1 && (
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between border-b border-slate-300 pb-1">
                    <span className="text-[10px] font-bold text-amber-700 uppercase tracking-wider">
                      ENTRY #042 // SYSTEM NOTES
                    </span>
                    <span className="text-[9px] text-slate-400">REV: 2.4</span>
                  </div>
                  <h3 className="font-bold text-slate-900 text-sm leading-tight font-sans">
                    Spatial UI Architecture
                  </h3>
                  <p className="text-[11px] text-slate-700 leading-relaxed italic">
                    "Interfaces should feel like physical objects on a workbench — tactile, responsive, and organic."
                  </p>
                  <ul className="space-y-1.5 text-[11px] text-slate-700 pt-1">
                    <li className="flex items-start gap-1.5">
                      <span className="text-amber-600 font-bold">✓</span>
                      <span>Audio ticks on hover & dials</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <span className="text-amber-600 font-bold">✓</span>
                      <span>Layered drafting grid surfaces</span>
                    </li>
                  </ul>
                </div>
              )}

              {currentPage === 2 && (
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between border-b border-slate-300 pb-1">
                    <span className="text-[10px] font-bold text-amber-700 uppercase tracking-wider">
                      ENTRY #043 // PRINCIPLES
                    </span>
                    <span className="text-[9px] text-slate-400">DESIGN CORE</span>
                  </div>
                  <h3 className="font-bold text-slate-900 text-sm leading-tight font-sans">
                    UX Design Manifesto
                  </h3>
                  <div className="space-y-2 text-[11px] text-slate-700">
                    <div className="p-2 bg-amber-500/10 rounded-lg border border-amber-500/20">
                      <strong className="text-amber-800">1. Spatial Realism:</strong> Visual depth, subtle drop shadows, realistic textures.
                    </div>
                    <div className="p-2 bg-sky-500/10 rounded-lg border border-sky-500/20">
                      <strong className="text-sky-800">2. Instant Feedback:</strong> Micro-animations and physical state transitions.
                    </div>
                  </div>
                </div>
              )}

              {currentPage === 3 && (
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between border-b border-slate-300 pb-1">
                    <span className="text-[10px] font-bold text-amber-700 uppercase tracking-wider">
                      ENTRY #044 // SPECS
                    </span>
                    <span className="text-[9px] text-slate-400">TECH STACK</span>
                  </div>
                  <h3 className="font-bold text-slate-900 text-sm leading-tight font-sans">
                    Engineered Foundation
                  </h3>
                  <div className="grid grid-cols-2 gap-2 text-[10px]">
                    <div className="p-2 bg-slate-100 rounded-lg border border-slate-300">
                      <div className="font-bold text-slate-900">Frontend</div>
                      <div className="text-slate-600">React 19 + TypeScript</div>
                    </div>
                    <div className="p-2 bg-slate-100 rounded-lg border border-slate-300">
                      <div className="font-bold text-slate-900">Animation</div>
                      <div className="text-slate-600">GSAP + Lenis</div>
                    </div>
                    <div className="p-2 bg-slate-100 rounded-lg border border-slate-300">
                      <div className="font-bold text-slate-900">Canvas</div>
                      <div className="text-slate-600">HTML5 2D Context</div>
                    </div>
                    <div className="p-2 bg-slate-100 rounded-lg border border-slate-300">
                      <div className="font-bold text-slate-900">Audio</div>
                      <div className="text-slate-600">Web Audio API</div>
                    </div>
                  </div>
                </div>
              )}

              {/* Page Controls Footer */}
              <div className="pt-2 border-t border-slate-300 flex justify-between items-center text-[10px]">
                <button
                  onClick={handlePrevPage}
                  className="px-2.5 py-1 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-md font-bold transition flex items-center gap-0.5 cursor-pointer"
                >
                  <ChevronLeft className="w-3 h-3" /> Prev
                </button>
                <span className="text-slate-500 font-bold">Page {currentPage} of {totalPages}</span>
                <button
                  onClick={handleNextPage}
                  className="px-2.5 py-1 bg-amber-600 hover:bg-amber-500 text-white rounded-md font-bold transition flex items-center gap-0.5 cursor-pointer"
                >
                  Next <ChevronRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Table Accent Text */}
        <div className="mt-2.5 flex items-center justify-between text-[11px] font-mono text-gray-400 px-1">
          <span>[ HARDCOVER JOURNAL ]</span>
          <span className="text-amber-400 hover:underline cursor-pointer" onClick={() => setIsExpanded(true)}>Turn Pages →</span>
        </div>
      </div>

      {/* Expanded Book Reader Modal */}
      {isExpanded && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 md:p-8 animate-in fade-in duration-200">
          <div className="relative w-full max-w-3xl bg-[#2a1d15] border-2 border-amber-500/40 rounded-3xl p-6 shadow-2xl">
            <button
              onClick={() => { playClickSound(); setIsExpanded(false); }}
              className="absolute top-4 right-4 text-gray-400 hover:text-white p-2 rounded-full bg-white/10 hover:bg-white/20 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2 mb-4 text-amber-400 font-mono font-bold text-sm">
              <FileText className="w-4 h-4" />
              <span>LABORATORY JOURNAL READER</span>
            </div>
            <div className="bg-[#faf7ed] rounded-2xl p-6 border border-[#e4dec9] text-slate-900 space-y-4 font-mono">
              <div className="flex justify-between items-center border-b border-slate-300 pb-3">
                <span className="text-base font-bold text-amber-900 font-sans">Complete Research Logbook</span>
                <span className="text-xs text-slate-500">Volume 4 // 2026 Edition</span>
              </div>
              <div className="space-y-3 text-xs text-slate-700 leading-relaxed">
                <p>
                  <strong>Abstract:</strong> This research log documents design explorations, tactile canvas architectures, and software design systems created for spatial web interfaces resting directly on physical workbench surfaces.
                </p>
                <div className="p-3.5 bg-amber-50 rounded-xl border border-amber-200">
                  <div className="font-bold text-amber-900 mb-1 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-amber-600" /> Key Engineering Principles
                  </div>
                  <ul className="list-disc list-inside space-y-1 text-slate-800">
                    <li>Tactile response: Audio, visual, and spatial state synchronization.</li>
                    <li>Zero-dependency canvas drawing loops with custom brush algorithms.</li>
                    <li>Custom CSS wood-grain and drafting paper shader textures.</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
