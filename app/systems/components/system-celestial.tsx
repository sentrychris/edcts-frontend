import { FunctionComponent, memo } from 'react';
import Icons from '../../icons';
import { SystemCelestial } from '../../lib/interfaces/System';
import { Dispatcher } from '../../lib/interfaces/Dispatcher';

interface Props {
  id: number;
  celestial: SystemCelestial;
  system: string;
  main?: boolean;
  orbiting?: number;
  dispatcher: Dispatcher;
  className?: string;
}

const SystemCelestial: FunctionComponent<Props> = ({
  id,
  celestial,
  system,
  main,
  orbiting,
  className
}) => {
  // System configs
  const radius = celestial.radius;
  let r = 2000;
  if (radius && radius <= 2500) r = 800;
  if (radius && radius > 2500 && radius <= 20000) r = 1200;
  if (radius && radius > 20000) r = 2000;

  let useLargerViewBox = false;
  if (celestial.rings) useLargerViewBox = true;
  if (celestial.sub_type === 'Neutron Star') useLargerViewBox = true;
  if (celestial.sub_type.startsWith('White Dwarf')) useLargerViewBox = true;
  if (celestial.sub_type === 'Black Hole') useLargerViewBox = true;

  const CORRECT_FOR_IMAGE_OFFSET_X = 250;
  const CORRECT_FOR_IMAGE_OFFSET_Y = 200;

  const imageX = 0 - CORRECT_FOR_IMAGE_OFFSET_X;
  const imageY = 0 - CORRECT_FOR_IMAGE_OFFSET_Y;

  const displayName = main ? celestial.name : celestial.name.split(system).pop()?.trim();

  const shortSubType = (subType: string) => {
    let value = subType;
    if (subType === 'High metal content world') value = 'High metal';
    if (subType === 'Class I gas giant') value = 'Gas giant';
    if (subType === 'M (Red dwarf) Star') value = 'M Red dwarf';
    if (subType === 'White Dwarf (DA) Star') value = 'DA White dwarf';
  
    value = value.replace('world', '');

    return value;
  };

  return (
    <div className="flex gap-1 items-center">
      <svg viewBox={useLargerViewBox ? '-4000 -4000 8000 8000' : '-2500 -2500 5000 5000'} preserveAspectRatio="xMinYMid meet" className={className}>
        <g className="system-map__system-object"
          data-system-object-name={celestial.name}
          data-system-object-type={celestial.type}
          data-system-object-sub-type={celestial.sub_type}
          // data-system-object-small={true}
          data-system-object-atmosphere={celestial.atmosphere_type}
          data-system-object-landable={celestial.is_landable === 1 ? true : false}
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
              {celestial.rings && celestial.rings.length > 0 && <>
                <defs>
                  <mask
                    id={`planet-ring-mask-${id}`}
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
                  mask={`url(#planet-ring-mask-${id})`}
                  opacity='1'
                />
                <ellipse
                  className='system-map__planet-ring'
                  cx={0}
                  cy={0 - (r / 80)}
                  rx={r * 1.85}
                  ry={r / 4.2}
                  mask={`url(#planet-ring-mask-${id})`}
                  opacity='.25'
                />
              </>}
            </g>
            {celestial.is_landable === 1 && <svg
              className='system-map__planetary-lander-icon'
              x={imageX+200}
              y={imageY+200}
            >
              {Icons.get('planet-landable')}
            </svg>}
            {celestial.rings && <svg
              className='system-map__planetary-port-icon'
              x={imageX+1000}
              y={imageY+1000}
            >
              {Icons.get('planet-ringed')}
            </svg>}
          </g>
        </g>
      </svg>
      <div className="star_information uppercase text-xs">
        <p className="whitespace-nowrap">{displayName}</p>
        <p className="w-16" style={{fontSize: '0.6rem'}}>{shortSubType(celestial.sub_type)}</p>
        {main && orbiting && <span className="text-glow-orange text-xs">{(orbiting)} orbiting bodies found</span>}
      </div>
    </div>
  );
};

export default memo(SystemCelestial);