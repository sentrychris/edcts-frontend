
'use client';

import { System } from '../../../interfaces/System';
import { defaultState as systemState, getSystem } from '../systems';
import { paginatedState, getAllScheduledCarrierTrips } from '../../departures/departures';
import DepartureTable from '../../departures/components/departure-table';
import SystemInformation from './system-information';
import SystemBody from './system-body';
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
        <h4 className="text-glow-orange font-bold uppercase">8 bodies found in system</h4>
      </div>
      <SystemInformation information={system.information} />
      <div className="py-5 w-7xl overflow">
        <h2 className="text-glow-white uppercase pb-5">System Bodies</h2>
        <div className="flex items-center content-center gap-4">
          {!isLoading && system.bodies.length > 0 &&
          <SystemBody name={system.bodies[0].name}
            type={system.bodies[0].type}
            subType={system.bodies[0].sub_type}
            main={true}
            small="false"
            className="w-32 text-glow-white"
          />}
          <span className="me-10"></span>
          {!isLoading && system.bodies && system.bodies.slice(-7).map(body => {
            return (
              <SystemBody key={body.name} name={body.name}
                type={body.type}
                subType={`${body.type}`}
                small="false"
                className="w-20 text-glow-white" />
            );
          })}
        </div>
      </div>
      <div className="py-5">
        <h2 className="text-glow-white uppercase pb-5">Scheduled Departures</h2>
        {!isLoading && 
          <DepartureTable schedule={schedule}/>
        }
      </div>
    </>
  );
};

export default SystemDetail;
  