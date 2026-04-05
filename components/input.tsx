"use client";

import type { FormEvent, ForwardedRef, FunctionComponent, RefObject } from "react";
import { memo } from "react";

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
  type = "text",
  subtitle,
  error,
  extraStyling,
  onClick,
}) => {
  return (
    <div className="grow">
      {label && (
        <label htmlFor={id} className="mb-1 block text-xs font-bold uppercase tracking-widest text-neutral-400">
          {label}
        </label>
      )}
      <div className="relative">
        <input
          ref={innerRef}
          id={id}
          type={type}
          className={`h-[37px] w-full border bg-transparent pl-4 text-xs uppercase tracking-wider text-neutral-200 placeholder-neutral-600 outline-none transition-colors focus:outline-none ${
            error
              ? "border-red-900/60 focus:border-red-500"
              : "border-orange-900/30 focus:border-orange-500/60"
          } ${extraStyling ?? ""}`}
          placeholder={placeholder ?? "Enter value"}
          value={value.toString()}
          onChange={onChange}
          disabled={disabled}
          onClick={onClick}
        />
      </div>
      {(subtitle || error) && (
        <div className="mt-1">
          {error && <small className="text-xs uppercase tracking-widest text-red-400">{error}</small>}
          {!error && subtitle && <small className="text-xs uppercase tracking-widest text-neutral-600">{subtitle}</small>}
        </div>
      )}
    </div>
  );
};

export default memo(Input);
