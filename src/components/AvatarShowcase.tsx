import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { FileText } from "lucide-react";
import { GithubIcon, LinkedinIcon, TwitterIcon, InstagramIcon } from "./Icons";
import { portfolioData } from "../data/portfolioData";

export default function AvatarShowcase() {
  const { name, githubUrl, linkedinUrl, twitterUrl } = portfolioData;

  // Custom mouse cursor position state
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <section
      id="showcase"
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative w-full min-h-[calc(100vh-5rem)] flex flex-col justify-center bg-black overflow-hidden px-6 sm:px-12 lg:px-20 py-10 lg:py-16 select-none"
    >
      
      {/* 1. Custom Interactive Glowing Mouse Cursor Graphic */}
      {isHovered && (
        <motion.div
          className="absolute pointer-events-none z-30 w-16 h-16 rounded-full border border-purple-500/35 bg-purple-500/5 blur-[2px] hidden lg:block"
          animate={{ x: mousePos.x - 32, y: mousePos.y - 32 }}
          transition={{ type: "spring", damping: 30, stiffness: 250, mass: 0.5 }}
        />
      )}

      {/* Main Grid: Left, Center, Right columns on desktop */}
      <div className="w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-4 items-center relative z-10">
        
        {/* Left Column: Hello Message & Social Icons (lg: 4 cols) */}
        <div className="lg:col-span-4 flex flex-col justify-between h-full space-y-12 text-left order-2 lg:order-1">
          
          {/* Headline Text */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="space-y-1"
          >
            <span className="text-purple-400 font-sans text-lg sm:text-xl font-medium">
              Hello! I'm
            </span>
            <h1 className="text-white text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight uppercase leading-[1.05]">
              {name}
            </h1>
          </motion.div>

          {/* Stacked Social Icons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex lg:flex-col items-center gap-6 pt-4 lg:pt-0"
          >
            {githubUrl && (
              <a
                href={githubUrl}
                target="_blank"
                rel="noreferrer"
                className="text-zinc-500 hover:text-white transition-colors duration-300"
                aria-label="GitHub"
              >
                <GithubIcon className="w-5 h-5" />
              </a>
            )}
            {linkedinUrl && (
              <a
                href={linkedinUrl}
                target="_blank"
                rel="noreferrer"
                className="text-zinc-500 hover:text-white transition-colors duration-300"
                aria-label="LinkedIn"
              >
                <LinkedinIcon className="w-5 h-5" />
              </a>
            )}
            {twitterUrl && (
              <a
                href={twitterUrl}
                target="_blank"
                rel="noreferrer"
                className="text-zinc-500 hover:text-white transition-colors duration-300"
                aria-label="Twitter"
              >
                <TwitterIcon className="w-5 h-5" />
              </a>
            )}
            <a
              href="#"
              className="text-zinc-550 hover:text-white transition-colors duration-300"
              aria-label="Instagram"
            >
              <InstagramIcon className="w-5 h-5" />
            </a>
          </motion.div>

        </div>

        {/* Center Column: Big 3D Avatar (lg: 4 cols) */}
        <div className="lg:col-span-4 flex justify-center relative order-1 lg:order-2">
          {/* Purple ambient backglow circle behind character */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[280px] sm:w-[350px] h-[280px] sm:h-[350px] rounded-full bg-purple-900/20 blur-3xl z-0" />
          
          {/* Avatar Image container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="relative z-10 w-full max-w-[280px] sm:max-w-[340px] aspect-square flex items-center justify-center"
          >
            <img
              src="/scene1.png"
              alt="Avatar Character"
              className="w-full h-full object-cover filter brightness-95"
            />
          </motion.div>
        </div>

        {/* Right Column: Floating orb & Stacked Role Text (lg: 4 cols) */}
        <div className="lg:col-span-4 flex flex-col items-start lg:items-end justify-between h-full space-y-12 lg:space-y-0 text-left lg:text-right order-3">
          
          {/* Floating purple light orb */}
          <motion.div
            initial={{ opacity: 0, y: -25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              type: "spring",
              stiffness: 80,
              delay: 0.2,
            }}
            className="hidden lg:block w-10 h-10 rounded-full bg-gradient-to-br from-purple-300 to-purple-500 shadow-[0_0_20px_rgba(168,85,247,0.7)] blur-[0.5px]"
          />

          {/* Role Text Container */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-0.5 w-full flex flex-col items-start lg:items-end"
          >
            <span className="text-purple-400 font-sans text-lg font-medium block">
              An
            </span>
            <span className="text-purple-500/20 font-black text-5xl sm:text-6xl lg:text-7xl leading-none uppercase tracking-tight block select-none">
              AI ENGINEER
            </span>
            <span className="text-white font-black text-3xl sm:text-4xl lg:text-[40px] leading-none uppercase tracking-tight block -mt-1 lg:-mt-2">
              FULL-STACK DEVELOPER
            </span>
          </motion.div>

        </div>

      </div>

      {/* Stylized RESUME button at bottom-right of the layout screen */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="absolute bottom-6 right-6 sm:bottom-10 sm:right-12 z-20"
      >
        <a
          href="#"
          className="group flex items-center gap-2 px-3 py-1.5 text-zinc-500 hover:text-white font-mono text-[10px] font-bold tracking-widest transition-all duration-300 uppercase"
        >
          <span>RESUME</span>
          <FileText className="w-3.5 h-3.5 text-zinc-650 group-hover:text-white transition-colors duration-300" />
        </a>
      </motion.div>

    </section>
  );
}
