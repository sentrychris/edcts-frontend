

export interface SystemCelestial {
  id64?: any;
  body_id?: any;
  name?: any;
  discovered_by?: any;
  discovered_at?: any;
  type?: any;
  sub_type?: any;
  distance_to_arrival?: any;
  is_main_star?: any;
  is_scoopable?: any;
  spectral_class?: any;
  luminosity?: any;
  solar_masses?: any;
  solar_radius?: any;
  absolute_magnitude?: any;
  surface_temp?: any;
  radius?: any;
  gravity?: any;
  earth_masses?: any;
  atmosphere_type?: any;
  volcanism_type?: any;
  terraforming_state?: any;
  is_landable?: any;
  orbital_period?: any;
  orbital_eccentricity?: any;
  orbital_inclination?: any;
  arg_of_periapsis?: any;
  rotational_period?: any;
  is_tidally_locked?: any;
  semi_major_axis?: any;
  axial_tilt?: any;
  rings?: any;
  parents?: any;
}

export interface MappedSystemCelestial extends SystemCelestial {
  description: string;
  _children: MappedSystemCelestial[];
  [key: string]: string|undefined|null|boolean|number|number[]|MappedSystemCelestial|MappedSystemCelestial[];
}

export interface SystemInformation {
  allegiance: string;
  government: string;
  population: number;
  security: string;
  economy: string;
  controlling_faction: {
    name: string;
    allegiance: string;
  }
}

export interface SystemRing {
  name: string;
  type: string;
  mass: number;
  innerRadius: number;
  outerRadius: number;
}

export interface System {
  id: number;
  id64: number;
  name: string;
  coords: {
    x: number;
    y: number;
    z: number;
  }
  information: SystemInformation;
  bodies: SystemCelestial[];
  updated_at: string;
  slug: string;
}