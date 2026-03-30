export interface CartographicalStatistics {
  systems: number;
  bodies: number;
  stars: number;
  orbiting: number;
}

export interface AppStatistics {
  cartographical: CartographicalStatistics;
  commanders: number;
}
