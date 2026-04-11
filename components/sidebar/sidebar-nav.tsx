"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface Props {
  collapsed?: boolean;
}

const navItems = [
  { name: "Home", href: "/", icon: "icarus-terminal-ship" },
  { name: "Star Systems", href: "/systems", icon: "icarus-terminal-system-orbits" },
  { name: "Galaxy Map", href: "/galaxy-map", icon: "icarus-terminal-star" },
  { name: "Route Plotter", href: "/route-plotter", icon: "icarus-terminal-route" },
  { name: "Distance Search", href: "/distance-search", icon: "icarus-terminal-scan" },
  { name: "Galnet News", href: "/galnet", icon: "icarus-terminal-notifications" },
];

const SidebarNav = ({ collapsed = false }: Props) => {
  const pathname = usePathname();

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <div className={`shrink-0 ${collapsed ? "px-2 py-4" : "px-4 py-4"}`}>
      {!collapsed && (
        <div className="mb-3 flex items-center gap-2 border-b border-orange-900/20 pb-3 text-xs uppercase tracking-widest text-neutral-600">
          <i className="icarus-terminal-route text-orange-500/50"></i>
          <span>Navigation</span>
        </div>
      )}

      <nav className="flex flex-col">
        {navItems.map((item) =>
          collapsed ? (
            <Link
              key={item.name}
              href={item.href}
              title={item.name}
              aria-label={item.name}
              className={`flex items-center justify-center py-2.5 text-base transition-colors ${
                isActive(item.href)
                  ? "text-glow__orange"
                  : "text-neutral-600 hover:text-neutral-300"
              }`}
            >
              <i className={item.icon}></i>
            </Link>
          ) : (
            <Link
              key={item.name}
              href={item.href}
              className={[
                "group flex items-center gap-3 border-l-2 py-2.5 pl-3 pr-2 text-xs uppercase tracking-widest transition-all",
                isActive(item.href)
                  ? "border-orange-500 bg-orange-900/10 text-glow__orange"
                  : "border-transparent text-neutral-500 hover:border-orange-900/40 hover:bg-orange-900/5 hover:text-neutral-200",
              ].join(" ")}
              aria-current={isActive(item.href) ? "page" : undefined}
            >
              <i
                className={[
                  item.icon,
                  "text-base transition-colors",
                  isActive(item.href) ? "text-orange-400" : "text-neutral-700 group-hover:text-neutral-500",
                ].join(" ")}
              ></i>
              <span>{item.name}</span>
              {isActive(item.href) && (
                <span className="ml-auto text-orange-500/60">▶</span>
              )}
            </Link>
          ),
        )}
      </nav>
    </div>
  );
};

export default SidebarNav;
