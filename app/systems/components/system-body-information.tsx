'use client';

import { XMarkIcon } from '@heroicons/react/24/outline';
import { CelestialRing, MappedCelestialBody } from '../../lib/interfaces/Celestial';
import { CelestialBodyType } from '../../lib/constants/celestial';
import { formatDate, formatNumber } from '../../lib/util';
import { SystemDispatcher } from '../../lib/events/SystemDispatcher';

interface Props {
  body: MappedCelestialBody|null;
  closer: boolean;
  position: {
    top: number,
    left: number,
    right: number,
    bottom: number,
    width: number,
    height: number,
  };
  dispatcher: SystemDispatcher;
  close?: () => void;
}

export default function SystemBodyInformation({ body, closer, position, dispatcher, close }: Props) {
  const MIN_N = 100;
  const MAX_N = 160;
  const CONTAINER_WIDTH = 500;
  const MAX_WIDTH = window.innerWidth;
  const OFFSET = closer ? MIN_N : (body?.is_main_star ? MAX_N : MIN_N);
  const POSITION_LEFT = position.left + OFFSET;
  const OFFSET_POSITION_LEFT = POSITION_LEFT + CONTAINER_WIDTH;

  const bounds = document.body.getBoundingClientRect();

  const OFFSET_Y = position.top - bounds.top;
  const OFFSET_X = position.left - bounds.top;

  let style = {
    width: CONTAINER_WIDTH,
    top: OFFSET_Y
  };

  style = OFFSET_POSITION_LEFT >= MAX_WIDTH
    ? {...style, ...{right: (position.top-100)}}
    : {...style, ...{left: POSITION_LEFT}};

  return (
    <div className="fx-fade-in system-body-information__container galaxy-background fx-animated-text w-2/5 uppercase tracking-wider text-xs" style={style}>
      {body && <>
        <div className="rounded backdrop-filter backdrop-blur bg-gradient-to-br from-sky-900/50 via-black/20 to-black/20 ">
          <div className="system-body-information__container--header py-2.5 px-3 font-bold text-sm">
            <h2 className="text mt-1">Cartographical Data</h2>
            <XMarkIcon
              className="hover:text-glow__orange hover:cursor-pointer hover:scale-125"
              onClick={close}
              height={20} width={20} />
          </div>
          
          <div className="px-3 border rounded-b-lg border-orange-500/60">
            <div className="grid grid-cols-1 md:grid-cols-1 mt-2.5 mb-1 text-lg">
              <p className="flex items-center gap-x-2">
                <i className="icarus-terminal-system-bodies text-glow__orange"></i>
                <span className="text-glow__orange">{body.name}</span>
              </p>
              {body._children &&
                <p className="text-sm text-glow__blue hover:underline hover:cursor-pointer"
                  onClick={() => {
                    dispatcher.selectBody({ body });
                    if (close) close();
                  }}
                >
                  {body._children.length} orbital bodies
                </p>
              }
            </div>
            
            <p className="flex flex-col gap-x-2 text-sm pb-5 border-b border-neutral-800">
              <span>Discovered by <span className="text-glow__orange">CMDR {body.discovered_by}</span></span>
              <span>at {formatDate(body.discovered_at)}</span>
            </p>

            <p className="flex items-center gap-x-2 mt-2.5 mb-2 text-sm">
              <i className={'text-glow__orange icarus-terminal-' + (body.type === CelestialBodyType.Star ? 'star' : 'planet')}></i>
              <span>Body Information</span>
            </p>
            <p className={'flex items-center gap-x-2'}>
              <span>{body.type}</span> - <span>{body.sub_type}</span>
            </p>

            {body.type === CelestialBodyType.Star &&
              <div className="text-xs border-b border-neutral-800 pb-2.5">
                <div className="flex items-center gap-2 pb-2.5">
                  <p>Class: <span className="ms-1">{body.spectral_class}</span></p>
                  <p>({body.luminosity} luminosity)</p>
                </div>
                <p>Is Main Star: {body.is_main_star
                  ? <span className="ms-1 text-green-300">Yes</span>
                  : <span className="ms-1 text-red-300">No</span>}
                </p>
                <p className="mb-2.5">Is scoopable: {body.is_scoopable
                  ? <span className="ms-1 text-green-300">Yes</span>
                  : <span className="ms-1 text-red-300">No</span>}
                </p>
                <p>Solar masses: {body.solar_masses}</p>
                <p>Solar radius: {body.solar_radius}</p>
              </div>
            }

            {body.type === CelestialBodyType.Planet &&
              <>
                <p className="pb-2.5">Distance to Main Star: <span className="ms-1">
                  {formatNumber(body.distance_to_arrival as number)}
                </span></p>
                <p className={'flex items-center gap-x-2 text-xs'}>
                  <span>Is Landable:</span> <span>{body.is_landable
                    ? <span className="text-green-300">Yes</span>
                    : <span className="text-red-300">No</span>
                  }</span>
                </p>
                <p className={'flex items-center gap-x-2 text-xs'}>
                  <span>Gravity:</span> <span>{body.gravity?.toFixed(2)}</span>
                </p>
                <p className={'flex items-center gap-x-2 text-xs mb-2.5'}>
                  <span>Surface temp:</span> <span>{formatNumber(body.surface_temp as number)} K</span>
                </p>

                <p className={'flex items-center gap-x-2 text-xs'}>
                  <span>Atmosphere:</span> <span>{body.atmosphere_type}</span>
                </p>
                <p className={'flex items-center gap-x-2 text-xs mb-2.5'}>
                  <span>Volcanism:</span> <span>{body.volcanism_type}</span>
                </p>

                <p className="border-b border-neutral-800 pb-2.5 ">
                  <span>{body.terraforming_state}</span>
                </p>
              </>
            }

            <div className="flex items-start gap-x-20 border-b border-neutral-800 mt-2.5 pb-2.5">
              <div>
                <p className="flex items-center gap-x-2 text-sm">
                  <i className="icarus-terminal-planet text-glow__orange"></i>
                  <span>Orbital Information</span>
                </p>
                <div className="mt-2">
                  <p>Period: <span className="ms-1">{body.orbital_period?.toFixed(6)}</span></p>
                  <p>Inclination: <span className="ms-1">{body.orbital_inclination?.toFixed(6)}</span></p>
                  <p>Eccentricity: <span className="ms-1">{body.orbital_eccentricity?.toFixed(6)}</span></p>
                </div>
              </div>
              <div>
                <p className="flex items-center gap-x-2 text-sm">
                  <i className="icarus-terminal-planet text-glow__orange"></i>
                  <span>Axial Information</span>
                </p>
                <div className="mt-2">
                  <p>Axial tilt: <span className="ms-1">{body.axial_tilt?.toFixed(6) ?? 0}</span></p>
                  <p>Semi-major axis: <span className="ms-1">{body.semi_major_axis?.toFixed(6) ?? 0}</span></p>
                  <p>Arg of periapsis: <span className="ms-1">{body.arg_of_periapsis?.toFixed(6) ?? 0}</span></p>
                  {body.type === CelestialBodyType.Planet && <p className="mt-1">Tidally locked: <span>
                    {body.is_tidally_locked
                      ? <span className="ms-1 text-green-300">Yes</span>
                      : <span className="ms-1 text-red-300">No</span>
                    }
                  </span></p>}
                </div>
              </div>
            </div>

            {body.rings && body.rings.length > 0 &&
              <div className="flex items-center gap-x-20 border-b border-neutral-800 mt-2.5 pb-2.5">
                <div>
                  <p className="flex items-center gap-x-2 text-sm">
                    <i className="icarus-terminal-planet-ringed text-glow__orange"></i>
                    <span>Ring Information</span>
                  </p>
                  <div className="mt-2">
                    {body.rings.map((ring: CelestialRing) => {
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
        </div>
      </>}
    </div>
  );
}