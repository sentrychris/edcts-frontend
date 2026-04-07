import type { Galnet } from "@/core/interfaces/Galnet";
import type { System } from "@/core/interfaces/System";
import { getCollection } from "@/core/api";
import GalnetList from "./galnet/components/galnet-sidebar";
import SystemsTable from "./systems/components/systems-table";
import SystemsStatisticsBar from "./systems/components/systems-statistics-bar";

export default async function Home() {
  const news = await getCollection<Galnet>("galnet/news", {
    params: {
      limit: 100,
    },
  });

  const systems = await getCollection<System>("systems", {
    params: {
      withInformation: 1,
    },
  });

  return (
    <>
      {/* ── System Masthead ── */}
      <div className="fx-border-breathe relative mb-3 border border-orange-900/40 bg-black/50 backdrop-blur backdrop-filter px-8 py-8">
        {/* Corner bracket accents */}
        <span className="absolute -left-px -top-px h-5 w-5 border-l-2 border-t-2 border-orange-500" />
        <span className="absolute -right-px -top-px h-5 w-5 border-r-2 border-t-2 border-orange-500" />
        <span className="absolute -bottom-px -left-px h-5 w-5 border-b-2 border-l-2 border-orange-500" />
        <span className="absolute -bottom-px -right-px h-5 w-5 border-b-2 border-r-2 border-orange-500" />

        {/* Status row */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-2 text-xs uppercase tracking-widest text-neutral-600">
          <div className="flex items-center gap-4">
            <span>SYS:EDCS-001</span>
            <span className="text-neutral-800">■</span>
            <span>SECTOR:CORE SYSTEMS</span>
            <span className="text-neutral-800">■</span>
            <span>CLASS:UNRESTRICTED</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="fx-dot-green h-1.5 w-1.5"></span>
            <span>NETWORK: OPERATIONAL</span>
          </div>
        </div>

        {/* Main title */}
        <div className="text-center">
          <p className="mb-3 text-xs uppercase tracking-[0.5em] text-neutral-500">
            frontier developments ── universal cartographics
          </p>
          <h1 className="text-glow__orange fx-glitch fx-holo-heading mb-3 text-3xl font-bold uppercase tracking-[0.2em] md:text-5xl">
            ED:CS Terminal
          </h1>
          <p className="text-xs uppercase tracking-[0.35em] text-neutral-500">
            cartographic data ── galnet communications ── system intelligence
          </p>
        </div>

        {/* Footer rule */}
        <div className="mt-6 flex items-center gap-6 border-t border-orange-900/20  pt-4 text-xs uppercase tracking-widest text-neutral-700">
          <span className="h-px flex-1 bg-neutral-800"></span>
          <span className="flex items-center gap-2">
            <i className="icarus-terminal-commander"></i>
            CMDR ACCESS VERIFIED
          </span>
          <span className="h-px flex-1 bg-neutral-800"></span>
        </div>
      </div>

      {/* ── Content Grid ── */}
      <div className="grid grid-cols-1 gap-x-5 md:grid-cols-2 lg:grid-cols-3">
        {/* ── Galnet Panel ── */}
        <div className="col-span-1 pt-3">
          <GalnetList articles={news} />
        </div>

        {/* ── Systems Panel ── */}
        <div className="col-span-1 hidden pt-3 md:block lg:col-span-2">
          <SystemsStatisticsBar className="fx-fade-in" callInterval={10000} flushCache={0} />
          <SystemsTable systems={systems} />
        </div>
      </div>
    </>
  );
}
