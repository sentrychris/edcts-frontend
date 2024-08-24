"use client";

import { type FunctionComponent, useRef, useState, useEffect } from "react";

const AudioPlayer: FunctionComponent<{ files: string[] }> = ({ files }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
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

  const playNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % files.length);
  };

  const playPrev = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? files.length - 1 : prevIndex - 1));
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.load(); // Reload the new audio source when the track changes
      if (isPlaying) {
        audio.play(); // Start playing the new audio file automatically
      }
    }
  }, [currentIndex]);

  return (
    <>
      <button
        onClick={playPrev}
        className="ml-2 flex items-center justify-center rounded-full bg-black/60 p-2"
        aria-label="Previous"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-3 w-3"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M19 20L9 12l10-8v16zM5 19h4V5H5v14z" />
        </svg>
      </button>
      <button
        onClick={togglePlayPause}
        className="ml-2 flex items-center justify-center rounded-full bg-black/60 p-2"
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
      <button
        onClick={playNext}
        className="ml-2 flex items-center justify-center rounded-full bg-black/60 p-2"
        aria-label="Next"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-3 w-3"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M5 4l10 8-10 8V4zM15 5h4v14h-4z" />
        </svg>
      </button>
      <audio
        ref={audioRef}
        className="hidden"
        onEnded={playNext} // Automatically play next when current ends
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      >
        <source src={files[currentIndex]} type="audio/mp3" />
        Your browser does not support the audio element.
      </audio>
    </>
  );
};

export default AudioPlayer;
