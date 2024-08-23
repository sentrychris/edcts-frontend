import type { Schedule } from "../core/interfaces/Schedule";
import { getCollection } from "@/core/api";
import Heading from "@/components/heading";
import JourneyCard from "./components/journey-card";
import JourneyTable from "./components/journey-table";

export default async function Page() {
  const schedule = await getCollection<Schedule>("fleet-carriers/schedule", {
    withCarrierInformation: 1,
    withSystemInformation: 1,
  });

  return (
    <>
      <Heading
        icon="icarus-terminal-route"
        title="Scheduled Fleet Carrier Journeys"
        className="mb-8 mt-4 gap-2"
      />
      <div className="grid grid-cols-1 gap-6 border-b border-t border-neutral-800 font-bold md:grid-cols-2 lg:grid-cols-4">
        {schedule.data.slice(0, 4).map((schedule) => {
          return <JourneyCard key={schedule.id} schedule={schedule} />;
        })}
      </div>
      <div className="my-8">
        <Heading
          icon="icarus-terminal-route text-glow__orange"
          largeIcon={true}
          title="Scheduled Fleet Carrier Journeys"
          className="mb-5 gap-2 text-2xl"
        />
        <JourneyTable schedule={schedule} />
      </div>
    </>
  );
}
