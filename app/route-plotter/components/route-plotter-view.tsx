"use client";

import { useState } from "react";
import type { SystemRouteWaypoint } from "@/core/interfaces/SystemRoute";
import { getResource } from "@/core/api";
import Panel from "@/components/panel";
import Heading from "@/components/heading";
import RoutePlotterForm from "./route-plotter-form";
import RoutePlot3D from "./route-plot-3d";
import RouteJumpList from "./route-jump-list";

interface Props {
  initialFrom: string;
  initialTo: string;
  initialLy: number;
}

export default function RoutePlotterView({ initialFrom, initialTo, initialLy }: Props) {
  const [route, setRoute] = useState<SystemRouteWaypoint[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (from: string, to: string, ly: number) => {
    setIsLoading(true);
    setError(null);
    setRoute(null);

    try {
      const { data } = await getResource<SystemRouteWaypoint[]>("system/search/route", {
        params: { from, to, ly },
      });
      setRoute(data);
    } catch {
      setError("No route found. Check the system slugs are correct or try increasing the jump range.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-5">
      {/* ── Form ── */}
      <Panel className="px-4 py-4 md:px-6 md:py-5">
        <Heading
          icon="icarus-terminal-route"
          title="Route Plotter"
          subtitle="Calculate jump route between star systems"
          bordered
          className="mb-4 pb-4"
        />
        <RoutePlotterForm
          initialFrom={initialFrom}
          initialTo={initialTo}
          initialLy={initialLy}
          onSubmit={handleSubmit}
          isLoading={isLoading}
        />
      </Panel>

      {/* ── Error ── */}
      {error && (
        <Panel className="px-4 py-4 md:px-6 md:py-5">
          <div className="flex items-center gap-3 text-red-400/80">
            <i className="icarus-terminal-warning text-base"></i>
            <p className="text-xs uppercase tracking-widest">{error}</p>
          </div>
        </Panel>
      )}

      {/* ── Loading ── */}
      {isLoading && (
        <Panel className="flex items-center justify-center px-4 py-16">
          <div className="flex flex-col items-center gap-4">
            <i className="icarus-terminal-route text-glow__orange text-3xl"></i>
            <p className="text-xs uppercase tracking-widest text-neutral-500">
              Calculating optimal route...
            </p>
          </div>
        </Panel>
      )}

      {/* ── Results ── */}
      {route && !isLoading && (
        <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">
          <div className="xl:col-span-2">
            <RoutePlot3D waypoints={route} />
          </div>
          <div>
            <RouteJumpList waypoints={route} />
          </div>
        </div>
      )}
    </div>
  );
}
