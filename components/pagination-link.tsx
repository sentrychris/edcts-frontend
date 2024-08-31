"use client";

import type { FormEvent, FunctionComponent, JSX } from "react";

interface Props {
  url: string | null;
  active: boolean;
  children: string | JSX.Element | JSX.Element[];
  paginate: (link: string) => void;
}

const PaginationLink: FunctionComponent<Props> = ({ url, active, children, paginate }) => {
  const disabledClass = url ? "" : "pointer-events-none opacity-70";
  if (!url) url = "#";

  async function handlePagination(e: FormEvent) {
    if (!(e.target instanceof HTMLButtonElement)) {
      return false;
    }

    paginate(e.target.dataset.url as string);
  }

  return (
    <button
      data-url={url}
      onClick={handlePagination}
      className={
        active
          ? `rounded bg-neutral-900 px-3 py-2 text-sm text-white ${disabledClass}`
          : `px-3 py-2 text-sm text-neutral-400 transition hover:rounded hover:bg-neutral-900 hover:text-white ${disabledClass}`
      }
    >
      {children}
    </button>
  );
};

export default PaginationLink;
