'use client';

import { FormEvent, ForwardedRef, FunctionComponent, RefObject, memo } from 'react';

export interface Props {
  innerRef?: RefObject<HTMLInputElement> | ForwardedRef<any>;
  id?: string;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  type?: string;
  value: string | number | Date;
  onChange: (event: FormEvent) => void;
  subtitle?: string;
  error?: string;
  extraStyling?: string;
  onClick?: (event: FormEvent) => void;
}

const Input: FunctionComponent<Props> = ({
  innerRef,
  id,
  label,
  placeholder,
  value,
  onChange,
  disabled = false,
  type = 'text',
  subtitle,
  error,
  extraStyling,
  onClick,
}) => {
  return (
    <div className="grow">
      {label && <label htmlFor={id} className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-1">{label}</label>}
      <div className="relative rounded-lg shadow-sm">
        <input
          ref={innerRef}
          id={id}
          type={type}
          className={`h-[37px] pl-4 ${error ? 'border-red-500' : 'border-gray-300'} focus:ring-1 ${error ? 'focus:ring-red-500 focus:border-red-500' : 'focus:ring-blue-500 focus:border-blue-500'} block w-full text-sm text-gray-900 dark:text-gray-200 dark:bg-neutral-900 dark:border-gray-700 rounded-lg placeholder-gray-400 ${disabled ? '!bg-gray-50' : ''} ${extraStyling}`}
          placeholder={placeholder ?? 'Enter value'}
          value={value.toString()}
          onChange={onChange}
          disabled={disabled}
          onClick={onClick}
        />
      </div>
      {(subtitle || error) &&
        <div className="mt-1">
          {error && <small className="text-red-500">{error}</small>}
          {!error && subtitle && <small className="text-gray-500">{subtitle}</small>}
        </div>
      }
    </div>
  );
};

export default memo(Input);