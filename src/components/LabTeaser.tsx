import WorkbenchCanvas from "./workbench/WorkbenchCanvas";

interface LabTeaserProps {
  onEnterLab?: () => void;
  onExitLab?: () => void;
}

export default function LabTeaser({ onEnterLab }: LabTeaserProps) {
  return (
    <section 
      id="lab-teaser"
      className="relative w-full bg-[var(--bg)] border-b border-[var(--border)] transition-colors duration-300"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-12 pt-24 pb-16">
        <div className="flex flex-col md:flex-row md:items-end justify-between pb-8 border-b border-[var(--border)] gap-6">
          <div>
            <span className="font-mono text-xs text-[var(--accent)] tracking-widest block mb-3 uppercase">
              02 // Playground
            </span>
            <h2 className="text-5xl sm:text-6xl lg:text-7xl font-bold font-display text-[var(--heading)] tracking-tight leading-[1.05]">
              Workbench
            </h2>
          </div>
          <p className="font-mono text-xs text-[var(--text-muted)] max-w-sm leading-relaxed">
            An interactive 3D studio of personal tools, creative experiments, and everyday artifacts.
          </p>
        </div>
      </div>

      <div className="relative w-full h-screen bg-[#160c07] text-white font-mono overflow-hidden">
        <WorkbenchCanvas onEnterLab={onEnterLab} />
      </div>
    </section>
  );
}
