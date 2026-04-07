import type { Metadata, ResolvingMetadata } from "next";
import type { CAPIProfile } from "@/core/interfaces/CAPIProfile";
import { redirect } from "next/navigation";
import { settings } from "@/core/config";
import { auth } from "@/core/auth";
import Panel from "@/components/panel";
import CommanderHero from "./components/commander-hero";
import CommanderRanksBar from "./components/commander-ranks-bar";
import CommanderFleet from "./components/commander-fleet";
import CommanderInfoGrid from "./components/commander-info-grid";

export async function generateMetadata(
  _props: unknown,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  return {
    title: `Commander Profile | ${(await parent).title?.absolute}`,
    openGraph: {
      ...(await parent).openGraph,
      url: `${settings.app.url}/commander`,
      title: `Commander Profile | ${(await parent).title?.absolute}`,
      description: "Your Elite Dangerous commander profile, ranks, fleet, and status.",
    },
    description: "Your Elite Dangerous commander profile, ranks, fleet, and status.",
  };
}

async function getCAPIProfile(accessToken: string): Promise<CAPIProfile> {
  const response = await fetch(`${settings.api.url}/frontier/capi/profile`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Accept: "application/json",
    },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch CAPI profile");
  }

  const { data } = await response.json();
  return data as CAPIProfile;
}

export default async function Page() {
  const session = await auth();

  if (!session?.user) {
    redirect("/");
  }

  let profile: CAPIProfile | null = null;
  let error: string | null = null;

  try {
    profile = await getCAPIProfile(session.user.accessToken);
  } catch {
    error = "Unable to load commander profile. Please try again later.";
  }

  return (
    <>
      {/* ── Commander Terminal ── */}
      <Panel className="mb-5 px-6 py-4">
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs uppercase tracking-widest text-neutral-600">
          <div className="flex items-center gap-4">
            <span>MODULE:CMDR</span>
            <span className="text-neutral-800">■</span>
            <span>DATABASE:FRONTIER</span>
            <span className="text-neutral-800">■</span>
            <span>CLASS:RESTRICTED</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="fx-dot-orange h-1.5 w-1.5"></span>
            <span className="fx-cursor">CAPI: ACTIVE</span>
          </div>
        </div>
      </Panel>

      {error ? (
        <Panel className="px-6 py-8 text-center">
          <i className="icarus-terminal-warning mb-3 text-2xl text-orange-500/40"></i>
          <p className="text-xs uppercase tracking-widest text-neutral-600">{error}</p>
        </Panel>
      ) : profile ? (
        <div className="space-y-5">
          <CommanderHero profile={profile} />
          <CommanderRanksBar rank={profile.commander.rank} />
          <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">
            <div className="xl:col-span-2">
              <CommanderFleet ships={profile.ships} currentShipId={profile.commander.currentShipId} />
            </div>
            <div>
              <CommanderInfoGrid profile={profile} />
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
