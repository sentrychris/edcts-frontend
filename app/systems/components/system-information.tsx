import { SystemInformation } from "@/interfaces/System";
import {
  renderBadge,
} from '../systems';
import { FunctionComponent } from "react";
import { formatNumber } from "@/app/util";

interface Props {
  information: SystemInformation;
}

const SystemInformation: FunctionComponent<Props> = ({ information }) => {
  return (
    <div className="border-b border-neutral-800 py-5 tracking-wide">
      <div className="mb-2">
        <p className="uppercase">Population:</p>
        <p className="text-glow-orange">{formatNumber(information.population)}</p>
      </div>
      <div className="flex flex-row align-center justify-start gap-20 uppercase">
        <div>
          <p className="mb-2">Governance:</p>
          <span className="flex items-center gap-2 bg-neutral-600 shadow-neutral-500 px-3 py-1 rounded-lg uppercase text-glow-white shadow text-sm">
              <i className="icarus-terminal-system-authority"></i>
              <p>
                <span className="me-3">{information.allegiance}</span>
                //
                <span className="mx-3">{information.government}</span>
                //
                <span className="ms-3">{information.security} security</span>
              </p>
          </span>
        </div>
        <div>
          <p className="mb-2">Controlling Faction:</p>
          {renderBadge(information.controlling_faction.name, {
            icon: 'icarus-terminal-location'
          })}
        </div>
        <div>
          <p className="mb-2">Economy:</p>
          {renderBadge(`${information.economy ?? 'No'} economy`, {
            icon: 'icarus-terminal-economy'
          })}
        </div>
      </div>
    </div>
  )
}

export default SystemInformation;