import DepartureCard from './shared/DepartureCard'
import Table from './shared/Table'

const columns = {
  carrier_id: {
    title: "carrier ID",
    accessor: "carrier.identifier"
  },
  carrier_name: {
    title: "carrier Name",
    accessor: "carrier.name"
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
    render: (schedule: any) => new Date(schedule.departs_at).toLocaleString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    })
  }
}

const getData = async () => {
  const res = await fetch('http://localhost/api/fleet/schedule')
  if (!res.ok) {
    throw new Error('Failed to fetch data')
  }
  return res.json()
}

const getStatus = (schedule: any) => {
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
    <main className="flex flex-col px-6 md:px-12 lg:px-24 py-10 mx-auto">
      <h1 className="text-white pb-10 text-3xl">
        Latest Departures
      </h1>
      <div className="items-center justify-between">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 font-bold font-mono">
          <>
            {data.slice(-4).map((schedule: any) => (
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
      <div className="mt-6 font-mono">
        <Table columns={columns} data={data} meta={meta} links={links}></Table>
      </div>
    </main>
    )
  }
  