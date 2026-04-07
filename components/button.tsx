"use client";

import type { FormEvent, FunctionComponent, JSX } from "react";
import { memo } from "react";

interface Props {
  type?: "button" | "submit";
  children: string | JSX.Element | JSX.Element[];
  onClick: (event: FormEvent) => void;
  disabled?: boolean;
  loading?: boolean;
  theme?: "dark" | "light" | "elite" | "danger";
  extraStyling?: string;
}

const Button: FunctionComponent<Props> = ({
  type = "button",
  children,
  onClick,
  disabled = false,
  loading = false,
  theme = "dark",
  extraStyling,
}) => {
  let themeClasses, spinnerClasses;

  switch (theme) {
    case "light":
      themeClasses = "fx-btn-sweep border border-neutral-600 bg-neutral-800 text-neutral-200 hover:border-neutral-400 hover:text-white";
      spinnerClasses = "fill-white text-gray-400";
      break;
    case "danger":
      themeClasses = "fx-btn-sweep fx-btn-sweep--danger border border-red-900 bg-red-900/20 text-red-300 hover:border-red-500 hover:text-red-200";
      spinnerClasses = "fill-red-600 text-white";
      break;
    case "elite":
      themeClasses = "fx-btn-sweep fx-btn-sweep--elite border border-orange-900/40 bg-transparent text-glow__orange hover:border-orange-500 hover:text-orange-300";
      spinnerClasses = "fill-orange-500 text-neutral-700";
      break;
    default:
      themeClasses = "fx-btn-sweep border border-orange-900/20 bg-neutral-900 text-neutral-200 hover:border-neutral-600 hover:text-white";
      spinnerClasses = "fill-neutral-500 text-neutral-300";
  }

  const baseClassNames = `outline-none text-xs font-bold uppercase tracking-widest px-4 h-[37px] text-center transition-colors ${extraStyling ?? ""}`;
  const disabledClasses = "pointer-events-none";

  if (loading || disabled) {
    return (
      <button
        type={type}
        className={`${themeClasses} ${baseClassNames} ${disabledClasses} ${disabled ? "opacity-50" : ""}`}
        onClick={onClick}
      >
        {loading}
        {disabled && children}
      </button>
    );
  }

  return (
    <button type={type} className={`${themeClasses} ${baseClassNames}`} onClick={onClick}>
      {children}
    </button>
  );
};

export default memo(Button);
