import { Galnet } from '../lib/interfaces/Galnet';
import GalnetList from './components/galnet-list';
import { getCollection } from '../lib/api';

export default async function Page() {
  const articles = await getCollection<Galnet>('galnet/news');

  return (
    <>
      <div className="grid grid-cols-1 mt-6">
        <GalnetList articles={articles} />
      </div>
    </>
  );
}
  