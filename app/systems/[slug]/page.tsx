import type { Metadata, ResolvingMetadata } from "next";
import type { System } from "@/core/interfaces/System";
import { getResource } from "@/core/api";
import Heading from "@/components/heading";
import SystemDetail from "../components/system/system-detail";

/**
 * Define the page properties.
 */
interface Props {
  params: {
    slug: string;
  };
}

/**
 * Get the page data.
 *
 * Note: Next automatically dedupes fetch calls on the server.
 *
 * @param params
 * @returns systems data
 */
const getPageData = async ({ params }: Props) => {
  const { data: system } = await getResource<System>(`systems/${params.slug}`, {
    withInformation: 1,
    withBodies: 1,
    withStations: 1,
  });

  return system;
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
  const system = await getPageData({ params }); // Note: next automatically dedupes fetch on server side
  return {
    title: `${system.name} - System Information | ${(await parent).title?.absolute}`,
    description: `System Information for ${system.name} including stars, orbital bodies, settlments, and more.`,
  };
}

/**
 * Create the page.
 *
 * @returns
 */
export default async function Page({ params }: Props) {
  const { data: system } = await getResource<System>(`systems/${params.slug}`, {
    withInformation: 1,
    withBodies: 1,
    withStations: 1,
  });

  return (
    <>
      <Heading title="System Information" className="mb-5 gap-2" />
      <SystemDetail system={system} />
    </>
  );
}
