import React, {ForwardedRef, RefObject} from "react";
import { FormEvent } from "react";

export interface Props {
  innerRef?: RefObject<HTMLInputElement> | ForwardedRef<any>;
  id?: string;
  label?: string;
  icon?: JSX.Element;
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

function Input({
  innerRef,
  id,
  label,
  icon,
  placeholder,
  value,
  onChange,
  disabled = false,
  type = 'text',
  subtitle,
  error,
  extraStyling,
  onClick,
}: Props) {
  return (
    <div>
      {label && <label htmlFor={id} className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-1">{label}</label>}
      <div className="relative rounded-lg shadow-sm">
        {icon &&
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <span className="text-gray-500 sm:text-sm">
              {icon}
            </span>
          </div>
        }
        <input
          ref={innerRef}
          id={id}
          type={type}
          className={`h-[37px] ${icon ? 'pl-[38px]' : ''} ${error ? 'border-red-500' : 'border-gray-300'} focus:ring-1 ${error ? 'focus:ring-red-500 focus:border-red-500' : 'focus:ring-blue-500 focus:border-blue-500'} block w-full ${icon ? 'pl-7' : ''} text-sm text-gray-900 dark:text-gray-200 dark:bg-gray-800 dark:border-gray-700 rounded-lg placeholder-gray-400 ${disabled ? '!bg-gray-50' : ''} ${extraStyling}`}
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
  )
}

export default React.memo(Input);