"use client";

import type { FormEvent, FunctionComponent } from "react";
import { memo, useState } from "react";

interface Props {
  className?: string;
  type?: string;
  placeholder?: string;
  displayClearButton?: boolean;
  handleInput: (text: string) => void;
}

const Filter: FunctionComponent<Props> = ({
  className,
  type = "text",
  placeholder = "Filter...",
  displayClearButton = true,
  handleInput,
}) => {
  const [filterInputState, setFilterInputState] = useState<string>("");

  function handleFilterStringChange(e: FormEvent) {
    const { value } = e.target as HTMLInputElement;
    setFilterInputState(value);
    handleInput(value);
  }

  function clearFilter() {
    setFilterInputState("");
    handleInput("");
  }

  return (
    <div
      className={
        "relative w-full border border-orange-900/30 bg-black/20 backdrop-blur backdrop-filter " +
        className
      }
    >
      <form className="flex items-center">
        <span className="flex shrink-0 items-center border-r border-orange-900/30 px-3 py-2.5">
          <i className="icarus-terminal-route text-xs text-orange-500/50"></i>
        </span>
        <input
          type={type}
          placeholder={placeholder}
          value={filterInputState}
          onChange={handleFilterStringChange}
          className="h-10 min-w-0 flex-1 bg-transparent px-3 text-xs uppercase tracking-wider text-neutral-200 placeholder-neutral-600 outline-none focus:placeholder-neutral-700"
        />
        {displayClearButton && (
          <button
            type="submit"
            onClick={(e: FormEvent) => {
              e.preventDefault();
              clearFilter();
            }}
            className="shrink-0 border-l border-orange-900/30 px-3 text-xs uppercase tracking-widest text-orange-500/60 transition-colors hover:text-orange-400"
          >
            CLR
          </button>
        )}
      </form>
    </div>
  );
};

export default memo(Filter);
