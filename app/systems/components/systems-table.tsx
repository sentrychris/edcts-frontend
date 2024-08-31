"use client";

import type { FunctionComponent } from "react";
import type { Links, Meta, Pagination } from "@/core/interfaces/Pagination";
import type { System } from "@/core/interfaces/System";
import { useState } from "react";
import { getCollection } from "@/core/api";
import { useDebounce } from "@/core/hooks/debounce";
import { renderAllegianceText, renderSecurityText } from "../lib/render-utils";
import Link from "next/link";
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
      title: "Name",
      render: (system: System) => {
        return (
          <Link className="text-blue-200 hover:underline" href={`/systems/${system.slug}`}>
            {system.name}
          </Link>
        );
      },
    },
    government: {
      title: "Government",
      render: (system: System) =>
        system.information && system.information.government
          ? system.information.government
          : "None",
    },
    allegiance: {
      title: "Allegiance",
      render: (system: System) =>
        renderAllegianceText(
          system.information && system.information.allegiance
            ? system.information.allegiance
            : "None",
        ),
    },
    faction: {
      title: "Faction",
      render: (system: System) =>
        system.information &&
        system.information.controlling_faction &&
        system.information.controlling_faction.name
          ? system.information.controlling_faction.name
          : "None",
    },
    population: {
      title: "Population",
      render: (system: System) =>
        system.information && system.information.population
          ? system.information.population.toLocaleString()
          : "0",
    },
    economy: {
      title: "Economy",
      render: (system: System) =>
        system.information && system.information.economy ? system.information.economy : "None",
    },
    security: {
      title: "Security",
      render: (system: System) =>
        renderSecurityText(
          system.information && system.information.security ? system.information.security : "None",
        ),
    },
  };

  return (
    <div className={className}>
      <Filter placeholder="Search by system name..." handleInput={searchByName} className="mb-5" />
      <div className="mb-5 grid grid-cols-1 gap-5 md:grid-cols-5 lg:grid-cols-11">
        <Filter
          displayClearButton={false}
          type="number"
          className="col-span-3 md:col-span-2"
          placeholder="Population..."
          handleInput={(input) => {
            searchByInformation("population", input);
          }}
        />

        <Filter
          displayClearButton={false}
          className="col-span-3"
          placeholder="Government..."
          handleInput={(input) => {
            searchByInformation("government", input);
          }}
        />

        <Filter
          displayClearButton={false}
          className="col-span-3 md:col-span-2 lg:col-span-3"
          placeholder="Allegiance..."
          handleInput={(input) => {
            searchByInformation("allegiance", input);
          }}
        />

        <Filter
          displayClearButton={false}
          className="col-span-3"
          placeholder="Security..."
          handleInput={(input) => {
            searchByInformation("security", input);
          }}
        />
      </div>
      <Table columns={columns} data={rows} meta={metadata} links={navigation} page={paginate} />
    </div>
  );
};

export default SystemsTable;
