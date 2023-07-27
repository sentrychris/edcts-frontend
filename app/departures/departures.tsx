import Link from 'next/link';
import { EyeIcon } from '@heroicons/react/24/outline';
import { Schedule } from '../interfaces/Schedule';
import { Pagination } from '../interfaces/Pagination';
import { Collection, Resource } from '../interfaces/Request';
import { formatDate, request } from '../util';
import { defaultState as systemState } from '../systems/systems';

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
    slug: ''
  },
  departure: systemState,
  destination: systemState,
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
  },
  slug: ''
};

export const paginatedState: Pagination<Schedule> = {
  data: [],
  links: {
    first: '',
    last: '',
    next: null,
    prev: null,
  },
  meta: {
    current_page: 1,
    from: 1,
    last_page: 1,
    links: [],
    path: '',
    per_page: 10,
    to: 0,
    total: 0
  }
};

export const getAllScheduledCarrierTrips: Collection<Schedule> = async (uri, params?) => await request(uri, params);
export const getScheduledCarrierTrip: Resource<Schedule> = async (id) => await request(`fleet/schedule/${id}`);

export const getStatusText = (schedule: Schedule) => {
  const { status } = schedule;
  if (status.boarding) return 'BOARDING OPEN';
  if (status.departed) return 'DEPARTED';
  if (status.arrived) return 'ARRIVED';
  if (status.cancelled) return 'CANCELLED';

  return 'NOT READY';
};

export const renderStatus = (value: Schedule | string) => {
  const status = (typeof value === 'string')
    ? value
    : getStatusText(value);

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
    accessor: 'carrier.identifier'
  },
  departure: {
    title: 'From',
    render: (schedule: Schedule) => {
      return <Link className="hover:underline text-blue-500 dark:text-blue-200" href={encodeURI(`/systems/system/${schedule.departure.slug}`)}>
        {schedule.departure.name}
      </Link>;
    }
  },
  destination: {
    title: 'To',
    render: (schedule: Schedule) => {
      return <Link className="hover:underline text-blue-500 dark:text-blue-200" href={encodeURI(`/systems/system/${schedule.destination.slug}`)}>
        {schedule.destination.name}
      </Link>;
    }
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
      return <Link className="underline text-blue-500 dark:text-blue-200" href={`/departures/schedule/${schedule.slug}`}>
        <EyeIcon className="w-6 h-6" />
      </Link>;
    }
  }
};