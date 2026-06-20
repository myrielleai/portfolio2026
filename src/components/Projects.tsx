import { ArrowUpRight } from "lucide-react";
import { GithubIcon } from "./Icons";
import { portfolioData } from "../data/portfolioData";

export default function Projects() {
  const projects = portfolioData.projects;
  console.log('Projects component loaded, count:', projects.length);


  return (
    <section id="projects" className="grid grid-cols-1 lg:grid-cols-12 border-b border-zinc-900 items-stretch">
      {/* Left Column (4 cols) */}
      <div className="lg:col-span-4 border-b lg:border-b-0 lg:border-r border-zinc-900 py-24 lg:py-36 px-8 lg:px-16 bg-black/20 flex flex-col justify-start">
        <span className="font-mono text-xs text-zinc-500 tracking-widest block sticky top-28 reveal">03 // SELECTED WORK</span>
      </div>

      {/* Right Column (8 cols) */}
      <div className="lg:col-span-8 py-24 lg:py-36 px-8 lg:px-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {projects.map((proj, idx) => (
            <a href={proj.demoUrl ?? proj.githubUrl} target="_blank" rel="noreferrer"
              key={idx}
              className="group border border-zinc-900 bg-zinc-950/10 p-8 flex flex-col justify-between min-h-[280px] hover:border-zinc-850 transition-all duration-500 reveal"
            >
                {proj.image && (<img src={proj.image} alt={proj.title} className="w-full h-48 object-cover mb-4 rounded" />)}
              <div>
                {/* Header: Title and Outbound Links */}
                <div className="flex items-start justify-between gap-4">
                  <h3 className="text-white font-display text-lg sm:text-xl font-light tracking-wide group-hover:text-purple-400 transition-colors duration-300">
                    {proj.title}
                  </h3>
                  <div className="flex items-center gap-2">
                    {proj.githubUrl && (
                      <a
                        href={proj.githubUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-zinc-500 hover:text-white transition-colors p-1 border border-zinc-900/50 hover:border-zinc-800 bg-black/20"
                        aria-label={`GitHub Repository for ${proj.title}`}
                      >
                        <GithubIcon className="w-3.5 h-3.5" />
                      </a>
                    )}
                    {proj.demoUrl && (
                      <a
                        href={proj.demoUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-zinc-500 hover:text-white transition-colors p-1 border border-zinc-900/50 hover:border-zinc-800 bg-black/20"
                        aria-label={`Live Demo for ${proj.title}`}
                      >
                        <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300" />
                      </a>
                    )}
                  </div>
                </div>

                {/* Description */}
                <p className="mt-4 text-zinc-400 text-xs sm:text-sm leading-relaxed">
                  {proj.description}
                </p>
              </div>

              {/* Footer: Tech stack capsules */}
              <div className="mt-8 flex flex-wrap gap-1.5 pt-4 border-t border-zinc-900/60">
                {proj.tags.map((tag, tagIdx) => (
                  <span
                    key={tagIdx}
                    className="font-mono text-[9px] text-zinc-500 bg-zinc-950 border border-zinc-900 px-2 py-0.5 rounded-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
