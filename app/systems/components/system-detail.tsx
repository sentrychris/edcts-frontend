
'use client';

import { System } from '../../../interfaces/System';
import { defaultState, getAllSystems, getSystem } from '../systems';
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

  return (
    <>
      <h2 className="uppercase text-3xl pb-3 border-b border-neutral-800">{system.name}</h2>
      <div className="relative border-b border-neutral-800 py-12">
      </div>
    </>
  );
};

export default SystemDetail;
  