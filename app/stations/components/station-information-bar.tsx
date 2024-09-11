import type { FunctionComponent } from "react";
import type { Station } from "@/core/interfaces/Station";
import { renderTextWithIcon } from "@/core/render-utils";
import { renderAllegianceText } from "@/app/systems/lib/render-utils";

interface Props {
  information: Station;
}

const StationInformationBar: FunctionComponent<Props> = ({ information }) => {
  return (
    <div className="border-b border-neutral-800 bg-transparent py-5 text-sm tracking-wide backdrop-blur backdrop-filter">
      <div className="align-center flex flex-row justify-between uppercase">
        <div className="flex flex-wrap items-center justify-between w-full">
          <div className="flex flex-wrap mb-10 md:mb-0 items-center gap-10 lg:gap-x-20">
            <div className="flex flex-col">
              <p className="mb-2 whitespace-nowrap">Governance:</p>
              <span className="text-glow__white flex items-center gap-2 py-1 font-bold uppercase">
                <i className="icarus-terminal-system-authority-solid text-glow__orange"></i>
                <span>
                  <span className="me-3">
                    {renderAllegianceText(
                      information && information.allegiance
                        ? information.allegiance
                        : "No Allegiance",
                    )}
                  </span>
                  <span>/</span>
                  <span className="ms-3">
                    {information && information.government ? information.government : "No Security"}
                  </span>
                </span>
              </span>
            </div>
            <div className="whitespace-nowrap">
              <p className="mb-2">Controlling Faction:</p>
              {renderTextWithIcon(
                information && information.controlling_faction
                  ? information.controlling_faction
                  : "No Controlling Faction",
                {
                  icon: "icarus-terminal-system-authority-solid",
                },
              )}
            </div>
            <div className="whitespace-nowrap">
              <p className="mb-2">Economy:</p>
              {renderTextWithIcon(
                `${information && information.economy ? information.economy : "None"}`,
                {
                  icon: "icarus-terminal-economy",
                },
              )}
            </div>
          </div>
          <div className="flex flex-wrap items-center whitespace-nowrap gap-10 text-xs">
            <div>
              <p className="flex items-center mb-2">
                <i className="icarus-terminal-economy me-2 text-glow__orange"></i>
                Market:
              </p>
              {information && information.has_market
                ? <span className="text-green-300">Available</span>
                : <span className="text-red-300">Unavailable</span>
              }
            </div>
            <div>
              <p className="flex items-center mb-2">
                <i className="icarus-terminal-ship me-2 text-glow__orange"></i>
                Shipyard:
              </p>
              {information.has_market
                ? <span className="text-green-300">Available</span>
                : <span className="text-red-300">Unavailable</span>
              }
            </div>
            <div>
              <p className="flex items-center mb-2">
                <i className="icarus-terminal-engineering me-2 text-glow__orange"></i>
                Outfitting:
              </p>
              {information.has_market
                ? <span className="text-green-300">Available</span>
                : <span className="text-red-300">Unavailable</span>
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StationInformationBar;
