"use client";

import { useCallback, useRef, useState } from "react";
import type { SystemRouteWaypoint } from "@/core/interfaces/SystemRoute";
import Panel from "@/components/panel";
import Heading from "@/components/heading";

interface Props {
  waypoints: SystemRouteWaypoint[];
}

interface Point2D {
  x: number;
  y: number;
  depth: number;
}

const SVG_W = 800;
const SVG_H = 480;

/**
 * Project a 3D point into 2D SVG space using perspective projection.
 * rotY = azimuth (left/right rotation), rotX = elevation (up/down tilt).
 */
function project(cx: number, cy: number, cz: number, rotX: number, rotY: number, scale: number): Point2D {
  // Rotate around Y axis (azimuth)
  const cosY = Math.cos(rotY);
  const sinY = Math.sin(rotY);
  const x1 = cx * cosY - cz * sinY;
  const z1 = cx * sinY + cz * cosY;

  // Rotate around X axis (elevation)
  const cosX = Math.cos(rotX);
  const sinX = Math.sin(rotX);
  const y2 = cy * cosX - z1 * sinX;
  const z2 = cy * sinX + z1 * cosX;

  // Perspective projection
  const fov = 600;
  const depth = fov + z2;
  const px = (x1 * fov * scale) / depth + SVG_W / 2;
  const py = -(y2 * fov * scale) / depth + SVG_H / 2;

  return { x: px, y: py, depth: z2 };
}

