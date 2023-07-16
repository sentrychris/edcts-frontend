import { Schedule } from '../interfaces/Schedule'
import { GalnetNews } from '../interfaces/GalnetNews'
import { getAllGalnetNewsArticles } from './galnet/galnet'
import { getAllScheduledCarrierTrips } from './departures/departures'
import DepartureCard from './departures/components/departure-card'
import DepartureTable from './departures/components/departure-table'
import Link from 'next/link'

export default async function Home() {
  const news = await getAllGalnetNewsArticles('galnet/news')
  const schedule = await getAllScheduledCarrierTrips('fleet/schedule')

  return (
    <>
      <div className="items-center justify-between">
        <h2>Departure Board</h2>
        <div className="mt-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 font-bold">
          {schedule.data.slice(0, 4).map((schedule: Schedule) => <DepartureCard schedule={schedule}/>)}
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
        <div className="col-span-1">
          <h2 className="uppercase text-3xl mb-3">Galnet News</h2>
          {news.data.slice(0, 5).map((article: GalnetNews) => {
            return <div className="relative">
              <div className="relative border-b border-neutral-800 py-4">
                  <h3 className='text-2xl mb-1'>{article.title}</h3>
                  <p className="text-xs mb-6">{article.uploaded_at}</p>
                  <Link href={`/galnet/article/${article.id}`} className="text-orange-400">
                    Read More
                  </Link>
              </div>
            </div>
          })}
        </div>
        <div className="col-span-1 lg:col-span-2">
          <h2 className="uppercase text-3xl mb-5">Departure Information</h2>
          <DepartureTable schedule={schedule} />
        </div>
      </div>
    </>
  )
}
  