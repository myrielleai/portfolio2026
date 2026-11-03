import * as THREE from "three";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";

// Redesigned desk props. Each builder returns a group that is added inside the existing,
// already-clickable object group (whose old children get hidden), so naming, dragging and
// dialogues keep working. Local +Z is "up" toward the camera; the desk surface sits at z ≈ -0.02.

type Env = THREE.Texture | null;

const withEnv = <T extends THREE.MeshStandardMaterial>(m: T, env: Env, intensity = 1): T => {
  if (env) {
    m.envMap = env;
    m.envMapIntensity = intensity;
    m.userData.baseEnv = intensity;
  }
  return m;
};

const shadowed = <T extends THREE.Object3D>(o: T): T => {
  o.traverse((c) => {
    if ((c as THREE.Mesh).isMesh) {
      c.castShadow = true;
      c.receiveShadow = true;
    }
  });
  return o;
};

const canvasTex = (w: number, h: number, draw: (g: CanvasRenderingContext2D) => void) => {
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  draw(c.getContext("2d")!);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 8;
  return t;
};

// Simple seeded random so the props look the same on every load
const seeded = (seed: number) => () => {
  seed = (seed * 16807) % 2147483647;
  return (seed - 1) / 2147483646;
};

/* ---------------------------------------------------------------- */
/* Scissors: vintage gold tailor's shears with ring handles          */
/* ---------------------------------------------------------------- */
export function buildScissors(env: Env) {
  const group = new THREE.Group();
  const gold = withEnv(new THREE.MeshStandardMaterial({ color: 0xb88a3e, metalness: 1, roughness: 0.34 }), env, 0.85);
  const edge = withEnv(new THREE.MeshStandardMaterial({ color: 0xe3c98e, metalness: 1, roughness: 0.2 }), env, 1.0);

  const makeArm = (side: 1 | -1, z: number) => {
    const arm = new THREE.Group();
    // Blade: straight cutting edge on the centre line, curved spine on the outside
    const s = new THREE.Shape();
    s.moveTo(0.035 * side, -0.06);
    s.lineTo(0.004 * side, 1.46);
    s.quadraticCurveTo(-0.03 * side, 1.47, -0.05 * side, 1.38);
    s.quadraticCurveTo(-0.115 * side, 0.85, -0.105 * side, 0.18);
    s.lineTo(-0.075 * side, -0.08);
    s.closePath();
    const blade = new THREE.Mesh(
      new THREE.ExtrudeGeometry(s, { depth: 0.022, bevelEnabled: true, bevelSize: 0.006, bevelThickness: 0.006, bevelSegments: 2 }),
      gold
    );
    blade.position.z = z;
    arm.add(blade);
    // Bright ground edge along the cutting line
    const e = new THREE.Shape();
    e.moveTo(0.032 * side, -0.02);
    e.lineTo(0.005 * side, 1.42);
    e.lineTo(-0.012 * side, 1.4);
    e.lineTo(0.0, -0.02);
    e.closePath();
    const edgeMesh = new THREE.Mesh(new THREE.ShapeGeometry(e), edge);
    edgeMesh.position.z = z + 0.03;
    arm.add(edgeMesh);

    // Shank: a curved rod from the pivot down to the ring on the opposite side
    const ringC = new THREE.Vector2(0.29 * -side, side === 1 ? -0.8 : -0.86);
    const shank = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-0.03 * side, -0.05, z + 0.012),
      new THREE.Vector3(0.05 * -side, -0.3, z + 0.012),
      new THREE.Vector3(ringC.x * 0.75, ringC.y + 0.24, z + 0.012),
    ]);
    arm.add(new THREE.Mesh(new THREE.TubeGeometry(shank, 24, 0.038, 10, false), gold));

    // Finger ring: thumb ring is round, finger bow is a longer oval
    const rx = side === 1 ? 0.2 : 0.27, ry = side === 1 ? 0.19 : 0.21;
    const ring = new THREE.Shape();
    ring.absellipse(ringC.x, ringC.y, rx, ry, 0, Math.PI * 2, false, 0);
    const hole = new THREE.Path();
    hole.absellipse(ringC.x, ringC.y, rx - 0.065, ry - 0.06, 0, Math.PI * 2, true, 0);
    ring.holes.push(hole);
    const ringMesh = new THREE.Mesh(
      new THREE.ExtrudeGeometry(ring, { depth: 0.02, bevelEnabled: true, bevelSize: 0.014, bevelThickness: 0.014, bevelSegments: 3, curveSegments: 40 }),
      gold
    );
    ringMesh.position.z = z;
    arm.add(ringMesh);
    // Little finger rest on the long bow
    if (side === -1) {
      const rest = new THREE.CatmullRomCurve3([
        new THREE.Vector3(ringC.x - 0.12, ringC.y - 0.17, z + 0.012),
        new THREE.Vector3(ringC.x - 0.05, ringC.y - 0.34, z + 0.012),
        new THREE.Vector3(ringC.x + 0.06, ringC.y - 0.38, z + 0.012),
      ]);
      arm.add(new THREE.Mesh(new THREE.TubeGeometry(rest, 16, 0.026, 8, false), gold));
    }
    return shadowed(arm);
  };

  const arm1 = makeArm(1, 0.0);
  const arm2 = makeArm(-1, 0.045);
  group.add(arm1, arm2);

  // Domed pivot screw
  const screw = new THREE.Mesh(new THREE.SphereGeometry(0.06, 20, 12, 0, Math.PI * 2, 0, Math.PI / 2), edge);
  screw.rotation.x = Math.PI / 2;
  screw.position.z = 0.09;
  const slot = new THREE.Mesh(new THREE.BoxGeometry(0.09, 0.012, 0.01), new THREE.MeshStandardMaterial({ color: 0x5b4422 }));
  slot.position.z = 0.148;
  slot.rotation.z = 0.6;
  group.add(screw, slot);
  return { group, arm1, arm2 };
}