export default function RoutePlot3D({ waypoints }: Props) {
  const [rotX, setRotX] = useState(-0.35);
  const [rotY, setRotY] = useState(0.4);
  const [zoom, setZoom] = useState(1);

  const isDragging = useRef(false);
  const lastMouse = useRef({ x: 0, y: 0 });
  const lastTouch = useRef({ x: 0, y: 0 });

  // Centre coordinates on the route centroid
  const cx = waypoints.reduce((s, w) => s + w.coords.x, 0) / waypoints.length;
  const cy = waypoints.reduce((s, w) => s + w.coords.y, 0) / waypoints.length;
  const cz = waypoints.reduce((s, w) => s + w.coords.z, 0) / waypoints.length;

  const centred = waypoints.map((w) => ({
    x: w.coords.x - cx,
    y: w.coords.y - cy,
    z: w.coords.z - cz,
  }));

  // Auto-scale so the route fills roughly 35% of the smaller SVG dimension
  const maxExtent = Math.max(
    ...centred.flatMap((c) => [Math.abs(c.x), Math.abs(c.y), Math.abs(c.z)]),
    1,
  );
  const baseScale = (Math.min(SVG_W, SVG_H) * 0.32) / maxExtent;
  const scale = baseScale * zoom;

  // Project all waypoints
  const projected = centred.map((c) => project(c.x, c.y, c.z, rotX, rotY, scale));

  // Also project shadow points (same x/z, but y = lowest centred y - used for floor shadows)
  const floorY = Math.max(...centred.map((c) => c.y)) + maxExtent * 0.2;
  const shadows = centred.map((c) => project(c.x, floorY, c.z, rotX, rotY, scale));

  const totalJumps = waypoints.length - 1;
  const totalDistance = waypoints[waypoints.length - 1].total_distance;

  // ── Drag / touch handlers ──

  const onMouseDown = useCallback((e: React.MouseEvent) => {
    isDragging.current = true;
    lastMouse.current = { x: e.clientX, y: e.clientY };
  }, []);

  const onMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging.current) {
      return;
    }
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

  const resetView = () => {
    setRotX(-0.35);
    setRotY(0.4);
    setZoom(1);
  };

  // Sort nodes back-to-front for painter's algorithm
  const sortedIndices = projected
    .map((p, i) => ({ depth: p.depth, i }))
    .sort((a, b) => b.depth - a.depth)
    .map((d) => d.i);

  return (
    <Panel className="overflow-hidden">
      {/* ── Header ── */}
      <div className="flex items-center justify-between border-b border-orange-900/20 px-4 py-3 md:px-5 md:py-4">
        <Heading
          icon="icarus-terminal-star"
          title="Route Visualization"
          subtitle={`${totalJumps} jump${totalJumps !== 1 ? "s" : ""} · ${totalDistance.toFixed(2)} ly total`}
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
          aria-label="3D route visualization"
        >
          <defs>
            <filter id="rp-glow-node" x="-60%" y="-60%" width="220%" height="220%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <filter id="rp-glow-line" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="2" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <filter id="rp-glow-label" x="-10%" y="-10%" width="120%" height="120%">
              <feGaussianBlur stdDeviation="1.5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* ── Subtle crosshair at SVG centre ── */}
          <line x1={SVG_W / 2 - 20} y1={SVG_H / 2} x2={SVG_W / 2 + 20} y2={SVG_H / 2} stroke="#f9731610" strokeWidth="1" />
          <line x1={SVG_W / 2} y1={SVG_H / 2 - 20} x2={SVG_W / 2} y2={SVG_H / 2 + 20} stroke="#f9731610" strokeWidth="1" />

          {/* ── Floor shadow drop-lines ── */}
          {waypoints.map((_, i) => (
            <line
              key={`shadow-line-${i}`}
              x1={projected[i].x}
              y1={projected[i].y}
              x2={shadows[i].x}
              y2={shadows[i].y}
              stroke="#f9731615"
              strokeWidth="1"
              strokeDasharray="2 4"
            />
          ))}

          {/* ── Floor shadow dots ── */}
          {waypoints.map((_, i) => (
            <circle
              key={`shadow-dot-${i}`}
              cx={shadows[i].x}
              cy={shadows[i].y}
              r={2}
              fill="#f9731625"
            />
          ))}

          {/* ── Route lines ── */}
          {projected.slice(0, -1).map((p, i) => {
            const next = projected[i + 1];
            return (
              <line
                key={`route-line-${i}`}
                x1={p.x}
                y1={p.y}
                x2={next.x}
                y2={next.y}
                stroke="#f97316"
                strokeWidth="1.5"
                strokeOpacity="0.55"
                strokeDasharray="5 3"
                filter="url(#rp-glow-line)"
              />
            );
          })}

          {/* ── Nodes + labels (back-to-front) ── */}
          {sortedIndices.map((i) => {
            const w = waypoints[i];
            const p = projected[i];
            const isOrigin = i === 0;
            const isDestination = i === waypoints.length - 1;

            const nodeColor = isOrigin ? "#4ade80" : isDestination ? "#fb923c" : "#f97316";
            const labelColor = isOrigin ? "#4ade80" : isDestination ? "#fb923c" : "#d4d4d4";
            const radius = isOrigin || isDestination ? 6 : 4;
            const labelX = p.x + (isDestination ? -12 : 12);
            const labelAnchor = isDestination ? "end" : "start";

            return (
              <g key={`node-${i}`}>
                {/* Outer pulse ring for endpoints */}
                {(isOrigin || isDestination) && (
                  <circle
                    cx={p.x}
                    cy={p.y}
                    r={radius + 5}
                    fill="none"
                    stroke={nodeColor}
                    strokeWidth="1"
                    strokeOpacity="0.25"
                  />
                )}

                {/* Node circle */}
                <circle
                  cx={p.x}
                  cy={p.y}
                  r={radius}
                  fill={nodeColor}
                  fillOpacity="0.9"
                  filter="url(#rp-glow-node)"
                />

                {/* Jump number for intermediate nodes */}
                {!isOrigin && !isDestination && (
                  <text
                    x={p.x}
                    y={p.y + 0.5}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fontSize="5"
                    fontWeight="bold"
                    fill="#000"
                  >
                    {w.jump}
                  </text>
                )}

                {/* System name label */}
                <text
                  x={labelX}
                  y={p.y - 2}
                  textAnchor={labelAnchor}
                  dominantBaseline="auto"
                  fontSize="8"
                  fontFamily="Jura, monospace"
                  letterSpacing="0.08em"
                  fill={labelColor}
                  fillOpacity="0.9"
                  filter="url(#rp-glow-label)"
                >
                  {w.name.toUpperCase()}
                </text>

                {/* Distance sub-label (not for origin) */}
                {i > 0 && (
                  <text
                    x={labelX}
                    y={p.y + 9}
                    textAnchor={labelAnchor}
                    fontSize="6.5"
                    fontFamily="Jura, monospace"
                    letterSpacing="0.06em"
                    fill="#f97316"
                    fillOpacity="0.5"
                  >
                    {w.distance.toFixed(2)} LY
                  </text>
                )}

                {/* "ORIGIN" / "DEST" badge */}
                {(isOrigin || isDestination) && (
                  <text
                    x={labelX}
                    y={p.y + 9}
                    textAnchor={labelAnchor}
                    fontSize="5.5"
                    fontFamily="Jura, monospace"
                    letterSpacing="0.12em"
                    fill={nodeColor}
                    fillOpacity="0.6"
                  >
                    {isOrigin ? "ORIGIN" : "DESTINATION"}
                  </text>
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
          <span className="inline-block h-2 w-2 rounded-full bg-orange-400" style={{ boxShadow: "0 0 4px #fb923c" }}></span>
          <span className="text-neutral-600">Destination</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="inline-block h-2 w-2 rounded-full bg-orange-600/80"></span>
          <span className="text-neutral-600">Waypoint</span>
        </div>
        <div className="ml-auto text-neutral-800">
          {waypoints.length} systems · {totalDistance.toFixed(2)} ly
        </div>
      </div>
    </Panel>
  );
}
