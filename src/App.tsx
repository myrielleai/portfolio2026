import { useState, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";

import Navbar from "./components/Navbar";
import AvatarShowcase from "./components/AvatarShowcase";
import About from "./components/About";
import Projects from "./components/Projects";
import LabTeaser from "./components/LabTeaser";
import LabWorkspace from "./components/LabWorkspace";
import Capabilities from "./components/Capabilities";
import Footer from "./components/Footer";
import Preloader from "./components/Preloader";

export default function App() {
  const [loadingComplete, setLoadingComplete] = useState(false);
  const [currentPath, setCurrentPath] = useState(window.location.pathname);

  // Custom client-side path router
  useEffect(() => {
    const handleLocationChange = () => {
      setCurrentPath(window.location.pathname);
    };

    window.addEventListener("popstate", handleLocationChange);
    
    // Intercept pushState to capture programmatic navigation
    const originalPushState = window.history.pushState;
    window.history.pushState = function (...args) {
      originalPushState.apply(this, args);
      handleLocationChange();
    };

    return () => {
      window.removeEventListener("popstate", handleLocationChange);
      window.history.pushState = originalPushState;
    };
  }, []);

  // Scroll to top on navigation to clear scroll offset
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentPath]);

  useEffect(() => {
    // Only run smooth scroll and triggers on the main homepage when loading is complete
    if (!loadingComplete || currentPath === "/lab") return;

    // Register GSAP ScrollTrigger plugin
    gsap.registerPlugin(ScrollTrigger);

    // Initialize Lenis smooth scroll
    const lenis = new Lenis();

    lenis.on('scroll', ScrollTrigger.update);

    const updateTicker = (time: number) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(updateTicker);
    gsap.ticker.lagSmoothing(0);

    // GSAP Scroll Reveal Animation for elements with class '.reveal'
    const revealElements = gsap.utils.toArray(".reveal");
    revealElements.forEach((elem: unknown) => {
      const el = elem as Element;
      gsap.fromTo(
        el,
        { y: 45, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1.3,
          ease: "power3.out",
          scrollTrigger: {
            trigger: el,
            start: "top 88%",
            toggleActions: "play none none none",
            once: true,
          },
        }
      );
    });

    return () => {
      gsap.ticker.remove(updateTicker);
      lenis.destroy();
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, [loadingComplete, currentPath]);

  const isLabView = currentPath === "/lab";

  return (
    <div
      className="min-h-screen font-sans selection:bg-[var(--accent)] selection:text-white antialiased"
      style={{ backgroundColor: "var(--bg)", color: "var(--text)" }}
    >
      {/* Entry preloader screen */}
      <Preloader onComplete={() => setLoadingComplete(true)} />

      {/* Structural container */}
      <div className="w-full min-h-screen flex flex-col">
        {isLabView ? (
          /* Render full screen Lab workspace console directly */
          <LabWorkspace onExitLab={() => window.history.pushState({}, "", "/")} />
        ) : (
          /* Render home page view layout */
          <>
            {/* Sticky Header - hidden during preload */}
            {loadingComplete && <Navbar />}

            {/* Core Layout Sections */}
            <main className="flex-grow">
              <AvatarShowcase />
              <About />
              <Projects />
              <LabTeaser onEnterLab={() => window.history.pushState({}, "", "/lab")} />
              <Capabilities />
            </main>

            {/* Footer containing Contact section */}
            <Footer />
          </>
        )}
      </div>
    </div>
  );
}

