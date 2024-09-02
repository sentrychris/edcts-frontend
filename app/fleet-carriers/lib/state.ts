import type { Schedule } from "@/core/interfaces/Schedule";
import type { Pagination } from "@/core/interfaces/Pagination";
import { pagination } from "@/core/api";
import { systemState } from "../../systems/lib/state";

export const scheduleState: Schedule = {
  id: 0,
  carrier: {
    name: "",
    identifier: "",
    commander: {
      name: "",
    },
    has_refuel: false,
    has_repair: false,
    has_armory: false,
    has_shipyard: false,
    has_outfitting: false,
    has_cartogrpahics: false,
    slug: "",
  },
  departure: systemState,
  destination: systemState,
  title: "",
  description: "",
  departs_at: "",
  arrives_at: "",
  status: {
    cancelled: false,
    boarding: false,
    departed: false,
    departed_at: false,
    arrived: false,
    arrived_at: false,
  },
  slug: "",
};

export const paginatedScheduleState: Pagination<Schedule> = pagination;
