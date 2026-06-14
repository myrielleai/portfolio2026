import { motion } from "framer-motion";
import { Mail, ArrowUpRight } from "lucide-react";
import { GithubIcon, LinkedinIcon, TwitterIcon } from "./Icons";
import { portfolioData } from "../data/portfolioData";

export default function Footer() {
  const { name, email, githubUrl, linkedinUrl, twitterUrl } = portfolioData;

  const currentYear = new Date().getFullYear();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring" as const, stiffness: 100, damping: 15 },
    },
  };

  const socialLinks = [
    { icon: <GithubIcon className="w-4 h-4" />, url: githubUrl, label: "GitHub" },
    { icon: <LinkedinIcon className="w-4 h-4" />, url: linkedinUrl, label: "LinkedIn" },
    { icon: <TwitterIcon className="w-4 h-4" />, url: twitterUrl, label: "Twitter" },
    { icon: <Mail className="w-4 h-4" />, url: `mailto:${email}`, label: "Email" },
  ];

  return (
    <footer id="contact" className="grid grid-cols-1 lg:grid-cols-12 items-stretch">
      
      {/* Left Column (4 cols) */}
      <div className="lg:col-span-4 border-b lg:border-b-0 lg:border-r border-zinc-900 p-8 lg:p-12 bg-black/20">
        <span className="font-mono text-xs text-zinc-500 tracking-widest block">04 // CONTACT</span>
      </div>

      {/* Right Column (8 cols) */}
      <div className="lg:col-span-8 flex flex-col justify-between">
        
        {/* Contact Invitation */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="p-8 lg:p-12 space-y-6 lg:space-y-8"
        >
          <motion.h2 variants={itemVariants} className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight leading-[1.1]">
            Let's construct something premium together.
          </motion.h2>
          
          <motion.p variants={itemVariants} className="text-zinc-400 max-w-xl text-sm sm:text-base leading-relaxed">
            I am always open to consulting engagements, full-time contracts, and speaking opportunities. Drop me a line, and let's get standard protocols established.
          </motion.p>

          <motion.div variants={itemVariants} className="pt-2">
            <a
              href={`mailto:${email}`}
              className="group inline-flex items-center gap-3 border border-zinc-900 hover:border-zinc-750 bg-zinc-950/40 p-4 sm:p-5 w-full sm:w-auto transition-all duration-300"
            >
              <div className="space-y-1">
                <div className="font-mono text-[9px] text-zinc-500 tracking-widest uppercase">DIRECT EMAIL</div>
                <div className="text-sm sm:text-base font-mono text-white font-medium group-hover:text-zinc-350 transition-colors">
                  {email}
                </div>
              </div>
              <ArrowUpRight className="w-5 h-5 text-zinc-500 group-hover:text-white transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 ml-auto sm:ml-8" />
            </a>
          </motion.div>
        </motion.div>

        {/* Sub-Footer: Grid Border System */}
        <div className="border-t border-zinc-900 p-8 lg:p-12 bg-zinc-950/20">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
            
            {/* Copyright & Info */}
            <div className="space-y-1">
              <div className="text-xs text-zinc-550 font-mono tracking-wider">
                © {currentYear} // {name.toUpperCase()}
              </div>
              <div className="text-[10px] text-zinc-650 font-mono">
                BUILT WITH REACT + VITE + TAILWIND V4 + FRAMER MOTION
              </div>
            </div>

            {/* Social Links Row */}
            <div className="flex items-center gap-3">
              {socialLinks.map((link, idx) => (
                link.url && (
                  <a
                    key={idx}
                    href={link.url}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-center p-2.5 border border-zinc-900 hover:border-zinc-700 bg-zinc-950/50 hover:bg-zinc-900 text-zinc-500 hover:text-white transition-all duration-350 rounded-sm"
                    aria-label={link.label}
                  >
                    {link.icon}
                  </a>
                )
              ))}
            </div>

          </div>
        </div>

      </div>
    </footer>
  );
}
