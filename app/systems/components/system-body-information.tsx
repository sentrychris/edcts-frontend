'use client';

import { XMarkIcon } from '@heroicons/react/24/outline';
import { MappedCelestialBody } from '../../lib/interfaces/Celestial';
import { CelestialBodyType } from '../../lib/constants/celestial';
import { formatDate } from '../../lib/util';
import { useCallback, useEffect, useRef, useState } from 'react';

interface Props {
  body: MappedCelestialBody|null;
  closer: boolean;
  position: { top: number, left: number, right: number, bottom: number };
  callback?: () => void;
}

export default function SystemBodyInformation({ body, closer, position, callback }: Props) {
  const CONTAINER_WIDTH = 500;
  const OFFSET_LEFT = closer ? 50 : 100;
  const POSITION_LEFT = position.left + OFFSET_LEFT;
  const MAX_WIDTH = window.innerWidth;
  const OFFSET_POSITION_LEFT = POSITION_LEFT + CONTAINER_WIDTH;

  const [centerFocus, setCenterFocus] = useState<{x: number, y: number}>({x: 0, y: 0});
  const bodyInformationRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (bodyInformationRef.current) {
      const {left, top, width} = bodyInformationRef.current.getBoundingClientRect();

      setCenterFocus({
        x: (left + width / 2),
        y: (top + width / 2)
      });
    }
  }, [bodyInformationRef])

  let style = {
    width: CONTAINER_WIDTH,
    top: position.top
  }

  style = OFFSET_POSITION_LEFT >= MAX_WIDTH
    ? {...style, ...{right: (position.top-100)}}
    : {...style, ...{left: POSITION_LEFT}}

  return (
    <div className="absolute w-2/5" style={style}>
      {body &&
        <div ref={bodyInformationRef} className="fx-fade-in p-3 rounded-lg backdrop-filter backdrop-blur bg-black/80 border border-orange-400/40 shadow shadow-orange-400/40 slideout-panel">
          <div className="flex items-center justify-between border-b border-neutral-800 pb-2.5">
            <h2 className="text">Cartographic Information</h2>
            <XMarkIcon
              className="hover:text-glow__orange hover:cursor-pointer hover:scale-125"
              onClick={callback}
              height={20} width={20} />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-1 mt-2.5 mb-1 text-lg">
            <p className="flex items-center gap-x-2">
              <i className="icarus-terminal-system-bodies text-glow__orange"></i>
              <span>{body.name}</span>
            </p>
            {body._children && <p className="text-sm text-glow__blue">{body._children.length} orbital bodies</p>}
          </div>
          
          <p className="flex flex-col gap-x-2 text-sm pb-5 border-b border-neutral-800">
            <span>Discovered by <span className="text-glow__orange">CMDR {body.discovered_by}</span></span>
            <span>at {formatDate(body.discovered_at)}</span>
          </p>

          <p className="flex items-center gap-x-2 mt-2.5 mb-1">
            <i className={`text-glow__orange icarus-terminal-` + (body.type === CelestialBodyType.Star ? `star` : `planet`)}></i>
            <span>Type</span>
          </p>
          <p className={`flex items-center gap-x-2 ` + (body.type !== CelestialBodyType.Star && ` border-b border-neutral-800 pb-2.5`)}>
            <span>{body.type}</span> - <span>{body.sub_type}</span>
          </p>

          {body.type === CelestialBodyType.Star &&
            <div className="text-sm border-b border-neutral-800 pb-5">
              <div className="flex items-center gap-2 mb-2.5">
                <p>Class: <span className="ms-1">{body.spectral_class}</span></p>
                <p>({body.luminosity} luminosity)</p>
              </div>
              <p>Is Main Star: {body.is_main_star
                ? <span className="ms-2 text-green-300">Yes</span>
                : <span className="ms-2 text-red-300">No</span>}
              </p>
              <p className="mb-2.5">Is scoopable: {body.is_scoopable
                ? <span className="ms-2 text-green-300">Yes</span>
                : <span className="ms-2 text-red-300">No</span>}
              </p>
              <p>Solar masses: {body.solar_masses}</p>
              <p>Solar radius: {body.solar_radius}</p>
            </div>
          }

          <div className="flex items-center gap-x-20 border-b border-neutral-800 mt-2.5">
            <div>
              <p className="flex items-center gap-x-2">
                <i className="icarus-terminal-planet text-glow__orange"></i>
                <span>Orbital Information</span>
              </p>
              <div className="text-sm mt-1">
                <p>Period: <span>{body.orbital_period?.toFixed(6)}</span></p>
                <p>Inclination: <span>{body.orbital_inclination?.toFixed(6)}</span></p>
                <p>Eccentricity: <span>{body.orbital_eccentricity?.toFixed(6)}</span></p>
              </div>
            </div>
            <div>
              <p className="flex items-center gap-x-2">
                <i className="icarus-terminal-planet text-glow__orange"></i>
                <span>Axial Information</span>
              </p>
              <div className="text-sm mt-1">
                <p>Axial tilt: <span>{body.axial_tilt?.toFixed(6)}</span></p>
                <p>Semi-major axis: <span>{body.semi_major_axis?.toFixed(6)}</span></p>
                <p>Arg of periapsis: <span>{body.arg_of_periapsis?.toFixed(6)}</span></p>
              </div>
            </div>
          </div>
        </div>
      }
    </div>
  );
}