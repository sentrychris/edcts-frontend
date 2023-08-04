'use client';

import { FunctionComponent, useEffect, useState, memo  } from 'react';
import { renderBadge, statisticsState } from '../lib/systems';
import { Statistics } from '../../lib/interfaces/Statistics';
import { getResource } from '../../lib/api';
import { formatNumber } from '../../lib/util';

interface Props {
  data: Statistics;
  className?: string;
}

const SystemStatistics: FunctionComponent<Props> = ({ data, className = '' }) => {
  const [statistics, setStatistics] = useState<Statistics>(data);

  useEffect(() => {
    setInterval(() => {
      getResource<Statistics>('statistics', {
        resetCache: 1
      }).then((statistics) => {
        setStatistics(statistics);
      });
    }, 5000);
  }, []);

  return (
    <div className={`border-t border-b border-neutral-800 py-5 tracking-wide text-2xl ` + className}>
      <div className="flex flex-row align-center justify-between uppercase">
        <div className="flex flex-wrap items-center gap-10 lg:gap-20">
          <div className="whitespace-nowrap">
            <p className="mb-2">Systems stored:</p>
            {renderBadge(formatNumber(statistics.data.cartographical.systems), {
              icon: 'icarus-terminal-system-orbits text-2xl'
            })}
          </div>
          <div className="whitespace-nowrap">
            <p className="mb-2">System bodies stored:</p>
            {renderBadge(formatNumber(statistics.data.cartographical.bodies), {
              icon: 'icarus-terminal-system-bodies text-2xl'
            })}
          </div>
          <div className="whitespace-nowrap">
            <p className="mb-2">Primary stars stored:</p>
            {renderBadge(formatNumber(statistics.data.cartographical.stars), {
              icon: 'icarus-terminal-star text-2xl'
            })}
          </div>
        </div>
        
        <div className="whitespace-nowrap hidden md:inline">
          <p className="mb-2">Fleet carriers in service:</p>
          {renderBadge(formatNumber(statistics.data.carriers), {
            icon: 'icarus-terminal-location-filled text-2xl'
          })}
        </div>
      </div>
    </div>
  );
};

export default memo(SystemStatistics);