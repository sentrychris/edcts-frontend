import type { FunctionComponent } from "react";
import { memo } from "react";
import Link from "next/link";
import type { Schedule } from "../../core/interfaces/Schedule";
import { formatDate } from "../../core/util";
import { renderStatusText } from "../lib/store";

interface Props {
  className?: string;
  schedule: Schedule;
}

const DepartureCard: FunctionComponent<Props> = ({ schedule, className }) => {
  const departed = schedule.status.departed ? "line-through" : "";

  return (
    <div className={"bg-transparent py-6 backdrop-blur backdrop-filter " + className}>
      <div className="flex flex-col md:max-w-xl">
        <Link href={`/departures/schedule/${schedule.slug}`}>
          <h5
            className={
              "hover:text-glow__orange mb-3 text-lg font-bold tracking-tight text-neutral-800 hover:underline dark:text-gray-200" +
              departed
            }
          >
            {schedule.title}
          </h5>
        </Link>
        <p className="mb-4 text-sm font-normal text-neutral-800 dark:text-gray-300">
          {schedule.description.slice(0, 65) + "..."}
        </p>
        <hr className="w-full" />
        <div className="mt-3 flex flex-row items-center justify-between text-sm text-neutral-800 dark:text-gray-100">
          <div>
            <div className="flex flex-row gap-2">
              <p>From:</p>
              <Link
                className="hover:text-glow__orange hover:underline"
                href={`systems/system/${schedule.departure.slug}`}
              >
                {schedule.departure.name}
              </Link>
            </div>
            <div className="flex flex-row gap-2">
              <p>To:</p>
              <Link
                className="hover:text-glow__orange hover:underline"
                href={`systems/system/${schedule.destination.slug}`}
              >
                {schedule.destination.name}
              </Link>
            </div>
          </div>
          <div>
            <div className="flex flex-col gap-2">
              <p>{formatDate(schedule.departs_at)}</p>
            </div>
            <div className="flex flex-col gap-2">{renderStatusText(schedule)}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default memo(DepartureCard);
