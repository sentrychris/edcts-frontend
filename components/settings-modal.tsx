"use client";

import {
  type FunctionComponent,
  type PointerEvent,
  useCallback,
  useEffect,
  useRef,
} from "react";
import { useSettings, THEMES } from "@/core/contexts/settings-context";
import PanelCorners from "@/components/panel-corners";

interface Props {
  onClose: () => void;
}

/* ─────────────────────────────────────────────
   Hue Wheel — canvas rotary dial
   Draws a ring track with theme tick marks and
   a pointer arm at the current hue angle.
───────────────────────────────────────────── */
const WHEEL_SIZE  = 160;
const W_C         = WHEEL_SIZE / 2;
const W_OUTER_R   = 73;
const W_INNER_R   = 56;
const W_TRACK_MID = (W_OUTER_R + W_INNER_R) / 2;

const THEME_TICKS = THEMES.map((t) => ({ angle: t.hue, label: t.label.slice(0, 3).toUpperCase() }));

function drawWheel(canvas: HTMLCanvasElement, hue: number) {
  const dpr = window.devicePixelRatio || 1;
  if (canvas.width !== WHEEL_SIZE * dpr) {
    canvas.width  = WHEEL_SIZE * dpr;
    canvas.height = WHEEL_SIZE * dpr;
    canvas.style.width  = `${WHEEL_SIZE}px`;
    canvas.style.height = `${WHEEL_SIZE}px`;
  }
  const ctx = canvas.getContext("2d")!;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.clearRect(0, 0, WHEEL_SIZE, WHEEL_SIZE);

  // Ring track background
  ctx.beginPath();
  ctx.arc(W_C, W_C, W_TRACK_MID, 0, Math.PI * 2);
  ctx.strokeStyle = "rgba(60,35,10,0.85)";
  ctx.lineWidth = W_OUTER_R - W_INNER_R;
  ctx.stroke();

  // Ring border lines
  for (const r of [W_INNER_R, W_OUTER_R]) {
    ctx.beginPath();
    ctx.arc(W_C, W_C, r, 0, Math.PI * 2);
    ctx.strokeStyle = "rgba(251,146,60,0.18)";
    ctx.lineWidth = 0.75;
    ctx.stroke();
  }

  // Theme tick marks + labels
  for (const tick of THEME_TICKS) {
    const rad = (tick.angle / 360) * Math.PI * 2 - Math.PI / 2;
    const cos = Math.cos(rad), sin = Math.sin(rad);

    ctx.beginPath();
    ctx.moveTo(W_C + W_INNER_R * cos, W_C + W_INNER_R * sin);
    ctx.lineTo(W_C + W_OUTER_R * cos, W_C + W_OUTER_R * sin);
    ctx.strokeStyle = "rgba(251,146,60,0.35)";
    ctx.lineWidth = 1;
    ctx.stroke();

    const labelR = W_OUTER_R + 8;
    ctx.font = `${7}px monospace`;
    ctx.fillStyle = "rgba(251,146,60,0.28)";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(tick.label, W_C + labelR * cos, W_C + labelR * sin);
  }

  // Pointer glow
  const pRad = (hue / 360) * Math.PI * 2 - Math.PI / 2;
  const pCos = Math.cos(pRad), pSin = Math.sin(pRad);

  ctx.beginPath();
  ctx.moveTo(W_C + 10 * pCos, W_C + 10 * pSin);
  ctx.lineTo(W_C + W_OUTER_R * pCos, W_C + W_OUTER_R * pSin);
  ctx.strokeStyle = "rgba(251,146,60,0.22)";
  ctx.lineWidth = 5;
  ctx.stroke();

  // Pointer core
  ctx.beginPath();
  ctx.moveTo(W_C + 10 * pCos, W_C + 10 * pSin);
  ctx.lineTo(W_C + W_OUTER_R * pCos, W_C + W_OUTER_R * pSin);
  ctx.strokeStyle = "rgba(251,146,60,0.9)";
  ctx.lineWidth = 1.5;
  ctx.stroke();

  // Indicator dot on ring
  ctx.beginPath();
  ctx.arc(W_C + W_TRACK_MID * pCos, W_C + W_TRACK_MID * pSin, 4.5, 0, Math.PI * 2);
  ctx.fillStyle = "rgb(251,146,60)";
  ctx.shadowColor = "rgba(251,146,60,0.8)";
  ctx.shadowBlur = 8;
  ctx.fill();
  ctx.shadowBlur = 0;

  // Centre dot
  ctx.beginPath();
  ctx.arc(W_C, W_C, 3, 0, Math.PI * 2);
  ctx.fillStyle = "rgba(251,146,60,0.6)";
  ctx.fill();
}

