export const getGalnetNews = async (params?: any) => {
  params = {limit: 999} // TODO fix properly
  const url = 'http://localhost/api/galnet/news'
  const query: string = params
    ? new URLSearchParams(params).toString()
    : ''

  const res = await fetch(`${url}?${query}`)
  if (!res.ok) {
    throw new Error('Failed to fetch data')
  }
  
  return res.json()
}