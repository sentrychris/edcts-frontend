"use client"

import { FormEvent, FunctionComponent, JSX } from "react";

interface Props {
  url: string | null;
  active: boolean;
  children: string | JSX.Element | JSX.Element[];
  paginate: (link: string) => void
}

const PaginationLink: FunctionComponent<Props> = ({ url, active, children, paginate }) => {
  const disabledClass = url ? '' : 'pointer-events-none opacity-70';
  if (!url) url = '#'

  async function handlePagination(e: FormEvent) {
    if (!(e.target instanceof HTMLButtonElement)) {
      return false;
    }

    paginate((e.target.dataset.url as string))
  }

  return (
  <button
      onClick={handlePagination}
      className={
        active ?
          `bg-stone-300 dark:bg-neutral-900 text-black dark:text-white px-3 py-2 rounded text-sm ${disabledClass}` :
          `text-neutral-900 dark:text-neutral-400 hover-bg-stone-900 dark:hover:bg-neutral-900 hover:text-stone-500 dark:hover:text-white hover:rounded transition px-3 py-2 text-sm ${disabledClass}`
      }
    >
      {children}
    </button>
  )
}

export default PaginationLink;