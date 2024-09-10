"use client";

import { type FunctionComponent, useEffect, useRef, useState, memo } from "react";
import type { Galnet } from "@/core/interfaces/Galnet";
import { getCurrentEliteDate } from "@/core/string-utils";
import AudioPlayer from "@/components/audio-player";
import Link from "next/link";

interface Props {
  articles: Pick<Galnet, "title" | "slug" | "audio_file" | "uploaded_at">[];
}

const NewsTicker: FunctionComponent<Props> = ({ articles }) => {
  const [currentTime, setCurrentTime] = useState("00:00");

  const [currentArticleIndex, setCurrentArticleIndex] = useState(0);

  const tickerContentRef = useRef<HTMLDivElement>(null);
  const tickerRef = useRef<HTMLDivElement>(null);

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
      setCurrentArticleIndex((prevIndex) => (prevIndex + 1) % articles.length);
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
  }, [currentArticleIndex, articles]);

  const currentDate = getCurrentEliteDate();

  return (
    <div className="relative flex items-center">
      <span className="text-glow__orange border-b-glow__orange ticker-label lg:px-18 z-10 bg-black/60 px-6 text-sm text-xs uppercase md:px-12">
        <span>Galnet</span>
        <span className="ms-2 hidden sm:flex">
          {currentDate} {currentTime} UTC
        </span>
        <AudioPlayer
          files={articles.map((article) => {
            return {
              title: article.title,
              file: article.audio_file,
            };
          })}
        />
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
            href={`/galnet/news/${articles[currentArticleIndex].slug}`}
            className="hover:underline"
          >
            {articles[currentArticleIndex].uploaded_at} - {articles[currentArticleIndex].title}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default memo(NewsTicker);
