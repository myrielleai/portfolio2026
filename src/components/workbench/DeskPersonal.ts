import * as THREE from "three";

/* ------------------------------------------------------------------ */
/* Personal desk props: lock screen, photos, pothos, lamp, Mapúa ID     */
/* ------------------------------------------------------------------ */

const tex = (c: HTMLCanvasElement) => {
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 8;
  return t;
};

const canvas = (w: number, h: number) => {
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  return { c, g: c.getContext("2d")! };
};

const grain = (g: CanvasRenderingContext2D, w: number, h: number, amount = 0.06) => {
  const n = Math.floor((w * h) / 30);
  for (let i = 0; i < n; i++) {
    const v = Math.random() > 0.5 ? 255 : 0;
    g.fillStyle = `rgba(${v},${v},${v},${Math.random() * amount})`;
    g.fillRect(Math.random() * w, Math.random() * h, 1.5, 1.5);
  }
};

const roundRect = (g: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) => {
  g.beginPath();
  g.moveTo(x + r, y);
  g.arcTo(x + w, y, x + w, y + h, r);
  g.arcTo(x + w, y + h, x, y + h, r);
  g.arcTo(x, y + h, x, y, r);
  g.arcTo(x, y, x + w, y, r);
  g.closePath();
};

/** Golden-hour seaside scene (used for the frame and the phone wallpaper). */
function paintSunset(g: CanvasRenderingContext2D, w: number, h: number, horizon = 0.62) {
  const sky = g.createLinearGradient(0, 0, 0, h * horizon);
  sky.addColorStop(0, "#5b4a8b");
  sky.addColorStop(0.35, "#c9708a");
  sky.addColorStop(0.7, "#f3a46b");
  sky.addColorStop(1, "#ffd69a");
  g.fillStyle = sky;
  g.fillRect(0, 0, w, h * horizon);
  // soft clouds
  g.save();
  g.filter = `blur(${Math.max(2, w / 120)}px)`;
  g.fillStyle = "rgba(255,214,190,0.55)";
  for (let i = 0; i < 7; i++) {
    g.beginPath();
    g.ellipse(Math.random() * w, h * (0.12 + Math.random() * 0.3), w * (0.12 + Math.random() * 0.15), h * 0.025, 0, 0, Math.PI * 2);
    g.fill();
  }
  g.restore();
  // sun + glow
  const sx = w * 0.62, sy = h * horizon - h * 0.04, sr = Math.min(w, h) * 0.075;
  const glow = g.createRadialGradient(sx, sy, sr * 0.5, sx, sy, sr * 5);
  glow.addColorStop(0, "rgba(255,236,190,0.9)");
  glow.addColorStop(1, "rgba(255,200,140,0)");
  g.fillStyle = glow;
  g.fillRect(0, 0, w, h * horizon);
  g.fillStyle = "#fff1cf";
  g.beginPath();
  g.arc(sx, sy, sr, 0, Math.PI * 2);
  g.fill();
  // far skyline silhouette
  g.fillStyle = "rgba(92,64,96,0.75)";
  let x = 0;
  while (x < w * 0.45) {
    const bw = w * (0.02 + Math.random() * 0.035), bh = h * (0.02 + Math.random() * 0.07);
    g.fillRect(x, h * horizon - bh, bw, bh);
    x += bw + w * 0.004;
  }
  // sea
  const sea = g.createLinearGradient(0, h * horizon, 0, h);
  sea.addColorStop(0, "#e59a74");
  sea.addColorStop(0.4, "#a76f86");
  sea.addColorStop(1, "#4e4a7a");
  g.fillStyle = sea;
  g.fillRect(0, h * horizon, w, h * (1 - horizon));
  // sun reflection
  for (let i = 0; i < 26; i++) {
    const y = h * horizon + (i / 26) * h * (1 - horizon) * 0.9;
    const lw = sr * (1.8 - i * 0.05) * (0.6 + Math.random() * 0.6);
    g.fillStyle = `rgba(255,226,170,${0.65 - i * 0.022})`;
    g.fillRect(sx - lw / 2 + (Math.random() - 0.5) * sr * 0.4, y, lw, Math.max(1.5, h / 260));
  }
  // little boat
  g.fillStyle = "rgba(60,40,60,0.85)";
  const bx = w * 0.28, by = h * (horizon + 0.07);
  g.beginPath();
  g.moveTo(bx - w * 0.03, by);
  g.lineTo(bx + w * 0.03, by);
  g.lineTo(bx + w * 0.022, by + h * 0.012);
  g.lineTo(bx - w * 0.022, by + h * 0.012);
  g.fill();
  g.fillRect(bx - w * 0.002, by - h * 0.05, w * 0.004, h * 0.05);
  g.beginPath();
  g.moveTo(bx + w * 0.002, by - h * 0.05);
  g.lineTo(bx + w * 0.025, by - h * 0.006);
  g.lineTo(bx + w * 0.002, by - h * 0.006);
  g.fill();
}

