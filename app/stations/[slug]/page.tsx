import type { Metadata, ResolvingMetadata } from "next";
import { settings } from "@/core/config";
import Heading from "@/components/heading";
import StationDetail from "../components/station/station-detail";

/**
 * Define the page properties.
 */
interface Props {
  params: {
    slug: string;
  };
}

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

/**
 * Create the page.
 *
 * @returns
 */
export default async function Page({ params }: { params: { slug: string } }) {
  return (
    <>
      <Heading title="Station Information" className="mb-5 gap-2" />
      <StationDetail params={params} />
    </>
  );
}
