import type { FunctionComponent } from "react";
import { memo } from "react";

interface Props {
  title: string;
  subtitle?: string;
  icon?: string;
  largeIcon?: boolean;
  className?: string;
}

const Heading: FunctionComponent<Props> = ({ title, subtitle, icon, largeIcon = false, className = "" }) => {
  return (
    <div className={"flex items-center gap-3 " + className}>
      {icon && (
        <i className={icon} style={{ fontSize: largeIcon ? "1.5rem" : "initial" }}></i>
      )}
      <div>
        <h2 className="text-glow__orange font-bold uppercase tracking-widest">{title}</h2>
        {subtitle && (
          <p className="text-xs uppercase tracking-wider text-neutral-500">{subtitle}</p>
        )}
      </div>
    </div>
  );
};

export default memo(Heading);