/* ---------------------------------------------------------------- */
/* Rubik's cube: modern stickerless speed cube, top layer mid-turn   */
/* ---------------------------------------------------------------- */
export function buildRubiks(env: Env) {
  const group = new THREE.Group();
  const step = 0.28;
  const core = withEnv(new THREE.MeshStandardMaterial({ color: 0x1a1a1c, roughness: 0.45 }), env, 0.4);
  const cols = {
    px: 0xd63a32, // red
    nx: 0xf28a2e, // orange
    py: 0x2f6fd8, // blue
    ny: 0x2fa85a, // green
    pz: 0xf7f4ee, // white (top)
    nz: 0xf6cf3a, // yellow
  };
  const tileMat: Record<string, THREE.MeshStandardMaterial> = {};
  for (const [k, v] of Object.entries(cols)) {
    tileMat[k] = withEnv(new THREE.MeshStandardMaterial({ color: v, roughness: 0.3 }), env, 0.55);
  }
  const cubieGeo = new RoundedBoxGeometry(0.272, 0.272, 0.272, 3, 0.035);
  const tileGeo = new RoundedBoxGeometry(0.236, 0.236, 0.02, 2, 0.008);
  const topLayer = new THREE.Group();
  topLayer.rotation.z = 0.36; // caught mid-turn
  group.add(topLayer);

  for (let xi = -1; xi <= 1; xi++)
    for (let yi = -1; yi <= 1; yi++)
      for (let zi = -1; zi <= 1; zi++) {
        const cubie = new THREE.Group();
        cubie.position.set(xi * step, yi * step, zi * step);
        cubie.add(new THREE.Mesh(cubieGeo, core));
        const addTile = (key: string, rot: [number, number, number], off: [number, number, number]) => {
          const t = new THREE.Mesh(tileGeo, tileMat[key]);
          t.rotation.set(...rot);
          t.position.set(...off);
          cubie.add(t);
        };
        const o = 0.137;
        if (zi === 1) addTile("pz", [0, 0, 0], [0, 0, o]);
        if (zi === -1) addTile("nz", [Math.PI, 0, 0], [0, 0, -o]);
        if (xi === 1) addTile("px", [0, Math.PI / 2, 0], [o, 0, 0]);
        if (xi === -1) addTile("nx", [0, -Math.PI / 2, 0], [-o, 0, 0]);
        if (yi === 1) addTile("py", [-Math.PI / 2, 0, 0], [0, o, 0]);
        if (yi === -1) addTile("ny", [Math.PI / 2, 0, 0], [0, -o, 0]);
        (zi === 1 ? topLayer : group).add(cubie);
      }

  // Scrambled / solved. Scrambling deals the 48 edge and corner stickers out again (each colour
  // still appears nine times and the centres stay put, like a real cube); solving puts every
  // sticker back. Either way the top layer gives a quick twist so the change reads as a move.
  const tiles: { mesh: THREE.Mesh; key: string; center: boolean }[] = [];
  group.traverse((o) => {
    const m = o as THREE.Mesh;
    if (!m.isMesh || m.geometry !== tileGeo) return;
    const key = Object.keys(tileMat).find((k) => tileMat[k] === m.material)!;
    const c = m.parent!.position;
    const center = [c.x, c.y, c.z].filter((v) => Math.abs(v) < 1e-6).length === 2;
    tiles.push({ mesh: m, key, center });
  });
  let solved = true;
  let twist = 0;
  const setScrambled = (scrambled: boolean) => {
    const movable = tiles.filter((t) => !t.center);
    const keys = movable.map((t) => t.key);
    if (scrambled) {
      for (let i = keys.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [keys[i], keys[j]] = [keys[j], keys[i]];
      }
    }
    movable.forEach((t, i) => { t.mesh.material = tileMat[keys[i]]; });
  };
  group.userData.toggle = () => {
    solved = !solved;
    const from = topLayer.rotation.z;
    const to = solved ? 0.36 : from + Math.PI / 2;
    const start = performance.now();
    const id = ++twist;
    const step = (now: number) => {
      if (id !== twist) return;
      const t = Math.min(1, (now - start) / 380);
      const e = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
      topLayer.rotation.z = from + (to - from) * e;
      if (t >= 0.5 && !(group.userData.swapped === id)) { group.userData.swapped = id; setScrambled(!solved); }
      if (t < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
    return solved;
  };
  return shadowed(group);
}

/* ---------------------------------------------------------------- */
/* Cat: big curled-up sleeping ginger tabby                          */
/* ---------------------------------------------------------------- */
export function buildCat() {
  const group = new THREE.Group();
  const ginger = new THREE.Color(0xd9782d);
  const stripe = new THREE.Color(0x9c4a1a);
  const light = new THREE.Color(0xf0ad6a);
  const cream = new THREE.Color(0xf7e6cc);
  const rnd = seeded(7);

  const fur = new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.92, metalness: 0 });

  // Bake transforms into geometry and colour each vertex from its position in cat space,
  // so the tabby stripes run continuously across all body parts.
  const furPart = (
    geo: THREE.BufferGeometry,
    pos: [number, number, number],
    rotZ = 0,
    painter?: (p: THREE.Vector3) => THREE.Color
  ) => {
    geo.rotateZ(rotZ);
    geo.translate(...pos);
    const p = geo.attributes.position;
    const colors = new Float32Array(p.count * 3);
    const v = new THREE.Vector3();
    for (let i = 0; i < p.count; i++) {
      v.fromBufferAttribute(p, i);
      const c = painter ? painter(v) : bodyPaint(v);
      colors.set([c.r, c.g, c.b], i * 3);
    }
    geo.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    return new THREE.Mesh(geo, fur);
  };

  // Curl centre; stripes radiate around it like a real curled tabby
  const C = new THREE.Vector2(0, 0.06);
  const soft = (x: number, a: number, b: number) => THREE.MathUtils.smoothstep(x, a, b);
  const bodyPaint = (v: THREE.Vector3) => {
    const ang = Math.atan2(v.y - C.y, v.x - C.x);
    const r = Math.hypot(v.x - C.x, v.y - C.y);
    const band = Math.sin(ang * 12 + Math.sin(r * 9) * 0.6);
    const top = soft(v.z, 0.08, 0.4);
    const c = ginger.clone().lerp(light, (1 - top) * 0.35);
    c.lerp(stripe, soft(band, 0.15, 0.75) * 0.6 * top);
    // darker along the spine (outer ridge of the curl)
    c.lerp(stripe, soft(r, 0.62, 0.95) * 0.25 * top);
    // cream belly on the inner side of the curl
    c.lerp(light, soft(0.3 - r, 0, 0.12) * 0.6);
    return c.offsetHSL(0, 0, (rnd() - 0.5) * 0.035);
  };

  // Ellipsoid helper
  const blob = (rx: number, ry: number, rz: number, seg = 48) => {
    const g = new THREE.SphereGeometry(1, seg, Math.round(seg * 0.7));
    g.scale(rx, ry, rz);
    return g;
  };

  // Body: one continuous crescent (a tube along an arc whose thickness varies), flattened onto the desk
  const arcR = 0.5;
  const a0 = (205 * Math.PI) / 180, a1 = (-28 * Math.PI) / 180;
  const arcPts: THREE.Vector3[] = [];
  for (let i = 0; i <= 16; i++) {
    const a = a0 + (a1 - a0) * (i / 16);
    arcPts.push(new THREE.Vector3(C.x + Math.cos(a) * arcR, C.y + Math.sin(a) * arcR, 0.2));
  }
  const arc = new THREE.CatmullRomCurve3(arcPts);
  const tubular = 120, radial = 28;
  const bodyGeo = new THREE.TubeGeometry(arc, tubular, 1, radial, false);
  const thick = (t: number) => 0.4 + 0.12 * Math.sin(Math.PI * Math.min(1, t * 1.6)) - 0.08 * t; // haunch fullest
  {
    const p = bodyGeo.attributes.position;
    const v = new THREE.Vector3();
    for (let i = 0; i <= tubular; i++) {
      const t = i / tubular;
      const c = arc.getPointAt(t);
      const k = thick(t);
      for (let j = 0; j <= radial; j++) {
        const idx = i * (radial + 1) + j;
        v.fromBufferAttribute(p, idx).sub(c);
        v.set(v.x * k, v.y * k, v.z * k * 0.78);
        v.add(c);
        p.setXYZ(idx, v.x, v.y, v.z);
      }
    }
    bodyGeo.computeVertexNormals();
  }
  group.add(furPart(bodyGeo, [0, 0, 0]));
  // Rounded rump and shoulder caps
  const startP = arc.getPointAt(0), endP = arc.getPointAt(1);
  group.add(furPart(blob(thick(0), thick(0), thick(0) * 0.78), [startP.x, startP.y, startP.z]));
  group.add(furPart(blob(thick(1), thick(1), thick(1) * 0.78), [endP.x, endP.y, endP.z]));

  // Head resting at the front of the curl, face turned toward the tail
  const H = new THREE.Vector3(0.22, -0.44, 0.27);
  const R = new THREE.Vector3(0.4, 0.37, 0.31);
  const f = new THREE.Vector3(-0.92, -0.25, 0).normalize(); // face direction
  const side = new THREE.Vector3(-f.y, f.x, 0); // perpendicular in the desk plane
  const headPaint = (v: THREE.Vector3) => {
    const l = v.clone().sub(H);
    const along = l.dot(f), across = l.dot(side);
    const c = ginger.clone();
    // forehead stripes running back from between the eyes
    if (along < 0.16 && l.z > 0.1) c.lerp(stripe, soft(Math.sin(across * 30), 0.2, 0.8) * 0.6);
    // cream muzzle, cheeks and chin
    c.lerp(cream, soft(along, 0.18, 0.32) * soft(0.2 - l.z, 0, 0.12) * 0.9);
    return c.offsetHSL(0, 0, (rnd() - 0.5) * 0.035);
  };
  group.add(furPart(blob(R.x, R.y, R.z, 56), [H.x, H.y, H.z], Math.atan2(f.y, f.x), headPaint));
  const onHead = (d: THREE.Vector3) => {
    const n = d.clone().normalize();
    // account for the head's rotation about Z
    const ang = -Math.atan2(f.y, f.x);
    const lx = n.x * Math.cos(ang) - n.y * Math.sin(ang), ly = n.x * Math.sin(ang) + n.y * Math.cos(ang);
    const k = 1 / Math.sqrt((lx / R.x) ** 2 + (ly / R.y) ** 2 + (n.z / R.z) ** 2);
    return H.clone().add(n.multiplyScalar(k));
  };

  // Ears: triangular, up and slightly back, inner pink facing the face side
  const earMat = new THREE.MeshStandardMaterial({ color: 0xcf6f2a, roughness: 0.9 });
  const innerEar = new THREE.MeshStandardMaterial({ color: 0xf0b0a0, roughness: 0.9, side: THREE.DoubleSide });
  for (const s of [1, -1]) {
    const dir = f.clone().multiplyScalar(-0.35).add(side.clone().multiplyScalar(0.55 * s)).add(new THREE.Vector3(0, 0, 0.75)).normalize();
    const base = onHead(f.clone().multiplyScalar(-0.05).add(side.clone().multiplyScalar(0.6 * s)).add(new THREE.Vector3(0, 0, 0.8)));
    const ear = new THREE.Mesh(new THREE.ConeGeometry(0.15, 0.26, 4), earMat);
    ear.scale.set(1, 1, 0.55);
    ear.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir);
    ear.position.copy(base).add(dir.clone().multiplyScalar(0.06));
    const inner = new THREE.Mesh(new THREE.ConeGeometry(0.09, 0.17, 4), innerEar);
    inner.scale.set(1, 1, 0.4);
    inner.quaternion.copy(ear.quaternion);
    inner.position.copy(ear.position).add(f.clone().multiplyScalar(0.035)).add(new THREE.Vector3(0, 0, 0.01));
    group.add(ear, inner);
  }

  // Muzzle, nose, closed eyes
  const faceAng = Math.atan2(f.y, f.x);
  for (const s of [1, -1]) {
    const cheek = new THREE.Mesh(blob(0.09, 0.08, 0.07, 20), new THREE.MeshStandardMaterial({ color: cream, roughness: 0.9 }));
    cheek.position.copy(onHead(f.clone().add(side.clone().multiplyScalar(0.28 * s)).add(new THREE.Vector3(0, 0, 0.15)))).add(f.clone().multiplyScalar(-0.03));
    group.add(cheek);
  }
  const nose = new THREE.Mesh(new THREE.SphereGeometry(0.035, 12, 8), new THREE.MeshStandardMaterial({ color: 0xd88787, roughness: 0.6 }));
  nose.scale.set(1, 1.2, 0.8);
  nose.rotation.z = faceAng;
  nose.position.copy(onHead(f.clone().add(new THREE.Vector3(0, 0, 0.45)))).add(f.clone().multiplyScalar(0.015));
  const eyeMat = new THREE.MeshStandardMaterial({ color: 0x3a1d0c, roughness: 0.8 });
  for (const s of [1, -1]) {
    const eye = new THREE.Mesh(new THREE.TorusGeometry(0.06, 0.013, 6, 18, Math.PI), eyeMat);
    const pos = onHead(f.clone().multiplyScalar(0.7).add(side.clone().multiplyScalar(0.42 * s)).add(new THREE.Vector3(0, 0, 0.85)));
    eye.position.copy(pos).add(new THREE.Vector3(0, 0, 0.005));
    eye.rotation.z = faceAng + Math.PI / 2; // closed, content arcs
    group.add(eye);
  }
  group.add(nose);

  // Front paws tucked under the chin
  const pawMat = new THREE.MeshStandardMaterial({ color: cream, roughness: 0.9 });
  for (const [x, y] of [[-0.18, -0.36], [-0.12, -0.62]]) {
    const paw = new THREE.Mesh(blob(0.15, 0.1, 0.08, 16), pawMat);
    paw.position.set(x, y, 0.06);
    paw.rotation.z = -0.2;
    group.add(paw);
  }

  // Tail from the rump, wrapping around the front under the chin (pivot at its base for the sway)
  const base = new THREE.Vector3(startP.x - 0.2, startP.y - 0.05, 0.1);
  const pts = [
    [base.x, base.y], [-0.78, -0.42], [-0.6, -0.74], [-0.25, -0.88], [0.12, -0.86], [0.42, -0.74],
  ].map(([x, y]) => new THREE.Vector3(x - base.x, y - base.y, 0));
  const tailCurve = new THREE.CatmullRomCurve3(pts);
  const tailGeo = new THREE.TubeGeometry(tailCurve, 60, 0.11, 14, false);
  // taper toward the tip
  {
    const p = tailGeo.attributes.position;
    const segs = 61, radialT = 15;
    const v = new THREE.Vector3();
    for (let i = 0; i < segs; i++) {
      const t = i / (segs - 1);
      const center = tailCurve.getPointAt(t);
      const k = 1 - t * 0.4;
      for (let j = 0; j < radialT; j++) {
        const idx = i * radialT + j;
        v.fromBufferAttribute(p, idx).sub(center).multiplyScalar(k).add(center);
        p.setXYZ(idx, v.x, v.y, v.z);
      }
    }
    tailGeo.computeVertexNormals();
  }
  const tipStart = tailCurve.getPointAt(0.86);
  const tail = furPart(tailGeo, [0, 0, 0], 0, (v) => {
    const c = ginger.clone();
    const d = Math.hypot(v.x, v.y);
    c.lerp(stripe, soft(Math.sin(d * 20), 0.2, 0.8) * 0.6);
    if (Math.hypot(v.x - tipStart.x, v.y - tipStart.y) < 0.2 && v.x > tipStart.x - 0.05) c.lerp(cream, 0.65); // pale tip
    return c;
  }) as THREE.Mesh;
  tail.position.copy(base);
  group.add(tail);

  return { group: shadowed(group), tail };
}

