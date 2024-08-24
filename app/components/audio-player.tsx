"use client";

import { FunctionComponent, useRef, useState } from "react"

const AudioPlayer: FunctionComponent<{file: string;}> = ({ file }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const togglePlayPause = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }

    setIsPlaying(!isPlaying);
  };

  return (
    <>
      <button
        onClick={togglePlayPause}
        className="ml-4 flex items-center justify-center rounded-full bg-black/60 p-2"
        aria-label={isPlaying ? "Pause" : "Play"}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className={`h-3 w-3 ${isPlaying ? "hidden" : "block"}`}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M5 3l14 9-14 9V3z" />
        </svg>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className={`h-3 w-3 ${isPlaying ? "block" : "hidden"}`}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M6 19h2V5H6zm10-14h2v14h-2z" />
        </svg>
      </button>
      <audio ref={audioRef} className="hidden">
        <source src={file} type="audio/mp3" />
        Your browser does not support the audio element.
      </audio>
    </>
  )
}

export default AudioPlayer;