import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { buildWorkbenchScene, createAppleLogoShape, type WorkbenchObjectHandles } from "./DeskObjects";
import JournalModal from "./JournalModal";
import PhoneModal from "./PhoneModal";
import QuoteToast from "./QuoteToast";
import BlueprintLine from "./BlueprintLine";
import EasterEggModal from "./EasterEggModal";
import EarbudsModal from "./EarbudsModal";
import PictureFrameDialogue from "./PictureFrameDialogue";
import MapModal from "./MapModal";
import ScissorsDialogue from "./ScissorsDialogue";
import CatDialogue from "./CatDialogue";
import SilverDialogue from "./SilverDialogue";
import MiataDialogue from "./MiataDialogue";
import MatchaDialogue from "./MatchaDialogue";
import RubiksDialogue from "./RubiksDialogue";
import ChessDialogue from "./ChessDialogue";
import InfoCard, { type InfoCardContent } from "./InfoCard";
import { buildDeskLamp, buildIphone18ProMax, buildPolaroidStack, buildPothos, createFramePhotoTexture, createLockScreenTexture, createStripTexture } from "./DeskPersonal";
import { buildAirpods, buildCat, buildChess, buildGlobe, buildGlowPool, buildPencilCase, createCybersigilJournalTexture, roundedRect, buildJewelryDish, buildMatcha, buildMiataDisplay, buildRubiks, buildScissors } from "./DeskRedesign";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { useTheme } from "../ThemeContext";
import { playClickSound, playHoverSound, playToggleSound } from "../../utils/audio";
import { scrollToSection } from "../../utils/scrollTo";

interface WorkbenchCanvasProps {
  onEnterLab?: () => void;
  /** Called before a card action navigates away (lets the parent leave fullscreen first). */
  onBeforeNavigate?: () => void;
}

// Every raycast name an object can report → one canonical id (used for hover labels + the "found" counter)
const ALIAS: Record<string, string> = {
  macbook: "laptop", keyboard: "laptop",
  journal: "journal",
  coffeeMug: "matcha", matcha: "matcha", matchaMug: "matcha", mug: "matcha", cup: "matcha",
  phone: "phone", ipad: "phone", tablet: "phone",
  pencil: "pencil",
  stickyNotes: "stickyNotes",
  earbuds: "earbuds", airpods: "earbuds", airpod: "earbuds", headphone: "earbuds", headphones: "earbuds",
  scissors: "scissors", scissor: "scissors",
  plant: "plant",
  deskLamp: "lamp", lamp: "lamp",
  rubiksCube: "rubiks", rubiks: "rubiks", cube: "rubiks", rubik: "rubiks",
  pictureFrame: "frame", frame: "frame", photoFrame: "frame",
  chess: "chess", chessPieces: "chess", pawn: "chess", knight: "chess", queen: "chess",
  globe: "globe", globeSphere: "globe",
  cat: "cat", orangeCat: "cat", tabbyCat: "cat", orangeTabby: "cat",
  jewelry: "silver", silverJewelry: "silver", jewelries: "silver", rings: "silver", necklace: "silver",
  miata: "miata", miataCar: "miata", toyMiata: "miata", toyCar: "miata", car: "miata",
};

// Hover label for each object (order = order of hint dots)
const LABELS: Record<string, string> = {
  laptop: "Laptop · my projects",
  plant: "Plant",
  journal: "Journal",
  phone: "Phone",
  matcha: "Matcha",
  pencil: "Pencil",
  stickyNotes: "Sticky notes",
  earbuds: "Earbuds",
  scissors: "Scissors",
  lamp: "Desk lamp",
  frame: "Polaroids",
  chess: "Chess",
  globe: "Globe",
  cat: "Cat",
  silver: "Silver",
  rubiks: "Rubik's cube",
  miata: "Miata",
};
const ALL_IDS = Object.keys(LABELS);
const GRAIN_URL = `url("data:image/svg+xml;utf8,${encodeURIComponent(
  "<svg xmlns='http://www.w3.org/2000/svg' width='220' height='220'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0.5 0 0 0 0 0.45 0 0 0 0 0.4 0 0 0 0.55 0'/></filter><rect width='100%' height='100%' filter='url(#n)'/></svg>"
)}")`;
const FOUND_KEY = "workbench-found";

// Desk arrangement: [x, y, rotationZ] in desk units. Nothing overlaps; the strip below the mat stays clear for dialogues.
const DESK_LAYOUT: Record<string, [number, number, number]> = {
  macbook: [0.0, -0.4, -0.06],
  books: [-3.75, 0.55, 0.2],
  journal: [-3.62, 0.62, 0.3],
  pencil: [-2.4, -2.33, 1.571],
  pencil2: [-2.4, -2.55, 1.571],
  pen: [-2.33, -2.78, 1.571],
  scissors: [-4.55, -2.75, 0.2],
  rubiks: [-6.4, -3.0, 0.45],
  globe: [-6.9, -1.2, 0.3],
  lamp: [-7.2, 2.6, 0.12], // head aims at the journal
  frame: [-0.6, 3.6, -0.08],
  stickyNotes: [4.1, 4.0, -0.18],
  mug: [2.9, 2.6, 0],
  plant: [6.4, 3.6, 0.4],
  chess: [4.25, 0.85, 0.35],
  jewelry: [6.8, -1.3, 0.3],
  phone: [1.18, -2.66, 1.5],
  earbuds: [5.4, -2.9, 0.8],
  cat: [3.86, -1.95, 0.1],
  miata: [7.3, -3.4, -0.75],
};



