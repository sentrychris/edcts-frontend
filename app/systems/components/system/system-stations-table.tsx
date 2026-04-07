"use client";

import { type FunctionComponent, useState } from "react";
import type { SystemDispatcher } from "@/core/events/SystemDispatcher";
import type { Station } from "@/core/interfaces/Station";
import type { Links, Meta } from "@/core/interfaces/Pagination";
import { formatDate } from "@/core/string-utils";
import { stationIconByType } from "@/core/render-utils";
import Table from "@/components/table";
import Link from "next/link";
import Heading from "@/components/heading";

interface Props {
  stations: Station[];
  dispatcher: SystemDispatcher;
}

const PER_PAGE = 10;

const buildPaginationProps = (
  allRows: Station[],
  currentPage: number,
): { rows: Station[]; meta: Meta; links: Links } => {
  const total = allRows.length;
  const lastPage = Math.max(1, Math.ceil(total / PER_PAGE));
  const from = (currentPage - 1) * PER_PAGE;
  const to = Math.min(from + PER_PAGE, total);

  const meta: Meta = { current_page: currentPage, from: from + 1, path: "", per_page: PER_PAGE, to };
  const links: Links = {
    first: `?page=1`,
    last: `?page=${lastPage}`,
    prev: currentPage > 1 ? `?page=${currentPage - 1}` : null,
    next: currentPage < lastPage ? `?page=${currentPage + 1}` : null,
  };

  return { rows: allRows.slice(from, to), meta, links };
};

const SystemStationsTable: FunctionComponent<Props> = ({ stations, dispatcher }) => {
  const [currentPage, setCurrentPage] = useState(1);

  const { rows, meta, links } = buildPaginationProps(stations, currentPage);

  const handlePage = (link: string) => {
    const params = new URLSearchParams(link.replace(/^[^?]*/, ""));
    setCurrentPage(parseInt(params.get("page") ?? "1", 10));
  };

  const columns = {
    name: {
      title: "Name",
      render: (station: Station) => {
        return (
          <Link
            href={`/stations/${station.slug}`}
            className={`hover:text-glow__orange flex items-center text-blue-200 hover:underline`}
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

  const header = (
    <Heading bordered icon="icarus-terminal-outpost" title="System Stations" subtitle="Docking & Logistics Network" className="px-5 py-4" />
  );

  return <Table header={header} columns={columns} data={rows} meta={meta} links={links} page={handlePage} />;
};

export default SystemStationsTable;
