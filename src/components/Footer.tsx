import { useState, useEffect } from "react";
import { portfolioData } from "../data/portfolioData";

export default function Footer() {
  const { name, email, linkedinUrl } = portfolioData;
  const [time, setTime] = useState("");

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
      // Strip AM/PM suffix to match standard digital clock format "H:MM:SS"
      setTime(timeStr.replace(/\s*[AP]M$/i, ""));
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <footer id="contact" className="w-full bg-black pt-32 pb-8 px-8 lg:px-16 reveal flex flex-col justify-end">
      
      {/* 1. Large Top Headline - Darker Grotesque in refined bold/tracking */}
      <div className="mb-14">
        <h2 className="text-white font-display text-5xl sm:text-7xl lg:text-[7.5rem] font-bold tracking-[-0.03em] leading-[0.95]">
          With intention and purpose.
        </h2>
      </div>

      {/* 2. Directory Layout with restricted Horizontal Line */}
      <div className="pt-8 pb-16 grid grid-cols-1 md:grid-cols-12 gap-8">
        
        {/* Left padding offset to push columns right-aligned */}
        <div className="hidden md:block md:col-span-5" />
        
        {/* Directory Columns with top border only */}
        <div className="md:col-span-7 border-t border-zinc-850 pt-8 grid grid-cols-12 gap-6">
          
          {/* Column 1: Get to know me (span 3) */}
          <div className="col-span-12 sm:col-span-3 space-y-2">
            <span className="block font-mono text-[9px] text-zinc-500 tracking-wider uppercase">
              Get to know me
            </span>
            <a
              href="#showcase"
              className="block text-white font-display text-base sm:text-lg font-bold hover:text-purple-400 transition-colors"
            >
              About
            </a>
          </div>

          {/* Column 2: Socials (span 3) */}
          <div className="col-span-12 sm:col-span-3 space-y-2">
            <span className="block font-mono text-[9px] text-zinc-500 tracking-wider uppercase">
              Socials
            </span>
            <div className="space-y-1">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="block text-white font-display text-base sm:text-lg font-bold hover:text-purple-400 transition-colors"
              >
                Instagram
              </a>
              <a
                href={linkedinUrl}
                target="_blank"
                rel="noreferrer"
                className="block text-white font-display text-base sm:text-lg font-bold hover:text-purple-400 transition-colors"
              >
                LinkedIn
              </a>
            </div>
          </div>

          {/* Column 3: Contact (span 6) */}
          <div className="col-span-12 sm:col-span-6 space-y-2">
            <span className="block font-mono text-[9px] text-zinc-500 tracking-wider uppercase">
              Contact
            </span>
            <a
              href={`mailto:${email}`}
              className="block text-white font-display text-base sm:text-lg font-bold hover:text-purple-400 transition-colors break-all"
            >
              {email}
            </a>
          </div>

        </div>

      </div>

      {/* 3. Massive decorative name "myrielle" - lowercase Space Grotesk regular weight */}
      <div className="w-full overflow-hidden select-none -mb-[3.8vw] relative z-0">
        <div className="text-[16vw] sm:text-[18vw] lg:text-[21vw] font-space font-normal text-white text-right leading-[0.75] tracking-tighter">
          {name.toLowerCase()}
        </div>
      </div>

      {/* 4. Sub-Footer divided by border-t */}
      <div className="border-t border-zinc-850 pt-6 grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
        
        {/* Left: Copyright */}
        <div className="col-span-12 md:col-span-3 space-y-0.5">
          <div className="text-[8.5px] text-zinc-500 font-mono tracking-wider">
            © 2026 // {name.toUpperCase()}
          </div>
          <div className="text-[8.5px] text-zinc-650 font-mono tracking-wider">
            ALL RIGHTS RESERVED
          </div>
        </div>

        {/* Center: Makati City */}
        <div className="col-span-12 md:col-span-3 space-y-0.5">
          <div className="text-[8.5px] text-zinc-500 font-mono tracking-wider">
            MAKATI CITY, PH
          </div>
          <div className="text-[8.5px] text-zinc-350 font-mono tracking-wider">
            {time}
          </div>
        </div>

        {/* Right: Monospace tagline */}
        <div className="col-span-12 md:col-span-6 text-right space-y-0.5 font-mono text-[8.5px] text-zinc-600 tracking-tight leading-relaxed">
          <div>IT'S A LEAP OF FAITH. THAT'S ALL IT IS. A LEAP OF FAITH//////////</div>
          <div>/////////////////////////////////////////////////////////////////</div>
        </div>

      </div>
    </footer>
  );
}
