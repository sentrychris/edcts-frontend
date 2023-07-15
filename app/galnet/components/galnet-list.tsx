
"use client";

import { GalnetNews} from "../../../interfaces/GalnetNews"
import { FunctionComponent, useState } from "react"
import { Pagination } from "@/interfaces/Pagination";
import Link from "next/link";
import PaginationLink from "@/app/components/pagination-link";
import { getAllGalnetNewsArticles } from "../galnet";

interface Props {
  articles: Pagination<GalnetNews>
}

const GalnetList: FunctionComponent<Props> = ({ articles }) => {
  const { data, meta, links } = articles
  const [rows, setRows] = useState(data)
  const [metadata, setMetadata] = useState(meta)
  const [navigation, setNavigation] = useState(links)

  const paginate = async (link: string) => {
    const { data, meta, links } = await getAllGalnetNewsArticles(link)
    setRows(data)
    setMetadata(meta)
    setNavigation(links)
  }

  return (
    <>
      <div>
        <h2 className="uppercase text-3xl pb-3 border-b border-neutral-800">Galnet News</h2>
        {rows.map((article: GalnetNews) => {
          return (
            <div className="relative border-b border-neutral-800 py-12">
              <h1 className='text-4xl mb-2'>{article.title}</h1>
              <p className="text-xs mb-6">{article.uploaded_at}</p>
              <p className="tracking-wider mb-6" dangerouslySetInnerHTML={{ __html: article.content.slice(0, 90) + '...' }}></p>
              <Link href={`/galnet/article/${article.id}`} className="py-2 text-orange-400">
                Read More...
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
              url={(metadata.current_page !== 1) && navigation.first ? navigation.first : null}
              active={false}
              paginate={paginate}
            >First</PaginationLink>
          </li>
          <li>
            <PaginationLink
              key={`link_prev`}
              url={navigation.prev}
              active={false}
              paginate={paginate}
            >Previous</PaginationLink>
          </li>
          {metadata.links.map(link =>
            !isNaN(+link.label) &&
              <li key={`link_${link.label}`} className="mx-1 hidden md:block">
                <PaginationLink
                  url={link.url}
                  active={link.active}
                  paginate={paginate}
                >
                  {link.label}
                </PaginationLink>
              </li>
          )}
          <li>
            <PaginationLink
              key={`link_next`}
              url={navigation.next}
              active={false}
              paginate={paginate}
            >Next</PaginationLink>
          </li>
          <li>
            <PaginationLink
              key={`link_last`}
              url={(metadata.current_page !== metadata.last_page) && navigation.last ? navigation.last : null}
              active={false}
              paginate={paginate}
            >Last</PaginationLink>
          </li>
        </ul>
      </div>
    </>
  )
}

export default GalnetList;
  