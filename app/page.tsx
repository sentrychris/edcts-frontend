import type { Galnet } from "@/core/interfaces/Galnet";
import type { System } from "@/core/interfaces/System";
import { getCollection } from "@/core/api";
import Heading from "@/components/heading";
import GalnetList from "./galnet/components/galnet-sidebar";
import SystemsTable from "./systems/components/systems-table";
import SystemsStatisticsBar from "./systems/components/systems-statistics-bar";

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

  const contentGrid = "grid grid-cols-1 gap-x-10 md:grid-cols-2 lg:grid-cols-3";

  return (
    <>
      <div className={contentGrid}>
        <div className="col-span-1">
          <Heading
            icon="icarus-terminal-notifications text-glow__orange"
            largeIcon={true}
            title="Latest Galnet News"
            className="mb-4 gap-3 text-2xl"
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
          <SystemsStatisticsBar className="fx-fade-in" callInterval={10000} flushCache={0} />
          <SystemsTable systems={systems} />
        </div>
      </div>
    </>
  );
}
