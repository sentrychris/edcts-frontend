
'use client';

import { usePathname } from 'next/navigation';
import { FunctionComponent, useEffect, useState } from 'react';
import { System, SystemCelestial as ISystemCelestial } from '../../lib/interfaces/System';
import { Schedule } from '../../lib/interfaces/Schedule';
import { Pagination } from '../../lib/interfaces/Pagination';
import { systemState } from '../lib/systems';
import { paginatedScheduleState } from '../../departures/lib/departures';
import { getCollection, getResource } from '../../lib/api';
import { systemDispatcher } from '../../lib/events/system';
import SystemMap from '../lib/mapper';
import DepartureTable from '../../departures/components/departure-table';
import SystemInformation from './system-information';
import SystemCelestial from './system-celestial';
import Loader from '../../components/loader';
import SystemTitle from './system-title';
import Heading from '../../components/heading';

const SystemDetail: FunctionComponent = () => {
  const [system, setSystem] = useState<System>(systemState);
  const [schedule, setSchedule] = useState<Pagination<Schedule>>(paginatedScheduleState);
  const [isLoading, setLoading] = useState(true);
  const [systemMap, setSystemMap] = useState<SystemMap>();

  const path = usePathname();
  const slug = path.split('/').pop();

  useEffect(() => {
    if (slug) {
      setLoading(true);

      getResource<System>(`systems/${slug}`, {
        withInformation: 1,
        withBodies: 1
      }).then((system) => {
        setSystem(system);
        const map = new SystemMap(system);
        console.log({ map });
        setSystemMap(map);

        getCollection<Schedule>('fleet/schedule', {
          departure: system.name,
          withCarrierInformation: 1,
          withSystemInformation: 1,
        }).then((schedule) => {

          setSchedule(schedule);
          
          setTimeout(() => {
            setLoading(false);
          }, 500);
        });

      });
    }
  }, [slug]);

  function renderMainStar(celestials: ISystemCelestial[]) {
    return (
      <SystemCelestial key={celestials[0].id64}
        id={celestials[0].id64}
        celestial={celestials[0]}
        system={system.name}
        main={true}
        orbiting={(celestials.length-1)}
        dispatcher={systemDispatcher}
        className="w-32 text-glow-white text-sm" />
    );
  }

  function renderCelestials(
    celestials: ISystemCelestial[],
    {slice, filter, level}: {slice?: number[] | null, filter?: 'Planet' | 'Star', level?: number}
  ) {
    const [start, end] = slice ?? [0, celestials.length];

    return celestials.filter((c: ISystemCelestial) => {
      return (filter ? c.type === filter : true)
        && (level ? c.parents && c.parents.length === level : true);
    }).slice(start, end).map((celestial: ISystemCelestial) => {
      return (
        <SystemCelestial key={celestial.id64}
          id={celestial.id64}
          celestial={celestial}
          system={system.name}
          dispatcher={systemDispatcher}
          className="w-32 text-glow-white text-sm" />
      );
    });
  }

  return (
    <>
      {isLoading && <Loader visible={isLoading} />}
      <div className="pb-3 border-b border-neutral-800">
        <SystemTitle title={system.name}
          celestials={system.bodies.length}/>
      </div>
      <SystemInformation coords={system.coords} information={system.information} />
      <div className="py-10 w-7xl overflow">
        <Heading icon="icarus-terminal-system-bodies" title="System Bodies" className="gap-2 pb-5" />
        {!isLoading && system.bodies && system.bodies.length > 0 ?
        <div className="flex items-center content-center gap-4">
          <div className="border-r pe-12 border-neutral-700 rounded-full">{renderMainStar(system.bodies)}</div>
          <div className="flex items-center gap-3">
            <span className="text-xs">L1 Orbitals</span>
            {renderCelestials(system.bodies, {
              level: 1,
              slice: [0, 8]
            })}
          </div>
        </div>
        : <div>No celestial bodies found in this system...</div>}
      </div>
      <div className="py-5">
        <Heading icon="icarus-terminal-route" title="Scheduled Departures" className="gap-2 pb-5" />
        {!isLoading && 
          <DepartureTable schedule={schedule} />
        }
      </div>
    </>
  );
};

export default SystemDetail;
  