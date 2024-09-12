export interface MarketCommodity {
  buyPrice: number;
  demand: number;
  demandBracket: number;
  meanPrice: number;
  name: string;
  sellPrice: number;
  stock: number;
  stockBracket: number;
}

export interface MarketCommodities {
  [key: string]: MarketCommodity;
}

export interface MarketData {
  station: string;
  system: string;
  commodities: MarketCommodities;
  prohibited: string[];
  last_updated: string;
}