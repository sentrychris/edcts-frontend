import { memo } from "react";
import { cn } from "@/core/cn";
import PanelCorners from "./panel-corners";

interface Props {
  /** Border intensity: default = /40 (prominent panels), muted = /20 (secondary panels) */
  variant?: "default" | "muted";
  /** Corner bracket size passed through to PanelCorners */
  corners?: "sm" | "md" | "lg";
  /** Extra classes on each corner span (e.g. "z-10") */
  cornerClassName?: string;
  /** Additional classes: padding, margin, animation fx- classes, etc. */
  className?: string;
  children: React.ReactNode;
}

const variantBorder: Record<NonNullable<Props["variant"]>, string> = {
  default: "border-orange-900/40",
  muted: "border-orange-900/20",
};

const Panel = ({ variant = "default", corners = "md", cornerClassName, className, children }: Props) => (
  <div className={cn("relative border", variantBorder[variant], "bg-black/50 backdrop-blur backdrop-filter", className)}>
    <PanelCorners size={corners} className={cornerClassName} />
    {children}
  </div>
);

export default memo(Panel);
