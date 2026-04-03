import type { Metadata, ResolvingMetadata } from "next";
import type { System } from "@/core/interfaces/System";
import { settings } from "@/core/config";
import { getCollection } from "@/core/api";
import Heading from "@/components/heading";
import SystemsStatisticsBar from "./components/systems-statistics-bar";
import SystemsTable from "./components/systems-table";

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
      <div className="grid grid-cols-1 gap-10 md:grid-cols-12">
        <div className="order-first col-span-1 md:order-last md:col-span-12">
          <Heading
            icon="icarus-terminal-system-orbits text-glow__orange"
            largeIcon={true}
            title="Systems Information"
            className="gap-3 text-2xl"
          />
          <SystemsTable className="py-5" systems={systems} />
        </div>
      </div>
    </>
  );
}
