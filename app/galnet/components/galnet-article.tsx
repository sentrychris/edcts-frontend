
'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { Galnet} from '../../../interfaces/Galnet';
import { defaultState, getGalnetNewsArticle } from '../galnet';

const GalnetArticle = () => {
  const [article, setArticle] = useState<Galnet>(defaultState);

  const path = usePathname();
  const slug = path.split('/').pop();

  useEffect(() => {
    (async () => {
      const data = await getGalnetNewsArticle(slug as string);
      setArticle(data);
    })();
  }, []);

  return (
    <>
      <div className="flex items-center gap-2 pb-3 border-b border-neutral-800">
        <i className="icarus-terminal-notifications" style={{fontSize: '1.5rem'}}></i>
        <h2 className="uppercase text-3xl">Galnet News</h2>
      </div>
      <div className="relative border-b border-neutral-800 py-12">
        <h1 className='text-4xl'>{article.title}</h1>
        <small>{article.uploaded_at}</small>
        <p className="mt-4 tracking-wider" dangerouslySetInnerHTML={{ __html: article.content }}></p>
      </div>
    </>
  );
};

export default GalnetArticle;
  