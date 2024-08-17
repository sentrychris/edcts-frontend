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
          ? `px-3 py-2 rounded text-sm bg-neutral-900 text-white ${disabledClass}`
          : `px-3 py-2 transition text-sm text-neutral-400 hover:bg-neutral-900 hover:text-white hover:rounded ${disabledClass}`
      }
    >
      {children}
    </button>
  );
};

export default memo(PaginationLink);