/** Framed photo: warm film print of a sunset over the bay. */
export function createFramePhotoTexture(aspect: number) {
  const W = 1000, H = Math.round(W / aspect);
  const { c, g } = canvas(W, H);
  paintSunset(g, W, H, 0.6);
  // film warmth + vignette + grain
  g.fillStyle = "rgba(255,170,90,0.08)";
  g.fillRect(0, 0, W, H);
  const v = g.createRadialGradient(W / 2, H / 2, W * 0.3, W / 2, H / 2, W * 0.75);
  v.addColorStop(0, "rgba(0,0,0,0)");
  v.addColorStop(1, "rgba(40,20,20,0.35)");
  g.fillStyle = v;
  g.fillRect(0, 0, W, H);
  grain(g, W, H, 0.08);
  g.font = "bold 22px monospace";
  g.fillStyle = "rgba(255,150,60,0.85)";
  g.fillText("'26 10 31", W - 150, H - 24);
  return tex(c);
}

/** Photo-booth strips with little illustrated moments. */
export function createStripTexture(variant: 0 | 1) {
  const W = 440, H = 1600;
  const { c, g } = canvas(W, H);
  g.fillStyle = variant === 0 ? "#fbf6ec" : "#f4f1ea";
  g.fillRect(0, 0, W, H);
  const pad = 26, fh = (H - pad * 5 - 70) / 4;
  const scenes: ((x: number, y: number, w: number, h: number) => void)[] =
    variant === 0
      ? [
          // cat curled up
          (x, y, w, h) => {
            g.fillStyle = "#f2c79a"; g.fillRect(x, y, w, h);
            g.fillStyle = "#e7834a";
            g.beginPath(); g.ellipse(x + w * 0.5, y + h * 0.58, w * 0.3, h * 0.2, 0, 0, Math.PI * 2); g.fill();
            g.beginPath(); g.arc(x + w * 0.32, y + h * 0.48, w * 0.14, 0, Math.PI * 2); g.fill();
            g.beginPath(); g.moveTo(x + w * 0.22, y + h * 0.4); g.lineTo(x + w * 0.25, y + h * 0.3); g.lineTo(x + w * 0.3, y + h * 0.38); g.fill();
            g.beginPath(); g.moveTo(x + w * 0.36, y + h * 0.37); g.lineTo(x + w * 0.42, y + h * 0.29); g.lineTo(x + w * 0.44, y + h * 0.4); g.fill();
            g.strokeStyle = "#e7834a"; g.lineWidth = w * 0.06; g.lineCap = "round";
            g.beginPath(); g.arc(x + w * 0.5, y + h * 0.62, w * 0.36, 0.2, 1.4); g.stroke();
            g.strokeStyle = "#c4602c"; g.lineWidth = 3;
            for (let i = 0; i < 3; i++) { g.beginPath(); g.moveTo(x + w * (0.48 + i * 0.08), y + h * 0.42); g.lineTo(x + w * (0.5 + i * 0.08), y + h * 0.52); g.stroke(); }
          },
          // matcha from above
          (x, y, w, h) => {
            g.fillStyle = "#d9c3a5"; g.fillRect(x, y, w, h);
            g.fillStyle = "#fffaf0"; g.beginPath(); g.arc(x + w * 0.5, y + h * 0.5, w * 0.32, 0, Math.PI * 2); g.fill();
            g.fillStyle = "#7fae4f"; g.beginPath(); g.arc(x + w * 0.5, y + h * 0.5, w * 0.25, 0, Math.PI * 2); g.fill();
            g.strokeStyle = "rgba(240,255,220,0.8)"; g.lineWidth = 3;
            g.beginPath(); g.moveTo(x + w * 0.4, y + h * 0.45); g.bezierCurveTo(x + w * 0.55, y + h * 0.3, x + w * 0.6, y + h * 0.65, x + w * 0.45, y + h * 0.58); g.stroke();
            g.strokeStyle = "#fffaf0"; g.lineWidth = w * 0.07;
            g.beginPath(); g.arc(x + w * 0.86, y + h * 0.5, w * 0.08, -1.2, 1.2); g.stroke();
          },
          // red Miata
          (x, y, w, h) => {
            const sky = g.createLinearGradient(0, y, 0, y + h); sky.addColorStop(0, "#9fc3d9"); sky.addColorStop(1, "#f1d9b8");
            g.fillStyle = sky; g.fillRect(x, y, w, h);
            g.fillStyle = "#8a8378"; g.fillRect(x, y + h * 0.72, w, h * 0.28);
            g.fillStyle = "#c8282e";
            g.beginPath(); g.moveTo(x + w * 0.1, y + h * 0.66); g.lineTo(x + w * 0.2, y + h * 0.5); g.lineTo(x + w * 0.62, y + h * 0.48);
            g.lineTo(x + w * 0.9, y + h * 0.56); g.lineTo(x + w * 0.92, y + h * 0.68); g.closePath(); g.fill();
            g.fillStyle = "#2d2d2d";
            g.beginPath(); g.arc(x + w * 0.27, y + h * 0.69, w * 0.08, 0, Math.PI * 2); g.fill();
            g.beginPath(); g.arc(x + w * 0.76, y + h * 0.69, w * 0.08, 0, Math.PI * 2); g.fill();
            g.fillStyle = "#cfe4ee"; g.fillRect(x + w * 0.38, y + h * 0.44, w * 0.16, h * 0.05);
          },
          // sunset
          (x, y, w, h) => { g.save(); g.translate(x, y); paintSunset(g, w, h, 0.62); g.restore(); },
        ]
      : [
          // monstera-ish leaf shadow
          (x, y, w, h) => {
            g.fillStyle = "#cfcac0"; g.fillRect(x, y, w, h);
            g.fillStyle = "#4b4a46";
            g.beginPath(); g.ellipse(x + w * 0.5, y + h * 0.5, w * 0.28, h * 0.36, 0.5, 0, Math.PI * 2); g.fill();
            g.strokeStyle = "#cfcac0"; g.lineWidth = 5;
            g.beginPath(); g.moveTo(x + w * 0.3, y + h * 0.82); g.lineTo(x + w * 0.68, y + h * 0.2); g.stroke();
          },
          // laptop glow at night
          (x, y, w, h) => {
            g.fillStyle = "#262626"; g.fillRect(x, y, w, h);
            const gl = g.createRadialGradient(x + w * 0.5, y + h * 0.45, 4, x + w * 0.5, y + h * 0.45, w * 0.6);
            gl.addColorStop(0, "rgba(230,230,230,0.6)"); gl.addColorStop(1, "rgba(0,0,0,0)");
            g.fillStyle = gl; g.fillRect(x, y, w, h);
            g.fillStyle = "#e8e8e8"; g.fillRect(x + w * 0.25, y + h * 0.3, w * 0.5, h * 0.3);
            g.fillStyle = "#777"; g.fillRect(x + w * 0.18, y + h * 0.6, w * 0.64, h * 0.06);
          },
          // Rubik's cube
          (x, y, w, h) => {
            g.fillStyle = "#e3dfd6"; g.fillRect(x, y, w, h);
            const s = w * 0.11, ox = x + w * 0.5 - s * 1.5, oy = y + h * 0.5 - s * 1.5;
            const tones = ["#3a3a3a", "#8a8a8a", "#cfcfcf", "#5a5a5a", "#b0b0b0"];
            for (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++) { g.fillStyle = tones[(i * 3 + j * 2) % 5]; g.fillRect(ox + i * s + 2, oy + j * s + 2, s - 4, s - 4); }
          },
          // night sky
          (x, y, w, h) => {
            g.fillStyle = "#1f1f22"; g.fillRect(x, y, w, h);
            g.fillStyle = "#f2f2f2"; g.beginPath(); g.arc(x + w * 0.66, y + h * 0.36, w * 0.12, 0, Math.PI * 2); g.fill();
            g.fillStyle = "#1f1f22"; g.beginPath(); g.arc(x + w * 0.72, y + h * 0.32, w * 0.11, 0, Math.PI * 2); g.fill();
            g.fillStyle = "#ddd";
            for (let i = 0; i < 18; i++) g.fillRect(x + Math.random() * w, y + Math.random() * h * 0.8, 2, 2);
          },
        ];
  scenes.forEach((paint, i) => {
    const x = pad, y = pad + i * (fh + pad), w = W - pad * 2;
    g.save();
    g.beginPath(); g.rect(x, y, w, fh); g.clip();
    paint(x, y, w, fh);
    if (variant === 1) {
      const img = g.getImageData(x, y, w, fh);
      for (let p = 0; p < img.data.length; p += 4) {
        const l = img.data[p] * 0.3 + img.data[p + 1] * 0.59 + img.data[p + 2] * 0.11;
        img.data[p] = img.data[p + 1] = img.data[p + 2] = l;
      }
      g.putImageData(img, x, y);
    } else {
      g.fillStyle = "rgba(255,170,90,0.1)"; g.fillRect(x, y, w, fh);
    }
    g.restore();
  });
  grain(g, W, H, 0.07);
  g.fillStyle = "#8a7b6a";
  g.font = "26px monospace";
  g.fillText(variant === 0 ? "10 · 31 · 26" : "photobooth", pad + 6, H - 28);
  return tex(c);
}

