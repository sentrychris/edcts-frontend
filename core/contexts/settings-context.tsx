"use client";

import { createContext, useContext, useEffect, useState, type FunctionComponent, type ReactNode } from "react";

export type ThemeId =
  | "commander"
  | "cartograph"
  | "viper"
  | "void"
  | "combat"
  | "imperial"
  | "thargoid"
  | "ghost";

export interface Theme {
  id: ThemeId;
  label: string;
  description: string;
  preview: string; // CSS color for UI swatch — approximate result of filters on orange-500
  hue: number;        // hue-rotate degrees
  saturate: number;   // 1 = no change
  brightness: number; // 1 = no change
  contrast: number;   // 1 = no change
}

export const THEMES: Theme[] = [
  {
    id: "commander",
    label: "Commander",
    description: "Amber — default ED interface",
    preview: "rgb(249,115,22)",
    hue: 0, saturate: 1.0, brightness: 1.0, contrast: 1.0,
  },
  {
    id: "cartograph",
    label: "Cartograph",
    description: "Teal — explorer palette",
    preview: "rgb(22,195,190)",
    hue: 160, saturate: 1.15, brightness: 1.0, contrast: 1.0,
  },
  {
    id: "viper",
    label: "Viper",
    description: "Green — combat visor",
    preview: "rgb(40,220,70)",
    hue: 130, saturate: 1.3, brightness: 1.0, contrast: 1.0,
  },
  {
    id: "void",
    label: "Void",
    description: "Purple — deep space",
    preview: "rgb(148,22,245)",
    hue: 260, saturate: 0.85, brightness: 0.9, contrast: 1,
  },
  {
    id: "combat",
    label: "Combat",
    description: "Red — threat alert",
    preview: "rgb(249,22,55)",
    hue: 338, saturate: 1.35, brightness: 1.0, contrast: 1,
  },
  {
    id: "imperial",
    label: "Imperial",
    description: "Blue — Imperial Navy cold",
    preview: "rgb(30,100,245)",
    hue: 220, saturate: 0.75, brightness: 0.95, contrast: 1,
  },
  {
    id: "thargoid",
    label: "Thargoid",
    description: "Bio — alien bioluminescent",
    preview: "rgb(85,245,22)",
    hue: 90, saturate: 1.55, brightness: 0.88, contrast: 1,
  },
  {
    id: "ghost",
    label: "Ghost",
    description: "Mono — surveillance minimal",
    preview: "rgb(125,140,152)",
    hue: 200, saturate: 0.1, brightness: 1.25, contrast: 1,
  },
];

export interface Settings {
  themeId: ThemeId;
  greyscale: boolean;
  crtMode: boolean;
}

interface SettingsContextValue {
  settings: Settings;
  setTheme: (id: ThemeId) => void;
  toggleGreyscale: () => void;
  toggleCrt: () => void;
}

const STORAGE_KEY = "edcts_ui_settings";

const DEFAULT_SETTINGS: Settings = {
  themeId: "commander",
  greyscale: false,
  crtMode: false,
};

const SettingsContext = createContext<SettingsContextValue | null>(null);

export const SettingsProvider: FunctionComponent<{ children: ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setSettings({ ...DEFAULT_SETTINGS, ...JSON.parse(stored) });
      }
    } catch {
      // ignore
    }
  }, []);

  const persist = (next: Settings) => {
    setSettings(next);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      // ignore
    }
  };

  const setTheme = (id: ThemeId) => persist({ ...settings, themeId: id });
  const toggleGreyscale = () => persist({ ...settings, greyscale: !settings.greyscale });
  const toggleCrt = () => persist({ ...settings, crtMode: !settings.crtMode });

  return (
    <SettingsContext.Provider value={{ settings, setTheme, toggleGreyscale, toggleCrt }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = (): SettingsContextValue => {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error("useSettings must be used within SettingsProvider");
  return ctx;
};
