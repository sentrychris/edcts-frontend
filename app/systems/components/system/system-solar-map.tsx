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
}

function drawOrbitRing(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  orbitPx: number,
  yScale: number,
  zoom: number,
): void {
  ctx.beginPath();
  ctx.ellipse(cx, cy, orbitPx * zoom, orbitPx * yScale * zoom, 0, 0, Math.PI * 2);
  ctx.strokeStyle = "rgba(250,150,0,0.13)";
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
    // Outer glow
    const glowSize = radius * (isMainStar ? 4.5 : 3.2);
    const glowGrad = ctx.createRadialGradient(x, y, 0, x, y, glowSize);
    glowGrad.addColorStop(0, hexToRgba(color, isMainStar ? 0.45 : 0.3));
    glowGrad.addColorStop(0.5, hexToRgba(color, isMainStar ? 0.15 : 0.08));
    glowGrad.addColorStop(1, "transparent");
    ctx.fillStyle = glowGrad;
    ctx.beginPath();
    ctx.arc(x, y, glowSize, 0, Math.PI * 2);
    ctx.fill();

    // Sphere with radial gradient (highlight top-left)
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
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();
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

  // Animation state via refs (avoids stale closure in RAF)
  const isPausedRef = useRef<boolean>(false);
  const speedRef = useRef<number>(1);
  const zoomRef = useRef<number>(1);
  const tiltRef = useRef<number>(0.5); // cos of viewing elevation
  const timeRef = useRef<number>(0);
  const lastFrameRef = useRef<number>(0);
  const selectedBodyRef = useRef<MappedSystemBody | null>(null);

  const [system, setSystem] = useState<System>(systemState);
  const [systemMap, setSystemMap] = useState<SystemMap | null>(null);
  const [isLoading, setLoading] = useState<boolean>(true);
  const [selectedBody, setSelectedBody] = useState<MappedSystemBody | null>(null);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [speed, setSpeed] = useState<number>(1);
  const [zoom, setZoom] = useState<number>(1);
  const [tiltDeg, setTiltDeg] = useState<number>(60);

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

  // Build orbital bodies list once system data is loaded
  useEffect(() => {
    if (!systemMap) return;

    const allBodies: MappedSystemBody[] = [
      ...systemMap.stars.filter((s) => s._type !== SystemBodyType.Null),
      ...systemMap.planets.filter((p) => p._orbits_star),
    ];

    const maxAu = allBodies.reduce(
      (max, b) => Math.max(max, (b.distance_to_arrival ?? 0) / 499, b.semi_major_axis ?? 0),
      0.1,
    );

    orbitalBodiesRef.current = allBodies.map((body) => {
      const isMainStar = body.is_main_star === 1 && body._type === SystemBodyType.Star;
      const isBlackHole = body.sub_type?.toLowerCase().includes("black hole") ?? false;

      // Use distance_to_arrival (ls → AU) as it is always measured from the primary star.
      // semi_major_axis is relative to the body's direct parent (e.g. a barycenter),
      // which makes it wrong for bodies like Pluto that orbit a null barycenter.
      const dtaAu = (body.distance_to_arrival ?? 0) / 499;
      const au = dtaAu > 0 ? dtaAu : (body.semi_major_axis ?? 0);

      const orbitPx = isMainStar ? 0 : scaleOrbitRadius(au, maxAu);
      const period = body.orbital_period && body.orbital_period > 0 ? body.orbital_period : 365;
      // radians per sim-day
      const angularVelocity = (2 * Math.PI) / period;

      return {
        body,
        orbitPx,
        startAngle: Math.random() * Math.PI * 2,
        angularVelocity,
        color: getBodyColor(body),
        displayRadius: getDisplayRadius(body, isMainStar),
        isMainStar,
        isBlackHole,
      };
    });
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
      // 10 sim-days per real second at speed = 1
      timeRef.current += dt * speedRef.current * 10;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const cx = canvas.width / 2;
    const cy = canvas.height / 2;
    const yScale = tiltRef.current;
    const zoom = zoomRef.current;
    const bodies = orbitalBodiesRef.current;
    const selected = selectedBodyRef.current;

    // Compute screen positions
    type PositionedBody = { ob: OrbitalBody; x: number; y: number };
    const positioned: PositionedBody[] = bodies.map((ob) => {
      const angle = ob.startAngle + ob.angularVelocity * timeRef.current;
      const x = cx + ob.orbitPx * Math.cos(angle) * zoom;
      const y = cy + ob.orbitPx * Math.sin(angle) * yScale * zoom;
      return { ob, x, y };
    });

    // Draw orbit rings (behind everything)
    for (const { ob } of positioned) {
      if (ob.orbitPx > 0) {
        drawOrbitRing(ctx, cx, cy, ob.orbitPx, yScale, zoom);
      }
    }

    // Painter's algorithm: sort by Y so closer bodies render on top
    positioned.sort((a, b) => a.y - b.y);

    for (const { ob, x, y } of positioned) {
      const isSelected = selected !== null && ob.body.id64 === selected.id64;
      const scaledRadius = ob.displayRadius * Math.max(0.6, zoom);
      drawBody(ctx, x, y, scaledRadius, ob.color, isSelected, ob.isMainStar, ob.isBlackHole);

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

  // Click to select body
  const handleCanvasClick = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const clickX = (e.clientX - rect.left) * (canvas.width / rect.width);
    const clickY = (e.clientY - rect.top) * (canvas.height / rect.height);

    const cx = canvas.width / 2;
    const cy = canvas.height / 2;
    const yScale = tiltRef.current;
    const zoom = zoomRef.current;

    let closestBody: MappedSystemBody | null = null;
    let closestDist = Infinity;

    for (const ob of orbitalBodiesRef.current) {
      const angle = ob.startAngle + ob.angularVelocity * timeRef.current;
      const x = cx + ob.orbitPx * Math.cos(angle) * zoom;
      const y = cy + ob.orbitPx * Math.sin(angle) * yScale * zoom;
      const hitRadius = Math.max(14, ob.displayRadius * Math.max(0.6, zoom) + 4);
      const dist = Math.hypot(clickX - x, clickY - y);

      if (dist < hitRadius && dist < closestDist) {
        closestDist = dist;
        closestBody = ob.body;
      }
    }

    setSelectedBody(closestBody);
  }, []);

  const handleZoom = (delta: number) => {
    const next = Math.max(0.3, Math.min(3, zoomRef.current + delta));
    setZoom(next);
    zoomRef.current = next;
  };

  const handleSpeed = (s: number) => {
    setSpeed(s);
    speedRef.current = s;
  };

  const bodyCount = systemMap
    ? systemMap.stars.filter((s) => s._type !== SystemBodyType.Null).length +
      systemMap.planets.length
    : 0;

  return (
    <div className="relative h-screen w-full overflow-hidden bg-black">
      {isLoading && <Loader visible={isLoading} />}

      {/* Starfield background */}
      <canvas ref={bgCanvasRef} className="absolute inset-0 h-full w-full" />

      {/* Solar system canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 h-full w-full cursor-crosshair"
        onClick={handleCanvasClick}
      />

      {/* Top bar */}
      <div className="absolute left-0 right-0 top-0 z-10 flex items-center justify-between border-b border-neutral-800 bg-black/75 px-5 py-3 backdrop-blur">
        <div className="flex items-center gap-4">
          <Link
            href={`/systems/${slug}`}
            className="text-glow__orange flex items-center gap-2 text-xs uppercase tracking-wider hover:opacity-70"
          >
            <i className="icarus-terminal-chevron-left text-xs" />
            System
          </Link>
          <span className="text-neutral-700">|</span>
          <span className="text-glow text-sm font-bold uppercase tracking-widest">
            {system.name || "Loading…"}
          </span>
          <span className="hidden text-xs uppercase text-neutral-600 sm:block">· Solar Map</span>
          {bodyCount > 0 && (
            <span className="hidden text-xs text-neutral-600 sm:block">
              {bodyCount} {bodyCount === 1 ? "body" : "bodies"}
            </span>
          )}
        </div>

        {/* Controls */}
        <div className="flex items-center gap-3 text-xs">
          {/* Speed */}
          <div className="hidden items-center gap-1 sm:flex">
            <span className="text-glow__orange mr-1 uppercase">Speed</span>
            {([0.1, 0.5, 1, 5, 20] as const).map((s) => (
              <button
                key={s}
                onClick={() => handleSpeed(s)}
                className={`border px-2 py-0.5 uppercase transition-colors ${
                  speed === s
                    ? "border-orange-500 text-orange-400"
                    : "border-neutral-800 text-neutral-500 hover:border-neutral-600 hover:text-neutral-300"
                }`}
              >
                {s}×
              </button>
            ))}
          </div>

          {/* Pause */}
          <button
            onClick={() => setIsPaused((p) => !p)}
            className="border border-orange-900 px-3 py-0.5 uppercase text-orange-400 transition-colors hover:border-orange-500"
          >
            {isPaused ? "▶ Play" : "⏸ Pause"}
          </button>

          {/* Zoom */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => handleZoom(-0.2)}
              className="border border-neutral-800 px-2 py-0.5 text-neutral-400 hover:border-neutral-600 hover:text-white"
            >
              −
            </button>
            <span className="w-10 text-center text-neutral-400">{zoom.toFixed(1)}×</span>
            <button
              onClick={() => handleZoom(0.2)}
              className="border border-neutral-800 px-2 py-0.5 text-neutral-400 hover:border-neutral-600 hover:text-white"
            >
              +
            </button>
          </div>

          {/* Tilt */}
          <div className="hidden items-center gap-2 sm:flex">
            <span className="text-glow__orange uppercase">Tilt</span>
            <input
              type="range"
              min={20}
              max={90}
              value={tiltDeg}
              onChange={(e) => setTiltDeg(Number(e.target.value))}
              className="h-1 w-20 cursor-pointer accent-orange-500"
            />
          </div>
        </div>
      </div>

      {/* Selected body info panel */}
      {selectedBody && (
        <div className="absolute bottom-0 right-0 top-[3.25rem] z-10 w-72 overflow-y-auto border-l border-neutral-800 bg-black/85 p-5 backdrop-blur">
          <button
            onClick={() => setSelectedBody(null)}
            className="absolute right-4 top-4 text-lg text-neutral-600 hover:text-white"
          >
            ×
          </button>

          <div className="mb-5">
            <div className="text-glow__orange mb-1 text-xs uppercase tracking-wider">
              {selectedBody._type} · {selectedBody.sub_type}
            </div>
            <div className="text-glow text-base font-bold uppercase tracking-wide">
              {selectedBody._label ?? selectedBody.name}
            </div>
          </div>

          <div className="space-y-2.5 text-xs">
            {!!selectedBody.distance_to_arrival && (
              <Row label="Distance" value={`${selectedBody.distance_to_arrival.toLocaleString()} ls`} />
            )}
            {!!selectedBody.radius && (
              <Row label="Radius" value={`${selectedBody.radius.toLocaleString()} km`} />
            )}
            {!!selectedBody.surface_temp && (
              <Row label="Surface Temp" value={`${selectedBody.surface_temp.toLocaleString()} K`} />
            )}
            {!!selectedBody.earth_masses && (
              <Row label="Earth Masses" value={String(selectedBody.earth_masses)} />
            )}
            {!!selectedBody.solar_masses && (
              <Row label="Solar Masses" value={String(selectedBody.solar_masses)} />
            )}
            {!!selectedBody.gravity && (
              <Row label="Gravity" value={`${selectedBody.gravity.toFixed(2)}g`} />
            )}
            {!!selectedBody.orbital_period && (
              <Row label="Orbital Period" value={`${selectedBody.orbital_period.toFixed(1)} days`} />
            )}
            {!!selectedBody.semi_major_axis && (
              <Row label="Semi-Major Axis" value={`${selectedBody.semi_major_axis.toFixed(3)} AU`} />
            )}
            {!!selectedBody.orbital_eccentricity && (
              <Row
                label="Eccentricity"
                value={selectedBody.orbital_eccentricity.toFixed(4)}
              />
            )}
            {selectedBody.atmosphere_type && selectedBody.atmosphere_type !== "No atmosphere" && (
              <Row label="Atmosphere" value={selectedBody.atmosphere_type} />
            )}
            {selectedBody.volcanism_type && selectedBody.volcanism_type !== "No volcanism" && (
              <Row label="Volcanism" value={selectedBody.volcanism_type} />
            )}
            {selectedBody.terraforming_state &&
              selectedBody.terraforming_state !== "Not terraformable" && (
                <Row label="Terraforming" value={selectedBody.terraforming_state} />
              )}
            {!!selectedBody.rings?.length && (
              <Row label="Rings" value={String(selectedBody.rings.length)} />
            )}
          </div>

          {selectedBody.is_landable === 1 && (
            <div className="text-glow__orange mt-4 text-xs uppercase tracking-wider">
              ◆ Landable
            </div>
          )}
          {selectedBody.is_scoopable === 1 && (
            <div className="text-glow__blue mt-1 text-xs uppercase tracking-wider">
              ◆ Fuel Scoopable
            </div>
          )}

          {selectedBody.slug && (
            <div className="mt-5 border-t border-neutral-800 pt-4">
              <Link
                href={`/bodies/${selectedBody.slug}`}
                className="text-glow__orange text-xs uppercase tracking-wider hover:opacity-70"
              >
                View Full Details →
              </Link>
            </div>
          )}
        </div>
      )}

      {/* Click hint */}
      {!selectedBody && !isLoading && systemMap && systemMap.items.length > 0 && (
        <div className="pointer-events-none absolute bottom-5 left-1/2 -translate-x-1/2 text-xs uppercase tracking-widest text-neutral-700">
          Click any body to inspect
        </div>
      )}

      {/* No data state */}
      {!isLoading && systemMap && systemMap.items.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-glow__orange text-center text-lg font-bold uppercase tracking-widest">
            No telemetry data available for {system.name}
          </div>
        </div>
      )}
    </div>
  );
};

// Small helper for label/value rows in the info panel
function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-2">
      <span className="shrink-0 uppercase text-neutral-500">{label}</span>
      <span className="text-glow__blue truncate text-right">{value}</span>
    </div>
  );
}

export default SystemSolarMap;