/** Lock screen: sunset wallpaper + Daniel Caesar now playing. */
export function createLockScreenTexture() {
  const W = 570, H = 1180;
  const { c, g } = canvas(W, H);
  g.fillStyle = "#000";
  g.fillRect(0, 0, W, H);
  g.save();
  roundRect(g, 0, 0, W, H, 70);
  g.clip();
  paintSunset(g, W, H, 0.58);
  const dim = g.createLinearGradient(0, 0, 0, H);
  dim.addColorStop(0, "rgba(0,0,0,0.15)");
  dim.addColorStop(0.5, "rgba(0,0,0,0)");
  dim.addColorStop(1, "rgba(0,0,0,0.35)");
  g.fillStyle = dim;
  g.fillRect(0, 0, W, H);
  // dynamic island
  g.fillStyle = "#000";
  roundRect(g, W / 2 - 80, 26, 160, 46, 23);
  g.fill();
  // date + time
  g.fillStyle = "rgba(255,255,255,0.92)";
  g.textAlign = "center";
  g.font = "600 30px -apple-system, system-ui, sans-serif";
  g.fillText("Saturday, October 31", W / 2, 150);
  g.font = "700 150px -apple-system, system-ui, sans-serif";
  g.fillText("4:47", W / 2, 300);
  // now playing widget
  const wx = 34, wy = H - 360, ww = W - 68, wh = 230;
  g.fillStyle = "rgba(40,24,40,0.55)";
  roundRect(g, wx, wy, ww, wh, 40);
  g.fill();
  const art = g.createLinearGradient(wx + 28, wy + 28, wx + 128, wy + 128);
  art.addColorStop(0, "#f0b27a");
  art.addColorStop(1, "#b9567a");
  g.fillStyle = art;
  roundRect(g, wx + 28, wy + 28, 100, 100, 16);
  g.fill();
  g.textAlign = "left";
  g.fillStyle = "#fff";
  g.font = "700 30px -apple-system, system-ui, sans-serif";
  g.fillText("Best Part (feat. H.E.R.)", wx + 150, wy + 70);
  g.fillStyle = "rgba(255,255,255,0.7)";
  g.font = "500 26px -apple-system, system-ui, sans-serif";
  g.fillText("Daniel Caesar", wx + 150, wy + 108);
  g.fillStyle = "rgba(255,255,255,0.3)";
  roundRect(g, wx + 28, wy + 152, ww - 56, 8, 4);
  g.fill();
  g.fillStyle = "#fff";
  roundRect(g, wx + 28, wy + 152, (ww - 56) * 0.42, 8, 4);
  g.fill();
  // controls
  g.fillStyle = "#fff";
  const cy = wy + 200, cx = W / 2;
  g.fillRect(cx - 12, cy - 16, 8, 32);
  g.fillRect(cx + 4, cy - 16, 8, 32);
  [-1, 1].forEach((d) => {
    for (let k = 0; k < 2; k++) {
      g.beginPath();
      const bx = cx + d * (110 + k * 22);
      g.moveTo(bx - d * 12, cy - 14);
      g.lineTo(bx + d * 10, cy);
      g.lineTo(bx - d * 12, cy + 14);
      g.fill();
    }
  });
  // flashlight / camera buttons + home bar
  g.fillStyle = "rgba(30,30,30,0.5)";
  g.beginPath(); g.arc(90, H - 90, 42, 0, Math.PI * 2); g.fill();
  g.beginPath(); g.arc(W - 90, H - 90, 42, 0, Math.PI * 2); g.fill();
  g.fillStyle = "rgba(255,255,255,0.9)";
  roundRect(g, W / 2 - 90, H - 34, 180, 10, 5);
  g.fill();
  g.restore();
  return tex(c);
}

