
'use client';

import { usePathname } from 'next/navigation';
import { FunctionComponent, useEffect, useState } from 'react';
import { System,
  SystemCelestial as ISystemCelestial,
  MappedSystemCelestial,
  CelestialType,
} from '../../lib/interfaces/System';
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

const SystemPage: FunctionComponent = () => {
  const [system, setSystem] = useState<System>(systemState);
  const [schedule, setSchedule] = useState<Pagination<Schedule>>(paginatedScheduleState);
  const [isLoading, setLoading] = useState(true);
  const [systemMap, setSystemMap] = useState<SystemMap>();

  const [selectedBody, setSelectedBody] = useState<MappedSystemCelestial>();
  const [selectedBodyIndex, setSelectedBodyIndex] = useState<number>(0);

  const path = usePathname();
  const slug = path.split('/').pop();

  systemDispatcher.addEventListener('select-celestial', (event) => {
    setSelectedBody((event.message as MappedSystemCelestial));
  })

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

        const star = map.stars.find(s => s.is_main_star === 1);
        setSelectedBody(star);

        getCollection<Schedule>('fleet/schedule', {
          departure: system.name,
          withCarrierInformation: 1,
          withSystemInformation: 1,
        }).then((schedule) => {
          setSchedule(schedule);
          setLoading(false);
        });

      });
    }
  }, [slug]);

  function renderCelestials(map: SystemMap) {
    function handleStarIndexChange() {
      let index = selectedBodyIndex + 1;
      if (typeof map.stars[index] === 'undefined' || map.stars[index].type === CelestialType.Null) {
        index = 0;
      }
  
      setSelectedBody(map.stars[index]);
      setSelectedBodyIndex(index);
    }

    const singleOrbitalStar = map.stars.length === 2 && map.stars[1].type === CelestialType.Null;

    return (
      <>
        <div className="flex items-center content-center gap-4">
          {selectedBody && <>
            <div className="flex shrink-0 items-center md:border-r md:pe-12 md:border-neutral-700 md:rounded-full">
              {renderCelestial(selectedBody)}
              {!singleOrbitalStar && <div className="ms-6 text-glow__orange hover:cursor-pointer hover:scale-125">
                <i className={'icarus-terminal-chevron-down text-glow__orange hover:text-glow__blue'}
                  onClick={handleStarIndexChange}></i>
              </div>}
            </div>
            <div className="hidden md:flex w-full items-center gap-4">
              {renderCelestialChildren(selectedBody)}
            </div>
          </>}
        </div>
      </>
    );
  }

  function renderCelestial(celestial: MappedSystemCelestial) {
    let classes = `text-glow__white text-sm`;
    if (celestial.is_main_star) {
      classes += ` w-main-star`
    } else {
      classes = ` w-32`
    }

    return (
      <SystemCelestial key={celestial.id64}
        id={celestial.id64}
        system={system.name}
        selected={selectedBody as ISystemCelestial}
        celestial={celestial as ISystemCelestial}
        orbiting={(celestial._children ? celestial._children.length : 0)}
        dispatcher={systemDispatcher}
        className={classes} />
    );
  }

  function renderCelestialChildren(celestial: MappedSystemCelestial) {
    const celestials = (celestial._children && celestial._children.length > 0)
      ? celestial._children
      : false;

      if (! celestials) {
        return <span className="text-glow__orange uppercase ms-4">
          {celestial.name} {celestial.type} has no directly orbiting celestial bodies
        </span>;
      }

      return <>
        <span className="text-xs text-neutral-500">&lt;</span>
        {celestials.map((celestial: MappedSystemCelestial) => renderCelestial(celestial))}
      </>;
  }

  return (
    <>
      {isLoading && <Loader visible={isLoading} />}

      <div className="pb-5 border-b border-neutral-800">
        <SystemTitle title={system.name} celestials={system.bodies.length}/>
      </div>

      <SystemInformation coords={system.coords} information={system.information} />

      <div className="py-5 w-7xl overflow">
        <Heading icon="icarus-terminal-system-bodies" title="System Bodies" className="gap-2 pb-10" />
        
        {!isLoading && systemMap && systemMap.objectsInSystem.length > 0
          ? renderCelestials(systemMap)
          : <div className="text-glow__orange uppercase text-center mx-auto py-6">Telemetry data not found for {system.name}</div>
        }
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

export default SystemPage;
  