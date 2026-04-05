"use client";

import type { FunctionComponent } from "react";
import type { Links, Meta } from "@/core/interfaces/Pagination";
import { useEffect, useMemo, useState } from "react";
import { getResource } from "@/core/api";
import Loader from "@/components/loader";
import Filter from "@/components/filter";
import Table from "@/components/table";
import { formatDate, formatNumber } from "@/core/string-utils";

const PER_PAGE = 15;

interface RawCommodity {
  buyPrice: number;
  demand: number;
  demandBracket: number;
  meanPrice: number;
  name: string;
  sellPrice: number;
  stock: number;
  stockBracket: number;
}

interface Commodity extends RawCommodity {
  id: number;
  displayName: string;
}

interface MarketData {
  station: string;
  system: string;
  commodities: Record<string, RawCommodity>;
  prohibited: string[];
  last_updated: string | null;
}

interface Props {
  slug: string;
}

type MarketView = "all" | "for_sale" | "in_demand";

function prettifyName(name: string): string {
  return name.replace(/([A-Z]+)([A-Z][a-z])/g, "$1 $2").replace(/([a-z])([A-Z])/g, "$1 $2");
}

function stockBracketLabel(bracket: number): string {
  if (bracket === 1) return "Low";
  if (bracket === 2) return "Med";
  if (bracket === 3) return "High";
  return "—";
}

