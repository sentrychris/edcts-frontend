import { FunctionComponent, memo } from 'react';
import { SystemInformation } from '../../lib/interfaces/System';
import { formatNumber, renderBadge } from '../../lib/util';

interface Props {
  coords: {
    x: number;
    y: number;
    z: number;
  };
  information: SystemInformation;
}

const SystemInformation: FunctionComponent<Props> = ({ coords, information }) => {
  return (
    <div className="border-b border-neutral-800 backdrop-filter backdrop-blur bg-transparent py-5 tracking-wide text-sm">
      <div className="flex flex-row align-center justify-between uppercase">
        <div className="flex flex-wrap items-center gap-10 lg:gap-x-20">
          <div className="flex flex-col">
            <p className="mb-2 whitespace-nowrap">Governance:</p>
            <span className="flex items-center gap-2 py-1 uppercase text-glow__white font-bold">
                <i className="icarus-terminal-system-authority text-glow__orange"></i>
                <p>
                  <span className="me-3">{information.allegiance ?? 'No Allegiance'}</span>
                  <span>/</span>
                  <span className="mx-3">{information.government ?? 'No Government'}</span>
                  <span>/</span>
                  <span className="ms-3">{information.security ?? 'No'} security</span>
                </p>
            </span>
          </div>
          <div className="whitespace-nowrap">
            <p className="mb-2">Controlling Faction:</p>
            {renderBadge(information.controlling_faction.name ?? 'No Controlling Faction', {
              icon: 'icarus-terminal-system-authority-solid'
            })}
          </div>
          <div className="whitespace-nowrap">
            <p className="mb-2">Economy:</p>
            {renderBadge(`${information.economy ?? 'No'} economy`, {
              icon: 'icarus-terminal-economy'
            })}
          </div>
          <div className="whitespace-nowrap">
            <p className="mb-2">Population:</p>
            {renderBadge(formatNumber(information.population), {
              icon: 'icarus-terminal-planet-life'
            })}
          </div>
        </div>
        <div className="whitespace-nowrap hidden md:inline">
          <p className="mb-2">Galaxy Coordinates:</p>
          {renderBadge(`${coords.x}, ${coords.y}, ${coords.z}`, {
            icon: 'icarus-terminal-location-filled'
          })}
        </div>
      </div>
    </div>
  );
};

export default memo(SystemInformation);