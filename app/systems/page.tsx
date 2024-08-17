import SystemsTable from "./components/systems-table";
import Heading from "../components/heading";
import { getCollection, getResource } from "../lib/api";
import type { System } from "../lib/interfaces/System";
import type { Statistics } from "../lib/interfaces/Statistics";
import SystemStatistics from "./components/system-statistics";

export default async function Page() {
  const systems = await getCollection<System>("systems", {
    withInformation: 1,
  });

  const statistics = await getResource<Statistics>("statistics", {
    resetCache: 1,
  });

  return (
    <>
      <Heading icon="icarus-terminal-info" title="System Statistics" className="mb-5 gap-2" />
      <SystemStatistics className="fx-fade-in" data={statistics} interval={300000} cached={true} />
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
