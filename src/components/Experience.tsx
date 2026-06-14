import { motion } from "framer-motion";
import { portfolioData } from "../data/portfolioData";

export default function Experience() {
  const experiences = portfolioData.experience;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
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

  return (
    <section id="experience" className="grid grid-cols-1 lg:grid-cols-12 border-b border-zinc-900 items-stretch">
      
      {/* Left Column (4 cols) */}
      <div className="lg:col-span-4 border-b lg:border-b-0 lg:border-r border-zinc-900 p-8 lg:p-12 bg-black/20">
        <span className="font-mono text-xs text-zinc-500 tracking-widest block sticky top-28">02 // EXPERIENCE</span>
      </div>

      {/* Right Column (8 cols) */}
      <div className="lg:col-span-8 p-8 lg:p-12">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="relative border-l border-zinc-900 ml-4 md:ml-6 pl-8 md:pl-12 py-4 space-y-12 sm:space-y-16"
        >
          {experiences.map((exp, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="relative group"
            >
              {/* Timeline Node Dot */}
              <div className="absolute -left-[37px] md:-left-[53px] top-2 flex items-center justify-center">
                <span className="w-2.5 h-2.5 rounded-full bg-zinc-800 border border-zinc-900 group-hover:bg-white group-hover:border-white transition-all duration-300 ring-4 ring-black" />
              </div>

              {/* Date/Duration */}
              <div className="font-mono text-[10px] text-zinc-500 tracking-widest uppercase mb-1.5">
                {exp.duration}
              </div>

              {/* Role & Company */}
              <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1">
                <h3 className="text-white text-lg font-semibold tracking-tight">
                  {exp.role}
                </h3>
                <span className="text-sm font-mono text-zinc-400 font-medium">
                  {exp.company}
                </span>
              </div>

              {/* Achievement Bullet Points */}
              <ul className="mt-4 space-y-2.5 list-none text-zinc-400 text-sm leading-relaxed">
                {exp.points.map((point, ptIdx) => (
                  <li key={ptIdx} className="relative pl-5 before:content-['—'] before:absolute before:left-0 before:text-zinc-655 text-zinc-400">
                    {point}
                  </li>
                ))}
              </ul>

              {/* Skill capsules/tags used in this role */}
              <div className="mt-5 flex flex-wrap gap-2">
                {exp.skills.map((skill, skillIdx) => (
                  <span
                    key={skillIdx}
                    className="font-mono text-[9px] text-zinc-400 bg-zinc-950 border border-zinc-900 px-2 py-0.5 rounded-sm hover:border-zinc-700 transition-colors duration-300"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
