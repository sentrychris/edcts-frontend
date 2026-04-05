"use client";

import { type FunctionComponent, useState } from "react";
import type { MappedSystemBody } from "@/core/interfaces/SystemBody";
import type { SystemDispatcher } from "@/core/events/SystemDispatcher";
import { SystemBodyType } from "@/core/constants/system";
import { formatDate } from "@/core/string-utils";
import Link from "next/link";
import Table from "@/components/table";
import type { Links, Meta } from "@/core/interfaces/Pagination";

type SystemBody = Required<MappedSystemBody>;

interface Props {
  bodies: SystemBody[];
  dispatcher: SystemDispatcher;
}

const PER_PAGE = 10;

const buildPaginationProps = (
  allBodies: SystemBody[],
  currentPage: number,
): { rows: SystemBody[]; meta: Meta; links: Links } => {
  const total = allBodies.length;
  const lastPage = Math.max(1, Math.ceil(total / PER_PAGE));
  const from = (currentPage - 1) * PER_PAGE;
  const to = Math.min(from + PER_PAGE, total);

  const meta: Meta = {
    current_page: currentPage,
    from: from + 1,
    path: "",
    per_page: PER_PAGE,
    to,
  };

  const links: Links = {
    first: `?page=1`,
    last: `?page=${lastPage}`,
    prev: currentPage > 1 ? `?page=${currentPage - 1}` : null,
    next: currentPage < lastPage ? `?page=${currentPage + 1}` : null,
  };

  return { rows: allBodies.slice(from, to), meta, links };
};

const SystemBodiesTable: FunctionComponent<Props> = ({ bodies, dispatcher }) => {
  const [currentPage, setCurrentPage] = useState(1);

  const { rows, meta, links } = buildPaginationProps(bodies, currentPage);

  const handlePage = (link: string) => {
    const params = new URLSearchParams(link.replace(/^[^?]*/, ""));
    const page = parseInt(params.get("page") ?? "1", 10);
    setCurrentPage(page);
  };

  const isOrbitingPlanet = (body: SystemBody) => {
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
      render: (body: SystemBody) => {
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
            onClick={() =>
              dispatcher.selectBody({
                body,
                type: "select-body",
              })
            }
          >
            <i className={`icarus-terminal-${iconClass} me-2 text-sm`}></i>
            {body.name}
          </span>
        );
      },
    },
    sub_type: {
      title: "Type",
      render: (body: SystemBody) => {
        const childClass = isOrbitingPlanet(body) ? orbitalMargin : "";
        return <span className={childClass}>{body.sub_type}</span>;
      },
    },
    landable: {
      title: "Landable",
      render: (body: SystemBody) => {
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
      render: (body: SystemBody) => {
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
      render: (body: SystemBody) => {
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
      render: (body: SystemBody) => {
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
      render: (body: SystemBody) => {
        const childClass = isOrbitingPlanet(body) ? orbitalMargin : "";
        const value = body.discovered_by ? body.discovered_by : "Unknown";
        return (
          <Link className={`${childClass} text-blue-200 hover:underline`} href={"#"}>
            {value.startsWith("CMDR") ? value : `CMDR ${value}`}
          </Link>
        );
      },
    },
    discovered: {
      title: "Discovered On",
      render: (body: SystemBody) => {
        const childClass = isOrbitingPlanet(body) ? orbitalMargin : "";
        return <span className={childClass}>{formatDate(body.discovered_at)}</span>;
      },
    },
  };

  const header = (
    <div className="flex items-center gap-3 border-b border-orange-900/20 px-5 py-4">
      <i className="icarus-terminal-system-orbits text-glow__orange" style={{ fontSize: "1.25rem" }}></i>
      <div>
        <h2 className="text-glow__orange font-bold uppercase tracking-wide">Orbital Bodies</h2>
        <p className="text-xs uppercase tracking-wider text-neutral-500">Planetary Survey Records</p>
      </div>
    </div>
  );

  return <Table header={header} columns={columns} data={rows} meta={meta} links={links} page={handlePage} />;
};

export default SystemBodiesTable;
