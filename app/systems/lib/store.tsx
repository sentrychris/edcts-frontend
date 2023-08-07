import { System } from '../../lib/interfaces/System';
import { Pagination } from '../../lib/interfaces/Pagination';
import { pagination } from '../../lib/api';

export const systemState: System = {
  id: 0,
  id64: 0,
  name: '',
  coords: {
    x: 0,
    y: 0,
    z: 0
  },
  information: {
    allegiance: '',
    government: '',
    population: 0,
    security: '',
    economy: '',
    controlling_faction: {
        name: '',
        allegiance: ''
    }
  },
  bodies: [],
  updated_at: '',
  slug: ''
};


export const statisticsState = {
  data: {
    cartographical: {
        systems: 0,
        bodies: 0,
        stars: 0,
        orbiting: 0
    },
    carriers: 0,
    commanders: 0,
    journeys: {
        total: 0,
        boarding: 0,
        cancelled: 0,
        leaving_in: {
            two_days: 0,
            one_week: 0,
            one_month: 0,
            six_months: 0
        }
    }
  }
};

export const paginatedSystemState: Pagination<System> = pagination;

export const renderSecurityText = (level: string = 'None') => {
  return <p className={
    (level === 'Medium'
      ? 'text-orange-500 dark:text-orange-300'
      : (level === 'Low')
        ? 'text-red-500 dark:text-red-300'
        : 'text-green-500 dark:text-green-200'
    ) + ' uppercase text-glow__white'}>
    {level}
  </p>;
};

export const renderAllegianceText = (value: string = 'None') => {
  return <p className={
    (value === 'Federation' ? 'text-blue-500 dark:text-blue-200'
      : (value === 'Empire') ? 'text-yellow-500 dark:text-yellow-400'
      : (value === 'Independent') ? 'text-green-500 dark:text-green-300'
      : 'text-stone-500 dark:text-stone-300') + ' uppercase tracking-wide text-glow__white'}>
        {value}
  </p>;
};

export const renderBadge = (text: string | number, options?: {className?: string, icon?: string}) => {
  let classes = 'flex items-center gap-2 py-1 uppercase text-glow__white font-bold';
  if (options && options.className) {
    classes = classes + options.className;
  }

  return (
    <span className={classes}>
      {options && options.icon && 
        <i className={options.icon + ' text-glow__orange'}></i>
      }
      {text}
    </span>
  );
};