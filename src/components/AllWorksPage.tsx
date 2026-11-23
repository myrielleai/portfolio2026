import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import ThemeToggle from "./ThemeToggle";
import { GithubIcon } from "./Icons";
import { worksCategories, type WorkItem } from "../data/worksData";
import ArchiveFooter from "./ArchiveFooter";
import Footer from "./Footer";

const EASE = [0.22, 1, 0.36, 1] as const;

// Every work, in archive order
const categoryTitle = Object.fromEntries(worksCategories.map((c) => [c.id, c.title]));
const allWorks: WorkItem[] = worksCategories.flatMap((c) => c.items);

const hostOf = (item: WorkItem) => {
  try {
    return new URL(item.demoUrl || item.githubUrl || "").hostname.replace(/^www\./, "");
  } catch {
    return "";
  }
};

// Smooth-scroll to a case study (through Lenis when it's running)
const goTo = (id: string) => {
  const el = document.getElementById(id);
  if (!el) return;
  const lenis = (window as unknown as { lenis?: { scrollTo: (t: HTMLElement, o?: { offset?: number }) => void } }).lenis;
  if (lenis) lenis.scrollTo(el, { offset: -96 });
  else el.scrollIntoView({ behavior: "smooth", block: "start" });
};

/* A compact index of everything at the top: tap one to jump to its case study */
function WorksIndex({ ready }: { ready: boolean }) {
  return (
    <nav aria-label="Projects" className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-[repeat(auto-fit,minmax(140px,1fr))]">
      {allWorks.map((item, i) => (
        <motion.button
          key={item.id}
          type="button"
          onClick={() => goTo(`work-${item.id}`)}
          initial={{ opacity: 0, y: 16 }}
          animate={ready ? { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE, delay: 0.35 + i * 0.05 } } : undefined}
          className="group flex flex-col overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)] text-left transition-colors hover:border-[var(--accent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
        >
          <span className="relative block aspect-[16/10] overflow-hidden bg-[var(--surface-muted)]">
            {item.image ? (
              <img src={item.image} alt="" loading="eager" decoding="async" className="absolute inset-0 h-full w-full object-cover object-left-top transition-transform duration-700 group-hover:scale-105" />
            ) : (
              <span className="absolute inset-0"><TitleCard item={item} small /></span>
            )}
          </span>
          <span className="flex items-baseline gap-2 px-3 py-2.5">
            <span className="font-mono text-[10px] text-[var(--text-muted)]">{String(i + 1).padStart(2, "0")}</span>
            <span className="truncate text-sm font-semibold text-[var(--heading)] transition-colors group-hover:text-[var(--accent)]">{item.title}</span>
          </span>
        </motion.button>
      ))}
    </nav>
  );
}

/* For work that has no screenshot yet: a simple title card in the same frame */
function TitleCard({ item, small = false }: { item: WorkItem; small?: boolean }) {
  return (
    <span className="relative flex aspect-[16/10] w-full flex-col items-center justify-center gap-3 overflow-hidden bg-[#0b0b10] px-6 text-center">
      <span aria-hidden className="absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,rgba(147,51,234,0.28),rgba(147,51,234,0)_60%)]" />
      <span className={`relative font-display font-extrabold tracking-[-0.04em] text-white ${small ? "text-lg" : "text-5xl sm:text-6xl"}`}>{item.title}</span>
      {!small && <span className="relative max-w-md text-sm text-white/70">{item.subtitle}</span>}
      {item.inProgress && (
        <span className={`relative rounded-full border border-[#c084fc]/60 font-mono font-semibold uppercase tracking-widest text-[#d8b4fe] ${small ? "px-2 py-0.5 text-[8px]" : "px-3 py-1 text-[10px]"}`}>
          In progress
        </span>
      )}
    </span>
  );
}

