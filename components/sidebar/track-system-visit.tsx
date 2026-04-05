"use client";

import { useEffect } from "react";
import { trackSystemVisit } from "@/core/hooks/use-recent-systems";

interface Props {
  name: string;
  slug: string;
}

const TrackSystemVisit = ({ name, slug }: Props) => {
  useEffect(() => {
    trackSystemVisit(name, slug);
  }, [name, slug]);

  return null;
};

export default TrackSystemVisit;
