import { getAllGalnetNewsArticles } from './galnet'
import { GalnetNews } from '../../interfaces/GalnetNews'
import PaginationLink from '../components/pagination-link'
import Link from 'next/link'
import { Pagination } from '@/interfaces/Pagination'

export default async function Page() {
  const { data, meta, links } = (await getAllGalnetNewsArticles({ limit: 10 }) as Pagination<GalnetNews>)

  return (
    <main className="flex flex-col px-6 md:px-12 lg:px-24 py-6 mx-auto text-neutral-800 dark:text-neutral-200">
      <h2 className="uppercase text-3xl mb-5">FCOC - Fleet Carrier Services</h2>
      <div className="grid grid-cols-1 mt-6">
        <div>
          <h2 className="uppercase text-3xl pb-3 border-b border-neutral-800">Galnet News</h2>
          {data.map((article: GalnetNews) => {
            return (
              <div className="relative border-b border-neutral-800 py-12">
                <h1 className='text-4xl mb-2'>{article.title}</h1>
                <p className="text-xs mb-6">{article.uploaded_at}</p>
                <p className="tracking-wider mb-6" dangerouslySetInnerHTML={{ __html: article.content.slice(0, 90) + '...' }}></p>
                <Link href={`/galnet/article/${article.id}`} className="py-2 px-4 bg-neutral-800 rounded text-sm">
                  Read More
                </Link>
              </div>
            )
          })}
        </div>
        <div>
        <ul className="flex items-center mx-auto my-7 content-evenly">
          <li>
            <PaginationLink
              key={`link_first`}
              url={(meta.current_page !== 1) && links.first ? links.first : null}
              active={false}
            >First</PaginationLink>
          </li>
          <li>
            <PaginationLink
              key={`link_prev`}
              url={links.prev}
              active={false}
            >Previous</PaginationLink>
          </li>
          {meta.links.map(link =>
            !isNaN(+link.label) &&
              <li key={`link_${link.label}`} className="mx-1 hidden md:block">
                <PaginationLink
                  url={link.url}
                  active={link.active}
                >
                  {link.label}
                </PaginationLink>
              </li>
          )}
          <li>
            <PaginationLink
              key={`link_next`}
              url={links.next}
              active={false}
            >Next</PaginationLink>
          </li>
          <li>
            <PaginationLink
              key={`link_last`}
              url={(meta.current_page !== meta.last_page) && links.last ? links.last : null}
              active={false}
            >Last</PaginationLink>
          </li>
        </ul>
        </div>
      </div>
    </main>
    )
  }
  