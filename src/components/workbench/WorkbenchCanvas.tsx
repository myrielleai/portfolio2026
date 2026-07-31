import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { buildWorkbenchScene, type WorkbenchObjectHandles } from "./DeskObjects";
import JournalModal from "./JournalModal";
import PhoneModal from "./PhoneModal";
import QuoteToast from "./QuoteToast";
import BlueprintLine from "./BlueprintLine";
import EasterEggModal from "./EasterEggModal";
import EarbudsModal from "./EarbudsModal";
import PictureFrameDialogue from "./PictureFrameDialogue";
import GlobeDialogue from "./GlobeDialogue";
import ScissorsDialogue from "./ScissorsDialogue";
import CatDialogue from "./CatDialogue";
import SilverDialogue from "./SilverDialogue";
import MiataDialogue from "./MiataDialogue";
import MatchaDialogue from "./MatchaDialogue";
import RubiksDialogue from "./RubiksDialogue";
import ChessDialogue from "./ChessDialogue";
import { playClickSound, playHoverSound, playToggleSound } from "../../utils/audio";

interface WorkbenchCanvasProps {
  onEnterLab?: () => void;
}



export default function WorkbenchCanvas({ onEnterLab }: WorkbenchCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
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
  const [, setIsLampOn] = useState(true);
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
    setCurrentQuote(null);
  };

  const isAnyModalOpen = isJournalOpen || isPhoneOpen || isEarbudsOpen || isEasterEggOpen;
  const isAnyModalOpenRef = useRef(false);

  useEffect(() => {
    isAnyModalOpenRef.current = isAnyModalOpen;
    if (isAnyModalOpen) {
      hoveredObjectNameRef.current = null;
      setHoveredObjectName(null);
    }
  }, [isAnyModalOpen]);

  // Mouse Parallax & Dragging refs
  const mouseRef = useRef({ x: 0, y: 0 });
  const targetMouseRef = useRef({ x: 0, y: 0 });
  const isLampOnRef = useRef(true);
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
    const d = 5.6; // Orthographic frustum height parameter
    const camera = new THREE.OrthographicCamera(
      -d * aspect, d * aspect, d, -d, 0.1, 100
    );
    camera.position.set(0, 0, 10);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.4;
    container.appendChild(renderer.domElement);

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
    const handles = buildWorkbenchScene(scene);
    handlesRef.current = handles;

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
      scissors: handles.scissorsGroup,
      scissor: handles.scissorsGroup,
      plant: handles.plantGroup,
      deskLamp: handles.lampGroup,
      lamp: handles.lampGroup,
      rubiksCube: handles.rubiksCubeGroup,
      pictureFrame: handles.pictureFrameGroup,
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

    // Raycaster Setup & Drag State Variables
    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();

    let isDragging = false;
    let draggedObject: THREE.Object3D | null = null;
    let draggedObjectName: string | null = null;
    let dragOffset = new THREE.Vector2();
    let pointerDownPos = new THREE.Vector2();


    const defaultZMap: Record<string, number> = {
      journal: 0.45,
      pictureFrame: 0.04,
      rubiksCube: 0.38,
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
      let foundZone: string | null = null;

      if (intersects.length > 0) {
        for (const hit of intersects) {
          let current: THREE.Object3D | null = hit.object;
          while (current && current !== handles.deskGroup) {
            if (current.name) {
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
          triggerObjectAction(draggedObjectName, hoveredZoneName);
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

    const triggerObjectAction = (objName: string, zoneName: string | null) => {
      playClickSound();
      closeAllOverlays();

      if (objName === "macbook" || objName === "keyboard") {
        document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" });
      } else if (objName === "journal") {
        setIsJournalOpen(true);
      } else if (objName === "coffeeMug" || objName === "matcha" || objName === "matchaMug" || objName === "mug" || objName === "cup") {
        handles.mugLiquid.scale.set(1.1, 1.1, 1);
        setTimeout(() => handles.mugLiquid.scale.set(1, 1, 1), 300);
        setIsMatchaOpen(true);
      } else if (objName === "phone" || objName === "ipad" || objName === "tablet") {
        setIsPhoneOpen(true);
      } else if (objName === "pencil") {
        setIsBlueprintActive(true);
      } else if (objName === "stickyNotes") {
        setIsEasterEggOpen(true);
      } else if (objName === "earbuds") {
        setIsEarbudsOpen(true);
      } else if (objName === "scissors" || objName === "scissor") {
        setIsScissorsOpen(true);
      } else if (objName === "deskLamp" || objName === "lamp") {
        const nextState = !isLampOnRef.current;
        isLampOnRef.current = nextState;
        setIsLampOn(nextState);
        playToggleSound(nextState);
      } else if (objName === "pictureFrame") {
        setIsPictureFrameOpen(true);
      } else if (objName === "chess" || objName === "chessPieces" || objName === "pawn" || objName === "knight" || objName === "queen") {
        setIsChessOpen(true);
      } else if (objName === "globe" || objName === "globeSphere") {
        setIsGlobeOpen(true);
      } else if (objName === "cat" || objName === "orangeCat" || objName === "tabbyCat" || objName === "orangeTabby") {
        setIsCatOpen(true);
      } else if (objName === "jewelry" || objName === "silverJewelry" || objName === "jewelries" || objName === "rings" || objName === "necklace") {
        setIsSilverOpen(true);
      } else if (objName === "rubiksCube" || objName === "rubiks" || objName === "cube" || objName === "rubik") {
        setIsRubiksOpen(true);
      } else if (objName === "miata" || objName === "miataCar" || objName === "toyMiata" || objName === "toyCar" || objName === "car") {
        setIsMiataOpen(true);
      }

      // Zone triggers on cutting mat
      if (zoneName === "Portfolio") {
        document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" });
      } else if (zoneName === "Lab Workspace" || zoneName === "Experiments") {
        if (onEnterLab) onEnterLab();
      } else if (zoneName === "Photography") {
        document.getElementById("about")?.scrollIntoView({ behavior: "smooth" });
      } else if (zoneName === "Contact") {
        document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
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

      camera.left = -d * newAspect;
      camera.right = d * newAspect;
      camera.top = d;
      camera.bottom = -d;
      camera.updateProjectionMatrix();

      renderer.setSize(width, height);
    };
    window.addEventListener("resize", handleResize);

    // 8. Render Animation Loop
    let animationFrameId: number;
    const clock = new THREE.Clock();

    const animate = () => {
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
      const targetLidAngle = isMacbookHovered ? -1.65 : 0;
      const targetLightIntensity = isMacbookHovered ? 1.0 : 0;

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

      // Mechanical Pencil Roll ONLY on hover
      const isPencilHovered = hoveredObj === "pencil";
      const targetPencilZ = 0.05;
      if (!isDragging || draggedObjectName !== "pencil") {
        handles.pencilGroup.position.z += (targetPencilZ - handles.pencilGroup.position.z) * 0.1;
        if (isPencilHovered && !isDragging) {
          handles.pencilGroup.rotation.z += 0.02;
        }
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

      // Earbuds Hover Animation
      const targetEarbudsZ = 0.05;
      if (!isDragging || draggedObjectName !== "earbuds") {
        handles.earbudsGroup.position.z += (targetEarbudsZ - handles.earbudsGroup.position.z) * 0.1;
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

      // Coffee Mug & Steam: Steam appears & rises ONLY on hover
      const isMugHovered = hoveredObj === "coffeeMug";
      const targetMugZ = 0.05;
      if (!isDragging || draggedObjectName !== "coffeeMug") {
        handles.mugGroup.position.z += (targetMugZ - handles.mugGroup.position.z) * 0.1;
      }

      const steamMat = handles.steamParticles.material as THREE.PointsMaterial;
      const targetSteamOpacity = isMugHovered ? 0.45 : 0.0;
      steamMat.opacity += (targetSteamOpacity - steamMat.opacity) * 0.1;

      if (steamMat.opacity > 0.01) {
        const steamPos = handles.steamParticles.geometry.attributes.position.array as Float32Array;
        for (let i = 0; i < steamPos.length; i += 3) {
          steamPos[i + 2] += 0.008; // Rise upward
          steamPos[i] += Math.sin(time * 2 + i) * 0.002; // Drift wave
          if (steamPos[i + 2] > 2.0) {
            steamPos[i + 2] = 0.6;
            steamPos[i] = (Math.random() - 0.5) * 0.5;
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

        const bulbX = lampX + 0.4;
        const bulbY = lampY - 0.8;
        const bulbZ = lampZ + 1.25;

        handles.cozyCornerLight.position.set(bulbX, bulbY, bulbZ);
        handles.lampLight.position.set(bulbX, bulbY, bulbZ + 2.0);
        handles.lampTarget.position.set(lampX + 0.8, lampY - 1.8, 0);
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

      // Picture Frame Hover Elevation Animation
      if (handles.pictureFrameGroup) {
        const targetFrameZ = 0.04;
        if (!isDragging || draggedObjectName !== "pictureFrame") {
          handles.pictureFrameGroup.position.z += (targetFrameZ - handles.pictureFrameGroup.position.z) * 0.1;
        }
      }

      // Chess Pieces Hover Elevation Animation
      if (handles.chessGroup) {
        const targetChessZ = 0.05;
        if (!isDragging || (draggedObjectName !== "chess" && draggedObjectName !== "pawn" && draggedObjectName !== "knight" && draggedObjectName !== "queen")) {
          handles.chessGroup.position.z += (targetChessZ - handles.chessGroup.position.z) * 0.1;
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

      // Sterling Silver Jewelry Hover Elevation Animation
      if (handles.jewelryGroup) {
        const isJewelryHovered = hoveredObj === "jewelry" || hoveredObj === "silverJewelry" || hoveredObj === "jewelries" || hoveredObj === "rings" || hoveredObj === "necklace";
        const targetJewelryZ = 0.05;
        if (!isDragging || (draggedObjectName !== "jewelry" && draggedObjectName !== "silverJewelry" && draggedObjectName !== "jewelries")) {
          handles.jewelryGroup.position.z += (targetJewelryZ - handles.jewelryGroup.position.z) * 0.1;
          if (isJewelryHovered) {
            handles.jewelryGroup.rotation.z += 0.008;
          }
        }
      }

      // Toy Miata Car Hover Elevation & Subtle Drive Animation
      if (handles.miataGroup) {
        const isMiataHovered = hoveredObj === "miata" || hoveredObj === "miataCar" || hoveredObj === "toyMiata" || hoveredObj === "toyCar" || hoveredObj === "car";
        const targetMiataZ = 0.05;
        if (!isDragging || (draggedObjectName !== "miata" && draggedObjectName !== "miataCar" && draggedObjectName !== "toyMiata" && draggedObjectName !== "toyCar")) {
          handles.miataGroup.position.z += (targetMiataZ - handles.miataGroup.position.z) * 0.1;
          if (isMiataHovered) {
            handles.miataGroup.rotation.z += 0.006;
          }
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

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
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
  }, [onEnterLab]);

  // Audio effect on hover state change
  useEffect(() => {
    if (hoveredObjectName || hoveredZoneName) {
      playHoverSound();
    }
  }, [hoveredObjectName, hoveredZoneName]);

  return (
    <div className="relative w-full h-screen bg-[#160c07] overflow-hidden select-none font-mono">
      {/* Soft Cozy Warm Window Light & Ambient Amber Overlays */}
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-bl from-amber-600/15 via-orange-950/10 to-transparent z-0" />
      <div className="absolute top-0 right-0 w-[35rem] h-[35rem] pointer-events-none bg-gradient-radial from-amber-400/20 via-orange-600/5 to-transparent blur-3xl" />
      <div className="absolute bottom-0 left-0 w-[30rem] h-[30rem] pointer-events-none bg-gradient-radial from-amber-800/15 via-amber-950/5 to-transparent blur-3xl" />

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

      {/* Header Overlay HUD */}
      <div className="absolute top-8 left-1/2 -translate-x-1/2 z-10 pointer-events-none flex flex-col items-center text-center space-y-2 max-w-xl w-full px-4">
        <h2 
          className="text-2xl md:text-4xl font-extrabold !text-white font-sans tracking-tight drop-shadow-lg"
          style={{ color: "#ffffff" }}
        >
          Myrielle's Workbench
        </h2>
      </div>


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
          document.getElementById("about")?.scrollIntoView({ behavior: "smooth" });
        }}
      />
      <EasterEggModal isOpen={isEasterEggOpen} onClose={() => setIsEasterEggOpen(false)} />
      <EarbudsModal isOpen={isEarbudsOpen} onClose={() => setIsEarbudsOpen(false)} />
      <PictureFrameDialogue isOpen={isPictureFrameOpen} onClose={() => setIsPictureFrameOpen(false)} />
      <GlobeDialogue isOpen={isGlobeOpen} onClose={() => setIsGlobeOpen(false)} />
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
