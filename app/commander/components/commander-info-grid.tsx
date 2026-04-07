import type { FunctionComponent } from "react";
import type { CAPIProfile } from "@/core/interfaces/CAPIProfile";
import Panel from "@/components/panel";
import SectionHeader from "@/components/section-header";

interface Props {
  profile: CAPIProfile;
}

const CommanderInfoGrid: FunctionComponent<Props> = ({ profile }) => {
  const { commander, lastSystem, squadron } = profile;

  return (
    <Panel className="p-5">
      <SectionHeader icon="icarus-terminal-route" title="Commander Data" className="mb-4" />

      <div className="space-y-4">
        {/* Credits */}
        <div className="border border-orange-900/20 bg-black/40 p-3">
          <p className="mb-1 text-[0.55rem] uppercase tracking-widest text-neutral-700">Credits Balance</p>
          <p className="text-sm font-bold uppercase tracking-wide text-orange-400/80">
            {commander.credits.toLocaleString()} CR
          </p>
        </div>

        {/* Last system */}
        <div className="border border-orange-900/20 bg-black/40 p-3">
          <p className="mb-1 text-[0.55rem] uppercase tracking-widest text-neutral-700">Last Known System</p>
          <p className="text-sm font-bold uppercase tracking-wide text-orange-400/80">
            {lastSystem.name}
          </p>
        </div>

        {/* Capabilities */}
        <div className="border border-orange-900/20 bg-black/40 p-3">
          <p className="mb-2 text-[0.55rem] uppercase tracking-widest text-neutral-700">DLC Access</p>
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-[0.6rem] uppercase tracking-widest">
              <span className="text-neutral-600">Horizons</span>
              <span className={commander.capabilities.Horizons ? "text-green-400/70" : "text-neutral-800"}>
                {commander.capabilities.Horizons ? "Active" : "None"}
              </span>
            </div>
            <div className="h-px w-full bg-neutral-900"></div>
            <div className="flex items-center justify-between text-[0.6rem] uppercase tracking-widest">
              <span className="text-neutral-600">Odyssey</span>
              <span className={commander.capabilities.Odyssey ? "text-green-400/70" : "text-neutral-800"}>
                {commander.capabilities.Odyssey ? "Active" : "None"}
              </span>
            </div>
          </div>
        </div>

        {/* Squadron */}
        {squadron ? (
          <div className="border border-orange-900/20 bg-black/40 p-3">
            <p className="mb-2 text-[0.55rem] uppercase tracking-widest text-neutral-700">Squadron</p>
            <p className="mb-1 text-[0.7rem] font-bold uppercase tracking-wide text-orange-400/80">
              [{squadron.tag}] {squadron.name}
            </p>
            <div className="flex items-center justify-between text-[0.6rem] uppercase tracking-widest text-neutral-600">
              <span>Rank</span>
              <span>{squadron.rank}</span>
            </div>
          </div>
        ) : (
          <div className="border border-orange-900/20 bg-black/40 p-3">
            <p className="mb-1 text-[0.55rem] uppercase tracking-widest text-neutral-700">Squadron</p>
            <p className="text-[0.6rem] uppercase tracking-widest text-neutral-800">Not enlisted</p>
          </div>
        )}
      </div>
    </Panel>
  );
};

export default CommanderInfoGrid;
