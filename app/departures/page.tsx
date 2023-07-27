import { Schedule } from '../../interfaces/Schedule';
import { getAllScheduledCarrierTrips } from './departures';
import DepartureCard from './components/departure-card';
import DepartureTable from './components/departure-table';

export default async function Page() {
  const schedule = await getAllScheduledCarrierTrips('fleet/schedule');

  return (
    <>
      <div className="items-center justify-between">
        <div className="flex items-center gap-2">
          <i className="icarus-terminal-route"></i>
          <h2 className="uppercase text-glow-white">Departure Board</h2>
        </div>
        <div className="mt-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 font-bold">
          {schedule.data.slice(0, 4).map((schedule: Schedule) => <DepartureCard key={schedule.id} schedule={schedule}/>)}
        </div>
      </div>
      <div className="grid grid-cols-1 mt-6">
        <div>
        <div className="flex items-center gap-2 mb-5">
          <i className="icarus-terminal-route"></i>
          <h2 className="uppercase text-3xl text-glow-white">Scheduled Departures</h2>
        </div>
          <DepartureTable schedule={schedule} />
        </div>
      </div>
    </>
  );
}
  