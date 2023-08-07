'use client';

import { FunctionComponent, useEffect, useState } from 'react';
import Link from 'next/link';
import { EyeIcon } from '@heroicons/react/24/outline';
import { Links, Meta, Pagination } from '../../lib/interfaces/Pagination';
import { Schedule } from '../../lib/interfaces/Schedule';
import { useDebounce } from '../../lib/hooks/debounce';
import Filter from '../../components/filter';
import Table from '../../components/table';
import { getCollection } from '../../lib/api';
import { renderStatusText } from '../lib/store';
import { formatDate } from '../../lib/util';

interface Props {
  schedule: Pagination<Schedule>;
  filter?: boolean;
}

const DepartureTable: FunctionComponent<Props> = ({ schedule, filter = true }) => {
  const { data, meta, links } = schedule;
  
  const [rows, setRows] = useState(data);
  const [metadata, setMetadata] = useState(meta);
  const [navigation, setNavigation] = useState(links);

  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, 500);

  const setState = async (data: Schedule[], meta: Meta, links: Links) => {
    setRows(data);
    setMetadata(meta);
    setNavigation(links);
  };

  useEffect(() => {
    setState(data, meta, links);
  }, [data, meta, links]);

  const searchData = async (text: string) => {
    setQuery(text);

    let response;
    if (text.length === 0) {
      response = await getCollection<Schedule>('fleet/schedule', {
        withCarrierInformation: 1,
        withSystemInformation: 1
      });
    } else {
      if (debouncedQuery?.length > 1) {
        response = await getCollection<Schedule>('fleet/schedule', {
          departure: text,
          exactMatch: false,
          withCarrierInformation: 1,
          withSystemInformation: 1
        });
      }
    }

    if (response) {
      const { data, meta, links } = response;
      await setState(data, meta, links);
    }
  };

  const paginate = async (link: string) => {
    const { data, meta, links } = await getCollection<Schedule>(link);
    await setState(data, meta, links);
  };

  const columns = {
    status: {
      title: 'Status',
      render: (schedule: Schedule) => renderStatusText(schedule)
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

  return (
    <div>
      {filter && <Filter handleInput={searchData} className="mb-5" />}
      <Table columns={columns}
        data={rows}
        meta={metadata}
        links={navigation}
        page={paginate} />
    </div>
  );
};

export default DepartureTable;