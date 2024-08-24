import type { FunctionComponent } from "react";
import type SystemMap from "@/systems/lib/system-map";
import Link from "next/link";

interface Props {
  className?: string;
  system: SystemMap;
}

const LatestSystem: FunctionComponent<Props> = ({ className, system }) => {
  return (
    <div className={`${className} uppercase text-sm`}>
      <Link
        className="text-glow__blue font-bold hover:underline text-lg"
        href={`systems/${system.detail.slug}`}
      >
        {system.name}
      </Link>
      <div className="mt-3 flex gap-x-20">
        <div>
          <p>
            {system.detail.coords.x.toFixed(2)}, {system.detail.coords.y.toFixed(2)}, {system.detail.coords.z.toFixed(2)}
          </p>
          <p className="mt-2">Population: {system.detail.information.population}</p>
        </div>
        <div>
          <p className="whitespace-nowrap">{system.stars.length} stars</p>
          <p className="whitespace-nowrap">{system.planets.length} bodies</p>
        </div>
      </div>
      <p className="mt-2.5">
        <span className="text-glow__blue">{2}</span> fleet carriers are currently in this system
      </p>
    </div>
  );
};

export default LatestSystem;
