// src/components/ProjectSpecimenCard.tsx
import type { Project } from "../data/portfolioData";
import DraggableCard from "./DraggableCard";
import TapeCorner from "./TapeCorner";

interface ProjectSpecimenCardProps {
  project: Project;
  index: number;
  initialLeft: number;
  initialTop: number;
  initialRotation: number;
}

export default function ProjectSpecimenCard({
  project,
  index,
  initialLeft,
  initialTop,
  initialRotation,
}: ProjectSpecimenCardProps) {
  // Rotate tape slightly differently
  const tapeColors: Array<"cream" | "coral" | "yellow"> = ["cream", "coral", "yellow"];
  const selectedTapeColor = tapeColors[index % tapeColors.length];

  return (
    <DraggableCard
      initialLeft={initialLeft}
      initialTop={initialTop}
      initialRotation={initialRotation}
      className="w-72"
    >
      <div className="relative bg-[#faf7f0] border border-[#d3cbb3] p-5 shadow-lg rounded-sm overflow-hidden min-h-[200px] flex flex-col justify-between">
        {/* Taped corner (physically styling holding it down) */}
        <TapeCorner color={selectedTapeColor} position={index % 2 === 0 ? "top-left" : "top-right"} />

        <div>
          {/* Header */}
          <div className="flex justify-between items-start mb-2 pt-1">
            <span className="text-[9px] uppercase font-bold tracking-widest text-[#FF8A1E]/80">
              SPECIMEN // 0{index + 1}
            </span>
            <span className="text-[9px] font-mono text-gray-400 border border-gray-300/60 px-1 rounded-sm select-none">
              VER_2.26
            </span>
          </div>

          {/* Title */}
          <h3 className="text-sm font-bold text-gray-800 uppercase tracking-tight mb-2 font-mono">
            {project.title}
          </h3>

          {/* Description */}
          <p className="text-xs text-gray-600 mb-4 leading-relaxed font-mono">
            {project.description}
          </p>
        </div>

        {/* Footer info & Links */}
        <div>
          {/* Tags */}
          <div className="flex flex-wrap gap-1 mb-3">
            {project.tags.map((tag) => (
              <span
                key={tag}
                className="text-[9px] font-mono bg-[#FF8A1E]/10 text-[#FF8A1E] px-1.5 py-0.5 rounded-sm"
              >
                #{tag.toLowerCase()}
              </span>
            ))}
          </div>

          {/* Links styled as mechanical buttons */}
          <div className="flex gap-2 pt-2 border-t border-dashed border-gray-300">
            {project.demoUrl && (
              <a
                href={project.demoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[10px] font-mono font-bold text-gray-700 hover:text-[#FF8A1E] flex items-center gap-1 border border-gray-300 hover:border-[#FF8A1E] px-2 py-1 rounded bg-[#fffdfa] transition-all"
              >
                LAUNCH ↗
              </a>
            )}
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[10px] font-mono font-bold text-gray-700 hover:text-[#FF8A1E] flex items-center gap-1 border border-gray-300 hover:border-[#FF8A1E] px-2 py-1 rounded bg-[#fffdfa] transition-all"
              >
                SOURCE ↗
              </a>
            )}
          </div>
        </div>
      </div>
    </DraggableCard>
  );
}
