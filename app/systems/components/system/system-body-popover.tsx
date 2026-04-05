"use client";

import { type FunctionComponent, useEffect, useRef, useState } from "react";
import type { SystemDispatcher } from "@/core/events/SystemDispatcher";
import type { SystemBodyRing, MappedSystemBody } from "@/core/interfaces/SystemBody";
import type SystemMap from "../../lib/system-map";
import { XMarkIcon, CheckIcon } from "@heroicons/react/24/outline";
import { SystemBodyType } from "@/core/constants/system";
import { formatDate, formatNumber } from "@/core/string-utils";
import Link from "next/link";

interface Props {
  body: MappedSystemBody | null;
  system: SystemMap;
  dispatcher: SystemDispatcher;
  close?: () => void;
}

interface StatRowProps {
  label: string;
  value: React.ReactNode;
}

const StatRow = ({ label, value }: StatRowProps) => (
  <div className="flex items-center justify-between border-b border-neutral-900 py-1.5">
    <span className="text-neutral-600">{label}</span>
    <span className="text-right text-neutral-300">{value}</span>
  </div>
);

const Yes = () => <span className="text-green-400">Yes</span>;
const No = () => <span className="text-red-400/80">No</span>;

const SectionHeader = ({ icon, title }: { icon: string; title: string }) => (
  <div className="mb-3 flex items-center gap-2 border-b border-orange-900/20 pb-2.5 text-xs uppercase tracking-widest text-neutral-600">
    <i className={`${icon} text-orange-500/50`}></i>
    <span>{title}</span>
  </div>
);

const PANE_WIDTH = 320;

