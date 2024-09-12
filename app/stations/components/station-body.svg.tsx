import type { System } from "@/core/interfaces/System";
import type { FunctionComponent } from "react";
import { SystemBodyType } from "@/core/constants/system";

interface Props {
  system: System;
}

const StationBodySVG: FunctionComponent<Props> = ({ system }) => {
  const star = system.bodies.find((body) => {
    return body.type === SystemBodyType.Star && body.is_main_star === 1;
  });

  return (
    <svg
      viewBox="-2500 -2500 5000 5000"
      preserveAspectRatio="xMinYMid meet"
      className="text-glow__white w-main-star text-sm"
    >
      <g
        className="system-map__system-object"
        data-system-object-name={system}
        data-system-object-type="Star"
        data-system-object-sub-type={star ? star.sub_type : "G (White-Yellow) Star"}
        data-system-object-landable="false"
        tabIndex={0}
      >
        <g className="system-map__body">
          <g className="system-map__planet">
            <circle cx="0" cy="0" r="2000"></circle>
            <circle className="system-map__planet-surface" cx="0" cy="0" r="2000"></circle>
          </g>
        </g>
      </g>
    </svg>
  );
};

export default StationBodySVG;
