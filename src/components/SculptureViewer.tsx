import { useEffect, useRef } from "react";
import * as THREE from "three";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useTheme } from "./ThemeContext";

/*
  Hero: two hands reaching for each other (after Michelangelo), meeting at the centre of the
  screen. Adam's painted hand reaches up from the bottom left; God's hand comes down from the
  top right. Both are cut from the fresco and sculpted into lit relief, so they read as solid
  forms rather than flat paint. Soft particles drift out of the gap.

  They float in a quiet void: a slow nebula of light gathers behind the fingertips, with a bright
  spark where they almost touch. The glow catches the edges of the hands like a rim light.

  As you scroll, the camera flies into the gap: the painted hands fade,
  and the particles stream out until they fill the whole view, then slow into a quiet drift
  behind the quote. World units are CSS pixels on the z = 0 plane at the starting view.
*/

const smooth = (x: number) => x * x * (3 - 2 * x);
const clamp01 = (x: number) => Math.min(1, Math.max(0, x));
const sstep = (x: number, a: number, b: number) => smooth(clamp01((x - a) / (b - a)));

// Raw sRGB triplets for the custom shaders (they write colours straight to the screen)
const hex3 = (h: number) => new THREE.Vector3(((h >> 16) & 255) / 255, ((h >> 8) & 255) / 255, (h & 255) / 255);

// Adam's arm: only its lower edge matters (everything below it, his knee and leg, is left out)
const ADAM_BOT = [0.335, 0.315, 0.305, 0.295, 0.275, 0.24, 0.215, 0.225, 0.26, 0.27, 0.25];

const NOISE_GLSL = /* glsl */ `
float h2(vec2 p) { p = fract(p * vec2(123.34, 456.21)); p += dot(p, p + 45.32); return fract(p.x * p.y); }
float vn(vec2 x) {
  vec2 i = floor(x); vec2 f = fract(x); f = f * f * (3.0 - 2.0 * f);
  return mix(mix(h2(i), h2(i + vec2(1.0, 0.0)), f.x), mix(h2(i + vec2(0.0, 1.0)), h2(i + vec2(1.0, 1.0)), f.x), f.y);
}
`;

// Adam's painted hand, sculpted into relief: the plane is pushed forward into the rounded volume
// of the arm and lit, so the fresco colours keep their paint but the hand reads as solid
const adamVert = /* glsl */ `
varying vec2 vUv;
varying vec3 vN;
varying vec3 vV;
void main() {
  vUv = uv;
  vec4 mv = modelViewMatrix * vec4(position, 1.0);
  vN = normalize(normalMatrix * normal);
  vV = -mv.xyz;
  gl_Position = projectionMatrix * mv;
}
`;
// the painting stops at Adam's shoulder, so for uv.x < 0 the arm is carried on past the edge
const adamFrag = /* glsl */ `
${NOISE_GLSL}
uniform sampler2D uMap;
uniform float uAlpha;
uniform float uTint;
uniform float uBottom[11];
uniform float uShade;
uniform float uSat;
uniform vec3 uRim;
varying vec2 vUv;
varying vec3 vN;
varying vec3 vV;
void main() {
  float ext = clamp(-vUv.x / 0.03, 0.0, 1.0); // 0 on the painting, 1 out on the continued arm
  vec4 c = texture2D(uMap, vec2(max(vUv.x, 0.03), vUv.y));
  if (vUv.x < 0.03) {
    // paint for the continued arm: skin from a band just inside the edge, wandering slowly and
    // softened across a few samples, so it carries the same tone without a repeating pattern
    // the lookup wanders in both directions, so the skin varies along the arm as well as across
    // it and never smears into streaks
    vec2 q = vUv * vec2(26.0, 20.0);
    float sx = 0.04 + 0.06 * vn(q);
    float sy = vUv.y + 0.018 * (vn(q + 17.3) - 0.5);
    // weighted by coverage, so nothing from outside the silhouette (dark, see-through pixels)
    // gets pulled in along the edges
    vec4 acc = vec4(0.0);
    for (int k = -2; k <= 2; k++) {
      float fk = float(k);
      vec4 t = texture2D(uMap, vec2(sx + 0.008 * fk, sy + fk * 0.006));
      float wt = smoothstep(0.6, 1.0, t.a);
      acc += vec4(t.rgb * wt, wt);
    }
    vec3 skin = acc.a > 0.05 ? acc.rgb / acc.a : c.rgb;
    c.rgb = mix(c.rgb, skin, smoothstep(0.0, 0.04, -vUv.x + 0.03));
  }
  // a little drift along the continued arm so it doesn't read as a smear
  c.rgb *= 1.0 - ext * (0.05 * vn(vec2(vUv.x * 9.0, vUv.y * 14.0)) + 0.03);
  if (c.a < 0.01) discard;
  float fx = clamp(vUv.x, 0.0, 1.0) * 10.0;
  int i0 = int(min(floor(fx), 9.0));
  float bottom = 0.0;
  for (int i = 0; i < 10; i++) if (i == i0) bottom = mix(uBottom[i], uBottom[i + 1], fx - float(i));
  c.a *= 1.0 - smoothstep(bottom, bottom + 0.035, 1.0 - vUv.y);
  if (c.a < 0.01) discard;
  // The fresco already carries Michelangelo's own shading, so the light only adds form on top of
  // it, gently: a wrapped key light from the upper left (light scatters a little way into skin,
  // so the shadow side never goes dead), a broad soft sheen rather than a hot spot, and turned
  // edges that warm and deepen like skin does instead of going grey.
  vec3 nn = normalize(vN);
  if (!gl_FrontFacing) nn = -nn;
  vec3 v = normalize(vV);
  vec3 l = normalize(vec3(-0.45, 0.55, 0.7));
  float wrap = clamp((dot(nn, l) + 0.45) / 1.45, 0.0, 1.0);
  float sheen = pow(max(dot(nn, normalize(l + v)), 0.0), 10.0);
  float edge = pow(1.0 - max(dot(nn, v), 0.0), 2.2);
  vec3 lit = c.rgb * mix(1.0, 0.74 + 0.38 * wrap, uShade);
  // subsurface: the shadow side picks up a touch of warm red, as light bleeds through the skin
  lit += c.rgb * vec3(0.1, 0.04, 0.02) * (1.0 - wrap) * uShade;
  lit += vec3(1.0, 0.93, 0.85) * sheen * 0.07 * uShade * (0.6 + 0.4 * dot(c.rgb, vec3(0.33)));
  lit = mix(lit, lit * vec3(0.8, 0.72, 0.68), edge * 0.32 * uShade);
  // the fresco's colour, pulled back so the skin reads as a soft, natural tone rather than saturated orange
  lit = mix(vec3(dot(lit, vec3(0.299, 0.587, 0.114))), lit, uSat);
  // the glow behind the hands catches their turned edges, like a rim light
  lit += uRim * pow(edge, 1.4) * uShade;
  gl_FragColor = vec4(lit * uTint, c.a * uAlpha);
}
`;

