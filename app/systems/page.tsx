import type { System } from "@/core/interfaces/System";
import { getCollection, getResource } from "@/core/api";
import Heading from "@/components/heading";
import SystemsStatisticsBar from "./components/systems-statistics-bar";
import SystemsTable from "./components/systems-table";
import LastTenNavRoutes from "./components/last-ten-navroutes";

export default async function Page() {
  const systems = await getCollection<System>("systems", {
    withInformation: 1,
  });

  const { data: latestSystem } = await getResource<System>("last-added-system");

  return (
    <>
      <Heading icon="icarus-terminal-info" title="System Statistics" className="mb-5 gap-2" />
      <SystemsStatisticsBar
        className="fx-fade-in"
        callInterval={10000}
        resetCache={1}
        latestSystem={latestSystem}
      />

      <Heading
        icon="icarus-terminal-system-orbits"
        largeIcon={true}
        title="Systems Information"
        className="my-5 gap-3 text-2xl"
      />

      <div className="grid grid-cols-12 gap-x-10">
        <div className="col-span-3 uppercase">
          <LastTenNavRoutes />
        </div>
        <div className="col-span-9">
          <SystemsTable systems={systems} />
        </div>
      </div>
    </>
  );
}
