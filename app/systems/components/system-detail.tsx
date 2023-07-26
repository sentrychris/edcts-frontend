
'use client';

import { System } from '../../../interfaces/System';
import { defaultState as systemState, getSystem } from '../systems';
import { paginatedState, getAllScheduledCarrierTrips } from '../../departures/departures';
import DepartureTable from '../../departures/components/departure-table';
import SystemInformation from './system-information';
import SystemStar from './system-star';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Schedule } from '@/interfaces/Schedule';
import { Pagination } from '@/interfaces/Pagination';

const SystemDetail = () => {
  const [system, setSystem] = useState<System>(systemState);
  const [schedule, setSchedule] = useState<Pagination<Schedule>>(paginatedState);
  const [isLoading, setLoading] = useState(false);

  const path = usePathname();
  const slug = path.split('/').pop();

  useEffect(() => {
    if (slug) {
      setLoading(true);
      getSystem(slug).then((system) => {
        setSystem(system);
        getAllScheduledCarrierTrips('fleet/schedule', {
          departure: system.name
        }).then((schedule) => {
          setSchedule(schedule);
          setLoading(false);
        });
      })
    }
  }, []);

  return (
    <>
      <div className="pb-3 border-b border-neutral-800">
        <div className="flex gap-2 items-center text-glow-white">
          <i className="icarus-terminal-system-orbits" style={{fontSize: "1.5rem"}}></i>
          <h2 className="uppercase text-3xl">{system.name} system</h2>
        </div>
        <h4 className="text-glow-orange font-bold uppercase">32 bodies found in system</h4>
      </div>
      <SystemInformation information={system.information} />
      <div className="grid grid-cols-12 gap-5 py-5">
        <div className="col-span-3">
          <h2 className="text-glow-white uppercase pb-5">Primary Star</h2>
          <div className="flex items-center content-center gap-2">
            <SystemStar system={system.name} starType="F4 (WHITE) STAR" small="false" className="w-20 text-glow-white" />
            <div className="star_information uppercase">
              <h2>F4 (White) Star</h2>
              <span className="text-glow-orange">31 orbiting bodies found</span>
            </div>
          </div>
        </div>
        <div className="col-span-9">
          <h2 className="text-glow-white uppercase pb-5">Scheduled Departures</h2>
          {!isLoading && 
            <DepartureTable schedule={schedule}/>
          }
        </div>
      </div>
    </>
  );
};

export default SystemDetail;
  