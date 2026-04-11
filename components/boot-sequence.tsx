"use client";

import { type FunctionComponent, useEffect, useRef, useState } from "react";
import { useSettings } from "@/core/contexts/settings-context";
import PanelCorners from "@/components/panel-corners";

type Phase = "logo" | "loader" | "checks" | "progress" | "complete" | "fadeout" | "done";

const CHECKS = [
  "INITIALIZING NEURAL INTERFACE",
  "AUTHENTICATING PILOT LICENSE",
  "SYNCHRONIZING GALNET UPLINK",
  "LOADING STELLAR CARTOGRAPHY",
  "CALIBRATING SENSOR ARRAY",
  "ESTABLISHING STATION COMMS",
];

const CHECK_MS = 260;

/* Tick ring — generated once, not per render */
const TICKS = Array.from({ length: 72 }, (_, i) => {
  const a       = (i * 5 * Math.PI) / 180 - Math.PI / 2;
  const isMajor = i % 18 === 0;
  const isMid   = i % 9 === 0;
  const r1      = 188;
  const r2      = isMajor ? 170 : isMid ? 178 : 183;
  return { a, isMajor, isMid, r1, r2 };
});

const CARDINAL_LABELS = [
  { angle: 45,  text: "SECTOR-7G" },
  { angle: 135, text: "BRG 032°"  },
  { angle: 225, text: "ALT 1.2AU" },
  { angle: 315, text: "VEL 402LS" },
];

