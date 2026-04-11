"use client";

import { createContext, useContext, useEffect, useState, type FunctionComponent, type ReactNode } from "react";

export type DataDensity = "compact" | "normal" | "expanded";

export type ThemeId =
  | "commander"
  | "cartograph"
  | "viper"
  | "void"
  | "combat"
  | "imperial"
  | "thargoid"
  | "ghost"
  | "pioneer";

export interface Theme {
  id: ThemeId;
  label: string;
  description: string;
  preview: string;
  hue: number;
  saturate: number;
  brightness: number;
  contrast: number;
  crtMode?: boolean;
}

export const THEMES: Theme[] = [
  { id: "pioneer",    label: "Pioneer",    description: "Amber — cinematic vintage CRT",   preview: "rgb(249,115,22)",   hue: 0,   saturate: 0.75, brightness: 1.5,  contrast: 0.95, crtMode: true  },
  { id: "commander",  label: "Commander",  description: "Amber — default ED interface",   preview: "rgb(249,115,22)",   hue: 0,   saturate: 1.0,  brightness: 1.0,  contrast: 1.0  },
  { id: "cartograph", label: "Cartograph", description: "Teal — explorer palette",         preview: "rgb(22,195,190)",   hue: 160, saturate: 1.15, brightness: 1.0,  contrast: 1.0  },
  { id: "viper",      label: "Viper",      description: "Green — combat visor",            preview: "rgb(40,220,70)",    hue: 130, saturate: 1.3,  brightness: 1.0,  contrast: 1.0  },
  { id: "void",       label: "Void",       description: "Purple — deep space",             preview: "rgb(148,22,245)",   hue: 260, saturate: 0.85, brightness: 1.2,  contrast: 1.0 },
  { id: "combat",     label: "Combat",     description: "Red — threat alert",              preview: "rgb(249,22,55)",    hue: 338, saturate: 1.35, brightness: 1.0,  contrast: 1.0  },
  { id: "imperial",   label: "Imperial",   description: "Blue — Imperial Navy cold",       preview: "rgb(30,100,245)",   hue: 220, saturate: 0.75, brightness: 0.95, contrast: 1.0  },
  { id: "thargoid",   label: "Thargoid",   description: "Bio — alien bioluminescent",      preview: "rgb(85,245,22)",    hue: 90,  saturate: 1.55, brightness: 0.88, contrast: 1.0  },
  { id: "ghost",      label: "Ghost",      description: "Mono — surveillance minimal",     preview: "rgb(125,140,152)",  hue: 200, saturate: 0.1,  brightness: 1.25, contrast: 1.0  },
];

export interface Settings {
  themeId: ThemeId;
  /** Filter values — set by preset or fine-tuned by sliders */
  hue: number;        // 0–360 (hue-rotate degrees)
  saturate: number;   // 0.2–2.0
  brightness: number; // 0.5–1.5
  contrast: number;   // 0.5–2.0
  greyscale: boolean;
  crtMode: boolean;
  chromaticAberration: boolean;
  phosphorAfterglow: boolean;
  typewriterMode: boolean;
  bootSequence: boolean;
  dataDensity: DataDensity;
  grainIntensity: number;    // 0–1; 0 = disabled
  vignetteIntensity: number; // 0–1; 0 = disabled
}

interface SettingsContextValue {
  settings: Settings;
  setTheme: (id: ThemeId) => void;
  setHue: (v: number) => void;
  setSaturate: (v: number) => void;
  setBrightness: (v: number) => void;
  setContrast: (v: number) => void;
  toggleGreyscale: () => void;
  toggleCrt: () => void;
  toggleChromaticAberration: () => void;
  togglePhosphorAfterglow: () => void;
  toggleTypewriterMode: () => void;
  toggleBootSequence: () => void;
  setDataDensity: (d: DataDensity) => void;
  setGrainIntensity: (v: number) => void;
  setVignetteIntensity: (v: number) => void;
  reset: () => void;
}

const STORAGE_KEY = "edcts_ui_settings";

export const DEFAULT_SETTINGS: Settings = {
  themeId: "pioneer",
  hue: 0,
  saturate: 0.75,
  brightness: 1.5,
  contrast: 0.95,
  greyscale: false,
  crtMode: true,
  chromaticAberration: false,
  phosphorAfterglow: false,
  typewriterMode: false,
  bootSequence: false,
  dataDensity: "normal",
  grainIntensity: 0,
  vignetteIntensity: 0.55,
};

const SettingsContext = createContext<SettingsContextValue | null>(null);

export const SettingsProvider: FunctionComponent<{ children: ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) setSettings({ ...DEFAULT_SETTINGS, ...JSON.parse(stored) });
    } catch { /* ignore */ }
  }, []);

  const persist = (next: Settings) => {
    setSettings(next);
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next)); } catch { /* ignore */ }
  };

  const setTheme = (id: ThemeId) => {
    const t = THEMES.find((th) => th.id === id) ?? THEMES[0];
    persist({
      ...settings,
      themeId: id,
      hue: t.hue,
      saturate: t.saturate,
      brightness: t.brightness,
      contrast: t.contrast,
      ...(t.crtMode !== undefined && { crtMode: t.crtMode }),
    });
  };

  const setHue        = (v: number)  => persist({ ...settings, hue:        Math.round(((v % 360) + 360) % 360) });
  const setSaturate   = (v: number)  => persist({ ...settings, saturate:   v });
  const setBrightness = (v: number)  => persist({ ...settings, brightness: v });
  const setContrast   = (v: number)  => persist({ ...settings, contrast:   v });
  const toggleGreyscale           = () => persist({ ...settings, greyscale:           !settings.greyscale });
  const toggleCrt                 = () => persist({ ...settings, crtMode:              !settings.crtMode });
  const toggleChromaticAberration = () => persist({ ...settings, chromaticAberration: !settings.chromaticAberration });
  const togglePhosphorAfterglow   = () => persist({ ...settings, phosphorAfterglow:   !settings.phosphorAfterglow });
  const toggleTypewriterMode      = () => persist({ ...settings, typewriterMode:      !settings.typewriterMode });
  const toggleBootSequence        = () => persist({ ...settings, bootSequence:        !settings.bootSequence });
  const setDataDensity            = (d: DataDensity) => persist({ ...settings, dataDensity: d });
  const setGrainIntensity         = (v: number)      => persist({ ...settings, grainIntensity:    Math.max(0, Math.min(1, v)) });
  const setVignetteIntensity      = (v: number)      => persist({ ...settings, vignetteIntensity: Math.max(0, Math.min(1, v)) });
  const reset                     = () => persist(DEFAULT_SETTINGS);

  return (
    <SettingsContext.Provider value={{ settings, setTheme, setHue, setSaturate, setBrightness, setContrast, toggleGreyscale, toggleCrt, toggleChromaticAberration, togglePhosphorAfterglow, toggleTypewriterMode, toggleBootSequence, setDataDensity, setGrainIntensity, setVignetteIntensity, reset }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = (): SettingsContextValue => {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error("useSettings must be used within SettingsProvider");
  return ctx;
};
