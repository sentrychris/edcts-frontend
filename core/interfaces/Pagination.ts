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
  current_page: number;
  from: number;
  path: string;
  per_page: number;
  to: number;
}

export interface Pagination<T> {
  links: Links;
  meta: Meta;
  data: Array<T>;
}
