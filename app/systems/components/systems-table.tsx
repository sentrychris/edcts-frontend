'use client';

import { FunctionComponent, useState } from 'react';
import Link from 'next/link';
import { EyeIcon } from '@heroicons/react/24/outline';
import { Links, Meta, Pagination } from '../../lib/interfaces/Pagination';
import { System } from '../../lib/interfaces/System';
import { getCollection } from '../../lib/api';
import { useDebounce } from '../../lib/hooks/debounce';
import Filter from '../../components/filter';
import Table from '../../components/table';

interface Props {
  systems: Pagination<System>;
}

const SystemsTable: FunctionComponent<Props> = ({ systems }) => {
  const { data, meta, links } = systems;
  const [rows, setRows] = useState(data);
  const [metadata, setMetadata] = useState(meta);
  const [navigation, setNavigation] = useState(links);

  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, 200);

  const setState = async (data: System[], meta: Meta, links: Links) => {
    setRows(data);
    setMetadata(meta);
    setNavigation(links);
  };

  const searchData = async (text: string) => {
    setQuery(text);

    let response;
    if (text.length === 0) {
      response = await getCollection<System>('systems', {
        withInformation: 1
      });
    } else {
      if (debouncedQuery?.length > 1) {
        response = await getCollection<System>('systems', {
          name: text,
          exactSearch: 0,
          withInformation: 1
        });
      }
    }

    if (response) {
      const { data, meta, links } = response;
      await setState(data, meta, links);
    }
  };

  const paginate = async (link: string) => {
    const { data, meta, links } = await getCollection<System>(link);
    await setState(data, meta, links);
  };

  const renderSecurityText = (level: string = 'None') => {
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
  
  const renderAllegianceText = (value: string = 'None') => {
    return <p className={
      (value === 'Federation'
        ? 'text-blue-500 dark:text-blue-200'
        : (value === 'Empire')
          ? 'text-yellow-500 dark:text-yellow-400'
          : (value === 'Independent')
            ? 'text-green-500 dark:text-green-300'
            : 'text-stone-500 dark:text-stone-300'
      ) + ' uppercase tracking-wide text-glow__white'}
    >
      {value}
    </p>;
  };

  const columns = {
    name: {
      title: 'Name',
      render: (system: System) => {
        return <Link
          className="hover:underline text-blue-200"
          href={`/systems/system/${system.slug}`}
        >
          {system.name}
        </Link>;
      }
    },
    government: {
      title: 'Government',
      render: (system: System) =>
        system.information && system.information.government
        ? system.information.government
        : 'None'
    },
    allegiance: {
      title: 'Allegiance',
      render: (system: System) => renderAllegianceText(
        system.information && system.information.allegiance
        ? system.information.allegiance
        : 'None')
    },
    faction: {
      title: 'Faction',
      render: (system: System) =>
        system.information && system.information.controlling_faction
        ? system.information.controlling_faction.name
        : 'None' 
    },
    population: {
      title: 'Population',
      render: (system: System) =>
        system.information && system.information.population
        ? system.information.population.toLocaleString()
        : '0'
    },
    economy: {
      title: 'Economy',
      render: (system: System) =>
        system.information && system.information.economy
        ? system.information.economy
        : 'None'
    },
    security: {
      title: 'Security',
      render: (system: System) => renderSecurityText(
          system.information && system.information.security
          ? system.information.security
          : 'None')
    },
    view: {
      title: 'View',
      render: (system: System) => {
        return <Link
          className="underline text-blue-200"
          href={`/systems/system/${system.slug}`}
        >
          <EyeIcon className="w-6 h-6" />
        </Link>;
      }
    }
  };

  return (
    <div>
      <Filter handleInput={searchData} className="mb-5" />
      <Table columns={columns}
        data={rows}
        meta={metadata}
        links={navigation}
        page={paginate} />
    </div>
  );
};

export default SystemsTable;