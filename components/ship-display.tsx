"use client";

import { type FunctionComponent, useState } from "react";
import Panel from "./panel";
import Heading from "./heading";

const SHIP_SYSTEMS = [
  { id: "shields", label: "SHIELDS", icon: "icarus-terminal-shield", defaultActive: true },
  { id: "hardpoints", label: "HARDPOINTS", icon: "icarus-terminal-warning", defaultActive: false },
  { id: "fsd", label: "FSD DRIVE", icon: "icarus-terminal-route", defaultActive: true },
  { id: "cargo", label: "CARGO HATCH", icon: "icarus-terminal-cargo", defaultActive: false },
];

const ShipDisplay: FunctionComponent = () => {
  const [activeSystems, setActiveSystems] = useState<Record<string, boolean>>(
    () => Object.fromEntries(SHIP_SYSTEMS.map((s) => [s.id, s.defaultActive])),
  );

  const toggleSystem = (id: string) => {
    setActiveSystems((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <Panel variant="muted" className="fx-border-breathe" cornerClassName="z-10">

      <div className="p-4">
        {/* Section header */}
        <Heading bordered icon="icarus-terminal-scan" title="Ship Profile" subtitle="Cobra Mk III — Holographic" className="mb-4 pb-4">
          <span className="flex items-center gap-1.5 text-xs uppercase tracking-wider text-neutral-500">
            <span className="fx-dot-orange h-1.5 w-1.5"></span>
            Active
          </span>
        </Heading>

        {/* Holographic viewport */}
        <div
          className="fx-panel-scan relative mb-4 overflow-hidden border border-orange-900/20 bg-black/80"
          style={{ height: "220px" }}
        >
          {/* Faint grid overlay */}
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.07]"
            style={{
              backgroundImage:
                "linear-gradient(rgba(251,146,60,1) 1px, transparent 1px), linear-gradient(90deg, rgba(251,146,60,1) 1px, transparent 1px)",
              backgroundSize: "22px 22px",
            }}
          />

          {/* Targeting reticle SVG */}
          <svg
            className="pointer-events-none absolute inset-0 h-full w-full"
            viewBox="0 0 300 220"
            preserveAspectRatio="xMidYMid meet"
            style={{ opacity: 0.25 }}
          >
            {/* Outer dashed ring */}
            <circle cx="150" cy="110" r="92" fill="none" stroke="rgb(251,146,60)" strokeWidth="0.6" strokeDasharray="5 5" />
            {/* Inner dashed ring */}
            <circle cx="150" cy="110" r="58" fill="none" stroke="rgb(251,146,60)" strokeWidth="0.5" strokeDasharray="2 7" />
            {/* Crosshair lines */}
            <line x1="50" y1="110" x2="84" y2="110" stroke="rgb(251,146,60)" strokeWidth="0.6" />
            <line x1="216" y1="110" x2="250" y2="110" stroke="rgb(251,146,60)" strokeWidth="0.6" />
            <line x1="150" y1="15" x2="150" y2="50" stroke="rgb(251,146,60)" strokeWidth="0.6" />
            <line x1="150" y1="170" x2="150" y2="205" stroke="rgb(251,146,60)" strokeWidth="0.6" />
            {/* Corner brackets */}
            <path d="M 42,12 L 42,28 M 42,12 L 58,12" fill="none" stroke="rgb(251,146,60)" strokeWidth="1.2" />
            <path d="M 258,12 L 258,28 M 258,12 L 242,12" fill="none" stroke="rgb(251,146,60)" strokeWidth="1.2" />
            <path d="M 42,208 L 42,192 M 42,208 L 58,208" fill="none" stroke="rgb(251,146,60)" strokeWidth="1.2" />
            <path d="M 258,208 L 258,192 M 258,208 L 242,208" fill="none" stroke="rgb(251,146,60)" strokeWidth="1.2" />
            {/* Tick marks on outer ring */}
            <line x1="150" y1="18" x2="150" y2="24" stroke="rgb(251,146,60)" strokeWidth="0.8" />
            <line x1="150" y1="196" x2="150" y2="202" stroke="rgb(251,146,60)" strokeWidth="0.8" />
            <line x1="58" y1="110" x2="64" y2="110" stroke="rgb(251,146,60)" strokeWidth="0.8" />
            <line x1="236" y1="110" x2="242" y2="110" stroke="rgb(251,146,60)" strokeWidth="0.8" />
          </svg>

          {/* Rotating ship */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div style={{ animation: "ship-hologram-spin 14s linear infinite" }}>
              <svg
                viewBox="0 0 200 235"
                width="125"
                height="147"
                style={{
                  filter:
                    "drop-shadow(0 0 5px rgba(251,146,60,0.9)) drop-shadow(0 0 14px rgba(251,100,20,0.5)) drop-shadow(0 0 28px rgba(251,80,10,0.25))",
                }}
              >
                {/* ── Main hull body ── */}
                <path
                  d="M 100,18 L 123,65 L 140,108 L 143,157 L 123,177 L 100,174 L 77,177 L 57,157 L 60,108 L 77,65 Z"
                  fill="rgba(251,90,10,0.06)"
                  stroke="rgba(251,146,60,0.92)"
                  strokeWidth="1.6"
                  strokeLinejoin="round"
                />
                {/* ── Right wing ── */}
                <path
                  d="M 140,103 L 186,120 L 181,143 L 145,140 Z"
                  fill="rgba(251,90,10,0.04)"
                  stroke="rgba(251,146,60,0.72)"
                  strokeWidth="1.1"
                  strokeLinejoin="round"
                />
                {/* ── Left wing ── */}
                <path
                  d="M 60,103 L 14,120 L 19,143 L 55,140 Z"
                  fill="rgba(251,90,10,0.04)"
                  stroke="rgba(251,146,60,0.72)"
                  strokeWidth="1.1"
                  strokeLinejoin="round"
                />
                {/* ── Right engine pod ── */}
                <path
                  d="M 124,174 L 132,180 L 132,213 L 124,218 L 115,213 L 115,180 Z"
                  fill="rgba(251,90,10,0.09)"
                  stroke="rgba(251,146,60,0.85)"
                  strokeWidth="1.3"
                  strokeLinejoin="round"
                />
                {/* ── Left engine pod ── */}
                <path
                  d="M 76,174 L 85,180 L 85,213 L 76,218 L 68,213 L 68,180 Z"
                  fill="rgba(251,90,10,0.09)"
                  stroke="rgba(251,146,60,0.85)"
                  strokeWidth="1.3"
                  strokeLinejoin="round"
                />
                {/* ── Cockpit canopy ── */}
                <path
                  d="M 100,22 L 114,54 L 100,64 L 86,54 Z"
                  fill="rgba(251,200,100,0.14)"
                  stroke="rgba(251,210,110,0.92)"
                  strokeWidth="1.1"
                  strokeLinejoin="round"
                />
                {/* ── Internal panel lines ── */}
                {/* Center spine */}
                <line x1="100" y1="64" x2="100" y2="174" stroke="rgba(251,146,60,0.35)" strokeWidth="0.8" />
                {/* Diagonal panel creases */}
                <line x1="100" y1="84" x2="141" y2="152" stroke="rgba(251,146,60,0.25)" strokeWidth="0.6" />
                <line x1="100" y1="84" x2="59" y2="152" stroke="rgba(251,146,60,0.25)" strokeWidth="0.6" />
                {/* Cross brace */}
                <line x1="85" y1="108" x2="115" y2="108" stroke="rgba(251,146,60,0.3)" strokeWidth="0.7" />
                {/* Wing root detail */}
                <line x1="140" y1="110" x2="145" y2="140" stroke="rgba(251,146,60,0.3)" strokeWidth="0.6" />
                <line x1="60" y1="110" x2="55" y2="140" stroke="rgba(251,146,60,0.3)" strokeWidth="0.6" />
                {/* ── Engine exhaust glows ── */}
                <circle cx="123" cy="215" r="5.5" fill="rgba(251,146,60,0.65)" stroke="rgba(255,210,120,0.9)" strokeWidth="0.9" />
                <circle cx="77" cy="215" r="5.5" fill="rgba(251,146,60,0.65)" stroke="rgba(255,210,120,0.9)" strokeWidth="0.9" />
                {/* Engine inner core */}
                <circle cx="123" cy="215" r="2.5" fill="rgba(255,230,180,0.9)" />
                <circle cx="77" cy="215" r="2.5" fill="rgba(255,230,180,0.9)" />
              </svg>
            </div>
          </div>

          {/* Viewport overlay labels */}
          <span className="absolute left-2 top-2 text-xs uppercase tracking-widest text-orange-900/70">CMDR:REDACTED</span>
          <span className="absolute right-2 top-2 text-xs uppercase tracking-widest text-orange-900/70">REG:FDV-9841</span>
          <span className="absolute bottom-2 left-2 text-xs uppercase tracking-widest text-orange-900/70">MASS:180T</span>
          <span className="absolute bottom-2 right-2 text-xs uppercase tracking-widest text-orange-900/70">VER:3.8.1</span>
        </div>

        {/* Status readouts */}
        <div className="mb-4 grid grid-cols-2 gap-x-4 gap-y-3 border-b border-orange-900/20 pb-4">
          {/* Hull integrity */}
          <div>
            <div className="mb-1 flex justify-between text-xs uppercase tracking-widest text-neutral-500">
              <span>HULL</span>
              <span className="text-glow__orange font-bold text-orange-400">97%</span>
            </div>
            <div className="h-1 w-full bg-orange-900/20">
              <div className="fx-gauge-active h-full bg-orange-500/75" style={{ width: "97%" }} />
            </div>
          </div>

          {/* Shields */}
          <div>
            <div className="mb-1 flex justify-between text-xs uppercase tracking-widest text-neutral-500">
              <span>SHIELDS</span>
              <span className="font-bold" style={{ color: "rgb(56,189,248)", textShadow: "0 0 8px rgba(56,189,248,0.7)" }}>
                100%
              </span>
            </div>
            <div className="h-1 w-full bg-orange-900/20">
              <div
                className="fx-gauge-active h-full"
                style={{ width: "100%", backgroundColor: "rgb(56,189,248)", opacity: 0.75 }}
              />
            </div>
          </div>

          {/* Cargo */}
          <div className="flex justify-between text-xs uppercase tracking-widest text-neutral-500">
            <span>CARGO</span>
            <span>0 / 36T</span>
          </div>

          {/* Fuel */}
          <div className="flex justify-between text-xs uppercase tracking-widest text-neutral-500">
            <span>FUEL</span>
            <span>16 / 16T</span>
          </div>
        </div>

        {/* System toggles */}
        <div className="grid grid-cols-2 gap-2">
          {SHIP_SYSTEMS.map((system) => {
            const isActive = activeSystems[system.id];
            return (
              <button
                key={system.id}
                onClick={() => toggleSystem(system.id)}
                className="fx-btn-sweep group relative flex items-center gap-2 border px-3 py-2 text-left text-xs uppercase tracking-widest transition-all duration-200"
                style={{
                  borderColor: isActive ? "rgba(251,146,60,0.45)" : "rgba(100,60,20,0.3)",
                  backgroundColor: isActive ? "rgba(251,100,20,0.08)" : "transparent",
                }}
              >
                {/* LED indicator */}
                <span
                  className="h-1.5 w-1.5 flex-shrink-0 rounded-full transition-all duration-200"
                  style={{
                    backgroundColor: isActive ? "rgb(249,115,22)" : "rgb(60,35,15)",
                    boxShadow: isActive ? "0 0 5px rgb(249,115,22), 0 0 10px rgba(249,115,22,0.4)" : "none",
                  }}
                />
                <i
                  className={`${system.icon} flex-shrink-0 transition-colors duration-200`}
                  style={{ color: isActive ? "rgb(251,146,60)" : "rgb(80,55,30)" }}
                ></i>
                <span
                  className="transition-colors duration-200"
                  style={{ color: isActive ? "rgb(200,130,60)" : "rgb(70,50,30)" }}
                >
                  {system.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </Panel>
  );
};

export default ShipDisplay;
