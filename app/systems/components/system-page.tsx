
'use client';

import { usePathname } from 'next/navigation';
import { FunctionComponent, useEffect, useState, useCallback } from 'react';
import { System } from '../../lib/interfaces/System';
import { CelestialBody, MappedCelestialBody } from '../../lib/interfaces/Celestial';
import { CelestialBodyType } from '../../lib/constants/celestial';
import { Schedule } from '../../lib/interfaces/Schedule';
import { Pagination } from '../../lib/interfaces/Pagination';
import { systemDispatcher } from '../../lib/events/system';
import { systemState } from '../lib/systems';
import { paginatedScheduleState } from '../../departures/lib/departures';
import { getCollection, getResource } from '../../lib/api';
import SystemMap from '../lib/system-map';
import SystemTitle from './system-title';
import SystemInformation from './system-information';
import SystemBody from './system-body';
import SystemBodyInformation from './system-body-information';
import SystemStarsTable from './system-stars-table';
import SystemBodiesTable from './system-bodies-table';
import Loader from '../../components/loader';
import Heading from '../../components/heading';

// System page.
//
// For reference, terminology used:
// - celestials: all celestial objects (stars, planets, stations, outposts, beacons)
// - bodies: subset of celestial objects (stars, planets)

interface Props {
  initSystem?: System;
  initSchedule?: Pagination<Schedule>;
}

