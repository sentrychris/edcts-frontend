"use client";

import { type FunctionComponent, useState } from "react";
import { createPortal } from "react-dom";
import type { SessionUser } from "@/core/interfaces/Auth";
import type { AuthorizationServerInformation } from "@/core/interfaces/Auth";
import { getResource } from "@/core/api";
import { usePathname } from "next/navigation";
import Link from "next/link";
import SettingsModal from "@/components/settings-modal";

interface Props {
  user: SessionUser | null;
}

const navItems = [
  { name: "Home", href: "/", icon: "icarus-terminal-ship" },
  { name: "Star Systems", href: "/systems", icon: "icarus-terminal-system-orbits" },
  { name: "Galaxy Map", href: "/galaxy-map", icon: "icarus-terminal-star" },
  { name: "Route Plotter", href: "/route-plotter", icon: "icarus-terminal-route" },
  { name: "Galnet News", href: "/galnet", icon: "icarus-terminal-notifications" },
];

const MobileNav: FunctionComponent<Props> = ({ user }) => {
  const [open, setOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const pathname = usePathname();

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  const login = async () => {
    const { data } = await getResource<AuthorizationServerInformation>("auth/frontier/login");
    window.location.href = data.authorization_url;
  };

  return (
    <div className="lg:hidden shrink-0 border-b border-orange-900/40 bg-black/50 backdrop-blur backdrop-filter">

      {/* ── Top bar ── */}
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3">
          <i className="icarus-terminal-logo text-glow__orange shrink-0 text-xl"></i>
          <div>
            <p className="text-glow__orange text-xs font-bold uppercase tracking-widest">ED:CS Terminal</p>
            <div className="flex items-center gap-1.5 text-neutral-700" style={{ fontSize: "0.6rem" }}>
              <span className="fx-dot-green h-1.5 w-1.5"></span>
              <span className="uppercase tracking-widest">Online</span>
            </div>
          </div>
        </div>

        <button
          onClick={() => setOpen((prev) => !prev)}
          className="flex items-center gap-2 border border-orange-900/30 px-3 py-1.5 text-xs uppercase tracking-widest text-neutral-500 transition-colors hover:border-orange-500/40 hover:text-orange-400"
          aria-label={open ? "Close navigation" : "Open navigation"}
          aria-expanded={open}
        >
          <span>{open ? "Close" : "Menu"}</span>
          <i className={`icarus-terminal-chevron-${open ? "up" : "down"} text-sm`}></i>
        </button>
      </div>

      {/* ── Expandable panel ── */}
      {open && (
        <div className="border-t border-orange-900/20 px-4 pb-4 pt-2">

          {/* Nav label */}
          <div className="mb-2 flex items-center gap-2 pb-2 text-xs uppercase tracking-widest text-neutral-600">
            <i className="icarus-terminal-route text-orange-500/50"></i>
            <span>Navigation</span>
          </div>

          {/* Nav links */}
          <nav className="mb-4 flex flex-col">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setOpen(false)}
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
            ))}
          </nav>

          {/* Commander / Login */}
          {user ? (
            <Link
              href="/commander"
              onClick={() => setOpen(false)}
              className="fx-btn-sweep mb-2 flex w-full items-center justify-center gap-2 border border-orange-900/40 py-2 text-xs font-bold uppercase tracking-widest text-orange-500/70 transition-colors hover:border-orange-500/60 hover:text-orange-400"
            >
              <i className="icarus-terminal-shield text-xs"></i>
              CMDR {user.commander?.name ?? user.name}
            </Link>
          ) : (
            <button
              onClick={async () => { await login(); setOpen(false); }}
              className="fx-btn-sweep mb-2 flex w-full items-center justify-center gap-2 border border-orange-900/40 py-2 text-xs font-bold uppercase tracking-widest text-neutral-500 transition-colors hover:border-orange-500/40 hover:text-orange-400"
            >
              <i className="icarus-terminal-planet text-xs"></i>
              Login with Frontier
            </button>
          )}

          {/* Settings */}
          <button
            onClick={() => { setSettingsOpen(true); setOpen(false); }}
            className="fx-btn-sweep flex w-full items-center justify-center gap-2 border border-orange-900/40 py-2 text-xs font-bold uppercase tracking-widest text-neutral-500 transition-colors hover:border-orange-500/40 hover:text-orange-400"
          >
            <i className="icarus-terminal-settings text-xs"></i>
            Interface Settings
          </button>
        </div>
      )}

      {settingsOpen && createPortal(
        <SettingsModal onClose={() => setSettingsOpen(false)} />,
        document.body,
      )}
    </div>
  );
};

export default MobileNav;
