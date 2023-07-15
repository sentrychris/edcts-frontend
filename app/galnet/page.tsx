import { getAllGalnetNewsArticles } from './galnet'
import GalnetList from './components/galnet-list'

export default async function Page() {
  const articles = (await getAllGalnetNewsArticles('galnet/news'))

  return (
    <main className="flex flex-col px-6 md:px-12 lg:px-24 py-6 mx-auto text-neutral-800 dark:text-neutral-200">
      <h2 className="uppercase text-3xl mb-5">FCOC - Fleet Carrier Services</h2>
      <div className="grid grid-cols-1 mt-6">
        <GalnetList articles={articles} />
      </div>
    </main>
    )
  }
  