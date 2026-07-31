import * as THREE from "three";
import {
  createWalnutWoodTexture,
  createMacbookScreenTexture,
  createMacbookKeyboardTexture,
  createLeatherJournalTexture,
  createDottedPageTexture,
  createSmartphoneTexture,
  createStickyNoteTexture,
  createMatchaLiquidTexture,
  createWindowShadowTexture,
  createCorkTexture,
  createFeltPadTexture,
  createPictureFramePhotoTexture,
  createPhotostripTexture1,
  createPhotostripTexture2,
  createGlobeTexture,
  createSoftShadowTexture,
  createStaedtlerPencilTexture,
  createStaedtlerNorisTexture
} from "./DeskMaterials";

export interface WorkbenchObjectHandles {
  deskGroup: THREE.Group;
  macbookGroup: THREE.Group;
  macbookLid: THREE.Group;
  keyboardMesh: THREE.Mesh;
  screenLight: THREE.PointLight;
  journalGroup: THREE.Group;
  journalCover: THREE.Group;
  mugGroup: THREE.Group;
  mugLiquid: THREE.Mesh;
  steamParticles: THREE.Points;
  phoneGroup: THREE.Group;
  phoneScreenMat: THREE.MeshStandardMaterial;
  pencilGroup: THREE.Group;
  stickyNotesGroup: THREE.Group;
  plantGroup: THREE.Group;
  earbudsGroup: THREE.Group;
  scissorsGroup: THREE.Group;
  scissorBlade1: THREE.Group;
  scissorBlade2: THREE.Group;
  lampGroup: THREE.Group;
  lampLight: THREE.SpotLight;
  cozyCornerLight: THREE.PointLight;
  lampTarget: THREE.Object3D;
  bulbMat: THREE.MeshStandardMaterial;
  dustParticles: THREE.Points;
  windowLightMesh: THREE.Mesh;
  rubiksCubeGroup: THREE.Group;
  pictureFrameGroup: THREE.Group;
  chessGroup: THREE.Group;
  globeGroup: THREE.Group;
  globeSphere: THREE.Mesh;
  catGroup: THREE.Group;
  catTailMesh?: THREE.Mesh;
  jewelryGroup: THREE.Group;
  jewelrySparkles?: THREE.Group;
  jewelryLight?: THREE.PointLight;
  miataGroup: THREE.Group;
  frameShadowMesh?: THREE.Mesh;
  chessShadowMesh?: THREE.Mesh;
  earbudsShadowMesh?: THREE.Mesh;
}

function createAppleLogoShape(): { body: THREE.Shape; leaf: THREE.Shape } {
  const body = new THREE.Shape();
  
  // Top center dip
  body.moveTo(0, 0.18);

  // Left top curve
  body.bezierCurveTo(-0.05, 0.24, -0.16, 0.24, -0.22, 0.14);
  // Left side down to bottom
  body.bezierCurveTo(-0.28, 0.02, -0.26, -0.16, -0.16, -0.26);
  // Bottom left to bottom center dip
  body.bezierCurveTo(-0.10, -0.32, -0.04, -0.28, 0, -0.24);
  // Bottom center dip to bottom right
  body.bezierCurveTo(0.04, -0.28, 0.10, -0.32, 0.16, -0.26);
  // Right side up towards bite
  body.bezierCurveTo(0.26, -0.16, 0.28, 0.02, 0.22, 0.14);

  // Bite cut on right side
  body.bezierCurveTo(0.14, 0.08, 0.14, 0.16, 0.22, 0.20);
  
  // Right top curve back to top center dip
  body.bezierCurveTo(0.16, 0.24, 0.05, 0.24, 0, 0.18);

  // Leaf shape
  const leaf = new THREE.Shape();
  leaf.moveTo(0.01, 0.21);
  leaf.bezierCurveTo(0.03, 0.29, 0.10, 0.36, 0.18, 0.37);
  leaf.bezierCurveTo(0.16, 0.28, 0.09, 0.22, 0.01, 0.21);

  return { body, leaf };
}

