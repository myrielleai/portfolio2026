import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { portfolioData } from "../data/portfolioData";
import CreationAdamFooterBg from "./CreationAdamFooterBg";
import { scrollToSection } from "../utils/scrollTo";

const WORDS = ["build", "create", "craft", "design", "make"];

export default function Footer() {
  const { name, email, linkedinUrl, instagramUrl } = portfolioData;
  const [time, setTime] = useState("");
  const [wordIndex, setWordIndex] = useState(0);
  const wordRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setWordIndex((prev) => (prev + 1) % WORDS.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);


  useEffect(() => {
    const updateTime = () => {
      // Get current time in Manila (Makati) timezone (UTC+8) in 12-hour format
      const options: Intl.DateTimeFormatOptions = {
        timeZone: "Asia/Manila",
        hour: "numeric",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
      };
      const formatter = new Intl.DateTimeFormat("en-US", options);
      const timeStr = formatter.format(new Date());
      // Strip AM/PM suffix to match standard digital clock format "H:MM:SS" shown in Figma
      setTime(timeStr.replace(/\s*[AP]M$/i, ""));
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <footer id="contact" className="w-full bg-[var(--bg)] pt-32 pb-2 px-8 lg:px-16 reveal flex flex-col justify-end transition-colors duration-300 relative overflow-hidden">
      
      {/* Cinematic Creation of Adam Parallax Fresco Background */}
      <CreationAdamFooterBg targetRef={wordRef} wordIndex={wordIndex} />


      {/* Footer Main Grid: headline & navigation on the right */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-stretch relative z-10 w-full mb-16">
        
        {/* Left Column Spacer: Keeps right column content aligned where it is */}
        <div className="hidden md:block md:col-span-5" />

        {/* Right Column: Headline & Directory */}
        <div className="col-span-12 md:col-span-7 flex flex-col justify-between -translate-x-[20px]">
          
          {/* Large Top Headline */}
          <div className="mb-8 md:mb-12">
            <br />
            <br />
            <br />
            <br />
            <br />
            <h2 className="text-[var(--heading)] font-switzer text-[44px] sm:text-[56px] tracking-[-0.03em] leading-[1.2]">
              Let's{" "}
              <span ref={wordRef} className="relative inline-block overflow-hidden h-[1.1em] align-bottom min-w-[3.5em]">
                <AnimatePresence mode="wait">
                  <motion.span
                    key={WORDS[wordIndex]}
                    initial={{ y: "100%", opacity: 0 }}
                    animate={{ y: "0%", opacity: 1 }}
                    exit={{ y: "-100%", opacity: 0 }}
                    transition={{ duration: 0.5, ease: [0.215, 0.61, 0.355, 1] }}
                    className="absolute left-0 bottom-0 text-[var(--accent)] font-bold"
                  >
                    {WORDS[wordIndex]}
                  </motion.span>

                </AnimatePresence>
              </span>
              <br />
              with intention and purpose.
            </h2>
          </div>

          {/* Directory Layout */}
          <div className="border-t border-[var(--border)] pt-8 grid grid-cols-12 gap-6">

            {/* Column 1: Navigation */}
            <div className="col-span-12 sm:col-span-3 space-y-2">
              <span className="block font-mono text-[12px] text-[var(--text-muted)] tracking-wider uppercase">
                Navigation
              </span>
              <div className="space-y-1">
                <a
                  href="#showcase"
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToSection("showcase");
                  }}
                  className="block text-[var(--heading)] font-switzer text-xl sm:text-2xl font-semibold hover:text-[var(--accent)] transition-colors"
                >
                  Showcase
                </a>
                <a
                  href="#projects"
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToSection("projects");
                  }}
                  className="block text-[var(--heading)] font-switzer text-xl sm:text-2xl font-semibold hover:text-[var(--accent)] transition-colors"
                >
                  Selected Work
                </a>
                <a
                  href="#capabilities"
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToSection("capabilities");
                  }}
                  className="block text-[var(--heading)] font-switzer text-xl sm:text-2xl font-semibold hover:text-[var(--accent)] transition-colors"
                >
                  Capabilities
                </a>
              </div>
            </div>

            {/* Column 2: Socials */}
            <div className="col-span-12 sm:col-span-3 space-y-2">
              <span className="block font-mono text-[12px] text-[var(--text-muted)] tracking-wider uppercase">
                Socials
              </span>
              <div className="space-y-1">
                <a
                  href={instagramUrl || "https://instagram.com"}
                  target="_blank"
                  rel="noreferrer"
                  className="block text-[var(--heading)] font-switzer text-xl sm:text-2xl font-semibold hover:text-[var(--accent)] transition-colors"
                >
                  Instagram
                </a>
                <a
                  href={linkedinUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="block text-[var(--heading)] font-switzer text-xl sm:text-2xl font-semibold hover:text-[var(--accent)] transition-colors"
                >
                  LinkedIn
                </a>
              </div>
            </div>

            {/* Column 3: Contact */}
            <div className="col-span-12 sm:col-span-6 space-y-2">
              <span className="block font-mono text-[12px] text-[var(--text-muted)] tracking-wider uppercase">
                Contact
              </span>
              <a
                href={`mailto:${email}`}
                className="block text-[var(--heading)] font-switzer text-xl sm:text-2xl font-semibold hover:text-[var(--accent)] transition-colors break-all"
              >
                {email}
              </a>
            </div>

          </div>

        </div>

      </div>

      {/* 3. Massive decorative brand name */}
      <div className="w-full relative z-20 py-2">
        <motion.a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            scrollToSection("");
          }}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.2 }}
          variants={{
            hidden: {},
            visible: {
              transition: {
                staggerChildren: 0.045,
                delayChildren: 0.08,
              },
            },
          }}
          className="block text-[16vw] sm:text-[18vw] lg:text-[21vw] font-display font-bold text-[var(--heading)] hover:text-[var(--accent)] text-right leading-[0.75] tracking-tight opacity-90 transition-colors duration-300 cursor-pointer select-none"
        >
          {name.toLowerCase().split("").map((char, index) => {
            const isY = char === "y";
            return (
              <span
                key={index}
                className={`inline-block ${
                  isY ? "overflow-visible pb-24 -mb-24" : "overflow-hidden pb-4 -mb-4"
                } pt-4 -mt-4`}
              >
                <motion.span
                  className="inline-block"
                  variants={{
                    hidden: { y: "115%", opacity: 0, rotate: 3 },
                    visible: {
                      y: "0%",
                      opacity: 1,
                      rotate: 0,
                      transition: {
                        duration: 0.85,
                        ease: [0.16, 1, 0.3, 1],
                      },
                    },
                  }}
                >
                  <span className={isY ? "inline-block translate-y-[11px] relative z-30" : ""}>
                    {char}
                  </span>
                </motion.span>
              </span>
            );
          })}
        </motion.a>
      </div>

      {/* 4. Sub-Footer */}
      <div className="border-t border-[var(--border)] pt-8 pb-2 grid grid-cols-1 md:grid-cols-12 gap-6 items-start relative z-10 bg-transparent">
        <div className="hidden md:block md:col-span-5" />

        <div className="md:col-span-7 grid grid-cols-12 gap-6 translate-x-[50px]">

          <div className="col-span-12 sm:col-span-3 space-y-0.5">
            <div className="text-[10px] text-[var(--text-muted)] font-mono tracking-wider uppercase">
              © 2026 // {name.toUpperCase()}
            </div>
            <div className="text-[10px] text-[var(--text-muted)]/70 font-mono tracking-wider uppercase">
              ALL RIGHTS RESERVED
            </div>
          </div>

          <div className="col-span-12 sm:col-span-3 space-y-0.5">
            <div className="text-[10px] text-[var(--text-muted)] font-mono tracking-wider uppercase">
              MAKATI CITY, PH
            </div>
            <div className="text-[10px] text-[var(--heading)] font-mono tracking-wider uppercase">
              {time}
            </div>
          </div>

          <div className="col-span-12 sm:col-span-6 text-left space-y-0.5 font-mono text-[10px] text-[var(--text-muted)] tracking-tight leading-relaxed">
            <div>IT'S A LEAP OF FAITH /////////</div>
          </div>

        </div>

      </div>
    </footer>

  );
}
