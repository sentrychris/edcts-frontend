"use client";

import type { FunctionComponent } from "react";
import type { Links, Meta, Pagination } from "@/core/interfaces/Pagination";
import type { System } from "@/core/interfaces/System";
import { useState } from "react";
import { getCollection } from "@/core/api";
import { useDebounce } from "@/core/hooks/debounce";
import { renderAllegianceText, renderSecurityText } from "../lib/render-utils";
import Link from "next/link";
import PanelCorners from "@/components/panel-corners";
import Filter from "@/components/filter";
import Table from "@/components/table";

interface Props {
  className?: string;
  systems: Pagination<System>;
}

const SystemsTable: FunctionComponent<Props> = ({ className = "", systems }) => {
  const { data, meta, links } = systems;
  const [rows, setRows] = useState(data);
  const [metadata, setMetadata] = useState(meta);
  const [navigation, setNavigation] = useState(links);

  const [nameQuery, setNameQuery] = useState("");
  const [informationQuery, setInformationQuery] = useState({
    population: "",
    government: "",
    allegiance: "",
    security: "",
  });

  const debouncedNameQuery = useDebounce(nameQuery, 200);
  const debouncedInformationQuery = useDebounce(informationQuery, 200);

  const setState = async (data: System[], meta: Meta, links: Links) => {
    setRows(data);
    setMetadata(meta);
    setNavigation(links);
  };

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
      const { data, meta, links } = response;
      await setState(data, meta, links);
    }
  };

  /**
   * Construct the search query for the information fields.
   *
   * Used to search by population, government, allegiance, and security.
   *
   * @param field - the field we are searching by
   * @param value - the value we are searching for
   */
  const searchByInformation = async (field: string, value: string) => {
    // Update the query state object
    setInformationQuery((prev) => ({ ...prev, [field]: value }));

    // Construct default query params
    const params: Record<string, string | number> = {
      withInformation: 1,
    };

    // Check if the value is empty
    if (value.length === 0) {
      // Loop through the query object and add the values to the params object
      // if the field is not the current field and the value is not empty
      for (const [key, val] of Object.entries(informationQuery)) {
        if (field !== key && val.length > 0) {
          params[key] = val;
        }
      }
    } else {
      // Check if the debounced query object has a length greater than 1
      if (debouncedInformationQuery[field]?.length > 1) {
        // Loop through the query object and add the values to the params object
        for (const [key, val] of Object.entries(informationQuery)) {
          if (val.length > 0) {
            params[key] = val;
          }
        }
      }
    }

    const response = await getCollection<System>("system/search/information", {
      params,
    });

    if (response) {
      const { data, meta, links } = response;
      await setState(data, meta, links);
    }
  };

  const paginate = async (link: string) => {
    const { data, meta, links } = await getCollection<System>(link);
    await setState(data, meta, links);
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
      <div className="relative mb-4 border border-orange-900/20 bg-black/50 backdrop-blur backdrop-filter">
        <PanelCorners />

        <div className="flex items-center gap-3 border-b border-orange-900/20 px-4 py-3">
          <i className="icarus-terminal-route text-glow__orange" style={{ fontSize: "1.2rem" }}></i>
          <div className="flex-1">
            <h3 className="text-glow__orange font-bold uppercase tracking-widest">Query Parameters</h3>
            <p className="text-xs uppercase tracking-wider text-neutral-500">Cartographic Database Filter</p>
          </div>
          <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-neutral-600">
            <span className="h-1.5 w-1.5 rounded-full bg-orange-500/60"></span>
            <span>{rows.length} results</span>
          </div>
        </div>

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
      </div>

      {/* ── Results Table ── */}
      <Table columns={columns} data={rows} meta={metadata} links={navigation} page={paginate} />
    </div>
  );
};

export default SystemsTable;
