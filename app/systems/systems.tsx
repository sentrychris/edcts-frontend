import Link from 'next/link';
import { request } from '../util';
import { System } from '../../interfaces/System';
import { Collection, Resource } from '../../interfaces/Request';
import { EyeIcon } from '@heroicons/react/24/outline';

export const defaultState: System = {
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
  updated_at: '',
  slug: ''
};

export const getAllSystems: Collection<System> = async (uri, params?) => await request(uri, params);
export const getSystem: Resource<System> = async (id) => await request(`systems/${id}`);

export const renderSecurityLevel = (level: string) => {
  return <p className={
    (level === 'Medium'
      ? 'text-orange-500 dark:text-orange-300'
      : (level === 'Low')
        ? 'text-red-500 dark:text-red-300'
        : 'text-green-500 dark:text-green-200'
    ) + ' uppercase'}>
    {level}
  </p>;
};

export const renderAllegianceText = (value: string) => {
  return <p className={
    (value === 'Federation' ? 'text-blue-500 dark:text-blue-200'
      : (value === 'Empire') ? 'text-yellow-500 dark:text-yellow-400'
      : (value === 'Independent') ? 'text-green-500 dark:text-green-300'
      : 'text-stone-500 dark:text-stone-300') + ` uppercase tracking-wide`}>
        {value}
  </p>;
};

export const systemColumns = {
  name: {
    title: 'Name',
    render: (system: System) => {
      return <Link className="hover:underline text-blue-500 dark:text-blue-200" href={`/systems/system/${system.slug}`}>
        {system.name}
      </Link>;
    }
  },
  government: {
    title: 'Government',
    render: (system: System) => system.information.government ?? 'None'
  },
  allegiance: {
    title: 'Allegiance',
    render: (system: System) => renderAllegianceText(system.information.allegiance ?? 'None')
  },
  faction: {
    title: 'Faction',
    render: (system: System) => system.information.controlling_faction.name ?? 'None' 
  },
  population: {
    title: 'Population',
    render: (system: System) => system.information.population.toLocaleString()
  },
  economy: {
    title: 'Economy',
    render: (system: System) => system.information.economy ?? 'None'
  },
  security: {
    title: 'Security',
    render: (system: System) => renderSecurityLevel(system.information.security)
  },
  view: {
    title: 'View',
    render: (system: System) => {
      return <Link className="underline text-blue-500 dark:text-blue-200" href={`/systems/system/${system.slug}`}>
        <EyeIcon className="w-6 h-6" />
      </Link>;
    }
  }
};