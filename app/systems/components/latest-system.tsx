"use client";

import { type FunctionComponent, useMemo } from "react";
import type { System } from "@/core/interfaces/System";
import { pluralizeTextFromArray } from "@/core/string-utils";
import { SystemBodyType } from "@/core/constants/system";
import { useResource } from "@/core/hooks/resource";
import Link from "next/link";
import SystemMap from "../../systems/lib/system-map";
import LoaderMini from "@/components/loader-mini";

interface Props {
  className?: string;
}

const LatestSystem: FunctionComponent<Props> = ({ className }) => {
  const { data, isLoading } = useResource<System>("system/last-updated");
  const system = useMemo(() => (data ? new SystemMap(data) : undefined), [data]);

  if (isLoading) {
    return (
      <div className={`${className} flex items-center`}>
        <LoaderMini visible={isLoading} message="Awaiting telemetry..." />
      </div>
    );
  }

  if (!system) {
    return null;
  }

  const starCount = system.stars.filter((s) => s.type !== SystemBodyType.Null).length;

  return (
    <div className={`${className} uppercase`}>
      <div className="mb-2 flex items-center gap-2 text-xs tracking-wide uppercase text-neutral-500">
        <i className="icarus-terminal-location-filled text-orange-500/60"></i>
        Last Telemetry Uplink
      </div>
      <Link
        className="hover:text-glow__orange text-blue-200 mb-3 block text-sm font-bold tracking-wide transition-colors hover:text-white"
        href={`systems/${system.detail.slug}`}
      >
        {system.name}
      </Link>
      <div className="space-y-1 text-xs tracking-wider text-neutral-500">
        <p>
          {system.detail.coords.x.toFixed(2)} /{" "}
          {system.detail.coords.y.toFixed(2)} /{" "}
          {system.detail.coords.z.toFixed(2)}
        </p>
        <p>
          {starCount}{" "}
          {pluralizeTextFromArray(
            system.stars.filter((s) => s.type !== SystemBodyType.Null),
            { singular: "star", plural: "stars" },
          )}{" "}
          ·{" "}
          {system.planets.length}{" "}
          {pluralizeTextFromArray(system.planets, { singular: "body", plural: "bodies" })}
        </p>
      </div>
    </div>
  );
};

export default LatestSystem;