function pointerToHue(e: PointerEvent<HTMLCanvasElement>): number {
  const rect = e.currentTarget.getBoundingClientRect();
  const x = e.clientX - rect.left - W_C;
  const y = e.clientY - rect.top  - W_C;
  return (((Math.atan2(x, -y) * 180) / Math.PI) + 360) % 360;
}

const HueWheel: FunctionComponent<{ hue: number; onChange: (h: number) => void }> = ({ hue, onChange }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const dragging  = useRef(false);

  useEffect(() => {
    if (canvasRef.current) drawWheel(canvasRef.current, hue);
  }, [hue]);

  return (
    <div className="flex flex-col items-center gap-2">
      <canvas
        ref={canvasRef}
        className="cursor-crosshair"
        onPointerDown={(e) => {
          dragging.current = true;
          e.currentTarget.setPointerCapture(e.pointerId);
          onChange(Math.round(pointerToHue(e)));
        }}
        onPointerMove={(e) => { if (dragging.current) onChange(Math.round(pointerToHue(e))); }}
        onPointerUp={(e) => {
          dragging.current = false;
          e.currentTarget.releasePointerCapture(e.pointerId);
        }}
      />
      <div className="text-center">
        <span className="text-glow__orange block text-sm font-bold tabular-nums">{hue}°</span>
        <span className="block text-[0.5rem] uppercase tracking-[0.4em] text-neutral-600">Hue Rotate</span>
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────
   Slider row — pointer-event drag slider
───────────────────────────────────────────── */
interface SliderProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (v: number) => void;
  format?: (v: number) => string;
}

const SliderRow: FunctionComponent<SliderProps> = ({
  label, value, min, max, step, onChange, format = (v) => v.toFixed(2),
}) => {
  const trackRef = useRef<HTMLDivElement>(null);
  const pct = ((value - min) / (max - min)) * 100;

  const compute = useCallback(
    (e: PointerEvent<HTMLDivElement> | globalThis.PointerEvent) => {
      if (!trackRef.current) return;
      const rect = trackRef.current.getBoundingClientRect();
      const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
      const raw = min + ratio * (max - min);
      onChange(parseFloat((Math.round(raw / step) * step).toFixed(4)));
    },
    [min, max, step, onChange],
  );

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-xs uppercase tracking-widest">
        <span className="text-neutral-500">{label}</span>
        <span className="text-glow__orange font-bold tabular-nums">{format(value)}</span>
      </div>

      <div
        ref={trackRef}
        className="relative h-[3px] cursor-pointer select-none"
        onPointerDown={(e) => { e.currentTarget.setPointerCapture(e.pointerId); compute(e); }}
        onPointerMove={(e) => { if (e.buttons > 0) compute(e); }}
        onPointerUp={(e) => e.currentTarget.releasePointerCapture(e.pointerId)}
      >
        <div className="absolute inset-0 bg-orange-900/25" />
        <div className="absolute inset-y-0 left-0 bg-orange-500/45" style={{ width: `${pct}%` }} />
        {/* Diamond thumb */}
        <div
          className="pointer-events-none absolute top-1/2 -translate-x-1/2 -translate-y-1/2"
          style={{ left: `${pct}%` }}
        >
          <div
            className="h-3 w-3 rotate-45 border border-orange-200/50 bg-orange-500"
            style={{ boxShadow: "0 0 5px rgba(249,115,22,0.7), 0 0 10px rgba(249,115,22,0.3)" }}
          />
        </div>
      </div>

      <div className="flex justify-between text-[0.5rem] uppercase tracking-widest text-neutral-700">
        <span>{format(min)}</span>
        <span>{format(max)}</span>
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────
   Settings Modal
───────────────────────────────────────────── */
const SettingsModal: FunctionComponent<Props> = ({ onClose }) => {
  const {
    settings,
    setTheme, setHue, setSaturate, setBrightness, setContrast,
    toggleGreyscale, toggleCrt, reset,
  } = useSettings();

  const backdropRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  return (
    <div
      ref={backdropRef}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
      onClick={(e) => { if (e.target === backdropRef.current) onClose(); }}
    >
      <div className="relative w-full max-w-xl max-h-[90vh] overflow-y-auto border border-orange-900/40 bg-black/90 backdrop-blur">
        <PanelCorners className="z-10" />

        {/* Header — sticky */}
        <div className="sticky top-0 z-10 flex items-center gap-3 border-b border-orange-900/30 bg-black/95 px-5 py-4">
          <i className="icarus-terminal-settings text-glow__orange text-lg" />
          <div className="flex-1">
            <h2 className="text-glow__orange text-sm font-bold uppercase tracking-widest">Interface Settings</h2>
            <p className="text-xs uppercase tracking-wider text-neutral-600">Display & Visual Configuration</p>
          </div>
          <button onClick={onClose} className="text-neutral-600 transition-colors hover:text-orange-400" aria-label="Close">
            <i className="icarus-terminal-exit text-sm" />
          </button>
        </div>

        <div className="space-y-6 px-5 py-5">

          {/* ── Preset themes ── */}
          <section>
            <h3 className="mb-3 text-xs font-bold uppercase tracking-widest text-neutral-500">Colour Preset</h3>
            <div className="grid grid-cols-4 gap-1.5">
              {THEMES.map((theme) => {
                const active = settings.themeId === theme.id;
                const c = theme.preview;
                return (
                  <button
                    key={theme.id}
                    onClick={() => setTheme(theme.id)}
                    title={theme.description}
                    className="flex items-center gap-1.5 border px-2 py-2 text-left transition-all duration-150"
                    style={{
                      borderColor: active ? `${c}70` : "rgba(60,40,20,0.4)",
                      backgroundColor: active ? `${c}12` : "transparent",
                    }}
                  >
                    <span
                      className="h-2.5 w-2.5 flex-shrink-0 rounded-sm"
                      style={{
                        backgroundColor: c,
                        boxShadow: active ? `0 0 5px ${c}` : "none",
                        opacity: active ? 1 : 0.4,
                      }}
                    />
                    <span
                      className="truncate text-[0.6rem] font-bold uppercase tracking-wider"
                      style={{ color: active ? c : "rgb(90,70,50)" }}
                    >
                      {theme.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </section>

          {/* ── Colour tuning ── */}
          <section>
            <h3 className="mb-4 text-xs font-bold uppercase tracking-widest text-neutral-500">Colour Tuning</h3>
            <div className="flex gap-6">
              <div className="flex-shrink-0">
                <HueWheel hue={settings.hue} onChange={setHue} />
              </div>
              <div className="flex flex-1 flex-col justify-center gap-5">
                <SliderRow label="Saturation" value={settings.saturate}   min={0.2} max={2.0} step={0.05} onChange={setSaturate}   />
                <SliderRow label="Brightness" value={settings.brightness} min={0.5} max={1.5} step={0.05} onChange={setBrightness} />
                <SliderRow label="Contrast"   value={settings.contrast}   min={0.7} max={2.0} step={0.05} onChange={setContrast}   />
              </div>
            </div>
          </section>

          {/* ── Display options ── */}
          <section>
            <h3 className="mb-3 text-xs font-bold uppercase tracking-widest text-neutral-500">Display Options</h3>
            <div className="space-y-2">

              <button
                onClick={toggleGreyscale}
                className="flex w-full items-center gap-3 border px-3 py-2.5 text-left transition-all duration-150"
                style={{
                  borderColor: settings.greyscale ? "rgba(180,180,180,0.4)" : "rgba(60,40,20,0.4)",
                  backgroundColor: settings.greyscale ? "rgba(180,180,180,0.06)" : "transparent",
                }}
              >
                <span className="h-1.5 w-1.5 flex-shrink-0 rounded-full" style={{
                  backgroundColor: settings.greyscale ? "rgb(200,200,200)" : "rgb(60,35,15)",
                  boxShadow: settings.greyscale ? "0 0 5px rgb(200,200,200)" : "none",
                }} />
                <i className="icarus-terminal-color-picker flex-shrink-0" style={{ color: settings.greyscale ? "rgb(200,200,200)" : "rgb(80,55,30)" }} />
                <span className="flex-1">
                  <span className="block text-xs font-bold uppercase tracking-widest" style={{ color: settings.greyscale ? "rgb(200,200,200)" : "rgb(100,80,60)" }}>Greyscale</span>
                  <span className="block text-xs uppercase tracking-wider text-neutral-600">Strip all colour from the interface</span>
                </span>
                <span className="text-xs uppercase tracking-widest" style={{ color: settings.greyscale ? "rgb(200,200,200)" : "rgb(60,40,20)" }}>
                  {settings.greyscale ? "ON" : "OFF"}
                </span>
              </button>

              <button
                onClick={toggleCrt}
                className="flex w-full items-center gap-3 border px-3 py-2.5 text-left transition-all duration-150"
                style={{
                  borderColor: settings.crtMode ? "rgba(249,115,22,0.45)" : "rgba(60,40,20,0.4)",
                  backgroundColor: settings.crtMode ? "rgba(249,115,22,0.06)" : "transparent",
                }}
              >
                <span className="h-1.5 w-1.5 flex-shrink-0 rounded-full" style={{
                  backgroundColor: settings.crtMode ? "rgb(249,115,22)" : "rgb(60,35,15)",
                  boxShadow: settings.crtMode ? "0 0 5px rgb(249,115,22)" : "none",
                }} />
                <i className="icarus-terminal-fullscreen-window flex-shrink-0" style={{ color: settings.crtMode ? "rgb(251,146,60)" : "rgb(80,55,30)" }} />
                <span className="flex-1">
                  <span className="block text-xs font-bold uppercase tracking-widest" style={{ color: settings.crtMode ? "rgb(200,130,60)" : "rgb(100,80,60)" }}>CRT Mode</span>
                  <span className="block text-xs uppercase tracking-wider text-neutral-600">Scanlines + vignette overlay</span>
                </span>
                <span className="text-xs uppercase tracking-widest" style={{ color: settings.crtMode ? "rgb(200,130,60)" : "rgb(60,40,20)" }}>
                  {settings.crtMode ? "ON" : "OFF"}
                </span>
              </button>
            </div>
          </section>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-orange-900/20 px-5 py-3">
          <p className="text-[0.55rem] uppercase tracking-widest text-neutral-700">
            Settings persist across sessions ■ ESC to close
          </p>
          <button
            onClick={reset}
            className="flex items-center gap-1.5 border border-orange-900/30 px-3 py-1.5 text-xs uppercase tracking-widest text-neutral-600 transition-all duration-150 hover:border-orange-500/40 hover:text-orange-400"
          >
            <i className="icarus-terminal-sync text-xs" />
            Reset
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;
