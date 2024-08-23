import type { System } from "@/core/interfaces/System";
import { getCollection, getResource } from "@/core/api";
import Heading from "@/components/heading";
import SystemsStatisticsBar from "./components/systems-statistics-bar";
import SystemsTable from "./components/systems-table";
import SystemsNavRoutes from "./components/systems-navroutes";

export default async function Page() {
  const systems = await getCollection<System>("systems", {
    withInformation: 1,
  });

  const { data: latestSystem } = await getResource<System>("last-added-system");

  return (
    <>
      <Heading icon="icarus-terminal-info" title="System Statistics" className="mt-4 gap-2" />
      <small className="mb-4 text-xs text-stone-300">
        Updated every <span className="text-glow__blue">30 seconds</span>. (Source:{" "}
        <a className="text-glow__orange" href="https://eddn.edcd.io/">
          EDDN
        </a>
        ).
      </small>
      <SystemsStatisticsBar
        className="fx-fade-in"
        callInterval={10000}
        resetCache={1}
        latestSystem={latestSystem}
      />
      <div className="mt-4 grid grid-cols-12 gap-x-10">
        <div className="col-span-3 uppercase">
          <Heading
            icon="icarus-terminal-route text-glow__orange"
            largeIcon={true}
            title="Nav Routes"
            className="mt-5 gap-3 text-2xl"
          />
          <SystemsNavRoutes className="mt-5" callInterval={45000} />
        </div>
        <div className="col-span-9">
          <Heading
            icon="icarus-terminal-system-orbits text-glow__orange"
            largeIcon={true}
            title="Systems Information"
            className="my-5 gap-3 text-2xl"
          />
          <SystemsTable systems={systems} />
        </div>
      </div>
    </>
  );
}
