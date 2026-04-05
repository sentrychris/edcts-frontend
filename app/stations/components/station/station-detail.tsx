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

interface PanelProps {
  icon: string;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}

const Panel = ({ icon, title, subtitle, children }: PanelProps) => (
  <div className="relative border border-orange-900/40 bg-black/50 backdrop-blur backdrop-filter">
    <span className="pointer-events-none absolute -left-px -top-px h-4 w-4 border-l-2 border-t-2 border-orange-500" />
    <span className="pointer-events-none absolute -right-px -top-px h-4 w-4 border-r-2 border-t-2 border-orange-500" />
    <span className="pointer-events-none absolute -bottom-px -left-px h-4 w-4 border-b-2 border-l-2 border-orange-500" />
    <span className="pointer-events-none absolute -bottom-px -right-px h-4 w-4 border-b-2 border-r-2 border-orange-500" />
    <div className="flex items-center gap-3 border-b border-orange-900/20 px-5 py-4">
      <i className={`${icon} text-glow__orange`} style={{ fontSize: "1.25rem" }}></i>
      <div>
        <h3 className="text-glow__orange font-bold uppercase tracking-wide">{title}</h3>
        {subtitle && <p className="text-xs uppercase tracking-wider text-neutral-500">{subtitle}</p>}
      </div>
    </div>
    <div className="px-5 py-4">{children}</div>
  </div>
);

const StatRow = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div className="flex items-center justify-between border-b border-neutral-900 py-1.5 text-xs uppercase tracking-wider">
    <span className="text-neutral-600">{label}</span>
    <span className="text-right text-neutral-300">{children}</span>
  </div>
);

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
        <div className="space-y-5 text-xs uppercase tracking-wider">
          {/* ── Station Masthead ── */}
          <div className="relative border border-orange-900/40 bg-black/50 backdrop-blur backdrop-filter px-6 py-6">
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

          {/* ── Station Details + Controlling Faction ── */}
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <Panel
              icon={stationIconByType(station.type)}
              title="Station Details"
              subtitle="Docking & Navigation"
            >
              <StatRow label="Type">
                <span className="text-glow__blue">{station.type || "—"}</span>
              </StatRow>
              {station.body && (
                <StatRow label="Orbiting">{station.body.name}</StatRow>
              )}
              {station.distance_to_arrival > 0 && (
                <StatRow label="Dist. to Arrival">
                  {formatNumber(station.distance_to_arrival)} LS
                </StatRow>
              )}
            </Panel>

            <Panel
              icon="icarus-terminal-system-authority-solid"
              title="Controlling Faction"
              subtitle="Political Authority"
            >
              <StatRow label="Faction">
                <span className="text-glow__white font-bold">
                  {station.controlling_faction || "Unknown"}
                </span>
              </StatRow>
              <StatRow label="Allegiance">
                {renderAllegianceText(station.allegiance)}
              </StatRow>
              <StatRow label="Government">
                {station.government || "Unknown"}
              </StatRow>
            </Panel>
          </div>

          {/* ── Economy ── */}
          <Panel icon="icarus-terminal-economy" title="Economy" subtitle="Trade & Commerce">
            <div className="grid grid-cols-1 gap-x-8 md:grid-cols-2">
              <StatRow label="Primary Economy">
                {station.economy || "None"}
              </StatRow>
              {station.second_economy && (
                <StatRow label="Secondary Economy">
                  {station.second_economy}
                </StatRow>
              )}
            </div>
          </Panel>

          {/* ── Services ── */}
          <Panel icon="icarus-terminal-outpost" title="Services" subtitle="Available Facilities">
            <div className="space-y-5">
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
          </Panel>
        </div>
      )}
    </>
  );
};

export default StationDetail;
