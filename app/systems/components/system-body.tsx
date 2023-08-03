import { FunctionComponent, memo } from 'react';
import { SystemCelestialBody } from '../../lib/interfaces/System';
import { SystemDispatch } from '../../lib/events/system';
import Icons from '../../icons';

interface Props {
  body: SystemCelestialBody;
  system: string;
  selected?: SystemCelestialBody;
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
  const radius = body.radius;
  let r = 2000;
  if (radius && radius <= 2500) r = 800;
  if (radius && radius > 2500 && radius <= 20000) r = 1200;
  if (radius && radius > 20000) r = 2000;

  let useLargerViewBox = false;
  if (body.rings) useLargerViewBox = true;
  if (body.sub_type === 'Neutron Star') useLargerViewBox = true;
  if (body.sub_type.startsWith('White Dwarf')) useLargerViewBox = true;
  if (body.sub_type === 'Black Hole') useLargerViewBox = true;

  const CORRECT_FOR_IMAGE_OFFSET_X = 250;
  const CORRECT_FOR_IMAGE_OFFSET_Y = 200;

  const imageX = 0 - CORRECT_FOR_IMAGE_OFFSET_X;
  const imageY = 0 - CORRECT_FOR_IMAGE_OFFSET_Y;

  const displayName = selected?.id64 === body.id64
    ? body.name
    : body.name.split(system).pop()?.trim();

  const shortSubType = (body: SystemCelestialBody) => {
    let value = body.sub_type;
    if (body.sub_type === 'High metal content world') value = 'High metal';
    if (body.sub_type === 'Class I gas giant') value = 'Gas giant';
    if (body.sub_type === 'M (Red dwarf) Star') value = 'M Red dwarf';
    if (body.sub_type === 'White Dwarf (DA) Star') value = 'DA White dwarf';
    if (body.name === 'Earth') value = 'Home';
  
    value = value.replace('world', '');

    return value;
  };

  const isSelected = (selected?.id64 === body.id64);

  return (
    <div className="flex gap-1 items-center">
      <svg
        viewBox={useLargerViewBox ? '-4000 -4000 8000 8000' : '-2500 -2500 5000 5000'}
        preserveAspectRatio="xMinYMid meet"
        className={className + ` hover:cursor-pointer`}
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
                r={r}
              />
              <circle
                className="system-map__planet-surface"
                cx="0"
                cy="0"
                r={r}
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
                      rx={r * 2}
                      ry={r / 3}
                      fill='white'
                    />
                    <ellipse
                      cx={0}
                      cy={0 - (r / 5)}
                      rx={r}
                      ry={r / 3}
                      fill='black'
                    />
                    <ellipse
                      cx={0}
                      cy={0 - (r / 15)}
                      rx={r * 1.2}
                      ry={r / 5}
                      fill='black'
                    />
                  </mask>
                </defs>
                <ellipse
                  className='system-map__planet-ring'
                  cx={0}
                  cy={0}
                  rx={r * 2}
                  ry={r / 3}
                  mask={`url(#planet-ring-mask-${body.id64})`}
                  opacity='1'
                />
                <ellipse
                  className='system-map__planet-ring'
                  cx={0}
                  cy={0 - (r / 80)}
                  rx={r * 1.85}
                  ry={r / 4.2}
                  mask={`url(#planet-ring-mask-${body.id64})`}
                  opacity='.25'
                />
              </>}
            </g>
            {body.is_landable && <svg
              className='system-map__planetary-lander-icon'
              x={imageX+200}
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
        <p className="text-glow">{displayName}</p>
        <p className="text-label__small text-glow whitespace-nowrap">
          {shortSubType(body)}
        </p>
        <span className={`flex items-center gap-2 text-glow__orange ` + (isSelected ? `text-sm` : `text-label__small`)}>
          <i className="icarus-terminal-system-bodies text-label__small"></i>
          {(orbiting)} {isSelected && `orbiting bodies found`}
        </span>
        {isSelected && ! singleton &&
        <span
          className="flex items-center gap-2 text-label__small text-glow__blue hover:scale-105 hover:cursor-pointer"
          onClick={() => dispatcher.setIndex(0)}>
            <i className="icarus-terminal-chevron-up text-label__small"></i>
            back to primary star
        </span>}
      </div>
    </div>
  );
};

export default memo(SystemBody);