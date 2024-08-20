import type { System } from "./System";

export interface CartographicalStatistics {
  systems: number;
  bodies: number;
  stars: number;
  orbiting: number;
  latest_system: System;
}

export interface JourneyStatistics {
  total: number;
  boarding: number;
  cancelled: number;
  leaving_in: {
    two_days: number;
    one_week: number;
    one_month: number;
    six_months: number;
  };
}

export interface AppStatistics {
  cartographical: CartographicalStatistics;
  carriers: number;
  commanders: number;
  journeys: JourneyStatistics;
}
