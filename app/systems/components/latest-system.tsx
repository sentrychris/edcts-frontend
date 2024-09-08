"use client";

import { type FunctionComponent, useEffect, useState } from "react";
import type { System } from "@/core/interfaces/System";
import { pluralizeTextFromArray } from "@/core/string-utils";
import { getResource } from "@/core/api";
import SystemMap from "../../systems/lib/system-map";
import Link from "next/link";

interface Props {
  className?: string;
}

const LatestSystem: FunctionComponent<Props> = ({ className }) =>
{
  const [system, setLastUpdatedSystem] = useState<SystemMap>();

  useEffect(() => {
    getResource<System>("system/last-updated").then((response) => {
      setLastUpdatedSystem(new SystemMap(response.data));
    });
  }, []);

  return (
    <div className={`${className} uppercase`}>
      {system && (
      <>
        <Link
          className="text-glow__blue text-lg font-bold hover:underline"
          href={`systems/${system.detail.slug}`}
        >
          {system.name}
        </Link>
        <div className="mt-3 flex gap-x-10">
          <div>
            <p>
              {system.detail.coords.x.toFixed(2)}, {system.detail.coords.y.toFixed(2)},{" "}
              {system.detail.coords.z.toFixed(2)}
            </p>
            <p>Population: {system.detail.information?.population ?? 0}</p>
          </div>
          <div>
            <p className="whitespace-nowrap">
              <span className="me-1">{system.stars.length}</span>
              {pluralizeTextFromArray(system.stars, {
                singular: "star",
                plural: "stars",
              })}
            </p>
            <p className="whitespace-nowrap">
              <span className="me-1">{system.planets.length}</span>
              {pluralizeTextFromArray(system.planets, {
                singular: "planet",
                plural: "planets",
              })}
            </p>
          </div>
        </div>
      </>
      )}
    </div>
  );
};

export default LatestSystem;
