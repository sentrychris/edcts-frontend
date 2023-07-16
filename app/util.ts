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