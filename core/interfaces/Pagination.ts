export interface Links {
  first: string;
  last: string;
  next: string | null;
  prev: string | null;
}

interface Link {
  active: boolean;
  label: string;
  url: string | null;
}

export interface Meta {
  path: string;
  per_page: number;
  next_cursor: string;
  prev_cursor: string;
}

export interface Pagination<T> {
  data: Array<T>;
  links: Links;
  meta: Meta;
}
