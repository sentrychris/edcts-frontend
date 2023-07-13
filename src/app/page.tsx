
import Link from 'next/link'
import { Schedule } from './interfaces/Schedule'
import DepartureCard from './shared/DepartureCard'
import Table from './shared/Table'
import Filter from './shared/Filter'
import { formatDate } from './util'

const columns = {
  carrier_id: {
    title: "carrier ID",
    render: (schedule: any) => {
      return <Link className="underline text-blue-500 dark:text-blue-200" href='#'>
        {schedule.carrier.identifier}
      </Link>
    }
  },
  carrier_name: {
    title: "Carrier Name",
    render: (schedule: any) => {
      return <Link className="underline text-blue-500 dark:text-blue-200" href='#'>
        {schedule.carrier.name}
      </Link>
    }
  },
  commander_name: {
    title: "Commander",
    accessor: "carrier.commander.name"
  },
  departure: {
    title: "From",
    accessor: "departure"
  },
  destination: {
    title: "To",
    accessor: "destination"
  },
  departs_at: {
    title: "Departure date",
    render: (schedule: any) => formatDate(schedule.departs_at)
  },
  arrives_at: {
    title: "Arrival date",
    render: (schedule: any) => schedule.arrives_at ? formatDate(schedule.arrives_at) : '---'
  }
}

const getData = async () => {
  const res = await fetch('http://localhost/api/fleet/schedule')
  if (!res.ok) {
    throw new Error('Failed to fetch data')
  }
  
  return res.json()
}

const getStatus = (schedule: Schedule) => {
  if (schedule.is_boarding) {
    return "BOARDING OPEN"
  }

  if (schedule.has_departed) {
    return "DEPARTED"
  }

  if (schedule.has_arrived) {
    return "ARRIVED"
  }

  if (schedule.is_cancelled) {
    return "CANCELLED"
  }

  return "NOT READY"
}

export default async function Home() {
  const schedule = await getData()
  const { data, meta, links } = schedule

  return (
    <main className="flex flex-col px-6 md:px-12 lg:px-24 py-10 mx-auto text-neutral-800 dark:text-neutral-200">
      <h1 className="pb-10 text-3xl">
        Latest Departures
      </h1>
      <div className="items-center justify-between">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 font-bold font-mono">
          <>
            {data.slice(-4).map((schedule: Schedule) => (
              <DepartureCard
                title={schedule.title}
                description={schedule.description}
                departure={schedule.departure}
                destination={schedule.destination}
                departsAt={schedule.departs_at}
                status={getStatus(schedule)} />
            ))}
          </>
        </div>
      </div>
      <Filter />
      <div className="mt-6 font-mono">
        <Table columns={columns} data={data} meta={meta} links={links}></Table>
      </div>
    </main>
    )
  }
  