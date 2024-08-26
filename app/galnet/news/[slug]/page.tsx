import type { Metadata, ResolvingMetadata } from "next";
import type { Galnet } from "@/core/interfaces/Galnet";
import { getCollection, getResource } from "@/core/api";
import Heading from "@/components/heading";
import GalnetArticle from "../../components/galnet-article";
import GalnetList from "@/components/galnet-list";

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
 * @returns systems data
 */
const getPageData = async ({ params }: Props) => {
  const articles = await getCollection<Galnet>("galnet/news", {
    limit: 100,
  });

  const { data: article } = await getResource<Galnet>(`galnet/news/${params.slug}`);

  return {
    articles,
    article,
  };
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
  const galnet = await getPageData({ params });

  return {
    title: `${galnet.article.title} - ${galnet.article.uploaded_at} | ${(await parent).title?.absolute}`,
    description: `${galnet.article.content}`,
  };
}

/**
 * Create the page.
 *
 * @returns
 */
export default async function Page({ params }: { params: { slug: string } }) {
  const galnet = await getPageData({ params });

  return (
    <>
      <div className="mt-4 grid grid-cols-1 bg-transparent backdrop-blur backdrop-filter">
        <Heading
          icon="icarus-terminal-atmosphere"
          largeIcon={true}
          title="Galnet Network"
          className="gap-3 border-b border-neutral-800 pb-3 text-2xl"
        />

        <div className="grid grid-cols-12">
          <div className="order-last col-span-12 border-neutral-900 md:order-first md:col-span-3 md:border-r md:pe-10">
            <div className="pt-10">
              <h1 className="text-glow flex items-center gap-x-2 text-xl uppercase">
                <i className="icarus-terminal-notifications text-glow__orange text-2xl"></i>
                Latest News
              </h1>
              <GalnetList articles={galnet.articles} />
            </div>
          </div>
          <div className="order-first col-span-12 md:order-last md:col-span-9 md:ps-10">
            <GalnetArticle article={galnet.article} />
          </div>
        </div>
      </div>
    </>
  );
}
