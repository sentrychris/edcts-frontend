"use client";

import { type FunctionComponent, useEffect, useRef, useState } from "react";
import type { Galnet } from "@/core/interfaces/Galnet";
import { getCollection } from "@/core/api";
import Link from "next/link";

const NewsTicker: FunctionComponent = () => {
  const [currentTime, setCurrentTime] = useState("");
  const [headlines, setHeadlines] = useState<Array<{ title: string; slug: string }>>([
    {
      title: "Loading...",
      slug: "",
    },
  ]);
  const [currentHeadlineIndex, setCurrentHeadlineIndex] = useState(0);

  const tickerContentRef = useRef<HTMLDivElement>(null);
  const tickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    getCollection<Galnet>("galnet/news").then((articles) => {
      const headlines = articles.data.map((article) => {
        return { title: article.title, slug: article.slug };
      });
      setHeadlines(headlines);

      console.log(headlines);
    });
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date().toUTCString().slice(17, 25));
    }, 1000);

    console.log(interval);

    return () => clearInterval(interval);
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

  return (
    <div className="flex items-center">
      <span className="text-glow__orange border-b-glow__orange ticker-label px-4 text-sm text-xs uppercase">
        Galnet <span className="ms-2">{currentTime} UTC</span>
      </span>
      <div
        ref={tickerRef}
        className="ticker border-b-glow__orange flex flex-1 items-center overflow-hidden whitespace-nowrap uppercase"
      >
        <div
          ref={tickerContentRef}
          className="ticker-content text-glow__orange inline-block whitespace-nowrap text-sm font-bold tracking-wide"
        >
          <Link
            href={`/galnet/news/${headlines[currentHeadlineIndex].slug}`}
            className="hover:underline"
          >
            {headlines[currentHeadlineIndex].title}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NewsTicker;
