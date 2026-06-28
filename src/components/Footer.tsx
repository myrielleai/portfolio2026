import { useState, useEffect } from "react";
import { portfolioData } from "../data/portfolioData";

export default function Footer() {
  const { name, email, linkedinUrl, instagramUrl } = portfolioData;
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
    <footer id="contact" className="w-full bg-[var(--bg)] pt-32 pb-8 px-8 lg:px-16 reveal flex flex-col justify-end transition-colors duration-300 border-t border-[var(--border)]">

      {/* 1. Large Top Headline */}
      <div className="mb-24 md:col-span-7 md:ml-[41.6667%]">
        <h2 className="text-[var(--heading)] font-switzer text-[36px] sm:text-[44px] tracking-[-0.03em] leading-[1.05]">
          <strong className="font-bold">With intention</strong> and purpose.
        </h2>
      </div>

      {/* 2. Directory Layout */}
      <div className="pt-8 pb-16 grid grid-cols-1 md:grid-cols-12 gap-8">
        <div className="hidden md:block md:col-span-5" />

        <div className="md:col-span-7 border-t border-[var(--border)] pt-8 grid grid-cols-12 gap-6">

          {/* Column 1: Navigation */}
          <div className="col-span-12 sm:col-span-3 space-y-2">
            <span className="block font-mono text-[10px] text-[var(--text-muted)] tracking-wider uppercase">
              Navigation
            </span>
            <div className="space-y-1">
              <a
                href="#showcase"
                className="block text-[var(--heading)] font-switzer text-base sm:text-lg font-semibold hover:text-[var(--accent)] transition-colors"
              >
                Showcase
              </a>
              <a
                href="#projects"
                className="block text-[var(--heading)] font-switzer text-base sm:text-lg font-semibold hover:text-[var(--accent)] transition-colors"
              >
                Selected Work
              </a>
              <a
                href="#capabilities"
                className="block text-[var(--heading)] font-switzer text-base sm:text-lg font-semibold hover:text-[var(--accent)] transition-colors"
              >
                Capabilities
              </a>
            </div>
          </div>

          {/* Column 2: Socials */}
          <div className="col-span-12 sm:col-span-3 space-y-2">
            <span className="block font-mono text-[10px] text-[var(--text-muted)] tracking-wider uppercase">
              Socials
            </span>
            <div className="space-y-1">
              <a
                href={instagramUrl || "https://instagram.com"}
                target="_blank"
                rel="noreferrer"
                className="block text-[var(--heading)] font-switzer text-base sm:text-lg font-semibold hover:text-[var(--accent)] transition-colors"
              >
                Instagram
              </a>
              <a
                href={linkedinUrl}
                target="_blank"
                rel="noreferrer"
                className="block text-[var(--heading)] font-switzer text-base sm:text-lg font-semibold hover:text-[var(--accent)] transition-colors"
              >
                LinkedIn
              </a>
            </div>
          </div>

          {/* Column 3: Contact */}
          <div className="col-span-12 sm:col-span-6 space-y-2">
            <span className="block font-mono text-[10px] text-[var(--text-muted)] tracking-wider uppercase">
              Contact
            </span>
            <a
              href={`mailto:${email}`}
              className="block text-[var(--heading)] font-switzer text-base sm:text-lg font-semibold hover:text-[var(--accent)] transition-colors break-all"
            >
              {email}
            </a>
          </div>

        </div>

      </div>

      {/* 3. Massive decorative brand name */}
      <div className="w-full overflow-hidden select-none relative z-0">
        <div className="text-[16vw] sm:text-[18vw] lg:text-[21vw] font-space font-light text-[var(--heading)] text-right leading-[0.75] tracking-[-0.05em] opacity-90">
          {name.toLowerCase()}
        </div>
      </div>

      {/* 4. Sub-Footer */}
      <div className="border-t border-[var(--border)] pt-8 pb-10 grid grid-cols-1 md:grid-cols-12 gap-6 items-start relative z-10 bg-transparent">
        <div className="hidden md:block md:col-span-5" />

        <div className="md:col-span-7 grid grid-cols-12 gap-6">

          <div className="col-span-12 sm:col-span-3 space-y-0.5">
            <div className="text-[9px] text-[var(--text-muted)] font-mono tracking-wider uppercase">
              © 2026 // {name.toUpperCase()}
            </div>
            <div className="text-[9px] text-[var(--text-muted)]/70 font-mono tracking-wider uppercase">
              ALL RIGHTS RESERVED
            </div>
          </div>

          <div className="col-span-12 sm:col-span-3 space-y-0.5">
            <div className="text-[9px] text-[var(--text-muted)] font-mono tracking-wider uppercase">
              MAKATI CITY, PH
            </div>
            <div className="text-[9px] text-[var(--heading)] font-mono tracking-wider uppercase">
              {time}
            </div>
          </div>

          <div className="col-span-12 sm:col-span-6 text-left space-y-0.5 font-mono text-[9px] text-[var(--text-muted)] tracking-tight leading-relaxed">
            <div>INTELLIGENT SYSTEMS & PREMIUM INTERFACES /////////</div>
          </div>

        </div>

      </div>
    </footer>

  );
}
