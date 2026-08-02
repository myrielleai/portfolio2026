import { useRef } from "react";
import { motion, useScroll, useTransform, MotionValue } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { GithubIcon } from "./Icons";
import { portfolioData, type Project } from "../data/portfolioData";

const EASE_CUBIC = [0.22, 1, 0.36, 1] as [number, number, number, number];

interface ProjectCardProps {
  project: Project;
  index: number;
  total: number;
  progress: MotionValue<number>;
}

function ProjectCard({ project, index, total, progress }: ProjectCardProps) {
  const targetUrl = project.demoUrl || project.githubUrl;

  const isLast = index === total - 1;
  
  // Calculate when this card starts scaling down (staggered activation range)
  // Each card scales down only during the scroll window where the next card overlaps it
  const step = 1 / (total - 1 || 1);
  const rangeStart = Math.max(0, index * step - step * 0.2);
  const rangeEnd = Math.min(1, (index + 1) * step);

  // Stacking effect calculations: earlier cards scale down and dim as we scroll through the deck
  const targetScale = 1 - (total - 1 - index) * 0.035;
  const scale = useTransform(progress, [rangeStart, rangeEnd], [1, targetScale]);
  const opacity = useTransform(progress, [rangeStart, rangeEnd], [1, 0.75]);
  const overlayOpacity = useTransform(progress, [rangeStart, rangeEnd], [0, 0.4]);

  // Design board rotations for a tactile stacked layout
  const rotations = [-1.8, 1.2, -1.0, 1.6];
  const rotation = rotations[index % rotations.length];

  return (
    <motion.div
      style={{
        scale: isLast ? 1 : scale,
        opacity: isLast ? 1 : opacity,
        rotate: rotation,
        top: `calc(108px + ${index * 24}px)`,
        zIndex: index + 1,
        willChange: "transform, opacity",
        backfaceVisibility: "hidden",
      }}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.15 }}
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren: 0.12,
          }
        }
      }}
      className="sticky w-full max-w-4xl mx-auto rounded-2xl border-2 border-[var(--border-strong)] bg-[var(--surface)] p-5 sm:p-7 md:p-8 shadow-[0_20px_50px_rgba(0,0,0,0.06)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.4)] overflow-hidden flex flex-col gap-5 md:gap-6 h-auto transform-gpu"
    >
      {/* Subtle overlay to simulate depth as it stacks under other cards */}
      {!isLast && (
        <motion.div 
          style={{ opacity: overlayOpacity }}
          className="absolute inset-0 bg-black/10 dark:bg-black/50 pointer-events-none z-30"
        />
      )}
      
      {/* Top Section: Interactive Image Showcase */}
      {project.image && (
        <motion.div
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: EASE_CUBIC } }
          }}
          className="w-full aspect-[16/10] sm:aspect-[21/9] overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--surface-muted)] cursor-pointer group/img relative z-20"
          onClick={() => {
            if (targetUrl) {
              window.open(targetUrl, "_blank", "noopener,noreferrer");
            }
          }}
        >
          <img
            src={project.image}
            alt={project.title}
            className="w-full h-full object-cover object-top group-hover/img:scale-[1.02] transition-transform duration-[800ms] ease-[cubic-bezier(0.22,1,0.36,1)]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/15 via-transparent to-transparent pointer-events-none" />
        </motion.div>
      )}

      {/* Bottom Section: Info Content */}
      <motion.div 
        variants={{
          hidden: { opacity: 0, y: 20 },
          visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: EASE_CUBIC } }
        }}
        className="w-full flex flex-col gap-4 z-20"
      >
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div className="space-y-1.5">
            <span className="font-mono text-[9px] tracking-wider text-[var(--accent)] uppercase font-semibold block">
              Project {String(index + 1).padStart(2, '0')} // {project.tags[0] || "Showcase"}
            </span>
            <h3 
              className="font-display text-xl sm:text-2xl md:text-3xl font-bold tracking-tight text-[var(--heading)] cursor-pointer hover:text-[var(--accent)] transition-colors duration-300"
              onClick={() => {
                if (targetUrl) {
                  window.open(targetUrl, "_blank", "noopener,noreferrer");
                }
              }}
            >
              {project.title}
            </h3>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noreferrer"
                className="text-[var(--text-muted)] hover:text-[var(--heading)] p-2 rounded-xl border border-[var(--border)] hover:border-[var(--border-strong)] bg-[var(--surface-muted)] transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
                onClick={(e) => e.stopPropagation()}
                aria-label={`GitHub Repository for ${project.title}`}
              >
                <GithubIcon className="w-4 h-4" />
              </a>
            )}
            {project.demoUrl && (
              <a
                href={project.demoUrl}
                target="_blank"
                rel="noreferrer"
                className="text-[var(--text-muted)] hover:text-[var(--heading)] p-2 rounded-xl border border-[var(--border)] hover:border-[var(--border-strong)] bg-[var(--surface-muted)] transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
                onClick={(e) => e.stopPropagation()}
                aria-label={`Live Demo for ${project.title}`}
              >
                <ArrowUpRight className="w-4 h-4" />
              </a>
            )}
          </div>
        </div>

        <p className="text-[var(--text-muted)] text-sm sm:text-base leading-relaxed font-sans max-w-3xl">
          {project.description}
        </p>

        {/* Tech Tags */}
        <div className="flex flex-wrap gap-2 pt-3 border-t border-[var(--border)]/60">
          {project.tags.map((tag, tagIdx) => (
            <span
              key={tagIdx}
              className="font-mono text-[9px] tracking-wider text-[var(--text)] bg-[var(--surface-muted)] border border-[var(--border)] px-2.5 py-1 rounded-md"
            >
              {tag}
            </span>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function Projects() {
  const projects = portfolioData.projects;
  const containerRef = useRef<HTMLDivElement>(null);

  // Track scroll progress of the entire projects list container
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  return (
    <section id="projects" className="w-full py-24 lg:py-32 border-b border-[var(--border)] bg-[var(--bg)] transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 pb-8 border-b border-[var(--border)] gap-6">
          <div>
            <span className="font-mono text-xs text-[var(--accent)] tracking-widest block mb-3 uppercase">
              01 // Portfolio
            </span>
            <h2 className="text-5xl sm:text-6xl lg:text-7xl font-bold font-display text-[var(--heading)] tracking-tight leading-[1.05]">
              Selected Works
            </h2>
          </div>
          <p className="font-mono text-xs text-[var(--text-muted)] max-w-sm leading-relaxed">
            Featured full-stack applications, intelligent AI integrations, and experimental web platforms.
          </p>
        </div>

        {/* 2026 Year Badge centered before Cards */}
        <div className="flex items-center justify-center mb-10 sm:mb-14">
          <div className="flex items-center gap-4">
            <span className="h-[1px] w-12 sm:w-24 bg-gradient-to-r from-transparent via-[var(--border-strong)] to-[var(--border-strong)] opacity-60"></span>
            <span className="font-mono text-sm sm:text-base md:text-lg tracking-[0.3em] font-semibold text-[var(--accent)] px-6 py-2 rounded-full border border-[var(--border-strong)] bg-[var(--surface-muted)] shadow-sm">
              2026
            </span>
            <span className="h-[1px] w-12 sm:w-24 bg-gradient-to-l from-transparent via-[var(--border-strong)] to-[var(--border-strong)] opacity-60"></span>
          </div>
        </div>

        {/* Projects List: Sticky Stacked Cards Deck */}
        <div ref={containerRef} className="relative flex flex-col gap-16 md:gap-24 w-full pb-[10vh]">
          {projects.map((proj, idx) => (
            <ProjectCard
              key={idx}
              project={proj}
              index={idx}
              total={projects.length}
              progress={scrollYProgress}
            />
          ))}
        </div>

        {/* View All Works Button */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ type: "spring", stiffness: 100, damping: 15 }}
          className="mt-20 sm:mt-28 flex justify-center"
        >
          <a
            href={portfolioData.githubUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-3 px-8 py-4 rounded-full border border-[var(--border)] bg-[var(--surface)] font-mono text-xs font-semibold tracking-widest text-[var(--text)] hover:text-[var(--heading)] hover:border-[var(--border-strong)] hover:bg-[var(--surface-muted)] hover:shadow-lg transition-all duration-300 group"
          >
            VIEW ALL WORKS
            <ArrowUpRight className="w-4 h-4 text-[var(--text-muted)] group-hover:text-[var(--heading)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-300" />
          </a>
        </motion.div>

      </div>
    </section>
  );
}
