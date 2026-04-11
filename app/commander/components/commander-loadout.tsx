import type { FunctionComponent } from "react";
import type { CAPILoadout, CAPILoadoutWeapon } from "@/core/interfaces/CAPIProfile";
import Panel from "@/components/panel";
import SectionHeader from "@/components/section-header";

interface Props {
  loadout: CAPILoadout;
}

/* ── Helpers ─────────────────────────────────────────── */

const DAMAGE_TYPES: Record<string, string> = {
  Plasma:    "Plasma",
  Kinetic:   "Kinetic",
  Laser:     "Laser",
  Thermal:   "Thermal",
  Explosive: "Explosive",
};

const FIRE_MODES: Record<string, string> = {
  FAuto:  "Full Auto",
  SAuto:  "Semi-Auto",
  Burst:  "Burst",
  Single: "Single",
};

function parseSuitType(internalName: string): string {
  if (internalName.includes("Exploration")) return "Exploration";
  if (internalName.includes("Combat"))      return "Combat";
  if (internalName.includes("Utility"))     return "Multi-role";
  return "Suit";
}

function parseWeaponMeta(internalName: string): { damageType: string; fireMode: string } {
  const parts = internalName.split("_");
  const damageType = parts.find((p) => DAMAGE_TYPES[p]) ?? "Unknown";
  const fireMode   = FIRE_MODES[parts[parts.length - 1]] ?? "";
  return { damageType, fireMode };
}

/* ── Sub-components ──────────────────────────────────── */

const WeaponRow: FunctionComponent<{ weapon: CAPILoadoutWeapon; label: string }> = ({ weapon, label }) => {
  const { damageType, fireMode } = parseWeaponMeta(weapon.name);

  return (
    <div className="border border-orange-900/20 bg-black/40 p-3">
      <div className="mb-1 flex items-start gap-2">
        <i className="icarus-terminal-combat mt-0.5 shrink-0 text-xs text-orange-500/30" />
        <div className="min-w-0 flex-1">
          <p className="text-[0.7rem] font-bold uppercase tracking-wide text-orange-400/80 leading-tight">
            {weapon.locName}
          </p>
          <p className="text-[0.65rem] uppercase tracking-widest text-neutral-700">
            {label} · {damageType}{fireMode ? ` · ${fireMode}` : ""}
          </p>
        </div>
      </div>

      {weapon.ammo && (
        <div className="mt-2 flex items-center gap-3 border-t border-orange-900/10 pt-2">
          <span className="text-[0.6rem] uppercase tracking-widest text-neutral-700">Ammo</span>
          <div className="flex items-center gap-1.5 text-[0.6rem] font-bold uppercase tracking-widest text-neutral-500">
            <span>{weapon.ammo.clip}</span>
            <span className="text-neutral-800">/</span>
            <span>{weapon.ammo.hopper}</span>
          </div>
          <span className="text-[0.6rem] uppercase tracking-widest text-neutral-800">clip / reserve</span>
        </div>
      )}
    </div>
  );
};

/* ── Main component ──────────────────────────────────── */

const OXYGEN_MAX = 60_000;

const CommanderLoadout: FunctionComponent<Props> = ({ loadout }) => {
  const { suit, name: loadoutName, slots, state, loadoutSlotId } = loadout;
  const suitType = parseSuitType(suit.name);

  const oxygenPct = Math.round((state.oxygenRemaining / OXYGEN_MAX) * 100);
  const energyPct = Math.round(state.energy * 100);

  const weapons: Array<{ key: string; weapon: CAPILoadoutWeapon; label: string }> = [
    slots.PrimaryWeapon1   && { key: "pw1", weapon: slots.PrimaryWeapon1,   label: "Primary 1" },
    slots.PrimaryWeapon2   && { key: "pw2", weapon: slots.PrimaryWeapon2,   label: "Primary 2" },
    slots.SecondaryWeapon  && { key: "sec", weapon: slots.SecondaryWeapon,  label: "Secondary" },
  ].filter(Boolean) as Array<{ key: string; weapon: CAPILoadoutWeapon; label: string }>;

  return (
    <Panel className="p-5">
      <SectionHeader icon="icarus-terminal-combat" title="Odyssey Loadout" className="mb-4" />

      <div className="space-y-3">

        {/* Suit */}
        <div className="border border-orange-900/20 bg-black/40 p-3">
          <p className="mb-1 text-[0.65rem] uppercase tracking-widest text-neutral-700">Active Suit</p>
          <div className="flex items-start gap-2">
            <i className="icarus-terminal-shield mt-0.5 shrink-0 text-xs text-orange-500/30" />
            <div>
              <p className="text-[0.7rem] font-bold uppercase tracking-wide text-orange-400/80">
                {suit.locName}
              </p>
              <p className="text-[0.65rem] uppercase tracking-widest text-neutral-700">
                {suitType} · Slot {loadoutSlotId} · {loadoutName}
              </p>
            </div>
          </div>
        </div>

        {/* Weapons */}
        {weapons.length > 0 && (
          <div className="space-y-2">
            <p className="text-[0.6rem] uppercase tracking-[0.3em] text-neutral-800">Weapons</p>
            {weapons.map(({ key, weapon, label }) => (
              <WeaponRow key={key} weapon={weapon} label={label} />
            ))}
          </div>
        )}

        {/* Status bars */}
        <div className="border border-orange-900/20 bg-black/40 p-3 space-y-2.5">
          <p className="text-[0.65rem] uppercase tracking-widest text-neutral-700">Suit Status</p>

          {/* Oxygen */}
          <div>
            <div className="mb-1 flex items-center justify-between text-[0.65rem] uppercase tracking-widest">
              <span className="text-neutral-600">Oxygen</span>
              <span className={oxygenPct > 30 ? "text-orange-400/70" : "text-red-400/70"}>
                {oxygenPct}%
              </span>
            </div>
            <div className="h-[2px] w-full bg-orange-900/20">
              <div
                className="h-full bg-orange-500/50 transition-all duration-500"
                style={{ width: `${oxygenPct}%` }}
              />
            </div>
          </div>

          {/* Energy */}
          <div>
            <div className="mb-1 flex items-center justify-between text-[0.65rem] uppercase tracking-widest">
              <span className="text-neutral-600">Energy</span>
              <span className="text-orange-400/70">{energyPct}%</span>
            </div>
            <div className="h-[2px] w-full bg-orange-900/20">
              <div
                className="h-full bg-orange-500/50 transition-all duration-500"
                style={{ width: `${energyPct}%` }}
              />
            </div>
          </div>
        </div>

      </div>
    </Panel>
  );
};

export default CommanderLoadout;
