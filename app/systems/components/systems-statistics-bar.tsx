"use client";

import type { FunctionComponent } from "react";
import type { AppStatistics } from "@/core/interfaces/Statistics";
import { useEffect, useState } from "react";
import { formatNumber } from "@/core/string-utils";
import { getResource } from "@/core/api";
import { statisticsState } from "../lib/state";
import LatestSystem from "./latest-system";

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

    callStatistics(0);

    if (statisticsInterval) {
      clearInterval(statisticsInterval);
    }

    const interval = setInterval(() => {
      callStatistics(flushCache);
    }, callInterval);

    setStatisticsInterval(interval);

    return () => clearInterval(interval);
  }, [flushCache, callInterval]);

  const stats = [
    {
      icon: "icarus-terminal-system-orbits",
      label: "Systems Logged",
      value: formatNumber(statistics.cartographical.systems),
    },
    {
      icon: "icarus-terminal-star",
      label: "Primary Stars",
      value: formatNumber(statistics.cartographical.stars),
    },
    {
      icon: "icarus-terminal-system-bodies",
      label: "Orbital Bodies",
      value: formatNumber(statistics.cartographical.bodies),
    },
  ];

  return (
    <div
      className={
        "mb-6 border border-orange-900/30 bg-black/20 backdrop-blur backdrop-filter " + className
      }
    >
      <div className="flex items-stretch divide-x divide-orange-900/30">
        {stats.map(({ icon, label, value }) => (
          <div key={label} className="flex flex-1 flex-col gap-2 px-5 py-4">
            <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-neutral-500">
              <i className={`${icon} text-orange-500/60`}></i>
              {label}
            </div>
            <span className="text-glow__orange text-xl font-bold tracking-wide">{value}</span>
          </div>
        ))}

        <div className="hidden flex-col justify-center px-5 py-4 md:flex">
          <LatestSystem className="text-xs" />
        </div>
      </div>
    </div>
  );
};

export default SystemsStatisticsBar;
