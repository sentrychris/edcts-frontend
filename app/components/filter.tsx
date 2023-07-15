"use client"

import { FormEvent, FunctionComponent, memo, useState } from "react";
import Input from "./input";
import Button from "./button";

interface Props {
  className?: string;
  handleInput: (text: string) => void
}

const Filter: FunctionComponent<Props> = ({ className, handleInput }) => {
  const [filterString, setFilterString] = useState<string>('');

  async function handleFilterStringChange(e: FormEvent) {
    setFilterString((e.target as HTMLInputElement).value);
    handleInput(filterString)
  }

  async function clearFilter() {
    setFilterString('')
    handleInput('')
  }

  return (
    <div className={`w-full relative ` + className}>
      <form className="flex flex-row items-center gap-4">
        <Input
          placeholder="Filter by departure system..."
          value={filterString}
          onChange={handleFilterStringChange}
          extraStyling="w-[400px]"
        />
        <Button
          type="submit"
          theme="light"
          disabled={false}
          onClick={async (e: FormEvent) => {
            e.preventDefault()
            clearFilter();
          }}
        >Clear</Button>
      </form>
    </div>
  )
}

export default memo(Filter)