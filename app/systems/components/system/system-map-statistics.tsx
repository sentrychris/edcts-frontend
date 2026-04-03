import type { FunctionComponent } from "react";
import type SystemMap from "../../lib/system-map";
import { SystemBodyType } from "@/core/constants/system";
import { pluralizeTextFromArray } from "@/core/string-utils";

interface Props {
  system: SystemMap;
}

const SystemMapStatistics: FunctionComponent<Props> = ({ system }) => {
  return (
    <div className="items-center gap-x-6 text-xs md:flex">
      <h4 className="text-glow__orange font-bold uppercase">
        {system.stars.filter((s) => s.type !== SystemBodyType.Null).length}
        <span className="ms-1">
          {pluralizeTextFromArray(
            system.stars.filter((s) => s.type !== SystemBodyType.Null),
            {
              singular: "star",
              plural: "stars",
            },
          )}
        </span>
      </h4>
      <h4 className="text-glow__orange font-bold uppercase">
        {system.planets.length}
        <span className="ms-1">
          {pluralizeTextFromArray(system.planets, {
            singular: "body",
            plural: "bodies",
          })}
        </span>
      </h4>
      <h4 className="text-glow__orange font-bold uppercase">
        {system.stations.length}
        <span className="ms-1">
          {pluralizeTextFromArray(system.stations, {
            singular: "station",
            plural: "stations",
          })}
        </span>
      </h4>
      <h4 className="text-glow__orange font-bold uppercase">
        {system.settlements.length}
        <span className="ms-1">
          {pluralizeTextFromArray(system.settlements, {
            singular: "settlement",
            plural: "settlements",
          })}
        </span>
      </h4>
    </div>
  );
};

export default SystemMapStatistics;
