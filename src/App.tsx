import { useState, useEffect, useRef, lazy, Suspense } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import "lenis/dist/lenis.css";

import Navbar from "./components/Navbar";
import AvatarShowcase from "./components/AvatarShowcase";
import About from "./components/About";
import Projects from "./components/Projects";
import LabTeaser from "./components/LabTeaser";
import Capabilities from "./components/Capabilities";
import Footer from "./components/Footer";
import Preloader from "./components/Preloader";

// Lazy load heavy standalone sub-views on demand
const LabWorkspace = lazy(() => import("./components/LabWorkspace"));
const AllWorksPage = lazy(() => import("./components/AllWorksPage"));

export default function App() {
  const [loadingComplete, setLoadingComplete] = useState(false);
  const [currentPath, setCurrentPath] = useState(window.location.pathname);
  const isInitialMount = useRef(true);
  const cameBackRef = useRef(false); // true when the last navigation was the browser's back/forward

  // Custom client-side path router
  useEffect(() => {
    const handleLocationChange = () => {
      setCurrentPath(window.location.pathname);
    };

    const handlePop = () => {
      cameBackRef.current = true;
      handleLocationChange();
    };
    window.addEventListener("popstate", handlePop);
    
    // Intercept pushState to capture programmatic navigation
    const originalPushState = window.history.pushState;
    window.history.pushState = function (...args) {
      originalPushState.apply(this, args);
      cameBackRef.current = false;
      handleLocationChange();
    };

    return () => {
      window.removeEventListener("popstate", handlePop);
      window.history.pushState = originalPushState;
    };
  }, []);

  // Scroll to top on navigation to clear scroll offset (bypass on initial refresh)
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    window.scrollTo(0, 0);

    // Coming back to the home page with the browser's back button after "View all works": land on
    // that section again rather than the top. The page lays itself out over a few frames (the hero,
    // the reveal triggers, images), so the position is re-applied a couple of times as it settles.
    const home = (currentPath.replace(/\/$/, "") || "/") === "/";
    let target: string | null = null;
    try { target = sessionStorage.getItem("return-to"); } catch { /* ignore */ }
    if (!home || !target) return;
    try { sessionStorage.removeItem("return-to"); } catch { /* ignore */ }
    if (!cameBackRef.current) return;
    const id = target;
    const land = () => {
      const el = document.getElementById(id);
      if (!el) return;
      const y = el.getBoundingClientRect().top + window.scrollY - window.innerHeight / 2 + el.offsetHeight / 2;
      const lenis = (window as unknown as { lenis?: { scrollTo: (t: number, o?: { immediate?: boolean; force?: boolean }) => void } }).lenis;
      if (lenis) lenis.scrollTo(y, { immediate: true, force: true });
      else window.scrollTo(0, y);
    };
    const timers = [0, 120, 400, 900].map((t) => window.setTimeout(land, t));
    return () => timers.forEach(window.clearTimeout);
  }, [currentPath]);

  useEffect(() => {
    const normalizedPath = currentPath.replace(/\/$/, "") || "/";
    if (!loadingComplete || normalizedPath === "/lab") return;

    // Register GSAP ScrollTrigger plugin
    gsap.registerPlugin(ScrollTrigger);

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Lenis smooth scroll. lerp-based (frame-rate independent) feels more natural than a fixed
    // duration curve, and touch devices keep native momentum scrolling (syncTouch off).
    const lenis = new Lenis({
      lerp: prefersReducedMotion ? 1 : 0.085,
      smoothWheel: !prefersReducedMotion,
      wheelMultiplier: 1,
      touchMultiplier: 1,
      syncTouch: false,
      autoRaf: false,
    });

    (window as unknown as { lenis?: typeof lenis }).lenis = lenis;

    lenis.on("scroll", ScrollTrigger.update);

    const updateTicker = (time: number) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(updateTicker);
    // Don't let GSAP "catch up" after a dropped frame — it causes visible jumps while scrolling
    gsap.ticker.lagSmoothing(0);

    // GSAP Scroll Reveal Animation for elements with class '.reveal'
    const revealElements = gsap.utils.toArray(".reveal");
    revealElements.forEach((elem: unknown) => {
      const el = elem as Element;
      if (prefersReducedMotion) {
        gsap.set(el, { y: 0, opacity: 1 });
        return;
      }
      gsap.fromTo(
        el,
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1.1,
          ease: "power3.out",
          clearProps: "transform",
          scrollTrigger: {
            trigger: el,
            start: "top 88%",
            toggleActions: "play none none none",
            once: true,
          },
        }
      );
    });

    // Refresh ScrollTrigger so all registered triggers calculate correct dimensions with Lenis & loaded layout
    ScrollTrigger.refresh();
    const refreshTimer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 150);
    // Late-loading fonts shift layout; re-measure once they're in
    document.fonts?.ready.then(() => ScrollTrigger.refresh());

    return () => {
      clearTimeout(refreshTimer);
      gsap.ticker.remove(updateTicker);
      delete (window as unknown as { lenis?: typeof lenis }).lenis;
      lenis.destroy();
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, [loadingComplete, currentPath]);

  // Once the intro is done and the page is quiet, fetch the works archive in the background, so
  // opening it later shows straight away instead of a loading screen
  useEffect(() => {
    if (!loadingComplete) return;
    const t = window.setTimeout(() => { import("./components/AllWorksPage"); }, 4000);
    return () => window.clearTimeout(t);
  }, [loadingComplete]);

  const normalizedPath = currentPath.replace(/\/$/, "") || "/";
  const isLabView = normalizedPath === "/lab";
  const isWorksView = normalizedPath === "/works";

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
          <Suspense fallback={
            <div className="min-h-screen bg-[var(--bg)] flex items-center justify-center font-mono text-xs text-[var(--accent)] tracking-widest uppercase">
              INITIALIZING LAB WORKSPACE...
            </div>
          }>
            <LabWorkspace onExitLab={() => window.history.pushState({}, "", "/")} />
          </Suspense>
        ) : isWorksView ? (
          /* Render Works Archive page directly */
          <Suspense fallback={
            <div className="min-h-screen bg-[var(--bg)] flex items-center justify-center font-mono text-xs text-[var(--accent)] tracking-widest uppercase">
              LOADING WORKS ARCHIVE...
            </div>
          }>
            <AllWorksPage ready={loadingComplete} />
          </Suspense>
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
              <LabTeaser
                onEnterLab={() => {
                  window.history.pushState({}, "", "/lab");
                }}
              />
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

