import type { Metadata, ResolvingMetadata } from "next";
import type { System } from "@/core/interfaces/System";
import { settings } from "@/core/config";
import { getCollection } from "@/core/api";
import Heading from "@/components/heading";
import SystemsStatisticsBar from "./components/systems-statistics-bar";
import SystemsTable from "./components/systems-table";
import SystemsNavRoutes from "./components/systems-navroutes";
import PopularSystems from "./components/popular-systems";

/**
 * Define the page properties.
 */
interface Props {
  params: {
    slug: string;
  };
  searchParams: { [key: string]: string | string[] | undefined };
}

/**
 * Get the page data.
 *
 * Note: Next automatically dedupes fetch calls on the server.
 *
 * @returns systems data
 */
const getPageData = async () => {
  const systems = await getCollection<System>("systems", {
    params: {
      withInformation: 1,
    },
  });

  return systems;
};

/**
 * Generate the page metadata.
 *
 * @param params
 * @param parent
 * @returns
 */
export async function generateMetadata(
  { params }: Props,
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

/**
 * Create the page.
 *
 * @returns
 */
export default async function Page() {
  const systems = await getPageData();

  return (
    <>
      <Heading icon="icarus-terminal-info" title="System Statistics" className="mt-4 gap-2" />
      <small className="mb-8 text-xs text-stone-300">
        Updated every <span className="text-glow__blue">60 minutes</span>. (Source:{" "}
        <a className="text-glow__orange" href="https://status.versyx.net/">
          API
        </a>
        ).
      </small>
      <SystemsStatisticsBar className="fx-fade-in" callInterval={10000} flushCache={0} />
      <div className="mt-4 grid grid-cols-1 md:gap-10 md:grid-cols-12">
        <div className="order-last col-span-1 md:order-first md:col-span-4">
          <Heading
            icon="icarus-terminal-scan text-glow__orange"
            largeIcon={true}
            title="Popular Systems"
            className="md:mt-4 md:gap-3 text-2xl"
          />
          <PopularSystems className="my-5 p-1" />
          <Heading
            icon="icarus-terminal-info text-glow__orange"
            largeIcon={true}
            title="Navigation Routes"
            className="mt-10 gap-3 text-2xl"
          />
          <small className="text-xs text-stone-300">
            Updated every <span className="text-glow__blue">30 seconds</span>. (Source:{" "}
            <a className="text-glow__orange" href="https://eddn.edcd.io/">
              EDDN
            </a>
            ).
          </small>
          <SystemsNavRoutes callInterval={30000} />
        </div>
        <div className="order-first col-span-1 md:order-last md:col-span-8">
          <Heading
            icon="icarus-terminal-system-orbits text-glow__orange"
            largeIcon={true}
            title="Systems Information"
            className="mt-4 gap-3 text-2xl"
          />
          <SystemsTable className="mt-5" systems={systems} />
        </div>
      </div>
    </>
  );
}