// God's hand: the same relief and light as Adam's. Its cut-out (god-arm.webp) already carries the
// arm on past the painting, so the shader only needs to light it.
const godFrag = /* glsl */ `
uniform sampler2D uMap;
uniform float uAlpha;
uniform float uTint;
uniform float uShade;
uniform float uSat;
uniform vec3 uRim;
varying vec2 vUv;
varying vec3 vN;
varying vec3 vV;
void main() {
  vec4 c = texture2D(uMap, vUv);
  if (c.a < 0.01) discard;
  vec3 nn = normalize(vN);
  if (!gl_FrontFacing) nn = -nn;
  vec3 v = normalize(vV);
  vec3 l = normalize(vec3(-0.45, 0.55, 0.7));
  float wrap = clamp((dot(nn, l) + 0.45) / 1.45, 0.0, 1.0);
  float sheen = pow(max(dot(nn, normalize(l + v)), 0.0), 10.0);
  float edge = pow(1.0 - max(dot(nn, v), 0.0), 2.2);
  vec3 lit = c.rgb * mix(1.0, 0.74 + 0.38 * wrap, uShade);
  lit += c.rgb * vec3(0.1, 0.04, 0.02) * (1.0 - wrap) * uShade;
  lit += vec3(1.0, 0.93, 0.85) * sheen * 0.07 * uShade * (0.6 + 0.4 * dot(c.rgb, vec3(0.33)));
  lit = mix(lit, lit * vec3(0.8, 0.72, 0.68), edge * 0.32 * uShade);
  // the fresco's colour, pulled back so the skin reads as a soft, natural tone rather than saturated orange
  lit = mix(vec3(dot(lit, vec3(0.299, 0.587, 0.114))), lit, uSat);
  // the glow behind the hands catches their turned edges, like a rim light
  lit += uRim * pow(edge, 1.4) * uShade;
  gl_FragColor = vec4(lit * uTint, c.a * uAlpha);
}
`;
// God's cut-out: the painting's layer is 909 px wide; the cut-out runs on to 1620 px so the
// upper arm reaches off screen
// The hands sit slightly see-through (90%), so they feel a touch lighter against the page
const HAND_OPACITY = 0.9;
const GOD_LAYER_W = 909, GOD_W = 1624, GOD_H = 1080; // includes the 4 px of fingertip that sat at the edge of Adam's layer

