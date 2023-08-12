import { CelestialBodyType } from '../constants/celestial';
import { MappedStation } from './Station';

export type CelestialBodyParent = {
  [key in CelestialBodyType]?: number;
}

export interface CelestialBody {
  id: number;
  id64: number;
  body_id: number;
  name: string;
  discovered_by: string;
  discovered_at: string;
  type: string;
  sub_type: string;
  distance_to_arrival: number;
  is_main_star: number;
  is_scoopable: number;
  spectral_class: string|null;
  luminosity: number|null;
  solar_masses: number|null;
  solar_radius: number|null;
  absolute_magnitude: number|null;
  surface_temp: number;
  radius: number;
  gravity: number;
  earth_masses: number;
  atmosphere_type: string;
  volcanism_type: string;
  terraforming_state: string;
  is_landable: number;
  orbital_period: number;
  orbital_eccentricity: number;
  orbital_inclination: number;
  arg_of_periapsis: number;
  rotational_period: number;
  is_tidally_locked: number;
  semi_major_axis: number;
  axial_tilt: number;
  rings: Array<CelestialRing>;
  parents: Array<CelestialBodyParent>;
}

export interface CelestialRing {
  name: string;
  type: string;
  mass: number;
  innerRadius: number;
  outerRadius: number;
}

export interface MappedCelestialBody extends Partial<CelestialBody> {
  body_id: number;
  distance_to_arrival: number;
  name: string;
  type: string;
  _type: string;
  _label?: string;
  _description?: string;
  _children?: MappedCelestialBody[];
  _planetary_bases?: MappedStation[];
  _orbits_star?: boolean;
  _small?: boolean;
  _r?: number;
  _x?: number;
  _y?: number;
  _x_offset: number;
  _y_offset: number;
  _x_max: number;
  _y_max: number;
}