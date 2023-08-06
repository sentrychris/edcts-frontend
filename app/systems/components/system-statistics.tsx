'use client';

import { FunctionComponent, useEffect, useState, memo  } from 'react';
import { renderBadge } from '../lib/systems';
import { Statistics } from '../../lib/interfaces/Statistics';
import { getResource } from '../../lib/api';
import { formatNumber } from '../../lib/util';
import Link from 'next/link';

interface Props {
  data: Statistics;
  interval?: number;
  cached?: boolean;
  className?: string;
}

const SystemStatistics: FunctionComponent<Props> = ({ data, className = '', interval = 30000, cached = true }) => {
  const [statistics, setStatistics] = useState<Statistics>(data);

  useEffect(() => {
    setInterval(() => {
      getResource<Statistics>('statistics', {
        resetCache: cached ? 1 : 0
      }).then((statistics) => {
        setStatistics(statistics);
      });
    }, interval);
  }, [cached, statistics, interval]);

  const latestSystem = statistics.data.cartographical.latest_system;

  return (
    <div className={'border-t border-b border-neutral-800 backdrop-filter backdrop-blur bg-transparent py-5 tracking-wide ' + className}>
      <div className="flex flex-row items-center justify-between uppercase">
        <div className="flex flex-wrap items-center gap-10 lg:gap-20">
          <div className="whitespace-nowrap">
            <p className="mb-2">ED:CTS Systems Logged:</p>
            {renderBadge(formatNumber(statistics.data.cartographical.systems), {
              icon: 'icarus-terminal-system-orbits text-2xl'
            })}
          </div>
          <div className="whitespace-nowrap">
            <p className="mb-2">ED:CTS Bodies Logged:</p>
            {renderBadge(formatNumber(statistics.data.cartographical.bodies), {
              icon: 'icarus-terminal-system-bodies text-2xl'
            })}
          </div>
          <div className="whitespace-nowrap">
            <p className="mb-2">Primary Stars Logged:</p>
            {renderBadge(formatNumber(statistics.data.cartographical.stars), {
              icon: 'icarus-terminal-star text-2xl'
            })}
          </div>
          <div className="whitespace-nowrap hidden md:inline">
            <p className="mb-2">Carriers in service:</p>
            {renderBadge(formatNumber(statistics.data.carriers), {
              icon: 'icarus-terminal-ship text-2xl'
            })}
          </div>
        </div>
        <div className="whitespace-nowrap hidden md:flex items-center gap-4">
          <i className="icarus-terminal-location-filled text-glow__blue text-3xl"></i>
          <div className="text-xs">
            <p className="mb-1">Latest Logged System:</p>
            <div className="text-xs">
              <Link
                className="text-glow__blue hover:text-glow__orange hover:underline"
                href={`/systems/system/${latestSystem.slug}`}
              >
                {latestSystem.name}
              </Link>
              <p>{latestSystem.coords.x}, {latestSystem.coords.y}, {latestSystem.coords.z}</p>
              <p>{latestSystem.bodies.length} orbital bodies</p>
              <p>population: {latestSystem.information.population}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default memo(SystemStatistics);