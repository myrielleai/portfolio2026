import { useEffect, useRef } from "react";
import { Cpu, Layout, Layers, Sparkles, Server, Zap, Compass, BarChart3 } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function Capabilities() {
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  const services = [
    {
      bgColor: "#FFF",
      fallbackTextColor: "#0a0a0a",
      image: "https://images.unsplash.com/photo-1535376472810-5d229c65da09?crop=entropy&cs=srgb&fm=jpg&w=600&auto=format&fit=crop&q=80",
      icon: Compass,
      number: "01",
      title: "Product Strategy & Discovery",
      description: "Transforming complex technical challenges into validated MVP roadmap specifications and user journey flows.",
    },
    {
      bgColor: "#000",
      fallbackTextColor: "#ffffff",
      image: "https://images.unsplash.com/photo-1529641484336-ef35148bab06?crop=entropy&cs=srgb&fm=jpg&w=600&auto=format&fit=crop&q=80",
      icon: BarChart3,
      number: "02",
      title: "Data & Telemetry Pipelines",
      description: "Constructing real-time telemetry, data stream visualization, ETL workflows, and reporting dashboards.",
    },
    {
      bgColor: "#FBC02D",
      fallbackTextColor: "#0a0a0a",
      image: "https://images.unsplash.com/photo-1541356665065-22676f35dd40?crop=entropy&cs=srgb&fm=jpg&w=600&auto=format&fit=crop&q=80",
      icon: Layout,
      number: "03",
      title: "UI/UX & Design Systems",
      description: "Architecting minimalist, accessible design systems with tailored CSS variables, dark-mode tokens, and pixel-perfect layouts.",
    },
    {
      bgColor: "#C2185B",
      fallbackTextColor: "#ffffff",
      image: "https://images.unsplash.com/photo-1550684848-86a5d8727436?crop=entropy&cs=srgb&fm=jpg&w=600&auto=format&fit=crop&q=80",
      icon: Layers,
      number: "04",
      title: "Full-Stack Engineering",
      description: "Building resilient web applications with React, TypeScript, and Node.js paired with production-ready databases.",
    },
    {
      bgColor: "#2f6a9d",
      fallbackTextColor: "#ffffff",
      image: "https://images.unsplash.com/photo-1620121692029-d088224ddc74?crop=entropy&cs=srgb&fm=jpg&w=600&auto=format&fit=crop&q=80",
      icon: Cpu,
      number: "05",
      title: "AI Integration & Logic",
      description: "Implementing intelligent AI layers, structured model outputs, real-time streaming APIs, and autonomous agent orchestration.",
    },
    {
      bgColor: "#212121",
      fallbackTextColor: "#ffffff",
      image: "https://images.unsplash.com/photo-1604871000636-074fa5117945?crop=entropy&cs=srgb&fm=jpg&w=600&auto=format&fit=crop&q=80",
      icon: Server,
      number: "06",
      title: "Cloud Infrastructure",
      description: "Deploying high-availability cloud microservices, edge network routing, serverless pipelines, and container infrastructure.",
    },
    {
      bgColor: "#B388FF",
      fallbackTextColor: "#0a0a0a",
      image: "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?crop=entropy&cs=srgb&fm=jpg&w=600&auto=format&fit=crop&q=80",
      icon: Sparkles,
      number: "07",
      title: "Motion & Creative Tech",
      description: "Crafting interactive web experiences using 3D scenes, smooth inertia scroll, and fluid GSAP animation physics.",
    },
    {
      bgColor: "#43A047",
      fallbackTextColor: "#ffffff",
      image: "https://images.unsplash.com/photo-1496450080853-5f78c43af9e9?crop=entropy&cs=srgb&fm=jpg&w=600&auto=format&fit=crop&q=80",
      icon: Zap,
      number: "08",
      title: "Performance Optimization",
      description: "Optimizing web applications for sub-second LCP, minimal bundle footprint, zero memory leaks, and 60fps rendering.",
    },
  ];

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const cards = cardRefs.current.filter((card): card is HTMLDivElement => card !== null);
    if (cards.length === 0) return;

    gsap.set(cards, { 
      y: 40, 
      opacity: 0,
      rotationX: 12,
      transformPerspective: 800,
      transformOrigin: "50% 0%"
    });

    const anim = gsap.to(cards, {
      y: 0,
      opacity: 1,
      rotationX: 0,
      duration: 0.9,
      stagger: 0.1,
      ease: "power3.out",
      clearProps: "transform,opacity,willChange",
      scrollTrigger: {
        trigger: "#capabilities",
        start: "top 80%",
        toggleActions: "play none none none",
        once: true,
      },
    });

    return () => {
      anim.kill();
    };
  }, []);

  return (
    <section
      id="capabilities"
      className="w-full py-24 lg:py-32 bg-[var(--surface)] transition-colors duration-300 relative overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 pb-8 border-b border-[var(--border)] gap-6">
          <div>
            <span className="font-mono text-xs text-[var(--accent)] tracking-widest block mb-3 uppercase">
              03 // Expertise
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {services.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={index}
                ref={(el) => { cardRefs.current[index] = el; }}
                className="card group flex flex-col justify-between"
                {...{ 'bg-color': item.bgColor }}
                style={{
                  '--bg-color': item.bgColor,
                  backgroundColor: item.bgColor,
                  color: item.fallbackTextColor,
                  opacity: 0,
                } as React.CSSProperties}
              >
                <img
                  className="card__image"
                  src={item.image}
                  alt={item.title}
                  loading="lazy"
                  decoding="async"
                />

                <div className="card__text flex flex-col justify-between flex-grow mt-3">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="p-2 rounded-md bg-black/15 dark:bg-white/15 flex items-center justify-center">
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className="font-mono text-xs font-bold opacity-80">{item.number}</span>
                    </div>

                    <h3 className="text-lg font-bold font-display tracking-tight mb-2">
                      {item.title}
                    </h3>
                  </div>

                  <p className="text-xs sm:text-sm opacity-90 leading-relaxed font-sans mt-2">
                    {item.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

      </div>

      {/* Seamless gradient fade transition into Footer */}
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent via-[var(--surface)]/40 to-[var(--bg)] pointer-events-none z-0" />
    </section>
  );
}

