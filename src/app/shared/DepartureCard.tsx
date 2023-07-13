import { FunctionComponent } from "react";

interface Props {
  title: string;
  departure?: string;
  destination?: string;
  departsAt?: string;
}

const DepartureCard: FunctionComponent<Props> = ({title, departure, destination, departsAt}) => {
  return (
    <div className="p-6 rounded-lg shadow-lg bg-zinc-800">
      <a href="#" className="flex flex-col md:max-w-xl">
        <h5 className="mb-3 text-lg font-bold tracking-tight text-gray-900 dark:text-white">{title}</h5>
        <p className="mb-4 font-normal text-gray-700 dark:text-gray-400">
          [[ Description Goes Here]]
        </p>
        <hr className="w-full"/>
        <div className="flex flex-row justify-between items-center text-sm">
          <div>
            <div className="flex flex-row gap-2 mt-3">
              <p>From:</p>
              <p>{departure}</p>
            </div>
            <div className="flex flex-row gap-2">
              <p>To:</p>
              <p>{destination}</p>
            </div>
          </div>
          <div>
            <div className="flex flex-col gap-2 mt-3">
              <p>{departsAt}</p>
            </div>
          </div>
        </div>
      </a>
    </div>
  );
}

export default DepartureCard;