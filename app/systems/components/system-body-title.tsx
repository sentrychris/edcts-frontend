import Link from "next/link";
import type { FunctionComponent } from "react";
import { memo } from "react";
import type { System } from "../../core/interfaces/System";

interface Props {
  title: string;
  ringed: boolean;
  system: System;
}

const SystemBodyTitle: FunctionComponent<Props> = ({ title, ringed, system }) => {
  return (
    <div className="text-glow__white flex items-center gap-2">
      <i
        className={"text-glow icarus-terminal-" + (ringed ? "planet-ringed" : "planet")}
        style={{ fontSize: "3rem" }}
      ></i>
      <div>
        <h2 className="text-3xl uppercase">{title}</h2>
        <Link href={`/systems/system/${system.slug}`}>
          <h4 className="text-glow__orange font-bold uppercase">{system.name} system</h4>
        </Link>
      </div>
    </div>
  );
};

export default memo(SystemBodyTitle);
