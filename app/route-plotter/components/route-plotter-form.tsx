"use client";

import { useState } from "react";
import SystemSearchInput from "./system-search-input";

interface Props {
  initialFrom: string;
  initialTo: string;
  initialLy: number;
  onSubmit: (from: string, to: string, ly: number) => void;
  isLoading: boolean;
}

export default function RoutePlotterForm({
  initialFrom,
  initialTo,
  initialLy,
  onSubmit,
  isLoading,
}: Props) {
  const [fromSlug, setFromSlug] = useState(initialFrom);
  const [toSlug, setToSlug] = useState(initialTo);
  const [ly, setLy] = useState(String(initialLy));

  const canSubmit = !isLoading && fromSlug !== "" && toSlug !== "";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) {
      return;
    }
    onSubmit(fromSlug, toSlug, Math.max(1, parseInt(ly, 10) || 30));
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 sm:flex-row sm:items-end">
      <SystemSearchInput
        label="Origin System"
        placeholder="Search for a system..."
        onSelect={setFromSlug}
        disabled={isLoading}
      />

      <SystemSearchInput
        label="Destination System"
        placeholder="Search for a system..."
        onSelect={setToSlug}
        disabled={isLoading}
      />

      {/* Jump range — fixed width, same height as autocomplete inputs */}
      <div className="sm:w-28 sm:shrink-0">
        <label className="mb-1 block text-xs font-bold uppercase tracking-widest text-neutral-400">
          Jump Range
        </label>
        <input
          type="number"
          min={1}
          max={500}
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
            <i className="icarus-terminal-route text-sm"></i>
            Plotting...
          </span>
        ) : (
          <span className="flex items-center gap-2">
            <i className="icarus-terminal-route text-sm"></i>
            Plot Route
          </span>
        )}
      </button>
    </form>
  );
}
