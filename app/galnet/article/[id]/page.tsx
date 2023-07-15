
import { FunctionComponent } from "react"
import GalnetArticle from "../../components/galnet-article"

const Page: FunctionComponent = async () => {
  return (
    <main className="flex flex-col px-6 md:px-12 lg:px-24 py-6 mx-auto text-neutral-800 dark:text-neutral-200">
      <h2 className="uppercase text-3xl mb-5">FCOC - Fleet Carrier Services</h2>
      <div className="grid grid-cols-1 mt-6">
        <GalnetArticle />
      </div>
    </main>
  )
}

export default Page;
  