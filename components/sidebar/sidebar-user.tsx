"use client";

import type { FunctionComponent } from "react";
import type { SessionUser } from "@/core/interfaces/Auth";
import type { AuthorizationServerInformation } from "@/core/interfaces/Auth";
import { getResource } from "@/core/api";
import { signOut } from "next-auth/react";
import Link from "next/link";

interface Props {
  user: SessionUser | null;
  collapsed: boolean;
}

const SidebarUser: FunctionComponent<Props> = ({ user, collapsed }) => {
  const login = async () => {
    const { data } = await getResource<AuthorizationServerInformation>("auth/frontier/login");
    window.location.href = data.authorization_url;
  };

  const logout = async () => {
    document.cookie = "cmdr_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    await signOut({ callbackUrl: "/" });
  };

  /* ── Collapsed state ── */
  if (collapsed) {
    return (
      <div className="flex flex-col items-center border-b border-orange-900/20 py-3">
        {user ? (
          <Link
            href="/commander"
            className="flex w-full items-center justify-center py-1 text-orange-500/60 transition-colors hover:text-orange-400"
            title={`CMDR ${user.commander?.name ?? user.name}`}
            aria-label="View commander"
          >
            <i className="icarus-terminal-shield text-base"></i>
          </Link>
        ) : (
          <button
            onClick={login}
            className="flex w-full items-center justify-center py-1 text-neutral-700 transition-colors hover:text-orange-400"
            title="Login with Frontier"
            aria-label="Login with Frontier"
          >
            <i className="icarus-terminal-shield text-base"></i>
          </button>
        )}
      </div>
    );
  }

  /* ── Expanded — authenticated ── */
  if (user) {
    return (
      <div className="shrink-0 border-b border-orange-900/20 px-4 py-4">
        {/* Header row */}
        <div className="mb-3 flex items-center gap-2 text-xs uppercase tracking-widest text-neutral-600">
          <i className="icarus-terminal-shield text-orange-500/50 text-sm"></i>
          <span>Commander Identified</span>
          <span className="ml-auto flex items-center gap-1.5">
            <span className="fx-dot-green h-1.5 w-1.5"></span>
            <span className="text-[0.6rem]">Auth</span>
          </span>
        </div>

        {/* CMDR name */}
        <p className="text-glow__orange mb-3 text-sm font-bold uppercase tracking-widest">
          CMDR {user.commander?.name ?? user.name}
        </p>

        {/* Status grid */}
        <div className="mb-3 grid grid-cols-2 gap-x-3 gap-y-1 text-[0.6rem] uppercase tracking-widest text-neutral-700">
          <span>ID: VERIFIED</span>
          <span>CLASS: PILOT</span>
          <span>NET: FRONTIER</span>
          <span>STATUS: ACTIVE</span>
        </div>

        {/* View CMDR / Logout buttons */}
        <div className="flex gap-2">
          <Link
            href="/commander"
            className="fx-btn-sweep flex flex-1 items-center justify-center gap-2 border border-orange-900/40 py-2 text-xs font-bold uppercase tracking-widest text-orange-500/70 transition-colors hover:border-orange-500/60 hover:text-orange-400"
          >
            <i className="icarus-terminal-shield text-xs"></i>
            View CMDR
          </Link>
          <button
            onClick={logout}
            className="fx-btn-sweep fx-btn-sweep--danger border border-red-900/40 px-3 py-2 text-xs font-bold uppercase tracking-widest text-red-900/60 transition-colors hover:border-red-500/60 hover:text-red-400"
            title="Logout"
          >
            <i className="icarus-terminal-warning text-xs"></i>
          </button>
        </div>
      </div>
    );
  }

  /* ── Expanded — unauthenticated ── */
  return (
    <div className="shrink-0 border-b border-orange-900/20 px-4 py-4">
      {/* Header row */}
      <div className="mb-3 flex items-center gap-2 text-xs uppercase tracking-widest text-neutral-600">
        <i className="icarus-terminal-shield text-orange-500/20 text-sm"></i>
        <span>Commander</span>
        <span className="ml-auto flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-neutral-800"></span>
          <span className="text-[0.6rem]">Offline</span>
        </span>
      </div>

      {/* Placeholder bars */}
      <div className="mb-3 space-y-1.5">
        <div className="h-px w-full bg-neutral-900"></div>
        <div className="flex items-center gap-2 text-[0.6rem] uppercase tracking-widest text-neutral-800">
          <i className="icarus-terminal-route text-orange-500/10"></i>
          <span>No pilot profile linked</span>
        </div>
        <div className="h-px w-3/4 bg-neutral-900"></div>
      </div>

      {/* Login button */}
      <button
        onClick={login}
        className="fx-btn-sweep flex w-full items-center justify-center gap-2 border border-orange-900/40 py-2 text-xs font-bold uppercase tracking-widest text-neutral-500 transition-colors hover:border-orange-500/40 hover:text-orange-400"
      >
        <i className="icarus-terminal-planet text-xs"></i>
        Login with Frontier
      </button>
    </div>
  );
};

export default SidebarUser;
