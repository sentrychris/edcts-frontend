"use server"

import { Schedule } from '../../interfaces/Schedule'
import DepartureCard from './components/departure-card'
import DepartureTable from './components/departure-table'
import { getAllScheduledCarrierTrips } from './departures'

export default async function Home() {
  const schedule = await getAllScheduledCarrierTrips({ limit: 100 })

  return (
    <main className="flex flex-col px-6 md:px-12 lg:px-24 py-6 mx-auto text-neutral-800 dark:text-neutral-200">
      <h2 className="uppercase text-3xl mb-5">FCOC - Fleet Carrier Services</h2>
      <div className="items-center justify-between">
        <h2>Departure Board</h2>
        <div className="mt-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 font-bold">
          {schedule.data.slice(0, 4).map((schedule: Schedule) => <DepartureCard schedule={schedule}/>)}
        </div>
      </div>
      <div className="grid grid-cols-1 mt-6">
        <div>
          <h2 className="uppercase text-3xl mb-5">Departure Information</h2>
          <DepartureTable schedule={schedule} />
        </div>
      </div>
    </main>
    )
  }
  