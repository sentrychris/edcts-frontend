"use client";

import type { FunctionComponent } from "react";
import { useState } from "react";
import Link from "next/link";
import type { Galnet } from "../../lib/interfaces/Galnet";
import type { Pagination } from "../../lib/interfaces/Pagination";
import Heading from "../../components/heading";
import PaginationLinks from "../../components/pagination-links";
import { getCollection } from "../../lib/api";

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
        <Heading
          icon="icarus-terminal-notifications"
          largeIcon={true}
          title="Galnet News"
          className="gap-3 border-b border-neutral-800 pb-3 text-2xl"
        />
        {rows.map((article: Galnet) => {
          return (
            <div
              key={article.id}
              className="relative border-b border-neutral-800 bg-transparent py-12 backdrop-blur backdrop-filter"
            >
              <h1 className="mb-2 text-4xl">{article.title}</h1>
              <p className="mb-6 text-xs">{article.uploaded_at}</p>
              <Link href={`/galnet/news/${article.slug}`} className="py-2 text-orange-400">
                Read Article...
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
