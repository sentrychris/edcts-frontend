'use client';

import { FunctionComponent, useState } from 'react';
import Link from 'next/link';
import { EyeIcon } from '@heroicons/react/24/outline';
import { Links, Meta, Pagination } from '../../lib/interfaces/Pagination';
import { System } from '../../lib/interfaces/System';
import { useDebounce } from '../../lib/hooks/debounce';
import Filter from '../../components/filter';
import Table from '../../components/table';
import { getCollection } from '../../lib/api';
import { renderAllegianceText, renderSecurityText } from '../lib/store';

interface Props {
  systems: Pagination<System>;
}

const SystemsTable: FunctionComponent<Props> = ({ systems }) => {
  const { data, meta, links } = systems;
  const [rows, setRows] = useState(data);
  const [metadata, setMetadata] = useState(meta);
  const [navigation, setNavigation] = useState(links);

  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, 500);

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
      response = await getCollection<System>('systems', {
        name: text,
        exactSearch: 0,
        withInformation: 1
      });
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

  const columns = {
    name: {
      title: 'Name',
      render: (system: System) => {
        return <Link className="hover:underline text-blue-200" href={`/systems/system/${system.slug}`}>
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
        return <Link className="underline text-blue-200" href={`/systems/system/${system.slug}`}>
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