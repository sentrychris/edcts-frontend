import { FunctionComponent, memo } from 'react';

interface Props {
  title: string;
  bodies: number;
  special?: string;
}

const SystemTitle: FunctionComponent<Props> = ({title, bodies, special}) => {
  return (
    <div className="flex gap-2 items-center text-glow__white">
      <i className="icarus-terminal-system-orbits" style={{fontSize: '3rem'}}></i>
      <div>
        <h2 className="uppercase text-3xl">{title} system {special && <span className="ml-1 text-xs">{special}</span>}</h2>
        <h4 className="text-glow__orange font-bold uppercase">{bodies} bodies found in system</h4>
      </div>
    </div>
  );
};

export default memo(SystemTitle);