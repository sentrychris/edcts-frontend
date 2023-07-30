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

export interface SystemRing {
  name: string;
  type: string;
  mass: number;
  innerRadius: number;
  outerRadius: number;
}

export interface SystemBody {
  id: number;
  body_id: number;
  name: string;
  type: string;
  sub_type: string;
  discovery: {
    commander: string;
    date: string;
  };
  radius: number;
  atmosphere_type: string;
  is_landable: number;
  rings: SystemRing[];
  parents: Array<Record<string, any>> | null;
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