import { useState, useRef } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import ThemeToggle from "./ThemeToggle";
import { worksCategories, type WorkCategory } from "../data/worksData";
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

  const handleBackToHome = () => {
    window.history.pushState({}, "", "/");
  };

  const activeFullscreenCategory = worksCategories.find((cat) => cat.id === fullscreenCategoryId);

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
        <div className="max-w-7xl mx-auto rounded-2xl border border-zinc-200 bg-white/90 backdrop-blur-md shadow-sm transition-all duration-300 pointer-events-auto overflow-hidden">
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

            {/* Right: Theme Toggle */}
            <div className="flex items-center gap-3 sm:gap-4">
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

            return (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{
                  opacity: isFaded ? 0.45 : 1,
                  scale: isFaded ? 0.98 : 1,
                }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className="w-full relative z-30 py-2 bg-white"
              >
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
                      <div className="mb-0">
                        <UnseenProjectsShowcase
                          category={category}
                          categories={worksCategories}
                          onSelectCategory={(id) => {
                            setSelectedCategoryId(id);
                          }}
                          onClose={() => setSelectedCategoryId(null)}
                          embedded={true}
                          onToggleFullscreen={() => setFullscreenCategoryId(category.id)}
                        />
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



