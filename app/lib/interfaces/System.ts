

export interface CelestialRing {
  name: string;
  type: string;
  mass: number;
  innerRadius: number;
  outerRadius: number;
}

export interface CelestialBodyParent {
  [key: string]: number;
}

export interface CelestialBody {
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

export interface MappedCelestialBody {
  [key: string]: any;
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
  bodies: CelestialBody[];
  updated_at: string;
  slug: string;
}