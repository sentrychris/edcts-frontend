"use client";

import { type FunctionComponent, useEffect, useState } from "react";
import type { Station } from "@/core/interfaces/Station";
import type { MarketData } from "@/core/interfaces/Market";
import { getResource } from "@/core/api";
import { formatDate, formatNumber } from "@/core/string-utils";
import Heading from "@/components/heading";

interface Props {
  station: Station;
}

const MarketCommodities: FunctionComponent<Props> = ({ station }) => {
  const [market, setMarket] = useState<MarketData>();

  useEffect(() => {
    getResource<MarketData>(`station/${station.slug}/market`).then((response) => {
      const { data } = response;
      setMarket(data);
    });
  }, []);

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading icon="icarus-terminal-credits" title="Market Information" className="gap-2 py-5" />
        <div className="text-xs text-neutral-300">
          <span>
            Market data for {station.name} <br />
            Last updated on:{" "}
            {market ? (
              <span className="text-glow__orange">{formatDate(market.last_updated)}</span>
            ) : (
              "A long time ago..."
            )}
          </span>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-5 md:grid-cols-12">
        {market && market.commodities ? (
          Object.keys(market.commodities)
            .slice(0, 12)
            .map((item) => (
              <div
                key={item}
                className="col-span-3 rounded-xl border border-neutral-800 bg-transparent p-5 text-sm backdrop-blur backdrop-filter"
              >
                <h2 className="text-glow__blue text-lg uppercase">{market.commodities[item].name}</h2>
                <div className="mt-3 grid grid-cols-2 gap-2">
                  <div>
                    <h3 className="text-glow__orange mb-2">Buy Price</h3>
                    <p className="flex items-center gap-2">
                      <i className="icarus-terminal-credits text-glow"></i>
                      {formatNumber(market.commodities[item].buyPrice)}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-glow__orange mb-2">Stock</h3>
                    <p className="flex items-center gap-2">
                      <i className="icarus-terminal-inventory text-glow"></i>
                      {formatNumber(market.commodities[item].stock)}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-glow__orange mb-2">Sell Price</h3>
                    <p className="flex items-center gap-2">
                      <i className="icarus-terminal-credits text-glow"></i>
                      {formatNumber(market.commodities[item].sellPrice)}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-glow__orange mb-2">Demand</h3>
                    <p className="flex items-center gap-2">
                      <i
                        className={`icarus-terminal-chevron-${Math.random() > 0.5 ? "up text-green-300" : "down text-red-300"}`}
                      ></i>
                      {formatNumber(market.commodities[item].demand)}
                    </p>
                  </div>
                </div>
              </div>
            ))
        ) : (
          <h2 className="text-glow__orange col-span-12 py-10 text-center">
            No Market Data for {station.name}
          </h2>
        )}
      </div>
    </>
  );
};

export default MarketCommodities;
