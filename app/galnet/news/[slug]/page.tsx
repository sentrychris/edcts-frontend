import type { Galnet } from "@/core/interfaces/Galnet";
import { getCollection } from "@/core/api";
import Heading from "@/components/heading";
import GalnetArticle from "../../components/galnet-article";
import GalnetList from "@/components/galnet-list";

const news = await getCollection<Galnet>("galnet/news");

export default async function Page({ params }: { params: { slug: string } }) {
  return (
    <>
      <div className="mt-4 grid grid-cols-1 bg-transparent backdrop-blur backdrop-filter">
        <Heading
          icon="icarus-terminal-notifications"
          largeIcon={true}
          title="Galnet News"
          className="gap-3 border-b border-neutral-800 pb-3 text-2xl"
        />

        <div className="grid grid-cols-12">
          <div className="order-last col-span-12 border-neutral-900 md:order-first md:col-span-3 md:border-r md:pe-10">
            <div className="pt-10">
              <h1 className="text-glow__orange text-xl uppercase">Latest</h1>
              <GalnetList articles={news} />
            </div>
          </div>
          <div className="order-first col-span-12 md:order-last md:col-span-9 md:ps-10">
            <GalnetArticle params={params} />
          </div>
        </div>
      </div>
    </>
  );
}
