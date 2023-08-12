import { CelestialBodyParent } from "./Celestial";
import { System } from "./System";

interface StationBody {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
}

export interface Station {
  id: number;
  name: string;
  type: string;
  body: StationBody|null;
  system?: System;
  distance_to_arrival: number;
  controlling_faction: string;
  allegiance: string;
  government: string;
  economy: string;
  second_economy: string|null;
  has_market: boolean;
  has_shipyard: boolean;
  has_outfitting: boolean;
  other_services: Array<string>;
  last_updated: {
    information: string|null;
    market: string|null;
    shipyard: string|null;
    outfitting: string|null;
  };
  slug: string;
}

export interface MappedStation extends Partial<Station>
{
  id: number;
  name: string;
  type: string;
  parents: Array<CelestialBodyParent>;
  _other_services: Array<string>;
  _ship_services: Array<string>;
}