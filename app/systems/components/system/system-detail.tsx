"use client";

import type { FunctionComponent } from "react";
import type { System } from "@/core/interfaces/System";
import type { MappedSystemBody } from "@/core/interfaces/SystemBody";
import { useEffect, useState } from "react";
import { systemDispatcher } from "@/core/events/SystemDispatcher";
import { getResource } from "@/core/api";
import { systemState } from "../../lib/state";
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

      <div className="flex flex-col gap-8 py-5">
        {/* ── Main Sequence Stars ── */}
        <div>
          <div className="mb-4 flex items-center gap-3 border-b border-orange-900/20 pb-4">
            <i className="icarus-terminal-star text-glow__orange" style={{ fontSize: "1.5rem" }}></i>
            <div className="flex-1">
              <h2 className="text-glow__orange font-bold uppercase tracking-wide">Main Sequence Stars</h2>
              <p className="text-xs uppercase tracking-wider text-neutral-500">Stellar Classification Data</p>
            </div>
          </div>
          {!isLoading && systemMap && (
            <SystemStarsTable
              stars={systemMap.stars as Required<MappedSystemBody>[]}
              dispatcher={systemDispatcher}
            />
          )}
        </div>

        {/* ── System Stations ── */}
        <div>
          <div className="mb-4 flex items-center gap-3 border-b border-orange-900/20 pb-4">
            <i className="icarus-terminal-outpost text-glow__orange" style={{ fontSize: "1.5rem" }}></i>
            <div className="flex-1">
              <h2 className="text-glow__orange font-bold uppercase tracking-wide">System Stations</h2>
              <p className="text-xs uppercase tracking-wider text-neutral-500">Docking & Logistics Network</p>
            </div>
          </div>
          {!isLoading && systemMap && (
            <SystemStationsTable stations={systemMap.stations} dispatcher={systemDispatcher} />
          )}
        </div>

        {/* ── Orbital Bodies ── */}
        <div>
          <div className="mb-4 flex items-center gap-3 border-b border-orange-900/20 pb-4">
            <i className="icarus-terminal-system-orbits text-glow__orange" style={{ fontSize: "1.5rem" }}></i>
            <div className="flex-1">
              <h2 className="text-glow__orange font-bold uppercase tracking-wide">Orbital Bodies</h2>
              <p className="text-xs uppercase tracking-wider text-neutral-500">Planetary Survey Records</p>
            </div>
          </div>
          {!isLoading && systemMap && (
            <SystemBodiesTable
              bodies={systemMap.planets as Required<MappedSystemBody>[]}
              dispatcher={systemDispatcher}
            />
          )}
        </div>
      </div>

      {/* ── Body Detail Panel ── */}
      <div
        className={`fixed right-0 top-0 h-full w-80 transform border-l border-orange-900/40 bg-black/95 shadow-2xl shadow-orange-900/10 backdrop-blur transition-transform lg:w-96 ${
          isPanelOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
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