/** Trailing pothos: leaves on top of the pot plus vines spilling onto the desk. */
export function buildPothos(potTopZ = 0.45) {
  const group = new THREE.Group();
  const heart = new THREE.Shape();
  heart.moveTo(0, 0);
  heart.bezierCurveTo(-0.55, 0.15, -0.6, 0.75, -0.18, 0.9);
  heart.bezierCurveTo(-0.05, 0.95, 0, 0.88, 0, 0.8);
  heart.bezierCurveTo(0, 0.88, 0.05, 0.95, 0.18, 0.9);
  heart.bezierCurveTo(0.6, 0.75, 0.55, 0.15, 0, 0);
  const leafGeom = new THREE.ShapeGeometry(heart, 10);
  const greens = [0x3f7a3a, 0x4f8f42, 0x5f9f4a, 0x467f3a, 0x6aa752];
  const leafMats = greens.map((c) => new THREE.MeshStandardMaterial({ color: c, roughness: 0.55, side: THREE.DoubleSide }));
  const vineMat = new THREE.MeshStandardMaterial({ color: 0x5a7d3a, roughness: 0.7 });

  const addLeaf = (x: number, y: number, z: number, rot: number, s: number) => {
    const m = new THREE.Mesh(leafGeom, leafMats[Math.floor(Math.random() * leafMats.length)]);
    m.position.set(x, y, z);
    m.rotation.z = rot;
    m.rotation.x = (Math.random() - 0.5) * 0.5;
    m.scale.setScalar(s);
    m.castShadow = true;
    group.add(m);
    // lighter centre vein
    const vein = new THREE.Mesh(
      new THREE.PlaneGeometry(0.02, 0.75),
      new THREE.MeshStandardMaterial({ color: 0xb8d68a, roughness: 0.6, side: THREE.DoubleSide })
    );
    vein.position.set(0, 0.42, 0.002);
    m.add(vein);
  };

  // bushy crown on the pot
  for (let i = 0; i < 16; i++) {
    const a = (i / 16) * Math.PI * 2 + Math.random() * 0.3;
    const r = 0.05 + Math.random() * 0.45;
    addLeaf(Math.cos(a) * r * 0.6, Math.sin(a) * r * 0.6, potTopZ + 0.15 + Math.random() * 0.25, a - Math.PI / 2, 0.42 + Math.random() * 0.18);
  }

  // trailing vines: start at the rim, drape down onto the desk
  const vines: [number, number][][] = [
    [[0.5, -0.4], [1.1, -0.7], [1.9, -0.6], [2.4, -1.0]],
    [[0.4, 0.45], [1.0, 0.9], [1.7, 0.9], [2.2, 1.3]],
    [[-0.4, 0.45], [-0.9, 0.95], [-1.6, 1.1]],
  ];
  vines.forEach((pts) => {
    const v3 = pts.map(([x, y], i) => {
      const t = i / (pts.length - 1);
      const z = THREE.MathUtils.lerp(potTopZ + 0.1, 0.06, Math.min(1, t * 1.6));
      return new THREE.Vector3(x, y, z);
    });
    const curve = new THREE.CatmullRomCurve3(v3);
    const vine = new THREE.Mesh(new THREE.TubeGeometry(curve, 60, 0.018, 6, false), vineMat);
    vine.castShadow = true;
    group.add(vine);
    const n = Math.round(curve.getLength() / 0.32);
    for (let k = 1; k <= n; k++) {
      const t = k / (n + 0.5);
      const p = curve.getPointAt(t);
      const tan = curve.getTangentAt(t);
      const side = k % 2 === 0 ? 1 : -1;
      const ang = Math.atan2(tan.y, tan.x) + side * 1.1 - Math.PI / 2;
      addLeaf(p.x + Math.cos(ang + Math.PI / 2) * 0.05, p.y + Math.sin(ang + Math.PI / 2) * 0.05, p.z + 0.02, ang, 0.26 + (1 - t) * 0.14);
    }
  });
  return group;
}

