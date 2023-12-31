'use client';

import { FormEvent, FunctionComponent, JSX, memo } from 'react';

interface Props {
  type?: 'button' | 'submit';
  children: string | JSX.Element | JSX.Element[];
  onClick: (event: FormEvent) => void;
  disabled?: boolean;
  loading?: boolean;
  theme?: 'dark' | 'light' | 'elite' | 'danger';
  extraStyling?: string;
}

const Button: FunctionComponent<Props> = ({type = 'button', children, onClick, disabled = false, loading = false, theme = 'dark', extraStyling}) => {
  let themeClasses,
    spinnerClasses;

  switch (theme) {
    case 'light':
      themeClasses = 'bg-white hover:bg-stone-100 text-neutral-900';
      spinnerClasses = 'fill-white text-gray-400';
      break;
    case 'danger':
      themeClasses = 'bg-red-600 hover:bg-red-400 text-white';
      spinnerClasses = 'fill-red-600 text-white';
      break;
    case 'elite':
      themeClasses = 'bg-transparent text-glow__white';
      break;
    default:
      themeClasses = 'bg-neutral-900 dark:bg-neutral-800 hover:bg-neutral-700 dark:hover:bg-neutral-700 text-white';
      spinnerClasses = 'fill-gray-900 text-blue-400';
  }

  const baseClassNames = `outline-none text-sm font-semibold tracking-wide rounded-lg text-sm px-3 h-[37px] shadow-sm text-center ${extraStyling}`;
  const disabledClasses = 'pointer-events-none';

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
    );
  }

  return (
    <button
      type={type}
      className={`${themeClasses} ${baseClassNames}`}
      onClick={onClick}
    >{children}</button>
  );
};

export default memo(Button);