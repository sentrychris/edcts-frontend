import { FunctionComponent } from "react";

interface Props {
  system: string;
  starType: string;
  small: string;
  className?: string;
}

const SystemStar: FunctionComponent<Props> = ({system, starType, small, className}) => {
  return (
    <>
    <svg style={{position: 'absolute', height: 0, margin: 0, padding: 0, top: '-100px'}}>
      <defs>
        <filter id="svg-filter__star-glow">
          <feOffset dx="0" dy="0"/>
          <feGaussianBlur stdDeviation="500" result="offset-blur"/>
          <feComposite operator="out" in="SourceGraphic" in2="offset-blur" result="inverse"/>
          <feFlood flood-color="rgba(255,0,0,.5)" flood-opacity="1" result="color"/>
          <feComposite operator="in" in="color" in2="inverse" result="shadow"/>
          <feComponentTransfer in="shadow" result="shadow"><feFuncA type="linear" slope="1"/></feComponentTransfer>
          <feComposite operator="over" in="shadow" in2="SourceGraphic"/>
        </filter>
        <filter id="svg-filter__star-glow--light">
          <feOffset dx="0" dy="0"/>
          <feGaussianBlur stdDeviation="500" result="offset-blur"/>
          <feComposite operator="out" in="SourceGraphic" in2="offset-blur" result="inverse"/>
          <feFlood flood-color="rgba(255,0,0,.25)" flood-opacity="1" result="color"/>
          <feComposite operator="in" in="color" in2="inverse" result="shadow"/>
          <feComponentTransfer in="shadow" result="shadow"><feFuncA type="linear" slope="1"/></feComponentTransfer>
          <feComposite operator="over" in="shadow" in2="SourceGraphic"/>
        </filter>
      </defs>
    </svg>
    <svg viewBox="-2500 -2500 5000 5000" preserveAspectRatio="xMinYMid meet" className={className}>
      <g className="system-map__system-object" data-system-object-type="Star"
         data-system-object-sub-type={starType}
         data-system-object-small={small}
         data-system-object-name={system}
         tabIndex={0}>
        <g className="system-map__body">
          <g className="system-map__planet">
            <circle id="navigation-panel__17858" cx="0" cy="0" r="2000"></circle>
            <circle className="system-map__planet-surface" cx="0" cy="0" r="2000"></circle>
          </g>
        </g>
      </g>
    </svg>
    </>
  );
}

export default SystemStar;