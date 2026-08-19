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
  }
];

