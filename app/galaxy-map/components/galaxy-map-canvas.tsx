"use client";

import { useEffect, useRef, useState } from "react";
import { getBoxelDataFromId64 } from "@/core/string-utils";
import { settings } from "@/core/config";

// ── Coordinate offsets to map id64 sector/boxel space to game light-year coordinates (Sol = 0,0,0) ──
const BASE_X = 49985;
const BASE_Y = 40985;
const BASE_Z = 24105;

function id64ToCoords(id64: number): [number, number, number] | null {
  try {
    const { sector, boxel } = getBoxelDataFromId64(id64);
    const half = boxel.size / 2;
    return [
      sector.x * 1280 + boxel.x * boxel.size + half - BASE_X,
      sector.y * 1280 + boxel.y * boxel.size + half - BASE_Y,
      sector.z * 1280 + boxel.z * boxel.size + half - BASE_Z,
    ];
  } catch {
    return null;
  }
}

// ── Matrix helpers (column-major, WebGL convention) ──

function mat4Multiply(a: Float32Array, b: Float32Array): Float32Array {
  const r = new Float32Array(16);
  for (let col = 0; col < 4; col++) {
    for (let row = 0; row < 4; row++) {
      let sum = 0;
      for (let k = 0; k < 4; k++) {
        sum += a[k * 4 + row] * b[col * 4 + k];
      }
      r[col * 4 + row] = sum;
    }
  }
  return r;
}

function mat4Perspective(fovRad: number, aspect: number, near: number, far: number): Float32Array {
  const f = 1 / Math.tan(fovRad / 2);
  const nf = 1 / (near - far);
  // prettier-ignore
  return new Float32Array([
    f / aspect, 0, 0,  0,
    0,          f, 0,  0,
    0, 0, (far + near) * nf, -1,
    0, 0, 2 * far * near * nf, 0,
  ]);
}

function mat4LookAt(
  ex: number, ey: number, ez: number,
  cx: number, cy: number, cz: number,
  ux: number, uy: number, uz: number,
): Float32Array {
  let fx = cx - ex, fy = cy - ey, fz = cz - ez;
  let len = Math.hypot(fx, fy, fz);
  fx /= len; fy /= len; fz /= len;

  let rx = fy * uz - fz * uy;
  let ry = fz * ux - fx * uz;
  let rz = fx * uy - fy * ux;
  len = Math.hypot(rx, ry, rz);
  rx /= len; ry /= len; rz /= len;

  const upx = ry * fz - rz * fy;
  const upy = rz * fx - rx * fz;
  const upz = rx * fy - ry * fx;

  // prettier-ignore
  return new Float32Array([
    rx,  ry,  rz,  0,
    upx, upy, upz, 0,
    -fx, -fy, -fz, 0,
    -(rx * ex + ry * ey + rz * ez),
    -(upx * ex + upy * ey + upz * ez),
    fx * ex + fy * ey + fz * ez,
    1,
  ]);
}

// ── WebGL helpers ──

function compileShader(gl: WebGLRenderingContext, type: number, src: string): WebGLShader {
  const shader = gl.createShader(type)!;
  gl.shaderSource(shader, src);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    throw new Error(`Shader error: ${gl.getShaderInfoLog(shader)}`);
  }
  return shader;
}

function createProgram(gl: WebGLRenderingContext, vertSrc: string, fragSrc: string): WebGLProgram {
  const prog = gl.createProgram()!;
  gl.attachShader(prog, compileShader(gl, gl.VERTEX_SHADER, vertSrc));
  gl.attachShader(prog, compileShader(gl, gl.FRAGMENT_SHADER, fragSrc));
  gl.linkProgram(prog);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
    throw new Error(`Program error: ${gl.getProgramInfoLog(prog)}`);
  }
  return prog;
}

// ── Shaders ──