/* One project per section: the full screenshot beside its story, alternating sides */
function CaseStudy({ item, index, ready }: { item: WorkItem; index: number; ready: boolean }) {
  const flip = index % 2 === 1;
  const host = hostOf(item);
  const href = item.demoUrl || item.githubUrl;
  const frameClass = `group block overflow-hidden rounded-2xl border border-[var(--border-strong)] bg-[var(--surface)] shadow-[0_30px_70px_-35px_rgba(0,0,0,0.45)] transition-transform duration-500 lg:col-span-7 ${href ? "hover:-translate-y-1" : ""} ${flip ? "lg:order-2" : ""}`;
  const frameInner = (
    <>
      <span className="flex h-8 items-center gap-2 border-b border-[var(--border)] bg-[var(--surface-muted)] px-3">
        <span className="flex gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
        </span>
        <span className="mx-auto truncate font-mono text-[11px] text-[var(--text-muted)]">{host}</span>
        <span className="w-[42px]" />
      </span>
      {item.image ? (
        <img src={item.image} alt={`${item.title} screenshot`} loading={index < 2 ? "eager" : "lazy"} decoding="async" className="block h-auto w-full transition-transform duration-[1200ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.02]" />
      ) : (
        <TitleCard item={item} />
      )}
    </>
  );
  return (
    <motion.article
      id={`work-${item.id}`}
      initial={{ opacity: 0, y: 40 }}
      whileInView={ready ? { opacity: 1, y: 0 } : undefined}
      viewport={{ once: true, margin: "0px 0px -12% 0px" }}
      transition={{ duration: 0.9, ease: EASE }}
      className="grid scroll-mt-28 grid-cols-1 items-center gap-8 border-t border-[var(--border)] py-16 lg:grid-cols-12 lg:gap-14 lg:py-24"
    >
      {/* the work itself: the whole screenshot, uncropped, in a light browser frame (a plain frame,
          not a link, for work that isn't online yet) */}
      {href ? (
        <a href={href} target="_blank" rel="noreferrer" aria-label={`Open ${item.title}`} className={frameClass}>
          {frameInner}
        </a>
      ) : (
        <div className={frameClass}>{frameInner}</div>
      )}

      {/* the story */}
      <div className={`lg:col-span-5 ${flip ? "lg:order-1" : ""}`}>
        <div className="flex flex-wrap items-center gap-2 font-mono text-[11px] uppercase tracking-widest text-[var(--text-muted)]">
          <span className="text-[var(--accent)]">{String(index + 1).padStart(2, "0")}</span>
          <span>/</span>
          <span>{categoryTitle[item.category]}</span>
          {item.date && <span>· {item.date}</span>}
        </div>
        <h2 className="mt-3 font-display text-4xl font-bold leading-[1.05] tracking-tight text-[var(--heading)] sm:text-5xl">{item.title}</h2>
        {item.inProgress && (
          <span className="mt-4 mr-2 inline-block rounded-full border border-[var(--accent)] px-3 py-1 font-mono text-[10px] font-semibold uppercase tracking-widest text-[var(--accent)]">
            In progress
          </span>
        )}
        {item.award && (
          <span className="mt-4 inline-block rounded-full bg-[var(--accent)] px-3 py-1 font-mono text-[10px] font-semibold uppercase tracking-widest text-[var(--on-accent)]">
            {item.award}
          </span>
        )}
        <p className="mt-4 text-xl leading-snug text-[var(--heading)] sm:text-2xl">{item.pitch ?? item.subtitle}</p>
        <p className="mt-4 leading-relaxed text-[var(--text)]">{item.description}</p>

        {item.role && (
          <p className="mt-5 text-sm">
            <span className="font-mono text-[10px] uppercase tracking-widest text-[var(--text-muted)]">My role · </span>
            <span className="font-semibold text-[var(--heading)]">{item.role}</span>
          </p>
        )}

        {item.highlights && item.highlights.length > 0 && (
          <ul className="mt-5 space-y-2">
            {item.highlights.map((h) => (
              <li key={h} className="flex gap-3 text-sm text-[var(--text)]">
                <span aria-hidden className="mt-[7px] h-1.5 w-1.5 flex-none rounded-full bg-[var(--accent)]" />
                <span>{h}</span>
              </li>
            ))}
          </ul>
        )}

        <div className="mt-6 flex flex-wrap gap-1.5">
          {item.tags.map((t) => (
            <span key={t} className="rounded-md border border-[var(--border)] bg-[var(--surface-muted)] px-2 py-1 font-mono text-[10px] uppercase tracking-wider text-[var(--text-muted)]">
              {t}
            </span>
          ))}
        </div>

        <div className="mt-7 flex flex-wrap gap-3">
          {item.demoUrl && (
            <a href={item.demoUrl} target="_blank" rel="noreferrer" className="group inline-flex items-center gap-2 rounded-full bg-[var(--heading)] px-5 py-3 font-mono text-xs font-semibold tracking-wider text-[var(--bg)] transition-colors hover:bg-[var(--accent)] hover:text-[var(--on-accent)]">
              {item.category === "ai" ? "TRY THE DEMO" : "VISIT THE SITE"}
              <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </a>
          )}
          {item.githubUrl && (
            <a href={item.githubUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full border border-[var(--border-strong)] px-5 py-3 font-mono text-xs font-semibold tracking-wider text-[var(--heading)] transition-colors hover:border-[var(--accent)] hover:text-[var(--accent)]">
              <GithubIcon className="h-4 w-4" />
              CODE
            </a>
          )}
          {!item.demoUrl && !item.githubUrl && (
            <span className="font-mono text-xs tracking-wider text-[var(--text-muted)]">DEMO COMING SOON</span>
          )}
        </div>
      </div>
    </motion.article>
  );
}

function WorksShowcase({ ready }: { ready: boolean }) {
  return (
    <div>
      <WorksIndex ready={ready} />
      <div className="mt-14 lg:mt-20">
        {allWorks.map((item, i) => (
          <CaseStudy key={item.id} item={item} index={i} ready={ready} />
        ))}
      </div>
    </div>
  );
}

function WorksFooterSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.85], [1, 0.3]);
  const y = useTransform(scrollYProgress, [0, 0.85], [0, -30]);

  return (
    <div ref={containerRef} className="relative w-full bg-[var(--bg)]">
      {/* Sticky Previous Section: "Let's work together!" */}
      <div className="sticky top-0 z-10 w-full min-h-screen flex flex-col justify-center items-center overflow-hidden bg-[var(--bg)]">
        <motion.div style={{ opacity, y }} className="w-full flex flex-col justify-center items-center">
          <ArchiveFooter />
        </motion.div>
      </div>

      {/* Scroll Buffer: Pinned duration before Footer gets seen */}
      <div className="h-[40vh] pointer-events-none" />

      {/* Homepage Footer sliding UP over the previous section like a photo card */}
      <div className="relative z-20 bg-[var(--bg)] border-t border-[var(--border)] shadow-[0_-25px_60px_rgba(0,0,0,0.06)]">
        <Footer />
      </div>
    </div>
  );
}

