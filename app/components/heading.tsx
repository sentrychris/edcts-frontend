import { FunctionComponent, memo } from 'react';

interface Props {
  title: string;
  icon?: string;
  largeIcon?: boolean;
  className?: string;
}

const Heading: FunctionComponent<Props> = ({ title, icon, largeIcon = false, className = '' }) => {
  return (
    <div className={'flex items-center ' + className}>
      {icon && <i className={icon} style={{fontSize: largeIcon ? '1.5rem' : 'initial'}}></i>}
      <h2 className="text-glow uppercase font-bold tracking-wide">{title}</h2>
    </div>
  );
};

export default memo(Heading);