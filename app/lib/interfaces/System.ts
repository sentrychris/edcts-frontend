import { RawSystemBody } from './SystemBody';
import { Station } from './Station';

export interface System {
  id: number;
  id64: number;
  name: string;
  coords: {
    x: number;
    y: number;
    z: number;
  }
  information: SystemInformation;
  bodies: Array<RawSystemBody>;
  stations: Array<Station>;
  updated_at: string;
  slug: string;
}

export interface SystemInformation {
  allegiance: string;
  government: string;
  population: number;
  security: string;
  economy: string;
  controlling_faction: {
    name: string;
    allegiance: string;
  }
}