const VERT_SRC = `
  attribute vec3 a_position;
  attribute vec3 a_color;
  attribute float a_size;
  uniform mat4 u_mvp;
  uniform float u_fixedSize; // > 0 = constant pixel size; <= 0 = depth-scaled
  varying vec3 v_color;

  void main() {
    gl_Position = u_mvp * vec4(a_position, 1.0);
    v_color = a_color;
    if (u_fixedSize > 0.0) {
      gl_PointSize = u_fixedSize;
    } else {
      gl_PointSize = clamp(a_size * (8000.0 / max(gl_Position.w, 1.0)), 0.5, 8.0);
    }
  }
`;

const FRAG_SRC = `
  precision mediump float;
  varying vec3 v_color;

  void main() {
    vec2 coord = gl_PointCoord - vec2(0.5);
    float d = length(coord) * 2.0;
    if (d > 1.0) discard;
    float glow = pow(1.0 - d, 1.8);
    gl_FragColor = vec4(v_color, glow * 0.88);
  }
`;

// ── Star appearance helpers ──

// Spectral class table: [cumulative probability, r, g, b, basePointSize]
const STAR_CLASSES: [number, number, number, number, number][] = [
  [0.01, 0.55, 0.65, 1.00, 4.2], // O — deep blue
  [0.04, 0.68, 0.80, 1.00, 3.6], // B — blue-white
  [0.10, 0.90, 0.94, 1.00, 2.8], // A — white
  [0.18, 1.00, 0.97, 0.82, 2.4], // F — yellow-white
  [0.30, 1.00, 0.88, 0.50, 2.2], // G — yellow (Sol-like)
  [0.52, 1.00, 0.65, 0.25, 2.0], // K — orange
  [1.00, 1.00, 0.38, 0.10, 1.6], // M — red
];

/** Deterministic float hash 0..1 from any number */
function hashFloat(n: number): number {
  const x = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
}

/**
 * Returns [r, g, b, pointSize] for a system star, derived from its id64.
 * Class probabilities mimic the Milky Way's stellar distribution.
 */
function starAppearance(id64: number): [number, number, number, number] {
  const h1 = hashFloat(id64);
  const h2 = hashFloat(id64 * 1.3 + 7.5);   // luminosity variation seed
  const h3 = hashFloat(id64 * 2.7 + 13.1);  // size variation seed
  for (const [thr, r, g, b, sz] of STAR_CLASSES) {
    if (h1 < thr) {
      const lum = 0.55 + h2 * 0.45;         // 0.55–1.0 luminosity
      const sizeVar = 0.8 + h3 * 0.4;       // 0.8–1.2× size jitter
      return [r * lum, g * lum, b * lum, sz * sizeVar];
    }
  }
  return [0.60, 0.20, 0.05, 1.4];
}

// ── Background starfield ──

/** Simple LCG for a deterministic (seed-based) starfield */
function makeLcg(seed: number) {
  let s = seed | 0;
  return () => {
    s = (Math.imul(s, 1664525) + 1013904223) | 0;
    return (s >>> 0) / 0x100000000;
  };
}

function buildStarfield(
  gl: WebGLRenderingContext,
  count: number,
): { posBuffer: WebGLBuffer; colorBuffer: WebGLBuffer; count: number } {
  const rng = makeLcg(42);
  const positions: number[] = [];
  const colors: number[] = [];

  for (let i = 0; i < count; i++) {
    // Uniform on sphere via rejection sampling
    let x: number, y: number, z: number, sq: number;
    do {
      x = rng() * 2 - 1;
      y = rng() * 2 - 1;
      z = rng() * 2 - 1;
      sq = x * x + y * y + z * z;
    } while (sq > 1 || sq === 0);
    const scale = 350000 / Math.sqrt(sq);
    positions.push(x * scale, y * scale, z * scale);

    // Color palette weighted toward white/blue-white
    const t = rng();
    let r: number, g: number, b: number;
    if (t < 0.10)      { r = 0.68; g = 0.80; b = 1.00; } // B — blue-white
    else if (t < 0.30) { r = 0.90; g = 0.94; b = 1.00; } // A — white
    else if (t < 0.62) { r = 1.00; g = 0.97; b = 0.90; } // F — warm white
    else               { r = 1.00; g = 0.85; b = 0.65; } // G/K — yellow-orange

    const lum = 0.25 + rng() * 0.75;                      // brightness 0.25–1.0
    colors.push(r * lum, g * lum, b * lum);
  }

  const posBuffer = gl.createBuffer()!;
  gl.bindBuffer(gl.ARRAY_BUFFER, posBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

  const colorBuffer = gl.createBuffer()!;
  gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);

  return { posBuffer, colorBuffer, count };
}

