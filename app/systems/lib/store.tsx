import { System } from '../../lib/interfaces/System';
import { Pagination } from '../../lib/interfaces/Pagination';
import { pagination } from '../../lib/api';

export const systemState: System = {
  id: 0,
  id64: 0,
  name: '',
  coords: {
    x: 0,
    y: 0,
    z: 0
  },
  information: {
    allegiance: '',
    government: '',
    population: 0,
    security: '',
    economy: '',
    controlling_faction: {
        name: '',
        allegiance: ''
    }
  },
  bodies: [],
  updated_at: '',
  slug: ''
};


export const statisticsState = {
  data: {
    cartographical: {
        systems: 0,
        bodies: 0,
        stars: 0,
        orbiting: 0
    },
    carriers: 0,
    commanders: 0,
    journeys: {
        total: 0,
        boarding: 0,
        cancelled: 0,
        leaving_in: {
            two_days: 0,
            one_week: 0,
            one_month: 0,
            six_months: 0
        }
    }
  }
};

export const paginatedSystemState: Pagination<System> = pagination;