// Particles drifting out of the gap (all on the GPU; they loop forever)
const sparkVert = /* glsl */ `
attribute vec4 aRand;
uniform float uTime;
uniform float uSpread;
uniform float uDpr;
uniform vec3 uGap;
uniform float uReach;
uniform float uBurst;  // 0 = drifting in the gap, 1 = filling the whole view
uniform float uCamZ;
uniform float uD;
uniform float uVolR;
uniform float uCalm;   // 0 = streaming, 1 = settled into a slow drift that fills the view
uniform float uAspect;
varying float vA;
varying float vW;
void main() {
  // drifting out of the gap between the fingertips
  float ph = fract(uTime * (0.035 + aRand.y * 0.05) + aRand.z);
  float ang = aRand.x * 6.2832;
  vec3 dir = vec3(cos(ang), sin(ang) * 0.55, (aRand.w - 0.5) * 0.8);
  float r = pow(ph, 0.75) * uReach * (0.25 + 0.75 * uSpread) * (0.35 + aRand.y * 0.9);
  vec3 wob = vec3(sin(uTime * 0.4 + aRand.z * 20.0), cos(uTime * 0.33 + aRand.x * 15.0), 0.0) * 8.0 * ph;
  vec3 pE = uGap + dir * r + wob + vec3(0.0, ph * 10.0 * aRand.w, 0.0);
  float aE = sin(ph * 3.14159) * (0.3 + 0.7 * aRand.w) * 0.6;

  // taking over: a deep field of particles streaming past the camera
  float ph2 = fract(uTime * (0.03 + aRand.y * 0.05) + aRand.z * 3.7);
  float rr = sqrt(fract(aRand.x * 13.7 + aRand.w * 7.1)) * uVolR;
  float a2 = fract(aRand.y * 17.3 + aRand.z * 5.3) * 6.2832;
  float z = mix(-uD * 0.9, uCamZ - 6.0, ph2);
  vec3 pV = vec3(uGap.x + cos(a2) * rr, uGap.y + sin(a2) * rr, z);
  float dist = uCamZ - z;
  float aV = smoothstep(0.0, 0.2, ph2) * smoothstep(0.0, uD * 0.05, dist) * (0.5 + 0.5 * aRand.w);

  // each particle leaves the gap at its own moment
  float b = clamp(uBurst * 1.6 - aRand.y * 0.6, 0.0, 1.0);
  b = b * b * (3.0 - 2.0 * b);
  // settled: spread through a shallow slab in front of the camera, filling the view, each one
  // drifting slowly up and sideways and wrapping round (faded at the wrap so nothing pops)
  float dC = uD * mix(0.18, 0.62, fract(aRand.w * 11.3 + aRand.x * 3.1));
  float hh = dC * 0.3443 * 1.08;
  float fx = fract(aRand.x * 7.31 + aRand.z * 2.7 + uTime * 0.004 * (aRand.y - 0.35));
  float fy = fract(aRand.z * 5.13 + aRand.y * 1.9 + uTime * 0.006 * (0.3 + aRand.w));
  vec3 pC = vec3(uGap.x + (fx * 2.0 - 1.0) * hh * uAspect + sin(uTime * 0.21 + aRand.y * 30.0) * 6.0,
                 uGap.y + (fy * 2.0 - 1.0) * hh,
                 uCamZ - dC);
  float aC = sin(fx * 3.14159) * sin(fy * 3.14159) * (0.35 + 0.65 * aRand.w)
           * (0.55 + 0.45 * sin(uTime * (0.5 + aRand.y) + aRand.z * 40.0));
  aC = min(1.0, aC * 1.7);
  float c = uCalm * uCalm * (3.0 - 2.0 * uCalm);
  vec3 p = mix(mix(pE, pV, b), pC, c);
  vec4 mv = modelViewMatrix * vec4(p, 1.0);
  gl_Position = projectionMatrix * mv;
  float att = clamp(uD / max(-mv.z, 1.0), 0.9, 9.0);
  gl_PointSize = (1.0 + aRand.w * 3.0) * uDpr * mix(mix(1.0, att, b), clamp(uD * 0.5 / dC, 1.0, 2.6), c);
  vA = mix(mix(aE, aV, b), aC, c);
  vW = aRand.w;
}
`;
const sparkFrag = /* glsl */ `
uniform vec3 uColor;
uniform vec3 uCore;
uniform float uOpacity;
varying float vA;
varying float vW;
void main() {
  float d = length(gl_PointCoord - 0.5);
  if (d > 0.5) discard;
  float a = 1.0 - smoothstep(0.1, 0.5, d);
  gl_FragColor = vec4(mix(uColor, uCore, step(0.85, vW)), a * vA * uOpacity);
}
`;

