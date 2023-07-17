import Link from 'next/link';
import { formatDate, request } from '../util';
import { Schedule } from '../../interfaces/Schedule';
import { Collection, Resource } from '../../interfaces/Request';

export const defaultState: Schedule = {
  id: 0,
  carrier: {
    name: '',
    identifier: '',
    commander: {
      name: '',
    },
    has_refuel: false,
    has_repair: false,
    has_armory: false,
    has_shipyard: false,
    has_outfitting: false,
    has_cartogrpahics: false,
  },
  departure: '',
  destination: '',
  title: '',
  description: '',
  departs_at: '',
  arrives_at: '',
  status: {
    cancelled: false,
    boarding: false,
    departed: false,
    departed_at: false,
    arrived: false,
    arrived_at: false
  }
};

export const getAllScheduledCarrierTrips: Collection<Schedule> = async (uri, params?: any) => await request(uri, params);
export const getScheduledCarrierTrip: Resource<Schedule> = async (id: number) => await request(`fleet/schedule/${id}`);

export const getStatus = (schedule: Schedule) => {
  const { status } = schedule;
  if (status.boarding) return 'BOARDING OPEN';
  if (status.departed) return 'DEPARTED';
  if (status.arrived) return 'ARRIVED';
  if (status.cancelled) return 'CANCELLED';

  return 'NOT READY';
};

export const renderStatus = (schedule: Schedule) => {
  const status = getStatus(schedule);
  return <p className={
    status === 'DEPARTED' ? 'text-blue-500 dark:text-blue-200'
      : (status === 'NOT READY') ? 'text-orange-500 dark:text-orange-300' : (status === 'CANCELLED')
      ? 'text-red-500 dark:text-red-300' : 'text-green-500 dark:text-green-200'}>
        {status}
  </p>;
};

export const scheduleColumns = {
  status: {
    title: 'Status',
    render: (schedule: Schedule) => renderStatus(schedule)
  },
  carrier_id: {
    title: 'Carrier',
    render: (schedule: Schedule) => {
      return <Link className="underline text-blue-500 dark:text-blue-200" href='#'>
        {schedule.carrier.identifier}
      </Link>;
    }
  },
  departure: {
    title: 'From',
    accessor: 'departure'
  },
  destination: {
    title: 'To',
    accessor: 'destination'
  },
  departs_at: {
    title: 'Departure',
    render: (schedule: Schedule) => formatDate(schedule.departs_at)
  },
  arrives_at: {
    title: 'Est. Arrival',
    render: (schedule: Schedule) => schedule.arrives_at ? formatDate(schedule.arrives_at) : '---'
  },
  view: {
    title: 'View',
    render: (schedule: Schedule) => {
      return <Link className="underline text-blue-500 dark:text-blue-200" href={`/departures/schedule/${schedule.id}`}>
        View
      </Link>;
    }
  }
};