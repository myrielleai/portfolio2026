import { useState, useRef } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { ArrowLeft, Sparkles, ExternalLink, Box, LayoutGrid } from "lucide-react";
import ThemeToggle from "./ThemeToggle";
import { GithubIcon } from "./Icons";
import { worksCategories, type WorkCategory, type WorkItem } from "../data/worksData";
import ArchiveFooter from "./ArchiveFooter";
import Footer from "./Footer";
import UnseenProjectsShowcase from "./UnseenProjectsShowcase";

function WorksFooterSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const scale = useTransform(scrollYProgress, [0, 0.85], [1, 0.92]);
  const opacity = useTransform(scrollYProgress, [0, 0.85], [1, 0.3]);
  const y = useTransform(scrollYProgress, [0, 0.85], [0, -30]);

  return (
    <div ref={containerRef} className="relative w-full bg-white">
      {/* Sticky Previous Section: "Let's work together!" */}
      <div className="sticky top-0 z-10 w-full min-h-screen flex flex-col justify-center items-center overflow-hidden bg-white">
        <motion.div style={{ scale, opacity, y }} className="w-full flex flex-col justify-center items-center">
          <ArchiveFooter />
        </motion.div>
      </div>

      {/* Homepage Footer sliding UP over the previous section like a photo card */}
      <div className="relative z-20 bg-white border-t border-zinc-200 shadow-[0_-25px_60px_rgba(0,0,0,0.06)]">
        <Footer />
      </div>
    </div>
  );
}

