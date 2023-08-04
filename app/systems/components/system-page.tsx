
'use client';

import { usePathname } from 'next/navigation';
import { FunctionComponent, useEffect, useState } from 'react';
import { System,
  SystemCelestialBody,
  MappedSystemCelestialBody,
  CelestialType,
} from '../../lib/interfaces/System';
import { Schedule } from '../../lib/interfaces/Schedule';
import { Pagination } from '../../lib/interfaces/Pagination';
import { systemState } from '../lib/systems';
import { paginatedScheduleState } from '../../departures/lib/departures';
import { getCollection, getResource } from '../../lib/api';
import { systemDispatcher } from '../../lib/events/system';
import SystemMap from '../lib/system-map';
import SystemTitle from './system-title';
import SystemInformation from './system-information';
import SystemBody from './system-body';
import DepartureTable from '../../departures/components/departure-table';
import Loader from '../../components/loader';
import Heading from '../../components/heading';

// System page.
//
// For reference, terminology used:
// - celestials: all celestial objects (stars, planets, stations, outposts, beacons)
// - bodies: subset of celestial objects (stars, planets)

const SystemPage: FunctionComponent = () => {
  const [system, setSystem] = useState<System>(systemState);
  const [schedule, setSchedule] = useState<Pagination<Schedule>>(paginatedScheduleState);
  const [isLoading, setLoading] = useState<boolean>(true);
  const [systemMap, setSystemMap] = useState<SystemMap>();
  const [selectedBody, setSelectedBody] = useState<MappedSystemCelestialBody>();
  const [selectedBodyIndex, setSelectedBodyIndex] = useState<number>(0);

  const path = usePathname();
  const slug = path.split('/').pop();

  useEffect(() => {
    if (slug) {
      setLoading(true);

      // Fetch systems along with system information (e.g. governance, economy, security etc.)
      // and orbiting bodies
      getResource<System>(`systems/${slug}`, {
        withInformation: 1,
        withBodies: 1
      }).then((system) => {
        setSystem(system);
        
        // Map system bodies (e.g stars, planets and moons) into their respective orbits through
        // a parent-child relationship.
        // 
        // This map contains bodies of type MappedSystemCelestial, which contain the same properties
        // as SystemCelestial with extra _children, _label, _type used for mapping.
        const map = new SystemMap(system);
        setSystemMap(map);

        // Fetch the main star in the system.
        const star = map.stars.find(s => s.is_main_star === 1);
        setSelectedBody(star);

        // Set the selected system body when the user selects a body.
        systemDispatcher.addEventListener('select-body', (event) => {
          setSelectedBody((event.message as MappedSystemCelestialBody));
        });
      
        // Reset the selected body when the user selects go back to primary star.
        systemDispatcher.addEventListener('set-index', (event) => {
          const index = (event.message as number);
          if (index === 0) {
            setSelectedBody(star);
          }
        });

        // Fetch scheduled fleet departures departing from this system along with carrier information
        // e.g. carrier name, identifier, commander and departure/destination system information.
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

  function renderSystemBodies(map: SystemMap) {
    // Handle user selection to allow switching between stars and orbiting bodies.
    function handleSelectedBodyChange() {
      let index = selectedBodyIndex + 1;
      if (typeof map.stars[index] === 'undefined' || map.stars[index].type === CelestialType.Null) {
        index = 0;
      }
  
      setSelectedBody(map.stars[index]);
      setSelectedBodyIndex(index);
    }

    // If map contains two objects, a star and "additional objects not directly orbiting" then
    // this system has only one primary star, this flag is useful for conditonally rendering certain
    // ui elements that are only needed if we have multiple primary stars, for example, select buttons.
    const singlePrimaryStar = map.stars.length === 2 && map.stars[1].type === CelestialType.Null;

    return (
      <>
        <div className="flex items-center content-center">
          {selectedBody && <>
            <div className="flex shrink-0 items-center md:border-r md:pe-12 md:border-neutral-700 md:rounded-full">
              {renderSystemBody(selectedBody, singlePrimaryStar)}
              {<div className={'hidden md:inline ms-6 text-glow__orange ' + (!singlePrimaryStar ? 'hover:cursor-pointer hover:scale-125' : '')}>
                <i className={'icarus-terminal-chevron-down ' + (singlePrimaryStar ? 'text-neutral-700' : 'text-glow__orange hover:text-glow__blue ')}
                  onClick={handleSelectedBodyChange}></i>
              </div>}
            </div>
            <div className="hidden md:flex md:flex-wrap w-full items-center">
              {renderSystemBodyChildren(selectedBody)}
            </div>
          </>}
        </div>
      </>
    );
  }

  // Render a system body - an interactive SVG with conditional filters depending on body type.
  function renderSystemBody(body: MappedSystemCelestialBody, singleton = false) {
    let classes = 'text-glow__white text-sm';
    if (body.is_main_star) {
      classes += ' w-main-star';
    } else {
      classes = ' w-40';
    }

    return (
      <SystemBody
        key={body.id64}
        system={system.name}
        selected={selectedBody as SystemCelestialBody}
        body={body as SystemCelestialBody}
        orbiting={(body._children ? body._children.length : 0)}
        singleton={singleton}
        dispatcher={systemDispatcher}
        className={classes} />
    );
  }

  // Render body's orbiting bodies - maps each orbiting body to be rendered using renderSystemBody.
  function renderSystemBodyChildren(body: MappedSystemCelestialBody) {
    const bodies = (body._children && body._children.length > 0)
      ? body._children
      : false;

      if (! bodies) {
        return <span className="text-glow__orange uppercase ms-4">
          {body.name} {body.type} has no directly orbiting celestial bodies
        </span>;
      }

      return <>
        <span className="text-xs text-neutral-500">&lt;</span>
        {bodies.map((body: MappedSystemCelestialBody) => renderSystemBody(body))}
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
          ? renderSystemBodies(systemMap)
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
  