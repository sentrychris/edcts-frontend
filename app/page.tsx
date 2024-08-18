import type { Statistics } from "./core/interfaces/Statistics";
import type { Schedule } from "./core/interfaces/Schedule";
import type { Galnet } from "./core/interfaces/Galnet";
import { getCollection, getResource } from "./core/api";
import Heading from "./components/heading";
import Link from "next/link";
import SystemMap from "./systems/lib/system-map";
import DepartureCard from "./departures/components/departure-card";
import DepartureTable from "./departures/components/departure-table";

export default async function Home() {
  const news = await getCollection<Galnet>("galnet/news");
  const schedule = await getCollection<Schedule>("fleet/schedule", {
    withCarrierInformation: 1,
    withSystemInformation: 1,
  });

  const statistics = await getResource<Statistics>("statistics", {
    resetCache: 1,
  });

  const latestSystem = new SystemMap(statistics.data.cartographical.latest_system);

  return (
    <>
      <Heading
        icon="icarus-terminal-route text-glow__orange"
        title="Departure Board"
        className="mb-5 gap-2"
      />
      <div className="grid grid-cols-1 gap-6 border-b border-t border-neutral-800 font-bold md:grid-cols-2 lg:grid-cols-4">
        {schedule.data.slice(0, 4).map((schedule) => {
          return <DepartureCard key={schedule.id} schedule={schedule} />;
        })}
      </div>
      <div className="mt-12 grid grid-cols-1 gap-x-10 md:grid-cols-2 lg:grid-cols-3">
        <div className="col-span-1">
          <div className="border-b border-neutral-800 pb-12">
            <Heading
              icon="icarus-terminal-location-filled text-glow__blue"
              largeIcon={true}
              title="ED:CTS Last Visited"
              className="mb-5 gap-2 text-2xl"
            />
            <Link
              className="text-glow__blue font-bold hover:underline"
              href={`systems/${latestSystem.detail.slug}`}
            >
              {latestSystem.name}
            </Link>
            <div className="mt-3 flex gap-x-20">
              <div>
                <p>
                  {latestSystem.detail.coords.x}, {latestSystem.detail.coords.y},{" "}
                  {latestSystem.detail.coords.z}
                </p>
                <p>Population: {latestSystem.detail.information.population}</p>
              </div>
              <div>
                <p>{latestSystem.stars.length} Main sequence stars</p>
                <p>{latestSystem.planets.length} orbital bodies</p>
              </div>
            </div>
            <p className="mt-2.5">
              <span className="text-glow__blue">{2}</span> fleet carriers are currently in this
              system
            </p>
          </div>

          <div className="mt-10">
            <Heading
              icon="icarus-terminal-notifications text-glow__orange"
              largeIcon={true}
              title="Latest Galnet News"
              className="mb-3 gap-3 text-2xl"
            />
            {news.data.slice(0, 5).map((article) => {
              return (
                <div key={article.id} className="relative">
                  <div className="relative border-b border-neutral-800 py-4">
                    <h3 className="mb-2">{article.title}</h3>
                    <p className="mb-4 text-sm">{article.uploaded_at}</p>
                    <Link href={`/galnet/news/${article.slug}`} className="text-glow__orange">
                      Read more...
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <div className="col-span-1 lg:col-span-2">
          <Heading
            icon="icarus-terminal-route text-glow__orange"
            largeIcon={true}
            title="Scheduled Departures"
            className="mb-5 gap-3 text-2xl"
          />
          <DepartureTable schedule={schedule} />
        </div>
      </div>
    </>
  );
}
