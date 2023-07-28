import { FunctionComponent } from "react";

interface Props {
  title: string;
  celestials: number;
}

const SystemTitle: FunctionComponent<Props> = ({title, celestials}) => {
  return (
    <div className="flex gap-2 items-center text-glow-white">
      <i className="icarus-terminal-system-orbits" style={{fontSize: '3rem'}}></i>
      <div>
        <h2 className="uppercase text-3xl">{title} system</h2>
        <h4 className="text-glow-orange font-bold uppercase">{celestials} bodies found in system</h4>
      </div>
    </div>
  );
}

export default SystemTitle;