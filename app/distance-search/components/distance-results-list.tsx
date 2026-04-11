"use client";

import Link from "next/link";
import type { Pagination } from "@/core/interfaces/Pagination";
import type { SystemDistance } from "@/core/interfaces/SystemDistance";
import Panel from "@/components/panel";
import Heading from "@/components/heading";

interface Props {
  pagination: Pagination<SystemDistance>;
  originName: string;
  searchLy: number;
  onPageChange: (page: number) => void;
}

export default function DistanceResultsList({ pagination, originName, searchLy, onPageChange }: Props) {
  const { data: results, meta, links } = pagination;
  const nonOrigin = results.filter((s) => s.distance >= 0.01);
  const farthest = nonOrigin[nonOrigin.length - 1] ?? null;
  const hasPrev = !!links.prev;
  const hasNext = !!links.next;
  const currentPage = meta.current_page;

  return (
    <Panel className="flex h-full flex-col overflow-hidden">
      {/* ── Header ── */}
      <div className="shrink-0 border-b border-orange-900/20 px-4 py-3 md:px-5 md:py-4">
        <Heading
          icon="icarus-terminal-route"
          title="Nearby Systems"
          subtitle={`Within ${searchLy} ly · Page ${currentPage}`}
        />
      </div>

      {/* ── Summary stats ── */}
      <div className="grid shrink-0 grid-cols-2 gap-px border-b border-orange-900/20 bg-orange-900/10">
        <div className="bg-black/50 px-4 py-3">
          <p className="text-xs uppercase tracking-widest text-neutral-600">Search Radius</p>
          <p className="mt-0.5 font-bold text-neutral-200">
            {searchLy} <span className="text-xs font-normal text-neutral-500">ly</span>
          </p>
        </div>
        <div className="bg-black/50 px-4 py-3">
          <p className="text-xs uppercase tracking-widest text-neutral-600">Farthest (page)</p>
          <p className="mt-0.5 font-bold text-neutral-200">
            {farthest ? (
              <>
                {farthest.distance.toFixed(2)}{" "}
                <span className="text-xs font-normal text-neutral-500">ly</span>
              </>
            ) : (
              <span className="text-neutral-600">—</span>
            )}
          </p>
        </div>
      </div>

      {/* ── System list ── */}
      <div className="min-h-0 flex-1 divide-y divide-orange-900/10 overflow-y-auto">
        {results.map((system) => {
          const isOrigin = system.distance < 0.01;

          return (
            <div
              key={system.id}
              className={`flex items-start gap-3 px-4 py-3 transition-colors ${
                isOrigin ? "bg-orange-900/10" : "hover:bg-orange-900/5"
              }`}
            >
              {/* Icon */}
              <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center border border-orange-900/30 text-xs font-bold">
                {isOrigin ? (
                  <i className="icarus-terminal-system-orbits text-xs text-green-400"></i>
                ) : (
                  <i className="icarus-terminal-star text-xs text-orange-900/60"></i>
                )}
              </div>

              {/* System info */}
              <div className="min-w-0 flex-1">
                <Link
                  href={`/systems/${system.slug}`}
                  className="block truncate text-xs font-bold uppercase tracking-widest text-neutral-300 transition-colors hover:text-orange-400"
                >
                  {system.name}
                </Link>

                <div className="mt-1 flex flex-wrap items-center gap-2 text-xs uppercase tracking-widest text-neutral-600">
                  {isOrigin ? (
                    <span className="text-green-400/70">Origin · {originName}</span>
                  ) : (
                    <span>{system.distance.toFixed(2)} ly</span>
                  )}
                </div>
              </div>

              {/* Coords */}
              <div className="hidden shrink-0 text-right lg:block xl:hidden 2xl:block">
                <p className="text-xs tabular-nums text-neutral-700">
                  {system.coords.x.toFixed(1)}, {system.coords.y.toFixed(1)}, {system.coords.z.toFixed(1)}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Pagination controls ── */}
      <div className="flex shrink-0 items-center justify-between border-t border-orange-900/20 px-4 py-3">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={!hasPrev}
          className="text-xs uppercase tracking-widest text-neutral-500 transition-colors hover:text-orange-400 disabled:pointer-events-none disabled:opacity-30"
        >
          ← Prev
        </button>
        <span className="text-xs uppercase tracking-widest text-neutral-700">Page {currentPage}</span>
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={!hasNext}
          className="text-xs uppercase tracking-widest text-neutral-500 transition-colors hover:text-orange-400 disabled:pointer-events-none disabled:opacity-30"
        >
          Next →
        </button>
      </div>
    </Panel>
  );
}