const SystemBodyPopover: FunctionComponent<Props> = ({ body, system, dispatcher, close }) => {
  const [position, setPosition] = useState(() => ({
    x: typeof window !== "undefined" ? Math.max(0, window.innerWidth - PANE_WIDTH - 24) : 0,
    y: 80,
  }));
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef<{ mouseX: number; mouseY: number; elemX: number; elemY: number } | null>(null);

  const onDragHandleMouseDown = (e: React.MouseEvent) => {
    // Don't start drag on buttons
    if ((e.target as HTMLElement).closest("button")) return;
    e.preventDefault();
    setIsDragging(true);
    dragStart.current = {
      mouseX: e.clientX,
      mouseY: e.clientY,
      elemX: position.x,
      elemY: position.y,
    };
  };

  useEffect(() => {
    if (!isDragging) return;

    const onMouseMove = (e: MouseEvent) => {
      if (!dragStart.current) return;
      const dx = e.clientX - dragStart.current.mouseX;
      const dy = e.clientY - dragStart.current.mouseY;
      setPosition({
        x: Math.max(0, Math.min(window.innerWidth - PANE_WIDTH, dragStart.current.elemX + dx)),
        y: Math.max(0, Math.min(window.innerHeight - 60, dragStart.current.elemY + dy)),
      });
    };

    const onMouseUp = () => {
      setIsDragging(false);
      dragStart.current = null;
    };

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
    return () => {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
    };
  }, [isDragging]);

  if (!body) return null;

  const isStarType = body.type === SystemBodyType.Star;
  const bodyIcon = isStarType ? "icarus-terminal-star" : "icarus-terminal-planet";

  return (
    <div
      className={`fixed z-50 flex max-h-[85vh] flex-col border border-orange-900/40 bg-black/70 shadow-2xl shadow-black/60 backdrop-blur ${
        isDragging ? "select-none shadow-orange-900/30" : ""
      }`}
      style={{ left: position.x, top: position.y }}
    >
      {/* ── Drag Handle / Header ── */}
      <div
        className={`relative shrink-0 border-b border-orange-900/40 px-4 py-4 ${
          isDragging ? "cursor-grabbing" : "cursor-grab"
        }`}
        onMouseDown={onDragHandleMouseDown}
      >
        {/* Corner bracket accents */}
        <span className="pointer-events-none absolute -left-px -top-px h-4 w-4 border-l-2 border-t-2 border-orange-500" />
        <span className="pointer-events-none absolute -right-px -top-px h-4 w-4 border-r-2 border-t-2 border-orange-500" />

        <div className="flex items-start justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <i className={`${bodyIcon} text-glow__orange shrink-0`} style={{ fontSize: "1.5rem" }}></i>
            <div className="min-w-0">
              <p className="truncate text-xs font-bold uppercase tracking-widest text-glow__orange">{body.name}</p>
              <p className="mt-0.5 text-xs uppercase tracking-wider text-neutral-600">
                {body.type}
                {body.sub_type && body.sub_type !== body.type && (
                  <span className="text-neutral-700"> — {body.sub_type}</span>
                )}
              </p>
            </div>
          </div>

          {/* Drag grip + close */}
          <div className="flex shrink-0 items-center gap-2">
            {/* Drag indicator dots */}
            <div className="grid grid-cols-2 gap-0.5 opacity-25 pointer-events-none">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-1 w-1 rounded-full bg-neutral-400" />
              ))}
            </div>
            <button
              onClick={close}
              className="text-neutral-700 transition-colors hover:text-glow__orange"
              aria-label="Close"
            >
              <XMarkIcon height={14} width={14} />
            </button>
          </div>
        </div>

        {/* Orbital children link */}
        {body._children && body._children.length > 0 && (
          <button
            className="mt-3 flex items-center gap-1.5 text-xs uppercase tracking-widest text-neutral-500 transition-colors hover:text-orange-400"
            onClick={() => {
              dispatcher.selectBody({ body, type: "select-body" });
              if (close) close();
            }}
          >
            <i className="icarus-terminal-system-orbits text-sm text-orange-500/40"></i>
            <span>{body._children.length} orbital bodies</span>
          </button>
        )}

        {/* Status bar */}
        <div className="mt-3 flex items-center gap-3 border-t border-orange-900/20 pt-3 text-xs uppercase tracking-widest text-neutral-700">
          <span>MODULE:SURVEY</span>
          <span className="text-neutral-800">■</span>
          <span>CLASS:{isStarType ? "STELLAR" : "PLANETARY"}</span>
          <span className="ml-auto flex items-center gap-1.5">
            <span className="fx-dot-green h-1.5 w-1.5"></span>
            <span>DATA LOCKED</span>
          </span>
        </div>
      </div>

      {/* ── Scrollable body ── */}
      <div className="flex-1 space-y-5 overflow-y-auto px-4 py-4 text-xs uppercase tracking-wider">

        {/* Discovery */}
        <section>
          <SectionHeader icon="icarus-terminal-commander" title="Discovery Record" />
          <StatRow
            label="Discovered By"
            value={<span className="text-glow__orange">CMDR {body.discovered_by ?? "Unknown"}</span>}
          />
          <StatRow label="Discovery Date" value={formatDate(body.discovered_at)} />
        </section>

        {/* Star data */}
        {isStarType && (
          <section>
            <SectionHeader icon="icarus-terminal-star" title="Stellar Data" />
            <StatRow label="Spectral Class" value={body.spectral_class ?? "—"} />
            <StatRow label="Luminosity" value={body.luminosity ?? "—"} />
            <StatRow label="Solar Masses" value={body.solar_masses ?? "—"} />
            <StatRow label="Solar Radius" value={body.solar_radius?.toFixed(4) ?? "—"} />
            <StatRow label="Main Star" value={body.is_main_star ? <Yes /> : <No />} />
            <StatRow label="Scoopable" value={body.is_scoopable ? <Yes /> : <No />} />
          </section>
        )}

        {/* Planet data */}
        {body.type === SystemBodyType.Planet && (
          <>
            <section>
              <SectionHeader icon="icarus-terminal-planet" title="Surface Data" />
              <StatRow
                label="Dist. to Arrival"
                value={body.distance_to_arrival ? `${formatNumber(body.distance_to_arrival)} LS` : "—"}
              />
              <StatRow label="Landable" value={body.is_landable ? <Yes /> : <No />} />
              <StatRow label="Gravity" value={body.gravity ? `${body.gravity.toFixed(2)} G` : "—"} />
              <StatRow
                label="Surface Temp"
                value={body.surface_temp ? `${formatNumber(body.surface_temp)} K` : "—"}
              />
              <StatRow label="Atmosphere" value={body.atmosphere_type ?? "None"} />
              <StatRow label="Volcanism" value={body.volcanism_type ?? "None"} />
              <StatRow
                label="Terraforming"
                value={
                  body.terraforming_state === "Candidate for terraforming" ? (
                    <span className="text-green-400">{body.terraforming_state}</span>
                  ) : (
                    <span className="text-neutral-500">{body.terraforming_state ?? "Not Applicable"}</span>
                  )
                }
              />
            </section>

            {body._planetary_bases && body._planetary_bases.length > 0 && (
              <section>
                <SectionHeader icon="icarus-terminal-settlement" title="Planetary Settlements" />
                <div className="space-y-3">
                  {body._planetary_bases.map((s) => (
                    <div key={s.id} className="relative border border-orange-900/20 p-3">
                      <span className="pointer-events-none absolute -left-px -top-px h-2.5 w-2.5 border-l border-t border-orange-500/60" />
                      <span className="pointer-events-none absolute -right-px -top-px h-2.5 w-2.5 border-r border-t border-orange-500/60" />
                      <span className="pointer-events-none absolute -bottom-px -left-px h-2.5 w-2.5 border-b border-l border-orange-500/60" />
                      <span className="pointer-events-none absolute -bottom-px -right-px h-2.5 w-2.5 border-b border-r border-orange-500/60" />
                      <p className="text-glow__blue mb-1.5 font-bold">{s.name}</p>
                      <p className="mb-2 text-neutral-600">{s.economy} Economy</p>
                      <div className="flex flex-wrap gap-x-4 gap-y-1">
                        {s.has_market && (
                          <div className="flex items-center gap-1 text-neutral-500">
                            <CheckIcon className="h-3 w-3 text-orange-500/60" />
                            <span>Market</span>
                          </div>
                        )}
                        {s.has_outfitting && (
                          <div className="flex items-center gap-1 text-neutral-500">
                            <CheckIcon className="h-3 w-3 text-orange-500/60" />
                            <span>Outfitting</span>
                          </div>
                        )}
                        {s.has_shipyard && (
                          <div className="flex items-center gap-1 text-neutral-500">
                            <CheckIcon className="h-3 w-3 text-orange-500/60" />
                            <span>Shipyard</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </>
        )}

        {/* Orbital data */}
        <section>
          <SectionHeader icon="icarus-terminal-system-orbits" title="Orbital Mechanics" />
          <StatRow
            label="Orbital Period"
            value={body.orbital_period ? `${body.orbital_period.toFixed(4)} D` : "—"}
          />
          <StatRow
            label="Inclination"
            value={body.orbital_inclination ? `${body.orbital_inclination.toFixed(4)}°` : "—"}
          />
          <StatRow label="Eccentricity" value={body.orbital_eccentricity?.toFixed(6) ?? "—"} />
          <StatRow label="Semi-Major Axis" value={body.semi_major_axis?.toFixed(6) ?? "—"} />
          <StatRow
            label="Axial Tilt"
            value={body.axial_tilt ? `${body.axial_tilt.toFixed(4)}°` : "—"}
          />
          <StatRow label="Arg of Periapsis" value={body.arg_of_periapsis?.toFixed(4) ?? "—"} />
          {body.type === SystemBodyType.Planet && (
            <StatRow label="Tidally Locked" value={body.is_tidally_locked ? <Yes /> : <No />} />
          )}
        </section>

        {/* Ring data */}
        {body.rings && body.rings.length > 0 && (
          <section>
            <SectionHeader icon="icarus-terminal-planet-ringed" title="Ring System" />
            <div className="space-y-3">
              {body.rings.map((ring: SystemBodyRing) => (
                <div key={ring.mass} className="border-b border-neutral-900 pb-3">
                  <p className="text-glow__orange mb-1.5">{ring.name}</p>
                  <StatRow label="Type" value={ring.type} />
                  <StatRow label="Mass" value={`${formatNumber(ring.mass)} KG`} />
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Footer — link to full body page */}
        <div className="border-t border-orange-900/20 pb-1 pt-3">
          <Link
            href={`/systems/system/${system.detail.slug}/body/${body.slug}`}
            className="flex items-center gap-2 text-neutral-600 transition-colors hover:text-orange-400"
          >
            <i className="icarus-terminal-scan text-orange-500/40"></i>
            <span>Full Survey Report</span>
            <span className="ml-auto">→</span>
          </Link>
        </div>

      </div>
    </div>
  );
};

export default SystemBodyPopover;
