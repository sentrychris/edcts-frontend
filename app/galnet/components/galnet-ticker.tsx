"use client";

import { type FunctionComponent, useEffect, useState } from 'react';

interface Props {
  headlines: string[];
  speed?: number; // speed of the ticker in milliseconds
}

const NewsTicker: FunctionComponent<Props> = ({ headlines, speed = 2000 }) => {
  const [currentHeadlineIndex, setCurrentHeadlineIndex] = useState(0);

  useEffect(() => {
    const tickerInterval = setInterval(() => {
      setCurrentHeadlineIndex((prevIndex) => 
        (prevIndex + 1) % headlines.length
      );
    }, speed);

    return () => clearInterval(tickerInterval);
  }, [headlines, speed]);

  return (
    <div className="ticker">
      <div className="ticker-content">
        {headlines[currentHeadlineIndex]}
      </div>
    </div>
  );
};

export default NewsTicker;
