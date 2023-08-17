
'use client';

import { usePathname } from 'next/navigation';
import { FunctionComponent, useEffect, useState, useCallback } from 'react';
import { System } from '../../lib/interfaces/System';
import { RawSystemBody, MappedSystemBody } from '../../lib/interfaces/SystemBody';
import { SystemBodyType } from '../../lib/constants/system';
import { getResource } from '../../lib/api';
import { systemBodyState, systemState } from '../lib/store';
import { systemDispatcher } from '../../lib/events/SystemDispatcher';
import SystemMap from '../lib/system-map';
import SystemBody from './system-body';
import Loader from '../../components/loader';
import SystemBodyTitle from './system-body-title';

// System page.
//
// For reference, terminology used:
// - celestials: all celestial objects (stars, planets, stations, outposts, beacons)
// - bodies: subset of celestial objects (stars, planets)

interface Props {
  initBody?: RawSystemBody;
}

const SystemBodyPage: FunctionComponent<Props> = ({ initBody }) => {
  const [systemBody, setSystemBody] = useState<RawSystemBody>(initBody !== undefined ? initBody : systemBodyState);
  
  const [isLoading, setLoading] = useState<boolean>(true);
  const [systemMap, setSystemMap] = useState<SystemMap>();

  const path = usePathname();
  const slug = path.split('/').pop();

  useEffect(() => {
    if (slug) {
      setLoading(true);

      // Fetch systems along with system information (e.g. governance, economy, security etc.)
      // and orbiting bodies
      getResource<System>(`systems/${slug}`, {
        withInformation: 1,
        withBodies: 1,
        withStations: 1
      }).then((system) => {
        setSystem(system);
      }).finally(() => {
        setLoading(false);
      });
    }
  }, [slug]);

  // Render a system body - an interactive SVG with conditional filters depending on body type.
  function renderSystemBody(body: MappedSystemBody) {
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

  return (
    <>
      {isLoading && <Loader visible={isLoading} />}

      <div className="pb-5 border-b border-neutral-800">
        <SystemBodyTitle
          title={system.name}
          system={system.name}
        />
      </div>

      {/* 
      {selectedBodyDisplayInfo && systemMap &&
        <SystemBodyInformation
          body={selectedBodyDisplayInfo.body}
          system={systemMap}
          closer={selectedBodyDisplayInfo.closer}
          position={selectedBodyDisplayInfo.position}
          dispatcher={systemDispatcher}
          close={() => setSelectedBodyDisplayInfo(null)}
        />
      } */}
    </>
  );
};

export default SystemBodyPage;
  