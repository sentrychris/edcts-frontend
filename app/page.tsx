import type { Galnet } from "@/core/interfaces/Galnet";
import type { System } from "@/core/interfaces/System";
import { getCollection } from "@/core/api";
import Heading from "@/components/heading";
import GalnetList from "./galnet/components/galnet-sidebar";
import LatestSystem from "./systems/components/latest-system";
import SystemsTable from "./systems/components/systems-table";

export default async function Home() {
  const news = await getCollection<Galnet>("galnet/news", {
    params: {
      limit: 100,
    },
  });

  const systems = await getCollection<System>("systems", {
    params: {
      withInformation: 1,
    },
  });

  const contentGrid = "mt-4 grid grid-cols-1 gap-x-10 md:grid-cols-2 lg:grid-cols-3";

  return (
    <>
      <div className={contentGrid}>
        <div className="col-span-1">
          <Heading
            icon="icarus-terminal-location-filled text-glow__blue"
            largeIcon={true}
            title="Latest Updated System"
            className="gap-2 text-2xl"
          />
          <small className="text-xs text-stone-300">
            Updated every <span className="text-glow__blue">5 minutes</span>. (Source:{" "}
            <a className="text-glow__orange" href="https://eddn.edcd.io/">
              EDDN
            </a>
            ).
          </small>
          <LatestSystem className="mt-4 border-b border-neutral-800 pb-8 text-sm" />

          <Heading
            icon="icarus-terminal-notifications text-glow__orange"
            largeIcon={true}
            title="Latest Galnet News"
            className="mb-4 mt-8 gap-3 text-2xl"
          />
          <GalnetList articles={news} />
        </div>
        <div className="col-span-1 hidden md:block lg:col-span-2">
          <Heading
            icon="icarus-terminal-route text-glow__orange"
            largeIcon={true}
            title="Universal Cartographics Data"
            className="mb-8 gap-3 text-2xl"
          />
          <SystemsTable systems={systems} />
        </div>
      </div>
    </>
  );
}
