// src/components/CuttingMatSurface.tsx

export default function CuttingMatSurface() {
  return (
    <div className="absolute inset-2 sm:inset-4 md:inset-6 rounded-xl md:rounded-2xl bg-cutting-mat border-2 border-[#364e3a]/90 shadow-[0_25px_60px_rgba(0,0,0,0.75),0_2px_10px_rgba(0,0,0,0.5),inset_0_2px_4px_rgba(255,255,255,0.06)] overflow-hidden pointer-events-none z-0">
      {/* Silkscreen branded label */}
      <div className="absolute top-8 left-8 text-2xl font-mono font-bold text-white/15 uppercase tracking-[0.3em] select-none pointer-events-none">
        THE LABORATORY
      </div>

      {/* Tactile mat corner rivets */}
      <div className="absolute top-3 left-3 w-1.5 h-1.5 rounded-full border border-white/20 bg-white/10" />
      <div className="absolute top-3 right-3 w-1.5 h-1.5 rounded-full border border-white/20 bg-white/10" />
      <div className="absolute bottom-3 left-3 w-1.5 h-1.5 rounded-full border border-white/20 bg-white/10" />
      <div className="absolute bottom-3 right-3 w-1.5 h-1.5 rounded-full border border-white/20 bg-white/10" />
    </div>
  );
}
