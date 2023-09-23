
'use client';

import { usePathname } from 'next/navigation';
import { FunctionComponent, useEffect, useState } from 'react';
import { MappedSystemBody, SystemBodyResource, SystemBodyRing } from '../../lib/interfaces/SystemBody';
import { SystemBodyType } from '../../lib/constants/system';
import { getResource } from '../../lib/api';
import { systemBodyState } from '../lib/store';
import { systemDispatcher } from '../../lib/events/SystemDispatcher';
import SystemBody from './system-body';
import Loader from '../../components/loader';
import SystemBodyTitle from './system-body-title';
import { formatDate, formatNumber } from '../../lib/util';
import Heading from '../../components/heading';

interface Props {
  initBody?: SystemBodyResource;
}

const SystemBodyPage: FunctionComponent<Props> = ({ initBody }) => {
  const [systemBody, setSystemBody] = useState<SystemBodyResource>(initBody !== undefined ? initBody : systemBodyState);
  
  const [isLoading, setLoading] = useState<boolean>(true);

  const path = usePathname();
  const slug = path.split('/').pop();

  useEffect(() => {
    if (slug) {
      setLoading(true);

      // Fetch bodies along with system
      getResource<SystemBodyResource>(`bodies/${slug}`, {
        withSystem: 1,
        withstations: 1
      }).then((body) => {
        setSystemBody(body);
      }).finally(() => {
        setLoading(false);
      });
    }
  }, [slug]);

  return (
    <>
      {isLoading && <Loader visible={isLoading} />}

      <div className="pb-5 border-b border-neutral-800">
        <SystemBodyTitle
          title={systemBody.name}
          ringed={(systemBody.rings && systemBody.rings.length > 0 ? true : false)}
          system={systemBody.system}
        />
      </div>

      
      {!isLoading && systemBody &&
        <div className="rounded">          
          <p className="flex flex-col gap-x-2 text-sm py-5 border-b border-neutral-800">
            <span>Discovered by <span className="text-glow__orange">CMDR {systemBody.discovery.commander}</span></span>
            <span>at {formatDate(systemBody.discovery.date)}</span>
          </p>

          <div className="flex flex-row items-center gap-x-24 text-sm border-b border-neutral-800 py-5">
            <div>
              <Heading
                icon={'text-glow__orange me-2 icarus-terminal-' + (systemBody.type === SystemBodyType.Star ? 'star' : 'planet')}
                title="Overview"
              />
              <p className={'flex items-center gap-x-2 mt-2.5'}>
                <span>{systemBody.type}</span> - <span>{systemBody.sub_type}</span>
              </p>

              {systemBody.type === SystemBodyType.Star &&
                <div>
                  <div className="flex items-center gap-2 pb-2.5">
                    <p>Class: <span className="ms-1">{systemBody.spectral_class}</span></p>
                    <p>({systemBody.luminosity} luminosity)</p>
                  </div>
                  <p>Is Main Star: {systemBody.is_main_star
                    ? <span className="ms-1 text-green-300">Yes</span>
                    : <span className="ms-1 text-red-300">No</span>}
                  </p>
                  <p className="mb-2.5">Is scoopable: {systemBody.is_scoopable
                    ? <span className="ms-1 text-green-300">Yes</span>
                    : <span className="ms-1 text-red-300">No</span>}
                  </p>
                  <p>Solar masses: {systemBody.solar_masses}</p>
                  <p>Solar radius: {systemBody.solar_radius}</p>
                </div>
              }

              {systemBody.type === SystemBodyType.Planet &&
                <>
                  <p className="pb-2.5">Distance to Main Star: <span className="ms-1">
                    {formatNumber(systemBody.distance_to_arrival as number)}
                  </span></p>
                  <p className={'flex items-center gap-x-2'}>
                    <span>Is Landable:</span> <span>{systemBody.is_landable
                      ? <span className="text-green-300">Yes</span>
                      : <span className="text-red-300">No</span>
                    }</span>
                  </p>
                  <p className={'flex items-center gap-x-2'}>
                    <span>Gravity:</span> <span>{systemBody.gravity.toFixed(2)}</span>
                  </p>
                  <p className={'flex items-center gap-x-2 mb-2.5'}>
                    <span>Surface temp:</span> <span>{formatNumber(systemBody.surface_temp as number)} K</span>
                  </p>

                  <p className={'flex items-center gap-x-2'}>
                    <span>Atmosphere:</span> <span>{systemBody.atmosphere_type}</span>
                  </p>
                  <p className={'flex items-center gap-x-2 mb-2.5'}>
                    <span>Volcanism:</span> <span>{systemBody.volcanism_type}</span>
                  </p>

                  <p>
                    <span>{systemBody.terraforming_state ?? 'No Terraforming Data'}</span>
                  </p>
                </>
              }
            </div>
            <div>
              <SystemBody
                system={systemBody.name}
                body={systemBody as MappedSystemBody}
                view="body"
                orbiting={(systemBody._children ? systemBody._children.length : 0)}
                dispatcher={systemDispatcher}
                className={`text-glow__white text-sm w-48`} />
            </div>
          </div>
       
         {systemBody.rings && systemBody.rings.length > 0 &&
            <div className="flex items-center gap-x-20 border-b border-neutral-800 mt-2.5 pb-2.5 text-sm">
              <div>
                <Heading
                  icon="icarus-terminal-planet-ringed text-glow__orange me-2"
                  title="Ring Information"
                />
                <div className="mt-2">
                  {systemBody.rings.map((ring: SystemBodyRing) => {
                    return (
                      <div key={ring.mass} className="mb-2">
                        <p className="text-glow__orange">{ring.name}</p>
                        <p>Type: {ring.type}</p>
                        <p>Mass: {formatNumber(ring.mass)} KG</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          }

          <div className="py-5">
            <Heading
              icon="icarus-terminal-settlement text-glow__orange me-2"
              title="Stations"
            />
          </div>
        </div>
      }
    </>
  );
};

export default SystemBodyPage;
  