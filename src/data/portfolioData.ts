export interface Project {
  title: string;
  description: string;
  tags: string[];
  demoUrl?: string;
  githubUrl?: string;
  image?: string;
}

export interface Experience {
  company: string;
  role: string;
  duration: string;
  points: string[];
  skills: string[];
}

export interface Education {
  university: string;
  degree: string;
  duration: string;
  highlights: string[];
}
export interface PortfolioData {
  name: string;
  role: string;
  email: string;
  resumeUrl: string;
  githubUrl: string;
  linkedinUrl: string;
  twitterUrl?: string;
  instagramUrl?: string;
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
  education: Education[];
  experience: Experience[];
  projects: Project[];
  skills: string[];
}

export const portfolioData: PortfolioData = {
  name: "Myrielle",
  role: "AI Engineer & Full-Stack Developer",
  email: "myrielle.work@gmail.com",
  resumeUrl: "#",
  githubUrl: "https://github.com",
  linkedinUrl: "https://www.linkedin.com/in/myriellej/",
  instagramUrl: "https://www.instagram.com/myriellej/",
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
  education: [
    {
      university: "Mapua University",
      degree: "BS Computer Science",
      duration: "",
      highlights: ["Strong academic performance in core CS and IT subjects"]
    },
    {
      university: "University of Santo Tomas",
      degree: "BS Architecture",
      duration: "",
      highlights: ["Dean’s List (First Semester and Second Semester, Year 1)", "Class President"]
    }
  ],
  experience: [
    {
      company: "UChannel",
      role: "Designer & Social Media Manager",
      duration: "2025 - 2025",
      points: [
        "Architected an open-source React component library used by 45+ product teams, decreasing page load times by 40%.",
        "Pioneered Framer Motion dynamic layout groups to transition visual states smoothly, achieving a 95% user satisfaction rate.",
        "Refactored state-management systems using lightweight signals, cutting memory footprints by 35% on low-end mobile devices."
      ],
      skills: ["React", "TypeScript", "Tailwind CSS", "Framer Motion", "Vite"]
    },

  ],
  projects: [
    {
      title: "Makati Human Milk Bank System",
      description: "Designed and deployed a cloud-based PostgreSQL database using Render, including schema design, relational modeling, and SQL query implementation. Ensured proper data structure and integration support for the system’s backend.",
      tags: ["PostgreSQL", "Render", "SQL"],
      demoUrl: "https://hmbms-server.onrender.com/",
      githubUrl: "https://github.com/KadenYohan/MilkBank-Group-Seven",
      image: "/project1.png"
    },
    {
      title: "ReliefSync: Disaster Logistics Engine",
      description: "An ultra-fast, keyboard-driven task tracking app. Features instant local-first state, optimistic updates, and complex command menu palettes.",
      tags: ["React", "Tailwind CSS", "LocalForage", "Framer Motion"],
      demoUrl: "https://reliefsync-frontend-d3sw.onrender.com/index.html",
      githubUrl: "https://github.com/myrielleai/ReliefSync",
      image: "/project2.png"
    },
    {
      title: "UChannel Website",
      description: "Interactive visual environment for testing physical layouts, physics spring configurations, and gesture interactions in the browser.",
      tags: ["React", "Three.js", "TypeScript", "Tailwind CSS"],
      demoUrl: "https://github.com",
      githubUrl: "https://github.com",
      image: "/project3.png"
    },
    {
      title: "Endlezz Market Website",
      description: "A brutalist CSS Grid and layout builder that exports clean, production-ready, hand-coded Vanilla CSS and Tailwind styles.",
      tags: ["React", "CSS Grid", "TypeScript", "Vite"],
      demoUrl: "https://endlezz-market.vercel.app/",
      githubUrl: "https://github.com/myrielleai/EndlezzMarket",
      image: "/project4.png"
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
