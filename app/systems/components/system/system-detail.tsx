"use client";

import type { FunctionComponent } from "react";
import type { System } from "@/core/interfaces/System";
import type { RawSystemBody, MappedSystemBody } from "@/core/interfaces/SystemBody";
import { useEffect, useState, useCallback } from "react";
import { SystemBodyType } from "@/core/constants/system";
import { systemDispatcher } from "@/core/events/SystemDispatcher";
import { getResource } from "@/core/api";
import { systemState } from "../../lib/store";
import Heading from "@/components/heading";
import Loader from "@/components/loader";
import SystemMap from "../../lib/system-map";
import SystemHeader from "./system-header";
import SystemInformationBar from "./system-information-bar";
import SystemBodySVG from "./system-body-svg";
import SystemBodyPopover from "./system-body-popover";
import SystemStarsTable from "./system-stars-table";
import SystemBodiesTable from "./system-bodies-table";

interface Props {
  initSystem?: System;
  params: { slug: string };
}

const SystemDetail: FunctionComponent<Props> = ({ initSystem, params }) => {
  const [system, setSystem] = useState<System>(initSystem !== undefined ? initSystem : systemState);
  const [isLoading, setLoading] = useState<boolean>(true);
  const [systemMap, setSystemMap] = useState<SystemMap>();
  const [selectedBody, setSelectedBody] = useState<MappedSystemBody>();
  const [selectedBodyIndex, setSelectedBodyIndex] = useState<number>(0);
  const [selectedBodyDisplayInfo, setSelectedBodyDisplayInfo] = useState<{
    body: MappedSystemBody | null;
    closer: boolean;
    position: {
      top: number;
      left: number;
      right: number;
      bottom: number;
      width: number;
      height: number;
    };
  } | null>(null);

  const [isPanelOpen, setIsPanelOpen] = useState<boolean>(false);

  const { slug } = params;

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

  useEffect(() => {
    if (slug) {
      setLoading(true);

      getResource<System>(`systems/${slug}`, {
        withInformation: 1,
        withBodies: 1,
        withStations: 1,
      })
        .then((response) => {
          const { data: system } = response;
          setSystem(system);

          const map = new SystemMap(system);
          setSystemMap(map);

          const star = map.stars.find((s) => s.is_main_star === 1);
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
            setSelectedBodyDisplayInfo(event.message);
            setIsPanelOpen(true); // Open panel when body info is displayed
          });
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [slug]);

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

  return (
    <>
      {isLoading && <Loader visible={isLoading} />}

      <SystemHeader system={system} />
      <SystemInformationBar information={system.information} />

      <div className="border-b border-neutral-800 bg-transparent py-5 backdrop-blur backdrop-filter">
        <div className="flex items-center justify-between">
          <Heading icon="icarus-terminal-system-bodies" title="System Map" className="mb-2 gap-2" />
          {!isLoading && systemMap && (
            <div className="md:flex items-center gap-x-6 text-xs">
              <h4 className="text-glow__orange font-bold uppercase">
                {systemMap.stars.length ? systemMap.stars.length - 1 : 0}
                <span className="ms-1">
                  star{systemMap.stars.length - 1 > 1 && 's'}
                </span>
              </h4>
              <h4 className="text-glow__orange font-bold uppercase">
                {systemMap.planets.length ?? 0}
                <span className="ms-1">
                  {systemMap.planets.length > 1 ? 'bodies' : 'body'}
                </span>
              </h4>
              <h4 className="text-glow__orange font-bold uppercase">
                {systemMap.stations.length}
                <span className="ms-1">
                  station{(systemMap.stations.length === 0 || systemMap.stations.length > 1) && 's'}
                </span>
              </h4>
              <h4 className="text-glow__blue font-bold uppercase">
              {systemMap.settlements.length}
              <span className="ms-1">
                  settlement{(systemMap.settlements.length === 0 || systemMap.settlements.length > 1) && 's'}
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

      <div className="grid grid-cols-1 gap-5 py-5 md:grid-cols-1">
        <div>
          <Heading icon="icarus-terminal-star" title="Main Sequence Stars" className="gap-2 pb-5" />
          {!isLoading && systemMap && (
            <SystemStarsTable
              stars={systemMap.stars as RawSystemBody[]}
              dispatcher={systemDispatcher}
            />
          )}
        </div>
        <div>
          <Heading
            icon="icarus-terminal-system-orbits"
            title="Orbital Bodies"
            className="gap-2 pb-5"
          />
          {!isLoading && systemMap && (
            <SystemBodiesTable
              bodies={systemMap.planets as RawSystemBody[]}
              dispatcher={systemDispatcher}
            />
          )}
        </div>
      </div>

      <div
        className={`fixed right-0 top-0 h-full w-1/3 transform bg-white shadow-lg transition-transform ${isPanelOpen ? "translate-x-0" : "translate-x-full"}`}
      >
        <button className="absolute left-2 top-2 text-xl" onClick={() => setIsPanelOpen(false)}>
          &times;
        </button>
        {selectedBodyDisplayInfo && systemMap && (
          <SystemBodyPopover
            body={selectedBodyDisplayInfo.body}
            system={systemMap}
            dispatcher={systemDispatcher}
            close={() => setIsPanelOpen(false)}
          />
        )}
      </div>
    </>
  );
};

export default SystemDetail;
