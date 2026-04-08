import type { Metadata, ResolvingMetadata } from "next";
import { settings } from "@/core/config";
import Panel from "@/components/panel";
import GalaxyMapCanvas from "./components/galaxy-map-canvas";

interface Props {
  params: Record<string, never>;
  searchParams: { [key: string]: string | string[] | undefined };
}

export async function generateMetadata(
  _props: Props,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  return {
    title: `Galaxy Map | ${(await parent).title?.absolute}`,
    openGraph: {
      ...(await parent).openGraph,
      url: `${settings.app.url}/galaxy-map`,
      title: `Galaxy Map | ${(await parent).title?.absolute}`,
      description: `Interactive 3D map of all known star systems in the Elite: Dangerous galaxy.`,
    },
    description: `Interactive 3D map of all known star systems in the Elite: Dangerous galaxy.`,
  };
}

export default function Page() {
  return (
    <>
      {/* ── Navigation header bar ── */}
      <Panel className="mb-5 px-4 py-3 md:px-6 md:py-4">
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs uppercase tracking-widest text-neutral-600">
          <div className="flex items-center gap-3">
            <span>MODULE:CARTOGRAPHIC</span>
            <span className="hidden text-neutral-800 sm:inline">■</span>
            <span className="hidden sm:inline">DISPLAY:GALAXY-3D</span>
            <span className="hidden text-neutral-800 md:inline">■</span>
            <span className="hidden md:inline">COORDINATES:STELLAR-FORGE</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="fx-dot-orange h-1.5 w-1.5"></span>
            <span className="fx-cursor">HOLOGRAPHIC: ACTIVE</span>
          </div>
        </div>
      </Panel>

      {/* ── Galaxy map panel ── */}
      <Panel className="overflow-hidden">
        <div className="flex items-center justify-between border-b border-orange-900/20 px-4 py-3 md:px-5 md:py-4">
          <div className="flex items-center gap-3">
            <i className="icarus-terminal-star text-glow__orange" style={{ fontSize: "1.25rem" }}></i>
            <div>
              <h2 className="text-glow__orange font-bold uppercase tracking-wide">
                Galaxy Map
              </h2>
              <p className="text-xs uppercase tracking-wider text-neutral-500">
                Known Systems · Stellar Forge Coordinates
              </p>
            </div>
          </div>
          <div className="hidden items-center gap-3 text-xs uppercase tracking-widest text-neutral-700 md:flex">
            <span>id64 · Decoded</span>
            <span className="text-neutral-800">■</span>
            <span>Sol = Origin</span>
          </div>
        </div>

        <GalaxyMapCanvas />
      </Panel>
    </>
  );
}
