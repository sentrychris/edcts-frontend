'use client';

import { FunctionComponent, useState, memo } from 'react';
import Link from 'next/link';
import { RawSystemBody, MappedSystemBody } from '../../lib/interfaces/SystemBody';
import { formatDate, formatNumber } from '../../lib/util';
import { SystemDispatcher } from '../../lib/events/SystemDispatcher';
import Table from '../../components/table';

interface Props {
  stars: RawSystemBody[];
  system: string;
  dispatcher: SystemDispatcher;
}

const SystemStarsTable: FunctionComponent<Props> = ({ stars, system, dispatcher }) => {
  const [rows] = useState(stars);

  const columns = {
    name: {
      title: 'Name - Type',
      render: (star: RawSystemBody) => {
        let displayName = star.name.split(system).pop()?.trim();
        if (displayName === '') displayName = star.name;

        return <span
          className="text-blue-200 hover:text-glow__orange hover:underline hover:cursor-pointer"
          onClick={() => dispatcher.selectBody({ body: (star as MappedSystemBody) })}
        >
          {displayName} - {star.sub_type.replace('Star', '')}
        </span>;
      }
    },
    spectral_class: {
      title: 'Class',
      accessor: 'spectral_class'
    },
    main_star: {
      title: 'Is Main',
      render: (body: RawSystemBody) => {
        return body.is_main_star
          ? <span className="text-green-300">Yes</span>
          : <span className="text-red-300">No</span>;
      }
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
    scoopable: {
      title: 'Fuel',
      render: (body: RawSystemBody) => {
        return body.is_scoopable
          ? <span className="text-green-300">Yes</span>
          : <span className="text-red-300">No</span>;
      }
    },
    surface_temp: {
      title: 'Surface Temp',
      render: (body: RawSystemBody) => {
        return formatNumber(body.surface_temp) + ' K';
      }
    },
    solar_masses: {
      title: 'Sol Mass',
      accessor: 'solar_masses'
    },
    solar_radius: {
      title: 'Sol Radius',
      accessor: 'solar_radius'
    },
    magnitude: {
      title: 'Magnitude',
      accessor: 'absolute_magnitude'
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
      data={rows.filter((s: RawSystemBody) => s.name !== 'Additional Objects')}
    />
  );
};

export default memo(SystemStarsTable);