/* ---------------------------------------------------------------- */
/* Miata: 1:18 display model on a plinth under an acrylic case       */
/* ---------------------------------------------------------------- */
export function buildMiataDisplay(env: Env) {
  const group = new THREE.Group();

  // Plinth: black lacquer base with a grey felt top
  const plinth = new THREE.Mesh(
    new RoundedBoxGeometry(2.1, 1.16, 0.16, 3, 0.03),
    withEnv(new THREE.MeshStandardMaterial({ color: 0x141414, roughness: 0.25, metalness: 0.1 }), env, 0.6)
  );
  plinth.position.z = 0.06;
  const felt = new THREE.Mesh(new THREE.PlaneGeometry(1.94, 1.0), new THREE.MeshStandardMaterial({ color: 0x3b3b3e, roughness: 1 }));
  felt.position.z = 0.142;
  group.add(plinth, felt);

  // Brass name plate on the front edge
  const plateTex = canvasTex(512, 96, (g) => {
    const grd = g.createLinearGradient(0, 0, 512, 96);
    grd.addColorStop(0, "#b8913f"); grd.addColorStop(0.5, "#ecd28c"); grd.addColorStop(1, "#a9822f");
    g.fillStyle = grd; g.fillRect(0, 0, 512, 96);
    g.fillStyle = "#4a3410"; g.font = "600 34px Georgia, serif"; g.textAlign = "center"; g.textBaseline = "middle";
    g.fillText("NA ROADSTER  ·  1989", 256, 50);
  });
  const plate = new THREE.Mesh(new THREE.PlaneGeometry(0.7, 0.13), withEnv(new THREE.MeshStandardMaterial({ map: plateTex, metalness: 0.6, roughness: 0.35 }), env, 0.8));
  plate.position.set(0, -0.535, 0.146);
  group.add(plate);

  // The car itself (sits on the felt), on its own turntable group
  const car = new THREE.Group();
  car.position.z = 0.145;
  group.add(car);

  const red = withEnv(new THREE.MeshStandardMaterial({ color: 0xb5121b, roughness: 0.18, metalness: 0.35 }), env, 1.0);
  const black = new THREE.MeshStandardMaterial({ color: 0x151515, roughness: 0.7 });
  const tan = new THREE.MeshStandardMaterial({ color: 0x8a6a4a, roughness: 0.8 });
  const glass = withEnv(new THREE.MeshStandardMaterial({ color: 0x222831, roughness: 0.05, metalness: 0.6, transparent: true, opacity: 0.85 }), env, 1.4);
  const chrome = withEnv(new THREE.MeshStandardMaterial({ color: 0xdedede, roughness: 0.15, metalness: 1 }), env, 1.2);

  // Wheels first (body covers most of them from above)
  const tyre = new THREE.CylinderGeometry(0.15, 0.15, 0.11, 24);
  const rim = new THREE.CylinderGeometry(0.1, 0.1, 0.115, 6);
  for (const x of [-0.5, 0.5]) for (const y of [-0.31, 0.31]) {
    const w = new THREE.Mesh(tyre, black);
    w.position.set(x, y, 0.15);
    const r = new THREE.Mesh(rim, chrome);
    r.position.copy(w.position);
    car.add(w, r);
  }

  // Body: rounded top-down outline with the NA's soft nose, extruded with a deep bevel
  const L = 0.82, W = 0.33;
  const s = new THREE.Shape();
  s.moveTo(-L, -W + 0.05);
  s.quadraticCurveTo(-L, -W, -L + 0.08, -W);
  s.lineTo(L - 0.28, -W);
  s.quadraticCurveTo(L + 0.02, -W + 0.02, L + 0.02, -0.12);
  s.quadraticCurveTo(L + 0.05, 0, L + 0.02, 0.12);
  s.quadraticCurveTo(L + 0.02, W - 0.02, L - 0.28, W);
  s.lineTo(-L + 0.08, W);
  s.quadraticCurveTo(-L, W, -L, W - 0.05);
  s.closePath();
  const body = new THREE.Mesh(
    new THREE.ExtrudeGeometry(s, { depth: 0.12, bevelEnabled: true, bevelSize: 0.06, bevelThickness: 0.08, bevelSegments: 6, curveSegments: 24 }),
    red
  );
  body.position.z = 0.1;
  car.add(body);
  const topZ = 0.1 + 0.12 + 0.08;

  // Cockpit: black tub with two tan seats, behind the windscreen
  const cockpit = new THREE.Mesh(new RoundedBoxGeometry(0.5, 0.5, 0.04, 2, 0.08), black);
  cockpit.position.set(-0.12, 0, topZ + 0.002);
  car.add(cockpit);
  for (const y of [-0.12, 0.12]) {
    const seat = new THREE.Mesh(new RoundedBoxGeometry(0.2, 0.17, 0.12, 2, 0.04), tan);
    seat.position.set(-0.2, y, topZ + 0.05);
    car.add(seat);
  }
  // Steering wheel (right-hand drive)
  const wheel = new THREE.Mesh(new THREE.TorusGeometry(0.055, 0.012, 6, 20), black);
  wheel.position.set(0.04, -0.12, topZ + 0.1);
  wheel.rotation.y = Math.PI / 2 - 0.5;
  car.add(wheel);
  // Raked windscreen with a thin frame
  const screen = new THREE.Mesh(new THREE.PlaneGeometry(0.17, 0.58), glass);
  screen.position.set(0.17, 0, topZ + 0.07);
  screen.rotation.y = -0.95;
  car.add(screen);
  // Folded soft top behind the seats
  const top = new THREE.Mesh(new RoundedBoxGeometry(0.16, 0.6, 0.07, 2, 0.03), black);
  top.position.set(-0.43, 0, topZ + 0.02);
  car.add(top);
  // Closed pop-up headlight lids and the "smile" intake
  for (const y of [-0.17, 0.17]) {
    const lid = new THREE.Mesh(new THREE.PlaneGeometry(0.16, 0.12), new THREE.MeshStandardMaterial({ color: 0x9e0f17, roughness: 0.3 }));
    lid.position.set(0.56, y, topZ + 0.003);
    car.add(lid);
    const mirror = new THREE.Mesh(new THREE.SphereGeometry(0.035, 12, 8), black);
    mirror.scale.set(1, 0.6, 0.7);
    mirror.position.set(0.12, y * 2.2, topZ - 0.02);
    car.add(mirror);
  }
  const tail = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.5, 0.05), new THREE.MeshStandardMaterial({ color: 0x8c1018, emissive: 0x400000, roughness: 0.3 }));
  tail.position.set(-L - 0.06, 0, 0.2);
  car.add(tail);
  for (const y of [-0.12, -0.2]) {
    const pipe = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.018, 0.06, 10), chrome);
    pipe.rotation.z = Math.PI / 2;
    pipe.position.set(-L - 0.07, y, 0.13);
    car.add(pipe);
  }
  car.rotation.z = 0.08;
  car.scale.setScalar(1.02);
  shadowed(car);

  // Acrylic cover with bright edges and a diagonal glare
  const caseGeo = new THREE.BoxGeometry(2.0, 1.06, 0.7);
  const caseMat = withEnv(
    new THREE.MeshStandardMaterial({ color: 0xffffff, transparent: true, opacity: 0.07, roughness: 0.02, metalness: 0.1, depthWrite: false }),
    env,
    1.2
  );
  const cover = new THREE.Mesh(caseGeo, caseMat);
  cover.position.z = 0.14 + 0.35;
  cover.renderOrder = 2;
  const edges = new THREE.LineSegments(
    new THREE.EdgesGeometry(caseGeo),
    new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.55 })
  );
  edges.position.copy(cover.position);
  const glareTex = canvasTex(512, 256, (g) => {
    g.clearRect(0, 0, 512, 256);
    for (const [x, w, a] of [[150, 70, 0.22], [250, 22, 0.16]] as const) {
      const grd = g.createLinearGradient(x - w, 0, x + w, 0);
      grd.addColorStop(0, "rgba(255,255,255,0)"); grd.addColorStop(0.5, `rgba(255,255,255,${a})`); grd.addColorStop(1, "rgba(255,255,255,0)");
      g.save(); g.translate(x, 128); g.transform(1, 0, -0.6, 1, 0, 0); g.translate(-x, -128);
      g.fillStyle = grd; g.fillRect(x - w, 0, w * 2, 256); g.restore();
    }
  });
  const glare = new THREE.Mesh(
    new THREE.PlaneGeometry(2.0, 1.06),
    new THREE.MeshBasicMaterial({ map: glareTex, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false })
  );
  glare.position.z = 0.14 + 0.7 + 0.002;
  glare.renderOrder = 3;
  group.add(cover, edges, glare);
  plinth.castShadow = true;
  plinth.receiveShadow = true;

  return { group, car, glare };
}