/** Articulated desk lamp seen from above: base, two arms, shade with warm rim. */
export function buildDeskLamp() {
  const group = new THREE.Group();
  const black = new THREE.MeshStandardMaterial({ color: 0x23201d, roughness: 0.55, metalness: 0.3 });
  const brass = new THREE.MeshStandardMaterial({ color: 0xc9a14a, roughness: 0.3, metalness: 0.85 });
  const cream = new THREE.MeshStandardMaterial({ color: 0xf4ead8, roughness: 0.6, side: THREE.DoubleSide });

  const base = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.48, 0.1, 32).rotateX(Math.PI / 2), black);
  base.position.z = 0.05;
  base.castShadow = true;
  group.add(base);
  const baseRim = new THREE.Mesh(new THREE.TorusGeometry(0.43, 0.025, 8, 40), brass);
  baseRim.position.z = 0.1;
  group.add(baseRim);

  const joint = (p: THREE.Vector3) => {
    const j = new THREE.Mesh(new THREE.SphereGeometry(0.07, 16, 16), brass);
    j.position.copy(p);
    j.castShadow = true;
    group.add(j);
  };
  const arm = (a: THREE.Vector3, b: THREE.Vector3) => {
    const len = a.distanceTo(b);
    const m = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, len, 12), black);
    m.position.copy(a).add(b).multiplyScalar(0.5);
    m.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), b.clone().sub(a).normalize());
    m.castShadow = true;
    group.add(m);
  };
  const p0 = new THREE.Vector3(0, 0, 0.12);
  const p1 = new THREE.Vector3(0.55, -0.55, 1.5);
  const p2 = new THREE.Vector3(1.35, -1.0, 1.35);
  joint(p0); joint(p1); joint(p2);
  arm(p0, p1);
  arm(p1, p2);

  // shade: open cone pointing down toward the desk
  const shade = new THREE.Mesh(new THREE.ConeGeometry(0.58, 0.8, 32, 1, true), black);
  shade.position.set(1.6, -1.2, 1.1);
  shade.rotation.x = Math.PI * 0.62;
  shade.rotation.z = -0.65;
  shade.castShadow = true;
  group.add(shade);
  const inner = new THREE.Mesh(new THREE.ConeGeometry(0.56, 0.78, 32, 1, true), cream);
  inner.position.copy(shade.position);
  inner.rotation.copy(shade.rotation);
  group.add(inner);
  return group;
}

