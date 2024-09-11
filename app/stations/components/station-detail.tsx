"use client";

import { type FunctionComponent, useEffect, useState } from "react";
import type { Station } from "@/core/interfaces/Station";
import { getResource } from "@/core/api";
import Loader from "@/components/loader";
import StationHeader from "./station-header";
import { stationState } from "../lib/state";
import Heading from "@/components/heading";

interface Props {
  params: {
    slug: string;
  };
}

const StationDetail: FunctionComponent<Props> = ({ params }) => {
  const [station, setStation] = useState<Station>(stationState);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { slug } = params;

  useEffect(() => {
    if (slug) {
      getResource<Station>(`stations/${slug}`, {
        params: {
          withSystem: 1,
        },
      })
        .then((response) => {
          const { data: station } = response;
          setStation(station);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  });

  return (
    <>
      {isLoading && <Loader visible={isLoading} />}

      <StationHeader station={station} />

      <Heading icon="icarus-terminal-credits" title="Latest Market Data" className="gap-2 py-5" />
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <div className="border border-neutral-800 p-24"></div>
        <div className="border border-neutral-800 p-24"></div>
      </div>
      
    </>
  );
};

export default StationDetail;
