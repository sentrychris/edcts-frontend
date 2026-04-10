"use client";

import { type FunctionComponent } from "react";
import { useTypewriter } from "@/core/hooks/use-typewriter";

interface Props {
  text: string;
  /** Milliseconds per character. Defaults to 28ms. */
  charDelay?: number;
  className?: string;
  as?: keyof JSX.IntrinsicElements;
}

/**
 * Renders text character by character when typewriter mode is enabled,
 * or as a plain string when it is off.
 *
 * Usage:
 *   <TypewriterText text="Incoming transmission..." />
 *   <TypewriterText as="h2" text={title} charDelay={40} className="text-glow__orange" />
 */
const TypewriterText: FunctionComponent<Props> = ({
  text,
  charDelay = 28,
  className,
  as: Tag = "span",
}) => {
  const displayed = useTypewriter(text, charDelay);
  return <Tag className={className}>{displayed}</Tag>;
};

export default TypewriterText;
