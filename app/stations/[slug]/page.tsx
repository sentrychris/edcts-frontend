import { cache } from "react";
import type { Metadata, ResolvingMetadata } from "next";
import type { Station } from "@/core/interfaces/Station";
import { settings } from "@/core/config";
import { getResource } from "@/core/api";
import StationDetail from "../components/station/station-detail";
import StationMarket from "../components/station/station-market";
import Panel from "@/components/panel";

interface Props {
  params: {
    slug: string;
  };
}

/**
 * Fetch the station data once per request, shared between generateMetadata and Page.
 */
const getStation = cache((slug: string) =>
  getResource<Station>(`stations/${slug}`, {
    params: { withSystem: 1 },
  }).catch(() => null),
);

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const station = await getStation(params.slug);
  const stationName = station?.data?.name ?? "Station Detail";

  return {
    title: `${stationName} | ${(await parent).title?.absolute}`,
    openGraph: {
      ...(await parent).openGraph,
      url: `${settings.app.url}/stations/${params.slug}`,
      title: `${stationName} | ${(await parent).title?.absolute}`,
      description: `Station information including market, services, and commodities.`,
    },
    description: `Station information including market, services, and commodities.`,
  };
}

export default async function Page({ params }: { params: { slug: string } }) {
  const station = await getStation(params.slug);

  return (
    <>
      {/* ── Logistics Terminal ── */}
      <Panel className="mb-5 px-6 py-4">

        <div className="flex flex-wrap items-center justify-between gap-2 text-xs uppercase tracking-widest text-neutral-600">
          <div className="flex items-center gap-4">
            <span>MODULE:LOGISTICS</span>
            <span className="text-neutral-800">■</span>
            <span>DATABASE:DOCKING</span>
            <span className="text-neutral-800">■</span>
            <span>CLASS:UNRESTRICTED</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="fx-dot-orange h-1.5 w-1.5"></span>
            <span>BEACON: ACTIVE</span>
          </div>
        </div>
      </Panel>

      <StationDetail params={params} initialData={station?.data ?? null} />
      <StationMarket slug={params.slug} />
    </>
  );
}
