"use client"

import { FormEvent, FunctionComponent, JSX } from "react";

interface Props {
  url: string | null;
  active: boolean;
  children: string | JSX.Element | JSX.Element[];
  handleApiPagination: (link: string) => void
}

const PaginationLink: FunctionComponent<Props> = ({ url, active, children, handleApiPagination }) => {
  const disabledClass = url ? '' : 'pointer-events-none opacity-70';
  if (!url) url = '#'

  async function handlePagination(e: FormEvent) {
    if (!(e.target instanceof HTMLButtonElement)) {
      return false;
    }

    handleApiPagination((e.target.dataset.url as string))
  }

  return (
  <button
      data-url={url}
      onClick={handlePagination}
      className={
        active ?
          `bg-zinc-900 text-white px-3 py-2 rounded text-sm ${disabledClass}` :
          `text-zinc-500 dark:text-zinc-300 hover:bg-zinc-900 hover:text-white hover:rounded transition px-3 py-2 text-sm ${disabledClass}`
      }
    >
      {children}
    </button>
  )
}

export default PaginationLink;