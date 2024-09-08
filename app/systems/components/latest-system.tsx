"use client";

import { type FunctionComponent, useEffect, useState } from "react";
import type { System } from "@/core/interfaces/System";
import { pluralizeTextFromArray } from "@/core/string-utils";
import { getResource } from "@/core/api";
import SystemMap from "../../systems/lib/system-map";
import Link from "next/link";
import LoaderMini from "@/components/loader-mini";
import Heading from "@/components/heading";

interface Props {
  className?: string;
  showIcon?: boolean;
  showHeading?: boolean;
}

const LatestSystem: FunctionComponent<Props> = ({ className, showIcon = false, showHeading = false }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [system, setLastUpdatedSystem] = useState<SystemMap>();

  useEffect(() => {
    getResource<System>("system/last-updated").then((response) => {
      setLastUpdatedSystem(new SystemMap(response.data));
    }).finally(() => {
      setIsLoading(false);
    });
  }, []);

  return (
    <div className={`${className} uppercase`}>
      {system && !isLoading ? (
        <div className="flex items-center gap-x-3">
          {showIcon && <i className="icarus-terminal-location-filled text-glow__blue text-3xl"></i>}
          <div>
            {showHeading && <Heading
              title="Latest Updated System"
              className="text-xs"
            />}
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
          </div>
        </div>
      ) :
      <div className="flex items-center justify-center">
        <LoaderMini visible={isLoading} message="Loading latest updated system..."/>
      </div>
    }
    </div>
  );
};

export default LatestSystem;
