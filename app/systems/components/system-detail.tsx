
'use client';

import { System } from '../../../interfaces/System';
import { defaultState, getSystem, renderAllegianceBadge, renderGovernmentBadge, renderSecurityBadge } from '../systems';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

const SystemDetail = () => {
  const [system, setSystem] = useState<System>(defaultState);

  const path = usePathname();
  const slug = path.split('/').pop();

  useEffect(() => {
    (async () => {
      if (slug) {
        const data = await getSystem(slug);
        setSystem(data);
      }
    })();
  }, []);

  const { information } = system;

  return (
    <>
      <h2 className="uppercase text-3xl pb-3 border-b border-neutral-800">{system.name}</h2>
      <div className="flex flex-row align-center justify-start gap-20 border-b border-neutral-800 py-5">
        <div>
          <p className="mb-2">Governance</p>
          {renderAllegianceBadge(information.allegiance)}
          {renderGovernmentBadge(information.government)}
        </div>
        <div>
          <p className="mb-2">Controlling Faction</p>
          <button className="bg-stone-700 px-3 py-1 rounded-lg uppercase">
            {information.controlling_faction.name}
          </button>
        </div>
        <div>
          <p className="mb-2">Economy</p>
          <button className="bg-yellow-700 px-3 py-1 rounded-lg uppercase">
            {information.economy ?? 'N/A'}
          </button>
        </div>
        <div>
          <p className="mb-2">Security</p>
          {renderSecurityBadge(information.security)}
        </div>
      </div>
    </>
  );
};

export default SystemDetail;
  