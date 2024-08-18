import type { FunctionComponent } from "react";
import type { SystemInformation } from "@/core/interfaces/System";
import { memo } from "react";
import { formatNumber, renderBadge } from "@/core/util";
import { renderAllegianceText, renderSecurityText } from "@/systems/lib/render";

interface Props {
  information: SystemInformation;
}

const SystemInformationBar: FunctionComponent<Props> = ({ information }) => {
  return (
    <div className="border-b border-neutral-800 bg-transparent py-5 text-sm tracking-wide backdrop-blur backdrop-filter">
      <div className="align-center flex flex-row justify-between uppercase">
        <div className="flex flex-wrap items-center gap-10 lg:gap-x-20">
          <div className="flex flex-col">
            <p className="mb-2 whitespace-nowrap">Governance:</p>
            <span className="text-glow__white flex items-center gap-2 py-1 font-bold uppercase">
              <i className="icarus-terminal-system-authority text-glow__orange"></i>
              <p>
                <span className="me-3">
                  {renderAllegianceText(information.allegiance) ?? "No Allegiance"}
                </span>
                <span>/</span>
                <span className="ms-3">
                  {renderSecurityText(information.security, "security") ?? "No"}
                </span>
              </p>
            </span>
            <span className="ms-7 text-xs">{information.government ?? "No"}</span>
          </div>
          <div className="whitespace-nowrap">
            <p className="mb-2">Controlling Faction:</p>
            {renderBadge(information.controlling_faction.name ?? "No Controlling Faction", {
              icon: "icarus-terminal-system-authority-solid",
            })}
          </div>
          <div className="whitespace-nowrap">
            <p className="mb-2">Economy:</p>
            {renderBadge(`${information.economy ?? "No"} economy`, {
              icon: "icarus-terminal-economy",
            })}
          </div>
          <div className="whitespace-nowrap">
            <p className="mb-2">Population:</p>
            {renderBadge(formatNumber(information.population), {
              icon: "icarus-terminal-planet-life",
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default memo(SystemInformationBar);
