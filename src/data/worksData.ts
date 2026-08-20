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
    countLabel: "7 Projects",
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
      },
      {
        id: "web-5",
        title: "Neural Studio & AI Design Lab",
        subtitle: "Autonomous AI & Intelligent Canvas Suite",
        description: "An intelligent generative workspace combining agentic workflow orchestration, real-time node graphs, and low-latency canvas rendering.",
        tags: ["React", "TypeScript", "AI Logic", "Tailwind CSS", "Canvas API"],
        image: "/about.webp",
        demoUrl: "https://github.com/myrielleai",
        githubUrl: "https://github.com/myrielleai",
        date: "2026",
        category: "websites"
      },
      {
        id: "web-6",
        title: "Creation of Adam Digital Archive",
        subtitle: "Interactive Masterpiece & Shader Canvas",
        description: "High-resolution dynamic WebGL canvas renderer showcasing classical art digital preservation, fragment shaders, and depth map parallax.",
        tags: ["WebGL", "Three.js", "GLSL Shaders", "TypeScript", "Framer Motion"],
        image: "/creation-adam-bg.webp",
        demoUrl: "https://github.com/myrielleai",
        githubUrl: "https://github.com/myrielleai",
        date: "2026",
        category: "websites"
      },
      {
        id: "web-7",
        title: "HyperScale Logistics & Grid Dashboard",
        subtitle: "High-Velocity Analytics & Operations Portal",
        description: "Enterprise logistics and telemetry dashboard supporting real-time data streaming, interactive data visualization, and responsive grid monitoring.",
        tags: ["React", "D3.js", "TypeScript", "PostgreSQL", "Tailwind CSS"],
        image: "/project1.webp",
        demoUrl: "https://github.com/myrielleai",
        githubUrl: "https://github.com/myrielleai",
        date: "2025",
        category: "websites"
      }
    ]
  }
];

