import { useState, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import Navbar from "./components/Navbar";
import AvatarShowcase from "./components/AvatarShowcase";
import Experience from "./components/Experience";
import Projects from "./components/Projects";
import Marquee from "./components/Marquee";
import Footer from "./components/Footer";
import Preloader from "./components/Preloader";

export default function App() {
  const [loadingComplete, setLoadingComplete] = useState(false);

  useEffect(() => {
    // Only run smooth scroll after loading is complete
    if (!loadingComplete) return;

    // Register GSAP ScrollTrigger plugin
    gsap.registerPlugin(ScrollTrigger);

    // Initialize Lenis smooth scroll
    const lenis = new Lenis({
      duration: 1.25,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
    });

    // Update ScrollTrigger on Lenis scroll
    lenis.on("scroll", ScrollTrigger.update);

    // Sync GSAP ticker with Lenis raf
    const updateTicker = (time: number) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(updateTicker);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(updateTicker);
      lenis.destroy();
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, [loadingComplete]);

  return (
    <div className="min-h-screen bg-black text-zinc-400 font-sans selection:bg-white selection:text-black antialiased">
      {/* Entry preloader screen */}
      <Preloader onComplete={() => setLoadingComplete(true)} />
      
      {/* Structural vertical border container */}
      <div className="max-w-7xl mx-auto border-x border-zinc-900 min-h-screen flex flex-col bg-zinc-950/10">
        
        {/* Sticky Header - hidden during preload */}
        {loadingComplete && <Navbar />}

        {/* Core Layout Sections */}
        <main className="flex-grow">
          <AvatarShowcase />
          <Experience />
          <Projects />
          <Marquee />
        </main>

        {/* Footer containing Contact section */}
        <Footer />
        
      </div>
    </div>
  );
}
