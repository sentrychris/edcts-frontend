import type { Metadata, ResolvingMetadata } from "next";
import type { System } from "@/core/interfaces/System";
import { settings } from "@/core/config";
import { getCollection } from "@/core/api";
import SystemsStatisticsBar from "./components/systems-statistics-bar";
import SystemsTable from "./components/systems-table";
import Panel from "@/components/panel";

interface Props {
  params: {
    slug: string;
  };
  searchParams: { [key: string]: string | string[] | undefined };
}

const getPageData = async () => {
  return await getCollection<System>("systems", {
    params: {
      withInformation: 1,
    },
  });
};

export async function generateMetadata(
  _props: Props,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  return {
    title: `Star Systems Overview | ${(await parent).title?.absolute}`,
    openGraph: {
      ...(await parent).openGraph,
      url: `${settings.app.url}/systems`,
      title: `Star Systems Overview | ${(await parent).title?.absolute}`,
      description: `Star systems information, find star systems, latest navigation routes and more.`,
    },
    description: `Star systems information, find star systems, latest navigation routes and more.`,
  };
}

export default async function Page() {
  const systems = await getPageData();

  return (
    <>
      {/* ── Cartographic Terminal ── */}
      <Panel className="mb-5 px-6 py-4">

        <div className="flex flex-wrap items-center justify-between gap-2 text-xs uppercase tracking-widest text-neutral-600">
          <div className="flex items-center gap-4">
            <span>MODULE:CARTOGRAPHIC</span>
            <span className="text-neutral-800">■</span>
            <span>DATABASE:STELLAR</span>
            <span className="text-neutral-800">■</span>
            <span>CLASS:UNRESTRICTED</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="fx-dot-orange h-1.5 w-1.5"></span>
            <span className="fx-cursor">TELEMETRY: ACTIVE</span>
          </div>
        </div>
      </Panel>

      <SystemsStatisticsBar className="fx-fade-in" callInterval={10000} flushCache={0} />
      <SystemsTable systems={systems} />
    </>
  );
}
