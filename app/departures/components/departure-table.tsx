"use client"

import { FunctionComponent, useState } from "react";
import { Pagination } from "../../../interfaces/Pagination";
import { Schedule } from "../../../interfaces/Schedule";
import { getAllScheduledCarrierTrips, scheduleColumns } from "../departures";
import Filter from "../../components/filter";
import Table from "../../components/table";

interface Props {
  schedule: Pagination<Schedule>
}

const DepartureTable: FunctionComponent<Props> = ({ schedule }) => {
  const { data, meta, links } = schedule
  const [rows, setRows] = useState(data)

  const searchData = (text: string) => {
    setRows(data.filter(s => (new RegExp(text, 'i')).test(s.title)))
  }

  const paginate = async (link: string) => {
    const { data } = await getAllScheduledCarrierTrips(link)
    setRows(data)
  }

  return (
    <div>
      <Filter handleInput={searchData} className="mb-5" />
      <Table columns={scheduleColumns} data={rows} meta={meta} links={links} page={paginate} />
    </div>
  )
}

export default DepartureTable