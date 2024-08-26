import type { Metadata, ResolvingMetadata } from "next";
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
    title: `Star System Detail | ${(await parent).title?.absolute}`,
    openGraph: {
      ...(await parent).openGraph,
      url: `https://edcts.versyx.net/systems/${params.slug}`,
      title: `Star System Detail | ${(await parent).title?.absolute}`,
      description: `Star system information including stars, orbital bodies, settlements, and more.`,
    },
    description: `Star system information including stars, orbital bodies, settlements, and more.`,
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
      <Heading title="System Information" className="mb-5 gap-2" />
      <SystemDetail params={params} />
    </>
  );
}
