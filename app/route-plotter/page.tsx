import type { Metadata, ResolvingMetadata } from "next";
import { settings } from "@/core/config";
import Panel from "@/components/panel";
import RoutePlotterView from "./components/route-plotter-view";

interface Props {
  searchParams: { from?: string; to?: string; ly?: string };
}

export async function generateMetadata(
  _props: Props,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  return {
    title: `Route Plotter | ${(await parent).title?.absolute}`,
    openGraph: {
      ...(await parent).openGraph,
      url: `${settings.app.url}/route-plotter`,
      title: `Route Plotter | ${(await parent).title?.absolute}`,
      description: "Plan jump routes between star systems in Elite: Dangerous.",
    },
    description: "Plan jump routes between star systems in Elite: Dangerous.",
  };
}

export default function Page({ searchParams }: Props) {
  const initialLy = searchParams.ly ? parseInt(searchParams.ly, 10) : 30;

  return (
    <>
      {/* ── Navigation header bar ── */}
      <Panel className="mb-5 px-4 py-3 md:px-6 md:py-4">
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs uppercase tracking-widest text-neutral-600">
          <div className="flex items-center gap-3">
            <span>MODULE:NAVIGATION</span>
            <span className="hidden text-neutral-800 sm:inline">■</span>
            <span className="hidden sm:inline">PROTOCOL:ROUTE-PLANNER</span>
            <span className="hidden text-neutral-800 md:inline">■</span>
            <span className="hidden md:inline">CLASS:UNRESTRICTED</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="fx-dot-orange h-1.5 w-1.5"></span>
            <span>NAVIGATION: ACTIVE</span>
          </div>
        </div>
      </Panel>

      <RoutePlotterView
        initialFrom={searchParams.from ?? ""}
        initialTo={searchParams.to ?? ""}
        initialLy={Number.isNaN(initialLy) ? 30 : initialLy}
      />
    </>
  );
}
