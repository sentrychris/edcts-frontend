import type { FunctionComponent } from "react";

interface Props {
  icon: string;
  title: string;
  children: JSX.Element | string;
}

const StationServiceCard: FunctionComponent<Props> = ({ icon, title, children }) => {
  return (
    <>
      <div>
        <h5 className="text-glow__blue flex items-center gap-2 text-sm">
          <i className={`icarus-terminal-${icon} text-lg`}></i>
          <span>{title}</span>
        </h5>
        <span className="text-xs lowercase">{children}</span>
      </div>
    </>
  );
};

export default StationServiceCard;
