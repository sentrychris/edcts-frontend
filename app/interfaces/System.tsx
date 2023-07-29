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

export interface SystemBody {
  id: number;
  name: string;
  type: string;
  sub_type: string;
  discovery: {
    commander: string;
    date: string;
  }
}

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
  bodies: SystemBody[];
  updated_at: string;
  slug: string;
}