
"use client";

import { GalnetNews} from "../../../interfaces/GalnetNews"
import { getGalnetNewsArticle } from "../galnet"
import { useEffect, useState } from "react"
import { usePathname } from "next/navigation"

const GalnetArticle = () => {
  const [article, setArticle] = useState<GalnetNews>({
    id: 0,
    title: '',
    content: '',
    uploaded_at: '',
    banner_image: '',
  });

  const path = usePathname()
  const id = path.split('/').pop()

  useEffect(() => {
    (async () => {
      const data = await getGalnetNewsArticle(parseInt(id as string))
      setArticle(data)
    })()
  }, [])

  return (
    <>
      <h2 className="uppercase text-3xl pb-3 border-b border-neutral-800">Galnet News</h2>
      <div className="relative border-b border-neutral-800 py-12">
        <h1 className='text-4xl'>{article.title}</h1>
        <small>{article.uploaded_at}</small>
        <p className="mt-4 tracking-wider" dangerouslySetInnerHTML={{ __html: article.content }}></p>
      </div>
    </>
  )
}

export default GalnetArticle;
  