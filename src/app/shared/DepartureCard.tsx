import { FunctionComponent } from "react";

interface Props {
  className?: string;
  title: string;
  description: string;
  departure: string;
  destination: string;
  departsAt: string;
  status: string;
}

const DepartureCard: FunctionComponent<Props> = ({className, title, description, departure, destination, departsAt, status}) => {
  const departed = status === 'DEPARTED' ? 'line-through' : ''
  return (
    <div className={`p-6 rounded-lg shadow-lg bg-slate-50 dark:bg-zinc-800 ` + className}>
      <a href="#" className="flex flex-col md:max-w-xl">
        <h5 className={`mb-3 text-lg font-bold tracking-tight text-neutral-800 dark:text-gray-200 ` + departed}>{title}</h5>
        <p className="mb-4 font-normal text-neutral-800 dark:text-gray-300">
          {description.slice(0,65) + `...`}
        </p>
        <hr className="w-full"/>
        <div className="flex flex-row justify-between items-center text-sm mt-3 text-neutral-800 dark:text-gray-100">
          <div>
            <div className="flex flex-row gap-2">
              <p>From:</p>
              <p>{departure}</p>
            </div>
            <div className="flex flex-row gap-2">
              <p>To:</p>
              <p>{destination}</p>
            </div>
          </div>
          <div>
            <div className="flex flex-col gap-2">
              <p>{new Date(departsAt).toLocaleString('en-GB', {
                day: '2-digit',
                month: 'short',
                year: '2-digit',
                hour: '2-digit',
                minute: '2-digit'
              })}</p>
            </div>
            <div className="flex flex-col gap-2">
              <p className={
                status === 'DEPARTED' ? `text-blue-500 dark:text-blue-200`
                  : (status === 'NOT READY') ? 'text-orange-500 dark:text-orange-300' : (status === 'DELAYED')
                  ? 'text-red-500 dark:text-red-300' : 'text-green-500 dark:text-green-200'}>
                    {status}
              </p>
            </div>
          </div>
        </div>
      </a>
    </div>
  );
}

export default DepartureCard;