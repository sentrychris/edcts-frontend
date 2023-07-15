import { Carrier } from "./Carrier";
import { Pagination } from "./Pagination";

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

export interface GetSchedule {
  (params?: Record<string, any>): Promise<Pagination<Schedule>>
}