/* ---------------------------------------------------------------- */
/* Silver: scalloped ceramic trinket dish with a chain, rings, studs */
/* ---------------------------------------------------------------- */
export function buildJewelryDish(env: Env) {
  const group = new THREE.Group();
  const scallop = (R: number, sx: number, sy: number, n = 12, depth = 0.045) => {
    const pts: THREE.Vector2[] = [];
    for (let i = 0; i <= 120; i++) {
      const a = (i / 120) * Math.PI * 2;
      const r = R * (1 + depth * Math.cos(n * a));
      pts.push(new THREE.Vector2(Math.cos(a) * r * sx, Math.sin(a) * r * sy));
    }
    return pts;
  };
  const ceramic = withEnv(new THREE.MeshStandardMaterial({ color: 0x2c3d63, roughness: 0.2 }), env, 0.8);
  const goldLine = withEnv(new THREE.MeshStandardMaterial({ color: 0xcfa75a, metalness: 1, roughness: 0.25 }), env, 1.1);

  const baseShape = new THREE.Shape(scallop(0.9, 1, 0.82));
  const base = new THREE.Mesh(new THREE.ExtrudeGeometry(baseShape, { depth: 0.04, bevelEnabled: true, bevelSize: 0.02, bevelThickness: 0.02, bevelSegments: 3 }), ceramic);
  base.position.z = -0.02;
  const wallShape = new THREE.Shape(scallop(0.9, 1, 0.82));
  wallShape.holes.push(new THREE.Path(scallop(0.78, 1, 0.8).reverse()));
  const wall = new THREE.Mesh(new THREE.ExtrudeGeometry(wallShape, { depth: 0.12, bevelEnabled: true, bevelSize: 0.025, bevelThickness: 0.03, bevelSegments: 4 }), ceramic);
  wall.position.z = 0.0;
  const rimShape = new THREE.Shape(scallop(0.865, 1, 0.815));
  rimShape.holes.push(new THREE.Path(scallop(0.835, 1, 0.815).reverse()));
  const rim = new THREE.Mesh(new THREE.ShapeGeometry(rimShape, 4), goldLine);
  rim.position.z = 0.152;
  group.add(base, wall, rim);
  // Soft blue hand-painted flower in the centre of the dish
  const floorTex = canvasTex(512, 512, (g) => {
    g.fillStyle = "#2c3d63"; g.fillRect(0, 0, 512, 512);
    g.strokeStyle = "rgba(240,228,205,0.6)"; g.lineWidth = 5;
    for (let i = 0; i < 8; i++) {
      g.save(); g.translate(256, 256); g.rotate((i / 8) * Math.PI * 2);
      g.beginPath(); g.ellipse(0, -70, 26, 60, 0, 0, Math.PI * 2); g.stroke(); g.restore();
    }
    g.fillStyle = "rgba(240,228,205,0.6)"; g.beginPath(); g.arc(256, 256, 18, 0, Math.PI * 2); g.fill();
  });
  const floor = new THREE.Mesh(new THREE.CircleGeometry(0.66, 48), withEnv(new THREE.MeshStandardMaterial({ map: floorTex, roughness: 0.2 }), env, 0.8));
  floor.scale.y = 0.98;
  floor.position.z = 0.062;
  group.add(floor);

  const silver = withEnv(new THREE.MeshStandardMaterial({ color: 0xe8eaee, metalness: 1, roughness: 0.14 }), env, 1.5);

  // Fine chain pooled in the dish and slipping over the rim, built from instanced links
  const chainCurve = new THREE.CatmullRomCurve3(
    [
      [-1.3, -0.5, -0.01], [-1.05, -0.36, 0.06], [-0.86, -0.3, 0.16], [-0.6, -0.3, 0.08], [-0.2, -0.42, 0.08], [0.18, -0.3, 0.08],
      [0.42, 0.02, 0.08], [0.3, 0.38, 0.08], [-0.05, 0.48, 0.08], [-0.42, 0.3, 0.08], [-0.5, 0.0, 0.08],
      [-0.25, -0.12, 0.085], [0.1, 0.1, 0.09], [0.0, 0.28, 0.09],
    ].map(([x, y, z]) => new THREE.Vector3(x, y, z)),
    false,
    "catmullrom",
    0.4
  );
  const linkLen = 0.034;
  const count = Math.floor(chainCurve.getLength() / linkLen);
  const linkGeo = new THREE.TorusGeometry(0.016, 0.0055, 6, 12);
  linkGeo.scale(1.35, 1, 1);
  const links = new THREE.InstancedMesh(linkGeo, silver, count);
  const m = new THREE.Matrix4(), q = new THREE.Quaternion(), sc = new THREE.Vector3(1, 1, 1);
  const up = new THREE.Vector3(0, 0, 1);
  for (let i = 0; i < count; i++) {
    const t = i / count;
    const p = chainCurve.getPointAt(t);
    const tan = chainCurve.getTangentAt(t).normalize();
    const n = new THREE.Vector3().crossVectors(up, tan).normalize();
    const b = new THREE.Vector3().crossVectors(tan, n);
    const basis = i % 2 === 0 ? new THREE.Matrix4().makeBasis(tan, n, b) : new THREE.Matrix4().makeBasis(tan, b, n.clone().negate());
    q.setFromRotationMatrix(basis);
    m.compose(p, q, sc);
    links.setMatrixAt(i, m);
  }
  links.castShadow = true;
  group.add(links);

  // Crescent moon pendant with a tiny star, hanging from the end of the chain
  const end = chainCurve.getPointAt(1);
  const moon = new THREE.Shape();
  moon.absarc(0, 0, 0.11, 0, Math.PI * 2, false);
  const bite = new THREE.Path();
  bite.absarc(0.05, 0.03, 0.09, 0, Math.PI * 2, true);
  moon.holes.push(bite);
  const moonMesh = new THREE.Mesh(new THREE.ExtrudeGeometry(moon, { depth: 0.015, bevelEnabled: true, bevelSize: 0.008, bevelThickness: 0.008, bevelSegments: 2, curveSegments: 32 }), silver);
  moonMesh.position.set(end.x - 0.02, end.y + 0.1, 0.075);
  moonMesh.rotation.z = 0.5;
  const star = new THREE.Shape();
  for (let i = 0; i <= 10; i++) {
    const a = (i / 10) * Math.PI * 2 + Math.PI / 2, r = i % 2 === 0 ? 0.035 : 0.015;
    if (i === 0) star.moveTo(Math.cos(a) * r, Math.sin(a) * r);
    else star.lineTo(Math.cos(a) * r, Math.sin(a) * r);
  }
  const starMesh = new THREE.Mesh(new THREE.ExtrudeGeometry(star, { depth: 0.01, bevelEnabled: true, bevelSize: 0.004, bevelThickness: 0.004, bevelSegments: 1 }), silver);
  starMesh.position.set(end.x + 0.1, end.y + 0.16, 0.078);
  group.add(moonMesh, starMesh);

  // Rings: plain band, twisted rope, and one with a little pearl
  const band = new THREE.Mesh(new THREE.TorusGeometry(0.12, 0.024, 16, 48), silver);
  band.position.set(0.32, -0.42, 0.09);
  band.rotation.set(0.15, 0.1, 0);
  class RopeCurve extends THREE.Curve<THREE.Vector3> {
    phase: number;
    constructor(phase: number) { super(); this.phase = phase; }
    getPoint(t: number, target = new THREE.Vector3()) {
      const a = (t + this.phase) * Math.PI * 2;
      const w = Math.sin(a * 14) * 0.012;
      return target.set(Math.cos(a) * (0.12 + w), Math.sin(a) * (0.12 + w), Math.cos(a * 14) * 0.012);
    }
  }
  const rope = new THREE.Group();
  rope.add(new THREE.Mesh(new THREE.TubeGeometry(new RopeCurve(0), 220, 0.014, 6, true), silver));
  rope.add(new THREE.Mesh(new THREE.TubeGeometry(new RopeCurve(1 / 28), 220, 0.014, 6, true), silver));
  rope.position.set(0.5, 0.28, 0.1);
  rope.rotation.set(-0.12, 0.2, 0);
  const pearlRing = new THREE.Group();
  pearlRing.add(new THREE.Mesh(new THREE.TorusGeometry(0.105, 0.017, 12, 40), silver));
  const pearl = new THREE.Mesh(
    new THREE.SphereGeometry(0.05, 24, 16),
    withEnv(new THREE.MeshStandardMaterial({ color: 0xfbf6ee, roughness: 0.18, metalness: 0.05, emissive: 0x1a1612 }), env, 0.9)
  );
  pearl.position.set(0, 0.12, 0.03);
  pearlRing.add(pearl);
  pearlRing.position.set(-0.3, 0.22, 0.09);
  pearlRing.rotation.set(0.2, -0.25, 0.4);

  // Pair of small stud earrings
  for (const [x, y] of [[0.05, -0.62], [0.17, -0.56]]) {
    const stud = new THREE.Mesh(new THREE.SphereGeometry(0.03, 16, 12), silver);
    stud.position.set(x, y, 0.09);
    group.add(stud);
  }
  group.add(band, rope, pearlRing);
  shadowed(group);

  // Tiny sparkles (animated by the canvas)
  const sparkles = new THREE.Group();
  const sparkShape = new THREE.Shape();
  for (let i = 0; i <= 8; i++) {
    const a = (i / 8) * Math.PI * 2, r = i % 2 === 0 ? 0.07 : 0.012;
    if (i === 0) sparkShape.moveTo(Math.cos(a) * r, Math.sin(a) * r);
    else sparkShape.lineTo(Math.cos(a) * r, Math.sin(a) * r);
  }
  const sparkGeo = new THREE.ShapeGeometry(sparkShape);
  for (const [x, y] of [[0.4, -0.36], [-0.24, 0.3], [0.56, 0.33], [end.x, end.y + 0.12]]) {
    const sp = new THREE.Mesh(sparkGeo, new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.8, blending: THREE.AdditiveBlending, depthWrite: false }));
    sp.position.set(x, y, 0.2);
    sparkles.add(sp);
  }
  group.add(sparkles);
  return { group, sparkles };
}

