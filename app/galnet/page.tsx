import { getAllGalnetNewsArticles } from './galnet'
import GalnetList from './components/galnet-list'

export default async function Page() {
  const articles = (await getAllGalnetNewsArticles('galnet/news'))

  return (
    <>
      <div className="grid grid-cols-1 mt-6">
        <GalnetList articles={articles} />
      </div>
    </>
  )
}
  