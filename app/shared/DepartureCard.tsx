import { FunctionComponent } from "react";
import { Schedule } from "../interfaces/Schedule";
import { formatDate } from "../util";
import { getStatus, renderStatus } from "../mappings/schedule";

interface Props {
  className?: string;
  schedule: Schedule;
}

const DepartureCard: FunctionComponent<Props> = ({schedule, className}) => {
  const status = getStatus(schedule)
  const departed = status === 'DEPARTED' ? 'line-through' : ''
  return (
    <div className={`p-6 rounded shadow-lg bg-slate-50 dark:bg-neutral-900 ` + className}>
      <a href="#" className="flex flex-col md:max-w-xl">
        <h5 className={`mb-3 text-lg font-bold tracking-tight text-neutral-800 dark:text-gray-200 ` + departed}>{schedule.title}</h5>
        <p className="mb-4 text-sm font-normal text-neutral-800 dark:text-gray-300">
          {schedule.description.slice(0,65) + `...`}
        </p>
        <hr className="w-full"/>
        <div className="flex flex-row justify-between items-center text-sm mt-3 text-neutral-800 dark:text-gray-100">
          <div>
            <div className="flex flex-row gap-2">
              <p>From:</p>
              <p>{schedule.departure}</p>
            </div>
            <div className="flex flex-row gap-2">
              <p>To:</p>
              <p>{schedule.destination}</p>
            </div>
          </div>
          <div>
            <div className="flex flex-col gap-2">
              <p>{formatDate(schedule.departs_at)}</p>
            </div>
            <div className="flex flex-col gap-2">
              {renderStatus(schedule)}
            </div>
          </div>
        </div>
      </a>
    </div>
  );
}

export default DepartureCard;