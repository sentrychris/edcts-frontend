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
  stations: [],
  updated_at: '',
  slug: ''
};

export const systemBodyState = {
  id: 0,
  body_id: 0,
  name: '',
  type: '',
  sub_type: '',
  disovery: {
    commander: '',
    date: '',
  },
  system: systemState,
  radius: 0,
  gravity: 0,
  earth_masses: 0,
  surface_temp: 0,
  is_landable: 0,
  atmosphere_type: '',
  volcanism_type: '',
  terraforming_state: '',
  axial: {
    axial_tilt: 0,
    semi_major_axis: 0,
    rotational_period: 0,
  },
  orbital: {
    orbital_period: 0,
    orbital_eccentricity: 0,
    orbital_inclination: 0,
    arg_of_periapsis: 0,
  },
  is_tidally_locked: 0,
  rings: {},
  parents: [],
  slug: '',
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