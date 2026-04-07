"use client";

import { useState, type FunctionComponent } from "react";
import type { Pagination } from "@/core/interfaces/Pagination";
import type { Galnet } from "@/core/interfaces/Galnet";
import Link from "next/link";
import Panel from "@/components/panel";
import Heading from "@/components/heading";
import { cn } from "@/core/cn";

interface Props {
  className?: string;
  articles: Pagination<Galnet>;
}

const GalnetSidebar: FunctionComponent<Props> = ({ className, articles }) => {
  const [currentSlice, setCurrentSlice] = useState(0);
  const itemsPerSlice = 5;

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
    <Panel variant="muted" className={cn("fx-border-breathe", className)} cornerClassName="z-10">

      <div className="p-4">
        {/* Section header */}
        <Heading bordered icon="icarus-terminal-notifications" title="Galnet Comms" subtitle="Uplink Channel" className="mb-4 pb-4">
          <span className="flex items-center gap-1.5 text-xs uppercase tracking-wider text-neutral-500">
            <span className="fx-dot-orange h-1.5 w-1.5"></span>
            Live
          </span>
        </Heading>

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
    </Panel>
  );
};

export default GalnetSidebar;
