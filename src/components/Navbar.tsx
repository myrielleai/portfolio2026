import { useState } from "react";
import { Menu, X } from "lucide-react";
import ThemeToggle from "./ThemeToggle";
import { portfolioData } from "../data/portfolioData";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { label: "ABOUT", href: "#about" },
    { label: "WORK", href: "#projects" },
    { label: "CONTACT", href: "#contact" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full px-4 sm:px-6 lg:px-12 pt-4 transition-all duration-300 pointer-events-none">
      <div className="max-w-7xl mx-auto rounded-2xl border border-[var(--border)]/80 bg-[var(--scrim)] backdrop-blur-xl shadow-[0_8px_32px_0_rgba(147,51,234,0.03)] dark:shadow-[0_8px_32px_0_rgba(0,0,0,0.5)] transition-all duration-300 pointer-events-auto overflow-hidden">
        <div className="px-6 lg:px-8 h-16 flex items-center justify-between">
          
          {/* Left side: Brand identity & availability indicator */}
          <div className="flex items-center gap-6">
            <a
              href="#"
              className="font-display text-2xl lg:text-3xl font-bold tracking-tight text-[var(--heading)] hover:text-[var(--accent)] transition-colors"
            >
              {portfolioData.name.toLowerCase()}
            </a>
            
            {portfolioData.isAvailableForWork && (
              <div className="hidden sm:flex items-center gap-2.5 px-3 py-1 rounded-full border border-emerald-500/20 bg-emerald-500/10 text-emerald-400 font-mono text-[10px] tracking-wider uppercase">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>{portfolioData.availabilityText}</span>
              </div>
            )}
          </div>

          {/* Right side: Desktop Navigation & Theme Toggle */}
          <div className="hidden md:flex items-center gap-8">
            <nav className="flex items-center gap-8">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="font-mono text-xs font-semibold tracking-widest text-[var(--text-muted)] hover:text-[var(--heading)] transition-colors py-1 relative group"
                >
                  {link.label}
                  <span className="absolute bottom-0 left-0 w-0 h-[1.5px] bg-[var(--heading)] transition-all duration-300 group-hover:w-full" />
                </a>
              ))}
            </nav>

            <div className="h-4 w-[1px] bg-[var(--border)]" />

            <ThemeToggle />
          </div>

          {/* Mobile menu controls */}
          <div className="flex items-center gap-3 md:hidden">
            <ThemeToggle />
            <button
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Toggle menu"
              className="p-2 border border-[var(--border)]/80 rounded-md bg-transparent text-[var(--text)] hover:bg-[var(--surface-muted)]/50 transition-colors"
            >
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>

        {/* Mobile Drawer */}
        {isOpen && (
          <div className="md:hidden border-t border-[var(--border)]/80 bg-[var(--scrim)] backdrop-blur-xl px-6 py-6 space-y-4 flex flex-col animate-fadeIn">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="font-mono text-xs font-semibold tracking-widest text-[var(--text)] hover:text-[var(--accent)] py-2 border-b border-[var(--border)]/50 transition-colors"
              >
                {link.label}
              </a>
            ))}
          </div>
        )}
      </div>
    </header>
  );
}

