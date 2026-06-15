import { useState } from "react";
import { Menu, X } from "lucide-react";


export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  // Hide logo after Projects section appears


  const navLinks = [
    { label: "About", href: "#showcase" },
    { label: "Work", href: "#experience" },
    { label: "Contact", href: "#contact" },
  ];

  return (
    <header className="sticky top-0 z-40 bg-transparent mr-8 flex justify-end transition-transform duration-300 ease-out hover:scale-105">
      <div className="w-full px-8 lg:px-16">
        <div className="flex items-center justify-between h-20">

          {/* Left side: centered logo */}
          {/* Placeholder to retain left spacing */}
          <div className="flex-1"></div>

          {/* Right: vertical ABOUT, WORK, CONTACT navigation */}
          <nav className="hidden md:flex flex-col items-end gap-4 mt-28">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="font-switzer text-sm font-semibold tracking-widest text-zinc-300 hover:text-white transition-colors duration-300 transform hover:translate-x-2 text-right"
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
        <div className="md:hidden border-t border-zinc-900 bg-black/95 w-full absolute right-0 top-20 px-6 py-6 space-y-4 shadow-2xl flex flex-col">
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
        </div>
      )}
    </header>
  );
}
