"use client";

import { type FunctionComponent, useEffect, useRef, useState, memo } from "react";
import type { Galnet } from "@/core/interfaces/Galnet";
import Link from "next/link";

interface Props {
  headlines: Pick<Galnet, "title" | "slug" | "uploaded_at">[];
}

const NewsTicker: FunctionComponent<Props> = ({ headlines }) => {
  const [currentTime, setCurrentTime] = useState("00:00");
  const [isPlaying, setIsPlaying] = useState(false);

  const [currentHeadlineIndex, setCurrentHeadlineIndex] = useState(0);

  const tickerContentRef = useRef<HTMLDivElement>(null);
  const tickerRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const updateClock = () => {
      setCurrentTime(
        new Date().toLocaleTimeString("en-US", {
          timeZone: "UTC",
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        }),
      );
    };

    // Update immediately
    updateClock();

    // Calculate time remaining until the start of the next minute
    const now = new Date();
    const nextMinute = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      now.getHours(),
      now.getMinutes() + 1,
    );
    const timeUntilNextMinute = nextMinute.getTime() - now.getTime();

    // Set timeout to update at the start of the next minute
    const timeoutId = setTimeout(() => {
      updateClock(); // Initial update
      const intervalId = setInterval(updateClock, 60000); // Update every minute

      // Cleanup interval on component unmount
      return () => clearInterval(intervalId);
    }, timeUntilNextMinute);

    // Cleanup timeout on component unmount
    return () => clearTimeout(timeoutId);
  }, []);

  const updateAnimation = () => {
    const tickerContent = tickerContentRef.current;
    const ticker = tickerRef.current;

    if (!tickerContent || !ticker) return;

    // Reset the transform to start from the right (off-screen)
    tickerContent.style.transition = "none";
    tickerContent.style.transform = `translateX(${ticker.offsetWidth}px)`;

    // Trigger a reflow and start the animation
    requestAnimationFrame(() => {
      const distance = tickerContent.offsetWidth + ticker.offsetWidth;
      const duration = distance / 80;
      tickerContent.style.transition = `transform ${duration}s linear`;
      tickerContent.style.transform = `translateX(-${tickerContent.offsetWidth}px)`;
    });
  };

  useEffect(() => {
    updateAnimation();

    const handleTransitionEnd = () => {
      setCurrentHeadlineIndex((prevIndex) => (prevIndex + 1) % headlines.length);
      updateAnimation();
    };

    const tickerContent = tickerContentRef.current;
    if (tickerContent) {
      tickerContent.addEventListener("transitionend", handleTransitionEnd);
    }

    return () => {
      if (tickerContent) {
        tickerContent.removeEventListener("transitionend", handleTransitionEnd);
      }
    };
  }, [currentHeadlineIndex, headlines]);

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
    <div className="flex items-center">
      <span className="text-glow__orange border-b-glow__orange ticker-label bg-black/60 px-4 text-sm text-xs uppercase">
        <span>Galnet</span>
        <span className="ms-2">{currentTime} UTC</span>
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
          <source src="/audio/galnet-1.mp3" type="audio/mp3" />
          Your browser does not support the audio element.
        </audio>
      </span>
      <div
        ref={tickerRef}
        className="ticker flex flex-1 items-center overflow-hidden whitespace-nowrap border-b border-neutral-900 bg-black/60 uppercase"
      >
        <div
          ref={tickerContentRef}
          className="ticker-content text-glow__orange inline-block whitespace-nowrap text-xs font-bold tracking-wide"
        >
          <Link
            href={`/galnet/news/${headlines[currentHeadlineIndex].slug}`}
            className="hover:underline"
          >
            {headlines[currentHeadlineIndex].uploaded_at} - {headlines[currentHeadlineIndex].title}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default memo(NewsTicker);
