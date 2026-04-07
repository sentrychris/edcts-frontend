import type { FunctionComponent } from "react";
import Link from "next/link";

const statusReadouts = [
  { icon: "icarus-terminal-commander", label: "CMDR Verified", color: "bg-green-400", pulse: false },
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
      <div className="scrollbar-hide lg:px-18 flex items-center gap-6 overflow-x-auto border-b border-orange-900/20 px-6 py-2 md:px-12">
        {statusReadouts.map(({ icon, label, color }) => (
          <div key={label} className="flex shrink-0 items-center gap-2 text-xs uppercase tracking-widest text-neutral-500">
            <span className={`h-1.5 w-1.5 ${color === "bg-orange-500" ? "fx-dot-orange" : "fx-dot-green"}`}></span>
            <i className={`${icon} text-neutral-600`}></i>
            <span>{label}</span>
          </div>
        ))}
      </div>

      {/* ── Footer Body ── */}
      <div className="lg:px-18 grid grid-cols-1 gap-8 px-6 py-6 md:grid-cols-3 md:px-12 hidden">

        {/* Left — System Identifier */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <i className="icarus-terminal-logo text-glow__orange text-2xl"></i>
            <div>
              <p className="text-glow__orange text-sm font-bold uppercase tracking-widest">ED:CS Terminal</p>
              <p className="text-xs uppercase tracking-wider text-neutral-600">Cartographic Intelligence System</p>
            </div>
          </div>
          <div className="flex items-center gap-3 text-xs uppercase tracking-widest text-neutral-700">
            <span>SYS:EDCS-001</span>
            <span>■</span>
            <span>BUILD:STABLE</span>
          </div>
        </div>

        {/* Centre — Legal */}
        <div className="flex flex-col items-start gap-3 text-xs uppercase tracking-widest md:items-center">
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
          <p className="text-neutral-600">
            <span className="text-orange-500/60">Elite: Dangerous</span> © 2012–2024 Frontier Developments plc.
          </p>
          <p className="text-neutral-700">
            ED:CS is not affiliated with or endorsed by Frontier Developments.
          </p>
        </div>

        {/* Right — Attribution + Data Sources */}
        <div className="flex flex-col gap-3 text-xs uppercase tracking-widest md:items-end">
          <div className="flex items-center gap-2 text-neutral-500">
            <i className="icarus-terminal-commander text-glow__orange"></i>
            <span>Developed by</span>
            <a
              href="https://versyx.dev"
              className="text-glow__blue transition-colors hover:text-orange-300"
            >
              Chris Rowles
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