/* ---------------------------------------------------------------- */
/* Matcha: speckled handmade cup with latte art on a wooden saucer   */
/* ---------------------------------------------------------------- */
export function buildMatcha(env: Env) {
  const group = new THREE.Group();

  // Wooden saucer with turned rings
  const woodTex = canvasTex(512, 512, (g) => {
    g.fillStyle = "#8a5a34"; g.fillRect(0, 0, 512, 512);
    for (let r = 4; r < 256; r += 3 + Math.random() * 5) {
      g.strokeStyle = `rgba(${60 + Math.random() * 40},${36 + Math.random() * 20},18,${0.12 + Math.random() * 0.2})`;
      g.lineWidth = 1 + Math.random() * 2;
      g.beginPath(); g.arc(256, 256, r, 0, Math.PI * 2); g.stroke();
    }
  });
  const saucer = new THREE.Mesh(
    new THREE.CylinderGeometry(0.98, 0.92, 0.07, 64),
    withEnv(new THREE.MeshStandardMaterial({ map: woodTex, roughness: 0.55 }), env, 0.4)
  );
  saucer.rotation.x = Math.PI / 2;
  saucer.position.z = 0.015;
  group.add(saucer);

  // Bamboo spoon resting on the saucer
  const spoonMat = new THREE.MeshStandardMaterial({ color: 0xd8b27a, roughness: 0.6 });
  const spoon = new THREE.Mesh(new RoundedBoxGeometry(0.62, 0.06, 0.025, 2, 0.012), spoonMat);
  spoon.position.set(0.32, -0.72, 0.07);
  spoon.rotation.z = 0.32;
  const scoop = new THREE.Mesh(new THREE.SphereGeometry(0.06, 16, 8, 0, Math.PI * 2, 0, Math.PI / 2), spoonMat);
  scoop.scale.set(1.3, 1, 0.5);
  scoop.rotation.x = Math.PI;
  scoop.position.set(0.62, -0.62, 0.09);
  group.add(spoon, scoop);

  // Cup: lathe profile (outside up, over the rim, down the inside)
  const prof = [
    [0.0, 0.0], [0.38, 0.0], [0.42, 0.03], [0.4, 0.07], [0.52, 0.14], [0.6, 0.3], [0.63, 0.5], [0.64, 0.66],
    [0.63, 0.7], [0.6, 0.71], [0.58, 0.68], [0.57, 0.5], [0.53, 0.3], [0.45, 0.16], [0.0, 0.14],
  ].map(([r, h]) => new THREE.Vector2(r, h));
  const cupGeo = new THREE.LatheGeometry(prof, 72);
  cupGeo.rotateX(Math.PI / 2);
  // Glaze: raw clay foot, speckled oat glaze, a brown rim where the glaze breaks
  const glaze = canvasTex(256, 1024, (g) => {
    const rows = prof.length - 1;
    const yAt = (i: number) => (1 - i / rows) * 1024; // lathe v runs bottom→top of the profile
    g.fillStyle = "#efe6d6"; g.fillRect(0, 0, 256, 1024);
    g.fillStyle = "#b98a5e"; g.fillRect(0, yAt(3.6), 256, 1024 - yAt(3.6)); // foot
    g.fillStyle = "#8c5a35"; g.fillRect(0, yAt(10.4), 256, yAt(7.4) - yAt(10.4)); // rim break
    const drip = g.createLinearGradient(0, yAt(7.4), 0, yAt(6.2));
    drip.addColorStop(0, "rgba(140,90,53,1)"); drip.addColorStop(1, "rgba(140,90,53,0)");
    g.fillStyle = drip; g.fillRect(0, yAt(7.4), 256, yAt(6.2) - yAt(7.4));
    for (let i = 0; i < 2600; i++) {
      g.fillStyle = `rgba(${70 + Math.random() * 40},${50 + Math.random() * 20},30,${0.25 + Math.random() * 0.5})`;
      const r = Math.random() * 1.6 + 0.4;
      g.beginPath(); g.arc(Math.random() * 256, Math.random() * yAt(3.6), r, 0, Math.PI * 2); g.fill();
    }
  });
  const cupMat = withEnv(new THREE.MeshStandardMaterial({ map: glaze, roughness: 0.32, side: THREE.DoubleSide }), env, 0.6);
  const cup = new THREE.Mesh(cupGeo, cupMat);
  cup.position.z = 0.05;
  group.add(cup);

  // Handle: a small loop on the side
  const handle = new THREE.Mesh(new THREE.TorusGeometry(0.17, 0.05, 12, 24, Math.PI * 1.15), cupMat);
  handle.rotation.set(Math.PI / 2, 0, 0);
  handle.rotation.y = -Math.PI / 2 - 0.25;
  handle.position.set(0.66, 0, 0.42);
  group.add(handle);

  // Latte with a rosetta
  const latte = canvasTex(512, 512, (g) => {
    const grd = g.createRadialGradient(256, 256, 30, 256, 256, 256);
    grd.addColorStop(0, "#5f7f2c"); grd.addColorStop(0.75, "#466a1f"); grd.addColorStop(1, "#2f4c16");
    g.fillStyle = grd; g.fillRect(0, 0, 512, 512);
    // plain matcha: soft froth speckle, no latte art
    for (let i = 0; i < 900; i++) {
      const r = Math.sqrt(Math.random()) * 240, t = Math.random() * Math.PI * 2;
      g.fillStyle = `rgba(${150 + Math.random() * 40},${170 + Math.random() * 30},${90 + Math.random() * 30},${0.08 + Math.random() * 0.12})`;
      g.beginPath(); g.arc(256 + Math.cos(t) * r, 256 + Math.sin(t) * r, 1 + Math.random() * 3, 0, Math.PI * 2); g.fill();
    }
    const edge = g.createRadialGradient(256, 256, 200, 256, 256, 256);
    edge.addColorStop(0, "rgba(0,0,0,0)"); edge.addColorStop(1, "rgba(30,50,10,0.35)");
    g.fillStyle = edge; g.fillRect(0, 0, 512, 512);
  });
  const liquid = new THREE.Mesh(new THREE.CircleGeometry(0.565, 64), new THREE.MeshStandardMaterial({ map: latte, roughness: 0.35 }));
  liquid.position.z = 0.05 + 0.6;
  group.add(liquid);

  shadowed(group);
  liquid.castShadow = false;
  return { group, liquid };
}

