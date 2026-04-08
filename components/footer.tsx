import type { FunctionComponent } from "react";
import Link from "next/link";

const statusReadouts = [
  { icon: "icarus-terminal-shield", label: "CMDR Verified", color: "bg-green-400", pulse: false },
  { icon: "icarus-terminal-planet-life", label: "Life Support: Nominal", color: "bg-green-400", pulse: false },
  { icon: "icarus-terminal-route", label: "Nav: Online", color: "bg-green-400", pulse: false },
  { icon: "icarus-terminal-notifications", label: "Galnet: Live", color: "bg-orange-500", pulse: true },
  { icon: "icarus-terminal-sync", label: "EDDN: Sync", color: "bg-green-400", pulse: false },
  { icon: "icarus-terminal-system-orbits", label: "Cartography: Active", color: "bg-green-400", pulse: false },
];

const Footer: FunctionComponent = () => {
  return (
    <footer className="border-t border-orange-900/20 bg-transparent backdrop-blur backdrop-filter mt-6">

      {/* ── Ship Status Readouts ── */}
      <div className="scrollbar-hide lg:px-18 flex items-center gap-6 overflow-x-auto border-b border-orange-900/20 px-6 py-3 md:px-12">
        {statusReadouts.map(({ icon, label, color }) => (
          <div key={label} className="flex shrink-0 items-center gap-2 text-xs uppercase tracking-widest text-neutral-500">
            <span className={`h-1.5 w-1.5 ${color === "bg-orange-500" ? "fx-dot-orange" : "fx-dot-green"}`}></span>
            <i className={`${icon} text-neutral-600`}></i>
            <span>{label}</span>
          </div>
        ))}
      </div>

      {/* ── Footer Body ── */}
      <div className="grid grid-cols-3 gap-8 px-6 py-3">

        {/* Left — System Identifier */}
        <div className="flex flex-col gap-3 text-[0.65em]">
          <div className="flex items-center gap-3">
            <i className="icarus-terminal-logo text-glow__orange text-2xl"></i>
            <div>
              <p className="text-glow__orange font-bold uppercase tracking-widest">ED:CS Terminal</p>
              <p className="uppercase tracking-wider text-neutral-600">Cartographic Intelligence System</p>
            </div>
          </div>
          <div className="flex items-center gap-3 uppercase tracking-widest text-neutral-700">
            <span>SYS:EDCS-001</span>
            <span>■</span>
            <span>BUILD:STABLE</span>
          </div>
        </div>

        {/* Centre — Legal */}
        <div className="flex flex-col gap-3 text-[0.65em] uppercase tracking-widest items-center">
          <div className="flex items-center gap-4">
            <Link
              href="/legal/privacy-policy"
              className="text-glow__orange transition-colors hover:text-orange-300"
            >
              Privacy Policy
            </Link>
            <span className="text-neutral-700">■</span>
            <Link
              href="/legal/privacy-policy"
              className="text-glow__orange transition-colors hover:text-orange-300"
            >
              Terms & Conditions
            </Link>
          </div>
          <p className="text-neutral-600 text-center">
            <span className="text-orange-500/60">Elite: Dangerous</span> © 2012–2026 Frontier Developments plc.
          </p>
          <p className="text-neutral-700 text-center">
            This website is not officially affiliated with or endorsed by Frontier Developments.
          </p>
        </div>

        {/* Right — Attribution + Data Sources */}
        <div className="flex flex-col gap-3 text-[0.65em] uppercase tracking-widest items-end">
          <div className="flex items-center gap-1 text-neutral-500">
            <i className="icarus-terminal-shield text-glow__orange"></i>
            <span>Made by</span>
            <a
              href="https://versyx.dev"
              className="text-glow__orange"
            >
              Chris Korovin
            </a>
          </div>
          <div className="flex flex-wrap gap-2 text-neutral-700">
            {["EDDN", "EDSM", "SPANSH", "INARA"].map((source, i, arr) => (
              <span key={source} className="flex items-center gap-2">
                <span className="text-orange-500/40">{source}</span>
                {i < arr.length - 1 && <span>■</span>}
              </span>
            ))}
          </div>
          <p className="text-neutral-700">Data sourced from community networks.</p>
        </div>

      </div>

      {/* ── Hull Integrity Bar ── */}
      <div className="lg:px-18 flex items-center gap-4 border-t border-orange-900/20 px-6 py-2 text-xs uppercase tracking-widest text-neutral-700 md:px-12">
        <span className="h-px flex-1 bg-neutral-900"></span>
        <span className="flex items-center gap-2">
          <i className="icarus-terminal-route text-orange-500/30"></i>
          FRONTIER DEVELOPMENTS ── UNIVERSAL CARTOGRAPHICS ── GALNET COMMUNICATIONS
        </span>
        <span className="h-px flex-1 bg-neutral-900"></span>
      </div>

    </footer>
  );
};

export default Footer;
