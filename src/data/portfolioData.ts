export interface Project {
  title: string;
  description: string;
  tags: string[];
  demoUrl?: string;
  githubUrl?: string;
}

export interface Experience {
  company: string;
  role: string;
  duration: string;
  points: string[];
  skills: string[];
}

export interface PortfolioData {
  name: string;
  role: string;
  email: string;
  resumeUrl: string;
  githubUrl: string;
  linkedinUrl: string;
  twitterUrl?: string;
  isAvailableForWork: boolean;
  availabilityText: string;
  hero: {
    greeting: string;
    headline: string;
    keywords: string[];
    description: string;
    ctaPrimaryText: string;
    ctaPrimaryUrl: string;
    ctaSecondaryText: string;
    ctaSecondaryUrl: string;
  };
  about: {
    title: string;
    paragraphs: string[];
    sidebarTitle: string;
    sidebarItems: { label: string; value: string }[];
  };
  experience: Experience[];
  projects: Project[];
  skills: string[];
}

export const portfolioData: PortfolioData = {
  name: "Myrielle",
  role: "AI Engineer & Full-Stack Developer",
  email: "myrielle@gmail.com",
  resumeUrl: "#",
  githubUrl: "https://github.com",
  linkedinUrl: "https://linkedin.com",
  twitterUrl: "https://x.com",
  isAvailableForWork: true,
  availabilityText: "Available for Q3 2026 Projects",
  hero: {
    greeting: "00 // HELLO WORLD",
    headline: "Architecting intelligent systems and premium interfaces.",
    keywords: [
      "AI Developer",
      "Full-Stack Developer",
      "UI Architect",
      "Creative Technologist",
      "Interaction Designer"
    ],
    description: "I build next-generation applications with smart intelligence layers, modular code architectures, and premium motion design. Code is poetry, AI is the canvas.",
    ctaPrimaryText: "Explore Showcase",
    ctaPrimaryUrl: "#showcase",
    ctaSecondaryText: "Get In Touch",
    ctaSecondaryUrl: "#contact"
  },
  about: {
    title: "01 // ABOUT ME",
    paragraphs: [
      "I am a self-taught AI & Full-Stack Developer. I specialize in building next-generation intelligent applications, combining clean backend architecture with intuitive, motion-rich frontends.",
      "My approach centers around fluid layout design, modularity, and low-latency interaction. Code is poetry, AI is the canvas."
    ],
    sidebarTitle: "CORE PARADIGMS",
    sidebarItems: [
      { label: "01 / ARCHITECTURE", value: "AI Integration & Full-Stack" },
      { label: "02 / DESIGN", value: "Minimalist Cyberpunk" },
      { label: "03 / VELOCITY", value: "Real-time Data Streams" },
      { label: "04 / VISION", value: "Code is poetry, AI is the canvas" }
    ]
  },
  experience: [
    {
      company: "Vortex Labs",
      role: "Lead UI Engineer",
      duration: "2024 - Present",
      points: [
        "Architected an open-source React component library used by 45+ product teams, decreasing page load times by 40%.",
        "Pioneered Framer Motion dynamic layout groups to transition visual states smoothly, achieving a 95% user satisfaction rate.",
        "Refactored state-management systems using lightweight signals, cutting memory footprints by 35% on low-end mobile devices."
      ],
      skills: ["React", "TypeScript", "Tailwind CSS", "Framer Motion", "Vite"]
    },
    {
      company: "Aether AI",
      role: "Senior Frontend Engineer",
      duration: "2022 - 2024",
      points: [
        "Led the frontend team in shipping a real-time collaborative workspace editor with offline-first synchronization using CRDTs.",
        "Maintained and optimized Next.js App Router applications, implementing strict static generation to boost Lighthouse SEO scores.",
        "Established automated Web Content Accessibility Guidelines (WCAG) testing into CI/CD pipelines, ensuring full keyboard navigable interfaces."
      ],
      skills: ["Next.js", "React", "TypeScript", "Node.js", "Tailwind CSS", "Playwright"]
    },
    {
      company: "ByteDesign",
      role: "Frontend Developer",
      duration: "2020 - 2022",
      points: [
        "Developed custom high-performance data visualizations with SVG and D3.js for interactive analytics dashboards.",
        "Collaborated with product designers to implement a unified Figma-to-Code design token automation pipeline.",
        "Migrated legacy codebase from React Class Components to React Hooks, reducing bundle size by 20%."
      ],
      skills: ["React", "JavaScript", "D3.js", "SASS", "Vite"]
    }
  ],
  projects: [
    {
      title: "SyncFlow Core",
      description: "A developer-first state container with fine-grained reactivity, built-in timeline tracking, and hot module replacement support.",
      tags: ["TypeScript", "Reactivity", "NPM Package", "Vite"],
      demoUrl: "https://github.com",
      githubUrl: "https://github.com"
    },
    {
      title: "Linear-Style Task Engine",
      description: "An ultra-fast, keyboard-driven task tracking app. Features instant local-first state, optimistic updates, and complex command menu palettes.",
      tags: ["React", "Tailwind CSS", "LocalForage", "Framer Motion"],
      demoUrl: "https://github.com",
      githubUrl: "https://github.com"
    },
    {
      title: "Aura Motion Lab",
      description: "Interactive visual environment for testing physical layouts, physics spring configurations, and gesture interactions in the browser.",
      tags: ["React", "Three.js", "TypeScript", "Tailwind CSS"],
      demoUrl: "https://github.com",
      githubUrl: "https://github.com"
    },
    {
      title: "Neolithic Grid Editor",
      description: "A brutalist CSS Grid and layout builder that exports clean, production-ready, hand-coded Vanilla CSS and Tailwind styles.",
      tags: ["React", "CSS Grid", "TypeScript", "Vite"],
      demoUrl: "https://github.com",
      githubUrl: "https://github.com"
    }
  ],
  skills: [
    "REACT",
    "TYPESCRIPT",
    "TAILWIND CSS",
    "NEXT.JS",
    "FRAMER MOTION",
    "VITE",
    "NODE.JS",
    "POSTGRESQL",
    "THREE.JS",
    "D3.JS",
    "GIT",
    "AESTHETICS",
    "ACCESSIBILITY",
    "PERFORMANCE"
  ]
};
