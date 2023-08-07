import Link from 'next/link';
import { Schedule } from './lib/interfaces/Schedule';
import { Galnet } from './lib/interfaces/Galnet';
import DepartureCard from './departures/components/departure-card';
import DepartureTable from './departures/components/departure-table';
import Heading from './components/heading';
import { getCollection, getResource } from './lib/api';
import { Statistics } from './lib/interfaces/Statistics';
import SystemMap from './systems/lib/system-map';

export default async function Home() {
  const news = await getCollection<Galnet>('galnet/news');
  const schedule = await getCollection<Schedule>('fleet/schedule', {
    withCarrierInformation: 1,
    withSystemInformation: 1
  });

  const statistics = await getResource<Statistics>('statistics', {
    resetCache: 1
  });

  const latestSystem = new SystemMap(statistics.data.cartographical.latest_system);

  return (
    <>
      <Heading
        icon="icarus-terminal-route text-glow__orange"
        title="Departure Board"
        className="gap-2 mb-5"
      />
      <div className="border-t border-b border-neutral-800 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 font-bold">
        {schedule.data.slice(0, 4).map((schedule) => {
          return <DepartureCard key={schedule.id} schedule={schedule}/>;
        })}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-10 mt-5">
        <div className="col-span-1">
          <div className="border-b border-neutral-800 pb-5">
            <Heading icon="icarus-terminal-location-filled text-glow__blue"
              largeIcon={true}
              title="ED:CTS Last Visited"
              className="gap-2 mb-5 text-2xl"
            />
              <Link
                className="text-glow__blue font-bold hover:underline"
                href={`systems/system/${latestSystem.detail.slug}`}
              >
                {latestSystem.name}
              </Link>
              <div className="flex gap-x-20 mt-3">
                <div>
                  <p>{latestSystem.detail.coords.x}, {latestSystem.detail.coords.y}, {latestSystem.detail.coords.z}</p>
                  <p>Population: {latestSystem.detail.information.population}</p>
                </div>
                <div>
                  <p>{latestSystem.stars.length} Main sequence stars</p>
                  <p>{latestSystem.planets.length} orbital bodies</p>
                </div>
              </div>
              <p className="mt-2.5"><span className="text-glow__orange">{2} fleet carriers</span> are currently in this system</p>
          </div>

          <div className="mt-10">
            <Heading icon="icarus-terminal-notifications text-glow__orange"
              largeIcon={true}
              title="Galnet News"
              className="gap-3 mb-5 text-2xl"
            />
            {news.data.slice(0, 5).map((article) => {
              return <div key={article.id} className="relative">
                <div className="relative border-b border-neutral-800 py-4">
                    <h3 className='text-2xl mb-2 lg:mb-4'>{article.title}</h3>
                    <p className="text-sm mb-4">{article.uploaded_at}</p>
                    <Link href={`/galnet/news/${article.slug}`} className="text-glow__orange">
                      Read More...
                    </Link>
                </div>
              </div>;
            })}
          </div>
        </div>
        <div className="col-span-1 lg:col-span-2">
          <Heading icon="icarus-terminal-route text-glow__orange"
            largeIcon={true}
            title="Scheduled Departures"
            className="gap-3 mb-5 text-2xl"
          />
          <DepartureTable schedule={schedule} />
        </div>
      </div>
    </>
  );
}
  