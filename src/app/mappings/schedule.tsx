import Link from "next/link"
import { formatDate } from "../util"
import { Schedule } from "../interfaces/Schedule"

export const getSchedule = async (params?: any) => {
  const url = 'http://localhost/api/fleet/schedule'
  const query: string = params
    ? new URLSearchParams(params).toString()
    : ''

  const res = await fetch(`${url}?${query}`)
  if (!res.ok) {
    throw new Error('Failed to fetch data')
  }
  
  return res.json()
}

export const getStatus = (schedule: Schedule) => {
  const { status } = schedule
  if (status.boarding) {
    return "BOARDING OPEN"
  }

  if (status.departed) {
    return "DEPARTED"
  }

  if (status.arrived) {
    return "ARRIVED"
  }

  if (status.cancelled) {
    return "CANCELLED"
  }

  return "NOT READY"
}

export const renderStatus = (schedule: Schedule) => {
  const status = getStatus(schedule)
  return <p className={
    status === 'DEPARTED' ? `text-blue-500 dark:text-blue-200`
      : (status === 'NOT READY') ? 'text-orange-500 dark:text-orange-300' : (status === 'CANCELLED')
      ? 'text-red-500 dark:text-red-300' : 'text-green-500 dark:text-green-200'}>
        {status}
  </p>
}

export const scheduleColumns = {
  status: {
    title: "Status",
    render: (schedule: any) => renderStatus(schedule)
  },
  carrier_id: {
    title: "Carrier",
    render: (schedule: any) => {
      return <Link className="underline text-blue-500 dark:text-blue-200" href='#'>
        {schedule.carrier.identifier}
      </Link>
    }
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
    title: "Departure",
    render: (schedule: any) => formatDate(schedule.departs_at)
  },
  arrives_at: {
    title: "Estimated Arrival",
    render: (schedule: any) => schedule.arrives_at ? formatDate(schedule.arrives_at) : '---'
  },
  commander_name: {
    title: "Commander",
    accessor: "carrier.commander.name"
  },
}