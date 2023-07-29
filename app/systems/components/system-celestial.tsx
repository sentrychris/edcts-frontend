import { FunctionComponent, memo } from 'react';

interface Props {
  name: string;
  type: string;
  subType: string;
  main?: boolean;
  total?: number;
  className?: string;
}

const SystemCelestial: FunctionComponent<Props> = ({name, type, subType, main, total, className}) => {
  return (
    <>
      <svg viewBox="-2500 -2500 5000 5000" preserveAspectRatio="xMinYMid meet" className={className}>
        <g className="system-map__system-object" data-system-object-type={type}
          data-system-object-sub-type={subType}
          data-system-object-name={name}
          tabIndex={0}>
          <g className="system-map__body">
            <g className="system-map__planet">
              <circle cx="0" cy="0" r="2000"></circle>
              <circle className="system-map__planet-surface" cx="0" cy="0" r="2000"></circle>
            </g>
          </g>
        </g>
      </svg>
      <div className="star_information uppercase">
        <p className="whitespace-nowrap">{name}</p>
        <p className="whitespace-nowrap text-xs">{subType}</p>
        {main && total && <span className="text-glow-orange text-sm">{total} orbiting bodies found</span>}
      </div>
    </>
  );
};

export default memo(SystemCelestial);