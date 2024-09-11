import type { Station } from "@/core/interfaces/Station";

export const stationState: Station = {
  id: 0,
  name: "...",
  type: "...",
  body: null,
  distance_to_arrival: 0,
  controlling_faction: "...",
  allegiance: "...",
  government: "...",
  economy: "...",
  second_economy: "...",
  has_market: false,
  has_shipyard: false,
  has_outfitting: false,
  other_services: [],
  last_updated: {
    information: null,
    market: null,
    shipyard: null,
    outfitting: null,
  },
  slug: "...",
};
