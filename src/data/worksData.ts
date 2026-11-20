export type WorkCategoryId = "ai" | "websites" | "design" | "models3d" | "artworks" | "achievements";

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
  /** Award / recognition, shown as a gold badge (e.g. "Top 3 · Hackathon"). */
  award?: string;
  /** Still being built: shows an "In progress" badge, and a title card in place of a screenshot. */
  inProgress?: boolean;
  /** One-line pitch at the top of the project's case study. */
  pitch?: string;
  /** What I did on it (only where it's on record). */
  role?: string;
  /** Proof points listed in the case study: results, features, facts. */
  highlights?: string[];
  category: WorkCategoryId;
}

export interface WorkCategory {
  id: WorkCategoryId;
  index: string;
  title: string;
  description: string;
  items: WorkItem[];
}

// Works Archive (/works). Each category becomes a tab; empty categories are hidden automatically.
export const worksCategories: WorkCategory[] = [
  {
    id: "ai",
    index: "01",
    title: "AI & Machine Learning",
    description: "Models I've annotated data for, trained, evaluated and deployed.",
    items: [
      {
        id: "ai-1",
        title: "DeepLeaf",
        subtitle: "Tomato Foliar Disease Detection via YOLO26 Instance Segmentation",
        description: "An instance segmentation model that detects and outlines individual lesions of four tomato leaf diseases. I led the team, hand-annotated the lesion dataset and trained the YOLO26 model (0.569 mask mAP@0.5 on an unseen holdout set). Written up as an IEEE-format paper and deployed as a Streamlit app.",
        tags: ["YOLO26", "PyTorch", "Roboflow", "OpenCV", "Streamlit"],
        image: "/deepleaf.webp",
        pitch: "An AI model that finds and outlines every lesion on a tomato leaf.",
        role: "Team lead · dataset annotation · model training",
        highlights: [
          "0.569 mask mAP@0.5 on an unseen holdout set",
          "Segments lesions from four tomato leaf diseases, one by one",
          "Written up as an IEEE-format paper",
          "Deployed as a live Streamlit app",
        ],
        demoUrl: "https://deepleafai2.streamlit.app/",
        githubUrl: "https://github.com/myrielleai/DeepLeaf",
        date: "2026",
        featured: true,
        category: "ai"
      },
      {
        id: "ai-2",
        title: "Ate TALA",
        subtitle: "A Trusted Advocacy & Legal Assistant for Barangay VAW and GBV Safe Spaces",
        description: "An LLM assistant that gives advocacy and legal guidance to barangay Violence Against Women (VAW) and gender-based violence (GBV) safe spaces. It answers case-handling questions, in English or Filipino, from the Philippine laws and guidelines loaded into it, and cites the document each answer comes from. The first working version is fine-tuned from Qwen2.5-3B, and more models are being trained to benchmark against each other.",
        tags: ["LLM", "Qwen2.5-3B", "Fine-tuning", "RAG"],
        image: "/atetala.webp",
        pitch: "An AI assistant for barangay VAW and GBV safe spaces.",
        role: "Project lead · model training",
        highlights: [
          "Answers grounded in Philippine laws and guidelines, with the source cited",
          "Handles questions in English and Filipino",
          "First working model fine-tuned from Qwen2.5-3B",
          "More models in training, to benchmark and pick the best assistant",
        ],
        date: "2026 – Present",
        inProgress: true,
        category: "ai"
      }
    ]
  },
  {
    id: "websites",
    index: "02",
    title: "Websites",
    description: "Full-stack web apps, cloud backends and interactive sites.",
    items: [
      {
        id: "web-1",
        title: "BookSwap",
        subtitle: "Peer-to-Peer Book Exchange",
        description: "A community platform for trading physical books, with verified listings, moderated meetup handovers and separate dashboards for readers, volunteer moderators and admins, including participation reports and printable exchange receipts.",
        tags: ["React", "Tailwind CSS", "PHP", "MySQL", "Google OAuth"],
        image: "/bookswap.webp",
        pitch: "A community platform for trading physical books, safely.",
        role: "Full-stack developer",
        highlights: [
          "Verified listings and moderated meetup handovers",
          "Separate dashboards for readers, volunteer moderators and admins",
          "Participation reports and printable exchange receipts",
          "Google sign-in",
        ],
        demoUrl: "https://bookswap-eta.vercel.app",
        githubUrl: "https://github.com/myrielleai/BookSwap",
        date: "2026",
        category: "websites"
      },
      {
        id: "web-2",
        title: "ReliefSync",
        subtitle: "Disaster Logistics Engine",
        description: "A local-first disaster response engine for coordinating relief tasks and inventory, with instant offline state, optimistic updates, keyboard-driven navigation and a real-time operations dashboard. Placed 3rd out of 37 teams at a hackathon.",
        tags: ["React", "Tailwind CSS", "LocalForage", "Framer Motion", "Vite"],
        image: "/project2.webp",
        pitch: "Coordinating disaster relief, even when the connection drops.",
        role: "Frontend developer · research paper & pitch lead",
        highlights: [
          "Placed 3rd out of 37 teams at a hackathon",
          "Local-first: works offline with instant state",
          "Optimistic updates and keyboard-driven navigation",
          "Real-time operations dashboard for tasks and inventory",
        ],
        demoUrl: "https://reliefsync-frontend-d3sw.onrender.com/index.html",
        githubUrl: "https://github.com/myrielleai/ReliefSync",
        date: "2026",
        award: "3rd of 37 · Hackathon",
        featured: true,
        category: "websites"
      },
      {
        id: "web-3",
        title: "Makati Human Milk Bank System",
        subtitle: "Cloud Database & Healthcare Management System",
        description: "Designed and deployed a cloud-based PostgreSQL database on Render, with relational data modeling, schema design and SQL queries, restructuring milk inventory management for medical staff.",
        tags: ["PostgreSQL", "Render", "Express", "SQL"],
        image: "/project1.webp",
        pitch: "A clean, reliable database behind a hospital milk bank.",
        role: "Database design and deployment",
        highlights: [
          "Cloud PostgreSQL database deployed on Render",
          "Relational schema and data modelling for milk inventory",
          "SQL queries that give medical staff a clearer picture of stock",
        ],
        demoUrl: "https://hmbms-server.onrender.com/",
        githubUrl: "https://github.com/KadenYohan/MilkBank-Group-Seven",
        date: "2026",
        category: "websites"
      },
      {
        id: "web-4",
        title: "UChannel",
        subtitle: "Brand Identity & Company Website",
        description: "A new brand identity and company website for U Channel, an LED screen and billboard company. The site has a hero wall of LED-style blocks, a process section that builds itself as you scroll, a sideways reel of advertising solutions, animated LED panels drawn on canvas and a locations page for its 177 billboard sites.",
        tags: ["HTML", "CSS", "JavaScript", "GSAP", "Lenis", "Canvas"],
        image: "/uchannel.webp",
        pitch: "A brand and a website for an LED screen and billboard company.",
        role: "Full-stack developer & brand designer · client project",
        highlights: [
          "Designed the brand identity the site is built on",
          "Scroll-driven motion with GSAP ScrollTrigger and Lenis smooth scrolling",
          "Animated LED panels drawn on canvas",
          "Locations page for 177 billboard sites across Luzon, Visayas and Mindanao",
        ],
        demoUrl: "https://uchannel.ph",
        date: "2025 – 2026",
        category: "websites"
      },
      {
        id: "web-5",
        title: "Endlezz Market",
        subtitle: "E-Commerce Storefront",
        description: "A responsive streetwear storefront with a shop, product pages, a lookbook, search and a cart, backed by a Supabase catalogue.",
        tags: ["Next.js", "React", "TypeScript", "Tailwind CSS", "Supabase", "Framer Motion"],
        image: "/endlezz.webp",
        pitch: "A streetwear storefront, from lookbook to cart.",
        role: "Project lead · full-stack developer",
        highlights: [
          "Shop, product pages, lookbook and search",
          "Cart drawer and product filtering",
          "Catalogue, orders and reviews backed by Supabase",
        ],
        demoUrl: "https://endlezz-market.vercel.app/",
        githubUrl: "https://github.com/myrielleai/EndlezzMarket",
        date: "2025",
        category: "websites"
      }
    ]
  },
  {
    id: "design",
    index: "03",
    title: "Graphic Design",
    description: "Branding, posters and visual design.",
    // Add pieces here (images in /public/design/) — the tab appears once this list isn't empty.
    items: []
  }
];
