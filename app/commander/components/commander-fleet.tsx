import type { FunctionComponent } from "react";
import type { CAPIShipSummary } from "@/core/interfaces/CAPIProfile";
import Panel from "@/components/panel";
import SectionHeader from "@/components/section-header";

interface Props {
  ships: Record<string, CAPIShipSummary>;
  currentShipId: number;
}

const CommanderFleet: FunctionComponent<Props> = ({ ships, currentShipId }) => {
  const fleet = Object.values(ships).sort((a, b) => {
    if (a.id === currentShipId) return -1;
    if (b.id === currentShipId) return 1;
    return a.name.localeCompare(b.name);
  });

  return (
    <Panel className="p-5">
      <SectionHeader icon="icarus-terminal-ship" title={`Fleet — ${fleet.length} vessel${fleet.length !== 1 ? "s" : ""}`} className="mb-4" />

      {fleet.length === 0 ? (
        <p className="text-[0.65rem] uppercase tracking-widest text-neutral-700">No vessels registered.</p>
      ) : (
        <div className="space-y-2">
          {fleet.map((ship) => {
            const isActive = ship.id === currentShipId;

            return (
              <div
                key={ship.id}
                className={`flex items-center gap-4 border p-3 ${
                  isActive
                    ? "border-orange-500/30 bg-orange-500/5"
                    : "border-orange-900/20 bg-black/40"
                }`}
              >
                {/* Icon */}
                <i
                  className={`icarus-terminal-ship shrink-0 text-base ${
                    isActive ? "text-orange-400/70" : "text-orange-500/20"
                  }`}
                ></i>

                {/* Ship info */}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="text-[0.7rem] font-bold uppercase tracking-wide text-orange-400/80">
                      {ship.name}
                    </p>
                    {ship.shipName && (
                      <span className="text-[0.6rem] uppercase tracking-widest text-neutral-600">
                        &quot;{ship.shipName}&quot;
                      </span>
                    )}
                    {isActive && (
                      <span className="ml-auto shrink-0 border border-orange-500/30 px-1.5 py-0.5 text-[0.5rem] uppercase tracking-widest text-orange-400/70">
                        Active
                      </span>
                    )}
                  </div>
                  <div className="mt-0.5 flex flex-wrap gap-x-3 gap-y-0.5 text-[0.55rem] uppercase tracking-widest text-neutral-700">
                    {ship.starsystem && (
                      <span>
                        <i className="icarus-terminal-route mr-0.5 text-orange-500/20"></i>
                        {ship.starsystem.name}
                      </span>
                    )}
                    {ship.station && (
                      <span>
                        <i className="icarus-terminal-station mr-0.5 text-orange-500/20"></i>
                        {ship.station.name}
                      </span>
                    )}
                    {ship.shipID && (
                      <span className="text-neutral-800">ID: {ship.shipID}</span>
                    )}
                  </div>
                </div>

                {/* Value */}
                {ship.value?.total !== undefined && (
                  <p className="shrink-0 text-right text-[0.6rem] uppercase tracking-widest text-neutral-600">
                    {ship.value.total.toLocaleString()} CR
                  </p>
                )}
              </div>
            );
          })}
        </div>
      )}
    </Panel>
  );
};

export default CommanderFleet;
