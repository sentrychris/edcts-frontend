import { Carrier } from "./Carrier";

export interface Schedule {
  carrier: Carrier;
  departure: string;
  destination: string;
  title: string;
  description: string;
  departs_at: string;
  arrives_at?: string;
  status: {
    cancelled: boolean,
    boarding: boolean,
    departed: boolean,
    departed_at: boolean | string,
    arrived: boolean,
    arrived_at: boolean | string
  }
}