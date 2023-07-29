
'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { Galnet} from '../../interfaces/Galnet';
import { galnetState } from '../service/galnet';
import Heading from '../../components/heading';
import { getResource } from '../../service/api';

const GalnetArticle = () => {
  const [article, setArticle] = useState<Galnet>(galnetState);

  const path = usePathname();
  const slug = path.split('/').pop();

  useEffect(() => {
    (async () => {
      const data = await getResource<Galnet>(`galnet/news/${slug}`);
      setArticle(data);
    })();
  }, [slug]);

  return (
    <>
      <Heading icon="icarus-terminal-notifications"
        largeIcon={true}
        title="Galnet News"
        className="gap-3 pb-3 text-2xl border-b border-neutral-800" />
      <div className="relative border-b border-neutral-800 py-10">
        <h1 className='text-4xl'>{article.title}</h1>
        <small>{article.uploaded_at}</small>
        <p className="mt-4 tracking-wider" dangerouslySetInnerHTML={{ __html: article.content }}></p>
      </div>
    </>
  );
};

export default GalnetArticle;
  