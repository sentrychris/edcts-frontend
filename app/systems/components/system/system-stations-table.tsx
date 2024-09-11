"use client";

import { type FunctionComponent, useState } from "react";
import type { SystemDispatcher } from "@/core/events/SystemDispatcher";
import type { Station } from "@/core/interfaces/Station";
import { formatDate } from "@/core/string-utils";
import { stationIconByType } from "../../lib/render-utils";
import Table from "@/components/table";
import Link from "next/link";

interface Props {
  stations: Station[];
  dispatcher: SystemDispatcher;
}

const SystemStationsTable: FunctionComponent<Props> = ({ stations, dispatcher }) => {
  const [rows] = useState(stations);

  const columns = {
    name: {
      title: "Name",
      render: (station: Station) => {
        return (
          <Link
            className={`hover:text-glow__orange flex items-center text-blue-200 hover:cursor-pointer hover:underline`}
            href={`/stations/${station.slug}`}
          >
            <i className={`${stationIconByType(station.type)} text-glow me-2 text-sm`}></i>
            {station.name}
          </Link>
        );
      },
    },
    type: {
      title: "Type",
      render: (station: Station) => {
        return <span>{station.type}</span>;
      },
    },
    body: {
      title: "Orbiting",
      render: (station: Station) => {
        return <span>{station.body?.name ?? "None"}</span>;
      },
    },
    distance_to_arrival: {
      title: "Dist. to star",
      render: (station: Station) => {
        return <span>{station.distance_to_arrival} LS</span>;
      },
    },
    allegiance: {
      title: "Allegiance",
      render: (station: Station) => {
        return <span>{station.allegiance}</span>;
      },
    },
    controlling_faction: {
      title: "Controlling Faction",
      render: (station: Station) => {
        return <span>{station.controlling_faction}</span>;
      },
    },
    economy: {
      title: "Economy",
      render: (station: Station) => {
        return <span>{station.economy}</span>;
      },
    },
    has_market: {
      title: "Market",
      render: (station: Station) => {
        return station.has_market ? (
          <span className="text-green-300">Yes</span>
        ) : (
          <span className="text-red-300">No</span>
        );
      },
    },
    has_shipyard: {
      title: "Shipyard",
      render: (station: Station) => {
        return station.has_shipyard ? (
          <span className="text-green-300">Yes</span>
        ) : (
          <span className="text-red-300">No</span>
        );
      },
    },
    has_outfitting: {
      title: "Outfitting",
      render: (station: Station) => {
        return station.has_outfitting ? (
          <span className="text-green-300">Yes</span>
        ) : (
          <span className="text-red-300">No</span>
        );
      },
    },
    last_updated: {
      title: "Last Updated",
      render: (station: Station) => {
        return (
          <span>
            {station.last_updated.information
              ? formatDate(station.last_updated.information)
              : "No Data"}
          </span>
        );
      },
    },
  };

  return <Table columns={columns} data={rows} />;
};

export default SystemStationsTable;
