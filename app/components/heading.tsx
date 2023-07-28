import { FunctionComponent } from "react";

interface Props {
  icon: string;
  largeIcon?: boolean;
  title: string;
  className?: string;
}

const Heading: FunctionComponent<Props> = ({ icon, title, largeIcon = false, className = '' }) => {
  return (
    <div className={`flex items-center ` + className}>
      <i className={icon} style={{fontSize: largeIcon ? '1.5rem' : 'initial'}}></i>
      <h2 className="text-glow-white uppercase">{title}</h2>
    </div>
  );
}

export default Heading;