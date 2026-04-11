import type { Metadata, ResolvingMetadata } from "next";
import { settings } from "@/core/config";
import Panel from "@/components/panel";
import DistanceSearchView from "./components/distance-search-view";

interface Props {
  searchParams: { slug?: string; ly?: string };
}

export async function generateMetadata(
  _props: Props,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  return {
    title: `Distance Search | ${(await parent).title?.absolute}`,
    openGraph: {
      ...(await parent).openGraph,
      url: `${settings.app.url}/distance-search`,
      title: `Distance Search | ${(await parent).title?.absolute}`,
      description: "Find star systems within a given distance of any system in Elite: Dangerous.",
    },
    description: "Find star systems within a given distance of any system in Elite: Dangerous.",
  };
}

export default function Page({ searchParams }: Props) {
  const initialLy = searchParams.ly ? parseInt(searchParams.ly, 10) : 50;

  return (
    <>
      {/* ── Navigation header bar ── */}
      <Panel className="mb-5 px-4 py-3 md:px-6 md:py-4">
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs uppercase tracking-widest text-neutral-600">
          <div className="flex items-center gap-3">
            <span>MODULE:SCANNER</span>
            <span className="hidden text-neutral-800 sm:inline">■</span>
            <span className="hidden sm:inline">PROTOCOL:PROXIMITY-SCAN</span>
            <span className="hidden text-neutral-800 md:inline">■</span>
            <span className="hidden md:inline">CLASS:UNRESTRICTED</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="fx-dot-orange h-1.5 w-1.5"></span>
            <span>SCANNER: ACTIVE</span>
          </div>
        </div>
      </Panel>

      <DistanceSearchView
        initialSlug={searchParams.slug ?? ""}
        initialLy={Number.isNaN(initialLy) ? 50 : initialLy}
      />
    </>
  );
}
