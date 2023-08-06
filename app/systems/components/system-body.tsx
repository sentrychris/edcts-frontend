'use client';

import { FunctionComponent, memo, useCallback, useEffect, useState } from 'react';
import { CelestialBody, MappedCelestialBody } from '../../lib/interfaces/Celestial';
import { SystemDispatch } from '../../lib/events/system';
import Icons from '../../icons';

interface Props {
  body: MappedCelestialBody;
  system: string;
  selected?: MappedCelestialBody;
  orbiting?: number;
  dispatcher: SystemDispatch;
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
    ? body._r
    : 2000;

  const useLargerViewBox = () => {
    if (body.rings) return true;
    if (body.sub_type === 'Neutron Star') return true;
    if (body.sub_type && body.sub_type.startsWith('White Dwarf')) return true;
    if (body.sub_type === 'Black Hole') return true;

    return false;
  };

  const largeViewbox = useLargerViewBox();

  const shortSubType = (text?: string) => {
    if (! text) text = body.sub_type ?? body.type;
    if (body.name === 'Earth') return 'Home';
    if (text.match(/{{[^}]+}}|(metal)/i)) return 'Metal';
    if (text.match(/{{[^}]+}}|(gas giant)/i)) return 'Gas Giant';
    if (text.match(/{{[^}]+}}|(rocky ice)/i)) return 'Rocky Ice';
    if (text.match(/{{[^}]+}}|(earth-like)/i)) return 'Earth-Like';

    return text;
  };

  const selectedBodyGCircleElement = useCallback((node: SVGGElement) => {
    if (node) {
      node.addEventListener('click', () => {
        const { top, left, right, bottom, width, height } = node.getBoundingClientRect();
        dispatcher.displayBodyInfo({
          body,
          closer: largeViewbox,
          position: { top, left, right, bottom, width, height }
        });
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
          data-system-object-type={body.type}
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
              x={0}
              y={0}
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
        <span
          className={'flex whitespace-nowrap items-center gap-2 text-glow__orange  ' + (bodyIsSelectedUserFocus ? 'text-sm' : 'hover:text-glow__blue hover:scale-110 hover:cursor-grabbing')}
          onClick={() => dispatcher.selectBody({ body })}
        >
          <i className="icarus-terminal-system-bodies text-label__small"></i>
          {(orbiting)} {bodyIsSelectedUserFocus ? 'orbiting bodies found' : '...'}
        </span>
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