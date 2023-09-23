import Link from 'next/link';
import { FunctionComponent, memo } from 'react';
import { System } from '../../lib/interfaces/System';

interface Props {
  title: string;
  ringed: boolean;
  system: System;
}

const SystemBodyTitle: FunctionComponent<Props> = ({ title, ringed, system }) => {
  return (
    <div className="flex gap-2 items-center text-glow__white">
      <i className={'text-glow icarus-terminal-' + (ringed ? 'planet-ringed' : 'planet')} style={{fontSize: '3rem'}}></i>
      <div>
        <h2 className="uppercase text-3xl">{title}</h2>
        <Link href={`/systems/system/${system.slug}`}>
          <h4 className="text-glow__orange font-bold uppercase">{system.name} system</h4>
        </Link>
      </div>
    </div>
  );
};

export default memo(SystemBodyTitle);