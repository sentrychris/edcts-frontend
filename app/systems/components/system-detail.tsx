
'use client';

import { usePathname } from 'next/navigation';
import { FunctionComponent, useEffect, useState } from 'react';
import { System, SystemCelestial as ISystemCelestial, MappedSystemCelestial } from '../../lib/interfaces/System';
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

  function renderCelestial(celestial: MappedSystemCelestial) {
    return (
      <SystemCelestial key={celestial.id64}
        id={celestial.id64}
        system={system.name}
        celestial={celestial as ISystemCelestial}
        main={!!celestial.is_main_star}
        orbiting={(celestial._children.length)}
        dispatcher={systemDispatcher}
        className="w-32 text-glow-white text-sm" />
    );
  }

  function renderCelestialChildren(celestial: MappedSystemCelestial) {
    const celestials = celestial._children.length > 0
      ? celestial._children
      : false;

      if (! celestials) {
        return <>Celestial telemetry data not found for {system.name}</>
      }

      return celestials.map((celestial: MappedSystemCelestial) => renderCelestial(celestial));
  }

  function renderMappedCelestials(map: SystemMap) {
    const star = map.stars.find(s => !!s.is_main_star);

    return (
      <>
        <div className="flex items-center content-center gap-4">
          {star && <>
            <div className="border-r pe-12 border-neutral-700 rounded-full">
              {renderCelestial(star)}
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs">L1 Orbitals</span>
              {renderCelestialChildren(star)}
            </div>
          </>}
        </div>
      </>
    )
  }

  return (
    <>
      {isLoading && <Loader visible={isLoading} />}
      <div className="pb-3 border-b border-neutral-800">
        <SystemTitle title={system.name} celestials={system.bodies.length}/>
      </div>
      <SystemInformation coords={system.coords} information={system.information} />
      <div className="py-10 w-7xl overflow">
        <Heading icon="icarus-terminal-system-bodies" title="System Bodies" className="gap-2 pb-5" />
        {!isLoading && systemMap ? renderMappedCelestials(systemMap)
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
  