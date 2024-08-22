import type { System } from "@/core/interfaces/System";
import type { AppStatistics } from "@/core/interfaces/Statistics";
import { getCollection, getResource } from "@/core/api";
import Heading from "@/components/heading";
import SystemsStatisticsBar from "./components/systems-statistics-bar";
import SystemsTable from "./components/systems-table";

export default async function Page() {
  const systems = await getCollection<System>("systems", {
    withInformation: 1,
  });

  const { data: latestSystem } = await getResource<System>("last-added-system");

  const { data: statistics } = await getResource<AppStatistics>("statistics", {
    resetCache: 1,
  });

  return (
    <>
      <Heading icon="icarus-terminal-info" title="System Statistics" className="mb-5 gap-2" />
      <SystemsStatisticsBar
        className="fx-fade-in"
        data={statistics}
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
      <SystemsTable systems={systems} />
    </>
  );
}