export default function WorkbenchCanvas({ onEnterLab, onBeforeNavigate }: WorkbenchCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  // Discovery counter (persists per browser; storage can be unavailable, so guard it)
  const [found, setFound] = useState<string[]>(() => {
    try {
      const raw = window.localStorage.getItem(FOUND_KEY);
      const arr = raw ? (JSON.parse(raw) as string[]) : [];
      return arr.filter((id) => ALL_IDS.includes(id));
    } catch {
      return [];
    }
  });
  const foundRef = useRef<Set<string>>(new Set(found));
  const [, setAllFoundToast] = useState(false);
  const [info, setInfo] = useState<InfoCardContent | null>(null);

  // Day / night follows the site theme
  const { theme } = useTheme();
  const themeRef = useRef(theme);
  const handlesRef = useRef<WorkbenchObjectHandles | null>(null);

  // Hover & Raycasting states
  const [hoveredObjectName, setHoveredObjectName] = useState<string | null>(null);
  const [hoveredZoneName, setHoveredZoneName] = useState<string | null>(null);
  const [isDraggingState, setIsDraggingState] = useState(false);

  // Modal & Overlay states
  const [isJournalOpen, setIsJournalOpen] = useState(false);
  const [isPhoneOpen, setIsPhoneOpen] = useState(false);
  const [isEarbudsOpen, setIsEarbudsOpen] = useState(false);
  const [isEasterEggOpen, setIsEasterEggOpen] = useState(false);
  const [isPictureFrameOpen, setIsPictureFrameOpen] = useState(false);
  const [isGlobeOpen, setIsGlobeOpen] = useState(false);
  const [isScissorsOpen, setIsScissorsOpen] = useState(false);
  const [isCatOpen, setIsCatOpen] = useState(false);
  const [isSilverOpen, setIsSilverOpen] = useState(false);
  const [isMiataOpen, setIsMiataOpen] = useState(false);
  const [isMatchaOpen, setIsMatchaOpen] = useState(false);
  const [isRubiksOpen, setIsRubiksOpen] = useState(false);
  const [isChessOpen, setIsChessOpen] = useState(false);
  const [isBlueprintActive, setIsBlueprintActive] = useState(false);
  const [, setIsLampOn] = useState(false);
  const [currentQuote, setCurrentQuote] = useState<string | null>(null);
  const [isBlurred, setIsBlurred] = useState(false);

  const closeAllOverlays = () => {
    setIsJournalOpen(false);
    setIsPhoneOpen(false);
    setIsEarbudsOpen(false);
    setIsEasterEggOpen(false);
    setIsPictureFrameOpen(false);
    setIsGlobeOpen(false);
    setIsScissorsOpen(false);
    setIsCatOpen(false);
    setIsSilverOpen(false);
    setIsMiataOpen(false);
    setIsMatchaOpen(false);
    setIsRubiksOpen(false);
    setIsChessOpen(false);
    setInfo(null);
    setCurrentQuote(null);
  };

  const isAnyModalOpen = isJournalOpen || isPhoneOpen || isEarbudsOpen || isEasterEggOpen || isGlobeOpen;
  const isAnyModalOpenRef = useRef(false);

  useEffect(() => {
    isAnyModalOpenRef.current = isAnyModalOpen;
    if (isAnyModalOpen) {
      hoveredObjectNameRef.current = null;
    }
  }, [isAnyModalOpen]);


  // Theme → lamp on at night, off during the day (still toggleable by clicking the lamp)
  useEffect(() => {
    themeRef.current = theme;
    isLampOnRef.current = theme === "dark";
  }, [theme]);

  useEffect(() => {
    try {
      window.localStorage.setItem(FOUND_KEY, JSON.stringify(found));
    } catch {
      /* storage unavailable — counter just won't persist */
    }
  }, [found]);

  // Mouse Parallax & Dragging refs
  const mouseRef = useRef({ x: 0, y: 0 });
  const targetMouseRef = useRef({ x: 0, y: 0 });
  const isLampOnRef = useRef(theme === "dark");
  const hoveredObjectNameRef = useRef<string | null>(null);
  const hoveredZoneNameRef = useRef<string | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;

    // 1. Scene & Renderer Setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x160c07); // Warm cozy dark mahogany room atmosphere

    // Top-down Orthographic Camera (90 degrees top view)
    const aspect = container.clientWidth / container.clientHeight;
    // Frustum half-height; grows on narrow/portrait frames so the whole desk still fits the width
    const fitD = (a: number) => Math.max(5.6, 7.4 / a);
    let d = fitD(aspect);
    const camera = new THREE.OrthographicCamera(
      -d * aspect, d * aspect, d, -d, 0.1, 100
    );
    camera.position.set(0, 0, 10);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setSize(container.clientWidth, container.clientHeight);
    const isCoarse = window.matchMedia("(pointer: coarse)").matches;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, isCoarse ? 1.5 : 2));
    renderer.shadowMap.enabled = !isCoarse; // phones/tablets: skip soft shadows for smoother frames
    renderer.shadowMap.type = THREE.PCFShadowMap; // supports the soft shadow radius below
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.4;
    container.appendChild(renderer.domElement);
    // Soft studio reflections for the metal / glazed props only (applied per material)
    const pmrem = new THREE.PMREMGenerator(renderer);
    const envTex = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    pmrem.dispose();

    // 2. Warm Cozy Afternoon Sunlight & Enhanced Ambient Lighting
    const ambientLight = new THREE.AmbientLight(0xfff2e6, 2.4);
    scene.add(ambientLight);

    const hemiLight = new THREE.HemisphereLight(0xfff7ed, 0x9a3412, 1.2);
    hemiLight.position.set(0, 0, 10);
    scene.add(hemiLight);

    const sunLight = new THREE.DirectionalLight(0xffa238, 2.2); // Warm Golden Sunlight
    sunLight.position.set(7, 6, 9);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 2048;
    sunLight.shadow.mapSize.height = 2048;
    sunLight.shadow.bias = -0.0001;
    scene.add(sunLight);

    // 3. Build 3D Workbench Scene
    // Daytime light levels (night values are fixed); preview layouts can tweak these
    const dayLight = { ambient: 2.4, hemi: 1.2, sun: 2.2, exposure: 1.4 };
    const handles = buildWorkbenchScene(scene);
    // Arrange the desk ("messy but tidy") and apply the sunlit look
    {
      const L = DESK_LAYOUT;
      const byPos = (x: number, y: number) =>
        handles.deskGroup.children.find((c) => Math.abs(c.position.x - x) < 0.01 && Math.abs(c.position.y - y) < 0.01);
      const targets: Record<string, THREE.Object3D | undefined> = {
        macbook: handles.macbookGroup, journal: handles.journalGroup, mug: handles.mugGroup, phone: handles.phoneGroup,
        pencil: handles.pencilGroup, stickyNotes: handles.stickyNotesGroup, earbuds: handles.earbudsGroup,
        scissors: handles.scissorsGroup, plant: handles.plantGroup, lamp: handles.lampGroup, rubiks: handles.rubiksCubeGroup,
        frame: handles.pictureFrameGroup, chess: handles.chessGroup, globe: handles.globeGroup, cat: handles.catGroup,
        jewelry: handles.jewelryGroup, miata: handles.miataGroup,
        books: byPos(-5.4, 0.4), pen: byPos(-3.75, -0.1), pencil2: byPos(-3.5, -0.1),
      };
      for (const [k, v] of Object.entries(L)) {
        const o = targets[k];
        if (o) { o.position.x = v[0]; o.position.y = v[1]; o.rotation.z = v[2]; o.userData.baseRotZ = v[2]; }
      }
      {
        const loader = new THREE.TextureLoader();
        // 1. Laptop open, DeepLeaf on screen
        handles.macbookLid.userData.pinned = false;
        // Logo orientation on the closed lid
        handles.macbookLid.children.forEach((c) => {
          const g = (c as THREE.Mesh).geometry as THREE.BufferGeometry | undefined;
          if (g?.type === "ExtrudeGeometry") c.rotation.z = Math.PI;
        });
        // Rounded corners on the aluminium base and lid
        {
          const roundSlab = (depth: number) =>
            new THREE.ExtrudeGeometry(roundedRect(3.6 - 0.03, 2.4 - 0.03, 0.2), {
              depth: depth - 0.02, bevelEnabled: true, bevelSize: 0.015, bevelThickness: 0.01, bevelSegments: 3, curveSegments: 10,
            });
          const base = handles.macbookGroup.children.find((c) => {
            const g = (c as THREE.Mesh).geometry as THREE.BoxGeometry | undefined;
            return g?.type === "BoxGeometry" && g.parameters.width === 3.6 && g.parameters.depth === 0.1;
          }) as THREE.Mesh | undefined;
          if (base) {
            const g = roundSlab(0.1);
            g.translate(0, 0, -0.04); // match the old box (-0.05 .. 0.05)
            base.geometry.dispose();
            base.geometry = g;
          }
          const shell = handles.macbookLid.children.find((c) => {
            const g = (c as THREE.Mesh).geometry as THREE.BoxGeometry | undefined;
            return g?.type === "BoxGeometry" && g.parameters.width === 3.6;
          }) as THREE.Mesh | undefined;
          if (shell) {
            const g = roundSlab(0.06);
            g.translate(0, -1.2, 0.01); // old shell spanned 0 .. 0.06 below the hinge
            shell.geometry.dispose();
            shell.geometry = g;
          }
        }
        const screenMesh = handles.macbookLid.children.find(
          (c) => (c as THREE.Mesh).isMesh && ((c as THREE.Mesh).geometry as THREE.BufferGeometry).type === "PlaneGeometry"
        ) as THREE.Mesh | undefined;
        if (screenMesh) {
          const tex = loader.load("/deepleaf.webp");
          tex.colorSpace = THREE.SRGBColorSpace;
          tex.wrapS = THREE.RepeatWrapping;
          tex.wrapT = THREE.RepeatWrapping;
          tex.repeat.set(-1, -1);
          tex.offset.set(1, 1);
          (screenMesh.material as THREE.MeshBasicMaterial).map = tex;
          (screenMesh.material as THREE.MeshBasicMaterial).needsUpdate = true;
          screenMesh.position.z = -0.012; // sit just outside the lid shell so it isn't hidden inside it
        }
        // 2. Warm cream felt pad
        const pad = handles.deskGroup.children.find(
          (c) => (c as THREE.Mesh).isMesh && ((c as THREE.Mesh).geometry as THREE.BoxGeometry).parameters?.width === 10.2
        ) as THREE.Mesh | undefined;
        if (pad) {
          const cv = document.createElement("canvas");
          cv.width = 2040; cv.height = 1400;
          const g = cv.getContext("2d")!;
          g.fillStyle = "#e9dfcb"; g.fillRect(0, 0, cv.width, cv.height);
          for (let i = 0; i < 60000; i++) {
            const v = Math.random();
            g.fillStyle = v > 0.5 ? `rgba(255,255,250,${Math.random() * 0.25})` : `rgba(140,110,80,${Math.random() * 0.12})`;
            g.fillRect(Math.random() * cv.width, Math.random() * cv.height, 2, 2);
          }
          g.strokeStyle = "rgba(160,124,88,0.85)"; g.lineWidth = 5; g.setLineDash([22, 16]);
          g.strokeRect(46, 46, cv.width - 92, cv.height - 92);
          const t = new THREE.CanvasTexture(cv); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8;
          const m = pad.material as THREE.MeshStandardMaterial; m.map = t; m.roughness = 0.95; m.needsUpdate = true;
        }
        // 2b. Lighter honey-oak table that fills the whole view
        const desk = handles.deskGroup.children.find(
          (c) => (c as THREE.Mesh).isMesh && ((c as THREE.Mesh).geometry as THREE.BoxGeometry).parameters?.width === 16
        ) as THREE.Mesh | undefined;
        if (desk) {
          const cv = document.createElement("canvas");
          cv.width = 2400; cv.height = 1500;
          const g = cv.getContext("2d")!;
          const plankH = 300;
          for (let py = 0; py < cv.height; py += plankH) {
            const tone = 0.92 + Math.random() * 0.12;
            const grd = g.createLinearGradient(0, py, 0, py + plankH);
            grd.addColorStop(0, `rgb(${152 * tone},${104 * tone},${62 * tone})`);
            grd.addColorStop(1, `rgb(${138 * tone},${92 * tone},${52 * tone})`);
            g.fillStyle = grd; g.fillRect(0, py, cv.width, plankH);
            for (let k = 0; k < 70; k++) {
              const y0 = py + Math.random() * plankH, amp = 2 + Math.random() * 8, f = 0.002 + Math.random() * 0.004, ph = Math.random() * 6;
              g.strokeStyle = `rgba(${92 + Math.random() * 30},${58 + Math.random() * 18},${32},${0.1 + Math.random() * 0.16})`;
              g.lineWidth = 1 + Math.random() * 2.2; g.beginPath();
              for (let x = 0; x <= cv.width; x += 20) { const y = y0 + Math.sin(x * f + ph) * amp; if (x === 0) g.moveTo(x, y); else g.lineTo(x, y); }
              g.stroke();
            }
            g.fillStyle = "rgba(64,38,18,0.6)"; g.fillRect(0, py, cv.width, 3);
            g.fillStyle = "rgba(255,230,200,0.16)"; g.fillRect(0, py + 3, cv.width, 2);
          }
          const t = new THREE.CanvasTexture(cv); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8;
          const m = desk.material as THREE.MeshStandardMaterial; m.map = t; m.roughness = 0.55; m.needsUpdate = true;
          desk.scale.set(1.3, 1.3, 1);
        }
        scene.background = new THREE.Color(0x6b4a2c);
        // 2c. Golden-hour sunbeam through a window (panes + leaf shadows), additive on the desk
        {
          const cv = document.createElement("canvas");
          cv.width = 1600; cv.height = 1100;
          const g = cv.getContext("2d")!;
          g.fillStyle = "#000"; g.fillRect(0, 0, cv.width, cv.height);
          g.save();
          g.filter = "blur(6px)";
          g.translate(cv.width * 0.47, cv.height * 0.5);
          g.transform(1, -0.26, 0.42, 1, 0, 0); // skew = low sun angle through tall windows
          const cols = 3, rows = 2, pw = 290, ph = 400, gap = 34; // big windows
          const totalW = cols * pw + (cols - 1) * gap, totalH = rows * ph + (rows - 1) * gap;
          for (let cx = 0; cx < cols; cx++) for (let cy = 0; cy < rows; cy++) {
            const x = -totalW / 2 + cx * (pw + gap), y = -totalH / 2 + cy * (ph + gap);
            const grd = g.createLinearGradient(x, y, x + pw, y + ph);
            grd.addColorStop(0, "rgba(255,222,172,0.38)"); grd.addColorStop(1, "rgba(255,204,145,0.26)");
            g.fillStyle = grd; g.fillRect(x, y, pw, ph);
          }
          // sheer curtain softening one edge
          const cur = g.createLinearGradient(-totalW / 2, 0, -totalW / 2 + 160, 0);
          cur.addColorStop(0, "rgba(0,0,0,0.55)"); cur.addColorStop(1, "rgba(0,0,0,0)");
          g.fillStyle = cur; g.fillRect(-totalW / 2 - 20, -totalH / 2 - 20, 180, totalH + 40);
          g.restore();
          // leaf shadows from a plant outside the window
          g.save(); g.filter = "blur(10px)"; g.fillStyle = "rgba(0,0,0,0.75)";
          for (let i = 0; i < 26; i++) {
            const x = cv.width * 0.62 + (Math.random() - 0.5) * 420, y = cv.height * 0.12 + Math.random() * 260;
            g.beginPath(); g.ellipse(x, y, 16 + Math.random() * 26, 6 + Math.random() * 10, Math.random() * Math.PI, 0, Math.PI * 2); g.fill();
          }
          g.restore();
          // warm haze over the whole beam area
          const haze = g.createRadialGradient(cv.width * 0.5, cv.height * 0.45, 60, cv.width * 0.5, cv.height * 0.45, 900);
          haze.addColorStop(0, "rgba(255,220,170,0.08)"); haze.addColorStop(1, "rgba(0,0,0,0)");
          g.fillStyle = haze; g.fillRect(0, 0, cv.width, cv.height);
          const t = new THREE.CanvasTexture(cv); t.colorSpace = THREE.SRGBColorSpace;
          const wm = handles.windowLightMesh.material as THREE.MeshBasicMaterial;
          wm.map = t; wm.opacity = 0.5; wm.needsUpdate = true;
          handles.windowLightMesh.position.z = 0.9; // above the props so light falls on everything
          handles.windowLightMesh.scale.set(1.55, 1.55, 1);
        }
        // light levels: lower ambient so the sunbeam reads, warm low sun
        dayLight.ambient = 1.45; dayLight.hemi = 0.85; dayLight.sun = 1.9; dayLight.exposure = 1.12;
        ambientLight.intensity = 1.45; hemiLight.intensity = 0.85; sunLight.intensity = 1.9; renderer.toneMappingExposure = 1.12;
        sunLight.color.set(0xffd2a0);
        sunLight.position.set(5.5, 4.5, 12);
        // Shadow camera covers the whole desk (no hard cut-off lines), with soft, lighter edges
        {
          const sc = sunLight.shadow.camera as THREE.OrthographicCamera;
          sc.left = -12; sc.right = 12; sc.top = 9; sc.bottom = -9; sc.near = 0.5; sc.far = 30;
          sc.updateProjectionMatrix();
          sunLight.shadow.radius = 6;
          sunLight.shadow.blurSamples = 12;
          sunLight.shadow.normalBias = 0.02;
          sunLight.shadow.intensity = 0.65;
        }
        // 3. Calmer palette
        handles.globeGroup.traverse((c) => {
          const mm = (c as THREE.Mesh).material as THREE.MeshStandardMaterial | undefined;
          if ((c as THREE.Mesh).isMesh && mm?.color) mm.color.multiply(new THREE.Color(0xcfc6b8));
        });
        // 4. Softer window light
        // 5. Papers, cables, paperclip
        const paperTex = (draw: (g: CanvasRenderingContext2D, w: number, h: number) => void, bg: string) => {
          const c = document.createElement("canvas"); c.width = 840; c.height = 1188;
          const g = c.getContext("2d")!; g.fillStyle = bg; g.fillRect(0, 0, c.width, c.height); draw(g, c.width, c.height);
          const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return { t, c, g };
        };
        const addPaper = (tex: THREE.Texture, x: number, y: number, rz: number, z = 0.036, w = 1.5, h = 2.1) => {
          const mesh = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshStandardMaterial({ map: tex, roughness: 0.95 }));
          mesh.position.set(x, y, z); mesh.rotation.z = rz; mesh.receiveShadow = true; mesh.castShadow = true;
          handles.deskGroup.add(mesh);
        };
        // printed DeepLeaf paper
        const pp = paperTex((g, w) => {
          g.fillStyle = "#111"; g.font = "bold 30px serif"; g.textAlign = "center";
          g.fillText("Tomato Foliar Disease Detection via", w / 2, 90);
          g.fillText("YOLO26 Instance Segmentation", w / 2, 128);
          g.font = "18px serif"; g.fillStyle = "#444"; g.fillText("Aldea · De Leon · Jerusalem · Lagarde · Comia", w / 2, 168);
          g.fillStyle = "#9a9a9a";
          for (let col = 0; col < 2; col++) for (let i = 0; i < 34; i++) {
            const y = 220 + i * 16; if (col === 1 && i > 6 && i < 22) continue;
            g.fillRect(60 + col * 380, y, 340 - (i % 7 === 6 ? 120 : Math.random() * 30), 6);
          }
          for (let i = 0; i < 22; i++) g.fillRect(60, 800 + i * 16, 720 - (i % 6 === 5 ? 300 : Math.random() * 40), 6);
        }, "#fbfaf6");
        const fig = new Image(); fig.src = "/deepleaf.webp";
        fig.onload = () => { pp.g.drawImage(fig, 440, 330, 340, 212); pp.g.fillStyle = "#666"; pp.g.font = "italic 14px serif"; pp.g.fillText("Fig. 6. Segmented late blight lesion", 610, 565); pp.t.needsUpdate = true; };
        addPaper(pp.t, 6.85, 1.17, -0.06, 0.012, 2.2, 3.1); // printed paper (journal-sized) lies just below the plant
        const clip = new THREE.CatmullRomCurve3(
          [[0, 0], [0.5, 0], [0.56, 0.1], [0.5, 0.2], [-0.04, 0.2], [-0.1, 0.1], [-0.04, 0.04], [0.42, 0.04], [0.45, 0.1], [0.42, 0.16], [0.05, 0.16]].map(([x, y]) => new THREE.Vector3(x, y, 0))
        );
        const clipMesh = new THREE.Mesh(new THREE.TubeGeometry(clip, 80, 0.013, 6, false), new THREE.MeshStandardMaterial({ color: 0xc9ced6, metalness: 0.9, roughness: 0.25 }));
        clipMesh.position.set(5.85, 2.62, 0.03); clipMesh.rotation.z = -0.5; // clipped to the paper's corner clipMesh.castShadow = true; handles.deskGroup.add(clipMesh);
        // 6. Personal props
        handles.phoneScreenMat.map = createLockScreenTexture();
        handles.phoneScreenMat.needsUpdate = true;
        // iPhone 18 Pro Max, face down (replaces the old phone model inside the same clickable group)
        handles.phoneGroup.children.forEach((c) => { c.visible = false; });
        const iphone = buildIphone18ProMax(createAppleLogoShape());
        iphone.position.z = 0.04;
        iphone.scale.setScalar(0.8); // a little smaller on the desk
        handles.phoneGroup.add(iphone);
        if (handles.frameShadowMesh) handles.frameShadowMesh.visible = false;
        handles.pictureFrameGroup.children.forEach((c) => {
          const m = c as THREE.Mesh;
          if (!m.isMesh) return;
          const mat = m.material as THREE.MeshStandardMaterial;
          const geo = m.geometry as THREE.PlaneGeometry & THREE.BoxGeometry;
          if (geo.type === "PlaneGeometry" && mat.map) {
            mat.map = createFramePhotoTexture(geo.parameters.width / geo.parameters.height);
            mat.needsUpdate = true;
          } else if (geo.type === "BoxGeometry" && geo.parameters.width === 0.44 && mat.map) {
            const variant = m.position.x < 1.5 ? 0 : 1;
            mat.map = createStripTexture(variant as 0 | 1);
            mat.needsUpdate = true;
          }
        });
        // pothos in a cream pot
        handles.plantGroup.children.forEach((c, i) => { if (i >= 3) c.visible = false; });
        handles.plantGroup.children.slice(0, 2).forEach((c) => ((c as THREE.Mesh).material as THREE.MeshStandardMaterial).color?.set(0xefe4d0));
        handles.plantGroup.add(buildPothos(0.45));
        // articulated lamp
        handles.lampGroup.children.forEach((c) => { if ((c as THREE.Mesh).isMesh) c.visible = false; });
        handles.lampGroup.add(buildDeskLamp());

        // 7. Redesigned props (old meshes hidden, new ones live inside the same clickable groups)
        const swapIn = (target: THREE.Group, obj: THREE.Object3D) => {
          target.children.forEach((c) => { c.visible = false; });
          target.add(obj);
        };
        const sc = buildScissors(envTex);
        sc.group.scale.setScalar(0.86);
        sc.group.position.y = -0.12;
        swapIn(handles.scissorsGroup, sc.group);
        handles.scissorBlade1 = sc.arm1;
        handles.scissorBlade2 = sc.arm2;

        handles.rubiksCubeGroup.children.forEach((c) => { c.visible = false; });
        const cube = buildRubiks(envTex);
        cube.scale.setScalar(1.12);
        handles.rubiksCubeGroup.add(cube);
        handles.rubiksCubeGroup.userData.cube = cube;

        const cat = buildCat();
        cat.group.scale.setScalar(1.25);
        swapIn(handles.catGroup, cat.group);
        handles.catTailMesh = cat.tail;

        const miata = buildMiataDisplay(envTex);
        swapIn(handles.miataGroup, miata.group);
        handles.miataGroup.userData.glare = miata.glare;

        const dish = buildJewelryDish(envTex);
        swapIn(handles.jewelryGroup, dish.group);
        handles.jewelrySparkles = dish.sparkles;
        if (handles.jewelryLight) { handles.jewelryLight.intensity = 0; handles.jewelryLight.visible = false; }
        handles.jewelryLight = undefined;

        const matcha = buildMatcha(envTex);
        handles.mugGroup.children.forEach((c) => { if (c !== handles.steamParticles) c.visible = false; });
        handles.mugGroup.add(matcha.group);
        handles.mugLiquid = matcha.liquid;

        swapIn(handles.chessGroup, buildChess(envTex));

        // Vintage globe
        const globe = buildGlobe(envTex);
        globe.group.scale.setScalar(1.15);
        swapIn(handles.globeGroup, globe.group);
        handles.globeGroup.rotation.z = 0;
        handles.globeSphere = globe.sphere;

        // Leather journal with a silver cybersigilism emboss
        {
          const coverMesh = handles.journalCover.children.find((c) => (c as THREE.Mesh).isMesh) as THREE.Mesh | undefined;
          if (coverMesh) {
            const m = coverMesh.material as THREE.MeshStandardMaterial;
            m.map = createCybersigilJournalTexture();
            m.roughness = 0.55;
            m.metalness = 0.15;
            m.needsUpdate = true;
          }
          // hide the old gold title/decals on top of the cover, keep the cover itself
          handles.journalCover.children.forEach((c) => { if (c !== coverMesh) c.visible = false; });
        }

        // Pencils live in a frosted pencil case; the blue pencil can be taken out
        const pencilCase = buildPencilCase(envTex);
        pencilCase.position.set(-2.2, -2.55, 0);
        handles.deskGroup.add(pencilCase);
        for (const k of ["pencil", "pencil2", "pen"] as const) {
          const o = targets[k];
          if (o) o.position.z = 0.07;
        }
        handles.pencilGroup.userData.home = new THREE.Vector2(L.pencil[0], L.pencil[1]);
        handles.pencilGroup.userData.outPos = new THREE.Vector2(-2.25, -3.3);

        // The photo frame is swapped for a little stack of polaroids lying on the desk; clicking
        // fans them out (the photo-booth strips and tape beside it stay)
        {
          handles.pictureFrameGroup.children.forEach((c) => {
            const g = (c as THREE.Mesh).geometry as THREE.BufferGeometry & { parameters?: { width?: number } };
            const w = g?.parameters?.width;
            if (Math.abs(c.position.x) < 1.2 && w !== 0.44 && w !== 0.24) c.visible = false; // frame, photo, glass, corners
          });
          const polaroids = buildPolaroidStack();
          polaroids.position.set(0, -0.35, 0);
          handles.pictureFrameGroup.add(polaroids);
          handles.pictureFrameGroup.userData.polaroids = polaroids;
        }
        swapIn(handles.earbudsGroup, buildAirpods(envTex));

        // No blue glow spot on the keyboard
        handles.screenLight.visible = false;
      }
    }
    handlesRef.current = handles;

    // Night: warm pool under the lamp head, cool glow spilling from the laptop screen
    const lampPool = buildGlowPool("rgba(255,170,90,1)", 8.5, 7.5);
    lampPool.position.set(-3.95, 0.85, 0.95); // pool of light over the journal
    const screenPool = buildGlowPool("rgba(190,215,255,0.8)", 6.0, 4.2);
    screenPool.position.set(0.1, 0.9, 0.95);
    handles.deskGroup.add(lampPool, screenPool);
    // Light layers float above the props; never let them catch hovers or clicks
    for (const m of [lampPool, screenPool, handles.windowLightMesh]) m.raycast = () => {};
    const envMats: THREE.MeshStandardMaterial[] = [];
    scene.traverse((o) => {
      const mm = (o as THREE.Mesh).material as THREE.MeshStandardMaterial | undefined;
      if (mm && mm.envMap && mm.userData.baseEnv !== undefined && !envMats.includes(mm)) envMats.push(mm);
    });

    // Map object names to top-level object groups
    const nameToObjectMap: Record<string, THREE.Object3D> = {
      macbook: handles.macbookGroup,
      keyboard: handles.macbookGroup,
      journal: handles.journalGroup,
      coffeeMug: handles.mugGroup,
      matcha: handles.mugGroup,
      matchaMug: handles.mugGroup,
      mug: handles.mugGroup,
      cup: handles.mugGroup,
      phone: handles.phoneGroup,
      ipad: handles.phoneGroup,
      tablet: handles.phoneGroup,
      pencil: handles.pencilGroup,
      stickyNotes: handles.stickyNotesGroup,
      earbuds: handles.earbudsGroup,
      airpods: handles.earbudsGroup,
      airpod: handles.earbudsGroup,
      headphone: handles.earbudsGroup,
      headphones: handles.earbudsGroup,
      scissors: handles.scissorsGroup,
      scissor: handles.scissorsGroup,
      plant: handles.plantGroup,
      deskLamp: handles.lampGroup,
      lamp: handles.lampGroup,
      rubiksCube: handles.rubiksCubeGroup,
      pictureFrame: handles.pictureFrameGroup,
      frame: handles.pictureFrameGroup,
      photoFrame: handles.pictureFrameGroup,
      chess: handles.chessGroup,
      chessPieces: handles.chessGroup,
      pawn: handles.chessGroup,
      knight: handles.chessGroup,
      queen: handles.chessGroup,
      globe: handles.globeGroup,
      globeSphere: handles.globeGroup,
      cat: handles.catGroup,
      orangeCat: handles.catGroup,
      tabbyCat: handles.catGroup,
      orangeTabby: handles.catGroup,
      jewelry: handles.jewelryGroup,
      silverJewelry: handles.jewelryGroup,
      jewelries: handles.jewelryGroup,
      rings: handles.jewelryGroup,
      necklace: handles.jewelryGroup,
      miata: handles.miataGroup,
      miataCar: handles.miataGroup,
      toyMiata: handles.miataGroup,
      toyCar: handles.miataGroup,
      car: handles.miataGroup
    };


    const MOONLIGHT = new THREE.Color(0xd2ddff); // cool, bright moonlight through the big windows
    const SUNLIGHT = new THREE.Color(0xffffff);
    const matBottom = new THREE.Vector3();
    let lastMatBottom = -1;

    // Raycaster Setup & Drag State Variables
    const raycaster = new THREE.Raycaster();
    // Lines (like the Miata case's bright edges) are hit-tested within this distance; the default of
    // a whole desk unit made the case grab hovers meant for the jewelry and the AirPods next to it
    raycaster.params.Line = { threshold: 0.02 };
    const pointer = new THREE.Vector2();

    let isDragging = false;
    let draggedObject: THREE.Object3D | null = null;
    let draggedObjectName: string | null = null;
    const dragOffset = new THREE.Vector2();
    const pointerDownPos = new THREE.Vector2();



    const defaultZMap: Record<string, number> = {
      journal: 0.45,
      pictureFrame: 0.04,
      frame: 0.04,
      photoFrame: 0.04,
      rubiksCube: 0.38,
      macbook: 0.05,
      keyboard: 0.05,
      phone: 0.05,
      ipad: 0.05,
      tablet: 0.05,
      coffeeMug: 0.05,
      matcha: 0.05,
      matchaMug: 0.05,
      mug: 0.05,
      cup: 0.05,
      earbuds: 0.05,
      airpods: 0.05,
      airpod: 0.05,
      headphone: 0.05,
      headphones: 0.05,
      scissors: 0.05,
      scissor: 0.05,
      pencil: 0.05,
      stickyNotes: 0.05,
      plant: 0.05,
      deskLamp: 0.05,
      lamp: 0.05,
      chess: 0.05,
      chessPieces: 0.05,
      pawn: 0.05,
      knight: 0.05,
      queen: 0.05,
      globe: 0.05,
      globeSphere: 0.05,
      cat: 0.05,
      orangeCat: 0.05,
      tabbyCat: 0.05,
      orangeTabby: 0.05,
      jewelry: 0.05,
      silverJewelry: 0.05,
      jewelries: 0.05,
      rings: 0.05,
      necklace: 0.05,
      miata: 0.05,
      miataCar: 0.05,
      toyMiata: 0.05,
      toyCar: 0.05,
      car: 0.05
    };

    // Helper: Convert pointer NDC to desk world space (X, Y)
    const getDeskWorldCoords = (ndcX: number, ndcY: number) => {
      const frustumWidth = camera.right - camera.left;
      const frustumHeight = camera.top - camera.bottom;
      const worldX = (ndcX * frustumWidth) / 2 + camera.position.x;
      const worldY = (ndcY * frustumHeight) / 2 + camera.position.y;
      return new THREE.Vector2(worldX, worldY);
    };

    // 4. Pointer Down Handler (Start Drag or Click)
    const handlePointerDown = (event: PointerEvent) => {
      const rect = container.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      pointer.set(x, y);
      pointerDownPos.set(event.clientX, event.clientY);

      raycaster.setFromCamera(pointer, camera);
      const intersects = raycaster.intersectObjects(handles.deskGroup.children, true);

      if (intersects.length > 0) {
        for (const hit of intersects) {
          let current: THREE.Object3D | null = hit.object;
          let objName: string | null = null;

          while (current && current !== handles.deskGroup) {
            if (current.name && nameToObjectMap[current.name]) {
              objName = current.name;
              break;
            }
            current = current.parent;
          }

          if (objName && nameToObjectMap[objName]) {
            const targetObj = nameToObjectMap[objName];

            isDragging = true;
            draggedObject = targetObj;
            draggedObjectName = objName;
            setIsDraggingState(true);

            const worldMouse = getDeskWorldCoords(x, y);
            dragOffset.set(
              worldMouse.x - targetObj.position.x,
              worldMouse.y - targetObj.position.y
            );

            // Lift object slightly off desk surface during drag for soft floating shadow effect
            const restingZ = defaultZMap[objName] ?? 0.05;
            targetObj.position.z = restingZ + 0.3;

            break;
          }
        }
      }
    };

    let isFirstPointerMove = true;

    // 5. Pointer Move Handler (Update Drag or Raycast Hover)
    const handlePointerMove = (event: PointerEvent) => {
      const rect = container.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      targetMouseRef.current = { x, y };
      if (tooltipRef.current) {
        tooltipRef.current.style.transform = `translate3d(${event.clientX - rect.left + 16}px, ${event.clientY - rect.top + 18}px, 0)`;
      }
      if (isFirstPointerMove) {
        mouseRef.current = { x, y };
        isFirstPointerMove = false;
      }
      pointer.set(x, y);

      // If actively dragging an object across the desk
      if (isDragging && draggedObject) {
        const worldMouse = getDeskWorldCoords(x, y);
        draggedObject.position.x = worldMouse.x - dragOffset.x;
        draggedObject.position.y = worldMouse.y - dragOffset.y;
        return;
      }

      // If a modal overlay is active, disable desk raycasting
      if (isAnyModalOpenRef.current) {
        if (hoveredObjectNameRef.current !== null) {
          hoveredObjectNameRef.current = null;
          setHoveredObjectName(null);
        }
        return;
      }

      // Hover Raycasting
      raycaster.setFromCamera(pointer, camera);
      const intersects = raycaster.intersectObjects(handles.deskGroup.children, true);

      let foundObject: string | null = null;
      const foundZone: string | null = null;


      if (intersects.length > 0) {
        for (const hit of intersects) {
          let current: THREE.Object3D | null = hit.object;
          while (current && current !== handles.deskGroup) {
            if (current.name && nameToObjectMap[current.name]) {
              foundObject = current.name;
              break;
            }
            current = current.parent;
          }

          if (foundObject) break;
        }
      }

      if (hoveredObjectNameRef.current !== foundObject) {
        hoveredObjectNameRef.current = foundObject;
        setHoveredObjectName(foundObject);
      }
      if (hoveredZoneNameRef.current !== foundZone) {
        hoveredZoneNameRef.current = foundZone;
        setHoveredZoneName(foundZone);
      }
    };

    // 6. Pointer Up Handler (Drop Object or Perform Click)
    const handlePointerUp = (event: PointerEvent) => {
      const distMoved = Math.hypot(
        event.clientX - pointerDownPos.x,
        event.clientY - pointerDownPos.y
      );

      if (isDragging && draggedObject) {
        // Lower object back down to desk surface
        const restingZ = (draggedObjectName ? defaultZMap[draggedObjectName] : undefined) ?? 0.05;
        draggedObject.position.z = restingZ;

        // If moved less than 5px, trigger standard click action!
        if (distMoved < 5 && draggedObjectName) {
          triggerObjectAction(draggedObjectName, hoveredZoneNameRef.current);
        }


        isDragging = false;
        draggedObject = null;
        draggedObjectName = null;
        setIsDraggingState(false);
      } else if (distMoved < 5) {
        // Clicked empty space on desk - dismiss active dialogues/toasts
        closeAllOverlays();
      }
    };

    const openWorks = () => {
      onBeforeNavigate?.();
      setTimeout(() => window.history.pushState({}, "", "/works"), 80);
    };


    const markFound = (objName: string) => {
      const id = ALIAS[objName];
      if (!id || foundRef.current.has(id)) return;
      foundRef.current.add(id);
      const next = Array.from(foundRef.current);
      setFound(next);
      if (next.length === ALL_IDS.length) {
        setTimeout(() => {
          setAllFoundToast(true);
          setIsEasterEggOpen(true);
        }, 1400);
      }
    };

    const triggerObjectAction = (objName: string, zoneName: string | null) => {
      playClickSound();
      closeAllOverlays();
      markFound(objName);

      if (objName === "macbook" || objName === "keyboard") {
        // Click pins the lid open; click again closes it
        const pinned = !handles.macbookLid.userData.pinned;
        handles.macbookLid.userData.pinned = pinned;
        if (!pinned) {
          handles.macbookLid.userData.suppressHover = true; // close now, even though the pointer is still on it
          return;
        }
        setInfo({
          title: "Check out the projects I've been working on!",
          actions: [{ label: "Open the works archive", primary: true, onClick: () => { setInfo(null); openWorks(); } }],
        });
      } else if (objName === "plant") {
        // no card: the plant is just a plant
      } else if (objName === "journal") {
        setIsJournalOpen(true);
      } else if (objName === "coffeeMug" || objName === "matcha" || objName === "matchaMug" || objName === "mug" || objName === "cup") {
        handles.mugLiquid.scale.set(1.1, 1.1, 1);
        setTimeout(() => handles.mugLiquid.scale.set(1, 1, 1), 300);
        setIsMatchaOpen(true);
      } else if (objName === "phone" || objName === "ipad" || objName === "tablet") {
        setIsPhoneOpen(true);
      } else if (objName === "pencil") {
        const pg = handles.pencilGroup;
        pg.userData.isOut = !pg.userData.isOut;
        pg.userData.slideTo = pg.userData.isOut ? pg.userData.outPos : pg.userData.home;
        if (pg.userData.isOut) setIsBlueprintActive(true);
      } else if (objName === "stickyNotes") {
        setIsEasterEggOpen(true);
      } else if (objName === "earbuds" || objName === "airpods" || objName === "airpod") {
        setIsEarbudsOpen(true);
      } else if (objName === "scissors" || objName === "scissor") {
        setIsScissorsOpen(true);
      } else if (objName === "deskLamp" || objName === "lamp") {
        const nextState = !isLampOnRef.current;
        isLampOnRef.current = nextState;
        setIsLampOn(nextState);
        playToggleSound(nextState);
      } else if (objName === "pictureFrame" || objName === "frame" || objName === "photoFrame") {
        const stack = handles.pictureFrameGroup.userData.polaroids as THREE.Group | undefined;
        const toggle = stack?.userData.toggle as (() => boolean) | undefined;
        if (toggle && toggle()) setTimeout(() => setIsPictureFrameOpen(true), 380);
      } else if (objName === "chess" || objName === "chessPieces" || objName === "pawn" || objName === "knight" || objName === "queen") {
        setIsChessOpen(true);
      } else if (objName === "globe" || objName === "globeSphere") {
        setIsGlobeOpen(true);
      } else if (objName === "cat" || objName === "orangeCat" || objName === "tabbyCat" || objName === "orangeTabby") {
        setIsCatOpen(true);
      } else if (objName === "jewelry" || objName === "silverJewelry" || objName === "jewelries" || objName === "rings" || objName === "necklace") {
        setIsSilverOpen(true);
      } else if (objName === "rubiksCube" || objName === "rubiks" || objName === "cube" || objName === "rubik") {
        // first click scrambles it, the next one solves it again (and asks what's next)
        const cube = handles.rubiksCubeGroup.userData.cube as THREE.Group | undefined;
        const toggle = cube?.userData.toggle as (() => boolean) | undefined;
        if (toggle && toggle()) setTimeout(() => setIsRubiksOpen(true), 420);
      } else if (objName === "miata" || objName === "miataCar" || objName === "toyMiata" || objName === "toyCar" || objName === "car") {
        setIsMiataOpen(true);
      }

      // Zone triggers on cutting mat
      if (zoneName === "Portfolio") {
        scrollToSection("projects");
      } else if (zoneName === "Lab Workspace" || zoneName === "Experiments") {
        if (onEnterLab) onEnterLab();
      } else if (zoneName === "Photography") {
        scrollToSection("about");
      } else if (zoneName === "Contact") {
        scrollToSection("contact");
      }
    };

    container.addEventListener("pointerdown", handlePointerDown);
    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    window.addEventListener("pointerup", handlePointerUp);

    // 7. Resize Handler
    const handleResize = () => {
      if (!container) return;
      const width = container.clientWidth;
      const height = container.clientHeight;
      const newAspect = width / height;
      d = fitD(newAspect);

      camera.left = -d * newAspect;
      camera.right = d * newAspect;
      camera.top = d;
      camera.bottom = -d;
      camera.updateProjectionMatrix();

      renderer.setSize(width, height);
    };
    window.addEventListener("resize", handleResize);

    // 8. Render Animation Loop
    let animationFrameId: number | null = null;
    let isIntersecting = false;
    const clock = new THREE.Clock();

    const animate = () => {
      if (!isIntersecting) return;
      animationFrameId = requestAnimationFrame(animate);
      const time = clock.getElapsedTime();

      // Smooth mouse lerping
      mouseRef.current.x += (targetMouseRef.current.x - mouseRef.current.x) * 0.06;
      mouseRef.current.y += (targetMouseRef.current.y - mouseRef.current.y) * 0.06;

      // Keep camera fixed in place (table does not follow mouse movement)
      camera.position.x = 0;
      camera.position.y = 0;

      // Idle desk position
      handles.deskGroup.position.z = 0;

      const hoveredObj = hoveredObjectNameRef.current;

      // MacBook: Lid opens & screen light activates ONLY on hover
      const isMacbookHovered = hoveredObj === "macbook" || hoveredObj === "keyboard";
      if (!isMacbookHovered) handles.macbookLid.userData.suppressHover = false;
      const lidOpen = Boolean(handles.macbookLid.userData.pinned) || (isMacbookHovered && !handles.macbookLid.userData.suppressHover);
      const targetLidAngle = lidOpen ? -2.25 : 0;
      const targetLightIntensity = 0;

      handles.macbookLid.rotation.x += (targetLidAngle - handles.macbookLid.rotation.x) * 0.1;
      handles.screenLight.intensity += (targetLightIntensity - handles.screenLight.intensity) * 0.1;

      // Keyboard slight depression on hover
      if (isMacbookHovered) {
        handles.keyboardMesh.position.z = 0.04;
      } else {
        handles.keyboardMesh.position.z = 0.05;
      }

      // Journal: Cover opens ONLY on hover (when no modal is active)
      const isJournalHovered = !isAnyModalOpenRef.current && hoveredObj === "journal";
      const targetJournalAngle = isJournalHovered ? -0.35 : 0;
      handles.journalCover.rotation.y += (targetJournalAngle - handles.journalCover.rotation.y) * 0.1;

      const targetJournalZ = isJournalHovered ? 0.48 : 0.45;
      if (!isDragging || draggedObjectName !== "journal") {
        handles.journalGroup.position.z += (targetJournalZ - handles.journalGroup.position.z) * 0.1;
      }

      // Staedtler Blue Pencil Hover Lift & Float Animation
      const isPencilHovered = hoveredObj === "pencil";
      const slideTo = handles.pencilGroup.userData.slideTo as THREE.Vector2 | undefined;
      const home = handles.pencilGroup.userData.home as THREE.Vector2 | undefined;
      const inCase = home ? Math.hypot(handles.pencilGroup.position.x - home.x, handles.pencilGroup.position.y - home.y) < 0.25 : false;
      const targetPencilZ = slideTo ? 0.45 : isPencilHovered ? (inCase ? 0.3 : 0.2) : inCase ? 0.07 : 0.05;
      if (slideTo) {
        if (isDragging && draggedObjectName === "pencil") {
          handles.pencilGroup.userData.slideTo = undefined;
        } else {
          handles.pencilGroup.position.x += (slideTo.x - handles.pencilGroup.position.x) * 0.12;
          handles.pencilGroup.position.y += (slideTo.y - handles.pencilGroup.position.y) * 0.12;
          if (Math.hypot(slideTo.x - handles.pencilGroup.position.x, slideTo.y - handles.pencilGroup.position.y) < 0.01) {
            handles.pencilGroup.userData.slideTo = undefined;
          }
        }
      }
      const pencilBase = (handles.pencilGroup.userData.baseRotZ as number | undefined) ?? -0.14;
      const targetPencilRotZ = pencilBase + (isPencilHovered && !inCase ? 0.08 : 0);
      if (!isDragging || draggedObjectName !== "pencil") {
        handles.pencilGroup.position.z += (targetPencilZ - handles.pencilGroup.position.z) * 0.1;
        handles.pencilGroup.rotation.z += (targetPencilRotZ - handles.pencilGroup.rotation.z) * 0.1;
      }

      // Smartphone / iPad: Screen lights up & scales ONLY on hover
      const isIpadHovered = hoveredObj === "phone" || hoveredObj === "ipad" || hoveredObj === "tablet";
      const targetIpadZ = 0.05;
      const targetIpadScale = isIpadHovered ? 1.04 : 1.0;

      if (!isDragging || (draggedObjectName !== "phone" && draggedObjectName !== "ipad")) {
        handles.phoneGroup.position.z += (targetIpadZ - handles.phoneGroup.position.z) * 0.1;
        handles.phoneGroup.rotation.x += (0 - handles.phoneGroup.rotation.x) * 0.1;
        const currentScale = handles.phoneGroup.scale.x;
        const nextScale = currentScale + (targetIpadScale - currentScale) * 0.1;
        handles.phoneGroup.scale.set(nextScale, nextScale, nextScale);
      }

      handles.phoneScreenMat.emissiveIntensity += (
        (isIpadHovered ? 1.4 : 0.2) - handles.phoneScreenMat.emissiveIntensity
      ) * 0.1;

      // AirPods / Earbuds Hover Animation & Soft Drop Shadow
      const isAirpodsHovered = hoveredObj === "earbuds" || hoveredObj === "airpods" || hoveredObj === "airpod";
      const targetEarbudsZ = isAirpodsHovered ? 0.38 : 0.05;
      const targetEarbudsScale = isAirpodsHovered ? 1.05 : 1.0;
      const earbudsBase = (handles.earbudsGroup.userData.baseRotZ as number | undefined) ?? -0.3;
      const targetEarbudsRotZ = earbudsBase + (isAirpodsHovered ? 0.08 : 0);

      if (!isDragging || (draggedObjectName !== "earbuds" && draggedObjectName !== "airpods" && draggedObjectName !== "airpod")) {
        handles.earbudsGroup.position.z += (targetEarbudsZ - handles.earbudsGroup.position.z) * 0.1;
        handles.earbudsGroup.rotation.z += (targetEarbudsRotZ - handles.earbudsGroup.rotation.z) * 0.1;
        const curS = handles.earbudsGroup.scale.x;
        const nxtS = curS + (targetEarbudsScale - curS) * 0.1;
        handles.earbudsGroup.scale.set(nxtS, nxtS, nxtS);
      }

      if (handles.earbudsShadowMesh) {
        const targetShadowScale = isAirpodsHovered ? 1.45 : 1.0;
        const targetShadowOpacity = isAirpodsHovered ? 0.25 : 0.55;
        const targetShadowOffX = isAirpodsHovered ? -0.18 : 0;
        const targetShadowOffY = isAirpodsHovered ? -0.14 : 0;

        handles.earbudsShadowMesh.scale.x += (targetShadowScale - handles.earbudsShadowMesh.scale.x) * 0.1;
        handles.earbudsShadowMesh.scale.y += (targetShadowScale - handles.earbudsShadowMesh.scale.y) * 0.1;
        handles.earbudsShadowMesh.position.x += (targetShadowOffX - handles.earbudsShadowMesh.position.x) * 0.1;
        handles.earbudsShadowMesh.position.y += (targetShadowOffY - handles.earbudsShadowMesh.position.y) * 0.1;

        const mat = handles.earbudsShadowMesh.material as THREE.MeshBasicMaterial;
        mat.opacity += (targetShadowOpacity - mat.opacity) * 0.1;
      }

      // Scissors: Blades open ONLY on hover
      const isScissorsHovered = hoveredObj === "scissors" || hoveredObj === "scissor";
      const targetScissorsZ = 0.05;
      if (!isDragging || (draggedObjectName !== "scissors" && draggedObjectName !== "scissor")) {
        handles.scissorsGroup.position.z += (targetScissorsZ - handles.scissorsGroup.position.z) * 0.1;
      }
      const targetBladeAngle = isScissorsHovered ? 0.26 : 0.0;
      handles.scissorBlade1.rotation.z += (targetBladeAngle - handles.scissorBlade1.rotation.z) * 0.1;
      handles.scissorBlade2.rotation.z += (-targetBladeAngle - handles.scissorBlade2.rotation.z) * 0.1;

      // Matcha Mug, Swirling Liquid & Steam Particles (ONLY on hover)
      const isMugHovered =
        hoveredObj === "coffeeMug" ||
        hoveredObj === "matcha" ||
        hoveredObj === "matchaMug" ||
        hoveredObj === "mug" ||
        hoveredObj === "cup";

      const targetMugZ = isMugHovered ? 0.25 : 0.05;
      const targetMugScale = isMugHovered ? 1.04 : 1.0;
      if (
        !isDragging ||
        (draggedObjectName !== "coffeeMug" &&
          draggedObjectName !== "matcha" &&
          draggedObjectName !== "matchaMug" &&
          draggedObjectName !== "mug" &&
          draggedObjectName !== "cup")
      ) {
        handles.mugGroup.position.z += (targetMugZ - handles.mugGroup.position.z) * 0.1;
        const currentMugScale = handles.mugGroup.scale.x;
        const nextMugScale = currentMugScale + (targetMugScale - currentMugScale) * 0.1;
        handles.mugGroup.scale.set(nextMugScale, nextMugScale, nextMugScale);
      }

      // Matcha Liquid Surface Swirl Motion on Hover
      if (handles.mugLiquid) {
        const targetSwirlSpeed = isMugHovered ? 0.035 : 0.003;
        handles.mugLiquid.rotation.z += targetSwirlSpeed;
      }

      const steamMat = handles.steamParticles.material as THREE.PointsMaterial;
      const targetSteamOpacity = isMugHovered ? 0.45 : 0.0;
      steamMat.opacity += (targetSteamOpacity - steamMat.opacity) * 0.1;

      if (steamMat.opacity > 0.01) {
        const steamPos = handles.steamParticles.geometry.attributes.position.array as Float32Array;
        for (let i = 0; i < steamPos.length; i += 3) {
          steamPos[i + 2] += 0.008; // Rise upward
          const swirlRadius = Math.hypot(steamPos[i], steamPos[i + 1]);
          const angle = Math.atan2(steamPos[i + 1], steamPos[i]) + (isMugHovered ? 0.04 : 0.01);
          steamPos[i] = Math.cos(angle) * swirlRadius + Math.sin(time * 2 + i) * 0.001;
          steamPos[i + 1] = Math.sin(angle) * swirlRadius;
          if (steamPos[i + 2] > 2.0) {
            steamPos[i + 2] = 0.6;
            const r = Math.random() * 0.25;
            const a = Math.random() * Math.PI * 2;
            steamPos[i] = Math.cos(a) * r;
            steamPos[i + 1] = Math.sin(a) * r;
          }
        }
        handles.steamParticles.geometry.attributes.position.needsUpdate = true;
      }

      // Sticky Notes Hover
      const targetStickyZ = 0.05;
      if (!isDragging || draggedObjectName !== "stickyNotes") {
        handles.stickyNotesGroup.position.z += (targetStickyZ - handles.stickyNotesGroup.position.z) * 0.1;
      }

      // Rubiks Cube Hover & Subtle Rotation
      if (handles.rubiksCubeGroup) {
        const isRubiksHovered = hoveredObj === "rubiksCube";
        const targetRubiksZ = isRubiksHovered ? 1.35 : 0.38;
        if (!isDragging || draggedObjectName !== "rubiksCube") {
          handles.rubiksCubeGroup.position.z += (targetRubiksZ - handles.rubiksCubeGroup.position.z) * 0.1;
          if (isRubiksHovered) {
            handles.rubiksCubeGroup.rotation.y += 0.01;
          }
        }
      }

      // Desk Lamp Hover
      if (handles.lampLight && handles.cozyCornerLight && handles.bulbMat && handles.lampTarget) {
        const lampX = handles.lampGroup.position.x;
        const lampY = handles.lampGroup.position.y;
        const lampZ = handles.lampGroup.position.z;

        // the shade sits at (1.6, -1.2) in the lamp's own frame
        const lr = handles.lampGroup.rotation.z;
        const bulbX = lampX + 1.6 * Math.cos(lr) + 1.2 * Math.sin(lr);
        const bulbY = lampY + 1.6 * Math.sin(lr) - 1.2 * Math.cos(lr);
        const bulbZ = lampZ + 1.25;

        handles.cozyCornerLight.position.set(bulbX, bulbY, bulbZ);
        handles.lampLight.position.set(bulbX, bulbY, bulbZ + 2.0);
        handles.lampTarget.position.set(handles.journalGroup.position.x, handles.journalGroup.position.y, 0);
        handles.lampTarget.updateMatrixWorld();

        const targetSpotIntensity = isLampOnRef.current ? 5.5 : 0;
        const targetPointIntensity = isLampOnRef.current ? 2.2 : 0;
        const targetBulbEmissive = isLampOnRef.current ? 1.5 : 0;

        handles.lampLight.intensity += (targetSpotIntensity - handles.lampLight.intensity) * 0.15;
        handles.cozyCornerLight.intensity += (targetPointIntensity - handles.cozyCornerLight.intensity) * 0.15;
        handles.bulbMat.emissiveIntensity += (targetBulbEmissive - handles.bulbMat.emissiveIntensity) * 0.15;

        const targetLampZ = 0.05;
        if (!isDragging || (draggedObjectName !== "deskLamp" && draggedObjectName !== "lamp")) {
          handles.lampGroup.position.z += (targetLampZ - handles.lampGroup.position.z) * 0.1;
        }
      }

      // Picture Frame Hover Elevation Animation & Soft Drop Shadow
      if (handles.pictureFrameGroup) {
        const isFrameHovered = hoveredObj === "pictureFrame" || hoveredObj === "frame" || hoveredObj === "photoFrame";
        const targetFrameZ = isFrameHovered ? 0.42 : 0.04;
        const targetFrameScale = isFrameHovered ? 1.05 : 1.0;
        const frameBase = (handles.pictureFrameGroup.userData.baseRotZ as number | undefined) ?? 0.04;
        const targetFrameRotZ = frameBase + (isFrameHovered ? 0.04 : 0);

        if (!isDragging || (draggedObjectName !== "pictureFrame" && draggedObjectName !== "frame")) {
          handles.pictureFrameGroup.position.z += (targetFrameZ - handles.pictureFrameGroup.position.z) * 0.1;
          handles.pictureFrameGroup.rotation.z += (targetFrameRotZ - handles.pictureFrameGroup.rotation.z) * 0.1;
          const curS = handles.pictureFrameGroup.scale.x;
          const nxtS = curS + (targetFrameScale - curS) * 0.1;
          handles.pictureFrameGroup.scale.set(nxtS, nxtS, nxtS);
        }

        if (handles.frameShadowMesh) {
          const targetShadowScale = isFrameHovered ? 1.48 : 1.0;
          const targetShadowOpacity = isFrameHovered ? 0.22 : 0.55;
          const targetShadowOffX = isFrameHovered ? -0.22 : 0;
          const targetShadowOffY = isFrameHovered ? -0.16 : 0;

          handles.frameShadowMesh.scale.x += (targetShadowScale - handles.frameShadowMesh.scale.x) * 0.1;
          handles.frameShadowMesh.scale.y += (targetShadowScale - handles.frameShadowMesh.scale.y) * 0.1;
          handles.frameShadowMesh.position.x += (targetShadowOffX - handles.frameShadowMesh.position.x) * 0.1;
          handles.frameShadowMesh.position.y += (targetShadowOffY - handles.frameShadowMesh.position.y) * 0.1;

          const mat = handles.frameShadowMesh.material as THREE.MeshBasicMaterial;
          mat.opacity += (targetShadowOpacity - mat.opacity) * 0.1;
        }
      }

      // Chess Pieces Hover Elevation Animation & Soft Drop Shadow
      if (handles.chessGroup) {
        const isChessHovered = hoveredObj === "chess" || hoveredObj === "chessPieces" || hoveredObj === "pawn" || hoveredObj === "knight" || hoveredObj === "queen";
        const targetChessZ = isChessHovered ? 0.42 : 0.05;
        const targetChessScale = isChessHovered ? 1.06 : 1.0;
        const chessBase = (handles.chessGroup.userData.baseRotZ as number | undefined) ?? -0.15;
        const targetChessRotZ = chessBase + (isChessHovered ? 0.1 : 0);

        if (!isDragging || (draggedObjectName !== "chess" && draggedObjectName !== "pawn" && draggedObjectName !== "knight" && draggedObjectName !== "queen")) {
          handles.chessGroup.position.z += (targetChessZ - handles.chessGroup.position.z) * 0.1;
          handles.chessGroup.rotation.z += (targetChessRotZ - handles.chessGroup.rotation.z) * 0.1;
          const curS = handles.chessGroup.scale.x;
          const nxtS = curS + (targetChessScale - curS) * 0.1;
          handles.chessGroup.scale.set(nxtS, nxtS, nxtS);
        }

        if (handles.chessShadowMesh) {
          const targetShadowScale = isChessHovered ? 1.48 : 1.0;
          const targetShadowOpacity = isChessHovered ? 0.22 : 0.55;
          const targetShadowOffX = isChessHovered ? -0.20 : 0;
          const targetShadowOffY = isChessHovered ? -0.15 : 0;

          handles.chessShadowMesh.scale.x += (targetShadowScale - handles.chessShadowMesh.scale.x) * 0.1;
          handles.chessShadowMesh.scale.y += (targetShadowScale - handles.chessShadowMesh.scale.y) * 0.1;
          handles.chessShadowMesh.position.x += (targetShadowOffX - handles.chessShadowMesh.position.x) * 0.1;
          handles.chessShadowMesh.position.y += (targetShadowOffY - handles.chessShadowMesh.position.y) * 0.1;

          const mat = handles.chessShadowMesh.material as THREE.MeshBasicMaterial;
          mat.opacity += (targetShadowOpacity - mat.opacity) * 0.1;
        }
      }

      // World Globe Hover Elevation & Axial Spin Animation
      if (handles.globeGroup && handles.globeSphere) {
        const isGlobeHovered = hoveredObj === "globe" || hoveredObj === "globeSphere";
        const targetGlobeZ = 0.05;
        if (!isDragging || (draggedObjectName !== "globe" && draggedObjectName !== "globeSphere")) {
          handles.globeGroup.position.z += (targetGlobeZ - handles.globeGroup.position.z) * 0.1;
        }
        // Continuous axial rotation (faster spin on hover!)
        handles.globeSphere.rotation.y += isGlobeHovered ? 0.018 : 0.004;
      }

      // Orange Cat Hover Elevation & Tail Sway Animation
      if (handles.catGroup) {
        const isCatHovered = hoveredObj === "cat" || hoveredObj === "orangeCat" || hoveredObj === "tabbyCat" || hoveredObj === "orangeTabby";
        const targetCatZ = 0.05;
        if (!isDragging || (draggedObjectName !== "cat" && draggedObjectName !== "orangeCat" && draggedObjectName !== "tabbyCat")) {
          handles.catGroup.position.z += (targetCatZ - handles.catGroup.position.z) * 0.1;
          if (handles.catTailMesh && isCatHovered) {
            handles.catTailMesh.rotation.z = Math.sin(time * 6) * 0.12;
          }
        }
      }

      // Sterling Silver Jewelry Hover Elevation & Sparkle Dazzle Animation
      if (handles.jewelryGroup) {
        const isJewelryHovered = hoveredObj === "jewelry" || hoveredObj === "silverJewelry" || hoveredObj === "jewelries" || hoveredObj === "rings" || hoveredObj === "necklace";
        const targetJewelryZ = 0.05;
        if (!isDragging || (draggedObjectName !== "jewelry" && draggedObjectName !== "silverJewelry" && draggedObjectName !== "jewelries")) {
          handles.jewelryGroup.position.z += (targetJewelryZ - handles.jewelryGroup.position.z) * 0.1;
          if (isJewelryHovered) {
            handles.jewelryGroup.rotation.z += 0.008;
          }
        }

        // Animate Specular Light intensity boost on hover
        if (handles.jewelryLight) {
          const targetLightIntensity = isJewelryHovered ? 9.0 : 5.2;
          handles.jewelryLight.intensity += (targetLightIntensity - handles.jewelryLight.intensity) * 0.1;
        }

        // Animate Sparkle Stars (Continuous shimmer, rotation & scale pulsing)
        if (handles.jewelrySparkles) {
          handles.jewelrySparkles.children.forEach((sparkle, idx) => {
            sparkle.rotation.z += (isJewelryHovered ? 0.04 : 0.015) + idx * 0.003;
            const pulseSpeed = isJewelryHovered ? 6 : 3;
            const scaleWave = (isJewelryHovered ? 1.15 : 0.85) + Math.sin(time * pulseSpeed + idx * 1.4) * 0.3;
            sparkle.scale.set(scaleWave, scaleWave, scaleWave);

            if (sparkle instanceof THREE.Mesh && sparkle.material) {
              const mat = sparkle.material as THREE.MeshBasicMaterial;
              mat.opacity = (isJewelryHovered ? 0.95 : 0.7) + Math.sin(time * pulseSpeed * 1.2 + idx * 1.8) * 0.25;
            }
          });
        }
      }

      // Toy Miata Car Hover Elevation & Subtle Drive Animation
      if (handles.miataGroup) {
        const isMiataHovered = hoveredObj === "miata" || hoveredObj === "miataCar" || hoveredObj === "toyMiata" || hoveredObj === "toyCar" || hoveredObj === "car";
        const targetMiataZ = 0.05;
        if (!isDragging || (draggedObjectName !== "miata" && draggedObjectName !== "miataCar" && draggedObjectName !== "toyMiata" && draggedObjectName !== "toyCar")) {
          handles.miataGroup.position.z += (targetMiataZ - handles.miataGroup.position.z) * 0.1;
          const glare = handles.miataGroup.userData.glare as THREE.Mesh | undefined;
          if (glare) glare.position.x += ((isMiataHovered ? 0.35 : 0) - glare.position.x) * 0.06;
        }
      }

      // Window Shadow & Leaf Breeze Motion
      if (handles.windowLightMesh) {
        handles.windowLightMesh.rotation.z = Math.sin(time * 0.5) * 0.006;
        handles.windowLightMesh.position.x = 0.5 + Math.cos(time * 0.3) * 0.02;
      }

      // Golden Dust Particles Floating in Afternoon Sunbeam
      const dustPos = handles.dustParticles.geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < dustPos.length; i += 3) {
        dustPos[i + 1] += Math.sin(time * 0.7 + i) * 0.0012;
        dustPos[i + 2] += Math.cos(time * 0.5 + i) * 0.0008;
      }
      handles.dustParticles.geometry.attributes.position.needsUpdate = true;

      // Day / night lighting follows the site theme
      const night = themeRef.current === "dark";
      const wmat = handles.windowLightMesh.material as THREE.MeshBasicMaterial;
      wmat.opacity += ((night ? 0.95 : 0.5) - wmat.opacity) * 0.05;
      wmat.color.lerp(night ? MOONLIGHT : SUNLIGHT, 0.05);
      ambientLight.intensity += ((night ? 0.7 : dayLight.ambient) - ambientLight.intensity) * 0.05;
      hemiLight.intensity += ((night ? 0.35 : dayLight.hemi) - hemiLight.intensity) * 0.05;
      sunLight.intensity += ((night ? 0.12 : dayLight.sun) - sunLight.intensity) * 0.05;
      renderer.toneMappingExposure += ((night ? 1.15 : dayLight.exposure) - renderer.toneMappingExposure) * 0.05;
      const lpm = lampPool.material as THREE.MeshBasicMaterial;
      lpm.opacity += ((night && isLampOnRef.current ? 1 : 0) - lpm.opacity) * 0.05;
      const spm = screenPool.material as THREE.MeshBasicMaterial;
      spm.opacity += ((night ? 0.45 * Math.min(1, Math.max(0, -handles.macbookLid.rotation.x / 2.25)) : 0) - spm.opacity) * 0.05;
      const dm = handles.dustParticles.material as THREE.PointsMaterial;
      dm.transparent = true;
      dm.opacity += ((night ? 0 : 0.8) - dm.opacity) * 0.05;
      for (const em of envMats) {
        const base = em.userData.baseEnv as number;
        em.envMapIntensity += ((night ? base * 0.3 : base) - em.envMapIntensity) * 0.05;
      }


      // Where the mat's bottom edge lands on screen → CSS var for the dialogues
      matBottom.set(0, -3.5, 0).project(camera);
      const px = Math.round((1 - (matBottom.y + 1) / 2) * container.clientHeight);
      if (px !== lastMatBottom) {
        lastMatBottom = px;
        container.parentElement?.style.setProperty("--mat-bottom", `${px}px`);
      }

      renderer.render(scene, camera);
    };

    // Warm-up: the first render of a scene compiles every shader, uploads every texture and builds
    // the shadow map, which stalls for a moment. Do that once now, while the desk is still off
    // screen, instead of on the frame it scrolls into view.
    const warmTimer = window.setTimeout(() => {
      if (isIntersecting) return;
      renderer.compile(scene, camera);
      renderer.render(scene, camera);
    }, 60);

    const observer = new IntersectionObserver(
      ([entry]) => {
        isIntersecting = entry.isIntersecting;
        if (isIntersecting) {
          if (!animationFrameId) {
            clock.start();
            animate();
          }
        } else {
          if (animationFrameId) {
            cancelAnimationFrame(animationFrameId);
            animationFrameId = null;
            clock.stop();
          }
        }
      },
      // start drawing a little before the desk is on screen, so it's already running when it appears
      { threshold: 0, rootMargin: "200px 0px" }
    );

    if (container) {
      observer.observe(container);
    }

    return () => {
      window.clearTimeout(warmTimer);
      observer.disconnect();
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
      container.removeEventListener("pointerdown", handlePointerDown);
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
      window.removeEventListener("resize", handleResize);

      if (container && renderer.domElement) {
        try {
          container.removeChild(renderer.domElement);
        } catch {
          // ignore
        }
      }
      renderer.dispose();
    };
  }, [onEnterLab, onBeforeNavigate]);

  // Audio effect on hover state change
  useEffect(() => {
    if (hoveredObjectName || hoveredZoneName) {
      playHoverSound();
    }
  }, [hoveredObjectName, hoveredZoneName]);

  return (
    <div className="relative w-full h-full bg-[#6b4a2c] overflow-hidden select-none font-mono">
      {/* Soft Cozy Warm Window Light & Ambient Amber Overlays */}
      {/* Nostalgic film finish: warm tint, lifted shadows, vignette, grain */}
      <div className={`pointer-events-none absolute inset-0 z-[2] bg-[#ffb36b] mix-blend-soft-light transition-opacity duration-1000 ${theme === "dark" ? "opacity-0" : "opacity-40"}`} />
      <div className={`pointer-events-none absolute inset-0 z-[2] bg-[#503723] mix-blend-lighten transition-opacity duration-1000 ${theme === "dark" ? "opacity-0" : "opacity-20"}`} />
      {/* Night: deep blue hour wash; the lamp and screen pools stay warm/bright in the 3D scene */}
      <div className={`pointer-events-none absolute inset-0 z-[2] bg-[#24345e] mix-blend-multiply transition-opacity duration-1000 ${theme === "dark" ? "opacity-45" : "opacity-0"}`} />
      <div className={`pointer-events-none absolute inset-0 z-[2] bg-[radial-gradient(ellipse_at_55%_42%,transparent_52%,rgba(60,30,10,0.5)_100%)] transition-opacity duration-1000 ${theme === "dark" ? "opacity-0" : "opacity-100"}`} />
      <div className={`pointer-events-none absolute inset-0 z-[2] bg-[radial-gradient(ellipse_at_50%_45%,transparent_35%,rgba(5,8,20,0.7)_100%)] transition-opacity duration-1000 ${theme === "dark" ? "opacity-100" : "opacity-0"}`} />
      <div
        className="pointer-events-none absolute inset-0 z-[2] opacity-40 mix-blend-overlay"
        style={{ backgroundImage: GRAIN_URL }}
      />

      {/* 3D WebGL Canvas Container */}
      <div 
        ref={containerRef} 
        className={`w-full h-full relative z-0 ${
          isDraggingState
            ? "cursor-grabbing"
            : hoveredObjectName
            ? "cursor-grab"
            : "cursor-default"
        }`} 
      />




      {/* Night tint (dark theme) */}
      <div
        className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-b from-indigo-950/40 via-indigo-950/20 to-black/30 transition-opacity duration-1000"
        style={{ opacity: theme === "dark" ? 1 : 0 }}
      />


      {/* Hover label that follows the cursor */}
      <div
        ref={tooltipRef}
        className="pointer-events-none absolute left-0 top-0 z-20 transition-opacity duration-200"
        style={{ opacity: hoveredObjectName && ALIAS[hoveredObjectName] && !isDraggingState ? 1 : 0 }}
      >
        <span className="whitespace-nowrap rounded-full bg-[#fbf7ef] px-3 py-1.5 font-mono text-[11px] font-semibold text-zinc-900 shadow-lg">
          {hoveredObjectName && ALIAS[hoveredObjectName] ? LABELS[ALIAS[hoveredObjectName]] : ""}
        </span>
      </div>

      <InfoCard content={info} onClose={() => setInfo(null)} />

      {/* Blur Overlay on initial load */}
      <div 
        onClick={() => {
          if (isBlurred) {
            playClickSound();
            setIsBlurred(false);
          }
        }}
        className={`absolute inset-0 z-30 flex flex-col items-center justify-center transition-all duration-700 ease-in-out cursor-pointer select-none px-4 text-center ${
          isBlurred 
            ? "backdrop-blur-xl bg-black/60 opacity-100 pointer-events-auto" 
            : "backdrop-blur-none bg-transparent opacity-0 pointer-events-none"
        }`}
      >
        <span className="font-rock-salt text-xl sm:text-2xl md:text-4xl text-white tracking-wider hover:scale-105 transition-transform duration-300 drop-shadow-[0_4px_20px_rgba(0,0,0,0.9)] leading-relaxed">
          explore myrielle's workbench?
        </span>
      </div>

      {/* Interactive Overlays */}
      <JournalModal isOpen={isJournalOpen} onClose={() => setIsJournalOpen(false)} />
      <PhoneModal isOpen={isPhoneOpen} onClose={() => setIsPhoneOpen(false)} />
      <QuoteToast quote={currentQuote} onClose={() => setCurrentQuote(null)} />
      <BlueprintLine
        isActive={isBlueprintActive}
        onComplete={() => {
          setIsBlueprintActive(false);
          scrollToSection("about");
        }}
      />
      <EasterEggModal isOpen={isEasterEggOpen} onClose={() => setIsEasterEggOpen(false)} />
      <EarbudsModal isOpen={isEarbudsOpen} onClose={() => setIsEarbudsOpen(false)} />
      <PictureFrameDialogue isOpen={isPictureFrameOpen} onClose={() => setIsPictureFrameOpen(false)} />
      <MapModal isOpen={isGlobeOpen} onClose={() => setIsGlobeOpen(false)} />
      <ScissorsDialogue isOpen={isScissorsOpen} onClose={() => setIsScissorsOpen(false)} />
      <CatDialogue isOpen={isCatOpen} onClose={() => setIsCatOpen(false)} />
      <SilverDialogue isOpen={isSilverOpen} onClose={() => setIsSilverOpen(false)} />
      <MiataDialogue isOpen={isMiataOpen} onClose={() => setIsMiataOpen(false)} />
      <MatchaDialogue isOpen={isMatchaOpen} onClose={() => setIsMatchaOpen(false)} />
      <RubiksDialogue isOpen={isRubiksOpen} onClose={() => setIsRubiksOpen(false)} />
      <ChessDialogue isOpen={isChessOpen} onClose={() => setIsChessOpen(false)} />
    </div>
  );
}
