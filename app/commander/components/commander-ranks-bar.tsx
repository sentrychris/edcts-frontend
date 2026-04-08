import type { FunctionComponent } from "react";
import type { CAPIRank } from "@/core/interfaces/CAPIProfile";
import { getRankLabel, getRankProgress } from "../lib/capi-ranks";
import Panel from "@/components/panel";
import SectionHeader from "@/components/section-header";

interface Props {
  rank: CAPIRank;
}

interface RankTile {
  key: keyof CAPIRank;
  label: string;
  icon: string;
}

const tiles: RankTile[] = [
  { key: "combat", label: "Combat", icon: "icarus-terminal-target" },
  { key: "trade", label: "Trade", icon: "icarus-terminal-credits" },
  { key: "explore", label: "Exploration", icon: "icarus-terminal-route" },
  { key: "cqc", label: "CQC", icon: "icarus-terminal-target" },
  { key: "empire", label: "Empire", icon: "icarus-terminal-shield" },
  { key: "federation", label: "Federation", icon: "icarus-terminal-shield" },
  { key: "soldier", label: "Mercenary", icon: "icarus-terminal-target" },
  { key: "exobiologist", label: "Exobiology", icon: "icarus-terminal-planet" },
];

const CommanderRanksBar: FunctionComponent<Props> = ({ rank }) => {
  return (
    <Panel className="p-5">
      <SectionHeader icon="icarus-terminal-route" title="Pilot Ratings" className="mb-4" />
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-8">
        {tiles.map(({ key, label, icon }) => {
          const value = rank[key];
          const progress = getRankProgress(key, value);
          const rankLabel = getRankLabel(key, value);

          return (
            <div
              key={key}
              className="flex flex-col border border-orange-900/20 bg-black/40 p-3"
            >
              {/* Icon + category */}
              <div className="mb-2 flex items-center gap-1.5 text-[0.55rem] uppercase tracking-widest text-neutral-700">
                <i className={`${icon} text-orange-500/30`}></i>
                <span>{label}</span>
              </div>

              {/* Rank name */}
              <p className="mb-2 flex-1 text-[0.65rem] font-bold uppercase tracking-wide text-orange-400/80">
                {rankLabel}
              </p>

              {/* Progress bar */}
              <div className="h-px w-full bg-neutral-900">
                <div
                  className="h-px bg-orange-500/50 transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="mt-1 text-right text-[0.5rem] uppercase tracking-widest text-neutral-800">
                {progress}%
              </p>
            </div>
          );
        })}
      </div>
    </Panel>
  );
};

export default CommanderRanksBar;
