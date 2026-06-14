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

    // Initialize Lenis smooth scroll using exact boilerplate
    const lenis = new Lenis();

    lenis.on('scroll', ScrollTrigger.update);

    const updateTicker = (time: number) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(updateTicker);
    gsap.ticker.lagSmoothing(0);

    // GSAP Scroll Reveal Animation for elements with class '.reveal'
    const revealElements = gsap.utils.toArray(".reveal");
    revealElements.forEach((elem: any) => {
      gsap.fromTo(
        elem,
        { y: 45, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1.3,
          ease: "power3.out",
          scrollTrigger: {
            trigger: elem,
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
  }, [loadingComplete]);

  return (
    <div className="min-h-screen bg-black text-zinc-400 font-sans selection:bg-white selection:text-black antialiased">
      {/* Entry preloader screen */}
      <Preloader onComplete={() => setLoadingComplete(true)} />
      
      {/* Structural full-width container */}
      <div className="w-full min-h-screen flex flex-col bg-zinc-950/10">
        
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
