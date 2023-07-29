import { Pagination } from '../interfaces/Pagination';

export function isAbsoluteUrl(url: string) {
  return url.indexOf('http://') === 0 || url.indexOf('https://') === 0;
}

export const pagination = {
  data: [],
  links: {
    first: '',
    last: '',
    next: null,
    prev: null,
  },
  meta: {
    current_page: 1,
    from: 1,
    last_page: 1,
    links: [],
    path: '',
    per_page: 10,
    to: 0,
    total: 0
  }
};

export async function request(uri: string, params?: Record<string, string | number | boolean>) {
  const url = !isAbsoluteUrl(uri) ? `http://localhost/api/${uri}` : uri;
  //@ts-ignore
  const query: string = params ? '?' + new URLSearchParams(params) : '';
  const response = await fetch(`${url}${query}`);

  if (!response.ok) {
    throw new Error('Failed to fetch data');
  }
  
  return response.json();
};

export async function getCollection<T>(uri: string, params?: Record<string, string | number | boolean>): Promise<Pagination<T>> {
  return await request(uri, params);
}

export async function getResource<T>(uri: string, params?: Record<string, string | number | boolean>): Promise<T> {
  return await request(uri, params);
}
