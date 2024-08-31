import type { FunctionComponent } from "react";
import type { SystemInformation } from "@/core/interfaces/System";
import { formatNumber } from "@/core/string-utils";
import { renderTextWithIcon } from "@/core/render-utils";
import { renderAllegianceText, renderSecurityText } from "../../lib/render-utils";

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
              <i className="icarus-terminal-system-authority-solid text-glow__orange"></i>
              <p>
                <span className="me-3">
                  {renderAllegianceText(information && information.allegiance
                      ? information.allegiance
                      : "No Allegiance"
                  )}
                </span>
                <span>/</span>
                <span className="ms-3">
                  {renderSecurityText(
                    !information.security || information.security === "None"
                      ? "No"
                      : information.security,
                    "security",
                  )}
                </span>
              </p>
            </span>
            <span className="ms-7 text-xs">{
              information && information.government
                ? information.government
                : "No Governance"
            }</span>
          </div>
          <div className="whitespace-nowrap">
            <p className="mb-2">Controlling Faction:</p>
            {renderTextWithIcon(information && information.controlling_faction
              ? information.controlling_faction.name
              : "No Controlling Faction", {
                icon: "icarus-terminal-system-authority-solid",
              }
            )}
          </div>
          <div className="whitespace-nowrap">
            <p className="mb-2">Faction State:</p>
            {renderTextWithIcon(information && information.controlling_faction
              ? information.controlling_faction.state
              : "No Data", {
                icon: "icarus-terminal-system-authority-solid",
              }
            )}
          </div>
          <div className="whitespace-nowrap">
            <p className="mb-2">Economy:</p>
            {renderTextWithIcon(`${information && information.economy
              ? information.economy
              : "None"}`, {
                icon: "icarus-terminal-economy",
              }
            )}
          </div>
          <div className="whitespace-nowrap">
            <p className="mb-2">Population:</p>
            {renderTextWithIcon(formatNumber(information && information.population
              ? information.population
              : 0
            ), {
              icon: "icarus-terminal-planet-life",
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SystemInformationBar;
