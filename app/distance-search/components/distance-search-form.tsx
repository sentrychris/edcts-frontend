"use client";

import { useState } from "react";
import SystemSearchInput from "@/app/route-plotter/components/system-search-input";
import type { System } from "@/core/interfaces/System";
import { getResource } from "@/core/api";

interface Props {
  initialSlug: string;
  initialLy: number;
  onSubmit: (slug: string, name: string, ly: number) => void;
  isLoading: boolean;
}

export default function DistanceSearchForm({ initialSlug, initialLy, onSubmit, isLoading }: Props) {
  const [slug, setSlug] = useState(initialSlug);
  const [name, setName] = useState("");
  const [ly, setLy] = useState(String(initialLy));

  const canSubmit = !isLoading && slug !== "";

  // SystemSearchInput only exposes the slug on select; we also need the name for display.
  // We resolve the name by calling the systems API when a slug is selected.
  const handleSelect = async (selectedSlug: string) => {
    setSlug(selectedSlug);
    if (!selectedSlug) {
      setName("");
      return;
    }
    try {
      const { data } = await getResource<System>(`systems/${selectedSlug}`);
      setName(data.name);
    } catch {
      setName(selectedSlug);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    onSubmit(slug, name, Math.max(1, parseInt(ly, 10) || 50));
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 sm:flex-row sm:items-end">
      <SystemSearchInput
        label="Origin System"
        placeholder="Search for a system..."
        onSelect={handleSelect}
        disabled={isLoading}
      />

      {/* Search radius */}
      <div className="sm:w-36 sm:shrink-0">
        <label className="mb-1 block text-xs font-bold uppercase tracking-widest text-neutral-400">
          Radius (ly)
        </label>
        <input
          type="number"
          min={1}
          max={5000}
          value={ly}
          onChange={(e) => setLy(e.target.value)}
          disabled={isLoading}
          className="h-[37px] w-full border border-orange-900/20 bg-transparent pl-4 text-xs uppercase tracking-wider text-neutral-200 outline-none transition-colors focus:border-orange-500/60 focus:outline-none"
        />
      </div>

      <button
        type="submit"
        disabled={!canSubmit}
        className="fx-btn-sweep h-[37px] shrink-0 border border-orange-900/40 px-6 text-xs font-bold uppercase tracking-widest text-orange-500/70 transition-colors hover:border-orange-500/60 hover:text-orange-400 disabled:pointer-events-none disabled:opacity-40"
      >
        {isLoading ? (
          <span className="flex items-center gap-2">
            <i className="icarus-terminal-system-orbits text-sm"></i>
            Scanning...
          </span>
        ) : (
          <span className="flex items-center gap-2">
            <i className="icarus-terminal-system-orbits text-sm"></i>
            Scan Area
          </span>
        )}
      </button>
    </form>
  );
}
