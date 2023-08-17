
'use client';

import { usePathname } from 'next/navigation';
import { FunctionComponent, useEffect, useState, useCallback } from 'react';
import { System } from '../../lib/interfaces/System';
import { RawSystemBody, MappedSystemBody, SystemBodyResource, SystemBodyRing } from '../../lib/interfaces/SystemBody';
import { SystemBodyType } from '../../lib/constants/system';
import { getResource } from '../../lib/api';
import { systemBodyState, systemState } from '../lib/store';
import { systemDispatcher } from '../../lib/events/SystemDispatcher';
import SystemMap from '../lib/system-map';
import SystemBody from './system-body';
import Loader from '../../components/loader';
import SystemBodyTitle from './system-body-title';
import SystemBodyInformation from './system-body-information';
import Link from 'next/link';
import { formatDate, formatNumber } from '../../lib/util';

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
          system={systemBody.system.name}
        />
      </div>

      
      {!isLoading && systemBody &&
        <div className="rounded">          
          <div className="grid grid-cols-1 md:grid-cols-1 mt-2.5 mb-1 text-lg">
            
            <p className="flex items-center gap-x-2">
              <i className="icarus-terminal-system-bodies text-glow__orange"></i>
              <Link className="text-glow__orange" href={`/systems/system/${systemBody.system.slug}/body/${systemBody.slug}`}>
                {systemBody.name}
              </Link>
            </p>
          </div>
          
          <p className="flex flex-col gap-x-2 text-sm pb-5 border-b border-neutral-800">
            <span>Discovered by <span className="text-glow__orange">CMDR {systemBody.discovery.commander}</span></span>
            <span>at {formatDate(systemBody.discovery.date)}</span>
          </p>

          <p className="flex items-center gap-x-2 mt-2.5 mb-2.5 text-sm">
            <i className={'text-glow__orange icarus-terminal-' + (systemBody.type === SystemBodyType.Star ? 'star' : 'planet')}></i>
            <span>Body Information</span>
          </p>
          <p className={'flex items-center gap-x-2'}>
            <span>{systemBody.type}</span> - <span>{systemBody.sub_type}</span>
          </p>

          {systemBody.type === SystemBodyType.Star &&
            <div className="border-b border-neutral-800 pb-2.5">
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

              <p className="border-b border-neutral-800 pb-5">
                <span>{systemBody.terraforming_state}</span>
              </p>
            </>
          }

          <div className="grid grid-cols-2 border-b border-neutral-800 mt-2.5 pb-2.5">
            <div>
              <p className="flex items-center gap-x-2 text-sm">
                <i className="icarus-terminal-planet text-glow__orange"></i>
                <span>Orbital Information</span>
              </p>
              <div className="mt-2">
                <p>Period: <span className="ms-1">{systemBody.orbital.orbital_period?.toFixed(6)}</span></p>
                <p>Inclination: <span className="ms-1">{systemBody.orbital.orbital_inclination?.toFixed(6)}</span></p>
                <p>Eccentricity: <span className="ms-1">{systemBody.orbital.orbital_eccentricity?.toFixed(6)}</span></p>
              </div>
            </div>
            <div>
              <p className="flex items-center gap-x-2 text-sm">
                <i className="icarus-terminal-planet text-glow__orange"></i>
                <span>Axial Information</span>
              </p>
              <div className="mt-2">
                <p>Axial tilt: <span className="ms-1">{systemBody.axial.axial_tilt?.toFixed(6) ?? 0}</span></p>
                <p>Semi-major axis: <span className="ms-1">{systemBody.axial.semi_major_axis?.toFixed(6) ?? 0}</span></p>
                {/* <p>Arg of periapsis: <span className="ms-1">{systemBody.axial.arg_of_periapsis?.toFixed(6) ?? 0}</span></p> */}
                {systemBody.type === SystemBodyType.Planet && <p className="mt-1">Tidally locked: <span>
                  {systemBody.axial.is_tidally_locked
                    ? <span className="ms-1 text-green-300">Yes</span>
                    : <span className="ms-1 text-red-300">No</span>
                  }
                </span></p>}
              </div>
            </div>
          </div>

          {systemBody.rings && systemBody.rings.length > 0 &&
            <div className="flex items-center gap-x-20 border-b border-neutral-800 mt-2.5 pb-2.5">
              <div>
                <p className="flex items-center gap-x-2 text-sm">
                  <i className="icarus-terminal-planet-ringed text-glow__orange"></i>
                  <span>Ring Information</span>
                </p>
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
        </div>
      }
    </>
  );
};

export default SystemBodyPage;
  