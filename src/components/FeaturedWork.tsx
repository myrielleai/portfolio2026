import { motion } from "framer-motion";
import { ArrowUpRight, Check } from "lucide-react";
import { GithubIcon } from "./Icons";
import type { Project } from "../data/portfolioData";

const EASE = [0.22, 1, 0.36, 1] as const;

/** Big, simple highlight card for each project marked `featured`. */
export default function FeaturedWork({ project }: { project: Project; number?: string }) {
  const primaryUrl = project.demoUrl || project.githubUrl;
  // a dark cover (like an app screenshot on its own backdrop) fills the frame; a light one sits padded on white
  const darkCover = !!project.darkImage;
  const img = project.image && (
    <img
      src={project.image}
      alt={project.imageAlt ?? `${project.title} screenshot`}
      loading="lazy"
      decoding="async"
      className={`absolute inset-0 h-full w-full transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.03] ${darkCover ? "object-cover" : "object-contain p-3 sm:p-6"}`}
    />
  );
  const frame = `relative block aspect-[16/10] overflow-hidden lg:aspect-auto lg:min-h-[480px] ${darkCover ? "bg-[#0b0b10]" : "bg-white"}`;

  return (
    <motion.article
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 1, ease: EASE }}
      className="group relative overflow-hidden rounded-3xl [&+&]:mt-8 sm:[&+&]:mt-10 border border-white/20 bg-[var(--surface)] shadow-[0_40px_100px_-30px_rgba(0,0,0,0.6)]"
    >
      <div className="grid lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
        {/* Image — clicks through to the live demo */}
        {primaryUrl ? (
          <a href={primaryUrl} target="_blank" rel="noreferrer" aria-label={`Open ${project.title} live demo`} className={frame}>
            {img}
          </a>
        ) : (
          <div className={frame}>{img}</div>
        )}

        {/* Copy */}
        <div className="flex flex-col justify-center border-t border-[var(--border)] p-6 sm:p-10 lg:border-l lg:border-t-0 lg:p-12">

          {(project.field || project.inProgress) && (
            <div className="mb-5 flex flex-wrap gap-2">
              {project.field && (
                <span className="inline-flex items-center rounded-full bg-[var(--accent)] px-3 py-1 font-mono text-[10px] font-semibold uppercase tracking-widest text-[var(--on-accent)]">
                  {project.field}
                </span>
              )}
              {project.inProgress && (
                <span className="inline-flex items-center rounded-full border border-[var(--accent)] px-3 py-1 font-mono text-[10px] font-semibold uppercase tracking-widest text-[var(--accent)]">
                  In progress
                </span>
              )}
            </div>
          )}

          <h3 className="font-display text-5xl font-bold leading-none tracking-tight text-[var(--heading)] sm:text-6xl">
            {project.title}
          </h3>

          <p className="mt-4 max-w-md font-display text-xl font-medium leading-snug text-[var(--text)] sm:text-2xl">
            {project.tagline ?? project.description}
          </p>

          {project.role && (
            <ul className="mt-7 space-y-2.5">
              {project.role.map((r) => (
                <li key={r} className="flex items-start gap-3 text-[15px] text-[var(--text)]">
                  <span className="mt-0.5 flex h-5 w-5 flex-none items-center justify-center rounded-full bg-[var(--accent)] text-[var(--on-accent)]">
                    <Check className="h-3 w-3" strokeWidth={3} />
                  </span>
                  {r}
                </li>
              ))}
            </ul>
          )}

          {project.stats && (
            <p className="mt-7 flex flex-wrap gap-x-5 gap-y-1 border-t border-[var(--border)] pt-5 font-mono text-[11px] uppercase tracking-wider text-[var(--text-muted)]">
              {project.stats.map((s) => (
                <span key={s.label}>
                  <strong className="font-semibold text-[var(--heading)]">{s.value}</strong> {s.label}
                </span>
              ))}
            </p>
          )}

          <div className="mt-8 flex flex-wrap items-center gap-3">
            {project.demoUrl && (
              <a
                href={project.demoUrl}
                target="_blank"
                rel="noreferrer"
                className="group/link inline-flex items-center gap-2 rounded-full bg-[var(--accent)] px-6 py-3 font-mono text-[11px] font-semibold tracking-widest text-[var(--on-accent)] transition-opacity hover:opacity-90"
              >
                TRY THE LIVE DEMO
                <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover/link:-translate-y-0.5 group-hover/link:translate-x-0.5" />
              </a>
            )}
            {!project.demoUrl && !project.githubUrl && project.inProgress && (
              <span className="font-mono text-[11px] font-semibold uppercase tracking-widest text-[var(--text-muted)]">
                Demo coming soon
              </span>
            )}
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-[var(--border-strong)] px-6 py-3 font-mono text-[11px] font-semibold tracking-widest text-[var(--text)] transition-colors hover:border-[var(--heading)] hover:text-[var(--heading)]"
              >
                <GithubIcon className="h-3.5 w-3.5" />
                SOURCE
              </a>
            )}
          </div>
        </div>
      </div>
    </motion.article>
  );
}
