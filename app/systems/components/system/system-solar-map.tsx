"use client";

import type { FunctionComponent } from "react";
import { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";
import type { System } from "@/core/interfaces/System";
import type { MappedSystemBody } from "@/core/interfaces/SystemBody";
import { getResource } from "@/core/api";
import { SystemBodyType } from "@/core/constants/system";
import SystemMap from "../../lib/system-map";
import { systemState } from "../../lib/state";
import Loader from "@/components/loader";
import PanelCorners from "@/components/panel-corners";

// ─── Color utilities ──────────────────────────────────────────────────────────

function lightenHex(hex: string, amount: number): string {
  const r = Math.min(255, parseInt(hex.slice(1, 3), 16) + amount);
  const g = Math.min(255, parseInt(hex.slice(3, 5), 16) + amount);
  const b = Math.min(255, parseInt(hex.slice(5, 7), 16) + amount);
  return `rgb(${r},${g},${b})`;
}

function darkenHex(hex: string, amount: number): string {
  const r = Math.max(0, parseInt(hex.slice(1, 3), 16) - amount);
  const g = Math.max(0, parseInt(hex.slice(3, 5), 16) - amount);
  const b = Math.max(0, parseInt(hex.slice(5, 7), 16) - amount);
  return `rgb(${r},${g},${b})`;
}

function hexToRgba(hex: string, alpha: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r},${g},${b},${alpha})`;
}

// ─── Body color mapping ───────────────────────────────────────────────────────

const SPECTRAL_COLORS: Record<string, string> = {
  O: "#9bb0ff",
  B: "#aabfff",
  A: "#cad7ff",
  F: "#f8f7ff",
  G: "#fff4e8",
  K: "#ffd2a1",
  M: "#ff8844",
  L: "#cc4400",
  T: "#993300",
  Y: "#661100",
  W: "#aaddff",
  D: "#ddeeff",
  N: "#8888ff",
  H: "#220033",
};

function getBodyColor(body: MappedSystemBody): string {
  if (body._type === SystemBodyType.Star) {
    const sub = body.sub_type?.toLowerCase() ?? "";
    if (sub.includes("black hole")) return "#220033";
    if (sub.includes("neutron")) return "#8888ff";
    if (sub.includes("white dwarf")) return "#ddeeff";
    const spectral = (body.spectral_class?.[0] ?? "").toUpperCase();
    return SPECTRAL_COLORS[spectral] ?? "#ffaa44";
  }

  const st = body.sub_type?.toLowerCase() ?? "";
  if (st.includes("earthlike") || st.includes("earth-like")) return "#4a9a4a";
  if (st.includes("water world")) return "#2266bb";
  if (st.includes("ammonia")) return "#cc9933";
  if (st.includes("class i gas")) return "#b0c8e8";
  if (st.includes("class ii gas")) return "#d4c080";
  if (st.includes("class iii gas")) return "#e8a060";
  if (st.includes("class iv gas")) return "#c04000";
  if (st.includes("class v gas")) return "#802000";
  if (st.includes("gas giant")) return "#c07030";
  if (st.includes("metal rich")) return "#999999";
  if (st.includes("high metal")) return "#708070";
  if (st.includes("rocky ice")) return "#8898a8";
  if (st.includes("rocky")) return "#7a6050";
  if (st.includes("icy")) return "#88aacc";
  if (st.includes("water giant")) return "#3366aa";
  if (st.includes("helium")) return "#ccccdd";
  return "#707070";
}

function getDisplayRadius(body: MappedSystemBody, isMainStar: boolean): number {
  if (body._type === SystemBodyType.Star) {
    const sub = body.sub_type?.toLowerCase() ?? "";
    if (sub.includes("black hole")) return isMainStar ? 18 : 12;
    if (sub.includes("neutron")) return isMainStar ? 12 : 8;
    if (sub.includes("white dwarf")) return isMainStar ? 11 : 7;
    return isMainStar ? 30 : 20;
  }
  const r = body._r ?? 800;
  return Math.max(4, Math.min(13, ((r - 800) / 800) * 9 + 4));
}

// ─── Vibrant colour for canvas "color" composite ─────────────────────────────
// The "color" blend mode uses the source's chroma (not HSL saturation).
// Near-white colours like #fff4e8 (G-type Sol) have almost zero chroma and
// produce a grey/white result. This function keeps only the hue and forces
// saturation=0.85 + lightness=0.50 so there is always enough chroma to tint.

function toVibrantColor(hex: string): string {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const d = max - min;

  // Near-grey — no meaningful hue; return neutral grey so the texture
  // shows its natural luminance without an unwanted colour cast.
  if (d < 0.05) return "rgb(128,128,128)";

  let h = 0;
  switch (max) {
    case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
    case g: h = ((b - r) / d + 2) / 6; break;
    case b: h = ((r - g) / d + 4) / 6; break;
  }

  // Force high saturation and mid lightness so chroma is always strong
  const s = 0.85, l = 0.50;
  const q = l + s - l * s;
  const p = 2 * l - q;
  const hue2rgb = (t: number) => {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1 / 6) return p + (q - p) * 6 * t;
    if (t < 1 / 2) return q;
    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
    return p;
  };
  return `rgb(${Math.round(hue2rgb(h + 1 / 3) * 255)},${Math.round(hue2rgb(h) * 255)},${Math.round(hue2rgb(h - 1 / 3) * 255)})`;
}

// ─── Texture key lookup ───────────────────────────────────────────────────────

function getTextureKey(body: MappedSystemBody): string | null {
  if (body._type === SystemBodyType.Star) {
    const sub = body.sub_type?.toLowerCase() ?? "";
    if (sub.includes("black hole")) return null;
    return "star";
  }
  const st = body.sub_type?.toLowerCase() ?? "";
  if (
    st.includes("gas giant") ||
    st.includes("class i gas") ||
    st.includes("class ii gas") ||
    st.includes("class iii gas") ||
    st.includes("class iv gas") ||
    st.includes("class v gas") ||
    st.includes("helium rich gas")
  ) {
    return "gasGiant";
  }
  return "rock";
}

// ─── Orbit radius scaling ─────────────────────────────────────────────────────

function scaleOrbitRadius(au: number, maxAu: number): number {
  if (au <= 0) return 0;
  const logMin = Math.log(0.005);
  const logMax = Math.log(Math.max(maxAu, 0.1) + 1);
  const logVal = Math.log(au + 0.005);
  const t = Math.min(1, Math.max(0, (logVal - logMin) / (logMax - logMin)));
  // Map to px range 55–400
  return 55 + t * 345;
}

// Orbit radius for bodies that orbit a planet (moons, sub-moons …).
// Uses semi_major_axis (AU) and maps to a tighter pixel range so moons
// appear close to — but clearly separated from — their parent body.
function scaleChildOrbitRadius(sma: number): number {
  if (sma <= 0) return 20;
  const logMin = Math.log(0.0003);
  const logMax = Math.log(0.3);
  const logVal = Math.log(sma);
  const t = Math.min(1, Math.max(0, (logVal - logMin) / (logMax - logMin)));
  return 20 + t * 60; // 20 – 80 px before zoom
}

// ─── Kepler orbital mechanics ────────────────────────────────────────────────
// Solve Kepler's equation M = E - e·sin(E) via Newton-Raphson iteration.
// Returns eccentric anomaly E given mean anomaly M and eccentricity e.
function solveKepler(M: number, e: number): number {
  if (e < 0.001) return M;
  let E = M;
  for (let i = 0; i < 12; i++) {
    const dE = (M - E + e * Math.sin(E)) / (1 - e * Math.cos(E));
    E += dE;
    if (Math.abs(dE) < 1e-8) break;
  }
  return E;
}

// Convert eccentric anomaly E to true anomaly ν.
function trueAnomaly(E: number, e: number): number {
  return 2 * Math.atan2(Math.sqrt(1 + e) * Math.sin(E / 2), Math.sqrt(1 - e) * Math.cos(E / 2));
}

// Compute normalised (unit semi-major-axis) orbital position (x, y) given
// mean anomaly M, eccentricity e, and argument of periapsis ω (radians).
// Returns [x, y] in the ecliptic plane before inclination is applied.
function keplerPosition(M: number, e: number, omega: number): [number, number] {
  const E = solveKepler(M, e);
  const nu = trueAnomaly(E, e);
  const r = 1 - e * Math.cos(E); // normalised radius (semi-major = 1)
  return [r * Math.cos(nu + omega), r * Math.sin(nu + omega)];
}

// ─── Canvas drawing helpers ───────────────────────────────────────────────────

function drawStarfield(ctx: CanvasRenderingContext2D, w: number, h: number): void {
  ctx.fillStyle = "#000000";
  ctx.fillRect(0, 0, w, h);

  for (let i = 0; i < 700; i++) {
    const x = Math.random() * w;
    const y = Math.random() * h;
    const r = Math.random() * 1.4 + 0.2;
    const brightness = Math.random() * 0.65 + 0.35;
    const roll = Math.random();
    const color =
      roll < 0.08
        ? `rgba(180,200,255,${brightness})`
        : roll < 0.13
          ? `rgba(255,220,180,${brightness})`
          : `rgba(255,255,255,${brightness})`;
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }

  // Subtle HUD grid overlay
  ctx.strokeStyle = "rgba(251,146,60,0.035)";
  ctx.lineWidth = 0.5;
  const gridSize = 60;
  for (let x = 0; x < w; x += gridSize) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, h);
    ctx.stroke();
  }
  for (let y = 0; y < h; y += gridSize) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(w, y);
    ctx.stroke();
  }
}

function drawOrbitRing(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  orbitPx: number,
  yScale: number,
  zoom: number,
  isChild: boolean = false,
  eccentricity: number = 0,
  argOfPeriapsis: number = 0,
  inclination: number = 0,
): void {
  const bodyYScale = Math.cos(inclination) * yScale;
  // Sample the orbital path via mean anomaly so eccentric orbits render correctly
  const N = 96;
  ctx.beginPath();
  for (let k = 0; k <= N; k++) {
    const M = (k / N) * Math.PI * 2;
    const [xOrb, yOrb] = keplerPosition(M, eccentricity, argOfPeriapsis);
    const sx = cx + xOrb * orbitPx * zoom;
    const sy = cy + yOrb * orbitPx * bodyYScale * zoom;
    if (k === 0) ctx.moveTo(sx, sy); else ctx.lineTo(sx, sy);
  }
  ctx.strokeStyle = isChild ? "rgba(250,150,0,0.07)" : "rgba(250,150,0,0.13)";
  ctx.setLineDash([3, 9]);
  ctx.lineWidth = 0.8;
  ctx.stroke();
  ctx.setLineDash([]);
}

function drawBody(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  radius: number,
  color: string,
  isSelected: boolean,
  isMainStar: boolean,
  isBlackHole: boolean,
  texture: HTMLImageElement | null = null,
  texScrollX: number = 0,
): void {
  if (isBlackHole) {
    // Accretion disk glow
    const accGrad = ctx.createRadialGradient(x, y, radius, x, y, radius * 4.5);
    accGrad.addColorStop(0, "rgba(100,0,180,0.5)");
    accGrad.addColorStop(0.4, "rgba(180,0,80,0.2)");
    accGrad.addColorStop(1, "transparent");
    ctx.fillStyle = accGrad;
    ctx.beginPath();
    ctx.arc(x, y, radius * 4.5, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#000000";
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();
  } else {
    // ── Outer glow ────────────────────────────────────────────────
    const glowSize = radius * (isMainStar ? 4.5 : 3.2);
    const glowGrad = ctx.createRadialGradient(x, y, 0, x, y, glowSize);
    glowGrad.addColorStop(0, hexToRgba(color, isMainStar ? 0.45 : 0.3));
    glowGrad.addColorStop(0.5, hexToRgba(color, isMainStar ? 0.15 : 0.08));
    glowGrad.addColorStop(1, "transparent");
    ctx.fillStyle = glowGrad;
    ctx.beginPath();
    ctx.arc(x, y, glowSize, 0, Math.PI * 2);
    ctx.fill();

    // ── Sphere body (clipped circle) ──────────────────────────────
    ctx.save();
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.clip();

    const d = radius * 2;

    if (texture && texture.complete && texture.naturalWidth > 0) {
      // Scale texture so its height matches the body diameter
      const scale = d / texture.naturalHeight;
      const texW = texture.naturalWidth * scale;
      // Normalise scroll so it always advances forward (never negative)
      const scrollPx = ((texScrollX % texW) + texW) % texW;

      // Tile horizontally to cover the circle, offset by scrollPx
      for (let dx = x - radius - scrollPx; dx < x + radius; dx += texW) {
        ctx.drawImage(texture, dx, y - radius, texW, d);
      }

      // "color" composite mode: keeps the texture's luminance (surface detail)
      // but replaces its hue + saturation with the spectral / body-type colour,
      // so a blue star looks blue, a water world looks blue, etc.
      ctx.globalCompositeOperation = "color";
      ctx.globalAlpha = isMainStar ? 0.60 : 0.75;
      ctx.fillStyle = toVibrantColor(color);
      ctx.fillRect(x - radius, y - radius, d, d);
      ctx.globalCompositeOperation = "source-over";
      ctx.globalAlpha = 1;
    } else {
      // Fallback gradient sphere
      const sphereGrad = ctx.createRadialGradient(
        x - radius * 0.35,
        y - radius * 0.35,
        0,
        x,
        y,
        radius,
      );
      sphereGrad.addColorStop(0, lightenHex(color, 70));
      sphereGrad.addColorStop(0.65, color);
      sphereGrad.addColorStop(1, darkenHex(color, 55));
      ctx.fillStyle = sphereGrad;
      ctx.fillRect(x - radius, y - radius, d, d);
    }

    // ── Day / night shading (light source: top-left) ──────────────
    const shadeGrad = ctx.createRadialGradient(
      x - radius * 0.45,
      y - radius * 0.45,
      0,
      x + radius * 0.55,
      y + radius * 0.55,
      radius * 1.55,
    );
    if (isMainStar) {
      shadeGrad.addColorStop(0, "rgba(255,255,255,0.18)");
      shadeGrad.addColorStop(0.5, "rgba(255,255,255,0.0)");
      shadeGrad.addColorStop(1, "rgba(0,0,0,0.12)");
    } else {
      shadeGrad.addColorStop(0, "rgba(255,255,255,0.07)");
      shadeGrad.addColorStop(0.4, "rgba(0,0,0,0.0)");
      shadeGrad.addColorStop(0.7, "rgba(0,0,0,0.38)");
      shadeGrad.addColorStop(1, "rgba(0,0,0,0.72)");
    }
    ctx.fillStyle = shadeGrad;
    ctx.fillRect(x - radius, y - radius, d, d);

    ctx.restore();
  }

  if (isSelected) {
    ctx.strokeStyle = "rgba(20,245,255,0.85)";
    ctx.lineWidth = 1.5;
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.arc(x, y, radius + 6, 0, Math.PI * 2);
    ctx.stroke();
    ctx.setLineDash([]);
  }
}

function drawLabel(
  ctx: CanvasRenderingContext2D,
  label: string,
  x: number,
  y: number,
  radius: number,
  isMainStar: boolean,
): void {
  ctx.font = `${isMainStar ? 12 : 10}px "Jura", monospace`;
  ctx.textAlign = "center";
  ctx.fillStyle = isMainStar ? "rgba(250,150,0,0.95)" : "rgba(20,245,255,0.9)";
  ctx.fillText(label, x, y - radius - 8);
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getSecurityColor(security: string): string {
  const s = security.toLowerCase();
  if (s.includes("high")) return "text-green-400";
  if (s.includes("medium")) return "text-yellow-400";
  if (s.includes("low")) return "text-orange-400";
  if (s.includes("anarchy") || s.includes("lawless")) return "text-red-400";
  return "text-neutral-400";
}

function formatPopulation(n: number): string {
  if (n >= 1_000_000_000) return `${(n / 1_000_000_000).toFixed(1)}B`;
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}K`;
  return n.toLocaleString();
}

