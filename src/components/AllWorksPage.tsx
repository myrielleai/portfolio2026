import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Sparkles, ExternalLink } from "lucide-react";
import ThemeToggle from "./ThemeToggle";
import { GithubIcon } from "./Icons";
import { worksCategories, type WorkCategory, type WorkItem } from "../data/worksData";

export default function AllWorksPage() {
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);

  const handleBackToHome = () => {
    window.history.pushState({}, "", "/");
  };

  return (
    <div
      className="min-h-screen w-full font-sans selection:bg-[var(--accent)] selection:text-white antialiased transition-colors duration-300 flex flex-col relative overflow-hidden"
      style={{ backgroundColor: "var(--bg)", color: "var(--text)" }}
    >
      {/* Background Ambient Aura & Technical Grid Layer */}
      <div className="absolute inset-0 bg-dot-mesh opacity-40 dark:opacity-25 pointer-events-none [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_85%)] z-0" />
      <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[800px] h-[550px] bg-[var(--accent)]/10 rounded-full blur-[130px] pointer-events-none z-0" />
      <div className="absolute top-1/2 -right-48 w-[600px] h-[600px] bg-amber-500/5 dark:bg-[#9333ea]/10 rounded-full blur-[150px] pointer-events-none z-0" />
      <div className="absolute bottom-0 -left-48 w-[600px] h-[600px] bg-[var(--accent)]/5 rounded-full blur-[150px] pointer-events-none z-0" />

      {/* Sticky Header */}
      <header className="sticky top-0 z-50 w-full px-4 sm:px-6 lg:px-12 pt-4 pointer-events-none">
        <div className="max-w-7xl mx-auto rounded-2xl border border-[var(--border)]/80 bg-[var(--scrim)] backdrop-blur-xl shadow-[0_8px_32px_0_rgba(196,90,60,0.03)] dark:shadow-[0_8px_32px_0_rgba(0,0,0,0.5)] transition-all duration-300 pointer-events-auto overflow-hidden">
          <div className="px-6 lg:px-8 h-16 flex items-center justify-between">
            
            {/* Left: Back to Home & Title */}
            <div className="flex items-center gap-4 sm:gap-6">
              <button
                onClick={handleBackToHome}
                className="inline-flex items-center gap-2 font-mono text-xs font-semibold tracking-wider text-[var(--text-muted)] hover:text-[var(--heading)] px-3 py-1.5 rounded-lg border border-[var(--border)] hover:border-[var(--border-strong)] bg-[var(--surface)] transition-all duration-200 group"
              >
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-200" />
                <span>HOME</span>
              </button>
              <span className="font-display text-xl sm:text-2xl font-bold tracking-tight text-[var(--heading)]">
                works archive
              </span>
            </div>

            {/* Right: Theme Toggle */}
            <div className="flex items-center gap-4">
              <ThemeToggle />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-grow max-w-7xl w-full mx-auto px-6 lg:px-12 py-12 lg:py-16 flex flex-col justify-start relative z-10">

        


        {/* Categories List Container */}
        <div className="w-full flex flex-col divide-y divide-[var(--border)] border-t border-b border-[var(--border)]">
          {worksCategories.map((category: WorkCategory) => {
            const isSelected = selectedCategoryId === category.id;
            const isAnySelected = selectedCategoryId !== null;
            const isFaded = isAnySelected && !isSelected;

            return (
              <motion.div
                key={category.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{
                  opacity: isFaded ? 0.3 : 1,
                  scale: isFaded ? 0.99 : 1,
                  filter: isFaded ? "blur(1px)" : "blur(0px)",
                }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className={`w-full transition-all duration-300 ${
                  isFaded
                    ? "pointer-events-auto hover:opacity-70 cursor-pointer"
                    : "cursor-pointer"
                }`}
                onClick={() => {
                  if (isSelected) {
                    // Toggle off if already selected
                    setSelectedCategoryId(null);
                  } else {
                    setSelectedCategoryId(category.id);
                  }
                }}
              >
                {/* Category Header Bar */}
                <div className="py-6 sm:py-8 flex items-center justify-center gap-4 group/cat">
                  {/* Center: Category Title */}
                  <div className="text-center px-2 sm:px-4">
                    <h2 className={`font-display text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight transition-colors duration-300 ${
                      isSelected ? "text-[var(--accent)]" : "text-[var(--heading)] group-hover/cat:text-[var(--accent)]"
                    }`}>
                      {category.title}
                    </h2>
                  </div>
                </div>

                {/* Expanded Inside Items Area */}
                <AnimatePresence>
                  {isSelected && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                      className="pb-8 pt-2 sm:pb-12 sm:pt-4"
                      onClick={(e) => e.stopPropagation()} // Prevent collapsing when clicking inner card items
                    >
                      {/* Items Grid */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
                        {category.items.map((item: WorkItem, itemIdx: number) => (
                          <motion.div
                            key={item.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: itemIdx * 0.08 }}
                            className="group/item rounded-xl border border-[var(--border)] bg-[var(--surface)] hover:border-[var(--border-strong)] p-5 sm:p-6 flex flex-col justify-between gap-6 transition-all duration-300 hover:shadow-xl"
                          >
                            {/* Card Top: Image / Visual Thumbnail if present */}
                            {item.image && (
                              <div className="w-full aspect-[16/9] rounded-lg overflow-hidden border border-[var(--border)] bg-[var(--surface-muted)] relative group/img">
                                <img
                                  src={item.image}
                                  alt={item.title}
                                  className="w-full h-full object-cover object-top group-hover/item:scale-105 transition-transform duration-500"
                                />
                                <div className="absolute inset-0 bg-black/10 dark:bg-black/40 group-hover/item:opacity-0 transition-opacity duration-300" />
                              </div>
                            )}

                            {/* Card Middle: Content Info */}
                            <div className="space-y-3 text-center">
                              <div className="flex items-center justify-center gap-2">
                                <span className="font-mono text-[10px] tracking-widest text-[var(--accent)] uppercase font-semibold">
                                  {item.date || "2026"}
                                </span>
                                {item.featured && (
                                  <span className="inline-flex items-center gap-1 font-mono text-[9px] tracking-wider px-2 py-0.5 rounded-full border border-amber-500/30 bg-amber-500/10 text-amber-500 uppercase font-semibold">
                                    <Sparkles className="w-2.5 h-2.5" /> FEATURED
                                  </span>
                                )}
                              </div>

                              <h3 className="font-display text-xl sm:text-2xl font-bold text-[var(--heading)] tracking-tight group-hover/item:text-[var(--accent)] transition-colors duration-200">
                                {item.title}
                              </h3>

                              {item.subtitle && (
                                <p className="font-mono text-xs text-[var(--accent)]/90 font-medium">
                                  {item.subtitle}
                                </p>
                              )}

                              <p className="font-sans text-xs sm:text-sm text-[var(--text-muted)] leading-relaxed text-left sm:text-center">
                                {item.description}
                              </p>
                            </div>

                            {/* Card Bottom: Tags & Actions */}
                            <div className="pt-4 border-t border-[var(--border)] flex flex-col gap-4">
                              {/* Tags */}
                              <div className="flex flex-wrap justify-center gap-1.5">
                                {item.tags.map((tag, tagIdx) => (
                                  <span
                                    key={tagIdx}
                                    className="font-mono text-[9px] tracking-wider text-[var(--text-muted)] bg-[var(--surface-muted)] border border-[var(--border)] px-2 py-0.5 rounded-md"
                                  >
                                    {tag}
                                  </span>
                                ))}
                              </div>

                              {/* Action Buttons if available */}
                              <div className="flex items-center justify-center gap-3 pt-1">
                                {item.demoUrl && (
                                  <a
                                    href={item.demoUrl}
                                    target={item.demoUrl.startsWith("/") ? "_self" : "_blank"}
                                    rel="noreferrer"
                                    onClick={(e) => {
                                      if (item.demoUrl?.startsWith("/")) {
                                        e.preventDefault();
                                        window.history.pushState({}, "", item.demoUrl);
                                      }
                                    }}
                                    className="inline-flex items-center gap-1.5 font-mono text-[11px] font-semibold text-[var(--heading)] hover:text-[var(--accent)] px-3 py-1.5 rounded-md border border-[var(--border)] hover:border-[var(--border-strong)] bg-[var(--surface-muted)] transition-colors"
                                  >
                                    <span>DEMO / VIEW</span>
                                    <ExternalLink className="w-3 h-3" />
                                  </a>
                                )}

                                {item.githubUrl && (
                                  <a
                                    href={item.githubUrl}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="inline-flex items-center gap-1.5 font-mono text-[11px] font-semibold text-[var(--text-muted)] hover:text-[var(--heading)] px-3 py-1.5 rounded-md border border-[var(--border)] hover:border-[var(--border-strong)] bg-[var(--surface-muted)] transition-colors"
                                  >
                                    <GithubIcon className="w-3.5 h-3.5" />
                                    <span>CODE</span>
                                  </a>
                                )}
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>

      </main>

      {/* Footer minimal credit */}
      <footer className="w-full border-t border-[var(--border)] py-6 text-center relative z-10">

        <p className="font-mono text-xs text-[var(--text-muted)]">
          Myrielle Portfolio 2026 • Crafted with React, Three.js & Framer Motion
        </p>
      </footer>
    </div>
  );
}
