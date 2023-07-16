
import { FunctionComponent } from "react"
import DepartureSchedule from "../../components/departure-schedule"

const Page: FunctionComponent = async () => {
  return (
    <>
      <div className="grid grid-cols-1 mt-6">
        <DepartureSchedule />
      </div>
    </>
  )
}

export default Page;
  