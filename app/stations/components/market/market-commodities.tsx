"use client";

import { type FunctionComponent, useEffect, useState } from "react";
import type { Station } from "@/core/interfaces/Station";
import type { MarketCommodities, MarketCommodity, MarketData } from "@/core/interfaces/Market";
import { getResource } from "@/core/api";
import { formatDate, formatNumber } from "@/core/string-utils";
import Heading from "@/components/heading";
import Filter from "@/components/filter";

interface Props {
  station: Station;
}

const MarketCommodities: FunctionComponent<Props> = ({ station }) => {
  const [market, setMarket] = useState<MarketData>();
  const [commodities, setCommodities] = useState<MarketCommodities>();
  const [allCommodities, setAllCommodities] = useState<MarketCommodities>(); // Store the unfiltered data here
  const [currentSlice, setCurrentSlice] = useState(0);
  const itemsPerSlice = 12;

  const handleNextSlice = () => {
    if (commodities && (currentSlice + 1) * itemsPerSlice < Object.keys(commodities).length) {
      setCurrentSlice((prev) => prev + 1);
    }
  };

  const handlePrevSlice = () => {
    if (commodities && currentSlice > 0) {
      setCurrentSlice((prev) => prev - 1);
    }
  };

  const reduceCommodities = (filteredCommodities: string[]) => {
    if (allCommodities) {
      // Use allCommodities for filtering
      return filteredCommodities.reduce((acc, key) => {
        acc[key] = allCommodities[key];
        return acc;
      }, {} as MarketCommodities);
    }
  };

  const searchByCommodity = async (text: string) => {
    if (allCommodities) {
      // If no text, reset to allCommodities
      if (text === "") {
        setCommodities(allCommodities);
      } else {
        const filteredData = reduceCommodities(
          Object.keys(allCommodities).filter((commodity) =>
            commodity.toLowerCase().includes(text.toLowerCase()),
          ),
        );
        setCommodities(filteredData);
      }
    }
  };

  const searchByMinimumPrice = async (value: number, key: "sellPrice" | "buyPrice") => {
    if (allCommodities) {
      const filteredData = reduceCommodities(
        Object.keys(allCommodities).filter(
          (commodity) =>
            (allCommodities[commodity][key as keyof MarketCommodity] as number) >= value,
        ),
      );
      setCommodities(filteredData);
    }
  };

  const searchByMinimumBuyPrice = async (value: number) => {
    searchByMinimumPrice(value, "buyPrice");
  };

  const searchByMinimumSellPrice = async (value: number) => {
    searchByMinimumPrice(value, "sellPrice");
  };

  const searchByStockLevel = async (value: number) => {
    if (allCommodities) {
      const filteredData = reduceCommodities(
        Object.keys(allCommodities).filter((commodity) => allCommodities[commodity].stock >= value),
      );
      setCommodities(filteredData);
    }
  };

  useEffect(() => {
    getResource<MarketData>(`station/${station.slug}/market`).then((response) => {
      const { data } = response;
      setMarket(data);
      setAllCommodities(data.commodities); // Store unfiltered data
      setCommodities(data.commodities); // Set initial state for commodities
    });
  }, []);

  return (
    <>
      <div className="mt-10 flex items-center justify-between border-t border-neutral-800 pt-5">
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
      <div className="flex items-center justify-between pb-10 pt-5">
        <button
          onClick={handlePrevSlice}
          disabled={currentSlice === 0}
          className="text-glow__orange hover:text-glow__blue py-2 text-xs uppercase disabled:opacity-50"
        >
          {"<<"} Prev
        </button>
        <div className="flex w-11/12 flex-wrap items-center gap-5 md:flex-nowrap">
          <Filter handleInput={searchByCommodity} placeholder="Filter by commodity..." />
          <Filter
            type="number"
            handleInput={searchByMinimumBuyPrice}
            placeholder="Filter by buy price..."
          />
          <Filter
            type="number"
            handleInput={searchByMinimumSellPrice}
            placeholder="Filter by sell price..."
          />
          <Filter type="number" handleInput={searchByStockLevel} placeholder="Filter by stock..." />
        </div>
        <button
          onClick={handleNextSlice}
          disabled={
            commodities
              ? (currentSlice + 1) * itemsPerSlice >= Object.keys(commodities).length
              : true
          }
          className="text-glow__orange hover:text-glow__blue py-2 text-xs uppercase disabled:opacity-50"
        >
          Next {">>"}
        </button>
      </div>
      <div className="grid grid-cols-1 gap-5 md:grid-cols-12">
        {commodities ? (
          Object.keys(commodities)
            .slice(currentSlice * itemsPerSlice, currentSlice * itemsPerSlice + itemsPerSlice)
            .map((item) => (
              <div
                key={item}
                className="col-span-3 rounded-xl border border-neutral-800 bg-transparent p-5 text-sm backdrop-blur backdrop-filter"
              >
                <h2 className="text-glow__blue text-lg uppercase">{commodities[item].name}</h2>
                <div className="mt-3 grid grid-cols-2 gap-2">
                  <div>
                    <h3 className="text-glow__orange mb-2">Buy Price</h3>
                    <p className="flex items-center gap-2">
                      <i className="icarus-terminal-credits text-glow"></i>
                      {formatNumber(commodities[item].buyPrice)}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-glow__orange mb-2">Stock</h3>
                    <p className="flex items-center gap-2">
                      <i className="icarus-terminal-inventory text-glow"></i>
                      {formatNumber(commodities[item].stock)}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-glow__orange mb-2">Sell Price</h3>
                    <p className="flex items-center gap-2">
                      <i className="icarus-terminal-credits text-glow"></i>
                      {formatNumber(commodities[item].sellPrice)}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-glow__orange mb-2">Demand</h3>
                    <p className="flex items-center gap-2">
                      <i
                        className={`icarus-terminal-chevron-${Math.random() > 0.5 ? "up text-green-300" : "down text-red-300"}`}
                      ></i>
                      {formatNumber(commodities[item].demand)}
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
