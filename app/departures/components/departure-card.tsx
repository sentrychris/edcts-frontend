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
    <div className={"bg-transparent px-4 py-8 backdrop-blur backdrop-filter " + className}>
      <div className="flex flex-col md:max-w-xl">
        <Link href={`/departures/schedule/${schedule.slug}`}>
          <h5
            className={
              "hover:text-glow text-glow__orange mb-3 text-lg font-bold tracking-tight hover:underline" +
              departed
            }
          >
            {schedule.title}
          </h5>
        </Link>
        <div className="flex flex-row items-center justify-between text-sm text-gray-100">
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
            <div className="mt-3 flex flex-col gap-2">{renderStatusText(schedule)}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default memo(DepartureCard);