/* ---------------------------------------------------------------- */
/* Soft additive light pools (lamp at night, laptop screen glow)    */
/* ---------------------------------------------------------------- */
export function buildGlowPool(color: string, w: number, h: number) {
  const tex = canvasTex(256, 256, (g) => {
    const grd = g.createRadialGradient(128, 128, 0, 128, 128, 128);
    grd.addColorStop(0, color);
    grd.addColorStop(0.45, color.replace(/[\d.]+\)$/, "0.35)"));
    grd.addColorStop(1, "rgba(0,0,0,0)");
    g.fillStyle = grd; g.fillRect(0, 0, 256, 256);
  });
  const mesh = new THREE.Mesh(
    new THREE.PlaneGeometry(w, h),
    new THREE.MeshBasicMaterial({ map: tex, transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false })
  );
  return mesh;
}

/* ---------------------------------------------------------------- */
/* Chess: boxwood queen and ebony knight lying down, a pawn standing */
/* ---------------------------------------------------------------- */
export function buildChess(env: Env) {
  const group = new THREE.Group();
  const ivory = withEnv(new THREE.MeshStandardMaterial({ color: 0xeee2c8, roughness: 0.28 }), env, 0.7);
  const ebony = withEnv(new THREE.MeshStandardMaterial({ color: 0x120e0c, roughness: 0.3 }), env, 0.6);
  const felt = new THREE.MeshStandardMaterial({ color: 0x2f5a3a, roughness: 1 });

  const lathe = (pts: number[][], mat: THREE.Material) => {
    const g = new THREE.LatheGeometry(pts.map(([r, h]) => new THREE.Vector2(r, h)), 48);
    return new THREE.Mesh(g, mat);
  };
  // Shared Staunton base (radius ~0.24), built along +Y
  const basePts = [
    [0, 0], [0.24, 0], [0.245, 0.03], [0.235, 0.06], [0.2, 0.08], [0.205, 0.1], [0.17, 0.13], [0.13, 0.16],
  ];
  const feltDisc = () => {
    const d = new THREE.Mesh(new THREE.CylinderGeometry(0.235, 0.235, 0.012, 40), felt);
    d.position.y = -0.006;
    return d;
  };

  // Queen: base, slim waist, collar, flared cup, coronet and finial
  const queen = new THREE.Group();
  queen.add(lathe([
    ...basePts, [0.11, 0.3], [0.085, 0.5], [0.075, 0.62], [0.12, 0.66], [0.13, 0.68], [0.09, 0.7], [0.085, 0.74],
    [0.12, 0.84], [0.15, 0.9], [0.14, 0.92], [0.1, 0.9], [0, 0.9],
  ], ivory), feltDisc());
  for (let i = 0; i < 10; i++) {
    const a = (i / 10) * Math.PI * 2;
    const ball = new THREE.Mesh(new THREE.SphereGeometry(0.024, 10, 8), ivory);
    ball.position.set(Math.cos(a) * 0.13, 0.925, Math.sin(a) * 0.13);
    queen.add(ball);
  }
  const fin = new THREE.Mesh(new THREE.SphereGeometry(0.05, 16, 12), ivory);
  fin.position.y = 0.98;
  queen.add(fin);
  // lying on its side, axis along X, resting on its widest radius
  queen.rotation.z = -Math.PI / 2;
  queen.position.set(-0.5, 0.32, 0.22);
  queen.rotation.x = 0.0;
  const qPivot = new THREE.Group();
  qPivot.add(queen);
  qPivot.rotation.z = 0.12;
  group.add(qPivot);

  // Knight: lathe base plus a carved head silhouette, lying flat so the profile faces up
  const knight = new THREE.Group();
  knight.add(lathe([...basePts, [0.15, 0.2], [0, 0.2]], ebony), feltDisc());
  const hs = new THREE.Shape();
  const V = (x: number, y: number) => new THREE.Vector2(x, y);
  hs.moveTo(0.2, 0);
  hs.lineTo(-0.2, 0);
  hs.splineThru([V(-0.25, 0.2), V(-0.23, 0.42), V(-0.17, 0.6), V(-0.08, 0.75)]); // back of the neck and mane
  hs.lineTo(-0.03, 0.8);
  hs.lineTo(0.03, 0.9); // ear
  hs.lineTo(0.08, 0.8);
  hs.splineThru([V(0.17, 0.77), V(0.3, 0.7), V(0.43, 0.58), V(0.52, 0.47)]); // forehead to nose
  hs.quadraticCurveTo(0.56, 0.4, 0.5, 0.37); // muzzle
  hs.lineTo(0.42, 0.36);
  hs.lineTo(0.36, 0.4); // mouth
  hs.quadraticCurveTo(0.24, 0.4, 0.14, 0.47); // jaw to cheek
  hs.quadraticCurveTo(0.08, 0.38, 0.12, 0.24); // throat
  hs.quadraticCurveTo(0.17, 0.1, 0.2, 0);
  hs.closePath();
  const headGeo = new THREE.ExtrudeGeometry(hs, { depth: 0.2, bevelEnabled: true, bevelSize: 0.014, bevelThickness: 0.035, bevelSegments: 4, curveSegments: 20 });
  headGeo.translate(0, 0.14, -0.1);
  knight.add(new THREE.Mesh(headGeo, ebony));
  // eye + mane notches as tiny ivory inlays
  const eye = new THREE.Mesh(new THREE.SphereGeometry(0.018, 8, 6), ivory);
  eye.position.set(0.24, 0.14 + 0.64, 0.14);
  knight.add(eye);
  knight.rotation.z = Math.PI / 2; // base points +X, head toward -X
  knight.position.set(0.45, -0.33, 0.24);
  const kPivot = new THREE.Group();
  kPivot.add(knight);
  kPivot.rotation.z = -0.2;
  group.add(kPivot);

  // Pawn standing upright (seen from above: a crowned dome)
  const pawn = lathe([[0, 0], [0.19, 0], [0.19, 0.03], [0.16, 0.06], [0.12, 0.09], [0.08, 0.2], [0.1, 0.24], [0.06, 0.26], [0.06, 0.28], [0, 0.28]], ebony);
  pawn.rotation.x = Math.PI / 2;
  pawn.position.set(0.62, 0.42, -0.02);
  const pawnHead = new THREE.Mesh(new THREE.SphereGeometry(0.1, 24, 16), ebony);
  pawnHead.position.set(0.62, 0.42, 0.34);
  group.add(pawn, pawnHead);

  return shadowed(group);
}

