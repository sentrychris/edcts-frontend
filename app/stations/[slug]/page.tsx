import type { Metadata, ResolvingMetadata } from "next";
import { settings } from "@/core/config";
import StationDetail from "../components/station/station-detail";
import StationMarket from "../components/station/station-market";
import Panel from "@/components/panel";

interface Props {
  params: {
    slug: string;
  };
}

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  return {
    title: `Station Detail | ${(await parent).title?.absolute}`,
    openGraph: {
      ...(await parent).openGraph,
      url: `${settings.app.url}/stations/${params.slug}`,
      title: `Station Detail | ${(await parent).title?.absolute}`,
      description: `Station information including market, services, and commodities.`,
    },
    description: `Station information including market, services, and commodities.`,
  };
}

export default async function Page({ params }: { params: { slug: string } }) {
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

      <StationDetail params={params} />
      <StationMarket slug={params.slug} />
    </>
  );
}
