import { Carrier } from "./Carrier";
import { Pagination } from "./Pagination";

export interface Schedule {
  id: number;
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

export interface GetSchedule {
  (uri: string, params?: Record<string, any>): Promise<Pagination<Schedule>>
}