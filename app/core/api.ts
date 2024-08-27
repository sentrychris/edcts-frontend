import type { Pagination } from "./interfaces/Pagination";
import { settings } from "./config";

export const pagination = {
  data: [],
  links: {
    first: "",
    last: "",
    next: null,
    prev: null,
  },
  meta: {
    current_page: 1,
    from: 1,
    last_page: 1,
    links: [],
    path: "",
    per_page: 10,
    to: 0,
    total: 0,
  },
};

export function isAbsoluteUrl(url: string) {
  return url.indexOf("http://") === 0 || url.indexOf("https://") === 0;
}

export async function request(uri: string, params?: Record<string, string | number | boolean>, tags: string[] | null = null) {
  const url = !isAbsoluteUrl(uri) ? `${settings.api.url}/${uri}` : uri;
  const query: string = params ? "?" + new URLSearchParams(params as Record<string, string>) : "";
  const response = tags
    ? await fetch(`${url}${query}`, {
      next: {
        tags: tags,
      }
    })
    : await fetch(`${url}${query}`);

  if (!response.ok) {
    throw new Error("Failed to fetch data");
  }

  return response.json();
}

interface RequestOptions {
  params?: Record<string, string | number | boolean>;
  tags?: string[];
}

export async function getCollection<T>(
  uri: string,
  options?: RequestOptions,
): Promise<Pagination<T>> {
  return await request(uri, options?.params, options?.tags);
}

export async function getResource<T>(
  uri: string,
  options?: RequestOptions,
): Promise<{ data: T }> {
  return await request(uri, options?.params, options?.tags);
}
