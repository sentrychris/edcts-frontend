"use client";

import { useEffect, useState } from "react";
import { useSettings } from "@/core/contexts/settings-context";

/**
 * Returns the given text revealed character by character when typewriter mode
 * is enabled, or the full string immediately when it is off.
 *
 * @param text     - The full string to display.
 * @param charDelay - Milliseconds between each revealed character (default 28ms ≈ fast terminal).
 */
export function useTypewriter(text: string, charDelay = 28): string {
  const { settings } = useSettings();
  const [displayed, setDisplayed] = useState(settings.typewriterMode ? "" : text);

  useEffect(() => {
    if (!settings.typewriterMode) {
      setDisplayed(text);
      return;
    }

    setDisplayed("");
    let index = 0;
    let cancelled = false;

    const tick = () => {
      if (cancelled) return;
      index += 1;
      setDisplayed(text.slice(0, index));
      if (index < text.length) setTimeout(tick, charDelay);
    };

    setTimeout(tick, charDelay);
    return () => { cancelled = true; };
  }, [text, settings.typewriterMode, charDelay]);

  return displayed;
}
