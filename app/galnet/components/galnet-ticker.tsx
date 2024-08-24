"use client";

import React, { useEffect, useRef, useState } from 'react';

interface NewsTickerProps {
  headlines: string[];
}

const NewsTicker: React.FC<NewsTickerProps> = ({ headlines }) => {
  const [currentHeadlineIndex, setCurrentHeadlineIndex] = useState(0);
  const tickerContentRef = useRef<HTMLDivElement>(null);
  const tickerRef = useRef<HTMLDivElement>(null);

  const updateAnimation = () => {
    const tickerContent = tickerContentRef.current;
    const ticker = tickerRef.current;

    if (!tickerContent || !ticker) return;

    // Reset the transform to start from the right (off-screen)
    tickerContent.style.transition = 'none';
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
      tickerContent.addEventListener('transitionend', handleTransitionEnd);
    }

    return () => {
      if (tickerContent) {
        tickerContent.removeEventListener('transitionend', handleTransitionEnd);
      }
    };
  }, [currentHeadlineIndex, headlines]);

  return (
    <div ref={tickerRef}
      className="flex items-center ticker border-t border-b border-neutral-900 uppercase overflow-hidden whitespace-nowrap">
      <span className="text-glow text-sm border-r border-neutral-900 pe-4">
        Galnet Latest:
      </span>
      <div
        ref={tickerContentRef}
        className="ticker-content text-glow__blue text-sm inline-block whitespace-nowrap"
      >
        {headlines[currentHeadlineIndex]}
      </div>
    </div>
  );
};

export default NewsTicker;
