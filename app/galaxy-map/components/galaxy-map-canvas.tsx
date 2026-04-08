"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { getBoxelDataFromId64 } from "@/core/string-utils";
import { settings } from "@/core/config";

// ── Coordinate offsets — maps id64 sector/boxel space to game light-year coords (Sol = 0,0,0) ──
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
      for (let k = 0; k < 4; k++) sum += a[k * 4 + row] * b[col * 4 + k];
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
    f / aspect, 0, 0, 0,
    0,          f, 0, 0,
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
  let rx = fy * uz - fz * uy, ry = fz * ux - fx * uz, rz = fx * uy - fy * ux;
  len = Math.hypot(rx, ry, rz);
  rx /= len; ry /= len; rz /= len;
  const upx = ry * fz - rz * fy, upy = rz * fx - rx * fz, upz = rx * fy - ry * fx;
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

// ── Shared MVP calculation ──

function buildMvp(
  theta: number, phi: number, radius: number,
  tx: number, ty: number, tz: number,
  aspect: number,
): Float32Array {
  const ex = tx + radius * Math.sin(phi) * Math.sin(theta);
  const ey = ty + radius * Math.cos(phi);
  const ez = tz + radius * Math.sin(phi) * Math.cos(theta);
  return mat4Multiply(
    mat4Perspective(Math.PI / 4, aspect, 100, 600000),
    mat4LookAt(ex, ey, ez, tx, ty, tz, 0, 1, 0),
  );
}

// ── WebGL helpers ──

function compileShader(gl: WebGLRenderingContext, type: number, src: string): WebGLShader {
  const s = gl.createShader(type)!;
  gl.shaderSource(s, src);
  gl.compileShader(s);
  if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s) ?? "");
  return s;
}

