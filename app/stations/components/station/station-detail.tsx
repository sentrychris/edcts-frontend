"use client";

import type { FunctionComponent } from "react";
import type { Station } from "@/core/interfaces/Station";
import { useEffect, useState } from "react";
import { getResource } from "@/core/api";
import Loader from "@/components/loader";
import Link from "next/link";
import { CheckIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { stationIconByType, renderAllegianceText } from "@/app/systems/lib/render-utils";
import { formatDate, formatNumber } from "@/core/string-utils";

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

const coreServices = [
  { label: "Market", key: "has_market" as const },
  { label: "Shipyard", key: "has_shipyard" as const },
  { label: "Outfitting", key: "has_outfitting" as const },
];

const StationDetail: FunctionComponent<Props> = ({ params }) => {
  const [station, setStation] = useState<Station>(stationState);
  const [isLoading, setLoading] = useState<boolean>(true);
  const { slug } = params;

  useEffect(() => {
    if (slug) {
      getResource<Station>(`stations/${slug}`, {
        params: { withSystem: 1 },
      })
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
        <div className="fx-animated-text text-xs uppercase tracking-wider">
          {/* Header */}
          <div className="flex items-center gap-3 border-b border-neutral-800 pb-5">
            <i
              className={`${stationIconByType(station.type)} text-glow`}
              style={{ fontSize: "3rem" }}
            ></i>
            <div>
              <h2 className="text-glow__white text-3xl">{station.name}</h2>
              {station.system && (
                <Link
                  href={`/systems/${station.system.slug}`}
                  className="text-glow__orange font-bold text-xl hover:underline"
                >
                  {station.system.name}
                </Link>
              )}
            </div>
          </div>

          {/* Station Details + Faction */}
          <div className="grid grid-cols-1 gap-5 border-b border-neutral-800 py-5 md:grid-cols-2">
            <div>
              <p className="mb-4 flex items-center gap-x-2 text-sm">
                <i className={`${stationIconByType(station.type)} text-glow__orange`}></i>
                <span>Station Details</span>
              </p>
              <div className="space-y-1.5">
                <p>
                  Type: <span className="ms-1 text-glow__blue">{station.type}</span>
                </p>
                {station.body && (
                  <p>
                    Orbiting: <span className="ms-1">{station.body.name}</span>
                  </p>
                )}
                {station.distance_to_arrival > 0 && (
                  <p>
                    Distance to Arrival:{" "}
                    <span className="ms-1">{formatNumber(station.distance_to_arrival)} LS</span>
                  </p>
                )}
              </div>
            </div>

            <div>
              <p className="mb-4 flex items-center gap-x-2 text-sm">
                <i className="icarus-terminal-system-authority-solid text-glow__orange"></i>
                <span>Controlling Faction</span>
              </p>
              <div className="space-y-1.5">
                <p>
                  Faction:{" "}
                  <span className="ms-1 text-glow__white font-bold">
                    {station.controlling_faction || "Unknown"}
                  </span>
                </p>
                <p>
                  Allegiance: <span className="ms-1">{renderAllegianceText(station.allegiance)}</span>
                </p>
                <p>
                  Government: <span className="ms-1">{station.government || "Unknown"}</span>
                </p>
              </div>
            </div>
          </div>

          {/* Economy */}
          <div className="border-b border-neutral-800 py-5">
            <p className="mb-4 flex items-center gap-x-2 text-sm">
              <i className="icarus-terminal-economy text-glow__orange"></i>
              <span>Economy</span>
            </p>
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <p>
                Primary: <span className="ms-1">{station.economy || "None"}</span>
              </p>
              {station.second_economy && (
                <p>
                  Secondary: <span className="ms-1">{station.second_economy}</span>
                </p>
              )}
            </div>
          </div>

          {/* Services */}
          <div className="border-b border-neutral-800 py-5">
            <p className="mb-4 flex items-center gap-x-2 text-sm">
              <i className="icarus-terminal-outpost text-glow__orange"></i>
              <span>Services</span>
            </p>
            <div className="space-y-4">
              <div>
                <p className="mb-2 text-neutral-400">Core Services</p>
                <div className="flex flex-wrap gap-x-6 gap-y-2">
                  {coreServices.map(({ label, key }) => (
                    <div key={label} className="flex items-center gap-x-1.5">
                      {station[key] ? (
                        <CheckIcon className="text-glow text-green-300 w-3" />
                      ) : (
                        <XMarkIcon className="w-3 text-red-400" />
                      )}
                      <span className={station[key] ? "" : "text-neutral-500"}>{label}</span>
                    </div>
                  ))}
                </div>
              </div>
              {station.other_services.length > 0 && (
                <div>
                  <p className="mb-2 text-neutral-400">Other Services</p>
                  <div className="flex flex-wrap gap-x-6 gap-y-2">
                    {station.other_services.map((service) => (
                      <div key={service} className="flex items-center gap-x-1.5">
                        <CheckIcon className="text-glow text-green-300 w-3" />
                        <span>{service}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Last Updated */}
          <div className="pt-5">
            <p className="mb-4 flex items-center gap-x-2 text-sm">
              <i className="icarus-terminal-sync text-glow__orange"></i>
              <span>Last EDDN Update</span>
            </p>
            <div className="grid grid-cols-2 gap-y-3 md:grid-cols-4">
              {[
                { label: "Information", value: station.last_updated.information },
                { label: "Market", value: station.last_updated.market },
                { label: "Shipyard", value: station.last_updated.shipyard },
                { label: "Outfitting", value: station.last_updated.outfitting },
              ].map(({ label, value }) => (
                <div key={label}>
                  <p className="mb-1 text-neutral-400">{label}</p>
                  <p>{formatDate(value ?? undefined)}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default StationDetail;
