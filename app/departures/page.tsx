import { Schedule } from '../../interfaces/Schedule'
import { getAllScheduledCarrierTrips } from './departures'
import DepartureCard from './components/departure-card'
import DepartureTable from './components/departure-table'

export default async function Home() {
  const schedule = await getAllScheduledCarrierTrips('fleet/schedule')

  return (
    <>
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
    </>
  )
}
  