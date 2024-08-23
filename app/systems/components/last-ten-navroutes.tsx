"use client";

import type { LastTenNavRoutes } from "@/core/interfaces/Statistics";
import { useEffect, useState, type FunctionComponent } from "react";
import { getResource } from "@/core/api";
import Heading from "@/components/heading";

const LastTenNavRoutes: FunctionComponent = () => {
  const [lastTenNavRoutes, setLastTenNavRoutes] = useState<LastTenNavRoutes[]>([]);
  const [lastTenNavRoutesInterval, setLastTenNavRoutesInterval] = useState<NodeJS.Timeout>();

  useEffect(() => {
    getResource<LastTenNavRoutes[]>("nav-routes").then(({ data }) => {
      setLastTenNavRoutes(data);
    });

    if (lastTenNavRoutesInterval) {
      clearInterval(lastTenNavRoutesInterval);
    }

    const interval = setInterval(() => {
      getResource<LastTenNavRoutes[]>("nav-routes").then(({ data }) => {
        setLastTenNavRoutes(data);
      });
    }, 10000);

    setLastTenNavRoutesInterval(interval);

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <Heading
        icon="icarus-terminal-route text-glow__orange"
        title="Latest Nav Routes"
        className="mb-5 gap-2"
      />
      <div className="grid grid-cols-2 gap-x-10 border-b border-neutral-800 py-2 text-sm">
        <span className="text-glow__orange tracking-wide">From</span>
        <span className="text-glow__orange tracking-wide">To</span>
      </div>
      {lastTenNavRoutes.map((route) => {
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

export default LastTenNavRoutes;
