"use client";

import { type FunctionComponent, useEffect, useState } from "react";
import type { Galnet } from "@/core/interfaces/Galnet";
import { getResource } from "@/core/api";
import { galnetState } from "../lib/store";

interface Props {
  params: { slug: string };
}

const GalnetArticle: FunctionComponent<Props> = ({ params }) => {
  const [article, setArticle] = useState<Galnet>(galnetState);

  const { slug } = params;

  useEffect(() => {
    (async () => {
      const data = await getResource<Galnet>(`galnet/news/${slug}`);
      setArticle(data);
    })();
  }, [slug]);

  return (
    <>
      <div className="relative border-b border-neutral-800 py-10">
        <h1 className="text-4xl">{article.title}</h1>
        <small>{article.uploaded_at}</small>
        <p
          className="mt-4 tracking-wider"
          dangerouslySetInnerHTML={{ __html: article.content }}
        ></p>
      </div>
    </>
  );
};

export default GalnetArticle;
