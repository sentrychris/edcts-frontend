"use client";

import type { FormEvent, FunctionComponent, JSX } from "react";
import { memo } from "react";

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
          ? `rounded bg-stone-300 px-3 py-2 text-sm text-black dark:bg-neutral-900 dark:text-white ${disabledClass}`
          : `hover-bg-stone-900 px-3 py-2 text-sm text-neutral-900 transition hover:rounded hover:text-stone-500 dark:text-neutral-400 dark:hover:bg-neutral-900 dark:hover:text-white ${disabledClass}`
      }
    >
      {children}
    </button>
  );
};

export default memo(PaginationLink);
