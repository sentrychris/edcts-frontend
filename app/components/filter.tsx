"use client";

import type { FormEvent, FunctionComponent } from "react";
import { memo, useState } from "react";
import Input from "./input";
import Button from "./button";

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
  handleInput
}) => {
  const [filterInputState, setFilterInputState] = useState<string>("");

  async function handleFilterStringChange(e: FormEvent) {
    const { value } = e.target as HTMLInputElement;
    setFilterInputState(value);
    handleInput(value);
  }

  async function clearFilter() {
    setFilterInputState("");
    handleInput("");
  }

  return (
    <div
      className={
        "relative w-full border border-neutral-800 bg-transparent backdrop-blur backdrop-filter " +
        className
      }
    >
      <form className="flex flex-row items-center gap-4">
        {type === "text" ? (
          <Input
            type="text"
            placeholder={placeholder}
            value={filterInputState}
            onChange={handleFilterStringChange}
            extraStyling="w-[400px]"
          />
        ) : (
          <Input
            type="number"
            placeholder={placeholder}
            value={filterInputState}
            onChange={handleFilterStringChange}
          />
        )}

        {displayClearButton && (
          <Button
            type="submit"
            theme="elite"
            disabled={false}
            onClick={async (e: FormEvent) => {
              e.preventDefault();
              clearFilter();
            }}
          >
            Clear
          </Button>
        )}
      </form>
    </div>
  );
};

export default memo(Filter);