/** Mapúa student ID on a red lanyard. */
export function buildStudentId() {
  const group = new THREE.Group();
  const W = 600, H = 950;
  const { c, g } = canvas(W, H);
  g.fillStyle = "#fbfaf7";
  roundRect(g, 0, 0, W, H, 40);
  g.fill();
  g.fillStyle = "#b71c1c";
  roundRect(g, 0, 0, W, 210, 40);
  g.fill();
  g.fillRect(0, 150, W, 60);
  g.fillStyle = "#f6c445";
  g.fillRect(0, 205, W, 12);
  g.fillStyle = "#fff";
  g.textAlign = "center";
  g.font = "800 50px Georgia, serif";
  g.fillText("MAPÚA", W / 2, 105);
  g.font = "600 30px Georgia, serif";
  g.fillText("UNIVERSITY", W / 2, 150);
  // slot hole
  g.fillStyle = "#7f1212";
  roundRect(g, W / 2 - 60, 22, 120, 22, 11);
  g.fill();
  // photo box with a simple illustrated portrait
  g.fillStyle = "#e9e1d5";
  g.fillRect(W / 2 - 130, 260, 260, 300);
  g.fillStyle = "#3b2a22";
  g.beginPath(); g.ellipse(W / 2, 395, 95, 115, 0, 0, Math.PI * 2); g.fill();
  g.fillStyle = "#e2b48f";
  g.beginPath(); g.arc(W / 2, 390, 64, 0, Math.PI * 2); g.fill();
  g.fillStyle = "#3b2a22";
  g.beginPath(); g.ellipse(W / 2, 342, 72, 34, 0, Math.PI, 0); g.fill();
  g.fillStyle = "#6d5b8f";
  g.beginPath(); g.ellipse(W / 2, 560, 120, 80, 0, Math.PI, 0); g.fill();
  // text
  g.fillStyle = "#1f1f1f";
  g.font = "800 40px -apple-system, system-ui, sans-serif";
  g.fillText("MYRIELLE ALEXCIS", W / 2, 628);
  g.fillText("JERUSALEM", W / 2, 676);
  g.fillStyle = "#555";
  g.font = "500 26px -apple-system, system-ui, sans-serif";
  g.fillText("School of Information Technology", W / 2, 724);
  g.fillStyle = "#b71c1c";
  roundRect(g, W / 2 - 90, 752, 180, 46, 23);
  g.fill();
  g.fillStyle = "#fff";
  g.font = "800 24px -apple-system, system-ui, sans-serif";
  g.fillText("STUDENT", W / 2, 784);
  g.fillStyle = "#222";
  for (let x = 120, i = 0; x < W - 120; x += 6 + (i % 3) * 3, i++) g.fillRect(x, 830, i % 4 === 0 ? 5 : 2, 70);
  grain(g, W, H, 0.03);

  const shape = new THREE.Shape();
  const w = 1.0, h = 1.58, r = 0.07;
  shape.moveTo(-w / 2 + r, -h / 2);
  shape.lineTo(w / 2 - r, -h / 2); shape.quadraticCurveTo(w / 2, -h / 2, w / 2, -h / 2 + r);
  shape.lineTo(w / 2, h / 2 - r); shape.quadraticCurveTo(w / 2, h / 2, w / 2 - r, h / 2);
  shape.lineTo(-w / 2 + r, h / 2); shape.quadraticCurveTo(-w / 2, h / 2, -w / 2, h / 2 - r);
  shape.lineTo(-w / 2, -h / 2 + r); shape.quadraticCurveTo(-w / 2, -h / 2, -w / 2 + r, -h / 2);
  const geom = new THREE.ShapeGeometry(shape);
  // map UVs from shape coords to 0..1
  const pos = geom.attributes.position as THREE.BufferAttribute;
  const uv = new Float32Array(pos.count * 2);
  for (let i = 0; i < pos.count; i++) {
    uv[i * 2] = (pos.getX(i) + w / 2) / w;
    uv[i * 2 + 1] = (pos.getY(i) + h / 2) / h;
  }
  geom.setAttribute("uv", new THREE.BufferAttribute(uv, 2));
  const card = new THREE.Mesh(geom, new THREE.MeshStandardMaterial({ map: tex(c), roughness: 0.35 }));
  card.position.z = 0.05;
  card.castShadow = true;
  card.receiveShadow = true;
  group.add(card);

  // clip + lanyard loop lying on the desk
  const clip = new THREE.Mesh(
    new THREE.BoxGeometry(0.16, 0.22, 0.04),
    new THREE.MeshStandardMaterial({ color: 0xc9ced6, metalness: 0.9, roughness: 0.25 })
  );
  clip.position.set(0, h / 2 + 0.08, 0.07);
  group.add(clip);
  const strapMat = new THREE.MeshStandardMaterial({ color: 0xb71c1c, roughness: 0.7 });
  const loop = new THREE.CatmullRomCurve3(
    [
      [0, 0.92], [0.45, 1.35], [1.1, 1.45], [1.6, 1.0], [1.7, 0.2], [1.45, -0.55], [0.95, -0.7], [0.75, -0.1], [0.4, 0.6], [0, 0.92],
    ].map(([x, y]) => new THREE.Vector3(x, y, 0.06))
  );
  const strap = new THREE.Mesh(new THREE.TubeGeometry(loop, 160, 0.05, 6, true), strapMat);
  strap.scale.z = 0.35; // flatten into a ribbon
  strap.castShadow = true;
  group.add(strap);
  return group;
}

