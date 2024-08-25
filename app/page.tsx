import type { Galnet } from "./core/interfaces/Galnet";
import type { System } from "./core/interfaces/System";
import type { Schedule } from "./core/interfaces/Schedule";
import { getCollection, getResource } from "./core/api";
import Heading from "./components/heading";
import GalnetList from "./components/galnet-list";
import LatestSystem from "./components/latest-system";
import SystemMap from "./systems/lib/system-map";
import JourneyCard from "./fleet-carriers/components/journey-card";
import JourneyTable from "./fleet-carriers/components/journey-table";

export default async function Home() {
  const news = await getCollection<Galnet>("galnet/news");

  const { data: lastAddedSystem } = await getResource<System>("last-added-system");
  const latestSystem = new SystemMap(lastAddedSystem);

  const fleetCarrierJourneySchedule = await getCollection<Schedule>("fleet-carriers/schedule", {
    withCarrierInformation: 1,
    withSystemInformation: 1,
  });

  const fleetCarrierJourneyScheduleSize = fleetCarrierJourneySchedule.data.length;

  const fleetCarrierJourneyScheduleBoardGrid =
    "grid grid-cols-1 gap-6 border-b border-t border-neutral-800 " +
    " lg:grid-cols-2 xl:grid-cols-4";

  const contentGrid =
    (fleetCarrierJourneyScheduleSize > 0 ? "mt-8" : "mt-4") +
    " grid grid-cols-1 gap-x-10 md:grid-cols-2 lg:grid-cols-3";

  return (
    <>
      {fleetCarrierJourneyScheduleSize > 0 && (
        <>
          <Heading
            icon="icarus-terminal-route"
            title="Departure Board"
            className="mb-8 mt-4 gap-2"
          />
          <div className={fleetCarrierJourneyScheduleBoardGrid}>
            {fleetCarrierJourneySchedule.data.slice(0, 4).map((journey) => {
              return <JourneyCard key={journey.id} schedule={journey} />;
            })}
          </div>
        </>
      )}
      <div className={contentGrid}>
        <div className="col-span-1">
          <Heading
            icon="icarus-terminal-location-filled text-glow__blue"
            largeIcon={true}
            title="Latest Updated System"
            className="mb-8 gap-2 text-2xl"
          />
          <LatestSystem className="border-b border-neutral-800 pb-8" system={latestSystem} />

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
            title="Scheduled Fleet Carrier Journeys"
            className="mb-8 gap-3 text-2xl"
          />
          <JourneyTable schedule={fleetCarrierJourneySchedule} />
        </div>
      </div>
    </>
  );
}
