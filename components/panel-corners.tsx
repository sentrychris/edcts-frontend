import { memo } from "react";
import { cn } from "@/core/cn";

interface Props {
  /** Corner size: sm = h-3 w-3, md = h-4 w-4 (default), lg = h-5 w-5 */
  size?: "sm" | "md" | "lg";
  /** Tailwind border-color class. Defaults to border-orange-500. */
  color?: string;
  /** Whether to render the bottom two corners. Defaults to true. */
  bottom?: boolean;
  /** Extra classes applied to every corner span (e.g. "z-10"). */
  className?: string;
}

const sizes: Record<NonNullable<Props["size"]>, string> = {
  sm: "h-3 w-3",
  md: "h-4 w-4",
  lg: "h-5 w-5",
};

const PanelCorners = ({ size = "md", color = "border-orange-500", bottom = true, className }: Props) => {
  const base = cn("pointer-events-none absolute", sizes[size], color, className);

  return (
    <>
      <span className={`${base} -left-px -top-px border-l-2 border-t-2`} />
      <span className={`${base} -right-px -top-px border-r-2 border-t-2`} />
      {bottom && (
        <>
          <span className={`${base} -bottom-px -left-px border-b-2 border-l-2`} />
          <span className={`${base} -bottom-px -right-px border-b-2 border-r-2`} />
        </>
      )}
    </>
  );
};

export default memo(PanelCorners);
