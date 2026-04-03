"use client";

import type { FunctionComponent } from "react";
import type { SystemDispatcher } from "@/core/events/SystemDispatcher";
import type { MappedSystemBody } from "@/core/interfaces/SystemBody";
import { SystemBodyType } from "@/core/constants/system";
import { useCallback, useState } from "react";
import Icons from "@/core/icons";

interface Props {
  body: MappedSystemBody;
  selected?: MappedSystemBody;
  view?: "body" | "system";
  orbiting?: number;
  dispatcher: SystemDispatcher;
  className?: string;
}

const SystemBodySVG: FunctionComponent<Props> = ({
  body,
  selected,
  view,
  orbiting,
  dispatcher,
  className,
}) => {
  const bodyIsSelectedUserFocus = selected && selected.id64 === body.id64;

  const displayName = bodyIsSelectedUserFocus ? body.name : body.name;

  const radius = !bodyIsSelectedUserFocus ? (body._r ? body._r : 2000) : 2000;

  const useLargerViewBox = () => {
    if (body.rings || body.sub_type === "Neutron Star" || body.sub_type === "Black Hole")
      return true;

    if (body.sub_type && body.sub_type.startsWith("White Dwarf")) return true;

    return false;
  };

  const largeViewbox = useLargerViewBox();

  const calculateIconCoords = useCallback(() => {
    const pos = {
      x: radius * Math.sin(Math.PI),
      y: (radius * Math.cos(Math.PI) + 360 * 2) / 2,
    };

    if (bodyIsSelectedUserFocus || (view && view === "body")) {
      pos.x += 360 * 2;
      pos.y += 360 * 4;
    }

    return pos;
  }, [radius, bodyIsSelectedUserFocus, view]);

  const [iconCoords, setIconCoords] = useState(calculateIconCoords);

  const selectedBodyGCircleElement = useCallback(
    (node: SVGGElement) => {
      if (node) {
        node.addEventListener("click", () => {
          dispatcher.selectBody({
            body,
            type: "display-body-panel",
          });
          setIconCoords(calculateIconCoords);
        });
      }
    },
    [body, dispatcher, calculateIconCoords],
  );

  // TODO fix this properly, there is a bug in the system map resulting in the wrong
  // _type classification for  e.g. Y (brown dwarf) stars.
  if (body.sub_type?.includes("Star")) {
    body._type = SystemBodyType.Star;
  }

  return (
    <div className={"flex items-center " + (body.rings && " gap-3")}>
      <svg
        viewBox={largeViewbox ? "-4000 -4000 8000 8000" : "-2500 -2500 5000 5000"}
        preserveAspectRatio="xMidYMid meet"
        className={className}
      >
        <g
          className="system-map__system-object hover:cursor-help"
          ref={selectedBodyGCircleElement}
          data-system-object-name={body.name}
          data-system-object-type={body._type ?? body.type}
          data-system-object-small={body._small}
          data-system-object-sub-type={body.sub_type}
          data-system-object-atmosphere={body.atmosphere_type}
          data-system-object-landable={body.is_landable === 1 ? true : false}
          tabIndex={0}
        >
          <g className="system-map__body">
            <g className="system-map__planet">
              <circle cx={0} cy={0} r={radius} />
              <circle className="system-map__planet-surface" cx={0} cy={0} r={radius} />
              {body.rings && body.rings.length > 0 && (
                <>
                  <defs>
                    <mask
                      id={`planet-ring-mask-${body.id64}`}
                      className="system-map__planet-ring-mask"
                    >
                      <ellipse cx={0} cy={0} rx={radius * 2} ry={radius / 3} fill="white" />
                      <ellipse
                        cx={0}
                        cy={0 - radius / 5}
                        rx={radius}
                        ry={radius / 3}
                        fill="black"
                      />
                      <ellipse
                        cx={0}
                        cy={0 - radius / 15}
                        rx={radius * 1.2}
                        ry={radius / 5}
                        fill="black"
                      />
                    </mask>
                  </defs>
                  <ellipse
                    className="system-map__planet-ring"
                    cx={0}
                    cy={0}
                    rx={radius * 2}
                    ry={radius / 3}
                    mask={`url(#planet-ring-mask-${body.id64})`}
                    opacity="1"
                  />
                  <ellipse
                    className="system-map__planet-ring"
                    cx={0}
                    cy={0 - radius / 80}
                    rx={radius * 1.85}
                    ry={radius / 4.2}
                    mask={`url(#planet-ring-mask-${body.id64})`}
                    opacity=".25"
                  />
                </>
              )}
            </g>

            {body.is_landable && (
              <svg
                className="system-map__planetary-lander-icon text-xs"
                x={iconCoords.x}
                y={iconCoords.y}
              >
                {Icons.get("planet-landable")}
              </svg>
            )}
          </g>
        </g>
      </svg>
      
      <div className="star_information text-sm uppercase tracking-wide">
        <p className="text-glow whitespace-nowrap">{displayName}</p>
        <p className="text-glow whitespace-nowrap text-xs">{body.sub_type}</p>

        <div className="flex flex-row items-center gap-2 text-xs">
          <span
            className={
              "text-glow__orange flex items-center gap-2 whitespace-nowrap " +
              (bodyIsSelectedUserFocus
                ? "text-sm"
                : "hover:text-glow__blue hover:scale-110 hover:cursor-grabbing")
            }
            onClick={() => dispatcher.selectBody({ body, type: "select-body" })}
          >
            <i className="icarus-terminal-system-bodies text-label__small"></i>
            {orbiting} bodies
          </span>

          {!bodyIsSelectedUserFocus &&
            body._planetary_bases &&
            body._planetary_bases.length > 0 && (
              <span
                className={
                  "text-glow__blue flex items-center gap-2 whitespace-nowrap " +
                  (bodyIsSelectedUserFocus
                    ? "text-sm"
                    : "hover:text-glow__orange hover:scale-110 hover:cursor-grabbing")
                }
                onClick={() => dispatcher.selectBody({ body, type: "select-body" })}
              >
                <i className="icarus-terminal-settlement text-label__small"></i>
                {body._planetary_bases.length} settlements
              </span>
            )}
        </div>

        {bodyIsSelectedUserFocus && !body.is_main_star && (
          <span
            className="text-label__small text-glow__blue flex items-center gap-2 hover:scale-105 hover:cursor-pointer"
            onClick={() => dispatcher.setIndex(0)}
          >
            <i className="icarus-terminal-chevron-up text-label__small"></i>
            Go back to top
          </span>
        )}
      </div>
    </div>
  );
};

export default SystemBodySVG;
