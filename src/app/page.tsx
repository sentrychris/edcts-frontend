import { Schedule } from './interfaces/Schedule'
import DepartureCard from './shared/DepartureCard'
import Table from './shared/Table'
import Filter from './shared/Filter'
import { getSchedule, scheduleColumns } from './mappings/schedule'
import { getGalnetNews } from './mappings/galnet'
import { GalnetNews } from './interfaces/GalnetNews'
import Link from 'next/link'
import Image from 'next/image'

export default async function Home() {
  const schedule = await getSchedule()
  const news = await getGalnetNews()
  const { data, meta, links } = schedule

  return (
    <main className="flex flex-col px-6 md:px-12 lg:px-24 py-6 mx-auto text-neutral-800 dark:text-neutral-200">
      <h2 className="uppercase text-3xl mb-5">FCOC - Fleet Carrier Services</h2>
      <div className="items-center justify-between">
        <h2>Departure Board</h2>
        <div className="mt-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 font-bold">
          {data.slice(0, 4).map((schedule: Schedule) => <DepartureCard schedule={schedule}/>)}
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <div>
          <h2 className="uppercase text-3xl mb-5">Galnet News</h2>
          {news.data.slice(0,3).map((article: GalnetNews) => {
            return <div className="relative mb-3">
              <Image
                src={article.banner_image}
                alt="article image"
                className="w-full rounded-lg shadow-lg border border-neutral-800 mb-3"
                width={1200}
                height={200}
              ></Image>
              <Link href="#" className='text-lg block'>{article.title}</Link>
            </div>
          })}
        </div>
        <div>
          <h2 className="uppercase text-3xl mb-5">Departure Information</h2>
          <div>
            <Filter className="mb-5" />
            <Table columns={scheduleColumns} data={data} meta={meta} links={links} />
          </div>
        </div>
      </div>
    </main>
    )
  }
  