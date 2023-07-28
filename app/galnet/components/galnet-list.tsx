
'use client';

import { FunctionComponent, useState } from 'react';
import Link from 'next/link';
import { Galnet} from '../../interfaces/Galnet';
import { Pagination } from '../../interfaces/Pagination';
import { getAllGalnetNewsArticles } from '../galnet';
import Heading from '@/app/components/heading';
import PaginationLinks from '@/app/components/pagination-links';

interface Props {
  articles: Pagination<Galnet>
}

const GalnetList: FunctionComponent<Props> = ({ articles }) => {
  const { data, meta, links } = articles;
  const [rows, setRows] = useState(data);
  const [metadata, setMetadata] = useState(meta);
  const [navigation, setNavigation] = useState(links);

  const paginate = async (link: string) => {
    const { data, meta, links } = await getAllGalnetNewsArticles(link);
    setRows(data);
    setMetadata(meta);
    setNavigation(links);
  };

  return (
    <>
      <div>
        <Heading icon="icarus-terminal-notifications"
          largeIcon={true}
          title="Galnet News"
          className="gap-3 pb-3 text-2xl border-b border-neutral-800" />
        {rows.map((article: Galnet) => {
          return (
            <div key={article.id} className="relative border-b border-neutral-800 py-12">
              <h1 className='text-4xl mb-2'>{article.title}</h1>
              <p className="text-xs mb-6">{article.uploaded_at}</p>
              <Link href={`/galnet/news/${article.slug}`} className="py-2 text-orange-400">
                Read Article...
              </Link>
            </div>
          );
        })}
      </div>
      <div>
        <PaginationLinks metadata={metadata} links={navigation} paginate={paginate} />
      </div>
    </>
  );
};

export default GalnetList;
  