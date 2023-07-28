
'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { System } from '../../interfaces/System';
import { Schedule } from '../../interfaces/Schedule';
import { Pagination } from '../../interfaces/Pagination';
import { systemState, getSystem } from '../systems';
import { paginatedScheduleState, getAllScheduledCarrierTrips } from '../../departures/departures';
import DepartureTable from '../../departures/components/departure-table';
import SystemInformation from './system-information';
import SystemCelestial from './system-celestial';
import Loader from '../../components/loader';
import SystemTitle from './system-title';
import Heading from '../../components/heading';

const SystemDetail = () => {
  const [system, setSystem] = useState<System>(systemState);
  const [schedule, setSchedule] = useState<Pagination<Schedule>>(paginatedScheduleState);
  const [isLoading, setLoading] = useState(true);

  const path = usePathname();
  const slug = path.split('/').pop();

  useEffect(() => {
    if (slug) {
      setLoading(true);
      getSystem(slug, {
        withInformation: 1,
        withBodies: 1
      }).then((system) => {
        setSystem(system);
        getAllScheduledCarrierTrips('fleet/schedule', {
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
  }, []);

  return (
    <>
      {isLoading && <Loader visible={isLoading} />}
      <div className="pb-3 border-b border-neutral-800">
        <SystemTitle title={system.name} celestials={system.bodies.length} />
      </div>
      <SystemInformation coords={system.coords} information={system.information} />
      <div className="py-5 w-7xl overflow">
        <Heading icon="icarus-terminal-system-bodies" title="System Bodies" className="gap-2 pb-5" />
        {system.bodies.length > 0 ? <div className="flex items-center content-center gap-4">
          {!isLoading && system.bodies.length > 0 && <SystemCelestial name={system.bodies[0].name}
            type={system.bodies[0].type}
            subType={system.bodies[0].sub_type}
            main={true}
            total={system.bodies.length}
            className="w-32 text-glow-white"
          />}
          {!isLoading && system.bodies && system.bodies.slice(1, 7).map(body => {
            return (
              <SystemCelestial key={body.name} name={body.name}
                type={body.type}
                subType={body.sub_type}
                className="w-20 text-glow-white text-sm" />
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
  