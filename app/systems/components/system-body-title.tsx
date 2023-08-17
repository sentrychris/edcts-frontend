import { FunctionComponent, memo } from 'react';

interface Props {
  title: string;
  system: string;
}

const SystemBodyTitle: FunctionComponent<Props> = ({ title, system }) => {
  return (
    <div className="flex gap-2 items-center text-glow__white">
      <i className="icarus-terminal-system-planet" style={{fontSize: '3rem'}}></i>
      <div>
        <h2 className="uppercase text-3xl">{title}</h2>
        <h4 className="text-glow__orange font-bold uppercase">{system} system</h4>
      </div>
    </div>
  );
};

export default memo(SystemBodyTitle);