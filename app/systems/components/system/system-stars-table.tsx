"use client";

import { type FunctionComponent, useState } from "react";
import type { SystemDispatcher } from "@/core/events/SystemDispatcher";
import type { MappedSystemBody } from "@/core/interfaces/SystemBody";
import type { Links, Meta } from "@/core/interfaces/Pagination";
import { formatDate, formatNumber } from "@/core/string-utils";
import Link from "next/link";
import Table from "@/components/table";
import Heading from "@/components/heading";

type SystemStar = Required<MappedSystemBody>;

interface Props {
  stars: SystemStar[];
  dispatcher: SystemDispatcher;
}

const PER_PAGE = 10;

const buildPaginationProps = (
  allRows: SystemStar[],
  currentPage: number,
): { rows: SystemStar[]; meta: Meta; links: Links } => {
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

const SystemStarsTable: FunctionComponent<Props> = ({ stars, dispatcher }) => {
  const [currentPage, setCurrentPage] = useState(1);

  const filtered = stars.filter((s) => s.name !== "Additional Objects");
  const { rows, meta, links } = buildPaginationProps(filtered, currentPage);

  const handlePage = (link: string) => {
    const params = new URLSearchParams(link.replace(/^[^?]*/, ""));
    setCurrentPage(parseInt(params.get("page") ?? "1", 10));
  };

  const columns = {
    name: {
      title: "Name",
      render: (body: SystemStar) => {
        return (
          <span
            className="hover:text-glow__orange text-blue-200 hover:cursor-pointer hover:underline"
            onClick={() =>
              dispatcher.selectBody({
                body,
                type: "select-body",
              })
            }
          >
            <i className={`icarus-terminal-star text-glow me-2 text-sm`}></i>
            {body.name}
          </span>
        );
      },
    },
    type: {
      title: "Type",
      render: (body: SystemStar) => {
        return body.sub_type.replace("Star", "");
      },
    },
    spectral_class: {
      title: "Class",
      render: (body: SystemStar) => {
        return body.spectral_class ?? "No Data";
      },
    },
    main_star: {
      title: "Is Main",
      render: (body: SystemStar) => {
        return body.is_main_star ? (
          <span className="text-green-300">Yes</span>
        ) : (
          <span className="text-red-300">No</span>
        );
      },
    },
    bodies: {
      title: "Bodies",
      render: (body: SystemStar) => {
        return (
          <span
            className="hover:text-glow__orange text-blue-200 hover:cursor-pointer hover:underline"
            onClick={() =>
              dispatcher.selectBody({
                body,
                type: "select-body",
              })
            }
          >
            {body._children?.length ?? 0}
          </span>
        );
      },
    },
    scoopable: {
      title: "Fuel",
      render: (body: SystemStar) => {
        return body.is_scoopable ? (
          <span className="text-green-300">Yes</span>
        ) : (
          <span className="text-red-300">No</span>
        );
      },
    },
    surface_temp: {
      title: "Surface Temp",
      render: (body: SystemStar) => {
        return formatNumber(body.surface_temp ?? 0) + " K";
      },
    },
    solar_masses: {
      title: "Sol Mass",
      render: (body: SystemStar) => {
        return (body.solar_masses as number).toFixed(4);
      },
    },
    solar_radius: {
      title: "Sol Radius",
      render: (body: SystemStar) => {
        return (body.solar_radius as number).toFixed(4);
      },
    },
    magnitude: {
      title: "Magnitude",
      render: (body: SystemStar) => {
        return (body.absolute_magnitude as number).toFixed(4);
      },
    },
    commander: {
      title: "Discovered By",
      render: (body: SystemStar) => {
        const value = body.discovered_by ? body.discovered_by : "Unknown";
        return (
          <Link className="text-blue-200 hover:underline" href={"#"}>
            {value.startsWith("CMDR") ? value : `CMDR ${value}`}
          </Link>
        );
      },
    },
    discovered: {
      title: "Discovered On",
      render: (body: SystemStar) => {
        return formatDate(body.discovered_at);
      },
    },
  };

  const header = (
    <Heading bordered icon="icarus-terminal-star" title="Main Sequence Stars" subtitle="Stellar Classification Data" className="px-5 py-4" />
  );

  return (
    <Table header={header} columns={columns} data={rows} meta={meta} links={links} page={handlePage} />
  );
};

export default SystemStarsTable;
