
'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Schedule } from '../../../interfaces/Schedule';
import { defaultState, getScheduledCarrierTrip } from '../departures';

const DepartureSchedule = () => {
  const [schedule, setSchedule] = useState<Schedule>(defaultState);

  const path = usePathname();
  const slug = path.split('/').pop();

  useEffect(() => {
    (async () => {
      if (slug) {
        const data = await getScheduledCarrierTrip(slug);
        setSchedule(data);
      }
    })();
  }, []);

  return (
    <>
      <h2 className="uppercase text-3xl pb-3 border-b border-neutral-800">Departure Information</h2>
      <div className="relative border-b border-neutral-800 py-12">
        <h1 className='text-4xl'>{schedule.title}</h1>
        <div className="grid grid-cols-2 mt-10">
          <div>
            <p>Carrier: [{schedule.carrier.identifier}] {schedule.carrier.name}</p>
            <p>Captain: CMDR {schedule.carrier.commander.name}</p>
          </div>
          <div>
            <p>Departs from: {schedule.departure.name}</p>
            <p>Destination: {schedule.destination.name}</p>
            {/* TODO travel map */}
          </div>
        </div>
      </div>
    </>
  );
};

export default DepartureSchedule;
  