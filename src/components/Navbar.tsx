import { useState } from "react";
import { Menu, X } from "lucide-react";
import { portfolioData } from "../data/portfolioData";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { name, email } = portfolioData;

  const logoText = name
    .split(" ")
    .map((n) => n[0])
    .join("");

  const navLinks = [
    { label: "ABOUT", href: "#showcase" },
    { label: "WORK", href: "#experience" },
    { label: "CONTACT", href: "#contact" },
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-black/40 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo - Minimalist "RH" text */}
          <a
            href="#"
            className="text-white font-mono font-extrabold tracking-widest text-lg"
          >
            {logoText}
          </a>

          {/* Center: Email address */}
          <div className="hidden md:block">
            <a
              href={`mailto:${email}`}
              className="font-mono text-[10px] text-zinc-400 hover:text-white transition-colors duration-300"
            >
              {email}
            </a>
          </div>

          {/* Right: simplified ABOUT, WORK, CONTACT navigation */}
          <nav className="hidden md:flex items-center gap-10">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="font-mono text-xs font-semibold tracking-widest text-zinc-300 hover:text-white transition-colors duration-300"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Mobile Menu Button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-zinc-400 hover:text-white p-2 border border-zinc-900 bg-zinc-950/55 transition-colors"
              aria-label="Toggle menu"
            >
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="md:hidden border-t border-zinc-900 bg-black/95 w-full absolute left-0 top-20 px-6 py-6 space-y-4 shadow-2xl flex flex-col">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setIsOpen(false)}
              className="font-mono text-xs font-semibold tracking-widest text-zinc-300 hover:text-white py-2 border-b border-zinc-900/50 transition-colors"
            >
              {link.label}
            </a>
          ))}
          <a
            href={`mailto:${email}`}
            className="font-mono text-[10px] text-zinc-400 pt-2"
          >
            {email}
          </a>
        </div>
      )}
    </header>
  );
}
