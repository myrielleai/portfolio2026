import { portfolioData } from "../data/portfolioData";

export default function Marquee() {
  const skills = portfolioData.skills;

  // Duplicate the list of skills to create a seamless infinite scroll loop
  const duplicatedSkills = [...skills, ...skills, ...skills];

  return (
    <div className="w-full bg-zinc-950/60 border-b border-zinc-900 overflow-hidden py-5 sm:py-6">
      <div className="relative w-full flex items-center">
        {/* Infinite Scrolling Track */}
        <div className="animate-marquee flex items-center whitespace-nowrap gap-12 sm:gap-16">
          {duplicatedSkills.map((skill, index) => (
            <div key={index} className="flex items-center gap-12 sm:gap-16">
              <span className="font-mono text-xs sm:text-sm tracking-widest text-zinc-400 font-semibold hover:text-white transition-colors duration-300">
                {skill}
              </span>
              <span className="font-mono text-zinc-800 text-xs">//</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
