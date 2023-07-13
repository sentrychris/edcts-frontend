import React from "react";
import { FormEvent } from "react";

interface Props {
  type?: 'button' | 'submit';
  children: string | JSX.Element | JSX.Element[];
  onClick: (event: FormEvent) => void;
  disabled?: boolean;
  loading?: boolean;
  theme?: 'dark' | 'light' | 'danger';
  extraStyling?: string;
}

function Button({type = 'button', children, onClick, disabled = false, loading = false, theme = 'dark', extraStyling}: Props) {
  let themeClasses,
    spinnerClasses;

  switch (theme) {
    case 'light':
      themeClasses = "bg-white text-gray-700";
      spinnerClasses = "fill-white text-gray-400";
      break;
    case 'danger':
      themeClasses = "bg-red-600 hover:bg-red-400 text-white";
      spinnerClasses = "fill-red-600 text-white";
      break;
    default:
      themeClasses = "bg-neutral-900 dark:bg-sky-900 hover:bg-gray-700 dark:hover:bg-sky-700 text-white";
      spinnerClasses = "fill-gray-900 text-blue-400";
  }

  const baseClassNames = `outline-none text-sm font-semibold tracking-wide rounded-lg text-sm px-3 h-[37px] shadow-sm text-center ${extraStyling}`;
  const disabledClasses = "pointer-events-none";

  if (loading || disabled) {
    return (
      <button
        type={type}
        className={`${themeClasses} ${baseClassNames} ${disabledClasses} ${disabled ? 'opacity-70' : ''}`}
        onClick={onClick}
      >
        {loading}
        {disabled && children}
      </button>
    )
  }

  return (
    <button
      type={type}
      className={`${themeClasses} ${baseClassNames}`}
      onClick={onClick}
    >{children}</button>
  )
}

export default React.memo(Button);