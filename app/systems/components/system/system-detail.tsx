"use client";

import type { FunctionComponent } from "react";
import type { System } from "@/core/interfaces/System";
import type { MappedSystemBody } from "@/core/interfaces/SystemBody";
import { useMemo, useState } from "react";
import { systemDispatcher } from "@/core/events/SystemDispatcher";
import { useResource } from "@/core/hooks/resource";
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
  initialData?: System | null;
}

const SystemDetail: FunctionComponent<Props> = ({ params, initialData = null }) => {
  const { slug } = params;
  const { data: fetchedData, isLoading } = useResource<System>(
    initialData ? null : `systems/${slug}`,
    { withInformation: 1, withBodies: 1, withStations: 1 },
  );
  const data = initialData ?? fetchedData;
  const loading = initialData ? false : isLoading;
  const system = data ?? systemState;
  const systemMap = useMemo(() => (data ? new SystemMap(data) : undefined), [data]);
  const [selectedBody, setSelectedBody] = useState<MappedSystemBody | null>(null);
  const [isPanelOpen, setIsPanelOpen] = useState<boolean>(false);

  return (
    <>
      {loading && <Loader visible={loading} />}
      {!loading && system.slug && (
        <TrackSystemVisit name={system.name} slug={system.slug} />
      )}

      <SystemHeader system={system} />
      <SystemInformationBar information={system.information} />

      {!loading && systemMap && (
        <SystemBodiesMap
          isLoading={isLoading}
          system={system}
          systemMap={systemMap}
          setIsPanelOpen={setIsPanelOpen}
          setSelectedBodyDisplayInfo={setSelectedBody}
        />
      )}

      <div className="flex flex-col gap-8 py-5">
        {!loading && systemMap && (
          <SystemStarsTable
            stars={systemMap.stars as Required<MappedSystemBody>[]}
            dispatcher={systemDispatcher}
          />
        )}
        {!loading && systemMap && (
          <SystemStationsTable stations={systemMap.stations} dispatcher={systemDispatcher} />
        )}
        {!loading && systemMap && (
          <SystemBodiesTable
            bodies={systemMap.planets as Required<MappedSystemBody>[]}
            systemSlug={slug}
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
