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
      // Strip AM/PM suffix to match standard digital clock format "H:MM:SS" shown in Figma
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
        
        {/* Left padding offset to align exactly with the Figma mockup columns */}
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

      {/* 3. Massive decorative name "myrielle" - Space Grotesk light weight with tight tracking.
          Pushed down precisely using negative margins so baseline sits on border-t and 'y' crosses it. */}
      <div className="w-full overflow-hidden select-none -mb-[2.6vw] relative z-0">
        <div className="text-[16vw] sm:text-[18vw] lg:text-[21vw] font-space font-light text-white text-right leading-[0.75] tracking-[-0.05em]">
          {name.toLowerCase()}
        </div>
      </div>

      {/* 4. Sub-Footer divided by border-t - layered explicitly in front (z-10) to render on top of branding.
          Horizontal columns align vertically with the directories above. */}
      <div className="border-t border-zinc-850 pt-8 pb-10 grid grid-cols-1 md:grid-cols-12 gap-6 items-start relative z-10 bg-transparent">
        
        {/* Left padding offset to align exactly with the Figma mockup columns */}
        <div className="hidden md:block md:col-span-5" />
        
        {/* Sub-Footer Columns aligned with the directories above */}
        <div className="md:col-span-7 grid grid-cols-12 gap-6">
          
          {/* Column 1 (Left): Copyright */}
          <div className="col-span-12 sm:col-span-3 space-y-0.5">
            <div className="text-[8.5px] text-zinc-500 font-mono tracking-wider uppercase">
              © 2026 // {name.toUpperCase()}
            </div>
            <div className="text-[8.5px] text-zinc-605 font-mono tracking-wider uppercase">
              ALL RIGHTS RESERVED
            </div>
          </div>

          {/* Column 2 (Center): Makati City */}
          <div className="col-span-12 sm:col-span-3 space-y-0.5">
            <div className="text-[8.5px] text-zinc-500 font-mono tracking-wider uppercase">
              MAKATI CITY, PH
            </div>
            <div className="text-[8.5px] text-zinc-350 font-mono tracking-wider uppercase">
              {time}
            </div>
          </div>

          {/* Column 3 (Right): Monospace tagline - left aligned under Contact column */}
          <div className="col-span-12 sm:col-span-6 text-left space-y-0.5 font-mono text-[8.5px] text-zinc-500 tracking-tight leading-relaxed">
            <div>IT'S A LEAP OF FAITH. THAT'S ALL IT IS. A LEAP OF FAITH//////////</div>
            <div>/////////////////////////////////////////////////////////////////</div>
          </div>

        </div>

      </div>
    </footer>
  );
}
