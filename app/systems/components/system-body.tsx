'use client';

import { FunctionComponent, memo, useCallback, useState } from 'react';
import { MappedCelestialBody } from '../../lib/interfaces/Celestial';
import { SystemDispatcher } from '../../lib/events/SystemDispatcher';
import { CIRCLE_DEG } from '../../lib/constants/math';
import Icons from '../../icons';

interface Props {
  body: MappedCelestialBody;
  system: string;
  selected?: MappedCelestialBody;
  orbiting?: number;
  dispatcher: SystemDispatcher;
  className?: string;
}

const SystemBody: FunctionComponent<Props> = ({
  body,
  system,
  selected,
  orbiting,
  dispatcher,
  className
}) => {
  const bodyIsSelectedUserFocus = (selected?.id64 === body.id64);

  const displayName = bodyIsSelectedUserFocus
    ? body.name
    : body.name.split(system).pop()?.trim();

  const radius = !bodyIsSelectedUserFocus
    ? (body._r ? body._r : 2000)
    : 2000;

  const useLargerViewBox = () => {
    if (body.rings || body.sub_type === 'Neutron Star'
      || body.sub_type === 'Black Hole') return true;
      
    if (body.sub_type && body.sub_type.startsWith('White Dwarf')) return true;
  
    return false;
  };

  const largeViewbox = useLargerViewBox();

  const shortSubType = (text?: string) => {
    if (!text) text = body.sub_type ?? body.type;
    if (body.name === 'Earth') return 'Home';

    const lowerText = text.toLowerCase();
    if (lowerText.includes('{{') || lowerText.includes('metal')) return 'Metal';
    if (lowerText.includes('{{') || lowerText.includes('gas giant')) return 'Gas Giant';
    if (lowerText.includes('{{') || lowerText.includes('rocky ice')) return 'Rocky Ice';
    if (lowerText.includes('{{') || lowerText.includes('earth-like')) return 'Earth-Like';

    return text;
  };

  const calculateIconCoords = () => {
    const pos = {
      x: radius * Math.sin(Math.PI),
      y: ((radius * Math.cos(Math.PI) + CIRCLE_DEG * 2) / 2),
    };

    if (bodyIsSelectedUserFocus) {
      pos.x += CIRCLE_DEG * 2;
      pos.y += CIRCLE_DEG * 4;
    }

    return pos;
  }; 
  
  const [iconCoords, setIconCoords] = useState(calculateIconCoords());

  const selectedBodyGCircleElement = useCallback((node: SVGGElement) => {
    if (node) {
      node.addEventListener('click', () => {
        const { top, left, right, bottom, width, height } = node.getBoundingClientRect();
        dispatcher.displayBodyInformationWidget({
          body,
          closer: largeViewbox,
          position: { top, left, right, bottom, width, height }
        });

        setIconCoords(calculateIconCoords());
      });
    }
  }, [body, dispatcher, largeViewbox]);

  return (
    <div className={'flex items-center ' + (body.rings && ' gap-3')}>
      <svg
        viewBox={largeViewbox ? '-4000 -4000 8000 8000' : '-2500 -2500 5000 5000'}
        preserveAspectRatio="xMinYMid meet"
        className={className}
      >
        <g
          className="system-map__system-object hover:cursor-help"
          ref={selectedBodyGCircleElement}
          data-system-object-name={body.name}
          data-system-object-type={body._type}
          data-system-object-small={body._small}
          data-system-object-sub-type={body.sub_type}
          data-system-object-atmosphere={body.atmosphere_type}
          data-system-object-landable={body.is_landable === 1 ? true : false}
          tabIndex={0}>
          <g className="system-map__body">
            <g className="system-map__planet">
              <circle
                cx={0}
                cy={0}
                r={radius}
              />
              <circle
                className="system-map__planet-surface"
                cx={0}
                cy={0}
                r={radius}
              />
              {body.rings && body.rings.length > 0 && <>
                <defs>
                  <mask
                    id={`planet-ring-mask-${body.id64}`}
                    className='system-map__planet-ring-mask'
                  >
                    <ellipse
                      cx={0}
                      cy={0}
                      rx={radius * 2}
                      ry={radius / 3}
                      fill='white'
                    />
                    <ellipse
                      cx={0}
                      cy={0 - (radius / 5)}
                      rx={radius}
                      ry={radius / 3}
                      fill='black'
                    />
                    <ellipse
                      cx={0}
                      cy={0 - (radius / 15)}
                      rx={radius * 1.2}
                      ry={radius / 5}
                      fill='black'
                    />
                  </mask>
                </defs>
                <ellipse
                  className='system-map__planet-ring'
                  cx={0}
                  cy={0}
                  rx={radius * 2}
                  ry={radius / 3}
                  mask={`url(#planet-ring-mask-${body.id64})`}
                  opacity='1'
                />
                <ellipse
                  className='system-map__planet-ring'
                  cx={0}
                  cy={0 - (radius / 80)}
                  rx={radius * 1.85}
                  ry={radius / 4.2}
                  mask={`url(#planet-ring-mask-${body.id64})`}
                  opacity='.25'
                />
              </>}
            </g>

            {body.is_landable && <svg
              className='text-xs system-map__planetary-lander-icon'
              x={iconCoords.x}
              y={iconCoords.y}
            >
              {Icons.get('planet-landable')}
            </svg>}

          </g>
        </g>
      </svg>
      <div className="star_information uppercase text-sm tracking-wide">
        <p className="text-glow">
          {displayName}
        </p>
        
        <p className="text-xs text-glow whitespace-nowrap">
          {shortSubType(body.sub_type)}
        </p>
        
        <div className="flex flex-row items-center gap-2">
          <span
            className={'flex whitespace-nowrap items-center gap-2 text-glow__orange  ' +
              (bodyIsSelectedUserFocus
                ? 'text-sm'
                : 'hover:text-glow__blue hover:scale-110 hover:cursor-grabbing')
            }
            onClick={() => dispatcher.selectBody({ body })}
          >
            <i className="icarus-terminal-system-bodies text-label__small"></i>
            {(orbiting)} {bodyIsSelectedUserFocus ? 'orbiting bodies found' : ''}
          </span>


          {! bodyIsSelectedUserFocus && body._planetary_bases && body._planetary_bases.length > 0 && 
          <span
            className={'flex whitespace-nowrap items-center gap-2 text-glow__blue  ' +
              (bodyIsSelectedUserFocus
                ? 'text-sm'
                : 'hover:text-glow__orange hover:scale-110 hover:cursor-grabbing')
            }
            onClick={() => dispatcher.selectBody({ body })}
          >
            <i className="icarus-terminal-settlement text-label__small"></i>
            {(body._planetary_bases.length)} {bodyIsSelectedUserFocus ? 'planetary settlements found' : ''}
          </span>
          }
        </div>
        
        {bodyIsSelectedUserFocus && ! body.is_main_star &&
        <span
          className="flex items-center gap-2 text-label__small text-glow__blue hover:scale-105 hover:cursor-pointer"
          onClick={() => dispatcher.setIndex(0)}>
            <i className="icarus-terminal-chevron-up text-label__small"></i>
            Go back to top
        </span>}
      </div>
    </div>
  );
};

export default memo(SystemBody);