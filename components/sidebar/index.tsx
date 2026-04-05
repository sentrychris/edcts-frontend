import type { FunctionComponent } from "react";
import type { Galnet } from "@/core/interfaces/Galnet";
import SidebarNav from "./sidebar-nav";
import SidebarAudio from "./sidebar-audio";
import SidebarRecentSystems from "./sidebar-recent-systems";

interface Props {
  articles: Pick<Galnet, "title" | "slug" | "audio_file">[];
}

const Sidebar: FunctionComponent<Props> = ({ articles }) => {
  return (
    <aside className="hidden w-64 shrink-0 flex-col overflow-y-auto border-r border-orange-900/40 bg-black/50 backdrop-blur lg:flex xl:w-72">

      {/* ── Header ── */}
      <div className="flex items-center gap-3 border-b border-orange-900/40 px-4 py-4">

        <i className="icarus-terminal-logo text-glow__orange text-2xl"></i>
        <div className="min-w-0">
          <p className="text-glow__orange text-xs font-bold uppercase tracking-widest">ED:CS Terminal</p>
          <p className="truncate text-xs uppercase tracking-wider text-neutral-600">Cartographic Intelligence</p>
        </div>

        {/* Status dot — top right */}
        <div className="ml-auto flex shrink-0 items-center gap-1.5 text-neutral-700" style={{ fontSize: "0.6rem" }}>
          <span className="fx-dot-green h-1.5 w-1.5"></span>
          <span className="uppercase tracking-widest">Online</span>
        </div>
      </div>

      {/* ── Navigation ── */}
      <SidebarNav />

      {/* ── Galnet Audio Player ── */}
      <SidebarAudio articles={articles} />

      {/* ── Recently Visited Systems ── */}
      <SidebarRecentSystems />

      {/* ── Footer rule ── */}
      <div className="mt-auto border-t border-orange-900/20 px-4 py-3">
        <div className="flex items-center gap-2 text-neutral-800" style={{ fontSize: "0.6rem" }}>
          <i className="icarus-terminal-route text-orange-500/20"></i>
          <span className="uppercase tracking-widest">SYS:EDCS-001 ■ BUILD:STABLE</span>
        </div>
      </div>

    </aside>
  );
};

export default Sidebar;
