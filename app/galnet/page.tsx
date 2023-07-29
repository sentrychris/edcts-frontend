import { Galnet } from '../interfaces/Galnet';
import GalnetList from './components/galnet-list';
import { getCollection } from '../service/api';

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
  