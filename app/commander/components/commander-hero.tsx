import type { FunctionComponent } from "react";
import type { CAPIProfile } from "@/core/interfaces/CAPIProfile";
import Panel from "@/components/panel";
import Heading from "@/components/heading";
import SectionHeader from "@/components/section-header";

interface Props {
  profile: CAPIProfile;
}

const CommanderHero: FunctionComponent<Props> = ({ profile }) => {
  const { commander, ship, lastSystem, squadron } = profile;

  return (
    <Panel className="fx-panel-scan overflow-hidden">
      <div className="flex flex-col gap-6 p-6 md:flex-row md:items-start">

        {/* ── Avatar placeholder ── */}
        <div className="fx-chamfer relative flex h-24 w-24 shrink-0 items-center justify-center border border-orange-900/40 bg-black/60 md:h-32 md:w-32">
          <i className="icarus-terminal-shield text-4xl text-orange-500/30 md:text-5xl"></i>
          <div className="absolute bottom-0 left-0 right-0 border-t border-orange-900/20 py-1 text-center text-[0.65rem] uppercase tracking-widest text-neutral-700">
            NO IMG
          </div>
        </div>

        {/* ── Name + meta ── */}
        <div className="min-w-0 flex-1">
          <Heading
            title={`CMDR ${commander.name}`}
            subtitle="Pilot Federation Registry"
            icon="icarus-terminal-shield"
            iconSize="1.4rem"
            bordered
            className="mb-4 pb-4"
          >
            {squadron && (
              <span className="ml-auto shrink-0 border border-orange-900/40 px-2 py-1 text-[0.6rem] uppercase tracking-widest text-orange-400/70">
                [{squadron.tag}] {squadron.name}
              </span>
            )}
          </Heading>

          {/* ── Status grid ── */}
          <div className="mb-4 grid grid-cols-2 gap-x-6 gap-y-2 text-[0.65rem] uppercase tracking-widest sm:grid-cols-4">
            <div>
              <p className="mb-0.5 text-neutral-700">Status</p>
              <p className={commander.alive ? "text-green-400/70" : "text-red-400/70"}>
                {commander.alive ? "Alive" : "Deceased"}
              </p>
            </div>
            <div>
              <p className="mb-0.5 text-neutral-700">Location</p>
              <p className="text-neutral-400">{commander.docked ? "Docked" : commander.onfoot ? "On Foot" : "In Space"}</p>
            </div>
            <div>
              <p className="mb-0.5 text-neutral-700">Credits</p>
              <p className="text-orange-400/80">{commander.credits.toLocaleString()} CR</p>
            </div>
            <div>
              <p className="mb-0.5 text-neutral-700">Net Worth</p>
              <p className="text-orange-400/60">{commander.credits.toLocaleString()} CR</p>
            </div>
          </div>

          {/* ── Active ship + system ── */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {/* Ship */}
            <div className="border border-orange-900/20 bg-black/40 p-3">
              <SectionHeader icon="icarus-terminal-ship" title="Active Ship" className="mb-2" />
              <p className="text-sm font-bold uppercase tracking-wide text-orange-400/80">
                {ship.name}
              </p>
              {ship.station && (
                <p className="mt-1 text-[0.6rem] uppercase tracking-widest text-neutral-600">
                  <i className="icarus-terminal-station mr-1 text-orange-500/30"></i>
                  {ship.station.name}
                </p>
              )}
              {/* Hull + shield bars */}
              <div className="mt-3 space-y-1.5">
                <div>
                  <div className="mb-0.5 flex items-center justify-between text-[0.65rem] uppercase tracking-widest text-neutral-700">
                    <span>Hull</span>
                    <span>{Math.round(ship.health.hull)}%</span>
                  </div>
                  <div className="h-px w-full bg-neutral-900">
                    <div
                      className="h-px bg-orange-500/50"
                      style={{ width: `${Math.min(100, ship.health.hull)}%` }}
                    />
                  </div>
                </div>
                <div>
                  <div className="mb-0.5 flex items-center justify-between text-[0.65rem] uppercase tracking-widest text-neutral-700">
                    <span>Shield</span>
                    <span>{ship.health.shieldup ? "UP" : "DOWN"}</span>
                  </div>
                  <div className="h-px w-full bg-neutral-900">
                    <div
                      className={`h-px ${ship.health.shieldup ? "bg-sky-500/50" : "bg-neutral-800"}`}
                      style={{ width: ship.health.shieldup ? `${Math.min(100, ship.health.shield * 100)}%` : "0%" }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Current system */}
            <div className="border border-orange-900/20 bg-black/40 p-3">
              <SectionHeader icon="icarus-terminal-route" title="Current System" className="mb-2" />
              <p className="text-sm font-bold uppercase tracking-wide text-orange-400/80">
                {lastSystem.name}
              </p>
              {ship.starsystem && ship.starsystem.name !== lastSystem.name && (
                <p className="mt-1 text-[0.6rem] uppercase tracking-widest text-neutral-600">
                  Ship last seen: {ship.starsystem.name}
                </p>
              )}
              <div className="mt-3 flex items-center gap-2 text-[0.6rem] uppercase tracking-widest text-neutral-700">
                <span className="fx-dot-orange h-1.5 w-1.5"></span>
                <span>Telemetry active</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Panel>
  );
};

export default CommanderHero;
