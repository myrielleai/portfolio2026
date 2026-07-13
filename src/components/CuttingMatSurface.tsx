// src/components/CuttingMatSurface.tsx


export default function CuttingMatSurface() {
  return (
    <div className="relative w-full h-full bg-cutting-mat">
      {/* Silkscreen branded label */}
      <div className="absolute top-8 left-8 text-2xl font-mono font-bold text-white/15 uppercase tracking-[0.3em] select-none pointer-events-none">
        THE LABORATORY
      </div>
    </div>
  );
}
