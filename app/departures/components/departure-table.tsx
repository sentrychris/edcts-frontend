'use client';

import { Pagination } from '../../../interfaces/Pagination';
import { Schedule } from '../../../interfaces/Schedule';
import { getAllScheduledCarrierTrips, scheduleColumns } from '../departures';
import Filter from '../../components/filter';
import Table from '../../components/table';
import { FunctionComponent, useEffect, useState } from 'react';
import { useDebounce } from '../../hooks/debounce';

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

  const searchData = async (text: string) => {
    /**
     * Set the query text from the input
     */
    setQuery(text);

    /**
     * debouncedQuery will only populate after user has stopped typing at specified
     * interval
     * 
     * For example, searching "colonia system" will produce the following from debounedQuery
     * (in other words, typing "colonia system" one letter at a time will result in 4 API search calls): 
     * co
     * col
     * coloni
     * colonia syst
     */
    console.log(debouncedQuery, debouncedQuery.length)
    if (debouncedQuery?.length > 1) {
      const { data, meta, links } = await getAllScheduledCarrierTrips('fleet/schedule', {
        departure: debouncedQuery,
        operand: 'like'
      });
      
      setRows(data);
      setMetadata(meta);
      setNavigation(links);
    }
  };

  const paginate = async (link: string) => {
    const { data, meta, links } = await getAllScheduledCarrierTrips(link);
    setRows(data);
    setMetadata(meta);
    setNavigation(links);
  };

  return (
    <div>
      <Filter handleInput={searchData} className="mb-5" />
      <Table columns={scheduleColumns} data={rows} meta={metadata} links={navigation} page={paginate} />
    </div>
  );
};

export default DepartureTable;