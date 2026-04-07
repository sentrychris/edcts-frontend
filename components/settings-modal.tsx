"use client";

import { type FunctionComponent, useEffect, useRef } from "react";
import { useSettings, THEMES } from "@/core/contexts/settings-context";

interface Props {
  onClose: () => void;
}

const SettingsModal: FunctionComponent<Props> = ({ onClose }) => {
  const { settings, setTheme, toggleGreyscale, toggleCrt } = useSettings();
  const backdropRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  return (
    <div
      ref={backdropRef}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === backdropRef.current) onClose();
      }}
    >
      <div className="relative w-full max-w-lg border border-orange-900/40 bg-black/90 backdrop-blur">
        {/* Corner accents */}
        <span className="pointer-events-none absolute -left-px -top-px z-10 h-4 w-4 border-l-2 border-t-2 border-orange-500" />
        <span className="pointer-events-none absolute -right-px -top-px z-10 h-4 w-4 border-r-2 border-t-2 border-orange-500" />
        <span className="pointer-events-none absolute -bottom-px -left-px z-10 h-4 w-4 border-b-2 border-l-2 border-orange-500" />
        <span className="pointer-events-none absolute -bottom-px -right-px z-10 h-4 w-4 border-b-2 border-r-2 border-orange-500" />

        {/* Header */}
        <div className="flex items-center gap-3 border-b border-orange-900/30 px-5 py-4">
          <i className="icarus-terminal-settings text-glow__orange text-lg" />
          <div className="flex-1">
            <h2 className="text-glow__orange text-sm font-bold uppercase tracking-widest">Interface Settings</h2>
            <p className="text-xs uppercase tracking-wider text-neutral-600">Display & Visual Configuration</p>
          </div>
          <button
            onClick={onClose}
            className="text-neutral-600 transition-colors hover:text-orange-400"
            aria-label="Close settings"
          >
            <i className="icarus-terminal-exit text-sm" />
          </button>
        </div>

        <div className="space-y-5 px-5 py-5">
          {/* Theme grid */}
          <section>
            <h3 className="mb-3 text-xs font-bold uppercase tracking-widest text-neutral-500">
              Colour Theme
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {THEMES.map((theme) => {
                const active = settings.themeId === theme.id;
                const c = theme.preview;
                return (
                  <button
                    key={theme.id}
                    onClick={() => setTheme(theme.id)}
                    className="group flex items-center gap-2.5 border px-3 py-2.5 text-left transition-all duration-150"
                    style={{
                      borderColor: active ? `${c}70` : "rgba(60,40,20,0.4)",
                      backgroundColor: active ? `${c}12` : "transparent",
                    }}
                  >
                    {/* Swatch */}
                    <span
                      className="h-3.5 w-3.5 flex-shrink-0 rounded-sm"
                      style={{
                        backgroundColor: c,
                        boxShadow: active ? `0 0 5px ${c}, 0 0 12px ${c}55` : "none",
                        opacity: active ? 1 : 0.4,
                      }}
                    />
                    <span className="min-w-0 flex-1">
                      <span
                        className="block truncate text-xs font-bold uppercase tracking-widest"
                        style={{ color: active ? c : "rgb(100,80,60)" }}
                      >
                        {theme.label}
                      </span>
                      <span className="block truncate text-xs uppercase tracking-wider text-neutral-600">
                        {theme.description}
                      </span>
                    </span>
                    {active && (
                      <span
                        className="h-1.5 w-1.5 flex-shrink-0 rounded-full"
                        style={{ backgroundColor: c, boxShadow: `0 0 5px ${c}` }}
                      />
                    )}
                  </button>
                );
              })}
            </div>
          </section>

          {/* Display toggles */}
          <section>
            <h3 className="mb-3 text-xs font-bold uppercase tracking-widest text-neutral-500">
              Display Options
            </h3>
            <div className="space-y-2">
              {/* Greyscale */}
              <button
                onClick={toggleGreyscale}
                className="flex w-full items-center gap-3 border px-3 py-2.5 text-left transition-all duration-150"
                style={{
                  borderColor: settings.greyscale ? "rgba(180,180,180,0.4)" : "rgba(60,40,20,0.4)",
                  backgroundColor: settings.greyscale ? "rgba(180,180,180,0.06)" : "transparent",
                }}
              >
                <span
                  className="h-1.5 w-1.5 flex-shrink-0 rounded-full transition-all duration-200"
                  style={{
                    backgroundColor: settings.greyscale ? "rgb(200,200,200)" : "rgb(60,35,15)",
                    boxShadow: settings.greyscale ? "0 0 5px rgb(200,200,200), 0 0 10px rgba(200,200,200,0.4)" : "none",
                  }}
                />
                <i
                  className="icarus-terminal-color-picker flex-shrink-0"
                  style={{ color: settings.greyscale ? "rgb(200,200,200)" : "rgb(80,55,30)" }}
                />
                <span className="flex-1">
                  <span
                    className="block text-xs font-bold uppercase tracking-widest"
                    style={{ color: settings.greyscale ? "rgb(200,200,200)" : "rgb(100,80,60)" }}
                  >
                    Greyscale
                  </span>
                  <span className="block text-xs uppercase tracking-wider text-neutral-600">
                    Strip all colour from the interface
                  </span>
                </span>
                <span
                  className="text-xs uppercase tracking-widest"
                  style={{ color: settings.greyscale ? "rgb(200,200,200)" : "rgb(60,40,20)" }}
                >
                  {settings.greyscale ? "ON" : "OFF"}
                </span>
              </button>

              {/* CRT Mode */}
              <button
                onClick={toggleCrt}
                className="flex w-full items-center gap-3 border px-3 py-2.5 text-left transition-all duration-150"
                style={{
                  borderColor: settings.crtMode ? "rgba(249,115,22,0.45)" : "rgba(60,40,20,0.4)",
                  backgroundColor: settings.crtMode ? "rgba(249,115,22,0.06)" : "transparent",
                }}
              >
                <span
                  className="h-1.5 w-1.5 flex-shrink-0 rounded-full transition-all duration-200"
                  style={{
                    backgroundColor: settings.crtMode ? "rgb(249,115,22)" : "rgb(60,35,15)",
                    boxShadow: settings.crtMode ? "0 0 5px rgb(249,115,22), 0 0 10px rgba(249,115,22,0.4)" : "none",
                  }}
                />
                <i
                  className="icarus-terminal-fullscreen-window flex-shrink-0"
                  style={{ color: settings.crtMode ? "rgb(251,146,60)" : "rgb(80,55,30)" }}
                />
                <span className="flex-1">
                  <span
                    className="block text-xs font-bold uppercase tracking-widest"
                    style={{ color: settings.crtMode ? "rgb(200,130,60)" : "rgb(100,80,60)" }}
                  >
                    CRT Mode
                  </span>
                  <span className="block text-xs uppercase tracking-wider text-neutral-600">
                    Scanlines + vignette overlay
                  </span>
                </span>
                <span
                  className="text-xs uppercase tracking-widest"
                  style={{ color: settings.crtMode ? "rgb(200,130,60)" : "rgb(60,40,20)" }}
                >
                  {settings.crtMode ? "ON" : "OFF"}
                </span>
              </button>
            </div>
          </section>
        </div>

        {/* Footer */}
        <div className="border-t border-orange-900/20 px-5 py-3">
          <p className="text-xs uppercase tracking-widest text-neutral-700">
            Settings persist across sessions ■ ESC or click outside to close
          </p>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;
