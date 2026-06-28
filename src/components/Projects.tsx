import { ArrowUpRight } from "lucide-react";
import { GithubIcon } from "./Icons";
import { portfolioData } from "../data/portfolioData";

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
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-display text-[var(--heading)] tracking-tight">
              Selected Works
            </h2>
          </div>
          <p className="font-mono text-xs text-[var(--text-muted)] max-w-sm leading-relaxed">
            Featured full-stack applications, intelligent AI integrations, and experimental web platforms.
          </p>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          {projects.map((proj, idx) => {
            const targetUrl = proj.demoUrl || proj.githubUrl;
            return (
              <div
                key={idx}
                tabIndex={0}
                role="button"
                aria-label={`View ${proj.title}`}
                className="group border border-[var(--border)] bg-[var(--surface)] rounded-xl overflow-hidden flex flex-col justify-between hover:border-[var(--border-strong)] transition-all duration-500 hover:shadow-2xl reveal cursor-pointer focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
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
              >
                <div>
                  {/* Visual Image Preview */}
                  {proj.image && (
                    <div className="w-full h-64 sm:h-72 overflow-hidden bg-black/40 relative">
                      <img
                        src={proj.image}
                        alt={proj.title}
                        className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700 ease-out"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[var(--surface)] via-transparent to-transparent opacity-60" />
                    </div>
                  )}

                  {/* Content Details */}
                  <div className="p-6 sm:p-8 space-y-4">
                    <div className="flex items-start justify-between gap-4">
                      <h3 className="text-[var(--heading)] font-display text-xl sm:text-2xl font-bold tracking-tight group-hover:text-[var(--accent)] transition-colors duration-300">
                        {proj.title}
                      </h3>
                      
                      <div className="flex items-center gap-2 shrink-0">
                        {proj.githubUrl && (
                          <a
                            href={proj.githubUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="text-[var(--text-muted)] hover:text-[var(--heading)] p-2 rounded-lg border border-[var(--border)] hover:border-[var(--border-strong)] bg-[var(--surface-muted)] transition-colors relative z-10"
                            onClick={(e) => e.stopPropagation()}
                            aria-label={`GitHub Repository for ${proj.title}`}
                          >
                            <GithubIcon className="w-4 h-4" />
                          </a>
                        )}
                        {proj.demoUrl && (
                          <a
                            href={proj.demoUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="text-[var(--text-muted)] hover:text-[var(--heading)] p-2 rounded-lg border border-[var(--border)] hover:border-[var(--border-strong)] bg-[var(--surface-muted)] transition-colors relative z-10"
                            onClick={(e) => e.stopPropagation()}
                            aria-label={`Live Demo for ${proj.title}`}
                          >
                            <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300" />
                          </a>
                        )}
                      </div>
                    </div>

                    <p className="text-[var(--text-muted)] text-sm sm:text-base leading-relaxed font-sans">
                      {proj.description}
                    </p>
                  </div>
                </div>

                {/* Card Footer: Tech Tags */}
                <div className="px-6 sm:px-8 pb-6 sm:pb-8 pt-4 flex flex-wrap gap-2 border-t border-[var(--border)]/60">
                  {proj.tags.map((tag, tagIdx) => (
                    <span
                      key={tagIdx}
                      className="font-mono text-[10px] text-[var(--text)] bg-[var(--surface-muted)] border border-[var(--border)] px-2.5 py-1 rounded-md"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