const StationMarket: FunctionComponent<Props> = ({ slug }) => {
  const [market, setMarket] = useState<MarketData | null>(null);
  const [isLoading, setLoading] = useState<boolean>(true);
  const [filter, setFilter] = useState<string>("");
  const [view, setView] = useState<MarketView>("all");
  const [currentPage, setCurrentPage] = useState<number>(1);

  useEffect(() => {
    getResource<MarketData>(`station/${slug}/market`)
      .then((response) =>
        setMarket(
          Array.isArray(response.data)
            ? { station: "", system: "", commodities: {}, prohibited: [], last_updated: null }
            : response.data,
        ),
      )
      .finally(() => setLoading(false));
  }, [slug]);

  const commodities = useMemo<Commodity[]>(() => {
    if (!market?.commodities) return [];
    return Object.values(market.commodities).map((c, i) => ({
      ...c,
      id: i + 1,
      displayName: prettifyName(c.name),
    }));
  }, [market]);

  const filteredCommodities = useMemo<Commodity[]>(() => {
    let result = commodities;

    if (view === "for_sale") {
      result = result.filter((c) => c.stockBracket > 0);
    } else if (view === "in_demand") {
      result = result.filter((c) => c.stockBracket === 0 && c.demandBracket > 0);
    }

    if (filter) {
      const lc = filter.toLowerCase();
      result = result.filter((c) => c.displayName.toLowerCase().includes(lc));
    }

    return result;
  }, [commodities, filter, view]);

  useEffect(() => {
    setCurrentPage(1);
  }, [filter, view]);

  const totalPages = Math.max(1, Math.ceil(filteredCommodities.length / PER_PAGE));

  const paginatedCommodities = useMemo<Commodity[]>(() => {
    const start = (currentPage - 1) * PER_PAGE;
    return filteredCommodities.slice(start, start + PER_PAGE);
  }, [filteredCommodities, currentPage]);

  const paginationMeta: Meta = {
    current_page: currentPage,
    from: (currentPage - 1) * PER_PAGE + 1,
    to: Math.min(currentPage * PER_PAGE, filteredCommodities.length),
    per_page: PER_PAGE,
    path: "",
  };

  const paginationLinks: Links = {
    first: "1",
    last: String(totalPages),
    prev: currentPage > 1 ? String(currentPage - 1) : null,
    next: currentPage < totalPages ? String(currentPage + 1) : null,
  };

  const columns = {
    displayName: {
      title: "Commodity",
      render: (c: Commodity) => <span className="text-glow__white">{c.displayName}</span>,
    },
    buyPrice: {
      title: "Buy Price",
      render: (c: Commodity) => {
        if (c.buyPrice === 0) return <span className="text-neutral-500">—</span>;
        const colorClass = c.buyPrice <= c.meanPrice ? "text-green-300" : "text-red-300";
        return <span className={colorClass}>{formatNumber(c.buyPrice)} cr</span>;
      },
    },
    sellPrice: {
      title: "Sell Price",
      render: (c: Commodity) => {
        if (c.sellPrice === 0) return <span className="text-neutral-500">—</span>;
        const colorClass = c.sellPrice >= c.meanPrice ? "text-green-300" : "text-red-300";
        return <span className={colorClass}>{formatNumber(c.sellPrice)} cr</span>;
      },
    },
    stock: {
      title: "Stock",
      render: (c: Commodity) => {
        if (c.stock === 0) return <span className="text-neutral-500">—</span>;
        return (
          <span>
            {formatNumber(c.stock)}{" "}
            <span className="text-neutral-500">({stockBracketLabel(c.stockBracket)})</span>
          </span>
        );
      },
    },
    demand: {
      title: "Demand",
      render: (c: Commodity) => {
        if (c.demandBracket === 0) return <span className="text-neutral-500">—</span>;
        return (
          <span>
            {formatNumber(c.demand)}{" "}
            <span className="text-neutral-500">({stockBracketLabel(c.demandBracket)})</span>
          </span>
        );
      },
    },
    meanPrice: {
      title: "Avg. Price",
      render: (c: Commodity) => <span>{formatNumber(c.meanPrice)} cr</span>,
    },
  };

  const tabClass = (tab: MarketView) =>
    "whitespace-nowrap px-4 py-2.5 text-xs font-bold uppercase tracking-widest border transition-colors " +
    (view === tab
      ? "border-orange-500/60 text-glow__orange bg-orange-900/20"
      : "border-orange-900/20 text-neutral-500 hover:border-neutral-600 hover:text-neutral-300");

  return (
    <>
      {isLoading && <Loader visible={isLoading} />}

      {!isLoading && market !== null && (
        <div className="mt-8">
          {/* ── Market Header ── */}
          <div className="mb-5 flex items-center justify-between border-b border-orange-900/20 pb-4">
            <div className="flex items-center gap-3">
              <i className="icarus-terminal-cargo text-glow__orange" style={{ fontSize: "1.5rem" }}></i>
              <div>
                <h2 className="text-glow__orange font-bold uppercase tracking-widest">Market Data</h2>
                <p className="text-xs uppercase tracking-wider text-neutral-500">Commodity Exchange</p>
              </div>
            </div>
            {market.last_updated && (
              <span className="text-xs uppercase tracking-widest text-neutral-600">
                Updated {formatDate(market.last_updated)}
              </span>
            )}
          </div>

          {/* ── Prohibited goods ── */}
          {market.prohibited.length > 0 && (
            <div className="mb-5 border border-red-900/40 p-4">
              <div className="mb-3 flex items-center gap-2">
                <i className="icarus-terminal-warning text-red-400"></i>
                <span className="text-xs font-bold uppercase tracking-widest text-red-400">Prohibited Goods</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {market.prohibited.map((item) => (
                  <span
                    key={item}
                    className="border border-red-900/60 bg-red-900/10 px-2 py-1 text-xs uppercase tracking-widest text-red-300"
                  >
                    {prettifyName(item)}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* ── View tabs + filter ── */}
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex gap-2">
              {(["all", "for_sale", "in_demand"] as MarketView[]).map((tab) => (
                <button key={tab} className={tabClass(tab)} onClick={() => setView(tab)}>
                  {tab === "all" ? "All" : tab === "for_sale" ? "For Sale" : "In Demand"}
                </button>
              ))}
            </div>
            <Filter handleInput={setFilter} placeholder="Filter commodities..." />
          </div>

          <Table
            columns={columns}
            data={paginatedCommodities}
            meta={paginationMeta}
            links={paginationLinks}
            page={(link) => setCurrentPage(Number(link))}
          />
        </div>
      )}
    </>
  );
};

export default StationMarket;