// The void behind the hands: the page colour at the edges, deepening into a slow nebula that
// gathers round the gap, with a bright spark where the fingertips almost touch. uGlow grows as the
// camera flies in. Drawn as one full-screen triangle before everything else.
const voidVert = /* glsl */ `
void main() { gl_Position = vec4(position.xy, 0.0, 1.0); }
`;
const voidFrag = /* glsl */ `
${NOISE_GLSL}
uniform vec2 uRes;
uniform float uTime;
uniform float uGlow;
uniform vec3 uBg;
uniform vec3 uNeb;
uniform vec3 uFil;
uniform vec3 uCore;
float fbm(vec2 p) {
  float v = 0.0, a = 0.5;
  for (int i = 0; i < 4; i++) { v += a * vn(p); p = p * 2.03 + 11.7; a *= 0.5; }
  return v;
}
void main() {
  vec2 p = (gl_FragCoord.xy - 0.5 * uRes) / uRes.y;
  float r2 = dot(p, p);
  float t = uTime * 0.035;
  // domain-warped noise: slow, smoky filaments that drift and fold into each other
  vec2 q = p * 2.4;
  vec2 w = vec2(fbm(q + vec2(t, -t)), fbm(q + vec2(5.2, 1.3) - t));
  float n = fbm(q + 2.2 * w + vec2(0.0, t * 2.0));
  float fil = smoothstep(0.5, 0.82, n) * (1.0 - smoothstep(0.82, 0.98, n) * 0.4);
  float halo = exp(-r2 * mix(7.5, 2.2, uGlow));
  float core = exp(-r2 * mix(900.0, 70.0, uGlow * uGlow));
  float breathe = 0.92 + 0.08 * sin(uTime * 0.8);
  vec3 col = mix(uBg, uNeb, clamp(halo * (0.45 + 0.75 * n), 0.0, 1.0));
  col = mix(col, uFil, clamp(fil * halo * (0.55 + 0.35 * uGlow), 0.0, 1.0));
  col = mix(col, uCore, clamp(core * breathe * (0.9 + 0.6 * uGlow), 0.0, 1.0));
  gl_FragColor = vec4(col, 1.0);
}
`;

// Sculpt a painted cut-out into relief: inflate the silhouette by its distance from the edge
// (thin fingers stay slim, the forearm swells round). SX grid columns span the image; EXC more
// carry the form on past its left edge. Returns a plane whose z is the height, in image widths.
const sculpt = (iw: number, ih: number, SX: number, EXC: number, isIn: (u: number, yf: number) => boolean) => {
  const SY = Math.round((SX * ih) / iw);
  const NX = SX + EXC + 1, NY = SY + 1;
  const cell = iw / SX; // image px per grid step
  const inside = new Uint8Array(NX * NY);
  for (let j = 0; j < NY; j++) for (let i = 0; i < NX; i++) inside[j * NX + i] = isIn((i - EXC) / SX, j / SY) ? 1 : 0;
  // distance to the edge (chamfer), in grid steps
  const BIG = 1e6;
  const dist = new Float32Array(NX * NY);
  for (let k = 0; k < dist.length; k++) dist[k] = inside[k] ? BIG : 0;
  const at = (i: number, j: number) => (i < 0 || j < 0 || i >= NX || j >= NY ? 0 : dist[j * NX + i]);
  for (let j = 0; j < NY; j++) for (let i = 0; i < NX; i++) {
    const k = j * NX + i;
    if (!dist[k]) continue;
    dist[k] = Math.min(dist[k], at(i - 1, j) + 1, at(i, j - 1) + 1, at(i - 1, j - 1) + 1.414, at(i + 1, j - 1) + 1.414);
  }
  for (let j = NY - 1; j >= 0; j--) for (let i = NX - 1; i >= 0; i--) {
    const k = j * NX + i;
    if (!dist[k]) continue;
    dist[k] = Math.min(dist[k], at(i + 1, j) + 1, at(i, j + 1) + 1, at(i + 1, j + 1) + 1.414, at(i - 1, j + 1) + 1.414);
  }
  // local thickness: the ridge height nearby (separable max filter)
  const RAD = Math.round(48 / cell);
  const tmp = new Float32Array(NX * NY), ridge = new Float32Array(NX * NY);
  for (let j = 0; j < NY; j++) for (let i = 0; i < NX; i++) {
    let m = 0;
    for (let d = -RAD; d <= RAD; d++) m = Math.max(m, at(i + d, j));
    tmp[j * NX + i] = m;
  }
  for (let j = 0; j < NY; j++) for (let i = 0; i < NX; i++) {
    let m = 0;
    for (let d = -RAD; d <= RAD; d++) { const jj = j + d; if (jj >= 0 && jj < NY) m = Math.max(m, tmp[jj * NX + i]); }
    ridge[j * NX + i] = m;
  }
  // round cross-section: a circle of radius = local thickness
  let hgt = new Float32Array(NX * NY);
  for (let k = 0; k < hgt.length; k++) {
    const d = Math.min(dist[k], ridge[k]), T = ridge[k];
    hgt[k] = inside[k] ? Math.sqrt(Math.max(0, d * (2 * T - d))) * cell * 0.85 : 0;
  }
  for (let pass = 0; pass < 3; pass++) {
    const out = new Float32Array(NX * NY);
    for (let j = 0; j < NY; j++) for (let i = 0; i < NX; i++) {
      let sum = 0, n = 0;
      for (let dj = -1; dj <= 1; dj++) for (let di = -1; di <= 1; di++) {
        const ii = i + di, jj = j + dj;
        if (ii < 0 || jj < 0 || ii >= NX || jj >= NY) continue;
        sum += hgt[jj * NX + ii]; n++;
      }
      out[j * NX + i] = inside[j * NX + i] ? sum / n : 0;
    }
    hgt = out;
  }
  const ew = EXC / SX;
  const geo = new THREE.PlaneGeometry(1 + ew, 1, SX + EXC, SY);
  geo.translate(-ew / 2, 0, 0); // the painting keeps its place; any extra length runs left
  const pos = geo.attributes.position as THREE.BufferAttribute;
  const uvs = geo.attributes.uv as THREE.BufferAttribute;
  for (let k = 0; k < pos.count; k++) {
    pos.setZ(k, hgt[k] / iw); // in widths, like x
    uvs.setX(k, pos.getX(k) + 0.5);
  }
  geo.computeVertexNormals();
  return { geo };
};