export default function AllWorksPage({ ready = true }: { ready?: boolean }) {
  const handleBackToHome = () => {
    window.history.pushState({}, "", "/");
  };

  return (
    <div
      className="min-h-screen w-full font-sans selection:bg-purple-600 selection:text-white antialiased transition-colors duration-300 flex flex-col relative overflow-x-clip bg-[var(--bg)] text-[var(--text)]"
      style={{ backgroundColor: "var(--bg)", color: "var(--text)" }}
    >
      {/* Sticky Header */}
      <header className="sticky top-0 z-50 w-full px-4 sm:px-6 lg:px-12 pt-4 pointer-events-none">
        <div className="max-w-7xl mx-auto rounded-2xl border border-[var(--border)] bg-[var(--scrim)] backdrop-blur-md shadow-sm transition-all duration-300 pointer-events-auto overflow-hidden">
          <div className="px-6 lg:px-8 h-16 flex items-center justify-between">
            
            {/* Left: Back to Home & Title */}
            <div className="flex items-center gap-4 sm:gap-6">
              <button
                onClick={handleBackToHome}
                className="inline-flex items-center gap-2 font-mono text-xs font-semibold tracking-wider text-[var(--text-muted)] hover:text-[var(--heading)] px-3 py-1.5 rounded-lg border border-[var(--border)] hover:border-[var(--border-strong)] bg-[var(--surface-muted)] transition-all duration-200 group"
              >
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-200" />
                <span>HOME</span>
              </button>
              <span className="font-display text-xl sm:text-2xl font-bold tracking-tight text-[var(--heading)]">
                works archive
              </span>
            </div>

            {/* Right: Theme Toggle */}
            <div className="flex items-center gap-3 sm:gap-4">
              <ThemeToggle />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-12 py-10 lg:py-14 flex flex-col justify-start relative z-10 bg-[var(--bg)]">
        
        {/* Page Intro Header - Big PROJECTS matching navbar length */}
        <div className="mb-8 lg:mb-12 w-full flex items-center justify-between font-display font-black text-[120px] sm:text-[150px] md:text-[186px] lg:text-[200px] xl:text-[220px] leading-none text-[var(--heading)] uppercase select-none tracking-tight">
          {"PROJECTS".split("").map((char, index) => (
            <motion.span
              key={index}
              initial={{ opacity: 0, y: -20 }}
              animate={ready ? { opacity: 1, y: 0, transition: { duration: 0.5, delay: 0.15 + index * 0.04 } } : undefined}
              transition={{ type: "spring", stiffness: 400, damping: 18 }}
              whileHover={{
                y: -10,
                scale: 1.15,
                color: "#9333ea",
              }}
              className="inline-block transition-colors duration-200 cursor-default"
            >
              {char}
            </motion.span>
          ))}
        </div>

        {/* An index of everything, then one case study per project */}
        <WorksShowcase ready={ready} />
      </main>

      {/* Big Interactive "Let's Work Together" & Sliding Homepage Footer Curtain */}
      <WorksFooterSection />
    </div>
  );
}



