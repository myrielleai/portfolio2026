import { useRef } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { GithubIcon } from "./Icons";
import { portfolioData, type Project } from "../data/portfolioData";

interface ProjectCardProps {
  project: Project;
  index: number;
  total: number;
}

function ProjectCard({ project, index, total }: ProjectCardProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Track scroll relative to the card's containing wrapper
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  // Calculate the scale and y displacement for the stacked scroll reveal effect.
  // The last card scales down less as nothing stacks on top of it.
  const targetScale = index === total - 1 ? 0.95 : 0.9 - (total - index - 1) * 0.015;
  const scale = useTransform(scrollYProgress, [0, 1], [1, targetScale]);
  const y = useTransform(scrollYProgress, [0, 1], [0, -35]);
  
  // Apply a smooth, slightly physical spring easing to the values
  const springConfig = { stiffness: 70, damping: 18, mass: 0.6 };
  const springScale = useSpring(scale, springConfig);
  const springY = useSpring(y, springConfig);

  const isFirst = index === 0;
  const targetUrl = project.demoUrl || project.githubUrl;

  // Variants for the first project card (scroll-triggered variant transition)
  const cardVariants = {
    inactive: {
      borderColor: "var(--border)",
      backgroundColor: "var(--surface)",
      boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
    },
    active: {
      borderColor: "var(--accent)",
      backgroundColor: "var(--surface)",
      boxShadow: "0 20px 45px -15px var(--accent-glow, rgba(147, 51, 234, 0.15))",
      transition: {
        duration: 0.45,
        ease: "easeOut"
      }
    }
  } as const;

  const badgeVariants = {
    inactive: {
      opacity: 0,
      y: -10,
      scale: 0.9
    },
    active: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 120,
        damping: 10,
        delay: 0.1
      }
    }
  } as const;

  const imageVariants = {
    inactive: {
      scale: 1,
      opacity: 0.75,
    },
    active: {
      scale: 1.04,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  } as const;

  const titleVariants = {
    inactive: {
      color: "var(--heading)",
    },
    active: {
      color: "var(--accent)",
      transition: {
        duration: 0.3
      }
    }
  } as const;

  return (
    <div
      ref={containerRef}
      className="relative w-full h-[65vh] sm:h-[75vh] min-h-[500px] sm:min-h-[580px] flex items-start justify-center"
      style={{
        zIndex: index + 1
      }}
    >
      <motion.div
        style={{
          scale: springScale,
          y: springY,
          top: `calc(90px + ${index * 28}px)`,
        }}
        tabIndex={0}
        role="button"
        aria-label={`View ${project.title}`}
        className="sticky w-full flex flex-col md:flex-row border border-[var(--border)] bg-[var(--surface)] rounded-2xl overflow-hidden hover:border-[var(--border-strong)] transition-all duration-300 hover:shadow-2xl cursor-pointer focus:outline-none focus:ring-2 focus:ring-[var(--accent)] group"
        onClick={() => {
          if (targetUrl) {
            window.open(targetUrl, "_blank", "noopener,noreferrer");
          }
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            if (targetUrl) {
              window.open(targetUrl, "_blank", "noopener,noreferrer");
            }
          }
        }}
        {...(isFirst
          ? {
              variants: cardVariants,
              initial: "inactive",
              whileInView: "active",
              viewport: { once: false, amount: 0.4 },
            }
          : {})}
      >
        {/* Left/Image Column */}
        {project.image && (
          <div className="w-full md:w-[45%] h-48 sm:h-56 md:h-auto md:self-stretch overflow-hidden bg-black/40 relative shrink-0">
            {isFirst ? (
              <motion.img
                variants={imageVariants}
                src={project.image}
                alt={project.title}
                className="w-full h-full object-cover object-top"
              />
            ) : (
              <img
                src={project.image}
                alt={project.title}
                className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700 ease-out"
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-[var(--surface)] via-transparent to-transparent opacity-60 md:hidden" />
          </div>
        )}

        {/* Right/Content Column */}
        <div className="w-full flex-grow p-6 sm:p-8 md:p-10 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="space-y-2">
                {isFirst && (
                  <motion.div
                    variants={badgeVariants}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-[var(--accent)]/30 bg-[var(--accent)]/10 font-mono text-[9px] text-[var(--accent)] font-semibold tracking-wider w-fit"
                  >
                    <span className="w-1 h-1 rounded-full bg-[var(--accent)] animate-pulse" />
                    FEATURED WORK
                  </motion.div>
                )}
                {isFirst ? (
                  <motion.h3
                    variants={titleVariants}
                    className="font-display text-2xl sm:text-3xl font-bold tracking-tight"
                  >
                    {project.title}
                  </motion.h3>
                ) : (
                  <h3 className="text-[var(--heading)] font-display text-2xl sm:text-3xl font-bold tracking-tight hover:text-[var(--accent)] transition-colors duration-300">
                    {project.title}
                  </h3>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 shrink-0 relative z-10">
                {project.githubUrl && (
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[var(--text-muted)] hover:text-[var(--heading)] p-2 rounded-lg border border-[var(--border)] hover:border-[var(--border-strong)] bg-[var(--surface-muted)] transition-colors"
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
                    className="text-[var(--text-muted)] hover:text-[var(--heading)] p-2 rounded-lg border border-[var(--border)] hover:border-[var(--border-strong)] bg-[var(--surface-muted)] transition-colors"
                    onClick={(e) => e.stopPropagation()}
                    aria-label={`Live Demo for ${project.title}`}
                  >
                    <ArrowUpRight className="w-4 h-4" />
                  </a>
                )}
              </div>
            </div>

            <p className="text-[var(--text-muted)] text-sm sm:text-base leading-relaxed font-sans">
              {project.description}
            </p>
          </div>

          {/* Footer / Tech Tags */}
          <div className="flex flex-wrap gap-2 pt-4 border-t border-[var(--border)]/60">
            {project.tags.map((tag, tagIdx) => (
              <span
                key={tagIdx}
                className="font-mono text-[10px] text-[var(--text)] bg-[var(--surface-muted)] border border-[var(--border)] px-2.5 py-1 rounded-md"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default function Projects() {
  const projects = portfolioData.projects;

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

        {/* Projects Stack */}
        <div className="relative flex flex-col items-center">
          {projects.map((proj, idx) => (
            <ProjectCard
              key={idx}
              project={proj}
              index={idx}
              total={projects.length}
            />
          ))}
        </div>

        {/* View All Works Button */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ type: "spring", stiffness: 100, damping: 15 }}
          className="mt-16 sm:mt-24 flex justify-center"
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
