"use client";

import type { FunctionComponent } from "react";
import type { Galnet } from "@/core/interfaces/Galnet";
import type { Pagination } from "@/core/interfaces/Pagination";
import { useState } from "react";
import { getCollection } from "@/core/api";
import PaginationLinks from "@/components/pagination-links";
import Link from "next/link";

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
        {rows.map((article: Galnet, i: number) => (
          <div
            key={article.id}
            className="group relative border-b border-orange-900/20 py-8 backdrop-blur backdrop-filter"
          >
            {/* Transmission header */}
            <div className="mb-3 flex items-center justify-between text-xs uppercase tracking-widest text-neutral-600">
              <span>TRANSMISSION {String(i + 1).padStart(3, "0")}</span>
              <span>{article.uploaded_at}</span>
            </div>

            {/* Title */}
            <h1 className="text-glow__white mb-4 text-2xl font-bold uppercase tracking-wide leading-snug group-hover:text-orange-200 transition-colors">
              {article.title}
            </h1>

            {/* Access link */}
            <Link
              href={`/galnet/news/${article.slug}`}
              className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-glow__orange transition-colors hover:text-orange-300"
            >
              Access Report <span>{">>"}</span>
            </Link>
          </div>
        ))}
      </div>
      <div className="pt-4">
        <PaginationLinks metadata={metadata} links={navigation} paginate={paginate} />
      </div>
    </>
  );
};

export default GalnetList;
