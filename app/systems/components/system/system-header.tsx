import type { FunctionComponent } from "react";
import type { System } from "@/core/interfaces/System";
import { renderTextWithIcon } from "@/core/util";

interface Props {
  system: System;
  special?: string;
}

const SystemHeader: FunctionComponent<Props> = ({ system, special }) => {
  return (
    <div className="flex items-center justify-between border-b border-neutral-800 pb-5">
      <div className="text-glow__white flex items-center gap-2">
        <i className="icarus-terminal-system-orbits" style={{ fontSize: "3rem" }}></i>
        <div>
          <h2 className="text-3xl uppercase">
            {system.name} system {special && <span className="ml-1 text-xs">{special}</span>}
          </h2>
          <h4 className="text-glow__orange font-bold uppercase">
            {system.bodies.length ?? 0} bodies found in system
          </h4>
        </div>
      </div>
      <div className="hidden whitespace-nowrap md:inline">
        <p className="mb-2">Galaxy Coordinates:</p>
        {renderTextWithIcon(Object.values(system.coords).join(", "), {
          icon: "icarus-terminal-location-filled",
        })}
      </div>
    </div>
  );
};

export default SystemHeader;
