"use client";

import { useRouter } from "next/navigation";
import Panel from "@/components/panel";
import Button from "@/components/button";

const STARS = [
  { cx: 45, cy: 30, r: 1.5 },
  { cx: 120, cy: 85, r: 1 },
  { cx: 200, cy: 45, r: 2 },
  { cx: 280, cy: 120, r: 1.5 },
  { cx: 350, cy: 60, r: 1 },
  { cx: 420, cy: 140, r: 2 },
  { cx: 80, cy: 170, r: 1 },
  { cx: 160, cy: 210, r: 1.5 },
  { cx: 240, cy: 185, r: 1 },
  { cx: 390, cy: 170, r: 1 },
  { cx: 460, cy: 200, r: 1.5 },
  { cx: 30, cy: 250, r: 1 },
  { cx: 100, cy: 290, r: 2 },
  { cx: 180, cy: 265, r: 1 },
  { cx: 330, cy: 280, r: 1 },
  { cx: 410, cy: 300, r: 2 },
  { cx: 70, cy: 340, r: 1.5 },
  { cx: 150, cy: 370, r: 1 },
  { cx: 230, cy: 350, r: 2 },
  { cx: 300, cy: 375, r: 1 },
  { cx: 380, cy: 355, r: 1.5 },
  { cx: 450, cy: 370, r: 1 },
  { cx: 488, cy: 55, r: 1 },
  { cx: 470, cy: 290, r: 1.5 },
  { cx: 15, cy: 130, r: 1 },
  { cx: 55, cy: 390, r: 1 },
  { cx: 495, cy: 380, r: 1 },
];

const WAYPOINTS = [
  { cx: 45, cy: 30, label: "SOL" },
  { cx: 420, cy: 140, label: "COLONIA" },
  { cx: 260, cy: 310, label: "BEAGLE POINT" },
  { cx: 460, cy: 370, label: "SAG.A*" },
];

const ERROR_MARKERS = [
  { x: 150, y: 120 },
  { x: 380, y: 80 },
  { x: 430, y: 320 },
  { x: 80, y: 300 },
];

