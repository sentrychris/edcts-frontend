import { SystemBodyType } from '../constants/system';
import { MappedStation } from './Station';
import { System } from './System';

export type SystemBodyParent = {
  [key in SystemBodyType]?: number;
}

export interface SystemBodyRing {
  name: string;
  type: string;
  mass: number;
  innerRadius: number;
  outerRadius: number;
}

export interface RawSystemBody {
  id: number;
  id64: number;
  body_id: number;
  name: string;
  system?: System;
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
  rings: Array<SystemBodyRing>;
  parents: Array<SystemBodyParent>;
  slug: string;
}

export interface MappedSystemBody extends Partial<RawSystemBody> {
  body_id: number;
  distance_to_arrival: number;
  name: string;
  type: string;
  _type: string;
  _label?: string;
  _description?: string;
  _r?: number;
  _small?: boolean;
  _orbits_star?: boolean;
  _children?: Array<MappedSystemBody>;
  _planetary_bases?: Array<MappedStation>;
  _timestamp?: string;
  slug: string;
}