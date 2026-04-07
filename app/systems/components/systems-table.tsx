"use client";

import type { FunctionComponent } from "react";
import type { Pagination } from "@/core/interfaces/Pagination";
import type { System } from "@/core/interfaces/System";
import { useState } from "react";
import { getCollection } from "@/core/api";
import { useDebounce } from "@/core/hooks/debounce";
import { usePaginatedCollection } from "@/core/hooks/paginated-collection";
import { renderAllegianceText, renderSecurityText } from "@/core/render-utils";
import Link from "next/link";
import Panel from "@/components/panel";
import Filter from "@/components/filter";
import Table from "@/components/table";
import Heading from "@/components/heading";

interface Props {
  className?: string;
  systems: Pagination<System>;
}

const SystemsTable: FunctionComponent<Props> = ({ className = "", systems }) => {
  const { rows, meta, links, setPage, paginate } = usePaginatedCollection<System>(systems);

  const [nameQuery, setNameQuery] = useState("");
  const [informationQuery, setInformationQuery] = useState({
    population: "",
    government: "",
    allegiance: "",
    security: "",
  });

  const debouncedNameQuery = useDebounce(nameQuery, 200);
  const debouncedInformationQuery = useDebounce(informationQuery, 200);

  const searchByName = async (value: string) => {
    setNameQuery(value);

    let response;
    if (value.length === 0) {
      response = await getCollection<System>("systems", {
        params: {
          withInformation: 1,
        },
      });
    } else {
      if (debouncedNameQuery?.length > 1) {
        response = await getCollection<System>("systems", {
          params: {
            name: value,
            exactSearch: 0,
            withInformation: 1,
          },
        });
      }
    }

    if (response) {
      setPage(response);
    }
  };

  const searchByInformation = async (field: string, value: string) => {
    setInformationQuery((prev) => ({ ...prev, [field]: value }));

    const params: Record<string, string | number> = {
      withInformation: 1,
    };

    if (value.length === 0) {
      for (const [key, val] of Object.entries(informationQuery)) {
        if (field !== key && val.length > 0) {
          params[key] = val;
        }
      }
    } else {
      if (debouncedInformationQuery[field]?.length > 1) {
        for (const [key, val] of Object.entries(informationQuery)) {
          if (val.length > 0) {
            params[key] = val;
          }
        }
      }
    }

    const response = await getCollection<System>("system/search/information", { params });

    if (response) {
      setPage(response);
    }
  };

  const columns = {
    name: {
      title: "Designation",
      render: (system: System) => (
        <Link
          className="hover:text-glow__orange text-blue-200 flex items-center gap-2"
          href={`/systems/${system.slug}`}
        >
          <i className="icarus-terminal-system-orbits text-xs"></i>
          {system.name}
        </Link>
      ),
    },
    government: {
      title: "Government",
      render: (system: System) => (
        <span className="tracking-wide text-neutral-300">
          {system.information?.government ?? "None"}
        </span>
      ),
    },
    allegiance: {
      title: "Allegiance",
      render: (system: System) =>
        renderAllegianceText(system.information?.allegiance ?? "None"),
    },
    faction: {
      title: "Ctrl. Faction",
      render: (system: System) => (
        <span className="tracking-wide text-neutral-300">
          {system.information?.controlling_faction?.name ?? "None"}
        </span>
      ),
    },
    population: {
      title: "Population",
      render: (system: System) => (
        <span className="tracking-wide text-neutral-300">
          {system.information?.population ? system.information.population.toLocaleString() : "0"}
        </span>
      ),
    },
    economy: {
      title: "Economy",
      render: (system: System) => (
        <span className="text-glow__orange tracking-wide">
          {system.information?.economy ?? "None"}
        </span>
      ),
    },
    security: {
      title: "Security",
      render: (system: System) =>
        renderSecurityText(system.information?.security ?? "None"),
    },
  };

  return (
    <div className={className}>
      {/* ── Query Panel ── */}
      <Panel variant="muted" className="mb-4">

        <Heading bordered icon="icarus-terminal-route" title="Query Parameters" subtitle="Cartographic Database Filter" iconSize="1.2rem" className="px-4 py-3">
          <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-neutral-600">
            <span className="h-1.5 w-1.5 rounded-full bg-orange-500/60"></span>
            <span>{rows.length} results</span>
          </div>
        </Heading>

        <div className="p-4">
          <Filter
            placeholder="Search system designation..."
            handleInput={searchByName}
            className="mb-3"
          />
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-4">
            <Filter
              displayClearButton={false}
              type="number"
              placeholder="Population..."
              handleInput={(input) => searchByInformation("population", input)}
            />
            <Filter
              displayClearButton={false}
              placeholder="Government..."
              handleInput={(input) => searchByInformation("government", input)}
            />
            <Filter
              displayClearButton={false}
              placeholder="Allegiance..."
              handleInput={(input) => searchByInformation("allegiance", input)}
            />
            <Filter
              displayClearButton={false}
              placeholder="Security..."
              handleInput={(input) => searchByInformation("security", input)}
            />
          </div>
        </div>
      </Panel>

      {/* ── Results Table ── */}
      <Table columns={columns} data={rows} meta={meta} links={links} page={paginate} />
    </div>
  );
};

export default SystemsTable;
