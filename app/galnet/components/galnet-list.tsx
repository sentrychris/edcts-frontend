"use client";

import type { FunctionComponent } from "react";
import type { Galnet } from "@/core/interfaces/Galnet";
import type { Pagination } from "@/core/interfaces/Pagination";
import { useState } from "react";
import { getCollection } from "@/core/api";
import Link from "next/link";
import PaginationLinks from "@/components/pagination-links";

interface Props {
  articles: Pagination<Galnet>;
}

const GalnetList: FunctionComponent<Props> = ({ articles }) => {
  const { data, meta, links } = articles;
  const [rows, setRows] = useState(data);
  const [metadata, setMetadata] = useState(meta);
  const [navigation, setNavigation] = useState(links);

  const paginate = async (link: string) => {
    const { data, meta, links } = await getCollection<Galnet>(link);
    setRows(data);
    setMetadata(meta);
    setNavigation(links);
  };

  return (
    <>
      <div>
        {rows.map((article: Galnet) => {
          return (
            <div
              key={article.id}
              className="relative border-b border-neutral-800 bg-transparent py-12 backdrop-blur backdrop-filter"
            >
              <h1 className="mb-2 text-4xl">{article.title}</h1>
              <p className="mb-6 text-xs">{article.uploaded_at}</p>
              <Link
                href={`/galnet/news/${article.slug}`}
                className="text-glow__orange py-2 font-bold"
              >
                Read more...
              </Link>
            </div>
          );
        })}
      </div>
      <div>
        <PaginationLinks metadata={metadata} links={navigation} paginate={paginate} />
      </div>
    </>
  );
};

export default GalnetList;
