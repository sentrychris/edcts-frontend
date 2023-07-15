import { Schedule } from '../interfaces/Schedule'
import DepartureCard from './departures/components/departure-card'
import DepartureTable from './departures/components/departure-table'
import { getSchedule } from './departures/schedule'
import { getAllGalnetNewsArticles } from './galnet/galnet'
import { GalnetNews } from '../interfaces/GalnetNews'
import Link from 'next/link'
import Image from 'next/image'

export default async function Home() {
  const schedule = await getSchedule()
  const news = await getAllGalnetNewsArticles()

  return (
    <main className="flex flex-col px-6 md:px-12 lg:px-24 py-6 mx-auto text-neutral-800 dark:text-neutral-200">
      <h2 className="uppercase text-3xl mb-5">FCOC - Fleet Carrier Services</h2>
      <div className="items-center justify-between">
        <h2>Departure Board</h2>
        <div className="mt-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 font-bold">
          {schedule.data.slice(0, 4).map((schedule: Schedule) => <DepartureCard schedule={schedule}/>)}
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <div>
          <h2 className="uppercase text-3xl mb-3">Galnet News</h2>
          {news.data.slice(0,3).map((article: GalnetNews) => {
            return <div className="relative">
              {/* <Image
                src={article.banner_image}
                alt="article image"
                className="w-full rounded-lg shadow-lg border border-neutral-800 mb-3"
                width={1200}
                height={200}
              ></Image> */}
              <div className="relative border-b border-neutral-800 py-4">
                  <h1 className='text-3xl mb-2'>{article.title}</h1>
                  <p className="text-xs mb-4">{article.uploaded_at}</p>
                  <p className="tracking-wider mb-6" dangerouslySetInnerHTML={{ __html: article.content.slice(0, 140) + '...' }}></p>
                  <Link href={`/galnet/article/${article.id}`} className="text-orange-400">
                    Read More
                  </Link>
              </div>
            </div>
          })}
        </div>
        <div>
          <h2 className="uppercase text-3xl mb-5">Departure Information</h2>
          <DepartureTable schedule={schedule} />
        </div>
      </div>
    </main>
    )
  }
  