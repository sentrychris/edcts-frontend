'use client';

import { Pagination } from '../../../interfaces/Pagination';
import { Schedule } from '../../../interfaces/Schedule';
import { getAllScheduledCarrierTrips, scheduleColumns } from '../departures';
import Filter from '../../components/filter';
import Table from '../../components/table';
import { FunctionComponent, useState } from 'react';

interface Props {
  schedule: Pagination<Schedule>;
}

const DepartureTable: FunctionComponent<Props> = ({ schedule }) => {
  const { data, meta, links } = schedule;
  const [rows, setRows] = useState(data);
  const [metadata, setMetadata] = useState(meta);
  const [navigation, setNavigation] = useState(links);

  const searchData = (text: string) => {
    setRows(data.filter(s => (new RegExp(text, 'i')).test(s.title)));
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