"use client";

import { createContext, useContext, useEffect, useState, type FunctionComponent, type ReactNode } from "react";

export type ThemeId = "commander" | "cartograph" | "viper" | "void" | "combat";

export interface Theme {
  id: ThemeId;
  label: string;
  hue: number; // hue-rotate degrees
  description: string;
}

export const THEMES: Theme[] = [
  { id: "commander", label: "Commander", hue: 0,   description: "Amber — default ED interface" },
  { id: "cartograph", label: "Cartograph", hue: 160, description: "Teal — explorer palette" },
  { id: "viper",     label: "Viper",      hue: 130,  description: "Green — combat visor" },
  { id: "void",      label: "Void",       hue: 260, description: "Purple — deep space" },
  { id: "combat",    label: "Combat",     hue: 338, description: "Red — threat alert" },
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