export default function AllWorksPage() {
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>("websites");
  const [fullscreenCategoryId, setFullscreenCategoryId] = useState<string | null>(null);
  const [categoryViewModes, setCategoryViewModes] = useState<Record<string, "3d" | "grid">>({});

  const handleBackToHome = () => {
    window.history.pushState({}, "", "/");
  };

  const activeFullscreenCategory = worksCategories.find((cat) => cat.id === fullscreenCategoryId);

  const toggleCategoryViewMode = (catId: string, mode: "3d" | "grid") => {
    setCategoryViewModes((prev) => ({
      ...prev,
      [catId]: mode,
    }));
  };

  return (
    <div
      className="min-h-screen w-full font-sans selection:bg-purple-600 selection:text-white antialiased transition-colors duration-300 flex flex-col relative overflow-x-clip bg-white text-zinc-900"
      style={{ backgroundColor: "#ffffff", color: "#0a0a0a" }}
    >
      {/* Fullscreen Unseen Studio 3D Showcase overlay when activated */}
      <AnimatePresence>
        {activeFullscreenCategory && (
          <UnseenProjectsShowcase
            category={activeFullscreenCategory}
            categories={worksCategories}
            onSelectCategory={(id) => setFullscreenCategoryId(id)}
            onClose={() => setFullscreenCategoryId(null)}
          />
        )}
      </AnimatePresence>

      {/* Sticky Header */}
      <header className="sticky top-0 z-50 w-full px-4 sm:px-6 lg:px-12 pt-4 pointer-events-none">
        <div className="max-w-7xl mx-auto rounded-2xl border border-zinc-200 bg-white/85 backdrop-blur-xl shadow-sm transition-all duration-300 pointer-events-auto overflow-hidden">
          <div className="px-6 lg:px-8 h-16 flex items-center justify-between">
            
            {/* Left: Back to Home & Title */}
            <div className="flex items-center gap-4 sm:gap-6">
              <button
                onClick={handleBackToHome}
                className="inline-flex items-center gap-2 font-mono text-xs font-semibold tracking-wider text-zinc-600 hover:text-zinc-900 px-3 py-1.5 rounded-lg border border-zinc-200 hover:border-zinc-300 bg-zinc-50 transition-all duration-200 group"
              >
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-200" />
                <span>HOME</span>
              </button>
              <span className="font-display text-xl sm:text-2xl font-bold tracking-tight text-zinc-900">
                works archive
              </span>
            </div>

            {/* Right: Fullscreen 3D Launcher & Theme Toggle */}
            <div className="flex items-center gap-3 sm:gap-4">
              <button
                onClick={() => setFullscreenCategoryId(worksCategories[0].id)}
                className="inline-flex items-center gap-2 font-mono text-xs font-bold tracking-wider text-white bg-purple-600 hover:bg-purple-700 px-3.5 py-1.5 rounded-xl shadow-md transition-all duration-200"
              >
                <Box className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">FULLSCREEN UNSEEN 3D</span>
              </button>
              <ThemeToggle />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-12 py-10 lg:py-14 flex flex-col justify-start relative z-10 bg-white">
        
        {/* Page Intro Header - Big PROJECTS matching navbar length */}
        <div className="mb-8 lg:mb-12 w-full flex items-center justify-between font-display font-black text-[120px] sm:text-[150px] md:text-[186px] lg:text-[200px] xl:text-[220px] leading-none text-zinc-900 uppercase select-none tracking-tight">
          {"PROJECTS".split("").map((char, index) => (
            <motion.span
              key={index}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.04 }}
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

        {/* Categories List */}
        <div className="w-full flex flex-col gap-6">
          {worksCategories.map((category: WorkCategory) => {
            const isSelected = selectedCategoryId === category.id;
            const isAnySelected = selectedCategoryId !== null;
            const isFaded = isAnySelected && !isSelected;
            const currentViewMode = categoryViewModes[category.id] || "3d";

            return (
              <motion.div
                key={category.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{
                  opacity: isFaded ? 0.45 : 1,
                  scale: isFaded ? 0.98 : 1,
                }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className="w-full relative z-30 py-2 bg-white"
              >
                {/* View Controls Header Bar */}
                <div className="flex items-center justify-end gap-2 mb-4 relative z-10">
                  <div className="flex items-center gap-1 p-1 rounded-xl bg-zinc-100 border border-zinc-200">
                    <button
                      onClick={() => toggleCategoryViewMode(category.id, "3d")}
                      className={`inline-flex items-center gap-1.5 font-mono text-xs font-semibold px-3 py-1.5 rounded-lg transition-all ${
                        currentViewMode === "3d"
                          ? "bg-purple-600 text-white shadow-sm font-bold"
                          : "text-zinc-600 hover:text-zinc-900"
                      }`}
                    >
                      <Box className="w-3.5 h-3.5" />
                      <span>3D UNSEEN</span>
                    </button>
                    <button
                      onClick={() => toggleCategoryViewMode(category.id, "grid")}
                      className={`inline-flex items-center gap-1.5 font-mono text-xs font-semibold px-3 py-1.5 rounded-lg transition-all ${
                        currentViewMode === "grid"
                          ? "bg-purple-600 text-white shadow-sm font-bold"
                          : "text-zinc-600 hover:text-zinc-900"
                      }`}
                    >
                      <LayoutGrid className="w-3.5 h-3.5" />
                      <span>GRID</span>
                    </button>
                  </div>

                  <button
                    onClick={() => setFullscreenCategoryId(category.id)}
                    className="inline-flex items-center gap-1.5 font-mono text-xs font-bold text-white bg-zinc-900 hover:bg-purple-600 px-3.5 py-2 rounded-xl transition-all shadow-sm"
                    title="Expand Fullscreen 3D Scene"
                  >
                    <Box className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">FULLSCREEN</span>
                  </button>
                </div>

                {/* Expanded Area */}
                <AnimatePresence>
                  {isSelected && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                      className="relative z-10"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {/* Embedded Unseen Studio 3D Multi-Plane Scene */}
                      {currentViewMode === "3d" && (
                        <div className="mb-10">
                          <UnseenProjectsShowcase
                            category={category}
                            categories={worksCategories}
                            onSelectCategory={(id) => {
                              setSelectedCategoryId(id);
                              toggleCategoryViewMode(id, "3d");
                            }}
                            onClose={() => setSelectedCategoryId(null)}
                            embedded={true}
                            onToggleFullscreen={() => setFullscreenCategoryId(category.id)}
                          />
                        </div>
                      )}

                      {/* Wide Multi-Column Items Grid */}
                      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 sm:gap-8">
                        {category.items.map((item: WorkItem, itemIdx: number) => (
                          <motion.div
                            key={item.id}
                            initial={{ opacity: 0, y: 24 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: itemIdx * 0.07 }}
                            className="group/item rounded-2xl border border-zinc-200 bg-white hover:border-purple-500/60 p-5 sm:p-6 flex flex-col justify-between gap-6 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 relative overflow-hidden"
                          >
                            {/* Card Top: Visual Thumbnail */}
                            {item.image && (
                              <div className="w-full aspect-[16/10] rounded-xl overflow-hidden border border-zinc-200 bg-zinc-50 relative group/img shadow-sm">
                                <img
                                  src={item.image}
                                  alt={item.title}
                                  className="w-full h-full object-cover object-top group-hover/item:scale-105 transition-transform duration-500"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-40 group-hover/item:opacity-20 transition-opacity duration-300" />
                              </div>
                            )}

                            {/* Card Middle: Info */}
                            <div className="space-y-3">
                              <div className="flex items-center justify-between gap-2">
                                <span className="font-mono text-[10px] tracking-widest text-purple-700 font-bold uppercase">
                                  {item.date || "2026"}
                                </span>
                                {item.featured && (
                                  <span className="inline-flex items-center gap-1 font-mono text-[9px] tracking-wider px-2.5 py-0.5 rounded-full border border-amber-500/40 bg-amber-50 text-amber-700 uppercase font-bold">
                                    <Sparkles className="w-2.5 h-2.5" /> FEATURED
                                  </span>
                                )}
                              </div>

                              <h3 className="font-display text-lg sm:text-xl font-bold text-zinc-900 tracking-tight group-hover/item:text-purple-600 transition-colors duration-200">
                                {item.title}
                              </h3>

                              {item.subtitle && (
                                <p className="font-mono text-xs text-purple-600 font-semibold">
                                  {item.subtitle}
                                </p>
                              )}

                              <p className="font-sans text-xs sm:text-sm text-zinc-600 leading-relaxed">
                                {item.description}
                              </p>
                            </div>

                            {/* Card Bottom: Actions */}
                            <div className="pt-4 border-t border-zinc-100">
                              {/* Action Buttons */}
                              <div className="flex items-center gap-2.5">
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
                                    className="flex-1 inline-flex items-center justify-center gap-1.5 font-mono text-xs font-semibold text-zinc-900 hover:text-white hover:bg-purple-600 px-3 py-2 rounded-lg border border-zinc-200 hover:border-purple-600 bg-zinc-50 transition-all"
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
                                    className="inline-flex items-center justify-center gap-1.5 font-mono text-xs font-semibold text-zinc-600 hover:text-zinc-900 px-3 py-2 rounded-lg border border-zinc-200 hover:border-zinc-300 bg-zinc-50 transition-all"
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

      {/* Big Interactive "Let's Work Together" & Sliding Homepage Footer Curtain */}
      <WorksFooterSection />
    </div>
  );
}



