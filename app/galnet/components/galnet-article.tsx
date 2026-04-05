"use client";

import type { FunctionComponent } from "react";
import type { Galnet } from "@/core/interfaces/Galnet";
import Image from "next/image";

interface Props {
  article: Galnet;
}

const GalnetArticle: FunctionComponent<Props> = ({ article }) => {
  return (
    <>
      <div className="galnet-article relative py-10 text-neutral-300">
        <h1 className="text-4xl">{article.title}</h1>
        <small>{article.uploaded_at}</small>
        <div className="mt-4 h-20 md:h-40">
          <Image
            className="relative max-h-full w-full rounded-lg object-cover shadow"
            src={article.banner_image}
            alt={article.title}
            width={1920}
            height={1080}
          />
        </div>
        <p
          className="galnet-article-content mt-4 tracking-wider"
          dangerouslySetInnerHTML={{ __html: article.content }}
        ></p>
      </div>
    </>
  );
};

export default GalnetArticle;
