"use client";

import { useEffect, useRef, useState } from "react";
import type { System } from "@/core/interfaces/System";
import { getCollection } from "@/core/api";

interface Props {
  label: string;
  placeholder?: string;
  onSelect: (slug: string) => void;
  disabled?: boolean;
}

export default function SystemSearchInput({ label, placeholder, onSelect, disabled }: Props) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Pick<System, "name" | "slug">[]>([]);
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [confirmed, setConfirmed] = useState(false);

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const search = (text: string) => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    if (text.trim().length < 2) {
      setResults([]);
      setOpen(false);
      return;
    }

    debounceRef.current = setTimeout(async () => {
      try {
        const { data } = await getCollection<System>("systems", {
          params: { name: text.trim(), limit: 8 },
        });
        setResults(data);
        setOpen(data.length > 0);
        setActiveIndex(-1);
      } catch {
        setResults([]);
        setOpen(false);
      }
    }, 300);
  };

  const handleChange = (text: string) => {
    setQuery(text);
    setConfirmed(false);
    onSelect("");
    search(text);
  };

  const select = (system: Pick<System, "name" | "slug">) => {
    setQuery(system.name);
    setConfirmed(true);
    onSelect(system.slug);
    setOpen(false);
    setResults([]);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!open || results.length === 0) {
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (activeIndex >= 0) {
        select(results[activeIndex]);
      }
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={containerRef} className="relative grow">
      <label className="mb-1 block text-xs font-bold uppercase tracking-widest text-neutral-400">
        {label}
      </label>
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => handleChange(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => !confirmed && results.length > 0 && setOpen(true)}
          placeholder={placeholder ?? "Search for a system..."}
          disabled={disabled}
          autoComplete="off"
          spellCheck={false}
          aria-autocomplete="list"
          aria-expanded={open}
          className={`h-[37px] w-full border bg-transparent pl-4 pr-8 text-xs uppercase tracking-wider placeholder-neutral-600 outline-none transition-colors focus:outline-none ${
            confirmed
              ? "border-orange-500/60 text-orange-300"
              : "border-orange-900/20 text-neutral-200 focus:border-orange-500/60"
          }`}
        />

        {/* Selection confirmed indicator */}
        {confirmed && (
          <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
            <i className="icarus-terminal-route text-xs text-orange-400/70"></i>
          </span>
        )}
      </div>

      {/* Dropdown */}
      {open && (
        <div
          role="listbox"
          className="absolute left-0 right-0 top-full z-50 mt-px border border-orange-900/30 bg-black/95 backdrop-blur backdrop-filter"
        >
          {results.map((system, i) => (
            <button
              key={system.slug}
              type="button"
              role="option"
              aria-selected={i === activeIndex}
              onMouseDown={(e) => {
                e.preventDefault();
                select(system);
              }}
              className={`flex w-full items-center gap-3 px-4 py-2 text-left text-xs uppercase tracking-widest transition-colors ${
                i === activeIndex
                  ? "bg-orange-900/30 text-orange-300"
                  : "text-neutral-400 hover:bg-orange-900/20 hover:text-neutral-200"
              }`}
            >
              <i className="icarus-terminal-star shrink-0 text-xs text-orange-500/30"></i>
              <span className="truncate">{system.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
