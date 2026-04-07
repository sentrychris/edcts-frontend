"use client";

import type { FunctionComponent } from "react";
import type { Galnet } from "@/core/interfaces/Galnet";
import type { Pagination } from "@/core/interfaces/Pagination";
import { usePaginatedCollection } from "@/core/hooks/paginated-collection";
import PaginationLinks from "@/components/pagination-links";
import Link from "next/link";

interface Props {
  articles: Pagination<Galnet>;
}

const GalnetList: FunctionComponent<Props> = ({ articles }) => {
  const { rows, meta, links, paginate } = usePaginatedCollection<Galnet>(articles);

  return (
    <>
      <div>
        {rows.map((article: Galnet, i: number) => (
          <div
            key={article.id}
            className="group border-b border-orange-900/20 py-6 last:border-b-0"
          >
            {/* Transmission header */}
            <div className="mb-3 flex items-center justify-between text-xs uppercase tracking-widest text-neutral-600">
              <span className="flex items-center gap-2">
                <i className="icarus-terminal-notifications text-orange-500/30 text-xs"></i>
                TRANSMISSION {String(i + 1).padStart(3, "0")}
              </span>
              <span>{article.uploaded_at}</span>
            </div>

            {/* Title */}
            <h3 className="text-glow__white mb-4 text-xl font-bold uppercase leading-snug tracking-wide transition-colors group-hover:text-orange-200">
              {article.title}
            </h3>

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

      <div className="py-4">
        <PaginationLinks metadata={meta} links={links} paginate={paginate} />
      </div>
    </>
  );
};

export default GalnetList;
