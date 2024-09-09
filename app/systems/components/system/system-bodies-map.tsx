"use client";

import { type FunctionComponent, useCallback, useEffect, useState } from "react";
import type { System } from "@/core/interfaces/System";
import type { MappedSystemBody } from "@/core/interfaces/SystemBody";
import type SystemMap from "../../lib/system-map";
import { SystemBodyType } from "@/core/constants/system";
import { pluralizeTextFromArray } from "@/core/string-utils";
import { systemDispatcher } from "@/core/events/SystemDispatcher";
import Heading from "@/components/heading";
import SystemBodySVG from "./system-body-svg";

interface Props {
  systemMap: SystemMap;
  isLoading: boolean;
  system: System;
  setSelectedBodyDisplayInfo: (info: any) => void;
  setIsPanelOpen: (isOpen: boolean) => void;
}

const SystemBodiesMap: FunctionComponent<Props> = ({
  isLoading,
  systemMap,
  system,
  setSelectedBodyDisplayInfo,
  setIsPanelOpen,
}) => {
  const [selectedBody, setSelectedBody] = useState<MappedSystemBody>();
  const [selectedBodyIndex, setSelectedBodyIndex] = useState<number>(0);

  useEffect(() => {
    const star = systemMap.stars.find((s) => s.is_main_star === 1);
    setSelectedBody(star);

    systemDispatcher.addEventListener("select-body", (event) => {
      setSelectedBody(event.message as MappedSystemBody);
    });

    systemDispatcher.addEventListener("set-index", (event) => {
      if ((event.message as number) === 0) {
        setSelectedBody(star);
      }
    });

    systemDispatcher.addEventListener("display-body-info", (event) => {
      console.log(event);
      setSelectedBodyDisplayInfo(event.message);
      setIsPanelOpen(true); // Open panel when body info is displayed
    });
  }, [setSelectedBodyDisplayInfo, setIsPanelOpen, systemMap.stars]);

  const scrollableBodies = useCallback((node: HTMLDivElement) => {
    let pos = { top: 0, left: 0, x: 0, y: 0 };
    if (node) {
      node.scrollLeft = 0;

      node.addEventListener("mousedown", (e: MouseEvent) => {
        pos = {
          left: node.scrollLeft,
          top: node.scrollTop,
          x: e.clientX,
          y: e.clientY,
        };

        node.addEventListener("mousemove", mouseMoveHandler);
        node.addEventListener("mouseup", mouseUpHandler);
      });

      const mouseMoveHandler = (event: MouseEvent) => {
        const dx = event.clientX - pos.x;
        const dy = event.clientY - pos.y;

        node.scrollTop = pos.top - dy;
        node.scrollLeft = pos.left - dx;
      };

      const mouseUpHandler = () => {
        node.removeEventListener("mousemove", mouseMoveHandler);
        node.removeEventListener("mouseup", mouseUpHandler);

        node.style.cursor = "grab";
        node.style.removeProperty("user-select");
      };
    }
  }, []);

  function renderSystemBodies(map: SystemMap) {
    function handleSelectedBodyChange(index: number) {
      if (
        index < 0 ||
        typeof map.stars[index] === "undefined" ||
        map.stars[index].type === SystemBodyType.Null
      ) {
        index = 0;
      }

      setSelectedBody(map.stars[index]);
      setSelectedBodyIndex(index);
    }

    return (
      <>
        <div className="flex content-center items-center">
          {selectedBody && (
            <>
              <div className="flex shrink-0 items-center md:rounded-full md:border-r md:border-neutral-700 md:pe-12">
                {
                  <div className={"text-glow__orange me-6 hidden flex-col md:flex"}>
                    <i
                      className={
                        "icarus-terminal-chevron-up text-glow__orange hover:text-glow__blue hover:cursor-pointer"
                      }
                      onClick={() => handleSelectedBodyChange(selectedBodyIndex - 1)}
                    ></i>
                    <i
                      className={
                        "icarus-terminal-chevron-down text-glow__orange hover:text-glow__blue hover:cursor-pointer"
                      }
                      onClick={() => handleSelectedBodyChange(selectedBodyIndex + 1)}
                    ></i>
                  </div>
                }
                {renderSystemBody(selectedBody)}
              </div>
              <div
                className="system-body__children hidden w-full items-center overflow-x-auto hover:cursor-move md:flex"
                ref={scrollableBodies}
              >
                {renderSystemBodyChildren(selectedBody)}
              </div>
            </>
          )}
        </div>
      </>
    );
  }

  function renderSystemBodyChildren(body: MappedSystemBody) {
    const bodies = body._children && body._children.length > 0 ? body._children : false;

    if (!bodies) {
      return (
        <span className="text-glow__orange ms-4 uppercase">
          {body.name} {body.type} has no direct orbiting celestial bodies
        </span>
      );
    }

    return bodies.map((body: MappedSystemBody) => renderSystemBody(body));
  }

  function renderSystemBody(body: MappedSystemBody) {
    let classes = "text-glow__white text-sm";
    if (body.is_main_star) {
      classes += " w-main-star";
    } else {
      classes = " w-40";
    }

    return (
      <SystemBodySVG
        key={body.id64}
        selected={selectedBody}
        body={body}
        orbiting={body._children ? body._children.length : 0}
        dispatcher={systemDispatcher}
        className={classes}
      />
    );
  }

  return (
    <div className="border-b border-neutral-800 bg-transparent py-5 backdrop-blur backdrop-filter">
      <div className="flex items-center justify-between">
        <Heading icon="icarus-terminal-system-bodies" title="System Map" className="mb-2 gap-2" />
        {!isLoading && (
          <div className="items-center gap-x-6 text-xs md:flex">
            <h4 className="text-glow__orange font-bold uppercase">
              {systemMap.stars.filter((s) => s.type !== SystemBodyType.Null).length}
              <span className="ms-1">
                {pluralizeTextFromArray(
                  systemMap.stars.filter((s) => s.type !== SystemBodyType.Null),
                  {
                    singular: "star",
                    plural: "stars",
                  },
                )}
              </span>
            </h4>
            <h4 className="text-glow__orange font-bold uppercase">
              {systemMap.planets.length}
              <span className="ms-1">
                {pluralizeTextFromArray(systemMap.planets, {
                  singular: "body",
                  plural: "bodies",
                })}
              </span>
            </h4>
            <h4 className="text-glow__orange font-bold uppercase">
              {systemMap.stations.length}
              <span className="ms-1">
                {pluralizeTextFromArray(systemMap.stations, {
                  singular: "station",
                  plural: "stations",
                })}
              </span>
            </h4>
            <h4 className="text-glow__blue font-bold uppercase">
              {systemMap.settlements.length}
              <span className="ms-1">
                {pluralizeTextFromArray(systemMap.settlements, {
                  singular: "settlement",
                  plural: "settlements",
                })}
              </span>
            </h4>
          </div>
        )}
      </div>
      {!isLoading && (
        <div className="grid grid-cols-12">
          <div className="col-span-12">
            {systemMap && systemMap.items.length > 0 ? (
              renderSystemBodies(systemMap)
            ) : (
              <div className="text-glow__orange mx-auto py-6 text-center text-lg font-bold uppercase">
                Telemetry data not found for {system.name}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SystemBodiesMap;
