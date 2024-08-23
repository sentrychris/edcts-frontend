"use client";

import type { SystemsNavRoutes } from "@/core/interfaces/System";
import { useEffect, useState, type FunctionComponent } from "react";
import { getResource } from "@/core/api";

interface Props {
  className?: string;
  callInterval?: number;
}

const SystemsNavRoutes: FunctionComponent<Props> = ({ className = "", callInterval = 30000 }) => {
  const [systemsNavRoutes, setSystemsNavRoutes] = useState<SystemsNavRoutes[]>([]);
  const [systemsNavRoutesInterval, setSystemsNavRoutesInterval] = useState<NodeJS.Timeout>();

  useEffect(() => {
    getResource<SystemsNavRoutes[]>("nav-routes").then(({ data }) => {
      setSystemsNavRoutes(data);
    });

    if (systemsNavRoutesInterval) {
      clearInterval(systemsNavRoutesInterval);
    }

    const interval = setInterval(() => {
      getResource<SystemsNavRoutes[]>("nav-routes").then(({ data }) => {
        setSystemsNavRoutes(data);
      });
    }, callInterval);

    setSystemsNavRoutesInterval(interval);

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <div
        className={`${className} grid grid-cols-2 gap-x-10 border-b border-neutral-800 py-2 text-sm`}
      >
        <span className="text-glow__orange tracking-wide">From</span>
        <span className="text-glow__orange tracking-wide">To</span>
      </div>
      {systemsNavRoutes.map((route) => {
        return (
          <div
            key={route.from + route.to}
            className="grid grid-cols-2 gap-x-10 py-2 text-sm text-xs text-white"
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