export default function SculptureViewer() {
  const containerRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const flashRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();
  const targetMouse = useRef({ x: 0, y: 0 });
  const currentMouse = useRef({ x: 0, y: 0 });
  const scrollProgressRef = useRef(0);

  useEffect(() => {
    if (!containerRef.current || !wrapperRef.current) return;
    const container = containerRef.current;
    const wrapper = wrapperRef.current;
    const flash = flashRef.current;
    gsap.registerPlugin(ScrollTrigger);
    let disposed = false;

    const isDark = theme === "dark";
    const blend = isDark ? THREE.AdditiveBlending : THREE.NormalBlending;

    const isCoarse = window.matchMedia("(pointer: coarse)").matches;
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
    // 1.5× looks the same for soft painted hands and drifting dots, and draws ~45% fewer pixels
    // than 2× on Retina screens, which is most of the hero's cost
    const maxDpr = Math.min(window.devicePixelRatio, 1.5);
    renderer.setPixelRatio(maxDpr);
    renderer.setClearColor(0x000000, 0);
    renderer.autoClear = false;
    container.appendChild(renderer.domElement);

    // 3D scene: the hands and the particles
    const scene = new THREE.Scene();
    const FOV = 38;
    const camera = new THREE.PerspectiveCamera(FOV, 1, 1, 20000);

    const loader = new THREE.TextureLoader();
    const adamTex = loader.load("/adam-layer-clean.webp");
    adamTex.colorSpace = THREE.NoColorSpace;
    adamTex.anisotropy = 4;

    const dprU = { value: maxDpr };

    // The void: its own full-screen pass, drawn before the hands and particles
    const voidMat = new THREE.ShaderMaterial({
      uniforms: {
        uRes: { value: new THREE.Vector2(1, 1) },
        uTime: { value: 0 },
        uGlow: { value: 0 },
        uBg: { value: hex3(isDark ? 0x000000 : 0xffffff) },
        uNeb: { value: hex3(isDark ? 0x1d0b3a : 0xeee5ff) },
        uFil: { value: hex3(isDark ? 0x7c3aed : 0xd8c8ff) },
        uCore: { value: hex3(isDark ? 0xeadcff : 0xb99cf6) },
      },
      vertexShader: voidVert,
      fragmentShader: voidFrag,
      depthWrite: false,
      depthTest: false,
    });
    const voidTri = new THREE.BufferGeometry();
    voidTri.setAttribute("position", new THREE.Float32BufferAttribute([-1, -1, 0, 3, -1, 0, -1, 3, 0], 3));
    const voidMesh = new THREE.Mesh(voidTri, voidMat);
    voidMesh.frustumCulled = false;
    const voidScene = new THREE.Scene();
    voidScene.add(voidMesh);
    const voidCam = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    // the glow's colour on the hands' edges (soft violet in the dark, barely there in the light)
    const rimCol = hex3(isDark ? 0x7a4fd0 : 0x6d4bb8).multiplyScalar(isDark ? 0.55 : 0.12);

    const adamMat = new THREE.ShaderMaterial({
      uniforms: {
        uMap: { value: adamTex },
        uAlpha: { value: 1 },
        uTint: { value: isDark ? 0.86 : 1 },
        uBottom: { value: ADAM_BOT },
        uShade: { value: 0 },
        uSat: { value: 0.85 },
        uRim: { value: rimCol },
      },
      vertexShader: adamVert,
      fragmentShader: adamFrag,
      transparent: true,
      depthWrite: false,
      side: THREE.DoubleSide,
    });
    const adam = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), adamMat);
    adam.renderOrder = 1;

    // Sculpt the relief once the painting is in: inflate the silhouette by its distance from the
    // edge (thin fingers stay slim, the forearm swells round), then light it
    const adamImg = new Image();
    adamImg.onload = () => {
      if (disposed) return;
      const iw = adamImg.naturalWidth, ih = adamImg.naturalHeight;
      const cv = document.createElement("canvas");
      cv.width = iw;
      cv.height = ih;
      const cx = cv.getContext("2d", { willReadFrequently: true })!;
      cx.drawImage(adamImg, 0, 0);
      const px = cx.getImageData(0, 0, iw, ih).data;
      const SX = isCoarse ? 140 : 220;
      const EXC = Math.round(SX * 1.1); // grid columns added to carry the arm on past the shoulder
      const { geo } = sculpt(iw, ih, SX, EXC, (u, yf) => {
        const ix = Math.min(iw - 1, Math.round(Math.max(u, 0.03) * (iw - 1))), iy = Math.min(ih - 1, Math.round(yf * (ih - 1)));
        const fx = Math.min(Math.max(u, 0), 0.9999) * 10, i0 = Math.floor(fx);
        const bottom = ADAM_BOT[i0] + (ADAM_BOT[i0 + 1] - ADAM_BOT[i0]) * (fx - i0);
        return px[(iy * iw + ix) * 4 + 3] > 120 && yf < bottom + 0.02;
      });
      adam.geometry.dispose();
      adam.geometry = geo;
      adamMat.uniforms.uShade.value = 1;
    };
    adamImg.src = "/adam-layer-clean.webp";

    // God's hand, sculpted the same way from its own cut-out
    const godTex = loader.load("/god-arm.webp");
    godTex.colorSpace = THREE.NoColorSpace;
    godTex.anisotropy = 4;
    const godMat = new THREE.ShaderMaterial({
      uniforms: {
        uMap: { value: godTex },
        uAlpha: { value: 1 },
        uTint: { value: isDark ? 0.86 : 1 },
        uShade: { value: 0 },
        uSat: { value: 0.85 },
        uRim: { value: rimCol },
      },
      vertexShader: adamVert,
      fragmentShader: godFrag,
      transparent: true,
      depthWrite: false,
      side: THREE.DoubleSide,
    });
    const god = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), godMat);
    god.renderOrder = 2;
    const godImg = new Image();
    godImg.onload = () => {
      if (disposed) return;
      const iw = godImg.naturalWidth, ih = godImg.naturalHeight;
      const cv = document.createElement("canvas");
      cv.width = iw;
      cv.height = ih;
      const cx = cv.getContext("2d", { willReadFrequently: true })!;
      cx.drawImage(godImg, 0, 0);
      const px = cx.getImageData(0, 0, iw, ih).data;
      const SX = isCoarse ? 220 : 320; // coarser grid: the relief looks the same, and building it no longer stalls the intro
      const { geo } = sculpt(iw, ih, SX, 0, (u, yf) => {
        const ix = Math.min(iw - 1, Math.round(u * (iw - 1))), iy = Math.min(ih - 1, Math.round(yf * (ih - 1)));
        return px[(iy * iw + ix) * 4 + 3] > 120;
      });
      god.geometry.dispose();
      god.geometry = geo;
      godMat.uniforms.uShade.value = 1;
    };
    godImg.src = "/god-arm.webp";

    // Particles in the gap
    const SPARKS = isCoarse ? 2400 : 5200;
    const sparkGeo = new THREE.BufferGeometry();
    sparkGeo.setAttribute("position", new THREE.Float32BufferAttribute(new Float32Array(SPARKS * 3), 3));
    const rand = new Float32Array(SPARKS * 4);
    for (let i = 0; i < SPARKS * 4; i++) rand[i] = Math.random();
    sparkGeo.setAttribute("aRand", new THREE.BufferAttribute(rand, 4));
    const sparkMat = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uSpread: { value: 0 },
        uDpr: dprU,
        uGap: { value: new THREE.Vector3() },
        uReach: { value: 300 },
        uBurst: { value: 0 },
        uCamZ: { value: 1000 },
        uD: { value: 1000 },
        uVolR: { value: 1000 },
        uColor: { value: hex3(isDark ? 0xb98cf5 : 0x9333ea) },
        uCore: { value: hex3(isDark ? 0xffffff : 0x581c87) },
        uOpacity: { value: 1 },
        uCalm: { value: 0 },
        uAspect: { value: 1 },
      },
      vertexShader: sparkVert,
      fragmentShader: sparkFrag,
      transparent: true,
      depthWrite: false,
      blending: blend,
    });
    const sparks = new THREE.Points(sparkGeo, sparkMat);
    sparks.frustumCulled = false;
    sparks.renderOrder = 0; // drawn first, so the hands sit in front of the particles
    scene.add(sparks);

    // Both hands sit on a stage turned about the gap, so Adam reaches up from the bottom left
    // and God down from the top right, fingertips meeting in the middle
    const stage = new THREE.Group();
    stage.add(adam, god);
    scene.add(stage);

    // ---------- Layout ----------
    let W = 1, H = 1, S = 1, D = 1;
    let stageBase = 0;
    const adamHome = new THREE.Vector2();
    const gap = new THREE.Vector3();
    const godHome = new THREE.Vector2();

    const build = () => {
      W = Math.max(1, container.clientWidth);
      H = Math.max(1, container.clientHeight);
      renderer.setSize(W, H);
      dprU.value = renderer.getPixelRatio();
      camera.aspect = W / H;
      camera.updateProjectionMatrix();
      D = H / 2 / Math.tan(THREE.MathUtils.degToRad(FOV / 2)); // 1 world unit = 1 px on z = 0

      // Same stage proportions as the footer (both layers share one scale). The fingertips meet
      // at the centre of the screen and the stage is turned so the arms run in from the corners.
      const R = Math.hypot(W, H) / 2;
      S = Math.min(R * 2.0, 2600);
      const tipY = H * 0.5;
      const sx = W / 2 - 0.4386 * S;
      const sy = tipY - 0.3262 * S;
      const gapHalf = 0.006 * S;
      const aw = 0.4389 * S, ah = 0.4129 * S;
      adamHome.set(sx + aw / 2 - gapHalf, H - (sy + 0.2537 * S + ah / 2));
      adam.scale.set(aw, ah, aw);
      // God's painting layer spans 0.5611 S across its 909 px; the cut-out is wider, anchored left
      const gpx = (0.5611 * S) / GOD_LAYER_W;
      godHome.set(sx + 0.4389 * S + gapHalf + (GOD_W * gpx) / 2, H - (sy + 0.6667 * S / 2));
      god.scale.set(GOD_W * gpx, GOD_H * gpx, GOD_W * gpx);
      gap.set(W / 2, H - tipY, 0);
      stage.position.copy(gap);
      stageBase = Math.min(0.62, Math.max(0.36, Math.atan2(H, W) * 0.95));
      stage.rotation.z = stageBase;
      sparkMat.uniforms.uReach.value = W * 0.32;
      sparkMat.uniforms.uD.value = D;
      sparkMat.uniforms.uVolR.value = Math.max(W, H) * 0.6;
      sparkMat.uniforms.uAspect.value = W / H;
      voidMat.uniforms.uRes.value.set(W * renderer.getPixelRatio(), H * renderer.getPixelRatio());
    };
    build();

    // ---------- Scroll ----------
    const updateProgress = (progress: number) => {
      scrollProgressRef.current = progress;
      wrapper.style.opacity = clamp01((1 - progress) * 12).toString();
      wrapper.style.visibility = progress >= 0.99 ? "hidden" : "visible";
    };
    const trigger = ScrollTrigger.create({
      trigger: "#showcase",
      start: "top top",
      end: "bottom bottom",
      scrub: true,
      onUpdate: (self) => updateProgress(self.progress),
      onEnter: () => { wrapper.style.visibility = "visible"; },
      onLeave: () => { wrapper.style.opacity = "0"; wrapper.style.visibility = "hidden"; },
      onEnterBack: (self) => { wrapper.style.visibility = "visible"; updateProgress(self.progress); },
      onLeaveBack: () => updateProgress(0),
    });

    let isIntersecting = false;
    const handleMouseMove = (event: MouseEvent) => {
      if (!isIntersecting) return;
      targetMouse.current = { x: event.clientX / window.innerWidth - 0.5, y: event.clientY / window.innerHeight - 0.5 };
    };
    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    let resizeTimer: number | undefined;
    const handleResize = () => {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(build, 120);
    };
    window.addEventListener("resize", handleResize);

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const clock = new THREE.Clock();
    let animationFrameId: number | null = null;
    let smoothP = 0;
    let dpr = maxDpr, frameAcc = 0, frameN = 0, goodRuns = 0, drops = 0;
    const camPos = new THREE.Vector3();
    const camLook = new THREE.Vector3();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const rawDt = clock.getDelta(); // read every frame so a pause doesn't turn into one huge step
      if (scrollProgressRef.current >= 0.99) return;
      frameAcc += rawDt;
      frameN++;
      if (frameN >= 40) {
        const avg = frameAcc / frameN;
        // Resolution steps down when frames run slow and only creeps back after a sustained run of
        // fast frames (and gives up after it has had to drop twice), so it doesn't flip back and
        // forth: every change reallocates the canvas and causes a hitch of its own
        if (avg > 1 / 52 && dpr > 1) { dpr = Math.max(1, dpr - 0.25); goodRuns = 0; drops++; }
        else if (avg < 1 / 58) { if (++goodRuns >= 4 && drops < 2 && dpr < maxDpr) { dpr = Math.min(maxDpr, dpr + 0.25); goodRuns = 0; } }
        else goodRuns = 0;
        if (renderer.getPixelRatio() !== dpr) {
          renderer.setPixelRatio(dpr);
          renderer.setSize(W, H);
          dprU.value = dpr;
          voidMat.uniforms.uRes.value.set(W * dpr, H * dpr);
        }
        frameAcc = 0;
        frameN = 0;
      }
      const time = reduceMotion ? 0 : clock.elapsedTime;
      // easing by elapsed time rather than per frame, so it feels the same at 60 Hz and 120 Hz
      const dt = Math.min(rawDt, 0.05);
      const ease = (k: number) => 1 - Math.exp(-k * dt);
      smoothP += (scrollProgressRef.current - smoothP) * ease(6.3);
      const p = smoothP;

      const zoom = sstep(p, 0.03, 0.5); // the camera flies into the gap
      const adamOut = sstep(p, 0.16, 0.34); // the painted hands fade as the camera passes them
      const burst = sstep(p, 0.05, 0.36); // particles take over the view
      const calm = sstep(p, 0.48, 0.8); // the stream slows into a quiet drift behind the quote

      currentMouse.current.x += (targetMouse.current.x - currentMouse.current.x) * ease(3.7);
      currentMouse.current.y += (targetMouse.current.y - currentMouse.current.y) * ease(3.7);
      const mx = currentMouse.current.x, my = currentMouse.current.y;

      // Camera: starts square-on (1 px = 1 unit) and flies straight into the gap between the
      // fingertips, with a slight roll as it goes
      const e = zoom * zoom * (1.6 - 0.6 * zoom);
      camPos.set(W / 2 + mx * 30 * (1 - e), H / 2 - my * 20 * (1 - e), D * (1 - 0.93 * e));
      camLook.set(W / 2 + mx * 10 * (1 - e), H / 2 - my * 6 * (1 - e), 0);
      camera.position.copy(camPos);
      camera.up.set(0, 1, 0);
      camera.lookAt(camLook);
      camera.updateMatrixWorld();

      // Hands (positions are relative to the turned stage, whose origin is the gap)
      const breath = Math.sin(time * 0.7) * 0.003 * S * (1 - zoom);
      adam.position.set(adamHome.x - gap.x + breath, adamHome.y - gap.y, 0);
      adamMat.uniforms.uAlpha.value = HAND_OPACITY * (1 - adamOut);
      adam.visible = adamOut < 0.999;
      // turn the arm a touch with the mouse so its volume shows
      adam.rotation.set(my * 0.22 * (1 - zoom), mx * 0.3 * (1 - zoom), 0);
      // the hands turn clockwise about the gap as you scroll in
      stage.rotation.z = stageBase - e * 1.15;
      stage.updateMatrixWorld();

      god.position.set(godHome.x - gap.x - breath + adamOut * 40, godHome.y - gap.y, 0);
      god.rotation.set(my * 0.22 * (1 - zoom), mx * 0.3 * (1 - zoom), 0);
      godMat.uniforms.uAlpha.value = HAND_OPACITY * (1 - adamOut);
      god.visible = adamOut < 0.999;

      sparkMat.uniforms.uTime.value = time;
      sparkMat.uniforms.uSpread.value = 0.3 + 0.7 * sstep(p, 0.02, 0.2);
      sparkMat.uniforms.uBurst.value = burst;
      sparkMat.uniforms.uCamZ.value = camPos.z;
      sparkMat.uniforms.uCalm.value = calm;
      sparkMat.uniforms.uOpacity.value = (isDark ? 0.95 : 0.85) * (1 - calm * (isDark ? 0.12 : 0.08));
      sparkMat.uniforms.uGap.value.set(gap.x, gap.y, 0);
      sparks.visible = sparkMat.uniforms.uOpacity.value > 0.001;

      // the nebula brightens as the camera nears the gap, flares as it passes through, then settles
      voidMat.uniforms.uTime.value = time;
      voidMat.uniforms.uGlow.value = 0.15 + 0.85 * zoom - 0.35 * calm;
      if (flash) flash.style.opacity = (sstep(p, 0.2, 0.31) * (1 - sstep(p, 0.33, 0.5)) * (isDark ? 0.85 : 0.9)).toFixed(3);

      renderer.clear();
      renderer.render(voidScene, voidCam);
      renderer.render(scene, camera);
    };

    const showcaseElem = document.getElementById("showcase") || container;
    const observer = new IntersectionObserver(
      ([entry]) => {
        isIntersecting = entry.isIntersecting;
        if (isIntersecting) {
          if (!animationFrameId) {
            clock.start();
            animate();
          }
        } else if (animationFrameId) {
          cancelAnimationFrame(animationFrameId);
          animationFrameId = null;
          clock.stop();
        }
      },
      { threshold: 0.01 }
    );
    observer.observe(showcaseElem);

    return () => {
      disposed = true;
      godImg.onload = null;
      adamImg.onload = null;
      trigger.kill();
      observer.disconnect();
      window.clearTimeout(resizeTimer);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
      for (const sc of [scene]) {
        sc.traverse((o) => {
          const m = o as THREE.Mesh;
          m.geometry?.dispose();
          (m.material as THREE.Material | undefined)?.dispose();
        });
      }
      voidTri.dispose();
      voidMat.dispose();
      adamTex.dispose();
      godTex.dispose();
      try {
        container.removeChild(renderer.domElement);
      } catch {
        // ignore
      }
      renderer.dispose();
    };
  }, [theme]);

  return (
    <div ref={wrapperRef} className="fixed inset-0 w-full h-full pointer-events-none overflow-hidden select-none z-0">
      <div ref={containerRef} className="w-full h-full absolute inset-0 pointer-events-none" />
      {/* the flare as the camera passes between the fingertips */}
      <div
        ref={flashRef}
        className="absolute inset-0 pointer-events-none opacity-0"
        style={{
          background:
            theme === "dark"
              ? "radial-gradient(ellipse at 50% 50%, rgba(214,190,255,.9) 0%, rgba(124,58,237,.42) 34%, rgba(0,0,0,0) 78%)"
              : "radial-gradient(ellipse at 50% 50%, rgba(255,255,255,1) 0%, rgba(237,228,255,.75) 40%, rgba(255,255,255,0) 80%)",
        }}
      />
    </div>
  );
}
