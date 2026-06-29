export interface Project {
  title: string;
  description: string;
  tags: string[];
  demoUrl?: string;
  githubUrl?: string;
  image?: string;
}

export interface Experience {
  role: string;
  company: string;
  duration: string;
  points: string[];
  skills: string[];
}

export interface Education {
  degree: string;
  university: string;
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
      degree: "BS Information Technology",
      university: "Polytechnic University of the Philippines",
      duration: "2023 — 2027",
      highlights: [
        "Specializing in web development and AI integration",
        "Dean's Lister — consistent academic excellence",
        "Led multiple full-stack capstone and research projects"
      ]
    }
  ],
  experience: [
    {
      role: "AI & Full-Stack Developer",
      company: "Freelance",
      duration: "2024 — Present",
      points: [
        "Built intelligent web applications using React, TypeScript, and Node.js with AI-powered features",
        "Designed and deployed cloud-based PostgreSQL databases with relational modeling and schema design",
        "Developed responsive, motion-rich frontends with Tailwind CSS, Framer Motion, and GSAP"
      ],
      skills: ["React", "TypeScript", "Node.js", "PostgreSQL", "Tailwind CSS", "GSAP"]
    },
    {
      role: "Frontend Developer",
      company: "UChannel",
      duration: "2025",
      points: [
        "Built interactive UI components with React and Three.js for an immersive web experience",
        "Implemented smooth scroll animations and responsive layouts with modern CSS techniques",
        "Collaborated with designers to translate Figma mockups into pixel-perfect interfaces"
      ],
      skills: ["React", "Three.js", "TypeScript", "Tailwind CSS", "Figma"]
    }
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
    "POSTGRESQL",
    "THREE.JS",
    "D3.JS",
    "GIT",
    "AESTHETICS"
  ]
};
