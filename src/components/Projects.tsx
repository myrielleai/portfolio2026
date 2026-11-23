import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight, Lock, Trophy } from "lucide-react";
import { GithubIcon } from "./Icons";
import FeaturedWork from "./FeaturedWork";
import { portfolioData, type Project } from "../data/portfolioData";

const EASE = [0.22, 1, 0.36, 1] as const;

const GROUPS: { id: Project["category"]; label: string; title: string }[] = [
  { id: "ai", label: "Specialty", title: "AI & Machine Learning" },
  { id: "web", label: "Also building", title: "Web & Full-Stack" },
];

/* ------------------------------------------------------------------ */
/* Project cards: screenshot tiles in mini browser frames (the phone    */
/* layout of the Web & Full-Stack story below)                         */
/* ------------------------------------------------------------------ */
const hostOf = (project: Project) => {
  try {
    const u = new URL(project.demoUrl || project.githubUrl || "");
    return (u.hostname + (project.demoUrl ? "" : u.pathname)).replace(/^www\./, "");
  } catch {
    return "";
  }
};

function ShotTile({ project, index, className, big = false }: { project: Project; index: number; className: string; big?: boolean }) {
  const href = project.demoUrl || project.githubUrl;
  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
      transition={{ duration: 0.8, ease: EASE, delay: (index % 6) * 0.06 }}
      className={`group relative flex min-h-[240px] flex-col overflow-hidden rounded-2xl border border-[var(--border-strong)] bg-[var(--surface)] shadow-[0_18px_40px_-28px_rgba(0,0,0,0.35)] transition-[transform,box-shadow] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1 hover:shadow-[0_30px_60px_-30px_rgba(0,0,0,0.45)] ${className}`}
    >
      <a
        href={href}
        target="_blank"
        rel="noreferrer"
        aria-label={`Open ${project.title}`}
        className="absolute inset-0 z-10 rounded-2xl outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
      />
      {/* mini browser bar */}
      <div className="flex h-7 flex-none items-center gap-2 border-b border-[var(--border)] bg-[var(--surface-muted)] px-3">
        <span className="flex gap-1">
          <span className="h-2 w-2 rounded-full bg-[#ff5f57]" />
          <span className="h-2 w-2 rounded-full bg-[#febc2e]" />
          <span className="h-2 w-2 rounded-full bg-[#28c840]" />
        </span>
        <span className="mx-auto flex min-w-0 items-center gap-1 truncate font-mono text-[10px] text-[var(--text-muted)]">
          <Lock className="h-2.5 w-2.5 flex-none opacity-60" />
          <span className="truncate">{hostOf(project)}</span>
        </span>
        <span className="w-[30px]" />
      </div>

      {/* screenshot */}
      <div className="relative min-h-0 flex-1 overflow-hidden bg-[var(--surface-muted)]">
        {project.image && (
          <img
            src={project.pageImage || project.image}
            alt=""
            loading="lazy"
            decoding="async"
            className={`absolute inset-0 h-full w-full object-cover object-top transition-[object-position,transform] ease-[cubic-bezier(0.45,0,0.25,1)] group-hover:object-bottom ${
              project.pageImage ? "duration-[5000ms]" : "duration-[1800ms] group-hover:scale-[1.05]"
            }`}
          />
        )}
        {/* caption over a soft gradient */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 via-black/35 to-transparent px-5 pb-4 pt-16 text-white">
          <div className="flex flex-wrap items-center gap-2">
            <h4 className={`font-display font-bold tracking-tight ${big ? "text-2xl sm:text-3xl" : "text-lg"}`}>{project.title}</h4>
            {project.isNew && (
              <span className="rounded-full bg-[var(--accent)] px-2 py-0.5 font-mono text-[9px] font-semibold uppercase tracking-widest text-[var(--on-accent)]">New</span>
            )}
          </div>
          <p className="mt-0.5 text-[13px] text-white/80">{project.subtitle}</p>
          <p className="mt-1 max-h-0 overflow-hidden font-mono text-[10px] uppercase tracking-wider text-white/70 opacity-0 transition-all duration-500 group-hover:max-h-6 group-hover:opacity-100">
            {project.tags.slice(0, big ? 5 : 3).join(" · ")}
          </p>
        </div>
        {project.githubUrl && project.demoUrl && (
          <a
            href={project.githubUrl}
            target="_blank"
            rel="noreferrer"
            aria-label={`${project.title} source code`}
            className="absolute right-3 top-3 z-20 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-zinc-900 shadow-sm transition-all duration-300 [@media(hover:hover)]:translate-y-1 [@media(hover:hover)]:opacity-0 group-hover:translate-y-0 group-hover:opacity-100 focus-visible:translate-y-0 focus-visible:opacity-100"
          >
            <GithubIcon className="h-3.5 w-3.5" />
          </a>
        )}
      </div>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/* Web & Full-Stack as a sticky story: on wide screens the left side    */
/* holds one project's details in place while the screenshots scroll   */
/* past on the right, and the details switch as each screenshot        */
/* reaches the middle of the screen. Phones get a simple card stack.   */
/* ------------------------------------------------------------------ */
function WebStory({ projects }: { projects: Project[] }) {
  const [active, setActive] = useState(0);
  const frames = useRef<(HTMLDivElement | null)[]>([]);

  // whichever screenshot is crossing the middle band of the screen is the one being told
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(Number((e.target as HTMLElement).dataset.index));
        });
      },
      { rootMargin: "-45% 0px -45% 0px" }
    );
    frames.current.forEach((el) => el && io.observe(el));
    return () => io.disconnect();
  }, [projects.length]);

  const p = projects[active];
  // an award-winning project lights the whole story up in gold while it's the one being told
  // ("3rd of 37 · Hackathon" → a big "3rd" with "of 37 teams · Hackathon" under it)
  const winner = projects.find((x) => x.award);
  const aw = winner?.award?.match(/^(\S+)\s+of\s+(\d+)\s*·?\s*(.*)$/);
  const awardOn = !!p.award;

  return (
    <>
      {/* Wide screens: the sticky story */}
      <div className="relative hidden lg:block">
      {winner && (
        <div aria-hidden className="pointer-events-none absolute inset-y-0 left-1/2 w-screen -translate-x-1/2">
          <div
            className={`sticky top-0 h-screen overflow-hidden transition-opacity duration-[900ms] ease-out ${awardOn ? "opacity-100" : "opacity-0"}`}
            style={{
              background:
                "radial-gradient(ellipse 60% 70% at 30% 45%, var(--award-glow) 0%, transparent 70%), radial-gradient(ellipse 50% 60% at 75% 60%, var(--award-glow-2) 0%, transparent 70%), var(--award-bg)",
            }}
          >
            {/* the placing, huge and faint, behind the story */}
            <div className={`absolute bottom-[3vh] right-[3vw] select-none transition-transform duration-[1200ms] ease-[cubic-bezier(0.22,1,0.36,1)] ${awardOn ? "translate-y-0" : "translate-y-16"}`}>
              <span className="block font-display text-[34vh] font-extrabold leading-[0.8] tracking-[-0.06em] text-transparent [-webkit-text-stroke:2px_var(--award-ink)] opacity-60">
                {aw ? aw[1] : "Top 3"}
              </span>
            </div>
            {/* a slow shimmer of gold flecks */}
            <div className="award-flecks absolute inset-0" />
          </div>
        </div>
      )}
      <div className="relative z-10 lg:grid lg:grid-cols-12 lg:gap-14">
        <div className="lg:col-span-5">
          <div className="sticky top-0 flex h-screen flex-col justify-center py-24">
            <AnimatePresence mode="wait">
              <motion.div
                key={p.title}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.45, ease: EASE }}
              >
                <div className="flex flex-wrap items-center gap-2">
                  <h4 className="font-display text-5xl font-bold leading-[1.02] tracking-tight text-[var(--heading)]">{p.title}</h4>
                  {p.isNew && (
                    <span className="rounded-full bg-[var(--accent)] px-2 py-0.5 font-mono text-[9px] font-semibold uppercase tracking-widest text-[var(--on-accent)]">New</span>
                  )}
                </div>
                {p.award && (
                  <div className="mt-5 flex items-center gap-4">
                    <span className="flex h-12 w-12 flex-none items-center justify-center rounded-full bg-[var(--award-solid)] text-[#2a1a00] shadow-[0_0_30px_var(--award-glow)]">
                      <Trophy className="h-6 w-6" strokeWidth={2.2} />
                    </span>
                    <span className="leading-tight">
                      <span className="block font-display text-2xl font-bold text-[var(--heading)]">
                        {aw ? `${aw[1]} place` : p.award}
                      </span>
                      {aw && (
                        <span className="block font-mono text-[11px] uppercase tracking-widest text-[var(--award-text)]">
                          out of {aw[2]} teams{aw[3] ? ` · ${aw[3]}` : ""}
                        </span>
                      )}
                    </span>
                  </div>
                )}
                <p className="mt-4 text-xl leading-snug text-[var(--heading)]">{p.subtitle}</p>
                <p className="mt-3 line-clamp-4 leading-relaxed text-[var(--text)]">{p.description}</p>
                <div className="mt-5 flex flex-wrap gap-1.5">
                  {p.tags.slice(0, 6).map((t) => (
                    <span key={t} className="rounded-md border border-[var(--border)] bg-[var(--surface-muted)] px-2 py-1 font-mono text-[10px] uppercase tracking-wider text-[var(--text-muted)]">
                      {t}
                    </span>
                  ))}
                </div>
                <div className="mt-7 flex flex-wrap gap-3">
                  {p.demoUrl && (
                    <a href={p.demoUrl} target="_blank" rel="noreferrer" className="group inline-flex items-center gap-2 rounded-full bg-[var(--heading)] px-5 py-3 font-mono text-xs font-semibold tracking-wider text-[var(--bg)] transition-colors hover:bg-[var(--accent)] hover:text-[var(--on-accent)]">
                      VISIT THE SITE
                      <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                    </a>
                  )}
                  {p.githubUrl && (
                    <a href={p.githubUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full border border-[var(--border-strong)] px-5 py-3 font-mono text-xs font-semibold tracking-wider text-[var(--heading)] transition-colors hover:border-[var(--accent)] hover:text-[var(--accent)]">
                      <GithubIcon className="h-4 w-4" />
                      CODE
                    </a>
                  )}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* the screenshots, one per screen height, scrolling past the sticky side */}
        <div className="lg:col-span-7">
          {projects.map((proj, i) => (
            <div
              key={proj.title}
              ref={(el) => { frames.current[i] = el; }}
              data-index={i}
              className="flex min-h-[80vh] items-center first:min-h-[90vh] last:min-h-[90vh]"
            >
              <a
                href={proj.demoUrl || proj.githubUrl}
                target="_blank"
                rel="noreferrer"
                aria-label={`Open ${proj.title}`}
                className={`group block w-full overflow-hidden rounded-2xl border bg-[var(--surface)] shadow-[0_30px_70px_-35px_rgba(0,0,0,0.45)] transition-[transform,opacity,border-color] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${i === active ? (proj.award ? "border-[var(--award-solid)] opacity-100 shadow-[0_30px_90px_-30px_var(--award-glow)]" : "border-[var(--accent)] opacity-100") : "scale-[0.96] border-[var(--border-strong)] opacity-50"}`}
              >
                <span className="flex h-8 items-center gap-2 border-b border-[var(--border)] bg-[var(--surface-muted)] px-3">
                  <span className="flex gap-1.5">
                    <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
                    <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
                    <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
                  </span>
                  <span className="mx-auto flex min-w-0 items-center gap-1 truncate font-mono text-[11px] text-[var(--text-muted)]">
                    <Lock className="h-2.5 w-2.5 flex-none opacity-60" />
                    <span className="truncate">{hostOf(proj)}</span>
                  </span>
                  <span className="w-[42px]" />
                </span>
                {proj.image && (
                  <img src={proj.image} alt={`${proj.title} screenshot`} loading="lazy" decoding="async" className="block h-auto w-full" />
                )}
              </a>
            </div>
          ))}
        </div>
      </div>
      </div>

      {/* Phones and tablets: a plain stack of cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:hidden">
        {projects.map((proj, i) => (
          <ShotTile key={proj.title} project={proj} index={i} className="min-h-[280px]" />
        ))}
      </div>
    </>
  );
}

function GroupHeading({ title, count, onPurple = false }: { title: string; count: number; onPurple?: boolean }) {
  return (
    <div className={`mb-8 flex flex-col items-center gap-2 border-b pb-6 text-center sm:mb-10 ${onPurple ? "border-[var(--on-ai-band)]/15" : "border-[var(--border)]"}`}>
      <div>
        <h3 className={`font-display text-3xl font-bold tracking-tight sm:text-4xl ${onPurple ? "!text-[var(--on-ai-band)]" : "text-[var(--heading)]"}`}>{title}</h3>
      </div>
      <span className={`font-mono text-xs tabular-nums ${onPurple ? "text-[var(--on-ai-band)]/60" : "text-[var(--text-muted)]"}`}>
        {String(count).padStart(2, "0")} {count === 1 ? "project" : "projects"}
      </span>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Section                                                             */
/* ------------------------------------------------------------------ */
export default function Projects() {
  const projects = portfolioData.projects;

  return (
    <section
      id="projects"
      className="w-full overflow-x-clip border-b border-[var(--border)] bg-[var(--bg)] py-24 transition-colors duration-300 lg:py-36"
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-12">
        {/* Header */}
        <div className="mb-16 lg:mb-20">
          <div>
            <span className="mb-3 block font-mono text-xs uppercase tracking-widest text-[var(--accent)]">
              01 // Portfolio
            </span>
            <h2 className="font-display text-5xl font-bold leading-[1.05] tracking-tight text-[var(--heading)] sm:text-6xl lg:text-8xl">
              Selected Works
            </h2>
          </div>
        </div>

        {/* Groups */}
        <div className="space-y-20 lg:space-y-28">
          {GROUPS.map((group) => {
            const items = projects.filter((p) => p.category === group.id);
            if (!items.length) return null;
            const featured = items.filter((p) => p.featured);
            const rest = items.filter((p) => !p.featured);
            const isAi = group.id === "ai";

            return (
              <div key={group.id} className={isAi ? "relative flex min-h-screen flex-col justify-center py-16 lg:py-24" : ""}>
                {/* Full-width purple band behind the AI group */}
                {isAi && (
                  <div
                    aria-hidden
                    className="absolute inset-y-0 left-1/2 w-screen -translate-x-1/2 bg-[var(--ai-band)] transition-colors duration-300"
                  />
                )}
                <div className="relative">
                <GroupHeading title={group.title} count={items.length} onPurple={isAi} />

                {featured.map((p, i) => (
                  <FeaturedWork key={p.title} project={p} number={String(i + 1).padStart(2, "0")} />
                ))}

                {rest.length > 0 && (
                  <WebStory projects={rest} />
                )}
                </div>
              </div>
            );
          })}
        </div>

        {/* View all */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.8, ease: EASE }}
          className="mt-16 flex justify-center sm:mt-24"
        >
          <button
            onClick={() => {
              // so the browser's back button lands on this section again, not the top of the page
              try { sessionStorage.setItem("return-to", "projects-cta"); } catch { /* no storage: back goes to the top */ }
              window.history.pushState({}, "", "/works");
            }}
            id="projects-cta"
            className="group inline-flex cursor-pointer items-center gap-3 rounded-full border border-[var(--border)] bg-[var(--surface)] px-8 py-4 font-mono text-xs font-semibold tracking-widest text-[var(--text)] transition-all duration-300 hover:border-[var(--accent)] hover:bg-[var(--accent)] hover:text-[var(--on-accent)]"
          >
            VIEW ALL WORKS
            <ArrowUpRight className="h-4 w-4 text-[var(--text-muted)] transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[var(--on-accent)]" />
          </button>
        </motion.div>
      </div>
    </section>
  );
}
