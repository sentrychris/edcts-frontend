"use client";

import { type FunctionComponent, type ReactNode, useEffect } from "react";
import { useSettings } from "@/core/contexts/settings-context";

const ThemeWrapper: FunctionComponent<{ children: ReactNode }> = ({ children }) => {
  const { settings } = useSettings();

  useEffect(() => {
    const filters: string[] = [];
    if (settings.hue !== 0)        filters.push(`hue-rotate(${settings.hue}deg)`);
    if (settings.saturate !== 1)   filters.push(`saturate(${settings.saturate})`);
    if (settings.brightness !== 1) filters.push(`brightness(${settings.brightness})`);
    if (settings.contrast !== 1)   filters.push(`contrast(${settings.contrast})`);
    if (settings.greyscale)        filters.push("grayscale(1) brightness(0.85)");
    document.documentElement.style.filter = filters.length > 0 ? filters.join(" ") : "";
  }, [settings.hue, settings.saturate, settings.brightness, settings.contrast, settings.greyscale]);

  return (
    <>
      {children}
      {settings.crtMode && <div className="crt-overlay" aria-hidden="true" />}
    </>
  );
};

export default ThemeWrapper;
