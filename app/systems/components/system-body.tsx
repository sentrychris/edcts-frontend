import { FunctionComponent, memo } from 'react';
import { CelestialBody, MappedCelestialBody } from '../../lib/interfaces/Celestial';
import { SystemDispatch } from '../../lib/events/system';
import Icons from '../../icons';

interface Props {
  body: MappedCelestialBody;
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
  let useLargerViewBox = false;
  if (body.rings) useLargerViewBox = true;
  if (body.sub_type === 'Neutron Star') useLargerViewBox = true;
  if (body.sub_type && body.sub_type.startsWith('White Dwarf')) useLargerViewBox = true;
  if (body.sub_type === 'Black Hole') useLargerViewBox = true;

  const bodyIsSelectedUserFocus = (selected?.id64 === body.id64);

  const displayName = bodyIsSelectedUserFocus
    ? body.name
    : body.name.split(system).pop()?.trim();

  const radius = !bodyIsSelectedUserFocus
    ? body._r
    : 2000;

  return (
    <div className={`flex items-center ` + (body.rings && ` gap-3`)}>
      <svg
        viewBox={useLargerViewBox ? '-4000 -4000 8000 8000' : '-2500 -2500 5000 5000'}
        preserveAspectRatio="xMinYMid meet"
        className={className}>
        <g className="system-map__system-object"
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
        <p className="text-label__small text-glow whitespace-nowrap">
          {body.sub_type}
        </p>
        <span
          className={'flex items-center gap-2 text-glow__orange hover:text-glow__blue hover:scale-110 hover:cursor-grabbing  ' + (bodyIsSelectedUserFocus ? 'text-sm' : 'text-label__small')}
          onClick={() => dispatcher.selectBody({ body: body as CelestialBody })}
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