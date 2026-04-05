"use client";

import type { FunctionComponent } from "react";
import type { Galnet } from "@/core/interfaces/Galnet";
import Image from "next/image";

interface Props {
  article: Galnet;
}

const GalnetArticle: FunctionComponent<Props> = ({ article }) => {
  return (
    <div className="relative py-8 text-neutral-300">
      {/* Article header */}
      <div className="mb-6 border-b border-orange-900/20 pb-6">
        <p className="mb-3 text-xs uppercase tracking-widest text-neutral-600">{article.uploaded_at}</p>
        <h1 className="text-glow__white text-3xl font-bold uppercase tracking-wide leading-snug">
          {article.title}
        </h1>
      </div>

      {/* Banner image */}
      <div className="mb-6 h-32 md:h-56">
        <Image
          className="max-h-full w-full object-cover"
          src={article.banner_image}
          alt={article.title}
          width={1920}
          height={1080}
        />
      </div>

      {/* Body */}
      <div
        className="galnet-article-content tracking-wider leading-relaxed text-neutral-300"
        dangerouslySetInnerHTML={{ __html: article.content }}
      />
    </div>
  );
};

export default GalnetArticle;
