"use client";

import type { FunctionComponent } from "react";
import type { System } from "@/core/interfaces/System";
import type { MappedSystemBody } from "@/core/interfaces/SystemBody";
import { useEffect, useState } from "react";
import { systemDispatcher } from "@/core/events/SystemDispatcher";
import { getResource } from "@/core/api";
import { systemState } from "../../lib/state";
import Heading from "@/components/heading";
import Loader from "@/components/loader";
import SystemMap from "../../lib/system-map";
import SystemHeader from "./system-header";
import SystemInformationBar from "./system-information-bar";
import SystemBodyPopover from "./system-body-popover";
import SystemStarsTable from "./system-stars-table";
import SystemBodiesTable from "./system-bodies-table";
import SystemBodiesMap from "./system-bodies-map";
import SystemStationsTable from "./system-stations-table";

interface Props {
  params: { slug: string };
}

const SystemDetail: FunctionComponent<Props> = ({ params }) => {
  const [system, setSystem] = useState<System>(systemState);
  const [isLoading, setLoading] = useState<boolean>(true);
  const [systemMap, setSystemMap] = useState<SystemMap>();
  const [selectedBody, setSelectedBody] = useState<MappedSystemBody | null>(null);
  const [isPanelOpen, setIsPanelOpen] = useState<boolean>(false);
  const { slug } = params;

  useEffect(() => {
    if (slug) {
      getResource<System>(`systems/${slug}`, {
        params: {
          withInformation: 1,
          withBodies: 1,
          withStations: 1,
        },
      })
        .then((response) => {
          const { data: system } = response;

          setSystem(system);
          setSystemMap(new SystemMap(system));
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [slug]);

  return (
    <>
      {isLoading && <Loader visible={isLoading} />}

      <SystemHeader system={system} />
      <SystemInformationBar information={system.information} />

      {!isLoading && systemMap && (
        <SystemBodiesMap
          isLoading={isLoading}
          system={system}
          systemMap={systemMap}
          setIsPanelOpen={setIsPanelOpen}
          setSelectedBodyDisplayInfo={setSelectedBody}
        />
      )}

      <div className="grid grid-cols-1 gap-5 py-5 md:grid-cols-1">
        <div>
          <Heading icon="icarus-terminal-star" title="Main Sequence Stars" className="gap-2 pb-5" />
          {!isLoading && systemMap && (
            <SystemStarsTable
              stars={systemMap.stars as Required<MappedSystemBody>[]}
              dispatcher={systemDispatcher}
            />
          )}
        </div>
        <div className="my-10">
          <Heading icon="icarus-terminal-outpost" title="System Stations" className="gap-2 pb-5" />
          {!isLoading && systemMap && (
            <SystemStationsTable stations={systemMap.stations} dispatcher={systemDispatcher} />
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
              bodies={systemMap.planets as Required<MappedSystemBody>[]}
              dispatcher={systemDispatcher}
            />
          )}
        </div>
      </div>

      <div
        className={`fixed right-0 top-0 h-full w-1/3 transform bg-white shadow-lg transition-transform ${
          isPanelOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <button className="absolute left-2 top-2 text-xl" onClick={() => setIsPanelOpen(false)}>
          &times;
        </button>
        {selectedBody && systemMap && (
          <SystemBodyPopover
            body={selectedBody}
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
