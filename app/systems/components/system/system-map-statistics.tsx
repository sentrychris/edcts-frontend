import type { FunctionComponent } from "react";
import type SystemMap from "../../lib/system-map";
import { SystemBodyType } from "@/core/constants/system";
import { pluralizeTextFromArray } from "@/core/string-utils";

interface Props {
  system: SystemMap;
}

const SystemMapStatistics: FunctionComponent<Props> = ({ system }) => {
  const starCount = system.stars.filter((s) => s.type !== SystemBodyType.Null).length;
  const filteredStars = system.stars.filter((s) => s.type !== SystemBodyType.Null);

  return (
    <div className="hidden items-center gap-1 text-xs md:flex">
      <span className="text-glow__orange font-bold uppercase">
        {starCount}{" "}
        {pluralizeTextFromArray(filteredStars, { singular: "star", plural: "stars" })}
      </span>
      <span className="text-neutral-700">■</span>
      <span className="text-glow__orange font-bold uppercase">
        {system.planets.length}{" "}
        {pluralizeTextFromArray(system.planets, { singular: "body", plural: "bodies" })}
      </span>
      <span className="text-neutral-700">■</span>
      <span className="text-glow__orange font-bold uppercase">
        {system.stations.length}{" "}
        {pluralizeTextFromArray(system.stations, { singular: "station", plural: "stations" })}
      </span>
      <span className="text-neutral-700">■</span>
      <span className="text-glow__orange font-bold uppercase">
        {system.settlements.length}{" "}
        {pluralizeTextFromArray(system.settlements, { singular: "settlement", plural: "settlements" })}
      </span>
    </div>
  );
};

export default SystemMapStatistics;
