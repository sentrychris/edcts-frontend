"use client";

import { type FunctionComponent, useEffect, useRef } from "react";

interface Props {
  /** 0–1. Controls overall canvas opacity; the canvas itself is always fully drawn. */
  intensity: number;
}

/** Render at this factor below screen resolution — produces chunkier film-grain
 *  texture and cuts pixel-fill work by SCALE². 2 = ½ res = 4× faster. */
const SCALE = 2;
/** Target frame rate. 24 fps matches cinematic film grain cadence. */
const FPS = 24;
const FRAME_MS = 1000 / FPS;

const GrainOverlay: FunctionComponent<Props> = ({ intensity }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef    = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: true, willReadFrequently: false })!;
    let imageData: ImageData | null = null;
    let lastTime = 0;

    const resize = () => {
      canvas.width  = Math.ceil(window.innerWidth  / SCALE);
      canvas.height = Math.ceil(window.innerHeight / SCALE);
      imageData = ctx.createImageData(canvas.width, canvas.height);
      /* Pre-fill the alpha channel to 255 so we never write it per-frame. */
      for (let i = 3; i < imageData.data.length; i += 4) {
        imageData.data[i] = 255;
      }
    };

    resize();
    window.addEventListener("resize", resize);

    const draw = (timestamp: number) => {
      rafRef.current = requestAnimationFrame(draw);
      if (timestamp - lastTime < FRAME_MS) return;
      lastTime = timestamp;

      if (!imageData) return;
      const { data } = imageData;
      const len = data.length;
      for (let i = 0; i < len; i += 4) {
        const v = (Math.random() * 255) | 0;
        data[i]     = v;
        data[i + 1] = v;
        data[i + 2] = v;
        /* data[i + 3] stays 255 — written once during init */
      }
      ctx.putImageData(imageData, 0, 0);
    };

    rafRef.current = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position:        "fixed",
        inset:           0,
        width:           "100%",
        height:          "100%",
        pointerEvents:   "none",
        zIndex:          9997,
        opacity:         intensity,
        mixBlendMode:    "overlay",
        imageRendering:  "pixelated",
      }}
    />
  );
};

export default GrainOverlay;
