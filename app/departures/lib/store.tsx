import { Schedule } from '../../lib/interfaces/Schedule';
import { Pagination } from '../../lib/interfaces/Pagination';
import { pagination } from '../../lib/api';
import { systemState } from '../../systems/lib/store';

export const scheduleState: Schedule = {
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

export const paginatedScheduleState: Pagination<Schedule> = pagination;

export const getStatusText = (schedule: Schedule) => {
  const { status } = schedule;
  if (status.boarding) return 'BOARDING OPEN';
  if (status.departed) return 'DEPARTED';
  if (status.arrived) return 'ARRIVED';
  if (status.cancelled) return 'CANCELLED';

  return 'NOT READY';
};

export const renderStatusText = (value: Schedule | string) => {
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