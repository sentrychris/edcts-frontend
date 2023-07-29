
'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { System } from '../../interfaces/System';
import { Schedule } from '../../interfaces/Schedule';
import { Pagination } from '../../interfaces/Pagination';
import { systemState } from '../service/systems';
import { paginatedScheduleState } from '../../departures/service/departures';
import DepartureTable from '../../departures/components/departure-table';
import SystemInformation from './system-information';
import SystemCelestial from './system-celestial';
import Loader from '../../components/loader';
import SystemTitle from './system-title';
import Heading from '../../components/heading';
import { getCollection, getResource } from '@/app/service/api';

const SystemDetail = () => {
  const [system, setSystem] = useState<System>(systemState);
  const [schedule, setSchedule] = useState<Pagination<Schedule>>(paginatedScheduleState);
  const [isLoading, setLoading] = useState(true);

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

  const mainCelestial = system.bodies[0];

  return (
    <>
      {isLoading && <Loader visible={isLoading} />}
      <div className="pb-3 border-b border-neutral-800">
        <SystemTitle title={system.name}
          celestials={system.bodies.length}
          special="(Collection of Wonders)"/>
      </div>
      <SystemInformation coords={system.coords} information={system.information} />
      <div className="py-5 w-7xl overflow">
        <Heading icon="icarus-terminal-system-bodies" title="System Bodies" className="gap-2 pb-5" />
        {system.bodies.length > 0 ? <div className="flex items-center content-center gap-4">
          {!isLoading && system.bodies.length > 0 &&
          <SystemCelestial
            id={mainCelestial.id}
            name={mainCelestial.name}
            type={mainCelestial.type}
            subType={mainCelestial.sub_type}
            main={true}
            orbiting={(system.bodies.length-1)}
            ringed={mainCelestial.rings && mainCelestial.rings.length > 0}
            className="w-48 text-glow-white"
          />}
          {!isLoading && system.bodies && system.bodies.slice(1, 6).map(body => {
            return (
              <SystemCelestial key={body.id}
                id={body.id}
                name={body.name}
                type={body.type}
                subType={body.sub_type}
                ringed={body.rings && body.rings.length > 0}
                className="w-32 text-glow-white text-sm" />
            );
          })}
        </div> : <div>No celestial bodies found in this system...</div>}
      </div>
      <div className="py-5">
        <Heading icon="icarus-terminal-route" title="Scheduled Departures" className="gap-2 pb-5" />
        {!isLoading && 
          <DepartureTable schedule={schedule}/>
        }
      </div>
    </>
  );
};

export default SystemDetail;
  