'use client';

import { FunctionComponent, useState } from 'react';
import { Links, Meta, Pagination } from '../../interfaces/Pagination';
import { System } from '../../interfaces/System';
import { getAllSystems, systemColumns } from '../systems';
import { useDebounce } from '../../hooks/debounce';
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
      response = await getAllSystems('systems');
    } else {
      if (debouncedQuery?.length > 1) {
        response = await getAllSystems('systems', {
          name: text,
          operand: 'like'
        });
      }
    }

    if (response) {
      const { data, meta, links } = response;
      await setState(data, meta, links);
    }
  };

  const paginate = async (link: string) => {
    const { data, meta, links } = await getAllSystems(link);
    await setState(data, meta, links);
  };

  return (
    <div>
      <Filter handleInput={searchData} className="mb-5" />
      <Table columns={systemColumns} data={rows} meta={metadata} links={navigation} page={paginate} />
    </div>
  );
};

export default SystemsTable;