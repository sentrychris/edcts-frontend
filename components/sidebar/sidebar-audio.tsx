"use client";

import { useEffect, useRef, useState } from "react";
import type { Galnet } from "@/core/interfaces/Galnet";
import Link from "next/link";
import PanelCorners from "@/components/panel-corners";

interface Props {
  articles: Pick<Galnet, "title" | "slug" | "audio_file">[];
}

const SidebarAudio = ({ articles }: Props) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  const current = articles[currentIndex];

  const toggle = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
  };

  const playNext = () =>
    setCurrentIndex((prev) => (prev + 1) % articles.length);

  const playPrev = () =>
    setCurrentIndex((prev) => (prev === 0 ? articles.length - 1 : prev - 1));

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.load();
    if (isPlaying) {
      audio.play();
    }
  }, [currentIndex]);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  const elapsed = duration > 0 ? (progress / 100) * duration : 0;

  return (
    <div className="border-t border-orange-900/20 px-4 py-4">
      {/* Section header */}
      <div className="mb-3 flex items-center justify-between border-b border-orange-900/20 pb-3">
        <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-neutral-600">
          <i className="icarus-terminal-sound text-orange-500/50"></i>
          <span>Galnet Broadcast</span>
        </div>
        {isPlaying && (
          <div className="flex items-end gap-px h-3.5">
            <div className="w-0.5 bg-orange-500 rounded-sm fx-eq-bar" style={{ animationDelay: "0s" }}></div>
            <div className="w-0.5 bg-orange-500 rounded-sm fx-eq-bar" style={{ animationDelay: "0.15s" }}></div>
            <div className="w-0.5 bg-orange-500 rounded-sm fx-eq-bar" style={{ animationDelay: "0.3s" }}></div>
            <div className="w-0.5 bg-orange-500 rounded-sm fx-eq-bar" style={{ animationDelay: "0.1s" }}></div>
            <div className="w-0.5 bg-orange-500 rounded-sm fx-eq-bar" style={{ animationDelay: "0.25s" }}></div>
          </div>
        )}
      </div>

      {/* Player panel */}
      <div className="relative border border-orange-900/20 p-3">
        <PanelCorners size="sm" color="border-orange-500/70" />

        {/* Track info */}
        <div className="mb-3 min-h-[2.5rem]">
          {isPlaying ? (
            <div className="flex items-start gap-2">
              <i className="icarus-terminal-sound text-glow__orange mt-0.5 shrink-0 text-xs"></i>
              <Link
                href={`/galnet/news/${current.slug}`}
                className="line-clamp-2 text-xs uppercase leading-4 tracking-wide text-orange-300/80 transition-colors hover:text-orange-300"
              >
                {current.title}
              </Link>
            </div>
          ) : (
            <p className="text-xs uppercase tracking-widest text-neutral-800">Signal Standby</p>
          )}
        </div>

        {/* Progress bar */}
        <div
          className="relative mb-2 h-px cursor-pointer bg-neutral-800"
          onClick={(e) => {
            const audio = audioRef.current;
            if (!audio || !duration) return;
            const rect = e.currentTarget.getBoundingClientRect();
            const ratio = (e.clientX - rect.left) / rect.width;
            audio.currentTime = ratio * duration;
            setProgress(ratio * 100);
          }}
        >
          <div
            className="absolute left-0 top-0 h-full bg-orange-500/80 transition-all"
            style={{ width: `${progress}%` }}
          />
          {isPlaying && (
            <div
              className="absolute top-1/2 h-1.5 w-1.5 -translate-y-1/2 rounded-full bg-orange-400 shadow-[0_0_6px_rgb(251_146_60)]"
              style={{ left: `${progress}%` }}
            />
          )}
        </div>

        {/* Time */}
        <div className="mb-3 flex items-center justify-between text-neutral-700" style={{ fontSize: "0.6rem" }}>
          <span>{formatTime(elapsed)}</span>
          <span className="uppercase tracking-widest">{currentIndex + 1} / {articles.length}</span>
          <span>{formatTime(duration)}</span>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between">
          <button
            onClick={playPrev}
            className="flex h-7 w-7 items-center justify-center text-neutral-600 transition-colors hover:text-neutral-300"
            aria-label="Previous"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" className="h-3.5 w-3.5">
              <path d="M6 6h2v12H6zm3.5 6 8.5 6V6z" />
            </svg>
          </button>

          <button
            onClick={toggle}
            className="flex h-8 w-8 items-center justify-center border border-orange-900/60 text-glow__orange transition-all hover:border-orange-500 hover:bg-orange-900/20"
            aria-label={isPlaying ? "Pause" : "Play"}
          >
            {isPlaying ? (
              <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
                <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
                <path d="M8 5v14l11-7z" />
              </svg>
            )}
          </button>

          <button
            onClick={playNext}
            className="flex h-7 w-7 items-center justify-center text-neutral-600 transition-colors hover:text-neutral-300"
            aria-label="Next"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" className="h-3.5 w-3.5">
              <path d="M6 18l8.5-6L6 6v12zm2-8.14L11.03 12 8 14.14V9.86zM16 6h2v12h-2z" />
            </svg>
          </button>
        </div>
      </div>

      <audio
        ref={audioRef}
        className="hidden"
        onEnded={playNext}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onTimeUpdate={() => {
          const audio = audioRef.current;
          if (audio && audio.duration) {
            setProgress((audio.currentTime / audio.duration) * 100);
          }
        }}
        onLoadedMetadata={() => {
          const audio = audioRef.current;
          if (audio) setDuration(audio.duration);
        }}
      >
        <source src={current.audio_file} type="audio/mp3" />
      </audio>
    </div>
  );
};

export default SidebarAudio;
