"use client";

import { type FunctionComponent, type ReactNode, useEffect } from "react";
import GrainOverlay from "@/components/grain-overlay";
import { useSettings } from "@/core/contexts/settings-context";

const ThemeWrapper: FunctionComponent<{ children: ReactNode }> = ({ children }) => {
  const { settings } = useSettings();

  useEffect(() => {
    const filters: string[] = [];
    if (settings.hue !== 0)               filters.push(`hue-rotate(${settings.hue}deg)`);
    if (settings.saturate !== 1)          filters.push(`saturate(${settings.saturate})`);
    if (settings.brightness !== 1)        filters.push(`brightness(${settings.brightness})`);
    if (settings.contrast !== 1)          filters.push(`contrast(${settings.contrast})`);
    if (settings.greyscale)               filters.push("grayscale(1) brightness(0.85)");
    if (settings.chromaticAberration)     filters.push("url(#ca-filter)");
    document.documentElement.style.filter = filters.length > 0 ? filters.join(" ") : "";
  }, [settings.hue, settings.saturate, settings.brightness, settings.contrast, settings.greyscale, settings.chromaticAberration]);

  useEffect(() => {
    document.documentElement.classList.toggle("phosphor-enabled", settings.phosphorAfterglow);
  }, [settings.phosphorAfterglow]);

  useEffect(() => {
    document.documentElement.classList.toggle("typewriter-mode", settings.typewriterMode);
  }, [settings.typewriterMode]);

  useEffect(() => {
    const html = document.documentElement;
    html.classList.remove("density-compact", "density-normal", "density-expanded");
    if (settings.dataDensity !== "normal") html.classList.add(`density-${settings.dataDensity}`);
  }, [settings.dataDensity]);

  return (
    <>
      {children}
      {/* SVG filter definition — always in DOM, display:none */}
      <svg style={{ display: "none" }} aria-hidden="true">
        <defs>
          <filter id="ca-filter" x="-5%" y="-5%" width="110%" height="110%" colorInterpolationFilters="sRGB">
            <feColorMatrix in="SourceGraphic" type="matrix" values="1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0" result="r" />
            <feOffset in="r" dx="-2" dy="0" result="rOff" />
            <feColorMatrix in="SourceGraphic" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 1 0 0  0 0 0 1 0" result="b" />
            <feOffset in="b" dx="2" dy="0" result="bOff" />
            <feColorMatrix in="SourceGraphic" type="matrix" values="0 0 0 0 0  0 1 0 0 0  0 0 0 0 0  0 0 0 1 0" result="g" />
            <feBlend in="rOff" in2="g" mode="screen" result="rg" />
            <feBlend in="rg" in2="bOff" mode="screen" />
          </filter>
        </defs>
      </svg>
      {settings.grainIntensity > 0    && <GrainOverlay intensity={settings.grainIntensity} />}
      {settings.phosphorAfterglow      && <div className="phosphor-overlay" aria-hidden="true" />}
      {settings.vignetteIntensity > 0  && <div className="vignette-overlay" style={{ opacity: settings.vignetteIntensity }} aria-hidden="true" />}
      {settings.crtMode                && <div className="crt-overlay" aria-hidden="true" />}
    </>
  );
};

export default ThemeWrapper;
