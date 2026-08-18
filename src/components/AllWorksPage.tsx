import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Sparkles, ExternalLink } from "lucide-react";
import ThemeToggle from "./ThemeToggle";
import { GithubIcon } from "./Icons";
import { worksCategories, type WorkCategory, type WorkItem } from "../data/worksData";
import ArchiveFooter from "./ArchiveFooter";

export default function AllWorksPage() {
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);

  const handleBackToHome = () => {
    window.history.pushState({}, "", "/");
  };

  return (
    <div
      className="min-h-screen w-full font-sans selection:bg-[var(--accent)] selection:text-white antialiased transition-colors duration-300 flex flex-col relative overflow-x-hidden"
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
      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-12 py-12 lg:py-16 flex flex-col justify-start relative z-10">
        
        {/* Page Intro Header - Big PROJECTS matching navbar length */}
        <div className="mb-10 lg:mb-14 w-full flex items-center justify-between font-display font-black text-[120px] sm:text-[150px] md:text-[186px] lg:text-[200px] xl:text-[220px] leading-none text-[var(--heading)] uppercase select-none tracking-tight">
          {"PROJECTS".split("").map((char, index) => (
            <motion.span
              key={index}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.04 }}
              whileHover={{
                y: -10,
                scale: 1.15,
                color: "var(--accent)",
              }}
              className="inline-block transition-colors duration-200 cursor-default"
            >
              {char}
            </motion.span>
          ))}
        </div>

        {/* Categories List Container */}
        <div className="w-full flex flex-col gap-4 sm:gap-6">
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
                  opacity: isFaded ? 0.45 : 1,
                  scale: isFaded ? 0.98 : 1,
                  filter: isFaded ? "blur(0.5px)" : "blur(0px)",
                }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className={`w-full transition-all duration-300 relative ${
                  isSelected
                    ? "-mx-4 sm:-mx-8 lg:-mx-16 xl:-mx-28 2xl:-mx-36 w-[calc(100%+2rem)] sm:w-[calc(100%+4rem)] lg:w-[calc(100%+8rem)] xl:w-[calc(100%+14rem)] 2xl:w-[calc(100%+18rem)] rounded-3xl border-2 border-[var(--accent)]/40 bg-[var(--surface)]/95 dark:bg-[#0c0b11]/95 backdrop-blur-2xl shadow-[0_25px_70px_-15px_rgba(147,51,234,0.18)] dark:shadow-[0_25px_70px_-15px_rgba(0,0,0,0.85)] p-6 sm:p-10 lg:p-12 z-30"
                    : isFaded
                    ? "rounded-2xl border border-[var(--border)] bg-[var(--surface)]/60 hover:bg-[var(--surface)] hover:border-[var(--border-strong)] p-6 sm:p-8 cursor-pointer z-10"
                    : "rounded-2xl border border-[var(--border)] bg-[var(--surface)] hover:border-[var(--accent)]/50 hover:shadow-lg p-6 sm:p-8 cursor-pointer z-20 group/cat"
                }`}
                onClick={() => {
                  if (isSelected) {
                    setSelectedCategoryId(null);
                  } else {
                    setSelectedCategoryId(category.id);
                  }
                }}
              >
                {/* Background Ambient Glow for Selected State */}
                {isSelected && (
                  <>
                    <div className="absolute top-0 right-0 w-96 h-96 bg-[var(--accent)]/10 rounded-full blur-[100px] pointer-events-none" />
                    <div className="absolute bottom-0 left-0 w-96 h-96 bg-amber-500/5 dark:bg-[#9333ea]/10 rounded-full blur-[100px] pointer-events-none" />
                  </>
                )}

                {/* Category Header Row */}
                <div className={`flex items-center justify-between relative z-10 ${isSelected ? "border-b border-[var(--border)] pb-6 mb-6" : ""}`}>
                  <h2
                    className={`font-display font-extrabold tracking-tight transition-all duration-300 ${
                      isSelected
                        ? "text-3xl sm:text-5xl lg:text-6xl text-[var(--heading)]"
                        : "text-2xl sm:text-3xl lg:text-4xl text-[var(--heading)] group-hover/cat:text-[var(--accent)]"
                    }`}
                  >
                    {category.title}
                  </h2>
                </div>

                {/* Expanded Inside Items Area */}
                <AnimatePresence>
                  {isSelected && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                      className="relative z-10"
                      onClick={(e) => e.stopPropagation()} // Prevent collapsing when clicking inner card items
                    >
                      {/* Wide Multi-Column Items Grid */}
                      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 sm:gap-8">
                        {category.items.map((item: WorkItem, itemIdx: number) => (
                          <motion.div
                            key={item.id}
                            initial={{ opacity: 0, y: 24 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: itemIdx * 0.07 }}
                            className="group/item rounded-2xl border border-[var(--border)] bg-[var(--surface)] hover:border-[var(--accent)]/60 p-5 sm:p-6 flex flex-col justify-between gap-6 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 relative overflow-hidden"
                          >
                            {/* Card Top: Visual Thumbnail */}
                            {item.image && (
                              <div className="w-full aspect-[16/10] rounded-xl overflow-hidden border border-[var(--border)] bg-[var(--surface-muted)] relative group/img shadow-inner">
                                <img
                                  src={item.image}
                                  alt={item.title}
                                  className="w-full h-full object-cover object-top group-hover/item:scale-105 transition-transform duration-500"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 group-hover/item:opacity-30 transition-opacity duration-300" />
                              </div>
                            )}

                            {/* Card Middle: Info */}
                            <div className="space-y-3">
                              <div className="flex items-center justify-between gap-2">
                                <span className="font-mono text-[10px] tracking-widest text-[var(--accent)] font-semibold uppercase">
                                  {item.date || "2026"}
                                </span>
                                {item.featured && (
                                  <span className="inline-flex items-center gap-1 font-mono text-[9px] tracking-wider px-2.5 py-0.5 rounded-full border border-amber-500/40 bg-amber-500/10 text-amber-500 uppercase font-semibold">
                                    <Sparkles className="w-2.5 h-2.5" /> FEATURED
                                  </span>
                                )}
                              </div>

                              <h3 className="font-display text-lg sm:text-xl font-bold text-[var(--heading)] tracking-tight group-hover/item:text-[var(--accent)] transition-colors duration-200">
                                {item.title}
                              </h3>

                              {item.subtitle && (
                                <p className="font-mono text-xs text-[var(--accent)]/90 font-medium">
                                  {item.subtitle}
                                </p>
                              )}

                              <p className="font-sans text-xs sm:text-sm text-[var(--text-muted)] leading-relaxed">
                                {item.description}
                              </p>
                            </div>

                            {/* Card Bottom: Tags & Actions */}
                            <div className="pt-4 border-t border-[var(--border)] flex flex-col gap-4">
                              {/* Tags */}
                              <div className="flex flex-wrap gap-1.5">
                                {item.tags.map((tag, tagIdx) => (
                                  <span
                                    key={tagIdx}
                                    className="font-mono text-[9.5px] tracking-wider text-[var(--text-muted)] bg-[var(--surface-muted)] border border-[var(--border)] px-2 py-0.5 rounded-md"
                                  >
                                    {tag}
                                  </span>
                                ))}
                              </div>

                              {/* Action Buttons */}
                              <div className="flex items-center gap-2.5 pt-1">
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
                                    className="flex-1 inline-flex items-center justify-center gap-1.5 font-mono text-xs font-semibold text-[var(--heading)] hover:text-white hover:bg-[var(--accent)] px-3 py-2 rounded-lg border border-[var(--border)] hover:border-[var(--accent)] bg-[var(--surface-muted)] transition-all"
                                  >
                                    <span>DEMO / VIEW</span>
                                    <ExternalLink className="w-3.5 h-3.5" />
                                  </a>
                                )}

                                {item.githubUrl && (
                                  <a
                                    href={item.githubUrl}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="inline-flex items-center justify-center gap-1.5 font-mono text-xs font-semibold text-[var(--text-muted)] hover:text-[var(--heading)] px-3 py-2 rounded-lg border border-[var(--border)] hover:border-[var(--border-strong)] bg-[var(--surface-muted)] transition-all"
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

      {/* Big Interactive Footer */}
      <ArchiveFooter />
    </div>
  );
}

