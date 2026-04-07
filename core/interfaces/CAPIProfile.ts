export interface CAPIRank {
  combat: number;
  trade: number;
  explore: number;
  crime: number;
  service: number;
  empire: number;
  federation: number;
  power: number;
  cqc: number;
  soldier: number;
  exobiologist: number;
}

export interface CAPICapabilities {
  Horizons: boolean;
  Odyssey: boolean;
}

export interface CAPICommander {
  id: number;
  name: string;
  credits: number;
  currentShipId: number;
  alive: boolean;
  docked: boolean;
  onfoot: boolean;
  rank: CAPIRank;
  capabilities: CAPICapabilities;
}

export interface CAPIShip {
  id: number;
  name: string;
  health: {
    hull: number;
    shield: number;
    shieldup: boolean;
  };
  station?: { name: string };
  starsystem?: { name: string };
}

export interface CAPIShipSummary {
  id: number;
  name: string;
  shipName?: string;
  shipID?: string;
  value?: { total: number };
  starsystem?: { name: string };
  station?: { name: string };
}

export interface CAPISquadron {
  name: string;
  tag: string;
  rank: string;
  joined: string;
}

export interface CAPIProfile {
  commander: CAPICommander;
  ship: CAPIShip;
  lastSystem: { name: string };
  squadron?: CAPISquadron;
  ships: Record<string, CAPIShipSummary>;
}
