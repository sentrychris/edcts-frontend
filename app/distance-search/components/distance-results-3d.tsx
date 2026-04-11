"use client";

import { useCallback, useRef, useState } from "react";
import type { SystemDistance } from "@/core/interfaces/SystemDistance";
import Panel from "@/components/panel";
import Heading from "@/components/heading";

interface Props {
  results: SystemDistance[];
  originName: string;
  searchLy: number;
}

interface Point2D {
  x: number;
  y: number;
  depth: number;
}

const SVG_W = 800;
const SVG_H = 480;

function project(cx: number, cy: number, cz: number, rotX: number, rotY: number, scale: number): Point2D {
  const cosY = Math.cos(rotY);
  const sinY = Math.sin(rotY);
  const x1 = cx * cosY - cz * sinY;
  const z1 = cx * sinY + cz * cosY;

  const cosX = Math.cos(rotX);
  const sinX = Math.sin(rotX);
  const y2 = cy * cosX - z1 * sinX;
  const z2 = cy * sinX + z1 * cosX;

  const fov = 600;
  const depth = fov + z2;
  const px = (x1 * fov * scale) / depth + SVG_W / 2;
  const py = -(y2 * fov * scale) / depth + SVG_H / 2;

  return { x: px, y: py, depth: z2 };
}

