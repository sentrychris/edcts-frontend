import type { Metadata, ResolvingMetadata } from "next";
import type { Galnet } from "@/core/interfaces/Galnet";
import { settings } from "@/core/config";
import { getCollection, getResource } from "@/core/api";
import dynamic from "next/dynamic";
import GalnetSidebar from "../../components/galnet-sidebar";

const GalnetArticle = dynamic(() => import("../../components/galnet-article"), {
  ssr: false,
});

interface Props {
  params: {
    slug: string;
  };
}

const getPageData = async ({ params }: Props) => {
  const articles = await getCollection<Galnet>("galnet/news", {
    params: {
      limit: 100,
    },
  });

  const { data: article } = await getResource<Galnet>(`galnet/news/${params.slug}`);

  return {
    articles,
    article,
  };
};

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const galnet = await getPageData({ params });

  return {
    title: `${galnet.article.title} - ${galnet.article.uploaded_at} | GalNet News`,
    openGraph: {
      ...(await parent).openGraph,
      images: [
        {
          url: `${settings.app.url + galnet.article.banner_image}`,
        },
      ],
      url: `${settings.app.url}/galnet/news/${params.slug}`,
      title: `${galnet.article.title} - ${galnet.article.uploaded_at} | Galnet News`,
      description: `${galnet.article.uploaded_at} - ${galnet.article.title}`,
    },
    description: `${galnet.article.uploaded_at} - ${galnet.article.title}`,
  };
}

export default async function Page({ params }: { params: { slug: string } }) {
  const galnet = await getPageData({ params });

  return (
    <>
      {/* ── Galnet Terminal ── */}
      <div className="relative mb-5 border border-orange-900/40 backdrop-blur backdrop-filter px-6 py-4">
        <span className="absolute -left-px -top-px h-4 w-4 border-l-2 border-t-2 border-orange-500" />
        <span className="absolute -right-px -top-px h-4 w-4 border-r-2 border-t-2 border-orange-500" />
        <span className="absolute -bottom-px -left-px h-4 w-4 border-b-2 border-l-2 border-orange-500" />
        <span className="absolute -bottom-px -right-px h-4 w-4 border-b-2 border-r-2 border-orange-500" />

        <div className="flex flex-wrap items-center justify-between gap-2 text-xs uppercase tracking-widest text-neutral-600">
          <div className="flex items-center gap-4">
            <span>MODULE:GALNET</span>
            <span className="text-neutral-800">■</span>
            <span>CHANNEL:VOX GALACTICA</span>
            <span className="text-neutral-800">■</span>
            <span>CLASS:UNRESTRICTED</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="fx-dot-orange h-1.5 w-1.5"></span>
            <span>UPLINK: ACTIVE</span>
          </div>
        </div>
      </div>

      <div className="bg-transparent backdrop-blur backdrop-filter">
        <div className="grid grid-cols-12 gap-x-8">
          {/* Sidebar */}
          <div className="order-last col-span-12 border-t border-orange-900/20 pt-8 md:order-first md:col-span-3 md:border-r md:border-t-0 md:pe-8 md:pt-0">
            <div className="mb-4 flex items-center gap-3 border-b border-orange-900/20 pb-4">
              <i className="icarus-terminal-notifications text-glow__orange" style={{ fontSize: "1.2rem" }}></i>
              <div>
                <h2 className="text-glow__orange font-bold uppercase tracking-widest">Latest</h2>
                <p className="text-xs uppercase tracking-wider text-neutral-500">Transmissions</p>
              </div>
            </div>
            <GalnetSidebar articles={galnet.articles} />
          </div>

          {/* Article */}
          <div className="order-first col-span-12 md:order-last md:col-span-9">
            <GalnetArticle article={galnet.article} />
          </div>
        </div>
      </div>
    </>
  );
}
