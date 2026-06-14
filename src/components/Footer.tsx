import { useState, useEffect } from "react";
import { portfolioData } from "../data/portfolioData";

export default function Footer() {
  const { name, email, linkedinUrl } = portfolioData;
  const [time, setTime] = useState("");

  useEffect(() => {
    const updateTime = () => {
      // Get current time in Manila (Makati) timezone (UTC+8)
      const options: Intl.DateTimeFormatOptions = {
        timeZone: "Asia/Manila",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      };
      const formatter = new Intl.DateTimeFormat("en-US", options);
      // Format to HH:MM:SS
      setTime(formatter.format(new Date()));
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <footer id="contact" className="w-full bg-black pt-32 pb-8 px-8 lg:px-16 reveal flex flex-col justify-end">
      
      {/* 1. Large Top Headline */}
      <div className="mb-20">
        <h2 className="text-white font-display text-4xl sm:text-6xl lg:text-[5.5rem] font-light tracking-tight leading-[1.05]">
          With intention and purpose.
        </h2>
      </div>

      {/* 2. Directory Layout with Horizontal Line */}
      <div className="border-t border-zinc-850 pt-8 pb-16 grid grid-cols-1 md:grid-cols-12 gap-8">
        
        {/* Left padding offset to align with the mockup */}
        <div className="hidden md:block md:col-span-4" />
        
        {/* Directory Columns */}
        <div className="md:col-span-8 grid grid-cols-1 sm:grid-cols-3 gap-8">
          
          {/* Column 1: Get to know me */}
          <div className="space-y-3">
            <span className="block font-mono text-[10px] text-zinc-500 tracking-wider uppercase">
              Get to know me
            </span>
            <a
              href="#showcase"
              className="block text-white font-sans text-sm sm:text-base font-semibold hover:text-purple-400 transition-colors"
            >
              About
            </a>
          </div>

          {/* Column 2: Socials */}
          <div className="space-y-3">
            <span className="block font-mono text-[10px] text-zinc-500 tracking-wider uppercase">
              Socials
            </span>
            <div className="space-y-1">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="block text-white font-sans text-sm sm:text-base font-semibold hover:text-purple-400 transition-colors"
              >
                Instagram
              </a>
              <a
                href={linkedinUrl}
                target="_blank"
                rel="noreferrer"
                className="block text-white font-sans text-sm sm:text-base font-semibold hover:text-purple-400 transition-colors"
              >
                LinkedIn
              </a>
            </div>
          </div>

          {/* Column 3: Contact */}
          <div className="space-y-3">
            <span className="block font-mono text-[10px] text-zinc-500 tracking-wider uppercase">
              Contact
            </span>
            <a
              href={`mailto:${email}`}
              className="block text-white font-sans text-sm sm:text-base font-semibold hover:text-purple-400 transition-colors break-all"
            >
              {email}
            </a>
          </div>

        </div>

      </div>

      {/* 3. Massive decorative name "myrielle" */}
      <div className="w-full overflow-hidden select-none -mb-[4.2vw] relative z-0">
        <div className="text-[16vw] sm:text-[18vw] lg:text-[21vw] font-display font-medium text-white text-right leading-[0.75] tracking-tighter">
          {name.toLowerCase()}
        </div>
      </div>

      {/* 4. Sub-Footer divided by border-t */}
      <div className="border-t border-zinc-850 pt-6 grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
        
        {/* Left: Copyright */}
        <div className="md:col-span-4 space-y-0.5">
          <div className="text-[9px] text-zinc-500 font-mono tracking-wider">
            © 2026 // {name.toUpperCase()}
          </div>
          <div className="text-[9px] text-zinc-600 font-mono tracking-wider">
            ALL RIGHTS RESERVED
          </div>
        </div>

        {/* Center: Makati City */}
        <div className="md:col-span-4 space-y-0.5">
          <div className="text-[9px] text-zinc-500 font-mono tracking-wider">
            MAKATI CITY, PH
          </div>
          <div className="text-[9px] text-zinc-300 font-mono tracking-wider">
            {time}
          </div>
        </div>

        {/* Right: Monospace repeating tagline */}
        <div className="md:col-span-4 text-right space-y-0.5 font-mono text-[9px] text-zinc-500 tracking-tight leading-relaxed">
          <div>IT'S A LEAP OF FAITH. THAT'S ALL IT IS. A LEAP OF FAITH//////////</div>
          <div>/////////////////////////////////////////////////////////////////</div>
        </div>

      </div>
    </footer>
  );
}
