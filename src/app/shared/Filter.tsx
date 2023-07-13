"use client"

import { FormEvent, useState } from "react";
import Input from "./Input";
import Button from "./Button";

export default function Filter() {
  const [searchString, setSearchString] = useState<string>('');

  function handleSearchStringChange(e: FormEvent) {
    setSearchString((e.target as HTMLInputElement).value);
  }

  return (
    <div className="w-full relative mt-6">
      <form className="flex flex-row items-center gap-4 font-mono">
        <Input
          placeholder="Search departure system"
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

          }}
        >Search</Button>
        <Button
          type="submit"
          theme="light"
          disabled={false}
          onClick={(e: FormEvent) => {
            e.preventDefault();
            setSearchString('')
          }}
        >Clear</Button>
      </form>
    </div>
  )
}