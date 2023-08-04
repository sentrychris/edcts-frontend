import Link from 'next/link';
import { Schedule } from './lib/interfaces/Schedule';
import { Galnet } from './lib/interfaces/Galnet';
import DepartureCard from './departures/components/departure-card';
import DepartureTable from './departures/components/departure-table';
import Heading from './components/heading';
import { getCollection } from './lib/api';

export default async function Home() {
  const news = await getCollection<Galnet>('galnet/news');
  const schedule = await getCollection<Schedule>('fleet/schedule', {
    withCarrierInformation: 1,
    withSystemInformation: 1
  });

  return (
    <>
      <Heading icon="icarus-terminal-route" title="Departure Board" className="gap-2 mb-5" />
      <div className="border-t border-b border-neutral-800 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 font-bold">
        {schedule.data.slice(0, 4).map((schedule) => {
          return <DepartureCard key={schedule.id} schedule={schedule}/>;
        })}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
        <div className="col-span-1">
          <Heading icon="icarus-terminal-notifications"
            largeIcon={true}
            title="Galnet News"
            className="gap-3 mb-5 text-2xl" />
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
        <div className="col-span-1 lg:col-span-2">
          <Heading icon="icarus-terminal-route"
            largeIcon={true}
            title="Scheduled Departures"
            className="gap-3 mb-5 text-2xl" />
          <DepartureTable schedule={schedule} />
        </div>
      </div>
    </>
  );
}
  