export default function DistanceResults3D({ results, originName, searchLy }: Props) {
  const [rotX, setRotX] = useState(-0.35);
  const [rotY, setRotY] = useState(0.4);
  const [zoom, setZoom] = useState(1);

  const isDragging = useRef(false);
  const lastMouse = useRef({ x: 0, y: 0 });
  const lastTouch = useRef({ x: 0, y: 0 });

  // ── Drag / touch handlers — defined before any early return ──

  const onMouseDown = useCallback((e: React.MouseEvent) => {
    isDragging.current = true;
    lastMouse.current = { x: e.clientX, y: e.clientY };
  }, []);

  const onMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging.current) return;
    const dx = e.clientX - lastMouse.current.x;
    const dy = e.clientY - lastMouse.current.y;
    lastMouse.current = { x: e.clientX, y: e.clientY };
    setRotY((r) => r + dx * 0.008);
    setRotX((r) => r + dy * 0.008);
  }, []);

  const onMouseUp = useCallback(() => {
    isDragging.current = false;
  }, []);

  const onWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    setZoom((z) => Math.max(0.4, Math.min(6, z * (e.deltaY > 0 ? 0.92 : 1.09))));
  }, []);

  const onTouchStart = useCallback((e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      lastTouch.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    }
  }, []);

  const onTouchMove = useCallback((e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      const dx = e.touches[0].clientX - lastTouch.current.x;
      const dy = e.touches[0].clientY - lastTouch.current.y;
      lastTouch.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      setRotY((r) => r + dx * 0.008);
      setRotX((r) => r + dy * 0.008);
    }
  }, []);

  if (results.length === 0) return null;

  // Centre on the origin (first result, distance ≈ 0)
  const origin = results[0];
  const ox = origin.coords.x;
  const oy = origin.coords.y;
  const oz = origin.coords.z;

  const centred = results.map((r) => ({
    x: r.coords.x - ox,
    y: r.coords.y - oy,
    z: r.coords.z - oz,
  }));

  const maxExtent = Math.max(
    ...centred.flatMap((c) => [Math.abs(c.x), Math.abs(c.y), Math.abs(c.z)]),
    1,
  );
  const baseScale = (Math.min(SVG_W, SVG_H) * 0.36) / maxExtent;
  const scale = baseScale * zoom;

  const projected = centred.map((c) => project(c.x, c.y, c.z, rotX, rotY, scale));

  // Floor plane at bottom of point cloud
  const floorY = Math.max(...centred.map((c) => c.y)) + maxExtent * 0.2;
  const shadows = centred.map((c) => project(c.x, floorY, c.z, rotX, rotY, scale));

  // Max distance for normalising colour opacity
  const maxDist = results[results.length - 1]?.distance ?? 1;

  const resetView = () => {
    setRotX(-0.35);
    setRotY(0.4);
    setZoom(1);
  };

  // Sort back-to-front for painter's algorithm
  const sortedIndices = projected
    .map((p, i) => ({ depth: p.depth, i }))
    .sort((a, b) => b.depth - a.depth)
    .map((d) => d.i);

  return (
    <Panel className="overflow-hidden">
      {/* ── Header ── */}
      <div className="flex items-center justify-between border-b border-orange-900/20 px-4 py-3 md:px-5 md:py-4">
        <Heading
          icon="icarus-terminal-system-orbits"
          title="Proximity Scan"
          subtitle={`${results.length - 1} system${results.length !== 2 ? "s" : ""} within ${searchLy} ly of ${originName}`}
        />
        <div className="flex items-center gap-3">
          <span className="hidden text-xs uppercase tracking-widest text-neutral-700 md:block">
            Drag · Rotate &nbsp;|&nbsp; Scroll · Zoom
          </span>
          <button
            onClick={resetView}
            title="Reset view"
            className="border border-orange-900/20 p-1.5 text-neutral-700 transition-colors hover:border-orange-500/40 hover:text-orange-400"
          >
            <i className="icarus-terminal-settings text-xs"></i>
          </button>
        </div>
      </div>

      {/* ── Canvas ── */}
      <div
        className="cursor-grab select-none active:cursor-grabbing"
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseUp}
        onWheel={onWheel}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onMouseUp}
      >
        <svg
          viewBox={`0 0 ${SVG_W} ${SVG_H}`}
          className="h-auto w-full"
          style={{ minHeight: 280 }}
          aria-label="3D proximity scan visualization"
        >
          <defs>
            <filter id="ds-glow-origin" x="-80%" y="-80%" width="260%" height="260%">
              <feGaussianBlur stdDeviation="5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <filter id="ds-glow-node" x="-60%" y="-60%" width="220%" height="220%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <filter id="ds-glow-label" x="-10%" y="-10%" width="120%" height="120%">
              <feGaussianBlur stdDeviation="1.5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* ── Subtle crosshair ── */}
          <line x1={SVG_W / 2 - 20} y1={SVG_H / 2} x2={SVG_W / 2 + 20} y2={SVG_H / 2} stroke="#f9731608" strokeWidth="1" />
          <line x1={SVG_W / 2} y1={SVG_H / 2 - 20} x2={SVG_W / 2} y2={SVG_H / 2 + 20} stroke="#f9731608" strokeWidth="1" />

          {/* ── Floor shadow drop-lines ── */}
          {results.map((_, i) => (
            <line
              key={`shadow-line-${i}`}
              x1={projected[i].x}
              y1={projected[i].y}
              x2={shadows[i].x}
              y2={shadows[i].y}
              stroke={i === 0 ? "#4ade8018" : "#f9731612"}
              strokeWidth="1"
              strokeDasharray="2 4"
            />
          ))}

          {/* ── Floor shadow dots ── */}
          {results.map((_, i) => (
            <circle
              key={`shadow-dot-${i}`}
              cx={shadows[i].x}
              cy={shadows[i].y}
              r={2}
              fill={i === 0 ? "#4ade8025" : "#f9731620"}
            />
          ))}

          {/* ── Radial scan lines from origin to each result ── */}
          {sortedIndices
            .filter((i) => i !== 0)
            .map((i) => (
              <line
                key={`scan-line-${i}`}
                x1={projected[0].x}
                y1={projected[0].y}
                x2={projected[i].x}
                y2={projected[i].y}
                stroke="#f97316"
                strokeWidth="0.6"
                strokeOpacity={0.08 + (1 - results[i].distance / maxDist) * 0.12}
              />
            ))}

          {/* ── Nodes (back-to-front) ── */}
          {sortedIndices.map((i) => {
            const r = results[i];
            const p = projected[i];
            const isOrigin = i === 0;
            const distRatio = r.distance / maxDist;
            // Closer systems are brighter/more opaque
            const nodeOpacity = isOrigin ? 1 : 0.35 + (1 - distRatio) * 0.55;

            return (
              <g key={`node-${i}`}>
                {isOrigin ? (
                  <>
                    {/* Outer pulse ring */}
                    <circle
                      cx={p.x}
                      cy={p.y}
                      r={13}
                      fill="none"
                      stroke="#4ade80"
                      strokeWidth="1"
                      strokeOpacity="0.2"
                    />
                    <circle
                      cx={p.x}
                      cy={p.y}
                      r={8}
                      fill="#4ade80"
                      fillOpacity="0.9"
                      filter="url(#ds-glow-origin)"
                    />
                    <text
                      x={p.x + 14}
                      y={p.y - 3}
                      textAnchor="start"
                      dominantBaseline="auto"
                      fontSize="8"
                      fontFamily="Jura, monospace"
                      letterSpacing="0.10em"
                      fill="#4ade80"
                      fillOpacity="0.85"
                      filter="url(#ds-glow-label)"
                    >
                      {originName.toUpperCase()}
                    </text>
                    <text
                      x={p.x + 14}
                      y={p.y + 8}
                      textAnchor="start"
                      fontSize="5.5"
                      fontFamily="Jura, monospace"
                      letterSpacing="0.12em"
                      fill="#4ade80"
                      fillOpacity="0.5"
                    >
                      ORIGIN
                    </text>
                  </>
                ) : (
                  <circle
                    cx={p.x}
                    cy={p.y}
                    r={3.5}
                    fill="#f97316"
                    fillOpacity={nodeOpacity}
                    filter="url(#ds-glow-node)"
                  />
                )}
              </g>
            );
          })}
        </svg>
      </div>

      {/* ── Legend ── */}
      <div className="flex flex-wrap items-center gap-4 border-t border-orange-900/20 px-4 py-2 text-xs uppercase tracking-widest">
        <div className="flex items-center gap-1.5">
          <span className="inline-block h-2 w-2 rounded-full bg-green-400" style={{ boxShadow: "0 0 4px #4ade80" }}></span>
          <span className="text-neutral-600">Origin</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="inline-block h-2 w-2 rounded-full bg-orange-500"></span>
          <span className="text-neutral-600">Nearby</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="inline-block h-2 w-2 rounded-full bg-orange-900/60"></span>
          <span className="text-neutral-600">Distant</span>
        </div>
        <div className="ml-auto text-neutral-800">
          {results.length} systems · {searchLy} ly radius
        </div>
      </div>
    </Panel>
  );
}
