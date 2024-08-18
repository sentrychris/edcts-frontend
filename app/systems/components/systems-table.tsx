"use client";

import type { FunctionComponent } from "react";
import type { Links, Meta, Pagination } from "@/core/interfaces/Pagination";
import type { System } from "@/core/interfaces/System";
import { useState } from "react";
import { getCollection } from "@/core/api";
import { useDebounce } from "@/core/hooks/debounce";
import { renderAllegianceText, renderSecurityText } from "../lib/render";
import Link from "next/link";
import Filter from "@/components/filter";
import Table from "@/components/table";

interface Props {
  systems: Pagination<System>;
}

const SystemsTable: FunctionComponent<Props> = ({ systems }) => {
  const { data, meta, links } = systems;
  const [rows, setRows] = useState(data);
  const [metadata, setMetadata] = useState(meta);
  const [navigation, setNavigation] = useState(links);

  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 200);

  const setState = async (data: System[], meta: Meta, links: Links) => {
    setRows(data);
    setMetadata(meta);
    setNavigation(links);
  };

  const searchData = async (text: string) => {
    setQuery(text);

    let response;
    if (text.length === 0) {
      response = await getCollection<System>("systems", {
        withInformation: 1,
      });
    } else {
      if (debouncedQuery?.length > 1) {
        response = await getCollection<System>("systems", {
          name: text,
          exactSearch: 0,
          withInformation: 1,
        });
      }
    }

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
    <div>
      <Filter handleInput={searchData} className="mb-5" />
      <Table columns={columns} data={rows} meta={metadata} links={navigation} page={paginate} />
    </div>
  );
};

export default SystemsTable;
