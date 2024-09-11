export interface MarketCommodity {
  buyPrice: number;
  demand: number;
  demandBracket: number;
  meanPrice: number;
  sellPrice: number;
  stock: number;
  stockBracket: number;
}

interface Commodities {
  [key: string]: MarketCommodity;
}

export interface MarketData {
  station: string;
  system: string;
  commodities: Commodities;
  prohibited: string[];
  last_updated: string;
}