function createProgram(gl: WebGLRenderingContext, vert: string, frag: string): WebGLProgram {
  const p = gl.createProgram()!;
  gl.attachShader(p, compileShader(gl, gl.VERTEX_SHADER, vert));
  gl.attachShader(p, compileShader(gl, gl.FRAGMENT_SHADER, frag));
  gl.linkProgram(p);
  if (!gl.getProgramParameter(p, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(p) ?? "");
  return p;
}

// ── Main render shaders ──

const VERT_SRC = `
  attribute vec3 a_position;
  attribute vec3 a_color;
  attribute float a_size;
  uniform mat4 u_mvp;
  uniform float u_fixedSize;
  varying vec3 v_color;
  void main() {
    gl_Position = u_mvp * vec4(a_position, 1.0);
    v_color = a_color;
    gl_PointSize = u_fixedSize > 0.0 ? u_fixedSize
                 : clamp(a_size * (8000.0 / max(gl_Position.w, 1.0)), 0.5, 8.0);
  }
`;

const FRAG_SRC = `
  precision mediump float;
  varying vec3 v_color;
  void main() {
    vec2 c = gl_PointCoord - vec2(0.5);
    float d = length(c) * 2.0;
    if (d > 1.0) discard;
    gl_FragColor = vec4(v_color, pow(1.0 - d, 1.8) * 0.88);
  }
`;

// ── Picking shaders — encodes index+1 as RGB; enlarged min size for easier click targets ──

const PICK_VERT = `
  attribute vec3 a_position;
  attribute vec3 a_pickColor;
  attribute float a_size;
  uniform mat4 u_mvp;
  varying vec3 v_pickColor;
  void main() {
    gl_Position = u_mvp * vec4(a_position, 1.0);
    v_pickColor = a_pickColor;
    float sz = clamp(a_size * (8000.0 / max(gl_Position.w, 1.0)), 0.5, 8.0);
    gl_PointSize = max(sz, 6.0);
  }
`;

const PICK_FRAG = `
  precision mediump float;
  varying vec3 v_pickColor;
  void main() {
    if (length(gl_PointCoord - vec2(0.5)) * 2.0 > 1.0) discard;
    gl_FragColor = vec4(v_pickColor, 1.0);
  }
`;

// ── Galaxy disk shaders — textured flat plane in the XZ galactic plane ──

const DISK_VERT = `
  attribute vec3 a_position;
  attribute vec2 a_uv;
  uniform mat4 u_mvp;
  varying vec2 v_uv;
  void main() {
    gl_Position = u_mvp * vec4(a_position, 1.0);
    v_uv = a_uv;
  }
`;

const DISK_FRAG = `
  precision mediump float;
  uniform sampler2D u_tex;
  varying vec2 v_uv;
  void main() {
    gl_FragColor = texture2D(u_tex, v_uv);
  }
`;

// ── Star appearance helpers ──

// [cumulative probability, r, g, b, baseSize]
const STAR_CLASSES: [number, number, number, number, number][] = [
  [0.01, 0.55, 0.65, 1.00, 4.2], // O — deep blue
  [0.04, 0.68, 0.80, 1.00, 3.6], // B — blue-white
  [0.10, 0.90, 0.94, 1.00, 2.8], // A — white
  [0.18, 1.00, 0.97, 0.82, 2.4], // F — yellow-white
  [0.30, 1.00, 0.88, 0.50, 2.2], // G — yellow
  [0.52, 1.00, 0.65, 0.25, 2.0], // K — orange
  [1.00, 1.00, 0.38, 0.10, 1.6], // M — red
];
const CLASS_NAMES = ["O", "B", "A", "F", "G", "K", "M"];

function hashFloat(n: number): number {
  const x = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
}

function starAppearance(id64: number): [number, number, number, number, string] {
  const h1 = hashFloat(id64), h2 = hashFloat(id64 * 1.3 + 7.5), h3 = hashFloat(id64 * 2.7 + 13.1);
  for (let i = 0; i < STAR_CLASSES.length; i++) {
    const [thr, r, g, b, sz] = STAR_CLASSES[i];
    if (h1 < thr) {
      const lum = 0.55 + h2 * 0.45;
      return [r * lum, g * lum, b * lum, sz * (0.8 + h3 * 0.4), CLASS_NAMES[i]];
    }
  }
  return [0.60, 0.20, 0.05, 1.4, "M"];
}

// ── Background starfield (seeded, deterministic) ──

function makeLcg(seed: number) {
  let s = seed | 0;
  return () => { s = (Math.imul(s, 1664525) + 1013904223) | 0; return (s >>> 0) / 0x100000000; };
}

function buildStarfield(gl: WebGLRenderingContext, count: number) {
  const rng = makeLcg(42);
  const pos: number[] = [], col: number[] = [];
  for (let i = 0; i < count; i++) {
    let x: number, y: number, z: number, sq: number;
    do { x = rng()*2-1; y = rng()*2-1; z = rng()*2-1; sq = x*x+y*y+z*z; } while (sq > 1 || sq === 0);
    const sc = 350000 / Math.sqrt(sq);
    pos.push(x * sc, y * sc, z * sc);
    const t = rng();
    let r: number, g: number, b: number;
    if      (t < 0.10) { r=0.68; g=0.80; b=1.00; }
    else if (t < 0.30) { r=0.90; g=0.94; b=1.00; }
    else if (t < 0.62) { r=1.00; g=0.97; b=0.90; }
    else               { r=1.00; g=0.85; b=0.65; }
    const lum = 0.25 + rng() * 0.75;
    col.push(r * lum, g * lum, b * lum);
  }
  const posBuf = gl.createBuffer()!;
  gl.bindBuffer(gl.ARRAY_BUFFER, posBuf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(pos), gl.STATIC_DRAW);
  const colBuf = gl.createBuffer()!;
  gl.bindBuffer(gl.ARRAY_BUFFER, colBuf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(col), gl.STATIC_DRAW);
  return { posBuf, colBuf, count };
}

// ── Galaxy disk — procedural 2D-canvas texture rendered as a flat XZ plane ──

function makeGalaxyTexture(gl: WebGLRenderingContext): WebGLTexture {
  const SIZE = 1024;
  const off = document.createElement("canvas");
  off.width = off.height = SIZE;
  const ctx = off.getContext("2d")!;
  const cx = SIZE / 2, cy = SIZE / 2;

  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, SIZE, SIZE);

  // Outer stellar halo — faint blue wash
  const halo = ctx.createRadialGradient(cx, cy, SIZE * 0.08, cx, cy, SIZE * 0.5);
  halo.addColorStop(0,    "rgba(70,80,170,0)");
  halo.addColorStop(0.30, "rgba(50,60,145,0.18)");
  halo.addColorStop(0.60, "rgba(30,38,105,0.09)");
  halo.addColorStop(1,    "rgba(0,0,0,0)");
  ctx.fillStyle = halo;
  ctx.fillRect(0, 0, SIZE, SIZE);

  // Spiral arms — two main + two minor, log-spiral, orange→blue-white gradient
  const drawArm = (baseAngle: number, strength: number) => {
    for (let step = 0; step < 500; step++) {
      const t = step / 500;
      const radius = (0.03 + t * 0.46) * SIZE;
      const angle  = baseAngle + t * Math.PI * 2.3;
      const px = cx + Math.cos(angle) * radius;
      const py = cy + Math.sin(angle) * radius;
      if (px < 0 || px > SIZE || py < 0 || py > SIZE) continue;
      const blobR = (0.014 + t * 0.026) * SIZE;
      const alpha = Math.max(0, (0.38 - t * 0.30)) * strength;
      const warm  = Math.pow(Math.max(0, 1 - t * 2.4), 0.65);
      const rr = Math.round(78  + warm * 177);
      const gg = Math.round(98  + warm * 102);
      const g  = ctx.createRadialGradient(px, py, 0, px, py, blobR);
      g.addColorStop(0, `rgba(${rr},${gg},220,${alpha.toFixed(3)})`);
      g.addColorStop(1, `rgba(${rr},${gg},220,0)`);
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(px, py, blobR, 0, Math.PI * 2);
      ctx.fill();
    }
  };

  drawArm(0.4,              0.03); // Sagittarius / Perseus analogue
  drawArm(0.4 + Math.PI,   0.03); // opposite arm
  drawArm(1.85,             0.01); // minor arm
  drawArm(1.85 + Math.PI,  0.01); // minor arm opposite

  // Galactic bar — elongated orange-gold ellipse, tilted
  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(0.52);
  ctx.scale(2.55, 0.58);
  const bar = ctx.createRadialGradient(0, 0, 0, 0, 0, SIZE * 0.138);
  bar.addColorStop(0,    "rgba(255,210,85,0.80)");
  bar.addColorStop(0.35, "rgba(235,148,42,0.48)");
  bar.addColorStop(0.75, "rgba(195,88,18,0.16)");
  bar.addColorStop(1,    "rgba(0,0,0,0)");
  ctx.fillStyle = bar;
  ctx.beginPath();
  ctx.arc(0, 0, SIZE * 0.138, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // Inner bulge — warm orange disk
  // const bulge = ctx.createRadialGradient(cx, cy, 0, cx, cy, SIZE * 0.22);
  // bulge.addColorStop(0,    "rgba(255,232,128,0.92)");
  // bulge.addColorStop(0.10, "rgba(255,168,52,0.78)");
  // bulge.addColorStop(0.26, "rgba(212,108,22,0.42)");
  // bulge.addColorStop(0.52, "rgba(145,68,10,0.16)");
  // bulge.addColorStop(0.80, "rgba(80,38,6,0.05)");
  // bulge.addColorStop(1,    "rgba(0,0,0,0)");
  // ctx.fillStyle = bulge;
  // ctx.fillRect(0, 0, SIZE, SIZE);

  // Bright core point
  // const core = ctx.createRadialGradient(cx, cy, 0, cx, cy, SIZE * 0.052);
  // core.addColorStop(0,    "rgba(255,255,238,1.0)");
  // core.addColorStop(0.22, "rgba(255,246,165,0.92)");
  // core.addColorStop(0.56, "rgba(255,192,68,0.46)");
  // core.addColorStop(1,    "rgba(255,132,14,0)");
  // ctx.fillStyle = core;
  // ctx.fillRect(0, 0, SIZE, SIZE);

  // const tex = gl.createTexture()!;
  // gl.bindTexture(gl.TEXTURE_2D, tex);
  // gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, off);
  // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
  // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  // gl.generateMipmap(gl.TEXTURE_2D);
  // gl.bindTexture(gl.TEXTURE_2D, null);
  // return tex;
}

function buildDisk(gl: WebGLRenderingContext): { posBuf: WebGLBuffer; uvBuf: WebGLBuffer } {
  // Triangle strip: TL(-R,−R), TR(+R,−R), BL(−R,+R), BR(+R,+R) — flat in XZ at Y=−200
  const R = 65000, Y = -200;
  const positions = new Float32Array([-R, Y, -R,  R, Y, -R,  -R, Y, R,  R, Y, R]);
  const uvs       = new Float32Array([ 0, 0,   1, 0,   0, 1,   1, 1]);
  const posBuf = gl.createBuffer()!;
  gl.bindBuffer(gl.ARRAY_BUFFER, posBuf);
  gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);
  const uvBuf = gl.createBuffer()!;
  gl.bindBuffer(gl.ARRAY_BUFFER, uvBuf);
  gl.bufferData(gl.ARRAY_BUFFER, uvs, gl.STATIC_DRAW);
  return { posBuf, uvBuf };
}

