import { motion } from "framer-motion";
import { portfolioData } from "../data/portfolioData";

export default function About() {
  const { title, paragraphs, sidebarTitle, sidebarItems } = portfolioData.about;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
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
    <section id="about" className="grid grid-cols-1 lg:grid-cols-12 border-b border-zinc-900 items-stretch">
      
      {/* Left Column (4 cols) */}
      <div className="lg:col-span-4 border-b lg:border-b-0 lg:border-r border-zinc-900 p-8 lg:p-12 bg-black/20">
        <span className="font-mono text-xs text-zinc-500 tracking-widest block sticky top-28">{title}</span>
      </div>

      {/* Right Column (8 cols) */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        className="lg:col-span-8 p-8 lg:p-12 grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-12"
      >
        {/* Main bio content (2 cols on desktop) */}
        <div className="md:col-span-2 space-y-6 text-zinc-400 text-sm sm:text-base leading-relaxed">
          {paragraphs.map((p, index) => (
            <motion.p key={index} variants={itemVariants} className={index === 0 ? "text-white text-base sm:text-lg font-normal" : ""}>
              {p}
            </motion.p>
          ))}
        </div>

        {/* Technical Sidebar (1 col on desktop) */}
        <motion.div variants={itemVariants} className="border border-zinc-900 bg-zinc-950/40 p-6 flex flex-col justify-between space-y-6">
          <div>
            <h3 className="font-mono text-[10px] text-zinc-500 tracking-wider uppercase mb-4 border-b border-zinc-900 pb-2">
              {sidebarTitle}
            </h3>
            <div className="space-y-4">
              {sidebarItems.map((item, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="font-mono text-[9px] text-zinc-500 tracking-widest">{item.label}</div>
                  <div className="text-xs text-zinc-300 font-mono font-medium">{item.value}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="pt-4 border-t border-zinc-900/60 font-mono text-[9px] text-zinc-650">
            SYSTEM_STATUS: SECURE // 200 OK
          </div>
        </motion.div>

      </motion.div>
    </section>
  );
}
