"use client";

import { type FunctionComponent, type ReactNode, useEffect } from "react";
import { useSettings, THEMES } from "@/core/contexts/settings-context";

const ThemeWrapper: FunctionComponent<{ children: ReactNode }> = ({ children }) => {
  const { settings } = useSettings();

  useEffect(() => {
    const root = document.documentElement;
    const theme = THEMES.find((t) => t.id === settings.themeId) ?? THEMES[0];

    const filters: string[] = [];
    if (theme.hue !== 0) filters.push(`hue-rotate(${theme.hue}deg)`);
    if (settings.greyscale) filters.push("grayscale(1) brightness(0.85)");

    root.style.filter = filters.length > 0 ? filters.join(" ") : "";
  }, [settings.themeId, settings.greyscale]);

  return (
    <>
      {children}
      {settings.crtMode && <div className="crt-overlay" aria-hidden="true" />}
    </>
  );
};

export default ThemeWrapper;
