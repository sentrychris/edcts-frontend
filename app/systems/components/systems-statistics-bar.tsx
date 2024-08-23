"use client";

import type { FunctionComponent } from "react";
import type { AppStatistics } from "@/core/interfaces/Statistics";
import type { System } from "@/core/interfaces/System";
import { useEffect, useState } from "react";
import { formatNumber, renderTextWithIcon } from "@/core/util";
import { getResource } from "@/core/api";
import Link from "next/link";

interface Props {
  callInterval?: number;
  resetCache?: number;
  className?: string;
  latestSystem: System;
}

const SystemsStatisticsBar: FunctionComponent<Props> = ({
  className = "",
  callInterval = 30000,
  resetCache = true,
  latestSystem,
}) => {
  const [statistics, setStatistics] = useState<AppStatistics>();
  const [statisticsInterval, setStatisticsInterval] = useState<NodeJS.Timeout>();

  useEffect(() => {
    // Initial API call to retrieve statistics
    getResource<AppStatistics>("statistics", {
      resetCache: 1,
    }).then((response) => {
      setStatistics(response.data);
    });

    // Clear any existing interval
    if (statisticsInterval) {
      clearInterval(statisticsInterval);
    }

    // Set up a new interval to fetch statistics periodically
    const interval = setInterval(() => {
      getResource<AppStatistics>("statistics", {
        resetCache,
      }).then((response) => {
        const { data: statistics } = response;
        setStatistics(statistics);
      });
    }, callInterval);

    // setStaisitcsInterval to the interval
    setStatisticsInterval(interval);

    // Cleanup function to clear interval on unmount or when deps change
    return () => clearInterval(interval);
  }, [resetCache, callInterval]);

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
            {renderTextWithIcon(formatNumber(statistics?.cartographical?.systems ?? 0), {
              icon: "icarus-terminal-system-orbits text-2xl",
            })}
          </div>
          <div className="whitespace-nowrap">
            <p className="mb-2">Primary Stars Logged:</p>
            {renderTextWithIcon(formatNumber(statistics?.cartographical?.stars ?? 0), {
              icon: "icarus-terminal-star text-2xl",
            })}
          </div>
          <div className="whitespace-nowrap">
            <p className="mb-2">Orbital Bodies Logged:</p>
            {renderTextWithIcon(formatNumber(statistics?.cartographical?.bodies ?? 0), {
              icon: "icarus-terminal-system-bodies text-2xl",
            })}
          </div>
          <div className="hidden whitespace-nowrap md:inline">
            <p className="mb-2">ED:CTS Carriers in service:</p>
            {renderTextWithIcon(formatNumber(statistics?.carriers ?? 0), {
              icon: "icarus-terminal-ship text-2xl",
            })}
          </div>
        </div>
        <div className="hidden items-center gap-4 whitespace-nowrap md:flex">
          <i className="icarus-terminal-location-filled text-glow__blue text-3xl"></i>
          <div className="text-xs">
            <p className="mb-1">Latest Updated System:</p>
            <div className="text-xs">
              <Link
                className="text-glow__blue hover:text-glow__orange hover:underline"
                href={`/systems/${latestSystem.slug}`}
              >
                {latestSystem.name}
              </Link>
              <p>
                {latestSystem.coords.x}, {latestSystem.coords.y}, {latestSystem.coords.z}
              </p>
              <p>{latestSystem.bodies.length} orbital bodies</p>
              <p>population: {formatNumber(latestSystem.information.population)}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SystemsStatisticsBar;
