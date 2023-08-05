'use client';

import Link from 'next/link';
import { FunctionComponent, useState } from 'react';
import { CelestialBody } from '../../lib/interfaces/Celestial';
import Table from '../../components/table';
import { formatDate } from '../../lib/util';

interface Props {
  bodies: CelestialBody[];
  system: string;
}

const SystemBodiesTable: FunctionComponent<Props> = ({ bodies, system }) => {
  const [rows] = useState(bodies);

  const columns = {
    name: {
      title: 'Name - Type',
      render: (body: CelestialBody) => {
        return <Link className="hover:underline text-blue-200" href={'#'}>
          {body.name.split(system).pop()?.trim()}
        </Link>;
      }
    },
    sub_type: {
      title: 'Type',
      accessor: 'sub_type'
    },
    landable: {
      title: 'Landable',
      render: (body: CelestialBody) => {
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
      accessor: 'terraforming_state'
    },
    commander: {
      title: 'Discovered By',
      render: (body: CelestialBody) => {
        return <Link className="hover:underline text-blue-200" href={'#'}>
          {body.discovered_by.startsWith('CMDR') ? body.discovered_by : `CMDR ${body.discovered_by}`}
        </Link>;
      }
    },
    discovered: {
      title: 'Discovered On',
      render: (body: CelestialBody) => {
        return formatDate(body.discovered_at);
      }
    },
  };
  
  return (
    <Table columns={columns} data={rows.filter((s: CelestialBody) => s.type !== 'Star')} />
  );
};

export default SystemBodiesTable;