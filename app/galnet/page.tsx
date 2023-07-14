"use server"

import { getGalnetNews } from '../services/galnet'
import { GalnetNews } from '../interfaces/GalnetNews'

export default async function GalnetNews() {
  const news = await getGalnetNews({ limit: 10000 })

  return (
    <main className="flex flex-col px-6 md:px-12 lg:px-24 py-6 mx-auto text-neutral-800 dark:text-neutral-200">
      <h2 className="uppercase text-3xl mb-5">FCOC - Fleet Carrier Services</h2>
      <div className="grid grid-cols-1 mt-6">
        <div>
          <h2 className="uppercase text-3xl mb-6 pb-3 border-b border-neutral-800">Galnet News</h2>
          {news.data.map((article: GalnetNews) => {
            return (
              <>
                <div className="relative">
                  <h1 className='text-4xl'>{article.title}</h1>
                  <small>{article.uploaded_at}</small>
                  <p className="mt-4 tracking-wider" dangerouslySetInnerHTML={{ __html: article.content }}></p>
                </div>
                <hr className="my-14" />
              </>
            )
          })}
        </div>
      </div>
    </main>
    )
  }
  