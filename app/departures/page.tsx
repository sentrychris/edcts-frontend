import { getAllScheduledCarrierTrips } from './departures';
import DepartureCard from './components/departure-card';
import DepartureTable from './components/departure-table';
import Heading from '../components/heading';

export default async function Page() {
  const schedule = await getAllScheduledCarrierTrips('fleet/schedule', {
    withCarrierInformation: 1,
    withSystemInformation: 1
  });

  return (
    <>
      <Heading icon="icarus-terminal-route"
        title="Departure Board"
        className="gap-2 mb-5" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 font-bold">
        {schedule.data.slice(0, 4).map((schedule) => {
          return <DepartureCard key={schedule.id} schedule={schedule}/>
        })}
      </div>
      <div className="mt-5">
        <Heading icon="icarus-terminal-route"
          largeIcon={true}
          title="Scheduled Departures"
          className="gap-2 mb-5 text-2xl" />
        <DepartureTable schedule={schedule} />
      </div>
    </>
  );
}
  