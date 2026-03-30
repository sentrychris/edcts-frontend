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
  const itemsPerSlice = 3;

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

  return (
    <div className={className}>
      <div className="flex justify-between pt-5">
        <button
          onClick={handlePrevSlice}
          disabled={currentSlice === 0}
          className="text-glow__orange hover:text-glow__blue py-2 text-xs uppercase disabled:opacity-50"
        >
          {"<<"} Prev
        </button>
        <button
          onClick={handleNextSlice}
          disabled={(currentSlice + 1) * itemsPerSlice >= articles.data.length}
          className="text-glow__orange hover:text-glow__blue py-2 text-xs uppercase disabled:opacity-50"
        >
          Next {">>"}
        </button>
      </div>
      {slicedArticles.map((article) => {
        return (
          <div key={article.id} className="relative">
            <div className="relative border-b border-neutral-800 py-5">
              <h3 className="mb-2 text-lg">{article.title}</h3>
              <p className="mb-2 text-xs">{article.uploaded_at}</p>
              <Link href={`/galnet/news/${article.slug}`} className="text-glow__orange">
                Read more...
              </Link>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default GalnetSidebar;
