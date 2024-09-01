"use client";

import type { SystemsNavRoutes } from "@/core/interfaces/System";
import { type FunctionComponent, useEffect, useState } from "react";
import { getResource } from "@/core/api";
import Filter from "@/components/filter";

interface Props {
  className?: string;
  callInterval?: number;
}

const SystemsNavRoutes: FunctionComponent<Props> = ({ className = "", callInterval = 30000 }) => {
  const [systemsNavRoutes, setSystemsNavRoutes] = useState<SystemsNavRoutes[]>([]);
  const [filteredSystemsNavRoutes, setFilteredSystemsNavRoutes] = useState<SystemsNavRoutes[]>([]);
  const [systemsNavRoutesInterval, setSystemsNavRoutesInterval] = useState<NodeJS.Timeout>();

  useEffect(() => {
    getResource<SystemsNavRoutes[]>("nav-routes", {
      params: {
        limit: 20,
      },
    }).then(({ data }) => {
      setSystemsNavRoutes(data);
      setFilteredSystemsNavRoutes(data);
    });

    if (systemsNavRoutesInterval) {
      clearInterval(systemsNavRoutesInterval);
    }

    const interval = setInterval(() => {
      getResource<SystemsNavRoutes[]>("nav-routes", {
        params: {
          limit: 20,
        },
      }).then(({ data }) => {
        setSystemsNavRoutes(data);
        setFilteredSystemsNavRoutes(data);
      });
    }, callInterval);

    setSystemsNavRoutesInterval(interval);

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <Filter
        handleInput={(input: string) => {
          if (input.length === 0) {
            return setFilteredSystemsNavRoutes(systemsNavRoutes);
          }
          const filtered = systemsNavRoutes.filter((route) => {
            return (
              route.from.toLowerCase().includes(input.toLowerCase()) ||
              route.to.toLowerCase().includes(input.toLowerCase())
            );
          });

          setFilteredSystemsNavRoutes(filtered);
        }}
        className="my-5"
      />
      <div
        className={`${className} uppercase grid grid-cols-2 gap-x-10 border-b border-neutral-800 py-2 text-sm`}
      >
        <span className="text-glow__orange tracking-wide">From</span>
        <span className="text-glow__orange tracking-wide">To</span>
      </div>
      {filteredSystemsNavRoutes.map((route) => {
        return (
          <div
            key={route.from + route.to}
            className="uppercase grid grid-cols-2 gap-x-10 py-2 text-sm text-xs text-white"
          >
            <span>{route.from}</span>
            <span>{route.to}</span>
          </div>
        );
      })}
    </>
  );
};

export default SystemsNavRoutes;
