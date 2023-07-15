import { GetGalnetNews } from "../../interfaces/GalnetNews"
import { isAbsoluteUrl } from "../util"

export const getAllGalnetNewsArticles: GetGalnetNews = async (uri, params?: any) => {
  const url = !isAbsoluteUrl(uri) ? `http://localhost/api/${uri}` : uri
  const query: string = params ? `?` + new URLSearchParams(params).toString() : ''
  const response = await fetch(`${url}${query}`)

  if (!response.ok) {
    throw new Error('Failed to fetch data')
  }
  
  return response.json()
}

export const getGalnetNewsArticle = async (id: number) => {
  const url = `http://localhost/api/galnet/news/${id}`
  const res = await fetch(url)
  if (!res.ok) {
    throw new Error('Failed to fetch data')
  }
  
  return res.json()
}