export default function NotFound() {
  const router = useRouter();

  return (
    <>
      {/* ── Masthead ── */}
      <Panel className="fx-border-breathe mb-3 px-4 py-4 md:px-8" corners="lg">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-2 text-xs uppercase tracking-widest text-neutral-600">
          <div className="flex flex-wrap items-center gap-3">
            <span>SYS:EDCS-001</span>
            <span className="hidden text-neutral-800 sm:inline">■</span>
            <span className="hidden sm:inline">SECTOR:UNKNOWN</span>
            <span className="hidden text-neutral-800 md:inline">■</span>
            <span className="hidden md:inline">CLASS:NAVIGATION ERROR</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="fx-dot-orange h-1.5 w-1.5"></span>
            <span>ROUTE: FAULT</span>
          </div>
        </div>

        <div className="text-center">
          <p className="mb-3 text-xs uppercase tracking-[0.2em] text-neutral-500 sm:tracking-[0.5em]">
            frontier developments ── universal cartographics
          </p>
          <h1 className="fx-glitch fx-holo-heading text-glow__orange mb-3 text-6xl font-bold uppercase tracking-[0.4em] md:text-8xl">
            404
          </h1>
          <p className="text-xs uppercase tracking-[0.15em] text-neutral-500 sm:tracking-[0.35em]">
            navigation failure ── sector uncharted ── route not found
          </p>
        </div>

        <div className="mt-6 flex items-center gap-6 border-t border-orange-900/20 pt-4 text-xs uppercase tracking-widest text-neutral-700">
          <span className="h-px flex-1 bg-neutral-800"></span>
          <span className="flex items-center gap-2">
            <i className="icarus-terminal-route"></i>
            ROUTE RESOLUTION FAILED
          </span>
          <span className="h-px flex-1 bg-neutral-800"></span>
        </div>
      </Panel>

      {/* ── Content Grid ── */}
      <div className="grid grid-cols-1 gap-x-5 md:grid-cols-2 lg:grid-cols-3">
        {/* ── Galaxy Map Panel ── */}
        <div className="col-span-1 flex h-full flex-col pt-3 lg:col-span-2">
          <Panel className="fx-panel-scan flex flex-1 flex-col p-4" corners="lg">
            <div className="mb-3 flex items-center justify-between text-xs uppercase tracking-widest text-neutral-600">
              <div className="flex items-center gap-2">
                <span className="fx-dot-orange h-1.5 w-1.5"></span>
                <span>GALAXY MAP — NAVIGATION FAILURE</span>
              </div>
              <span className="hidden text-neutral-700 sm:inline">
                COORD:UNKNOWN ◆ BEARING:ERR
              </span>
            </div>

            <div className="relative min-h-0 flex-1 overflow-hidden border border-orange-900/20">
              <svg
                viewBox="0 0 500 400"
                xmlns="http://www.w3.org/2000/svg"
                className="h-full w-full"
              >
                <defs>
                  <pattern id="nf-grid" width="50" height="50" patternUnits="userSpaceOnUse">
                    <path
                      d="M 50 0 L 0 0 0 50"
                      fill="none"
                      stroke="rgba(251,146,60,0.09)"
                      strokeWidth="0.5"
                    />
                  </pattern>
                  <pattern id="nf-subgrid" width="10" height="10" patternUnits="userSpaceOnUse">
                    <path
                      d="M 10 0 L 0 0 0 10"
                      fill="none"
                      stroke="rgba(251,146,60,0.04)"
                      strokeWidth="0.5"
                    />
                  </pattern>
                  <radialGradient id="nf-unknownZone" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="rgba(252,72,72,0.18)" />
                    <stop offset="55%" stopColor="rgba(252,72,72,0.06)" />
                    <stop offset="100%" stopColor="transparent" />
                  </radialGradient>
                  <radialGradient id="nf-radarFade" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="rgba(251,146,60,0.18)" />
                    <stop offset="100%" stopColor="transparent" />
                  </radialGradient>
                  <filter id="nf-starGlow" x="-50%" y="-50%" width="200%" height="200%">
                    <feGaussianBlur stdDeviation="1.2" result="blur" />
                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                  </filter>
                  <filter id="nf-redGlow" x="-100%" y="-100%" width="300%" height="300%">
                    <feGaussianBlur stdDeviation="3" result="blur" />
                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                  </filter>
                  <linearGradient id="nf-scanGrad" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="transparent" />
                    <stop offset="20%" stopColor="rgba(251,146,60,0.35)" />
                    <stop offset="50%" stopColor="rgba(251,146,60,0.85)" />
                    <stop offset="80%" stopColor="rgba(251,146,60,0.35)" />
                    <stop offset="100%" stopColor="transparent" />
                  </linearGradient>
                  <linearGradient id="nf-radarSweep" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="rgba(251,146,60,0.5)" />
                    <stop offset="100%" stopColor="transparent" />
                  </linearGradient>
                  <mask id="nf-radarMask">
                    <circle cx="250" cy="200" r="58" fill="white" />
                  </mask>
                </defs>

                {/* Background */}
                <rect width="500" height="400" fill="rgba(0,0,0,0.85)" />
                <rect width="500" height="400" fill="url(#nf-subgrid)" />
                <rect width="500" height="400" fill="url(#nf-grid)" />

                {/* Axis coordinate labels */}
                {[-20, -10, 0, 10, 20].map((val, i) => (
                  <text
                    key={`xl-${i}`}
                    x={i * 100 + 4}
                    y="11"
                    fill="rgba(251,146,60,0.18)"
                    fontSize="6"
                    fontFamily="monospace"
                  >
                    {val > 0 ? `+${val}` : val}
                  </text>
                ))}
                {[-15, -5, 5, 15].map((val, i) => (
                  <text
                    key={`yl-${i}`}
                    x="3"
                    y={i * 100 + 55}
                    fill="rgba(251,146,60,0.18)"
                    fontSize="6"
                    fontFamily="monospace"
                  >
                    {val > 0 ? `+${val}` : val}
                  </text>
                ))}

                {/* Stars */}
                {STARS.map((star, i) => (
                  <circle
                    key={i}
                    cx={star.cx}
                    cy={star.cy}
                    r={star.r}
                    fill="rgba(251,200,120,0.7)"
                    filter="url(#nf-starGlow)"
                  />
                ))}

                {/* Route lines */}
                <polyline
                  points="45,30 250,200"
                  fill="none"
                  stroke="rgba(251,146,60,0.18)"
                  strokeWidth="1"
                  strokeDasharray="5,5"
                />
                <polyline
                  points="420,140 250,200"
                  fill="none"
                  stroke="rgba(251,146,60,0.18)"
                  strokeWidth="1"
                  strokeDasharray="5,5"
                />
                <polyline
                  points="260,310 250,200"
                  fill="none"
                  stroke="rgba(251,146,60,0.15)"
                  strokeWidth="1"
                  strokeDasharray="5,5"
                />
                <polyline
                  points="460,370 250,200"
                  fill="none"
                  stroke="rgba(251,146,60,0.15)"
                  strokeWidth="1"
                  strokeDasharray="5,5"
                />

                {/* Error markers */}
                {ERROR_MARKERS.map((pt, i) => (
                  <g key={i} opacity="0.45">
                    <line
                      x1={pt.x - 5}
                      y1={pt.y - 5}
                      x2={pt.x + 5}
                      y2={pt.y + 5}
                      stroke="rgba(252,72,72,0.7)"
                      strokeWidth="1"
                    />
                    <line
                      x1={pt.x + 5}
                      y1={pt.y - 5}
                      x2={pt.x - 5}
                      y2={pt.y + 5}
                      stroke="rgba(252,72,72,0.7)"
                      strokeWidth="1"
                    />
                  </g>
                ))}

                {/* Radar sweep inside circle */}
                <g mask="url(#nf-radarMask)">
                  <circle cx="250" cy="200" r="58" fill="url(#nf-radarFade)" opacity="0.5" />
                  <line
                    x1="250"
                    y1="200"
                    x2="250"
                    y2="142"
                    stroke="rgba(251,146,60,0.55)"
                    strokeWidth="1.5"
                  >
                    <animateTransform
                      attributeName="transform"
                      type="rotate"
                      from="0 250 200"
                      to="360 250 200"
                      dur="5s"
                      repeatCount="indefinite"
                    />
                  </line>
                </g>

                {/* Unknown zone radial glow */}
                <circle cx="250" cy="200" r="70" fill="url(#nf-unknownZone)" />

                {/* Outer target ring — slow clockwise */}
                <circle
                  cx="250"
                  cy="200"
                  r="58"
                  fill="none"
                  stroke="rgba(252,72,72,0.35)"
                  strokeWidth="1"
                  strokeDasharray="10,5"
                >
                  <animateTransform
                    attributeName="transform"
                    type="rotate"
                    from="0 250 200"
                    to="360 250 200"
                    dur="22s"
                    repeatCount="indefinite"
                  />
                </circle>

                {/* Middle ring — counter-clockwise */}
                <circle
                  cx="250"
                  cy="200"
                  r="40"
                  fill="none"
                  stroke="rgba(252,72,72,0.5)"
                  strokeWidth="0.75"
                  strokeDasharray="5,3"
                >
                  <animateTransform
                    attributeName="transform"
                    type="rotate"
                    from="360 250 200"
                    to="0 250 200"
                    dur="14s"
                    repeatCount="indefinite"
                  />
                </circle>

                {/* Inner ring — clockwise fast */}
                <circle
                  cx="250"
                  cy="200"
                  r="22"
                  fill="none"
                  stroke="rgba(252,72,72,0.65)"
                  strokeWidth="0.5"
                  strokeDasharray="3,2"
                >
                  <animateTransform
                    attributeName="transform"
                    type="rotate"
                    from="0 250 200"
                    to="360 250 200"
                    dur="8s"
                    repeatCount="indefinite"
                  />
                </circle>

                {/* Crosshair lines */}
                <line
                  x1="250"
                  y1="142"
                  x2="250"
                  y2="178"
                  stroke="rgba(252,72,72,0.6)"
                  strokeWidth="1"
                />
                <line
                  x1="250"
                  y1="222"
                  x2="250"
                  y2="258"
                  stroke="rgba(252,72,72,0.6)"
                  strokeWidth="1"
                />
                <line
                  x1="192"
                  y1="200"
                  x2="228"
                  y2="200"
                  stroke="rgba(252,72,72,0.6)"
                  strokeWidth="1"
                />
                <line
                  x1="272"
                  y1="200"
                  x2="308"
                  y2="200"
                  stroke="rgba(252,72,72,0.6)"
                  strokeWidth="1"
                />

                {/* Corner tick marks on outer ring */}
                {[0, 90, 180, 270].map((angle, i) => {
                  const rad = (angle * Math.PI) / 180;
                  const x1 = 250 + Math.cos(rad) * 55;
                  const y1 = 200 + Math.sin(rad) * 55;
                  const x2 = 250 + Math.cos(rad) * 63;
                  const y2 = 200 + Math.sin(rad) * 63;
                  return (
                    <line
                      key={i}
                      x1={x1}
                      y1={y1}
                      x2={x2}
                      y2={y2}
                      stroke="rgba(252,72,72,0.6)"
                      strokeWidth="1.5"
                    />
                  );
                })}

                {/* Centre pulsing dot */}
                <circle cx="250" cy="200" r="3.5" fill="rgba(252,72,72,0.9)" filter="url(#nf-redGlow)">
                  <animate attributeName="opacity" values="0.35;1;0.35" dur="2s" repeatCount="indefinite" />
                  <animate attributeName="r" values="2.5;4;2.5" dur="2s" repeatCount="indefinite" />
                </circle>

                {/* "UNCHARTED" label */}
                <text
                  x="250"
                  y="193"
                  fill="rgba(252,72,72,0.65)"
                  fontSize="7"
                  fontFamily="monospace"
                  textAnchor="middle"
                  letterSpacing="2"
                >
                  SECTOR:
                </text>
                <text
                  x="250"
                  y="207"
                  fill="rgba(252,72,72,0.9)"
                  fontSize="9"
                  fontFamily="monospace"
                  textAnchor="middle"
                  fontWeight="bold"
                  letterSpacing="3"
                >
                  UNCHARTED
                </text>

                {/* Waypoint markers */}
                {WAYPOINTS.map((wp, i) => (
                  <g key={i}>
                    <circle
                      cx={wp.cx}
                      cy={wp.cy}
                      r="5"
                      fill="none"
                      stroke="rgba(251,146,60,0.55)"
                      strokeWidth="1"
                    />
                    <circle cx={wp.cx} cy={wp.cy} r="1.5" fill="rgba(251,146,60,0.85)" />
                    <text
                      x={wp.cx + 8}
                      y={wp.cy + 3}
                      fill="rgba(251,146,60,0.5)"
                      fontSize="6"
                      fontFamily="monospace"
                    >
                      {wp.label}
                    </text>
                  </g>
                ))}

                {/* Scanning line sweep */}
                <rect x="0" y="0" width="500" height="2" fill="url(#nf-scanGrad)">
                  <animate attributeName="y" from="-2" to="402" dur="9s" repeatCount="indefinite" />
                  <animate
                    attributeName="opacity"
                    values="0;0.7;0.7;0"
                    keyTimes="0;0.04;0.96;1"
                    dur="9s"
                    repeatCount="indefinite"
                  />
                </rect>
              </svg>
            </div>

            {/* Map footer status bar */}
            <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-[10px] uppercase tracking-widest text-neutral-700">
              <span>PLOT ORIGIN: SOL ── DESTINATION: <span className="text-red-900">NULL</span></span>
              <span className="flex items-center gap-1.5">
                <span className="fx-dot-orange h-1 w-1"></span>
                ACTIVE SCAN
              </span>
            </div>
          </Panel>
        </div>

        {/* ── Diagnostic Panel ── */}
        <div className="col-span-1 flex h-full flex-col pt-3">
          <Panel className="flex flex-1 flex-col p-4" corners="md">
            <div className="mb-4 flex items-center gap-2 text-xs uppercase tracking-widest text-neutral-600">
              <span className="fx-dot-orange h-1.5 w-1.5"></span>
              <span>NAV DIAGNOSTIC</span>
            </div>

            {/* Diagnostic readout grid */}
            <div className="space-y-0 border border-orange-900/20">
              {[
                { label: "FSD STATUS", value: "MISFIRE", color: "text-red-500" },
                { label: "TARGET LOCK", value: "NONE", color: "text-red-500" },
                { label: "ROUTE CODE", value: "ERR-404", color: "text-orange-500 text-glow__orange" },
                { label: "SECTOR CLASS", value: "UNCHARTED", color: "text-neutral-400" },
                { label: "SIGNAL LOCK", value: "LOST", color: "text-red-500" },
                { label: "JUMP RANGE", value: "N/A", color: "text-neutral-600" },
              ].map((row, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between border-b border-orange-900/20 px-3 py-2 text-xs last:border-b-0"
                >
                  <span className="uppercase tracking-widest text-neutral-600">{row.label}</span>
                  <span className={`font-bold uppercase tracking-widest ${row.color}`}>{row.value}</span>
                </div>
              ))}
            </div>

            {/* Terminal log */}
            <div className="mt-4 flex-1 space-y-1 border border-orange-900/20 bg-black/30 p-3 font-mono text-[10px] text-neutral-700">
              <p>
                <span className="text-orange-900/60">SYS</span>
                <span className="text-neutral-800"> &gt; </span>
                BOOT SEQUENCE COMPLETE
              </p>
              <p>
                <span className="text-orange-900/60">SYS</span>
                <span className="text-neutral-800"> &gt; </span>
                FSD CHARGED — INITIATING JUMP...
              </p>
              <p>
                <span className="text-orange-900/60">SYS</span>
                <span className="text-neutral-800"> &gt; </span>
                ACQUIRING TARGET LOCK...
              </p>
              <p className="text-red-900/80">
                <span className="text-red-900/60">ERR</span>
                <span className="text-neutral-800"> &gt; </span>
                TARGET LOCK FAILED
              </p>
              <p>
                <span className="text-orange-900/60">SYS</span>
                <span className="text-neutral-800"> &gt; </span>
                QUERYING CARTOGRAPHIC DB...
              </p>
              <p className="text-red-900/80">
                <span className="text-red-900/60">ERR</span>
                <span className="text-neutral-800"> &gt; </span>
                DESTINATION UNKNOWN
              </p>
              <p className="text-red-900/70">
                <span className="text-red-900/60">ERR</span>
                <span className="text-neutral-800"> &gt; </span>
                ROUTE CALCULATION FAILED
              </p>
              <p className="text-orange-900/70">
                <span className="text-orange-900/60">WRN</span>
                <span className="text-neutral-800"> &gt; </span>
                SECTOR DATA MISSING
              </p>
              <p className="text-orange-900/70">
                <span className="text-orange-900/60">WRN</span>
                <span className="text-neutral-800"> &gt; </span>
                NO STELLAR BODY AT COORDS
              </p>
              <p>
                <span className="text-orange-900/60">SYS</span>
                <span className="text-neutral-800"> &gt; </span>
                REVERTING TO LAST KNOWN...
              </p>
              <p className="text-orange-900/70">
                <span className="text-orange-900/60">WRN</span>
                <span className="text-neutral-800"> &gt; </span>
                SIGNAL INTEGRITY: 0%
              </p>
              <p className="text-orange-900/70">
                <span className="text-orange-900/60">WRN</span>
                <span className="text-neutral-800"> &gt; </span>
                HONK SENSOR OFFLINE
              </p>
              <p>
                <span className="text-orange-900/60">SYS</span>
                <span className="text-neutral-800"> &gt; </span>
                EMITTING DISTRESS BEACON...
              </p>
              <p className="text-red-900/70">
                <span className="text-red-900/60">ERR</span>
                <span className="text-neutral-800"> &gt; </span>
                NO RELAY IN RANGE
              </p>
              <p>
                <span className="text-orange-900/60">SYS</span>
                <span className="text-neutral-800"> &gt; </span>
                HULL INTEGRITY: NOMINAL
              </p>
              <p className="fx-cursor text-orange-500/40">
                <span className="text-orange-900/60">SYS</span>
                <span className="text-neutral-800"> &gt; </span>
                AWAITING CMDR INPUT
              </p>
            </div>

            {/* Action */}
            <div className="mt-4 border-t border-orange-900/20 pt-4">
              <p className="mb-3 text-[10px] uppercase tracking-widest text-neutral-600">
                RECOMMENDED ACTION
              </p>
              <Button theme="elite" onClick={() => router.push("/")} extraStyling="w-full">
                RETURN TO CARRIER
              </Button>
            </div>
          </Panel>
        </div>
      </div>
    </>
  );
}
