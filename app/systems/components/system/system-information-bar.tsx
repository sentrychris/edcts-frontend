import type { FunctionComponent } from "react";
import type { SystemInformation } from "@/core/interfaces/System";
import { formatNumber } from "@/core/string-utils";
import { renderAllegianceText, renderSecurityText } from "../../lib/render-utils";

interface Props {
  information: SystemInformation;
}

const SystemInformationBar: FunctionComponent<Props> = ({ information }) => {
  return (
    <div className="mb-5 border border-orange-900/20 bg-transparent backdrop-blur backdrop-filter">
      <div className="grid grid-cols-2 divide-x divide-neutral-800 text-xs uppercase tracking-wide md:grid-cols-3 lg:grid-cols-5">
        <div className="flex flex-col gap-1 px-4 py-3">
          <span className="mb-1 text-xs tracking-widest text-neutral-600">Allegiance / Security</span>
          <span className="flex items-center gap-2 font-bold text-neutral-200">
            <i className="icarus-terminal-system-authority-solid text-glow__orange shrink-0"></i>
            <span>
              {renderAllegianceText(
                information && information.allegiance ? information.allegiance : "No Allegiance",
              )}
              <span className="mx-2 text-neutral-600">/</span>
              {renderSecurityText(
                !information || !information.security || information.security === "None"
                  ? "None"
                  : information.security,
              )}
            </span>
          </span>
          <span className="text-xs text-neutral-500">
            {information && information.government ? information.government : "No Governance"}
          </span>
        </div>

        <div className="flex flex-col gap-1 px-4 py-3">
          <span className="mb-1 text-xs tracking-widest text-neutral-600">Controlling Faction</span>
          <span className="flex items-center gap-2 font-bold text-neutral-200">
            <i className="icarus-terminal-system-authority-solid text-glow__orange shrink-0"></i>
            {information && information.controlling_faction && information.controlling_faction.name
              ? information.controlling_faction.name
              : "No Controlling Faction"}
          </span>
        </div>

        <div className="flex flex-col gap-1 px-4 py-3">
          <span className="mb-1 text-xs tracking-widest text-neutral-600">Faction State</span>
          <span className="flex items-center gap-2 font-bold text-neutral-200">
            <i className="icarus-terminal-system-authority-solid text-glow__orange shrink-0"></i>
            {information && information.controlling_faction && information.controlling_faction.state
              ? information.controlling_faction.state
              : "No Data"}
          </span>
        </div>

        <div className="flex flex-col gap-1 px-4 py-3">
          <span className="mb-1 text-xs tracking-widest text-neutral-600">Economy</span>
          <span className="flex items-center gap-2 font-bold text-neutral-200">
            <i className="icarus-terminal-economy text-glow__orange shrink-0"></i>
            {information && information.economy ? information.economy : "None"}
          </span>
        </div>

        <div className="flex flex-col gap-1 px-4 py-3">
          <span className="mb-1 text-xs tracking-widest text-neutral-600">Population</span>
          <span className="flex items-center gap-2 font-bold text-neutral-200">
            <i className="icarus-terminal-planet-life text-glow__orange shrink-0"></i>
            {formatNumber(information && information.population ? information.population : 0)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default SystemInformationBar;