/* ---------------------------------------------------------------- */
/* AirPods Pro: closed glossy case lying on its back, two buds out   */
/* ---------------------------------------------------------------- */
export function buildAirpods(env: Env) {
  const group = new THREE.Group();
  const white = withEnv(new THREE.MeshStandardMaterial({ color: 0xf7f7f5, roughness: 0.16 }), env, 0.9);
  const matte = withEnv(new THREE.MeshStandardMaterial({ color: 0xecebe8, roughness: 0.4 }), env, 0.6);
  const tipMat = new THREE.MeshStandardMaterial({ color: 0xd9d9dc, roughness: 0.75 });
  const dark = new THREE.MeshStandardMaterial({ color: 0x1e1e20, roughness: 0.5 });
  const steel = withEnv(new THREE.MeshStandardMaterial({ color: 0xc8c9cc, metalness: 1, roughness: 0.25 }), env, 1.1);

  // Case
  const body = new THREE.Mesh(new RoundedBoxGeometry(0.98, 0.74, 0.3, 8, 0.15), white);
  body.position.z = 0.13;
  group.add(body);
  const seam = new THREE.Mesh(new THREE.PlaneGeometry(0.9, 0.008), new THREE.MeshBasicMaterial({ color: 0xb9b9bb }));
  seam.position.set(0, 0.17, 0.281);
  const led = new THREE.Mesh(new THREE.CircleGeometry(0.014, 16), new THREE.MeshBasicMaterial({ color: 0x7ee08a }));
  led.position.set(0, -0.02, 0.281);
  group.add(seam, led);
  // speaker holes + lanyard loop on the side
  for (let i = 0; i < 5; i++) {
    const h = new THREE.Mesh(new THREE.CircleGeometry(0.006, 8), new THREE.MeshBasicMaterial({ color: 0x8d8d90 }));
    h.position.set(-0.08 + i * 0.04, -0.32, 0.25);
    group.add(h);
  }
  const loop = new THREE.Mesh(new THREE.TorusGeometry(0.03, 0.01, 8, 16), steel);
  loop.position.set(0.5, 0.05, 0.14);
  loop.rotation.y = Math.PI / 2;
  group.add(loop);

  // Buds
  const bud = (mirror: 1 | -1) => {
    const b = new THREE.Group();
    const head = new THREE.Mesh(new THREE.SphereGeometry(1, 28, 20), white);
    head.scale.set(0.15, 0.13, 0.11);
    const tip = new THREE.Mesh(new THREE.SphereGeometry(1, 20, 14), tipMat);
    tip.scale.set(0.085, 0.085, 0.07);
    tip.position.set(-0.12 * mirror, 0.06, 0.0);
    const tipHole = new THREE.Mesh(new THREE.CircleGeometry(0.03, 12), dark);
    tipHole.position.set(-0.17 * mirror, 0.08, 0.04);
    tipHole.rotation.y = -0.9 * mirror;
    const sensor = new THREE.Mesh(new THREE.CircleGeometry(0.035, 16), dark);
    sensor.scale.set(1.2, 0.8, 1);
    sensor.position.set(0.04 * mirror, 0.0, 0.112);
    const stem = new THREE.Mesh(new THREE.CapsuleGeometry(0.04, 0.24, 6, 14), matte);
    stem.rotation.z = 0.25 * mirror;
    stem.position.set(0.06 * mirror, -0.2, -0.02);
    stem.scale.set(1, 1, 0.85);
    const grille = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.012, 14), steel);
    grille.position.set(0.1 * mirror, -0.37, -0.02);
    grille.rotation.z = 0.25 * mirror;
    b.add(head, tip, tipHole, sensor, stem, grille);
    return shadowed(b);
  };
  const L = bud(1);
  L.position.set(0.82, 0.28, 0.1);
  L.rotation.z = 0.6;
  const R = bud(-1);
  R.position.set(-0.78, -0.42, 0.1);
  R.rotation.z = -2.4;
  group.add(L, R);
  shadowed(body);
  return group;
}

/* ---------------------------------------------------------------- */
/* Frosted polypropylene pencil case (open tray) + mini eraser       */
/* ---------------------------------------------------------------- */
export const roundedRect = (w: number, h: number, r: number) => {
  const s = new THREE.Shape();
  const x = -w / 2, y = -h / 2;
  s.moveTo(x + r, y);
  s.lineTo(x + w - r, y);
  s.quadraticCurveTo(x + w, y, x + w, y + r);
  s.lineTo(x + w, y + h - r);
  s.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  s.lineTo(x + r, y + h);
  s.quadraticCurveTo(x, y + h, x, y + h - r);
  s.lineTo(x, y + r);
  s.quadraticCurveTo(x, y, x + r, y);
  return s;
};

export function buildPencilCase(env: Env) {
  const group = new THREE.Group();
  const W = 3.62, H = 0.98, wall = 0.04, height = 0.26, r = 0.12;
  const frosted = withEnv(
    new THREE.MeshStandardMaterial({ color: 0xcfd6dc, roughness: 0.45, transparent: true, opacity: 0.7, depthWrite: false }),
    env,
    0.6
  );
  // Lid tucked underneath, peeking out a little (the case sits on it)
  const lid = new THREE.Mesh(new THREE.ExtrudeGeometry(roundedRect(W + 0.04, H + 0.04, r), { depth: 0.03, bevelEnabled: false }), frosted);
  lid.position.set(0.1, -0.09, -0.02);
  lid.rotation.z = 0.025;
  group.add(lid);
  // Floor
  const floor = new THREE.Mesh(new THREE.ShapeGeometry(roundedRect(W - wall, H - wall, r)), frosted);
  floor.position.z = 0.012;
  group.add(floor);
  // Walls
  const ring = roundedRect(W, H, r);
  const hole = roundedRect(W - wall * 2, H - wall * 2, r - wall);
  ring.holes.push(new THREE.Path(hole.getPoints(24).reverse()));
  const walls = new THREE.Mesh(
    new THREE.ExtrudeGeometry(ring, { depth: height, bevelEnabled: true, bevelSize: 0.008, bevelThickness: 0.008, bevelSegments: 2, curveSegments: 16 }),
    frosted
  );
  walls.position.z = 0.012;
  group.add(walls);
  // Brighter rim where the plastic catches the light
  const rimRing = roundedRect(W, H, r);
  rimRing.holes.push(new THREE.Path(hole.getPoints(24).reverse()));
  const rim = new THREE.Mesh(new THREE.ShapeGeometry(rimRing, 16), new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.55, depthWrite: false }));
  rim.position.z = 0.012 + height + 0.01;
  group.add(rim);
  // Soft grey outline so the milky plastic reads against the light mat
  const outline = new THREE.LineSegments(
    new THREE.EdgesGeometry(new THREE.ExtrudeGeometry(roundedRect(W, H, r), { depth: height, bevelEnabled: false, curveSegments: 8 }), 30),
    new THREE.LineBasicMaterial({ color: 0x7d878f, transparent: true, opacity: 0.75 })
  );
  outline.position.z = 0.012;
  group.add(outline);
  walls.receiveShadow = true;
  floor.receiveShadow = true;

  // Mini plastic eraser with a blue paper sleeve
  const eraser = new THREE.Group();
  const body = new THREE.Mesh(new RoundedBoxGeometry(0.46, 0.22, 0.12, 3, 0.025), withEnv(new THREE.MeshStandardMaterial({ color: 0xf6f6f2, roughness: 0.7 }), env, 0.3));
  const sleeveTex = canvasTex(256, 128, (g) => {
    g.fillStyle = "#1d4ea3"; g.fillRect(0, 0, 256, 128);
    g.fillStyle = "#ffffff"; g.fillRect(0, 22, 256, 6); g.fillRect(0, 100, 256, 6);
    g.fillStyle = "rgba(255,255,255,0.9)"; g.fillRect(28, 50, 120, 26);
    g.fillStyle = "#111"; g.fillRect(160, 50, 64, 26);
  });
  const sleeve = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.232, 0.132), new THREE.MeshStandardMaterial({ map: sleeveTex, roughness: 0.8 }));
  sleeve.position.x = -0.03;
  eraser.add(body, sleeve);
  eraser.position.set(1.48, 0.02, 0.075);
  eraser.rotation.z = 0.08;
  group.add(shadowed(eraser));
  return group;
}

/* ---------------------------------------------------------------- */
/* Globe: vintage parchment globe on a walnut base with a brass arc  */
/* ---------------------------------------------------------------- */
// Very rough continent outlines as [lon, lat] (stylised, not to scale)
const CONTINENTS: number[][][] = [
  [[-165, 65], [-140, 70], [-95, 72], [-75, 62], [-60, 50], [-80, 30], [-97, 18], [-87, 15], [-105, 22], [-118, 33], [-125, 48], [-150, 58]], // N. America
  [[-45, 60], [-25, 70], [-20, 82], [-60, 82], [-55, 70]], // Greenland
  [[-80, 10], [-60, 8], [-35, -7], [-40, -22], [-58, -38], [-70, -54], [-75, -40], [-72, -15], [-81, -5]], // S. America
  [[-10, 36], [0, 44], [-5, 50], [8, 57], [20, 70], [40, 68], [60, 70], [90, 76], [130, 72], [170, 68], [178, 62], [140, 55], [130, 42], [122, 30], [108, 20], [100, 8], [92, 22], [78, 8], [70, 22], [57, 25], [48, 30], [35, 36], [27, 40], [15, 38], [5, 43]], // Eurasia
  [[-17, 21], [-10, 35], [10, 37], [32, 31], [43, 12], [51, 11], [40, -15], [32, -28], [20, -35], [12, -18], [8, 4], [-8, 5], [-16, 12]], // Africa
  [[44, -13], [50, -15], [49, -25], [44, -24]], // Madagascar
  [[114, -22], [122, -18], [131, -12], [142, -11], [153, -27], [146, -39], [135, -35], [115, -34]], // Australia
  [[130, 31], [136, 34], [141, 41], [140, 36], [133, 33]], // Japan
  [[95, 5], [105, -6], [120, -9], [118, 0], [108, 2]], // Indonesia
];

