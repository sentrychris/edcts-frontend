import type { Schedule } from "../core/interfaces/Schedule";
import { getCollection } from "@/core/api";
import Heading from "@/components/heading";
import DepartureCard from "./components/departure-card";
import DepartureTable from "./components/departure-table";

export default async function Page() {
  const schedule = await getCollection<Schedule>("fleet-carriers/schedule", {
    withCarrierInformation: 1,
    withSystemInformation: 1,
  });

  return (
    <>
      <Heading icon="icarus-terminal-route" title="Departure Board" className="mb-5 gap-2" />
      <div className="grid grid-cols-1 gap-6 border-b border-t border-neutral-800 font-bold md:grid-cols-2 lg:grid-cols-4">
        {schedule.data.slice(0, 4).map((schedule) => {
          return <DepartureCard key={schedule.id} schedule={schedule} />;
        })}
      </div>
      <div className="mt-5">
        <Heading
          icon="icarus-terminal-route"
          largeIcon={true}
          title="Scheduled Departures"
          className="mb-5 gap-2 text-2xl"
        />
        <DepartureTable schedule={schedule} />
      </div>
    </>
  );
}