// ── Types ──

interface SystemEntry {
  id64: number;
  slug: string;
  name: string;
  x: number;
  y: number;
  z: number;
  starClass: string;
}

interface Hovered {
  name: string;
  cx: number;
  cy: number;
}

interface Selected {
  system: SystemEntry;
  cx: number;
  cy: number;
}

type Status = "loading" | "error" | "ready";

interface GlState {
  gl: WebGLRenderingContext;
  // Main render
  prog: WebGLProgram;
  uMvp: WebGLUniformLocation;
  uFixed: WebGLUniformLocation;
  aPos: number; aColor: number; aSize: number;
  posBuf: WebGLBuffer; colBuf: WebGLBuffer; sizeBuf: WebGLBuffer;
  pointCount: number;
  // Starfield
  sfPos: WebGLBuffer; sfCol: WebGLBuffer; sfCount: number;
  // Picking
  pickProg: WebGLProgram;
  pickUMvp: WebGLUniformLocation;
  pickAPos: number; pickAColor: number; pickASize: number;
  pickColBuf: WebGLBuffer;
  pickFb: WebGLFramebuffer;
  pickTex: WebGLTexture;
  pickW: number; pickH: number;
  // Galaxy disk
  diskProg: WebGLProgram;
  diskUMvp: WebGLUniformLocation;
  diskUTex: WebGLUniformLocation;
  diskAPos: number; diskAUv: number;
  diskPosBuf: WebGLBuffer; diskUvBuf: WebGLBuffer;
  diskTex: WebGLTexture;
}

