"use client";

import type { FunctionComponent } from "react";
import type { Station } from "@/core/interfaces/Station";
import { useEffect, useState } from "react";
import { getResource } from "@/core/api";
import Loader from "@/components/loader";
import { stationIconByType } from "@/app/systems/lib/render-utils";

interface Props {
  params: { slug: string };
}

const stationState: Station = {
  id: 0,
  name: "",
  type: "",
  body: null,
  distance_to_arrival: 0,
  controlling_faction: "",
  allegiance: "",
  government: "",
  economy: "",
  second_economy: null,
  has_market: false,
  has_shipyard: false,
  has_outfitting: false,
  other_services: [],
  last_updated: {
    information: null,
    market: null,
    shipyard: null,
    outfitting: null,
  },
  slug: "",
};

const StationDetail: FunctionComponent<Props> = ({ params }) => {
  const [station, setStation] = useState<Station>(stationState);
  const [isLoading, setLoading] = useState<boolean>(true);
  const { slug } = params;

  useEffect(() => {
    if (slug) {
      getResource<Station>(`stations/${slug}`)
        .then((response) => {
          setStation(response.data);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [slug]);

  return (
    <>
      {isLoading && <Loader visible={isLoading} />}

      {!isLoading && (
        <div className="flex items-center gap-3 border-b border-neutral-800 pb-5 uppercase">
          <i
            className={`${stationIconByType(station.type)} text-glow`}
            style={{ fontSize: "3rem" }}
          ></i>
          <div>
            <h2 className="text-glow__white text-3xl">{station.name}</h2>
            {station.system && (
              <h4 className="text-glow__orange font-bold">{station.system.name}</h4>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default StationDetail;
