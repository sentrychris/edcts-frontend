"use client";

import type { FunctionComponent } from "react";
import type { Station } from "@/core/interfaces/Station";
import { useResource } from "@/core/hooks/resource";
import Loader from "@/components/loader";
import Link from "next/link";
import { CheckIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { stationIconByType, renderAllegianceText } from "@/core/render-utils";
import { formatDate, formatNumber } from "@/core/string-utils";
import Panel from "@/components/panel";
import Heading from "@/components/heading";

interface Props {
  params: { slug: string };
  initialData?: Station | null;
}

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

const StationPanel = ({ icon, title, subtitle, children }: PanelProps) => (
  <Panel>
    <Heading bordered icon={icon} title={title} subtitle={subtitle} className="px-5 py-4" />
    <div className="px-5 py-4">{children}</div>
  </Panel>
);

const StatRow = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div className="flex items-center justify-between border-b border-neutral-900 py-1.5 text-xs uppercase tracking-wider">
    <span className="text-neutral-600">{label}</span>
    <span className="text-right text-neutral-300">{children}</span>
  </div>
);

const StationDetail: FunctionComponent<Props> = ({ params, initialData = null }) => {
  const { slug } = params;
  const { data: fetchedData, isLoading } = useResource<Station>(
    initialData ? null : `stations/${slug}`,
    { withSystem: 1 },
  );
  const station = initialData ?? fetchedData;
  const loading = initialData ? false : isLoading;

  return (
    <>
      {loading && <Loader visible={loading} />}

      {!loading && station && (
        <div className="space-y-5 text-xs uppercase tracking-wider">
          {/* ── Station Masthead ── */}
          <Panel className="px-6 py-6" corners="lg">

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
          </Panel>

          {/* ── Station Details + Controlling Faction ── */}
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <StationPanel
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
            </StationPanel>

            <StationPanel
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
            </StationPanel>
          </div>

          {/* ── Economy ── */}
          <StationPanel icon="icarus-terminal-economy" title="Economy" subtitle="Trade & Commerce">
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
          </StationPanel>

          {/* ── Services ── */}
          <StationPanel icon="icarus-terminal-outpost" title="Services" subtitle="Available Facilities">
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
          </StationPanel>
        </div>
      )}
    </>
  );
};

export default StationDetail;