/** iPhone 18 Pro Max lying face down: aluminum unibody, full-width camera plateau, Burgundy finish. */
export function buildIphone18ProMax(appleLogo: { body: THREE.Shape; leaf: THREE.Shape }, color = 0x4a1522) {
  const group = new THREE.Group();
  const W = 1.32, H = 2.78, R = 0.2, T = 0.09;
  const rounded = (w: number, h: number, r: number) => {
    const s = new THREE.Shape();
    s.moveTo(-w / 2 + r, -h / 2);
    s.lineTo(w / 2 - r, -h / 2); s.quadraticCurveTo(w / 2, -h / 2, w / 2, -h / 2 + r);
    s.lineTo(w / 2, h / 2 - r); s.quadraticCurveTo(w / 2, h / 2, w / 2 - r, h / 2);
    s.lineTo(-w / 2 + r, h / 2); s.quadraticCurveTo(-w / 2, h / 2, -w / 2, h / 2 - r);
    s.lineTo(-w / 2, -h / 2 + r); s.quadraticCurveTo(-w / 2, -h / 2, -w / 2 + r, -h / 2);
    return s;
  };
  const alu = new THREE.MeshStandardMaterial({ color, metalness: 0.55, roughness: 0.38 });
  const aluLight = new THREE.MeshStandardMaterial({ color: new THREE.Color(color).multiplyScalar(1.45), metalness: 0.65, roughness: 0.22 });
  const glassDark = new THREE.MeshStandardMaterial({ color: 0x0b0b10, metalness: 0.2, roughness: 0.08 });
  const ring = new THREE.MeshStandardMaterial({ color: new THREE.Color(color).multiplyScalar(0.8), metalness: 0.9, roughness: 0.2 });

  // body (back faces +z = up, since the phone is lying face down)
  const body = new THREE.Mesh(
    new THREE.ExtrudeGeometry(rounded(W, H, R), { depth: T, bevelEnabled: true, bevelSegments: 4, bevelSize: 0.012, bevelThickness: 0.012 }),
    alu
  );
  body.position.z = -T / 2;
  body.castShadow = true;
  body.receiveShadow = true;
  group.add(body);

  // full-width camera plateau across the top
  const plateauH = 0.7;
  const plateau = new THREE.Mesh(
    new THREE.ExtrudeGeometry(rounded(W - 0.12, plateauH, 0.16), { depth: 0.06, bevelEnabled: true, bevelSegments: 4, bevelSize: 0.022, bevelThickness: 0.022 }),
    aluLight
  );
  const plateauY = H / 2 - 0.06 - plateauH / 2;
  plateau.position.set(0, plateauY, T / 2);
  plateau.castShadow = true;
  group.add(plateau);
  const topZ = T / 2 + 0.085;

  // triple lens cluster on the left (triangle)
  const lens = (x: number, y: number) => {
    const outer = new THREE.Mesh(new THREE.CylinderGeometry(0.135, 0.135, 0.05, 32).rotateX(Math.PI / 2), ring);
    outer.position.set(x, y, topZ + 0.02);
    outer.castShadow = true;
    group.add(outer);
    const glass = new THREE.Mesh(new THREE.CylinderGeometry(0.105, 0.105, 0.052, 32).rotateX(Math.PI / 2), glassDark);
    glass.position.set(x, y, topZ + 0.022);
    group.add(glass);
    const glint = new THREE.Mesh(new THREE.CircleGeometry(0.03, 16), new THREE.MeshBasicMaterial({ color: 0x6a6f9a, transparent: true, opacity: 0.7 }));
    glint.position.set(x - 0.03, y + 0.03, topZ + 0.05);
    group.add(glint);
  };
  const lx = -W / 2 + 0.24, ly = plateauY;
  lens(lx, ly + 0.165);
  lens(lx, ly - 0.165);
  lens(lx + 0.29, ly);

  // flash, LiDAR and mic on the right of the plateau
  const flash = new THREE.Mesh(new THREE.CircleGeometry(0.06, 24), new THREE.MeshStandardMaterial({ color: 0xf6eedc, roughness: 0.3, emissive: 0x332a1a }));
  flash.position.set(W / 2 - 0.22, ly + 0.14, topZ + 0.001);
  group.add(flash);
  const lidar = new THREE.Mesh(new THREE.CircleGeometry(0.055, 24), glassDark);
  lidar.position.set(W / 2 - 0.22, ly - 0.12, topZ + 0.001);
  group.add(lidar);
  const mic = new THREE.Mesh(new THREE.CircleGeometry(0.014, 12), glassDark);
  mic.position.set(W / 2 - 0.36, ly + 0.02, topZ + 0.001);
  group.add(mic);

  // Apple logo, centred on the lower back
  const logo = new THREE.Mesh(
    new THREE.ExtrudeGeometry([appleLogo.body, appleLogo.leaf], { depth: 0.004, bevelEnabled: false }).center(),
    new THREE.MeshStandardMaterial({ color: new THREE.Color(color).multiplyScalar(1.35), metalness: 0.9, roughness: 0.18 })
  );
  // size the logo to ~0.32 units wide regardless of the source shape's scale
  logo.geometry.computeBoundingBox();
  const lb = logo.geometry.boundingBox!;
  logo.scale.setScalar(0.32 / Math.max(0.001, lb.max.x - lb.min.x));
  logo.position.set(0, -0.2, T / 2 + 0.014);
  group.add(logo);

  // side buttons peeking out (camera control on the right, volume on the left when face down)
  const btn = new THREE.MeshStandardMaterial({ color: new THREE.Color(color).multiplyScalar(0.9), metalness: 0.7, roughness: 0.3 });
  [[-W / 2 - 0.012, 0.65, 0.22], [-W / 2 - 0.012, 0.3, 0.22], [W / 2 + 0.012, 0.55, 0.32], [W / 2 + 0.012, -0.25, 0.2]].forEach(([x, y, h]) => {
    const b = new THREE.Mesh(new THREE.BoxGeometry(0.02, h, 0.035), btn);
    b.position.set(x, y, 0);
    group.add(b);
  });
  return group;
}

