export const getAllGalnetNewsArticles = async (params?: any) => {
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

export const getGalnetNewsArticle = async (id: number) => {
  const url = `http://localhost/api/galnet/news/${id}`
  const res = await fetch(url)
  if (!res.ok) {
    throw new Error('Failed to fetch data')
  }
  
  return res.json()
}