export function buildGlobe(env: Env) {
  const group = new THREE.Group();
  const walnut = withEnv(new THREE.MeshStandardMaterial({ color: 0x4a2a14, roughness: 0.4 }), env, 0.5);
  const brass = withEnv(new THREE.MeshStandardMaterial({ color: 0xc9a14a, metalness: 1, roughness: 0.3 }), env, 1.1);

  // Base: turned walnut foot with a brass ring
  const foot = new THREE.Mesh(new THREE.CylinderGeometry(0.52, 0.6, 0.12, 48), walnut);
  foot.rotation.x = Math.PI / 2;
  foot.position.z = 0.06;
  const ring = new THREE.Mesh(new THREE.TorusGeometry(0.53, 0.02, 8, 48), brass);
  ring.position.z = 0.12;
  const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.08, 0.32, 16), walnut);
  stem.rotation.x = Math.PI / 2;
  stem.position.z = 0.28;
  group.add(foot, ring, stem);

  // Sphere with an aged map texture
  const tex = canvasTex(1024, 512, (g) => {
    const sea = g.createLinearGradient(0, 0, 0, 512);
    sea.addColorStop(0, "#3f6f78"); sea.addColorStop(0.5, "#2f5d68"); sea.addColorStop(1, "#3f6f78");
    g.fillStyle = sea; g.fillRect(0, 0, 1024, 512);
    const X = (lon: number) => ((lon + 180) / 360) * 1024, Y = (lat: number) => ((90 - lat) / 180) * 512;
    // graticule
    g.strokeStyle = "rgba(230,220,190,0.25)"; g.lineWidth = 1;
    for (let lon = -180; lon <= 180; lon += 30) { g.beginPath(); g.moveTo(X(lon), 0); g.lineTo(X(lon), 512); g.stroke(); }
    for (let lat = -60; lat <= 60; lat += 30) { g.beginPath(); g.moveTo(0, Y(lat)); g.lineTo(1024, Y(lat)); g.stroke(); }
    g.strokeStyle = "rgba(150,60,40,0.45)"; g.setLineDash([8, 6]);
    g.beginPath(); g.moveTo(0, Y(0)); g.lineTo(1024, Y(0)); g.stroke(); g.setLineDash([]);
    // land
    for (const poly of CONTINENTS) {
      g.beginPath();
      poly.forEach(([lon, lat], i) => (i ? g.lineTo(X(lon), Y(lat)) : g.moveTo(X(lon), Y(lat))));
      g.closePath();
      g.fillStyle = "#e7d6a8"; g.fill();
      g.strokeStyle = "#8a6a3a"; g.lineWidth = 2; g.stroke();
    }
    // ice caps
    g.fillStyle = "#efe9dc"; g.fillRect(0, 0, 1024, 18); g.fillRect(0, 494, 1024, 18);
    // aged paper speckle
    for (let i = 0; i < 4000; i++) {
      g.fillStyle = `rgba(110,80,40,${Math.random() * 0.08})`;
      g.fillRect(Math.random() * 1024, Math.random() * 512, 2, 2);
    }
  });
  const tilt = new THREE.Group();
  tilt.position.z = 0.98;
  tilt.rotation.set(Math.PI / 2 - 0.25, 0, 0.41); // axis tipped like Earth's
  const sphere = new THREE.Mesh(new THREE.SphereGeometry(0.52, 48, 32), withEnv(new THREE.MeshStandardMaterial({ map: tex, roughness: 0.45 }), env, 0.5));
  sphere.name = "globeSphere";
  tilt.add(sphere);
  // Brass meridian half-ring and pole pins
  const meridian = new THREE.Mesh(new THREE.TorusGeometry(0.6, 0.022, 8, 64, Math.PI * 1.15), brass);
  meridian.rotation.set(0, Math.PI / 2, -Math.PI / 2 - 0.27);
  tilt.add(meridian);
  for (const s of [1, -1]) {
    const pin = new THREE.Mesh(new THREE.SphereGeometry(0.035, 12, 8), brass);
    pin.position.y = 0.58 * s;
    tilt.add(pin);
  }
  group.add(tilt);
  return { group: shadowed(group), sphere };
}

/* ---------------------------------------------------------------- */
/* Journal cover: black leather with a silver cybersigilism emboss  */
/* ---------------------------------------------------------------- */
export function createCybersigilJournalTexture() {
  const W = 1024, H = 1490;
  return canvasTex(W, H, (g) => {
    // leather
    const base = g.createRadialGradient(W / 2, H / 2, 200, W / 2, H / 2, 900);
    base.addColorStop(0, "#1a1512"); base.addColorStop(1, "#080605");
    g.fillStyle = base; g.fillRect(0, 0, W, H);
    for (let i = 0; i < 26000; i++) {
      const v = Math.random();
      g.fillStyle = v > 0.5 ? `rgba(255,240,220,${Math.random() * 0.035})` : `rgba(0,0,0,${Math.random() * 0.25})`;
      const r = Math.random() * 2.2 + 0.4;
      g.beginPath(); g.arc(Math.random() * W, Math.random() * H, r, 0, Math.PI * 2); g.fill();
    }
    // stitched border
    g.strokeStyle = "rgba(180,150,120,0.55)"; g.lineWidth = 3; g.setLineDash([14, 10]);
    g.strokeRect(42, 42, W - 84, H - 84);
    g.setLineDash([]);

    // A tapered thorn stroke from (x0,y0) curving through c to a sharp tip at (x1,y1)
    const thorn = (x0: number, y0: number, cx: number, cy: number, x1: number, y1: number, w: number) => {
      const nx = -(cy - y0), ny = cx - x0, len = Math.hypot(nx, ny) || 1;
      const ox = (nx / len) * w, oy = (ny / len) * w;
      g.beginPath();
      g.moveTo(x0 + ox, y0 + oy);
      g.quadraticCurveTo(cx + ox * 0.6, cy + oy * 0.6, x1, y1);
      g.quadraticCurveTo(cx - ox * 0.6, cy - oy * 0.6, x0 - ox, y0 - oy);
      g.closePath();
      g.fill();
    };
    const C = W / 2;
    const motif = () => {
      // central blade
      g.beginPath();
      g.moveTo(C, 230); g.quadraticCurveTo(C + 26, 720, C, 1260); g.quadraticCurveTo(C - 26, 720, C, 230);
      g.fill();
      // mirrored thorns
      const strokes: [number, number, number, number, number, number, number][] = [
        [C, 400, C + 120, 360, C + 250, 240, 20],
        [C + 70, 380, C + 110, 300, C + 90, 210, 9],
        [C, 520, C + 190, 560, C + 310, 460, 17],
        [C + 210, 545, C + 260, 600, C + 330, 590, 8],
        [C, 690, C + 230, 640, C + 360, 760, 19],
        [C + 250, 680, C + 290, 620, C + 270, 560, 8],
        [C, 760, C + 120, 860, C + 180, 1010, 15],
        [C + 120, 860, C + 230, 880, C + 300, 960, 9],
        [C, 960, C + 170, 990, C + 280, 1120, 16],
        [C, 1110, C + 80, 1190, C + 96, 1330, 11],
        [C + 30, 300, C + 60, 250, C + 40, 180, 7],
      ];
      for (const s of strokes) {
        thorn(...s);
        thorn(2 * C - s[0], s[1], 2 * C - s[2], s[3], 2 * C - s[4], s[5], s[6]);
      }
      // pointed oval halo around the centre
      g.lineWidth = 6;
      g.beginPath();
      g.moveTo(C, 560); g.bezierCurveTo(C + 150, 620, C + 150, 820, C, 900); g.bezierCurveTo(C - 150, 820, C - 150, 620, C, 560);
      g.stroke();
    };
    // debossed shadow, then the silver inlay on top
    g.save(); g.translate(4, 5); g.fillStyle = "rgba(0,0,0,0.6)"; g.strokeStyle = "rgba(0,0,0,0.6)"; motif(); g.restore();
    const silver = g.createLinearGradient(0, 200, W, 1300);
    silver.addColorStop(0, "#f2f2f5"); silver.addColorStop(0.45, "#9a9aa3"); silver.addColorStop(0.7, "#e4e4ea"); silver.addColorStop(1, "#7d7d86");
    g.fillStyle = silver; g.strokeStyle = silver; motif();
    // small name stamp
    g.fillStyle = "rgba(220,220,228,0.75)"; g.font = "500 34px 'JetBrains Mono', monospace"; g.textAlign = "center";
    g.fillText("M Y R I E L L E", C, H - 120);
  });
}
