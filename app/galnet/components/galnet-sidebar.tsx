"use client";

import { useState, type FunctionComponent } from "react";
import type { Pagination } from "@/core/interfaces/Pagination";
import type { Galnet } from "@/core/interfaces/Galnet";
import Link from "next/link";

interface Props {
  className?: string;
  articles: Pagination<Galnet>;
}

const GalnetSidebar: FunctionComponent<Props> = ({ className, articles }) => {
  const [currentSlice, setCurrentSlice] = useState(0);
  const itemsPerSlice = 8;

  const handleNextSlice = () => {
    if ((currentSlice + 1) * itemsPerSlice < articles.data.length) {
      setCurrentSlice((prev) => prev + 1);
    }
  };

  const handlePrevSlice = () => {
    if (currentSlice > 0) {
      setCurrentSlice((prev) => prev - 1);
    }
  };

  const startIndex = currentSlice * itemsPerSlice;
  const slicedArticles = articles.data.slice(startIndex, startIndex + itemsPerSlice);
  const totalSlices = Math.ceil(articles.data.length / itemsPerSlice);

  return (
    <div className={"fx-border-breathe relative border border-orange-900/20 bg-black/50 backdrop-blur backdrop-filter" + (className ?? "")}>
      {/* Corner bracket accents */}
      <span className="pointer-events-none absolute -left-px -top-px z-10 h-4 w-4 border-l-2 border-t-2 border-orange-500" />
      <span className="pointer-events-none absolute -right-px -top-px z-10 h-4 w-4 border-r-2 border-t-2 border-orange-500" />
      <span className="pointer-events-none absolute -bottom-px -left-px z-10 h-4 w-4 border-b-2 border-l-2 border-orange-500" />
      <span className="pointer-events-none absolute -bottom-px -right-px z-10 h-4 w-4 border-b-2 border-r-2 border-orange-500" />

      <div className="p-4">
      {slicedArticles.map((article, i) => (
        <div key={article.id} className="group relative border-b border-orange-900/20 py-4">
          {/* Transmission index */}
          <div className="mb-2 flex items-center justify-between">
            <span className="text-xs uppercase tracking-widest text-neutral-600">
              TRANSMISSION {String(startIndex + i + 1).padStart(3, "0")}
            </span>
            <span className="text-xs uppercase tracking-widest text-neutral-600">
              {article.uploaded_at}
            </span>
          </div>

          {/* Title */}
          <h3 className="mb-3 text-sm uppercase leading-snug tracking-wide text-neutral-400 group-hover:text-neutral-300">
            {article.title}
          </h3>

          {/* Read more */}
          <Link
            href={`/galnet/news/${article.slug}`}
            className="flex items-center gap-2 text-xs uppercase tracking-widest text-glow__orange font-bold transition-colors hover:text-orange-300"
          >
            Access Report <span>{">>"}</span>
          </Link>
        </div>
      ))}

      {/* Pagination */}
      <div className="flex items-center justify-between pt-4 text-xs uppercase tracking-widest">
        <button
          onClick={handlePrevSlice}
          disabled={currentSlice === 0}
          className="flex items-center gap-2 text-glow__orange uppercase transition-colors hover:text-glow__blue disabled:cursor-not-allowed disabled:opacity-30"
        >
          Prev
        </button>
        <span className="text-neutral-600">
          {currentSlice + 1} / {totalSlices}
        </span>
        <button
          onClick={handleNextSlice}
          disabled={(currentSlice + 1) * itemsPerSlice >= articles.data.length}
          className="flex items-center gap-2 text-glow__orange uppercase transition-colors hover:text-glow__blue disabled:cursor-not-allowed disabled:opacity-30"
        >
          Next
        </button>
      </div>
      </div>
    </div>
  );
};

export default GalnetSidebar;
