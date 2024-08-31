"use client";

import { type FunctionComponent, useState } from "react";
import type { RawSystemBody, MappedSystemBody } from "@/core/interfaces/SystemBody";
import type { SystemDispatcher } from "@/core/events/SystemDispatcher";
import { SystemBodyType } from "@/core/constants/system";
import { formatDate } from "@/core/string-utils";
import Link from "next/link";
import Table from "@/components/table";

interface Props {
  bodies: RawSystemBody[];
  dispatcher: SystemDispatcher;
}

const SystemBodiesTable: FunctionComponent<Props> = ({ bodies, dispatcher }) => {
  const [rows] = useState(bodies);

  const isOrbitingPlanet = (body: RawSystemBody) => {
    return body.parents.find((parent) => {
      return (
        Object.prototype.hasOwnProperty.call(parent, SystemBodyType.Planet) &&
        parent[SystemBodyType.Planet] !== undefined
      );
    });
  };
  const orbitalMargin = "ms-5";

  const columns = {
    name: {
      title: "Name",
      render: (body: RawSystemBody) => {
        const childClass = isOrbitingPlanet(body) ? "ms-5" : "";
        const iconClass =
          body.atmosphere_type !== null && body.atmosphere_type.toLowerCase() !== "no atmosphere"
            ? "atmosphere text-glow"
            : body.is_landable
              ? "planet-landable text-glow__blue"
              : "planet text-glow__orange";

        return (
          <span
            className={`${childClass} hover:text-glow__orange flex items-center text-blue-200 hover:cursor-pointer hover:underline`}
            onClick={() => dispatcher.selectBody({ body: body as MappedSystemBody })}
          >
            <i className={`icarus-terminal-${iconClass} me-2 text-sm`}></i>
            {body.name}
          </span>
        );
      },
    },
    sub_type: {
      title: "Type",
      render: (body: RawSystemBody) => {
        const childClass = isOrbitingPlanet(body) ? orbitalMargin : "";
        return <span className={childClass}>{body.sub_type}</span>;
      },
    },
    landable: {
      title: "Landable",
      render: (body: RawSystemBody) => {
        const childClass = isOrbitingPlanet(body) ? orbitalMargin : "";
        return body.is_landable ? (
          <span className={`${childClass} text-green-300`}>Yes</span>
        ) : (
          <span className={`${childClass} text-red-300`}>No</span>
        );
      },
    },
    atmosphere: {
      title: "Atmosphere",
      render: (body: RawSystemBody) => {
        const childClass = isOrbitingPlanet(body) ? orbitalMargin : "";
        return body.atmosphere_type ? (
          <span className={childClass}>{body.atmosphere_type}</span>
        ) : (
          <span className={childClass}>No Atmosphere</span>
        );
      },
    },
    volcanism: {
      title: "Volcanism",
      render: (body: RawSystemBody) => {
        const childClass = isOrbitingPlanet(body) ? orbitalMargin : "";
        return body.volcanism_type ? (
          <span className={childClass}>{body.volcanism_type}</span>
        ) : (
          <span className={childClass}>No Volcanism</span>
        );
      },
    },
    terraforming: {
      title: "Terraforming",
      render: (body: RawSystemBody) => {
        const childClass = isOrbitingPlanet(body) ? orbitalMargin : "";
        return body.terraforming_state && body.terraforming_state !== "" ? (
          <span className={childClass}>{body.terraforming_state}</span>
        ) : (
          <span className={childClass}>No Data</span>
        );
      },
    },
    commander: {
      title: "Discovered By",
      render: (body: RawSystemBody) => {
        const childClass = isOrbitingPlanet(body) ? orbitalMargin : "";
        return (
          <Link className={`${childClass} text-blue-200 hover:underline`} href={"#"}>
            {body.discovered_by.startsWith("CMDR")
              ? body.discovered_by
              : `CMDR ${body.discovered_by}`}
          </Link>
        );
      },
    },
    discovered: {
      title: "Discovered On",
      render: (body: RawSystemBody) => {
        const childClass = isOrbitingPlanet(body) ? orbitalMargin : "";
        return <span className={childClass}>{formatDate(body.discovered_at)}</span>;
      },
    },
  };

  return <Table columns={columns} data={rows} />;
};

export default SystemBodiesTable;
