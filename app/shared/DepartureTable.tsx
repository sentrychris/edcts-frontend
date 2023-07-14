"use client"

import { FunctionComponent, useState } from "react";
import { Response } from "../interfaces/Response";
import { Schedule } from "../interfaces/Schedule";
import { scheduleColumns } from '../mappings/schedule'
import Filter from "./Filter";
import Table from "./Table";

interface Props {
  schedule: Response<Schedule>
}

const DepartureTable: FunctionComponent<Props> = ({ schedule }) => {
  const { data, meta, links } = schedule
  const [rows, setRows] = useState(data)

  const searchData = (text: string) => {
    const regexp = new RegExp(text, 'i')
    setRows(data.filter(s => regexp.test(s.title)))
  }

  return (
    <div>
      <Filter handleInput={searchData} className="mb-5" />
      <Table columns={scheduleColumns} data={rows} meta={meta} links={links} />
    </div>
  )
}

export default DepartureTable