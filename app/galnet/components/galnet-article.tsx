"use client";

import type { FunctionComponent } from "react";
import type { Galnet } from "@/core/interfaces/Galnet";
import Image from "next/image";

interface Props {
  article: Galnet;
}

const GalnetArticle: FunctionComponent<Props> = ({ article }) => {
  return (
    <div className="relative border border-orange-900/40 bg-black/50 backdrop-blur backdrop-filter">
      {/* Corner brackets */}
      <span className="pointer-events-none absolute -left-px -top-px h-4 w-4 border-l-2 border-t-2 border-orange-500" />
      <span className="pointer-events-none absolute -right-px -top-px h-4 w-4 border-r-2 border-t-2 border-orange-500" />
      <span className="pointer-events-none absolute -bottom-px -left-px h-4 w-4 border-b-2 border-l-2 border-orange-500" />
      <span className="pointer-events-none absolute -bottom-px -right-px h-4 w-4 border-b-2 border-r-2 border-orange-500" />

      {/* ── Article header ── */}
      <div className="border-b border-orange-900/20 px-6 py-5">
        <div className="mb-3 flex items-center gap-3 text-xs uppercase tracking-widest text-neutral-600">
          <i className="icarus-terminal-notifications text-orange-500/40"></i>
          <span>Vox Galactica</span>
          <span className="text-neutral-800">■</span>
          <span>{article.uploaded_at}</span>
          <span className="ml-auto flex items-center gap-1.5">
            <span className="fx-dot-orange h-1.5 w-1.5"></span>
            <span>Transmission</span>
          </span>
        </div>
        <h1 className="text-glow__white text-2xl font-bold uppercase leading-snug tracking-wide md:text-3xl">
          {article.title}
        </h1>
      </div>

      {/* ── Banner image ── */}
      <div className="border-b border-orange-900/20">
        <Image
          className="w-full object-cover"
          src={article.banner_image}
          alt={article.title}
          width={1920}
          height={400}
          style={{ maxHeight: "14rem", objectPosition: "center" }}
        />
      </div>

      {/* ── Body ── */}
      <div className="px-6 py-6">
        <div
          className="galnet-article-content leading-relaxed tracking-wide text-neutral-400"
          dangerouslySetInnerHTML={{ __html: article.content }}
        />
      </div>
    </div>
  );
};

export default GalnetArticle;
