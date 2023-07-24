
'use client';

import { Galnet} from '../../../interfaces/Galnet';
import { defaultState, getGalnetNewsArticle } from '../galnet';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import Image from 'next/image';

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
      <h2 className="uppercase text-3xl pb-3 border-b border-neutral-800">Galnet News</h2>
      <div className="relative border-b border-neutral-800 py-12">
        <h1 className='text-4xl'>{article.title}</h1>
        <small>{article.uploaded_at}</small>
        <Image className="mt-4" alt="article-image" src={`${article.banner_image}`} width={0} height={0} sizes="100vw" style={{ width: '100%', height: 'auto' }} />
        <p className="mt-4 tracking-wider" dangerouslySetInnerHTML={{ __html: article.content }}></p>
      </div>
    </>
  );
};

export default GalnetArticle;
  