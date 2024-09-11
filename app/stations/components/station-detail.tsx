"use client";

import { type FunctionComponent, useEffect, useState } from "react";
import type { Station } from "@/core/interfaces/Station";
import type { MarketData } from "@/core/interfaces/Market";
import { getResource } from "@/core/api";
import { stationState } from "../lib/state";
import Loader from "@/components/loader";
import Heading from "@/components/heading";
import StationHeader from "./station-header";
import { formatDate, formatNumber } from "@/core/string-utils";
import StationInformationBar from "./station-information-bar";
import SystemBodySVG from "@/app/systems/components/system/system-body-svg";
import { systemBodyState } from "@/app/systems/lib/state";
import StationBodySVG from "./station-body.svg";
import { stationIconByType } from "../lib/render-utils";
import Link from "next/link";

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

      <Heading icon="icarus-terminal-info" title="Station Overview" className="gap-2 py-5" />
      <div className="grid grid-cols-1 gap-5 uppercase md:grid-cols-12">
        <div className="col-span-4 flex items-center">
          {station.system && <StationBodySVG system={station.system.name} />}
          <div className="ml-5 flex flex-col">
            <div className="flex items-center text-xl">
              <i
                className={`${stationIconByType(station.type)} text-glow__orange me-1 text-2xl`}
              ></i>
              <span>{station.name}</span>
            </div>
            {station.system && (
              <Link
                className="text-glow hover:text-glow__orange"
                href={`/systems/${station.system.slug}`}
              >
                {station.system.name} system
              </Link>
            )}
            <span className="text-sm text-neutral-300">
              {station.distance_to_arrival} ls from the main star
            </span>
          </div>
        </div>
        <div className="col-span-3">
          <h4 className="text-glow__orange mb-2">Available Services</h4>
          {station.other_services.map((service) => {
            return (
              <>
                <p
                  className={`hover:text-glow__blue mb-1 text-xs hover:cursor-pointer hover:underline`}
                >
                  {service}
                </p>
              </>
            );
          })}
        </div>
        <div className="col-span-5">
          <div className="">
            <h4 className="text-glow__orange mb-2">Service Overview</h4>
            <div className="grid grid-cols-2 gap-10">
              <div>
                <h5 className="text-glow__blue flex items-center gap-2 text-sm">
                  <i className="icarus-terminal-atmosphere text-lg"></i>
                  <span>Universal Cartographics</span>
                </h5>
                U
                <span className="text-xs lowercase">
                  niversal Cartographics is a Mega-Corporation focused on mapping the galaxy.
                  Cynthia Sideris is the current Chair of Universal Cartographics.{" "}
                </span>
              </div>
              <div>
                <h5 className="text-glow__blue flex items-center gap-2 text-sm">
                  <i className="icarus-terminal-materials-xeno text-lg"></i>
                  <span>Vista Genomics</span>
                </h5>
                V
                <span className="text-xs lowercase">
                  ista Genomics is an exobiology company that will buy the genetic information of
                  alien life forms. It offers its services at Concourses.
                </span>
              </div>
              <div>
                <h5 className="text-glow__blue flex items-center gap-2 text-sm">
                  <i className="icarus-terminal-inventory text-lg"></i>
                  <span>Pioneer Supplies</span>
                </h5>
                P
                <span className="text-xs lowercase">
                  ioneer Supplies is a general store chain found at Concourses. They offer a wide
                  variety of purchasable handheld weapons, suits, and consumables for commanders.
                </span>
              </div>
              <div>
                <h5 className="text-glow__blue flex items-center gap-2 text-sm">
                  <i className="icarus-terminal-ship text-lg"></i>
                  <span>Apex Interstellar Transport</span>
                </h5>
                A
                <span className="text-xs lowercase">
                  pex Interstellar Transport is a shuttle service that allows commanders to travel
                  between most starports and settlements without the need to operate their own ship.
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <Heading icon="icarus-terminal-credits" title="Market Information" className="gap-2 py-5" />
        <div className="text-xs text-neutral-300">
          <span>
            Market data for {station.name} <br />
            Last updated on:{" "}
            {marketData ? (
              <span className="text-glow__orange">{formatDate(marketData.last_updated)}</span>
            ) : (
              "A long time ago..."
            )}
          </span>
        </div>
      </div>
      {marketData && (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-12">
          {marketData.commodities &&
            Object.keys(marketData.commodities)
              .slice(0, 12)
              .map((key) => (
                <div
                  key={key}
                  className="col-span-2 rounded-xl border border-neutral-800 bg-transparent p-5 text-sm backdrop-blur backdrop-filter"
                >
                  <h2 className="text-glow__blue text-lg">{key}</h2>
                  <div className="mt-3 grid grid-cols-2 gap-2">
                    <div>
                      <h3 className="text-glow__orange mb-2">Buy Price</h3>
                      <p className="flex items-center gap-2">
                        <i className="icarus-terminal-credits text-glow"></i>
                        {formatNumber(marketData.commodities[key].buyPrice)}
                      </p>
                    </div>
                    <div>
                      <h3 className="text-glow__orange mb-2">Stock</h3>
                      <p className="flex items-center gap-2">
                        <i className="icarus-terminal-inventory text-glow"></i>
                        {formatNumber(marketData.commodities[key].stock)}
                      </p>
                    </div>
                    <div>
                      <h3 className="text-glow__orange mb-2">Sell Price</h3>
                      <p className="flex items-center gap-2">
                        <i className="icarus-terminal-credits text-glow"></i>
                        {formatNumber(marketData.commodities[key].sellPrice)}
                      </p>
                    </div>
                    <div>
                      <h3 className="text-glow__orange mb-2">Demand</h3>
                      <p className="flex items-center gap-2">
                        <i
                          className={`icarus-terminal-chevron-${Math.random() > 0.5 ? "up text-green-300" : "down text-red-300"}`}
                        ></i>
                        {formatNumber(marketData.commodities[key].demand)}
                      </p>
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
