"use client";

import Link from "next/link";
import { useRecentSystems } from "@/core/hooks/use-recent-systems";

const SidebarRecentSystems = () => {
  const systems = useRecentSystems();

  return (
    <div className="px-4 py-4">
      <div className="mb-3 flex items-center gap-2 border-b border-orange-900/20 pb-3 text-xs uppercase tracking-widest text-neutral-600">
        <i className="icarus-terminal-system-orbits text-orange-500/50"></i>
        <span>Recently Surveyed</span>
      </div>

      {systems.length === 0 ? (
        <p className="px-1 text-xs uppercase tracking-widest text-neutral-800">
          No systems surveyed
        </p>
      ) : (
        <div className="flex flex-col">
          {systems.map(({ name, slug }) => (
            <Link
              key={slug}
              href={`/systems/${slug}`}
              className="group flex items-center gap-2.5 border-l-2 border-transparent py-2 pl-3 pr-2 text-xs uppercase tracking-widest text-neutral-500 transition-all hover:border-orange-900/40 hover:bg-orange-900/5 hover:text-neutral-200"
            >
              <i className="icarus-terminal-location text-neutral-800 transition-colors group-hover:text-neutral-600 text-sm"></i>
              <span className="truncate">{name}</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default SidebarRecentSystems;
