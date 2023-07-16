export function formatDate(datestr: string) {
  return new Date(datestr).toLocaleString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  });
}

export function isAbsoluteUrl(url: string) {
  return url.indexOf('http://') === 0 || url.indexOf('https://') === 0;
}

export async function request(uri: string, params?: any) {
  const url = !isAbsoluteUrl(uri) ? `http://localhost/api/${uri}` : uri;
  const query: string = params ? '?' + new URLSearchParams(params).toString() : '';
  const response = await fetch(`${url}${query}`);

  if (!response.ok) {
    throw new Error('Failed to fetch data');
  }
  
  return response.json();
};
