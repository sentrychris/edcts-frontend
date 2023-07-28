export function formatDate(datestr: string) {
  return new Date(datestr).toLocaleString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  });
}

export function formatNumber(n: number) {
  return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

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

export async function request(uri: string, params?: Record<string, string>) {
  const url = !isAbsoluteUrl(uri) ? `http://localhost/api/${uri}` : uri;
  const query: string = params ? '?' + new URLSearchParams(params).toString() : '';
  const response = await fetch(`${url}${query}`);

  if (!response.ok) {
    throw new Error('Failed to fetch data');
  }
  
  return response.json();
};
