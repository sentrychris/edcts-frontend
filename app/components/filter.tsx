'use client';

import { FormEvent, FunctionComponent, memo, useState } from 'react';
import Input from './input';
import Button from './button';

interface Props {
  className?: string;
  handleInput: (text: string) => void;
}

const Filter: FunctionComponent<Props> = ({ className, handleInput }) => {
  const [filterInputState, setFilterInputState] = useState<string>('');

  async function handleFilterStringChange(e: FormEvent) {
    const { value } = (e.target as HTMLInputElement);
    setFilterInputState(value);
    handleInput(value);
  }

  async function clearFilter() {
    setFilterInputState('');
    handleInput('');
  }

  return (
    <div className={'w-full relative ' + className}>
      <form className="flex flex-row items-center gap-4">
        <Input
          placeholder="Filter by departure system..."
          value={filterInputState}
          onChange={handleFilterStringChange}
          extraStyling="w-[400px]"
        />
        <Button
          type="submit"
          theme="light"
          disabled={false}
          onClick={async (e: FormEvent) => {
            e.preventDefault();
            clearFilter();
          }}
        >Clear</Button>
      </form>
    </div>
  );
};

export default memo(Filter);