import Link from "next/link";
import type { SystemDistance } from "@/core/interfaces/SystemDistance";
import Panel from "@/components/panel";
import Heading from "@/components/heading";

interface Props {
  results: SystemDistance[];
  originName: string;
  searchLy: number;
}

export default function DistanceResultsList({ results, originName, searchLy }: Props) {
  const nearest = results[1] ?? null;
  const farthest = results[results.length - 1] ?? null;
  const systemCount = results.length - 1; // exclude origin

  return (
    <Panel className="overflow-hidden">
      {/* ── Header ── */}
      <div className="border-b border-orange-900/20 px-4 py-3 md:px-5 md:py-4">
        <Heading
          icon="icarus-terminal-route"
          title="Nearby Systems"
          subtitle={`${systemCount} found within ${searchLy} ly`}
        />
      </div>

      {/* ── Summary stats ── */}
      <div className="grid grid-cols-2 gap-px border-b border-orange-900/20 bg-orange-900/10">
        <div className="bg-black/50 px-4 py-3">
          <p className="text-xs uppercase tracking-widest text-neutral-600">Systems Found</p>
          <p className="mt-0.5 font-bold text-neutral-200">{systemCount}</p>
        </div>
        <div className="bg-black/50 px-4 py-3">
          <p className="text-xs uppercase tracking-widest text-neutral-600">Farthest</p>
          <p className="mt-0.5 font-bold text-neutral-200">
            {farthest && farthest.slug !== results[0].slug ? (
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
      <div className="divide-y divide-orange-900/10 overflow-y-auto" style={{ maxHeight: "420px" }}>
        {results.map((system, i) => {
          const isOrigin = i === 0;

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
                    <>
                      <span>{system.distance.toFixed(2)} ly</span>
                    </>
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
    </Panel>
  );
}