// ── Component ──

export default function GalaxyMapCanvas() {
  const canvasRef  = useRef<HTMLCanvasElement>(null);
  const glRef      = useRef<GlState | null>(null);
  const rafRef     = useRef<number>(0);
  const thetaRef   = useRef(0.5);
  const phiRef     = useRef(0.45);
  const radiusRef  = useRef(85000);
  const targetRef  = useRef({ x: 0, y: 0, z: 0 });
  const systemsRef = useRef<SystemEntry[]>([]);
  const dragRef    = useRef<{ x: number; y: number; button: number } | null>(null);
  const downRef    = useRef<{ x: number; y: number } | null>(null);
  const autoRef    = useRef(true);
  const pausedRef  = useRef(false);
  const flyRef     = useRef<{ x: number; y: number; z: number; radius: number } | null>(null);
  const autoTimer  = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hoverTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [status,        setStatus]        = useState<Status>("loading");
  const [count,         setCount]         = useState(0);
  const [hovered,       setHovered]       = useState<Hovered | null>(null);
  const [selected,      setSelected]      = useState<Selected | null>(null);
  const [paused,        setPaused]        = useState(false);
  const [searchQuery,   setSearchQuery]   = useState("");
  const [searchResults, setSearchResults] = useState<SystemEntry[]>([]);

  // ── GPU picking — render star indices to offscreen framebuffer, read one pixel ──
  const doPick = (cssX: number, cssY: number): SystemEntry | null => {
    const s = glRef.current;
    const canvas = canvasRef.current;
    if (!s || !canvas) return null;
    const { gl } = s;

    const rect  = canvas.getBoundingClientRect();
    const pickX = Math.round(cssX - rect.left);
    const pickY = Math.round(cssY - rect.top);
    const pickW = Math.round(rect.width);
    const pickH = Math.round(rect.height);

    if (s.pickW !== pickW || s.pickH !== pickH) {
      gl.bindTexture(gl.TEXTURE_2D, s.pickTex);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, pickW, pickH, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
      s.pickW = pickW;
      s.pickH = pickH;
    }

    gl.bindFramebuffer(gl.FRAMEBUFFER, s.pickFb);
    gl.viewport(0, 0, pickW, pickH);
    gl.disable(gl.BLEND);
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    const { x: tx, y: ty, z: tz } = targetRef.current;
    const mvp = buildMvp(thetaRef.current, phiRef.current, radiusRef.current, tx, ty, tz, pickW / pickH);

    gl.useProgram(s.pickProg);
    gl.uniformMatrix4fv(s.pickUMvp, false, mvp);

    gl.bindBuffer(gl.ARRAY_BUFFER, s.posBuf);
    gl.enableVertexAttribArray(s.pickAPos);
    gl.vertexAttribPointer(s.pickAPos, 3, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, s.pickColBuf);
    gl.enableVertexAttribArray(s.pickAColor);
    gl.vertexAttribPointer(s.pickAColor, 3, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, s.sizeBuf);
    gl.enableVertexAttribArray(s.pickASize);
    gl.vertexAttribPointer(s.pickASize, 1, gl.FLOAT, false, 0, 0);

    gl.drawArrays(gl.POINTS, 0, s.pointCount);

    const px = new Uint8Array(4);
    gl.readPixels(pickX, pickH - pickY - 1, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, px);

    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE);
    gl.clearColor(0, 0, 0, 1);

    const idx = px[0] | (px[1] << 8) | (px[2] << 16);
    return idx === 0 ? null : (systemsRef.current[idx - 1] ?? null);
  };

  // ── Draw one frame ──
  const draw = () => {
    const s = glRef.current;
    const canvas = canvasRef.current;
    if (!s || !canvas) return;
    const { gl } = s;

    const dpr = window.devicePixelRatio || 1;
    const w = Math.round(canvas.clientWidth * dpr);
    const h = Math.round(canvas.clientHeight * dpr);
    if (canvas.width !== w || canvas.height !== h) {
      canvas.width = w; canvas.height = h;
      gl.viewport(0, 0, w, h);
    }

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    const { x: tx, y: ty, z: tz } = targetRef.current;
    const mvp = buildMvp(thetaRef.current, phiRef.current, radiusRef.current, tx, ty, tz, w / h);

    // ── Pass 0: galaxy disk — normal alpha blend so it sits behind stars ──
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    gl.useProgram(s.diskProg);
    gl.uniformMatrix4fv(s.diskUMvp, false, mvp);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, s.diskTex);
    gl.uniform1i(s.diskUTex, 0);
    gl.bindBuffer(gl.ARRAY_BUFFER, s.diskPosBuf);
    gl.enableVertexAttribArray(s.diskAPos);
    gl.vertexAttribPointer(s.diskAPos, 3, gl.FLOAT, false, 0, 0);
    gl.bindBuffer(gl.ARRAY_BUFFER, s.diskUvBuf);
    gl.enableVertexAttribArray(s.diskAUv);
    gl.vertexAttribPointer(s.diskAUv, 2, gl.FLOAT, false, 0, 0);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    gl.disableVertexAttribArray(s.diskAPos);
    gl.disableVertexAttribArray(s.diskAUv);

    // ── Passes 1 & 2: stars — additive blend for glow ──
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE);
    gl.useProgram(s.prog);
    gl.uniformMatrix4fv(s.uMvp, false, mvp);

    const bindCol = (buf: WebGLBuffer) => {
      gl.bindBuffer(gl.ARRAY_BUFFER, buf);
      gl.enableVertexAttribArray(s.aColor);
      gl.vertexAttribPointer(s.aColor, 3, gl.FLOAT, false, 0, 0);
    };

    // Pass 1: starfield at fixed pixel size
    gl.uniform1f(s.uFixed, 1.4);
    gl.bindBuffer(gl.ARRAY_BUFFER, s.sfPos);
    gl.enableVertexAttribArray(s.aPos);
    gl.vertexAttribPointer(s.aPos, 3, gl.FLOAT, false, 0, 0);
    bindCol(s.sfCol);
    gl.disableVertexAttribArray(s.aSize);
    gl.vertexAttrib1f(s.aSize, 1.0);
    gl.drawArrays(gl.POINTS, 0, s.sfCount);

    // Pass 2: galaxy systems at depth-scaled size
    gl.uniform1f(s.uFixed, -1.0);
    gl.bindBuffer(gl.ARRAY_BUFFER, s.posBuf);
    gl.vertexAttribPointer(s.aPos, 3, gl.FLOAT, false, 0, 0);
    bindCol(s.colBuf);
    gl.bindBuffer(gl.ARRAY_BUFFER, s.sizeBuf);
    gl.enableVertexAttribArray(s.aSize);
    gl.vertexAttribPointer(s.aSize, 1, gl.FLOAT, false, 0, 0);
    gl.drawArrays(gl.POINTS, 0, s.pointCount);
  };

  const startLoop = () => {
    const loop = () => {
      // Animated fly-to: lerp camera target and zoom
      const fly = flyRef.current;
      if (fly) {
        const speed = 0.09;
        const dx = fly.x - targetRef.current.x;
        const dy = fly.y - targetRef.current.y;
        const dz = fly.z - targetRef.current.z;
        const dr = fly.radius - radiusRef.current;
        targetRef.current.x += dx * speed;
        targetRef.current.y += dy * speed;
        targetRef.current.z += dz * speed;
        radiusRef.current   += dr * speed;
        if (Math.hypot(dx, dy, dz) < 50 && Math.abs(dr) < 100) flyRef.current = null;
      }
      if (autoRef.current) thetaRef.current += 0.0003;
      draw();
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);
  };

  const pauseAutoRotate = () => {
    autoRef.current = false;
    if (autoTimer.current) clearTimeout(autoTimer.current);
    if (!pausedRef.current) {
      autoTimer.current = setTimeout(() => { autoRef.current = true; }, 3000);
    }
  };

  const togglePause = () => {
    const next = !pausedRef.current;
    pausedRef.current = next;
    setPaused(next);
    autoRef.current = !next;
    if (!next && autoTimer.current) {
      clearTimeout(autoTimer.current);
      autoTimer.current = null;
    }
  };

  // Search: scans systemsRef for first 8 name matches (early-exit, fast even at 197k)
  const handleSearch = (q: string) => {
    setSearchQuery(q);
    if (!q.trim()) { setSearchResults([]); return; }
    const lower = q.toLowerCase();
    const results: SystemEntry[] = [];
    for (const sys of systemsRef.current) {
      if (sys.name.toLowerCase().includes(lower)) {
        results.push(sys);
        if (results.length >= 8) break;
      }
    }
    setSearchResults(results);
  };

  const flyToSystem = (sys: SystemEntry) => {
    flyRef.current = { x: sys.x, y: sys.y, z: sys.z, radius: 4000 };
    setSearchQuery("");
    setSearchResults([]);
    setSelected({ system: sys, cx: 0, cy: 0 });
    // Pause auto-rotate while the user explores the selected system
    pausedRef.current = true;
    setPaused(true);
    autoRef.current = false;
  };

  // ── Pointer controls ──
  const onPointerDown = (e: React.PointerEvent) => {
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    dragRef.current = { x: e.clientX, y: e.clientY, button: e.button };
    downRef.current = { x: e.clientX, y: e.clientY };
    setHovered(null);
    pauseAutoRotate();
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (dragRef.current) {
      const dx = e.clientX - dragRef.current.x;
      const dy = e.clientY - dragRef.current.y;
      dragRef.current = { x: e.clientX, y: e.clientY, button: dragRef.current.button };
      if (dragRef.current.button === 2) {
        // Right-drag: pan camera
        const theta = thetaRef.current, phi = phiRef.current, panScale = radiusRef.current * 0.0006;
        targetRef.current.x += (dx *  Math.cos(theta) - dy * -Math.sin(theta) * Math.cos(phi)) * panScale;
        targetRef.current.y += (-dy * Math.sin(phi)) * panScale;
        targetRef.current.z += (dx * -Math.sin(theta) - dy * -Math.cos(theta) * Math.cos(phi)) * panScale;
      } else {
        // Left-drag: orbit
        thetaRef.current -= dx * 0.005;
        phiRef.current = Math.max(0.05, Math.min(Math.PI - 0.05, phiRef.current + dy * 0.005));
      }
    } else {
      // Hover pick — debounced 80 ms
      const cx = e.clientX, cy = e.clientY;
      if (hoverTimer.current) clearTimeout(hoverTimer.current);
      hoverTimer.current = setTimeout(() => {
        const sys = doPick(cx, cy);
        if (sys) {
          const rect = canvasRef.current?.getBoundingClientRect();
          if (rect) setHovered({ name: sys.name, cx: cx - rect.left, cy: cy - rect.top });
        } else {
          setHovered(null);
        }
      }, 80);
    }
  };

  const onPointerUp = (e: React.PointerEvent) => {
    const down = downRef.current;
    if (down && Math.hypot(e.clientX - down.x, e.clientY - down.y) < 4 && dragRef.current?.button !== 2) {
      const sys = doPick(e.clientX, e.clientY);
      const rect = canvasRef.current?.getBoundingClientRect();
      if (sys && rect) {
        setSelected({ system: sys, cx: e.clientX - rect.left, cy: e.clientY - rect.top });
      } else {
        setSelected(null);
      }
    }
    dragRef.current = null;
    downRef.current = null;
    pauseAutoRotate();
  };

  const onWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    radiusRef.current = Math.max(4000, Math.min(200000, radiusRef.current * (e.deltaY > 0 ? 1.12 : 0.89)));
    pauseAutoRotate();
  };

  // ── Init WebGL ──
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext("webgl", { alpha: false });
    if (!gl) { setStatus("error"); return; }

    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE);
    gl.clearColor(0, 0, 0, 1);

    let prog: WebGLProgram, pickProg: WebGLProgram, diskProg: WebGLProgram;
    try {
      prog     = createProgram(gl, VERT_SRC, FRAG_SRC);
      pickProg = createProgram(gl, PICK_VERT, PICK_FRAG);
      diskProg = createProgram(gl, DISK_VERT, DISK_FRAG);
    } catch (err) {
      console.error(err);
      setStatus("error");
      return;
    }

    // Picking framebuffer (starts 1×1, resized lazily in doPick)
    const pickTex = gl.createTexture()!;
    gl.bindTexture(gl.TEXTURE_2D, pickTex);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    const pickFb = gl.createFramebuffer()!;
    gl.bindFramebuffer(gl.FRAMEBUFFER, pickFb);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, pickTex, 0);
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);

    const sf      = buildStarfield(gl, 3500);
    const diskTex = makeGalaxyTexture(gl);
    const disk    = buildDisk(gl);

    fetch(`${settings.api.url}/system/id64`)
      .then((r) => { if (!r.ok) throw new Error(`HTTP ${r.status}`); return r.json() as Promise<Record<string, number>>; })
      .then((data) => {
        const entries = Object.entries(data);
        const systems: SystemEntry[] = [];
        const positions:  number[] = [];
        const colors:     number[] = [];
        const sizes:      number[] = [];
        const pickColors: number[] = [];

        let idx = 0;
        for (const [key, id64] of entries) {
          if (!id64) continue;
          const coords = id64ToCoords(id64);
          if (!coords) continue;

          // Key format: "{id64}-{slug}" — first hyphen separates the id64 number from slug
          const slug = key.slice(key.indexOf("-") + 1);
          const name = slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
          const isSol = Math.abs(coords[0]) < 100 && Math.abs(coords[1]) < 100 && Math.abs(coords[2]) < 100;

          const [r, g, b, sz, cls] = isSol ? [1.0, 0.95, 0.75, 5.0, "G"] : starAppearance(id64);

          systems.push({ id64, slug, name, x: coords[0], y: coords[1], z: coords[2], starClass: isSol ? "G" : cls });
          positions.push(...coords);
          colors.push(r, g, b);
          sizes.push(sz);

          // Encode 1-based index as RGB (supports up to ~16 M systems)
          const id = idx + 1;
          pickColors.push((id & 0xff) / 255, ((id >> 8) & 0xff) / 255, ((id >> 16) & 0xff) / 255);
          idx++;
        }

        systemsRef.current = systems;
        setCount(systems.length);

        const upload = (data: number[]) => {
          const buf = gl.createBuffer()!;
          gl.bindBuffer(gl.ARRAY_BUFFER, buf);
          gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), gl.STATIC_DRAW);
          return buf;
        };

        const posBuf     = upload(positions);
        const colBuf     = upload(colors);
        const sizeBuf    = upload(sizes);
        const pickColBuf = upload(pickColors);

        glRef.current = {
          gl, prog,
          uMvp:   gl.getUniformLocation(prog, "u_mvp")!,
          uFixed: gl.getUniformLocation(prog, "u_fixedSize")!,
          aPos:   gl.getAttribLocation(prog, "a_position"),
          aColor: gl.getAttribLocation(prog, "a_color"),
          aSize:  gl.getAttribLocation(prog, "a_size"),
          posBuf, colBuf, sizeBuf, pointCount: systems.length,
          sfPos: sf.posBuf, sfCol: sf.colBuf, sfCount: sf.count,
          pickProg,
          pickUMvp:   gl.getUniformLocation(pickProg, "u_mvp")!,
          pickAPos:   gl.getAttribLocation(pickProg, "a_position"),
          pickAColor: gl.getAttribLocation(pickProg, "a_pickColor"),
          pickASize:  gl.getAttribLocation(pickProg, "a_size"),
          pickColBuf, pickFb, pickTex, pickW: 0, pickH: 0,
          diskProg,
          diskUMvp: gl.getUniformLocation(diskProg, "u_mvp")!,
          diskUTex: gl.getUniformLocation(diskProg, "u_tex")!,
          diskAPos: gl.getAttribLocation(diskProg, "a_position"),
          diskAUv:  gl.getAttribLocation(diskProg, "a_uv"),
          diskPosBuf: disk.posBuf, diskUvBuf: disk.uvBuf, diskTex,
        };

        setStatus("ready");
        startLoop();
      })
      .catch((err) => { console.error(err); setStatus("error"); });

    return () => {
      cancelAnimationFrame(rafRef.current);
      if (autoTimer.current)  clearTimeout(autoTimer.current);
      if (hoverTimer.current) clearTimeout(hoverTimer.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Tooltip: edge-clamp so it stays inside the canvas ──
  const tooltipStyle = (cx: number, cy: number): React.CSSProperties => {
    const OFFSET = 14, W = 180, H = 32;
    let left = cx + OFFSET;
    let top  = cy - H / 2;
    if (left + W > (canvasRef.current?.clientWidth ?? 9999)) left = cx - W - OFFSET;
    if (top < 0) top = 4;
    return { left, top };
  };

  const isOver = hovered && !dragRef.current;

  return (
    <div className="relative w-full select-none" style={{ height: "68vh", minHeight: "420px" }}>
      <canvas
        ref={canvasRef}
        className={`h-full w-full ${isOver ? "cursor-crosshair" : "cursor-grab active:cursor-grabbing"}`}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        onWheel={onWheel}
        onContextMenu={(e) => e.preventDefault()}
      />

      {/* ── Hover tooltip ── */}
      {isOver && (
        <div
          className="pointer-events-none absolute z-10 border border-orange-900/40 bg-black/80 px-2 py-1 text-xs uppercase tracking-widest text-orange-400 backdrop-blur"
          style={tooltipStyle(hovered.cx, hovered.cy)}
        >
          {hovered.name}
        </div>
      )}

      {/* ── Selected system panel ── */}
      {selected && (
        <div className="absolute bottom-16 left-4 z-20 w-60 border border-orange-900/40 bg-black/95 backdrop-blur">
          <span className="absolute left-0 top-0 h-2.5 w-2.5 border-l border-t border-orange-500/50" />
          <span className="absolute right-0 top-0 h-2.5 w-2.5 border-r border-t border-orange-500/50" />
          <span className="absolute bottom-0 left-0 h-2.5 w-2.5 border-b border-l border-orange-500/50" />
          <span className="absolute bottom-0 right-0 h-2.5 w-2.5 border-b border-r border-orange-500/50" />
          <div className="p-4">
            <div className="mb-1 flex items-center justify-between">
              <span className="text-xs uppercase tracking-widest text-neutral-600">System Identified</span>
              <button
                onClick={() => setSelected(null)}
                className="text-neutral-700 transition-colors hover:text-orange-400"
                aria-label="Close"
              >
                ✕
              </button>
            </div>
            <p className="text-glow__orange mb-3 font-bold uppercase tracking-wide">
              {selected.system.name}
            </p>
            <div className="mb-3 grid grid-cols-3 gap-1 text-xs uppercase tracking-widest text-neutral-600">
              <span>X {Math.round(selected.system.x)}</span>
              <span>Y {Math.round(selected.system.y)}</span>
              <span>Z {Math.round(selected.system.z)}</span>
            </div>
            <div className="mb-3 flex items-center gap-2 text-xs uppercase tracking-widest text-neutral-600">
              <span>Class</span>
              <span className="text-orange-400">{selected.system.starClass}</span>
            </div>
            <Link
              href={`/systems/${selected.system.slug}`}
              className="block border border-orange-900/40 px-3 py-1.5 text-center text-xs uppercase tracking-widest text-neutral-400 transition-colors hover:border-orange-500/60 hover:text-orange-400"
            >
              View System Data →
            </Link>
          </div>
        </div>
      )}

      {/* ── Loading / error overlays ── */}
      {status === "loading" && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-black/80">
          <i className="icarus-terminal-star text-glow__orange animate-pulse text-4xl" />
          <p className="text-xs uppercase tracking-widest text-neutral-500">Plotting stellar coordinates...</p>
        </div>
      )}
      {status === "error" && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-black/80">
          <i className="icarus-terminal-system-orbits text-2xl text-red-700" />
          <p className="text-xs uppercase tracking-widest text-neutral-600">Navigation data unavailable</p>
        </div>
      )}

      {/* ── HUD (shown once data is loaded) ── */}
      {status === "ready" && (
        <>
          {/* Top-left: system search */}
          <div className="absolute left-4 top-4 z-10 w-56">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Search system..."
              className="w-full border border-orange-900/40 bg-black/80 px-3 py-1.5 text-xs uppercase tracking-widest text-orange-300 placeholder-neutral-700 backdrop-blur focus:border-orange-500/60 focus:outline-none"
            />
            {searchResults.length > 0 && (
              <div className="absolute top-full mt-0.5 w-full border border-orange-900/40 bg-black/95 backdrop-blur">
                {searchResults.map((sys) => (
                  <button
                    key={sys.id64}
                    onClick={() => flyToSystem(sys)}
                    className="block w-full px-3 py-2 text-left text-xs uppercase tracking-widest text-neutral-400 transition-colors hover:bg-orange-900/20 hover:text-orange-300"
                  >
                    {sys.name}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Top-right: axis labels */}
          <div className="absolute right-4 top-4 flex flex-col gap-1 text-right text-xs uppercase tracking-widest text-neutral-700">
            <span>X — Galactic East</span>
            <span>Z — Core Direction</span>
            <span>Y — Vertical</span>
          </div>

          {/* Bottom-left: counts + legend */}
          <div className="absolute bottom-4 left-4 flex flex-col gap-1 text-xs uppercase tracking-widest text-neutral-600">
            <div className="flex items-center gap-2">
              <span className="fx-dot-orange h-1.5 w-1.5" />
              <span>{count.toLocaleString()} systems plotted</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-yellow-200/60" />
              <span>Sol (origin)</span>
            </div>
          </div>

          {/* Bottom-right: controls hint + pause button */}
          <div className="absolute bottom-4 right-4 flex items-center gap-3">
            <span className="hidden text-xs uppercase tracking-widest text-neutral-700 sm:inline">
              Left drag — orbit · Right drag — pan · Scroll — zoom
            </span>
            <button
              onClick={togglePause}
              className={`border px-2.5 py-1 text-xs uppercase tracking-widest transition-colors ${
                paused
                  ? "border-orange-500/60 text-orange-400 hover:border-orange-400"
                  : "border-neutral-800 text-neutral-600 hover:border-neutral-600 hover:text-neutral-400"
              }`}
            >
              {paused ? "▶ Resume" : "⏸ Pause"}
            </button>
          </div>
        </>
      )}
    </div>
  );
}
