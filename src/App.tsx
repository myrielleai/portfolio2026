import { useState } from "react";
import Navbar from "./components/Navbar";
import AvatarShowcase from "./components/AvatarShowcase";
import Experience from "./components/Experience";
import Projects from "./components/Projects";
import Marquee from "./components/Marquee";
import Footer from "./components/Footer";
import Preloader from "./components/Preloader";

export default function App() {
  const [loadingComplete, setLoadingComplete] = useState(false);

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