const SystemPage: FunctionComponent<Props> = ({ initSystem, initSchedule }) => {
  const [system, setSystem] = useState<System>(initSystem !== undefined
    ? initSystem
    : systemState
  );
  
  const [schedule, setSchedule] = useState<Pagination<Schedule>>(initSchedule !== undefined
    ? initSchedule
    : paginatedScheduleState
  );
  
  const [isLoading, setLoading] = useState<boolean>(true);
  const [systemMap, setSystemMap] = useState<SystemMap>();
  const [selectedBody, setSelectedBody] = useState<MappedCelestialBody>();
  const [selectedBodyIndex, setSelectedBodyIndex] = useState<number>(0);
  const [selectedBodyDisplayInfo, setSelectedBodyDisplayInfo] = useState<{
    body: MappedCelestialBody|null,
    closer: boolean;
    position: {
      top: number,
      left: number,
      right: number,
      bottom: number,
      width: number,
      height: number
    }
  } | null>(null);

  const path = usePathname();
  const slug = path.split('/').pop();

  const scrollableBodies = useCallback((node: HTMLDivElement) => {
    let pos = {top: 0, left: 0, x: 0, y: 0};
    if (node) {
      node.scrollLeft = 0;

      node.addEventListener('mousedown', (e: MouseEvent) => {
        pos = {
          left: node.scrollLeft,
          top: node.scrollTop,
          x: e.clientX,
          y: e.clientY,
        };

        node.addEventListener('mousemove', mouseMoveHandler);
        node.addEventListener('mouseup', mouseUpHandler);
      });

      const mouseMoveHandler = (event: MouseEvent) => {
        const dx = event.clientX - pos.x;
        const dy = event.clientY - pos.y;

        node.scrollTop = pos.top - dy;
        node.scrollLeft = pos.left - dx;
      };
    
      const mouseUpHandler = () => {
        node.removeEventListener('mousemove', mouseMoveHandler);
        node.removeEventListener('mouseup', mouseUpHandler);
    
        node.style.cursor = 'grab';
        node.style.removeProperty('user-select');
      };
    }
  }, []);

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
          setSelectedBody((event.message as MappedCelestialBody));
        });
      
        // Reset the selected body when the user selects go back to primary star.
        systemDispatcher.addEventListener('set-index', (event) => {
          const index = (event.message as number);
          if (index === 0) {
            setSelectedBody(star);
          }
        });

        // Set the selected system body and position for the display info widet when the user selects a body.
        systemDispatcher.addEventListener('display-body-info', (event) => {
          setSelectedBodyDisplayInfo(event.message);
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
    function handleSelectedBodyChange(index: number) {
      if (index < 0 || typeof map.stars[index] === 'undefined' || map.stars[index].type === CelestialBodyType.Null) {
        index = 0;
      }
  
      setSelectedBody(map.stars[index]);
      setSelectedBodyIndex(index);
    }

    // If map contains two objects, a star and "additional objects not directly orbiting" then
    // this system has only one primary star, this flag is useful for conditonally rendering certain
    // ui elements that are only needed if we have multiple primary stars, for example, select buttons.
    // const singlePrimaryStar = map.stars.length === 2 && map.stars[1].type === CelestialBodyType.Null;

    return (
      <>
        <div className="flex items-center content-center">
          {selectedBody && <>
            <div className="flex shrink-0 items-center md:border-r md:pe-12 md:border-neutral-700 md:rounded-full">
              {<div className={'hidden md:flex flex-col me-6 text-glow__orange'}>
                <i className={'icarus-terminal-chevron-up text-glow__orange hover:text-glow__blue hover:cursor-pointer'}
                  onClick={() => handleSelectedBodyChange(selectedBodyIndex - 1)}></i>
                <i className={'icarus-terminal-chevron-down text-glow__orange hover:text-glow__blue hover:cursor-pointer'}
                  onClick={() => handleSelectedBodyChange(selectedBodyIndex + 1)}></i>
              </div>}
              {renderSystemBody(selectedBody)}
            </div>
            <div className="system-body__children hidden md:flex w-full items-center overflow-x-auto hover:cursor-move"
              ref={scrollableBodies}>
              {renderSystemBodyChildren(selectedBody)}
            </div>
          </>}
        </div>
      </>
    );
  }

  // Render a system body - an interactive SVG with conditional filters depending on body type.
  function renderSystemBody(body: MappedCelestialBody) {
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
        selected={selectedBody}
        body={body}
        orbiting={(body._children ? body._children.length : 0)}
        dispatcher={systemDispatcher}
        className={classes} />
    );
  }

  // Render body's orbiting bodies - maps each orbiting body to be rendered using renderSystemBody.
  function renderSystemBodyChildren(body: MappedCelestialBody) {
    const bodies = (body._children && body._children.length > 0)
      ? body._children
      : false;

      if (! bodies) {
        return <span className="text-glow__orange uppercase ms-4">
          {body.name} {body.type} has no directly orbiting celestial bodies
        </span>;
      }

      return bodies.map((body: MappedCelestialBody) => renderSystemBody(body));
  }

  return (
    <>
      {isLoading && <Loader visible={isLoading} />}

      <div className="pb-5 border-b border-neutral-800">
        <SystemTitle
          title={system.name}
          celestials={system.bodies.length}
        />
      </div>

      <SystemInformation
        coords={system.coords}
        information={system.information}
      />

      <div className="py-5 w-7xl overflow border-b border-neutral-800 backdrop-filter backdrop-blur bg-transparent">
        <Heading
          icon="icarus-terminal-system-bodies"
          title="System Overview"
          className="gap-2 pb-5"
        />    
        {!isLoading &&
        <div className="grid grid-cols-12">
          <div className="col-span-12">
            {systemMap && systemMap.objectsInSystem.length > 0
              
              ? renderSystemBodies(systemMap)

              : <div className="text-glow__orange text-lg font-bold uppercase text-center mx-auto py-6">
                  Telemetry data not found for {system.name}
                </div>
            }
          </div>
        </div>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-1 gap-5 py-5">
        <div>
          <Heading
            icon="icarus-terminal-star"
            title="Main Sequence Stars"
            className="gap-2 pb-5"
          />
          {!isLoading && systemMap &&
            <SystemStarsTable
              stars={systemMap.stars as CelestialBody[]}
              system={system.name}
            />
          }
        </div>
        <div>
          <Heading
            icon="icarus-terminal-system-orbits"
            title="Orbital Bodies"
            className="gap-2 pb-5"
          />
          {!isLoading && systemMap &&
            <SystemBodiesTable
              bodies={systemMap.objectsInSystem as CelestialBody[]}
              system={system.name}
            />
          }
        </div>
      </div>

      {selectedBodyDisplayInfo &&
        <SystemBodyInformation
          body={selectedBodyDisplayInfo.body}
          closer={selectedBodyDisplayInfo.closer}
          position={selectedBodyDisplayInfo.position}
          dispatcher={systemDispatcher}
          close={() => setSelectedBodyDisplayInfo(null)}
        />
      }
    </>
  );
};

export default SystemPage;
  