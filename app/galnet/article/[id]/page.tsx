
import { FunctionComponent } from "react"
import GalnetArticle from "../../components/galnet-article"

const Page: FunctionComponent = async () => {
  return (
    <>
      <div className="grid grid-cols-1 mt-6">
        <GalnetArticle />
      </div>
    </>
  )
}

export default Page;
  