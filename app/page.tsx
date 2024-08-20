import type { AppStatistics } from "./core/interfaces/Statistics";
import type { Schedule } from "./core/interfaces/Schedule";
import type { Galnet } from "./core/interfaces/Galnet";
import { getCollection, getResource } from "./core/api";
import Heading from "./components/heading";
import GalnetList from "./components/galnet-list";
import LatestSystem from "./components/latest-system";
import SystemMap from "./systems/lib/system-map";
import DepartureCard from "./departures/components/departure-card";
import DepartureTable from "./departures/components/departure-table";

export default async function Home() {
  const news = await getCollection<Galnet>("galnet/news");
  const schedule = await getCollection<Schedule>("fleet-carriers/schedule", {
    withCarrierInformation: 1,
    withSystemInformation: 1,
  });

  const { data: statistics } = await getResource<AppStatistics>("statistics", {
    resetCache: 1,
  });

  const latestSystem = new SystemMap(statistics.cartographical.latest_system);
  const carrierJourneyScheduleSize = schedule.data.length;

  const departureBoardGrid =
    "grid grid-cols-1 gap-6 border-b border-t border-neutral-800 " +
    " md:grid-cols-2 lg:grid-cols-4";

  const contentGrid =
    (carrierJourneyScheduleSize > 0 ? "mt-12" : "mt-4") +
    " grid grid-cols-1 gap-x-10 md:grid-cols-2 lg:grid-cols-3";

  return (
    <>
      {carrierJourneyScheduleSize > 0 && (
        <>
          <Heading
            icon="icarus-terminal-route text-glow__orange"
            title="Departure Board"
            className="mb-5 gap-2"
          />
          <div className={departureBoardGrid}>
            {schedule.data.slice(0, 4).map((departures) => {
              return <DepartureCard key={departures.id} schedule={departures} />;
            })}
          </div>
        </>
      )}
      <div className={contentGrid}>
        <div className="col-span-1">
          <LatestSystem className="border-b border-neutral-800 pb-12" system={latestSystem} />
          <GalnetList className="pt-10" articles={news} />
        </div>
        <div className="col-span-1 lg:col-span-2">
          <Heading
            icon="icarus-terminal-route text-glow__orange"
            largeIcon={true}
            title="Scheduled Fleet Carrier Journeys"
            className="mb-5 gap-3 text-2xl"
          />
          <DepartureTable schedule={schedule} />
        </div>
      </div>
    </>
  );
}
