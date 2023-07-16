'use client';

import { Links, Meta, Pagination } from '../../../interfaces/Pagination';
import { Schedule } from '../../../interfaces/Schedule';
import { getAllScheduledCarrierTrips, scheduleColumns } from '../departures';
import { FunctionComponent, useState } from 'react';
import { useDebounce } from '../../hooks/debounce';
import Filter from '../../components/filter';
import Table from '../../components/table';

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
  }

  const searchData = async (text: string) => {
    setQuery(text);

    let response;
    if (text.length === 0) {
      response = await getAllScheduledCarrierTrips('fleet/schedule');
    } else {
      if (debouncedQuery?.length > 1) {
        response = await getAllScheduledCarrierTrips('fleet/schedule', {
          departure: text,
          operand: 'like'
        });
      }
    }

    if (response) {
      const { data, meta, links } = response
      await setState(data, meta, links);
    }
  };

  const paginate = async (link: string) => {
    const { data, meta, links } = await getAllScheduledCarrierTrips(link);
    await setState(data, meta, links);
  };

  return (
    <div>
      <Filter handleInput={searchData} className="mb-5" />
      <Table columns={scheduleColumns} data={rows} meta={metadata} links={navigation} page={paginate} />
    </div>
  );
};

export default DepartureTable;