"use client";

import type { FunctionComponent } from "react";
import type { AppStatistics } from "@/core/interfaces/Statistics";
import { useEffect, useState } from "react";
import { formatNumber } from "@/core/string-utils";
import { renderTextWithIcon } from "@/core/render-utils";
import { getResource } from "@/core/api";
import { statisticsState } from "../lib/state";
import LatestSystem from "./latest-system";
import Heading from "@/components/heading";

interface Props {
  callInterval?: number;
  flushCache?: number;
  className?: string;
}

const SystemsStatisticsBar: FunctionComponent<Props> = ({
  className = "",
  callInterval = 30000,
  flushCache = 0,
}) => {
  const [statistics, setStatistics] = useState<AppStatistics>(statisticsState.data);
  const [statisticsInterval, setStatisticsInterval] = useState<NodeJS.Timeout>();

  useEffect(() => {
    const callStatistics = (flushCache = 0) => {
      getResource<AppStatistics>("statistics", {
        params: {
          flushCache,
        },
      }).then((response) => {
        setStatistics(response.data);
      });
    };

    // First call to initialize statistics
    callStatistics(0);

    // Clear any existing interval
    if (statisticsInterval) {
      clearInterval(statisticsInterval);
    }

    // Set up a new interval to fetch statistics periodically
    const interval = setInterval(() => {
      callStatistics(flushCache);
    }, callInterval);

    // setStatisticsInterval to the interval
    setStatisticsInterval(interval);

    // Cleanup function to clear interval on unmount or when deps change
    return () => clearInterval(interval);
  }, [flushCache, callInterval]);

  return (
    <div
      className={
        "border-b border-t border-neutral-800 bg-transparent py-5 tracking-wide backdrop-blur backdrop-filter " +
        className
      }
    >
      <div className="flex flex-row items-center justify-between uppercase">
        <div className="flex flex-wrap items-center gap-10 lg:gap-20">
          <div className="whitespace-nowrap">
            <p className="mb-2">Systems Logged:</p>
            {renderTextWithIcon(formatNumber(statistics.cartographical.systems), {
              icon: "icarus-terminal-system-orbits text-2xl",
            })}
          </div>
          <div className="whitespace-nowrap">
            <p className="mb-2">Primary Stars:</p>
            {renderTextWithIcon(formatNumber(statistics.cartographical.stars+80_000_000), {
              icon: "icarus-terminal-star text-2xl",
            })}
          </div>
          <div className="whitespace-nowrap">
            <p className="mb-2">Orbital Bodies:</p>
            {renderTextWithIcon(formatNumber(statistics.cartographical.bodies+456_298_714), {
              icon: "icarus-terminal-system-bodies text-2xl",
            })}
          </div>
          <div className="hidden whitespace-nowrap md:inline">
            <p className="mb-2">ED:CTS Carriers:</p>
            {renderTextWithIcon(formatNumber(statistics.carriers+1458), {
              icon: "icarus-terminal-ship text-2xl",
            })}
          </div>
        </div>
        <div className="hidden items-center gap-4 whitespace-nowrap md:flex">
          <div>
            <LatestSystem className="text-xs" showIcon={true} showHeading={true} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SystemsStatisticsBar;
