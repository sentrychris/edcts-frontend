import { memo } from "react";
import { cn } from "@/core/cn";

interface Props {
  title: string;
  subtitle?: string;
  icon?: string;
  iconSize?: string;
  bordered?: boolean;
  className?: string;
  children?: React.ReactNode;
}

const Heading = ({ title, subtitle, icon, iconSize = "1.25rem", bordered = false, className, children }: Props) => (
  <div className={cn("flex items-center gap-3", bordered && "border-b border-orange-900/20", className)}>
    {icon && <i className={`${icon} text-glow__orange`} style={{ fontSize: iconSize }} />}
    <div className={children ? "flex-1" : undefined}>
      <h2 className="text-glow__orange font-bold uppercase tracking-wide">{title}</h2>
      {subtitle && <p className="text-xs uppercase tracking-wider text-neutral-500">{subtitle}</p>}
    </div>
    {children}
  </div>
);

export default memo(Heading);
