// src/components/MatFooter.tsx

export default function MatFooter() {
  return (
    <div className="absolute bottom-5 sm:bottom-7 left-8 right-8 flex justify-between items-center pointer-events-none select-none z-10 text-[9px] font-mono text-[#FF8A1E]/30 uppercase tracking-[0.2em]">
      {/* Bottom Left Dimension */}
      <span>7.5 × 11 in</span>

      {/* Bottom Right Specification */}
      <span>self-healing · 3mm grid</span>
    </div>
  );
}
