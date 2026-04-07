"use client";

import type { FunctionComponent } from "react";
import type { System } from "@/core/interfaces/System";
import type { MappedSystemBody } from "@/core/interfaces/SystemBody";
import { useEffect, useState } from "react";
import { systemDispatcher } from "@/core/events/SystemDispatcher";
import { getResource } from "@/core/api";
import { systemState } from "../../lib/state";
import Loader from "@/components/loader";
import TrackSystemVisit from "@/components/sidebar/track-system-visit";
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
      {!isLoading && system.slug && (
        <TrackSystemVisit name={system.name} slug={system.slug} />
      )}

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
        {!isLoading && systemMap && (
          <SystemStarsTable
            stars={systemMap.stars as Required<MappedSystemBody>[]}
            dispatcher={systemDispatcher}
          />
        )}
        {!isLoading && systemMap && (
          <SystemStationsTable stations={systemMap.stations} dispatcher={systemDispatcher} />
        )}
        {!isLoading && systemMap && (
          <SystemBodiesTable
            bodies={systemMap.planets as Required<MappedSystemBody>[]}
            dispatcher={systemDispatcher}
          />
        )}
      </div>

      {/* ── Body Detail Popout ── */}
      {isPanelOpen && selectedBody && systemMap && (
        <SystemBodyPopover
          body={selectedBody}
          system={systemMap}
          dispatcher={systemDispatcher}
          close={() => setIsPanelOpen(false)}
        />
      )}
    </>
  );
};

export default SystemDetail;
