'use client';

import { FunctionComponent, useState } from 'react';
import { Links, Meta, Pagination } from '../../lib/interfaces/Pagination';
import { Schedule } from '../../lib/interfaces/Schedule';
import { scheduleColumns } from '../lib/departures';
import { useDebounce } from '../../lib/hooks/debounce';
import Filter from '../../components/filter';
import Table from '../../components/table';
import { getCollection } from '../../lib/api';

interface Props {
  schedule: Pagination<Schedule>;
}

const DepartureTable: FunctionComponent<Props> = ({ schedule }) => {
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

  return (
    <div>
      <Filter handleInput={searchData} className="mb-5" />
      <Table columns={scheduleColumns}
        data={rows}
        meta={metadata}
        links={navigation}
        page={paginate} />
    </div>
  );
};

export default DepartureTable;