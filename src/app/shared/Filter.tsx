"use client"

import { FormEvent, FunctionComponent, useState } from "react";
import Input from "./Input";
import Button from "./Button";

interface Props {
  onClick?: (str: string) => any;
  className?: string;
}

const Filter: FunctionComponent<Props> = ({ onClick, className }) => {
  const [searchString, setSearchString] = useState<string>('');

  function handleSearchStringChange(e: FormEvent) {
    setSearchString((e.target as HTMLInputElement).value);
  }

  return (
    <div className={`w-full relative ` + className}>
      <form className="flex flex-row items-center gap-4">
        <Input
          placeholder="Search by departure system..."
          value={searchString}
          onChange={handleSearchStringChange}
          extraStyling="w-[400px]"
        />
        <Button
          type="submit"
          theme="dark"
          disabled={false}
          onClick={(e: FormEvent) => {
            e.preventDefault();
            return searchString
          }}
        >Search</Button>
        <Button
          type="submit"
          theme="light"
          disabled={false}
          onClick={() => {}}
        >Clear</Button>
      </form>
    </div>
  )
}

export default Filter