import { FunctionComponent, memo } from 'react';
import { CelestialBody } from '../../lib/interfaces/System';
import { SystemDispatch } from '../../lib/events/system';
import Icons from '../../icons';

interface Props {
  body: CelestialBody;
  system: string;
  selected?: CelestialBody;
  orbiting?: number;
  singleton?: boolean;
  dispatcher: SystemDispatch;
  className?: string;
}

const SystemBody: FunctionComponent<Props> = ({
  body,
  system,
  selected,
  orbiting,
  singleton,
  dispatcher,
  className
}) => {
  // System configs
  let radius = 2000;
  if (body.radius && body.radius <= 2500) radius = 1000;
  if (body.radius && body.radius > 2500 && body.radius <= 5000) radius = 1200;
  if (body.radius && body.radius > 5000 && body.radius <= 7500) radius = 1400;
  if (body.radius && body.radius > 7500 && body.radius <= 10000) radius = 1600;
  if (body.radius && body.radius > 10000 && body.radius <= 15000) radius = 1800;
  if (body.radius && body.radius > 20000) radius = 2000;

  let useLargerViewBox = false;
  if (body.rings) useLargerViewBox = true;
  if (body.sub_type === 'Neutron Star') useLargerViewBox = true;
  if (body.sub_type.startsWith('White Dwarf')) useLargerViewBox = true;
  if (body.sub_type === 'Black Hole') useLargerViewBox = true;

  const imageX = 250;
  const imageY = 200;

  const bodyIsSelectedUserFocus = (selected?.id64 === body.id64);

  const displayName = bodyIsSelectedUserFocus
    ? body.name
    : body.name.split(system).pop()?.trim();

  return (
    <div className="flex gap-1 items-center">
      <svg
        viewBox={useLargerViewBox ? '-4000 -4000 8000 8000' : '-2500 -2500 5000 5000'}
        preserveAspectRatio="xMinYMid meet"
        className={className + ' hover:cursor-pointer'}
        onClick={() => dispatcher.selectBody({ body })}>
        <g className="system-map__system-object"
          data-system-object-name={body.name}
          data-system-object-type={body.type}
          data-system-object-sub-type={body.sub_type}
          data-system-object-atmosphere={body.atmosphere_type}
          data-system-object-landable={body.is_landable === 1 ? true : false}
          tabIndex={0}>
          <g className="system-map__body">
            <g className="system-map__planet">
              <circle
                cx="0"
                cy="0"
                r={radius}
              />
              <circle
                className="system-map__planet-surface"
                cx="0"
                cy="0"
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
              className='system-map__planetary-lander-icon'
              x={imageX+100}
              y={imageY+200}
            >
              {Icons.get('planet-landable')}
            </svg>}
            {body.rings && <svg
              className='system-map__planetary-port-icon'
              x={imageX+1000}
              y={imageY+1000}
            >
              {Icons.get('planet-ringed')}
            </svg>}
          </g>
        </g>
      </svg>
      <div className="star_information uppercase text-sm tracking-wide">
        <p className="text-glow">
          {displayName}
        </p>
        <p className="text-label__small text-glow whitespace-nowrap">
          {body.sub_type}
        </p>
        <span
          className={'flex items-center gap-2 text-glow__orange ' + (bodyIsSelectedUserFocus ? 'text-sm' : 'text-label__small')}>
          <i className="icarus-terminal-system-bodies text-label__small"></i>
          {(orbiting)} {bodyIsSelectedUserFocus && 'orbiting bodies found'}
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