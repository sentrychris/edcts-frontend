"use client";

import { useState } from "react";
import Panel from "@/components/panel";
import SectionHeader from "@/components/section-header";
import { settings } from "@/core/config";

interface Props {
  accessToken: string;
  hasInaraKey: boolean;
  hasEdsmKey: boolean;
}

type KeyId = "inara_api_key" | "edsm_api_key";

interface KeyState {
  hasKey: boolean;
  unlocked: boolean;
  value: string;
  saving: boolean;
  saved: boolean;
  error: string | null;
}

function makeKeyState(hasKey: boolean): KeyState {
  return { hasKey, unlocked: false, value: "", saving: false, saved: false, error: null };
}

function KeyRow({
  label,
  state,
  onUnlock,
  onCancel,
  onSave,
  onChange,
}: {
  label: string;
  state: KeyState;
  onUnlock: () => void;
  onCancel: () => void;
  onSave: () => void;
  onChange: (v: string) => void;
}) {
  return (
    <div className="border border-orange-900/20 bg-black/40 p-3">
      <div className="mb-2 flex items-center justify-between">
        <p className="text-[0.75rem] uppercase tracking-widest text-neutral-700">{label}</p>
        {!state.unlocked && (
          <button
            onClick={onUnlock}
            className="flex items-center gap-1 text-[0.75rem] uppercase tracking-widest text-neutral-700 transition-colors hover:text-orange-400"
          >
            <i className={`${state.hasKey ? "icarus-terminal-lock" : "icarus-terminal-edit"} text-xs`} />
            <span>{state.hasKey ? "Edit" : "Set"}</span>
          </button>
        )}
      </div>

      {state.unlocked ? (
        <div className="space-y-2">
          <input
            type="text"
            autoFocus
            disabled={state.saving}
            value={state.value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Enter API key..."
            className="h-[33px] w-full border border-orange-900/20 bg-transparent px-3 text-xs tracking-wider text-neutral-200 placeholder-neutral-600 outline-none transition-colors focus:border-orange-500/60"
          />
          {state.error && (
            <p className="text-[0.7rem] uppercase tracking-widest text-red-400">{state.error}</p>
          )}
          <div className="flex gap-2">
            <button
              onClick={onSave}
              disabled={state.saving}
              className="fx-btn-sweep h-[29px] flex-1 border border-orange-900/40 text-[0.7rem] uppercase tracking-widest text-orange-400/70 transition-colors hover:border-orange-500/60 hover:text-orange-300 disabled:pointer-events-none disabled:opacity-40"
            >
              {state.saving ? "Saving..." : "Save"}
            </button>
            <button
              onClick={onCancel}
              disabled={state.saving}
              className="h-[29px] border border-orange-900/20 px-3 text-[0.7rem] uppercase tracking-widest text-neutral-600 transition-colors hover:text-neutral-400 disabled:pointer-events-none disabled:opacity-40"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-2">
          {state.hasKey ? (
            <>
              <i className="icarus-terminal-lock text-xs text-orange-500/30" />
              <span className="font-mono text-sm tracking-widest text-neutral-700">
                ••••••••••••••••
              </span>
            </>
          ) : (
            <span className="text-[0.75rem] uppercase tracking-widest text-neutral-800">
              Not configured
            </span>
          )}
          {state.saved && (
            <span className="ml-auto text-[0.75rem] uppercase tracking-widest text-green-400/60">
              Saved
            </span>
          )}
        </div>
      )}
    </div>
  );
}

export default function CommanderApiKeys({ accessToken, hasInaraKey, hasEdsmKey }: Props) {
  const [inara, setInara] = useState<KeyState>(() => makeKeyState(hasInaraKey));
  const [edsm, setEdsm] = useState<KeyState>(() => makeKeyState(hasEdsmKey));

  const patch = (setter: typeof setInara, update: Partial<KeyState>) =>
    setter((prev) => ({ ...prev, ...update }));

  const unlock = (setter: typeof setInara) =>
    patch(setter, { unlocked: true, value: "", error: null, saved: false });

  const cancel = (setter: typeof setInara) =>
    patch(setter, { unlocked: false, value: "", error: null });

  const save = async (id: KeyId, state: KeyState, setter: typeof setInara) => {
    patch(setter, { saving: true, error: null });

    try {
      const response = await fetch(`${settings.api.url}/commander`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ [id]: state.value || null }),
      });

      if (!response.ok) {
        throw new Error();
      }

      patch(setter, {
        saving: false,
        saved: true,
        unlocked: false,
        hasKey: !!state.value,
        value: "",
      });
    } catch {
      patch(setter, { saving: false, error: "Update failed. Please try again." });
    }
  };

  return (
    <Panel className="p-5">
      <SectionHeader icon="icarus-terminal-settings" title="Third-Party Integrations" className="mb-4" />

      <div className="space-y-4">
        <KeyRow
          label="Inara API Key"
          state={inara}
          onUnlock={() => unlock(setInara)}
          onCancel={() => cancel(setInara)}
          onSave={() => save("inara_api_key", inara, setInara)}
          onChange={(v) => patch(setInara, { value: v })}
        />
        <KeyRow
          label="EDSM API Key"
          state={edsm}
          onUnlock={() => unlock(setEdsm)}
          onCancel={() => cancel(setEdsm)}
          onSave={() => save("edsm_api_key", edsm, setEdsm)}
          onChange={(v) => patch(setEdsm, { value: v })}
        />
      </div>
    </Panel>
  );
}
