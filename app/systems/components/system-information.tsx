import { SystemInformation } from "@/interfaces/System";
import {
  renderBadge,
} from '../systems';
import { FunctionComponent } from "react";

interface Props {
  information: SystemInformation;
}

const SystemInformation: FunctionComponent<Props> = ({ information }) => {
  return (
    <div className="flex flex-row align-center justify-start gap-20 border-b border-neutral-800 py-5 uppercase">
      <div>
        <p className="mb-2">Governance:</p>
        {renderBadge(information.allegiance)}
        {renderBadge(information.government, 'ml-4')}
      </div>
      <div>
        <p className="mb-2">Controlling Faction:</p>
        {renderBadge(information.controlling_faction.name)}
      </div>
      <div>
        <p className="mb-2">Economy:</p>
        {renderBadge(information.economy ?? 'None')}
      </div>
      <div>
        <p className="mb-2">Security:</p>
        {renderBadge(information.security)}
      </div>
    </div>
  )
}

export default SystemInformation;