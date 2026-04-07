import { memo } from "react";
import { cn } from "@/core/cn";

interface Props {
  icon: string;
  title: string;
  className?: string;
}

const SectionHeader = ({ icon, title, className }: Props) => (
  <div className={cn("mb-3 flex items-center gap-2 border-b border-orange-900/20 pb-2 text-xs uppercase tracking-widest text-neutral-600", className)}>
    <i className={`${icon} text-orange-500/50`} />
    <span>{title}</span>
  </div>
);

export default memo(SectionHeader);
