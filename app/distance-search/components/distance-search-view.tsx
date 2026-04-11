"use client";

import { useState } from "react";
import type { Pagination } from "@/core/interfaces/Pagination";
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
  const [pagination, setPagination] = useState<Pagination<SystemDistance> | null>(null);
  const [originName, setOriginName] = useState("");
  const [currentSlug, setCurrentSlug] = useState(initialSlug);
  const [currentLy, setCurrentLy] = useState(initialLy);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPage = async (slug: string, ly: number, page: number) => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await getCollection<SystemDistance>("system/search/distance", {
        params: { slug, ly, limit: 10, page },
      });
      setPagination(data);
    } catch {
      setError("No systems found. Verify the system name or try increasing the search radius.");
      setPagination(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (slug: string, name: string, ly: number) => {
    setCurrentSlug(slug);
    setCurrentLy(ly);
    setOriginName(name);
    setPagination(null);
    await fetchPage(slug, ly, 1);
  };

  const handlePageChange = (page: number) => {
    fetchPage(currentSlug, currentLy, page);
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
      {pagination && !isLoading && (
        <div className="grid grid-cols-1 gap-5 xl:grid-cols-3 xl:items-stretch">
          <div className="xl:col-span-2">
            <DistanceResults3D
              results={pagination.data}
              originName={originName}
              searchLy={currentLy}
            />
          </div>
          <div className="flex flex-col">
            <DistanceResultsList
              pagination={pagination}
              originName={originName}
              searchLy={currentLy}
              onPageChange={handlePageChange}
            />
          </div>
        </div>
      )}
    </div>
  );
}
