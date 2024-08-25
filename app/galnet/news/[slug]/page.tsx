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
          <div className="col-span-3 border-r border-neutral-900 pe-10">
            <div className="pt-10">
              <h1 className="text-glow__orange text-xl uppercase">Latest</h1>
              <GalnetList articles={news} />
            </div>
          </div>
          <div className="col-span-9 ps-10">
            <GalnetArticle params={params} />
          </div>
        </div>
      </div>
    </>
  );
}
