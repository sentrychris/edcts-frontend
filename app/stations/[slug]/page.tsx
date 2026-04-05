import type { Metadata, ResolvingMetadata } from "next";
import { settings } from "@/core/config";
import StationDetail from "../components/station/station-detail";
import StationMarket from "../components/station/station-market";

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
      <div className="relative mb-5 border border-orange-900/40 px-6 py-4">
        <span className="absolute -left-px -top-px h-4 w-4 border-l-2 border-t-2 border-orange-500" />
        <span className="absolute -right-px -top-px h-4 w-4 border-r-2 border-t-2 border-orange-500" />
        <span className="absolute -bottom-px -left-px h-4 w-4 border-b-2 border-l-2 border-orange-500" />
        <span className="absolute -bottom-px -right-px h-4 w-4 border-b-2 border-r-2 border-orange-500" />

        <div className="flex flex-wrap items-center justify-between gap-2 text-xs uppercase tracking-widest text-neutral-600">
          <div className="flex items-center gap-4">
            <span>MODULE:LOGISTICS</span>
            <span className="text-neutral-800">■</span>
            <span>DATABASE:DOCKING</span>
            <span className="text-neutral-800">■</span>
            <span>CLASS:UNRESTRICTED</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-orange-500"></span>
            <span>BEACON: ACTIVE</span>
          </div>
        </div>
      </div>

      <StationDetail params={params} />
      <StationMarket slug={params.slug} />
    </>
  );
}
