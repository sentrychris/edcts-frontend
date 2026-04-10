import Link from "next/link";
import type { SystemRouteWaypoint } from "@/core/interfaces/SystemRoute";
import Panel from "@/components/panel";
import Heading from "@/components/heading";

interface Props {
  waypoints: SystemRouteWaypoint[];
}

export default function RouteJumpList({ waypoints }: Props) {
  const totalJumps = waypoints.length - 1;
  const totalDistance = waypoints[waypoints.length - 1].total_distance;

  return (
    <Panel className="overflow-hidden">
      {/* ── Header ── */}
      <div className="border-b border-orange-900/20 px-4 py-3 md:px-5 md:py-4">
        <Heading
          icon="icarus-terminal-route"
          title="Jump Sequence"
          subtitle={`${totalJumps} jump${totalJumps !== 1 ? "s" : ""} · ${totalDistance.toFixed(2)} ly total`}
        />
      </div>

      {/* ── Summary stats ── */}
      <div className="grid grid-cols-2 gap-px border-b border-orange-900/20 bg-orange-900/10">
        <div className="bg-black/50 px-4 py-3">
          <p className="text-xs uppercase tracking-widest text-neutral-600">Total Jumps</p>
          <p className="mt-0.5 font-bold text-neutral-200">{totalJumps}</p>
        </div>
        <div className="bg-black/50 px-4 py-3">
          <p className="text-xs uppercase tracking-widest text-neutral-600">Total Distance</p>
          <p className="mt-0.5 font-bold text-neutral-200">
            {totalDistance.toFixed(2)}{" "}
            <span className="text-xs font-normal text-neutral-500">ly</span>
          </p>
        </div>
      </div>

      {/* ── Waypoint list ── */}
      <div className="divide-y divide-orange-900/10 overflow-y-auto" style={{ maxHeight: "420px" }}>
        {waypoints.map((waypoint, i) => {
          const isOrigin = i === 0;
          const isDestination = i === waypoints.length - 1;

          return (
            <div
              key={waypoint.id}
              className={`flex items-start gap-3 px-4 py-3 transition-colors ${
                isOrigin || isDestination ? "bg-orange-900/10" : "hover:bg-orange-900/5"
              }`}
            >
              {/* Jump index indicator */}
              <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center border border-orange-900/30 text-xs font-bold">
                {isOrigin ? (
                  <i className="icarus-terminal-route text-xs text-green-400"></i>
                ) : isDestination ? (
                  <i className="icarus-terminal-star text-xs text-orange-400"></i>
                ) : (
                  <span className="text-neutral-600">{waypoint.jump}</span>
                )}
              </div>

              {/* System info */}
              <div className="min-w-0 flex-1">
                <Link
                  href={`/systems/${waypoint.slug}`}
                  className="block truncate text-xs font-bold uppercase tracking-widest text-neutral-300 transition-colors hover:text-orange-400"
                >
                  {waypoint.name}
                </Link>

                <div className="mt-1 flex flex-wrap items-center gap-2 text-xs uppercase tracking-widest text-neutral-600">
                  {isOrigin ? (
                    <span className="text-green-400/70">Origin</span>
                  ) : isDestination ? (
                    <>
                      <span className="text-orange-400/70">Destination</span>
                      <span className="text-neutral-800">·</span>
                      <span>{waypoint.distance.toFixed(2)} ly</span>
                    </>
                  ) : (
                    <>
                      <span>{waypoint.distance.toFixed(2)} ly</span>
                      <span className="text-neutral-800">·</span>
                      <span className="text-neutral-700">{waypoint.total_distance.toFixed(2)} ly total</span>
                    </>
                  )}
                </div>
              </div>

              {/* Coords (collapsed on small screens) */}
              <div className="hidden shrink-0 text-right lg:block xl:hidden 2xl:block">
                <p className="text-xs tabular-nums text-neutral-700">
                  {waypoint.coords.x.toFixed(1)}, {waypoint.coords.y.toFixed(1)}, {waypoint.coords.z.toFixed(1)}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </Panel>
  );
}
