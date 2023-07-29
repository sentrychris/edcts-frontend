import { FunctionComponent, memo } from 'react';

interface Props {
  id: number;
  name: string;
  type: string;
  subType: string;
  main?: boolean;
  orbiting?: number;
  ringed?: boolean;
  className?: string;
}

const r = 2000;

const SystemCelestial: FunctionComponent<Props> = ({id, name, type, subType, main, orbiting, ringed, className}) => {
  return (
    <>
      <svg viewBox="-4000 -4000 8000 8000" preserveAspectRatio="xMinYMid meet" className={className}>
        <g className="system-map__system-object" data-system-object-type={type}
          data-system-object-sub-type={subType}
          data-system-object-name={name}
          tabIndex={0}>
          <g className="system-map__body">
            <g className="system-map__planet">
              <circle cx="50" cy="50" r={r}></circle>
              <circle className="system-map__planet-surface" cx="50" cy="50" r={r}></circle>
              {ringed && <>
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
          </g>
        </g>
      </svg>
      <div className="star_information uppercase">
        <p className="whitespace-nowrap">{name}</p>
        <p className="whitespace-nowrap text-xs">{subType}</p>
        {main && orbiting && <span className="text-glow-orange text-sm">{(orbiting)} orbiting bodies found</span>}
      </div>
    </>
  );
};

export default memo(SystemCelestial);