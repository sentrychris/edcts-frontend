"use client";

import { type FunctionComponent, useEffect, useState } from "react";
import type { Galnet } from "@/core/interfaces/Galnet";
import { getResource } from "@/core/api";
import { galnetState } from "../lib/store";
import Image from "next/image";

interface Props {
  params: { slug: string };
}

const GalnetArticle: FunctionComponent<Props> = ({ params }) => {
  const [article, setArticle] = useState<Galnet>(galnetState);

  const { slug } = params;

  useEffect(() => {
    (async () => {
      const { data: article } = await getResource<Galnet>(`galnet/news/${slug}`);
      setArticle(article);
    })();
  }, [slug]);

  return (
    <>
      <div className="galnet-article relative py-10">
        <h1 className="text-4xl">{article.title}</h1>
        <small>{article.uploaded_at}</small>
        <div
          className="mt-4"
          style={{
            height: 150,
          }}
        >
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
