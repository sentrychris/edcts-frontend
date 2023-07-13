import { Carrier } from "./Carrier";

export interface Schedule {
  carrier: Carrier;
  departure: string;
  destination: string;
  title: string;
  description: string;
  departs_at: string;
  departed_at: string | null;
  arrives_at: string | null;
  arrived_at: string | null;
  is_boarding: boolean;
  is_cancelled: boolean;
  has_departed: boolean;
  has_arrived: boolean;
}