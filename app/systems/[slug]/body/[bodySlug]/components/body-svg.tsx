import type { FunctionComponent } from "react";
import type { SystemBodyResource } from "@/core/interfaces/SystemBody";
import { SystemBodyType } from "@/core/constants/system";

interface Props {
  body: SystemBodyResource;
  size?: number;
}

const RADIUS = 2000;

/** Static SVG display for the body detail page — no dispatcher, no click. */
const BodySvg: FunctionComponent<Props> = ({ body, size = 280 }) => {
  const isLarge =
    !!body.rings?.length ||
    body.sub_type === "Neutron Star" ||
    body.sub_type === "Black Hole" ||
    (body.sub_type ?? "").startsWith("White Dwarf");

  const viewBox = isLarge ? "-4000 -4000 8000 8000" : "-2500 -2500 5000 5000";

  // Determine type — use sub_type to catch edge cases (Y-dwarf etc.)
  const objType =
    body.type === SystemBodyType.Star || body.sub_type?.includes("Star")
      ? SystemBodyType.Star
      : body.type;

  return (
    <svg
      viewBox={viewBox}
      preserveAspectRatio="xMidYMid meet"
      width={size}
      height={size}
      style={{ overflow: "visible" }}
    >
      <g
        className="system-map__system-object"
        data-system-object-type={objType}
        data-system-object-sub-type={body.sub_type}
        data-system-object-atmosphere={body.atmosphere_type}
        data-system-object-landable={body.is_landable === 1}
        data-system-object-small={false}
      >
        <g className="system-map__body">
          <g className="system-map__planet">
            <circle cx={0} cy={0} r={RADIUS} />
            <circle className="system-map__planet-surface" cx={0} cy={0} r={RADIUS} />

            {body.rings && body.rings.length > 0 && (
              <>
                <defs>
                  <mask id={`ring-mask-detail-${body.id}`} className="system-map__planet-ring-mask">
                    <ellipse cx={0} cy={0} rx={RADIUS * 2} ry={RADIUS / 3} fill="white" />
                    <ellipse cx={0} cy={0 - RADIUS / 5}  rx={RADIUS}       ry={RADIUS / 3} fill="black" />
                    <ellipse cx={0} cy={0 - RADIUS / 15} rx={RADIUS * 1.2} ry={RADIUS / 5} fill="black" />
                  </mask>
                </defs>
                <ellipse
                  className="system-map__planet-ring"
                  cx={0} cy={0}
                  rx={RADIUS * 2} ry={RADIUS / 3}
                  mask={`url(#ring-mask-detail-${body.id})`}
                />
                <ellipse
                  className="system-map__planet-ring"
                  cx={0} cy={0 - RADIUS / 80}
                  rx={RADIUS * 1.85} ry={RADIUS / 4.2}
                  mask={`url(#ring-mask-detail-${body.id})`}
                  opacity={0.25}
                />
              </>
            )}
          </g>
        </g>
      </g>
    </svg>
  );
};

export default BodySvg;
