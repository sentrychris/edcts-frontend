import type { FunctionComponent } from "react";
import type { System } from "@/core/interfaces/System";

interface Props {
  system: System;
  special?: string;
}

const SystemHeader: FunctionComponent<Props> = ({ system, special }) => {
  return (
    <div className="relative mb-5 border border-orange-900/40 px-6 py-6">
      {/* Corner bracket accents */}
      <span className="absolute -left-px -top-px h-5 w-5 border-l-2 border-t-2 border-orange-500" />
      <span className="absolute -right-px -top-px h-5 w-5 border-r-2 border-t-2 border-orange-500" />
      <span className="absolute -bottom-px -left-px h-5 w-5 border-b-2 border-l-2 border-orange-500" />
      <span className="absolute -bottom-px -right-px h-5 w-5 border-b-2 border-r-2 border-orange-500" />

      <div className="flex items-center justify-between uppercase">
        <div className="flex items-center gap-4">
          <i className="icarus-terminal-system-orbits text-glow__orange" style={{ fontSize: "2.5rem" }}></i>
          <div>
            <p className="mb-1 text-xs uppercase tracking-[0.4em] text-neutral-500">star system</p>
            <h2 className="text-glow__white text-2xl font-bold tracking-wide md:text-3xl">
              {system.name}
              {special && <span className="ml-2 text-xs text-neutral-400">{special}</span>}
            </h2>
            <p className="text-glow__orange text-xs font-bold tracking-wider">
              {system.bodies.length ?? 0} bodies surveyed
            </p>
          </div>
        </div>
        <div className="hidden flex-col items-end gap-1 md:flex">
          <p className="text-xs uppercase tracking-widest text-neutral-600">Galaxy Coordinates</p>
          <div className="flex items-center gap-2 text-xs">
            <i className="icarus-terminal-location-filled text-glow__orange"></i>
            <span className="font-mono text-neutral-400">{Object.values(system.coords).join(", ")}</span>
          </div>
        </div>
      </div>

      {/* Footer rule */}
      <div className="mt-4 flex items-center gap-4 border-t border-neutral-800 pt-3 text-xs uppercase tracking-widest text-neutral-700">
        <span className="h-px flex-1 bg-neutral-800"></span>
        <span className="flex items-center gap-2">
          <i className="icarus-terminal-route"></i>
          SYSTEM INTELLIGENCE REPORT
        </span>
        <span className="h-px flex-1 bg-neutral-800"></span>
      </div>
    </div>
  );
};

export default SystemHeader;
