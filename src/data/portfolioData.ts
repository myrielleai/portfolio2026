export interface Project {
  title: string;
  /** Which group the project appears under in Selected Works. */
  category: "ai" | "web";
  /** Short discipline / category line shown in the index row, e.g. "Cloud Database · Healthcare". */
  subtitle?: string;
  /** Year shown on the right of the row. */
  year: string;
  /** Adds a small "New" badge next to the title. */
  isNew?: boolean;
  /** Award / recognition, shown as a gold badge (e.g. "Top 3 · Hackathon"). */
  award?: string;
  /** Shows this project as the large highlighted card above the index (use on one project). */
  featured?: boolean;
  /** One-line summary shown big on the featured card. */
  tagline?: string;
  /** What you did — shown as a checklist on the featured card. */
  role?: string[];
  /** Short headline numbers shown in one line on the featured card. */
  stats?: { value: string; label: string }[];
  description: string;
  tags: string[];
  demoUrl?: string;
  githubUrl?: string;
  image?: string;
  /** Optional tall, full-page screenshot: hovering the browser window scrolls through it */
  pageImage?: string;
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

  // Selected Works — shown top to bottom on the home page. Put the newest work first.
  // To add a project: copy one block, fill it in, and drop a screenshot (16:10 works best) into /public.
  projects: [
    {
      title: "DeepLeaf",
      category: "ai",
      subtitle: "AI · Computer Vision",
      year: "2026",
      featured: true,
      isNew: true,
      tagline: "An AI model that spots tomato leaf diseases and outlines every lesion.",
      description: "A YOLO26 instance segmentation model that detects and outlines individual lesions of four tomato leaf diseases, published as an IEEE-format paper and deployed as a Streamlit web app.",
      role: [
        "Hand-annotated the lesion dataset",
        "Trained and evaluated the YOLO26 model"
      ],
      stats: [
        { value: "0.569", label: "mask mAP@0.5" },
        { value: "1,371", label: "annotated images" },
        { value: "4", label: "diseases" }
      ],
      tags: ["YOLO26", "PyTorch", "Roboflow", "Streamlit"],
      demoUrl: "https://deepleafai2.streamlit.app/",
      githubUrl: "https://github.com/myrielleai/DeepLeaf",
      image: "/deepleaf.webp"
    },
    {
      title: "BookSwap",
      category: "web",
      subtitle: "Peer-to-Peer Book Exchange",
      year: "2026",
      isNew: true,
      description: "A community platform for trading physical books, with verified listings, moderated meetup handovers and separate dashboards for readers, volunteer moderators and admins — including participation reports and printable exchange receipts.",
      tags: ["React", "Tailwind CSS", "PHP", "MySQL", "Google OAuth"],
      demoUrl: "https://bookswap-eta.vercel.app",
      githubUrl: "https://github.com/myrielleai/BookSwap",
      image: "/bookswap.webp"
    },
    {
      title: "ReliefSync",
      category: "web",
      subtitle: "Disaster Logistics Engine",
      year: "2025",
      award: "Top 3 · Hackathon",
      description: "A local-first disaster response engine for coordinating relief tasks and inventory. Instant offline state, optimistic updates, keyboard-driven navigation and a real-time operations dashboard.",
      tags: ["React", "Tailwind CSS", "LocalForage", "Framer Motion"],
      demoUrl: "https://reliefsync-frontend-d3sw.onrender.com/index.html",
      githubUrl: "https://github.com/myrielleai/ReliefSync",
      image: "/project2.webp"
    },
    {
      title: "Makati Human Milk Bank",
      category: "web",
      subtitle: "Cloud Database · Healthcare",
      year: "2025",
      description: "Designed and deployed a cloud-based PostgreSQL database on Render — schema design, relational modeling and SQL queries — giving the milk bank's backend a clean, reliable data structure.",
      tags: ["PostgreSQL", "Render", "SQL"],
      demoUrl: "https://hmbms-server.onrender.com/",
      githubUrl: "https://github.com/KadenYohan/MilkBank-Group-Seven",
      image: "/project1.webp"
    },
    {
      title: "UChannel",
      category: "web",
      subtitle: "Interactive Web Experience",
      year: "2025",
      description: "An immersive company site built with React and Three.js, with gesture handling, spring physics and smooth scroll-driven motion, translated pixel-for-pixel from Figma.",
      tags: ["React", "Three.js", "TypeScript", "Tailwind CSS"],
      demoUrl: "https://uchannel.ph",
      image: "/uchannel.webp"
    },
    {
      title: "Endlezz Market",
      category: "web",
      subtitle: "E-Commerce Storefront",
      year: "2025",
      description: "A responsive streetwear storefront with a shop, product pages, a lookbook, search and a cart, backed by a Supabase catalogue.",
      tags: ["Next.js", "TypeScript", "Tailwind CSS", "Supabase"],
      demoUrl: "https://endlezz-market.vercel.app/",
      githubUrl: "https://github.com/myrielleai/EndlezzMarket",
      image: "/endlezz.webp"
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
