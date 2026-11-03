import { useEffect, useRef } from "react";
import { Brain, ScanEye, BarChart3, Sparkles, Rocket, Layout, Layers, Server } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Public-domain artworks from Wikimedia Commons, shown in their original colours
const commons = (file: string) => `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(file)}?width=800`;

export default function Capabilities() {
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  const services = [
    {
      bgColor: "#ede4ff",
      fallbackTextColor: "#1e0b3a",
      image: commons('Raphael_School_of_Athens.jpg'),
      credit: "Raphael · The School of Athens",
      focus: "50% 40%",
      icon: Brain,
      title: "Model Training & Evaluation",
      description: "I label the data, then train and tune the model until it actually performs, not just in a notebook.",
      tools: "PyTorch · TensorFlow / Keras · YOLO",
    },
    {
      bgColor: "#0a0a0a",
      fallbackTextColor: "#ffffff",
      image: commons('Johannes_Vermeer_-_The_Astronomer_-_1668.jpg'),
      credit: "Vermeer · The Astronomer",
      focus: "45% 35%",
      icon: ScanEye,
      title: "Computer Vision",
      description: "Detection and segmentation that spots what people miss, like the leaf lesions in DeepLeaf.",
      tools: "YOLO · OpenCV · Roboflow",
    },
    {
      bgColor: "#9333ea",
      fallbackTextColor: "#ffffff",
      image: commons('A_Sunday_on_La_Grande_Jatte,_Georges_Seurat,_1884.jpg'),
      credit: "Seurat · A Sunday on La Grande Jatte",
      focus: "55% 55%",
      icon: BarChart3,
      title: "Data & Classic ML",
      description: "I clean, explore and model your data so the numbers finally tell a clear story.",
      tools: "pandas · scikit-learn",
    },
    {
      bgColor: "#FFF",
      fallbackTextColor: "#0a0a0a",
      image: commons('Brueghel-tower-of-babel.jpg'),
      credit: "Bruegel · The Tower of Babel",
      focus: "50% 45%",
      icon: Sparkles,
      title: "LLM Apps",
      description: "Chat, search over your documents and structured answers, built right into your product.",
      tools: "LLM APIs · LangChain",
    },
    {
      bgColor: "#1e0b3a",
      fallbackTextColor: "#ffffff",
      image: commons('Caspar_David_Friedrich_-_Wanderer_above_the_sea_of_fog.jpg'),
      credit: "Friedrich · Wanderer above the Sea of Fog",
      focus: "50% 30%",
      icon: Rocket,
      title: "Model Deployment",
      description: "From a trained model to a live app anyone can open and try in seconds.",
      tools: "Streamlit · real-time inference",
    },
    {
      bgColor: "#FFF",
      fallbackTextColor: "#0a0a0a",
      image: commons('Johannes_Vermeer_-_Girl_with_a_Pearl_Earring_-_670_-_Mauritshuis.jpg'),
      credit: "Vermeer · Girl with a Pearl Earring",
      focus: "50% 35%",
      icon: Layout,
      title: "Frontend Development",
      description: "Fast, responsive screens that make sense the first time someone uses them.",
      tools: "React · TypeScript · Tailwind CSS",
    },
    {
      bgColor: "#ede4ff",
      fallbackTextColor: "#1e0b3a",
      image: commons('The_Great_Wave_off_Kanagawa.jpg'),
      credit: "Hokusai · The Great Wave off Kanagawa",
      focus: "40% 45%",
      icon: Layers,
      title: "Motion & 3D",
      description: "Motion and 3D that make a site feel alive, like the desk you just played with.",
      tools: "Framer Motion · GSAP · Three.js",
    },
    {
      bgColor: "#0a0a0a",
      fallbackTextColor: "#ffffff",
      image: commons('Turner_-_Rain,_Steam_and_Speed_-_National_Gallery_file.jpg'),
      credit: "Turner · Rain, Steam and Speed",
      focus: "60% 55%",
      icon: Server,
      title: "Backend & Databases",
      description: "APIs and databases that keep everything running, from the Figma file to the deploy.",
      tools: "Node.js · Express · PHP · MySQL · PostgreSQL · Vercel",
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
      className="w-full pt-24 pb-20 lg:pt-32 lg:pb-24 bg-[var(--surface)] transition-colors duration-300 relative overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 pb-8 border-b border-[var(--border)] gap-6">
          <div>
            <span className="font-mono text-xs text-[var(--accent)] tracking-widest block mb-3 uppercase">
              03 // Expertise
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-display text-[var(--heading)] tracking-tight">
              Skills &amp; Capabilities
            </h2>
          </div>
        </div>

        {/* Capabilities Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {services.map((item, index) => {
            return (
              <div
                key={index}
                ref={(el) => { cardRefs.current[index] = el; }}
                className={`card group flex flex-col justify-between ${item.bgColor === "#FFF" ? "ring-1 ring-[var(--border)]" : ""}`}
                {...{ 'bg-color': item.bgColor }}
                style={{
                  '--bg-color': item.bgColor,
                  backgroundColor: item.bgColor,
                  color: item.fallbackTextColor,
                  opacity: 0,
                } as React.CSSProperties}
              >
                <div className="card__image card__art relative overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.credit}
                    loading="lazy"
                    decoding="async"
                    className="card__classic"
                    style={{ objectPosition: item.focus }}
                  />
                  <span className="absolute bottom-1.5 left-2 font-serif text-[10px] italic opacity-0 transition-opacity duration-300 group-hover:opacity-90" style={{ color: item.fallbackTextColor, textShadow: "0 1px 4px rgba(0,0,0,0.35)" }}>
                    {item.credit}
                  </span>
                </div>

                <div className="card__text flex flex-col justify-between flex-grow mt-3">
                  <div>
                    <h3 className="text-lg font-bold font-display tracking-tight mb-2">
                      {item.title}
                    </h3>
                  </div>

                  <div className="mt-2">
                    <p className="text-xs sm:text-sm opacity-90 leading-relaxed font-sans">
                      {item.description}
                    </p>
                    <p className="mt-3 font-mono text-[10px] uppercase tracking-wider opacity-60">
                      {item.tools}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>

    </section>
  );
}