// ── Component ──

type Status = "loading" | "error" | "ready";

interface GlState {
  gl: WebGLRenderingContext;
  program: WebGLProgram;
  uMvp: WebGLUniformLocation;
  uFixedSize: WebGLUniformLocation;
  aPosition: number;
  aColor: number;
  aSize: number;
  // Galaxy systems
  posBuffer: WebGLBuffer;
  colorBuffer: WebGLBuffer;
  sizeBuffer: WebGLBuffer;
  pointCount: number;
  // Background starfield
  sfPosBuffer: WebGLBuffer;
  sfColorBuffer: WebGLBuffer;
  sfCount: number;
}

export default function GalaxyMapCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const glRef = useRef<GlState | null>(null);
  const rafRef = useRef<number>(0);
  const thetaRef = useRef(0.5);
  const phiRef = useRef(0.45);
  const radiusRef = useRef(85000);
  const targetRef = useRef({ x: 0, y: 0, z: 0 });
  const autoRotateRef = useRef(true);
  const autoRotateTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const dragRef = useRef<{ x: number; y: number; button: number } | null>(null);

  const [status, setStatus] = useState<Status>("loading");
  const [systemCount, setSystemCount] = useState(0);

  // ── WebGL draw ──
  const draw = () => {
    const s = glRef.current;
    const canvas = canvasRef.current;
    if (!s || !canvas) return;

    // Sync canvas resolution to display size
    const dpr = window.devicePixelRatio || 1;
    const w = Math.round(canvas.clientWidth * dpr);
    const h = Math.round(canvas.clientHeight * dpr);
    if (canvas.width !== w || canvas.height !== h) {
      canvas.width = w;
      canvas.height = h;
      s.gl.viewport(0, 0, w, h);
    }

    const { gl } = s;
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    const aspect = w / h;
    const theta = thetaRef.current;
    const phi = phiRef.current;
    const r = radiusRef.current;
    const { x: tx, y: ty, z: tz } = targetRef.current;
    const ex = tx + r * Math.sin(phi) * Math.sin(theta);
    const ey = ty + r * Math.cos(phi);
    const ez = tz + r * Math.sin(phi) * Math.cos(theta);

    const view = mat4LookAt(ex, ey, ez, tx, ty, tz, 0, 1, 0);
    const proj = mat4Perspective(Math.PI / 4, aspect, 100, 600000);
    const mvp = mat4Multiply(proj, view);

    gl.useProgram(s.program);
    gl.uniformMatrix4fv(s.uMvp, false, mvp);

    // Helper — bind a vec3 color buffer to a_color
    const bindColorBuf = (buf: WebGLBuffer) => {
      gl.bindBuffer(gl.ARRAY_BUFFER, buf);
      gl.enableVertexAttribArray(s.aColor);
      gl.vertexAttribPointer(s.aColor, 3, gl.FLOAT, false, 0, 0);
    };

    // ── Pass 1: background starfield — fixed pixel size ──
    gl.uniform1f(s.uFixedSize, 1.4);
    gl.bindBuffer(gl.ARRAY_BUFFER, s.sfPosBuffer);
    gl.enableVertexAttribArray(s.aPosition);
    gl.vertexAttribPointer(s.aPosition, 3, gl.FLOAT, false, 0, 0);
    bindColorBuf(s.sfColorBuffer);
    gl.disableVertexAttribArray(s.aSize);   // unused in fixed-size mode
    gl.vertexAttrib1f(s.aSize, 1.0);
    gl.drawArrays(gl.POINTS, 0, s.sfCount);

    // ── Pass 2: galaxy systems — depth-scaled size ──
    gl.uniform1f(s.uFixedSize, -1.0);
    gl.bindBuffer(gl.ARRAY_BUFFER, s.posBuffer);
    gl.vertexAttribPointer(s.aPosition, 3, gl.FLOAT, false, 0, 0);
    bindColorBuf(s.colorBuffer);
    gl.bindBuffer(gl.ARRAY_BUFFER, s.sizeBuffer);
    gl.enableVertexAttribArray(s.aSize);
    gl.vertexAttribPointer(s.aSize, 1, gl.FLOAT, false, 0, 0);
    gl.drawArrays(gl.POINTS, 0, s.pointCount);
  };

  // ── Render loop ──
  const startLoop = () => {
    const loop = () => {
      if (autoRotateRef.current) {
        thetaRef.current += 0.0003;
      }
      draw();
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);
  };

  // ── Pointer controls ──
  const onPointerDown = (e: React.PointerEvent) => {
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    dragRef.current = { x: e.clientX, y: e.clientY, button: e.button };
    autoRotateRef.current = false;
    if (autoRotateTimerRef.current) clearTimeout(autoRotateTimerRef.current);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragRef.current) return;
    const dx = e.clientX - dragRef.current.x;
    const dy = e.clientY - dragRef.current.y;
    dragRef.current = { x: e.clientX, y: e.clientY, button: dragRef.current.button };

    if (dragRef.current.button === 2) {
      // Right-click drag — pan the camera target in screen space
      const theta = thetaRef.current;
      const phi = phiRef.current;
      const panScale = radiusRef.current * 0.0006;

      // Camera right vector (always horizontal in XZ plane): (cos θ, 0, -sin θ)
      const rightX =  Math.cos(theta);
      const rightZ = -Math.sin(theta);

      // Camera screen-up vector: (-sin θ cos φ, sin φ, -cos θ cos φ)
      const upX = -Math.sin(theta) * Math.cos(phi);
      const upY =  Math.sin(phi);
      const upZ = -Math.cos(theta) * Math.cos(phi);

      targetRef.current.x += (dx * rightX - dy * upX) * panScale;
      targetRef.current.y += (-dy * upY) * panScale;
      targetRef.current.z += (dx * rightZ - dy * upZ) * panScale;
    } else {
      // Left-click drag — orbit
      thetaRef.current -= dx * 0.005;
      phiRef.current = Math.max(0.05, Math.min(Math.PI - 0.05, phiRef.current + dy * 0.005));
    }
  };

  const onPointerUp = () => {
    dragRef.current = null;
    if (autoRotateTimerRef.current) clearTimeout(autoRotateTimerRef.current);
    autoRotateTimerRef.current = setTimeout(() => {
      autoRotateRef.current = true;
    }, 3000);
  };

  const onWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const factor = e.deltaY > 0 ? 1.12 : 0.89;
    radiusRef.current = Math.max(4000, Math.min(200000, radiusRef.current * factor));
    autoRotateRef.current = false;
    if (autoRotateTimerRef.current) clearTimeout(autoRotateTimerRef.current);
    autoRotateTimerRef.current = setTimeout(() => {
      autoRotateRef.current = true;
    }, 3000);
  };

  // ── Initialise WebGL + fetch data ──
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext("webgl");
    if (!gl) {
      setStatus("error");
      return;
    }

    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE);
    gl.clearColor(0, 0, 0, 1);

    let program: WebGLProgram;
    try {
      program = createProgram(gl, VERT_SRC, FRAG_SRC);
    } catch (err) {
      console.error(err);
      setStatus("error");
      return;
    }

    const apiUrl = `${settings.api.url}/system/id64`;

    const starfield = buildStarfield(gl, 3500);

    fetch(apiUrl)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json() as Promise<(number | null)[]>;
      })
      .then((id64s) => {
        const positions: number[] = [];
        const colors: number[] = [];
        const sizes: number[] = [];

        for (const id64 of id64s) {
          if (id64 == null) continue;
          const coords = id64ToCoords(id64);
          if (!coords) continue;
          positions.push(...coords);

          // Sol: bright yellow-white; others: spectral class from id64 hash
          const isSol = Math.abs(coords[0]) < 100 && Math.abs(coords[1]) < 100 && Math.abs(coords[2]) < 100;
          if (isSol) {
            colors.push(1.0, 0.95, 0.75);
            sizes.push(5.0);
          } else {
            const [r, g, b, sz] = starAppearance(id64);
            colors.push(r, g, b);
            sizes.push(sz);
          }
        }

        const pointCount = positions.length / 3;
        setSystemCount(pointCount);

        const posBuffer = gl.createBuffer()!;
        gl.bindBuffer(gl.ARRAY_BUFFER, posBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

        const colorBuffer = gl.createBuffer()!;
        gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);

        const sizeBuffer = gl.createBuffer()!;
        gl.bindBuffer(gl.ARRAY_BUFFER, sizeBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(sizes), gl.STATIC_DRAW);

        glRef.current = {
          gl,
          program,
          uMvp: gl.getUniformLocation(program, "u_mvp")!,
          uFixedSize: gl.getUniformLocation(program, "u_fixedSize")!,
          aPosition: gl.getAttribLocation(program, "a_position"),
          aColor: gl.getAttribLocation(program, "a_color"),
          aSize: gl.getAttribLocation(program, "a_size"),
          posBuffer,
          colorBuffer,
          sizeBuffer,
          pointCount,
          sfPosBuffer: starfield.posBuffer,
          sfColorBuffer: starfield.colorBuffer,
          sfCount: starfield.count,
        };

        setStatus("ready");
        startLoop();
      })
      .catch((err) => {
        console.error("Galaxy map fetch error:", err);
        setStatus("error");
      });

    return () => {
      cancelAnimationFrame(rafRef.current);
      if (autoRotateTimerRef.current) clearTimeout(autoRotateTimerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="relative w-full" style={{ height: "68vh", minHeight: "420px" }}>
      <canvas
        ref={canvasRef}
        className="h-full w-full cursor-grab active:cursor-grabbing"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        onWheel={onWheel}
        onContextMenu={(e) => e.preventDefault()}
      />

      {/* Loading overlay */}
      {status === "loading" && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-black/80">
          <i className="icarus-terminal-star text-glow__orange animate-pulse text-4xl"></i>
          <p className="text-xs uppercase tracking-widest text-neutral-500">
            Plotting stellar coordinates...
          </p>
        </div>
      )}

      {/* Error overlay */}
      {status === "error" && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-black/80">
          <i className="icarus-terminal-system-orbits text-2xl text-red-700"></i>
          <p className="text-xs uppercase tracking-widest text-neutral-600">
            Navigation data unavailable
          </p>
        </div>
      )}

      {/* HUD overlays — only when ready */}
      {status === "ready" && (
        <>
          {/* Bottom-left: system count */}
          <div className="absolute bottom-4 left-4 flex flex-col gap-1 text-xs uppercase tracking-widest text-neutral-600">
            <div className="flex items-center gap-2">
              <span className="fx-dot-orange h-1.5 w-1.5"></span>
              <span>{systemCount.toLocaleString()} systems plotted</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-yellow-200/60"></span>
              <span>Sol (origin)</span>
            </div>
          </div>

          {/* Bottom-right: controls */}
          <div className="absolute bottom-4 right-4 text-right text-xs uppercase tracking-widest text-neutral-700">
            <p>Left drag — orbit · Right drag — pan · Scroll — zoom</p>
          </div>

          {/* Top-right: axis legend */}
          <div className="absolute right-4 top-4 flex flex-col gap-1 text-right text-xs uppercase tracking-widest text-neutral-700">
            <span>X — Galactic East</span>
            <span>Z — Core Direction</span>
            <span>Y — Vertical</span>
          </div>
        </>
      )}
    </div>
  );
}
