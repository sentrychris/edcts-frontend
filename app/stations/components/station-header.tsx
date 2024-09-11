import type { FunctionComponent } from "react";
import type { Station } from "@/core/interfaces/Station";
import { stationIconByType } from "@/app/systems/lib/render-utils";
import Link from "next/link";

interface Props {
  station: Station;
}

const StationHeader: FunctionComponent<Props> = ({ station }) => {
  return (
    <div className="flex items-center justify-between border-b border-neutral-800 pb-5 uppercase">
      <div className="text-glow__white flex items-center gap-2">
        <i className={stationIconByType(station.type)} style={{ fontSize: "3rem" }}></i>
        <div>
          <h2 className="text-3xl">
            {station.name}
          </h2>
          <h4>
            <span className="text-glow">{station.type}</span>
            <Link className="ms-3 text-glow__orange hover:text-glow__blue" href={station.system?.slug ?? '#'}>
              {station.system?.name} system
            </Link>
          </h4>
        </div>
      </div>
    </div>
  );
};

export default StationHeader;
