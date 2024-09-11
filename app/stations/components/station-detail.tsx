"use client";

import { type FunctionComponent, useEffect, useState } from "react";
import type { Station } from "@/core/interfaces/Station";
import { getResource } from "@/core/api";
import Loader from "@/components/loader";
import StationHeader from "./station-header";
import { stationState } from "../lib/state";

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
    </>
  );
};

export default StationDetail;
