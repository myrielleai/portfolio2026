export interface WorkItem {
  id: string;
  title: string;
  subtitle?: string;
  description: string;
  tags: string[];
  image?: string;
  demoUrl?: string;
  githubUrl?: string;
  date?: string;
  featured?: boolean;
  category: "websites" | "models3d" | "artworks" | "achievements";
}

export interface WorkCategory {
  id: "websites" | "models3d" | "artworks" | "achievements";
  index: string;
  title: string;
  description: string;
  countLabel: string;
  items: WorkItem[];
}

export const worksCategories: WorkCategory[] = [
  {
    id: "websites",
    index: "01",
    title: "Websites",
    description: "Production web applications, cloud backends, logistics engines, and interactive web platforms.",
    countLabel: "4 Projects",
    items: [
      {
        id: "web-1",
        title: "Makati Human Milk Bank System",
        subtitle: "Cloud Database & Healthcare Management System",
        description: "Designed and deployed a cloud-based PostgreSQL database using Render, featuring relational data modeling, schema optimizations, and SQL queries. Restructured milk inventory management for medical staff.",
        tags: ["PostgreSQL", "Render", "Express", "SQL", "Tailwind CSS"],
        image: "/project1.webp",
        demoUrl: "https://hmbms-server.onrender.com/",
        githubUrl: "https://github.com/KadenYohan/MilkBank-Group-Seven",
        date: "2025",
        category: "websites",
        featured: true
      },
      {
        id: "web-2",
        title: "ReliefSync: Disaster Logistics Engine",
        subtitle: "Real-time Task & Inventory Coordinator",
        description: "An ultra-fast, local-first disaster response engine. Features instant local-first state persistence, optimistic UI updates, keyboard-driven navigation, and real-time operational dashboard.",
        tags: ["React", "Tailwind CSS", "LocalForage", "Framer Motion", "Vite"],
        image: "/project2.webp",
        demoUrl: "https://reliefsync-frontend-d3sw.onrender.com/index.html",
        githubUrl: "https://github.com/myrielleai/ReliefSync",
        date: "2025",
        category: "websites",
        featured: true
      },
      {
        id: "web-3",
        title: "UChannel Interactive Experience",
        subtitle: "Web3/Creative Interactive Platform",
        description: "Interactive visual web experience built with React and Three.js. Includes custom gesture handling, 3D physics spring dynamics, and dynamic canvas lighting for an engaging user experience.",
        tags: ["React", "Three.js", "TypeScript", "GSAP", "Tailwind CSS"],
        image: "/project3.webp",
        demoUrl: "https://uchannel.ph",
        githubUrl: "https://github.com",
        date: "2025",
        category: "websites"
      },
      {
        id: "web-4",
        title: "Endlezz Market Website",
        subtitle: "E-Commerce & Layout Engineering Engine",
        description: "A high-performance modern web application featuring responsive grid architecture, fluid product filtering, dynamic cart management, and dark mode interface.",
        tags: ["React", "CSS Grid", "TypeScript", "Vite", "Framer Motion"],
        image: "/project4.webp",
        demoUrl: "https://endlezz-market.vercel.app/",
        githubUrl: "https://github.com/myrielleai/EndlezzMarket",
        date: "2025",
        category: "websites"
      }
    ]
  },
  {
    id: "models3d",
    index: "02",
    title: "3D Models",
    description: "Real-time WebGL, Three.js shaders, GLTF assets, and interactive spatial 3D environments.",
    countLabel: "3 Sculptures & Scenes",
    items: [
      {
        id: "model-1",
        title: "Cyberpunk busts / Sculptural Head",
        subtitle: "Interactive Vertex Shader & Particle Head Model",
        description: "Custom Three.js 3D avatar scene with procedurally generated GLSL wireframe shaders, particle aura, real-time mouse interaction, and dynamic light reflection.",
        tags: ["Three.js", "GLSL Shaders", "WebGL", "TypeScript", "BufferGeometry"],
        image: "/about.webp",
        demoUrl: "/lab",
        githubUrl: "https://github.com/myrielleai/portfolio2026",
        date: "2026",
        category: "models3d",
        featured: true
      },
      {
        id: "model-2",
        title: "Sci-Fi Workbench & Synthesizer Console",
        subtitle: "Procedural 3D Audio Workspace",
        description: "Interactive 3D workspace console built with Three.js. Features draggable physical desktop objects, reactive audio visualizer knobs, and tactile canvas grid materials.",
        tags: ["Three.js", "Canvas2D", "Web Audio API", "GSAP", "Three Physics"],
        image: "/project3.webp",
        demoUrl: "/lab",
        githubUrl: "https://github.com/myrielleai/portfolio2026",
        date: "2026",
        category: "models3d"
      },
      {
        id: "model-3",
        title: "Low-Poly Node Canvas Matrix",
        subtitle: "Generative Geometry & Spatial Particles",
        description: "Spatial 3D particle node matrix simulating real-time physics connections, floating mesh geometry, and interactive camera orbital movement.",
        tags: ["WebGL", "Three.js", "GLTF", "Math GL"],
        image: "/project2.webp",
        demoUrl: "/lab",
        date: "2025",
        category: "models3d"
      }
    ]
  },
  {
    id: "artworks",
    index: "03",
    title: "Artworks",
    description: "Creative digital UI design, generative canvas experiments, cybernetic visual graphics, and motion compositions.",
    countLabel: "3 Creative Pieces",
    items: [
      {
        id: "art-1",
        title: "Neon Cybernetic Interface Specs",
        subtitle: "HUD Design & Interaction Motion Architecture",
        description: "Figma UI/UX prototype and motion artwork featuring modular HUD panels, dark glassmorphism, glowing telemetry indicators, and minimalist typography.",
        tags: ["Figma", "UI Design", "Motion Graphics", "Glassmorphism", "Brutalism"],
        image: "/project4.webp",
        date: "2026",
        category: "artworks",
        featured: true
      },
      {
        id: "art-2",
        title: "Generative Canvas Node Connections",
        subtitle: "HTML5 Canvas Art & Shader Composition",
        description: "Generative artwork created using HTML5 Canvas mathematical formulas, vector force fields, interactive cursor waves, and gradient noise overlays.",
        tags: ["Generative Art", "HTML5 Canvas", "JS Math", "Creative Coding"],
        image: "/project1.webp",
        date: "2025",
        category: "artworks"
      },
      {
        id: "art-3",
        title: "Minimalist Cyberpunk Poster Collection",
        subtitle: "Visual Typography & Composition Study",
        description: "A series of high-contrast visual posters exploring technical typography, monochromatic color schemes with neon accents, and structural grid rules.",
        tags: ["Graphic Design", "Typography", "Brutalist UX", "Poster Art"],
        image: "/project3.webp",
        date: "2025",
        category: "artworks"
      }
    ]
  },
  {
    id: "achievements",
    index: "04",
    title: "Achievements",
    description: "Academic honors, capstone leadership recognitions, freelance milestones, and technology certifications.",
    countLabel: "4 Milestones",
    items: [
      {
        id: "ach-1",
        title: "Dean's Lister — Academic Excellence",
        subtitle: "Polytechnic University of the Philippines",
        description: "Consistently achieved high academic honors in BS Information Technology (2023 - 2027), specializing in cloud databases, full-stack software development, and AI logic.",
        tags: ["Academic Honor", "BSIT", "High Academic Standing"],
        date: "2023 — 2027",
        category: "achievements",
        featured: true
      },
      {
        id: "ach-2",
        title: "Capstone Lead & Database Architect",
        subtitle: "Makati Human Milk Bank System Project Lead",
        description: "Architected and delivered full relational PostgreSQL schema and cloud deployment for the Makati Human Milk Bank System capstone project, receiving top faculty commendation.",
        tags: ["Project Leadership", "Capstone Lead", "Cloud Deployment"],
        date: "2025",
        category: "achievements"
      },
      {
        id: "ach-3",
        title: "Full-Stack Freelance Client Milestone",
        subtitle: "Independent AI & Web Engineering",
        description: "Successfully designed, developed, and deployed production web applications and custom interactive interfaces for diverse client platforms across Q1 2024 - Q3 2026.",
        tags: ["Freelance", "Client Work", "Full-Stack"],
        date: "2024 — Present",
        category: "achievements"
      },
      {
        id: "ach-4",
        title: "UChannel Frontend Development Lead",
        subtitle: "Interactive Web Experience Engineering",
        description: "Spearheaded frontend implementation for UChannel using React, Three.js, and GSAP, achieving smooth 60 FPS animation performance across desktop and mobile devices.",
        tags: ["Frontend Lead", "Three.js", "Performance Optimization"],
        date: "2025",
        category: "achievements"
      }
    ]
  }
];