export function buildWorkbenchScene(scene: THREE.Scene): WorkbenchObjectHandles {
  const deskGroup = new THREE.Group();
  scene.add(deskGroup);

  // ----------------------------------------------------
  // 1. Walnut Wood Table Top (Base)
  // ----------------------------------------------------
  const woodTexture = createWalnutWoodTexture();
  woodTexture.repeat.set(2, 2);

  const deskGeom = new THREE.BoxGeometry(16, 10, 0.4);
  const deskMat = new THREE.MeshStandardMaterial({
    map: woodTexture,
    roughness: 0.5,
    metalness: 0.05
  });
  const deskMesh = new THREE.Mesh(deskGeom, deskMat);
  deskMesh.position.set(0, 0, -0.2);
  deskMesh.receiveShadow = true;
  deskGroup.add(deskMesh);

  // ----------------------------------------------------
  // 1b. Cozy Warm Felt Desk Pad
  // ----------------------------------------------------
  const feltTexture = createFeltPadTexture();
  const feltGeom = new THREE.BoxGeometry(10.2, 7.0, 0.04);
  const feltMat = new THREE.MeshStandardMaterial({
    map: feltTexture,
    roughness: 0.8,
    metalness: 0.05
  });
  const feltPadMesh = new THREE.Mesh(feltGeom, feltMat);
  feltPadMesh.position.set(0, 0, 0.01);
  feltPadMesh.receiveShadow = true;
  deskGroup.add(feltPadMesh);

  // ----------------------------------------------------
  // 3. MacBook Pro (Centerpiece)
  // ----------------------------------------------------
  const macbookGroup = new THREE.Group();
  macbookGroup.position.set(0, 0.2, 0.05);
  macbookGroup.name = "macbook";
  deskGroup.add(macbookGroup);

  // Aluminum Body Base
  const baseGeom = new THREE.BoxGeometry(3.6, 2.4, 0.1);
  const aluminumMat = new THREE.MeshStandardMaterial({
    color: 0x33353b,
    roughness: 0.25,
    metalness: 0.85
  });
  const macbookBase = new THREE.Mesh(baseGeom, aluminumMat);
  macbookBase.castShadow = true;
  macbookBase.receiveShadow = true;
  macbookGroup.add(macbookBase);

  // Keyboard Area
  const keyboardGeom = new THREE.BoxGeometry(3.1, 1.2, 0.02);
  const keyboardMat = new THREE.MeshStandardMaterial({
    color: 0x141518,
    roughness: 0.5
  });
  const keyboardMesh = new THREE.Mesh(keyboardGeom, keyboardMat);
  keyboardMesh.position.set(0, 0.3, 0.05);
  keyboardMesh.name = "keyboard";
  macbookGroup.add(keyboardMesh);

  // Top Keyboard Plane Surface with High-Detail Keycaps & Backlit Legends
  const keyboardTexture = createMacbookKeyboardTexture();
  const keyboardTopGeom = new THREE.PlaneGeometry(3.08, 1.18);
  const keyboardTopMat = new THREE.MeshStandardMaterial({
    map: keyboardTexture,
    roughness: 0.4,
    metalness: 0.1
  });
  const keyboardTopMesh = new THREE.Mesh(keyboardTopGeom, keyboardTopMat);
  keyboardTopMesh.position.set(0, 0, 0.011);
  keyboardMesh.add(keyboardTopMesh);

  // Trackpad
  const trackpadGeom = new THREE.BoxGeometry(1.2, 0.7, 0.01);
  const trackpadMat = new THREE.MeshStandardMaterial({
    color: 0x27292d,
    roughness: 0.2,
    metalness: 0.8
  });
  const trackpadMesh = new THREE.Mesh(trackpadGeom, trackpadMat);
  trackpadMesh.position.set(0, -0.7, 0.05);
  macbookGroup.add(trackpadMesh);

  // MacBook Screen Lid (Pivot at top of base)
  const macbookLid = new THREE.Group();
  macbookLid.position.set(0, 1.2, 0.05);
  macbookGroup.add(macbookLid);

  // Screen Back Shell
  const screenShellGeom = new THREE.BoxGeometry(3.6, 2.4, 0.06);
  screenShellGeom.translate(0, -1.2, 0.03);
  const screenShellMesh = new THREE.Mesh(screenShellGeom, aluminumMat);
  screenShellMesh.castShadow = true;
  macbookLid.add(screenShellMesh);

  // Apple Logo on Inner Face of Laptop Lid
  const { body: appleBodyShape, leaf: appleLeafShape } = createAppleLogoShape();
  const appleExtrudeSettings = {
    depth: 0.008,
    bevelEnabled: true,
    bevelSegments: 3,
    steps: 1,
    bevelSize: 0.002,
    bevelThickness: 0.002
  };
  const appleGeom = new THREE.ExtrudeGeometry([appleBodyShape, appleLeafShape], appleExtrudeSettings);
  appleGeom.center();

  const appleLogoMat = new THREE.MeshStandardMaterial({
    color: 0xf8fafc,
    roughness: 0.15,
    metalness: 0.85,
    emissive: 0xe2e8f0,
    emissiveIntensity: 0.4
  });
  const appleLogoMesh = new THREE.Mesh(appleGeom, appleLogoMat);
  appleLogoMesh.position.set(0, -1.2, 0.061);
  appleLogoMesh.rotation.z = Math.PI;
  appleLogoMesh.castShadow = true;
  macbookLid.add(appleLogoMesh);

  // Screen Display Texture (Laptop Coding on Outer Back Lid, visible in workbench view)
  const screenTexture = createMacbookScreenTexture();
  screenTexture.repeat.set(-1, 1);
  screenTexture.offset.set(1, 0);
  const screenDisplayGeom = new THREE.PlaneGeometry(3.4, 2.2);
  screenDisplayGeom.translate(0, -1.2, -0.002);
  const screenDisplayMat = new THREE.MeshBasicMaterial({
    map: screenTexture
  });
  const screenDisplayMesh = new THREE.Mesh(screenDisplayGeom, screenDisplayMat);
  screenDisplayMesh.rotation.y = Math.PI;
  macbookLid.add(screenDisplayMesh);

  // Screen Glow Soft Ambient Light
  const screenLight = new THREE.PointLight(0x38bdf8, 0, 5);
  screenLight.position.set(0, 0.2, 0.8);
  macbookGroup.add(screenLight);

  // ----------------------------------------------------
  // 4. Black Leather Journal & Cozy Hardcover Book Stack
  // ----------------------------------------------------
  const bookStackGroup = new THREE.Group();
  bookStackGroup.position.set(-5.4, 0.4, 0.02);
  deskGroup.add(bookStackGroup);

  // Bottom Terracotta Book
  const book1Geom = new THREE.BoxGeometry(2.5, 3.5, 0.22);
  const book1Mat = new THREE.MeshStandardMaterial({
    color: 0x833722,
    roughness: 0.7
  });
  const book1Mesh = new THREE.Mesh(book1Geom, book1Mat);
  book1Mesh.position.set(0, -0.05, 0.11);
  book1Mesh.rotation.z = -0.05;
  book1Mesh.castShadow = true;
  book1Mesh.receiveShadow = true;
  bookStackGroup.add(book1Mesh);

  // Middle Forest Green Book
  const book2Geom = new THREE.BoxGeometry(2.4, 3.4, 0.18);
  const book2Mat = new THREE.MeshStandardMaterial({
    color: 0x1b4332,
    roughness: 0.6
  });
  const book2Mesh = new THREE.Mesh(book2Geom, book2Mat);
  book2Mesh.position.set(0.08, 0.05, 0.28);
  book2Mesh.rotation.z = 0.03;
  book2Mesh.castShadow = true;
  book2Mesh.receiveShadow = true;
  bookStackGroup.add(book2Mesh);

  const journalGroup = new THREE.Group();
  journalGroup.position.set(-5.35, 0.42, 0.45);
  journalGroup.name = "journal";
  deskGroup.add(journalGroup);

  // Base pages block
  const pagesGeom = new THREE.BoxGeometry(2.2, 3.2, 0.2);
  const pagesMat = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    roughness: 0.8
  });
  const pagesMesh = new THREE.Mesh(pagesGeom, pagesMat);
  pagesMesh.castShadow = true;
  pagesMesh.receiveShadow = true;
  journalGroup.add(pagesMesh);

  // Top Page Surface with Dotted Grid Texture
  const dottedPageTexture = createDottedPageTexture();
  const topPageGeom = new THREE.PlaneGeometry(2.16, 3.16);
  const topPageMat = new THREE.MeshStandardMaterial({
    map: dottedPageTexture,
    roughness: 0.7
  });
  const topPageMesh = new THREE.Mesh(topPageGeom, topPageMat);
  topPageMesh.position.set(0, 0, 0.101);
  journalGroup.add(topPageMesh);

  // Fabric Ribbon Bookmark hanging from bottom of journal
  const ribbonGeom = new THREE.PlaneGeometry(0.12, 1.0);
  const ribbonMat = new THREE.MeshStandardMaterial({
    color: 0xd97706, // Warm Amber ribbon
    roughness: 0.6,
    side: THREE.DoubleSide
  });
  const ribbonMesh = new THREE.Mesh(ribbonGeom, ribbonMat);
  ribbonMesh.position.set(0.3, -1.7, 0.08);
  ribbonMesh.rotation.z = -0.15;
  journalGroup.add(ribbonMesh);

  // Journal Cover (Pivots open on hover/click)
  const journalCover = new THREE.Group();
  journalCover.position.set(-1.1, 0, 0.1);
  journalGroup.add(journalCover);

  const leatherTexture = createLeatherJournalTexture();
  const coverGeom = new THREE.BoxGeometry(2.2, 3.2, 0.03);
  coverGeom.translate(1.1, 0, 0.015);
  const coverMat = new THREE.MeshStandardMaterial({
    map: leatherTexture,
    roughness: 0.6,
    metalness: 0.1
  });
  const coverMesh = new THREE.Mesh(coverGeom, coverMat);
  coverMesh.castShadow = true;
  journalCover.add(coverMesh);

  // ----------------------------------------------------
  // 4b. Ballpoint Pen & Wooden Pencil (Right of Journal)
  // Cylinders keep default Y-axis orientation → appear as
  // long rectangles when viewed from the top-down camera.
  // ----------------------------------------------------

  // --- Ballpoint Pen ---
  const journalPenGroup = new THREE.Group();
  journalPenGroup.position.set(-3.75, -0.1, 0.05);
  journalPenGroup.rotation.z = -0.10; // resting parallel next to pencil
  deskGroup.add(journalPenGroup);

  // Pen body — no rotateX so cylinder lies along Y (flat on desk from top-down view)
  const penBodyGeom = new THREE.CylinderGeometry(0.045, 0.045, 2.8, 12);
  const penBodyMat = new THREE.MeshStandardMaterial({
    color: 0x1a1a2e,
    roughness: 0.25,
    metalness: 0.6
  });
  const penBodyMesh = new THREE.Mesh(penBodyGeom, penBodyMat);
  penBodyMesh.castShadow = true;
  journalPenGroup.add(penBodyMesh);

  // Silver clip along pen side (thin box running along Y)
  const penClipGeom = new THREE.BoxGeometry(0.015, 0.9, 0.015);
  const penClipMat = new THREE.MeshStandardMaterial({
    color: 0xc0c0c0,
    metalness: 0.95,
    roughness: 0.1
  });
  const penClipMesh = new THREE.Mesh(penClipGeom, penClipMat);
  penClipMesh.position.set(0.048, -0.5, 0.01);
  journalPenGroup.add(penClipMesh);

  // Silver grip band ring (flat disc around barrel)
  const penBandGeom = new THREE.CylinderGeometry(0.056, 0.056, 0.08, 16);
  const penBandMesh = new THREE.Mesh(penBandGeom, penClipMat);
  penBandMesh.position.set(0, -0.55, 0);
  journalPenGroup.add(penBandMesh);

  // Silver/slate ink tip cone (points in +Y direction)
  const penTipGeom = new THREE.ConeGeometry(0.042, 0.28, 12);
  const penTipMat = new THREE.MeshStandardMaterial({
    color: 0x475569,
    roughness: 0.25,
    metalness: 0.7
  });
  const penTipMesh = new THREE.Mesh(penTipGeom, penTipMat);
  penTipMesh.position.set(0, 1.54, 0); // at +Y end (tip)
  journalPenGroup.add(penTipMesh);

  // Silver dome cap at -Y end
  const penCapGeom = new THREE.SphereGeometry(0.05, 12, 12);
  const penCapMesh = new THREE.Mesh(penCapGeom, penClipMat);
  penCapMesh.position.set(0, -1.44, 0);
  journalPenGroup.add(penCapMesh);

  // --- Staedtler Noris 120 Wooden Pencil ---
  const journalPencilGroup = new THREE.Group();
  journalPencilGroup.position.set(-3.5, -0.1, 0.05);
  journalPencilGroup.rotation.z = -0.12; // slight lean parallel to pen
  deskGroup.add(journalPencilGroup);

  // Iconic Yellow & Black Striped Hexagonal Body along Y axis
  const woodPencilBodyGeom = new THREE.CylinderGeometry(0.048, 0.048, 2.3, 6);
  const norisTex = createStaedtlerNorisTexture();
  const woodPencilMat = new THREE.MeshStandardMaterial({
    map: norisTex,
    roughness: 0.35,
    metalness: 0.05
  });
  const woodPencilMesh = new THREE.Mesh(woodPencilBodyGeom, woodPencilMat);
  woodPencilMesh.position.set(0, -0.05, 0);
  woodPencilMesh.castShadow = true;
  journalPencilGroup.add(woodPencilMesh);

  // Staedtler Black Dip Crown Cap at -Y end
  const norisCapGeom = new THREE.CylinderGeometry(0.048, 0.048, 0.22, 6);
  const norisCapMat = new THREE.MeshStandardMaterial({
    color: 0x111827,
    roughness: 0.2,
    metalness: 0.1
  });
  const norisCapMesh = new THREE.Mesh(norisCapGeom, norisCapMat);
  norisCapMesh.position.set(0, -1.25, 0);
  journalPencilGroup.add(norisCapMesh);

  // Red Ring Accent on Crown Top
  const norisRingGeom = new THREE.CylinderGeometry(0.049, 0.049, 0.03, 16);
  const norisRingMat = new THREE.MeshStandardMaterial({
    color: 0xef4444,
    roughness: 0.2
  });
  const norisRingMesh = new THREE.Mesh(norisRingGeom, norisRingMat);
  norisRingMesh.position.set(0, -1.13, 0);
  journalPencilGroup.add(norisRingMesh);

  // Warm cedar wood sharpened cone at +Y end
  const norisWoodConeGeom = new THREE.ConeGeometry(0.048, 0.28, 6);
  const norisWoodConeMat = new THREE.MeshStandardMaterial({
    color: 0xd4a373,
    roughness: 0.75,
    metalness: 0.0
  });
  const norisWoodConeMesh = new THREE.Mesh(norisWoodConeGeom, norisWoodConeMat);
  norisWoodConeMesh.position.set(0, 1.19, 0);
  journalPencilGroup.add(norisWoodConeMesh);

  // Graphite tip cone at tip of wood cone
  const norisGraphiteTipGeom = new THREE.ConeGeometry(0.016, 0.1, 8);
  const norisGraphiteMat = new THREE.MeshStandardMaterial({
    color: 0x2d2d2d,
    roughness: 0.9,
    metalness: 0.05
  });
  const norisGraphiteTipMesh = new THREE.Mesh(norisGraphiteTipGeom, norisGraphiteMat);
  norisGraphiteTipMesh.position.set(0, 1.38, 0);
  journalPencilGroup.add(norisGraphiteTipMesh);

  // ----------------------------------------------------
  // 5. Coffee Mug on Cozy Cork Coaster with Steam Particles
  // ----------------------------------------------------
  const mugGroup = new THREE.Group();
  mugGroup.position.set(4.7, 2.7, 0.05);
  mugGroup.name = "coffeeMug";
  deskGroup.add(mugGroup);

  // Cozy Cork Coaster Under Mug
  const corkTexture = createCorkTexture();
  const coasterGeom = new THREE.CylinderGeometry(0.85, 0.85, 0.06, 32);
  coasterGeom.rotateX(Math.PI / 2);
  const coasterMat = new THREE.MeshStandardMaterial({
    map: corkTexture,
    roughness: 0.7,
    metalness: 0.05
  });
  const coasterMesh = new THREE.Mesh(coasterGeom, coasterMat);
  coasterMesh.position.set(0, 0, -0.57);
  coasterMesh.receiveShadow = true;
  coasterMesh.castShadow = true;
  mugGroup.add(coasterMesh);

  // Ceramic Mug Outer Body (White Ceramic Exterior)
  const mugOuterGeom = new THREE.CylinderGeometry(0.7, 0.6, 1.2, 32, 1, true);
  mugOuterGeom.rotateX(Math.PI / 2);
  const ceramicMat = new THREE.MeshStandardMaterial({
    color: 0xf8fafc,
    roughness: 0.15,
    metalness: 0.05
  });
  const mugOuter = new THREE.Mesh(mugOuterGeom, ceramicMat);
  mugOuter.castShadow = true;
  mugOuter.receiveShadow = true;
  mugGroup.add(mugOuter);

  // Mug Outer Bottom Cap
  const mugBottomGeom = new THREE.CircleGeometry(0.6, 32);
  mugBottomGeom.rotateX(-Math.PI / 2);
  const mugBottom = new THREE.Mesh(mugBottomGeom, ceramicMat);
  mugBottom.position.set(0, 0, -0.6);
  mugGroup.add(mugBottom);

  // Ceramic Mug Handle
  const handleGeom = new THREE.TorusGeometry(0.35, 0.08, 16, 32, Math.PI * 1.1);
  handleGeom.rotateY(Math.PI / 2);
  handleGeom.rotateZ(-Math.PI / 2);
  const mugHandle = new THREE.Mesh(handleGeom, ceramicMat);
  mugHandle.position.set(0.72, 0, 0);
  mugHandle.castShadow = true;
  mugGroup.add(mugHandle);

  // Top Ceramic Rim Ring
  const rimRingGeom = new THREE.RingGeometry(0.60, 0.70, 32);
  const rimRing = new THREE.Mesh(rimRingGeom, ceramicMat);
  rimRing.position.set(0, 0, 0.6);
  mugGroup.add(rimRing);

  // Rich Green Ceramic Interior Wall & Base (Green Inside of Mug)
  const greenInteriorMat = new THREE.MeshStandardMaterial({
    color: 0x166534, // Vibrant emerald / matcha green ceramic glaze inside mug
    roughness: 0.2,
    metalness: 0.05,
    side: THREE.DoubleSide
  });
  const mugInnerGeom = new THREE.CylinderGeometry(0.60, 0.52, 1.18, 32, 1, true);
  mugInnerGeom.rotateX(Math.PI / 2);
  const mugInner = new THREE.Mesh(mugInnerGeom, greenInteriorMat);
  mugInner.position.set(0, 0, 0.01);
  mugGroup.add(mugInner);

  const innerBottomGeom = new THREE.CircleGeometry(0.52, 32);
  const innerBottom = new THREE.Mesh(innerBottomGeom, greenInteriorMat);
  innerBottom.position.set(0, 0, -0.58);
  mugGroup.add(innerBottom);

  // Artisanal Matcha Latte Liquid Surface (Recessed inside the green mug interior)
  const liquidGeom = new THREE.CircleGeometry(0.58, 64);
  const matchaTexture = createMatchaLiquidTexture();
  const liquidMat = new THREE.MeshStandardMaterial({
    map: matchaTexture,
    roughness: 0.2,
    metalness: 0.05
  });
  const mugLiquid = new THREE.Mesh(liquidGeom, liquidMat);
  mugLiquid.position.set(0, 0, 0.48);
  mugGroup.add(mugLiquid);

  // Animated Steam Particle System
  const steamCount = 35;
  const steamGeom = new THREE.BufferGeometry();
  const steamPositions = new Float32Array(steamCount * 3);
  for (let i = 0; i < steamCount * 3; i += 3) {
    steamPositions[i] = (Math.random() - 0.5) * 0.5;
    steamPositions[i + 1] = (Math.random() - 0.5) * 0.5;
    steamPositions[i + 2] = 0.6 + Math.random() * 1.5;
  }
  steamGeom.setAttribute("position", new THREE.BufferAttribute(steamPositions, 3));

  const steamMat = new THREE.PointsMaterial({
    color: 0xffffff,
    size: 0.12,
    transparent: true,
    opacity: 0.35,
    blending: THREE.AdditiveBlending
  });
  const steamParticles = new THREE.Points(steamGeom, steamMat);
  mugGroup.add(steamParticles);

  // ----------------------------------------------------
  // 6. Smartphone (iPhone 15 Pro)
  // ----------------------------------------------------
  const phoneGroup = new THREE.Group();
  phoneGroup.position.set(4.3, -1.6, 0.05);
  phoneGroup.rotation.z = -0.15;
  phoneGroup.name = "phone";
  deskGroup.add(phoneGroup);

  // Materials for iPhone Chassis & Components
  const titaniumMat = new THREE.MeshStandardMaterial({
    color: 0x27272a, // Dark Titanium finish
    roughness: 0.25,
    metalness: 0.85
  });

  const phoneChromeMat = new THREE.MeshStandardMaterial({
    color: 0xe2e8f0,
    roughness: 0.15,
    metalness: 0.95
  });

  const backGlassMat = new THREE.MeshStandardMaterial({
    color: 0x18181b, // Matte frosted back glass
    roughness: 0.35,
    metalness: 0.4
  });

  const cameraIslandMat = new THREE.MeshStandardMaterial({
    color: 0x202024,
    roughness: 0.2,
    metalness: 0.6
  });

  const lensGlassMat = new THREE.MeshStandardMaterial({
    color: 0x090a0f,
    roughness: 0.1,
    metalness: 0.9,
    emissive: 0x1e3a8a,
    emissiveIntensity: 0.25
  });

  // 1. iPhone Ergonomic Rounded Chassis Body
  const phoneW = 1.2;
  const phoneH = 2.45;
  const phoneCornerRadius = 0.16;

  const phoneShape = new THREE.Shape();
  const px = -phoneW / 2;
  const py = -phoneH / 2;
  phoneShape.moveTo(px + phoneCornerRadius, py);
  phoneShape.lineTo(px + phoneW - phoneCornerRadius, py);
  phoneShape.quadraticCurveTo(px + phoneW, py, px + phoneW, py + phoneCornerRadius);
  phoneShape.lineTo(px + phoneW, py + phoneH - phoneCornerRadius);
  phoneShape.quadraticCurveTo(px + phoneW, py + phoneH, px + phoneW - phoneCornerRadius, py + phoneH);
  phoneShape.lineTo(px + phoneCornerRadius, py + phoneH);
  phoneShape.quadraticCurveTo(px, py + phoneH, px, py + phoneH - phoneCornerRadius);
  phoneShape.lineTo(px, py + phoneCornerRadius);
  phoneShape.quadraticCurveTo(px, py, px + phoneCornerRadius, py);

  const phoneExtrudeSettings = {
    depth: 0.08,
    bevelEnabled: true,
    bevelSegments: 4,
    steps: 1,
    bevelSize: 0.008,
    bevelThickness: 0.008
  };

  const phoneChassisGeom = new THREE.ExtrudeGeometry(phoneShape, phoneExtrudeSettings);
  phoneChassisGeom.center();
  const phoneChassisMesh = new THREE.Mesh(phoneChassisGeom, titaniumMat);
  phoneChassisMesh.castShadow = true;
  phoneChassisMesh.receiveShadow = true;
  phoneGroup.add(phoneChassisMesh);

  // 2. Matte Frosted Back Glass Panel (-Z direction)
  const backGlassGeom = new THREE.PlaneGeometry(1.16, 2.41);
  const backGlassMesh = new THREE.Mesh(backGlassGeom, backGlassMat);
  backGlassMesh.position.set(0, 0, -0.049);
  backGlassMesh.rotation.y = Math.PI;
  phoneGroup.add(backGlassMesh);

  // 3. Apple Logo centered on Back Glass
  const appleLogoGeom = new THREE.CircleGeometry(0.08, 24);
  const phoneAppleLogoMat = new THREE.MeshStandardMaterial({
    color: 0x71717a,
    roughness: 0.15,
    metalness: 0.95
  });
  const phoneAppleLogoMesh = new THREE.Mesh(appleLogoGeom, phoneAppleLogoMat);
  phoneAppleLogoMesh.position.set(0, 0, -0.050);
  phoneAppleLogoMesh.rotation.y = Math.PI;
  phoneGroup.add(phoneAppleLogoMesh);

  // 4. Iconic iPhone Pro Triple-Camera Module (Back Top-Left)
  const camIslandGroup = new THREE.Group();
  camIslandGroup.position.set(-0.28, 0.72, -0.049);
  camIslandGroup.rotation.y = Math.PI;
  phoneGroup.add(camIslandGroup);

  // Rounded Square Camera Plate / Glass Island
  const islandW = 0.44;
  const islandH = 0.44;
  const islandRadius = 0.10;
  const islandShape = new THREE.Shape();
  const ix = -islandW / 2;
  const iy = -islandH / 2;
  islandShape.moveTo(ix + islandRadius, iy);
  islandShape.lineTo(ix + islandW - islandRadius, iy);
  islandShape.quadraticCurveTo(ix + islandW, iy, ix + islandW, iy + islandRadius);
  islandShape.lineTo(ix + islandW, iy + islandH - islandRadius);
  islandShape.quadraticCurveTo(ix + islandW, iy + islandH, ix + islandW - islandRadius, iy + islandH);
  islandShape.lineTo(ix + islandRadius, iy + islandH);
  islandShape.quadraticCurveTo(ix, iy + islandH, ix, iy + islandH - islandRadius);
  islandShape.lineTo(ix, iy + islandRadius);
  islandShape.quadraticCurveTo(ix, iy, ix + islandRadius, iy);

  const islandGeom = new THREE.ExtrudeGeometry(islandShape, {
    depth: 0.025,
    bevelEnabled: true,
    bevelSegments: 3,
    bevelSize: 0.005,
    bevelThickness: 0.005
  });
  islandGeom.center();
  const islandMesh = new THREE.Mesh(islandGeom, cameraIslandMat);
  camIslandGroup.add(islandMesh);

  // Helper to create Pro Camera Lenses
  const createCameraLens = (lx: number, ly: number) => {
    const lensGroup = new THREE.Group();
    lensGroup.position.set(lx, ly, 0.015);

    // Chrome Outer Lens Ring
    const ringGeom = new THREE.CylinderGeometry(0.085, 0.085, 0.02, 24);
    ringGeom.rotateX(Math.PI / 2);
    const ringMesh = new THREE.Mesh(ringGeom, phoneChromeMat);
    lensGroup.add(ringMesh);

    // Dark Optical Glass Element Inside
    const glassGeom = new THREE.CylinderGeometry(0.065, 0.065, 0.022, 24);
    glassGeom.rotateX(Math.PI / 2);
    const glassMesh = new THREE.Mesh(glassGeom, lensGlassMat);
    lensGroup.add(glassMesh);

    // Inner Aperture Reflection Spot
    const apertureGeom = new THREE.CircleGeometry(0.03, 16);
    const apertureMat = new THREE.MeshBasicMaterial({ color: 0x3b82f6 });
    const apertureMesh = new THREE.Mesh(apertureGeom, apertureMat);
    apertureMesh.position.set(0, 0, 0.012);
    lensGroup.add(apertureMesh);

    return lensGroup;
  };

  // Triangular Pro Camera Layout
  camIslandGroup.add(createCameraLens(-0.09, 0.09));   // Main Camera
  camIslandGroup.add(createCameraLens(-0.09, -0.09));  // Ultra-Wide Camera
  camIslandGroup.add(createCameraLens(0.09, 0.0));     // Telephoto Camera

  // True Tone Flash (Top-Right)
  const flashGeom = new THREE.CylinderGeometry(0.032, 0.032, 0.01, 16);
  flashGeom.rotateX(Math.PI / 2);
  const flashMat = new THREE.MeshStandardMaterial({
    color: 0xfef08a,
    emissive: 0xfef08a,
    emissiveIntensity: 0.6
  });
  const flashMesh = new THREE.Mesh(flashGeom, flashMat);
  flashMesh.position.set(0.09, 0.10, 0.014);
  camIslandGroup.add(flashMesh);

  // LiDAR Scanner (Bottom-Right)
  const lidarGeom = new THREE.CylinderGeometry(0.03, 0.03, 0.01, 16);
  lidarGeom.rotateX(Math.PI / 2);
  const lidarMat = new THREE.MeshStandardMaterial({
    color: 0x0f172a,
    roughness: 0.1,
    metalness: 0.9
  });
  const lidarMesh = new THREE.Mesh(lidarGeom, lidarMat);
  lidarMesh.position.set(0.09, -0.10, 0.014);
  camIslandGroup.add(lidarMesh);

  // 5. Side Metallic Buttons
  // Right Side: Power Button
  const powerBtnGeom = new THREE.BoxGeometry(0.02, 0.28, 0.03);
  const powerBtnMesh = new THREE.Mesh(powerBtnGeom, titaniumMat);
  powerBtnMesh.position.set(phoneW / 2 + 0.005, 0.3, 0);
  phoneGroup.add(powerBtnMesh);

  // Left Side: Action Button & Volume Up / Down Buttons
  const actionBtnGeom = new THREE.BoxGeometry(0.02, 0.10, 0.03);
  const actionBtnMesh = new THREE.Mesh(actionBtnGeom, titaniumMat);
  actionBtnMesh.position.set(-phoneW / 2 - 0.005, 0.65, 0);
  phoneGroup.add(actionBtnMesh);

  const volUpGeom = new THREE.BoxGeometry(0.02, 0.18, 0.03);
  const volUpMesh = new THREE.Mesh(volUpGeom, titaniumMat);
  volUpMesh.position.set(-phoneW / 2 - 0.005, 0.38, 0);
  phoneGroup.add(volUpMesh);

  const volDownMesh = new THREE.Mesh(volUpGeom, titaniumMat);
  volDownMesh.position.set(-phoneW / 2 - 0.005, 0.12, 0);
  phoneGroup.add(volDownMesh);

  // 6. iPhone Display Screen (Front Face, +Z direction)
  const phoneTexture = createSmartphoneTexture();
  const phoneScreenGeom = new THREE.PlaneGeometry(1.14, 2.36);
  const phoneScreenMat = new THREE.MeshStandardMaterial({
    map: phoneTexture,
    roughness: 0.1,
    emissive: 0xffffff,
    emissiveMap: phoneTexture,
    emissiveIntensity: 0.8
  });
  const phoneScreenMesh = new THREE.Mesh(phoneScreenGeom, phoneScreenMat);
  phoneScreenMesh.position.set(0, 0, 0.050);
  phoneGroup.add(phoneScreenMesh);

  // 7. Dynamic Island Pill Notch Accent Overlay on Top Front Display
  const islandPillGeom = new THREE.BoxGeometry(0.24, 0.06, 0.004);
  const islandPillMat = new THREE.MeshBasicMaterial({ color: 0x000000 });
  const islandPillMesh = new THREE.Mesh(islandPillGeom, islandPillMat);
  islandPillMesh.position.set(0, 1.05, 0.051);
  phoneGroup.add(islandPillMesh);

  // ----------------------------------------------------
  // 8. Staedtler Mars Lumograph Studio Pencil ✏️
  // ----------------------------------------------------
  const pencilGroup = new THREE.Group();
  pencilGroup.position.set(-3.25, -0.1, 0.05);
  pencilGroup.rotation.z = -0.14;
  pencilGroup.name = "pencil";
  deskGroup.add(pencilGroup);

  // Hexagonal Staedtler Royal Blue Enamel Body with Hot-Stamped Silver Foil Branding
  const pencilBodyGeom = new THREE.CylinderGeometry(0.048, 0.048, 2.2, 6);
  const staedtlerTex = createStaedtlerPencilTexture();
  const pencilMat = new THREE.MeshStandardMaterial({
    map: staedtlerTex,
    roughness: 0.25,
    metalness: 0.15
  });
  const pencilMesh = new THREE.Mesh(pencilBodyGeom, pencilMat);
  pencilMesh.position.set(0, -0.05, 0);
  pencilMesh.castShadow = true;
  pencilMesh.receiveShadow = true;
  pencilGroup.add(pencilMesh);

  // Staedtler Signature White Enamel Ring Accent
  const whiteRingGeom = new THREE.CylinderGeometry(0.049, 0.049, 0.04, 16);
  const whiteRingMat = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    roughness: 0.15,
    metalness: 0.05
  });
  const whiteRingMesh = new THREE.Mesh(whiteRingGeom, whiteRingMat);
  whiteRingMesh.position.set(0, -1.07, 0);
  pencilGroup.add(whiteRingMesh);

  // Staedtler Signature Glossy Black Dip Crown Cap
  const blackCapGeom = new THREE.CylinderGeometry(0.048, 0.048, 0.22, 6);
  const blackCapMat = new THREE.MeshStandardMaterial({
    color: 0x111827,
    roughness: 0.2,
    metalness: 0.1
  });
  const blackCapMesh = new THREE.Mesh(blackCapGeom, blackCapMat);
  blackCapMesh.position.set(0, -1.20, 0);
  pencilGroup.add(blackCapMesh);

  // Crown Cap Rounded Dome End
  const capDomeGeom = new THREE.SphereGeometry(0.048, 12, 8, 0, Math.PI * 2, 0, Math.PI / 2);
  capDomeGeom.rotateX(Math.PI);
  const capDomeMesh = new THREE.Mesh(capDomeGeom, blackCapMat);
  capDomeMesh.position.set(0, -1.31, 0);
  pencilGroup.add(capDomeMesh);

  // Polished Silver Pocket Clip
  const marsSilverMat = new THREE.MeshStandardMaterial({
    color: 0xe2e8f0,
    metalness: 0.95,
    roughness: 0.15
  });

  const clipBandGeom = new THREE.CylinderGeometry(0.052, 0.052, 0.05, 16);
  const clipBandMesh = new THREE.Mesh(clipBandGeom, marsSilverMat);
  clipBandMesh.position.set(0, -1.02, 0);
  pencilGroup.add(clipBandMesh);

  const clipArmGeom = new THREE.BoxGeometry(0.016, 0.6, 0.02);
  const clipArmMesh = new THREE.Mesh(clipArmGeom, marsSilverMat);
  clipArmMesh.position.set(0, -0.74, 0.054);
  pencilGroup.add(clipArmMesh);

  // Sharpened Natural Cedar Wood Cone at +Y end
  const marsWoodConeGeom = new THREE.ConeGeometry(0.048, 0.28, 6);
  const marsWoodConeMat = new THREE.MeshStandardMaterial({
    color: 0xd4a373,
    roughness: 0.75,
    metalness: 0.0
  });
  const marsWoodConeMesh = new THREE.Mesh(marsWoodConeGeom, marsWoodConeMat);
  marsWoodConeMesh.position.set(0, 1.19, 0);
  pencilGroup.add(marsWoodConeMesh);

  // Graphite Core Tip Cone
  const marsGraphiteTipGeom = new THREE.ConeGeometry(0.016, 0.1, 8);
  const marsGraphiteMat = new THREE.MeshStandardMaterial({
    color: 0x262626,
    roughness: 0.85,
    metalness: 0.1
  });
  const marsGraphiteTipMesh = new THREE.Mesh(marsGraphiteTipGeom, marsGraphiteMat);
  marsGraphiteTipMesh.position.set(0, 1.38, 0);
  pencilGroup.add(marsGraphiteTipMesh);

  // ----------------------------------------------------
  // 9. Sticky Notes
  // ----------------------------------------------------
  const stickyNotesGroup = new THREE.Group();
  stickyNotesGroup.position.set(-4.1, 2.7, 0.05);
  stickyNotesGroup.rotation.z = 0.1;
  stickyNotesGroup.name = "stickyNotes";
  deskGroup.add(stickyNotesGroup);

  const noteTexture = createStickyNoteTexture("☑ sleep\n☑ matcha\n☐ Discover Secrets");
  const noteGeom = new THREE.PlaneGeometry(1.2, 1.2);
  const noteMat = new THREE.MeshStandardMaterial({
    map: noteTexture,
    roughness: 0.7
  });
  const noteMesh = new THREE.Mesh(noteGeom, noteMat);
  noteMesh.castShadow = true;
  stickyNotesGroup.add(noteMesh);

  // ----------------------------------------------------
  // 11. Wireless AirPods & Charging Case
  // ----------------------------------------------------
  const earbudsGroup = new THREE.Group();
  earbudsGroup.position.set(-2.6, -2.6, 0.05);
  earbudsGroup.rotation.z = -0.3;
  earbudsGroup.name = "earbuds";
  deskGroup.add(earbudsGroup);

  const softShadowTex = createSoftShadowTexture();

  // Contact / Drop Shadow Plane under AirPods
  const earbudsShadowGeom = new THREE.PlaneGeometry(2.2, 1.3);
  const earbudsShadowMat = new THREE.MeshBasicMaterial({
    map: softShadowTex,
    transparent: true,
    opacity: 0.5,
    depthWrite: false
  });
  const earbudsShadowMesh = new THREE.Mesh(earbudsShadowGeom, earbudsShadowMat);
  earbudsShadowMesh.position.set(0, 0, -0.01);
  earbudsGroup.add(earbudsShadowMesh);

  // High-gloss white plastic material for AirPods case & pods
  const airpodsMat = new THREE.MeshStandardMaterial({
    color: 0xf8fafc,
    roughness: 0.12,
    metalness: 0.05
  });

  const chromeMat = new THREE.MeshStandardMaterial({
    color: 0xe2e8f0,
    roughness: 0.15,
    metalness: 0.95
  });

  const speakerMat = new THREE.MeshStandardMaterial({
    color: 0x1e293b,
    roughness: 0.7
  });

  // --- AirPods Case ---
  const caseGroup = new THREE.Group();
  earbudsGroup.add(caseGroup);

  // Rounded AirPods Charging Case Shape
  const caseWidth = 0.8;
  const caseHeight = 0.62;
  const caseRadius = 0.16;

  const shape = new THREE.Shape();
  const x = -caseWidth / 2;
  const y = -caseHeight / 2;
  shape.moveTo(x + caseRadius, y);
  shape.lineTo(x + caseWidth - caseRadius, y);
  shape.quadraticCurveTo(x + caseWidth, y, x + caseWidth, y + caseRadius);
  shape.lineTo(x + caseWidth, y + caseHeight - caseRadius);
  shape.quadraticCurveTo(x + caseWidth, y + caseHeight, x + caseWidth - caseRadius, y + caseHeight);
  shape.lineTo(x + caseRadius, y + caseHeight);
  shape.quadraticCurveTo(x, y + caseHeight, x, y + caseHeight - caseRadius);
  shape.lineTo(x, y + caseRadius);
  shape.quadraticCurveTo(x, y, x + caseRadius, y);

  const extrudeSettings = {
    depth: 0.18,
    bevelEnabled: true,
    bevelSegments: 4,
    steps: 1,
    bevelSize: 0.04,
    bevelThickness: 0.04
  };

  const caseGeom = new THREE.ExtrudeGeometry(shape, extrudeSettings);
  caseGeom.center();
  const caseMesh = new THREE.Mesh(caseGeom, airpodsMat);
  caseMesh.castShadow = true;
  caseMesh.receiveShadow = true;
  caseGroup.add(caseMesh);

  // Case Lid Opening Seam Line
  const seamGeom = new THREE.BoxGeometry(0.82, 0.012, 0.27);
  const seamMat = new THREE.MeshBasicMaterial({ color: 0xd1d5db });
  const seamMesh = new THREE.Mesh(seamGeom, seamMat);
  seamMesh.position.set(0, 0.1, 0);
  caseGroup.add(seamMesh);

  // Back Chrome Hinge Strip
  const hingeGeom = new THREE.BoxGeometry(0.24, 0.06, 0.02);
  const hingeMesh = new THREE.Mesh(hingeGeom, chromeMat);
  hingeMesh.position.set(0, 0.1, -0.135);
  caseGroup.add(hingeMesh);

  // Front Status LED Light (Green Dot)
  const ledGeom = new THREE.SphereGeometry(0.02, 8, 8);
  const ledMat = new THREE.MeshStandardMaterial({
    color: 0x22c55e,
    emissive: 0x22c55e,
    emissiveIntensity: 0.9,
    roughness: 0.2
  });
  const ledMesh = new THREE.Mesh(ledGeom, ledMat);
  ledMesh.position.set(0, -0.06, 0.135);
  caseGroup.add(ledMesh);

  // Bottom Charger Port Accent Ring
  const portGeom = new THREE.BoxGeometry(0.1, 0.015, 0.04);
  const portMesh = new THREE.Mesh(portGeom, chromeMat);
  portMesh.position.set(0, -0.32, 0);
  caseGroup.add(portMesh);

  // --- Individual Left & Right AirPods ---
  const createAirPod = (isLeft: boolean) => {
    const podGroup = new THREE.Group();

    // Pod Earbud Ergonomic Head
    const headGeom = new THREE.SphereGeometry(0.12, 16, 16);
    headGeom.scale(1.1, 1.0, 0.85);
    const headMesh = new THREE.Mesh(headGeom, airpodsMat);
    headMesh.castShadow = true;
    podGroup.add(headMesh);

    // Black Acoustic Speaker Mesh
    const speakerGeom = new THREE.SphereGeometry(0.045, 10, 10);
    speakerGeom.scale(0.4, 1.2, 0.8);
    const speakerMesh = new THREE.Mesh(speakerGeom, speakerMat);
    speakerMesh.position.set(isLeft ? 0.07 : -0.07, 0.01, 0.05);
    podGroup.add(speakerMesh);

    // Pod Stem
    const stemGeom = new THREE.CylinderGeometry(0.032, 0.032, 0.38, 16);
    const stemMesh = new THREE.Mesh(stemGeom, airpodsMat);
    stemMesh.position.set(0, -0.19, -0.04);
    stemMesh.rotation.x = 0.18;
    stemMesh.castShadow = true;
    podGroup.add(stemMesh);

    // Bottom Chrome Contact Tip
    const chromeTipGeom = new THREE.CylinderGeometry(0.034, 0.034, 0.05, 16);
    const chromeTipMesh = new THREE.Mesh(chromeTipGeom, chromeMat);
    chromeTipMesh.position.set(0, -0.37, -0.075);
    chromeTipMesh.rotation.x = 0.18;
    podGroup.add(chromeTipMesh);

    return podGroup;
  };

  // Left AirPod lying beside case
  const leftPod = createAirPod(true);
  leftPod.position.set(-0.65, -0.05, 0.04);
  leftPod.rotation.set(0.1, 0.0, 0.35);
  earbudsGroup.add(leftPod);

  // Right AirPod lying beside case
  const rightPod = createAirPod(false);
  rightPod.position.set(0.65, -0.05, 0.04);
  rightPod.rotation.set(-0.1, 0.0, -0.35);
  earbudsGroup.add(rightPod);

  // ----------------------------------------------------
  // 11b. Crafting Scissors ✂️
  // ----------------------------------------------------
  const scissorsGroup = new THREE.Group();
  scissorsGroup.position.set(2.6, -2.6, 0.05);
  scissorsGroup.rotation.z = -0.4;
  scissorsGroup.name = "scissors";
  deskGroup.add(scissorsGroup);

  const steelMat = new THREE.MeshStandardMaterial({
    color: 0xe2e8f0,
    roughness: 0.15,
    metalness: 0.95
  });

  const handleMat = new THREE.MeshStandardMaterial({
    color: 0x1e293b, // Matte Dark Slate Studio Crafting Handle
    roughness: 0.3,
    metalness: 0.4
  });

  const screwMat = new THREE.MeshStandardMaterial({
    color: 0xd4af37,
    roughness: 0.2,
    metalness: 0.9
  });

  const extrudeBladeSettings = {
    depth: 0.016,
    bevelEnabled: true,
    bevelSegments: 2,
    steps: 1,
    bevelSize: 0.003,
    bevelThickness: 0.003
  };

  // --- Scissor Arm 1 (Left Blade + Right Handle Shank) ---
  const scissorBlade1 = new THREE.Group();
  scissorsGroup.add(scissorBlade1);

  // Tapered Metal Blade 1 (Left side, y > 0)
  const blade1Shape = new THREE.Shape();
  blade1Shape.moveTo(0, 0);
  blade1Shape.lineTo(-0.065, 0.12);
  blade1Shape.lineTo(-0.02, 1.32);
  blade1Shape.quadraticCurveTo(-0.008, 1.40, 0, 1.38);
  blade1Shape.lineTo(0.002, 0);
  blade1Shape.closePath();

  const blade1Geom = new THREE.ExtrudeGeometry(blade1Shape, extrudeBladeSettings);
  const blade1Mesh = new THREE.Mesh(blade1Geom, steelMat);
  blade1Mesh.position.set(0, 0, 0.004);
  blade1Mesh.castShadow = true;
  scissorBlade1.add(blade1Mesh);

  // Metal Shank 1 (Extends down-right into handle)
  const shank1Geom = new THREE.BoxGeometry(0.045, 0.42, 0.016);
  shank1Geom.translate(0.055, -0.20, 0.012);
  const shank1Mesh = new THREE.Mesh(shank1Geom, steelMat);
  shank1Mesh.castShadow = true;
  scissorBlade1.add(shank1Mesh);

  // Blue Ergonomic Handle Loop 1 (Right side oval loop)
  const handle1Geom = new THREE.TorusGeometry(0.20, 0.048, 16, 32);
  handle1Geom.scale(0.85, 1.3, 1);
  handle1Geom.translate(0.12, -0.46, 0.012);
  const handle1Mesh = new THREE.Mesh(handle1Geom, handleMat);
  handle1Mesh.castShadow = true;
  scissorBlade1.add(handle1Mesh);

  // --- Scissor Arm 2 (Right Blade + Left Handle Shank) ---
  const scissorBlade2 = new THREE.Group();
  scissorsGroup.add(scissorBlade2);

  // Tapered Metal Blade 2 (Right side, y > 0)
  const blade2Shape = new THREE.Shape();
  blade2Shape.moveTo(0, 0);
  blade2Shape.lineTo(0.065, 0.12);
  blade2Shape.lineTo(0.02, 1.32);
  blade2Shape.quadraticCurveTo(0.008, 1.40, 0, 1.38);
  blade2Shape.lineTo(-0.002, 0);
  blade2Shape.closePath();

  const blade2Geom = new THREE.ExtrudeGeometry(blade2Shape, extrudeBladeSettings);
  const blade2Mesh = new THREE.Mesh(blade2Geom, steelMat);
  blade2Mesh.position.set(0, 0, -0.02);
  blade2Mesh.castShadow = true;
  scissorBlade2.add(blade2Mesh);

  // Metal Shank 2 (Extends down-left into handle)
  const shank2Geom = new THREE.BoxGeometry(0.045, 0.42, 0.016);
  shank2Geom.translate(-0.055, -0.20, -0.012);
  const shank2Mesh = new THREE.Mesh(shank2Geom, steelMat);
  shank2Mesh.castShadow = true;
  scissorBlade2.add(shank2Mesh);

  // Blue Ergonomic Handle Loop 2 (Left side oval loop)
  const handle2Geom = new THREE.TorusGeometry(0.20, 0.048, 16, 32);
  handle2Geom.scale(0.85, 1.3, 1);
  handle2Geom.translate(-0.12, -0.46, -0.012);
  const handle2Mesh = new THREE.Mesh(handle2Geom, handleMat);
  handle2Mesh.castShadow = true;
  scissorBlade2.add(handle2Mesh);

  // --- Center Pivot Screw & Brass Cap ---
  const screwGeom = new THREE.CylinderGeometry(0.055, 0.055, 0.045, 24);
  screwGeom.rotateX(Math.PI / 2);
  const screwMesh = new THREE.Mesh(screwGeom, screwMat);
  screwMesh.castShadow = true;
  scissorsGroup.add(screwMesh);

  // Small Screw Slot Detail
  const slotGeom = new THREE.BoxGeometry(0.08, 0.012, 0.05);
  const slotMat = new THREE.MeshBasicMaterial({ color: 0x5a4a18 });
  const slotMesh = new THREE.Mesh(slotGeom, slotMat);
  slotMesh.position.set(0, 0, 0.005);
  scissorsGroup.add(slotMesh);

  // ----------------------------------------------------
  // 12. Lush Potted Plant (Organic Life with Multi-Layered Leaves)
  // ----------------------------------------------------
  const plantGroup = new THREE.Group();
  plantGroup.position.set(6.6, 3.6, 0.05);
  plantGroup.name = "plant";
  deskGroup.add(plantGroup);

  // Terracotta Pot Base
  const potGeom = new THREE.CylinderGeometry(0.72, 0.52, 0.9, 24);
  potGeom.rotateX(Math.PI / 2);
  const potMat = new THREE.MeshStandardMaterial({
    color: 0xc2410c,
    roughness: 0.75,
    metalness: 0.05
  });
  const potMesh = new THREE.Mesh(potGeom, potMat);
  potMesh.castShadow = true;
  potMesh.receiveShadow = true;
  plantGroup.add(potMesh);

  // Pot Rim Ring Accent
  const potRimGeom = new THREE.TorusGeometry(0.72, 0.05, 12, 24);
  potRimGeom.translate(0, 0, 0.42);
  const potRimMesh = new THREE.Mesh(potRimGeom, potMat);
  potRimMesh.castShadow = true;
  plantGroup.add(potRimMesh);

  // Dark Soil Surface
  const soilGeom = new THREE.CircleGeometry(0.68, 24);
  const soilMat = new THREE.MeshStandardMaterial({
    color: 0x2b1e16,
    roughness: 0.95
  });
  const soilMesh = new THREE.Mesh(soilGeom, soilMat);
  soilMesh.position.set(0, 0, 0.43);
  soilMesh.receiveShadow = true;
  plantGroup.add(soilMesh);

  // Leaf Materials (Gradient of mature to young leaves)
  const deepLeafMat = new THREE.MeshStandardMaterial({
    color: 0x14532d, // Deep dark green for mature bottom leaves
    roughness: 0.35,
    metalness: 0.05
  });

  const midLeafMat = new THREE.MeshStandardMaterial({
    color: 0x15803d, // Rich vibrant green for main canopy
    roughness: 0.3,
    metalness: 0.05
  });

  const freshLeafMat = new THREE.MeshStandardMaterial({
    color: 0x22c55e, // Fresh bright green for top growth
    roughness: 0.25,
    metalness: 0.05
  });

  const youngLeafMat = new THREE.MeshStandardMaterial({
    color: 0x4ade80, // Light spring green for tiny center shoots
    roughness: 0.2,
    metalness: 0.05
  });

  const stemMat = new THREE.MeshStandardMaterial({
    color: 0x166534,
    roughness: 0.5
  });

  // Base Stem Structure
  const mainStemGeom = new THREE.CylinderGeometry(0.04, 0.06, 0.8, 12);
  mainStemGeom.rotateX(Math.PI / 2);
  mainStemGeom.translate(0, 0, 0.4);
  const mainStem = new THREE.Mesh(mainStemGeom, stemMat);
  mainStem.castShadow = true;
  plantGroup.add(mainStem);

  // Leaf 3D Geometry Template with Stem Origin at (0,0,0)
  const leafShape = new THREE.Shape();
  leafShape.moveTo(0, 0);
  leafShape.quadraticCurveTo(0.2, 0.25, 0.18, 0.65);
  leafShape.quadraticCurveTo(0.08, 0.92, 0, 1.0);
  leafShape.quadraticCurveTo(-0.08, 0.92, -0.18, 0.65);
  leafShape.quadraticCurveTo(-0.2, 0.25, 0, 0);

  const leafExtrudeSettings = {
    depth: 0.012,
    bevelEnabled: true,
    bevelSegments: 2,
    steps: 1,
    bevelSize: 0.006,
    bevelThickness: 0.006
  };
  const leafBaseGeom = new THREE.ExtrudeGeometry(leafShape, leafExtrudeSettings);

  // Helper to add individual leaves with organic position, scale and tilt
  const createLeaf = (
    mat: THREE.Material,
    scaleX: number,
    scaleY: number,
    scaleZ: number,
    posX: number,
    posY: number,
    posZ: number,
    rotX: number,
    rotY: number,
    rotZ: number
  ) => {
    const leafMesh = new THREE.Mesh(leafBaseGeom, mat);
    leafMesh.scale.set(scaleX, scaleY, scaleZ);
    leafMesh.position.set(posX, posY, posZ);
    leafMesh.rotation.set(rotX, rotY, rotZ);
    leafMesh.castShadow = true;
    leafMesh.receiveShadow = true;
    plantGroup.add(leafMesh);
  };

  // Layer 1: Bottom Overhanging / Cascading Leaves (10 leaves, spreading wide and drooping)
  const layer1Count = 10;
  for (let i = 0; i < layer1Count; i++) {
    const angle = (i / layer1Count) * Math.PI * 2 + 0.1;
    const r = 0.35 + (i % 2) * 0.1;
    const px = Math.cos(angle) * r;
    const py = Math.sin(angle) * r;
    const pz = 0.45 + (i % 3) * 0.04;
    // Tilt outward and slightly down over pot rim
    const rx = Math.PI / 2.8 + (Math.sin(i * 1.5)) * 0.1;
    const ry = (Math.cos(i * 2.1)) * 0.15;
    const rz = angle - Math.PI / 2;
    const s = 0.65 + (i % 3) * 0.08;
    createLeaf(deepLeafMat, s, s * 0.85, s, px, py, pz, rx, ry, rz);
  }

  // Layer 2: Main Middle Canopy (12 leaves, full foliage ring)
  const layer2Count = 12;
  for (let i = 0; i < layer2Count; i++) {
    const angle = (i / layer2Count) * Math.PI * 2 + 0.25;
    const r = 0.22 + (i % 3) * 0.08;
    const px = Math.cos(angle) * r;
    const py = Math.sin(angle) * r;
    const pz = 0.65 + (i % 4) * 0.05;
    // Upward angle (45 degrees tilt outward)
    const rx = Math.PI / 4 + (Math.sin(i * 2.3)) * 0.12;
    const ry = (Math.cos(i * 1.7)) * 0.15;
    const rz = angle - Math.PI / 2;
    const s = 0.6 + (i % 3) * 0.07;
    createLeaf(midLeafMat, s, s * 0.8, s, px, py, pz, rx, ry, rz);
  }

  // Layer 3: Upper Canopy (8 leaves, fresh growth reaching up)
  const layer3Count = 8;
  for (let i = 0; i < layer3Count; i++) {
    const angle = (i / layer3Count) * Math.PI * 2 + 0.4;
    const r = 0.12 + (i % 2) * 0.06;
    const px = Math.cos(angle) * r;
    const py = Math.sin(angle) * r;
    const pz = 0.88 + (i % 3) * 0.06;
    const rx = Math.PI / 6 + (Math.sin(i * 1.8)) * 0.1;
    const ry = (Math.cos(i * 2.5)) * 0.12;
    const rz = angle - Math.PI / 2;
    const s = 0.48 + (i % 2) * 0.06;
    createLeaf(freshLeafMat, s, s * 0.75, s, px, py, pz, rx, ry, rz);
  }

  // Layer 4: Center Sprouts (4 tender young shoots at top)
  const layer4Count = 4;
  for (let i = 0; i < layer4Count; i++) {
    const angle = (i / layer4Count) * Math.PI * 2;
    const px = Math.cos(angle) * 0.05;
    const py = Math.sin(angle) * 0.05;
    const pz = 1.08 + i * 0.04;
    const rx = Math.PI / 10;
    const ry = 0;
    const rz = angle - Math.PI / 2;
    const s = 0.35;
    createLeaf(youngLeafMat, s, s * 0.7, s, px, py, pz, rx, ry, rz);
  }

  // ----------------------------------------------------
  // 12b. Cozy Nordic Brass Desk Lamp 💡
  // ----------------------------------------------------
  const lampGroup = new THREE.Group();
  lampGroup.position.set(-5.6, 3.3, 0.05);
  lampGroup.name = "deskLamp";
  deskGroup.add(lampGroup);

  const brassMat = new THREE.MeshStandardMaterial({
    color: 0xd4af37,
    roughness: 0.35,
    metalness: 0.85
  });

  const shadeMat = new THREE.MeshStandardMaterial({
    color: 0x26201b,
    roughness: 0.5,
    metalness: 0.4
  });

  // Lamp Base Plate
  const lampBaseGeom = new THREE.CylinderGeometry(0.5, 0.55, 0.1, 24);
  lampBaseGeom.rotateX(Math.PI / 2);
  const lampBaseMesh = new THREE.Mesh(lampBaseGeom, brassMat);
  lampBaseMesh.castShadow = true;
  lampGroup.add(lampBaseMesh);

  // Lamp Stem / Arm
  const lampArmGeom = new THREE.CylinderGeometry(0.04, 0.04, 1.8, 16);
  lampArmGeom.rotateX(Math.PI / 2.5);
  const lampArmMesh = new THREE.Mesh(lampArmGeom, brassMat);
  lampArmMesh.position.set(0.2, -0.4, 0.8);
  lampArmMesh.castShadow = true;
  lampGroup.add(lampArmMesh);

  // Lamp Shade Dome
  const shadeGeom = new THREE.ConeGeometry(0.65, 0.8, 24, 1, true);
  shadeGeom.rotateX(Math.PI / 3);
  const shadeMesh = new THREE.Mesh(shadeGeom, shadeMat);
  shadeMesh.position.set(0.4, -0.8, 1.3);
  shadeMesh.castShadow = true;
  lampGroup.add(shadeMesh);

  // Warm Glow Bulb inside Lamp Shade
  const bulbGeom = new THREE.SphereGeometry(0.12, 16, 16);
  const bulbMat = new THREE.MeshStandardMaterial({
    color: 0xffedd5,
    emissive: 0xffb74d,
    emissiveIntensity: 1.5,
    roughness: 0.1
  });
  const bulbMesh = new THREE.Mesh(bulbGeom, bulbMat);
  bulbMesh.position.set(0.4, -0.8, 1.25);
  lampGroup.add(bulbMesh);

  // ----------------------------------------------------
  // 12c. Rubik's Cube 🎲
  // ----------------------------------------------------
  const rubiksCubeGroup = new THREE.Group();
  // Position: between scissors and phone, slightly above desk
  rubiksCubeGroup.position.set(-5.4, -2.8, 0.38);
  // Casual tilt — like it was just put down
  rubiksCubeGroup.rotation.set(0.22, 0.0, 0.55);
  rubiksCubeGroup.name = "rubiksCube";
  deskGroup.add(rubiksCubeGroup);

  // Face colours: White, Yellow, Red, Orange, Blue, Green
  const faceColors = [
    0xffffff, // White  (+Z face)
    0xffd500, // Yellow (-Z face)
    0xc41e3a, // Red    (+X face)
    0xff5800, // Orange (-X face)
    0x0051a2, // Blue   (+Y face)
    0x009b48  // Green  (-Y face)
  ];

  // Build sticker materials (coloured face + black body)
  const blackBodyMat = new THREE.MeshStandardMaterial({
    color: 0x111111,
    roughness: 0.35,
    metalness: 0.05
  });

  const cubeletSize = 0.27;
  const gap = 0.01; // small gap between cubelets
  const step = cubeletSize + gap;

  for (let xi = 0; xi < 3; xi++) {
    for (let yi = 0; yi < 3; yi++) {
      for (let zi = 0; zi < 3; zi++) {
        const cx = (xi - 1) * step;
        const cy = (yi - 1) * step;
        const cz = (zi - 1) * step;

        // Build per-cubelet material array (6 faces: +X,-X,+Y,-Y,+Z,-Z)
        const mats: THREE.Material[] = [];

        // +X (right) face — Red only on xi===2
        mats.push(xi === 2
          ? new THREE.MeshStandardMaterial({ color: faceColors[2], roughness: 0.25, metalness: 0.05 })
          : blackBodyMat);
        // -X (left) face — Orange only on xi===0
        mats.push(xi === 0
          ? new THREE.MeshStandardMaterial({ color: faceColors[3], roughness: 0.25, metalness: 0.05 })
          : blackBodyMat);
        // +Y (top) face — Blue only on yi===2
        mats.push(yi === 2
          ? new THREE.MeshStandardMaterial({ color: faceColors[4], roughness: 0.25, metalness: 0.05 })
          : blackBodyMat);
        // -Y (bottom) face — Green only on yi===0
        mats.push(yi === 0
          ? new THREE.MeshStandardMaterial({ color: faceColors[5], roughness: 0.25, metalness: 0.05 })
          : blackBodyMat);
        // +Z (front) face — White only on zi===2
        mats.push(zi === 2
          ? new THREE.MeshStandardMaterial({ color: faceColors[0], roughness: 0.25, metalness: 0.05 })
          : blackBodyMat);
        // -Z (back) face — Yellow only on zi===0
        mats.push(zi === 0
          ? new THREE.MeshStandardMaterial({ color: faceColors[1], roughness: 0.25, metalness: 0.05 })
          : blackBodyMat);

        const cubeletGeom = new THREE.BoxGeometry(cubeletSize, cubeletSize, cubeletSize);
        const cubelet = new THREE.Mesh(cubeletGeom, mats);
        cubelet.position.set(cx, cy, cz);
        cubelet.castShadow = true;
        cubelet.receiveShadow = true;
        rubiksCubeGroup.add(cubelet);
      }
    }
  }

  // ----------------------------------------------------
  // 12d. Picture Frame (above the MacBook)
  // ----------------------------------------------------
  const pictureFrameGroup = new THREE.Group();
  // Centered above the MacBook — MacBook is at (0, 0.2). Y=3.45 places
  // the frame in the upper-centre of the desk, clearly above the laptop.
  pictureFrameGroup.position.set(0.0, 3.45, 0.04);
  pictureFrameGroup.rotation.z = 0.04; // very slight casual tilt
  pictureFrameGroup.name = "pictureFrame";
  deskGroup.add(pictureFrameGroup);

  // Contact / Drop Shadow Plane under Picture Frame
  const frameShadowGeom = new THREE.PlaneGeometry(2.8, 2.2);
  const frameShadowMat = new THREE.MeshBasicMaterial({
    map: softShadowTex,
    transparent: true,
    opacity: 0.5,
    depthWrite: false
  });
  const frameShadowMesh = new THREE.Mesh(frameShadowGeom, frameShadowMat);
  frameShadowMesh.position.set(0, 0, -0.01);
  pictureFrameGroup.add(frameShadowMesh);

  // Frame dimensions
  const fW = 2.1;  // outer frame width
  const fH = 1.65; // outer frame height
  const fBorder = 0.14; // frame border thickness
  const fDepth = 0.055; // frame extrusion depth

  // Walnut wood frame material (warm, slightly polished)
  const frameMat = new THREE.MeshStandardMaterial({
    color: 0x4a2c0f,
    roughness: 0.45,
    metalness: 0.12
  });

  // Build the 4 border planks of the frame
  // Top plank
  const topPlankGeom = new THREE.BoxGeometry(fW, fBorder, fDepth);
  const topPlank = new THREE.Mesh(topPlankGeom, frameMat);
  topPlank.position.set(0, fH / 2 - fBorder / 2, 0);
  topPlank.castShadow = true;
  pictureFrameGroup.add(topPlank);

  // Bottom plank
  const botPlank = new THREE.Mesh(topPlankGeom, frameMat);
  botPlank.position.set(0, -(fH / 2 - fBorder / 2), 0);
  botPlank.castShadow = true;
  pictureFrameGroup.add(botPlank);

  // Left plank
  const sidePlankGeom = new THREE.BoxGeometry(fBorder, fH - fBorder * 2, fDepth);
  const leftPlank = new THREE.Mesh(sidePlankGeom, frameMat);
  leftPlank.position.set(-(fW / 2 - fBorder / 2), 0, 0);
  leftPlank.castShadow = true;
  pictureFrameGroup.add(leftPlank);

  // Right plank
  const rightPlank = new THREE.Mesh(sidePlankGeom, frameMat);
  rightPlank.position.set(fW / 2 - fBorder / 2, 0, 0);
  rightPlank.castShadow = true;
  pictureFrameGroup.add(rightPlank);

  // Thin inner lip / rebate edge (darker strip inside frame)
  const rebateMat = new THREE.MeshStandardMaterial({
    color: 0x2a1508,
    roughness: 0.7,
    metalness: 0.05
  });
  const innerW = fW - fBorder * 2;
  const innerH = fH - fBorder * 2;
  const rebateGeom = new THREE.BoxGeometry(innerW + 0.04, innerH + 0.04, 0.01);
  const rebateMesh = new THREE.Mesh(rebateGeom, rebateMat);
  rebateMesh.position.set(0, 0, -fDepth / 2 + 0.005);
  pictureFrameGroup.add(rebateMesh);

  // Photo / image surface (sits inside the frame)
  const photoTexture = createPictureFramePhotoTexture();
  const photoGeom = new THREE.PlaneGeometry(innerW, innerH);
  const photoMat = new THREE.MeshStandardMaterial({
    map: photoTexture,
    roughness: 0.35,
    metalness: 0.05
  });
  const photoMesh = new THREE.Mesh(photoGeom, photoMat);
  photoMesh.position.set(0, 0, fDepth * 0.02);
  pictureFrameGroup.add(photoMesh);

  // Very thin glass pane on top (subtle glossy refraction look)
  const glassMat = new THREE.MeshStandardMaterial({
    color: 0xd4eeff,
    roughness: 0.0,
    metalness: 0.1,
    transparent: true,
    opacity: 0.08
  });
  const glassGeom = new THREE.PlaneGeometry(innerW, innerH);
  const glassMesh = new THREE.Mesh(glassGeom, glassMat);
  glassMesh.position.set(0, 0, fDepth * 0.5 + 0.001);
  pictureFrameGroup.add(glassMesh);

  // Slim brass corner accents at each corner
  const cornerMat = new THREE.MeshStandardMaterial({
    color: 0xc8a96e,
    roughness: 0.25,
    metalness: 0.9
  });
  const cornerSize = 0.1;
  const cornerGeom = new THREE.BoxGeometry(cornerSize, cornerSize, fDepth + 0.01);
  const cornerOffX = fW / 2 - fBorder / 2;
  const cornerOffY = fH / 2 - fBorder / 2;
  [
    [cornerOffX, cornerOffY],
    [-cornerOffX, cornerOffY],
    [cornerOffX, -cornerOffY],
    [-cornerOffX, -cornerOffY]
  ].forEach(([cx, cy]) => {
    const cm = new THREE.Mesh(cornerGeom, cornerMat);
    cm.position.set(cx, cy, 0);
    cm.castShadow = true;
    pictureFrameGroup.add(cm);
  });

  // --- 2 Photobooth Photostrips on the right side of the picture frame ---
  const stripTex1 = createPhotostripTexture1();
  const stripTex2 = createPhotostripTexture2();

  const stripWidth = 0.44;
  const stripHeight = 1.60;
  const stripDepth = 0.004;
  const stripGeom = new THREE.BoxGeometry(stripWidth, stripHeight, stripDepth);

  const stripMat1 = new THREE.MeshStandardMaterial({
    map: stripTex1,
    roughness: 0.35,
    metalness: 0.05
  });

  const stripMat2 = new THREE.MeshStandardMaterial({
    map: stripTex2,
    roughness: 0.35,
    metalness: 0.05
  });

  // Photostrip 1 (Vibrant Golden Hour Strip, right next to frame)
  const stripMesh1 = new THREE.Mesh(stripGeom, stripMat1);
  stripMesh1.position.set(1.36, -0.06, 0.005);
  stripMesh1.rotation.z = -0.14;
  stripMesh1.castShadow = true;
  stripMesh1.receiveShadow = true;
  pictureFrameGroup.add(stripMesh1);

  // Photostrip 2 (Vintage Monochrome Strip, cascading further right)
  const stripMesh2 = new THREE.Mesh(stripGeom, stripMat2);
  stripMesh2.position.set(1.78, -0.20, 0.01);
  stripMesh2.rotation.z = 0.10;
  stripMesh2.castShadow = true;
  stripMesh2.receiveShadow = true;
  pictureFrameGroup.add(stripMesh2);

  // Translucent Kraft Washi Tape 1 holding Strip 1
  const tapeMat1 = new THREE.MeshStandardMaterial({
    color: 0xfef3c7, // Warm kraft parchment
    roughness: 0.6,
    transparent: true,
    opacity: 0.85
  });
  const tapeGeom = new THREE.BoxGeometry(0.24, 0.07, 0.006);
  const tapeMesh1 = new THREE.Mesh(tapeGeom, tapeMat1);
  tapeMesh1.position.set(1.34, 0.70, 0.012);
  tapeMesh1.rotation.z = -0.08;
  pictureFrameGroup.add(tapeMesh1);

  // Translucent Soft Linen Washi Tape 2 holding Strip 2
  const tapeMat2 = new THREE.MeshStandardMaterial({
    color: 0xe7e5e4, // Soft warm linen
    roughness: 0.6,
    transparent: true,
    opacity: 0.85
  });
  const tapeMesh2 = new THREE.Mesh(tapeGeom, tapeMat2);
  tapeMesh2.position.set(1.80, 0.56, 0.016);
  tapeMesh2.rotation.z = 0.04;
  pictureFrameGroup.add(tapeMesh2);

  // ----------------------------------------------------
  // 12e. White Chess Pieces (White Horse & Queen, Right Side of Laptop) ♟️
  // ----------------------------------------------------
  const chessGroup = new THREE.Group();
  // Placed further right on the desk mat (laptop right edge is at X=1.8)
  chessGroup.position.set(3.3, 0.25, 0.05);
  chessGroup.rotation.z = -0.15;
  chessGroup.name = "chess";
  deskGroup.add(chessGroup);

  // Contact / Drop Shadow Plane under Chess Pieces
  const chessShadowGeom = new THREE.PlaneGeometry(2.0, 1.5);
  const chessShadowMat = new THREE.MeshBasicMaterial({
    map: softShadowTex,
    transparent: true,
    opacity: 0.5,
    depthWrite: false
  });
  const chessShadowMesh = new THREE.Mesh(chessShadowGeom, chessShadowMat);
  chessShadowMesh.position.set(0, 0, -0.01);
  chessGroup.add(chessShadowMesh);

  // Smooth polished ivory / white ceramic material
  const whiteChessMat = new THREE.MeshStandardMaterial({
    color: 0xfaf8f5,
    roughness: 0.22,
    metalness: 0.08
  });

  const feltBaseMat = new THREE.MeshStandardMaterial({
    color: 0x1e293b,
    roughness: 0.9
  });

  // --- 1. White Pawn Piece (Lying Down, Smaller & Flipped Vertically) ---
  const pawnGroup = new THREE.Group();
  pawnGroup.position.set(-0.25, 0.15, 0.16);
  pawnGroup.rotation.set(-Math.PI / 2, -0.1, -2.69); // Flipped vertically 180 degrees lying flat on desk
  pawnGroup.scale.set(0.85, 0.85, 0.85); // Smaller proportion relative to Queen
  pawnGroup.name = "pawn";
  chessGroup.add(pawnGroup);

  // 1a. Pedestal Base Disc
  const pawnBaseGeom = new THREE.CylinderGeometry(0.24, 0.27, 0.12, 32);
  pawnBaseGeom.rotateX(Math.PI / 2);
  pawnBaseGeom.translate(0, 0, 0.06);
  const pawnBase = new THREE.Mesh(pawnBaseGeom, whiteChessMat);
  pawnBase.castShadow = true;
  pawnBase.receiveShadow = true;
  pawnGroup.add(pawnBase);

  // Underside Felt Pad
  const pawnFeltGeom = new THREE.CircleGeometry(0.26, 32);
  const pawnFelt = new THREE.Mesh(pawnFeltGeom, feltBaseMat);
  pawnFelt.position.set(0, 0, 0.001);
  pawnGroup.add(pawnFelt);

  // Base Molded Ring Accent
  const pawnBaseRingGeom = new THREE.TorusGeometry(0.24, 0.028, 16, 32);
  pawnBaseRingGeom.translate(0, 0, 0.12);
  const pawnBaseRing = new THREE.Mesh(pawnBaseRingGeom, whiteChessMat);
  pawnBaseRing.castShadow = true;
  pawnGroup.add(pawnBaseRing);

  // 1b. Tapered Waist Body
  const pawnWaistGeom = new THREE.CylinderGeometry(0.11, 0.22, 0.36, 32);
  pawnWaistGeom.rotateX(Math.PI / 2);
  pawnWaistGeom.translate(0, 0, 0.30);
  const pawnWaist = new THREE.Mesh(pawnWaistGeom, whiteChessMat);
  pawnWaist.castShadow = true;
  pawnWaist.receiveShadow = true;
  pawnGroup.add(pawnWaist);

  // 1c. Lower Collar Ring Disc
  const pawnCollarRing1Geom = new THREE.TorusGeometry(0.14, 0.02, 16, 32);
  pawnCollarRing1Geom.translate(0, 0, 0.48);
  const pawnCollarRing1 = new THREE.Mesh(pawnCollarRing1Geom, whiteChessMat);
  pawnCollarRing1.castShadow = true;
  pawnGroup.add(pawnCollarRing1);

  // Upper Neck Disc
  const pawnNeckDiscGeom = new THREE.CylinderGeometry(0.13, 0.13, 0.04, 32);
  pawnNeckDiscGeom.rotateX(Math.PI / 2);
  pawnNeckDiscGeom.translate(0, 0, 0.50);
  const pawnNeckDisc = new THREE.Mesh(pawnNeckDiscGeom, whiteChessMat);
  pawnNeckDisc.castShadow = true;
  pawnGroup.add(pawnNeckDisc);

  // 1d. Spherical Head Orb
  const pawnHeadGeom = new THREE.SphereGeometry(0.17, 24, 24);
  const pawnHead = new THREE.Mesh(pawnHeadGeom, whiteChessMat);
  pawnHead.position.set(0, 0, 0.65);
  pawnHead.castShadow = true;
  pawnHead.receiveShadow = true;
  pawnGroup.add(pawnHead);

  // --- 2. White Queen Piece (Lying Down, Elongated Height) ---
  const queenGroup = new THREE.Group();
  queenGroup.position.set(0.42, -0.20, 0.30);
  queenGroup.rotation.set(-Math.PI / 2, -0.15, -0.65); // Tilted flat on its side lying on the desk
  queenGroup.scale.set(1.2, 1.2, 1.45); // Made longer in height & slightly larger overall
  queenGroup.name = "queen";
  chessGroup.add(queenGroup);

  // Queen Base Disc
  const queenBaseGeom = new THREE.CylinderGeometry(0.26, 0.28, 0.10, 24);
  queenBaseGeom.rotateX(Math.PI / 2);
  queenBaseGeom.translate(0, 0, 0.05);
  const queenBase = new THREE.Mesh(queenBaseGeom, whiteChessMat);
  queenBase.castShadow = true;
  queenBase.receiveShadow = true;
  queenGroup.add(queenBase);

  // Queen Underside Felt Pad
  const queenFeltGeom = new THREE.CircleGeometry(0.27, 24);
  const queenFelt = new THREE.Mesh(queenFeltGeom, feltBaseMat);
  queenFelt.position.set(0, 0, 0.001);
  queenGroup.add(queenFelt);

  // Queen Base Ring Accent
  const queenRingGeom = new THREE.TorusGeometry(0.25, 0.025, 12, 24);
  queenRingGeom.translate(0, 0, 0.1);
  const queenRing = new THREE.Mesh(queenRingGeom, whiteChessMat);
  queenRing.castShadow = true;
  queenGroup.add(queenRing);

  // Queen Tapered Body Waist
  const queenWaistGeom = new THREE.CylinderGeometry(0.12, 0.24, 0.35, 24);
  queenWaistGeom.rotateX(Math.PI / 2);
  queenWaistGeom.translate(0, 0, 0.27);
  const queenWaist = new THREE.Mesh(queenWaistGeom, whiteChessMat);
  queenWaist.castShadow = true;
  queenWaist.receiveShadow = true;
  queenGroup.add(queenWaist);

  // Mid Body Ring Accent
  const queenMidRingGeom = new THREE.TorusGeometry(0.13, 0.02, 12, 24);
  queenMidRingGeom.translate(0, 0, 0.44);
  const queenMidRing = new THREE.Mesh(queenMidRingGeom, whiteChessMat);
  queenMidRing.castShadow = true;
  queenGroup.add(queenMidRing);

  // Queen Upper Flare Cup
  const queenCupGeom = new THREE.CylinderGeometry(0.22, 0.12, 0.26, 24);
  queenCupGeom.rotateX(Math.PI / 2);
  queenCupGeom.translate(0, 0, 0.57);
  const queenCup = new THREE.Mesh(queenCupGeom, whiteChessMat);
  queenCup.castShadow = true;
  queenCup.receiveShadow = true;
  queenGroup.add(queenCup);

  // Crown Rim Ring
  const crownRimGeom = new THREE.TorusGeometry(0.21, 0.025, 12, 24);
  crownRimGeom.translate(0, 0, 0.70);
  const crownRim = new THREE.Mesh(crownRimGeom, whiteChessMat);
  crownRim.castShadow = true;
  queenGroup.add(crownRim);

  // Crown Coronet Points (8 small spheres around top crown rim)
  const coronetPointCount = 8;
  const coronetRadius = 0.21;
  const pointGeom = new THREE.SphereGeometry(0.035, 12, 12);
  for (let i = 0; i < coronetPointCount; i++) {
    const angle = (i / coronetPointCount) * Math.PI * 2;
    const px = Math.cos(angle) * coronetRadius;
    const py = Math.sin(angle) * coronetRadius;
    const pointMesh = new THREE.Mesh(pointGeom, whiteChessMat);
    pointMesh.position.set(px, py, 0.72);
    pointMesh.castShadow = true;
    queenGroup.add(pointMesh);
  }

  // Top Center Finial Neck Disc & Orb
  const finialNeckGeom = new THREE.CylinderGeometry(0.05, 0.05, 0.05, 16);
  finialNeckGeom.rotateX(Math.PI / 2);
  finialNeckGeom.translate(0, 0, 0.73);
  const finialNeck = new THREE.Mesh(finialNeckGeom, whiteChessMat);
  queenGroup.add(finialNeck);

  const topOrbGeom = new THREE.SphereGeometry(0.065, 16, 16);
  const topOrb = new THREE.Mesh(topOrbGeom, whiteChessMat);
  topOrb.position.set(0, 0, 0.78);
  topOrb.castShadow = true;
  queenGroup.add(topOrb);

  // ----------------------------------------------------
  // 12f. Vintage Brass World Globe 🌍
  // ----------------------------------------------------
  const globeGroup = new THREE.Group();
  // Placed in upper area between sticky notes and picture frame
  globeGroup.position.set(-2.3, 3.3, 0.05);
  globeGroup.rotation.z = -0.1;
  globeGroup.name = "globe";
  deskGroup.add(globeGroup);

  // 1. Polished Walnut / Brass Pedestal Base
  const globeBaseGeom = new THREE.CylinderGeometry(0.48, 0.55, 0.12, 32);
  globeBaseGeom.rotateX(Math.PI / 2);
  const globeBrassMat = new THREE.MeshStandardMaterial({
    color: 0xd4af37,
    roughness: 0.28,
    metalness: 0.88
  });
  const darkWoodMat = new THREE.MeshStandardMaterial({
    color: 0x3d2314,
    roughness: 0.45,
    metalness: 0.1
  });
  const globeBaseMesh = new THREE.Mesh(globeBaseGeom, darkWoodMat);
  globeBaseMesh.castShadow = true;
  globeBaseMesh.receiveShadow = true;
  globeGroup.add(globeBaseMesh);

  // Brass Trim Ring on Base
  const baseRingGeom = new THREE.TorusGeometry(0.48, 0.03, 12, 32);
  baseRingGeom.translate(0, 0, 0.06);
  const baseRingMesh = new THREE.Mesh(baseRingGeom, globeBrassMat);
  baseRingMesh.castShadow = true;
  globeGroup.add(baseRingMesh);

  // 2. Brass Vertical Support Spindle / Stem
  const stemGeom = new THREE.CylinderGeometry(0.05, 0.07, 0.42, 16);
  stemGeom.rotateX(Math.PI / 2);
  stemGeom.translate(0, 0, 0.27);
  const stemMesh = new THREE.Mesh(stemGeom, globeBrassMat);
  stemMesh.castShadow = true;
  globeGroup.add(stemMesh);

  // 3. Brass Semi-Circular Meridian Arch Ring (Holds the globe axis at poles)
  const meridianRadius = 0.82;
  const meridianGeom = new THREE.TorusGeometry(meridianRadius, 0.035, 16, 48, Math.PI * 1.5);
  meridianGeom.rotateY(Math.PI / 2);
  meridianGeom.rotateZ(Math.PI / 8); // Tilted at Earth axial angle ~23.5 deg
  meridianGeom.translate(0, 0, 1.10);
  const meridianMesh = new THREE.Mesh(meridianGeom, globeBrassMat);
  meridianMesh.castShadow = true;
  globeGroup.add(meridianMesh);

  // 4. North & South Pole Brass Finial Pins
  const pinGeom = new THREE.SphereGeometry(0.055, 16, 16);
  const topPin = new THREE.Mesh(pinGeom, globeBrassMat);
  topPin.position.set(-0.31, 0.75, 1.84);
  globeGroup.add(topPin);

  const botPin = new THREE.Mesh(pinGeom, globeBrassMat);
  botPin.position.set(0.31, -0.75, 0.36);
  globeGroup.add(botPin);

  // 5. Rotating Globe Sphere Assembly (Tilted at 23.5° axial tilt)
  const globeTiltGroup = new THREE.Group();
  globeTiltGroup.position.set(0, 0, 1.10);
  globeTiltGroup.rotation.z = -0.41; // ~23.5 degrees Earth axial tilt
  globeTiltGroup.rotation.x = Math.PI / 3.2; // Tilt upward slightly for 3D visibility in orthographic camera
  globeGroup.add(globeTiltGroup);

  // Map Texture & Sphere Geometry
  const globeTexture = createGlobeTexture();
  const globeSphereGeom = new THREE.SphereGeometry(0.68, 64, 64);
  const globeSphereMat = new THREE.MeshStandardMaterial({
    map: globeTexture,
    roughness: 0.35,
    metalness: 0.1
  });
  const globeSphere = new THREE.Mesh(globeSphereGeom, globeSphereMat);
  globeSphere.castShadow = true;
  globeSphere.receiveShadow = true;
  globeSphere.name = "globeSphere";
  globeTiltGroup.add(globeSphere);

  // Subtle Atmosphere / Glossy Glass Overlay Sphere
  const atmosphereGeom = new THREE.SphereGeometry(0.69, 32, 32);
  const atmosphereMat = new THREE.MeshStandardMaterial({
    color: 0x38bdf8,
    roughness: 0.05,
    metalness: 0.1,
    transparent: true,
    opacity: 0.12
  });
  const atmosphereMesh = new THREE.Mesh(atmosphereGeom, atmosphereMat);
  globeTiltGroup.add(atmosphereMesh);

  // ----------------------------------------------------
  // 12g. Cozy Sleeping Orange Tabby Cat (Below Laptop) 🐱
  // ----------------------------------------------------
  const catGroup = new THREE.Group();
  // Positioned directly below the MacBook trackpad on the desk mat
  catGroup.position.set(0.0, -2.15, 0.05);
  catGroup.rotation.z = -0.15; // Cozy natural angled curl
  catGroup.name = "cat";
  deskGroup.add(catGroup);

  // Fur & Detail Materials
  const orangeFurMat = new THREE.MeshStandardMaterial({
    color: 0xea580c, // Rich cozy ginger orange
    roughness: 0.75,
    metalness: 0.05
  });

  const darkStripeMat = new THREE.MeshStandardMaterial({
    color: 0x9a3412, // Cinnamon dark tabby stripes
    roughness: 0.75,
    metalness: 0.05
  });

  const creamFurMat = new THREE.MeshStandardMaterial({
    color: 0xffedd5, // Soft warm cream fur for belly, snout & paws
    roughness: 0.7,
    metalness: 0.02
  });

  const pinkDetailMat = new THREE.MeshStandardMaterial({
    color: 0xf472b6, // Soft pink for inner ears & nose
    roughness: 0.4,
    metalness: 0.0
  });

  const eyeMat = new THREE.MeshStandardMaterial({
    color: 0x18181b, // Dark charcoal sleeping eye arcs
    roughness: 0.2
  });

  const collarMat = new THREE.MeshStandardMaterial({
    color: 0xb45309, // Warm cognac leather collar
    roughness: 0.5,
    metalness: 0.1
  });

  const bellMat = new THREE.MeshStandardMaterial({
    color: 0xfbbf24, // Polished golden bell
    roughness: 0.2,
    metalness: 0.85
  });

  const whiskerMat = new THREE.MeshStandardMaterial({
    color: 0xf8fafc,
    roughness: 0.3,
    transparent: true,
    opacity: 0.85
  });

  // 1. Cat Loaf Body (Smooth oblong sleeping pose)
  const catBodyGeom = new THREE.SphereGeometry(0.55, 32, 32);
  catBodyGeom.scale(1.25, 0.82, 0.65);
  const catBodyMesh = new THREE.Mesh(catBodyGeom, orangeFurMat);
  catBodyMesh.position.set(0, 0, 0.32);
  catBodyMesh.castShadow = true;
  catBodyMesh.receiveShadow = true;
  catGroup.add(catBodyMesh);

  // Soft Cream Chest Patch
  const chestGeom = new THREE.SphereGeometry(0.38, 24, 24);
  chestGeom.scale(0.85, 0.65, 0.5);
  const chestMesh = new THREE.Mesh(chestGeom, creamFurMat);
  chestMesh.position.set(-0.15, -0.22, 0.28);
  chestMesh.castShadow = true;
  catGroup.add(chestMesh);

  // Tabby Back Stripes (3 subtle decorative stripe arches)
  const stripeGeom = new THREE.TorusGeometry(0.42, 0.035, 12, 24, Math.PI * 0.7);
  stripeGeom.rotateY(Math.PI / 2);

  const stripe1 = new THREE.Mesh(stripeGeom, darkStripeMat);
  stripe1.position.set(-0.25, 0.08, 0.48);
  stripe1.rotation.z = 0.2;
  catGroup.add(stripe1);

  const stripe2 = new THREE.Mesh(stripeGeom, darkStripeMat);
  stripe2.position.set(0.0, 0.12, 0.52);
  stripe2.rotation.z = 0.1;
  catGroup.add(stripe2);

  const stripe3 = new THREE.Mesh(stripeGeom, darkStripeMat);
  stripe3.position.set(0.25, 0.08, 0.48);
  stripe3.rotation.z = -0.05;
  catGroup.add(stripe3);

  // 2. Head Group (Tilted comfortably on front left of body)
  const catHeadGroup = new THREE.Group();
  catHeadGroup.position.set(-0.48, -0.22, 0.46);
  catHeadGroup.rotation.set(0.1, -0.15, -0.3);
  catGroup.add(catHeadGroup);

  // Head Main Orb
  const catHeadGeom = new THREE.SphereGeometry(0.36, 32, 32);
  catHeadGeom.scale(1.05, 0.92, 0.88);
  const catHeadMesh = new THREE.Mesh(catHeadGeom, orangeFurMat);
  catHeadMesh.castShadow = true;
  catHeadMesh.receiveShadow = true;
  catHeadGroup.add(catHeadMesh);

  // Muzzle / Snout (Soft cream pouch)
  const muzzleGeom = new THREE.SphereGeometry(0.17, 24, 24);
  muzzleGeom.scale(1.2, 0.8, 0.7);
  const muzzleMesh = new THREE.Mesh(muzzleGeom, creamFurMat);
  muzzleMesh.position.set(0, -0.22, -0.06);
  muzzleMesh.castShadow = true;
  catHeadGroup.add(muzzleMesh);

  // Pink Heart-Shaped Nose
  const noseGeom = new THREE.SphereGeometry(0.042, 16, 16);
  noseGeom.scale(1.2, 0.9, 0.8);
  const noseMesh = new THREE.Mesh(noseGeom, pinkDetailMat);
  noseMesh.position.set(0, -0.32, 0.01);
  catHeadGroup.add(noseMesh);

  // Closed Happy Sleeping Eye Arcs (^ ^)
  const eyeArcGeom = new THREE.TorusGeometry(0.06, 0.012, 8, 16, Math.PI);
  eyeArcGeom.rotateX(Math.PI / 2.2);

  const leftEyeMesh = new THREE.Mesh(eyeArcGeom, eyeMat);
  leftEyeMesh.position.set(-0.13, -0.22, 0.1);
  catHeadGroup.add(leftEyeMesh);

  const rightEyeMesh = new THREE.Mesh(eyeArcGeom, eyeMat);
  rightEyeMesh.position.set(0.13, -0.22, 0.1);
  catHeadGroup.add(rightEyeMesh);

  // Pointed Cat Ears (Outer Orange Cone + Inner Pink Patch)
  const earOuterGeom = new THREE.ConeGeometry(0.13, 0.28, 16);
  earOuterGeom.rotateX(Math.PI / 10);

  const earInnerGeom = new THREE.ConeGeometry(0.09, 0.22, 16);
  earInnerGeom.rotateX(Math.PI / 10);

  // Left Ear
  const leftEarOuter = new THREE.Mesh(earOuterGeom, orangeFurMat);
  leftEarOuter.position.set(-0.2, 0.08, 0.32);
  leftEarOuter.rotation.set(0.1, 0.1, 0.35);
  leftEarOuter.castShadow = true;
  catHeadGroup.add(leftEarOuter);

  const leftEarInner = new THREE.Mesh(earInnerGeom, pinkDetailMat);
  leftEarInner.position.set(-0.2, 0.06, 0.33);
  leftEarInner.rotation.set(0.1, 0.1, 0.35);
  catHeadGroup.add(leftEarInner);

  // Right Ear
  const rightEarOuter = new THREE.Mesh(earOuterGeom, orangeFurMat);
  rightEarOuter.position.set(0.2, 0.08, 0.32);
  rightEarOuter.rotation.set(0.1, -0.1, -0.35);
  rightEarOuter.castShadow = true;
  catHeadGroup.add(rightEarOuter);

  const rightEarInner = new THREE.Mesh(earInnerGeom, pinkDetailMat);
  rightEarInner.position.set(0.2, 0.06, 0.33);
  rightEarInner.rotation.set(0.1, -0.1, -0.35);
  catHeadGroup.add(rightEarInner);

  // Cute Whiskers (3 on each cheek)
  const whiskerGeom = new THREE.CylinderGeometry(0.004, 0.004, 0.32);
  whiskerGeom.rotateZ(Math.PI / 2);

  [-0.05, 0, 0.05].forEach((offsetY, idx) => {
    const lw = new THREE.Mesh(whiskerGeom, whiskerMat);
    lw.position.set(-0.26, -0.22 + offsetY * 0.5, -0.04);
    lw.rotation.set(0, 0.2, 0.15 * (idx - 1));
    catHeadGroup.add(lw);

    const rw = new THREE.Mesh(whiskerGeom, whiskerMat);
    rw.position.set(0.26, -0.22 + offsetY * 0.5, -0.04);
    rw.rotation.set(0, -0.2, -0.15 * (idx - 1));
    catHeadGroup.add(rw);
  });

  // Collar & Golden Bell
  const collarGeom = new THREE.TorusGeometry(0.35, 0.025, 12, 24);
  collarGeom.rotateX(Math.PI / 2);
  const collarMesh = new THREE.Mesh(collarGeom, collarMat);
  collarMesh.position.set(0, -0.06, -0.15);
  catHeadGroup.add(collarMesh);

  const bellGeom = new THREE.SphereGeometry(0.05, 16, 16);
  const bellMesh = new THREE.Mesh(bellGeom, bellMat);
  bellMesh.position.set(0, -0.36, -0.22);
  bellMesh.castShadow = true;
  catHeadGroup.add(bellMesh);

  // 3. Tucked Front Paws (Soft Cream Paws)
  const pawGeom = new THREE.SphereGeometry(0.12, 16, 16);
  pawGeom.scale(1.1, 1.4, 0.7);

  const leftPaw = new THREE.Mesh(pawGeom, creamFurMat);
  leftPaw.position.set(-0.35, -0.44, 0.12);
  leftPaw.rotation.z = 0.2;
  leftPaw.castShadow = true;
  catGroup.add(leftPaw);

  const rightPaw = new THREE.Mesh(pawGeom, creamFurMat);
  rightPaw.position.set(-0.1, -0.46, 0.12);
  rightPaw.rotation.z = -0.1;
  rightPaw.castShadow = true;
  catGroup.add(rightPaw);

  // 4. Curved Tail (Curling snugly around the right side of the body)
  const tailCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0.5, 0.1, 0.2),
    new THREE.Vector3(0.68, -0.1, 0.22),
    new THREE.Vector3(0.62, -0.42, 0.25),
    new THREE.Vector3(0.38, -0.55, 0.3),
    new THREE.Vector3(0.18, -0.58, 0.34)
  ]);
  const catTailGeom = new THREE.TubeGeometry(tailCurve, 32, 0.06, 12, false);
  const catTailMesh = new THREE.Mesh(catTailGeom, orangeFurMat);
  catTailMesh.castShadow = true;
  catGroup.add(catTailMesh);

  // Cream Tail Tip Accent
  const tailTipGeom = new THREE.SphereGeometry(0.07, 16, 16);
  const tailTipMesh = new THREE.Mesh(tailTipGeom, creamFurMat);
  tailTipMesh.position.set(0.18, -0.58, 0.34);
  catGroup.add(tailTipMesh);

  // ----------------------------------------------------
  // 12h. Elegant Sterling Silver Jewelry Set (Below Matcha Mug) 💍✨
  // ----------------------------------------------------
  const jewelryGroup = new THREE.Group();
  // Positioned further below and to the right of the Matcha Mug
  jewelryGroup.position.set(6.3, 0.0, 0.05);
  jewelryGroup.rotation.z = -0.12;
  jewelryGroup.name = "jewelry";
  deskGroup.add(jewelryGroup);

  // Dedicated Ultra-Luminous Specular Highlight Light for Silver Jewelry
  const jewelryLight = new THREE.PointLight(0xffffff, 5.2, 8);
  jewelryLight.position.set(6.3, 0.0, 2.2);
  scene.add(jewelryLight);

  // Ultra-Luminous Mirror Polished Sterling Silver Materials (MeshPhysicalMaterial)
  const silverMat = new THREE.MeshPhysicalMaterial({
    color: 0xffffff, // Pure bright sterling silver
    roughness: 0.015, // Ultra-smooth mirror finish
    metalness: 1.0,   // Pure reflective metal
    clearcoat: 1.0,   // High-gloss lacquer shine
    clearcoatRoughness: 0.01,
    reflectivity: 1.0,
    emissive: 0xf1f5f9,
    emissiveIntensity: 0.32
  });

  const silverBrightMat = new THREE.MeshPhysicalMaterial({
    color: 0xffffff,
    roughness: 0.005,
    metalness: 1.0,
    clearcoat: 1.0,
    clearcoatRoughness: 0.0,
    reflectivity: 1.0,
    emissive: 0xffffff,
    emissiveIntensity: 0.6
  });

  const crystalGemMat = new THREE.MeshPhysicalMaterial({
    color: 0xf0f9ff, // Sparkling diamond / crystal ice blue clarity
    roughness: 0.0,
    metalness: 0.1,
    transmission: 0.92,
    transparent: true,
    opacity: 0.95,
    ior: 2.4, // Diamond Index of Refraction
    clearcoat: 1.0,
    clearcoatRoughness: 0.0,
    emissive: 0xe0f2fe,
    emissiveIntensity: 0.7
  });

  const velvetDishMat = new THREE.MeshStandardMaterial({
    color: 0xf8fafc, // Creamy white ceramic / velvet trinket dish
    roughness: 0.65,
    metalness: 0.05
  });

  // 1. Dainty Scalloped Ceramic Trinket Dish Base
  const dishGeom = new THREE.CylinderGeometry(0.85, 0.75, 0.08, 32);
  dishGeom.rotateX(Math.PI / 2);
  const dishMesh = new THREE.Mesh(dishGeom, velvetDishMat);
  dishMesh.castShadow = true;
  dishMesh.receiveShadow = true;
  jewelryGroup.add(dishMesh);

  const dishRimGeom = new THREE.TorusGeometry(0.85, 0.04, 12, 32);
  dishRimGeom.translate(0, 0, 0.04);
  const dishRimMesh = new THREE.Mesh(dishRimGeom, velvetDishMat);
  dishRimMesh.castShadow = true;
  jewelryGroup.add(dishRimMesh);

  // 2. Dainty Silver Chain Necklace with Pendant
  const chainCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-0.45, 0.3, 0.06),
    new THREE.Vector3(-0.25, -0.25, 0.07),
    new THREE.Vector3(0.1, -0.42, 0.08),
    new THREE.Vector3(0.45, -0.15, 0.07),
    new THREE.Vector3(0.35, 0.35, 0.06),
    new THREE.Vector3(-0.1, 0.45, 0.06)
  ], true);
  const chainGeom = new THREE.TubeGeometry(chainCurve, 64, 0.015, 8, true);
  const chainMesh = new THREE.Mesh(chainGeom, silverMat);
  chainMesh.castShadow = true;
  jewelryGroup.add(chainMesh);

  // Sparkling Crescent Moon & Star Silver Pendant
  const pendantGroup = new THREE.Group();
  pendantGroup.position.set(0.1, -0.42, 0.08);
  jewelryGroup.add(pendantGroup);

  // Crescent Moon Shape
  const moonShape = new THREE.Shape();
  moonShape.absarc(0, 0, 0.12, 0, Math.PI * 2, false);
  const moonHole = new THREE.Path();
  moonHole.absarc(0.04, 0.03, 0.1, 0, Math.PI * 2, true);
  moonShape.holes.push(moonHole);

  const moonExtrudeSettings = {
    depth: 0.012,
    bevelEnabled: true,
    bevelSegments: 2,
    steps: 1,
    bevelSize: 0.003,
    bevelThickness: 0.003
  };
  const moonGeom = new THREE.ExtrudeGeometry(moonShape, moonExtrudeSettings);
  const moonMesh = new THREE.Mesh(moonGeom, silverBrightMat);
  moonMesh.castShadow = true;
  pendantGroup.add(moonMesh);

  // Solitaire Crystal Diamond Pendant Drop
  const gemGeom = new THREE.OctahedronGeometry(0.045, 0);
  const gemMesh = new THREE.Mesh(gemGeom, crystalGemMat);
  gemMesh.position.set(-0.02, -0.01, 0.01);
  pendantGroup.add(gemMesh);

  // 3. Sterling Silver Rings (3 Distinct Designer Rings)
  // Ring 1: Classic Polished Silver Band
  const ring1Geom = new THREE.TorusGeometry(0.14, 0.032, 16, 32);
  ring1Geom.scale(1, 1, 0.7);
  const ring1Mesh = new THREE.Mesh(ring1Geom, silverMat);
  ring1Mesh.position.set(-0.32, 0.05, 0.07);
  ring1Mesh.rotation.set(0.15, -0.2, 0.4);
  ring1Mesh.castShadow = true;
  jewelryGroup.add(ring1Mesh);

  // Ring 2: Solitaire Diamond Engagement Ring
  const ring2Group = new THREE.Group();
  ring2Group.position.set(-0.1, 0.15, 0.07);
  ring2Group.rotation.set(-0.1, 0.15, -0.3);
  jewelryGroup.add(ring2Group);

  const ring2BandGeom = new THREE.TorusGeometry(0.13, 0.025, 16, 32);
  const ring2BandMesh = new THREE.Mesh(ring2BandGeom, silverMat);
  ring2BandMesh.castShadow = true;
  ring2Group.add(ring2BandMesh);

  // Diamond Gem & Silver Crown Prongs
  const diamondGeom = new THREE.OctahedronGeometry(0.065, 0);
  diamondGeom.scale(1, 1.2, 1);
  const diamondMesh = new THREE.Mesh(diamondGeom, crystalGemMat);
  diamondMesh.position.set(0, 0.14, 0.01);
  diamondMesh.castShadow = true;
  ring2Group.add(diamondMesh);

  const prongGeom = new THREE.CylinderGeometry(0.01, 0.01, 0.06, 8);
  for (let i = 0; i < 4; i++) {
    const angle = (i / 4) * Math.PI * 2;
    const px = Math.cos(angle) * 0.04;
    const py = 0.13 + Math.sin(angle) * 0.04;
    const prong = new THREE.Mesh(prongGeom, silverBrightMat);
    prong.position.set(px, py, 0.01);
    ring2Group.add(prong);
  }

  // Ring 3: Twisted Cable Silver Rope Ring
  const ring3Geom = new THREE.TorusGeometry(0.12, 0.028, 16, 32);
  const ring3Mesh = new THREE.Mesh(ring3Geom, silverBrightMat);
  ring3Mesh.position.set(-0.24, -0.18, 0.07);
  ring3Mesh.rotation.set(0.2, 0.3, 0.8);
  ring3Mesh.castShadow = true;
  jewelryGroup.add(ring3Mesh);

  // 4. Silver Cuff Bangle Bracelet
  const bangleGeom = new THREE.TorusGeometry(0.34, 0.038, 16, 40, Math.PI * 1.75);
  bangleGeom.scale(1, 1.1, 0.7);
  const bangleMesh = new THREE.Mesh(bangleGeom, silverMat);
  bangleMesh.position.set(0.22, 0.12, 0.07);
  bangleMesh.rotation.set(0.1, -0.15, -0.4);
  bangleMesh.castShadow = true;
  jewelryGroup.add(bangleMesh);

  // Bangle Silver Ball End Caps
  const capGeom = new THREE.SphereGeometry(0.048, 16, 16);
  const cap1 = new THREE.Mesh(capGeom, silverBrightMat);
  cap1.position.set(0.52, 0.15, 0.07);
  jewelryGroup.add(cap1);

  const cap2 = new THREE.Mesh(capGeom, silverBrightMat);
  cap2.position.set(0.42, -0.18, 0.07);
  jewelryGroup.add(cap2);

  // 5. Pair of Silver Hoop Earrings
  const hoopGeom = new THREE.TorusGeometry(0.11, 0.022, 12, 24);
  const hoop1 = new THREE.Mesh(hoopGeom, silverBrightMat);
  hoop1.position.set(0.36, -0.32, 0.06);
  hoop1.rotation.set(0.2, -0.1, 0.2);
  hoop1.castShadow = true;
  const hoop2 = new THREE.Mesh(hoopGeom, silverBrightMat);
  hoop2.position.set(0.46, -0.38, 0.07);
  hoop2.rotation.set(0.1, 0.2, -0.3);
  hoop2.castShadow = true;
  jewelryGroup.add(hoop2);

  // Sparkling Diamond & Silver Glints / Twinkling Star Meshes ✦✨
  const jewelrySparkles = new THREE.Group();
  jewelryGroup.add(jewelrySparkles);

  const starShape = new THREE.Shape();
  const starOuter = 0.075;
  const starInner = 0.012;
  for (let i = 0; i < 8; i++) {
    const r = i % 2 === 0 ? starOuter : starInner;
    const a = (i / 8) * Math.PI * 2;
    const x = Math.cos(a) * r;
    const y = Math.sin(a) * r;
    if (i === 0) starShape.moveTo(x, y);
    else starShape.lineTo(x, y);
  }
  starShape.closePath();

  const sparkleGeom = new THREE.ShapeGeometry(starShape);

  const sparklePositions = [
    { x: -0.1, y: 0.29, z: 0.15 },    // Solitaire Diamond Gem
    { x: 0.1, y: -0.42, z: 0.14 },    // Crescent Moon & Star Pendant
    { x: -0.24, y: -0.18, z: 0.14 },  // Twisted Rope Silver Ring
    { x: 0.52, y: 0.15, z: 0.14 },    // Bangle Ball Cap
    { x: 0.36, y: -0.32, z: 0.13 },   // Silver Hoop Earring
    { x: -0.32, y: 0.05, z: 0.14 },   // Classic Silver Band Ring
    { x: 0.0, y: -0.05, z: 0.13 }     // Center Trinket Dish Accent
  ];

  sparklePositions.forEach((pos, i) => {
    const spMat = new THREE.MeshBasicMaterial({
      color: i % 2 === 0 ? 0xffffff : 0xe0f2fe,
      transparent: true,
      opacity: 0.9,
      side: THREE.DoubleSide
    });
    const sparkleMesh = new THREE.Mesh(sparkleGeom, spMat);
    sparkleMesh.position.set(pos.x, pos.y, pos.z);
    sparkleMesh.rotation.z = (i * Math.PI) / 4;
    jewelrySparkles.add(sparkleMesh);
  });

  // ----------------------------------------------------
  // 12i. Iconic Toy Mazda Miata NA Roadster (Below Sterling Silver) 🚗💨
  // ----------------------------------------------------
  const miataGroup = new THREE.Group();
  // Positioned directly below the Sterling Silver trinket dish (jewelryGroup is at (6.3, 0.0, 0.05))
  miataGroup.position.set(6.3, -2.3, 0.05);
  miataGroup.rotation.z = -0.15; // Slightly angled roadster park position
  miataGroup.name = "miata";
  deskGroup.add(miataGroup);

  // Materials
  const miataRedMat = new THREE.MeshStandardMaterial({
    color: 0xd92626, // Classic Mazda Soul / Classic Red
    roughness: 0.15,
    metalness: 0.25
  });

  const miataBlackMat = new THREE.MeshStandardMaterial({
    color: 0x18181b, // Dark charcoal / black vinyl & chassis
    roughness: 0.75,
    metalness: 0.1
  });

  const miataChromeMat = new THREE.MeshStandardMaterial({
    color: 0xf8fafc, // Polished chrome for exhaust & accents
    roughness: 0.08,
    metalness: 0.95
  });

  const miataGlassMat = new THREE.MeshStandardMaterial({
    color: 0xe0f2fe, // Tinted glass windshield
    roughness: 0.05,
    metalness: 0.1,
    transparent: true,
    opacity: 0.5
  });

  const miataInteriorMat = new THREE.MeshStandardMaterial({
    color: 0x27272a, // Dashboard & bucket seat leather
    roughness: 0.7,
    metalness: 0.05
  });


  const brakeDiscMat = new THREE.MeshStandardMaterial({
    color: 0x475569,
    roughness: 0.3,
    metalness: 0.85
  });

  const caliperRedMat = new THREE.MeshStandardMaterial({
    color: 0xd92626,
    roughness: 0.2,
    metalness: 0.3
  });

  const turnSignalMat = new THREE.MeshStandardMaterial({
    color: 0xf59e0b, // Amber turn signals
    roughness: 0.3,
    emissive: 0xd97706,
    emissiveIntensity: 0.3
  });

  const tailLightMat = new THREE.MeshStandardMaterial({
    color: 0xef4444, // Vibrant ruby tail lights
    roughness: 0.2,
    emissive: 0xd97706,
    emissiveIntensity: 0.4
  });

  const tireRubberMat = new THREE.MeshStandardMaterial({
    color: 0x1f1f23,
    roughness: 0.85,
    metalness: 0.05
  });

  const rimSilverMat = new THREE.MeshStandardMaterial({
    color: 0xf1f5f9,
    roughness: 0.2,
    metalness: 0.9
  });

  // 1. Lower Body Chassis / Main Roadster Shell
  const bodyMainGeom = new THREE.BoxGeometry(1.42, 0.68, 0.22);
  const bodyMainMesh = new THREE.Mesh(bodyMainGeom, miataRedMat);
  bodyMainMesh.position.set(0, 0, 0.16);
  bodyMainMesh.castShadow = true;
  bodyMainMesh.receiveShadow = true;
  miataGroup.add(bodyMainMesh);

  // Front Hood Curved Slope (Tapering forward)
  const hoodGeom = new THREE.CylinderGeometry(0.33, 0.35, 0.58, 16, 1, false, 0, Math.PI);
  hoodGeom.rotateZ(Math.PI / 2);
  hoodGeom.rotateX(Math.PI / 2);
  const hoodMesh = new THREE.Mesh(hoodGeom, miataRedMat);
  hoodMesh.position.set(-0.35, 0, 0.22);
  hoodMesh.scale.set(0.9, 0.95, 0.45);
  hoodMesh.castShadow = true;
  miataGroup.add(hoodMesh);

  // Iconic Front Bumper "Miata Smile" Air Intake Grille
  const grilleGeom = new THREE.BoxGeometry(0.06, 0.38, 0.09);
  const grilleMesh = new THREE.Mesh(grilleGeom, miataBlackMat);
  grilleMesh.position.set(-0.70, 0, 0.11);
  miataGroup.add(grilleMesh);

  // Front Turn Signals (Bumper lights)
  const turnSignalGeom = new THREE.BoxGeometry(0.04, 0.12, 0.04);
  const leftTurnMesh = new THREE.Mesh(turnSignalGeom, turnSignalMat);
  leftTurnMesh.position.set(-0.70, 0.24, 0.14);
  miataGroup.add(leftTurnMesh);

  const rightTurnMesh = new THREE.Mesh(turnSignalGeom, turnSignalMat);
  rightTurnMesh.position.set(-0.70, -0.24, 0.14);
  miataGroup.add(rightTurnMesh);

  // 2. Closed Pop-up Headlight Covers Flush on Hood
  const closedPopGeom = new THREE.BoxGeometry(0.18, 0.16, 0.015);
  const leftClosedPop = new THREE.Mesh(closedPopGeom, miataRedMat);
  leftClosedPop.position.set(-0.48, 0.20, 0.23);
  leftClosedPop.castShadow = true;
  miataGroup.add(leftClosedPop);

  const rightClosedPop = new THREE.Mesh(closedPopGeom, miataRedMat);
  rightClosedPop.position.set(-0.48, -0.20, 0.23);
  rightClosedPop.castShadow = true;
  miataGroup.add(rightClosedPop);

  // 3. Open Cockpit Interior & Bucket Seats
  const cockpitCutoutGeom = new THREE.BoxGeometry(0.52, 0.50, 0.12);
  const cockpitCutoutMesh = new THREE.Mesh(cockpitCutoutGeom, miataInteriorMat);
  cockpitCutoutMesh.position.set(0.08, 0, 0.22);
  miataGroup.add(cockpitCutoutMesh);

  // Bucket Seats (Driver & Passenger)
  const seatGeom = new THREE.BoxGeometry(0.20, 0.20, 0.20);
  const leftSeat = new THREE.Mesh(seatGeom, miataInteriorMat);
  leftSeat.position.set(0.12, 0.14, 0.24);
  leftSeat.castShadow = true;
  miataGroup.add(leftSeat);

  const rightSeat = new THREE.Mesh(seatGeom, miataInteriorMat);
  rightSeat.position.set(0.12, -0.14, 0.24);
  rightSeat.castShadow = true;
  miataGroup.add(rightSeat);

  // Steering Wheel (JDM Roadster Right-hand Drive)
  const steeringWheelGeom = new THREE.TorusGeometry(0.065, 0.012, 8, 16);
  steeringWheelGeom.rotateY(Math.PI / 3);
  const steeringWheelMesh = new THREE.Mesh(steeringWheelGeom, miataBlackMat);
  steeringWheelMesh.position.set(-0.08, -0.14, 0.28);
  miataGroup.add(steeringWheelMesh);

  // Folded Convertible Soft Top Cover (Behind seats)
  const softTopGeom = new THREE.CylinderGeometry(0.07, 0.07, 0.52, 12);
  softTopGeom.rotateX(Math.PI / 2);
  const softTopMesh = new THREE.Mesh(softTopGeom, miataBlackMat);
  softTopMesh.position.set(0.28, 0, 0.25);
  miataGroup.add(softTopMesh);

  // 4. Windshield & Frame
  const frameGeom = new THREE.BoxGeometry(0.02, 0.54, 0.18);
  frameGeom.rotateY(-0.35);
  const frameMesh = new THREE.Mesh(frameGeom, miataRedMat);
  frameMesh.position.set(-0.12, 0, 0.32);
  miataGroup.add(frameMesh);

  const glassPaneGeom = new THREE.BoxGeometry(0.012, 0.50, 0.16);
  glassPaneGeom.rotateY(-0.35);
  const glassPaneMesh = new THREE.Mesh(glassPaneGeom, miataGlassMat);
  glassPaneMesh.position.set(-0.11, 0, 0.32);
  miataGroup.add(glassPaneMesh);

  // Side Mirrors (Teardrop mirrors)
  const mirrorGeom = new THREE.SphereGeometry(0.04, 12, 12);
  mirrorGeom.scale(1.4, 0.9, 0.9);

  const leftMirror = new THREE.Mesh(mirrorGeom, miataRedMat);
  leftMirror.position.set(-0.10, 0.35, 0.28);
  miataGroup.add(leftMirror);

  const rightMirror = new THREE.Mesh(mirrorGeom, miataRedMat);
  rightMirror.position.set(-0.10, -0.35, 0.28);
  miataGroup.add(rightMirror);

  // 5. Rear End: Taillights & Dual Chrome Exhaust
  const tailLightGeom = new THREE.CylinderGeometry(0.04, 0.04, 0.14, 16);
  tailLightGeom.rotateZ(Math.PI / 2);

  const leftTail = new THREE.Mesh(tailLightGeom, tailLightMat);
  leftTail.position.set(0.70, 0.22, 0.18);
  miataGroup.add(leftTail);

  const rightTail = new THREE.Mesh(tailLightGeom, tailLightMat);
  rightTail.position.set(0.70, -0.22, 0.18);
  miataGroup.add(rightTail);

  // Dual Chrome Exhaust Pipes
  const exhaustGeom = new THREE.CylinderGeometry(0.025, 0.025, 0.10, 12);
  exhaustGeom.rotateZ(Math.PI / 2);

  const exhaust1 = new THREE.Mesh(exhaustGeom, miataChromeMat);
  exhaust1.position.set(0.72, -0.15, 0.08);
  miataGroup.add(exhaust1);

  const exhaust2 = new THREE.Mesh(exhaustGeom, miataChromeMat);
  exhaust2.position.set(0.72, -0.20, 0.08);
  miataGroup.add(exhaust2);

  // 6. Wheels & Tires (4 Correctly Oriented & Highly Detailed Alloy Wheels) 🛞
  const wheelPositions = [
    { x: -0.42, y: 0.34, name: "FL" },
    { x: -0.42, y: -0.34, name: "FR" },
    { x: 0.42, y: 0.34, name: "RL" },
    { x: 0.42, y: -0.34, name: "RR" }
  ];

  // Geometries for wheel components (Cylinder axis along Y matches wheel axle!)
  const tireGeom = new THREE.CylinderGeometry(0.11, 0.11, 0.08, 32);
  const sidewallGeom = new THREE.TorusGeometry(0.102, 0.012, 12, 32);

  const rimOuterGeom = new THREE.CylinderGeometry(0.078, 0.078, 0.084, 32);
  const spokeGeom = new THREE.BoxGeometry(0.014, 0.086, 0.055);
  const centerCapGeom = new THREE.CylinderGeometry(0.02, 0.02, 0.09, 16);
  const lugNutGeom = new THREE.CylinderGeometry(0.006, 0.006, 0.092, 8);

  const brakeDiscGeom = new THREE.CylinderGeometry(0.06, 0.06, 0.035, 24);
  const caliperGeom = new THREE.BoxGeometry(0.025, 0.035, 0.035);

  wheelPositions.forEach((pos) => {
    const wheelGroup = new THREE.Group();
    // Wheel center at Z = 0.11 so bottom of 0.11 radius tire sits right at Z = 0.00 (desk level)
    wheelGroup.position.set(pos.x, pos.y, 0.11);
    miataGroup.add(wheelGroup);

    // 1. Main Rubber Tire (Axle naturally along Y)
    const tireMesh = new THREE.Mesh(tireGeom, tireRubberMat);
    tireMesh.castShadow = true;
    wheelGroup.add(tireMesh);

    // Rounded Tire Sidewall Accents (Left & Right faces of tire)
    const sidewallOuter = new THREE.Mesh(sidewallGeom, tireRubberMat);
    sidewallOuter.position.set(0, pos.y > 0 ? 0.04 : -0.04, 0);
    sidewallOuter.rotation.x = Math.PI / 2;
    wheelGroup.add(sidewallOuter);

    // 2. Polished Alloy Rim Outer Lip
    const rimMesh = new THREE.Mesh(rimOuterGeom, rimSilverMat);
    wheelGroup.add(rimMesh);

    // 3. 5-Spoke Star Design
    for (let i = 0; i < 5; i++) {
      const angle = (i / 5) * Math.PI * 2;
      const spoke = new THREE.Mesh(spokeGeom, rimSilverMat);
      spoke.rotation.y = angle;
      wheelGroup.add(spoke);
    }

    // 4. Polished Center Cap & 4 Lug Nuts
    const cap = new THREE.Mesh(centerCapGeom, rimSilverMat);
    wheelGroup.add(cap);

    for (let j = 0; j < 4; j++) {
      const lugAngle = (j / 4) * Math.PI * 2;
      const lugX = Math.cos(lugAngle) * 0.034;
      const lugZ = Math.sin(lugAngle) * 0.034;
      const lug = new THREE.Mesh(lugNutGeom, miataChromeMat);
      lug.position.set(lugX, 0, lugZ);
      wheelGroup.add(lug);
    }

    // 5. Inner Brake Disc & Red Brembo Caliper
    const brakeDisc = new THREE.Mesh(brakeDiscGeom, brakeDiscMat);
    brakeDisc.position.y = pos.y > 0 ? -0.015 : 0.015;
    wheelGroup.add(brakeDisc);

    const caliper = new THREE.Mesh(caliperGeom, caliperRedMat);
    caliper.position.set(0, pos.y > 0 ? -0.015 : 0.015, 0.045);
    wheelGroup.add(caliper);
  });

  // ----------------------------------------------------
  // 13. Afternoon Window Light & Shadow Projection Surface
  // ----------------------------------------------------
  const windowTexture = createWindowShadowTexture();
  const windowLightGeom = new THREE.PlaneGeometry(16, 11);
  const windowLightMat = new THREE.MeshBasicMaterial({
    map: windowTexture,
    transparent: true,
    opacity: 0.92,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  });
  const windowLightMesh = new THREE.Mesh(windowLightGeom, windowLightMat);
  windowLightMesh.position.set(0.5, 0.2, 0.015);
  windowLightMesh.name = "windowLight";
  deskGroup.add(windowLightMesh);

  // ----------------------------------------------------
  // 14. Lighting: Warm Afternoon Sunlight & Accent Lamp
  // ----------------------------------------------------
  // Warm Cozy Desk Accent Lamp Spotlight Target Object
  const lampTarget = new THREE.Object3D();
  lampTarget.position.set(-4.8, 1.4, 0);
  scene.add(lampTarget);

  // Warm Cozy Desk Accent Lamp Spotlight
  const lampLight = new THREE.SpotLight(0xffdfb3, 5.5, 18, Math.PI / 2.8, 0.6, 1);
  lampLight.position.set(-5.2, 2.4, 3.25);
  lampLight.target = lampTarget;
  lampLight.castShadow = true;
  lampLight.shadow.mapSize.width = 2048;
  lampLight.shadow.mapSize.height = 2048;
  lampLight.shadow.bias = -0.0001;
  scene.add(lampLight);

  // Extra Cozy Ambient Warm Point Light at desk corner
  const cozyCornerLight = new THREE.PointLight(0xffaa44, 2.2, 8);
  cozyCornerLight.position.set(-5.2, 2.4, 1.3);
  scene.add(cozyCornerLight);

  // Golden Afternoon Dust Floating Particles in Sunbeam
  const dustCount = 180;
  const dustGeom = new THREE.BufferGeometry();
  const dustPositions = new Float32Array(dustCount * 3);
  for (let i = 0; i < dustCount * 3; i += 3) {
    dustPositions[i] = (Math.random() - 0.5) * 16;
    dustPositions[i + 1] = (Math.random() - 0.5) * 11;
    dustPositions[i + 2] = 0.2 + Math.random() * 4.5;
  }
  dustGeom.setAttribute("position", new THREE.BufferAttribute(dustPositions, 3));

  const dustMat = new THREE.PointsMaterial({
    color: 0xfcb963, // Cozy golden sunlit dust motes
    size: 0.07,
    transparent: true,
    opacity: 0.6,
    blending: THREE.AdditiveBlending
  });
  const dustParticles = new THREE.Points(dustGeom, dustMat);
  scene.add(dustParticles);

  return {
    deskGroup,
    macbookGroup,
    macbookLid,
    keyboardMesh,
    screenLight,
    journalGroup,
    journalCover,
    mugGroup,
    mugLiquid,
    steamParticles,
    phoneGroup,
    phoneScreenMat,
    pencilGroup,
    stickyNotesGroup,
    plantGroup,
    earbudsGroup,
    scissorsGroup,
    scissorBlade1,
    scissorBlade2,
    lampGroup,
    lampLight,
    cozyCornerLight,
    lampTarget,
    bulbMat,
    dustParticles,
    windowLightMesh,
    rubiksCubeGroup,
    pictureFrameGroup,
    chessGroup,
    globeGroup,
    globeSphere,
    catGroup,
    catTailMesh,
    jewelryGroup,
    jewelrySparkles,
    jewelryLight,
    miataGroup,
    frameShadowMesh,
    chessShadowMesh,
    earbudsShadowMesh
  };
}
