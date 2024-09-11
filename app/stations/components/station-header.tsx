import type { FunctionComponent } from "react";
import type { Station } from "@/core/interfaces/Station";
import { stationIconByType } from "@/app/stations/lib/render-utils";
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
          <h2 className="text-3xl">{station.name}</h2>
          <h4 className="font-bold">
            <span className="text-glow">{station.type}</span>
            <Link
              className="text-glow__orange hover:text-glow__blue ms-3"
              href={station.system ? `/systems/${station.system.slug}` : "#"}
            >
              {station.system ? station.system.name : "Cannot find linked"} system
            </Link>
          </h4>
        </div>
      </div>
    </div>
  );
};

export default StationHeader;
