import type { FunctionComponent } from "react";
import type SystemMap from "@/systems/lib/system-map";
import Link from "next/link";

interface Props {
  className?: string;
  system: SystemMap;
}

const LatestSystem: FunctionComponent<Props> = ({ className, system }) => {
  return (
    <div className={className}>
      <Link
        className="text-glow__blue font-bold hover:underline"
        href={`systems/${system.detail.slug}`}
      >
        {system.name}
      </Link>
      <div className="mt-3 flex gap-x-20">
        <div>
          <p>
            {system.detail.coords.x}, {system.detail.coords.y}, {system.detail.coords.z}
          </p>
          <p>Population: {system.detail.information.population}</p>
        </div>
        <div>
          <p>{system.stars.length} Main sequence stars</p>
          <p>{system.planets.length} orbital bodies</p>
        </div>
      </div>
      <p className="mt-2.5">
        <span className="text-glow__blue">{2}</span> fleet carriers are currently in this system
      </p>
    </div>
  );
};

export default LatestSystem;
