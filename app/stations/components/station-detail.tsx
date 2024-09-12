"use client";

import { type FunctionComponent, useEffect, useState } from "react";
import type { Station } from "@/core/interfaces/Station";
import { getResource } from "@/core/api";
import { stationState } from "../lib/state";
import { stationIconByType } from "../lib/render-utils";
import Link from "next/link";
import Loader from "@/components/loader";
import Heading from "@/components/heading";
import StationHeader from "./station-header";
import StationInformationBar from "./station-information-bar";
import StationBodySVG from "./station-body.svg";
import MarketCommodities from "./market/market-commodities";
import StationServiceCard from "./station-service-card";
import StationSVG from "./station-svg";

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
        .then(async (response) => {
          const { data: station } = response;
          setStation(station);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [slug]);

  return (
    <>
      {isLoading && <Loader visible={isLoading} />}

      <StationHeader station={station} />
      <StationInformationBar information={station} />

      <Heading icon="icarus-terminal-info" title="Station Overview" className="gap-2 py-5" />
      <div className="grid grid-cols-1 gap-5 uppercase md:grid-cols-12">
        <div className="col-span-4 flex items-center">
          <div className="flex items-center">
            {station.system && (
              <>
                <StationBodySVG system={station.system} />
                {/* <StationSVG type={station.type} /> */}
              </>
            )}
          </div>
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
          <div className="pb-5 md:pb-0">
            <h4 className="text-glow__orange mb-2">Service Overview</h4>
            <div className="grid grid-cols-2 gap-10">
              <StationServiceCard icon="atmosphere" title="Universal Cartographics">
                Universal Cartographics is a Mega-Corporation focused on mapping the galaxy. Cynthia
                Sideris is the current Chair of Universal Cartographics.
              </StationServiceCard>
              <StationServiceCard icon="materials-xeno" title="Vista Genomics">
                Vista Genomics is an exobiology company that will buy the genetic information of
                alien life forms. It offers its services at Concourses.
              </StationServiceCard>
              <StationServiceCard icon="inventory" title="Pioneer Supplies">
                Pioneer Supplies is a general store chain found at Concourses. They offer a wide
                variety of purchasable handheld weapons, suits, and consumables for commanders.
              </StationServiceCard>
              <StationServiceCard icon="ship" title="Apex Interstellar Transport">
                Apex Interstellar Transport is a shuttle service that allows commanders to travel
                between most starports and settlements without the need to operate their own ship.
              </StationServiceCard>
            </div>
          </div>
        </div>
      </div>
      {!isLoading && station && <MarketCommodities station={station} />}
    </>
  );
};

export default StationDetail;