// ─── Types ────────────────────────────────────────────────────────────────────

interface OrbitalBody {
  body: MappedSystemBody;
  orbitPx: number;
  startAngle: number;
  angularVelocity: number;
  color: string;
  displayRadius: number;
  isMainStar: boolean;
  isBlackHole: boolean;
  textureKey: string | null;
  texOffset: number; // px: fixed random offset for planets, base for star animation
  parentIndex: number; // -1 = orbits canvas centre; ≥0 = index of parent in array
  eccentricity: number; // 0–<1
  inclination: number; // radians
  argOfPeriapsis: number; // radians
}

interface Props {
  params: { slug: string };
}

// ─── Component ────────────────────────────────────────────────────────────────

const SystemSolarMap: FunctionComponent<Props> = ({ params }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const bgCanvasRef = useRef<HTMLCanvasElement>(null);
  const animFrameRef = useRef<number>(0);
  const orbitalBodiesRef = useRef<OrbitalBody[]>([]);
  const texturesRef = useRef<Record<string, HTMLImageElement>>({});

  // Animation state via refs (avoids stale closure in RAF)
  const isPausedRef = useRef<boolean>(false);
  const speedRef = useRef<number>(20);
  const zoomRef = useRef<number>(1);
  const tiltRef = useRef<number>(0.5); // cos of viewing elevation
  const timeRef = useRef<number>(0);
  const lastFrameRef = useRef<number>(0);
  const selectedBodyRef = useRef<MappedSystemBody | null>(null);

  // Pan state — refs for the RAF loop, matching pattern of other anim state
  const panXRef = useRef<number>(0);
  const panYRef = useRef<number>(0);
  const isDraggingRef = useRef<boolean>(false);
  const dragStartRef = useRef<{ x: number; y: number; panX: number; panY: number } | null>(null);
  const hasDraggedRef = useRef<boolean>(false);

  const [system, setSystem] = useState<System>(systemState);
  const [systemMap, setSystemMap] = useState<SystemMap | null>(null);
  const [isLoading, setLoading] = useState<boolean>(true);
  const [selectedBody, setSelectedBody] = useState<MappedSystemBody | null>(null);

  // Preload body textures once on mount
  useEffect(() => {
    const toLoad: Record<string, string> = {
      star: "/images/textures/star.jpg",
      gasGiant: "/images/textures/gas-giant.jpg",
      rock: "/images/textures/rock.jpg",
    };
    for (const [key, src] of Object.entries(toLoad)) {
      const img = new Image();
      img.src = src;
      img.onload = () => {
        texturesRef.current[key] = img;
      };
    }
  }, []);

  // Strip the root layout's padding and scroll from <main> while the solar map
  // is mounted so the canvas fills the full content area without overflow-y.
  // Restored on unmount so other pages are unaffected.
  useEffect(() => {
    const main = document.querySelector("main") as HTMLElement | null;
    if (!main) return;
    const savedOverflow = main.style.overflow;
    const savedPadding = main.style.padding;
    main.style.overflow = "hidden";
    main.style.padding = "0";
    return () => {
      main.style.overflow = savedOverflow;
      main.style.padding = savedPadding;
    };
  }, []);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [speed, setSpeed] = useState<number>(20);
  const [zoom, setZoom] = useState<number>(1);
  const [tiltDeg, setTiltDeg] = useState<number>(60);
  const [isDragging, setIsDragging] = useState<boolean>(false);

  const { slug } = params;

  // Keep refs in sync
  useEffect(() => {
    isPausedRef.current = isPaused;
  }, [isPaused]);
  useEffect(() => {
    speedRef.current = speed;
  }, [speed]);
  useEffect(() => {
    zoomRef.current = zoom;
  }, [zoom]);
  useEffect(() => {
    tiltRef.current = Math.cos((tiltDeg * Math.PI) / 180);
  }, [tiltDeg]);
  useEffect(() => {
    selectedBodyRef.current = selectedBody;
  }, [selectedBody]);

  // Fetch system data
  useEffect(() => {
    if (!slug) return;
    getResource<System>(`systems/${slug}`, {
      params: { withInformation: 1, withBodies: 1, withStations: 1 },
    })
      .then((response) => {
        setSystem(response.data);
        setSystemMap(new SystemMap(response.data));
      })
      .finally(() => setLoading(false));
  }, [slug]);

  // Build orbital bodies list once system data is loaded.
  // Uses a recursive DFS over each star's _children tree so that moons and
  // sub-moons are included and orbit their correct parent body.
  useEffect(() => {
    if (!systemMap) return;

    // maxAu is computed from star-orbiting bodies only (top-level scale).
    const starOrbitingBodies = [
      ...systemMap.stars.filter((s) => s._type !== SystemBodyType.Null),
      ...systemMap.planets.filter((p) => p._orbits_star),
    ];
    const maxAu = starOrbitingBodies.reduce(
      (max, b) => Math.max(max, (b.distance_to_arrival ?? 0) / 499, b.semi_major_axis ?? 0),
      0.1,
    );

    const result: OrbitalBody[] = [];

    function addBody(body: MappedSystemBody, parentIndex: number, orbitsStar: boolean): void {
      if (body._type === SystemBodyType.Null) return;

      const isMainStar = body.is_main_star === 1 && body._type === SystemBodyType.Star;
      const isBlackHole = body.sub_type?.toLowerCase().includes("black hole") ?? false;

      let orbitPx: number;
      if (isMainStar) {
        orbitPx = 0;
      } else if (orbitsStar) {
        const dtaAu = (body.distance_to_arrival ?? 0) / 499;
        const au = dtaAu > 0 ? dtaAu : (body.semi_major_axis ?? 0);
        orbitPx = scaleOrbitRadius(au, maxAu);
      } else {
        orbitPx = scaleChildOrbitRadius(body.semi_major_axis ?? 0);
      }

      // Period resolution — several data quality issues to handle:
      //
      // 1. BARYCENTER DATA (e.g. Pluto/Charon in Sol):
      //    orbital_period=6.39d, semi_major_axis=1e-5 AU (offset from mutual barycenter),
      //    but distance_to_arrival=20518 ls (≈41 AU from star). The stored orbital data
      //    is relative to the local barycenter, not the star. Detect this when
      //    semi_major_axis << distance_to_arrival/499 and use Kepler from DTA instead.
      //
      // 2. RETROGRADE ORBITS (e.g. Triton): orbital_period is stored negative.
      //    Use Math.abs().
      //
      // 3. MISSING PERIOD: estimate via Kepler's third law from the best available
      //    distance value (semi_major_axis, then distance_to_arrival).
      const dtaAu = (body.distance_to_arrival ?? 0) / 499;
      const sma = body.semi_major_axis ?? 0;
      const rawPeriod = body.orbital_period ? Math.abs(body.orbital_period) : 0;

      let period: number;
      if (rawPeriod > 0) {
        const isBarycenterData = orbitsStar && dtaAu > 0 && sma > 0 && sma < dtaAu / 100;
        period = isBarycenterData
          ? Math.pow(dtaAu, 1.5) * 365.25  // Kepler from heliocentric distance
          : rawPeriod;
      } else {
        // No period stored — estimate via Kepler's third law.
        // For star-orbiting: prefer sma when plausibly heliocentric, else use dta.
        const keplerAu = orbitsStar
          ? (sma > 0 && sma >= dtaAu / 100 ? sma : dtaAu > 0 ? dtaAu : 1)
          : (sma > 0 ? sma : 0.001);
        period = orbitsStar
          ? Math.pow(keplerAu, 1.5) * 365.25
          : Math.pow(keplerAu, 1.5) * 11550; // moon: assumes ~Jupiter-mass parent
      }
      const idx = result.length;

      result.push({
        body,
        orbitPx,
        startAngle: Math.random() * Math.PI * 2,
        angularVelocity: (2 * Math.PI) / period,
        color: getBodyColor(body),
        displayRadius: getDisplayRadius(body, isMainStar),
        isMainStar,
        isBlackHole,
        textureKey: getTextureKey(body),
        texOffset: isMainStar ? 0 : Math.random() * 512,
        parentIndex,
        eccentricity: Math.min(0.99, Math.max(0, body.orbital_eccentricity ?? 0)),
        inclination: ((body.orbital_inclination ?? 0) * Math.PI) / 180,
        argOfPeriapsis: ((body.arg_of_periapsis ?? 0) * Math.PI) / 180,
      });

      for (const child of body._children ?? []) {
        addBody(child, idx, body._type === SystemBodyType.Star);
      }
    }

    for (const star of systemMap.stars.filter((s) => s._type !== SystemBodyType.Null)) {
      addBody(star, -1, true);
    }

    orbitalBodiesRef.current = result;
  }, [systemMap]);

  // Draw starfield on background canvas
  const drawBg = useCallback((canvas: HTMLCanvasElement) => {
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    drawStarfield(ctx, canvas.width, canvas.height);
  }, []);

  useEffect(() => {
    const canvas = bgCanvasRef.current;
    if (canvas) drawBg(canvas);
  }, [drawBg]);

  // Main animation loop
  const animate = useCallback((timestamp: number) => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const dt = lastFrameRef.current ? (timestamp - lastFrameRef.current) / 1000 : 0;
    lastFrameRef.current = timestamp;

    if (!isPausedRef.current && dt > 0 && dt < 0.5) {
      timeRef.current += dt * speedRef.current; // sim-days per real-second
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const cx = canvas.width / 2 + panXRef.current;
    const cy = canvas.height / 2 + panYRef.current;
    const yScale = tiltRef.current;
    const zoom = zoomRef.current;
    const bodies = orbitalBodiesRef.current;
    const selected = selectedBodyRef.current;

    // Pass 1 – compute screen positions in DFS order (parents always precede children)
    const xs = new Array<number>(bodies.length);
    const ys = new Array<number>(bodies.length);
    for (let i = 0; i < bodies.length; i++) {
      const ob = bodies[i];
      const M = ob.startAngle + ob.angularVelocity * timeRef.current;
      const [xOrb, yOrb] = keplerPosition(M, ob.eccentricity, ob.argOfPeriapsis);
      const bodyYScale = Math.cos(ob.inclination) * yScale;
      const dx = ob.orbitPx * xOrb * zoom;
      const dy = ob.orbitPx * yOrb * bodyYScale * zoom;
      if (ob.parentIndex === -1) {
        xs[i] = cx + dx;
        ys[i] = cy + dy;
      } else {
        xs[i] = xs[ob.parentIndex] + dx;
        ys[i] = ys[ob.parentIndex] + dy;
      }
    }

    // Pass 2 – draw orbit rings (moon rings centred on their parent's screen position)
    for (let i = 0; i < bodies.length; i++) {
      const ob = bodies[i];
      if (ob.orbitPx <= 0) continue;
      if (ob.parentIndex === -1) {
        drawOrbitRing(ctx, cx, cy, ob.orbitPx, yScale, zoom, false, ob.eccentricity, ob.argOfPeriapsis, ob.inclination);
      } else {
        drawOrbitRing(ctx, xs[ob.parentIndex], ys[ob.parentIndex], ob.orbitPx, yScale, zoom, true, ob.eccentricity, ob.argOfPeriapsis, ob.inclination);
      }
    }

    // Pass 3 – painter's sort by Y then draw bodies
    const order = bodies.map((_, i) => i).sort((a, b) => ys[a] - ys[b]);
    for (const i of order) {
      const ob = bodies[i];
      const x = xs[i];
      const y = ys[i];
      const isSelected = selected !== null && ob.body.id64 === selected.id64;
      const scaledRadius = ob.displayRadius * Math.max(0.6, zoom);
      const texture = ob.textureKey ? (texturesRef.current[ob.textureKey] ?? null) : null;
      const texScrollX = ob.isMainStar ? timeRef.current * 1.5 + ob.texOffset : ob.texOffset;
      drawBody(ctx, x, y, scaledRadius, ob.color, isSelected, ob.isMainStar, ob.isBlackHole, texture, texScrollX);

      if (isSelected || ob.isMainStar) {
        drawLabel(ctx, ob.body._label ?? ob.body.name, x, y, scaledRadius, ob.isMainStar);
      }
    }

    animFrameRef.current = requestAnimationFrame(animate);
  }, []);

  // Start/stop animation loop
  useEffect(() => {
    if (isLoading || !systemMap) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    lastFrameRef.current = 0;

    animFrameRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animFrameRef.current);
  }, [isLoading, systemMap, animate]);

  // Handle canvas resize
  useEffect(() => {
    const canvas = canvasRef.current;
    const bgCanvas = bgCanvasRef.current;
    if (!canvas || !bgCanvas) return;

    const observer = new ResizeObserver(() => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      drawBg(bgCanvas);
    });

    observer.observe(canvas);
    return () => observer.disconnect();
  }, [drawBg]);

  // Body selection (shared between click and pointer-up after no drag)
  const selectBodyAtClientPos = useCallback((clientX: number, clientY: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const clickX = (clientX - rect.left) * (canvas.width / rect.width);
    const clickY = (clientY - rect.top) * (canvas.height / rect.height);

    const cx = canvas.width / 2 + panXRef.current;
    const cy = canvas.height / 2 + panYRef.current;
    const yScale = tiltRef.current;
    const zoom = zoomRef.current;

    let closestBody: MappedSystemBody | null = null;
    let closestDist = Infinity;
    const bodies = orbitalBodiesRef.current;
    const xs = new Array<number>(bodies.length);
    const ys = new Array<number>(bodies.length);

    for (let i = 0; i < bodies.length; i++) {
      const ob = bodies[i];
      const M = ob.startAngle + ob.angularVelocity * timeRef.current;
      const [xOrb, yOrb] = keplerPosition(M, ob.eccentricity, ob.argOfPeriapsis);
      const bodyYScale = Math.cos(ob.inclination) * yScale;
      const dx = ob.orbitPx * xOrb * zoom;
      const dy = ob.orbitPx * yOrb * bodyYScale * zoom;
      xs[i] = ob.parentIndex === -1 ? cx + dx : xs[ob.parentIndex] + dx;
      ys[i] = ob.parentIndex === -1 ? cy + dy : ys[ob.parentIndex] + dy;

      const hitRadius = Math.max(14, ob.displayRadius * Math.max(0.6, zoom) + 4);
      const dist = Math.hypot(clickX - xs[i], clickY - ys[i]);
      if (dist < hitRadius && dist < closestDist) {
        closestDist = dist;
        closestBody = ob.body;
      }
    }

    setSelectedBody(closestBody);
  }, []);

  // Pan — pointer events distinguish drag from click
  const handlePointerDown = useCallback((e: React.PointerEvent<HTMLCanvasElement>) => {
    isDraggingRef.current = true;
    hasDraggedRef.current = false;
    dragStartRef.current = { x: e.clientX, y: e.clientY, panX: panXRef.current, panY: panYRef.current };
    setIsDragging(true);
    (e.target as HTMLCanvasElement).setPointerCapture(e.pointerId);
  }, []);

  const handlePointerMove = useCallback((e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDraggingRef.current || !dragStartRef.current) return;
    const dx = e.clientX - dragStartRef.current.x;
    const dy = e.clientY - dragStartRef.current.y;
    if (Math.hypot(dx, dy) > 4) hasDraggedRef.current = true;
    panXRef.current = dragStartRef.current.panX + dx;
    panYRef.current = dragStartRef.current.panY + dy;
  }, []);

  const handlePointerUp = useCallback((e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDraggingRef.current) return;
    isDraggingRef.current = false;
    setIsDragging(false);
    dragStartRef.current = null;
    if (!hasDraggedRef.current) selectBodyAtClientPos(e.clientX, e.clientY);
  }, [selectBodyAtClientPos]);

  const handleResetPan = () => {
    panXRef.current = 0;
    panYRef.current = 0;
  };

  const handleZoom = (delta: number) => {
    const next = Math.max(0.3, Math.min(3, zoomRef.current + delta));
    setZoom(next);
    zoomRef.current = next;
  };

  const handleSpeed = (s: number) => {
    setSpeed(s);
    speedRef.current = s;
  };

  const starCount = systemMap
    ? systemMap.stars.filter((s) => s._type !== SystemBodyType.Null).length
    : 0;
  const planetCount = systemMap ? systemMap.planets.length : 0;
  const stationCount = system.stations?.length ?? 0;
  const bodyCount = starCount + planetCount;

  const info = system.information;
  const hasInfo = !!(
    info?.allegiance ||
    info?.government ||
    info?.economy ||
    info?.security ||
    info?.population
  );

  return (
    <div className="relative h-full w-full overflow-hidden bg-black">
      {isLoading && <Loader visible={isLoading} />}

      {/* Starfield background */}
      <canvas ref={bgCanvasRef} className="absolute inset-0 h-full w-full" />

      {/* Solar system canvas */}
      <canvas
        ref={canvasRef}
        className={`absolute inset-0 h-full w-full ${isDragging ? "cursor-grabbing" : "cursor-grab"}`}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
      />

      {/* ── HUD corner brackets on canvas viewport ── */}
      <div className="pointer-events-none absolute inset-0 z-10">
        <span
          className="absolute h-8 w-8 border-l border-t border-orange-500/25"
          style={{ left: "12px", top: "82px" }}
        />
        <span
          className="absolute h-8 w-8 border-r border-t border-orange-500/25"
          style={{ right: "12px", top: "82px" }}
        />
        <span
          className="absolute h-8 w-8 border-b border-l border-orange-500/25"
          style={{ left: "12px", bottom: "42px" }}
        />
        <span
          className="absolute h-8 w-8 border-b border-r border-orange-500/25"
          style={{ right: "12px", bottom: "42px" }}
        />
        {/* Centre crosshair */}
        <div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
          style={{ marginTop: "20px" }}
        >
          <svg width="40" height="40" viewBox="0 0 40 40" style={{ opacity: 0.12 }}>
            <line x1="20" y1="0" x2="20" y2="14" stroke="rgb(251,146,60)" strokeWidth="0.8" />
            <line x1="20" y1="26" x2="20" y2="40" stroke="rgb(251,146,60)" strokeWidth="0.8" />
            <line x1="0" y1="20" x2="14" y2="20" stroke="rgb(251,146,60)" strokeWidth="0.8" />
            <line x1="26" y1="20" x2="40" y2="20" stroke="rgb(251,146,60)" strokeWidth="0.8" />
            <circle cx="20" cy="20" r="4" fill="none" stroke="rgb(251,146,60)" strokeWidth="0.6" />
          </svg>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════
          TOP HUD BAR
      ══════════════════════════════════════════════════════ */}
      <div className="absolute left-0 right-0 top-0 z-20 border-b border-orange-900/30 bg-black/88 backdrop-blur backdrop-filter">
        {/* Row 1 — navigation & system identity */}
        <div className="flex items-center justify-between border-b border-orange-900/15 px-5 py-2.5">
          <div className="flex items-center gap-3">
            {/* Back link */}
            <Link
              href={`/systems/${slug}`}
              className="text-glow__orange flex items-center gap-1.5 text-xs uppercase tracking-wider transition-opacity hover:opacity-70"
            >
              <i className="icarus-terminal-chevron" style={{ fontSize: "0.6rem" }} />
              System
            </Link>

            <span className="h-3 w-px bg-orange-900/50" />

            {/* System name */}
            <span className="text-glow__orange text-sm font-bold uppercase tracking-widest">
              {system.name || "Loading…"}
            </span>

            <span className="hidden text-xs uppercase tracking-widest text-neutral-700 sm:block">
              · Solar Map
            </span>

            {bodyCount > 0 && (
              <span className="hidden text-xs uppercase tracking-widest text-neutral-600 sm:block">
                · {bodyCount} {bodyCount === 1 ? "body" : "bodies"}
              </span>
            )}
          </div>

          {/* Right — system telemetry */}
          <div className="hidden items-center gap-5 lg:flex">
            {system.coords && (system.coords.x !== 0 || system.coords.y !== 0 || system.coords.z !== 0) && (
              <span className="text-xs uppercase tracking-widest">
                <span className="text-neutral-600">COORDS </span>
                <span
                  className="font-mono"
                  style={{ color: "rgb(20,245,255)", textShadow: "0 0 8px rgba(20,245,255,0.5)" }}
                >
                  {system.coords.x.toFixed(1)}, {system.coords.y.toFixed(1)},{" "}
                  {system.coords.z.toFixed(1)} ly
                </span>
              </span>
            )}

            {info?.security && (
              <span className="text-xs uppercase tracking-widest">
                <span className="text-neutral-600">SEC </span>
                <span className={getSecurityColor(info.security)}>{info.security}</span>
              </span>
            )}

            {info?.economy && (
              <span className="text-xs uppercase tracking-widest">
                <span className="text-neutral-600">ECO </span>
                <span className="text-neutral-400">{info.economy}</span>
              </span>
            )}

            <span className="flex items-center gap-1.5 text-xs uppercase tracking-widest text-neutral-600">
              <span className="fx-dot-orange h-1.5 w-1.5" />
              Telemetry Active
            </span>
          </div>
        </div>

        {/* Row 2 — simulation controls */}
        <div className="flex flex-wrap items-center justify-between gap-y-1.5 gap-x-4 px-5 py-2">
          {/* Left group — speed + pause */}
          <div className="flex items-center gap-3">
            {/* Speed */}
            <div className="flex items-center gap-1.5">
              <span className="text-xs uppercase tracking-widest text-neutral-600">Spd</span>
              {([1, 5, 20, 100, 500] as const).map((s) => (
                <button
                  key={s}
                  onClick={() => handleSpeed(s)}
                  className={`border px-2 py-0.5 text-xs uppercase tracking-wider transition-all ${
                    speed === s
                      ? "border-orange-500/55 bg-orange-900/20 text-orange-400"
                      : "border-orange-900/20 text-neutral-600 hover:border-orange-900/40 hover:text-neutral-400"
                  }`}
                >
                  {s}×
                </button>
              ))}
            </div>

            {/* Pause / Resume */}
            <button
              onClick={() => setIsPaused((p) => !p)}
              className={`flex items-center gap-1.5 border px-3 py-0.5 text-xs uppercase tracking-wider transition-all ${
                isPaused
                  ? "border-green-600/50 bg-green-900/15 text-green-400"
                  : "border-orange-900/30 bg-orange-900/10 text-orange-400 hover:border-orange-500/50 hover:bg-orange-900/20"
              }`}
            >
              {isPaused ? "▶ Resume" : "⏸ Pause"}
            </button>
          </div>

          {/* Right group — zoom + tilt */}
          <div className="flex items-center gap-4">
            {/* Zoom */}
            <div className="flex items-center gap-1.5">
              <span className="text-xs uppercase tracking-widest text-neutral-600">Zoom</span>
              <button
                onClick={() => handleZoom(-0.2)}
                className="border border-orange-900/20 px-2 py-0.5 text-xs text-neutral-500 hover:border-orange-900/40 hover:text-neutral-300"
              >
                −
              </button>
              <span className="w-9 text-center font-mono text-xs text-neutral-400">
                {zoom.toFixed(1)}×
              </span>
              <button
                onClick={() => handleZoom(0.2)}
                className="border border-orange-900/20 px-2 py-0.5 text-xs text-neutral-500 hover:border-orange-900/40 hover:text-neutral-300"
              >
                +
              </button>
            </div>

            {/* Reset pan */}
            <button
              onClick={handleResetPan}
              className="border border-orange-900/20 px-2 py-0.5 text-xs uppercase tracking-wider text-neutral-600 hover:border-orange-900/40 hover:text-neutral-400"
              title="Re-centre map"
            >
              ⌖ Centre
            </button>

            {/* Tilt */}
            <div className="hidden items-center gap-2 sm:flex">
              <span className="text-xs uppercase tracking-widest text-neutral-600">Tilt</span>
              <input
                type="range"
                min={20}
                max={90}
                value={tiltDeg}
                onChange={(e) => setTiltDeg(Number(e.target.value))}
                className="h-1 w-20 cursor-pointer accent-orange-500"
              />
              <span className="w-8 text-right font-mono text-xs text-neutral-500">{tiltDeg}°</span>
            </div>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════
          SYSTEM OVERVIEW PANEL — bottom-left
      ══════════════════════════════════════════════════════ */}
      {!isLoading && (hasInfo || systemMap) && (
        <div
          className="absolute left-4 z-20 w-52 border border-orange-900/25 bg-black/82 backdrop-blur backdrop-filter"
          style={{ bottom: "42px" }}
        >
          {/* Corner brackets */}
          <span className="pointer-events-none absolute -left-px -top-px h-3 w-3 border-l border-t border-orange-500/60" />
          <span className="pointer-events-none absolute -right-px -top-px h-3 w-3 border-r border-t border-orange-500/60" />
          <span className="pointer-events-none absolute -bottom-px -left-px h-3 w-3 border-b border-l border-orange-500/60" />
          <span className="pointer-events-none absolute -bottom-px -right-px h-3 w-3 border-b border-r border-orange-500/60" />

          <div className="p-3">
            {/* Panel header */}
            <div className="mb-2.5 flex items-center gap-2 border-b border-orange-900/20 pb-2.5">
              <i className="icarus-terminal-system text-glow__orange" style={{ fontSize: "0.75rem" }} />
              <span className="text-glow__orange text-xs font-bold uppercase tracking-wider">
                System Data
              </span>
            </div>

            {/* System information */}
            {hasInfo && (
              <div className="mb-2.5 space-y-1.5 text-xs">
                {info?.allegiance && (
                  <SysRow label="Alliance" value={info.allegiance} />
                )}
                {info?.government && (
                  <SysRow label="Gov" value={info.government} />
                )}
                {info?.economy && (
                  <SysRow label="Economy" value={info.economy} />
                )}
                {info?.security && (
                  <SysRow
                    label="Security"
                    value={info.security}
                    valueClass={getSecurityColor(info.security)}
                  />
                )}
                {!!info?.population && (
                  <SysRow label="Pop" value={formatPopulation(info.population)} />
                )}
                {info?.controlling_faction?.name && (
                  <SysRow label="Faction" value={info.controlling_faction.name} />
                )}
                {info?.controlling_faction?.state && (
                  <SysRow label="State" value={info.controlling_faction.state} />
                )}
              </div>
            )}

            {/* Body counts */}
            {systemMap && (
              <div
                className={`space-y-1.5 text-xs ${hasInfo ? "border-t border-orange-900/15 pt-2.5" : ""}`}
              >
                {starCount > 0 && <SysRow label="Stars" value={String(starCount)} />}
                {planetCount > 0 && <SysRow label="Planets" value={String(planetCount)} />}
                {stationCount > 0 && <SysRow label="Stations" value={String(stationCount)} />}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════
          BODY DETAIL PANEL — right edge
      ══════════════════════════════════════════════════════ */}
      {selectedBody && (
        <div
          className="fx-wipe-in absolute right-0 z-20 w-72 overflow-y-auto border-l border-orange-900/25 bg-black/88 backdrop-blur backdrop-filter"
          style={{ top: "82px", bottom: "42px" }}
        >
          {/* Corner brackets — uses top-0/bottom-0 (not -px) because this panel has overflow-y-auto */}
          <span className="pointer-events-none absolute -left-px top-0 h-4 w-4 border-l-2 border-t-2 border-orange-500" />
          <span className="pointer-events-none absolute -right-px top-0 h-4 w-4 border-r-2 border-t-2 border-orange-500" />
          <span className="pointer-events-none absolute -left-px bottom-0 h-4 w-4 border-b-2 border-l-2 border-orange-500" />
          <span className="pointer-events-none absolute -right-px bottom-0 h-4 w-4 border-b-2 border-r-2 border-orange-500" />

          {/* Body type colour band */}
          <div
            className="h-0.5 w-full"
            style={{ backgroundColor: hexToRgba(getBodyColor(selectedBody), 0.7) }}
          />

          <div className="p-5">
            {/* Header row */}
            <div className="mb-1 flex items-start justify-between gap-2">
              <div className="flex-1">
                {/* Scan complete indicator */}
                <div className="mb-2 flex items-center gap-1.5">
                  <span className="fx-dot-green h-1.5 w-1.5" />
                  <span className="text-xs uppercase tracking-widest text-green-400/80">
                    Scan Complete
                  </span>
                </div>

                {/* Type label */}
                <div className="text-glow__orange mb-1 text-xs uppercase tracking-widest">
                  {selectedBody._type}
                  {selectedBody.sub_type ? ` · ${selectedBody.sub_type}` : ""}
                </div>

                {/* Body name */}
                <div className="text-base font-bold uppercase tracking-wide text-neutral-200">
                  {selectedBody._label ?? selectedBody.name}
                </div>
              </div>

              {/* Close + colour swatch */}
              <div className="flex flex-col items-end gap-3">
                <button
                  onClick={() => setSelectedBody(null)}
                  className="text-base leading-none text-neutral-600 transition-colors hover:text-neutral-200"
                >
                  ×
                </button>
                <div
                  className="h-5 w-5 rounded-full"
                  style={{
                    backgroundColor: getBodyColor(selectedBody),
                    boxShadow: `0 0 8px ${hexToRgba(getBodyColor(selectedBody), 0.8)}, 0 0 20px ${hexToRgba(getBodyColor(selectedBody), 0.35)}`,
                  }}
                />
              </div>
            </div>

            {/* Divider */}
            <div className="mb-4 mt-3 h-px bg-orange-900/20" />

            {/* Data rows */}
            <div className="space-y-0 text-xs">
              {!!selectedBody.distance_to_arrival && (
                <BodyRow
                  label="Distance"
                  value={`${selectedBody.distance_to_arrival.toLocaleString()} ls`}
                />
              )}
              {!!selectedBody.radius && (
                <BodyRow label="Radius" value={`${selectedBody.radius.toLocaleString()} km`} />
              )}
              {!!selectedBody.surface_temp && (
                <BodyRow
                  label="Temp"
                  value={`${selectedBody.surface_temp.toLocaleString()} K`}
                />
              )}
              {!!selectedBody.earth_masses && (
                <BodyRow label="Earth Masses" value={String(selectedBody.earth_masses)} />
              )}
              {!!selectedBody.solar_masses && (
                <BodyRow label="Solar Masses" value={String(selectedBody.solar_masses)} />
              )}
              {!!selectedBody.gravity && (
                <BodyRow label="Gravity" value={`${selectedBody.gravity.toFixed(2)} g`} />
              )}
              {!!selectedBody.orbital_period && (
                <BodyRow
                  label="Orbital Period"
                  value={`${selectedBody.orbital_period.toFixed(1)} d`}
                />
              )}
              {!!selectedBody.semi_major_axis && (
                <BodyRow
                  label="Semi-Major Axis"
                  value={`${selectedBody.semi_major_axis.toFixed(3)} AU`}
                />
              )}
              {!!selectedBody.orbital_eccentricity && (
                <BodyRow
                  label="Eccentricity"
                  value={selectedBody.orbital_eccentricity.toFixed(4)}
                />
              )}
              {selectedBody.atmosphere_type &&
                selectedBody.atmosphere_type !== "No atmosphere" && (
                  <BodyRow label="Atmosphere" value={selectedBody.atmosphere_type} />
                )}
              {selectedBody.volcanism_type && selectedBody.volcanism_type !== "No volcanism" && (
                <BodyRow label="Volcanism" value={selectedBody.volcanism_type} />
              )}
              {selectedBody.terraforming_state &&
                selectedBody.terraforming_state !== "Not terraformable" && (
                  <BodyRow label="Terraforming" value={selectedBody.terraforming_state} />
                )}
              {!!selectedBody.rings?.length && (
                <BodyRow label="Rings" value={String(selectedBody.rings.length)} />
              )}
            </div>

            {/* Attribute badges */}
            {(selectedBody.is_landable === 1 || selectedBody.is_scoopable === 1) && (
              <div className="mt-4 flex flex-wrap gap-2">
                {selectedBody.is_landable === 1 && (
                  <span className="border border-orange-500/40 bg-orange-900/15 px-2 py-0.5 text-xs uppercase tracking-widest text-orange-400">
                    ◆ Landable
                  </span>
                )}
                {selectedBody.is_scoopable === 1 && (
                  <span
                    className="border px-2 py-0.5 text-xs uppercase tracking-widest"
                    style={{
                      borderColor: "rgba(20,245,255,0.4)",
                      backgroundColor: "rgba(20,245,255,0.06)",
                      color: "rgb(20,245,255)",
                    }}
                  >
                    ◆ Fuel Scoopable
                  </span>
                )}
              </div>
            )}

            {/* Full details link */}
            {selectedBody.slug && (
              <div className="mt-5 border-t border-orange-900/20 pt-4">
                <Link
                  href={`/bodies/${selectedBody.slug}`}
                  className="text-glow__orange flex items-center gap-2 text-xs uppercase tracking-wider hover:opacity-70"
                >
                  Full Analysis →
                </Link>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════
          BOTTOM STATUS BAR
      ══════════════════════════════════════════════════════ */}
      <div className="absolute bottom-0 left-0 right-0 z-20 flex items-center justify-between border-t border-orange-900/20 bg-black/80 px-5 py-2 backdrop-blur backdrop-filter">
        {/* Left — body counts */}
        <div className="flex items-center gap-4 text-xs uppercase tracking-widest text-neutral-700">
          {starCount > 0 && <span>Stars: {starCount}</span>}
          {planetCount > 0 && <span>Planets: {planetCount}</span>}
          {stationCount > 0 && <span>Stations: {stationCount}</span>}
        </div>

        {/* Centre — click hint */}
        {!selectedBody && !isLoading && systemMap && systemMap.items.length > 0 && (
          <span className="absolute left-1/2 -translate-x-1/2 text-xs uppercase tracking-widest text-neutral-700">
            Click any body to inspect
          </span>
        )}

        {/* Right — active simulation parameters */}
        <div className="flex items-center gap-4 text-xs uppercase tracking-widest text-neutral-700">
          <span>Spd: {speed}×</span>
          <span>Zoom: {zoom.toFixed(1)}×</span>
          <span>Tilt: {tiltDeg}°</span>
          <span className="flex items-center gap-1.5">
            <span className={isPaused ? "fx-dot-orange h-1.5 w-1.5" : "fx-dot-green h-1.5 w-1.5"} />
            {isPaused ? "Paused" : "Live"}
          </span>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════
          EMPTY & NO-DATA STATES
      ══════════════════════════════════════════════════════ */}
      {!isLoading && systemMap && systemMap.items.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative border border-orange-900/30 bg-black/80 p-8 backdrop-blur backdrop-filter">
            <PanelCorners />
            <div className="text-glow__orange mb-2 text-center text-sm font-bold uppercase tracking-widest">
              No Telemetry Available
            </div>
            <div className="text-center text-xs uppercase tracking-widest text-neutral-600">
              {system.name} — No charted bodies on record
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ─── Sub-components ───────────────────────────────────────────────────────────

/** Compact label/value row for the system overview panel */
function SysRow({
  label,
  value,
  valueClass,
}: {
  label: string;
  value: string;
  valueClass?: string;
}) {
  return (
    <div className="flex items-baseline justify-between gap-2">
      <span className="shrink-0 uppercase text-neutral-600">{label}</span>
      <span className={`truncate text-right ${valueClass ?? "text-neutral-400"}`}>{value}</span>
    </div>
  );
}

/** Data row for the selected body detail panel */
function BodyRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-2 border-b border-orange-900/10 py-1.5">
      <span className="shrink-0 uppercase tracking-wider text-neutral-600">{label}</span>
      <span
        className="truncate text-right font-mono"
        style={{ color: "rgb(20,245,255)", textShadow: "0 0 6px rgba(20,245,255,0.4)" }}
      >
        {value}
      </span>
    </div>
  );
}

export default SystemSolarMap;
