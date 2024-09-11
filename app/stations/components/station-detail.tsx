"use client";

import { type FunctionComponent, useEffect, useState } from "react";
import type { Station } from "@/core/interfaces/Station";
import type { MarketData } from "@/core/interfaces/Market";
import { getResource } from "@/core/api";
import { stationState } from "../lib/state";
import Loader from "@/components/loader";
import Heading from "@/components/heading";
import StationHeader from "./station-header";
import { formatNumber } from "@/core/string-utils";
import StationInformationBar from "./station-information-bar";

interface Props {
  params: {
    slug: string;
  };
}

const StationDetail: FunctionComponent<Props> = ({ params }) => {
  const [station, setStation] = useState<Station>(stationState);
  const [marketData, setMarketData] = useState<MarketData>();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { slug } = params;

  useEffect(() => {
    if (slug) {
      getResource<Station>(`stations/${slug}`, {
        params: {
          withSystem: 1,
        },
      })
        .then(async (response) => {
          const { data: station } = response;
          setStation(station);

          const { data: marketData } = await getResource<MarketData>(`station/${slug}/market`);
          setMarketData(marketData);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, []);

  return (
    <>
      {isLoading && <Loader visible={isLoading} />}

      <StationHeader station={station} />
      <StationInformationBar information={station} />

      <Heading icon="icarus-terminal-credits" title="Latest Market Data" className="gap-2 py-5" />
      {marketData && (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-12">
          {marketData.commodities &&
            Object.keys(marketData.commodities).map((key) => (
              <div className="col-span-2 rounded-xl border border-neutral-800 bg-transparent p-5 text-xs backdrop-blur backdrop-filter">
                <h2 className="text-glow__blue text-lg">{key}</h2>
                <div className="mt-3 grid grid-cols-2 gap-2">
                  <div>
                    <h3 className="text-glow__orange text-sm">Buy Price</h3>
                    <p>{formatNumber(marketData.commodities[key].buyPrice)}</p>
                  </div>
                  <div>
                    <h3 className="text-glow__orange text-sm">Stock</h3>
                    <p>{formatNumber(marketData.commodities[key].stock)}</p>
                  </div>
                  <div>
                    <h3 className="text-glow__orange text-sm">Sell Price</h3>
                    <p>{formatNumber(marketData.commodities[key].sellPrice)}</p>
                  </div>
                  <div>
                    <h3 className="text-glow__orange text-sm">Demand</h3>
                    <p>{formatNumber(marketData.commodities[key].demand)}</p>
                  </div>
                </div>
              </div>
            ))}
        </div>
      )}
    </>
  );
};

export default StationDetail;
