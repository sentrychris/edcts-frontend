"use client";

import { type FunctionComponent, useEffect, useState } from "react";
import type { Schedule } from "@/core/interfaces/Schedule";
import { scheduleState } from "../lib/store";
import { getResource } from "@/core/api";

interface Props {
  params: { slug: string };
}

const JourneySchedule: FunctionComponent<Props> = ({ params }) => {
  const [schedule, setSchedule] = useState<Schedule>(scheduleState);

  const { slug } = params;

  useEffect(() => {
    (async () => {
      if (slug) {
        const { data } = await getResource<Schedule>(`fleet-carriers/schedule/${slug}`, {
          withCarrierInformation: 1,
          withSystemInformation: 1,
        });
        setSchedule(data);
      }
    })();
  }, [slug]);

  return (
    <>
      <h2 className="border-b border-neutral-800 pb-3 text-3xl uppercase">Journey Information</h2>
      <div className="relative border-b border-neutral-800 py-12">
        <h1 className="text-4xl">{schedule.title}</h1>
        <div className="mt-10 grid grid-cols-2">
          <div>
            <p>
              Carrier: [{schedule.carrier.identifier}] {schedule.carrier.name}
            </p>
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

export default JourneySchedule;
