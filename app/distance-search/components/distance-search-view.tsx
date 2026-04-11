"use client";

import { useState } from "react";
import type { SystemDistance } from "@/core/interfaces/SystemDistance";
import { getCollection } from "@/core/api";
import Panel from "@/components/panel";
import Heading from "@/components/heading";
import DistanceSearchForm from "./distance-search-form";
import DistanceResults3D from "./distance-results-3d";
import DistanceResultsList from "./distance-results-list";

interface Props {
  initialSlug: string;
  initialLy: number;
}

export default function DistanceSearchView({ initialSlug, initialLy }: Props) {
  const [results, setResults] = useState<SystemDistance[] | null>(null);
  const [originName, setOriginName] = useState("");
  const [searchLy, setSearchLy] = useState(initialLy);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (slug: string, name: string, ly: number) => {
    setIsLoading(true);
    setError(null);
    setResults(null);
    setOriginName(name);
    setSearchLy(ly);

    try {
      const { data } = await getCollection<SystemDistance>("system/search/distance", {
        params: { slug, ly, limit: 100 },
      });
      setResults(data);
    } catch {
      setError("No systems found. Verify the system name or try increasing the search radius.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-5">
      {/* ── Form ── */}
      <Panel className="px-4 py-4 md:px-6 md:py-5">
        <Heading
          icon="icarus-terminal-system-orbits"
          title="Distance Search"
          subtitle="Find star systems within a given distance"
          bordered
          className="mb-4 pb-4"
        />
        <DistanceSearchForm
          initialSlug={initialSlug}
          initialLy={initialLy}
          onSubmit={handleSubmit}
          isLoading={isLoading}
        />
      </Panel>

      {/* ── Error ── */}
      {error && (
        <Panel className="px-4 py-4 md:px-6 md:py-5">
          <div className="flex items-center gap-3 text-red-400/80">
            <i className="icarus-terminal-warning text-base"></i>
            <p className="text-xs uppercase tracking-widest">{error}</p>
          </div>
        </Panel>
      )}

      {/* ── Loading ── */}
      {isLoading && (
        <Panel className="flex items-center justify-center px-4 py-16">
          <div className="flex flex-col items-center gap-4">
            <i className="icarus-terminal-system-orbits text-glow__orange text-3xl"></i>
            <p className="text-xs uppercase tracking-widest text-neutral-500">
              Scanning proximity...
            </p>
          </div>
        </Panel>
      )}

      {/* ── Results ── */}
      {results && !isLoading && (
        <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">
          <div className="xl:col-span-2">
            <DistanceResults3D results={results} originName={originName} searchLy={searchLy} />
          </div>
          <div>
            <DistanceResultsList results={results} originName={originName} searchLy={searchLy} />
          </div>
        </div>
      )}
    </div>
  );
}
