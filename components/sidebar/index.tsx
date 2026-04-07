"use client";

import { type FunctionComponent, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import type { Galnet } from "@/core/interfaces/Galnet";
import SidebarNav from "./sidebar-nav";
import SidebarAudio from "./sidebar-audio";
import SidebarRecentSystems from "./sidebar-recent-systems";
import SettingsModal from "@/components/settings-modal";

interface Props {
  articles: Pick<Galnet, "title" | "slug" | "audio_file">[];
}

const STORAGE_KEY = "edcts_sidebar_collapsed";

const Sidebar: FunctionComponent<Props> = ({ articles }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

  useEffect(() => {
    if (localStorage.getItem(STORAGE_KEY) === "true") {
      setCollapsed(true);
    }
  }, []);

  const toggle = () => {
    setCollapsed((prev) => {
      localStorage.setItem(STORAGE_KEY, String(!prev));
      return !prev;
    });
  };

  return (
    <aside
      className={`hidden shrink-0 flex-col overflow-x-hidden overflow-y-auto border-r border-orange-900/40 bg-black/50 backdrop-blur transition-[width] duration-200 lg:flex ${
        collapsed ? "w-14" : "w-64 xl:w-80"
      }`}
    >
      {/* ── Header ── */}
      <div className="flex shrink-0 items-center gap-3 border-b border-orange-900/40 px-4 py-4">
        <i className="icarus-terminal-logo text-glow__orange shrink-0 text-2xl"></i>

        {!collapsed && (
          <>
            <div className="min-w-0 flex-1">
              <p className="text-glow__orange text-xs font-bold uppercase tracking-widest">ED:CS Terminal</p>
              <p className="truncate text-xs uppercase tracking-wider text-neutral-600">Made by Chris Korovin</p>
            </div>
            <div className="ml-auto flex shrink-0 items-center gap-1.5 text-neutral-700" style={{ fontSize: "0.6rem" }}>
              <span className="fx-dot-green h-1.5 w-1.5"></span>
              <span className="uppercase tracking-widest">Online</span>
            </div>
          </>
        )}
      </div>

      {/* ── Navigation ── */}
      <SidebarNav collapsed={collapsed} />

      {/* ── Galnet Audio + Recent Systems (hidden when collapsed) ── */}
      {!collapsed && (
        <>
          <SidebarAudio articles={articles} />
          <SidebarRecentSystems />
        </>
      )}

      {/* ── Footer / collapse toggle ── */}
      <div className="mt-auto shrink-0 border-t border-orange-900/20 px-3 py-3">
        {collapsed ? (
          <div className="flex flex-col items-center gap-2">
            <button
              onClick={() => setSettingsOpen(true)}
              className="flex w-full items-center justify-center py-1 text-neutral-700 transition-colors hover:text-orange-400"
              aria-label="Open settings"
              title="Settings"
            >
              <i className="icarus-terminal-settings text-sm"></i>
            </button>
            <button
              onClick={toggle}
              className="flex w-full items-center justify-center py-1 text-neutral-700 transition-colors hover:text-orange-400"
              aria-label="Expand sidebar"
              title="Expand sidebar"
            >
              <i className="icarus-terminal-chevron-right text-sm"></i>
            </button>
          </div>
        ) : (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-neutral-800" style={{ fontSize: "0.6rem" }}>
              <i className="icarus-terminal-route text-orange-500/20"></i>
              <span className="uppercase tracking-widest">SYS:EDCS-001 ■ BUILD:STABLE</span>
            </div>
            <div className="ml-3 flex shrink-0 items-center gap-2">
              <button
                onClick={() => setSettingsOpen(true)}
                className="text-neutral-700 transition-colors hover:text-orange-400"
                aria-label="Open settings"
                title="Settings"
              >
                <i className="icarus-terminal-settings text-sm"></i>
              </button>
              <button
                onClick={toggle}
                className="text-neutral-700 transition-colors hover:text-orange-400"
                aria-label="Collapse sidebar"
                title="Collapse sidebar"
              >
                <i className="icarus-terminal-chevron-left text-sm"></i>
              </button>
            </div>
          </div>
        )}
      </div>

      {settingsOpen && createPortal(
        <SettingsModal onClose={() => setSettingsOpen(false)} />,
        document.body,
      )}
    </aside>
  );
};

export default Sidebar;