/**
 * A small stack of instant photos lying on the desk. `toggle()` fans them out (and back into a
 * neat pile), and returns true when they are spread.
 */
export function buildPolaroidStack() {
  const group = new THREE.Group();
  // Photos: the golden-hour shot, plus moments cropped from the two photo-booth strips
  const sources: HTMLCanvasElement[] = [];
  const sunset = canvas(600, 600);
  paintSunset(sunset.g, 600, 600, 0.6);
  sunset.g.fillStyle = "rgba(255,170,90,0.08)";
  sunset.g.fillRect(0, 0, 600, 600);
  grain(sunset.g, 600, 600, 0.08);
  sources.push(sunset.c);
  const stripA = createStripTexture(0).image as HTMLCanvasElement;
  const stripB = createStripTexture(1).image as HTMLCanvasElement;
  const pad = 26, fh = (1600 - pad * 5 - 70) / 4, fw = 440 - pad * 2;
  for (const [strip, k] of [[stripA, 0], [stripA, 2], [stripB, 1]] as const) {
    const { c, g } = canvas(600, 600);
    const side = Math.min(fw, fh);
    g.drawImage(strip, pad + (fw - side) / 2, pad + k * (fh + pad) + (fh - side) / 2, side, side, 0, 0, 600, 600);
    sources.push(c);
  }
  const captions = ["golden hour", "the boss", "us :)", "photobooth"];

  const cardGeo = new THREE.BoxGeometry(1.0, 1.2, 0.012);
  const photoGeo = new THREE.PlaneGeometry(0.86, 0.86);
  const cards: THREE.Group[] = [];
  sources.forEach((src, i) => {
    const card = new THREE.Group();
    // white instant-film card with a handwritten note in the wide bottom margin
    const face = canvas(500, 600);
    face.g.fillStyle = "#fbf8f1";
    face.g.fillRect(0, 0, 500, 600);
    grain(face.g, 500, 600, 0.03);
    face.g.fillStyle = "#3a3a46";
    face.g.font = "italic 34px 'Segoe Print', 'Bradley Hand', cursive";
    face.g.textAlign = "center";
    face.g.fillText(captions[i], 250, 560);
    const faceMat = new THREE.MeshStandardMaterial({ map: tex(face.c), roughness: 0.85 });
    const edgeMat = new THREE.MeshStandardMaterial({ color: 0xf1ece2, roughness: 0.9 });
    const body = new THREE.Mesh(cardGeo, [edgeMat, edgeMat, edgeMat, edgeMat, faceMat, edgeMat]);
    body.castShadow = true;
    body.receiveShadow = true;
    card.add(body);
    const photo = new THREE.Mesh(photoGeo, new THREE.MeshStandardMaterial({ map: tex(src), roughness: 0.35 }));
    photo.position.set(0, 0.1, 0.0065);
    card.add(photo);
    card.position.z = 0.012 + i * 0.014;
    group.add(card);
    cards.push(card);
  });

  // piled: loosely squared up; spread: fanned in an arc like a hand of cards
  const pile = cards.map((_, i) => ({ x: (i - 1.5) * 0.05, y: (i % 2) * 0.04, r: [-0.12, 0.08, -0.04, 0.14][i] }));
  const fan = cards.map((_, i) => {
    const t = i - (cards.length - 1) / 2;
    return { x: t * 0.72 - 0.45, y: -Math.abs(t) * 0.12 + 0.05, r: -t * 0.16 }; // fans out to the left, clear of the photo strips
  });
  const place = (k: number) => cards.forEach((c, i) => {
    c.position.x = pile[i].x + (fan[i].x - pile[i].x) * k;
    c.position.y = pile[i].y + (fan[i].y - pile[i].y) * k;
    c.rotation.z = pile[i].r + (fan[i].r - pile[i].r) * k;
  });
  place(0);

  let spread = false, amount = 0, run = 0;
  group.userData.toggle = () => {
    spread = !spread;
    const from = amount, to = spread ? 1 : 0, start = performance.now(), id = ++run;
    const step = (now: number) => {
      if (id !== run) return;
      const t = Math.min(1, (now - start) / 520);
      const e = 1 - Math.pow(1 - t, 3);
      amount = from + (to - from) * e;
      place(amount);
      if (t < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
    return spread;
  };
  return group;
}
