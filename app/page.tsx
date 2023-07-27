import Link from 'next/link';
import { Schedule } from './interfaces/Schedule';
import { Galnet } from './interfaces/Galnet';
import { getAllGalnetNewsArticles } from './galnet/galnet';
import { getAllScheduledCarrierTrips } from './departures/departures';
import DepartureCard from './departures/components/departure-card';
import DepartureTable from './departures/components/departure-table';

export default async function Home() {
  const news = await getAllGalnetNewsArticles('galnet/news');
  const schedule = await getAllScheduledCarrierTrips('fleet/schedule');

  return (
    <>
      <div className="items-center justify-between">
        <div className="flex items-center gap-2">
          <i className="icarus-terminal-route"></i>
          <h2 className="uppercase text-glow-white">Departure Board</h2>
        </div>
        <div className="mt-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 font-bold">
          {schedule.data.slice(0, 4).map((schedule: Schedule) => <DepartureCard key={schedule.id} schedule={schedule}/>)}
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
        <div className="col-span-1">
          <div className="flex items-center text-3xl gap-3 mb-3">
            <i className="icarus-terminal-notifications" style={{fontSize: '1.5rem'}}></i>
            <h2 className="uppercase text-glow-white">Galnet News</h2>
          </div>
          {news.data.slice(0, 5).map((article: Galnet) => {
            return <div key={article.id} className="relative">
              <div className="relative border-b border-neutral-800 py-4">
                  <h3 className='text-2xl mb-2 lg:mb-4'>{article.title}</h3>
                  <p className="text-xs mb-4">{article.uploaded_at}</p>
                  <Link href={`/galnet/article/${article.slug}`} className="text-orange-400">
                    Read More
                  </Link>
              </div>
            </div>;
          })}
        </div>
        <div className="col-span-1 lg:col-span-2">
          <div className="flex items-center text-3xl gap-3 mb-5">
            <i className="icarus-terminal-route" style={{fontSize: '1.5rem'}}></i>
            <h2 className="uppercase text-glow-white">Scheduled Departures</h2>
          </div>
          <DepartureTable schedule={schedule} />
        </div>
      </div>
    </>
  );
}
  