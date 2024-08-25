"use client";

import { type FunctionComponent, useState } from "react";
import type { SystemDispatcher } from "@/core/events/SystemDispatcher";
import type { RawSystemBody, MappedSystemBody } from "@/core/interfaces/SystemBody";
import { formatDate, formatNumber } from "@/core/util";
import Link from "next/link";
import Table from "@/components/table";

interface Props {
  stars: RawSystemBody[];
  dispatcher: SystemDispatcher;
}

const SystemStarsTable: FunctionComponent<Props> = ({ stars, dispatcher }) => {
  const [rows] = useState(stars);

  const columns = {
    name: {
      title: "Name",
      render: (star: RawSystemBody) => {
        return (
          <span
            className="hover:text-glow__orange text-blue-200 hover:cursor-pointer hover:underline"
            onClick={() => dispatcher.selectBody({ body: star as MappedSystemBody })}
          >
            <i className={`icarus-terminal-star text-glow me-2 text-sm`}></i>
            {star.name}
          </span>
        );
      },
    },
    type: {
      title: "Type",
      render: (star: RawSystemBody) => {
        return star.sub_type.replace("Star", "");
      },
    },
    spectral_class: {
      title: "Class",
      render: (star: RawSystemBody) => {
        return star.spectral_class ?? "No Data";
      },
    },
    main_star: {
      title: "Is Main",
      render: (body: RawSystemBody) => {
        return body.is_main_star ? (
          <span className="text-green-300">Yes</span>
        ) : (
          <span className="text-red-300">No</span>
        );
      },
    },
    bodies: {
      title: "Bodies",
      render: (body: RawSystemBody) => {
        const orbital = body as MappedSystemBody;
        return (
          <span
            className="hover:text-glow__orange text-blue-200 hover:cursor-pointer hover:underline"
            onClick={() => dispatcher.selectBody({ body: orbital })}
          >
            {orbital._children?.length ?? 0}
          </span>
        );
      },
    },
    scoopable: {
      title: "Fuel",
      render: (body: RawSystemBody) => {
        return body.is_scoopable ? (
          <span className="text-green-300">Yes</span>
        ) : (
          <span className="text-red-300">No</span>
        );
      },
    },
    surface_temp: {
      title: "Surface Temp",
      render: (body: RawSystemBody) => {
        return formatNumber(body.surface_temp) + " K";
      },
    },
    solar_masses: {
      title: "Sol Mass",
      render: (body: RawSystemBody) => {
        return (body.solar_masses as number).toFixed(4);
      },
    },
    solar_radius: {
      title: "Sol Radius",
      render: (body: RawSystemBody) => {
        return (body.solar_radius as number).toFixed(4);
      },
    },
    magnitude: {
      title: "Magnitude",
      render: (body: RawSystemBody) => {
        return (body.absolute_magnitude as number).toFixed(4);
      },
    },
    commander: {
      title: "Discovered By",
      render: (body: RawSystemBody) => {
        return (
          <Link className="text-blue-200 hover:underline" href={"#"}>
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
        return formatDate(body.discovered_at);
      },
    },
  };

  return (
    <Table
      columns={columns}
      data={rows.filter((s: RawSystemBody) => s.name !== "Additional Objects")}
    />
  );
};

export default SystemStarsTable;
