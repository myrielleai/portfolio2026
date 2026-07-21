import { useEffect, useRef } from "react";
import { Cpu, Layout, Layers, Sparkles } from "lucide-react";

export default function Capabilities() {
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  const services = [
    {
      icon: Cpu,
      number: "01",
      title: "AI Integration & Logic",
      description:
        "Implementing intelligent AI layers, structured model outputs, real-time streaming APIs, and autonomous agent orchestration into web products.",
    },
    {
      icon: Layers,
      number: "02",
      title: "Full-Stack Development",
      description:
        "Building resilient web applications with React, TypeScript, and Node.js paired with production-ready PostgreSQL relational database schemas.",
    },
    {
      icon: Layout,
      number: "03",
      title: "UI/UX & Design Systems",
      description:
        "Architecting minimalist, accessible design systems with tailored CSS variables, dark-mode tokens, and pixel-perfect responsive layouts.",
    },
    {
      icon: Sparkles,
      number: "04",
      title: "Motion & Creative Tech",
      description:
        "Crafting interactive experiences using Three.js 3D viewers, smooth Lenis inertia scroll, and fluid GSAP/Framer Motion physics.",
    },
  ];

  useEffect(() => {
    const observers: IntersectionObserver[] = [];

    cardRefs.current.forEach((card, index) => {
      if (!card) return;

      // Reset to hidden state initially
      card.style.opacity = "0";
      card.style.transform = "translateY(40px)";
      card.style.transition = "none";

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setTimeout(() => {
                if (card) {
                  card.style.transition =
                    "opacity 0.6s cubic-bezier(0.22, 1, 0.36, 1), transform 0.6s cubic-bezier(0.22, 1, 0.36, 1)";
                  card.style.opacity = "1";
                  card.style.transform = "translateY(0)";
                }
              }, index * 120); // 120ms stagger between each card
              observer.disconnect();
            }
          });
        },
        { threshold: 0.15 }
      );

      observer.observe(card);
      observers.push(observer);
    });

    return () => observers.forEach((obs) => obs.disconnect());
  }, []);

  return (
    <section
      id="capabilities"
      className="w-full py-24 lg:py-32 border-b border-[var(--border)] bg-[var(--surface)] transition-colors duration-300"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-12">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 pb-8 border-b border-[var(--border)] gap-6">
          <div>
            <span className="font-mono text-xs text-[var(--accent)] tracking-widest block mb-3 uppercase">
              02 // Expertise
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-display text-[var(--heading)] tracking-tight">
              Capabilities &amp; Services
            </h2>
          </div>
          <p className="font-mono text-xs text-[var(--text-muted)] max-w-sm leading-relaxed">
            Specialized engineering disciplines combined to deliver next-generation digital products.
          </p>
        </div>

        {/* Capabilities Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {services.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={index}
                ref={(el) => { cardRefs.current[index] = el; }}
                className="group p-8 rounded-xl border border-[var(--border)] bg-[var(--bg)] hover:border-[var(--accent)] transition-all duration-300 flex flex-col justify-between space-y-6 reveal"
                style={{ opacity: 0, transform: "translateY(40px)" }}
              >
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="p-3 rounded-lg border border-[var(--border)] bg-[var(--surface-muted)] text-[var(--heading)] group-hover:text-[var(--accent)] group-hover:border-[var(--accent)]/30 transition-colors">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="font-mono text-xs text-[var(--text-muted)]">{item.number}</span>
                  </div>

                  <h3 className="text-xl font-bold font-display text-[var(--heading)] tracking-tight">
                    {item.title}
                  </h3>

                  <p className="text-sm text-[var(--text-muted)] leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
