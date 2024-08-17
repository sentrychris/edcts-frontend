"use client";

import type { FunctionComponent } from "react";
import { useEffect, useState, useCallback } from "react";
import type { System } from "../../core/interfaces/System";
import type { RawSystemBody, MappedSystemBody } from "../../core/interfaces/SystemBody";
import { SystemBodyType } from "../../core/constants/system";
import { getResource } from "../../core/api";
import { systemState } from "../lib/store";
import { systemDispatcher } from "../../core/events/SystemDispatcher";
import SystemMap from "../lib/system-map";
import SystemTitle from "./system-title";
import SystemInformation from "./system-information";
import SystemBody from "./system-body";
import SystemBodyInformation from "./system-body-information";
import SystemStarsTable from "./system-stars-table";
import Loader from "../../components/loader";
import Heading from "../../components/heading";

interface Props {
  initSystem?: System;
  params: { slug: string };
}

const SystemPage: FunctionComponent<Props> = ({ initSystem, params }) => {
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

      // Fetch systems along with system information (e.g. governance, economy, security etc.)
      // and orbiting bodies
      getResource<System>(`systems/${slug}`, {
        withInformation: 1,
        withBodies: 1,
        withStations: 1,
      })
        .then((system) => {
          setSystem(system);

          // Map system bodies (e.g stars, planets and moons) into their respective orbits through
          // a parent-child relationship.
          //
          // This map contains bodies of type MappedSystemBody, which contain the same properties
          // as RawSystemBody with extra _children, _label, _type used for mapping.
          const map = new SystemMap(system);
          setSystemMap(map);

          console.log({ map });

          // Fetch the main star and initialise it as the selected body for the system overview.
          const star = map.stars.find((s) => s.is_main_star === 1);
          setSelectedBody(star);

          // Listener to set the selected system body when the user selects a body either from the
          // system overview or one of the tables.
          systemDispatcher.addEventListener("select-body", (event) => {
            setSelectedBody(event.message as MappedSystemBody);
          });

          // Listener to reset the selected body when the user clicks on "go back to primary star".
          systemDispatcher.addEventListener("set-index", (event) => {
            const index = event.message as number;
            if (index === 0) {
              setSelectedBody(star);
            }
          });

          // Listener to set the selected system body + positioning for the cartographical data widget
          // when the user clicks on a body (attached to the SVG G "circle" element).
          systemDispatcher.addEventListener("display-body-info", (event) => {
            setSelectedBodyDisplayInfo(event.message);
          });
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [slug]);

  function renderSystemBodies(map: SystemMap) {
    // Handle user selection to allow switching between stars and orbiting bodies.
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

    // If map contains two objects, a star and "additional objects not directly orbiting" then
    // this system has only one primary star, this flag is useful for conditonally rendering certain
    // ui elements that are only needed if we have multiple primary stars, for example, select buttons.
    // const singlePrimaryStar = map.stars.length === 2 && map.stars[1].type === SystemBodyType.Null;

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

  // Render a system body - an interactive SVG with conditional filters depending on body type.
  function renderSystemBody(body: MappedSystemBody) {
    let classes = "text-glow__white text-sm";
    if (body.is_main_star) {
      classes += " w-main-star";
    } else {
      classes = " w-40";
    }

    return (
      <SystemBody
        key={body.id64}
        system={system.name}
        selected={selectedBody}
        body={body}
        orbiting={body._children ? body._children.length : 0}
        dispatcher={systemDispatcher}
        className={classes}
      />
    );
  }

  // Render body's orbiting bodies - maps each orbiting body to be rendered using renderSystemBody.
  function renderSystemBodyChildren(body: MappedSystemBody) {
    const bodies = body._children && body._children.length > 0 ? body._children : false;

    if (!bodies) {
      return (
        <span className="text-glow__orange ms-4 uppercase">
          {body.name} {body.type} has no directly orbiting celestial bodies
        </span>
      );
    }

    return bodies.map((body: MappedSystemBody) => renderSystemBody(body));
  }

  return (
    <>
      {isLoading && <Loader visible={isLoading} />}

      <div className="border-b border-neutral-800 pb-5">
        <SystemTitle title={system.name} bodies={system.bodies.length} />
      </div>

      <SystemInformation coords={system.coords} information={system.information} />

      <div className="w-7xl overflow border-b border-neutral-800 bg-transparent py-5 backdrop-blur backdrop-filter">
        <Heading
          icon="icarus-terminal-system-bodies"
          title="System Overview"
          className="gap-2 pb-5"
        />
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
              system={system.name}
              dispatcher={systemDispatcher}
            />
          )}
        </div>
      </div>

      {selectedBodyDisplayInfo && systemMap && (
        <SystemBodyInformation
          body={selectedBodyDisplayInfo.body}
          system={systemMap}
          closer={selectedBodyDisplayInfo.closer}
          position={selectedBodyDisplayInfo.position}
          dispatcher={systemDispatcher}
          close={() => setSelectedBodyDisplayInfo(null)}
        />
      )}
    </>
  );
};

export default SystemPage;
