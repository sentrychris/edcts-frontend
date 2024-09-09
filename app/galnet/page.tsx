import type { Metadata, ResolvingMetadata } from "next";
import type { Galnet } from "@/core/interfaces/Galnet";
import { settings } from "@/core/config";
import { getCollection } from "@/core/api";
import Heading from "@/components/heading";
import GalnetList from "./components/galnet-list";

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
  return await getCollection<Galnet>("galnet/news");
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
    title: `Galnet News | ${(await parent).title?.absolute}`,
    openGraph: {
      ...(await parent).openGraph,
      url: `${settings.app.url}/galnet`,
      title: `Galnet News | ${(await parent).title?.absolute}`,
      description: `Latest news from the Galaxy, with Vox Galactica and other independent affiliates.`,
    },
    description: `Latest news from the Galaxy, with Vox Galactica and other independent affiliates.`,
  };
}

/**
 * Create the page.
 *
 * @returns
 */
export default async function Page() {
  const articles = await getPageData();

  return (
    <>
      <div className="mt-4 grid grid-cols-1">
        <Heading
          icon="icarus-terminal-atmosphere"
          largeIcon={true}
          title="Galnet Network"
          className="gap-3 border-b border-neutral-800 pb-3 text-2xl"
        />

        <GalnetList articles={articles} />
      </div>
    </>
  );
}