const BootSequence: FunctionComponent = () => {
  const { settings } = useSettings();
  const [phase,    setPhase]    = useState<Phase>("logo");
  const [checks,   setChecks]   = useState(0);
  const [progress, setProgress] = useState(0);
  const [visible,  setVisible]  = useState(true);
  const ran         = useRef(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!settings.bootSequence || ran.current) return;
    ran.current = true;

    const checksStart   = 1600;
    const checksEnd     = checksStart + CHECKS.length * CHECK_MS; // 3160
    const progressStart = checksEnd + 200;                        // 3360
    const completeAt    = progressStart + 600;                    // 3960
    const fadeAt        = completeAt + 1200;                      // 5160
    const doneAt        = fadeAt + 800;                           // 5960

    const timers: ReturnType<typeof setTimeout>[] = [
      setTimeout(() => setPhase("loader"), 600),
      setTimeout(() => setPhase("checks"), checksStart),
      ...CHECKS.map((_, i) =>
        setTimeout(() => setChecks(i + 1), checksStart + i * CHECK_MS),
      ),
      setTimeout(() => {
        setPhase("progress");
        let p = 0;
        intervalRef.current = setInterval(() => {
          p += 2;
          setProgress(Math.min(p, 100));
          if (p >= 100) {
            clearInterval(intervalRef.current!);
            intervalRef.current = null;
          }
        }, 12);
      }, progressStart),
      setTimeout(() => setPhase("complete"), completeAt),
      setTimeout(() => setVisible(false),    fadeAt),
      setTimeout(() => setPhase("done"),     doneAt),
    ];

    return () => {
      timers.forEach(clearTimeout);
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [settings.bootSequence]);

  if (!settings.bootSequence || phase === "done") return null;

  const showLoader   = phase === "loader";
  const showChecks   = phase === "checks" || phase === "progress" || phase === "complete";
  const showProgress = phase === "progress" || phase === "complete";

  return (
    <div
      className="fixed inset-0 z-[10000] flex items-center justify-center overflow-hidden bg-black"
      style={{ opacity: visible ? 1 : 0, transition: "opacity 0.8s ease" }}
      aria-label="System boot sequence"
      aria-live="polite"
    >
      {/* Screen corner brackets */}
      <div className="pointer-events-none absolute inset-0">
        <PanelCorners size="lg" />
      </div>

      {/* HUD chrome — top */}
      <div className="pointer-events-none absolute left-5 top-5 space-y-0.5 text-[0.45rem] uppercase tracking-[0.45em] text-orange-900/50">
        <div>EDCTS / BUILD 4.7.2</div>
        <div>PILOTS FEDERATION AUTH</div>
      </div>
      <div className="pointer-events-none absolute right-5 top-5 space-y-0.5 text-right text-[0.45rem] uppercase tracking-[0.45em] text-orange-900/50">
        <div>STARDATE 3309.04.10</div>
        <div>SECURE CHANNEL</div>
      </div>

      {/* HUD chrome — bottom */}
      <div className="pointer-events-none absolute bottom-5 left-5 text-[0.42rem] uppercase tracking-[0.45em] text-orange-900/30">
        © FRONTIER DEVELOPMENTS / GALACTIC COMMS
      </div>
      <div className="pointer-events-none absolute bottom-5 right-5 text-[0.42rem] uppercase tracking-[0.45em] text-orange-900/30">
        ENCRYPTED ■ CHANNEL ACTIVE
      </div>

      {/* Horizontal rule lines */}
      <div className="pointer-events-none absolute inset-x-12 top-14 h-px bg-orange-900/20" />
      <div className="pointer-events-none absolute inset-x-12 bottom-14 h-px bg-orange-900/20" />

      {/* Vertical rule lines */}
      <div className="pointer-events-none absolute inset-y-14 left-14 w-px bg-orange-900/10" />
      <div className="pointer-events-none absolute inset-y-14 right-14 w-px bg-orange-900/10" />

      {/* Scanning beam */}
      <div
        className="pointer-events-none absolute inset-x-0 z-10 h-px"
        style={{
          background: "linear-gradient(90deg, transparent 0%, rgba(251,146,60,0.25) 20%, rgba(251,146,60,0.65) 50%, rgba(251,146,60,0.25) 80%, transparent 100%)",
          animation: "boot-scan 5s linear infinite",
        }}
      />

      {/* Central content */}
      <div className="relative flex flex-col items-center justify-center">

        {/* SVG Reticle — always visible */}
        <svg
          className="pointer-events-none absolute"
          style={{ width: "min(420px, 92vw)", height: "min(420px, 92vw)" }}
          viewBox="0 0 400 400"
          aria-hidden="true"
        >
          {/* Outer tick ring — rotates slowly */}
          <g style={{ transformOrigin: "200px 200px", animation: "boot-spin 45s linear infinite" }}>
            <circle cx="200" cy="200" r="188" stroke="rgba(251,146,60,0.1)" strokeWidth="0.5" />
            {TICKS.map(({ a, isMajor, isMid, r1, r2 }, i) => (
              <line
                key={i}
                x1={200 + r1 * Math.cos(a)} y1={200 + r1 * Math.sin(a)}
                x2={200 + r2 * Math.cos(a)} y2={200 + r2 * Math.sin(a)}
                stroke={`rgba(251,146,60,${isMajor ? 0.5 : isMid ? 0.28 : 0.14})`}
                strokeWidth={isMajor ? 1.5 : 0.75}
              />
            ))}
          </g>

          {/* Dashed counter-rotating ring */}
          <g style={{ transformOrigin: "200px 200px", animation: "boot-spin-rev 28s linear infinite" }}>
            <circle
              cx="200" cy="200" r="152"
              stroke="rgba(251,146,60,0.2)"
              strokeWidth="1"
              strokeDasharray="5 15"
            />
          </g>

          {/* Inner static ring */}
          <circle cx="200" cy="200" r="116" stroke="rgba(251,146,60,0.1)" strokeWidth="0.75" />

          {/* Ambient inner glow ring */}
          <circle cx="200" cy="200" r="116" stroke="rgba(251,146,60,0.04)" strokeWidth="28" />

          {/* Crosshair arms */}
          <line x1="200" y1="8"   x2="200" y2="84"  stroke="rgba(251,146,60,0.2)" strokeWidth="0.75" />
          <line x1="200" y1="316" x2="200" y2="392" stroke="rgba(251,146,60,0.2)" strokeWidth="0.75" />
          <line x1="8"   y1="200" x2="84"  y2="200" stroke="rgba(251,146,60,0.2)" strokeWidth="0.75" />
          <line x1="316" y1="200" x2="392" y2="200" stroke="rgba(251,146,60,0.2)" strokeWidth="0.75" />

          {/* Crosshair end caps */}
          {([[200, 8], [200, 392], [8, 200], [392, 200]] as [number, number][]).map(([x, y], i) => (
            <line key={i}
              x1={i < 2 ? x - 5 : x} y1={i < 2 ? y : y - 5}
              x2={i < 2 ? x + 5 : x} y2={i < 2 ? y : y + 5}
              stroke="rgba(251,146,60,0.45)" strokeWidth="1.5"
            />
          ))}

          {/* Cardinal accent dots on dashed ring */}
          {[0, 90, 180, 270].map((deg, i) => {
            const a = (deg * Math.PI) / 180 - Math.PI / 2;
            return (
              <circle key={i}
                cx={200 + 152 * Math.cos(a)}
                cy={200 + 152 * Math.sin(a)}
                r="3"
                fill="rgba(251,146,60,0.75)"
                style={{ filter: "drop-shadow(0 0 4px rgba(251,146,60,0.9))" }}
              />
            );
          })}

          {/* Diagonal data readout labels */}
          {CARDINAL_LABELS.map(({ angle, text }) => {
            const a = (angle * Math.PI) / 180 - Math.PI / 2;
            const r = 172;
            return (
              <text key={angle}
                x={200 + r * Math.cos(a)}
                y={200 + r * Math.sin(a)}
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize="5"
                letterSpacing="1.5"
                fill="rgba(251,146,60,0.25)"
                fontFamily="monospace"
              >
                {text}
              </text>
            );
          })}
        </svg>

        {/* ── Logo phase ── */}
        {phase === "logo" && (
          <div className="relative z-10 flex flex-col items-center">
            <div className="mb-2 text-[0.42rem] uppercase tracking-[0.6em] text-orange-800/55">
              FRONTIER DEVELOPMENTS / PILOTS FEDERATION
            </div>
            <h1
              className="text-glow__orange text-4xl font-bold uppercase tracking-[0.5em]"
              style={{ animation: "fx-data-flicker 0.7s ease forwards, fx-glitch 12s ease-in-out 1s infinite" }}
            >
              ED:CS
            </h1>
            <div className="mt-2 text-[0.48rem] uppercase tracking-[0.5em] text-orange-700/50">
              Elite Dangerous Community Tools
            </div>
          </div>
        )}

        {/* ── Loader phase ── */}
        {showLoader && (
          <div className="relative z-10 flex flex-col items-center">
            <p className="text-glow__orange mb-4 text-[0.6rem] uppercase tracking-widest fx-cursor">
              INITIALIZING SYSTEMS
            </p>
            {/* Inline arrow loader — overrides .elite-loader absolute positioning */}
            <div
              className="elite-loader"
              style={{ position: "static", top: "auto", left: "auto", transform: "none", zIndex: "auto" }}
            >
              <div className="row">
                <div className="arrow up outer outer-18" /><div className="arrow down outer outer-17" />
                <div className="arrow up outer outer-16" /><div className="arrow down outer outer-15" />
                <div className="arrow up outer outer-14" />
              </div>
              <div className="row">
                <div className="arrow up outer outer-1" /><div className="arrow down outer outer-2" />
                <div className="arrow up inner inner-6" /><div className="arrow down inner inner-5" />
                <div className="arrow up inner inner-4" />
                <div className="arrow down outer outer-13" /><div className="arrow up outer outer-12" />
              </div>
              <div className="row">
                <div className="arrow down outer outer-3" /><div className="arrow up outer outer-4" />
                <div className="arrow down inner inner-1" /><div className="arrow up inner inner-2" />
                <div className="arrow down inner inner-3" />
                <div className="arrow up outer outer-11" /><div className="arrow down outer outer-10" />
              </div>
              <div className="row">
                <div className="arrow down outer outer-5" /><div className="arrow up outer outer-6" />
                <div className="arrow down outer outer-7" /><div className="arrow up outer outer-8" />
                <div className="arrow down outer outer-9" />
              </div>
            </div>
          </div>
        )}

        {/* ── System checks phase ── */}
        {showChecks && (
          <div className="relative z-10" style={{ width: "min(18rem, 82vw)" }}>
            <div className="mb-3 border-b border-orange-900/30 pb-2 text-center text-[0.42rem] uppercase tracking-[0.45em] text-orange-800/50">
              PILOT INTERFACE — SYSTEM DIAGNOSTIC
            </div>

            <div className="space-y-1.5">
              {CHECKS.slice(0, checks).map((check, i) => (
                <div key={i} className="flex items-center justify-between gap-4 text-[0.65rem] uppercase tracking-wider">
                  <span className="text-orange-700/70">&gt; {check}</span>
                  <span
                    className="flex-shrink-0 font-bold"
                    style={{ color: "rgb(74,222,128)", textShadow: "0 0 8px rgba(74,222,128,0.7)" }}
                  >
                    [OK]
                  </span>
                </div>
              ))}
            </div>

            {/* Progress bar */}
            {showProgress && (
              <div className="mt-5">
                <div className="mb-1.5 flex items-center justify-between text-[0.48rem] uppercase tracking-widest">
                  <span className="text-orange-900/60">SYSTEM STATUS</span>
                  <span className="text-glow__orange tabular-nums">{progress}%</span>
                </div>
                <div className="relative h-[2px] overflow-hidden bg-orange-950/80">
                  <div
                    className="absolute inset-y-0 left-0"
                    style={{
                      width: `${progress}%`,
                      background: "rgb(249,115,22)",
                      boxShadow: "0 0 10px rgba(249,115,22,0.8), 0 0 24px rgba(249,115,22,0.35)",
                      transition: "width 0.01s linear",
                    }}
                  />
                </div>
              </div>
            )}

            {/* Welcome message */}
            {phase === "complete" && (
              <div className="mt-6 text-center">
                <div
                  className="text-glow__orange text-sm font-bold uppercase tracking-[0.5em]"
                  style={{ animation: "fx-data-flicker 0.5s ease forwards, fx-glitch 8s ease-in-out 0.6s infinite" }}
                >
                  WELCOME, COMMANDER
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default BootSequence;
