import { portfolioData } from "../data/portfolioData";

export default function Education() {
  const education = portfolioData.education;

  return (
    <section id="education" className="grid grid-cols-1 lg:grid-cols-12 border-b border-zinc-900 items-stretch">
      {/* Left Column (4 cols) */}
      <div className="lg:col-span-4 border-b lg:border-b-0 lg:border-r border-zinc-900 py-24 lg:py-36 px-8 lg:px-16 bg-black/20 flex flex-col justify-start">
        <span className="font-mono text-xs text-zinc-500 tracking-widest block sticky top-28 reveal">
          01 // EDUCATION
        </span>
      </div>

      {/* Right Column (8 cols) */}
      <div className="lg:col-span-8 py-24 lg:py-36 px-8 lg:px-16">
        <div className="relative border-l border-zinc-900 ml-4 md:ml-6 pl-8 md:pl-12 py-4 space-y-20">
          {education.map((edu, index) => (
            <div key={index} className="relative group reveal">
              {/* Timeline Node Dot */}
              <div className="absolute -left-[37px] md:-left-[53px] top-2 flex items-center justify-center">
                <span className="w-2 h-2 rounded-full bg-zinc-800 border border-zinc-950 group-hover:bg-purple-400 group-hover:border-purple-400 transition-all duration-300 ring-4 ring-black" />
              </div>

              {/* Duration */}
              <div className="font-mono text-[9px] text-zinc-500 tracking-widest uppercase mb-2">
                {edu.duration}
              </div>

              {/* Degree & University */}
              <div className="flex flex-col sm:flex-row sm:justify-between gap-1.5 border-b border-zinc-950 pb-2">
                <h3 className="text-white font-display text-xl sm:text-2xl font-light tracking-tight">
                  {edu.degree}
                </h3>
                <span className="text-xs font-mono text-zinc-400 tracking-wider">
                  {edu.university}
                </span>
              </div>

              {/* Highlights */}
              <ul className="mt-5 space-y-3.5 list-none text-zinc-400 text-xs sm:text-sm leading-relaxed">
                {edu.highlights.map((hl, hlIdx) => (
                  <li key={hlIdx} className="relative pl-5 before:content-['—'] before:absolute before:left-0 before:text-zinc-700 text-zinc-400">
                    {hl}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
