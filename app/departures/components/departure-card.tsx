import { Schedule } from '../../../interfaces/Schedule';
import { formatDate } from '../../util';
import { renderStatus } from '../departures';
import { FunctionComponent } from 'react';
import Link from 'next/link';

interface Props {
  className?: string;
  schedule: Schedule;
}

const DepartureCard: FunctionComponent<Props> = ({schedule, className}) => {
  const departed = schedule.status.departed ? 'line-through' : '';

  return (
    <div className={'p-6 rounded shadow-lg bg-slate-50 dark:bg-neutral-900 ' + className}>
      <Link href={`/departures/schedule/${schedule.slug}`} className="flex flex-col md:max-w-xl">
        <h5 className={'mb-3 text-lg font-bold tracking-tight text-neutral-800 dark:text-gray-200 ' + departed}>{schedule.title}</h5>
        <p className="mb-4 text-sm font-normal text-neutral-800 dark:text-gray-300">
          {schedule.description.slice(0,65) + '...'}
        </p>
        <hr className="w-full"/>
        <div className="flex flex-row justify-between items-center text-sm mt-3 text-neutral-800 dark:text-gray-100">
          <div>
            <div className="flex flex-row gap-2">
              <p>From:</p>
              <p>{schedule.departure.name}</p>
            </div>
            <div className="flex flex-row gap-2">
              <p>To:</p>
              <p>{schedule.destination.name}</p>
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
      </Link>
    </div>
  );
};

export default DepartureCard;