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
        <div className="text-xs uppercase tracking-wider">
          {/* ── Station Masthead ── */}
          <div className="relative mb-5 border border-orange-900/40 bg-black/50 backdrop-blur backdrop-filter px-6 py-6">
            <span className="absolute -left-px -top-px h-5 w-5 border-l-2 border-t-2 border-orange-500" />
            <span className="absolute -right-px -top-px h-5 w-5 border-r-2 border-t-2 border-orange-500" />
            <span className="absolute -bottom-px -left-px h-5 w-5 border-b-2 border-l-2 border-orange-500" />
            <span className="absolute -bottom-px -right-px h-5 w-5 border-b-2 border-r-2 border-orange-500" />

            <div className="flex items-center gap-4">
              <i
                className={`${stationIconByType(station.type)} text-glow__orange`}
                style={{ fontSize: "2.5rem" }}
              ></i>
              <div>
                <p className="mb-1 text-xs uppercase tracking-[0.4em] text-neutral-500">docking facility</p>
                <h2 className="text-glow__white text-2xl font-bold tracking-wide md:text-3xl">
                  {station.name}
                </h2>
                {station.system && (
                  <Link
                    href={`/systems/${station.system.slug}`}
                    className="text-glow__orange text-xs font-bold tracking-widest hover:text-orange-300 hover:underline"
                  >
                    {station.system.name} system
                  </Link>
                )}
              </div>
            </div>

            <div className="mt-4 flex items-center gap-4 border-t border-orange-900/20 pt-3 text-xs uppercase tracking-widest text-neutral-700">
              <span className="h-px flex-1 bg-neutral-800"></span>
              <span className="flex items-center gap-2">
                <i className="icarus-terminal-route"></i>
                STATION INTELLIGENCE REPORT
              </span>
              <span className="h-px flex-1 bg-neutral-800"></span>
            </div>
          </div>

          {/* ── Station Details + Faction ── */}
          <div className="grid grid-cols-1 gap-5 border-b border-orange-900/20 py-5 md:grid-cols-2">
            <div>
              <div className="mb-4 flex items-center gap-3">
                <i className={`${stationIconByType(station.type)} text-glow__orange`}></i>
                <h3 className="text-glow__orange font-bold uppercase tracking-widest">Station Details</h3>
              </div>
              <div className="space-y-2 text-neutral-400">
                <p>
                  <span className="text-neutral-600">Type</span>
                  <span className="ms-3 text-glow__blue">{station.type}</span>
                </p>
                {station.body && (
                  <p>
                    <span className="text-neutral-600">Orbiting</span>
                    <span className="ms-3 text-neutral-200">{station.body.name}</span>
                  </p>
                )}
                {station.distance_to_arrival > 0 && (
                  <p>
                    <span className="text-neutral-600">Dist. to Arrival</span>
                    <span className="ms-3 text-neutral-200">{formatNumber(station.distance_to_arrival)} LS</span>
                  </p>
                )}
              </div>
            </div>

            <div>
              <div className="mb-4 flex items-center gap-3">
                <i className="icarus-terminal-system-authority-solid text-glow__orange"></i>
                <h3 className="text-glow__orange font-bold uppercase tracking-widest">Controlling Faction</h3>
              </div>
              <div className="space-y-2 text-neutral-400">
                <p>
                  <span className="text-neutral-600">Faction</span>
                  <span className="ms-3 text-glow__white font-bold">
                    {station.controlling_faction || "Unknown"}
                  </span>
                </p>
                <p>
                  <span className="text-neutral-600">Allegiance</span>
                  <span className="ms-3">{renderAllegianceText(station.allegiance)}</span>
                </p>
                <p>
                  <span className="text-neutral-600">Government</span>
                  <span className="ms-3 text-neutral-200">{station.government || "Unknown"}</span>
                </p>
              </div>
            </div>
          </div>

          {/* ── Economy ── */}
          <div className="border-b border-orange-900/20 py-5">
            <div className="mb-4 flex items-center gap-3">
              <i className="icarus-terminal-economy text-glow__orange"></i>
              <h3 className="text-glow__orange font-bold uppercase tracking-widest">Economy</h3>
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <p>
                <span className="text-neutral-600">Primary</span>
                <span className="ms-3 text-neutral-200">{station.economy || "None"}</span>
              </p>
              {station.second_economy && (
                <p>
                  <span className="text-neutral-600">Secondary</span>
                  <span className="ms-3 text-neutral-200">{station.second_economy}</span>
                </p>
              )}
            </div>
          </div>

          {/* ── Services ── */}
          <div className="border-b border-orange-900/20 py-5">
            <div className="mb-4 flex items-center gap-3">
              <i className="icarus-terminal-outpost text-glow__orange"></i>
              <h3 className="text-glow__orange font-bold uppercase tracking-widest">Services</h3>
            </div>
            <div className="space-y-4">
              <div>
                <p className="mb-3 text-xs uppercase tracking-widest text-neutral-600">Core Services</p>
                <div className="flex flex-wrap gap-x-6 gap-y-2">
                  {coreServices.map(({ label, key }) => (
                    <div key={label} className="flex items-center gap-x-2">
                      {station[key] ? (
                        <CheckIcon className="w-3 text-green-300" />
                      ) : (
                        <XMarkIcon className="w-3 text-red-400" />
                      )}
                      <span className={station[key] ? "text-neutral-200" : "text-neutral-600"}>
                        {label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              {station.other_services.length > 0 && (
                <div>
                  <p className="mb-3 text-xs uppercase tracking-widest text-neutral-600">Other Services</p>
                  <div className="flex flex-wrap gap-x-6 gap-y-2">
                    {station.other_services.map((service) => (
                      <div key={service} className="flex items-center gap-x-2">
                        <CheckIcon className="w-3 text-green-300" />
                        <span className="text-neutral-200">{service}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* ── Last Updated ── */}
          <div className="py-5">
            <div className="mb-4 flex items-center gap-3">
              <i className="icarus-terminal-sync text-glow__orange"></i>
              <h3 className="text-glow__orange font-bold uppercase tracking-widest">Last EDDN Update</h3>
            </div>
            <div className="grid grid-cols-2 gap-y-4 md:grid-cols-4">
              {[
                { label: "Information", value: station.last_updated.information },
                { label: "Market", value: station.last_updated.market },
                { label: "Shipyard", value: station.last_updated.shipyard },
                { label: "Outfitting", value: station.last_updated.outfitting },
              ].map(({ label, value }) => (
                <div key={label}>
                  <p className="mb-1 text-xs tracking-widest text-neutral-600">{label}</p>
                  <p className="text-neutral-200">{formatDate(value ?? undefined)}</p>
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
