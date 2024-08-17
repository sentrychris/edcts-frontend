import type { Carrier } from "./Carrier";
import type { System } from "./System";

export interface Schedule {
  id: number;
  carrier: Carrier;
  departure: System;
  destination: System;
  title: string;
  description: string;
  departs_at: string;
  arrives_at?: string;
  status: {
    cancelled: boolean;
    boarding: boolean;
    departed: boolean;
    departed_at: boolean | string;
    arrived: boolean;
    arrived_at: boolean | string;
  };
  slug: string;
}
