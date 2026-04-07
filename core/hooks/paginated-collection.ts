import { useState } from "react";
import type { Links, Meta, Pagination } from "@/core/interfaces/Pagination";
import { getCollection } from "@/core/api";

interface Result<T> {
  rows: T[];
  meta: Meta;
  links: Links;
  /** Update all pagination state at once — use after custom search/filter fetches. */
  setPage: (result: Pagination<T>) => void;
  /** Fetch the given URL and update pagination state. */
  paginate: (link: string) => Promise<void>;
}

/**
 * Manages rows/meta/links state for server-paginated collections.
 * Pass initial SSR data and use `paginate` for page navigation.
 * Use `setPage` after your own `getCollection` calls to keep state in sync.
 */
export function usePaginatedCollection<T>(initial: Pagination<T>): Result<T> {
  const [rows, setRows] = useState<T[]>(initial.data);
  const [meta, setMeta] = useState<Meta>(initial.meta);
  const [links, setLinks] = useState<Links>(initial.links);

  const setPage = ({ data, meta, links }: Pagination<T>) => {
    setRows(data);
    setMeta(meta);
    setLinks(links);
  };

  const paginate = async (link: string) => {
    const result = await getCollection<T>(link);
    setPage(result);
  };

  return { rows, meta, links, setPage, paginate };
}
