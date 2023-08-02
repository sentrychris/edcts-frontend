import { FunctionComponent, memo } from 'react';
import Link from 'next/link';
import { Schedule } from '../../lib/interfaces/Schedule';
import { formatDate } from '../../lib/util';
import { renderStatus } from '../lib/departures';

interface Props {
  className?: string;
  schedule: Schedule;
}

const DepartureCard: FunctionComponent<Props> = ({schedule, className}) => {
  const departed = schedule.status.departed ? 'line-through' : '';

  return (
    <div className={'py-6 ' + className}>
      <div className="flex flex-col md:max-w-xl">
        <Link href={`/departures/schedule/${schedule.slug}`}>
          <h5 className={'mb-3 text-lg font-bold tracking-tight text-neutral-800 dark:text-gray-200 hover:text-glow__orange hover:underline' + departed}>
            {schedule.title}
          </h5>
        </Link>
        <p className="mb-4 text-sm font-normal text-neutral-800 dark:text-gray-300">
          {schedule.description.slice(0,65) + '...'}
        </p>
        <hr className="w-full"/>
        <div className="flex flex-row justify-between items-center text-sm mt-3 text-neutral-800 dark:text-gray-100">
          <div>
            <div className="flex flex-row gap-2">
              <p>From:</p>
              <Link className="hover:text-glow__orange hover:underline"
                href={`systems/system/${schedule.departure.slug}`}>{schedule.departure.name}</Link>
            </div>
            <div className="flex flex-row gap-2">
              <p>To:</p>
              <Link className="hover:text-glow__orange hover:underline"
                href={`systems/system/${schedule.destination.slug}`}>{schedule.destination.name}</Link>
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
      </div>
    </div>
  );
};

export default memo(DepartureCard);