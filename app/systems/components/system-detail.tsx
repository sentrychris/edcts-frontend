
'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { System } from '../../interfaces/System';
import { Schedule } from '../../interfaces/Schedule';
import { Pagination } from '../../interfaces/Pagination';
import { defaultState as systemState, getSystem } from '../systems';
import { paginatedState, getAllScheduledCarrierTrips } from '../../departures/departures';
import DepartureTable from '../../departures/components/departure-table';
import SystemInformation from './system-information';
import SystemBody from './system-body';
import Loader from '../../components/loader';

const SystemDetail = () => {
  const [system, setSystem] = useState<System>(systemState);
  const [schedule, setSchedule] = useState<Pagination<Schedule>>(paginatedState);
  const [isLoading, setLoading] = useState(true);

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
        <div className="flex gap-2 items-center text-glow-white">
          <i className="icarus-terminal-system-orbits" style={{fontSize: '3rem'}}></i>
          <div>
            <h2 className="uppercase text-3xl">{system.name} system</h2>
            <h4 className="text-glow-orange font-bold uppercase">{system.bodies.length} bodies found in system</h4>
          </div>
        </div>
      </div>
      <SystemInformation coords={system.coords} information={system.information} />
      <div className="py-5 w-7xl overflow">
        <div className="flex items-center gap-2 pb-5">
          <i className="icarus-terminal-system-bodies"></i>
          <h2 className="text-glow-white uppercase">System Bodies</h2>
        </div>
        <div className="flex items-center content-center gap-4">
          {!isLoading && system.bodies.length > 0 &&
          <SystemBody name={system.bodies[0].name}
            type={system.bodies[0].type}
            subType={system.bodies[0].sub_type}
            main={true}
            total={system.bodies.length}
            className="w-32 text-glow-white"
          />}
          <span className="me-"></span>
          {!isLoading && system.bodies && system.bodies.slice(1, 7).map(body => {
            return (
              <SystemBody key={body.name} name={body.name}
                type={body.type}
                subType={body.sub_type}
                className="w-20 text-glow-white text-sm" />
            );
          })}
        </div>
      </div>
      <div className="py-5">
        <div className="flex items-center gap-2 pb-5">
          <i className="icarus-terminal-route"></i>
          <h2 className="text-glow-white uppercase">Scheduled Departures</h2>
        </div>
        {!isLoading && 
          <DepartureTable schedule={schedule}/>
        }
      </div>
    </>
  );
};

export default SystemDetail;
  