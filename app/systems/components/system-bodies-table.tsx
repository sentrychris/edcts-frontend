'use client';

import { FunctionComponent, useState, memo } from 'react';
import Link from 'next/link';
import { RawSystemBody, MappedSystemBody } from '../../lib/interfaces/SystemBody';
import { formatDate } from '../../lib/util';
import { SystemDispatcher } from '../../lib/events/SystemDispatcher';
import Table from '../../components/table';

interface Props {
  bodies: RawSystemBody[];
  system: string;
  dispatcher: SystemDispatcher;
}

const SystemBodiesTable: FunctionComponent<Props> = ({ bodies, system, dispatcher }) => {
  const [rows] = useState(bodies);

  const columns = {
    name: {
      title: 'Name - Type',
      render: (body: RawSystemBody) => {
        return <span
          className="text-blue-200 hover:text-glow__orange hover:underline hover:cursor-pointer"
          onClick={() => dispatcher.selectBody({ body: (body as MappedSystemBody)})}
        >
          {body.name.split(system).pop()?.trim()}
        </span>;
      }
    },
    sub_type: {
      title: 'Type',
      accessor: 'sub_type'
    },
    bodies: {
      title: 'Bodies',
      render: (body: RawSystemBody) => {
        const orbital = (body as MappedSystemBody);
        return <span
          className="text-blue-200 hover:text-glow__orange hover:underline hover:cursor-pointer"
          onClick={() => dispatcher.selectBody({ body: orbital})}
        >
          {orbital._children?.length ?? 0}
        </span>;
      }
    },
    landable: {
      title: 'Landable',
      render: (body: RawSystemBody) => {
        return body.is_landable
          ? <span className="text-green-300">Yes</span>
          : <span className="text-red-300">No</span>;
      }
    },
    atmosphere: {
      title: 'Atmosphere',
      accessor: 'atmosphere_type'
    },
    volcanism: {
      title: 'Volcanism',
      accessor: 'volcanism_type'
    },
    terraforming: {
      title: 'Terraforming',
      render: (body: RawSystemBody) => {
        return body.terraforming_state && body.terraforming_state !== ''
          ? body.terraforming_state
          : 'No Data';
      }
    },
    commander: {
      title: 'Discovered By',
      render: (body: RawSystemBody) => {
        return <Link className="hover:underline text-blue-200" href={'#'}>
          {body.discovered_by.startsWith('CMDR') ? body.discovered_by : `CMDR ${body.discovered_by}`}
        </Link>;
      }
    },
    discovered: {
      title: 'Discovered On',
      render: (body: RawSystemBody) => {
        return formatDate(body.discovered_at);
      }
    },
  };
  
  return (
    <Table
      columns={columns}
      data={rows}
    />
  );
};

export default memo(SystemBodiesTable);