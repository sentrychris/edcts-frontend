import { useEffect, useState } from "react";

export interface RecentSystem {
  name: string;
  slug: string;
}

const STORAGE_KEY = "edcts_recent_systems";
const MAX_RECENT = 8;
const UPDATE_EVENT = "edcts:system-tracked";

function readFromStorage(): RecentSystem[] {
  if (typeof window === "undefined") return [];
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? (JSON.parse(stored) as RecentSystem[]) : [];
}

export function clearRecentSystems(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(STORAGE_KEY);
  window.dispatchEvent(new CustomEvent(UPDATE_EVENT));
}

export function trackSystemVisit(name: string, slug: string): void {
  if (typeof window === "undefined") return;

  const existing = readFromStorage();
  const filtered = existing.filter((s) => s.slug !== slug);
  const updated = [{ name, slug }, ...filtered].slice(0, MAX_RECENT);

  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  window.dispatchEvent(new CustomEvent(UPDATE_EVENT));
}

export function useRecentSystems(): RecentSystem[] {
  const [systems, setSystems] = useState<RecentSystem[]>([]);

  useEffect(() => {
    const sync = () => setSystems(readFromStorage());

    sync();
    window.addEventListener(UPDATE_EVENT, sync);
    return () => window.removeEventListener(UPDATE_EVENT, sync);
  }, []);

  return systems;
}
