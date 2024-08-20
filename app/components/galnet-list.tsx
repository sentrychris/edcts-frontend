import type { FunctionComponent } from "react";
import type { Pagination } from "@/core/interfaces/Pagination";
import type { Galnet } from "@/core/interfaces/Galnet";
import Heading from "./heading";
import Link from "next/link";

interface Props {
  className?: string;
  articles: Pagination<Galnet>;
}

const GalnetList: FunctionComponent<Props> = ({ className, articles }) => {
  return (
    <div className={className}>
      <Heading
        icon="icarus-terminal-notifications text-glow__orange"
        largeIcon={true}
        title="Latest Galnet News"
        className="mb-3 gap-3 text-2xl"
      />
      {articles.data.slice(0, 5).map((article) => {
        return (
          <div key={article.id} className="relative">
            <div className="relative border-b border-neutral-800 py-4">
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

export default GalnetList;
